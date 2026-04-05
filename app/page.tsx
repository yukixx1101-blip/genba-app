import Link from "next/link";

export default function Home() {
  return (
    <main
      style={{
        padding: "16px",
        maxWidth: "480px",
        margin: "0 auto",
        fontFamily: "sans-serif",
      }}
    >
      <h1 style={{ fontSize: "30px", marginBottom: "8px" }}>現場日報アプリ</h1>
      <p style={{ color: "#555", marginBottom: "20px" }}>
        スマホで使うためのシンプル版
      </p>

      <div style={{ display: "grid", gap: "12px" }}>
        <Link
          href="/reports/new"
          style={{
            display: "block",
            padding: "16px",
            borderRadius: "12px",
            backgroundColor: "#111",
            color: "#fff",
            textDecoration: "none",
            fontSize: "18px",
            fontWeight: "bold",
            textAlign: "center",
          }}
        >
          日報を入力する
        </Link>

        <Link
          href="/reports"
          style={{
            display: "block",
            padding: "16px",
            borderRadius: "12px",
            backgroundColor: "#f3f3f3",
            color: "#111",
            textDecoration: "none",
            fontSize: "18px",
            fontWeight: "bold",
            textAlign: "center",
            border: "1px solid #ddd",
          }}
        >
          日報一覧を見る
        </Link>
      </div>
    </main>
  );
}
