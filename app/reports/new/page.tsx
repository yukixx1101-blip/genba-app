"use client";
import { useState, useEffect } from "react";
import { supabase } from "../../../lib/supabase";

export default function NewReportPage() {
  const [workers, setWorkers] = useState<any[]>([]);

  const [form, setForm] = useState({
    report_date: "",
    worker_id: "",
    site: "",
    content: "",
    hours: "",
    workers: "",
  });

  useEffect(() => {
    const fetchWorkers = async () => {
      const { data } = await supabase.from("workers").select("*");
      setWorkers(data || []);
    };
    fetchWorkers();
  }, []);

  const handleChange = (e: any) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    if (!form.report_date || !form.worker_id || !form.site || !form.content) {
      alert("日付・作業員・現場名・作業内容を入れてください");
      return;
    }

    const { error } = await supabase.from("reports").insert([
      {
        report_date: form.report_date,
        worker_id: Number(form.worker_id),
        site: form.site,
        content: form.content,
        hours: form.hours,
        workers: form.workers,
      },
    ]);

    if (error) {
      alert("エラー: " + error.message);
    } else {
      alert("保存しました！");
      setForm({
        report_date: "",
        worker_id: "",
        site: "",
        content: "",
        hours: "",
        workers: "",
      });
    }
  };

  return (
    <main style={{ padding: "16px", maxWidth: "480px", margin: "0 auto" }}>
      <h1>日報入力</h1>

      <div style={{ display: "grid", gap: "12px" }}>
        <input
          type="date"
          name="report_date"
          value={form.report_date}
          onChange={handleChange}
          style={{ padding: "12px" }}
        />

        {/* 作業員選択 */}
        <select
          name="worker_id"
          value={form.worker_id}
          onChange={handleChange}
          style={{ padding: "12px" }}
        >
          <option value="">作業員を選択</option>
          {workers.map((w) => (
            <option key={w.id} value={w.id}>
              {w.name}
            </option>
          ))}
        </select>

        <input
          name="site"
          placeholder="現場名"
          value={form.site}
          onChange={handleChange}
          style={{ padding: "12px" }}
        />

        <input
          name="content"
          placeholder="作業内容"
          value={form.content}
          onChange={handleChange}
          style={{ padding: "12px" }}
        />

        <input
          name="hours"
          placeholder="作業時間"
          value={form.hours}
          onChange={handleChange}
          style={{ padding: "12px" }}
        />

        <input
          name="workers"
          placeholder="人数"
          value={form.workers}
          onChange={handleChange}
          style={{ padding: "12px" }}
        />

        <button onClick={handleSubmit} style={{ padding: "14px" }}>
          保存
        </button>
      </div>
    </main>
  );
}
