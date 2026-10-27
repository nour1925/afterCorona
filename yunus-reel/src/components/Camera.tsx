import React from 'react';
import {AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig} from 'remotion';
import {clamp} from '../lib/anim';

/** Slow push-in with optional drift, applied to a whole scene. */
export const Camera: React.FC<{
  children: React.ReactNode;
  from?: number;
  to?: number;
  originX?: number;
  originY?: number;
  driftY?: number;
  shake?: number;
}> = ({children, from = 1, to = 1.08, originX = 50, originY = 50, driftY = 0, shake = 0}) => {
  const frame = useCurrentFrame();
  const {durationInFrames} = useVideoConfig();
  const t = interpolate(frame, [0, durationInFrames], [0, 1], clamp);
  const scale = from + (to - from) * t;
  const sx = shake * (Math.sin(frame * 1.7) * 0.6 + Math.sin(frame * 3.1) * 0.4);
  const sy = shake * (Math.cos(frame * 2.3) * 0.6 + Math.sin(frame * 1.3) * 0.4);
  return (
    <AbsoluteFill
      style={{
        transform: `translate(${sx}px, ${sy + driftY * t}px) scale(${scale})`,
        transformOrigin: `${originX}% ${originY}%`,
      }}
    >
      {children}
    </AbsoluteFill>
  );
};
