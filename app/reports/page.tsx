<div
  style={{
    background: '#808080',
    borderRadius: 16,
    padding: 10,
    marginBottom: 12,
    display: 'grid',
    gridTemplateColumns: '1fr 1fr 1fr',
    gap: 8
  }}
>
  <Link href="/reports/new" style={{ textDecoration: 'none' }}>
    <button
      style={{
        width: '100%',
        padding: 11,
        borderRadius: 12,
        border: 'none',
        background: '#1f1f1f',
        color: '#fff',
        fontWeight: 700
      }}
    >
      日報登録
    </button>
  </Link>

  <Link href={printHref} style={{ textDecoration: 'none' }}>
    <button
      style={{
        width: '100%',
        padding: 11,
        borderRadius: 12,
        border: 'none',
        background: '#1f1f1f',
        color: '#fff',
        fontWeight: 700
      }}
    >
      PDF出力
    </button>
  </Link>

  <Link href="/reports/monthly" style={{ textDecoration: 'none' }}>
    <button
      style={{
        width: '100%',
        padding: 11,
        borderRadius: 12,
        border: 'none',
        background: '#1f1f1f',
        color: '#fff',
        fontWeight: 700
      }}
    >
      月間まとめ
    </button>
  </Link>
</div>