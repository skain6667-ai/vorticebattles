import { useLocation, useNavigate } from 'react-router-dom'
import { Globe, Trophy, Swords, User } from 'lucide-react'

const tabs = [
  { path: '/', icon: Globe, label: 'Global' },
  { path: '/ranking', icon: Trophy, label: 'Ranking' },
  { path: '/competir', icon: Swords, label: 'Competir' },
  { path: '/perfil', icon: User, label: 'Mi Refri' },
]

export default function BottomNav() {
  const location = useLocation()
  const navigate = useNavigate()

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 bg-black border-t border-vortice-border"
      style={{ paddingBottom: 'env(safe-area-inset-bottom, 0px)' }}>
      <div className="flex items-stretch h-16">
        {tabs.map(({ path, icon: Icon, label }) => {
          const active = location.pathname === path
          return (
            <button
              key={path}
              onClick={() => navigate(path)}
              className="flex-1 flex flex-col items-center justify-center gap-0.5 relative transition-all duration-200"
            >
              {active && (
                <span className="absolute top-0 left-1/2 -translate-x-1/2 w-8 h-0.5 bg-vortice-red rounded-full" />
              )}
              <Icon
                size={20}
                className={active ? 'text-vortice-red' : 'text-gray-600'}
                strokeWidth={active ? 2.5 : 1.5}
              />
              <span className={`text-[10px] font-body font-semibold tracking-wider uppercase ${active ? 'text-vortice-red' : 'text-gray-600'}`}>
                {label}
              </span>
            </button>
          )
        })}
      </div>
    </nav>
  )
}
