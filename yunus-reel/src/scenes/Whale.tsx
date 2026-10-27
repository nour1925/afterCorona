import React from 'react';
import {AbsoluteFill, Easing, interpolate, random, useCurrentFrame} from 'remotion';
import {Lightning} from '../components/Lightning';
import {Rain} from '../components/Rain';
import {Ship} from '../components/Ship';
import {SoftBlur, WaveLayer} from '../components/WaveLayer';
import {clamp, ease} from '../lib/anim';
import {waveAngle, waveY, WaveOpts} from '../lib/waves';
import {HEIGHT, sec, WIDTH} from '../timeline';

// Beats inside the scene (seconds from scene start).
const SPLASH = 3.4;
const DIVE_START = 4.3;
const DIVE_END = 5.4;
const LUNGE = 6.4;
const SWALLOW = 8.0;

const AboveWater: React.FC<{frame: number}> = ({frame}) => {
  const t = frame / 30;
  const rise = interpolate(frame, [0, sec(4)], [0.5, 1.25], clamp);
  const back: WaveOpts = {baseY: 840, amp: 24 * rise, wavelength: 340, phase: t * 1.9, chop: 0.8};
  const mid: WaveOpts = {baseY: 940, amp: 55 * rise, wavelength: 600, phase: t * 2.2 + 1, chop: 0.9};
  const front: WaveOpts = {baseY: 1250, amp: 95 * rise, wavelength: 880, phase: t * 2.5 + 2, chop: 1};
  const shipX = 500 + Math.sin(t * 0.9) * 40;
  const sy = waveY(shipX, mid);
  const splashT = (frame - sec(SPLASH)) / 30;

  return (
    <AbsoluteFill>
      <svg width={WIDTH} height={HEIGHT} style={{position: 'absolute'}}>
        <defs>
          <SoftBlur id="s4-blur" amount={5} />
          <linearGradient id="s4-sky" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#020308" />
            <stop offset="0.42" stopColor="#0c1622" />
          </linearGradient>
          <linearGradient id="s4-sea" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#0d2a36" />
            <stop offset="1" stopColor="#01070c" />
          </linearGradient>
        </defs>
        <rect width={WIDTH} height={HEIGHT} fill="url(#s4-sky)" />
        <WaveLayer opts={back} fill="#0a1a25" foam="#4b7d88" foamOpacity={0.3} foamWidth={6} blurId="s4-blur" />
        <WaveLayer opts={mid} fill="url(#s4-sea)" foam="#6d9ea6" foamOpacity={0.35} foamWidth={10} blurId="s4-blur" />
        <Ship
          id="s4"
          x={shipX}
          y={sy + 34}
          angle={Math.max(-18, Math.min(18, waveAngle(shipX, mid) + Math.sin(t * 2.6) * 7))}
          scale={0.8}
          billow={Math.sin(t * 4)}
          lantern={0.5 + 0.3 * Math.sin(t * 11)}
          tone="dark"
        />
        <WaveLayer
          opts={{...mid, baseY: mid.baseY + 44, phase: mid.phase + 0.35}}
          fill="url(#s4-sea)"
          foam="#8fbcc2"
          foamOpacity={0.3}
          foamWidth={8}
          blurId="s4-blur"
        />
        {/* the splash beside the ship */}
        {splashT > 0 && splashT < 1.6 && (
          <g>
            <ellipse
              cx={shipX + 230}
              cy={sy + 40}
              rx={20 + splashT * 160}
              ry={6 + splashT * 30}
              fill="none"
              stroke="#d6eef2"
              strokeWidth={6}
              opacity={Math.max(0, 0.8 - splashT * 0.6)}
              filter="url(#s4-blur)"
            />
            {new Array(34).fill(0).map((_, i) => {
              const vx = (random(`sp-vx-${i}`) - 0.5) * 380;
              const vy = -280 - random(`sp-vy-${i}`) * 520;
              const x = shipX + 230 + vx * splashT;
              const y = sy + 30 + vy * splashT + 600 * splashT * splashT;
              return (
                <circle
                  key={i}
                  cx={x}
                  cy={y}
                  r={3 + random(`sp-r-${i}`) * 7}
                  fill="#cfe7ec"
                  opacity={Math.max(0, 1 - splashT * 0.75)}
                />
              );
            })}
          </g>
        )}
        <WaveLayer opts={front} fill="#02080d" foam="#7fb2b8" foamOpacity={0.3} foamWidth={14} blurId="s4-blur" />
      </svg>
      <Rain count={200} opacity={0.45} seed="s4" slant={0.5} />
      <Lightning strikes={[{at: sec(1.0), x: 760, endY: 780}, {at: sec(2.6), x: 300, endY: 800}]} />
    </AbsoluteFill>
  );
};

