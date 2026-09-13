import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import type { Movimiento, RespaldoSobres, Sobre } from '../types'
import { calcularReparto, aplicarGasto } from './reparto'
import { cargarEstado, construirRespaldo, guardarEstado } from './storage'

interface NuevoSobreInput {
  nombre: string
  color: Sobre['color']
  icono: Sobre['icono']
  prioridad: number
  meta?: number
}

interface SobresStoreValue {
  sobres: Sobre[]
  movimientos: Movimiento[]
  sumaPrioridadesActivas: number
  prioridadesValidas: boolean

  agregarSobre: (input: NuevoSobreInput) => void
  actualizarSobre: (id: string, cambios: Partial<Omit<Sobre, 'id'>>) => void
  archivarSobre: (id: string) => void
  reactivarSobre: (id: string) => void
  eliminarSobre: (id: string) => boolean

  registrarIngreso: (montoTotal: number, sobreIds: string[], nota?: string) => void
  registrarGasto: (sobreId: string, monto: number, nota?: string) => void
  eliminarMovimiento: (movimientoId: string) => void
  reiniciarRegistro: () => void

  exportarRespaldo: () => RespaldoSobres
  importarRespaldo: (data: RespaldoSobres) => void
  ultimoRespaldo?: number
}

const SobresStoreContext = createContext<SobresStoreValue | null>(null)

export function SobresStoreProvider({ children }: { children: ReactNode }) {
  const [sobres, setSobres] = useState<Sobre[]>(() => cargarEstado().sobres)
  const [movimientos, setMovimientos] = useState<Movimiento[]>(
    () => cargarEstado().movimientos,
  )
  const [ultimoRespaldo, setUltimoRespaldo] = useState<number | undefined>(
    () => cargarEstado().configuracion.ultimoRespaldo,
  )

  useEffect(() => {
    guardarEstado({
      sobres,
      movimientos,
      configuracion: { moneda: 'CRC', ultimoRespaldo },
    })
  }, [sobres, movimientos, ultimoRespaldo])

  const sumaPrioridadesActivas = useMemo(
    () => sobres.filter((s) => !s.archivado).reduce((acc, s) => acc + s.prioridad, 0),
    [sobres],
  )

  const value = useMemo<SobresStoreValue>(() => {
    function agregarSobre(input: NuevoSobreInput) {
      setSobres((prev) => [
        ...prev,
        {
          id: crypto.randomUUID(),
          nombre: input.nombre,
          color: input.color,
          icono: input.icono,
          prioridad: input.prioridad,
          meta: input.meta,
          saldoActual: 0,
          orden: prev.length,
          archivado: false,
          creadoEn: Date.now(),
        },
      ])
    }

    function actualizarSobre(id: string, cambios: Partial<Omit<Sobre, 'id'>>) {
      setSobres((prev) => prev.map((s) => (s.id === id ? { ...s, ...cambios } : s)))
    }

    function archivarSobre(id: string) {
      actualizarSobre(id, { archivado: true })
    }

    function reactivarSobre(id: string) {
      actualizarSobre(id, { archivado: false })
    }

    function eliminarSobre(id: string): boolean {
      const sobre = sobres.find((s) => s.id === id)
      if (!sobre || sobre.saldoActual !== 0) return false
      setSobres((prev) => prev.filter((s) => s.id !== id))
      return true
    }

    function registrarIngreso(montoTotal: number, sobreIds: string[], nota?: string) {
      const seleccionados = sobres.filter((s) => sobreIds.includes(s.id))
      const reparto = calcularReparto(montoTotal, seleccionados)

      setSobres((prev) =>
        prev.map((s) => {
          const item = reparto.find((r) => r.sobreId === s.id)
          return item ? { ...s, saldoActual: s.saldoActual + item.monto } : s
        }),
      )

      setMovimientos((prev) => [
        {
          id: crypto.randomUUID(),
          tipo: 'ingreso_repartido',
          fecha: Date.now(),
          montoTotal,
          sobresParticipantes: reparto,
          nota,
        },
        ...prev,
      ])
    }

    function registrarGasto(sobreId: string, monto: number, nota?: string) {
      setSobres((prev) =>
        prev.map((s) =>
          s.id === sobreId ? { ...s, saldoActual: aplicarGasto(s.saldoActual, monto) } : s,
        ),
      )

      setMovimientos((prev) => [
        {
          id: crypto.randomUUID(),
          tipo: 'ajuste_manual',
          fecha: Date.now(),
          sobresParticipantes: [
            { sobreId, porcentajeAplicado: 100, monto: -Math.round(monto) },
          ],
          nota,
        },
        ...prev,
      ])
    }

    function eliminarMovimiento(movimientoId: string) {
      const mov = movimientos.find((m) => m.id === movimientoId)
      if (!mov) return

      setSobres((prev) =>
        prev.map((s) => {
          const participante = mov.sobresParticipantes.find((p) => p.sobreId === s.id)
          return participante
            ? { ...s, saldoActual: s.saldoActual - participante.monto }
            : s
        }),
      )
      setMovimientos((prev) => prev.filter((m) => m.id !== movimientoId))
    }

    function reiniciarRegistro() {
      // Deja los sobres tal cual (nombre, prioridad, color, ícono, meta) pero
      // en saldo cero, y borra todo el historial de movimientos. Pensado para
      // arrancar de cero cuando los datos actuales son de prueba, no reales.
      setSobres((prev) => prev.map((s) => ({ ...s, saldoActual: 0 })))
      setMovimientos([])
    }

    function exportarRespaldo(): RespaldoSobres {
      const respaldo = construirRespaldo({
        sobres,
        movimientos,
        configuracion: { moneda: 'CRC', ultimoRespaldo },
      })
      setUltimoRespaldo(Date.now())
      return respaldo
    }

    function importarRespaldo(data: RespaldoSobres) {
      setSobres(data.sobres)
      setMovimientos(data.movimientos)
      setUltimoRespaldo(Date.now())
    }

    return {
      sobres,
      movimientos,
      sumaPrioridadesActivas,
      prioridadesValidas: Math.abs(sumaPrioridadesActivas - 100) < 0.01,
      agregarSobre,
      actualizarSobre,
      archivarSobre,
      reactivarSobre,
      eliminarSobre,
      registrarIngreso,
      registrarGasto,
      eliminarMovimiento,
      reiniciarRegistro,
      exportarRespaldo,
      importarRespaldo,
      ultimoRespaldo,
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sobres, movimientos, sumaPrioridadesActivas, ultimoRespaldo])

  return (
    <SobresStoreContext.Provider value={value}>{children}</SobresStoreContext.Provider>
  )
}

export function useSobresStore(): SobresStoreValue {
  const ctx = useContext(SobresStoreContext)
  if (!ctx) throw new Error('useSobresStore debe usarse dentro de <SobresStoreProvider>')
  return ctx
}
