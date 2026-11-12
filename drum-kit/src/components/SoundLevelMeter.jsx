
import { useEffect, useState } from "react";
import { getAudioLevelDbfs } from "../audio/drumAudio.js";

const MIN_DBFS = -60;

export default function SoundLevelMeter({ hitCount }) {
  const [level, setLevel] = useState(MIN_DBFS);

  useEffect(() => {
    if (hitCount === 0) return undefined;

    let frameId;
    const deadline = performance.now() + 1500;

    function measure() {
      setLevel(getAudioLevelDbfs());

      if (performance.now() < deadline) {
        frameId = requestAnimationFrame(measure);
      } else {
        setLevel(MIN_DBFS);
      }
    }

    frameId = requestAnimationFrame(measure);

    return () => cancelAnimationFrame(frameId);
  }, [hitCount]);

  const percent = Math.max(
    0,
    Math.min(100, ((level - MIN_DBFS) / 60) * 100)
  );

  const roundedLevel = Math.round(level);

  return (
    <section
      className="feedback-card"
      aria-labelledby="level-title"
    >
      <h3 id="level-title">Sound level</h3>

      <p
        className="feedback-note"
        id="level-description"
      >
        Live digital output level (dBFS), not
        real-world sound pressure (dB SPL).
      </p>

      <div
        className="meter-readout"
        aria-hidden="true"
      >
        {roundedLevel} dBFS
      </div>

      <div
        className="meter-track"
        role="meter"
        aria-label="Digital drum audio level"
        aria-valuemin={-60}
        aria-valuemax={0}
        aria-valuenow={roundedLevel}
        aria-valuetext={
          `${roundedLevel} decibels relative to full scale`
        }
        aria-describedby="level-description"
      >
        <div
          className="meter-fill"
          style={{ width: `${percent}%` }}
        />
      </div>

      <div className="meter-scale" aria-hidden="true">
        <span>−60 dBFS</span>
        <span>0 dBFS</span>
      </div>
    </section>
  );
}
