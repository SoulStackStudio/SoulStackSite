import type { Metadata } from "next";
import { Cormorant_Garamond, Inter } from "next/font/google";
import "./globals.css";
import { AdminProvider } from "@/components/AdminProvider";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const cormorant = Cormorant_Garamond({
  variable: "--font-cormorant",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Soul Stack Studio — Fine Art Photo Prints",
  description:
    "Luminous, gallery-standard photographic prints from Soul Stack Studio. Archival quality, shipped ready to frame.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${cormorant.variable} ${inter.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col">
        <AdminProvider>
          <Navbar />
          <main className="flex-1">{children}</main>
          <Footer />
        </AdminProvider>
      </body>
    </html>
  );
}