/** Side-view whale silhouette, head pointing right, origin at its centre. */
const WhaleShape: React.FC<{jaw: number; t: number}> = ({jaw, t}) => {
  const tail = Math.sin(t * 2.2) * 8;
  return (
    <g>
      {/* flukes */}
      <path
        d={`M -560 10 C -640 ${-40 + tail} -700 ${-120 + tail} -760 ${-150 + tail} C -720 ${-80 + tail} -700 ${-20 + tail} -690 ${10 + tail} C -700 ${40 + tail} -720 ${110 + tail} -770 ${170 + tail} C -700 ${150 + tail} -640 ${70 + tail} -560 40 Z`}
        fill="#03080c"
      />
      {/* body */}
      <path
        d="M -580 10 C -440 -80 -200 -170 120 -175 C 360 -178 560 -120 640 -20 C 650 0 640 20 620 30 L 260 40 C 120 120 -150 150 -330 110 C -450 85 -540 55 -580 30 Z"
        fill="url(#s4-whale-body)"
      />
      {/* lower jaw, hinged near the eye */}
      <g transform={`rotate(${jaw} 260 40)`}>
        <path d="M 260 40 L 610 32 C 590 70 520 110 420 120 C 360 124 300 100 260 70 Z" fill="#02070b" />
      </g>
      {/* mouth interior */}
      <path d={`M 262 42 L 612 30 L ${260 + 350 * Math.cos((jaw * Math.PI) / 180)} ${40 + 350 * Math.sin((jaw * Math.PI) / 180)} Z`} fill="#000" />
      <circle cx={300} cy={-10} r={9} fill="#0f2a33" />
      {/* pectoral fin */}
      <path d="M 40 90 C 20 190 -60 280 -150 320 C -100 240 -60 160 -40 100 Z" fill="#02070b" />
      {/* throat grooves, faint */}
      <g stroke="#0e1d26" strokeWidth={4} opacity={0.6} fill="none">
        <path d="M 260 95 C 120 125 -40 130 -180 110" />
        <path d="M 240 75 C 100 105 -60 112 -200 92" />
      </g>
    </g>
  );
};

