import { ClerkProvider } from "@clerk/nextjs";
import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "系統入口 Portal",
  description: "統一系統管理入口",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ClerkProvider>
      <html lang="zh-TW">
        <body>{children}</body>
      </html>
    </ClerkProvider>
  );
}
