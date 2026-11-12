const DEFAULT_MAX_VOICES = 8;

const MIN_GAIN = 0.0001;

const ATTACK_TIME = 0.015;
const DECAY_TIME = 0.12;
const SUSTAIN_LEVEL = 0.35;
const RELEASE_TIME = 0.04;

export default class PolyphonicSynth {
  constructor(maxVoices = DEFAULT_MAX_VOICES) {
    if (!Number.isInteger(maxVoices) || maxVoices < 1) {
      throw new Error("maxVoices must be a positive integer");
    }

    this.ctx = null;
    this.masterGain = null;

    this.maxVoices = maxVoices;

    // ES6 Map preserves insertion order.
    // Key: MIDI note number
    // Value: { oscillator, gainNode }
    this.voices = new Map();

    this.disposed = false;
  }

  // Initialize audio only after a user interaction.
  initializeAudio() {
    if (this.disposed) {
      return false;
    }

    if (!this.ctx) {
      const AudioContextClass =
        window.AudioContext || window.webkitAudioContext;

      if (!AudioContextClass) {
        console.error("Web Audio API is not supported");
        return false;
      }

      this.ctx = new AudioContextClass();

      this.masterGain = this.ctx.createGain();

      // Keep combined polyphonic output at a safe level.
      this.masterGain.gain.value = 0.35;

      this.masterGain.connect(this.ctx.destination);
    }

    if (this.ctx.state === "suspended") {
      this.ctx.resume().catch((error) => {
        console.error("Failed to resume AudioContext:", error);
      });
    }

    return true;
  }

  // Create one oscillator and gain node for one voice.
  createVoice(midi, frequency) {
    const now = this.ctx.currentTime;

    const oscillator = this.ctx.createOscillator();
    const gainNode = this.ctx.createGain();

    oscillator.type = "triangle";
    oscillator.frequency.setValueAtTime(frequency, now);

    // Start close to zero to avoid clicking.
    gainNode.gain.setValueAtTime(MIN_GAIN, now);

    // Attack: raise the volume.
    gainNode.gain.exponentialRampToValueAtTime(
      1.0,
      now + ATTACK_TIME
    );

    // Decay: reduce volume to the sustain level.
    gainNode.gain.exponentialRampToValueAtTime(
      SUSTAIN_LEVEL,
      now + ATTACK_TIME + DECAY_TIME
    );

    // Audio connection:
    // Oscillator -> GainNode -> MasterGain -> Speakers
    oscillator.connect(gainNode);
    gainNode.connect(this.masterGain);

    const voice = {
      midi,
      frequency,
      oscillator,
      gainNode,
      isReleased: false,
    };

    // Free references to completed audio nodes.
    oscillator.onended = () => {
      oscillator.disconnect();
      gainNode.disconnect();

      // Only delete if this exact voice is still present.
      // Prevent an old oscillator from deleting a newer
      // voice with the same MIDI number.
      if (this.voices.get(midi) === voice) {
        this.voices.delete(midi);
      }
    };

    oscillator.start(now);

    return voice;
  }

  // Smoothly release a voice to avoid clicks.
  releaseVoice(voice) {
    if (!voice || voice.isReleased || !this.ctx) {
      return;
    }

    voice.isReleased = true;

    const now = this.ctx.currentTime;
    const gainParam = voice.gainNode.gain;

    // Cancel or hold the current envelope position.
    if (typeof gainParam.cancelAndHoldAtTime === "function") {
      gainParam.cancelAndHoldAtTime(now);
    } else {
      gainParam.cancelScheduledValues(now);

      gainParam.setValueAtTime(
        Math.max(gainParam.value, MIN_GAIN),
        now
      );
    }

    // Fade to silence.
    gainParam.exponentialRampToValueAtTime(
      MIN_GAIN,
      now + RELEASE_TIME
    );

    // Stop after the release phase.
    voice.oscillator.stop(now + RELEASE_TIME + 0.01);
  }

  // Play a note and return voice allocation information.
  noteOn(midi, frequency) {
    if (
      !Number.isInteger(midi) ||
      !Number.isFinite(frequency) ||
      frequency <= 0
    ) {
      return {
        success: false,
        stolenMidi: null,
        activeVoices: this.voices.size,
      };
    }

    if (!this.initializeAudio()) {
      return {
        success: false,
        stolenMidi: null,
        activeVoices: this.voices.size,
      };
    }

    let stolenMidi = null;

    // If the note is already active, replace that voice.
    // Deleting first also refreshes its FIFO position.
    if (this.voices.has(midi)) {
      const existingVoice = this.voices.get(midi);

      this.releaseVoice(existingVoice);
      this.voices.delete(midi);
    }

    // FIFO voice stealing.
    // A Map remembers the order entries were inserted.
    if (this.voices.size >= this.maxVoices) {
      const oldestMidi = this.voices.keys().next().value;

      const oldestVoice = this.voices.get(oldestMidi);

      this.releaseVoice(oldestVoice);
      this.voices.delete(oldestMidi);

      stolenMidi = oldestMidi;
    }

    // Create and insert the newest voice.
    const newVoice = this.createVoice(midi, frequency);

    this.voices.set(midi, newVoice);

    return {
      success: true,
      stolenMidi,
      activeVoices: this.voices.size,
    };
  }

  // Release a particular note.
  noteOff(midi) {
    const voice = this.voices.get(midi);

    if (!voice) {
      return false;
    }

    this.releaseVoice(voice);

    // Remove from the active voice pool immediately.
    this.voices.delete(midi);

    return true;
  }

  // Release all currently active voices.
  stopAll() {
    for (const voice of this.voices.values()) {
      this.releaseVoice(voice);
    }

    this.voices.clear();
  }

  // Number of active voices.
  getActiveVoiceCount() {
    return this.voices.size;
  }

  // Returns MIDI notes in FIFO order.
  getActiveMidiNotes() {
    return Array.from(this.voices.keys());
  }

  // Fully clean up the audio engine.
  dispose() {
    if (this.disposed) {
      return;
    }

    this.disposed = true;

    this.stopAll();

    if (this.ctx) {
      const context = this.ctx;

      // Closing the context silences all remaining audio.
      context.close().catch((error) => {
        console.error("Failed to close AudioContext:", error);
      });
    }

    this.ctx = null;
    this.masterGain = null;
  }
}