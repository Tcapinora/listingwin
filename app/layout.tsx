import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "ListingWin",
  description: "Premium real estate listing mockup prototype",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
