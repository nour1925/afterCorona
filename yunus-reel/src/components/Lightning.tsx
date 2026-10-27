import React from 'react';
import {AbsoluteFill, random, useCurrentFrame} from 'remotion';
import {flash} from '../lib/anim';
import {HEIGHT, WIDTH} from '../timeline';

const boltPath = (seed: string, startX: number, endY: number) => {
  let x = startX;
  let y = -20;
  let d = `M ${x} ${y}`;
  let i = 0;
  while (y < endY) {
    y += 40 + random(`${seed}-dy-${i}`) * 60;
    x += (random(`${seed}-dx-${i}`) - 0.5) * 110;
    d += ` L ${x.toFixed(1)} ${y.toFixed(1)}`;
    i++;
  }
  return d;
};

const branchPath = (seed: string, sx: number, sy: number) => {
  let x = sx;
  let y = sy;
  let d = `M ${x} ${y}`;
  const dir = random(`${seed}-dir`) > 0.5 ? 1 : -1;
  for (let i = 0; i < 7; i++) {
    y += 18 + random(`${seed}-by-${i}`) * 30;
    x += dir * (random(`${seed}-bx-${i}`) * 50 - 12);
    d += ` L ${x.toFixed(1)} ${y.toFixed(1)}`;
  }
  return d;
};

/** Lightning bolts + full-frame sky flash at the given frames. */
export const Lightning: React.FC<{strikes: {at: number; x: number; endY?: number}[]}> = ({strikes}) => {
  const frame = useCurrentFrame();
  let skyFlash = 0;
  return (
    <AbsoluteFill style={{pointerEvents: 'none'}}>
      <svg width={WIDTH} height={HEIGHT} style={{position: 'absolute'}}>
        <defs>
          <filter id="bolt-glow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="10" result="b" />
            <feMerge>
              <feMergeNode in="b" />
              <feMergeNode in="b" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>
        {strikes.map((s, i) => {
          // double-strike flicker, like real lightning
          const v = Math.max(flash(frame, s.at, 1, 7), flash(frame, s.at + 4, 1, 12) * 0.9);
          skyFlash = Math.max(skyFlash, v);
          if (v <= 0.01) return null;
          const seed = `bolt-${i}`;
          const d = boltPath(seed, s.x, s.endY ?? 800);
          return (
            <g key={i} opacity={v} filter="url(#bolt-glow)">
              <path d={d} stroke="#e9f3ff" strokeWidth={5} fill="none" strokeLinejoin="round" />
              <path d={branchPath(seed, s.x + 20, 260)} stroke="#d5e6ff" strokeWidth={3} fill="none" />
              <path d={branchPath(`${seed}-b`, s.x - 30, 420)} stroke="#d5e6ff" strokeWidth={2.5} fill="none" />
            </g>
          );
        })}
      </svg>
      <AbsoluteFill
        style={{
          background: 'radial-gradient(ellipse at 50% 15%, rgba(200,220,255,0.75), rgba(120,150,200,0.25) 60%, rgba(0,0,0,0) 100%)',
          opacity: skyFlash * 0.55,
          mixBlendMode: 'screen',
        }}
      />
    </AbsoluteFill>
  );
};
