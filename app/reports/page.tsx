"use client";
import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabase";

export default function ReportsPage() {
  const [reports, setReports] = useState<any[]>([]);

  useEffect(() => {
    const fetchReports = async () => {
      const { data, error } = await supabase
        .from("reports")
        .select("*, workers(name), report_photos(photo_url)")
        .order("created_at", { ascending: false });

      if (error) {
        alert(error.message);
      } else {
        setReports(data || []);
      }
    };

    fetchReports();
  }, []);

  return (
    <main style={{ padding: "16px", maxWidth: "480px", margin: "0 auto" }}>
      <h1>日報一覧</h1>

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
            <div>日付: {r.report_date}</div>
            <div>作業員: {r.workers?.name || "-"}</div>
            <div>現場: {r.site}</div>
            <div>内容: {r.content}</div>
            <div>時間: {r.hours}</div>
            <div>人数: {r.workers}</div>

            {r.report_photos && r.report_photos.length > 0 && (
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: "8px",
                  marginTop: "10px",
                }}
              >
                {r.report_photos.map((p: any, index: number) => (
                  <img
                    key={index}
                    src={p.photo_url}
                    alt={`現場写真 ${index + 1}`}
                    style={{
                      width: "100%",
                      borderRadius: "8px",
                    }}
                  />
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </main>
  );
}