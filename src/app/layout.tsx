import type { Metadata, Viewport } from "next";
import { Inter, Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { SiteChrome } from "@/components/layout/site-chrome";
import { ScrollProgress } from "@/components/scroll-progress";
import { BackToTop } from "@/components/ui/back-to-top";
import { CommandPaletteProvider } from "@/components/command-palette-provider";
import { Toaster } from "sonner";

const inter = Inter({ 
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const jakarta = Plus_Jakarta_Sans({ 
  subsets: ["latin"],
  variable: "--font-jakarta",
  display: "swap",
});

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#fafaf9" },
    { media: "(prefers-color-scheme: dark)", color: "#020617" },
  ],
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

export const metadata: Metadata = {
  metadataBase: new URL("https://oasisbiam.edu.bd"),
  title: {
    default: "Oasis BIAM Laboratory School | Netrokona",
    template: "%s | Oasis BIAM Laboratory School",
  },
  description: "English version National Curriculum. Barhatta Road, Netrokona, Bangladesh, 2400. Governed by District Administration Netrokona & BIAM Foundation.",
  icons: { 
    icon: "https://i.ibb.co.com/7NzsPGvc/logo.jpg",
    apple: "https://i.ibb.co.com/7NzsPGvc/logo.jpg" 
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "EducationalOrganization",
    name: "Oasis BIAM Laboratory School",
    url: "https://oasisbiam.edu.bd",
    logo: "https://i.ibb.co.com/7NzsPGvc/logo.jpg",
  };

  return (
    <html 
      lang="en" 
      suppressHydrationWarning 
      data-scroll-behavior="smooth"
      className={`${inter.variable} ${jakarta.variable}`}
    >
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="min-h-screen flex flex-col antialiased selection:bg-[var(--primary)] selection:text-white">
        <ThemeProvider>
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
            toastOptions={{
              className: "glass-panel text-[var(--fg)] font-sans font-medium text-sm border-[var(--border)] shadow-2xl rounded-xl",
              duration: 4000,
            }}
          />
        </ThemeProvider>
      </body>
    </html>
  );
}