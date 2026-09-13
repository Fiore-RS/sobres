import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useSobresStore } from '../lib/store'
import { calcularReparto } from '../lib/reparto'
import { formatColones, formatPorcentaje } from '../lib/format'
import { Header } from '../assets/components/organisms/Header'
import { SobreSelectRow } from '../assets/components/molecules/SobreSelectRow'
import { Button } from '../assets/components/atoms/Button'
import { CheckIcon } from '../assets/components/atoms/Icon'

export function NuevoIngreso() {
  const navigate = useNavigate()
  const { sobres, registrarIngreso } = useSobresStore()
  const activos = sobres.filter((s) => !s.archivado).sort((a, b) => a.orden - b.orden)

  const [monto, setMonto] = useState('')
  const [seleccionados, setSeleccionados] = useState<Set<string>>(
    () => new Set(activos.map((s) => s.id)),
  )
  const [nota, setNota] = useState('')

  const montoNumero = Number(monto) || 0

  const seleccion = activos.filter((s) => seleccionados.has(s.id))
  const reparto = useMemo(
    () => calcularReparto(montoNumero, seleccion),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [montoNumero, seleccionados],
  )
  const sumaRepartida = reparto.reduce((acc, r) => acc + r.monto, 0)

  function toggle(id: string) {
    setSeleccionados((prev) => {
      const next = new Set(prev)
      if (next.has(id)) {
        next.delete(id)
      } else {
        next.add(id)
      }
      return next
    })
  }

  function confirmar() {
    if (montoNumero <= 0 || seleccion.length === 0) return
    registrarIngreso(montoNumero, [...seleccionados], nota || undefined)
    navigate('/')
  }

  const puedeConfirmar = montoNumero > 0 && seleccion.length > 0

  return (
    <>
      <Header titulo="Nuevo ingreso" />
      <div className="flex-1 overflow-y-auto no-scrollbar px-5 pt-4 pb-5 flex flex-col gap-5">
        <div className="flex flex-col gap-2">
          <div className="text-[12.5px] text-ink-faint">¿Cuánto ingresó?</div>
          <div className="rounded-2xl border-[1.5px] border-green bg-surface px-4.5 py-4">
            <input
              type="number"
              inputMode="numeric"
              min={0}
              value={monto}
              onChange={(e) => setMonto(e.target.value)}
              placeholder="0"
              className="w-full bg-transparent font-display font-semibold text-[28px] outline-none"
            />
          </div>
        </div>

        <div className="flex flex-col gap-2.5">
          <div className="text-[12.5px] text-ink-faint">Elegí los sobres que participan</div>
          {activos.map((s) => (
            <SobreSelectRow
              key={s.id}
              nombre={s.nombre}
              prioridad={s.prioridad}
              seleccionado={seleccionados.has(s.id)}
              onToggle={() => toggle(s.id)}
              color={s.color}
            />
          ))}
        </div>

        {seleccion.length > 0 && montoNumero > 0 && (
          <div className="flex flex-col gap-2.5">
            <div className="text-[12.5px] text-ink-faint">Vista previa del reparto</div>
            <div className="flex flex-col gap-3 rounded-2xl border border-border bg-surface p-4">
              {reparto.map((r, i) => {
                const sobre = seleccion.find((s) => s.id === r.sobreId)!
                return (
                  <div key={r.sobreId}>
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="text-[13.5px] font-semibold">{sobre.nombre}</div>
                        <div className="text-[11px] text-ink-faint">
                          {formatPorcentaje(r.porcentajeAplicado, 1)} de este ingreso
                        </div>
                      </div>
                      <div className="text-[15px] font-semibold">{formatColones(r.monto)}</div>
                    </div>
                    {i < reparto.length - 1 && <div className="mt-3 h-px bg-border" />}
                  </div>
                )
              })}
              <div className="h-px bg-border" />
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5 text-green">
                  <CheckIcon size={15} strokeWidth={2.4} />
                  <span className="text-[12.5px] font-semibold">Coincide con el ingreso</span>
                </div>
                <div className="text-base font-bold">{formatColones(sumaRepartida)}</div>
              </div>
            </div>
          </div>
        )}

        <div className="flex flex-col gap-2">
          <div className="text-[12.5px] text-ink-faint">Nota (opcional)</div>
          <input
            value={nota}
            onChange={(e) => setNota(e.target.value)}
            placeholder="Ej. quincena de setiembre"
            className="rounded-xl border border-border bg-surface px-3.5 py-3 text-sm outline-none placeholder:text-ink-faint"
          />
        </div>
      </div>

      <div className="shrink-0 border-t border-border bg-bg px-5 pb-6 pt-3.5">
        <Button
          variant="solid-green"
          className="w-full disabled:opacity-40"
          disabled={!puedeConfirmar}
          onClick={confirmar}
        >
          Confirmar reparto
        </Button>
      </div>
    </>
  )
}
