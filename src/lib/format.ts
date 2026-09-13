const numberFormatter = new Intl.NumberFormat('en-US', {
  maximumFractionDigits: 0,
})

/** Formatea un monto en colones enteros, ej. 86000 -> "₡86,000". */
export function formatColones(monto: number): string {
  const signo = monto < 0 ? '-' : ''
  return `${signo}₡${numberFormatter.format(Math.abs(Math.round(monto)))}`
}

export function formatPorcentaje(pct: number, decimales = 0): string {
  return `${pct.toFixed(decimales)}%`
}

const dateFormatter = new Intl.DateTimeFormat('es-CR', {
  day: 'numeric',
  month: 'long',
})

export function formatFecha(timestamp: number): string {
  return dateFormatter.format(new Date(timestamp))
}
