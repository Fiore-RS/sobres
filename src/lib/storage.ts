import type { Configuracion, Movimiento, RespaldoSobres, Sobre } from '../types'

const STORAGE_KEY = 'sobres:data:v1'

interface EstadoAlmacenado {
  sobres: Sobre[]
  movimientos: Movimiento[]
  configuracion: Configuracion
}

function semillaInicial(): EstadoAlmacenado {
  const ahora = Date.now()
  const dia = 24 * 60 * 60 * 1000

  const sobres: Sobre[] = [
    { id: 'universidad', nombre: 'Universidad', color: 'green', icono: 'graduacion', prioridad: 17, saldoActual: 86000, meta: 150000, orden: 0, archivado: false, creadoEn: ahora - 60 * dia },
    { id: 'viajes', nombre: 'Viajes', color: 'celeste', icono: 'avion', prioridad: 8, saldoActual: 178000, meta: 200000, orden: 1, archivado: false, creadoEn: ahora - 60 * dia },
    { id: 'ahorro', nombre: 'Ahorro', color: 'green', icono: 'hoja', prioridad: 22, saldoActual: 214000, meta: 500000, orden: 2, archivado: false, creadoEn: ahora - 60 * dia },
    { id: 'emergencias', nombre: 'Emergencias', color: 'celeste', icono: 'escudo', prioridad: 15, saldoActual: 96000, meta: 300000, orden: 3, archivado: false, creadoEn: ahora - 60 * dia },
    { id: 'gastos-fijos', nombre: 'Gastos fijos', color: 'green', icono: 'casa', prioridad: 28, saldoActual: 64300, orden: 4, archivado: false, creadoEn: ahora - 60 * dia },
    { id: 'diversion', nombre: 'Diversión', color: 'celeste', icono: 'estrella', prioridad: 10, saldoActual: 18000, orden: 5, archivado: false, creadoEn: ahora - 60 * dia },
  ]

  const movimientos: Movimiento[] = [
    {
      id: 'mov-1',
      tipo: 'ingreso_repartido',
      fecha: ahora - 11 * dia,
      montoTotal: 200000,
      sobresParticipantes: sobres.map((s) => ({
        sobreId: s.id,
        porcentajeAplicado: s.prioridad,
        monto: Math.round((200000 * s.prioridad) / 100),
      })),
      nota: 'Quincena',
    },
  ]

  return {
    sobres,
    movimientos,
    configuracion: { moneda: 'CRC' },
  }
}

export function cargarEstado(): EstadoAlmacenado {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return semillaInicial()
    const parsed = JSON.parse(raw) as EstadoAlmacenado
    if (!parsed.sobres || !parsed.movimientos || !parsed.configuracion) {
      return semillaInicial()
    }
    return parsed
  } catch {
    return semillaInicial()
  }
}

export function guardarEstado(estado: EstadoAlmacenado): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(estado))
  } catch {
    // localStorage puede fallar (modo privado, cuota llena, etc.) — no rompemos la app por esto.
  }
}

export function construirRespaldo(estado: EstadoAlmacenado): RespaldoSobres {
  return { ...estado, exportadoEn: Date.now() }
}

export function respaldoValido(data: unknown): data is RespaldoSobres {
  if (!data || typeof data !== 'object') return false
  const d = data as RespaldoSobres
  return Array.isArray(d.sobres) && Array.isArray(d.movimientos) && !!d.configuracion
}
