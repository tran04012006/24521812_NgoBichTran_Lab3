
const VALID_SPEEDS = [0.5, 1, 2];

function createAbortError() {
  const error = new Error("Playback aborted");
  error.name = "AbortError";
  return error;
}

// Abortable asynchronous delay.
function waitUntil(targetTime, signal) {
  return new Promise((resolve, reject) => {
    if (signal.aborted) {
      reject(createAbortError());
      return;
    }

    let timerId;

    const handleAbort = () => {
      cleanup();
      reject(createAbortError());
    };

    const cleanup = () => {
      clearTimeout(timerId);

      signal.removeEventListener(
        "abort",
        handleAbort
      );
    };

    const remaining = Math.max(
      0,
      targetTime - performance.now()
    );

    timerId = setTimeout(() => {
      cleanup();

      if (signal.aborted) {
        reject(createAbortError());
        return;
      }

      resolve();
    }, remaining);

    signal.addEventListener(
      "abort",
      handleAbort,
      { once: true }
    );
  });
}

export default class Sequencer {
  constructor() {
    this.isRecording = false;
    this.isPlaying = false;

    this.recordingStartTime = 0;

    this.completedNotes = [];
    this.recordingNotes = new Map();

    this.events = [];

    // Current playback session.
    this.playbackSession = null;

    // Incrementing ID prevents source collisions
    // between different playback sessions.
    this.playbackSessionId = 0;

    this.disposed = false;
  }

  startRecording() {
    if (
      this.disposed ||
      this.isRecording ||
      this.isPlaying
    ) {
      return false;
    }

    this.events = [];
    this.completedNotes = [];
    this.recordingNotes.clear();

    this.recordingStartTime =
      performance.now();

    this.isRecording = true;

    return true;
  }

  recordNoteOn(midi, freqHz) {
    if (!this.isRecording) {
      return;
    }

    if (this.recordingNotes.has(midi)) {
      return;
    }

    const startedAt = performance.now();

    this.recordingNotes.set(midi, {
      midi,
      freqHz,
      startedAt,
      startOffsetMs:
        startedAt - this.recordingStartTime,
    });
  }

  recordNoteOff(midi) {
    if (!this.isRecording) {
      return;
    }

    const note = this.recordingNotes.get(midi);

    if (!note) {
      return;
    }

    const endedAt = performance.now();

    this.completedNotes.push({
      midi: note.midi,
      freqHz: note.freqHz,
      startOffsetMs: note.startOffsetMs,
      durationMs: Math.max(
        1,
        endedAt - note.startedAt
      ),
    });

    this.recordingNotes.delete(midi);
  }

  stopRecording() {
    if (!this.isRecording) {
      return this.getEvents();
    }

    // Close held notes at recording end.
    for (const midi of Array.from(
      this.recordingNotes.keys()
    )) {
      this.recordNoteOff(midi);
    }

    this.isRecording = false;

    // FIFO is based on note start order.
    const sortedNotes = [
      ...this.completedNotes,
    ].sort(
      (a, b) =>
        a.startOffsetMs - b.startOffsetMs
    );

    let previousStartMs = 0;

    this.events = sortedNotes.map((note) => {
      const event = {
        midi: note.midi,
        freqHz: note.freqHz,
        durationMs: note.durationMs,
        deltaMs: Math.max(
          0,
          note.startOffsetMs - previousStartMs
        ),
      };

      previousStartMs = note.startOffsetMs;

      return event;
    });

    this.completedNotes = [];
    this.recordingNotes.clear();

    return this.getEvents();
  }

  getEvents() {
    return this.events.map((event) => ({
      ...event,
    }));
  }

  clearRecording() {
    if (
      this.isRecording ||
      this.isPlaying ||
      this.disposed
    ) {
      return false;
    }

    this.events = [];
    this.completedNotes = [];
    this.recordingNotes.clear();

    return true;
  }

  // Convert event delta times into absolute
  // playback start offsets.
  buildSchedule(events, speed, sessionId) {
    let elapsedMs = 0;

    return events.map((event, index) => {
      elapsedMs += event.deltaMs;

      return {
        ...event,
        startMs: elapsedMs / speed,
        durationScaledMs:
          event.durationMs / speed,

        // Every event has unique ownership,
        // including repeated MIDI notes.
        sourceId:
          `playback:${sessionId}:${index}`,
      };
    });
  }

