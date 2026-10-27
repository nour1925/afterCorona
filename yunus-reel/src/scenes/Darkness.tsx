import React from 'react';
import {AbsoluteFill, interpolate, random, useCurrentFrame} from 'remotion';
import {clamp, ease} from '../lib/anim';
import {HEIGHT, sec, WIDTH} from '../timeline';

const CX = 540;
const CY = 470;

/** Scene 5 — total darkness; a tiny light grows as the dua is made. */
export const Darkness: React.FC = () => {
  const frame = useCurrentFrame();
  const t = frame / 30;
  const grow = interpolate(frame, [sec(1.2), sec(11.5)], [0, 1], {...clamp, easing: ease});
  const flicker = 1 + 0.05 * Math.sin(t * 7.3) + 0.03 * Math.sin(t * 13.1);
  const core = (3 + grow * 26) * flicker;
  const halo = (30 + grow * 460) * flicker;

  return (
    <AbsoluteFill style={{background: '#010103'}}>
      <svg width={WIDTH} height={HEIGHT} style={{position: 'absolute'}}>
        <defs>
          <radialGradient id="s5-halo">
            <stop offset="0" stopColor="#fff2c8" stopOpacity="0.95" />
            <stop offset="0.12" stopColor="#ffd27a" stopOpacity="0.6" />
            <stop offset="0.4" stopColor="#d99236" stopOpacity="0.18" />
            <stop offset="1" stopColor="#d99236" stopOpacity="0" />
          </radialGradient>
          <radialGradient id="s5-ring">
            <stop offset="0.8" stopColor="#0e1a2a" stopOpacity="0" />
            <stop offset="0.95" stopColor="#13243a" stopOpacity="0.55" />
            <stop offset="1" stopColor="#0e1a2a" stopOpacity="0" />
          </radialGradient>
          <filter id="s5-blur">
            <feGaussianBlur stdDeviation="6" />
          </filter>
        </defs>
        {/* three layers of darkness — night, sea, the whale — slowly closing in */}
        {[0, 1, 2].map((i) => {
          const r = 1500 - i * 380 - t * 18;
          return (
            <circle
              key={i}
              cx={CX}
              cy={CY + 200}
              r={r}
              fill="url(#s5-ring)"
              opacity={interpolate(frame, [i * 20, i * 20 + 40], [0, 0.9], clamp) * (1 - grow * 0.6)}
            />
          );
        })}
        {/* soft rays */}
        <g opacity={grow * 0.5} filter="url(#s5-blur)">
          {new Array(14).fill(0).map((_, i) => {
            const a = (i / 14) * Math.PI * 2 + t * 0.05;
            const len = halo * (1.5 + 0.5 * Math.sin(i * 2.3 + t));
            return (
              <line
                key={i}
                x1={CX}
                y1={CY}
                x2={CX + Math.cos(a) * len}
                y2={CY + Math.sin(a) * len}
                stroke="#ffcf7a"
                strokeWidth={4 + (i % 3) * 3}
                opacity={0.35}
              />
            );
          })}
        </g>
        <circle cx={CX} cy={CY} r={halo} fill="url(#s5-halo)" opacity={0.35 + grow * 0.65} />
        <circle cx={CX} cy={CY} r={core} fill="#fff6dd" filter="url(#s5-blur)" opacity={0.9} />
        <circle cx={CX} cy={CY} r={core * 0.45} fill="#ffffff" />
        {/* drifting golden motes */}
        {new Array(50).fill(0).map((_, i) => {
          const ang = random(`m-a-${i}`) * Math.PI * 2;
          const dist = 60 + random(`m-d-${i}`) * 520;
          const drift = t * (6 + random(`m-s-${i}`) * 10);
          const x = CX + Math.cos(ang) * dist + Math.sin(t * 0.6 + i) * 14;
          const y = CY + Math.sin(ang) * dist * 0.9 - drift;
          const near = Math.max(0, 1 - dist / (halo * 1.3 + 40));
          return (
            <circle key={i} cx={x} cy={y} r={1.2 + random(`m-r-${i}`) * 2.6} fill="#ffd98a" opacity={near * (0.4 + 0.6 * Math.abs(Math.sin(t * 2 + i)))} />
          );
        })}
      </svg>
    </AbsoluteFill>
  );
};
