import React from 'react'

export default function Logo({ size = 'h-10', src }){
  const fallbacks = [src, import.meta.env.VITE_APP_LOGO_URL, '/logo.png'].filter(Boolean)
  const [idx, setIdx] = React.useState(0)

  const cur = fallbacks[idx]

  if (!cur) {
    // Silent fallback SVG mark
    return (
      <svg width="28" height="28" viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg" className="rounded-lg shadow" aria-label="Logo">
        <defs>
          <linearGradient id="g1" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#111827"/>
            <stop offset="100%" stopColor="#4b5563"/>
          </linearGradient>
          <linearGradient id="g2" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#10b981"/>
            <stop offset="100%" stopColor="#22d3ee"/>
          </linearGradient>
        </defs>
        <rect x="0" y="0" width="64" height="64" rx="12" fill="url(#g1)"/>
        <path d="M14 42 L22 20 L30 38 L38 20 L46 42" fill="none" stroke="url(#g2)" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M24 46 L40 30" stroke="#22d3ee" strokeWidth="4" strokeLinecap="round"/>
      </svg>
    )
  }

  return (
    <img
      src={cur}
      alt="Logo"
      className={`${size} w-auto object-contain`}
      onError={()=>setIdx(i=> (i+1 < fallbacks.length ? i+1 : fallbacks.length))}
    />
  )
}


