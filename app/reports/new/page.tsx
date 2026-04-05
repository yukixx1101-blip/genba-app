"use client";
import { useState } from "react";
import { supabase } from "../../../lib/supabase";

export default function NewReportPage() {
  const [form, setForm] = useState({
    site: "",
    content: "",
    hours: "",
    workers: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    alert("ボタンOK");

    if (!form.site || !form.content) {
      alert("現場名と作業内容を入れてください");
      return;
    }

    const { error } = await supabase.from("reports").insert([
      {
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

      <input name="site" placeholder="現場名" value={form.site} onChange={handleChange} /><br /><br />
      <input name="content" placeholder="作業内容" value={form.content} onChange={handleChange} /><br /><br />
      <input name="hours" placeholder="作業時間" value={form.hours} onChange={handleChange} /><br /><br />
      <input name="workers" placeholder="人数" value={form.workers} onChange={handleChange} /><br /><br />

      <button onClick={handleSubmit}>保存</button>
    </main>
  );
}
