/**
 * ─────────────────────────────────────────────────────────────
 *  TIMELINE CONFIG — edit this file to match your voiceover.
 * ─────────────────────────────────────────────────────────────
 *
 * All times are in SECONDS. Scenes must be contiguous (each scene's
 * `start` equals the previous scene's `end`). The total video length
 * is the last scene's `end`.
 *
 * Arabic text: anything inside ﴿ ﴾ is rendered as a Quran verse
 * (gold, glowing, on its own line). Everything else is narration.
 *
 * Optional per-scene caption timing (relative to the scene start):
 *   textIn   – when the first Arabic word starts fading in
 *   textOut  – when the caption fades out (defaults to scene end)
 *   wordGap  – seconds between successive words fading in
 */

export const FPS = 30;
export const WIDTH = 1080;
export const HEIGHT = 1920;

/** Cross-fade length between scenes, in seconds. */
export const SCENE_FADE = 0.8;

export type SceneId =
  | 'storm'
  | 'nineveh'
  | 'departure'
  | 'whale'
  | 'darkness'
  | 'dawn'
  | 'dua';

export type SceneConfig = {
  id: SceneId;
  start: number;
  end: number;
  ar: string;
  en: string;
  textIn?: number;
  textOut?: number;
  wordGap?: number;
  /** Top of the caption block in px (default 1120). */
  captionTop?: number;
};

export const SCENES: SceneConfig[] = [
  {
    id: 'storm',
    start: 0,
    end: 6,
    ar: 'في ظلماتٍ ثلاث… نادى عبدٌ ربَّه، فنجّاه.',
    en: 'In three layers of darkness, a servant called upon his Lord, and was saved.',
    textIn: 0.6,
    wordGap: 0.32,
  },
  {
    id: 'nineveh',
    start: 6,
    end: 15,
    ar: 'أرسل اللهُ يونسَ عليه السلام إلى قومه في نينوى، فدعاهم إلى الله، فأعرضوا عنه.',
    en: 'Allah sent Yunus to his people in Nineveh. He called them to Allah, but they turned away.',
  },
  {
    id: 'departure',
    start: 15,
    end: 24,
    ar: 'فخرج مُغاضبًا قبل أن يأذنَ اللهُ له، وركب سفينةً في البحر.',
    en: 'He left in anger before Allah permitted him, and boarded a ship.',
  },
  {
    id: 'whale',
    start: 24,
    end: 33,
    ar: 'فهاجت الأمواج، واقترعوا، فوقعت القرعةُ عليه، فأُلقي في البحر، فالتقمه الحوت.',
    en: 'The waves rose. They cast lots, it fell on him, he was thrown into the sea, and the whale swallowed him.',
    wordGap: 0.42,
  },
  {
    id: 'darkness',
    start: 33,
    end: 45,
    ar: 'في ظلمة الليل، وظلمة البحر، وظلمة بطن الحوت… نادى: ﴿لَا إِلَٰهَ إِلَّا أَنتَ سُبْحَانَكَ إِنِّي كُنتُ مِنَ الظَّالِمِينَ﴾',
    en: '“There is no god but You. Glory be to You. Indeed, I was among the wrongdoers.” (21:87)',
    textIn: 1.2,
    wordGap: 0.42,
    captionTop: 780,
  },
  {
    id: 'dawn',
    start: 45,
    end: 53,
    ar: 'فاستجاب اللهُ له، ونجّاه من الغمّ، وأنبت عليه شجرةً من يقطين.',
    en: 'Allah answered him, saved him from distress, and grew a gourd plant over him.',
  },
  {
    id: 'dua',
    start: 53,
    end: 60,
    ar: '﴿وَكَذَٰلِكَ نُنجِي الْمُؤْمِنِينَ﴾ … مهما اشتدّت ظلماتُك، قُلها.',
    en: '“And thus do We save the believers.” However dark it gets — say it.',
    textIn: 0.4,
    wordGap: 0.3,
    captionTop: 330,
  },
];

/** End card shown over the final scene (seconds, absolute). */
export const END_CARD = {
  start: 56.6,
  top: 1060,
  text: 'Share it with someone who needs it 🤍',
};

/** Voiceover file inside /public. Rendered silently if missing. */
export const VOICEOVER_FILE = 'voiceover.mp3';
export const VOICEOVER_VOLUME = 1;

/**
 * Optional sound effects inside /public/sfx. Any file that is missing
 * is skipped automatically. `at` is in seconds (absolute), `duration`
 * trims the clip (seconds), `volume` 0–1.
 */
export type SfxCue = {file: string; at: number; duration?: number; volume?: number};

export const SFX: SfxCue[] = [
  {file: 'sfx/waves.mp3', at: 0, duration: 6.5, volume: 0.45},
  {file: 'sfx/thunder.mp3', at: 1.2, volume: 0.7},
  {file: 'sfx/thunder.mp3', at: 4.6, volume: 0.5},
  {file: 'sfx/wind.mp3', at: 6, duration: 9, volume: 0.25},
  {file: 'sfx/waves.mp3', at: 15, duration: 9, volume: 0.3},
  {file: 'sfx/wind.mp3', at: 24, duration: 9, volume: 0.45},
  {file: 'sfx/waves.mp3', at: 24, duration: 9, volume: 0.55},
  {file: 'sfx/thunder.mp3', at: 26.5, volume: 0.6},
  {file: 'sfx/waves.mp3', at: 45, duration: 8, volume: 0.3},
  {file: 'sfx/wind.mp3', at: 53, duration: 7, volume: 0.15},
];

export const TOTAL_SECONDS = SCENES[SCENES.length - 1].end;
export const sec = (s: number) => Math.round(s * FPS);
