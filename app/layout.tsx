import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "playwhat",
  description: "Video game recommendations powered by AI",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
