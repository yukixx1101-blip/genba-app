'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'

type Worker = {
  id: string
  name: string
}

export default function NewSchedule() {
  const [date, setDate] = useState('')
  const [site, setSite] = useState('')
  const [content, setContent] = useState('')
  const [memo, setMemo] = useState('')
  const [workerId, setWorkerId] = useState('')
  const [workers, setWorkers] = useState<Worker[]>([])

  useEffect(() => {
    fetchWorkers()
  }, [])

  const fetchWorkers = async () => {
    const { data, error } = await supabase
      .from('workers')
      .select('id, name')
      .order('name', { ascending: true })

    if (error) {
      alert('作業員の取得エラー: ' + error.message)
      return
    }

    setWorkers(data || [])
  }

  const handleSubmit = async () => {
    const { error } = await supabase.from('schedules').insert({
      date,
      site_name: site,
      work_content: content,
      memo,
      worker_id: workerId || null
    })

    if (error) {
      alert('エラー: ' + error.message)
      return
    }

    alert('登録完了')
    setDate('')
    setSite('')
    setContent('')
    setMemo('')
    setWorkerId('')
  }

  return (
    <div style={{ padding: 16, maxWidth: 600, margin: '0 auto' }}>
      <h1 style={{ fontSize: 24, fontWeight: 'bold', marginBottom: 16 }}>
        スケジュール登録
      </h1>

      <input
        type="date"
        value={date}
        onChange={(e) => setDate(e.target.value)}
        style={{
          width: '100%',
          padding: 12,
          marginBottom: 12,
          fontSize: 16,
          boxSizing: 'border-box'
        }}
      />

      <input
        placeholder="現場名"
        value={site}
        onChange={(e) => setSite(e.target.value)}
        style={{
          width: '100%',
          padding: 12,
          marginBottom: 12,
          fontSize: 16,
          boxSizing: 'border-box'
        }}
      />

      <input
        placeholder="作業内容"
        value={content}
        onChange={(e) => setContent(e.target.value)}
        style={{
          width: '100%',
          padding: 12,
          marginBottom: 12,
          fontSize: 16,
          boxSizing: 'border-box'
        }}
      />

      <select
        value={workerId}
        onChange={(e) => setWorkerId(e.target.value)}
        style={{
          width: '100%',
          padding: 12,
          marginBottom: 12,
          fontSize: 16,
          boxSizing: 'border-box'
        }}
      >
        <option value="">作業員を選択</option>
        {workers.map((worker) => (
          <option key={worker.id} value={worker.id}>
            {worker.name}
          </option>
        ))}
      </select>

      <textarea
        placeholder="メモ"
        value={memo}
        onChange={(e) => setMemo(e.target.value)}
        style={{
          width: '100%',
          padding: 12,
          marginBottom: 12,
          minHeight: 100,
          fontSize: 16,
          boxSizing: 'border-box'
        }}
      />

      <button
        onClick={handleSubmit}
        style={{
          width: '100%',
          padding: 12,
          borderRadius: 8,
          border: 'none',
          background: '#2563eb',
          color: '#fff',
          fontSize: 16
        }}
      >
        保存
      </button>
    </div>
  )
}