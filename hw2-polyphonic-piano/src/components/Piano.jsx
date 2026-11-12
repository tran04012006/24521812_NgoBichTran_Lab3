
import {
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";

import PianoKey from "./PianoKey.jsx";
import KeyboardGuide from "./KeyboardGuide.jsx";

import PolyphonicSynth from "../audio/PolyphonicSynth.js";

import {
  PIANO_KEYS,
  WHITE_KEY_COUNT,
  BLACK_KEY_COUNT,
  TOTAL_PIANO_WIDTH,
} from "../utils/notes.js";

import {
  CODE_TO_MIDI,
  isTypingTarget,
} from "../utils/keyboardMapping.js";

const WHITE_KEYS = PIANO_KEYS.filter(
  (key) => !key.isBlack
);

const BLACK_KEYS = PIANO_KEYS.filter(
  (key) => key.isBlack
);

const NOTE_BY_MIDI = new Map(
  PIANO_KEYS.map((note) => [note.midi, note])
);

const MAX_VOICES = 8;

function Piano() {
  const synthRef = useRef(null);

  // MIDI -> Set of source IDs.
  //
  // Example:
  // 60 -> Set(["keyboard:KeyA", "pointer:1"])
  //
  // This registry tracks which inputs are holding notes.
  const noteOwnersRef = useRef(new Map());

  // Tracks currently pressed physical keyboard codes.
  const pressedKeyboardCodesRef = useRef(new Set());

  const [selectedMidi, setSelectedMidi] = useState(null);

  const [activeNotes, setActiveNotes] = useState(
    () => new Set()
  );

  const [lastStolenMidi, setLastStolenMidi] = useState(null);

  // Initialize the synthesizer for this effect lifecycle.
  // This supports React 19 development Strict Mode.
  useEffect(() => {
    const synth = new PolyphonicSynth(MAX_VOICES);

    synthRef.current = synth;

    return () => {
      synth.dispose();

      if (synthRef.current === synth) {
        synthRef.current = null;
      }

      noteOwnersRef.current.clear();
      pressedKeyboardCodesRef.current.clear();
    };
  }, []);

  const handleSelectNote = useCallback((midi) => {
    setSelectedMidi(midi);
  }, []);

  // Synchronize the React UI with allocated synth voices.
  const syncActiveNotes = useCallback(() => {
    const synth = synthRef.current;

    if (!synth) {
      return;
    }

    setActiveNotes(
      new Set(synth.getActiveMidiNotes())
    );
  }, []);

  // Start a note for one specific input source.
  const handleNoteOn = useCallback(
    (midi, frequency, sourceId) => {
      const synth = synthRef.current;

      if (!synth || !sourceId) {
        return false;
      }

      if (!NOTE_BY_MIDI.has(midi)) {
        return false;
      }

      const ownersMap = noteOwnersRef.current;

      const existingOwners = ownersMap.get(midi);

      // The same input must not acquire the same note twice.
      if (existingOwners?.has(sourceId)) {
        return true;
      }

      // If another input already owns this note,
      // add this source without creating a second voice.
      if (existingOwners) {
        existingOwners.add(sourceId);
        return true;
      }

      // First owner: allocate a real audio voice.
      const result = synth.noteOn(midi, frequency);

      if (!result.success) {
        return false;
      }

      // If FIFO stealing removed another note,
      // its old owners must no longer control audio.
      if (result.stolenMidi !== null) {
        ownersMap.delete(result.stolenMidi);

        setLastStolenMidi(result.stolenMidi);
      }

      // Register the new note owner.
      ownersMap.set(
        midi,
        new Set([sourceId])
      );

      syncActiveNotes();

      return true;
    },
    [syncActiveNotes]
  );

  // Release one source's ownership of a note.
  const handleNoteOff = useCallback(
    (midi, sourceId) => {
      const ownersMap = noteOwnersRef.current;

      const owners = ownersMap.get(midi);

      if (!owners || !owners.has(sourceId)) {
        return;
      }

      owners.delete(sourceId);

      // Other sources still hold this note.
      // Do not stop its oscillator.
      if (owners.size > 0) {
        return;
      }

      // No owners remain.
      ownersMap.delete(midi);

      const synth = synthRef.current;

      if (synth) {
        synth.noteOff(midi);
      }

      syncActiveNotes();
    },
    [syncActiveNotes]
  );

  // Stop every currently allocated note.
  const handleStopAll = useCallback(() => {
    const synth = synthRef.current;

    if (synth) {
      synth.stopAll();
    }

    // Clear every input owner.
    noteOwnersRef.current.clear();

    // Reset physical keyboard state.
    pressedKeyboardCodesRef.current.clear();

    setActiveNotes(new Set());
  }, []);

  // Register global physical keyboard listeners.
  useEffect(() => {
    const handleKeyDown = (event) => {
      const midi = CODE_TO_MIDI[event.code];

      if (midi === undefined) {
        return;
      }

      // Ignore shortcuts such as Ctrl+A and Alt+F.
      if (
        event.ctrlKey ||
        event.altKey ||
        event.metaKey
      ) {
        return;
      }

      // Do not play notes while typing in an input.
      if (isTypingTarget(event.target)) {
        return;
      }

      // Ignore repeated keydown events.
      if (
        event.repeat ||
        pressedKeyboardCodesRef.current.has(event.code)
      ) {
        event.preventDefault();
        return;
      }

      const note = NOTE_BY_MIDI.get(midi);

      if (!note) {
        return;
      }

      event.preventDefault();

      const sourceId = `keyboard:${event.code}`;

      // Mark pressed before starting audio.
      pressedKeyboardCodesRef.current.add(event.code);

      const success = handleNoteOn(
        midi,
        note.frequency,
        sourceId
      );

      if (!success) {
        pressedKeyboardCodesRef.current.delete(
          event.code
        );

        return;
      }

      handleSelectNote(midi);
    };

    const handleKeyUp = (event) => {
      const midi = CODE_TO_MIDI[event.code];

      if (midi === undefined) {
        return;
      }

      // Only release keyboard events we actually started.
      if (
        !pressedKeyboardCodesRef.current.has(
          event.code
        )
      ) {
        return;
      }

      event.preventDefault();

      pressedKeyboardCodesRef.current.delete(
        event.code
      );

      const sourceId = `keyboard:${event.code}`;

      handleNoteOff(midi, sourceId);
    };

    // Release all computer keyboard owners.
    const releaseKeyboardNotes = () => {
      const pressedCodes = Array.from(
        pressedKeyboardCodesRef.current
      );

      pressedKeyboardCodesRef.current.clear();

      for (const code of pressedCodes) {
        const midi = CODE_TO_MIDI[code];

        if (midi !== undefined) {
          handleNoteOff(
            midi,
            `keyboard:${code}`
          );
        }
      }
    };

    const handleVisibilityChange = () => {
      if (document.hidden) {
        releaseKeyboardNotes();
      }
    };

    window.addEventListener(
      "keydown",
      handleKeyDown
    );

    window.addEventListener(
      "keyup",
      handleKeyUp
    );

    window.addEventListener(
      "blur",
      releaseKeyboardNotes
    );

    document.addEventListener(
      "visibilitychange",
      handleVisibilityChange
    );

    return () => {
      window.removeEventListener(
        "keydown",
        handleKeyDown
      );

      window.removeEventListener(
        "keyup",
        handleKeyUp
      );

      window.removeEventListener(
        "blur",
        releaseKeyboardNotes
      );

      document.removeEventListener(
        "visibilitychange",
        handleVisibilityChange
      );
    };
  }, [
    handleNoteOn,
    handleNoteOff,
    handleSelectNote,
  ]);

  const selectedNote =
    NOTE_BY_MIDI.get(selectedMidi) ?? null;

  const stolenNote =
    NOTE_BY_MIDI.get(lastStolenMidi) ?? null;

  const activeVoiceCount = activeNotes.size;

  return (
    <section className="piano-panel">
      {/* Header */}
      <div className="piano-panel__header">
        <div>
          <h2>88-Key Polyphonic Piano</h2>

          <p>
            Play with your physical keyboard, mouse,
            or touchscreen. Up to {MAX_VOICES} voices
            can sound simultaneously.
          </p>
        </div>

        <span className="piano-panel__status">
          Audio Enabled
        </span>
      </div>

      {/* Piano information */}
      <div className="piano-info">
        <div className="piano-info__item">
          <span>Total Keys</span>
          <strong>{PIANO_KEYS.length}</strong>
        </div>

        <div className="piano-info__item">
          <span>White Keys</span>
          <strong>{WHITE_KEY_COUNT}</strong>
        </div>

        <div className="piano-info__item">
          <span>Black Keys</span>
          <strong>{BLACK_KEY_COUNT}</strong>
        </div>

        <div className="piano-info__item">
          <span>Range</span>
          <strong>A0 – C8</strong>
        </div>
      </div>

      {/* Voice engine */}
      <div className="voice-panel">
        <div className="voice-panel__header">
          <div>
            <h3>Polyphonic Voice Engine</h3>

            <p>
              FIFO voice stealing with an
              {` ${MAX_VOICES}`}-voice limit
            </p>
          </div>

          <button
            type="button"
            className="stop-all-button"
            onClick={handleStopAll}
            disabled={activeVoiceCount === 0}
          >
            Stop All Notes
          </button>
        </div>

        <div className="voice-panel__stats">
          <div className="voice-stat">
            <span>Active Voices</span>

            <strong>
              {activeVoiceCount} / {MAX_VOICES}
            </strong>
          </div>

          <div className="voice-stat">
            <span>Available Voices</span>

            <strong>
              {MAX_VOICES - activeVoiceCount}
            </strong>
          </div>

          <div className="voice-stat">
            <span>Voice Stealing</span>

            <strong>
              {stolenNote
                ? `Last: ${stolenNote.noteName}`
                : "None"}
            </strong>
          </div>
        </div>

        <div
          className="voice-indicators"
          aria-label={`${activeVoiceCount} of ${MAX_VOICES} voices active`}
        >
          {Array.from(
            { length: MAX_VOICES },
            (_, index) => (
              <div
                key={index}
                className={
                  index < activeVoiceCount
                    ? "voice-indicator voice-indicator--active"
                    : "voice-indicator"
                }
                title={`Voice ${index + 1}`}
              />
            )
          )}
        </div>

        <div className="active-notes">
          <span>Currently Playing:</span>

          <div className="active-notes__list">
            {activeNotes.size > 0 ? (
              Array.from(activeNotes).map((midi) => {
                const note = NOTE_BY_MIDI.get(midi);

                return (
                  <span
                    className="active-note-badge"
                    key={midi}
                  >
                    {note?.noteName ?? midi}
                  </span>
                );
              })
            ) : (
              <span className="active-notes__empty">
                No active notes
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Physical keyboard mapping guide */}
      <KeyboardGuide activeNotes={activeNotes} />

      {/* 88-key virtual piano */}
      <div
        className="piano-scroll"
        role="region"
        aria-label="Scrollable 88-key piano"
        tabIndex={0}
      >
        <div
          className="piano-keyboard"
          style={{
            width: TOTAL_PIANO_WIDTH,
          }}
        >
          <div className="white-keys">
            {WHITE_KEYS.map((key) => (
              <PianoKey
                key={key.midi}
                {...key}
                isSelected={
                  selectedMidi === key.midi
                }
                isPlaying={
                  activeNotes.has(key.midi)
                }
                onSelect={handleSelectNote}
                onNoteOn={handleNoteOn}
                onNoteOff={handleNoteOff}
              />
            ))}
          </div>

          <div className="black-keys">
            {BLACK_KEYS.map((key) => (
              <PianoKey
                key={key.midi}
                {...key}
                isSelected={
                  selectedMidi === key.midi
                }
                isPlaying={
                  activeNotes.has(key.midi)
                }
                onSelect={handleSelectNote}
                onNoteOn={handleNoteOn}
                onNoteOff={handleNoteOff}
              />
            ))}
          </div>
        </div>
      </div>

      <p className="piano-scroll-hint">
        Scroll to explore all 88 piano keys.
        You can also play notes with your computer
        keyboard.
      </p>

      {/* Selected note information */}
      <div className="selected-note-panel">
        <h3>Selected Note</h3>

        {selectedNote ? (
          <div className="selected-note-details">
            <div>
              <span>Note</span>
              <strong>
                {selectedNote.noteName}
              </strong>
            </div>

            <div>
              <span>MIDI Number</span>
              <strong>
                {selectedNote.midi}
              </strong>
            </div>

            <div>
              <span>Frequency</span>
              <strong>
                {selectedNote.frequency.toFixed(2)} Hz
              </strong>
            </div>

            <div>
              <span>Key Type</span>
              <strong>
                {selectedNote.isBlack
                  ? "Black"
                  : "White"}
              </strong>
            </div>
          </div>
        ) : (
          <p className="selected-note-empty">
            No key selected. Play a piano note
            to begin.
          </p>
        )}
      </div>
    </section>
  );
}

export default Piano;
