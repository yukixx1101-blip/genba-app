"use client";
import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabase";

type Report = {
  id: number;
  report_date: string;
  site: string;
  content: string;
  hours: string;
  workers: string;
};

export default function ReportsPage() {
  const [reports, setReports] = useState<Report[]>([]);

  useEffect(() => {
    const fetchReports = async () => {
      const { data, error } = await supabase
        .from("reports")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) {
        alert("取得エラー: " + error.message);
      } else {
        setReports((data as Report[]) || []);
      }
    };

    fetchReports();
  }, []);

  return (
    <main style={{ padding: "16px", maxWidth: "480px", margin: "0 auto", fontFamily: "sans-serif" }}>
      <h1>日報一覧</h1>

      <div style={{ display: "grid", gap: "12px", marginTop: "16px" }}>
        {reports.map((report) => (
          <div
            key={report.id}
            style={{
              border: "1px solid #ddd",
              borderRadius: "12px",
              padding: "12px",
            }}
          >
            <div><strong>日付:</strong> {report.report_date || "-"}</div>
            <div><strong>現場名:</strong> {report.site}</div>
            <div><strong>作業内容:</strong> {report.content}</div>
            <div><strong>作業時間:</strong> {report.hours || "-"}</div>
            <div><strong>人数:</strong> {report.workers || "-"}</div>
          </div>
        ))}
      </div>
    </main>
  );
}
