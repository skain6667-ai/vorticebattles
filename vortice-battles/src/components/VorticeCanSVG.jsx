export default function VorticeCanSVG({ size = 60, glowing = false, category = 'default' }) {
  const colors = {
    filtro: { top: '#FF0033', accent: '#CC0028' },
    mencion: { top: '#0066FF', accent: '#0044CC' },
    batalla: { top: '#C0C0C0', accent: '#888888' },
    default: { top: '#333333', accent: '#222222' },
  }
  const c = colors[category] || colors.default

  return (
    <svg width={size} height={size * 2.2} viewBox="0 0 60 132" fill="none" xmlns="http://www.w3.org/2000/svg"
      style={glowing ? { filter: `drop-shadow(0 0 8px ${c.top})` } : {}}>
      {/* Can body */}
      <rect x="8" y="18" width="44" height="96" rx="4" fill="#1a1a1a" />
      <rect x="8" y="18" width="22" height="96" rx="0" fill="#0f0f0f" />
      {/* Silver stripe */}
      <rect x="30" y="18" width="22" height="96" rx="0" fill="#1e1e1e" />
      <rect x="29" y="18" width="4" height="96" fill="#333" />
      {/* Top */}
      <ellipse cx="30" cy="18" rx="22" ry="5" fill={c.top} />
      <ellipse cx="30" cy="16" rx="18" ry="3.5" fill={c.accent} />
      {/* Pull tab */}
      <rect x="26" y="10" width="8" height="8" rx="1" fill="#555" />
      <circle cx="30" cy="10" r="2" fill="#333" />
      {/* Bottom */}
      <ellipse cx="30" cy="114" rx="22" ry="5" fill="#111" />
      {/* Vortex logo on can */}
      <circle cx="30" cy="60" r="14" stroke="#333" strokeWidth="0.5" fill="none" />
      <circle cx="30" cy="60" r="10" stroke="#2a2a2a" strokeWidth="0.5" fill="none" />
      <text x="30" y="56" textAnchor="middle" fill={c.top} fontSize="7" fontWeight="bold" fontFamily="Arial">VÓRTICE</text>
      <text x="30" y="65" textAnchor="middle" fill="#888" fontSize="5" fontFamily="Arial">ENERGY</text>
      {/* Shine */}
      <rect x="42" y="22" width="3" height="80" rx="1.5" fill="rgba(255,255,255,0.06)" />
    </svg>
  )
}
