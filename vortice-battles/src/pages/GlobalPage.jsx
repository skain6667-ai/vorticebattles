import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { subscribeToReels } from '../lib/firebase'
import { Play, Zap, ChevronRight, Radio } from 'lucide-react'

const MOCK_REELS = [
  { id: '1', titulo: 'GRAN FINAL - Fecha 8', mc1: 'El Profeta', mc2: 'Letal', videoUrl: '', thumb: '', views: 12400, fecha: '2024-11-15' },
  { id: '2', titulo: 'BATALLA DEL AÑO', mc1: 'Raptor', mc2: 'Nocturno', videoUrl: '', thumb: '', views: 9800, fecha: '2024-10-28' },
  { id: '3', titulo: 'MENCIÓN ESPECIAL', mc1: 'La Sombra', mc2: 'Código', videoUrl: '', thumb: '', views: 7200, fecha: '2024-10-10' },
]

function ReelCard({ reel }) {
  return (
    <div className="snap-start w-[72vw] max-w-[260px] flex-shrink-0 bg-vortice-card border border-vortice-border rounded-xl overflow-hidden">
      <div className="aspect-[9/16] bg-vortice-gray relative flex items-center justify-center">
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
        {/* Placeholder thumbnail */}
        <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-900 to-black">
          <svg width="60" height="60" viewBox="0 0 120 120">
            <circle cx="60" cy="60" r="50" stroke="#FF0033" strokeWidth="1" fill="none" opacity="0.4" />
            <circle cx="60" cy="60" r="36" stroke="#FF0033" strokeWidth="1.5" fill="none" opacity="0.6" />
            <circle cx="60" cy="60" r="22" stroke="#FF0033" strokeWidth="2" fill="none" />
          </svg>
        </div>
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-12 h-12 rounded-full bg-vortice-red/80 flex items-center justify-center backdrop-blur-sm">
            <Play size={20} fill="white" className="text-white ml-1" />
          </div>
        </div>
        <div className="absolute bottom-3 left-3 right-3">
          <p className="font-display text-sm text-white">{reel.mc1} vs {reel.mc2}</p>
          <p className="text-gray-400 text-xs font-body">{(reel.views / 1000).toFixed(1)}k vistas</p>
        </div>
      </div>
      <div className="p-3">
        <p className="font-body font-semibold text-xs text-vortice-red tracking-wider uppercase">{reel.titulo}</p>
      </div>
    </div>
  )
}

