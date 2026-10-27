import React from 'react';
import {AbsoluteFill, interpolate, random, useCurrentFrame} from 'remotion';
import {clamp, ease} from '../lib/anim';
import {HEIGHT, sec, WIDTH} from '../timeline';

const SUN_X = 540;
const SUN_Y = 1330;

/**
 * One stylized hand, palm toward the viewer, fingers up, wrist at the origin.
 * `mirror` flips it to make the other hand. No detail, only a softly-lit silhouette.
 */
const Hand: React.FC<{mirror?: boolean}> = ({mirror}) => (
  <g transform={mirror ? 'scale(-1 1)' : undefined}>
    {/* forearm fading into the dark */}
    <path d="M -80 0 L -95 420 L 95 420 L 78 0 Z" fill="url(#s7-arm)" />
    {/* palm */}
    <path d="M -84 0 C -96 -90 -100 -180 -92 -250 L 88 -250 C 98 -170 96 -80 80 0 Z" fill="url(#s7-skin)" />
    {/* fingers (little → index), held together */}
    <rect x={-92} y={-400} width={42} height={180} rx={21} fill="url(#s7-skin)" transform="rotate(-5 -71 -250)" />
    <rect x={-48} y={-445} width={44} height={220} rx={22} fill="url(#s7-skin)" transform="rotate(-2 -26 -250)" />
    <rect x={-2} y={-455} width={44} height={230} rx={22} fill="url(#s7-skin)" />
    <rect x={44} y={-430} width={42} height={205} rx={21} fill="url(#s7-skin)" transform="rotate(3 65 -250)" />
    {/* thumb, toward the centre */}
    <rect x={66} y={-205} width={46} height={150} rx={23} fill="url(#s7-skin)" transform="rotate(24 88 -70)" />
  </g>
);

/** Scene 7 — stylized raised hands in dua against the sunrise. */
export const Dua: React.FC = () => {
  const frame = useCurrentFrame();
  const t = frame / 30;
  const rise = interpolate(frame, [0, sec(7)], [0, 1], {...clamp, easing: ease});
  const handsUp = interpolate(frame, [0, sec(2.2)], [140, 0], {...clamp, easing: ease});
  const breathe = Math.sin(t * 1.4) * 4;

  return (
    <AbsoluteFill style={{background: '#0b1630'}}>
      <svg width={WIDTH} height={HEIGHT} style={{position: 'absolute'}}>
        <defs>
          <linearGradient id="s7-sky" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#0a1530" />
            <stop offset="0.35" stopColor="#1f4a66" />
            <stop offset="0.58" stopColor="#c98a5a" />
            <stop offset="0.7" stopColor="#ffd68a" />
            <stop offset="1" stopColor="#3a2a28" />
          </linearGradient>
          <radialGradient id="s7-sun">
            <stop offset="0" stopColor="#fffbea" />
            <stop offset="0.15" stopColor="#ffe6a8" />
            <stop offset="0.45" stopColor="#ffbe5c" stopOpacity="0.45" />
            <stop offset="1" stopColor="#ffbe5c" stopOpacity="0" />
          </radialGradient>
          <linearGradient id="s7-skin" x1="0" y1="-450" x2="0" y2="0" gradientUnits="userSpaceOnUse">
            <stop offset="0" stopColor="#4a2e1e" />
            <stop offset="1" stopColor="#24150e" />
          </linearGradient>
          <linearGradient id="s7-arm" x1="0" y1="0" x2="0" y2="420" gradientUnits="userSpaceOnUse">
            <stop offset="0" stopColor="#24150e" />
            <stop offset="1" stopColor="#080404" />
          </linearGradient>
          <linearGradient id="s7-ray" x1="0" y1="1" x2="0" y2="0">
            <stop offset="0" stopColor="#ffe2a0" stopOpacity="0.4" />
            <stop offset="1" stopColor="#ffe2a0" stopOpacity="0" />
          </linearGradient>
          {/* golden rim light around the silhouettes */}
          <filter id="s7-rim" x="-30%" y="-30%" width="160%" height="160%">
            <feMorphology in="SourceAlpha" operator="dilate" radius={5} result="d" />
            <feGaussianBlur in="d" stdDeviation={7} result="b" />
            <feFlood floodColor="#ffc96a" />
            <feComposite in2="b" operator="in" result="glow" />
            <feMerge>
              <feMergeNode in="glow" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
          <filter id="s7-blur">
            <feGaussianBlur stdDeviation={10} />
          </filter>
        </defs>
        <rect width={WIDTH} height={HEIGHT} fill="url(#s7-sky)" />
        {/* rotating rays */}
        <g transform={`rotate(${t * 2.5} ${SUN_X} ${SUN_Y - rise * 120})`} filter="url(#s7-blur)" opacity={0.55 + rise * 0.35}>
          {new Array(16).fill(0).map((_, i) => (
            <path
              key={i}
              d={`M ${SUN_X - 14} ${SUN_Y - rise * 120} L ${SUN_X - 70} ${SUN_Y - rise * 120 - 1500} L ${SUN_X + 70} ${SUN_Y - rise * 120 - 1500} L ${SUN_X + 14} ${SUN_Y - rise * 120} Z`}
              fill="url(#s7-ray)"
              transform={`rotate(${(i / 16) * 360} ${SUN_X} ${SUN_Y - rise * 120})`}
              opacity={0.5 + 0.5 * Math.sin(i * 1.7)}
            />
          ))}
        </g>
        <circle cx={SUN_X} cy={SUN_Y - rise * 120} r={620} fill="url(#s7-sun)" />
        <circle cx={SUN_X} cy={SUN_Y - rise * 120} r={110} fill="#fff8e2" />
        {/* distant calm sea line */}
        <rect x={0} y={1440} width={WIDTH} height={HEIGHT - 1440} fill="#2a2a3a" opacity={0.85} />
        <rect x={0} y={1440} width={WIDTH} height={4} fill="#ffe3a8" opacity={0.6} />
        {/* raised hands */}
        <g transform={`translate(0 ${handsUp + breathe})`} filter="url(#s7-rim)">
          <g transform={`translate(${SUN_X - 150} 1840) rotate(-8)`}>
            <Hand />
          </g>
          <g transform={`translate(${SUN_X + 150} 1840) rotate(8)`}>
            <Hand mirror />
          </g>
        </g>
        {/* rising light motes */}
        {new Array(40).fill(0).map((_, i) => {
          const y = HEIGHT - ((random(`h-y-${i}`) * HEIGHT + t * (20 + random(`h-s-${i}`) * 40)) % HEIGHT);
          return (
            <circle
              key={i}
              cx={random(`h-x-${i}`) * WIDTH + Math.sin(t + i) * 15}
              cy={y}
              r={1.5 + random(`h-r-${i}`) * 2.5}
              fill="#ffe2a0"
              opacity={0.6 * Math.abs(Math.sin(t * 1.3 + i))}
            />
          );
        })}
      </svg>
    </AbsoluteFill>
  );
};
