const VALID_SPEEDS = [0.5, 1, 2];

function createAbortError() {
  const error = new Error("Playback aborted");
  error.name = "AbortError";
  return error;
}

// Wait until a given timestamp, unless canceled.
function waitUntil(targetTime, signal) {
  return new Promise((resolve, reject) => {
    if (signal.aborted) {
      reject(createAbortError());
      return;
    }

    const remaining = Math.max(
      0,
      targetTime - performance.now()
    );

    let timerId;

    const cleanup = () => {
      clearTimeout(timerId);
      signal.removeEventListener(
        "abort",
        handleAbort
      );
    };

    const handleAbort = () => {
      cleanup();
      reject(createAbortError());
    };

    timerId = setTimeout(() => {
      cleanup();

      if (signal.aborted) {
        reject(createAbortError());
      } else {
        resolve();
      }
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

    this.recordingStartTime = 0;

    // Completed notes and their absolute start offsets.
    this.completedNotes = [];

    // Notes whose key-release events have not yet occurred.
    this.recordingNotes = new Map();

    // Completed recording in the assignment format.
    this.events = [];

    this.playbackController = null;
    this.isPlaying = false;
  }

  // Begin recording a new sequence.
  startRecording() {
    if (this.isRecording || this.isPlaying) {
      return false;
    }

    this.events = [];
    this.completedNotes = [];
    this.recordingNotes.clear();

    this.recordingStartTime = performance.now();
    this.isRecording = true;

    return true;
  }

  // Record when a new voice starts.
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

  // Record when the final owner releases the note.
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

  // Finish recording and produce the required format.
  stopRecording() {
    if (!this.isRecording) {
      return this.getEvents();
    }

    // Close notes that are still held.
    for (const midi of Array.from(
      this.recordingNotes.keys()
    )) {
      this.recordNoteOff(midi);
    }

    this.isRecording = false;

    // Sort by note start time, not release time.
    // This is essential for overlapping notes.
    const sortedNotes = [...this.completedNotes].sort(
      (a, b) => a.startOffsetMs - b.startOffsetMs
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

    this.recordingNotes.clear();
    this.completedNotes = [];

    return this.getEvents();
  }

  // Return a copy so external code cannot modify
  // the internal event array accidentally.
  getEvents() {
    return this.events.map((event) => ({
      ...event,
    }));
  }

  clearRecording() {
    if (this.isRecording || this.isPlaying) {
      return false;
    }

    this.events = [];
    this.completedNotes = [];
    this.recordingNotes.clear();

    return true;
  }

  // Play recorded events at the selected speed.
  //
  // onNoteOn(midi, frequency, sourceId)
  // onNoteOff(midi, sourceId)
  //
  // Every event receives a unique source ID.
  async play({
    speed = 1,
    onNoteOn,
    onNoteOff,
  }) {
    if (this.isPlaying || this.isRecording) {
      return false;
    }

    if (!VALID_SPEEDS.includes(speed)) {
      throw new Error("Unsupported playback speed");
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
    const { signal } = controller;

    this.playbackController = controller;
    this.isPlaying = true;

    // Sources currently owned by this playback.
    // Map<sourceId, midi>
    const playbackOwners = new Map();

    // Independent asynchronous note-release tasks.
    const releaseTasks = [];

    // Compute absolute note start offsets.
    // Preserve FIFO order without serializing note lengths.
    let accumulatedStartMs = 0;

    const scheduledEvents = events.map(
      (event, index) => {
        accumulatedStartMs += event.deltaMs;

        return {
          ...event,
          sourceId: `playback:${index}`,
          startMs: accumulatedStartMs / speed,
          durationScaledMs:
            event.durationMs / speed,
        };
      }
    );

    const playbackStart = performance.now();

    const releaseOwnedNote = (sourceId) => {
      if (!playbackOwners.has(sourceId)) {
        return;
      }

      const midi = playbackOwners.get(sourceId);
      playbackOwners.delete(sourceId);

      onNoteOff(midi, sourceId);
    };

    try {
      // Start notes in FIFO order.
      for (const event of scheduledEvents) {
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

        if (started === false) {
          continue;
        }

        playbackOwners.set(
          event.sourceId,
          event.midi
        );

        // The release is scheduled independently.
        // Do not await here: overlapping notes
        // must be allowed to sound together.
        const releaseTime =
          performance.now() +
          event.durationScaledMs;

        const releaseTask = waitUntil(
          releaseTime,
          signal
        )
          .then(() => {
            releaseOwnedNote(event.sourceId);
          })
          .catch((error) => {
            if (error.name !== "AbortError") {
              throw error;
            }
          });

        releaseTasks.push(releaseTask);
      }

      // Wait for every scheduled release.
      await Promise.all(releaseTasks);

      return !signal.aborted;
    } catch (error) {
      if (error.name !== "AbortError") {
        throw error;
      }

      return false;
    } finally {
      // Cancel any pending work on abnormal exit.
      if (!signal.aborted) {
        controller.abort();
      }

      // Release only this sequencer's input sources.
      // Manually held keyboard/mouse notes remain owned
      // by their own input sources.
      for (const sourceId of Array.from(
        playbackOwners.keys()
      )) {
        releaseOwnedNote(sourceId);
      }

      this.isPlaying = false;

      if (this.playbackController === controller) {
        this.playbackController = null;
      }
    }
  }

  stopPlayback() {
    if (!this.playbackController) {
      return false;
    }

    this.playbackController.abort();

    return true;
  }

  dispose() {
    this.stopPlayback();

    this.isRecording = false;

    this.recordingNotes.clear();
    this.completedNotes = [];
    this.events = [];
  }
}