const Underwater: React.FC<{frame: number}> = ({frame}) => {
  const t = frame / 30;
  const local = frame - sec(DIVE_START);
  // Phase 1: the whale glides up from the deep. Phase 2: it lunges toward the camera.
  const glide = interpolate(frame, [sec(DIVE_START), sec(LUNGE)], [0, 1], {...clamp, easing: ease});
  const lunge = interpolate(frame, [sec(LUNGE), sec(SWALLOW + 0.3)], [0, 1], {
    ...clamp,
    easing: Easing.in(Easing.cubic),
  });
  const rise = Math.max(glide * 0.6, lunge);
  const jaw = interpolate(frame, [sec(LUNGE - 0.4), sec(SWALLOW - 0.3)], [0, 30], {...clamp, easing: ease});
  // Screen point the whale's mouth is anchored to.
  const ax = interpolate(glide, [0, 1], [120, 800]) + lunge * (540 - 800);
  const ay = interpolate(glide, [0, 1], [2100, 640]) + lunge * (760 - 640);
  const ws = interpolate(glide, [0, 1], [0.45, 0.66]) * (1 + lunge * 5);
  const rot = -30 + lunge * 14;

  return (
    <AbsoluteFill>
      <svg width={WIDTH} height={HEIGHT} style={{position: 'absolute'}}>
        <defs>
          <linearGradient id="s4-deep" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#1b5a66" />
            <stop offset="0.3" stopColor="#0b2f3d" />
            <stop offset="0.75" stopColor="#041520" />
            <stop offset="1" stopColor="#01060b" />
          </linearGradient>
          <linearGradient id="s4-ray" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#bfe7e6" stopOpacity="0.35" />
            <stop offset="1" stopColor="#bfe7e6" stopOpacity="0" />
          </linearGradient>
          <filter id="s4-uw-blur">
            <feGaussianBlur stdDeviation="10" />
          </filter>
          <filter id="s4-whale-soft">
            <feGaussianBlur stdDeviation="2.5" />
          </filter>
          <linearGradient id="s4-whale-body" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#123440" />
            <stop offset="0.35" stopColor="#061820" />
            <stop offset="1" stopColor="#02070b" />
          </linearGradient>
        </defs>
        <rect width={WIDTH} height={HEIGHT} fill="url(#s4-deep)" />
        {/* surface ripples seen from below */}
        <path
          d={`M 0 60 ${new Array(28)
            .fill(0)
            .map((_, i) => `L ${i * 40} ${60 + Math.sin(i * 0.9 + t * 2.4) * 14}`)
            .join(' ')} L 1080 0 L 0 0 Z`}
          fill="#5fa3a6"
          opacity={0.5}
        />
        {/* hull silhouette above */}
        <path d="M 380 40 Q 520 120 700 40 Z" fill="#06141b" opacity={0.85} />
        {/* god rays */}
        <g filter="url(#s4-uw-blur)" opacity={0.8 * (1 - rise * 0.7)}>
          {new Array(7).fill(0).map((_, i) => {
            const x = 80 + i * 150 + Math.sin(t * 0.8 + i) * 40;
            return <path key={i} d={`M ${x} 0 L ${x + 60} 0 L ${x + 260} ${HEIGHT} L ${x + 120} ${HEIGHT} Z`} fill="url(#s4-ray)" />;
          })}
        </g>
        {/* bubbles */}
        {new Array(40).fill(0).map((_, i) => {
          const speed = 60 + random(`b-s-${i}`) * 120;
          const y = HEIGHT - ((random(`b-y-${i}`) * HEIGHT + local * (speed / 30)) % HEIGHT);
          const x = random(`b-x-${i}`) * WIDTH + Math.sin(t * 2 + i) * 10;
          return (
            <circle key={i} cx={x} cy={y} r={2 + random(`b-r-${i}`) * 6} fill="none" stroke="#a9d8dc" strokeWidth={1.5} opacity={0.45} />
          );
        })}
        {/* the whale rises from the deep */}
        <g transform={`translate(${ax} ${ay}) rotate(${rot}) scale(${ws}) translate(-470 -40)`} filter="url(#s4-whale-soft)">
          <WhaleShape jaw={jaw} t={t} />
        </g>
      </svg>
    </AbsoluteFill>
  );
};

/** Scene 4 — the storm rises, a splash, and the whale swallows the frame. */
export const Whale: React.FC = () => {
  const frame = useCurrentFrame();
  // Camera dives through the surface: above-water slides up, underwater follows.
  const dive = interpolate(frame, [sec(DIVE_START), sec(DIVE_END)], [0, 1], {...clamp, easing: ease});
  const darkness = interpolate(frame, [sec(SWALLOW - 0.2), sec(SWALLOW + 0.8)], [0, 1], {...clamp, easing: ease});
  const iris = interpolate(frame, [sec(SWALLOW - 0.5), sec(SWALLOW + 0.7)], [1400, 0], {...clamp, easing: ease});
  const push = 1 + interpolate(frame, [0, sec(9)], [0, 0.12], clamp);

  return (
    <AbsoluteFill style={{background: '#000', overflow: 'hidden'}}>
      <AbsoluteFill style={{transform: `scale(${push})`}}>
        {dive < 1 && (
          <AbsoluteFill style={{transform: `translateY(${-dive * HEIGHT}px)`}}>
            <AboveWater frame={frame} />
          </AbsoluteFill>
        )}
        {dive > 0 && (
          <AbsoluteFill style={{transform: `translateY(${(1 - dive) * HEIGHT}px)`}}>
            <Underwater frame={frame} />
          </AbsoluteFill>
        )}
        {/* churning surface band during the dive */}
        <AbsoluteFill
          style={{
            top: (1 - dive) * HEIGHT - 120,
            height: 240,
            background: 'linear-gradient(180deg, rgba(150,210,215,0) 0%, rgba(150,210,215,0.55) 50%, rgba(150,210,215,0) 100%)',
            opacity: dive > 0 && dive < 1 ? 1 : 0,
            filter: 'blur(8px)',
          }}
        />
      </AbsoluteFill>
      {/* darkness closes in like a mouth */}
      <AbsoluteFill
        style={{
          background: `radial-gradient(circle at 50% 50%, rgba(0,0,0,0) ${iris * 0.55}px, rgba(0,0,0,1) ${iris}px)`,
          opacity: iris < 1390 ? 1 : 0,
        }}
      />
      <AbsoluteFill style={{background: '#000', opacity: darkness}} />
    </AbsoluteFill>
  );
};
