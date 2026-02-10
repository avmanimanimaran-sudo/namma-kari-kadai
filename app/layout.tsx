import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { CartProvider } from "@/components/features/CartProvider";

const inter = Inter({ subsets: ["latin"], variable: "--font-sans" });

export const metadata: Metadata = {
  title: "Namma Kari Kadai - Fresh Chicken Ordering",
  description: "Order fresh broiler and country chicken (naatu kozhi) online.",
  manifest: "/manifest.json",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.variable} antialiased bg-background text-text min-h-screen`}>
        <CartProvider>
          {children}
        </CartProvider>
      </body>
    </html>
  );
}
