import type { SobreColor } from '../types'

/** Orden en el que se muestran las opciones de color en el selector. */
export const COLORES_SOBRE: SobreColor[] = [
  'green',
  'celeste',
  'azul',
  'morado',
  'rosa',
  'rojo',
  'naranja',
  'amarillo',
  'oliva',
  'gris',
]

export const NOMBRE_COLOR: Record<SobreColor, string> = {
  green: 'Verde',
  celeste: 'Celeste',
  azul: 'Azul',
  morado: 'Morado',
  rosa: 'Rosa',
  rojo: 'Rojo',
  naranja: 'Naranja',
  amarillo: 'Amarillo',
  oliva: 'Oliva',
  gris: 'Gris',
}

/** Fondo suave + texto/ícono en el tono base — para IconBadge y Pill. */
export const CLASE_SUAVE: Record<SobreColor, string> = {
  green: 'bg-green-soft text-green',
  celeste: 'bg-celeste-soft text-celeste',
  azul: 'bg-azul-soft text-azul',
  morado: 'bg-morado-soft text-morado',
  rosa: 'bg-rosa-soft text-rosa',
  rojo: 'bg-rojo-soft text-rojo',
  naranja: 'bg-naranja-soft text-naranja',
  amarillo: 'bg-amarillo-soft text-amarillo',
  oliva: 'bg-oliva-soft text-oliva',
  gris: 'bg-gris-soft text-gris',
}

/** Solo el texto, en el tono base. */
export const CLASE_TEXTO: Record<SobreColor, string> = {
  green: 'text-green',
  celeste: 'text-celeste',
  azul: 'text-azul',
  morado: 'text-morado',
  rosa: 'text-rosa',
  rojo: 'text-rojo',
  naranja: 'text-naranja',
  amarillo: 'text-amarillo',
  oliva: 'text-oliva',
  gris: 'text-gris',
}

/** Fondo sólido en el tono base — para el círculo del selector de color y marcas. */
export const CLASE_SOLIDA: Record<SobreColor, string> = {
  green: 'bg-green',
  celeste: 'bg-celeste',
  azul: 'bg-azul',
  morado: 'bg-morado',
  rosa: 'bg-rosa',
  rojo: 'bg-rojo',
  naranja: 'bg-naranja',
  amarillo: 'bg-amarillo',
  oliva: 'bg-oliva',
  gris: 'bg-gris',
}

/** Fondo en el tono "mid" — para el relleno de barras de progreso. */
export const CLASE_PROGRESO: Record<SobreColor, string> = {
  green: 'bg-green-mid',
  celeste: 'bg-celeste-mid',
  azul: 'bg-azul-mid',
  morado: 'bg-morado-mid',
  rosa: 'bg-rosa-mid',
  rojo: 'bg-rojo-mid',
  naranja: 'bg-naranja-mid',
  amarillo: 'bg-amarillo-mid',
  oliva: 'bg-oliva-mid',
  gris: 'bg-gris-mid',
}

/** Fondo suave + borde "mid" — para filas seleccionadas (checkbox/radio). */
export const CLASE_SELECCION: Record<SobreColor, string> = {
  green: 'bg-green-soft border-green-mid',
  celeste: 'bg-celeste-soft border-celeste-mid',
  azul: 'bg-azul-soft border-azul-mid',
  morado: 'bg-morado-soft border-morado-mid',
  rosa: 'bg-rosa-soft border-rosa-mid',
  rojo: 'bg-rojo-soft border-rojo-mid',
  naranja: 'bg-naranja-soft border-naranja-mid',
  amarillo: 'bg-amarillo-soft border-amarillo-mid',
  oliva: 'bg-oliva-soft border-oliva-mid',
  gris: 'bg-gris-soft border-gris-mid',
}
