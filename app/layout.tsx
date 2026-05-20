import type { Metadata } from "next";
import { DM_Serif_Display, Inter } from "next/font/google";
import "./globals.css";

const dmSerif = DM_Serif_Display({
  variable: "--font-dm-serif",
  subsets: ["latin"],
  weight: "400",
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Elegance AI — Enterprise AI Perspectives",
  description:
    "Independent analysis on integrating AI into enterprise environments — SAP landscapes, legacy architecture, inference economics, and agentic systems.",
  openGraph: {
    title: "Elegance AI — Enterprise AI Perspectives",
    description:
      "Independent analysis on integrating AI into enterprise environments.",
    url: "https://eleganceai.ai",
    siteName: "Elegance AI",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${dmSerif.variable} ${inter.variable}`}>
      <body className="min-h-screen bg-bg text-ink antialiased font-sans">
        {children}
      </body>
    </html>
  );
}
