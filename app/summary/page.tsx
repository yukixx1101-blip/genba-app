"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

type RawSchedule = {
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

export default function SummaryPage() {
  const [items, setItems] = useState<ScheduleItem[]>([]);
  const [month, setMonth] = useState(() => {
    const now = new Date();
    const y = now.getFullYear();
    const m = String(now.getMonth() + 1).padStart(2, "0");
    return `${y}-${m}`;
  });

  useEffect(() => {
    fetch("/api/schedules", { cache: "no-store" })
      .then((res) => res.json())
      .then((data) => {
        const list = Array.isArray(data)
          ? data
          : Array.isArray(data?.data)
          ? data.data
          : [];

        const normalized: ScheduleItem[] = list.map(
          (item: RawSchedule, index: number) => ({
            id: item.id ?? index,
            work_date: item.work_date ?? item.date ?? "",
            worker_name: item.worker_name ?? item.worker ?? item.name ?? "未設定",
            site_name: item.site_name ?? item.site ?? item.genba ?? "-",
            work_type: item.work_type ?? item.content ?? item.description ?? "-",
          })
        );

        setItems(normalized.filter((item) => item.work_date));
      })
      .catch((err) => {
        console.error("予定取得エラー:", err);
        setItems([]);
      });
  }, []);

  const filteredItems = useMemo(() => {
    return items.filter((item) => item.work_date.startsWith(month));
  }, [items, month]);

  const groupedByWorker = useMemo(() => {
    const map: Record<string, ScheduleItem[]> = {};

    filteredItems.forEach((item) => {
      if (!map[item.worker_name]) {
        map[item.worker_name] = [];
      }
      map[item.worker_name].push(item);
    });

    return map;
  }, [filteredItems]);

  return (
    <main
      style={{
        maxWidth: "1000px",
        margin: "0 auto",
        padding: "16px",
        minHeight: "100vh",
        background: "#f3f4f6",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "16px",
          gap: "12px",
          flexWrap: "wrap",
        }}
      >
        <h1 style={{ fontSize: "24px", fontWeight: "bold" }}>月間まとめ</h1>

        <div style={{ display: "flex", gap: "8px", alignItems: "center", flexWrap: "wrap" }}>
          <input
            type="month"
            value={month}
            onChange={(e) => setMonth(e.target.value)}
            style={{
              padding: "10px 12px",
              borderRadius: "8px",
              border: "1px solid #d1d5db",
              background: "#fff",
              fontSize: "16px",
            }}
          />

          <Link
            href="/"
            style={{
              textDecoration: "none",
              background: "#6b7280",
              color: "#fff",
              padding: "10px 12px",
              borderRadius: "8px",
            }}
          >
            ホームへ
          </Link>
        </div>
      </div>

      <div
        style={{
          background: "#fff",
          borderRadius: "12px",
          padding: "16px",
          boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
        }}
      >
        {filteredItems.length === 0 ? (
          <p>この月の予定はありません</p>
        ) : (
          <div style={{ display: "grid", gap: "16px" }}>
            {Object.entries(groupedByWorker).map(([worker, workerItems]) => (
              <div
                key={worker}
                style={{
                  border: "1px solid #e5e7eb",
                  borderRadius: "12px",
                  padding: "14px",
                  background: "#fafafa",
                }}
              >
                <div style={{ fontSize: "18px", fontWeight: "bold", marginBottom: "10px" }}>
                  {worker}（{workerItems.length}件）
                </div>

                <div style={{ display: "grid", gap: "8px" }}>
                  {workerItems
                    .slice()
                    .sort((a, b) => a.work_date.localeCompare(b.work_date))
                    .map((item) => (
                      <div
                        key={item.id}
                        style={{
                          background: "#fff",
                          border: "1px solid #e5e7eb",
                          borderRadius: "10px",
                          padding: "10px 12px",
                        }}
                      >
                        <div style={{ fontWeight: "bold", marginBottom: "4px" }}>
                          {item.work_date}
                        </div>
                        <div style={{ fontSize: "14px", color: "#374151", marginBottom: "2px" }}>
                          現場: {item.site_name || "-"}
                        </div>
                        <div style={{ fontSize: "14px", color: "#374151" }}>
                          作業内容: {item.work_type || "-"}
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}