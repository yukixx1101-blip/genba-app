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
    }, 2500)

    return () => clearTimeout(timer)
  }, [message])

  const today = useMemo(() => {
    return new Date().toLocaleDateString('ja-JP', {
      month: 'numeric',
      day: 'numeric',
      weekday: 'short'
    })
  }, [])

  const topCards = [
    {
      label: '日報',
      value: '確認',
      icon: '📄',
      color: '#2563eb'
    },
    {
      label: '予定',
      value: '管理',
      icon: '📅',
      color: '#f59e0b'
    },
    {
      label: '写真',
      value: '一覧',
      icon: '📷',
      color: '#0ea5e9'
    },
    {
      label: '通知',
      value: '反映中',
      icon: '🔔',
      color: '#ef4444'
    }
  ]

  const quickLinks = [
    {
      href: '/reports',
      title: '日報一覧',
      icon: '📄',
      bg: '#2563eb'
    },
    {
      href: '/reports/new',
      title: '日報登録',
      icon: '📝',
      bg: '#16a34a'
    },
    {
      href: '/photos',
      title: '写真一覧',
      icon: '📷',
      bg: '#0ea5e9'
    },
    {
      href: '/schedules',
      title: '予定一覧',
      icon: '📅',
      bg: '#f59e0b'
    },
    {
      href: '/schedules/new',
      title: '予定登録',
      icon: '➕',
      bg: '#ef4444'
    },
    {
      href: '/schedules/calendar',
      title: 'カレンダー',
      icon: '🗓️',
      bg: '#8b5cf6'
    }
  ]

  return (
    <div
      style={{
        minHeight: '100vh',
        background: 'linear-gradient(180deg, #f8fafc 0%, #eef2ff 100%)',
        padding: 12
      }}
    >
      <div
        style={{
          width: '100%',
          maxWidth: 520,
          margin: '0 auto'
        }}
      >
        <div
          style={{
            background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)',
            borderRadius: 20,
            padding: 16,
            color: '#fff',
            boxShadow: '0 12px 30px rgba(15, 23, 42, 0.16)',
            marginBottom: 12
          }}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: 12
            }}
          >
            <div>
              <div
                style={{
                  fontSize: 12,
                  color: '#cbd5e1',
                  marginBottom: 4
                }}
              >
                現場管理アプリ
              </div>
              <h1
                style={{
                  fontSize: 22,
                  fontWeight: 'bold',
                  margin: 0,
                  lineHeight: 1.3
                }}
              >
                ホーム
              </h1>
              <p
                style={{
                  margin: '4px 0 0 0',
                  fontSize: 13,
                  color: '#e2e8f0'
                }}
              >
                開いてすぐ確認できる
              </p>
            </div>

            <div
              style={{
                minWidth: 84,
                textAlign: 'center',
                background: 'rgba(255,255,255,0.1)',
                border: '1px solid rgba(255,255,255,0.12)',
                borderRadius: 14,
                padding: '10px 8px'
              }}
            >
              <div
                style={{
                  fontSize: 11,
                  color: '#cbd5e1',
                  marginBottom: 4
                }}
              >
                今日
              </div>
              <div
                style={{
                  fontSize: 14,
                  fontWeight: 'bold'
                }}
              >
                {today}
              </div>
            </div>
          </div>
        </div>

        {message && (
          <div
            style={{
              background: '#fef3c7',
              color: '#78350f',
              padding: '10px 12px',
              borderRadius: 14,
              marginBottom: 12,
              fontSize: 13,
              fontWeight: 'bold',
              border: '1px solid #fcd34d'
            }}
          >
            {message}
          </div>
        )}

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(2, minmax(0, 1fr))',
            gap: 10,
            marginBottom: 12
          }}
        >
          {topCards.map((card) => (
            <div
              key={card.label}
              style={{
                background: '#fff',
                borderRadius: 16,
                padding: 12,
                border: '1px solid #e5e7eb',
                boxShadow: '0 8px 20px rgba(15, 23, 42, 0.05)'
              }}
            >
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  marginBottom: 8
                }}
              >
                <span style={{ fontSize: 22 }}>{card.icon}</span>
                <span
                  style={{
                    width: 10,
                    height: 10,
                    borderRadius: 9999,
                    background: card.color
                  }}
                />
              </div>

              <div
                style={{
                  fontSize: 12,
                  color: '#64748b',
                  marginBottom: 4
                }}
              >
                {card.label}
              </div>

              <div
                style={{
                  fontSize: 18,
                  fontWeight: 'bold',
                  color: '#0f172a'
                }}
              >
                {card.value}
              </div>
            </div>
          ))}
        </div>

        <div
          style={{
            background: '#fff',
            borderRadius: 18,
            padding: 12,
            border: '1px solid #e5e7eb',
            boxShadow: '0 10px 24px rgba(15, 23, 42, 0.05)'
          }}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: 10
            }}
          >
            <h2
              style={{
                margin: 0,
                fontSize: 16,
                fontWeight: 'bold',
                color: '#0f172a'
              }}
            >
              メニュー
            </h2>
            <div
              style={{
                fontSize: 12,
                color: '#64748b'
              }}
            >
              すぐ移動
            </div>
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(2, minmax(0, 1fr))',
              gap: 10
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
                    color: '#fff',
                    borderRadius: 16,
                    padding: 12,
                    minHeight: 82,
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    boxShadow: '0 8px 18px rgba(15, 23, 42, 0.12)'
                  }}
                >
                  <div
                    style={{
                      fontSize: 22,
                      lineHeight: 1
                    }}
                  >
                    {item.icon}
                  </div>

                  <div
                    style={{
                      fontSize: 14,
                      fontWeight: 'bold',
                      lineHeight: 1.35
                    }}
                  >
                    {item.title}
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