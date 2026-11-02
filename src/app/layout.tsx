import type { Metadata, Viewport } from "next";
import { Inter, Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { SiteChrome } from "@/components/layout/site-chrome";
import { ScrollProgress } from "@/components/scroll-progress";
import { BackToTop } from "@/components/ui/back-to-top";
import { CommandPaletteProvider } from "@/components/command-palette-provider";
import { TopLoader } from "@/components/ui/top-loader"; // 🎯 NEW IMPORT
import { Toaster } from "sonner";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
  preload: true,
});

const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-jakarta",
  display: "swap",
  preload: true,
});

/* =========================================
   PREMIUM SITE CONSTANTS
   ========================================= */
const SITE_URL = "https://oasisbiam.edu.bd";
const SITE_NAME = "Oasis BIAM Laboratory School";
const SITE_LOGO = "https://i.ibb.co.com/7NzsPGvc/logo.jpg";
const SITE_DESCRIPTION =
  "English version National Curriculum. Barhatta Road, Netrokona, Bangladesh, 2400. Governed by District Administration Netrokona & BIAM Foundation.";

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#fafaf9" },
    { media: "(prefers-color-scheme: dark)", color: "#020617" },
  ],
  colorScheme: "light dark",
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
};

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),

  /* --- Core --- */
  title: {
    default: `${SITE_NAME} | Netrokona`,
    template: `%s | ${SITE_NAME}`,
  },
  description: SITE_DESCRIPTION,
  applicationName: "Oasis BIAM",
  generator: "Next.js",
  category: "education",
  creator: SITE_NAME,
  publisher: SITE_NAME,

  /* --- Authorship --- */
  authors: [{ name: SITE_NAME, url: SITE_URL }],

  /* --- Keywords --- */
  keywords: [
    "Oasis BIAM Laboratory School",
    "Netrokona school",
    "English version National Curriculum",
    "best school in Netrokona",
    "admission 2027",
    "BIAM Foundation school",
    "District Administration Netrokona",
    "English medium school Netrokona",
  ],

  /* --- Canonical & Alternates --- */
  alternates: {
    canonical: "/",
    languages: {
      "en-US": "/",
    },
  },

  /* --- Robots --- */
  referrer: "origin-when-cross-origin",
  robots: {
    index: true,
    follow: true,
    nocache: false,
    googleBot: {
      index: true,
      follow: true,
      noimageindex: false,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },

  /* --- Format detection --- */
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },

  /* --- Icons --- */
  icons: {
    icon: SITE_LOGO,
    shortcut: SITE_LOGO,
    apple: SITE_LOGO,
  },

  /* --- Open Graph --- */
  openGraph: {
    type: "website",
    locale: "en_US",
    url: SITE_URL,
    siteName: SITE_NAME,
    title: `${SITE_NAME} | Netrokona`,
    description: SITE_DESCRIPTION,
    images: [
      {
        url: SITE_LOGO,
        width: 1200,
        height: 630,
        alt: SITE_NAME,
      },
    ],
  },

  /* --- Twitter / X --- */
  twitter: {
    card: "summary_large_image",
    title: `${SITE_NAME} | Netrokona`,
    description:
      "English version National Curriculum. Barhatta Road, Netrokona, Bangladesh, 2400.",
    images: [SITE_LOGO],
  },

  /* --- Apple Web App --- */
  appleWebApp: {
    title: "Oasis BIAM",
    statusBarStyle: "black-translucent",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "EducationalOrganization",
        "@id": `${SITE_URL}/#organization`,
        name: SITE_NAME,
        url: SITE_URL,
        logo: SITE_LOGO,
        description: SITE_DESCRIPTION,
        foundingDate: "2003",
        address: {
          "@type": "PostalAddress",
          streetAddress: "Barhatta Road",
          addressLocality: "Netrokona",
          addressRegion: "Mymensingh",
          postalCode: "2400",
          addressCountry: "BD",
        },
        contactPoint: {
          "@type": "ContactPoint",
          telephone: "+880-1724-483490",
          contactType: "admissions",
          email: "info@oasisbiam.edu.bd",
          availableLanguage: ["en", "bn"],
        },
      },
      {
        "@type": "WebSite",
        "@id": `${SITE_URL}/#website`,
        url: SITE_URL,
        name: SITE_NAME,
        publisher: { "@id": `${SITE_URL}/#organization` },
        inLanguage: "en",
      },
    ],
  };

  return (
    <html
      lang="en"
      dir="ltr"
      suppressHydrationWarning
      data-scroll-behavior="smooth"
      className={`${inter.variable} ${jakarta.variable}`}
    >
      <head>
        {/* Performance: preconnect to external image host */}
        <link rel="preconnect" href="https://i.ibb.co.com" crossOrigin="anonymous" />
        <link rel="dns-prefetch" href="https://i.ibb.co.com" />

        {/* JSON-LD structured data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="min-h-screen flex flex-col antialiased bg-[var(--bg)] text-[var(--fg)] selection:bg-[var(--primary)] selection:text-white font-feature-[cv02,cv03,cv04,cv11,ss01]">
        <ThemeProvider>
          
          {/* 🎯 Global Top Loading Progress Bar */}
          <TopLoader />
          
          <ScrollProgress />
          <CommandPaletteProvider />

          {/* 🚀 The smart wrapper decides whether to show Navbar/Footer */}
          <SiteChrome>
            {children}
          </SiteChrome>

          <BackToTop />
          
          <Toaster
            richColors
            position="top-right"
            expand={false}
            closeButton
            offset="1.25rem"
            gap={10}
            visibleToasts={3}
            toastOptions={{
              className:
                "glass-panel text-[var(--fg)] font-sans font-medium text-sm border border-[var(--border)] shadow-2xl shadow-black/10 rounded-xl ring-1 ring-inset ring-white/[0.04] backdrop-blur-2xl",
              duration: 4000,
            }}
          />
        </ThemeProvider>
      </body>
    </html>
  );
}