import type { ReactNode } from 'react'

interface PillProps {
  color?: 'green' | 'celeste' | 'neutral' | 'active'
  children: ReactNode
}

const STYLES: Record<NonNullable<PillProps['color']>, string> = {
  green: 'bg-green-soft text-green',
  celeste: 'bg-celeste-soft text-celeste',
  neutral: 'bg-surface border border-border text-ink-soft',
  active: 'bg-green text-surface',
}

export function Pill({ color = 'green', children }: PillProps) {
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-1 text-[11px] font-semibold ${STYLES[color]}`}
    >
      {children}
    </span>
  )
}
