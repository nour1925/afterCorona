import React from 'react';
import {
  AbsoluteFill,
  Audio,
  getRemotionEnvironment,
  interpolate,
  Sequence,
  staticFile,
  useCurrentFrame,
} from 'remotion';
import {Caption} from './components/Caption';
import {EndCard} from './components/EndCard';
import {Grain} from './components/Grain';
import {clamp} from './lib/anim';
import {LATIN_FONT, waitForFonts} from './lib/fonts';
import {Darkness} from './scenes/Darkness';
import {Dawn} from './scenes/Dawn';
import {Departure} from './scenes/Departure';
import {Dua} from './scenes/Dua';
import {Nineveh} from './scenes/Nineveh';
import {Storm} from './scenes/Storm';
import {Whale} from './scenes/Whale';
import {
  END_CARD,
  SCENE_FADE,
  SCENES,
  SceneId,
  sec,
  SFX,
  TOTAL_SECONDS,
  VOICEOVER_FILE,
  VOICEOVER_VOLUME,
} from './timeline';

waitForFonts();

export type YunusReelProps = {
  hasVoiceover: boolean;
  availableSfx: string[];
};

const SCENE_COMPONENTS: Record<SceneId, React.FC> = {
  storm: Storm,
  nineveh: Nineveh,
  departure: Departure,
  whale: Whale,
  darkness: Darkness,
  dawn: Dawn,
  dua: Dua,
};

/** Fades a scene in over SCENE_FADE; it is held under the next scene while that one fades in. */
const FadeIn: React.FC<{children: React.ReactNode; enabled: boolean}> = ({children, enabled}) => {
  const frame = useCurrentFrame();
  const opacity = enabled ? interpolate(frame, [0, sec(SCENE_FADE)], [0, 1], clamp) : 1;
  return <AbsoluteFill style={{opacity}}>{children}</AbsoluteFill>;
};

const FadeOutAtEnd: React.FC = () => {
  const frame = useCurrentFrame();
  const total = sec(TOTAL_SECONDS);
  const o = interpolate(frame, [total - sec(0.6), total], [0, 1], clamp);
  return <AbsoluteFill style={{background: '#000', opacity: o}} />;
};

const VoiceoverPlaceholder: React.FC = () => (
  <div
    style={{
      position: 'absolute',
      top: 40,
      left: 40,
      padding: '10px 18px',
      borderRadius: 12,
      background: 'rgba(0,0,0,0.6)',
      color: '#f5cb6e',
      fontFamily: LATIN_FONT,
      fontSize: 24,
      border: '1px dashed rgba(245,203,110,0.6)',
    }}
  >
    🔇 Voiceover placeholder — add public/{VOICEOVER_FILE}
  </div>
);

export const YunusReel: React.FC<YunusReelProps> = ({hasVoiceover, availableSfx}) => {
  const {isStudio} = getRemotionEnvironment();
  return (
    <AbsoluteFill style={{background: '#000'}}>
      {SCENES.map((scene, i) => {
        const Scene = SCENE_COMPONENTS[scene.id];
        const isLast = i === SCENES.length - 1;
        // Each scene keeps running for SCENE_FADE after its end, underneath the next one.
        const from = sec(scene.start);
        const duration = sec(scene.end - scene.start) + (isLast ? 0 : sec(SCENE_FADE));
        return (
          <Sequence key={scene.id} from={from} durationInFrames={duration} name={`${i + 1}. ${scene.id}`}>
            <FadeIn enabled={i > 0}>
              <Scene />
            </FadeIn>
          </Sequence>
        );
      })}

      <Grain />

      {SCENES.map((scene, i) => (
        <Sequence
          key={`cap-${scene.id}`}
          from={sec(scene.start)}
          durationInFrames={sec(scene.end - scene.start)}
          name={`caption ${i + 1}`}
        >
          <Caption scene={scene} />
        </Sequence>
      ))}

      <Sequence from={sec(END_CARD.start)} name="end card">
        <EndCard text={END_CARD.text} top={END_CARD.top} />
      </Sequence>

      <FadeOutAtEnd />

      {hasVoiceover ? (
        <Audio src={staticFile(VOICEOVER_FILE)} volume={VOICEOVER_VOLUME} />
      ) : isStudio ? (
        <VoiceoverPlaceholder />
      ) : null}

      {SFX.filter((cue) => availableSfx.includes(cue.file)).map((cue, i) => (
        <Sequence
          key={`sfx-${i}`}
          from={sec(cue.at)}
          durationInFrames={cue.duration ? sec(cue.duration) : undefined}
          name={`sfx ${cue.file}`}
        >
          <Audio src={staticFile(cue.file)} volume={cue.volume ?? 1} />
        </Sequence>
      ))}
    </AbsoluteFill>
  );
};
