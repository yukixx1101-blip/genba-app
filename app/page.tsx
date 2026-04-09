"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";

type ScheduleItem = {
  id: string | number;
  work_date: string;
  worker_name: string;
  site_name?: string;
  work_type?: string;
};

export default function HomePage() {
  const [items, setItems] = useState<ScheduleItem[]>([]);
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());

  useEffect(() => {
    fetch("/api/schedules")
      .then((res) => res.json())
      .then((data) => {
        setItems(Array.isArray(data) ? data : []);
      })
      .catch((err) => {
        console.error("予定取得エラー:", err);
        setItems([]);
      });
  }, []);

  const workerColorMap = useMemo(() => {
    const workers = [...new Set(items.map((item) => item.worker_name).filter(Boolean))];

    const palette = [
      "#ef4444",
      "#f97316",
      "#eab308",
      "#22c55e",
      "#14b8a6",
      "#3b82f6",
      "#6366f1",
      "#a855f7",
      "#ec4899",
      "#84cc16",
      "#06b6d4",
      "#f43f5e",
    ];

    const map: Record<string, string> = {};

    workers.forEach((worker, index) => {
      map[worker] = palette[index % palette.length];
    });

    return map;
  }, [items]);

  const formatDateLocal = (date: Date) => {
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, "0");
    const d = String(date.getDate()).padStart(2, "0");
    return `${y}-${m}-${d}`;
  };

  const selectedDateStr = formatDateLocal(selectedDate);

  const selectedItems = items.filter((item) => item.work_date === selectedDateStr);

  return (
    <main style={{ padding: "16px", maxWidth: "1000px", margin: "0 auto" }}>
      <h1 style={{ fontSize: "24px", fontWeight: "bold", marginBottom: "16px" }}>
        現場スケジュール
      </h1>

      <div style={{ marginBottom: "16px", display: "flex", gap: "8px", flexWrap: "wrap" }}>
        <Link
          href="/new"
          style={{
            padding: "10px 14px",
            background: "#2563eb",
            color: "#fff",
            borderRadius: "8px",
            textDecoration: "none",
            fontWeight: "bold",
          }}
        >
          新規登録
        </Link>

        <Link
          href="/monthly"
          style={{
            padding: "10px 14px",
            background: "#16a34a",
            color: "#fff",
            borderRadius: "8px",
            textDecoration: "none",
            fontWeight: "bold",
          }}
        >
          月間まとめ
        </Link>
      </div>

      <div
        style={{
          background: "#fff",
          borderRadius: "12px",
          padding: "16px",
          boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
          marginBottom: "20px",
        }}
      >
        <Calendar
          locale="ja-JP"
          onChange={(value) => setSelectedDate(value as Date)}
          value={selectedDate}
          tileContent={({ date, view }) => {
            if (view !== "month") return null;

            const dateStr = formatDateLocal(date);
            const dayItems = items.filter((item) => item.work_date === dateStr);

            if (dayItems.length === 0) return null;

            return (
              <div style={{ marginTop: "4px", display: "flex", flexDirection: "column", gap: "2px" }}>
                {dayItems.slice(0, 3).map((item) => (
                  <div
                    key={item.id}
                    style={{
                      fontSize: "10px",
                      lineHeight: 1.2,
                      borderRadius: "4px",
                      padding: "1px 4px",
                      color: "#fff",
                      backgroundColor: workerColorMap[item.worker_name] || "#6b7280",
                      overflow: "hidden",
                      whiteSpace: "nowrap",
                      textOverflow: "ellipsis",
                    }}
                    title={`${item.worker_name} / ${item.site_name ?? ""}`}
                  >
                    {item.worker_name}
                  </div>
                ))}

                {dayItems.length > 3 && (
                  <div style={{ fontSize: "10px", color: "#666" }}>
                    +{dayItems.length - 3}件
                  </div>
                )}
              </div>
            );
          }}
        />
      </div>

      <div
        style={{
          background: "#fff",
          borderRadius: "12px",
          padding: "16px",
          boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
          marginBottom: "20px",
        }}
      >
        <h2 style={{ fontSize: "18px", fontWeight: "bold", marginBottom: "12px" }}>
          作業員カラー一覧
        </h2>

        {Object.keys(workerColorMap).length === 0 ? (
          <p>まだデータがありません</p>
        ) : (
          <div style={{ display: "flex", flexWrap: "wrap", gap: "10px" }}>
            {Object.entries(workerColorMap).map(([worker, color]) => (
              <div
                key={worker}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  background: "#f9fafb",
                  border: "1px solid #e5e7eb",
                  borderRadius: "999px",
                  padding: "6px 12px",
                }}
              >
                <span
                  style={{
                    width: "14px",
                    height: "14px",
                    borderRadius: "999px",
                    backgroundColor: color,
                    display: "inline-block",
                  }}
                />
                <span style={{ fontSize: "14px" }}>{worker}</span>
              </div>
            ))}
          </div>
        )}
      </div>

      <div
        style={{
          background: "#fff",
          borderRadius: "12px",
          padding: "16px",
          boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
        }}
      >
        <h2 style={{ fontSize: "18px", fontWeight: "bold", marginBottom: "12px" }}>
          {selectedDateStr} の予定
        </h2>

        {selectedItems.length === 0 ? (
          <p>予定はありません</p>
        ) : (
          <div style={{ display: "grid", gap: "10px" }}>
            {selectedItems.map((item) => (
              <div
                key={item.id}
                style={{
                  border: "1px solid #e5e7eb",
                  borderLeft: `8px solid ${workerColorMap[item.worker_name] || "#6b7280"}`,
                  borderRadius: "10px",
                  padding: "12px",
                  background: "#fff",
                }}
              >
                <div style={{ fontWeight: "bold", fontSize: "16px", marginBottom: "6px" }}>
                  {item.worker_name}
                </div>
                <div style={{ color: "#374151", fontSize: "14px", marginBottom: "4px" }}>
                  現場: {item.site_name || "-"}
                </div>
                <div style={{ color: "#374151", fontSize: "14px" }}>
                  作業内容: {item.work_type || "-"}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}