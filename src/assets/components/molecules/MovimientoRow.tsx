import type { Movimiento, Sobre } from '../../../types'
import { formatColones, formatFecha } from '../../../lib/format'
import { IconBadge } from '../atoms/IconBadge'
import { ArrowDownIcon, ArrowUpIcon } from '../atoms/Icon'

interface MovimientoRowProps {
  movimiento: Movimiento
  sobres: Sobre[]
  /** Si se da, muestra solo el monto de ese sobre dentro del movimiento (vista de Detalle de sobre). */
  sobreIdFiltro?: string
}

export function MovimientoRow({ movimiento, sobres, sobreIdFiltro }: MovimientoRowProps) {
  const esIngreso = movimiento.tipo === 'ingreso_repartido'

  const monto = sobreIdFiltro
    ? movimiento.sobresParticipantes.find((p) => p.sobreId === sobreIdFiltro)?.monto ?? 0
    : movimiento.sobresParticipantes.reduce((acc, p) => acc + p.monto, 0)

  const titulo = esIngreso
    ? 'Ingreso repartido'
    : sobres.find((s) => s.id === movimiento.sobresParticipantes[0]?.sobreId)?.nombre ?? 'Ajuste'

  const sobresDelIngreso = movimiento.sobresParticipantes
    .map((p) => sobres.find((s) => s.id === p.sobreId)?.nombre)
    .filter(Boolean)
    .join(', ')

  const subtitulo = esIngreso
    ? [movimiento.nota, sobresDelIngreso].filter(Boolean).join(' · ')
    : movimiento.nota ?? '—'

  return (
    <div className="flex items-center gap-3 border-b border-border py-3 last:border-b-0">
      <IconBadge color={esIngreso ? 'green' : 'celeste'} size={34}>
        {esIngreso ? <ArrowUpIcon size={16} /> : <ArrowDownIcon size={16} />}
      </IconBadge>
      <div className="min-w-0 flex-1">
        <div className="text-[13.5px] font-semibold">{titulo}</div>
        <div className="truncate text-[11px] text-ink-faint">
          {subtitulo} &middot; {formatFecha(movimiento.fecha)}
        </div>
      </div>
      <div className={`shrink-0 text-sm font-semibold ${monto >= 0 ? 'text-green' : ''}`}>
        {monto >= 0 ? '+' : ''}
        {formatColones(monto)}
      </div>
    </div>
  )
}
