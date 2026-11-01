/* ============================================================================
 * lib/admission-pdf.ts
 * Programmatic PDF generator for student admission applications.
 *
 * Uses jsPDF to build a professional multi-page report. Every uploaded
 * document is placed on its own A4 page, enlarged to fill the maximum
 * printable area (aspect ratio preserved, never cropped or distorted),
 * rendered at ~200 DPI on a high-quality canvas, and sharpened with an
 * adaptive unsharp mask so low-resolution sources look as crisp as possible.
 *
 * ── Image-quality guarantees ──────────────────────────────────────────────
 *  • jsPDF is created with `compress: false` so it does NOT re-compress the
 *    PDF stream (a common cause of blurry embedded images).
 *  • `hotfixes: ["px_scaling"]` corrects jsPDF's pixel→mm scaling so large
 *    images are not silently downscaled at insertion time.
 *  • `addImage(..., "NONE")` disables per-image re-compression.
 *  • Images are re-rendered on a canvas at ~200 DPI for the final physical
 *    draw size, then sharpened. Upscaled images get stronger sharpening;
 *    downscaled images get lighter sharpening. Text-like documents (NID,
 *    certificate scans) get reduced sharpening to avoid edge halos.
 *  • JPEG is exported at quality 0.95; PNG is exported lossless.
 *
 * ── NOTE ON THE BACKEND PROXY ─────────────────────────────────────────────
 *  This file can only preserve whatever /api/proxy/image returns. If the
 *  proxy downscales the image, the PDF will still be blurry — no frontend
 *  code can restore missing pixels. The proxy MUST pass through the
 *  original full-resolution file (and the stored URL must be the ImgBB
 *  "direct link", not a thumbnail or viewer URL).
 * ========================================================================== */

export type AdmissionForPDF = {
  _id: string;
  studentName: string;
  fatherName: string;
  motherName: string;
  birthDate: string;
  bloodGroup: string;
  classApplyingFor: string;
  previousClass: string;
  phone: string;
  email: string;
  currentAddress: string;
  permanentAddress: string;
  birthCertificateImage?: string;
  previousSchoolCertificateImage?: string;
  passportPhotosImage?: string;
  parentNidImage?: string;
  status: string;
  createdAt?: string;
  updatedAt?: string;
};

const LOGO_URL = "https://i.ibb.co.com/7NzsPGvc/logo.jpg";

const A4_WIDTH_MM = 210;
const A4_HEIGHT_MM = 297;
const REPORT_MARGIN_MM = 15;
const DOCUMENT_PAGE_MARGIN_MM = 8;
const DOCUMENT_HEADER_HEIGHT_MM = 24;
const DOCUMENT_FOOTER_RESERVE_MM = 18;

/** Target resolution when rendering images for the PDF. */
const TARGET_DPI = 200;
const PX_PER_MM = TARGET_DPI / 25.4;

/** JPEG quality used when re-encoding. */
const JPEG_QUALITY = 0.95;

type PdfImageFormat = "JPEG" | "PNG";

type PreparedImage = {
  data: string;
  format: PdfImageFormat;
};

/* ============================================================================
 * HELPERS
 * ========================================================================== */

function formatDate(value?: string): string {
  if (!value) return "—";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

/**
 * Fetch an image through the backend image proxy and convert it to a data URL.
 * The proxy is expected to return the ORIGINAL full-resolution bytes.
 */
async function urlToBase64(
  url?: string,
  timeoutMs = 20_000
): Promise<string | null> {
  if (!url) return null;

  const apiBase = (
    process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"
  ).replace(/\/+$/, "");

  const proxyUrl = `${apiBase}/api/proxy/image?url=${encodeURIComponent(url)}`;
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const response = await fetch(proxyUrl, {
      method: "GET",
      headers: { Accept: "image/*" },
      signal: controller.signal,
    });

    if (!response.ok) {
      console.error(
        `Image proxy failed (${response.status}) for document URL:`,
        url
      );
      return null;
    }

    const blob = await response.blob();
    if (!blob.type.startsWith("image/")) {
      console.error("Image proxy returned a non-image response:", blob.type);
      return null;
    }

    return await new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        if (typeof reader.result === "string") resolve(reader.result);
        else reject(new Error("Could not convert image to a data URL"));
      };
      reader.onerror = () =>
        reject(reader.error || new Error("Failed to read image data"));
      reader.readAsDataURL(blob);
    });
  } catch (error) {
    console.error("Image download failed:", error);
    return null;
  } finally {
    clearTimeout(timer);
  }
}

