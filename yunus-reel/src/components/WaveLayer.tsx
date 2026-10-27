import React from 'react';
import {crestPath, wavePath, WaveOpts} from '../lib/waves';

/** One parallax band of sea: filled body + soft, blurred light along the crest. */
export const WaveLayer: React.FC<{
  opts: WaveOpts;
  fill: string;
  foam?: string;
  foamOpacity?: number;
  foamWidth?: number;
  blurId?: string;
}> = ({opts, fill, foam = '#8fc1c6', foamOpacity = 0.3, foamWidth = 8, blurId}) => (
  <g>
    <path d={wavePath(opts)} fill={fill} />
    {foamOpacity > 0 && (
      <path
        d={crestPath({...opts, baseY: opts.baseY + foamWidth * 0.6})}
        stroke={foam}
        strokeWidth={foamWidth}
        strokeLinecap="round"
        fill="none"
        opacity={foamOpacity}
        filter={blurId ? `url(#${blurId})` : undefined}
      />
    )}
  </g>
);

/** Shared blur filter definition for crest highlights. */
export const SoftBlur: React.FC<{id: string; amount?: number}> = ({id, amount = 5}) => (
  <filter id={id} x="-10%" y="-50%" width="120%" height="200%">
    <feGaussianBlur stdDeviation={amount} />
  </filter>
);
