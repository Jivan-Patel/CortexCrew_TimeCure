import React from 'react';

// Half-green (health), half-red (time) clock logo
export default function Logo({ size = 32 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" fill="none">
      {/* Left arc - green (health) */}
      <path d="M16 2 A14 14 0 0 0 16 30 Z" fill="rgba(63,185,80,0.15)" />
      <path d="M16 2 A14 14 0 0 0 16 30" stroke="#3fb950" strokeWidth="1.5" fill="none" strokeLinecap="round" />
      {/* Right arc - red (time) */}
      <path d="M16 2 A14 14 0 0 1 16 30 Z" fill="rgba(248,81,73,0.12)" />
      <path d="M16 2 A14 14 0 0 1 16 30" stroke="#f85149" strokeWidth="1.5" fill="none" strokeLinecap="round" />
      {/* Center dot */}
      <circle cx="16" cy="16" r="1.5" fill="#e6edf3" />
      {/* Hour hand - green */}
      <line x1="16" y1="16" x2="16" y2="7" stroke="#3fb950" strokeWidth="1.75" strokeLinecap="round" />
      {/* Minute hand - red */}
      <line x1="16" y1="16" x2="22" y2="19" stroke="#f85149" strokeWidth="1.5" strokeLinecap="round" />
      {/* Tick marks */}
      {[0, 90, 180, 270].map(deg => {
        const r = Math.PI * deg / 180;
        const x1 = 16 + 12 * Math.sin(r), y1 = 16 - 12 * Math.cos(r);
        const x2 = 16 + 14 * Math.sin(r), y2 = 16 - 14 * Math.cos(r);
        return <line key={deg} x1={x1} y1={y1} x2={x2} y2={y2} stroke="#30363d" strokeWidth="1.5" strokeLinecap="round" />;
      })}
    </svg>
  );
}
