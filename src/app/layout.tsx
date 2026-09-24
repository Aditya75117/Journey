import type { Metadata, Viewport } from "next";
import { Fraunces, Outfit, Syne } from "next/font/google";
import { site, siteUrl } from "@/lib/site";
import "./globals.css";

const display = Fraunces({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const sans = Outfit({
  variable: "--font-sans",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

const accent = Syne({
  variable: "--font-accent",
  subsets: ["latin"],
  weight: ["500", "600", "700", "800"],
});

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: site.title,
  description: site.description,
  alternates: {
    canonical: "/",
  },
  authors: [{ name: site.name, url: site.linkedin }],
  creator: site.name,
  icons: {
    icon: "/brand/ad-mark.png",
    apple: "/brand/ad-mark.png",
  },
  openGraph: {
    type: "website",
    url: siteUrl,
    siteName: site.name,
    title: site.title,
    description: site.description,
    locale: "en_IN",
  },
  twitter: {
    card: "summary_large_image",
    title: site.title,
    description: site.description,
  },
  robots: {
    index: true,
    follow: true,
  },
};

export const viewport: Viewport = {
  themeColor: "#0B0D10",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${display.variable} ${sans.variable} ${accent.variable} h-full`}
    >
      <body className="min-h-full bg-[#0B0D10] font-[family-name:var(--font-sans)] text-[#F2F0EB] antialiased">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Person",
              name: site.name,
              jobTitle: site.role,
              url: siteUrl,
              email: `mailto:${site.email}`,
              sameAs: [site.linkedin],
            }).replace(/</g, "\\u003c"),
          }}
        />
        {children}
      </body>
    </html>
  );
}
