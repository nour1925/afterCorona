import React from 'react';
import {random, useCurrentFrame} from 'remotion';
import {HEIGHT, WIDTH} from '../timeline';

/** Slanted wind-driven rain streaks. */
export const Rain: React.FC<{count?: number; opacity?: number; seed?: string; slant?: number}> = ({
  count = 160,
  opacity = 0.35,
  seed = 'rain',
  slant = 0.35,
}) => {
  const frame = useCurrentFrame();
  return (
    <svg width={WIDTH} height={HEIGHT} style={{position: 'absolute', opacity}}>
      {new Array(count).fill(0).map((_, i) => {
        const speed = 38 + random(`${seed}-s-${i}`) * 30;
        const len = 40 + random(`${seed}-l-${i}`) * 70;
        const span = HEIGHT + 300;
        const y = ((random(`${seed}-y-${i}`) * span + frame * speed) % span) - 200;
        const x = ((random(`${seed}-x-${i}`) * (WIDTH + 600) - y * slant) % (WIDTH + 600)) + 300;
        return (
          <line
            key={i}
            x1={x}
            y1={y}
            x2={x - len * slant}
            y2={y + len}
            stroke="#b9d3e6"
            strokeWidth={1 + random(`${seed}-w-${i}`) * 1.6}
            strokeLinecap="round"
            opacity={0.3 + random(`${seed}-o-${i}`) * 0.6}
          />
        );
      })}
    </svg>
  );
};
