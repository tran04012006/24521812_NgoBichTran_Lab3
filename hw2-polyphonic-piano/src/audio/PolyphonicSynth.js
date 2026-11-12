const DEFAULT_MAX_VOICES = 8;

const MIN_GAIN = 0.0001;

const ATTACK_TIME = 0.015;
const DECAY_TIME = 0.12;
const SUSTAIN_LEVEL = 0.35;
const RELEASE_TIME = 0.04;

const MASTER_VOLUME = 0.35;

export default class PolyphonicSynth {
  constructor(maxVoices = DEFAULT_MAX_VOICES) {
    if (
      !Number.isInteger(maxVoices) ||
      maxVoices < 1
    ) {
      throw new Error(
        "maxVoices must be a positive integer"
      );
    }

    this.maxVoices = maxVoices;

    this.ctx = null;
    this.masterGain = null;

    // Active voices in FIFO insertion order.
    // MIDI -> Voice
    this.voices = new Map();

    // Includes voices currently fading out.
    this.allVoices = new Set();

    this.disposed = false;
  }

  initializeAudio() {
    if (this.disposed) {
      return false;
    }

    if (!this.ctx) {
      const AudioContextClass =
        window.AudioContext ||
        window.webkitAudioContext;

      if (!AudioContextClass) {
        console.error(
          "Web Audio API is not supported"
        );

        return false;
      }

      this.ctx = new AudioContextClass();

      this.masterGain = this.ctx.createGain();

      this.masterGain.gain.value =
        MASTER_VOLUME;

      this.masterGain.connect(
        this.ctx.destination
      );
    }

    if (this.ctx.state === "closed") {
      return false;
    }

    if (this.ctx.state === "suspended") {
      this.ctx.resume().catch((error) => {
        console.error(
          "Failed to resume AudioContext:",
          error
        );
      });
    }

    return true;
  }

  createVoice(midi, frequency) {
    const now = this.ctx.currentTime;

    const oscillator =
      this.ctx.createOscillator();

    const gainNode = this.ctx.createGain();

    oscillator.type = "triangle";

    oscillator.frequency.setValueAtTime(
      frequency,
      now
    );

    const gain = gainNode.gain;

    // Attack.
    gain.setValueAtTime(
      MIN_GAIN,
      now
    );

    gain.exponentialRampToValueAtTime(
      1,
      now + ATTACK_TIME
    );

    // Decay to sustain.
    gain.exponentialRampToValueAtTime(
      SUSTAIN_LEVEL,
      now + ATTACK_TIME + DECAY_TIME
    );

    oscillator.connect(gainNode);
    gainNode.connect(this.masterGain);

    const voice = {
      midi,
      frequency,
      oscillator,
      gainNode,
      isReleased: false,
      stopScheduled: false,
    };

    this.allVoices.add(voice);

    oscillator.onended = () => {
      oscillator.disconnect();
      gainNode.disconnect();

      this.allVoices.delete(voice);

      // An old voice must not delete a newer
      // voice with the same MIDI number.
      if (this.voices.get(midi) === voice) {
        this.voices.delete(midi);
      }
    };

    oscillator.start(now);

    return voice;
  }

  // Smoothly release a single voice.
  releaseVoice(voice) {
    if (
      !voice ||
      voice.isReleased ||
      !this.ctx
    ) {
      return;
    }

    voice.isReleased = true;

    const now = this.ctx.currentTime;

    const gain = voice.gainNode.gain;

    // Preserve the gain value during
    // the transition when supported.
    if (
      typeof gain.cancelAndHoldAtTime ===
      "function"
    ) {
      gain.cancelAndHoldAtTime(now);
    } else {
      gain.cancelScheduledValues(now);

      gain.setValueAtTime(
        Math.max(gain.value, MIN_GAIN),
        now
      );
    }

    gain.exponentialRampToValueAtTime(
      MIN_GAIN,
      now + RELEASE_TIME
    );

    if (!voice.stopScheduled) {
      voice.stopScheduled = true;

      voice.oscillator.stop(
        now + RELEASE_TIME + 0.01
      );
    }
  }

  // Immediately silence a voice.
  //
  // The oscillator may have already been
  // scheduled to stop after its release.
  // In that case, setting gain to zero is
  // enough to silence it immediately.
  silenceVoice(voice) {
    if (!voice || !this.ctx) {
      return;
    }

    const now = this.ctx.currentTime;
    const gain = voice.gainNode.gain;

    gain.cancelScheduledValues(now);
    gain.setValueAtTime(0, now);

    voice.isReleased = true;

    if (!voice.stopScheduled) {
      voice.stopScheduled = true;

      voice.oscillator.stop(now);
    }
  }

  noteOn(midi, frequency) {
    const failure = () => ({
      success: false,
      stolenMidi: null,
      activeVoices: this.voices.size,
    });

    if (
      !Number.isInteger(midi) ||
      !Number.isFinite(frequency) ||
      frequency <= 0
    ) {
      return failure();
    }

    if (!this.initializeAudio()) {
      return failure();
    }

    const now = this.ctx.currentTime;

    // stopAll may have muted the master output.
    this.masterGain.gain.cancelScheduledValues(now);

    this.masterGain.gain.setValueAtTime(
      MASTER_VOLUME,
      now
    );

    let stolenMidi = null;

    // Retriggering the same MIDI note refreshes
    // its position in the FIFO Map.
    if (this.voices.has(midi)) {
      const oldVoice = this.voices.get(midi);

      this.releaseVoice(oldVoice);
      this.voices.delete(midi);
    }

    // Remove the oldest voice if the pool is full.
    if (this.voices.size >= this.maxVoices) {
      const oldestMidi =
        this.voices.keys().next().value;

      const oldestVoice =
        this.voices.get(oldestMidi);

      this.releaseVoice(oldestVoice);
      this.voices.delete(oldestMidi);

      stolenMidi = oldestMidi;
    }

    const voice = this.createVoice(
      midi,
      frequency
    );

    this.voices.set(midi, voice);

    return {
      success: true,
      stolenMidi,
      activeVoices: this.voices.size,
    };
  }

  noteOff(midi) {
    const voice = this.voices.get(midi);

    if (!voice) {
      return false;
    }

    this.voices.delete(midi);
    this.releaseVoice(voice);

    return true;
  }

  // Emergency stop for every allocated
  // or currently releasing oscillator.
  stopAll() {
    if (this.ctx && this.masterGain) {
      const now = this.ctx.currentTime;

      this.masterGain.gain.cancelScheduledValues(
        now
      );

      this.masterGain.gain.setValueAtTime(
        0,
        now
      );
    }

    for (const voice of this.allVoices) {
      this.silenceVoice(voice);
    }

    this.voices.clear();
  }

  getActiveVoiceCount() {
    return this.voices.size;
  }

  getActiveMidiNotes() {
    return Array.from(
      this.voices.keys()
    );
  }

  dispose() {
    if (this.disposed) {
      return;
    }

    this.disposed = true;

    this.stopAll();

    const context = this.ctx;

    this.ctx = null;
    this.masterGain = null;

    if (context && context.state !== "closed") {
      context.close().catch((error) => {
        console.error(
          "Failed to close AudioContext:",
          error
        );
      });
    }
  }
}