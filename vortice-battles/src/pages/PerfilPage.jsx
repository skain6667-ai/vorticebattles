import { useState } from 'react'
import { useAuth } from '../context/AuthContext'
import { updateUserProfile, signOutUser } from '../lib/firebase'
import VorticeCanSVG from '../components/VorticeCanSVG'
import { Zap, LogOut, Edit2, Check, X } from 'lucide-react'

const TOTAL_SLOTS = 12

const TIPO_TO_CATEGORY = {
  filtrosGanados: 'filtro',
  mencionesEspeciales: 'mencion',
  batallasDestacadas: 'batalla',
}

function CanSlot({ logro, index }) {
  if (!logro) {
    return (
      <div className="flex flex-col items-center gap-1">
        <div className="w-full aspect-[1/2.2] flex items-center justify-center border-2 border-dashed border-vortice-border/30 rounded-lg">
          <span className="text-gray-800 text-xl">+</span>
        </div>
        <span className="text-gray-700 text-[9px] font-mono-vortice">#{index + 1}</span>
      </div>
    )
  }

  const category = TIPO_TO_CATEGORY[logro.tipo] || 'default'

  return (
    <div className="flex flex-col items-center gap-1 cursor-pointer group" title={logro.descripcion}>
      <div className="w-full">
        <VorticeCanSVG size={40} glowing category={category} />
      </div>
      <span className="text-[9px] font-mono-vortice text-gray-500 truncate w-full text-center">
        {logro.tipo === 'filtrosGanados' ? 'FILTRO' : logro.tipo === 'mencionesEspeciales' ? 'MEN.' : 'BAT.'}
      </span>
    </div>
  )
}

