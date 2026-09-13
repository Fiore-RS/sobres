import { useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { useSobresStore } from '../lib/store'
import { formatColones } from '../lib/format'
import { Header } from '../assets/components/organisms/Header'
import { SobreSelectRow } from '../assets/components/molecules/SobreSelectRow'
import { Button } from '../assets/components/atoms/Button'
import { IconBadge } from '../assets/components/atoms/IconBadge'
import { iconoDeSobre } from '../assets/components/atoms/Icon'

export function NuevoGasto() {
  const navigate = useNavigate()
  const location = useLocation()
  const { sobres, registrarGasto } = useSobresStore()
  const activos = sobres.filter((s) => !s.archivado).sort((a, b) => a.orden - b.orden)

  const preseleccionado = (location.state as { sobreId?: string } | null)?.sobreId
  // Si se entró desde un sobre específico (Detalle de sobre), ese sobre queda fijo:
  // no tendría sentido dejar elegir otro distinto al que originó la acción.
  const sobreFijo = activos.find((s) => s.id === preseleccionado)

  const [sobreId, setSobreId] = useState<string | undefined>(
    sobreFijo?.id ?? activos[0]?.id,
  )
  const [monto, setMonto] = useState('')
  const [nota, setNota] = useState('')

  const sobre = activos.find((s) => s.id === sobreId)
  const montoNumero = Number(monto) || 0
  const saldoNuevo = sobre ? sobre.saldoActual - montoNumero : 0
  const puedeConfirmar = !!sobre && montoNumero > 0
  const IconoFijo = sobreFijo ? iconoDeSobre(sobreFijo.icono) : undefined

  function confirmar() {
    if (!sobre || montoNumero <= 0) return
    registrarGasto(sobre.id, montoNumero, nota || undefined)
    navigate(-1)
  }

  return (
    <>
      <Header titulo="Nuevo gasto" />
      <div className="flex-1 overflow-y-auto no-scrollbar px-5 pt-4 pb-5 flex flex-col gap-5">
        {sobreFijo ? (
          <div className="flex flex-col gap-2">
            <div className="text-[12.5px] text-ink-faint">Sobre</div>
            <div className="flex items-center gap-3 rounded-2xl border border-border bg-surface p-3.5">
              <IconBadge color={sobreFijo.color} size={38}>
                {IconoFijo && <IconoFijo size={18} />}
              </IconBadge>
              <div className="min-w-0 flex-1">
                <div className="font-display font-semibold text-sm">{sobreFijo.nombre}</div>
                <div className="text-[11px] text-ink-faint">
                  Saldo {formatColones(sobreFijo.saldoActual)}
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="flex flex-col gap-2.5">
            <div className="text-[12.5px] text-ink-faint">¿De qué sobre sale?</div>
            {activos.map((s) => (
              <SobreSelectRow
                key={s.id}
                nombre={s.nombre}
                prioridad={s.prioridad}
                seleccionado={sobreId === s.id}
                onToggle={() => setSobreId(s.id)}
                tipo="radio"
                color="celeste"
              />
            ))}
          </div>
        )}

        <div className="flex flex-col gap-2">
          <div className="text-[12.5px] text-ink-faint">¿Cuánto gastaste?</div>
          <div className="rounded-2xl border-[1.5px] border-celeste bg-surface px-4.5 py-4">
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

        {sobre && montoNumero > 0 && (
          <div className="flex flex-col gap-3 rounded-2xl border border-border bg-surface p-4">
            <div className="flex items-center justify-between">
              <div className="text-[13px] text-ink-faint">Saldo actual</div>
              <div className="text-[14.5px] font-semibold">{formatColones(sobre.saldoActual)}</div>
            </div>
            <div className="flex items-center justify-between">
              <div className="text-[13px] text-ink-faint">Gasto</div>
              <div className="text-[14.5px] font-semibold">-{formatColones(montoNumero)}</div>
            </div>
            <div className="h-px bg-border" />
            <div className="flex items-center justify-between">
              <div className="text-[13.5px] font-semibold">Saldo nuevo</div>
              <div className="text-[17px] font-bold">{formatColones(saldoNuevo)}</div>
            </div>
            {saldoNuevo < 0 && (
              <div className="text-xs text-ink-faint">
                Este sobre va a quedar en negativo — se muestra igual, solo como referencia.
              </div>
            )}
          </div>
        )}

        <div className="flex flex-col gap-2">
          <div className="text-[12.5px] text-ink-faint">Nota (opcional)</div>
          <input
            value={nota}
            onChange={(e) => setNota(e.target.value)}
            placeholder="Ej. renta de setiembre"
            className="rounded-xl border border-border bg-surface px-3.5 py-3 text-sm outline-none placeholder:text-ink-faint"
          />
        </div>
      </div>

      <div className="shrink-0 border-t border-border bg-bg px-5 pb-6 pt-3.5">
        <Button
          variant="solid-celeste"
          className="w-full disabled:opacity-40"
          disabled={!puedeConfirmar}
          onClick={confirmar}
        >
          Confirmar gasto
        </Button>
      </div>
    </>
  )
}
