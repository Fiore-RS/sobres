import { CheckIcon } from '../atoms/Icon'
import { formatPorcentaje } from '../../../lib/format'
import type { SobreColor } from '../../../types'
import { CLASE_SELECCION, CLASE_SOLIDA } from '../../../lib/colores'

interface SobreSelectRowProps {
  nombre: string
  prioridad: number
  seleccionado: boolean
  onToggle: () => void
  tipo?: 'checkbox' | 'radio'
  color?: SobreColor
}

export function SobreSelectRow({
  nombre,
  prioridad,
  seleccionado,
  onToggle,
  tipo = 'checkbox',
  color = 'green',
}: SobreSelectRowProps) {
  const fondoSeleccionado = CLASE_SELECCION[color]
  const marcaSeleccionada = CLASE_SOLIDA[color]

  return (
    <button
      type="button"
      onClick={onToggle}
      className={`flex items-center gap-3 rounded-2xl border px-3.5 py-3 text-left ${
        seleccionado ? fondoSeleccionado : 'bg-surface border-border'
      }`}
    >
      {tipo === 'checkbox' ? (
        <span
          className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-md ${
            seleccionado ? marcaSeleccionada : 'border-[1.5px] border-border'
          }`}
        >
          {seleccionado && <CheckIcon size={13} className="text-surface" strokeWidth={2.6} />}
        </span>
      ) : (
        <span
          className={`h-[18px] w-[18px] shrink-0 rounded-full ${
            seleccionado ? marcaSeleccionada : 'border-[1.5px] border-border'
          }`}
        />
      )}
      <span className={`flex-1 text-sm ${seleccionado ? 'font-semibold' : 'font-medium text-ink-soft'}`}>
        {nombre}
      </span>
      <span className="text-xs text-ink-faint">{formatPorcentaje(prioridad)}</span>
    </button>
  )
}
