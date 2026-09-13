import type { Configuracion, Movimiento, RespaldoSobres, Sobre } from '../types'

const STORAGE_KEY = 'sobres:data:v1'

interface EstadoAlmacenado {
  sobres: Sobre[]
  movimientos: Movimiento[]
  configuracion: Configuracion
}

/**
 * Estado con el que arranca cualquier dispositivo nuevo: sin sobres, sin
 * movimientos. La app debe verse igual de "recién instalada" para cualquier
 * usuario nuevo, sin datos de ejemplo precargados.
 */
function estadoVacio(): EstadoAlmacenado {
  return {
    sobres: [],
    movimientos: [],
    configuracion: { moneda: 'CRC' },
  }
}

export function cargarEstado(): EstadoAlmacenado {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return estadoVacio()
    const parsed = JSON.parse(raw) as EstadoAlmacenado
    if (!parsed.sobres || !parsed.movimientos || !parsed.configuracion) {
      return estadoVacio()
    }
    return parsed
  } catch {
    return estadoVacio()
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
