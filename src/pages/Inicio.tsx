import { Link } from 'react-router-dom'
import { useSobresStore } from '../lib/store'
import { formatColones } from '../lib/format'
import { SobreCard } from '../assets/components/molecules/SobreCard'
import { LapizIcon, PlusIcon } from '../assets/components/atoms/Icon'

export function Inicio() {
  const { sobres } = useSobresStore()
  const activos = sobres.filter((s) => !s.archivado).sort((a, b) => a.orden - b.orden)
  const total = activos.reduce((acc, s) => acc + s.saldoActual, 0)

  return (
    <div className="relative flex h-full flex-col">
      <div className="flex shrink-0 flex-col gap-3.5 px-5 pt-6 pb-3">
        <div className="flex items-center justify-between">
          <div className="font-display font-semibold text-sm tracking-[0.14em] text-green">
            SOBRES
          </div>
          <Link
            to="/sobres"
            className="flex items-center gap-1.5 rounded-full bg-surface-2 px-3 py-1.5 text-ink-soft"
          >
            <LapizIcon size={13} />
            <span className="text-[12px] font-semibold">Editar sobres</span>
          </Link>
        </div>
        <div>
          <div className="mb-0.5 text-[12.5px] text-ink-faint">Total repartido</div>
          <div className="font-display font-semibold text-[32px]">{formatColones(total)}</div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3 px-5 pb-24">
        {activos.map((sobre) => (
          <SobreCard key={sobre.id} sobre={sobre} />
        ))}
      </div>

      <Link
        to="/nuevo-ingreso"
        className="absolute bottom-6 right-5 flex h-14 w-14 items-center justify-center rounded-full bg-green text-surface shadow-lg"
        aria-label="Nuevo ingreso"
      >
        <PlusIcon size={24} />
      </Link>
    </div>
  )
}
