import React from 'react';
import {AbsoluteFill, interpolate, useCurrentFrame} from 'remotion';
import {clamp, ease} from '../lib/anim';
import {ARABIC_FONT, LATIN_FONT} from '../lib/fonts';
import {FPS, SceneConfig} from '../timeline';

type Segment = {kind: 'narration' | 'verse'; words: string[]};

/** Split Arabic text into narration and ﴿verse﴾ segments, word by word. */
export const parseArabic = (text: string): Segment[] => {
  const segments: Segment[] = [];
  const re = /﴿([^﴾]*)﴾/g;
  let last = 0;
  let m: RegExpExecArray | null;
  const pushNarration = (s: string) => {
    const words = s.trim().split(/\s+/).filter(Boolean);
    if (words.length) segments.push({kind: 'narration', words});
  };
  while ((m = re.exec(text))) {
    pushNarration(text.slice(last, m.index));
    segments.push({kind: 'verse', words: m[1].trim().split(/\s+/)});
    last = m.index + m[0].length;
  }
  pushNarration(text.slice(last));
  return segments;
};

const WORD_FADE = 0.55; // seconds

const Word: React.FC<{children: React.ReactNode; start: number; frame: number; style?: React.CSSProperties}> = ({
  children,
  start,
  frame,
  style,
}) => {
  const t = interpolate(frame, [start, start + WORD_FADE * FPS], [0, 1], {...clamp, easing: ease});
  return (
    <span
      style={{
        display: 'inline-block',
        opacity: t,
        transform: `translateY(${(1 - t) * 14}px)`,
        filter: `blur(${(1 - t) * 6}px)`,
        ...style,
      }}
    >
      {children}
    </span>
  );
};

const GOLD_GLOW =
  '0 0 14px rgba(255, 206, 110, 0.75), 0 0 36px rgba(255, 176, 60, 0.45), 0 0 70px rgba(255, 150, 40, 0.25), 0 2px 6px rgba(0,0,0,0.6)';

/**
 * Arabic line (large, RTL, Amiri) + English subtitle (Inter, dark box).
 * Rendered inside a scene <Sequence>, so frame 0 = scene start.
 */
export const Caption: React.FC<{scene: SceneConfig}> = ({scene}) => {
  const frame = useCurrentFrame();
  const dur = scene.end - scene.start;
  const segments = parseArabic(scene.ar);
  const wordCount = segments.reduce((n, s) => n + s.words.length, 0);

  const textIn = scene.textIn ?? 0.6;
  const textOut = scene.textOut ?? dur - 0.15;
  const gap = scene.wordGap ?? Math.min(0.45, Math.max(0.12, (dur * 0.55 - textIn) / wordCount));

  const outOpacity = interpolate(frame, [(textOut - 0.6) * FPS, textOut * FPS], [1, 0], clamp);
  const enStart = (textIn + 0.35) * FPS;
  const en = interpolate(frame, [enStart, enStart + 0.9 * FPS], [0, 1], {...clamp, easing: ease});

  const top = scene.captionTop ?? 1120;

  let wi = 0;
  const startFor = () => (textIn + gap * wi++) * FPS;

  return (
    <AbsoluteFill style={{opacity: outOpacity, pointerEvents: 'none'}}>
      {/* soft dark wash behind the text so it reads on bright scenes */}
      <div
        style={{
          position: 'absolute',
          left: -100,
          right: -100,
          top: top - 180,
          height: 900,
          background: 'radial-gradient(ellipse 50% 45% at 50% 40%, rgba(2,6,14,0.45), rgba(2,6,14,0) 100%)',
          opacity: interpolate(frame, [textIn * FPS, (textIn + 0.8) * FPS], [0, 1], clamp),
        }}
      />
      <div
        style={{
          position: 'absolute',
          left: 64,
          right: 64,
          top,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 34,
        }}
      >
        <div
          dir="rtl"
          lang="ar"
          style={{
            fontFamily: ARABIC_FONT,
            fontSize: 64,
            lineHeight: 1.7,
            textAlign: 'center',
            color: '#f6f0e1',
            textShadow: '0 2px 18px rgba(0,0,0,0.85), 0 0 4px rgba(0,0,0,0.6)',
            width: '100%',
          }}
        >
          {segments.map((seg, si) =>
            seg.kind === 'narration' ? (
              <span key={si}>
                {seg.words.map((w, i) => (
                  <React.Fragment key={i}>
                    <Word start={startFor()} frame={frame}>
                      {w}
                    </Word>{' '}
                  </React.Fragment>
                ))}
              </span>
            ) : (
              <div
                key={si}
                style={{
                  fontWeight: 700,
                  fontSize: 74,
                  lineHeight: 1.85,
                  color: '#f5cb6e',
                  textShadow: GOLD_GLOW,
                  margin: '6px 0',
                }}
              >
                {(() => {
                  const open = startFor();
                  wi--; // the opening bracket shares the first word's timing
                  return (
                    <Word start={open} frame={frame} style={{color: '#e2ad4a'}}>
                      ﴿
                    </Word>
                  );
                })()}
                {seg.words.map((w, i) => (
                  <React.Fragment key={i}>
                    <Word start={startFor()} frame={frame}>
                      {w}
                    </Word>
                    {i < seg.words.length - 1 ? ' ' : ''}
                  </React.Fragment>
                ))}
                {(() => {
                  const close = (textIn + gap * (wi - 1)) * FPS;
                  return (
                    <Word start={close} frame={frame} style={{color: '#e2ad4a'}}>
                      ﴾
                    </Word>
                  );
                })()}
              </div>
            ),
          )}
        </div>
        <div
          style={{
            fontFamily: LATIN_FONT,
            fontWeight: 500,
            fontSize: 34,
            lineHeight: 1.42,
            color: 'rgba(255,255,255,0.95)',
            textAlign: 'center',
            background: 'rgba(6, 12, 22, 0.58)',
            border: '1px solid rgba(255,255,255,0.08)',
            borderRadius: 20,
            padding: '18px 30px',
            maxWidth: 900,
            opacity: en,
            transform: `translateY(${(1 - en) * 12}px)`,
          }}
        >
          {scene.en}
        </div>
      </div>
    </AbsoluteFill>
  );
};