export default function PerfilPage() {
  const { user, profile, refreshProfile } = useAuth()
  const [editingAlias, setEditingAlias] = useState(false)
  const [alias, setAlias] = useState(profile?.alias || '')
  const [savingAlias, setSavingAlias] = useState(false)

  const logros = profile?.logros || []
  const slots = Array.from({ length: TOTAL_SLOTS }, (_, i) => logros[i] || null)
  const latas = profile?.latas || 0
  const latasGanadas = profile?.latasGanadas || 0
  const progress = Math.min((latasGanadas / TOTAL_SLOTS) * 100, 100)

  const saveAlias = async () => {
    if (!alias.trim() || !user) return
    setSavingAlias(true)
    try {
      await updateUserProfile(user.uid, { alias: alias.trim() })
      await refreshProfile()
      setEditingAlias(false)
    } finally {
      setSavingAlias(false)
    }
  }

  const handleSignOut = async () => {
    await signOutUser()
  }

  return (
    <div className="min-h-screen bg-black">
      {/* Header */}
      <div className="sticky top-0 z-30 bg-black/90 backdrop-blur-md border-b border-vortice-border px-4 py-4 flex items-center justify-between">
        <h1 className="font-display text-2xl text-white tracking-wide">MI REFRI</h1>
        <button onClick={handleSignOut} className="flex items-center gap-1.5 text-gray-500 hover:text-white transition-colors">
          <LogOut size={16} />
          <span className="font-body text-xs">Salir</span>
        </button>
      </div>

      <div className="px-4 pt-6 space-y-6">
        {/* Profile card */}
        <div className="bg-vortice-card border border-vortice-border rounded-2xl p-5">
          <div className="flex items-center gap-4">
            <img
              src={user?.photoURL || `https://api.dicebear.com/7.x/initials/svg?seed=${profile?.alias}`}
              className="w-16 h-16 rounded-full border-2 border-vortice-border object-cover"
              alt="avatar"
            />
            <div className="flex-1 min-w-0">
              {editingAlias ? (
                <div className="flex items-center gap-2">
                  <input
                    value={alias}
                    onChange={e => setAlias(e.target.value)}
                    className="bg-vortice-gray border border-vortice-red rounded-lg px-3 py-1.5 text-white font-body text-sm flex-1 min-w-0 outline-none"
                    maxLength={20}
                    autoFocus
                  />
                  <button onClick={saveAlias} disabled={savingAlias} className="text-green-400">
                    <Check size={18} />
                  </button>
                  <button onClick={() => { setEditingAlias(false); setAlias(profile?.alias || '') }} className="text-gray-500">
                    <X size={18} />
                  </button>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <p className="font-display text-2xl text-white truncate">{profile?.alias || user?.displayName}</p>
                  <button onClick={() => setEditingAlias(true)} className="text-gray-600 hover:text-white transition-colors">
                    <Edit2 size={14} />
                  </button>
                </div>
              )}
              <p className="text-gray-500 text-xs font-body truncate">{user?.email}</p>
            </div>
          </div>

          <div className="mt-4 grid grid-cols-3 gap-3">
            {[
              { label: 'Disponibles', value: latas, color: 'text-vortice-red' },
              { label: 'Total ganadas', value: latasGanadas, color: 'text-vortice-blue' },
              { label: 'Canjeadas', value: profile?.latasUsadas || 0, color: 'text-gray-400' },
            ].map(({ label, value, color }) => (
              <div key={label} className="bg-black/30 rounded-xl p-3 text-center">
                <p className={`font-display text-2xl ${color}`}>{value}</p>
                <p className="text-gray-600 text-[10px] font-body uppercase tracking-wide">{label}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Refri / Fridge module */}
        <div className="bg-vortice-card border border-vortice-border rounded-2xl overflow-hidden">
          {/* Fridge top handle */}
          <div className="bg-vortice-gray border-b border-vortice-border px-5 py-3 flex items-center justify-between">
            <div>
              <p className="font-display text-lg text-white tracking-wider">VÓRTICE ENERGY REFRI</p>
              <p className="text-gray-500 text-xs font-body">Energía Recolectada: {latasGanadas}/{TOTAL_SLOTS} latas</p>
            </div>
            <div className="flex items-center gap-1">
              <Zap size={14} className="text-vortice-red" />
              <span className="font-mono-vortice text-vortice-red">{Math.round(progress)}%</span>
            </div>
          </div>

          {/* Progress bar */}
          <div className="h-1.5 bg-black">
            <div
              className="h-full bg-gradient-to-r from-vortice-red via-orange-500 to-vortice-red transition-all duration-700"
              style={{ width: `${progress}%` }}
            />
          </div>

          {/* Fridge glass door */}
          <div className="p-4 bg-gradient-to-b from-vortice-gray/20 to-black/40 relative">
            {/* Inner light effect */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-8 bg-white/5 rounded-full blur-xl" />

            {/* Shelves with cans */}
            <div className="grid grid-cols-4 gap-3">
              {slots.map((logro, i) => (
                <CanSlot key={i} logro={logro} index={i} />
              ))}
            </div>

            {/* Motivation message */}
            <div className="mt-4 text-center">
              <p className="font-body text-xs text-gray-500 italic">
                {latasGanadas === 0 && '¡Compite y gana tu primera lata!'}
                {latasGanadas === 1 && '¡Arrancaste! Sigue acumulando 🔥'}
                {latasGanadas >= 2 && latasGanadas <= 5 && `¡Buen ritmo! Te faltan ${TOTAL_SLOTS - latasGanadas} latas`}
                {latasGanadas >= 6 && latasGanadas <= 10 && `¡A full! Te falta${TOTAL_SLOTS - latasGanadas === 1 ? '' : 'n'} solo ${TOTAL_SLOTS - latasGanadas} lata${TOTAL_SLOTS - latasGanadas === 1 ? '' : 's'}!`}
                {latasGanadas >= 11 && latasGanadas < 12 && '¡Te falta solo 1 lata! 🚀'}
                {latasGanadas >= 12 && '🏆 ¡Refri completo! Leyenda del Vórtice'}
              </p>
            </div>
          </div>

          {/* Fridge bottom */}
          <div className="bg-vortice-gray border-t border-vortice-border px-5 py-2 flex items-center gap-2">
            <div className="flex gap-1.5">
              {[{cat:'filtro',col:'bg-vortice-red',lbl:'Filtro'},{cat:'mencion',col:'bg-vortice-blue',lbl:'Mención'},{cat:'batalla',col:'bg-gray-400',lbl:'Batalla'}].map(({col,lbl}) => (
                <div key={lbl} className="flex items-center gap-1">
                  <div className={`w-2 h-2 rounded-full ${col}`} />
                  <span className="text-gray-600 text-[10px] font-body">{lbl}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Achievement log */}
        {logros.length > 0 && (
          <div>
            <p className="font-body text-xs text-gray-500 tracking-widest uppercase mb-3">Historial de logros</p>
            <div className="space-y-2">
              {[...logros].reverse().map((logro, i) => (
                <div key={i} className="flex items-center gap-3 py-3 border-b border-vortice-border/30">
                  <VorticeCanSVG size={24} category={TIPO_TO_CATEGORY[logro.tipo]} />
                  <div className="flex-1">
                    <p className="font-body font-bold text-white text-sm">{logro.descripcion}</p>
                    <p className="text-gray-600 text-xs font-body">
                      {logro.evento && `${logro.evento} · `}
                      {new Date(logro.fecha).toLocaleDateString('es-CL')}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="h-4" />
      </div>
    </div>
  )
}