  async play({
    speed = 1,
    onNoteOn,
    onNoteOff,
  }) {
    if (
      this.disposed ||
      this.isPlaying ||
      this.isRecording
    ) {
      return false;
    }

    if (!VALID_SPEEDS.includes(speed)) {
      throw new Error(
        "Unsupported playback speed"
      );
    }

    if (
      typeof onNoteOn !== "function" ||
      typeof onNoteOff !== "function"
    ) {
      throw new Error(
        "Playback callbacks must be functions"
      );
    }

    const events = this.getEvents();

    if (events.length === 0) {
      return false;
    }

    const controller = new AbortController();
    const signal = controller.signal;

    const sessionId =
      ++this.playbackSessionId;

    const schedule = this.buildSchedule(
      events,
      speed,
      sessionId
    );

    // Each session tracks only its own sources.
    // Map<sourceId, midi>
    const owners = new Map();

    const releaseOwnedNote = (sourceId) => {
      if (!owners.has(sourceId)) {
        return;
      }

      const midi = owners.get(sourceId);

      // Delete ownership first so repeated
      // cancellation cannot release twice.
      owners.delete(sourceId);

      onNoteOff(midi, sourceId);
    };

    const releaseAllOwnedNotes = () => {
      for (const sourceId of Array.from(
        owners.keys()
      )) {
        releaseOwnedNote(sourceId);
      }
    };

    const session = {
      id: sessionId,
      controller,
      owners,
      releaseAllOwnedNotes,
    };

    this.playbackSession = session;
    this.isPlaying = true;

    const releaseTasks = [];
    const playbackStart = performance.now();

    try {
      // Start all notes in FIFO event order.
      for (const event of schedule) {
        await waitUntil(
          playbackStart + event.startMs,
          signal
        );

        if (signal.aborted) {
          throw createAbortError();
        }

        const started = onNoteOn(
          event.midi,
          event.freqHz,
          event.sourceId
        );

        // A note might fail to allocate if
        // the audio engine is unavailable.
        if (started === false) {
          continue;
        }

        owners.set(
          event.sourceId,
          event.midi
        );

        // Use the recording's absolute start
        // time for its scheduled note-off.
        // This avoids accumulating extra delay
        // from late note-start callbacks.
        const releaseTime =
          playbackStart +
          event.startMs +
          event.durationScaledMs;

        // Schedule release independently,
        // allowing notes to overlap.
        const releaseTask = waitUntil(
          releaseTime,
          signal
        )
          .then(() => {
            releaseOwnedNote(
              event.sourceId
            );
          })
          .catch((error) => {
            if (error.name !== "AbortError") {
              // Keep pending tasks handled.
              console.error(
                "Note release failed:",
                error
              );
            }
          });

        releaseTasks.push(releaseTask);
      }

      await Promise.all(releaseTasks);

      return !signal.aborted;
    } catch (error) {
      if (error.name !== "AbortError") {
        console.error(
          "Sequencer playback error:",
          error
        );
      }

      return false;
    } finally {
      // Abort outstanding delays on any exit.
      if (!signal.aborted) {
        controller.abort();
      }

      // Cleanup is idempotent.
      releaseAllOwnedNotes();

      if (this.playbackSession === session) {
        this.playbackSession = null;
        this.isPlaying = false;
      }
    }
  }

  stopPlayback() {
    const session = this.playbackSession;

    if (!session) {
      return false;
    }

    // Synchronously invalidate every pending wait.
    session.controller.abort();

    // Immediately release playback ownership.
    // The owner release callback is responsible
    // for calling the synthesizer's noteOff.
    session.releaseAllOwnedNotes();

    return true;
  }

  dispose() {
    if (this.disposed) {
      return;
    }

    this.disposed = true;

    this.stopPlayback();

    this.isRecording = false;

    this.recordingNotes.clear();
    this.completedNotes = [];
    this.events = [];
  }
}
