import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "投資ウォッチリスト",
  description: "日本株・米国株のリアルタイムウォッチリスト",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ja">
      <body>{children}</body>
    </html>
  );
}
