import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { getAllUsers, asignarLata, updateUserProfile } from '../lib/firebase'
import { Shield, Zap, Search, ChevronDown, X, Check } from 'lucide-react'

const LOGRO_TIPOS = [
  { key: 'filtrosGanados', label: 'Filtro Ganado', color: 'text-vortice-red' },
  { key: 'mencionesEspeciales', label: 'Mención Especial', color: 'text-vortice-blue' },
  { key: 'batallasDestacadas', label: 'Batalla Destacada', color: 'text-gray-400' },
]

export default function AdminPage() {
  const navigate = useNavigate()
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [selectedUser, setSelectedUser] = useState(null)
  const [selectedTipo, setSelectedTipo] = useState(LOGRO_TIPOS[0])
  const [desc, setDesc] = useState('')
  const [evento, setEvento] = useState('')
  const [saving, setSaving] = useState(false)
  const [successMsg, setSuccessMsg] = useState('')
  const [editUser, setEditUser] = useState(null)
  const [editAlias, setEditAlias] = useState('')
  const [editBatallas, setEditBatallas] = useState(0)

  useEffect(() => {
    getAllUsers().then(u => { setUsers(u); setLoading(false) })
  }, [])

  const filtered = users.filter(u =>
    (u.alias || u.displayName || '').toLowerCase().includes(search.toLowerCase()) ||
    (u.email || '').toLowerCase().includes(search.toLowerCase())
  )

  const handleAsignar = async () => {
    if (!selectedUser || !desc.trim()) return
    setSaving(true)
    try {
      await asignarLata(selectedUser.id, {
        tipo: selectedTipo.key,
        descripcion: desc.trim(),
        evento: evento.trim(),
        statKey: selectedTipo.key,
      })
      setSuccessMsg(`Lata asignada a ${selectedUser.alias || selectedUser.displayName}`)
      setDesc('')
      setEvento('')
      setSelectedUser(null)
      getAllUsers().then(setUsers)
    } finally {
      setSaving(false)
      setTimeout(() => setSuccessMsg(''), 3000)
    }
  }

  const handleEditProfile = async () => {
    if (!editUser) return
    setSaving(true)
    try {
      await updateUserProfile(editUser.id, {
        alias: editAlias.trim(),
        'stats.batallasTotal': parseInt(editBatallas) || 0,
      })
      setEditUser(null)
      getAllUsers().then(setUsers)
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="min-h-screen bg-black">
      <div className="sticky top-0 z-30 bg-black/95 backdrop-blur-md border-b border-vortice-red/30 px-4 py-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Shield size={20} className="text-vortice-red" />
          <h1 className="font-display text-2xl text-vortice-red tracking-wide">PANEL ADMIN</h1>
        </div>
        <button onClick={() => navigate('/')} className="text-gray-500 hover:text-white">
          <X size={20} />
        </button>
      </div>

      {successMsg && (
        <div className="mx-4 mt-4 flex items-center gap-2 bg-green-900/20 border border-green-800 rounded-xl p-3">
          <Check size={16} className="text-green-400" />
          <p className="text-green-400 font-body text-sm">{successMsg}</p>
        </div>
      )}

      <div className="px-4 pt-6 space-y-6">
        {/* Assign can */}
        <div className="bg-vortice-card border border-vortice-red/30 rounded-2xl p-5">
          <div className="flex items-center gap-2 mb-4">
            <Zap size={16} className="text-vortice-red" />
            <h2 className="font-display text-lg text-white">ASIGNAR LATA</h2>
          </div>

          {/* User search */}
          <div className="relative mb-3">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Buscar MC..."
              className="w-full bg-vortice-gray border border-vortice-border rounded-xl pl-9 pr-4 py-3 text-white font-body text-sm outline-none focus:border-vortice-red"
            />
          </div>

          {search && (
            <div className="mb-3 max-h-48 overflow-y-auto bg-vortice-gray border border-vortice-border rounded-xl">
              {filtered.map(u => (
                <button
                  key={u.id}
                  onClick={() => { setSelectedUser(u); setSearch('') }}
                  className="w-full flex items-center gap-3 px-4 py-3 hover:bg-white/5 border-b border-vortice-border/30 last:border-0 text-left"
                >
                  <img src={u.photoURL || `https://api.dicebear.com/7.x/initials/svg?seed=${u.alias}`} className="w-8 h-8 rounded-full object-cover" alt="" />
                  <div>
                    <p className="font-body text-sm font-bold text-white">{u.alias || u.displayName}</p>
                    <p className="text-gray-500 text-xs">{u.email}</p>
                  </div>
                  <div className="ml-auto flex items-center gap-1">
                    <Zap size={12} className="text-vortice-red" />
                    <span className="text-white text-xs font-mono-vortice">{u.latas || 0}</span>
                  </div>
                </button>
              ))}
            </div>
          )}

          {selectedUser && (
            <div className="mb-3 flex items-center gap-2 bg-vortice-red/10 border border-vortice-red/30 rounded-xl px-4 py-2.5">
              <img src={selectedUser.photoURL || `https://api.dicebear.com/7.x/initials/svg?seed=${selectedUser.alias}`} className="w-6 h-6 rounded-full" alt="" />
              <span className="font-body font-bold text-white text-sm flex-1">{selectedUser.alias || selectedUser.displayName}</span>
              <button onClick={() => setSelectedUser(null)}><X size={14} className="text-gray-500" /></button>
            </div>
          )}

          {/* Tipo selector */}
          <div className="mb-3 grid grid-cols-3 gap-2">
            {LOGRO_TIPOS.map(tipo => (
              <button
                key={tipo.key}
                onClick={() => setSelectedTipo(tipo)}
                className={`py-2 px-2 rounded-xl border text-xs font-body font-bold transition-all ${selectedTipo.key === tipo.key ? 'border-vortice-red bg-vortice-red/20 text-white' : 'border-vortice-border text-gray-500'}`}
              >
                {tipo.label}
              </button>
            ))}
          </div>

          {/* Description */}
          <input
            value={desc}
            onChange={e => setDesc(e.target.value)}
            placeholder="Descripción del logro (ej: MVP Fecha 8)"
            className="w-full bg-vortice-gray border border-vortice-border rounded-xl px-4 py-3 text-white font-body text-sm outline-none focus:border-vortice-red mb-3"
          />
          <input
            value={evento}
            onChange={e => setEvento(e.target.value)}
            placeholder="Evento (ej: Gran Final · 15/02/2025) — opcional"
            className="w-full bg-vortice-gray border border-vortice-border rounded-xl px-4 py-3 text-white font-body text-sm outline-none focus:border-vortice-red mb-4"
          />

          <button
            onClick={handleAsignar}
            disabled={!selectedUser || !desc.trim() || saving}
            className="w-full bg-vortice-red disabled:bg-gray-800 disabled:text-gray-600 text-white font-display text-lg tracking-wider py-3 rounded-xl transition-all active:scale-95 disabled:cursor-not-allowed"
          >
            {saving ? 'ASIGNANDO...' : 'ASIGNAR LATA'}
          </button>
        </div>

        {/* User list with edit */}
        <div>
          <p className="font-body text-xs text-gray-500 tracking-widest uppercase mb-3">
            MCs registrados ({users.length})
          </p>
          {loading ? (
            <div className="flex justify-center py-8">
              <div className="w-8 h-8 border-2 border-vortice-red border-t-transparent rounded-full animate-spin" />
            </div>
          ) : (
            <div className="space-y-2">
              {users.map(u => (
                <div key={u.id} className="bg-vortice-card border border-vortice-border rounded-xl overflow-hidden">
                  {editUser?.id === u.id ? (
                    <div className="p-4 space-y-3">
                      <p className="font-body text-xs text-gray-500 uppercase tracking-wider">Editando perfil</p>
                      <input value={editAlias} onChange={e => setEditAlias(e.target.value)} placeholder="Alias"
                        className="w-full bg-vortice-gray border border-vortice-border rounded-lg px-3 py-2 text-white font-body text-sm outline-none focus:border-vortice-red" />
                      <input type="number" value={editBatallas} onChange={e => setEditBatallas(e.target.value)} placeholder="Total batallas"
                        className="w-full bg-vortice-gray border border-vortice-border rounded-lg px-3 py-2 text-white font-body text-sm outline-none focus:border-vortice-red" />
                      <div className="flex gap-2">
                        <button onClick={handleEditProfile} disabled={saving} className="flex-1 bg-vortice-red text-white font-body font-bold text-sm py-2 rounded-lg">{saving ? 'Guardando...' : 'Guardar'}</button>
                        <button onClick={() => setEditUser(null)} className="px-4 bg-vortice-gray border border-vortice-border text-gray-400 font-body text-sm rounded-lg">Cancelar</button>
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-center gap-3 px-4 py-3">
                      <img src={u.photoURL || `https://api.dicebear.com/7.x/initials/svg?seed=${u.alias}`} className="w-9 h-9 rounded-full object-cover border border-vortice-border" alt="" />
                      <div className="flex-1 min-w-0">
                        <p className="font-body font-bold text-white text-sm truncate">{u.alias || u.displayName}</p>
                        <p className="text-gray-600 text-xs">{u.email}</p>
                      </div>
                      <div className="flex items-center gap-1 mr-2">
                        <Zap size={12} className="text-vortice-red" />
                        <span className="font-mono-vortice text-white text-sm">{u.latas || 0}</span>
                      </div>
                      <button onClick={() => { setEditUser(u); setEditAlias(u.alias || u.displayName); setEditBatallas(u.stats?.batallasTotal || 0) }}
                        className="p-2 text-gray-500 hover:text-white">
                        <ChevronDown size={16} />
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="h-4" />
      </div>
    </div>
  )
}
