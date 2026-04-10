'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'

export default function Home() {
  const [message, setMessage] = useState('')

  useEffect(() => {
    const channel = supabase
      .channel('realtime-home-notify')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'reports' },
        (payload) => {
          if (payload.eventType === 'INSERT') {
            setMessage('日報が追加されました')
          }
          if (payload.eventType === 'UPDATE') {
            setMessage('日報が更新されました')
          }
          if (payload.eventType === 'DELETE') {
            setMessage('日報が削除されました')
          }
        }
      )
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'schedules' },
        (payload) => {
          if (payload.eventType === 'INSERT') {
            setMessage('スケジュールが追加されました')
          }
          if (payload.eventType === 'UPDATE') {
            setMessage('スケジュールが更新されました')
          }
          if (payload.eventType === 'DELETE') {
            setMessage('スケジュールが削除されました')
          }
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [])

  useEffect(() => {
    if (!message) return
    const timer = setTimeout(() => setMessage(''), 3000)
    return () => clearTimeout(timer)
  }, [message])

  const today = new Date().toLocaleDateString('ja-JP', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })

  return (
    <div style={{ background: '#000', minHeight: '100vh', padding: 12 }}>
      <div style={{ maxWidth: 520, margin: '0 auto' }}>

        {/* メイン枠 */}
        <div style={{
          background: '#464646',
          borderRadius: 20,
          padding: 16,
          marginBottom: 12
        }}>
          <div style={{ color: '#fff', fontSize: 20, fontWeight: 700 }}>
            株式会社 玄
          </div>
          <div style={{ color: '#d1d5db', fontSize: 12 }}>
            今日もお疲れ様です。
          </div>
          <div style={{ color: '#9ca3af', fontSize: 12, marginTop: 4 }}>
            {today}
          </div>
        </div>

        {/* 通知 */}
        {message && (
          <div style={{
            background: '#808080',
            borderRadius: 12,
            padding: 10,
            marginBottom: 12,
            color: '#fff',
            fontSize: 13
          }}>
            {message}
          </div>
        )}

        {/* メニュー */}
        <div style={{
          background: '#808080',
          borderRadius: 16,
          padding: 10,
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: 8
        }}>
          <Menu href="/reports" title="日報一覧" en="Reports" />
          <Menu href="/reports/new" title="日報登録" en="Create" />
          <Menu href="/schedules" title="予定一覧" en="Schedules" />
          <Menu href="/schedules/calendar" title="カレンダー" en="Calendar" />
          <Menu href="/photos" title="写真一覧" en="Photos" />
          <Menu href="/workers" title="作業員管理" en="Workers" />
        </div>

      </div>
    </div>
  )
}

function Menu({ href, title, en }: any) {
  return (
    <Link href={href} style={{ textDecoration: 'none' }}>
      <div style={{
        background: '#1f1f1f',
        borderRadius: 14,
        padding: 14,
        color: '#fff'
      }}>
        <div style={{ fontSize: 14, fontWeight: 700 }}>{title}</div>
        <div style={{ fontSize: 11, color: '#9ca3af' }}>{en}</div>
      </div>
    </Link>
  )
}