import type { Metadata } from "next";
import { Fraunces, Outfit, Syne } from "next/font/google";
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
  title: "AD. — Aditya Dutta | Life Journey",
  description:
    "An immersive storytelling portfolio — walk the road from schooling in Nadaun to Senior UI Developer at ShyftLabs.",
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
        {children}
      </body>
    </html>
  );
}
