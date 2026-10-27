import {Easing, interpolate} from 'remotion';

export const clamp = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;

export const ease = Easing.bezier(0.45, 0, 0.25, 1);

/** 0→1 ramp between frames a and b, eased. */
export const ramp = (frame: number, a: number, b: number, easing = ease) =>
  interpolate(frame, [a, b], [0, 1], {...clamp, easing});

/** Smooth flash envelope: fast attack, slower decay. */
export const flash = (frame: number, at: number, attack = 2, decay = 10) => {
  if (frame < at || frame > at + attack + decay) return 0;
  if (frame < at + attack) return (frame - at) / attack;
  return Math.pow(1 - (frame - at - attack) / decay, 2);
};
