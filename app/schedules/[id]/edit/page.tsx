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
    const { data } = await supabase
      .from('schedules')
      .select('*')
      .eq('id', id)
      .single()

    if (data) {
      setDate(data.date)
      setSite(data.site_name)
      setContent(data.work_content)
      setMemo(data.memo)
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
      alert('更新エラー')
      return
    }

    alert('更新完了')
    router.push('/schedules')
  }

  return (
    <div style={{ padding: 16, maxWidth: 600, margin: '0 auto' }}>
      <h1 style={{ fontSize: 24, marginBottom: 16 }}>
        スケジュール編集
      </h1>

      <input type="date" value={date} onChange={(e) => setDate(e.target.value)} />
      <br />

      <input value={site} onChange={(e) => setSite(e.target.value)} placeholder="現場名" />
      <br />

      <input value={content} onChange={(e) => setContent(e.target.value)} placeholder="作業内容" />
      <br />

      <textarea value={memo} onChange={(e) => setMemo(e.target.value)} placeholder="メモ" />
      <br />

      <button onClick={handleUpdate}>更新</button>
    </div>
  )
}