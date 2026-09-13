import type { SobreColor } from '../../../types'
import { CLASE_PROGRESO } from '../../../lib/colores'

interface ProgressBarProps {
  porcentaje: number // 0-100
  color?: SobreColor
  height?: number
}

export function ProgressBar({ porcentaje, color = 'green', height = 5 }: ProgressBarProps) {
  const pct = Math.max(0, Math.min(100, porcentaje))
  return (
    <div className="rounded-full bg-surface-2 overflow-hidden" style={{ height }}>
      <div className={`h-full rounded-full ${CLASE_PROGRESO[color]}`} style={{ width: `${pct}%` }} />
    </div>
  )
}
