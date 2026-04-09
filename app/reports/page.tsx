"use client";
import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabase";

export default function ReportsPage() {
  const [reports, setReports] = useState<any[]>([]);
  const [message, setMessage] = useState("読み込み中...");

  useEffect(() => {
    const fetchReports = async () => {
      const { data, error } = await supabase
        .from("reports")
        .select(`
          id,
          report_date,
          site,
          content,
          hours,
          workers,
          worker_id,
          worker:workers(name)
        `)
        .order("created_at", { ascending: false });

      if (error) {
        setMessage("取得エラー: " + error.message);
      } else {
        setReports(data || []);
        setMessage("");
      }
    };

    fetchReports();
  }, []);

  return (
    <main style={{ padding: "16px", maxWidth: "480px", margin: "0 auto" }}>
      <h1>日報一覧</h1>

      {message && <p>{message}</p>}

      <div style={{ display: "grid", gap: "12px" }}>
        {reports.map((r) => (
          <div
            key={r.id}
            style={{
              border: "1px solid #ccc",
              padding: "10px",
              borderRadius: "10px",
              background: "#fff",
            }}
          >
            <div>日付: {r.report_date || "-"}</div>
            <div>作業員: {r.worker?.name || "-"}</div>
            <div>現場: {r.site || "-"}</div>
            <div>内容: {r.content || "-"}</div>
            <div>時間: {r.hours || "-"}</div>
            <div>人数: {r.workers || "-"}</div>
          </div>
        ))}
      </div>
    </main>
  );
}