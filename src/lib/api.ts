/**
 * Shared frontend API client for Oasis BIAM Laboratory School.
 * 
 * Successful `{ success: true, data: ... }` responses are unwrapped so callers
 * receive the actual payload. Failed requests return `{ success: false, message }`.
 */

export const API_URL = (
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"
).replace(/\/+$/, "");

/** Standard response envelope returned by the Express backend. */
export type ApiResponse<T> =
  | { success: true; data: T }
  | { success: true; message: string }
  | { success: false; message: string };

/** The API client unwraps successful `data` payloads before returning them. */
export type ApiError = {
  success: false;
  message: string;
};

export type ApiResult<T> = T | ApiError | { success: true; message: string };

function getErrorMessage(value: unknown, fallback: string): string {
  if (
    value &&
    typeof value === "object" &&
    "message" in value &&
    typeof (value as { message?: unknown }).message === "string"
  ) {
    return (value as { message: string }).message;
  }
  return fallback;
}

async function request<T>(
  path: string,
  init: RequestInit = {},
  timeoutMs = 15_000
): Promise<ApiResult<T>> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

  const headers = new Headers(init.headers);
  const isFormData =
    typeof FormData !== "undefined" && init.body instanceof FormData;

  // Let the browser set the multipart boundary for FormData uploads.
  if (init.body != null && !isFormData && !headers.has("Content-Type")) {
    headers.set("Content-Type", "application/json");
  }

  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  const url = `${API_URL}${normalizedPath}`;

  try {
    const response = await fetch(url, {
      ...init,
      headers,
      credentials: "include", // Cross-origin requests এ Cookie পাঠানোর জন্য
      signal: controller.signal,
    });

    const responseText = await response.text();
    let result: unknown = null;

    if (responseText) {
      try {
        result = JSON.parse(responseText);
      } catch {
        if (response.ok) {
          throw new Error("The backend returned an invalid JSON response.");
        }
        result = { message: responseText };
      }
    }

    if (!response.ok) {
      throw new Error(
        getErrorMessage(result, `Request failed with HTTP ${response.status}.`)
      );
    }

    if (
      result &&
      typeof result === "object" &&
      "success" in result &&
      (result as { success?: unknown }).success === false
    ) {
      throw new Error(getErrorMessage(result, "The request was unsuccessful."));
    }

    // Preserve the existing API-client behavior: unwrap { success, data }.
    if (result && typeof result === "object" && "data" in result) {
      return (result as { data: T }).data;
    }

    return result as ApiResult<T>;
  } catch (error: unknown) {
    if (controller.signal.aborted) {
      return {
        success: false,
        message: "Request timed out. Please try again.",
      };
    }

    if (error instanceof TypeError) {
      return {
        success: false,
        message: `Cannot connect to the backend at ${API_URL}. Check whether the backend server is running.`,
      };
    }

    return {
      success: false,
      message:
        error instanceof Error ? error.message : "An unknown error occurred.",
    };
  } finally {
    clearTimeout(timeoutId);
  }
}

/**
 * Safely extracts an array from common API response shapes.
 * Accepts a raw array, an unwrapped payload, or nested objects such as:
 * { success: true, data: [...] }, { data: { teachers: [...] } },
 * { teachers: [...] }, { items: [...] }, and { results: [...] }.
 */
export function extractArray<T = unknown>(response: unknown): T[] {
  if (Array.isArray(response)) {
    return response as T[];
  }

  if (!response || typeof response !== "object") {
    return [];
  }

  const object = response as Record<string, unknown>;

  if (object.success === false) {
    return [];
  }

  const arrayKeys = [
    "data",
    "teachers",
    "items",
    "results",
    "records",
    "documents",
    "rows",
  ];

  // Prefer direct array properties first, including valid empty arrays.
  for (const key of arrayKeys) {
    if (Array.isArray(object[key])) {
      return object[key] as T[];
    }
  }

  // Then inspect nested objects (for example data.teachers).
  for (const key of arrayKeys) {
    const value = object[key];
    if (value && typeof value === "object") {
      const nested = extractArray<T>(value);
      if (nested.length > 0) {
        return nested;
      }
    }
  }

  return [];
}

export const api = {
  get: <T>(path: string) => request<T>(path),

  post: <T>(path: string, body?: unknown) =>
    request<T>(path, {
      method: "POST",
      body: body === undefined ? undefined : JSON.stringify(body),
    }),

  put: <T>(path: string, body?: unknown) =>
    request<T>(path, {
      method: "PUT",
      body: body === undefined ? undefined : JSON.stringify(body),
    }),

  patch: <T>(path: string, body?: unknown) =>
    request<T>(path, {
      method: "PATCH",
      body: body === undefined ? undefined : JSON.stringify(body),
    }),

  /** 
   * Alias for DELETE method.
   * Using `del` because `delete` is a reserved keyword in JS,
   * but we provide both to prevent runtime errors.
   */
  del: <T>(path: string) =>
    request<T>(path, {
      method: "DELETE",
    }),

  delete: <T>(path: string) =>
    request<T>(path, {
      method: "DELETE",
    }),

  upload: (file: File) => {
    const formData = new FormData();
    formData.append("image", file, file.name);

    // Backend ImgBB timeout is 45 seconds; keep a small client-side margin.
    return request<{ url: string; displayUrl?: string; deleteUrl?: string | null }>(
      "/api/upload",
      {
        method: "POST",
        body: formData,
      },
      50_000 // 50 seconds timeout
    );
  },
};