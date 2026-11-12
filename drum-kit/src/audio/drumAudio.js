
let context = null;
let noiseBuffer = null;

function getContext() {
  const AudioContextClass =
    window.AudioContext || window.webkitAudioContext;

  if (!AudioContextClass) {
    throw new Error(
      "This browser does not support Web Audio."
    );
  }

  if (!context || context.state === "closed") {
    context = new AudioContextClass();
    noiseBuffer = null;
  }

  return context;
}

function getNoiseBuffer(ctx) {
  if (noiseBuffer) return noiseBuffer;

  const buffer = ctx.createBuffer(
    1,
    Math.ceil(ctx.sampleRate),
    ctx.sampleRate
  );

  const samples = buffer.getChannelData(0);

  for (let i = 0; i < samples.length; i += 1) {
    samples[i] = Math.random() * 2 - 1;
  }

  noiseBuffer = buffer;
  return buffer;
}

function tone(
  ctx,
  {
    frequency,
    endFrequency,
    duration,
    volume = 0.5,
    type = "sine",
  }
) {
  const now = ctx.currentTime;
  const oscillator = ctx.createOscillator();
  const gain = ctx.createGain();

  oscillator.type = type;
  oscillator.frequency.setValueAtTime(frequency, now);
  oscillator.frequency.exponentialRampToValueAtTime(
    Math.max(20, endFrequency),
    now + duration
  );

  gain.gain.setValueAtTime(
    Math.max(0.001, volume),
    now
  );
  gain.gain.exponentialRampToValueAtTime(
    0.001,
    now + duration
  );

  oscillator.connect(gain).connect(ctx.destination);
  oscillator.start(now);
  oscillator.stop(now + duration + 0.01);

  oscillator.onended = () => {
    oscillator.disconnect();
    gain.disconnect();
  };
}

function noise(
  ctx,
  {
    duration,
    volume = 0.3,
    filterType = "highpass",
    cutoff = 1200,
    delay = 0,
  }
) {
  const start = ctx.currentTime + delay;
  const source = ctx.createBufferSource();
  const filter = ctx.createBiquadFilter();
  const gain = ctx.createGain();

  source.buffer = getNoiseBuffer(ctx);
  filter.type = filterType;
  filter.frequency.setValueAtTime(cutoff, start);

  gain.gain.setValueAtTime(
    Math.max(0.001, volume),
    start
  );
  gain.gain.exponentialRampToValueAtTime(
    0.001,
    start + duration
  );

  source
    .connect(filter)
    .connect(gain)
    .connect(ctx.destination);

  source.start(start);
  source.stop(start + duration + 0.01);

  source.onended = () => {
    source.disconnect();
    filter.disconnect();
    gain.disconnect();
  };
}

const soundDefinitions = {
  kick(ctx) {
    tone(ctx, {
      frequency: 160,
      endFrequency: 45,
      duration: 0.35,
      volume: 0.8,
    });
  },

  snare(ctx) {
    noise(ctx, {
      duration: 0.19,
      volume: 0.38,
      cutoff: 1300,
    });

    tone(ctx, {
      frequency: 180,
      endFrequency: 105,
      duration: 0.12,
      volume: 0.28,
    });
  },

  "closed-hat"(ctx) {
    noise(ctx, {
      duration: 0.07,
      volume: 0.2,
      cutoff: 7500,
    });
  },

  "open-hat"(ctx) {
    noise(ctx, {
      duration: 0.55,
      volume: 0.16,
      cutoff: 6500,
    });
  },

  tom(ctx) {
    tone(ctx, {
      frequency: 250,
      endFrequency: 92,
      duration: 0.38,
      volume: 0.58,
    });
  },

  clap(ctx) {
    [0, 0.018, 0.041].forEach((delay) => {
      noise(ctx, {
        duration: 0.085,
        volume: 0.21,
        cutoff: 1700,
        delay,
      });
    });
  },

  crash(ctx) {
    noise(ctx, {
      duration: 0.95,
      volume: 0.22,
      cutoff: 4200,
    });

    tone(ctx, {
      frequency: 620,
      endFrequency: 410,
      duration: 0.28,
      volume: 0.05,
      type: "triangle",
    });
  },
};

export async function playDrum(drumId) {
  const renderSound = soundDefinitions[drumId];

  if (!renderSound) {
    throw new Error(`Unknown drum: ${drumId}`);
  }

  const ctx = getContext();

  if (ctx.state !== "running") {
    await ctx.resume();
  }

  if (ctx.state !== "running") {
    throw new Error(
      "Audio is blocked. Interact with the page and try again."
    );
  }

  renderSound(ctx);
}

export async function closeDrumAudio() {
  if (context && context.state !== "closed") {
    await context.close();
  }

  context = null;
  noiseBuffer = null;
}
