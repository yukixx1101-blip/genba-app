<div
  style={{
    background: '#808080',
    borderRadius: 16,
    padding: 10,
    marginBottom: 12,
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: 8
  }}
>
  {/* 現場追加 */}
  <button
    onClick={() => setShowAddSite(true)}
    style={{
      width: '100%',
      padding: 10,
      borderRadius: 10,
      border: 'none',
      background: '#1f1f1f',
      color: '#fff',
      fontWeight: 700
    }}
  >
    現場追加
  </button>

  {/* 写真アップロード */}
  <Link href="/photos/upload" style={{ textDecoration: 'none' }}>
    <button
      style={{
        width: '100%',
        padding: 10,
        borderRadius: 10,
        border: 'none',
        background: '#1f1f1f',
        color: '#fff',
        fontWeight: 700
      }}
    >
      写真アップロード
    </button>
  </Link>
</div>