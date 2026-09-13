export interface Sobre {
  id: string
  nombre: string
  color: 'green' | 'celeste'
  icono: SobreIcono
  prioridad: number // porcentaje, 0-100, hasta 1 decimal
  saldoActual: number // colones
  meta?: number // monto objetivo opcional
  orden: number
  archivado: boolean
  creadoEn: number // timestamp
}

export type SobreIcono =
  | 'graduacion'
  | 'avion'
  | 'hoja'
  | 'escudo'
  | 'casa'
  | 'estrella'

export type TipoMovimiento = 'ingreso_repartido' | 'ajuste_manual'

export interface MovimientoParticipante {
  sobreId: string
  porcentajeAplicado: number // el % ya recalculado para este movimiento
  monto: number // positivo (ingreso) o negativo (retiro/gasto)
}

export interface Movimiento {
  id: string
  tipo: TipoMovimiento
  fecha: number // timestamp
  montoTotal?: number // solo para tipo "ingreso_repartido"
  sobresParticipantes: MovimientoParticipante[]
  nota?: string
}

export interface Configuracion {
  moneda: 'CRC'
  ultimoRespaldo?: number // timestamp
}

export interface RespaldoSobres {
  sobres: Sobre[]
  movimientos: Movimiento[]
  configuracion: Configuracion
  exportadoEn: number
}