export default function GlobalPage() {
  const { profile, isAdmin } = useAuth()
  const navigate = useNavigate()
  const [reels, setReels] = useState(MOCK_REELS)

  useEffect(() => {
    const unsub = subscribeToReels((data) => {
      if (data.length > 0) setReels(data)
    })
    return unsub
  }, [])

  return (
    <div className="min-h-screen bg-black">
      {/* Header */}
      <div className="sticky top-0 z-30 bg-black/90 backdrop-blur-md border-b border-vortice-border px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <svg width="28" height="28" viewBox="0 0 120 120">
            <circle cx="60" cy="60" r="55" stroke="#FF0033" strokeWidth="2" fill="none" opacity="0.5" />
            <circle cx="60" cy="60" r="38" stroke="#FF0033" strokeWidth="2.5" fill="none" opacity="0.7" />
            <circle cx="60" cy="60" r="22" stroke="#FF0033" strokeWidth="3" fill="none" />
          </svg>
          <span className="font-display text-2xl text-white tracking-wide">VÓRTICE</span>
        </div>
        <div className="flex items-center gap-2">
          {isAdmin && (
            <button onClick={() => navigate('/admin')} className="bg-vortice-red/20 border border-vortice-red text-vortice-red text-xs font-body font-bold px-3 py-1.5 rounded-lg tracking-wider">
              ADMIN
            </button>
          )}
          <div className="flex items-center gap-1.5 bg-vortice-gray border border-vortice-border rounded-lg px-3 py-1.5">
            <Zap size={14} className="text-vortice-red" />
            <span className="font-mono-vortice text-sm text-white">{profile?.latas || 0}</span>
          </div>
        </div>
      </div>

      <div className="px-4 pt-6 space-y-8">
        {/* Hero card */}
        <div className="relative overflow-hidden rounded-2xl bg-vortice-gray border border-vortice-border p-6">
          <div className="absolute top-0 right-0 w-48 h-48 opacity-10">
            <svg viewBox="0 0 120 120">
              <circle cx="60" cy="60" r="55" stroke="#FF0033" strokeWidth="2" fill="none" />
              <circle cx="60" cy="60" r="38" stroke="#0066FF" strokeWidth="1.5" fill="none" />
              <circle cx="60" cy="60" r="22" stroke="#FF0033" strokeWidth="2" fill="none" />
            </svg>
          </div>
          <div className="flex items-center gap-2 mb-1">
            <div className="w-2 h-2 rounded-full bg-vortice-red animate-pulse" />
            <span className="text-vortice-red text-xs font-body font-bold tracking-widest uppercase">En Vivo</span>
          </div>
          <h2 className="font-display text-3xl text-white">PRÓXIMA FECHA</h2>
          <p className="text-gray-400 font-body text-sm mt-1">FECHA 9 · GRAN FINAL DE TEMPORADA</p>
          <div className="mt-4 flex items-center gap-4">
            <div className="text-center">
              <p className="font-display text-3xl text-vortice-red">22</p>
              <p className="text-gray-600 text-xs font-body">DÍA</p>
            </div>
            <div className="text-center">
              <p className="font-display text-3xl text-white">FEB</p>
              <p className="text-gray-600 text-xs font-body">MES</p>
            </div>
            <div className="flex-1" />
            <button onClick={() => navigate('/competir')} className="flex items-center gap-2 bg-vortice-red text-white font-body font-bold text-sm px-4 py-2.5 rounded-xl">
              INSCRIBIRSE <ChevronRight size={16} />
            </button>
          </div>
        </div>

        {/* Quick stats */}
        <div>
          <p className="font-body text-xs text-gray-500 tracking-widest uppercase mb-3">Tu actividad</p>
          <div className="grid grid-cols-3 gap-3">
            {[
              { label: 'Latas', value: profile?.latas || 0, color: 'red' },
              { label: 'Ganadas', value: profile?.latasGanadas || 0, color: 'blue' },
              { label: 'Batallas', value: profile?.stats?.batallasTotal || 0, color: 'silver' },
            ].map(({ label, value, color }) => (
              <div key={label} className="bg-vortice-card border border-vortice-border rounded-xl p-3 text-center">
                <p className={`font-display text-2xl ${color === 'red' ? 'text-vortice-red' : color === 'blue' ? 'text-vortice-blue' : 'text-vortice-silver'}`}>{value}</p>
                <p className="text-gray-500 text-xs font-body uppercase tracking-wider">{label}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Reels section */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Radio size={16} className="text-vortice-red" />
              <p className="font-display text-xl text-white tracking-wide">BATALLAS DESTACADAS</p>
            </div>
          </div>
          <div className="flex gap-4 overflow-x-auto scrollbar-hide pb-2 -mx-4 px-4 snap-x snap-mandatory">
            {reels.map(reel => <ReelCard key={reel.id} reel={reel} />)}
          </div>
        </div>

        {/* Categories */}
        <div>
          <p className="font-body text-xs text-gray-500 tracking-widest uppercase mb-3">Categorías de latas</p>
          <div className="space-y-2">
            {[
              { tipo: 'Filtros Ganados', desc: 'Por ganar votos del público en los filtros', color: 'bg-vortice-red/10 border-vortice-red/30', dot: 'bg-vortice-red', stat: profile?.stats?.filtrosGanados || 0 },
              { tipo: 'Mención Especial', desc: 'Por destacarse en una batalla sin ganar', color: 'bg-vortice-blue/10 border-vortice-blue/30', dot: 'bg-vortice-blue', stat: profile?.stats?.mencionesEspeciales || 0 },
              { tipo: 'Batalla Destacada', desc: 'Por la batalla más votada de la fecha', color: 'bg-vortice-silver/10 border-vortice-silver/30', dot: 'bg-vortice-silver', stat: profile?.stats?.batallasDestacadas || 0 },
            ].map(({ tipo, desc, color, dot, stat }) => (
              <div key={tipo} className={`flex items-center gap-4 p-4 rounded-xl border ${color}`}>
                <div className={`w-3 h-3 rounded-full ${dot} flex-shrink-0`} />
                <div className="flex-1">
                  <p className="font-body font-bold text-white text-sm">{tipo}</p>
                  <p className="text-gray-500 text-xs font-body">{desc}</p>
                </div>
                <span className="font-mono-vortice text-lg text-white">{stat}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="h-4" />
      </div>
    </div>
  )
}
