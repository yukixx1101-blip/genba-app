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
      <h1 style={{ fontSize: "28px", marginBottom: "16px" }}>
        現場アプリ
      </h1>

      <div style={{ display: "grid", gap: "12px" }}>
        <Link
          href="/reports/new"
          style={{
            display: "block",
            padding: "16px",
            borderRadius: "12px",
            backgroundColor: "#111",
            color: "#fff",
            textAlign: "center",
            textDecoration: "none",
            fontSize: "18px",
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
            backgroundColor: "#eee",
            color: "#111",
            textAlign: "center",
            textDecoration: "none",
            fontSize: "18px",
          }}
        >
          日報一覧を見る
        </Link>

        <Link
          href="/summary"
          style={{
            display: "block",
            padding: "16px",
            borderRadius: "12px",
            backgroundColor: "#0066cc",
            color: "#fff",
            textAlign: "center",
            textDecoration: "none",
            fontSize: "18px",
          }}
        >
          作業員別月間まとめ
        </Link>
      </div>
    </main>
  );
}