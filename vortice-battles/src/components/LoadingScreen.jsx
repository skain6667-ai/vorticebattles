export default function LoadingScreen() {
  return (
    <div className="fixed inset-0 bg-black flex flex-col items-center justify-center z-50">
      <div className="relative mb-8">
        <div className="w-24 h-24 rounded-full border-2 border-red-500 border-t-transparent animate-spin" />
        <div className="absolute inset-3 rounded-full border-2 border-blue-500 border-b-transparent animate-spin" style={{ animationDirection: 'reverse', animationDuration: '1.5s' }} />
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="font-display text-2xl text-glow-red">V</span>
        </div>
      </div>
      <p className="font-display text-4xl tracking-widest text-white animate-pulse">VÓRTICE</p>
      <p className="font-body text-sm text-gray-500 tracking-[0.3em] mt-1">BATTLES</p>
    </div>
  )
}
