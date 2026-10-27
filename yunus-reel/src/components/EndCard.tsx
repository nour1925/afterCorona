import React from 'react';
import {AbsoluteFill, interpolate, useCurrentFrame} from 'remotion';
import {clamp, ease} from '../lib/anim';
import {LATIN_FONT} from '../lib/fonts';
import {FPS} from '../timeline';

export const EndCard: React.FC<{text: string; top: number}> = ({text, top}) => {
  const frame = useCurrentFrame();
  const t = interpolate(frame, [0, 0.9 * FPS], [0, 1], {...clamp, easing: ease});
  const pulse = 1 + 0.015 * Math.sin(frame / 9);
  return (
    <AbsoluteFill style={{alignItems: 'center', pointerEvents: 'none'}}>
      <div
        style={{
          marginTop: top,
          fontFamily: LATIN_FONT,
          fontWeight: 500,
          fontSize: 44,
          color: '#fff',
          background: 'rgba(6, 12, 22, 0.62)',
          border: '1px solid rgba(245, 203, 110, 0.45)',
          boxShadow: '0 0 40px rgba(245, 203, 110, 0.25)',
          borderRadius: 999,
          padding: '24px 44px',
          opacity: t,
          transform: `translateY(${(1 - t) * 24}px) scale(${pulse})`,
          textAlign: 'center',
        }}
      >
        {text}
      </div>
    </AbsoluteFill>
  );
};
