import { useState } from 'react'
import { useAuth } from '../context/AuthContext'
import { canjearBeneficio } from '../lib/firebase'
import { Swords, Zap, Check, AlertCircle } from 'lucide-react'

const BENEFICIOS = [
  {
    id: 'inscripcion',
    nombre: 'Inscripción Gratuita',
    costo: 1,
    desc: 'Inscríbete a la próxima fecha sin pagar la entrada económica.',
    icon: '🎟️',
    available: true,
  },
  {
    id: 'octavos',
    nombre: 'Pase Directo a Octavos',
    costo: 3,
    desc: 'Sáltate la fase clasificatoria e ingresa directo a octavos de final.',
    icon: '⚡',
    available: true,
  },
  {
    id: 'wildcard',
    nombre: 'Wild Card de Repechaje',
    costo: 2,
    desc: 'Segunda oportunidad si quedas eliminado en la primera ronda.',
    icon: '🃏',
    available: false,
  },
]

export default function CompetirPage() {
  const { profile, refreshProfile } = useAuth()
  const [loading, setLoading] = useState(null)
  const [success, setSuccess] = useState(null)
  const [error, setError] = useState(null)

  const handleCanjear = async (beneficio) => {
    if (!profile) return
    setLoading(beneficio.id)
    setError(null)
    setSuccess(null)
    try {
      await canjearBeneficio(profile.uid, beneficio)
      await refreshProfile()
      setSuccess(beneficio.nombre)
    } catch (e) {
      setError(e.message)
    } finally {
      setLoading(null)
    }
  }

  const latas = profile?.latas || 0

  return (
    <div className="min-h-screen bg-black">
      <div className="sticky top-0 z-30 bg-black/90 backdrop-blur-md border-b border-vortice-border px-4 py-4">
        <div className="flex items-center gap-2">
          <Swords size={20} className="text-vortice-red" />
          <h1 className="font-display text-2xl text-white tracking-wide">COMPETIR</h1>
        </div>
        <p className="text-gray-500 text-xs font-body mt-0.5">Canjea tus latas por beneficios de competición</p>
      </div>

      <div className="px-4 pt-6 space-y-6">
        {/* Latas counter */}
        <div className="relative overflow-hidden bg-vortice-gray border border-vortice-border rounded-2xl p-5">
          <div className="absolute right-4 top-1/2 -translate-y-1/2 opacity-10">
            <Zap size={80} className="text-vortice-red" />
          </div>
          <p className="font-body text-xs text-gray-500 tracking-widest uppercase">Tus latas disponibles</p>
          <div className="flex items-end gap-2 mt-2">
            <span className="font-display text-6xl text-vortice-red text-glow-red">{latas}</span>
            <span className="font-display text-2xl text-gray-600 mb-2">/ 12</span>
          </div>
          <div className="mt-3 bg-black/40 rounded-full h-2 overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-vortice-red to-orange-500 rounded-full transition-all duration-500"
              style={{ width: `${Math.min((latas / 12) * 100, 100)}%` }}
            />
          </div>
          <p className="text-gray-500 text-xs font-body mt-2">
            {latas >= 12 ? '🔥 ¡Refri lleno! Eres una leyenda' : latas >= 11 ? `¡Te falta solo 1 lata!` : `Te faltan ${12 - latas} latas para completar el refri`}
          </p>
        </div>

        {/* Alerts */}
        {success && (
          <div className="flex items-center gap-3 bg-green-900/20 border border-green-800 rounded-xl p-4">
            <Check size={16} className="text-green-400 flex-shrink-0" />
            <p className="text-green-400 font-body text-sm">¡Beneficio canjeado: {success}!</p>
          </div>
        )}
        {error && (
          <div className="flex items-center gap-3 bg-red-900/20 border border-red-800 rounded-xl p-4">
            <AlertCircle size={16} className="text-red-400 flex-shrink-0" />
            <p className="text-red-400 font-body text-sm">{error}</p>
          </div>
        )}

        {/* Benefits */}
        <div>
          <p className="font-body text-xs text-gray-500 tracking-widest uppercase mb-3">Beneficios disponibles</p>
          <div className="space-y-3">
            {BENEFICIOS.map(ben => (
              <div key={ben.id} className={`bg-vortice-card border rounded-xl p-4 ${ben.available ? 'border-vortice-border' : 'border-vortice-border/30 opacity-50'}`}>
                <div className="flex items-start gap-3">
                  <span className="text-3xl flex-shrink-0">{ben.icon}</span>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <p className="font-body font-bold text-white text-sm">{ben.nombre}</p>
                      <div className="flex items-center gap-1 bg-vortice-gray border border-vortice-border rounded-lg px-2 py-1">
                        <Zap size={12} className="text-vortice-red" />
                        <span className="font-mono-vortice text-sm text-white">{ben.costo}</span>
                      </div>
                    </div>
                    <p className="text-gray-500 text-xs font-body mt-1">{ben.desc}</p>
                    {ben.available && (
                      <button
                        disabled={latas < ben.costo || loading === ben.id}
                        onClick={() => handleCanjear(ben)}
                        className="mt-3 w-full bg-vortice-red disabled:bg-gray-800 disabled:text-gray-600 text-white font-body font-bold text-sm py-2.5 rounded-lg transition-all active:scale-95 disabled:cursor-not-allowed"
                      >
                        {loading === ben.id ? (
                          <span className="flex items-center justify-center gap-2">
                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                            Canjeando...
                          </span>
                        ) : latas < ben.costo ? `Necesitas ${ben.costo - latas} lata(s) más` : `CANJEAR · ${ben.costo} lata${ben.costo > 1 ? 's' : ''}`}
                      </button>
                    )}
                    {!ben.available && (
                      <p className="mt-2 text-xs text-gray-600 font-body italic">Próximamente disponible</p>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* History */}
        {profile?.historialBeneficios?.length > 0 && (
          <div>
            <p className="font-body text-xs text-gray-500 tracking-widest uppercase mb-3">Historial de canjes</p>
            <div className="space-y-2">
              {[...profile.historialBeneficios].reverse().map((h, i) => (
                <div key={i} className="flex items-center gap-3 py-3 border-b border-vortice-border/30">
                  <div className="w-8 h-8 rounded-full bg-red-900/20 flex items-center justify-center flex-shrink-0">
                    <Zap size={14} className="text-vortice-red" />
                  </div>
                  <div className="flex-1">
                    <p className="font-body text-sm font-semibold text-white">{h.nombre}</p>
                    <p className="text-gray-600 text-xs font-body">{new Date(h.fecha).toLocaleDateString('es-CL')}</p>
                  </div>
                  <span className="font-mono-vortice text-sm text-gray-500">-{h.costo}</span>
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
