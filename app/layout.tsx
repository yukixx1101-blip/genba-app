"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();

  return (
    <html lang="ja">
      <body
        style={{
          margin: 0,
          fontFamily: "sans-serif",
          backgroundColor: "#000",
        }}
      >
        {/* 上ナビ */}
        <div
          style={{
            position: "sticky",
            top: 0,
            zIndex: 1000,
            display: "flex",
            gap: "8px",
            padding: "10px",
            backgroundColor: "#111",
            boxSizing: "border-box",
          }}
        >
          <button
            type="button"
            onClick={() => router.back()}
            style={navBtn}
          >
            ←
          </button>

          <button
            type="button"
            onClick={() => router.forward()}
            style={navBtn}
          >
            →
          </button>

          <Link href="/" style={homeBtn}>
            ホーム
          </Link>
        </div>

        {/* 本体 */}
        <div>{children}</div>
      </body>
    </html>
  );
}

const navBtn: React.CSSProperties = {
  padding: "10px 12px",
  borderRadius: "10px",
  border: "none",
  backgroundColor: "#333",
  color: "#fff",
  fontSize: "14px",
};

const homeBtn: React.CSSProperties = {
  padding: "10px 12px",
  borderRadius: "10px",
  backgroundColor: "#fff",
  color: "#111",
  textDecoration: "none",
  fontSize: "14px",
  fontWeight: "bold",
};