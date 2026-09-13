import type { ReactNode } from 'react'
import type { SobreColor } from '../../../types'
import { CLASE_SUAVE } from '../../../lib/colores'

interface IconBadgeProps {
  color: SobreColor
  children: ReactNode
  size?: number
}

export function IconBadge({ color, children, size = 32 }: IconBadgeProps) {
  return (
    <div
      className={`flex items-center justify-center rounded-full shrink-0 ${CLASE_SUAVE[color]}`}
      style={{ width: size, height: size }}
    >
      {children}
    </div>
  )
}
