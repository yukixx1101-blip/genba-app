"use client";
import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabase";

type Report = {
  id: number;
  site: string;
  content: string;
  hours: string;
  workers: string;
  created_at?: string;
};

export default function ReportsPage() {
  const [reports, setReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReports = async () => {
      const { data, error } = await supabase
        .from("reports")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) {
        alert("一覧の取得エラー: " + error.message);
      } else {
        setReports((data as Report[]) || []);
      }

      setLoading(false);
    };

    fetchReports();
  }, []);

  return (
    <main
      style={{
        padding: "16px",
        maxWidth: "480px",
        margin: "0 auto",
        fontFamily: "sans-serif",
      }}
    >
      <h1 style={{ fontSize: "28px", marginBottom: "16px" }}>日報一覧</h1>

      {loading ? (
        <p>読み込み中...</p>
      ) : reports.length === 0 ? (
        <p>まだ日報がありません</p>
      ) : (
        <div style={{ display: "grid", gap: "12px" }}>
          {reports.map((report) => (
            <div
              key={report.id}
              style={{
                border: "1px solid #ddd",
                borderRadius: "14px",
                padding: "14px",
                backgroundColor: "#fff",
                boxShadow: "0 1px 4px rgba(0,0,0,0.06)",
              }}
            >
              <div style={{ fontSize: "18px", fontWeight: "bold", marginBottom: "8px" }}>
                {report.site}
              </div>

              <div style={{ marginBottom: "6px" }}>
                <strong>作業内容:</strong> {report.content}
              </div>

              <div style={{ marginBottom: "6px" }}>
                <strong>作業時間:</strong> {report.hours}
              </div>

              <div>
                <strong>人数:</strong> {report.workers}
              </div>
            </div>
          ))}
        </div>
      )}
    </main>
  );
}
