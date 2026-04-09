'use client'

import Link from 'next/link'

export default function Home() {
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
            marginBottom: 20,
            borderRadius: 10,
            border: 'none',
            background: '#16a34a',
            color: '#fff',
            fontSize: 16
          }}
        >
          日報登録
        </button>
      </Link><Link href="/photos">
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