import type { ReactNode } from 'react'

interface IconBadgeProps {
  color: 'green' | 'celeste'
  children: ReactNode
  size?: number
}

const BG: Record<IconBadgeProps['color'], string> = {
  green: 'bg-green-soft text-green',
  celeste: 'bg-celeste-soft text-celeste',
}

export function IconBadge({ color, children, size = 32 }: IconBadgeProps) {
  return (
    <div
      className={`flex items-center justify-center rounded-full shrink-0 ${BG[color]}`}
      style={{ width: size, height: size }}
    >
      {children}
    </div>
  )
}
