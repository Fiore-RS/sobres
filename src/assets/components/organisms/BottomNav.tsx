import { NavLink } from 'react-router-dom'
import { ClockIcon, SlidersIcon, SobresIcon } from '../atoms/Icon'
import { CasaIcon } from '../atoms/Icon'

const ITEMS = [
  { to: '/', label: 'Inicio', Icon: CasaIcon },
  { to: '/sobres', label: 'Sobres', Icon: SobresIcon },
  { to: '/historial', label: 'Historial', Icon: ClockIcon },
  { to: '/configuracion', label: 'Ajustes', Icon: SlidersIcon },
]

export function BottomNav() {
  return (
    <div className="flex shrink-0 items-center justify-around border-t border-border bg-surface pb-2.5 pt-2 h-[74px]">
      {ITEMS.map(({ to, label, Icon }) => (
        <NavLink
          key={to}
          to={to}
          end={to === '/'}
          className={({ isActive }) =>
            `flex flex-col items-center gap-0.5 ${isActive ? 'text-green' : 'text-ink-faint'}`
          }
        >
          {({ isActive }) => (
            <>
              <Icon size={20} />
              <span className={`text-[10.5px] ${isActive ? 'font-semibold' : ''}`}>{label}</span>
            </>
          )}
        </NavLink>
      ))}
    </div>
  )
}
