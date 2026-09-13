import type { SVGProps } from 'react'
import type { SobreIcono } from '../../../types'

type IconProps = SVGProps<SVGSVGElement> & { size?: number }

function base({ size = 16, ...props }: IconProps, children: React.ReactNode) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.8}
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      {children}
    </svg>
  )
}

export function GraduacionIcon(props: IconProps) {
  return base(props, (
    <>
      <path d="M2 9L12 4.5L22 9L12 13.5L2 9Z" />
      <path d="M6.5 11.2V16c0 1.4 2.8 2.7 5.5 2.7s5.5-1.3 5.5-2.7v-4.8" />
      <path d="M20 9.5v5.3" />
    </>
  ))
}

export function AvionIcon(props: IconProps) {
  return base(props, (
    <>
      <path d="M21 3L3 10.5l7 2.5 2.5 7L21 3Z" />
      <path d="M10 13l3.4 3.4" />
    </>
  ))
}

export function HojaIcon(props: IconProps) {
  return base(props, (
    <>
      <path d="M12 21V12" />
      <path d="M12 12c0-4.5 3.4-8 7.8-8 0 4.5-3.4 8-7.8 8Z" />
      <path d="M12 15.2c0-3-2.4-5.4-5.4-5.4 0 3 2.4 5.4 5.4 5.4Z" />
    </>
  ))
}

export function EscudoIcon(props: IconProps) {
  return base(props, <path d="M12 3l7 3v5c0 5-3.4 8.3-7 9.6-3.6-1.3-7-4.6-7-9.6V6l7-3Z" />)
}

export function CasaIcon(props: IconProps) {
  return base(props, (
    <>
      <path d="M4 11.5L12 4l8 7.5" />
      <path d="M6 10v9h12v-9" />
      <path d="M10 19v-5h4v5" />
    </>
  ))
}

export function EstrellaIcon(props: IconProps) {
  return base(props, (
    <path d="M12 3l2.6 5.6 6.1.6-4.6 4.1 1.3 6-5.4-3.2-5.4 3.2 1.3-6-4.6-4.1 6.1-.6L12 3Z" />
  ))
}

export function PlusIcon(props: IconProps) {
  return base(props, <path d="M12 5v14M5 12h14" />)
}

export function CheckIcon(props: IconProps) {
  return base(props, <path d="M5 13l4 4L19 7" />)
}

export function ChevronLeftIcon(props: IconProps) {
  return base(props, <path d="M15 6l-6 6 6 6" />)
}

export function ClockIcon(props: IconProps) {
  return base(props, (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v5l3.3 2" />
    </>
  ))
}

export function SlidersIcon(props: IconProps) {
  return base(props, (
    <>
      <path d="M4 7h10M18 7h2" />
      <circle cx="14" cy="7" r="2" />
      <path d="M4 12h4M12 12h8" />
      <circle cx="8" cy="12" r="2" />
      <path d="M4 17h10M18 17h2" />
      <circle cx="14" cy="17" r="2" />
    </>
  ))
}

export function DotsIcon({ size = 16, ...props }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" {...props}>
      <circle cx="12" cy="5" r="1.6" />
      <circle cx="12" cy="12" r="1.6" />
      <circle cx="12" cy="19" r="1.6" />
    </svg>
  )
}

export function DragHandleIcon(props: IconProps) {
  return base(props, (
    <path d="M8 6h.01M8 12h.01M8 18h.01M16 6h.01M16 12h.01M16 18h.01" strokeWidth={2.2} />
  ))
}

export function ArrowUpIcon(props: IconProps) {
  return base(props, (
    <>
      <path d="M12 19V5" />
      <path d="M6 11l6-6 6 6" />
    </>
  ))
}

export function ArrowDownIcon(props: IconProps) {
  return base(props, (
    <>
      <path d="M12 5v14" />
      <path d="M6 13l6 6 6-6" />
    </>
  ))
}

export function LapizIcon(props: IconProps) {
  return base(props, (
    <>
      <path d="M4 20l1-4L16 5l3 3L8 19l-4 1Z" />
      <path d="M13.5 7.5l3 3" />
    </>
  ))
}

export function DownloadIcon(props: IconProps) {
  return base(props, (
    <>
      <path d="M12 4v11" />
      <path d="M7.5 11l4.5 4.5 4.5-4.5" />
      <path d="M5 19h14" />
    </>
  ))
}

export function UploadIcon(props: IconProps) {
  return base(props, (
    <>
      <path d="M12 15V4" />
      <path d="M7.5 8l4.5-4.5L16.5 8" />
      <path d="M5 19h14" />
    </>
  ))
}

const ICONOS: Record<SobreIcono, (props: IconProps) => React.ReactElement> = {
  graduacion: GraduacionIcon,
  avion: AvionIcon,
  hoja: HojaIcon,
  escudo: EscudoIcon,
  casa: CasaIcon,
  estrella: EstrellaIcon,
}

/** Devuelve el componente de ícono correspondiente a un SobreIcono. */
export function iconoDeSobre(icono: SobreIcono) {
  return ICONOS[icono]
}
