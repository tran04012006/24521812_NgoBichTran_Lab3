
import {
  KEYBOARD_KEYS,
} from "../utils/keyboardMapping.js";

import "./KeyboardGuide.css";

function KeyboardGuide({ activeNotes }) {
  return (
    <section
      className="keyboard-guide"
      aria-label="Computer keyboard piano mapping"
    >
      <div className="keyboard-guide__header">
        <div>
          <h3>Computer Keyboard Controls</h3>

          <p>
            Hold a mapped key to play its note.
            Release the key to stop it.
          </p>
        </div>

        <span className="keyboard-guide__range">
          C4 – E5
        </span>
      </div>

      <div className="keyboard-guide__keys">
        {KEYBOARD_KEYS.map((key) => {
          const isPlaying = activeNotes.has(key.midi);

          return (
            <div
              className={[
                "keyboard-guide__key",
                isPlaying
                  ? "keyboard-guide__key--active"
                  : "",
              ]
                .filter(Boolean)
                .join(" ")}
              key={key.code}
            >
              <kbd>{key.label}</kbd>

              <span>{key.noteName}</span>
            </div>
          );
        })}
      </div>

      <p className="keyboard-guide__hint">
        You can hold several mapped keys simultaneously.
        Mouse and touchscreen input can also be used
        alongside the physical keyboard.
      </p>
    </section>
  );
}

export default KeyboardGuide;
