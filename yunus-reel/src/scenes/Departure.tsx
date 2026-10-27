import React from 'react';
import {AbsoluteFill, interpolate, random, useCurrentFrame} from 'remotion';
import {Camera} from '../components/Camera';
import {Ship} from '../components/Ship';
import {SoftBlur, WaveLayer} from '../components/WaveLayer';
import {clamp, ease} from '../lib/anim';
import {waveY} from '../lib/waves';
import {HEIGHT, sec, WIDTH} from '../timeline';

const HORIZON = 760;
const SHORE = 1110;

// Footprint trail from the bottom of the frame up to the pier.
const STEPS = 18;
const stepPos = (i: number) => {
  const u = i / (STEPS - 1);
  const x = 470 + Math.sin(u * 3.4) * 90 + u * 240;
  const y = 1880 - u * (1880 - (SHORE + 30));
  const dx = Math.cos(u * 3.4) * 90 * 3.4 / (STEPS - 1) + 240 / (STEPS - 1);
  const angle = (Math.atan2(-(1880 - SHORE) / (STEPS - 1), dx) * 180) / Math.PI + 90;
  return {x, y, angle, scale: 1 - u * 0.55};
};

const Footprint: React.FC<{x: number; y: number; angle: number; scale: number; left: boolean; o: number}> = ({
  x,
  y,
  angle,
  scale,
  left,
  o,
}) => (
  <g transform={`translate(${x} ${y}) rotate(${angle}) translate(${left ? -16 : 16} 0) scale(${scale * (left ? -1 : 1)} ${scale})`} opacity={o}>
    <ellipse cx={0} cy={-6} rx={13} ry={22} fill="#4a301c" opacity={0.55} />
    <ellipse cx={1} cy={22} rx={10} ry={11} fill="#4a301c" opacity={0.55} />
    <ellipse cx={-2} cy={-8} rx={11} ry={19} fill="none" stroke="#e8b97a" strokeWidth={2} opacity={0.35} />
  </g>
);

