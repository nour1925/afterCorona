import React from 'react';
import {AbsoluteFill, interpolate, random, useCurrentFrame} from 'remotion';
import {Camera} from '../components/Camera';
import {SoftBlur} from '../components/WaveLayer';
import {clamp, ease} from '../lib/anim';
import {waveY} from '../lib/waves';
import {HEIGHT, sec, WIDTH} from '../timeline';

const HORIZON = 820;
const SHORE = 1060;

// Vine stem: rises from the sand and arches over to the right.
const STEM = 'M 170 1150 C 150 1000 190 860 290 780 C 400 690 560 680 690 720 C 800 755 880 800 930 880';
const STEM_LENGTH = 1150;

/** Point on the stem bezier chain at parameter u (0..1), approximated per segment. */
const bez = (p0: number[], p1: number[], p2: number[], p3: number[], u: number) => {
  const m = 1 - u;
  return [
    m * m * m * p0[0] + 3 * m * m * u * p1[0] + 3 * m * u * u * p2[0] + u * u * u * p3[0],
    m * m * m * p0[1] + 3 * m * m * u * p1[1] + 3 * m * u * u * p2[1] + u * u * u * p3[1],
  ];
};
const SEGMENTS = [
  [[170, 1150], [150, 1000], [190, 860], [290, 780]],
  [[290, 780], [400, 690], [560, 680], [690, 720]],
  [[690, 720], [800, 755], [880, 800], [930, 880]],
];
const stemPoint = (u: number) => {
  const s = Math.min(2, Math.floor(u * 3));
  const [a, b, c, d] = SEGMENTS[s];
  return bez(a, b, c, d, u * 3 - s);
};

// Leaves along the stem: position (0..1), size, angle.
const LEAVES = [
  {u: 0.12, s: 0.8, a: -150},
  {u: 0.22, s: 1.0, a: -20},
  {u: 0.33, s: 1.15, a: -130},
  {u: 0.42, s: 1.3, a: 10},
  {u: 0.5, s: 1.25, a: -170},
  {u: 0.58, s: 1.4, a: 30},
  {u: 0.66, s: 1.3, a: -150},
  {u: 0.74, s: 1.35, a: 50},
  {u: 0.82, s: 1.2, a: -120},
  {u: 0.9, s: 1.1, a: 70},
  {u: 0.98, s: 0.9, a: 110},
];

/** Broad, lobed gourd leaf with its stalk at the origin, pointing along +y. */
const Leaf: React.FC<{scale: number}> = ({scale}) => (
  <g transform={`scale(${scale})`}>
    <path d="M 0 0 L 0 30" stroke="#2f5a2a" strokeWidth={5} />
    <path
      d="M 0 30 C -40 20 -95 40 -100 90 C -120 100 -118 140 -90 150 C -95 185 -60 210 -30 195 C -15 215 15 215 30 195 C 60 210 95 185 90 150 C 118 140 120 100 100 90 C 95 40 40 20 0 30 Z"
      fill="url(#s6-leaf)"
    />
    <g stroke="#9cc98a" strokeWidth={2.5} opacity={0.55} fill="none">
      <path d="M 0 34 L 0 190" />
      <path d="M 0 70 L -70 110 M 0 70 L 70 110 M 0 110 L -55 170 M 0 110 L 55 170" />
    </g>
  </g>
);

