import React from 'react';
import {AbsoluteFill, interpolate, random, useCurrentFrame} from 'remotion';
import {Camera} from '../components/Camera';
import {clamp, ease, ramp} from '../lib/anim';
import {HEIGHT, sec, WIDTH} from '../timeline';

type House = {x: number; w: number; h: number; door?: number};

// Front row of houses; `door` = second (within the scene) the door closes.
const FRONT: House[] = [
  {x: -20, w: 150, h: 190, door: 2.2},
  {x: 120, w: 130, h: 240, door: 4.6},
  {x: 245, w: 120, h: 170, door: 3.1},
  {x: 650, w: 125, h: 180, door: 3.7},
  {x: 770, w: 140, h: 250, door: 5.3},
  {x: 905, w: 190, h: 200, door: 2.7},
];
const BACK: House[] = [
  {x: 0, w: 110, h: 290},
  {x: 100, w: 140, h: 250},
  {x: 230, w: 90, h: 330},
  {x: 740, w: 100, h: 320},
  {x: 830, w: 130, h: 270},
  {x: 950, w: 140, h: 310},
];
const GROUND = 1090;
const GATE_CLOSE = 6.2;

const Door: React.FC<{cx: number; bottom: number; w: number; h: number; closeAt: number; frame: number}> = ({
  cx,
  bottom,
  w,
  h,
  closeAt,
  frame,
}) => {
  const c = interpolate(frame, [sec(closeAt), sec(closeAt + 0.9)], [0, 1], {...clamp, easing: ease});
  const top = bottom - h;
  const arch = `M ${cx - w / 2} ${bottom} L ${cx - w / 2} ${top + w / 2} A ${w / 2} ${w / 2} 0 0 1 ${cx + w / 2} ${top + w / 2} L ${cx + w / 2} ${bottom} Z`;
  return (
    <g>
      {/* light spilling onto the street */}
      <path
        d={`M ${cx - w / 2} ${bottom} L ${cx + w / 2} ${bottom} L ${cx + w * 1.6} ${bottom + 120} L ${cx - w * 1.6} ${bottom + 120} Z`}
        fill="url(#s2-spill)"
        opacity={(1 - c) * 0.7}
      />
      <circle cx={cx} cy={bottom - h / 2} r={w * 1.6} fill="url(#s2-door-glow)" opacity={(1 - c) * 0.8} />
      <path d={arch} fill="#ffcf7a" />
      <clipPath id={`clip-${cx}`}>
        <path d={arch} />
      </clipPath>
      {/* door leaf swings shut from the left */}
      <g clipPath={`url(#clip-${cx})`}>
        <rect x={cx - w / 2} y={top} width={w * c} height={h} fill="#2b1a10" />
        <rect x={cx - w / 2 + w * c - 3} y={top} width={3} height={h} fill="#6b4527" opacity={c > 0.02 ? 1 : 0} />
      </g>
      <path d={arch} fill="none" stroke="#0c0710" strokeWidth={5} />
    </g>
  );
};

