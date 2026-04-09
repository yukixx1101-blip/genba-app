'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'

export default function EditSchedule() {
  const params = useParams()
  const router = useRouter()
  const id = params.id as string

  const [date, setDate] = useState('')
  const [site, setSite] = useState('')
  const [content, setContent] = useState('')
  const [memo, setMemo] = useState('')

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    const { data, error } = await supabase
      .from('schedules')
      .select('*')
      .eq('id', id)
      .single()

    if (error) {
      alert('取得エラー: ' + error.message)
      return
    }

    if (data) {
      setDate(data.date || '')
      setSite(data.site_name || '')
      setContent(data.work_content || '')
      setMemo(data.memo || '')
    }
  }

  const handleUpdate = async () => {
    const { error } = await supabase
      .from('schedules')
      .update({
        date,
        site_name: site,
        work_content: content,
        memo
      })
      .eq('id', id)

    if (error) {
      alert('更新エラー: ' + error.message)
      return
    }

    alert('更新完了')
    router.push('/schedules')
  }

  return (
    <div style={{ padding: 16, maxWidth: 600, margin: '0 auto' }}>
      <h1 style={{ fontSize: 24, fontWeight: 'bold', marginBottom: 16 }}>
        スケジュール編集
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
        value={site}
        onChange={(e) => setSite(e.target.value)}
        placeholder="現場名"
        style={{
          width: '100%',
          padding: 12,
          marginBottom: 12,
          fontSize: 16,
          boxSizing: 'border-box'
        }}
      />

      <input
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="作業内容"
        style={{
          width: '100%',
          padding: 12,
          marginBottom: 12,
          fontSize: 16,
          boxSizing: 'border-box'
        }}
      />

      <textarea
        value={memo}
        onChange={(e) => setMemo(e.target.value)}
        placeholder="メモ"
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
        onClick={handleUpdate}
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
        更新
      </button>
    </div>
  )
}