function getImageDimensions(
  src: string
): Promise<{ width: number; height: number }> {
  return new Promise((resolve, reject) => {
    const image = new Image();
    image.onload = () => {
      if (!image.naturalWidth || !image.naturalHeight) {
        reject(new Error("Image has invalid dimensions"));
        return;
      }
      resolve({ width: image.naturalWidth, height: image.naturalHeight });
    };
    image.onerror = () =>
      reject(new Error("Unable to read image dimensions"));
    image.src = src;
  });
}

/**
 * Determine the original format from the data-URL prefix.
 * Only JPEG and PNG are preserved; anything else (WebP, GIF…) is
 * re-encoded through the canvas pipeline below, so returning "JPEG" for
 * unknown formats here is safe.
 */
function getOriginalFormat(base64: string): PdfImageFormat {
  const normalized = base64.slice(0, 80).toLowerCase();
  if (normalized.includes("image/jpeg") || normalized.includes("image/jpg")) {
    return "JPEG";
  }
  if (normalized.includes("image/png")) {
    return "PNG";
  }
  return "JPEG";
}

/**
 * Adaptive unsharp mask.
 *
 * Strength is chosen from two signals:
 *   1. upscaleRatio  — how much the image is being enlarged.
 *        ≤ 0.25  → heavy downscale, already crisp, minimal sharpening.
 *        ≤ 1.0   → mild downscale / same size, light sharpening.
 *        < 2.0   → mild upscale, moderate sharpening.
 *        ≥ 2.0   → heavy upscale, strong sharpening.
 *   2. Content heuristics — if a large fraction of pixels are near-black or
 *      near-white, the image is treated as a text document (NID, certificate,
 *      birth-certificate scan). Sharpening strength is halved so black text
 *      does not develop ringing / halo artefacts.
 *
 * The unsharp mask formula is: sharpened = original + amount * (original - blurred)
 */
function applyAdaptiveUnsharpMask(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  upscaleRatio: number
): void {
  const imageData = ctx.getImageData(0, 0, width, height);
  const data = imageData.data;

  // 1) Base strength from how much we're upscaling.
  let amount: number;
  if (upscaleRatio <= 0.25) {
    amount = 0.25;
  } else if (upscaleRatio <= 1) {
    amount = 0.55;
  } else if (upscaleRatio < 2) {
    amount = 0.9;
  } else {
    amount = 1.25;
  }

  // 2) Content heuristic — sample ~5000 pixels.
  const pixelCount = width * height;
  const stride = 4 * Math.max(1, Math.floor(pixelCount / 5000));
  let nearBinary = 0;
  let sampled = 0;
  for (let i = 0; i < data.length; i += stride) {
    const lum = 0.299 * data[i] + 0.587 * data[i + 1] + 0.114 * data[i + 2];
    if (lum > 230 || lum < 25) nearBinary++;
    sampled++;
  }
  const documentLike = sampled > 0 && nearBinary / sampled > 0.55;
  if (documentLike) {
    amount *= 0.5;
  }

  // Skip the convolution entirely if the amount is negligible.
  if (amount < 0.05) return;

  // Box blur (radius 1) to build the "blurred" copy.
  const radius = 1;
  const blurred = new Uint8ClampedArray(data.length);
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      let r = 0;
      let g = 0;
      let b = 0;
      let count = 0;
      for (let ky = -radius; ky <= radius; ky++) {
        for (let kx = -radius; kx <= radius; kx++) {
          const ny = Math.min(height - 1, Math.max(0, y + ky));
          const nx = Math.min(width - 1, Math.max(0, x + kx));
          const idx = (ny * width + nx) * 4;
          r += data[idx];
          g += data[idx + 1];
          b += data[idx + 2];
          count++;
        }
      }
      const idx = (y * width + x) * 4;
      blurred[idx] = r / count;
      blurred[idx + 1] = g / count;
      blurred[idx + 2] = b / count;
      blurred[idx + 3] = data[idx + 3];
    }
  }

  // Apply: original + amount * (original - blurred).
  for (let i = 0; i < data.length; i += 4) {
    data[i] = Math.min(
      255,
      Math.max(0, data[i] + amount * (data[i] - blurred[i]))
    );
    data[i + 1] = Math.min(
      255,
      Math.max(0, data[i + 1] + amount * (data[i + 1] - blurred[i + 1]))
    );
    data[i + 2] = Math.min(
      255,
      Math.max(0, data[i + 2] + amount * (data[i + 2] - blurred[i + 2]))
    );
  }

  ctx.putImageData(imageData, 0, 0);
}

