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
            setMessage('📄 日報が追加されました')
          }
          if (payload.eventType === 'UPDATE') {
            setMessage('✏️ 日報が更新されました')
          }
          if (payload.eventType === 'DELETE') {
            setMessage('🗑 日報が削除されました')
          }
        }
      )
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'schedules' },
        (payload) => {
          if (payload.eventType === 'INSERT') {
            setMessage('📅 スケジュールが追加されました')
          }
          if (payload.eventType === 'UPDATE') {
            setMessage('✏️ スケジュールが更新されました')
          }
          if (payload.eventType === 'DELETE') {
            setMessage('🗑 スケジュールが削除されました')
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

    const timer = setTimeout(() => {
      setMessage('')
    }, 3000)

    return () => clearTimeout(timer)
  }, [message])

  return (
    <div
      style={{
        padding: 16,
        maxWidth: 600,
        margin: '0 auto'
      }}
    >
      <h1
        style={{
          fontSize: 24,
          fontWeight: 'bold',
          marginBottom: 20
        }}
      >
        現場管理アプリ
      </h1>

      {message && (
        <div
          style={{
            background: '#fef3c7',
            padding: 12,
            borderRadius: 8,
            marginBottom: 16,
            fontSize: 14,
            fontWeight: 'bold'
          }}
        >
          {message}
        </div>
      )}

      <Link href="/reports">
        <button
          style={{
            width: '100%',
            padding: 14,
            marginBottom: 12,
            borderRadius: 10,
            border: 'none',
            background: '#2563eb',
            color: '#fff',
            fontSize: 16
          }}
        >
          日報一覧
        </button>
      </Link>

      <Link href="/reports/new">
        <button
          style={{
            width: '100%',
            padding: 14,
            marginBottom: 12,
            borderRadius: 10,
            border: 'none',
            background: '#16a34a',
            color: '#fff',
            fontSize: 16
          }}
        >
          日報登録
        </button>
      </Link>

      <Link href="/photos">
        <button
          style={{
            width: '100%',
            padding: 14,
            marginBottom: 12,
            borderRadius: 10,
            border: 'none',
            background: '#0ea5e9',
            color: '#fff',
            fontSize: 16
          }}
        >
          写真一覧
        </button>
      </Link>

      <Link href="/schedules">
        <button
          style={{
            width: '100%',
            padding: 14,
            marginBottom: 12,
            borderRadius: 10,
            border: 'none',
            background: '#f59e0b',
            color: '#fff',
            fontSize: 16
          }}
        >
          スケジュール一覧
        </button>
      </Link>

      <Link href="/schedules/new">
        <button
          style={{
            width: '100%',
            padding: 14,
            marginBottom: 12,
            borderRadius: 10,
            border: 'none',
            background: '#ef4444',
            color: '#fff',
            fontSize: 16
          }}
        >
          スケジュール登録
        </button>
      </Link>

      <Link href="/schedules/calendar">
        <button
          style={{
            width: '100%',
            padding: 14,
            marginBottom: 12,
            borderRadius: 10,
            border: 'none',
            background: '#8b5cf6',
            color: '#fff',
            fontSize: 16
          }}
        >
          スケジュールカレンダー
        </button>
      </Link>
    </div>
  )
}