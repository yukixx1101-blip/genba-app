"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";

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

export default function HomePage() {
  const [items, setItems] = useState<ScheduleItem[]>([]);
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());

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
      .catch(() => setItems([]));
  }, []);

  const workerColorMap = useMemo(() => {
    const workers = [...new Set(items.map((i) => i.worker_name))];
    const colors = [
      "#ef4444","#f97316","#eab308","#22c55e","#14b8a6",
      "#3b82f6","#6366f1","#a855f7","#ec4899","#84cc16",
    ];
    const map: Record<string,string> = {};
    workers.forEach((w,i)=>{ map[w]=colors[i%colors.length]; });
    return map;
  }, [items]);

  const format = (d: Date) =>
    `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,"0")}-${String(d.getDate()).padStart(2,"0")}`;

  const selected = format(selectedDate);
  const selectedItems = items.filter(i => i.work_date === selected);

  return (
    <main style={{ padding:16, maxWidth:1100, margin:"0 auto", background:"#f3f4f6", minHeight:"100vh" }}>
      <h1 style={{ fontSize:28, fontWeight:"bold", marginBottom:16 }}>現場管理ホーム</h1>

      {/* メニュー */}
      <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(180px,1fr))", gap:12, marginBottom:20 }}>
        <Link href="/schedules/new" style={menu("#2563eb")}>
          <div style={title}>スケジュール登録</div>
          <div style={text}>新しい予定を追加</div>
        </Link>

        <Link href="/summary" style={menu("#16a34a")}>
          <div style={title}>月間まとめ</div>
          <div style={text}>月ごとの予定</div>
        </Link>

        <Link href="/reports" style={menu("#ea580c")}>
          <div style={title}>日報一覧</div>
          <div style={text}>日報を見る</div>
        </Link>

        <Link href="/reports/new" style={menu("#7c3aed")}>
          <div style={title}>日報作成</div>
          <div style={text}>日報を登録</div>
        </Link>
      </div>

      {/* カレンダー */}
      <div style={card}>
        <h2 style={h2}>カレンダー</h2>
        <Calendar
          locale="ja-JP"
          onChange={(v)=>setSelectedDate(v as Date)}
          value={selectedDate}
          tileContent={({date,view})=>{
            if(view!=="month") return null;
            const ds = format(date);
            const list = items.filter(i=>i.work_date===ds);
            if(!list.length) return null;

            return (
              <div style={{ marginTop:4 }}>
                {list.slice(0,3).map(i=>(
                  <div key={i.id} style={{
                    fontSize:10,
                    background:workerColorMap[i.worker_name],
                    color:"#fff",
                    borderRadius:4,
                    padding:"1px 4px",
                    marginBottom:2
                  }}>
                    {i.worker_name}
                  </div>
                ))}
              </div>
            );
          }}
        />
      </div>

      {/* 予定一覧 */}
      <div style={card}>
        <h2 style={h2}>{selected} の予定</h2>
        {!selectedItems.length ? (
          <p>予定なし</p>
        ) : (
          <div style={{ display:"grid", gap:10 }}>
            {selectedItems.map(i=>(
              <div key={i.id} style={{
                border:"1px solid #e5e7eb",
                borderLeft:`6px solid ${workerColorMap[i.worker_name]}`,
                borderRadius:10,
                padding:12
              }}>
                <div style={{ fontWeight:"bold" }}>{i.worker_name}</div>
                <div>現場: {i.site_name}</div>
                <div>内容: {i.work_type}</div>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}

const menu = (bg:string)=>({
  display:"block",
  background:bg,
  color:"#fff",
  borderRadius:12,
  padding:16,
  textDecoration:"none"
});

const title = { fontSize:18, fontWeight:"bold" as const };
const text = { fontSize:13 };

const card = {
  background:"#fff",
  borderRadius:12,
  padding:16,
  marginBottom:20
};

const h2 = { fontSize:20, fontWeight:"bold", marginBottom:12 };
