'use client'

import Link from 'next/link'
import { useEffect, useMemo, useState } from 'react'
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

  const today = useMemo(() => {
    return new Date().toLocaleDateString('ja-JP', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      weekday: 'long'
    })
  }, [])

  const quickLinks = [
    {
      href: '/reports',
      title: '日報一覧',
      sub: '登録済みの日報を確認',
      bg: 'linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)',
      icon: '📄'
    },
    {
      href: '/reports/new',
      title: '日報登録',
      sub: '新しい日報を追加',
      bg: 'linear-gradient(135deg, #16a34a 0%, #15803d 100%)',
      icon: '📝'
    },
    {
      href: '/photos',
      title: '写真一覧',
      sub: '現場写真を確認',
      bg: 'linear-gradient(135deg, #0ea5e9 0%, #0284c7 100%)',
      icon: '📷'
    },
    {
      href: '/schedules',
      title: 'スケジュール一覧',
      sub: '予定をまとめて確認',
      bg: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
      icon: '📅'
    },
    {
      href: '/schedules/new',
      title: 'スケジュール登録',
      sub: '新しい予定を追加',
      bg: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
      icon: '➕'
    },
    {
      href: '/schedules/calendar',
      title: 'スケジュールカレンダー',
      sub: '月表示で予定を見る',
      bg: 'linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)',
      icon: '🗓️'
    }
  ]

  const cards = [
    {
      title: '日報',
      value: 'Report',
      sub: '写真付きで管理',
      icon: '📄'
    },
    {
      title: '予定',
      value: 'Schedule',
      sub: '登録・一覧・確認',
      icon: '📅'
    },
    {
      title: '写真',
      value: 'Photo',
      sub: '現場の記録を保存',
      icon: '📷'
    },
    {
      title: '通知',
      value: 'Realtime',
      sub: '変更をすぐ反映',
      icon: '🔔'
    }
  ]

  return (
    <div
      style={{
        minHeight: '100vh',
        background:
          'linear-gradient(180deg, #f8fafc 0%, #eef2ff 50%, #f8fafc 100%)',
        padding: 16
      }}
    >
      <div
        style={{
          maxWidth: 1100,
          margin: '0 auto'
        }}
      >
        <div
          style={{
            background:
              'linear-gradient(135deg, #0f172a 0%, #1e293b 55%, #334155 100%)',
            borderRadius: 24,
            padding: 24,
            color: '#fff',
            boxShadow: '0 20px 40px rgba(15, 23, 42, 0.18)',
            marginBottom: 20
          }}
        >
          <div
            style={{
              fontSize: 13,
              color: '#cbd5e1',
              marginBottom: 8,
              letterSpacing: '0.08em'
            }}
          >
            GENBA DASHBOARD
          </div>

          <h1
            style={{
              fontSize: 30,
              fontWeight: 'bold',
              margin: 0,
              lineHeight: 1.3
            }}
          >
            現場管理アプリ
          </h1>

          <p
            style={{
              marginTop: 10,
              marginBottom: 0,
              color: '#e2e8f0',
              fontSize: 15,
              lineHeight: 1.7
            }}
          >
            日報・写真・スケジュールをひとまとめで管理
          </p>

          <div
            style={{
              marginTop: 18,
              display: 'inline-block',
              background: 'rgba(255,255,255,0.1)',
              border: '1px solid rgba(255,255,255,0.15)',
              borderRadius: 9999,
              padding: '8px 14px',
              fontSize: 14,
              color: '#f8fafc'
            }}
          >
            {today}
          </div>
        </div>

        {message && (
          <div
            style={{
              background: 'linear-gradient(135deg, #fef3c7 0%, #fde68a 100%)',
              color: '#78350f',
              padding: 14,
              borderRadius: 16,
              marginBottom: 20,
              fontSize: 14,
              fontWeight: 'bold',
              boxShadow: '0 10px 24px rgba(245, 158, 11, 0.15)',
              border: '1px solid #fcd34d'
            }}
          >
            {message}
          </div>
        )}

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
            gap: 14,
            marginBottom: 20
          }}
        >
          {cards.map((card) => (
            <div
              key={card.title}
              style={{
                background: '#ffffff',
                borderRadius: 20,
                padding: 18,
                boxShadow: '0 10px 30px rgba(15, 23, 42, 0.06)',
                border: '1px solid #e5e7eb'
              }}
            >
              <div
                style={{
                  fontSize: 28,
                  marginBottom: 10
                }}
              >
                {card.icon}
              </div>

              <div
                style={{
                  fontSize: 13,
                  color: '#64748b',
                  marginBottom: 6
                }}
              >
                {card.title}
              </div>

              <div
                style={{
                  fontSize: 22,
                  fontWeight: 'bold',
                  color: '#0f172a',
                  marginBottom: 6
                }}
              >
                {card.value}
              </div>

              <div
                style={{
                  fontSize: 13,
                  color: '#94a3b8'
                }}
              >
                {card.sub}
              </div>
            </div>
          ))}
        </div>

        <div
          style={{
            background: '#ffffff',
            borderRadius: 24,
            padding: 18,
            boxShadow: '0 16px 36px rgba(15, 23, 42, 0.07)',
            border: '1px solid #e5e7eb'
          }}
        >
          <div
            style={{
              marginBottom: 16
            }}
          >
            <h2
              style={{
                fontSize: 20,
                fontWeight: 'bold',
                color: '#0f172a',
                margin: 0
              }}
            >
              クイックメニュー
            </h2>
            <p
              style={{
                marginTop: 6,
                marginBottom: 0,
                fontSize: 14,
                color: '#64748b'
              }}
            >
              よく使う機能へすぐ移動できます
            </p>
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
              gap: 14
            }}
          >
            {quickLinks.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                style={{
                  textDecoration: 'none'
                }}
              >
                <div
                  style={{
                    background: item.bg,
                    borderRadius: 20,
                    padding: 18,
                    color: '#fff',
                    minHeight: 120,
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    boxShadow: '0 12px 24px rgba(15, 23, 42, 0.12)',
                    cursor: 'pointer'
                  }}
                >
                  <div
                    style={{
                      fontSize: 30
                    }}
                  >
                    {item.icon}
                  </div>

                  <div>
                    <div
                      style={{
                        fontSize: 18,
                        fontWeight: 'bold',
                        marginBottom: 6
                      }}
                    >
                      {item.title}
                    </div>
                    <div
                      style={{
                        fontSize: 13,
                        opacity: 0.92,
                        lineHeight: 1.6
                      }}
                    >
                      {item.sub}
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}