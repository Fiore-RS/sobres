import type { ReactNode } from 'react'
import type { SobreColor } from '../../../types'
import { CLASE_SUAVE } from '../../../lib/colores'

type PillColor = SobreColor | 'neutral' | 'active'

interface PillProps {
  color?: PillColor
  children: ReactNode
}

const STYLES: Record<PillColor, string> = {
  ...CLASE_SUAVE,
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
