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

  const menuItems = [
    {
      href: '/reports',
      ja: '日報一覧',
      en: 'Reports'
    },
    {
      href: '/reports/new',
      ja: '日報登録',
      en: 'New Report'
    },
    {
      href: '/photos',
      ja: '写真一覧',
      en: 'Photos'
    },
    {
      href: '/schedules',
      ja: '予定一覧',
      en: 'Schedules'
    },
    {
      href: '/schedules/new',
      ja: '予定登録',
      en: 'New Schedule'
    },
    {
      href: '/schedules/calendar',
      ja: 'カレンダー',
      en: 'Calendar'
    }
  ]

  return (
    <div
      style={{
        minHeight: '100vh',
        background: '#f3f4f6',
        padding: '12px 12px 20px'
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
            background: 'linear-gradient(135deg, #111827 0%, #1f2937 100%)',
            borderRadius: 22,
            padding: 18,
            color: '#ffffff',
            boxShadow: '0 14px 32px rgba(17, 24, 39, 0.22)',
            marginBottom: 12
          }}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'flex-start',
              justifyContent: 'space-between',
              gap: 12
            }}
          >
            <div style={{ flex: 1 }}>
              <div
                style={{
                  fontSize: 28,
                  fontWeight: 700,
                  lineHeight: 1.3,
                  letterSpacing: '0.02em'
                }}
              >
                株式会社 玄
              </div>

              <div
                style={{
                  marginTop: 6,
                  fontSize: 13,
                  color: '#d1d5db',
                  lineHeight: 1.6
                }}
              >
                今日もお疲れ様です。
              </div>
            </div>

            <div
              style={{
                minWidth: 86,
                textAlign: 'center',
                background: 'rgba(255,255,255,0.06)',
                border: '1px solid rgba(255,255,255,0.12)',
                borderRadius: 16,
                padding: '10px 10px'
              }}
            >
              <div
                style={{
                  fontSize: 11,
                  color: '#9ca3af',
                  marginBottom: 4,
                  letterSpacing: '0.04em'
                }}
              >
                TODAY
              </div>
              <div
                style={{
                  fontSize: 15,
                  fontWeight: 700,
                  color: '#ffffff'
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
              background: '#ffffff',
              color: '#111827',
              border: '1px solid #d1d5db',
              borderRadius: 16,
              padding: '11px 14px',
              marginBottom: 12,
              fontSize: 13,
              fontWeight: 600,
              boxShadow: '0 6px 18px rgba(15, 23, 42, 0.05)'
            }}
          >
            {message}
          </div>
        )}

        <div
          style={{
            background: '#ffffff',
            borderRadius: 22,
            padding: 14,
            border: '1px solid #e5e7eb',
            boxShadow: '0 12px 28px rgba(15, 23, 42, 0.06)'
          }}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'end',
              justifyContent: 'space-between',
              marginBottom: 12
            }}
          >
            <div>
              <div
                style={{
                  fontSize: 18,
                  fontWeight: 700,
                  color: '#111827',
                  lineHeight: 1.4
                }}
              >
                メニュー
              </div>
              <div
                style={{
                  fontSize: 12,
                  color: '#6b7280',
                  marginTop: 2
                }}
              >
                Quick Access
              </div>
            </div>
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(2, minmax(0, 1fr))',
              gap: 10
            }}
          >
            {menuItems.map((item, index) => (
              <Link
                key={item.href}
                href={item.href}
                style={{
                  textDecoration: 'none'
                }}
              >
                <div
                  style={{
                    background: index === 0 || index === 3 ? '#111827' : '#ffffff',
                    color: index === 0 || index === 3 ? '#ffffff' : '#111827',
                    border: index === 0 || index === 3 ? '1px solid #111827' : '1px solid #d1d5db',
                    borderRadius: 18,
                    padding: '16px 14px',
                    minHeight: 88,
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    boxShadow:
                      index === 0 || index === 3
                        ? '0 10px 20px rgba(17, 24, 39, 0.14)'
                        : '0 6px 16px rgba(15, 23, 42, 0.04)'
                  }}
                >
                  <div
                    style={{
                      fontSize: 17,
                      fontWeight: 700,
                      lineHeight: 1.4,
                      marginBottom: 4,
                      letterSpacing: '0.01em'
                    }}
                  >
                    {item.ja}
                  </div>

                  <div
                    style={{
                      fontSize: 11,
                      color: index === 0 || index === 3 ? '#d1d5db' : '#6b7280',
                      letterSpacing: '0.05em'
                    }}
                  >
                    {item.en}
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