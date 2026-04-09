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

  const tabStyle = (active: boolean): React.CSSProperties => ({
    flex: 1,
    textAlign: "center",
    padding: "10px 6px",
    textDecoration: "none",
    color: active ? "#111" : "#666",
    fontWeight: active ? "bold" : "normal",
    fontSize: "14px",
  });

  return (
    <html lang="ja">
      <body
        style={{
          margin: 0,
          fontFamily: "sans-serif",
          backgroundColor: "#f7f7f7",
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
            style={{
              padding: "10px 12px",
              borderRadius: "10px",
              border: "none",
              backgroundColor: "#333",
              color: "#fff",
              fontSize: "14px",
            }}
          >
            ← 戻る
          </button>

          <button
            type="button"
            onClick={() => router.forward()}
            style={{
              padding: "10px 12px",
              borderRadius: "10px",
              border: "none",
              backgroundColor: "#333",
              color: "#fff",
              fontSize: "14px",
            }}
          >
            進む →
          </button>

          <Link
            href="/"
            style={{
              padding: "10px 12px",
              borderRadius: "10px",
              backgroundColor: "#fff",
              color: "#111",
              textDecoration: "none",
              fontSize: "14px",
              fontWeight: "bold",
            }}
          >
            ホーム
          </Link>
        </div>

        {/* 本体 */}
        <div style={{ paddingBottom: "80px" }}>{children}</div>

        {/* 下タブ */}
        <div
          style={{
            position: "fixed",
            left: 0,
            right: 0,
            bottom: 0,
            display: "flex",
            backgroundColor: "#fff",
            borderTop: "1px solid #ddd",
            zIndex: 1000,
          }}
        >
          <Link href="/" style={tabStyle(pathname === "/")}>
            🏠
            <br />
            ホーム
          </Link>

          <Link
            href="/reports/new"
            style={tabStyle(pathname === "/reports/new")}
          >
            ✍️
            <br />
            入力
          </Link>

          <Link
            href="/reports"
            style={tabStyle(pathname === "/reports")}
          >
            📋
            <br />
            一覧
          </Link>
        </div>
      </body>
    </html>
  );
}