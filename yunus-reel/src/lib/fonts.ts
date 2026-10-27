import '@fontsource/amiri/400.css';
import '@fontsource/amiri/700.css';
import '@fontsource/inter/400.css';
import '@fontsource/inter/500.css';
import {continueRender, delayRender} from 'remotion';

export const ARABIC_FONT = '"Amiri", serif';
export const LATIN_FONT =
  '"Inter", system-ui, sans-serif, "Noto Color Emoji", "Apple Color Emoji", "Segoe UI Emoji"';

let waited = false;

/** Block rendering until Amiri (Arabic subset) and Inter are ready. */
export const waitForFonts = () => {
  if (waited || typeof document === 'undefined') return;
  waited = true;
  const handle = delayRender('Loading Amiri + Inter');
  Promise.all([
    document.fonts.load('400 64px Amiri', 'بسم الله ﴿﴾'),
    document.fonts.load('700 64px Amiri', 'بسم الله ﴿﴾'),
    document.fonts.load('400 32px Inter', 'Allah'),
    document.fonts.load('500 32px Inter', 'Allah'),
  ])
    .then(() => document.fonts.ready)
    .then(() => continueRender(handle))
    .catch((err) => {
      console.warn('Font loading failed', err);
      continueRender(handle);
    });
};
