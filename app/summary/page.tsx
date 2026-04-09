"use client";
import { useEffect, useMemo, useState } from "react";
import { supabase } from "../../lib/supabase";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

export default function SummaryPage() {
  const [reports, setReports] = useState<any[]>([]);
  const [month, setMonth] = useState(() => {
    const now = new Date();
    return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;
  });

  useEffect(() => {
    const fetchReports = async () => {
      const { data, error } = await supabase
        .from("reports")
        .select(`
          *,
          worker:workers(name)
        `)
        .order("report_date", { ascending: false });

      if (error) {
        alert(error.message);
      } else {
        setReports(data || []);
      }
    };

    fetchReports();
  }, []);

  const grouped = useMemo(() => {
    const filtered = reports.filter((r) => {
      if (!r.report_date) return false;
      return String(r.report_date).startsWith(month);
    });

    const map: Record<string, { count: number; totalHours: number; totalPeople: number }> = {};

    for (const r of filtered) {
      const workerName = r.worker?.name || "未設定";
      const hours = Number(r.hours || 0);
      const people = Number(r.workers || 0);

      if (!map[workerName]) {
        map[workerName] = {
          count: 0,
          totalHours: 0,
          totalPeople: 0,
        };
      }

      map[workerName].count += 1;
      map[workerName].totalHours += hours;
      map[workerName].totalPeople += people;
    }

    return Object.entries(map).map(([name, value]) => ({
      name,
      count: value.count,
      totalHours: value.totalHours,
      totalPeople: value.totalPeople,
    }));
  }, [reports, month]);

  const handlePdf = () => {
    const doc = new jsPDF();

    doc.setFontSize(18);
    doc.text(`作業員別月間まとめ ${month}`, 14, 20);

    autoTable(doc, {
      startY: 30,
      head: [["作業員", "件数", "合計時間", "合計人数"]],
      body: grouped.map((g) => [
        g.name,
        String(g.count),
        String(g.totalHours),
        String(g.totalPeople),
      ]),
    });

    doc.save(`summary-${month}.pdf`);
  };

  return (
    <main style={{ padding: "16px", maxWidth: "560px", margin: "0 auto" }}>
      <h1>作業員別 月間まとめ</h1>

      <div style={{ marginBottom: "16px", display: "grid", gap: "10px" }}>
        <input
          type="month"
          value={month}
          onChange={(e) => setMonth(e.target.value)}
          style={{ padding: "12px", fontSize: "16px" }}
        />

        <button
          onClick={handlePdf}
          style={{
            padding: "12px",
            background: "#0066cc",
            color: "#fff",
            border: "none",
            borderRadius: "8px",
          }}
        >
          この月のまとめをPDF出力
        </button>
      </div>

      <div style={{ display: "grid", gap: "12px" }}>
        {grouped.length === 0 ? (
          <div>データがありません</div>
        ) : (
          grouped.map((g) => (
            <div
              key={g.name}
              style={{
                border: "1px solid #ccc",
                borderRadius: "10px",
                padding: "12px",
                background: "#fff",
              }}
            >
              <div><strong>作業員:</strong> {g.name}</div>
              <div><strong>件数:</strong> {g.count}</div>
              <div><strong>合計時間:</strong> {g.totalHours}</div>
              <div><strong>合計人数:</strong> {g.totalPeople}</div>
            </div>
          ))
        )}
      </div>
    </main>
  );
}
