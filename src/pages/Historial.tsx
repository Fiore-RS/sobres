import { useMemo, useState } from 'react'
import { useSobresStore } from '../lib/store'
import { formatFecha } from '../lib/format'
import { Header } from '../assets/components/organisms/Header'
import { MovimientoRow } from '../assets/components/molecules/MovimientoRow'

type Filtro = 'todos' | 'ingresos' | 'gastos'

function etiquetaGrupo(fecha: number): string {
  const hoy = new Date()
  const d = new Date(fecha)
  const mismoDia = (a: Date, b: Date) =>
    a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate()

  if (mismoDia(d, hoy)) return 'Hoy'
  const ayer = new Date(hoy)
  ayer.setDate(hoy.getDate() - 1)
  if (mismoDia(d, ayer)) return 'Ayer'
  return formatFecha(fecha)
}

export function Historial() {
  const { movimientos, sobres } = useSobresStore()
  const [filtro, setFiltro] = useState<Filtro>('todos')

  const filtrados = useMemo(() => {
    const ordenados = [...movimientos].sort((a, b) => b.fecha - a.fecha)
    if (filtro === 'ingresos') return ordenados.filter((m) => m.tipo === 'ingreso_repartido')
    if (filtro === 'gastos') return ordenados.filter((m) => m.tipo === 'ajuste_manual')
    return ordenados
  }, [movimientos, filtro])

  const grupos = useMemo(() => {
    const mapa = new Map<string, typeof filtrados>()
    for (const m of filtrados) {
      const etiqueta = etiquetaGrupo(m.fecha)
      if (!mapa.has(etiqueta)) mapa.set(etiqueta, [])
      mapa.get(etiqueta)!.push(m)
    }
    return [...mapa.entries()]
  }, [filtrados])

  return (
    <>
      <Header titulo="Historial" />
      <div className="flex shrink-0 gap-2 px-5 pb-3 pt-4">
        {(
          [
            ['todos', 'Todos'],
            ['ingresos', 'Ingresos'],
            ['gastos', 'Gastos'],
          ] as const
        ).map(([valor, etiqueta]) => (
          <button
            key={valor}
            type="button"
            onClick={() => setFiltro(valor)}
            className={`rounded-full px-3.5 py-1.5 text-[12.5px] ${
              filtro === valor
                ? 'bg-green font-semibold text-surface'
                : 'border border-border bg-surface font-medium text-ink-soft'
            }`}
          >
            {etiqueta}
          </button>
        ))}
      </div>

      <div className="flex-1 overflow-y-auto no-scrollbar px-5 pb-4">
        {grupos.length === 0 && (
          <div className="pt-6 text-center text-sm text-ink-faint">Todavía no hay movimientos.</div>
        )}
        {grupos.map(([etiqueta, movs]) => (
          <div key={etiqueta}>
            <div className="pb-0.5 pt-2.5 text-[11.5px] font-semibold uppercase tracking-wide text-ink-faint">
              {etiqueta}
            </div>
            {movs.map((m) => (
              <MovimientoRow key={m.id} movimiento={m} sobres={sobres} />
            ))}
          </div>
        ))}
      </div>
    </>
  )
}
