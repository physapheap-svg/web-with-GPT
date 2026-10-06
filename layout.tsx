import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Pheap Physa — Portfolio",
  description: "HR operations, IT recruitment, and people-focused work by Pheap Physa.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">{children}</body>
    </html>
  );
}