/**
 * Render `base64` onto a canvas sized for the desired physical draw size at
 * TARGET_DPI, apply the adaptive unsharp mask, and return a fresh data URL.
 */
async function optimizeImageForPDF(
  base64: string,
  targetWidthMm: number,
  targetHeightMm: number
): Promise<PreparedImage> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      const canvasWidth = Math.max(
        1,
        Math.round(targetWidthMm * PX_PER_MM)
      );
      const canvasHeight = Math.max(
        1,
        Math.round(targetHeightMm * PX_PER_MM)
      );

      const canvas = document.createElement("canvas");
      canvas.width = canvasWidth;
      canvas.height = canvasHeight;

      // willReadFrequently is required for the convolution step.
      const ctx = canvas.getContext("2d", { willReadFrequently: true });
      if (!ctx) {
        reject(new Error("Canvas 2D context is unavailable"));
        return;
      }

      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = "high";
      ctx.drawImage(img, 0, 0, canvasWidth, canvasHeight);

      // How much are we enlarging the source pixels?
      const sourcePixels = img.naturalWidth * img.naturalHeight;
      const targetPixels = canvasWidth * canvasHeight;
      const upscaleRatio =
        sourcePixels > 0 ? targetPixels / sourcePixels : 1;

      try {
        applyAdaptiveUnsharpMask(
          ctx,
          canvasWidth,
          canvasHeight,
          upscaleRatio
        );
      } catch (error) {
        // Sharpening is a "nice to have". If it fails for any reason,
        // still return the un-sharpened canvas so the document renders.
        console.warn("Unsharp mask failed; continuing without sharpening:", error);
      }

      const format = getOriginalFormat(base64);
      if (format === "PNG") {
        resolve({ data: canvas.toDataURL("image/png"), format: "PNG" });
      } else {
        resolve({
          data: canvas.toDataURL("image/jpeg", JPEG_QUALITY),
          format: "JPEG",
        });
      }
    };
    img.onerror = () =>
      reject(new Error("Unable to decode image for PDF optimization"));
    img.src = base64;
  });
}

/**
 * Compute the largest draw size (in mm) that fits `availW × availH` while
 * preserving aspect ratio. Small images are enlarged; large images are
 * shrunk. Either way the image fills the page as much as possible.
 */
function computeDrawSizeMm(
  srcWidthPx: number,
  srcHeightPx: number,
  availWidthMm: number,
  availHeightMm: number
): { widthMm: number; heightMm: number } {
  const scale = Math.min(
    availWidthMm / srcWidthPx,
    availHeightMm / srcHeightPx
  );
  return {
    widthMm: srcWidthPx * scale,
    heightMm: srcHeightPx * scale,
  };
}

