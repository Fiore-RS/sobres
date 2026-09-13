import type { ReactNode } from 'react'

interface ModalProps {
  titulo: string
  onCerrar: () => void
  children: ReactNode
}

/** Popup centrado con fondo oscurecido. Clic en el fondo cierra el modal. */
export function Modal({ titulo, onCerrar, children }: ModalProps) {
  return (
    <div className="fixed inset-0 z-30 flex items-end justify-center bg-ink/40 px-5 py-6 sm:items-center">
      <button
        type="button"
        aria-label="Cerrar"
        onClick={onCerrar}
        className="absolute inset-0 cursor-default"
      />
      <div className="relative z-10 flex max-h-full w-full max-w-sm flex-col gap-4 overflow-y-auto rounded-3xl bg-surface p-5">
        <div className="font-display text-lg font-semibold">{titulo}</div>
        {children}
      </div>
    </div>
  )
}
