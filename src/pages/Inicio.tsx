import { useNavigate } from 'react-router-dom'
import { useSobresStore } from '../lib/store'
import { formatColones } from '../lib/format'
import { SobreCard } from '../assets/components/molecules/SobreCard'
import { Button } from '../assets/components/atoms/Button'
import { PlusIcon } from '../assets/components/atoms/Icon'

export function Inicio() {
  const navigate = useNavigate()
  const { sobres } = useSobresStore()
  const activos = sobres.filter((s) => !s.archivado).sort((a, b) => a.orden - b.orden)
  const total = activos.reduce((acc, s) => acc + s.saldoActual, 0)

  return (
    <div className="flex h-full flex-col">
      <div className="flex shrink-0 flex-col gap-3.5 px-5 pt-6 pb-3">
        <div className="font-display font-semibold text-sm tracking-[0.14em] text-green">
          SOBRES
        </div>
        <div>
          <div className="mb-0.5 text-[12.5px] text-ink-faint">Total repartido</div>
          <div className="font-display font-semibold text-[32px]">{formatColones(total)}</div>
        </div>
        <Button
          variant="solid-green"
          className="w-full"
          icon={<PlusIcon size={16} />}
          onClick={() => navigate('/nuevo-ingreso')}
        >
          Nuevo ingreso
        </Button>
      </div>

      <div className="flex-1 overflow-y-auto no-scrollbar grid grid-cols-2 content-start gap-3 px-5 pb-8">
        {activos.map((sobre) => (
          <SobreCard key={sobre.id} sobre={sobre} />
        ))}
      </div>
    </div>
  )
}
