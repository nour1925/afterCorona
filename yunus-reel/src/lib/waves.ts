import {HEIGHT, WIDTH} from '../timeline';

export type WaveOpts = {
  baseY: number;
  amp: number;
  wavelength: number;
  phase: number;
  /** extra choppiness 0..1 */
  chop?: number;
  bottom?: number;
  width?: number;
  step?: number;
};

/** Height of the sea surface at x for given wave options. */
export const waveY = (x: number, o: WaveOpts) => {
  const k = (Math.PI * 2) / o.wavelength;
  const chop = o.chop ?? 0;
  return (
    o.baseY +
    o.amp * Math.sin(k * x + o.phase) +
    o.amp * 0.4 * Math.sin(k * 1.9 * x - o.phase * 1.4 + 1.3) +
    o.amp * chop * 0.22 * Math.sin(k * 3.3 * x + o.phase * 2.2 + 0.4)
  );
};

/** Closed SVG path of a wave band from the surface down to `bottom`. */
export const wavePath = (o: WaveOpts) => {
  const width = o.width ?? WIDTH;
  const step = o.step ?? 12;
  const bottom = o.bottom ?? HEIGHT + 40;
  let d = `M -40 ${bottom} L -40 ${waveY(-40, o).toFixed(1)}`;
  for (let x = -40; x <= width + 40; x += step) {
    d += ` L ${x} ${waveY(x, o).toFixed(1)}`;
  }
  d += ` L ${width + 40} ${bottom} Z`;
  return d;
};

/** Open path along the crest only (for foam / highlight strokes). */
export const crestPath = (o: WaveOpts, from = -40, to = (o.width ?? WIDTH) + 40) => {
  const step = o.step ?? 12;
  let d = `M ${from} ${waveY(from, o).toFixed(1)}`;
  for (let x = from + step; x <= to; x += step) {
    d += ` L ${x} ${waveY(x, o).toFixed(1)}`;
  }
  return d;
};

/** Slope angle (degrees) of the sea surface at x — used to tilt the ship. */
export const waveAngle = (x: number, o: WaveOpts) => {
  const dx = 6;
  return (Math.atan2(waveY(x + dx, o) - waveY(x - dx, o), dx * 2) * 180) / Math.PI;
};
