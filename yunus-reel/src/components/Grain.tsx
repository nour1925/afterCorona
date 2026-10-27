import React from 'react';
import {AbsoluteFill, useCurrentFrame} from 'remotion';
import {HEIGHT, WIDTH} from '../timeline';

/** Animated film grain + soft vignette laid over everything. */
export const Grain: React.FC<{opacity?: number}> = ({opacity = 0.13}) => {
  const frame = useCurrentFrame();
  // Change grain every 2 frames — reads as film, not static noise.
  const seed = Math.floor(frame / 2) % 12;
  return (
    <AbsoluteFill style={{pointerEvents: 'none'}}>
      <svg
        width={WIDTH}
        height={HEIGHT}
        style={{position: 'absolute', mixBlendMode: 'overlay', opacity}}
      >
        <filter id={`grain-${seed}`} x="0" y="0" width="100%" height="100%">
          <feTurbulence type="fractalNoise" baseFrequency="0.85" numOctaves={2} seed={seed} stitchTiles="stitch" />
          <feColorMatrix type="saturate" values="0" />
        </filter>
        <rect width="100%" height="100%" filter={`url(#grain-${seed})`} />
      </svg>
      {/* static canvas / brush texture for a painterly feel */}
      <svg width={WIDTH} height={HEIGHT} style={{position: 'absolute', mixBlendMode: 'soft-light', opacity: 0.35}}>
        <filter id="canvas-tex" x="0" y="0" width="100%" height="100%">
          <feTurbulence type="fractalNoise" baseFrequency="0.0035 0.03" numOctaves={4} seed={7} />
          <feColorMatrix type="saturate" values="0" />
          <feComponentTransfer>
            <feFuncR type="linear" slope={1.6} intercept={-0.3} />
            <feFuncG type="linear" slope={1.6} intercept={-0.3} />
            <feFuncB type="linear" slope={1.6} intercept={-0.3} />
          </feComponentTransfer>
        </filter>
        <rect width="100%" height="100%" filter="url(#canvas-tex)" />
      </svg>
      <AbsoluteFill
        style={{
          background:
            'radial-gradient(ellipse 85% 70% at 50% 45%, rgba(0,0,0,0) 55%, rgba(0,0,0,0.55) 100%)',
        }}
      />
    </AbsoluteFill>
  );
};
