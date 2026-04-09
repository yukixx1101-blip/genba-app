'use client'

import { useState } from 'react'
import { supabase } from '@/lib/supabase'

export default function NewSchedule() {
  const [date, setDate] = useState('')
  const [site, setSite] = useState('')
  const [content, setContent] = useState('')
  const [memo, setMemo] = useState('')

  const handleSubmit = async () => {
    const { error } = await supabase.from('schedules').insert({
      date,
      site_name: site,
      work_content: content,
      memo
    })

    if (error) {
      alert('エラー: ' + error.message)
    } else {
      alert('登録完了')
    }
  }

  return (
    <div style={{ padding: 16 }}>
      <h1>スケジュール登録</h1>

      <input type="date" onChange={e => setDate(e.target.value)} />
      <br />

      <input placeholder="現場名" onChange={e => setSite(e.target.value)} />
      <br />

      <input placeholder="作業内容" onChange={e => setContent(e.target.value)} />
      <br />

      <textarea placeholder="メモ" onChange={e => setMemo(e.target.value)} />
      <br />

      <button onClick={handleSubmit}>保存</button>
    </div>
  )
}