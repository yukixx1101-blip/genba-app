'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'

export default function NewSchedulePage() {
  const router = useRouter()

  const [date, setDate] = useState('')
  const [siteName, setSiteName] = useState('')
  const [workContent, setWorkContent] = useState('')
  const [memo, setMemo] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async () => {
    if (!date) {
      alert('日付を入力してください')
      return
    }

    if (!siteName.trim()) {
      alert('現場名を入力してください')
      return
    }

    if (!workContent.trim()) {
      alert('作業内容を入力してください')
      return
    }

    setLoading(true)

    const { error } = await supabase.from('schedules').insert({
      date,
      site_name: siteName,
      work_content: workContent,
      memo
    })

    setLoading(false)

    if (error) {
      alert('登録エラー: ' + error.message)
      return
    }

    alert('登録しました')
    router.push('/schedules')
  }

  return (
    <div
      style={{
        minHeight: '100vh',
        background: '#000000',
        padding: 12
      }}
    >
      <div style={{ maxWidth: 520, margin: '0 auto' }}>
        <div
          style={{
            background: '#464646',
            borderRadius: 20,
            padding: 16,
            color: '#ffffff',
            marginBottom: 12
          }}
        >
          <div style={{ fontSize: 22, fontWeight: 700 }}>
            予定登録
          </div>
          <div style={{ fontSize: 12, color: '#d1d5db', marginTop: 4 }}>
            New Schedule
          </div>
        </div>

        <div
          style={{
            background: '#808080',
            borderRadius: 20,
            padding: 12
          }}
        >
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            style={inputStyle}
          />

          <input
            type="text"
            placeholder="現場名"
            value={siteName}
            onChange={(e) => setSiteName(e.target.value)}
            style={inputStyle}
          />

          <textarea
            placeholder="作業内容"
            value={workContent}
            onChange={(e) => setWorkContent(e.target.value)}
            style={{
              ...inputStyle,
              minHeight: 110,
              resize: 'vertical'
            }}
          />

          <textarea
            placeholder="メモ"
            value={memo}
            onChange={(e) => setMemo(e.target.value)}
            style={{
              ...inputStyle,
              minHeight: 100,
              resize: 'vertical'
            }}
          />

          <button
            onClick={handleSubmit}
            disabled={loading}
            style={{
              width: '100%',
              padding: 12,
              borderRadius: 12,
              border: 'none',
              background: '#1f1f1f',
              color: '#ffffff',
              fontSize: 15,
              fontWeight: 700,
              opacity: loading ? 0.7 : 1
            }}
          >
            {loading ? '登録中...' : '登録'}
          </button>
        </div>
      </div>
    </div>
  )
}

const inputStyle: React.CSSProperties = {
  width: '100%',
  padding: 12,
  marginBottom: 12,
  fontSize: 16,
  boxSizing: 'border-box',
  borderRadius: 12,
  border: 'none',
  background: '#1f1f1f',
  color: '#ffffff'
}