/** Scene 6 — dawn on a quiet beach; a gourd vine grows broad, shady leaves. */
export const Dawn: React.FC = () => {
  const frame = useCurrentFrame();
  const t = frame / 30;
  const sunrise = interpolate(frame, [0, sec(8.8)], [0, 1], {...clamp, easing: ease});
  const growth = interpolate(frame, [sec(0.6), sec(6.5)], [0, 1], {...clamp, easing: ease});
  const lap = (Math.sin(t * 1.3) + 1) / 2;
  const shadeOpacity = growth * 0.45;

  return (
    <AbsoluteFill style={{background: '#1a2c48'}}>
      <Camera from={1.0} to={1.07} originY={45}>
        <svg width={WIDTH} height={HEIGHT} style={{position: 'absolute'}}>
          <defs>
            <SoftBlur id="s6-blur" amount={6} />
            <linearGradient id="s6-sky" x1="0" y1="0" x2="0" y2={HORIZON} gradientUnits="userSpaceOnUse">
              <stop offset="0" stopColor="#13264a" />
              <stop offset="0.45" stopColor="#3c6a8a" />
              <stop offset="0.8" stopColor="#e3b08c" />
              <stop offset="1" stopColor="#fcdca0" />
            </linearGradient>
            <radialGradient id="s6-sun">
              <stop offset="0" stopColor="#fffbe8" />
              <stop offset="0.2" stopColor="#ffe3a0" />
              <stop offset="0.5" stopColor="#ffc670" stopOpacity="0.35" />
              <stop offset="1" stopColor="#ffc670" stopOpacity="0" />
            </radialGradient>
            <linearGradient id="s6-sea" x1="0" y1={HORIZON} x2="0" y2={SHORE} gradientUnits="userSpaceOnUse">
              <stop offset="0" stopColor="#e9c9a0" />
              <stop offset="0.25" stopColor="#5e93a0" />
              <stop offset="1" stopColor="#1f5f6c" />
            </linearGradient>
            <linearGradient id="s6-sand" x1="0" y1={SHORE} x2="0" y2={HEIGHT} gradientUnits="userSpaceOnUse">
              <stop offset="0" stopColor="#e2c093" />
              <stop offset="0.45" stopColor="#ad8459" />
              <stop offset="1" stopColor="#4f3523" />
            </linearGradient>
            <linearGradient id="s6-leaf" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0" stopColor="#4f8f45" />
              <stop offset="1" stopColor="#24522b" />
            </linearGradient>
            <filter id="s6-sand-tex">
              <feTurbulence type="fractalNoise" baseFrequency="0.025 0.09" numOctaves={3} seed={5} />
              <feColorMatrix type="matrix" values="0 0 0 0 0.35  0 0 0 0 0.24  0 0 0 0 0.14  0 0 0 0.3 0" />
            </filter>
          </defs>
          <rect width={WIDTH} height={HORIZON + 2} fill="url(#s6-sky)" />
          {/* soft dawn clouds */}
          {[0, 1, 2, 3].map((i) => (
            <ellipse
              key={i}
              cx={120 + i * 290 + t * 5}
              cy={300 + (i % 2) * 120}
              rx={220}
              ry={26}
              fill="#f6c9a6"
              opacity={0.35}
              filter="url(#s6-blur)"
            />
          ))}
          {/* sun rising */}
          <circle cx={600} cy={HORIZON + 40 - sunrise * 140} r={460} fill="url(#s6-sun)" />
          <circle cx={600} cy={HORIZON + 40 - sunrise * 140} r={80} fill="#fff6dc" />
          {/* calm sea */}
          <rect x={0} y={HORIZON} width={WIDTH} height={SHORE - HORIZON + 40} fill="url(#s6-sea)" />
          {new Array(16).fill(0).map((_, i) => (
            <rect
              key={i}
              x={600 - (80 + i * 14) / 2 + Math.sin(t * 2 + i) * 10}
              y={HORIZON + 8 + i * 14}
              width={80 + i * 14}
              height={3}
              rx={2}
              fill="#fff1c8"
              opacity={0.5 - i * 0.025}
            />
          ))}
          {[0, 1, 2].map((i) => {
            const o = {baseY: HORIZON + 70 + i * 55, amp: 3 + i, wavelength: 280 + i * 60, phase: t * (0.8 + i * 0.2) + i};
            return (
              <path
                key={i}
                d={`M 0 ${waveY(0, o)} ${new Array(29).fill(0).map((_, k) => `L ${k * 40} ${waveY(k * 40, o)}`).join(' ')}`}
                stroke="#d8f0ee"
                strokeWidth={3}
                opacity={0.25}
                fill="none"
              />
            );
          })}
          {/* sand */}
          <rect x={0} y={SHORE} width={WIDTH} height={HEIGHT - SHORE} fill="url(#s6-sand)" />
          <rect x={0} y={SHORE} width={WIDTH} height={HEIGHT - SHORE} filter="url(#s6-sand-tex)" />
          {/* gentle wave lapping the shore */}
          <path
            d={`M 0 ${SHORE - 10} ${new Array(29)
              .fill(0)
              .map((_, k) => `L ${k * 40} ${SHORE + 10 + lap * 40 + Math.sin(k * 0.7 + t) * 8}`)
              .join(' ')} L ${WIDTH} ${SHORE - 10} Z`}
            fill="#8cc4c4"
            opacity={0.55}
          />
          <path
            d={`M 0 ${SHORE + 10 + lap * 40} ${new Array(29)
              .fill(0)
              .map((_, k) => `L ${k * 40} ${SHORE + 10 + lap * 40 + Math.sin(k * 0.7 + t) * 8}`)
              .join(' ')}`}
            stroke="#fffaf0"
            strokeWidth={6}
            opacity={0.7}
            fill="none"
            filter="url(#s6-blur)"
          />
          {/* cool shade cast by the leaves */}
          <ellipse cx={560} cy={1200} rx={480 * growth} ry={70 * growth} fill="#2a2a3a" opacity={shadeOpacity} filter="url(#s6-blur)" />
          {/* the vine */}
          <path
            d={STEM}
            stroke="#3b6b2e"
            strokeWidth={14}
            strokeLinecap="round"
            fill="none"
            strokeDasharray={STEM_LENGTH}
            strokeDashoffset={STEM_LENGTH * (1 - growth)}
          />
          <path
            d={STEM}
            stroke="#8cc070"
            strokeWidth={3}
            strokeLinecap="round"
            fill="none"
            strokeDasharray={STEM_LENGTH}
            strokeDashoffset={STEM_LENGTH * (1 - growth)}
            opacity={0.6}
            transform="translate(-3 -3)"
          />
          {/* curling tendrils */}
          {[0.3, 0.55, 0.8].map((u, i) => {
            const [x, y] = stemPoint(u);
            const g = interpolate(growth, [u, Math.min(1, u + 0.15)], [0, 1], clamp);
            return (
              <path
                key={i}
                d={`M ${x} ${y} c 10 30 40 40 30 70 c -6 18 -26 12 -18 -2`}
                stroke="#5e9a4a"
                strokeWidth={3}
                fill="none"
                strokeDasharray={140}
                strokeDashoffset={140 * (1 - g)}
              />
            );
          })}
          {/* hanging gourds */}
          {[0.6, 0.86].map((u, i) => {
            const [x, y] = stemPoint(u);
            const g = interpolate(frame, [sec(5.6 + i * 0.6), sec(7 + i * 0.6)], [0, 1], {...clamp, easing: ease});
            return (
              <g key={i} transform={`translate(${x} ${y + 20}) rotate(${Math.sin(t * 1.2 + i) * 4}) scale(${g})`}>
                <path d="M 0 0 L 0 26" stroke="#3b6b2e" strokeWidth={4} />
                <ellipse cx={0} cy={70} rx={30} ry={52} fill="#b7c98a" />
                <ellipse cx={-8} cy={58} rx={10} ry={26} fill="#e4ecc0" opacity={0.6} />
              </g>
            );
          })}
          {LEAVES.map((leaf, i) => {
            const [x, y] = stemPoint(leaf.u);
            const g = interpolate(growth, [leaf.u - 0.05, leaf.u + 0.12], [0, 1], {...clamp, easing: ease});
            const sway = Math.sin(t * 1.4 + i * 0.9) * 4;
            return (
              <g key={i} transform={`translate(${x} ${y}) rotate(${leaf.a + sway})`}>
                <Leaf scale={leaf.s * g} />
              </g>
            );
          })}
          {/* birds greeting the morning */}
          {[0, 1, 2].map((i) => {
            const bx = 760 + t * (24 + i * 5) + i * 60;
            const by = 360 + i * 30 - t * 4;
            const flap = Math.sin(t * 7 + i * 2) * 7;
            return (
              <path
                key={i}
                d={`M ${bx - 14} ${by - flap} Q ${bx - 7} ${by - 3} ${bx} ${by} Q ${bx + 7} ${by - 3} ${bx + 14} ${by - flap}`}
                stroke="#3a3a52"
                strokeWidth={3}
                fill="none"
              />
            );
          })}
          {/* morning motes */}
          {new Array(24).fill(0).map((_, i) => (
            <circle
              key={i}
              cx={random(`d-x-${i}`) * WIDTH + Math.sin(t + i) * 12}
              cy={500 + random(`d-y-${i}`) * 600 - t * 6}
              r={1.5 + random(`d-r-${i}`) * 2}
              fill="#fff3cc"
              opacity={0.5 * Math.abs(Math.sin(t * 1.5 + i))}
            />
          ))}
        </svg>
      </Camera>
    </AbsoluteFill>
  );
};
