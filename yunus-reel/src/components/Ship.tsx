import React from 'react';

/**
 * A small wooden sailing ship, drawn with its waterline at (0, 0).
 * `billow` (−1..1) animates the sail, `lantern` (0..1) the stern light.
 */
export const Ship: React.FC<{
  x: number;
  y: number;
  angle?: number;
  scale?: number;
  billow?: number;
  lantern?: number;
  tone?: 'dark' | 'warm' | 'silhouette';
  id: string;
}> = ({x, y, angle = 0, scale = 1, billow = 0, lantern = 0.6, tone = 'warm', id}) => {
  const hullTop = tone === 'silhouette' ? '#0b0d14' : tone === 'dark' ? '#3a2a1e' : '#6b4527';
  const hullBot = tone === 'silhouette' ? '#05060a' : tone === 'dark' ? '#120c08' : '#2a170b';
  const sail = tone === 'silhouette' ? '#151821' : tone === 'dark' ? '#8d8676' : '#e9dcc0';
  const sailShade = tone === 'silhouette' ? '#0d0f16' : tone === 'dark' ? '#4a463d' : '#b9a27c';
  const b = billow * 22;
  return (
    <g transform={`translate(${x} ${y}) rotate(${angle}) scale(${scale})`}>
      <defs>
        <linearGradient id={`${id}-hull`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor={hullTop} />
          <stop offset="1" stopColor={hullBot} />
        </linearGradient>
        <linearGradient id={`${id}-sail`} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor={sailShade} />
          <stop offset="0.55" stopColor={sail} />
          <stop offset="1" stopColor={sailShade} />
        </linearGradient>
        <radialGradient id={`${id}-lamp`}>
          <stop offset="0" stopColor="#ffe3a0" stopOpacity="1" />
          <stop offset="0.25" stopColor="#ffb547" stopOpacity="0.7" />
          <stop offset="1" stopColor="#ff9a2a" stopOpacity="0" />
        </radialGradient>
      </defs>
      {/* rigging */}
      <path d="M 0 -350 L -175 -52 M 0 -350 L 190 -60" stroke={sailShade} strokeWidth={2} opacity={0.6} fill="none" />
      {/* mast + yard */}
      <rect x={-7} y={-360} width={14} height={330} fill={hullTop} />
      <rect x={-118} y={-318} width={236} height={9} rx={4} fill={hullTop} />
      {/* square sail */}
      <path
        d={`M -110 -310 Q 0 ${-290 + b * 0.4} 110 -310 Q ${118 + b} -200 100 -105 Q 0 ${-80 + b} -100 -105 Q ${-118 + b} -200 -110 -310 Z`}
        fill={`url(#${id}-sail)`}
      />
      <path
        d={`M -60 -300 Q ${-62 + b * 0.6} -200 -55 -98 M 60 -300 Q ${62 + b * 0.6} -200 55 -98`}
        stroke={sailShade}
        strokeWidth={3}
        opacity={0.5}
        fill="none"
      />
      {/* pennant */}
      <path d={`M 0 -360 L ${44 + b} ${-352 + b * 0.2} L 0 -342 Z`} fill={tone === 'silhouette' ? '#0b0d14' : '#c4973e'} />
      {/* hull */}
      <path
        d="M -205 -62 L -150 -44 L 160 -44 L 222 -74 Q 200 10 128 44 L -120 44 Q -186 14 -205 -62 Z"
        fill={`url(#${id}-hull)`}
      />
      {tone !== 'silhouette' && (
        <g stroke="#1a0e06" strokeWidth={2.5} opacity={0.55} fill="none">
          <path d="M -185 -22 Q 0 -10 205 -30" />
          <path d="M -160 8 Q 0 20 180 4" />
          <path d="M -130 30 Q 0 40 145 30" />
        </g>
      )}
      <path d="M -205 -62 L -150 -44 L 160 -44 L 222 -74" stroke="#c4973e" strokeWidth={3} opacity={tone === 'silhouette' ? 0 : 0.5} fill="none" />
      {/* stern lantern */}
      <rect x={-172} y={-96} width={4} height={40} fill={hullTop} />
      <circle cx={-170} cy={-100} r={70} fill={`url(#${id}-lamp)`} opacity={lantern} />
      <circle cx={-170} cy={-100} r={7} fill="#ffe7b0" opacity={Math.min(1, lantern * 1.4)} />
    </g>
  );
};
