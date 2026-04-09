"use client";
import { useState } from "react";
import { supabase } from "../../../lib/supabase";

export default function NewReportPage() {
  const [form, setForm] = useState({
    report_date: "",
    site: "",
    content: "",
    hours: "",
    workers: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    if (!form.report_date || !form.site || !form.content) {
      alert("日付・現場名・作業内容を入れてください");
      return;
    }

    const { error } = await supabase.from("reports").insert([
      {
        report_date: form.report_date,
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
        site: "",
        content: "",
        hours: "",
        workers: "",
      });
    }
  };

  return (
    <main
      style={{
        padding: "16px",
        maxWidth: "480px",
        margin: "0 auto",
        fontFamily: "sans-serif",
      }}
    >
      <h1 style={{ fontSize: "28px", marginBottom: "16px" }}>日報入力</h1>

      <div style={{ display: "grid", gap: "12px" }}>
        <input
          type="date"
          name="report_date"
          value={form.report_date}
          onChange={handleChange}
          style={{
            padding: "14px",
            fontSize: "16px",
            borderRadius: "10px",
            border: "1px solid #ccc",
          }}
        />

        <input
          name="site"
          placeholder="現場名"
          value={form.site}
          onChange={handleChange}
          style={{
            padding: "14px",
            fontSize: "16px",
            borderRadius: "10px",
            border: "1px solid #ccc",
          }}
        />

        <input
          name="content"
          placeholder="作業内容"
          value={form.content}
          onChange={handleChange}
          style={{
            padding: "14px",
            fontSize: "16px",
            borderRadius: "10px",
            border: "1px solid #ccc",
          }}
        />

        <input
          name="hours"
          placeholder="作業時間"
          value={form.hours}
          onChange={handleChange}
          style={{
            padding: "14px",
            fontSize: "16px",
            borderRadius: "10px",
            border: "1px solid #ccc",
          }}
        />

        <input
          name="workers"
          placeholder="人数"
          value={form.workers}
          onChange={handleChange}
          style={{
            padding: "14px",
            fontSize: "16px",
            borderRadius: "10px",
            border: "1px solid #ccc",
          }}
        />

        <button
          type="button"
          onClick={handleSubmit}
          style={{
            padding: "16px",
            fontSize: "18px",
            borderRadius: "12px",
            border: "none",
            backgroundColor: "#111",
            color: "#fff",
            fontWeight: "bold",
          }}
        >
          保存する
        </button>
      </div>
    </main>
  );
}