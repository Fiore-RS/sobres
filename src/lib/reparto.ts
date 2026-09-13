import type { Sobre } from '../types'

const EPSILON = 0.01

/** Suma de prioridades de los sobres activos (no archivados). */
export function sumaPrioridades(sobres: Sobre[]): number {
  return sobres
    .filter((s) => !s.archivado)
    .reduce((acc, s) => acc + s.prioridad, 0)
}

/** true si los sobres activos suman 100% de prioridad (con tolerancia de redondeo). */
export function prioridadesValidas(sobres: Sobre[]): boolean {
  return Math.abs(sumaPrioridades(sobres) - 100) < EPSILON
}

export interface RepartoItem {
  sobreId: string
  porcentajeAplicado: number
  monto: number
}

/**
 * Reparte `montoTotal` (en colones enteros) entre los sobres seleccionados,
 * recalculando sus prioridades proporcionalmente para sumar 100% de ESTE
 * ingreso, y usando el método de mayor residuo para que la suma repartida
 * cuadre exactamente con el monto ingresado.
 *
 * Ver sección 5.2 y 5.3 de la especificación.
 */
export function calcularReparto(
  montoTotal: number,
  seleccionados: Pick<Sobre, 'id' | 'prioridad'>[],
): RepartoItem[] {
  const monto = Math.round(montoTotal)
  const sumaSeleccionadas = seleccionados.reduce((acc, s) => acc + s.prioridad, 0)

  if (seleccionados.length === 0 || sumaSeleccionadas <= 0) return []

  const exactos = seleccionados.map((s) => {
    const porcentajeAplicado = (s.prioridad / sumaSeleccionadas) * 100
    const exacto = (monto * s.prioridad) / sumaSeleccionadas
    const truncado = Math.floor(exacto)
    return {
      sobreId: s.id,
      porcentajeAplicado,
      exacto,
      truncado,
      residuo: exacto - truncado,
    }
  })

  const sumaTruncados = exactos.reduce((acc, e) => acc + e.truncado, 0)
  let colonesFaltantes = monto - sumaTruncados

  // Reparte los colones sobrantes empezando por el mayor residuo decimal
  const ordenPorResiduo = [...exactos].sort((a, b) => b.residuo - a.residuo)
  const montosFinales = new Map(exactos.map((e) => [e.sobreId, e.truncado]))

  for (const item of ordenPorResiduo) {
    if (colonesFaltantes <= 0) break
    montosFinales.set(item.sobreId, (montosFinales.get(item.sobreId) ?? 0) + 1)
    colonesFaltantes -= 1
  }

  return exactos.map((e) => ({
    sobreId: e.sobreId,
    porcentajeAplicado: e.porcentajeAplicado,
    monto: montosFinales.get(e.sobreId) ?? e.truncado,
  }))
}

/** Saldo nuevo de un sobre tras un retiro/gasto. Puede quedar negativo (ver 5.5). */
export function aplicarGasto(saldoActual: number, monto: number): number {
  return saldoActual - Math.round(monto)
}