/** Scene 2 — the ancient city of Nineveh at dusk, doors closing one by one. */
export const Nineveh: React.FC = () => {
  const frame = useCurrentFrame();
  const t = frame / 30;
  const dusk = ramp(frame, 0, sec(9));
  const gate = interpolate(frame, [sec(GATE_CLOSE), sec(GATE_CLOSE + 1.6)], [0, 1], {...clamp, easing: ease});

  return (
    <AbsoluteFill style={{background: '#0a0f22'}}>
      <Camera from={1.0} to={1.1} originY={48}>
        <svg width={WIDTH} height={HEIGHT} style={{position: 'absolute'}}>
          <defs>
            <linearGradient id="s2-sky" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0" stopColor="#070c1f" />
              <stop offset="0.25" stopColor="#1d1f42" />
              <stop offset="0.4" stopColor="#5a3550" />
              <stop offset="0.5" stopColor="#c0644a" />
              <stop offset="0.56" stopColor="#f0a85a" />
            </linearGradient>
            <radialGradient id="s2-sun">
              <stop offset="0" stopColor="#fff1c4" />
              <stop offset="0.18" stopColor="#ffd17a" />
              <stop offset="0.45" stopColor="#f39a4a" stopOpacity="0.5" />
              <stop offset="1" stopColor="#f39a4a" stopOpacity="0" />
            </radialGradient>
            <radialGradient id="s2-door-glow">
              <stop offset="0" stopColor="#ffc56a" stopOpacity="0.55" />
              <stop offset="1" stopColor="#ffc56a" stopOpacity="0" />
            </radialGradient>
            <linearGradient id="s2-spill" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0" stopColor="#ffc56a" stopOpacity="0.6" />
              <stop offset="1" stopColor="#ffc56a" stopOpacity="0" />
            </linearGradient>
            <linearGradient id="s2-ground" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0" stopColor="#24161c" />
              <stop offset="1" stopColor="#050307" />
            </linearGradient>
            <linearGradient id="s2-wall" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0" stopColor="#3a2430" />
              <stop offset="1" stopColor="#140b14" />
            </linearGradient>
            <filter id="s2-haze">
              <feGaussianBlur stdDeviation="3" />
            </filter>
          </defs>
          <rect width={WIDTH} height={HEIGHT} fill="url(#s2-sky)" />
          {/* stars come out as dusk deepens */}
          {new Array(60).fill(0).map((_, i) => (
            <circle
              key={i}
              cx={random(`st-x-${i}`) * WIDTH}
              cy={random(`st-y-${i}`) * 560}
              r={0.8 + random(`st-r-${i}`) * 1.8}
              fill="#fff6dc"
              opacity={dusk * (0.3 + 0.7 * random(`st-o-${i}`)) * (0.75 + 0.25 * Math.sin(t * 3 + i))}
            />
          ))}
          {/* setting sun */}
          <circle cx={540} cy={960 + dusk * 40} r={420} fill="url(#s2-sun)" opacity={1 - dusk * 0.35} />
          {/* far hills */}
          <path d="M 0 960 Q 200 900 380 940 T 760 920 T 1080 940 L 1080 1100 L 0 1100 Z" fill="#4a2c3c" opacity={0.85} filter="url(#s2-haze)" />
          {/* ziggurat */}
          <g fill="#2c1b2c">
            <rect x={340} y={890} width={400} height={120} />
            <rect x={380} y={810} width={320} height={90} />
            <rect x={420} y={740} width={240} height={80} />
            <rect x={470} y={680} width={140} height={70} />
            <path d="M 520 1010 L 520 700 L 560 700 L 560 1010 Z" fill="#24152a" />
          </g>
          {/* back row */}
          {BACK.map((b, i) => (
            <g key={i}>
              <rect x={b.x} y={GROUND - 40 - b.h} width={b.w} height={b.h} fill="#241725" />
              {[0, 1].map((k) => (
                <rect
                  key={k}
                  x={b.x + 18 + k * (b.w - 50)}
                  y={GROUND - b.h + 10}
                  width={14}
                  height={20}
                  fill="#ffbf66"
                  opacity={0.65 * (1 - ramp(frame, sec(2 + i * 0.7 + k), sec(2.5 + i * 0.7 + k)))}
                />
              ))}
            </g>
          ))}
          {/* city wall with crenellations and central gate */}
          <rect x={360} y={890} width={360} height={GROUND - 890} fill="url(#s2-wall)" />
          {new Array(10).fill(0).map((_, i) => (
            <rect key={i} x={360 + i * 37} y={872} width={22} height={22} fill="#3a2430" />
          ))}
          <rect x={340} y={850} width={60} height={GROUND - 850} fill="#2e1c28" />
          <rect x={680} y={850} width={60} height={GROUND - 850} fill="#2e1c28" />
          <path d="M 470 1090 L 470 990 A 70 70 0 0 1 610 990 L 610 1090 Z" fill="#ffcf7a" opacity={1 - gate * 0.9} />
          <circle cx={540} cy={1010} r={160} fill="url(#s2-door-glow)" opacity={1 - gate} />
          {/* gate leaves close from both sides */}
          <clipPath id="s2-gate-clip">
            <path d="M 470 1090 L 470 990 A 70 70 0 0 1 610 990 L 610 1090 Z" />
          </clipPath>
          <g clipPath="url(#s2-gate-clip)">
            <rect x={470} y={900} width={70 * gate} height={200} fill="#2b1a10" />
            <rect x={610 - 70 * gate} y={900} width={70 * gate} height={200} fill="#24150c" />
          </g>
          {/* front houses */}
          {FRONT.map((h, i) => (
            <g key={i}>
              <rect x={h.x} y={GROUND - h.h} width={h.w} height={h.h} fill="#1a1019" />
              <rect x={h.x} y={GROUND - h.h} width={h.w} height={6} fill="#5a3a3a" opacity={0.6} />
              <rect x={h.x + h.w - 8} y={GROUND - h.h} width={8} height={h.h} fill="#c27a4a" opacity={0.18} />
              {h.door !== undefined && (
                <Door cx={h.x + h.w / 2} bottom={GROUND} w={46} h={92} closeAt={h.door} frame={frame} />
              )}
            </g>
          ))}
          <rect x={0} y={GROUND} width={WIDTH} height={HEIGHT - GROUND} fill="url(#s2-ground)" />
          {/* drifting birds */}
          {[0, 1, 2, 3].map((i) => {
            const bx = ((t * (40 + i * 6) + i * 140) % 1300) - 100;
            const by = 420 + i * 36 + Math.sin(t * 1.5 + i) * 10;
            const flap = Math.sin(t * 8 + i * 2) * 8;
            return (
              <path
                key={i}
                d={`M ${bx - 16} ${by - flap} Q ${bx - 8} ${by - 4} ${bx} ${by} Q ${bx + 8} ${by - 4} ${bx + 16} ${by - flap}`}
                stroke="#1a1020"
                strokeWidth={3}
                fill="none"
              />
            );
          })}
        </svg>
        {/* dusk deepens */}
        <AbsoluteFill style={{background: '#050818', opacity: dusk * 0.35}} />
      </Camera>
    </AbsoluteFill>
  );
};