/** Scene 3 — footprints in the sand to a harbour; a ship sails out at sunset. */
export const Departure: React.FC = () => {
  const frame = useCurrentFrame();
  const t = frame / 30;
  const sail = interpolate(frame, [sec(3.2), sec(9.6)], [0, 1], {...clamp, easing: ease});
  const sea = {baseY: HORIZON + 140, amp: 8, wavelength: 300, phase: t * 1.1};
  const shipX = 830 - sail * 420;
  const shipScale = 0.55 - sail * 0.38;
  const shipY = 960 - sail * 175 + Math.sin(t * 1.8) * 3;

  return (
    <AbsoluteFill style={{background: '#1a1630'}}>
      <Camera from={1.18} to={1.0} originX={55} originY={80}>
        <svg width={WIDTH} height={HEIGHT} style={{position: 'absolute'}}>
          <defs>
            <SoftBlur id="s3-blur" amount={4} />
            <linearGradient id="s3-sky" x1="0" y1="0" x2="0" y2={HORIZON} gradientUnits="userSpaceOnUse">
              <stop offset="0" stopColor="#141a3c" />
              <stop offset="0.4" stopColor="#4b2f58" />
              <stop offset="0.72" stopColor="#c8603f" />
              <stop offset="1" stopColor="#f6bb5e" />
            </linearGradient>
            <radialGradient id="s3-sun">
              <stop offset="0" stopColor="#fff4cf" />
              <stop offset="0.22" stopColor="#ffd27a" />
              <stop offset="0.5" stopColor="#f39340" stopOpacity="0.45" />
              <stop offset="1" stopColor="#f39340" stopOpacity="0" />
            </radialGradient>
            <linearGradient id="s3-sea" x1="0" y1={HORIZON} x2="0" y2={SHORE} gradientUnits="userSpaceOnUse">
              <stop offset="0" stopColor="#c46a48" />
              <stop offset="0.25" stopColor="#3d3858" />
              <stop offset="1" stopColor="#0f2a3a" />
            </linearGradient>
            <linearGradient id="s3-sand" x1="0" y1={SHORE} x2="0" y2={HEIGHT} gradientUnits="userSpaceOnUse">
              <stop offset="0" stopColor="#b98654" />
              <stop offset="0.4" stopColor="#7d5434" />
              <stop offset="1" stopColor="#2c1b12" />
            </linearGradient>
            <filter id="s3-sand-tex">
              <feTurbulence type="fractalNoise" baseFrequency="0.02 0.08" numOctaves={3} seed={11} />
              <feColorMatrix type="matrix" values="0 0 0 0 0.3  0 0 0 0 0.18  0 0 0 0 0.1  0 0 0 0.35 0" />
            </filter>
          </defs>
          <rect width={WIDTH} height={HORIZON + 4} fill="url(#s3-sky)" />
          {/* thin painted clouds */}
          {[0, 1, 2].map((i) => (
            <ellipse
              key={i}
              cx={200 + i * 340 + t * (6 + i * 3)}
              cy={330 + i * 110}
              rx={260}
              ry={18 + i * 4}
              fill={i === 2 ? '#f0a060' : '#8a4a5c'}
              opacity={0.45}
              filter="url(#s3-blur)"
            />
          ))}
          <circle cx={540} cy={HORIZON + t * 3} r={360} fill="url(#s3-sun)" />
          <circle cx={540} cy={HORIZON + t * 3} r={95} fill="#ffe6a6" />
          <rect x={0} y={HORIZON} width={WIDTH} height={SHORE - HORIZON + 60} fill="url(#s3-sea)" />
          {/* sun path shimmering on the water */}
          {new Array(26).fill(0).map((_, i) => {
            const y = HORIZON + 10 + i * 13;
            const w = 120 + i * 9 + Math.sin(t * 3 + i * 1.7) * 30;
            return (
              <rect
                key={i}
                x={540 - w / 2 + Math.sin(t * 2 + i) * 14}
                y={y}
                width={w}
                height={3 + i * 0.25}
                rx={2}
                fill="#ffd48a"
                opacity={0.55 - i * 0.017}
              />
            );
          })}
          <WaveLayer opts={sea} fill="none" foam="#ffcf8a" foamOpacity={0.18} foamWidth={3} blurId="s3-blur" />
          <Ship
            id="s3"
            x={shipX}
            y={shipY}
            angle={Math.sin(t * 1.8) * 2.5}
            scale={shipScale}
            billow={0.6 + Math.sin(t * 2) * 0.2}
            lantern={0.9}
            tone="silhouette"
          />
          {/* wake */}
          <path
            d={`M ${shipX + 80 * shipScale} ${shipY + 4} Q ${shipX + 260 * shipScale + 40} ${shipY + 10} ${shipX + 420 * shipScale + 120} ${shipY + 22}`}
            stroke="#ffd9a0"
            strokeWidth={3}
            opacity={0.35 * (sail > 0.02 ? 1 : 0)}
            fill="none"
            filter="url(#s3-blur)"
          />
          {/* harbour: stone tower + wooden pier */}
          <g>
            <rect x={960} y={720} width={90} height={380} fill="#1f1420" />
            <path d="M 950 720 L 1060 720 L 1040 690 L 970 690 Z" fill="#2a1b28" />
            <circle cx={1005} cy={705} r={40} fill="url(#s3-sun)" opacity={0.8} />
            <rect x={995} y={694} width={20} height={22} fill="#ffd27a" />
          </g>
          {[0, 1, 2, 3, 4, 5].map((i) => (
            <rect key={i} x={700 + i * 70} y={1000 - i * 4} width={12} height={110 + i * 6} fill="#1c120e" />
          ))}
          <path d="M 680 1000 L 1080 975 L 1080 992 L 680 1014 Z" fill="#3a2416" />
          <path d="M 680 1000 L 1080 975" stroke="#e0a060" strokeWidth={2} opacity={0.5} />
          {/* rope coil and bollard */}
          <rect x={720} y={980} width={16} height={22} rx={4} fill="#140c08" />
          {/* shoreline */}
          <path
            d={`M 0 ${SHORE} ${new Array(28)
              .fill(0)
              .map((_, i) => `L ${i * 40} ${SHORE + Math.sin(i * 0.8 + t * 1.2) * 6}`)
              .join(' ')} L ${WIDTH} ${HEIGHT} L 0 ${HEIGHT} Z`}
            fill="url(#s3-sand)"
          />
          <rect x={0} y={SHORE} width={WIDTH} height={HEIGHT - SHORE} filter="url(#s3-sand-tex)" />
          <path
            d={`M 0 ${waveY(0, {baseY: SHORE + 4, amp: 5, wavelength: 260, phase: t * 1.5})} ${new Array(28)
              .fill(0)
              .map((_, i) => `L ${i * 40} ${waveY(i * 40, {baseY: SHORE + 4, amp: 5, wavelength: 260, phase: t * 1.5})}`)
              .join(' ')}`}
            stroke="#ffe7c0"
            strokeWidth={5}
            opacity={0.45}
            fill="none"
            filter="url(#s3-blur)"
          />
          {/* footprints appear one by one, walking toward the pier */}
          {new Array(STEPS).fill(0).map((_, i) => {
            const p = stepPos(i);
            const appear = sec(0.2 + i * 0.24);
            const o = interpolate(frame, [appear, appear + 8], [0, 1], clamp);
            return <Footprint key={i} {...p} left={i % 2 === 0} o={o} />;
          })}
          {/* scattered shells / pebbles */}
          {new Array(14).fill(0).map((_, i) => (
            <ellipse
              key={i}
              cx={random(`peb-x-${i}`) * WIDTH}
              cy={SHORE + 80 + random(`peb-y-${i}`) * 760}
              rx={4 + random(`peb-r-${i}`) * 6}
              ry={3 + random(`peb-r-${i}`) * 3}
              fill="#e8c79a"
              opacity={0.35}
            />
          ))}
        </svg>
      </Camera>
    </AbsoluteFill>
  );
};