function addPageFooters(
  doc: import("jspdf").jsPDF,
  pageWidth: number,
  pageHeight: number,
  margin: number
): void {
  const pageCount = doc.getNumberOfPages();
  for (let page = 1; page <= pageCount; page += 1) {
    doc.setPage(page);
    doc.setDrawColor(200, 200, 200);
    doc.setLineWidth(0.2);
    doc.line(margin, pageHeight - 12, pageWidth - margin, pageHeight - 12);

    doc.setFont("helvetica", "normal");
    doc.setFontSize(8);
    doc.setTextColor(150, 150, 150);
    doc.text(
      `© ${new Date().getFullYear()} Oasis BIAM Laboratory School`,
      margin,
      pageHeight - 7
    );
    doc.text(
      `Page ${page} of ${pageCount}`,
      pageWidth - margin,
      pageHeight - 7,
      { align: "right" }
    );
  }
}

/* ============================================================================
 * MAIN PDF GENERATOR
 * ========================================================================== */

export async function generateAdmissionPDF(
  data: AdmissionForPDF
): Promise<void> {
  // Dynamic import avoids loading jsPDF during server-side rendering.
  const { jsPDF } = await import("jspdf");

  /**
   * IMPORTANT for image quality:
   *  • compress: false          → jsPDF does not re-compress the PDF stream.
   *  • hotfixes: ["px_scaling"] → correct pixel→mm conversion.
   */
  const doc = new jsPDF({
    orientation: "portrait",
    unit: "mm",
    format: "a4",
    compress: false,
    hotfixes: ["px_scaling"],
  });

  const pageWidth = A4_WIDTH_MM;
  const pageHeight = A4_HEIGHT_MM;
  const margin = REPORT_MARGIN_MM;
  const contentWidth = pageWidth - margin * 2;
  let y = margin;

  const addPageIfNeeded = (neededHeight: number): void => {
    if (y + neededHeight > pageHeight - margin - 10) {
      doc.addPage();
      y = margin;
    }
  };

  /* ------------------------------------------------------------------------
   * REPORT HEADER
   * ---------------------------------------------------------------------- */
  const logoBase64 = await urlToBase64(LOGO_URL);
  let headerTextX = margin;

  if (logoBase64) {
    try {
      const dimensions = await getImageDimensions(logoBase64);
      const maxLogoDimension = 20;
      const scale = Math.min(
        maxLogoDimension / dimensions.width,
        maxLogoDimension / dimensions.height
      );
      const logoWidthMm = dimensions.width * scale;
      const logoHeightMm = dimensions.height * scale;

      const optimizedLogo = await optimizeImageForPDF(
        logoBase64,
        logoWidthMm,
        logoHeightMm
      );

      doc.addImage(
        optimizedLogo.data,
        optimizedLogo.format,
        margin,
        y,
        logoWidthMm,
        logoHeightMm,
        undefined,
        "NONE"
      );
      headerTextX = margin + maxLogoDimension + 5;
    } catch (error) {
      console.warn("School logo could not be added to the PDF:", error);
    }
  }

  doc.setFont("helvetica", "bold");
  doc.setFontSize(18);
  doc.setTextColor(16, 185, 129);
  doc.text("OASIS BIAM", headerTextX, y + 7);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);
  doc.setTextColor(80, 80, 80);
  doc.text("Laboratory School", headerTextX, y + 13);
  doc.text("Barhatta Road, Netrokona", headerTextX, y + 18);

  doc.setFont("helvetica", "bold");
  doc.setFontSize(13);
  doc.setTextColor(30, 30, 30);
  doc.text("Student Admission Report", margin, y + 30);

  y += 35;

  /* ------------------------------------------------------------------------
   * APPLICATION META & STATUS
   * ---------------------------------------------------------------------- */
  doc.setDrawColor(16, 185, 129);
  doc.setLineWidth(0.5);
  doc.line(margin, y, pageWidth - margin, y);
  y += 5;

  doc.setFont("helvetica", "normal");
  doc.setFontSize(8);
  doc.setTextColor(120, 120, 120);
  doc.text(`Application ID: ${data._id}`, margin, y);
  doc.text(`Submitted: ${formatDate(data.createdAt)}`, pageWidth - margin, y, {
    align: "right",
  });
  y += 8;

  const statusText = (data.status || "pending").toUpperCase();
  const statusColor: [number, number, number] =
    data.status === "approved"
      ? [16, 185, 129]
      : data.status === "rejected"
        ? [220, 38, 38]
        : [217, 119, 6];

  doc.setFont("helvetica", "bold");
  doc.setFontSize(9);
  const badgeLabel = `Status: ${statusText}`;
  const badgeWidth = doc.getTextWidth(badgeLabel) + 6;
  doc.setFillColor(statusColor[0], statusColor[1], statusColor[2]);
  doc.roundedRect(margin, y - 4, badgeWidth, 7, 1.5, 1.5, "F");
  doc.setTextColor(255, 255, 255);
  doc.text(badgeLabel, margin + badgeWidth / 2, y + 1, { align: "center" });
  y += 12;

  /* ------------------------------------------------------------------------
   * REPORT SECTION HELPERS
   * ---------------------------------------------------------------------- */
  const addSection = (title: string): void => {
    addPageIfNeeded(14);
    doc.setFillColor(240, 253, 244);
    doc.rect(margin, y, contentWidth, 8, "F");
    doc.setFont("helvetica", "bold");
    doc.setFontSize(10.5);
    doc.setTextColor(5, 150, 105);
    doc.text(title, margin + 3, y + 5.5);
    y += 11;
  };

  const addTwoCol = (
    label1: string,
    value1: string,
    label2: string,
    value2: string
  ): void => {
    addPageIfNeeded(10);
    const columnWidth = (contentWidth - 4) / 2;

    doc.setFont("helvetica", "normal");
    doc.setFontSize(7.5);
    doc.setTextColor(120, 120, 120);
    doc.text(label1.toUpperCase(), margin, y);

    doc.setFont("helvetica", "bold");
    doc.setFontSize(9.5);
    doc.setTextColor(30, 30, 30);
    const lines1 = doc.splitTextToSize(value1 || "—", columnWidth);
    doc.text(lines1, margin, y + 4);

    doc.setFont("helvetica", "normal");
    doc.setFontSize(7.5);
    doc.setTextColor(120, 120, 120);
    doc.text(label2.toUpperCase(), margin + columnWidth + 4, y);

    doc.setFont("helvetica", "bold");
    doc.setFontSize(9.5);
    doc.setTextColor(30, 30, 30);
    const lines2 = doc.splitTextToSize(value2 || "—", columnWidth);
    doc.text(lines2, margin + columnWidth + 4, y + 4);

    const maxLines = Math.max(lines1.length, lines2.length);
    y += 4 + maxLines * 4.2 + 4;
  };

  const addOneCol = (label: string, value: string): void => {
    addPageIfNeeded(10);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(7.5);
    doc.setTextColor(120, 120, 120);
    doc.text(label.toUpperCase(), margin, y);

    doc.setFont("helvetica", "bold");
    doc.setFontSize(9.5);
    doc.setTextColor(30, 30, 30);
    const lines = doc.splitTextToSize(value || "—", contentWidth);
    doc.text(lines, margin, y + 4);
    y += 4 + lines.length * 4.2 + 4;
  };

  /* ------------------------------------------------------------------------
   * STUDENT AND FAMILY INFORMATION
   * ---------------------------------------------------------------------- */
  addSection("STUDENT INFORMATION");
  addTwoCol(
    "Full Name",
    data.studentName,
    "Date of Birth",
    formatDate(data.birthDate)
  );
  addTwoCol(
    "Blood Group",
    data.bloodGroup || "—",
    "Applying For",
    data.classApplyingFor || "—"
  );

  addSection("PARENT / GUARDIAN");
  addTwoCol(
    "Father's Name",
    data.fatherName,
    "Mother's Name",
    data.motherName
  );

  addSection("ACADEMIC INFORMATION");
  addTwoCol(
    "Applying For",
    data.classApplyingFor,
    "Previous Class",
    data.previousClass || "—"
  );

  addSection("CONTACT & ADDRESS");
  addTwoCol("Phone", data.phone, "Email", data.email || "—");
  addOneCol("Current Address", data.currentAddress || "—");
  addOneCol("Permanent Address", data.permanentAddress || "—");

  /* ------------------------------------------------------------------------
   * DOCUMENT IMAGES
   * Each supplied document URL gets its own A4 page. The image fills the
   * available area (preserving aspect ratio, no cropping) and is rendered
   * at ~200 DPI with adaptive sharpening.
   * ---------------------------------------------------------------------- */
  const documents: Array<{ label: string; url?: string }> = [
    { label: "Birth Certificate", url: data.birthCertificateImage },
    {
      label: "Previous School Certificate",
      url: data.previousSchoolCertificateImage,
    },
    { label: "Passport Size Photo", url: data.passportPhotosImage },
    { label: "Parent's NID Copy", url: data.parentNidImage },
  ];

  const loadedDocuments = await Promise.all(
    documents.map(async (item) => {
      if (!item.url) return { ...item, base64: null as string | null };
      try {
        const rawBase64 = await urlToBase64(item.url);
        if (!rawBase64) return { ...item, base64: null as string | null };
        return { ...item, base64: rawBase64 };
      } catch (error) {
        console.error(`Failed to prepare ${item.label}:`, error);
        return { ...item, base64: null as string | null };
      }
    })
  );

  const documentsToRender = loadedDocuments.filter(
    (item) => item.url && item.base64
  );

  if (documentsToRender.length === 0 && loadedDocuments.some((d) => d.url)) {
    console.warn(
      "[admission-pdf] Some document URLs were provided but none could be fetched."
    );
  }

  for (const item of documentsToRender) {
    doc.addPage("a4", "portrait");

    const documentPageMargin = DOCUMENT_PAGE_MARGIN_MM;
    const headingY = documentPageMargin + 4;
    const imageX = documentPageMargin;
    const imageY = documentPageMargin + DOCUMENT_HEADER_HEIGHT_MM;
    const availableWidth = pageWidth - documentPageMargin * 2;
    const availableHeight = pageHeight - imageY - DOCUMENT_FOOTER_RESERVE_MM;

    doc.setFont("helvetica", "bold");
    doc.setFontSize(12);
    doc.setTextColor(30, 30, 30);
    doc.text(`Uploaded Document: ${item.label}`, imageX, headingY);

    doc.setFont("helvetica", "normal");
    doc.setFontSize(8.5);
    doc.setTextColor(120, 120, 120);
    doc.text(`Student: ${data.studentName || "—"}`, imageX, headingY + 6);

    try {
      const dimensions = await getImageDimensions(item.base64 as string);

      // Fill the page as much as possible while preserving aspect ratio.
      const { widthMm, heightMm } = computeDrawSizeMm(
        dimensions.width,
        dimensions.height,
        availableWidth,
        availableHeight
      );

      const drawX = imageX + (availableWidth - widthMm) / 2;
      const drawY = imageY + (availableHeight - heightMm) / 2;

      const optimized = await optimizeImageForPDF(
        item.base64 as string,
        widthMm,
        heightMm
      );

      doc.addImage(
        optimized.data,
        optimized.format,
        drawX,
        drawY,
        widthMm,
        heightMm,
        undefined,
        "NONE"
      );
    } catch (error) {
      console.error(`Could not render ${item.label}:`, error);
      doc.setFont("helvetica", "normal");
      doc.setFontSize(12);
      doc.setTextColor(150, 150, 150);
      doc.text(
        "Image could not be rendered.",
        pageWidth / 2,
        imageY + availableHeight / 2,
        { align: "center" }
      );
    }
  }

  /* ------------------------------------------------------------------------
   * FOOTERS AND PAGE NUMBERS
   * ---------------------------------------------------------------------- */
  addPageFooters(doc, pageWidth, pageHeight, margin);

  /* ------------------------------------------------------------------------
   * SAVE PDF
   * ---------------------------------------------------------------------- */
  const safeName =
    (data.studentName || "student")
      .trim()
      .replace(/[^a-zA-Z0-9]+/g, "_")
      .replace(/^_+|_+$/g, "") || "student";
  const safeId = (data._id || "application").slice(-6);

  doc.save(`admission-${safeName}-${safeId}.pdf`);
}