import { Link } from 'react-router-dom'
import type { Sobre } from '../../../types'
import { formatColones, formatPorcentaje } from '../../../lib/format'
import { IconBadge } from '../atoms/IconBadge'
import { Pill } from '../atoms/Pill'
import { ProgressBar } from '../atoms/ProgressBar'
import { iconoDeSobre } from '../atoms/Icon'

export function SobreCard({ sobre }: { sobre: Sobre }) {
  const Icono = iconoDeSobre(sobre.icono)
  const progreso = sobre.meta ? (sobre.saldoActual / sobre.meta) * 100 : undefined

  return (
    <Link
      to={`/sobres/${sobre.id}`}
      className="flex flex-col gap-2.5 rounded-2xl border border-border bg-surface p-3.5"
    >
      <div className="flex items-center justify-between">
        <IconBadge color={sobre.color}>
          <Icono size={16} />
        </IconBadge>
        <Pill color={sobre.color}>{formatPorcentaje(sobre.prioridad)}</Pill>
      </div>
      <div className="font-display font-semibold text-[14.5px]">{sobre.nombre}</div>
      <div className="font-semibold text-lg">{formatColones(sobre.saldoActual)}</div>
      {sobre.meta ? (
        <>
          <ProgressBar porcentaje={progreso ?? 0} color={sobre.color} />
          <div className="text-[10px] text-ink-faint">Meta {formatColones(sobre.meta)}</div>
        </>
      ) : (
        <div className="text-[10px] text-ink-faint">Sin meta &middot; uso libre</div>
      )}
    </Link>
  )
}
