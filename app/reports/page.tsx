"use client";
import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabase";
import { useRouter } from "next/navigation";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

export default function ReportsPage() {
  const [reports, setReports] = useState<any[]>([]);
  const router = useRouter();

  const fetchReports = async () => {
    const { data, error } = await supabase
      .from("reports")
      .select(`
        *,
        worker:workers(name)
      `)
      .order("created_at", { ascending: false });

    if (error) {
      alert(error.message);
    } else {
      setReports(data || []);
    }
  };

  useEffect(() => {
    fetchReports();
  }, []);

  const handleDelete = async (id: number) => {
    if (!confirm("削除しますか？")) return;

    const { error } = await supabase
      .from("reports")
      .delete()
      .eq("id", id);

    if (error) {
      alert("削除エラー: " + error.message);
    } else {
      alert("削除しました");
      fetchReports();
    }
  };

  const handlePdf = (report: any) => {
    const doc = new jsPDF();

    doc.setFontSize(18);
    doc.text("日報", 14, 20);

    autoTable(doc, {
      startY: 30,
      head: [["項目", "内容"]],
      body: [
        ["日付", report.report_date || "-"],
        ["作業員", report.worker?.name || "-"],
        ["現場", report.site || "-"],
        ["作業内容", report.content || "-"],
        ["作業時間", report.hours || "-"],
        ["人数", report.workers || "-"],
      ],
    });

    doc.save(`report-${report.id}.pdf`);
  };

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
            <div>作業員: {r.worker?.name || "-"}</div>
            <div>現場: {r.site}</div>
            <div>内容: {r.content}</div>
            <div>時間: {r.hours}</div>
            <div>人数: {r.workers}</div>

            <div style={{ marginTop: "10px", display: "grid", gap: "8px" }}>
              <button
                onClick={() => router.push(`/reports/edit/${r.id}`)}
                style={{
                  padding: "10px",
                  background: "#333",
                  color: "#fff",
                  border: "none",
                  borderRadius: "8px",
                }}
              >
                編集
              </button>

              <button
                onClick={() => handleDelete(r.id)}
                style={{
                  padding: "10px",
                  background: "red",
                  color: "#fff",
                  border: "none",
                  borderRadius: "8px",
                }}
              >
                削除
              </button>

              <button
                onClick={() => handlePdf(r)}
                style={{
                  padding: "10px",
                  background: "#0066cc",
                  color: "#fff",
                  border: "none",
                  borderRadius: "8px",
                }}
              >
                PDF出力
              </button>
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}