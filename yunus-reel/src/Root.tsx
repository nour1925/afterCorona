import React from 'react';
import {CalculateMetadataFunction, Composition, staticFile} from 'remotion';
import {FPS, HEIGHT, SFX, TOTAL_SECONDS, VOICEOVER_FILE, WIDTH} from './timeline';
import {YunusReel, YunusReelProps} from './YunusReel';

const exists = async (file: string) => {
  try {
    const res = await fetch(staticFile(file), {method: 'HEAD'});
    return res.ok;
  } catch {
    return false;
  }
};

/** Detect which optional audio files are present in /public. */
const calculateMetadata: CalculateMetadataFunction<YunusReelProps> = async ({props}) => {
  const hasVoiceover = await exists(VOICEOVER_FILE);
  const sfxFiles = [...new Set(SFX.map((s) => s.file))];
  const available = (await Promise.all(sfxFiles.map(async (f) => ((await exists(f)) ? f : null)))).filter(
    (f): f is string => f !== null,
  );
  if (!hasVoiceover) {
    console.warn(`[yunus-reel] public/${VOICEOVER_FILE} not found — rendering silent.`);
  }
  return {
    durationInFrames: Math.round(TOTAL_SECONDS * FPS),
    props: {...props, hasVoiceover, availableSfx: available},
  };
};

export const RemotionRoot: React.FC = () => (
  <Composition
    id="YunusReel"
    component={YunusReel}
    durationInFrames={Math.round(TOTAL_SECONDS * FPS)}
    fps={FPS}
    width={WIDTH}
    height={HEIGHT}
    defaultProps={{hasVoiceover: false, availableSfx: []} as YunusReelProps}
    calculateMetadata={calculateMetadata}
  />
);
