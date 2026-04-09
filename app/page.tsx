"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";

type RawItem = {
  id?: string | number;
  work_date?: string;
  date?: string;
  worker_name?: string;
  worker?: string;
  name?: string;
  site_name?: string;
  site?: string;
  genba?: string;
  work_type?: string;
  content?: string;
  description?: string;
};

type ScheduleItem = {
  id: string | number;
  work_date: string;
  worker_name: string;
  site_name: string;
  work_type: string;
};

export default function HomePage() {
  const [items, setItems] = useState<ScheduleItem[]>([]);
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());

  useEffect(() => {
    fetch("/api/schedules", { cache: "no-store" })
      .then((res) => res.json())
      .then((data) => {
        const list = Array.isArray(data) ? data : Array.isArray(data?.data) ? data.data : [];

        const normalized: ScheduleItem[] = list.map((item: RawItem, index: number) => ({
          id: item.id ?? index,
          work_date: item.work_date ?? item.date ?? "",
          worker_name: item.worker_name ?? item.worker ?? item.name ?? "未設定",
          site_name: item.site_name ?? item.site ?? item.genba ?? "-",
          work_type: item.work_type ?? item.content ?? item.description ?? "-",
        }));

        setItems(normalized.filter((item) => item.work_date));
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
    <main
      style={{
        padding: "16px",
        maxWidth: "1100px",
        margin: "0 auto",
        background: "#f3f4f6",
        minHeight: "100vh",
      }}
    >
      <h1
        style={{
          fontSize: "28px",
          fontWeight: "bold",
          marginBottom: "16px",
        }}
      >
        現場管理ホーム
      </h1>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
          gap: "12px",
          marginBottom: "20px",
        }}
      >
        <Link href="/new" style={menuCard("#2563eb")}>
          <div style={menuTitle}>スケジュール登録</div>
          <div style={menuText}>新しい予定を追加</div>
        </Link>

        <Link href="/monthly" style={menuCard("#16a34a")}>
          <div style={menuTitle}>月間まとめ</div>
          <div style={menuText}>月ごとの予定を確認</div>
        </Link>

        <Link href="/reports" style={menuCard("#ea580c")}>
          <div style={menuTitle}>日報一覧</div>
          <div style={menuText}>登録済みの日報を見る</div>
        </Link>

        <Link href="/reports/new" style={menuCard("#7c3aed")}>
          <div style={menuTitle}>日報作成</div>
          <div style={menuText}>新しい日報を登録</div>
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
        <h2 style={{ fontSize: "20px", fontWeight: "bold", marginBottom: "12px" }}>
          カレンダー
        </h2>

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
              <div
                style={{
                  marginTop: "4px",
                  display: "flex",
                  flexDirection: "column",
                  gap: "2px",
                }}
              >
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
                    title={`${item.worker_name} / ${item.site_name}`}
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
          <p>まだ予定データがありません</p>
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

const menuCard = (bg: string) => ({
  display: "block",
  background: bg,
  color: "#fff",
  borderRadius: "12px",
  padding: "16px",
  textDecoration: "none",
  boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
});

const menuTitle = {
  fontSize: "18px",
  fontWeight: "bold" as const,
  marginBottom: "6px",
};

const menuText = {
  fontSize: "13px",
  opacity: 0.95,
};