# Yunus (AS) — 60s vertical reel

A 1080×1920, 30 fps animated reel built with [Remotion](https://remotion.dev) +
TypeScript. Everything is drawn with SVG/CSS (no human figures; scene 7 shows
stylized raised hands only).

## Commands

```bash
npm install
npm run dev        # open Remotion Studio (preview)
npm run render     # → out/yunus-reel.mp4
npm run typecheck
```

## Adjusting timings to the voiceover

All scene timings and text are in **`src/timeline.ts`**:

- `SCENES[].start / end` — seconds; keep them contiguous. Total length = last `end`.
- `textIn`, `textOut`, `wordGap` — per-scene caption timing (seconds, relative to scene start).
- `captionTop` — vertical position of the caption block (px).
- `END_CARD` — when/where the "Share it…" card appears.
- `SFX` — optional sound-effect cues.

Text inside `﴿ ﴾` is rendered as a Quran verse (gold Amiri with a glow).

## Audio

Put `public/voiceover.mp3` in place and re-render. If it's missing the video
renders silently. See `public/README.md` for optional SFX.

## Structure

```
src/
  timeline.ts        ← edit me
  YunusReel.tsx      composition: scenes, cross-fades, captions, audio
  Root.tsx           registers the composition, detects audio files
  scenes/            Storm, Nineveh, Departure, Whale, Darkness, Dawn, Dua
  components/        Caption (RTL Arabic + English), Ship, WaveLayer, Rain,
                     Lightning, Camera (push-ins), Grain (film grain + texture)
  lib/               fonts (Amiri/Inter via @fontsource), waves, easing helpers
```
