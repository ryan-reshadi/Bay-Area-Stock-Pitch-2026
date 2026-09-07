import { useState, useEffect } from 'react'

interface CountdownProps {
  target?: string
  compact?: boolean
  dark?: boolean
}

export default function Countdown({ target = '2026-11-14T09:00:00', compact = false, dark = false }: CountdownProps) {
  const [now, setNow] = useState(() => Date.now())

  useEffect(() => {
    const interval = setInterval(() => setNow(Date.now()), 1000)
    return () => clearInterval(interval)
  }, [])

  const diff = Math.max(0, new Date(target).getTime() - now)
  const days = Math.floor(diff / 86400000)
  const hours = Math.floor((diff % 86400000) / 3600000)
  const minutes = Math.floor((diff % 3600000) / 60000)
  const seconds = Math.floor((diff % 60000) / 1000)

  const units = [
    { label: 'DAYS', value: days },
    { label: 'HRS', value: hours },
    { label: 'MIN', value: minutes },
    { label: 'SEC', value: seconds },
  ]

  const pad = (n: number) => String(n).padStart(2, '0')

  if (compact) {
    return (
      <div className="flex items-center gap-2 font-mono text-xs tracking-widest text-foreground">
        <span className="text-brass">●</span>
        {units.map((unit, i) => (
          <span key={unit.label} className="flex items-center gap-2">
            <span className="tabular-nums">{pad(unit.value)}</span>
            <span className="text-meta">{unit.label}</span>
            {i < units.length - 1 && <span className="text-warm-border">/</span>}
          </span>
        ))}
      </div>
    )
  }

  const cellBg = dark ? 'bg-[#1a261a]' : 'bg-white'
  const borderColor = dark ? 'border-[#2f3d2a]' : 'border-[#d9d3c4]'
  const valueColor = dark ? 'text-[#f4f1ea]' : 'text-foreground'
  const labelColor = dark ? 'text-[#8a9a8a]' : 'text-meta'

  return (
    <div className={`grid grid-cols-4 gap-px ${borderColor} border`}>
      {units.map((unit) => (
        <div
          key={unit.label}
          className={`${cellBg} px-2 py-4 sm:py-6 flex flex-col items-center justify-center`}
        >
          <div className={`font-mono text-2xl sm:text-4xl font-light tabular-nums ${valueColor} tracking-tight`}>
            {pad(unit.value)}
          </div>
          <div className={`mt-1 font-mono text-[9px] sm:text-[10px] tracking-[0.25em] ${labelColor} uppercase`}>
            {unit.label}
          </div>
        </div>
      ))}
    </div>
  )
}
