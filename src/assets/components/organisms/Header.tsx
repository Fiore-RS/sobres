import type { ReactNode } from 'react'
import { useNavigate } from 'react-router-dom'
import { ChevronLeftIcon } from '../atoms/Icon'

interface HeaderProps {
  titulo: string
  right?: ReactNode
}

export function Header({ titulo, right }: HeaderProps) {
  const navigate = useNavigate()
  return (
    <div className="flex shrink-0 items-center gap-3.5 px-5 pt-6 pb-1">
      <button
        type="button"
        onClick={() => navigate(-1)}
        aria-label="Volver"
        className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-surface-2"
      >
        <ChevronLeftIcon size={16} />
      </button>
      <div className="flex-1 font-display font-semibold text-[19px]">{titulo}</div>
      {right}
    </div>
  )
}
