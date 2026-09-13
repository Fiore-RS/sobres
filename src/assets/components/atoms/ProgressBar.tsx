interface ProgressBarProps {
  porcentaje: number // 0-100
  color?: 'green' | 'celeste'
  height?: number
}

export function ProgressBar({ porcentaje, color = 'green', height = 5 }: ProgressBarProps) {
  const fill = color === 'green' ? 'bg-green-mid' : 'bg-celeste-mid'
  const pct = Math.max(0, Math.min(100, porcentaje))
  return (
    <div className="rounded-full bg-surface-2 overflow-hidden" style={{ height }}>
      <div className={`h-full rounded-full ${fill}`} style={{ width: `${pct}%` }} />
    </div>
  )
}
