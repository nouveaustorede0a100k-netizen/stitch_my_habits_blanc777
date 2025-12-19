'use client'

interface MaterialSymbolsOutlinedProps {
  name: string
  className?: string
  style?: React.CSSProperties & { fontVariationSettings?: string }
}

export function MaterialSymbolsOutlined({
  name,
  className = '',
  style,
}: MaterialSymbolsOutlinedProps) {
  return (
    <span
      className={`material-symbols-outlined ${className}`}
      style={{
        fontVariationSettings: "'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24",
        ...style,
      }}
    >
      {name}
    </span>
  )
}

