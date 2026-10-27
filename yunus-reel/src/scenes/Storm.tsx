import React from 'react';
import {AbsoluteFill, useCurrentFrame} from 'remotion';
import {Camera} from '../components/Camera';
import {Lightning} from '../components/Lightning';
import {Rain} from '../components/Rain';
import {Ship} from '../components/Ship';
import {SoftBlur, WaveLayer} from '../components/WaveLayer';
import {waveAngle, waveY, WaveOpts} from '../lib/waves';
import {HEIGHT, WIDTH} from '../timeline';

/** Scene 1 — stormy black sea, a lone wooden ship tossed, lightning. */
export const Storm: React.FC = () => {
  const frame = useCurrentFrame();
  const t = frame / 30;

  const far: WaveOpts = {baseY: 790, amp: 14, wavelength: 220, phase: t * 1.2, chop: 0.5};
  const back: WaveOpts = {baseY: 840, amp: 26, wavelength: 340, phase: t * 1.6 + 0.5, chop: 0.6};
  const mid: WaveOpts = {baseY: 930, amp: 46, wavelength: 620, phase: t * 1.8 + 1, chop: 0.7};
  const front: WaveOpts = {baseY: 1250, amp: 80, wavelength: 900, phase: t * 2.1 + 2.2, chop: 0.8};
  const near: WaveOpts = {baseY: 1600, amp: 110, wavelength: 1200, phase: t * 2.4 + 4, chop: 0.8};
  const shipX = 540 + Math.sin(t * 0.7) * 30;

  return (
    <AbsoluteFill style={{background: '#020409'}}>
      <Camera from={1.04} to={1.14} originY={55} shake={2.5}>
        <svg width={WIDTH} height={HEIGHT} style={{position: 'absolute'}}>
          <defs>
            <SoftBlur id="s1-blur" amount={5} />
            <linearGradient id="s1-sky" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0" stopColor="#010205" />
              <stop offset="0.3" stopColor="#07101c" />
              <stop offset="0.43" stopColor="#13283a" />
            </linearGradient>
            <linearGradient id="s1-sea" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0" stopColor="#0b2633" />
              <stop offset="1" stopColor="#01070c" />
            </linearGradient>
            <linearGradient id="s1-sea-front" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0" stopColor="#0f3440" />
              <stop offset="0.35" stopColor="#04121b" />
              <stop offset="1" stopColor="#010307" />
            </linearGradient>
            <filter id="s1-cloud" x="-20%" y="-20%" width="140%" height="140%">
              <feTurbulence type="fractalNoise" baseFrequency="0.006 0.012" numOctaves={4} seed={3} />
              <feDisplacementMap in="SourceGraphic" scale={120} />
              <feGaussianBlur stdDeviation={14} />
            </filter>
          </defs>
          <rect width={WIDTH} height={HEIGHT} fill="url(#s1-sky)" />
          {/* churning cloud banks */}
          <g filter="url(#s1-cloud)" opacity={0.9}>
            {[0, 1, 2, 3, 4].map((i) => (
              <ellipse
                key={i}
                cx={((i * 310 + frame * (1.5 + i * 0.4)) % 1700) - 300}
                cy={120 + i * 110}
                rx={420}
                ry={110}
                fill={i % 2 ? '#141c28' : '#0b1119'}
              />
            ))}
          </g>
          <WaveLayer opts={far} fill="#0b1c27" foam="#3a6a78" foamOpacity={0.35} foamWidth={4} blurId="s1-blur" />
          <WaveLayer opts={back} fill="#0a1a25" foam="#4b7d88" foamOpacity={0.3} foamWidth={6} blurId="s1-blur" />
          <WaveLayer opts={mid} fill="url(#s1-sea)" foam="#6d9ea6" foamOpacity={0.35} foamWidth={10} blurId="s1-blur" />
          <Ship
            id="s1"
            x={shipX}
            y={waveY(shipX, mid) + 34}
            angle={Math.max(-14, Math.min(14, waveAngle(shipX, mid) * 0.9 + Math.sin(t * 2.1) * 5))}
            scale={0.8}
            billow={Math.sin(t * 3)}
            lantern={0.55 + 0.2 * Math.sin(t * 9)}
            tone="dark"
          />
          {/* spray kicked up from the bow */}
          <g opacity={0.35 + 0.25 * Math.sin(t * 4)}>
            {[0, 1, 2, 3, 4, 5].map((i) => (
              <circle
                key={i}
                cx={shipX + 160 + i * 12}
                cy={waveY(shipX, mid) - 30 - ((frame * 3 + i * 17) % 60)}
                r={3 + (i % 3)}
                fill="#9fc3cc"
              />
            ))}
          </g>
          <WaveLayer
            opts={{...mid, baseY: mid.baseY + 44, phase: mid.phase + 0.35}}
            fill="url(#s1-sea)"
            foam="#8fbcc2"
            foamOpacity={0.3}
            foamWidth={8}
            blurId="s1-blur"
          />
          <WaveLayer opts={front} fill="url(#s1-sea-front)" foam="#7fb2b8" foamOpacity={0.3} foamWidth={14} blurId="s1-blur" />
          <WaveLayer opts={near} fill="#010409" foam="#2f5d68" foamOpacity={0.35} foamWidth={18} blurId="s1-blur" />
        </svg>
        <Rain count={170} opacity={0.4} seed="s1" />
      </Camera>
      <Lightning
        strikes={[
          {at: 36, x: 260, endY: 800},
          {at: 102, x: 820, endY: 760},
          {at: 140, x: 420, endY: 780},
        ]}
      />
    </AbsoluteFill>
  );
};
