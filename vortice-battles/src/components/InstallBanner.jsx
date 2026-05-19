import { useState, useEffect } from 'react'
import { Download, X } from 'lucide-react'

export default function InstallBanner() {
  const [prompt, setPrompt] = useState(null)
  const [visible, setVisible] = useState(false)
  const [dismissed, setDismissed] = useState(false)

  useEffect(() => {
    if (localStorage.getItem('pwa-dismissed')) return
    const handler = (e) => {
      e.preventDefault()
      setPrompt(e)
      setVisible(true)
    }
    window.addEventListener('beforeinstallprompt', handler)
    return () => window.removeEventListener('beforeinstallprompt', handler)
  }, [])

  const install = async () => {
    if (!prompt) return
    prompt.prompt()
    const { outcome } = await prompt.userChoice
    if (outcome === 'accepted') setVisible(false)
  }

  const dismiss = () => {
    setVisible(false)
    setDismissed(true)
    localStorage.setItem('pwa-dismissed', '1')
  }

  if (!visible || dismissed) return null

  return (
    <div className="fixed top-0 left-0 right-0 z-50 bg-vortice-gray border-b border-vortice-border flex items-center gap-3 px-4 py-3 animate-slide-up">
      <div className="w-8 h-8 bg-vortice-red rounded-lg flex items-center justify-center flex-shrink-0">
        <Download size={16} className="text-white" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="font-display text-sm text-white leading-none">INSTALAR VÓRTICE BATTLES</p>
        <p className="text-[11px] text-gray-400 mt-0.5">Acceso rápido desde tu pantalla de inicio</p>
      </div>
      <button onClick={install} className="bg-vortice-red text-white text-xs font-bold px-3 py-1.5 rounded-md font-body tracking-wider flex-shrink-0">
        INSTALAR
      </button>
      <button onClick={dismiss} className="text-gray-500 flex-shrink-0">
        <X size={16} />
      </button>
    </div>
  )
}
