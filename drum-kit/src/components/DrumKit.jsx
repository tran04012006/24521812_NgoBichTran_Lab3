
import { useCallback, useEffect, useRef, useState } from "react";
import DrumPad from "./DrumPad.jsx";
import HitHistory from "./HitHistory.jsx";
import SoundLevelMeter from "./SoundLevelMeter.jsx";
import { DRUMS, PAD_BY_CODE } from "../data/drums.js";
import { closeDrumAudio, playDrum } from "../audio/drumAudio.js";
import { useDrumKeyboard } from "../hooks/useDrumKeyboard.js";

const MAX_HITS = 12;

export default function DrumKit() {
  const [activePadId, setActivePadId] = useState(null);
  const [hits, setHits] = useState([]);
  const [hitCount, setHitCount] = useState(0);
  const [announcement, setAnnouncement] = useState(
    "Ready. Play a drum to begin."
  );
  const [lastPlayed, setLastPlayed] = useState(null);
  const [audioError, setAudioError] = useState("");

  const nextHitId = useRef(0);
  const activeTimer = useRef(null);
  const mounted = useRef(true);

  const triggerPad = useCallback(async (padId) => {
    const drum = DRUMS.find((item) => item.id === padId);
    if (!drum) return;

    try {
      await playDrum(padId);
      if (!mounted.current) return;

      nextHitId.current += 1;
      const count = nextHitId.current;

      const time = new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
      });

      setHits((previous) => [
        {
          id: count,
          name: drum.name,
          key: drum.key,
          time,
        },
        ...previous,
      ].slice(0, MAX_HITS));

      setHitCount((previous) => previous + 1);
      setLastPlayed(drum);
      setAnnouncement(`Hit ${count}: ${drum.name}.`);
      setAudioError("");
      setActivePadId(padId);

      if (activeTimer.current) {
        clearTimeout(activeTimer.current);
      }

      activeTimer.current = setTimeout(
        () => setActivePadId(null),
        180
      );
    } catch (error) {
      if (mounted.current) {
        setAudioError(
          error instanceof Error
            ? error.message
            : "Unable to play sound."
        );
      }
    }
  }, []);

  useDrumKeyboard(PAD_BY_CODE, triggerPad, true);

  useEffect(() => {
    mounted.current = true;

    return () => {
      mounted.current = false;

      if (activeTimer.current) {
        clearTimeout(activeTimer.current);
      }

      void closeDrumAudio();
    };
  }, []);

  return (
    <section
      className="studio"
      aria-labelledby="studio-title"
    >
      <div className="studio__header">
        <div>
          <p className="eyebrow">Production studio</p>
          <h2 id="studio-title">Drum pads</h2>
        </div>

        <span className="studio__tag">
          Accessible drum studio
        </span>
      </div>

      <p
        className="studio__instructions"
        id="drum-instructions"
      >
        Click a pad, use Enter or Space on a focused pad,
        or press physical W, A, S, D, J, K, L.
        Shortcuts are disabled while typing.
      </p>

      <div
        className="drum-grid"
        role="group"
        aria-label="Drum pads"
        aria-describedby="drum-instructions"
      >
        {DRUMS.map((drum) => (
          <DrumPad
            key={drum.id}
            drum={drum}
            isActive={activePadId === drum.id}
            onTrigger={triggerPad}
          />
        ))}
      </div>

      <p
        className="studio__last-played"
        aria-hidden="true"
      >
        {lastPlayed
          ? `Last played: ${lastPlayed.name} (${lastPlayed.key})`
          : "Last played: none yet"}
      </p>

      <div
        className="sr-only"
        role="status"
        aria-live="polite"
        aria-atomic="true"
      >
        {announcement}
      </div>

      <div className="feedback-grid">
        <HitHistory
          hits={hits}
          onClear={() => setHits([])}
        />

        <SoundLevelMeter hitCount={hitCount} />
      </div>

      {audioError && (
        <p className="studio__error" role="alert">
          {audioError}
        </p>
      )}
    </section>
  );
}
