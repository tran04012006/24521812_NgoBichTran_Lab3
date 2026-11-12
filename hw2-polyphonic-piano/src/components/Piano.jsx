
import {
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";

import PianoKey from "./PianoKey.jsx";
import KeyboardGuide from "./KeyboardGuide.jsx";
import RecorderControls from "./RecorderControls.jsx";

import PolyphonicSynth from "../audio/PolyphonicSynth.js";
import Sequencer from "../sequencer/Sequencer.js";

import {
  PIANO_KEYS,
  WHITE_KEY_COUNT,
  BLACK_KEY_COUNT,
  TOTAL_PIANO_WIDTH,
  MIN_MIDI,
  MAX_MIDI,
} from "../utils/notes.js";

import {
  CODE_TO_MIDI,
  isTypingTarget,
} from "../utils/keyboardMapping.js";

const MAX_VOICES = 8;

const WHITE_KEYS = PIANO_KEYS.filter(
  (key) => !key.isBlack
);

const BLACK_KEYS = PIANO_KEYS.filter(
  (key) => key.isBlack
);

const NOTE_BY_MIDI = new Map(
  PIANO_KEYS.map((note) => [
    note.midi,
    note,
  ])
);

function Piano() {
  const synthRef = useRef(null);
  const sequencerRef = useRef(null);

  // MIDI -> Set of input owners.
  const noteOwnersRef = useRef(new Map());

  const pressedKeyboardCodesRef = useRef(
    new Set()
  );

  const mountedRef = useRef(false);

  const [selectedMidi, setSelectedMidi] =
    useState(null);

  const [activeNotes, setActiveNotes] =
    useState(() => new Set());

  const [lastStolenMidi, setLastStolenMidi] =
    useState(null);

  const [isRecording, setIsRecording] =
    useState(false);

  const [isPlaying, setIsPlaying] =
    useState(false);

  const [recordedEvents, setRecordedEvents] =
    useState([]);

  const [playbackSpeed, setPlaybackSpeed] =
    useState(1);

  const [announcement, setAnnouncement] =
    useState("Piano ready");

  // Initialize engines for each React effect lifecycle.
  useEffect(() => {
    mountedRef.current = true;

    const synth =
      new PolyphonicSynth(MAX_VOICES);

    const sequencer = new Sequencer();

    synthRef.current = synth;
    sequencerRef.current = sequencer;

    return () => {
      mountedRef.current = false;

      // Cancel sequencer before closing audio.
      sequencer.dispose();
      synth.dispose();

      if (synthRef.current === synth) {
        synthRef.current = null;
      }

      if (sequencerRef.current === sequencer) {
        sequencerRef.current = null;
      }

      noteOwnersRef.current.clear();
      pressedKeyboardCodesRef.current.clear();
    };
  }, []);

  // Update a live announcement only when mounted.
  const announce = useCallback((message) => {
    if (mountedRef.current) {
      setAnnouncement(message);
    }
  }, []);

  const handleSelectNote = useCallback((midi) => {
    setSelectedMidi((previous) =>
      previous === midi ? previous : midi
    );
  }, []);

  // Move focus across all 88 MIDI notes.
  const handleNavigate = useCallback(
    (midi, direction) => {
      let nextMidi = midi;

      if (direction === "first") {
        nextMidi = MIN_MIDI;
      } else if (direction === "last") {
        nextMidi = MAX_MIDI;
      } else {
        nextMidi = Math.max(
          MIN_MIDI,
          Math.min(
            MAX_MIDI,
            midi + direction
          )
        );
      }

      if (nextMidi === midi) {
        return;
      }

      setSelectedMidi(nextMidi);

      const nextKey = document.querySelector(
        `[data-piano-midi="${nextMidi}"]`
      );

      nextKey?.focus();

      const note = NOTE_BY_MIDI.get(nextMidi);

      if (note) {
        announce(
          `${note.noteName}, MIDI ${nextMidi}`
        );
      }
    },
    [announce]
  );

  // Read the synth's actual voice allocation.
  const syncActiveNotes = useCallback(() => {
    const synth = synthRef.current;

    if (!synth || !mountedRef.current) {
      return;
    }

    const nextNotes = new Set(
      synth.getActiveMidiNotes()
    );

    setActiveNotes((previous) => {
      if (
        previous.size === nextNotes.size &&
        [...nextNotes].every((midi) =>
          previous.has(midi)
        )
      ) {
        return previous;
      }

      return nextNotes;
    });
  }, []);

  // Start a note on behalf of one input source.
  const handleNoteOn = useCallback(
    (midi, frequency, sourceId) => {
      const synth = synthRef.current;
      const sequencer = sequencerRef.current;

      if (
        !synth ||
        !sourceId ||
        !NOTE_BY_MIDI.has(midi)
      ) {
        return false;
      }

      const ownersMap =
        noteOwnersRef.current;

      const existingOwners =
        ownersMap.get(midi);

      // Prevent duplicate ownership.
      if (existingOwners?.has(sourceId)) {
        return true;
      }

      // Multiple sources can hold one voice.
      if (existingOwners) {
        existingOwners.add(sourceId);
        return true;
      }

      const result = synth.noteOn(
        midi,
        frequency
      );

      if (!result.success) {
        return false;
      }

      // Remove ownership of a stolen voice.
      if (result.stolenMidi !== null) {
        if (sequencer?.isRecording) {
          sequencer.recordNoteOff(
            result.stolenMidi
          );
        }

        ownersMap.delete(result.stolenMidi);

        setLastStolenMidi(
          result.stolenMidi
        );
      }

      ownersMap.set(
        midi,
        new Set([sourceId])
      );

      // Do not record playback-generated notes.
      if (
        sequencer?.isRecording &&
        !sourceId.startsWith("playback:")
      ) {
        sequencer.recordNoteOn(
          midi,
          frequency
        );
      }

      syncActiveNotes();

      return true;
    },
    [syncActiveNotes]
  );

  // Release one input's ownership.
  const handleNoteOff = useCallback(
    (midi, sourceId) => {
      const ownersMap =
        noteOwnersRef.current;

      const owners = ownersMap.get(midi);

      if (
        !owners ||
        !owners.has(sourceId)
      ) {
        return;
      }

      owners.delete(sourceId);

      if (owners.size > 0) {
        return;
      }

      // Last owner released.
      ownersMap.delete(midi);

      const synth = synthRef.current;
      const sequencer = sequencerRef.current;

      if (sequencer?.isRecording) {
        sequencer.recordNoteOff(midi);
      }

      synth?.noteOff(midi);

      syncActiveNotes();
    },
    [syncActiveNotes]
  );

  // Immediately silence every note.
  const handleStopAll = useCallback(() => {
    const synth = synthRef.current;
    const sequencer = sequencerRef.current;

    sequencer?.stopPlayback();

    // Close notes being recorded.
    if (sequencer?.isRecording) {
      for (const midi of
        noteOwnersRef.current.keys()) {
        sequencer.recordNoteOff(midi);
      }
    }

    // Silence both active and releasing voices.
    synth?.stopAll();

    noteOwnersRef.current.clear();
    pressedKeyboardCodesRef.current.clear();

    setActiveNotes(new Set());

    announce("All notes stopped");
  }, [announce]);

  // Register physical keyboard listeners.
  useEffect(() => {
    const handleKeyDown = (event) => {
      const midi =
        CODE_TO_MIDI[event.code];

      if (midi === undefined) {
        return;
      }

      if (
        event.ctrlKey ||
        event.altKey ||
        event.metaKey
      ) {
        return;
      }

      if (isTypingTarget(event.target)) {
        return;
      }

      if (
        event.repeat ||
        pressedKeyboardCodesRef.current.has(
          event.code
        )
      ) {
        event.preventDefault();
        return;
      }

      const note = NOTE_BY_MIDI.get(midi);

      if (!note) {
        return;
      }

      event.preventDefault();

      pressedKeyboardCodesRef.current.add(
        event.code
      );

      const success = handleNoteOn(
        midi,
        note.frequency,
        `keyboard:${event.code}`
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
      const midi =
        CODE_TO_MIDI[event.code];

      if (midi === undefined) {
        return;
      }

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

      handleNoteOff(
        midi,
        `keyboard:${event.code}`
      );
    };

    const releaseKeyboardNotes = () => {
      const pressedCodes = [
        ...pressedKeyboardCodesRef.current,
      ];

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

  // Recording controls.
  const handleStartRecording = useCallback(() => {
    const sequencer = sequencerRef.current;

    if (!sequencer?.startRecording()) {
      return;
    }

    setRecordedEvents([]);
    setIsRecording(true);
    setLastStolenMidi(null);

    announce("Recording started");
  }, [announce]);

  const handleStopRecording = useCallback(() => {
    const sequencer = sequencerRef.current;

    if (!sequencer) {
      return;
    }

    const events =
      sequencer.stopRecording();

    setRecordedEvents(events);
    setIsRecording(false);

    announce(
      `Recording stopped. ${events.length} events saved`
    );
  }, [announce]);

  const handlePlay = useCallback(async () => {
    const sequencer = sequencerRef.current;

    if (
      !sequencer ||
      sequencer.isPlaying ||
      sequencer.isRecording ||
      sequencer.getEvents().length === 0
    ) {
      return;
    }

    setIsPlaying(true);
    announce("Playback started");

    try {
      const completed = await sequencer.play({
        speed: playbackSpeed,
        onNoteOn: handleNoteOn,
        onNoteOff: handleNoteOff,
      });

      if (
        mountedRef.current &&
        sequencerRef.current === sequencer
      ) {
        announce(
          completed
            ? "Playback completed"
            : "Playback stopped"
        );
      }
    } catch (error) {
      console.error(
        "Playback error:",
        error
      );

      announce("Playback error");
    } finally {
      if (
        mountedRef.current &&
        sequencerRef.current === sequencer
      ) {
        setIsPlaying(false);
      }
    }
  }, [
    playbackSpeed,
    handleNoteOn,
    handleNoteOff,
    announce,
  ]);

  const handleStopPlayback = useCallback(() => {
    const stopped =
      sequencerRef.current?.stopPlayback();

    if (stopped) {
      announce("Stopping playback");
    }
  }, [announce]);

  const handleClearRecording = useCallback(() => {
    const sequencer = sequencerRef.current;

    if (sequencer?.clearRecording()) {
      setRecordedEvents([]);
      announce("Recording cleared");
    }
  }, [announce]);

  const handleSpeedChange = useCallback(
    (speed) => {
      setPlaybackSpeed(speed);
    },
    []
  );

  const selectedNote =
    NOTE_BY_MIDI.get(selectedMidi) ?? null;

  const stolenNote =
    NOTE_BY_MIDI.get(lastStolenMidi) ?? null;

  const activeVoiceCount = activeNotes.size;

  return (
    <section
      className="piano-panel"
      aria-label="88-key polyphonic piano"
    >
      <div className="piano-panel__header">
        <div>
          <h2>88-Key Polyphonic Piano</h2>

          <p>
            Play notes using your keyboard,
            mouse, or touchscreen. Record
            and replay your music.
          </p>
        </div>

        <span className="piano-panel__status">
          Audio Enabled
        </span>
      </div>

      {/* Piano statistics */}
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

      {/* Polyphonic voice engine */}
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
            disabled={
              activeVoiceCount === 0 &&
              !isPlaying
            }
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
                const note =
                  NOTE_BY_MIDI.get(midi);

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

      {/* FIFO sequencer */}
      <RecorderControls
        isRecording={isRecording}
        isPlaying={isPlaying}
        events={recordedEvents}
        playbackSpeed={playbackSpeed}
        onSpeedChange={handleSpeedChange}
        onStartRecording={handleStartRecording}
        onStopRecording={handleStopRecording}
        onPlay={handlePlay}
        onStopPlayback={handleStopPlayback}
        onClearRecording={handleClearRecording}
      />

      {/* Keyboard guide */}
      <KeyboardGuide activeNotes={activeNotes} />

      {/* Accessible piano navigation */}
      <p
        id="piano-instructions"
        className="piano-scroll-hint"
      >
        Use Left and Right Arrow keys to move
        between piano notes. Press Home for A0,
        End for C8, and Enter or Space to play
        the focused note.
      </p>

      <div
        className="piano-scroll"
        role="region"
        aria-label="Scrollable 88-key piano"
        aria-describedby="piano-instructions"
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
                isTabStop={
                  selectedMidi === null
                    ? key.midi === MIN_MIDI
                    : selectedMidi === key.midi
                }
                onSelect={handleSelectNote}
                onNoteOn={handleNoteOn}
                onNoteOff={handleNoteOff}
                onNavigate={handleNavigate}
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
                isTabStop={
                  selectedMidi === null
                    ? key.midi === MIN_MIDI
                    : selectedMidi === key.midi
                }
                onSelect={handleSelectNote}
                onNoteOn={handleNoteOn}
                onNoteOff={handleNoteOff}
                onNavigate={handleNavigate}
              />
            ))}
          </div>
        </div>
      </div>

      <p className="piano-scroll-hint">
        Scroll horizontally to explore all
        88 notes. Multiple notes can sound
        simultaneously.
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
            No note selected. Play a piano
            key to begin.
          </p>
        )}
      </div>

      {/* Screen-reader announcement */}
      <div
        role="status"
        aria-live="polite"
        aria-atomic="true"
        style={{
          position: "absolute",
          width: "1px",
          height: "1px",
          padding: 0,
          margin: "-1px",
          overflow: "hidden",
          clip: "rect(0, 0, 0, 0)",
          whiteSpace: "nowrap",
          border: 0,
        }}
      >
        {announcement}
      </div>
    </section>
  );
}

export default Piano;
