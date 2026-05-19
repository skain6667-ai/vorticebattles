import { useState, useEffect } from 'react'
import { useAuth } from '../context/AuthContext'
import { subscribeToRanking } from '../lib/firebase'
import { Trophy, Zap } from 'lucide-react'

const medals = ['🥇', '🥈', '🥉']

function RankRow({ mc, myUid, index }) {
  const isMe = mc.uid === myUid
  const medal = medals[index]

  return (
    <div className={`flex items-center gap-3 px-4 py-3.5 border-b border-vortice-border/50 transition-all ${isMe ? 'bg-vortice-red/5 border-l-2 border-l-vortice-red' : ''}`}>
      <div className="w-8 text-center flex-shrink-0">
        {medal ? (
          <span className="text-xl">{medal}</span>
        ) : (
          <span className="font-mono-vortice text-sm text-gray-500">#{index + 1}</span>
        )}
      </div>
      <img
        src={mc.photoURL || `https://api.dicebear.com/7.x/initials/svg?seed=${mc.alias}&backgroundColor=111111&textColor=FF0033`}
        alt={mc.alias}
        className="w-9 h-9 rounded-full border border-vortice-border flex-shrink-0 object-cover"
      />
      <div className="flex-1 min-w-0">
        <p className={`font-body font-bold text-sm truncate ${isMe ? 'text-vortice-red' : 'text-white'}`}>
          {mc.alias || mc.displayName}
          {isMe && <span className="ml-2 text-xs text-gray-500">(tú)</span>}
        </p>
        <p className="text-gray-600 text-xs font-body">{mc.stats?.batallasTotal || 0} batallas</p>
      </div>
      <div className="flex items-center gap-1.5 flex-shrink-0">
        <Zap size={12} className="text-vortice-red" />
        <span className={`font-display text-xl ${index < 3 ? 'text-vortice-red' : 'text-white'}`}>
          {mc.latasGanadas || 0}
        </span>
      </div>
    </div>
  )
}

export default function RankingPage() {
  const { user } = useAuth()
  const [ranking, setRanking] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const unsub = subscribeToRanking((data) => {
      setRanking(data)
      setLoading(false)
    })
    return unsub
  }, [])

  const myPosition = ranking.findIndex(mc => mc.uid === user?.uid)

  return (
    <div className="min-h-screen bg-black">
      {/* Header */}
      <div className="sticky top-0 z-30 bg-black/90 backdrop-blur-md border-b border-vortice-border px-4 py-4">
        <div className="flex items-center gap-2">
          <Trophy size={20} className="text-vortice-red" />
          <h1 className="font-display text-2xl text-white tracking-wide">RANKING GLOBAL</h1>
        </div>
        <p className="text-gray-500 text-xs font-body mt-0.5">Por latas acumuladas en la temporada</p>
      </div>

      {/* My position banner */}
      {myPosition >= 0 && (
        <div className="mx-4 mt-4 bg-vortice-red/10 border border-vortice-red/30 rounded-xl p-3 flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-vortice-red/20 flex items-center justify-center">
            <span className="font-mono-vortice text-sm text-vortice-red">#{myPosition + 1}</span>
          </div>
          <div>
            <p className="font-body text-sm font-bold text-white">Tu posición actual</p>
            <p className="text-gray-400 text-xs font-body">
              {myPosition === 0 ? '¡Líder del ranking! 🔥' : `${myPosition} posición(es) para el top`}
            </p>
          </div>
        </div>
      )}

      {/* Top 3 podium */}
      {ranking.length >= 3 && (
        <div className="px-4 py-6">
          <div className="flex items-end justify-center gap-4">
            {[ranking[1], ranking[0], ranking[2]].map((mc, i) => {
              const heights = ['h-24', 'h-32', 'h-20']
              const pos = [2, 1, 3]
              return (
                <div key={mc.uid} className="flex flex-col items-center gap-2">
                  <img
                    src={mc.photoURL || `https://api.dicebear.com/7.x/initials/svg?seed=${mc.alias}`}
                    className="w-12 h-12 rounded-full border-2 border-vortice-red object-cover"
                    alt={mc.alias}
                  />
                  <p className="font-body text-xs text-white truncate max-w-[70px] text-center">{mc.alias || mc.displayName}</p>
                  <div className={`w-20 ${heights[i]} bg-vortice-card border border-vortice-border rounded-t-lg flex flex-col items-center justify-center gap-1`}>
                    <span className="text-2xl">{medals[pos[i] - 1]}</span>
                    <div className="flex items-center gap-1">
                      <Zap size={10} className="text-vortice-red" />
                      <span className="font-mono-vortice text-xs text-white">{mc.latasGanadas}</span>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )}

      {/* Full ranking list */}
      <div className="border-t border-vortice-border">
        {loading ? (
          <div className="flex items-center justify-center py-16">
            <div className="w-8 h-8 border-2 border-vortice-red border-t-transparent rounded-full animate-spin" />
          </div>
        ) : ranking.length === 0 ? (
          <div className="text-center py-16">
            <p className="font-display text-2xl text-gray-700">SIN DATOS AÚN</p>
            <p className="text-gray-600 text-sm font-body mt-1">Sé el primero en acumular latas</p>
          </div>
        ) : (
          ranking.map((mc, i) => (
            <RankRow key={mc.uid} mc={mc} myUid={user?.uid} index={i} />
          ))
        )}
      </div>
      <div className="h-4" />
    </div>
  )
}
