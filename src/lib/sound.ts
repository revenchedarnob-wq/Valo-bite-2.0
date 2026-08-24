/**
 * lib/sound — tactile interaction audio for AETHER SPATIAL.
 *
 * `playHapticClick()` produces a soft, filtered "quiet luxury" click using the
 * Web Audio API (no assets required) and fires a physical haptic pulse via the
 * Vibration API on supporting devices. The AudioContext is created lazily on
 * the first user gesture so autoplay policies are never violated.
 */

let ctx: AudioContext | null = null;
let noiseBuffer: AudioBuffer | null = null;
let swooshBuffer: AudioBuffer | null = null;

/* ——— Global sound switcher state (driven by the Dock toggle) ——— */
let enabled = true;
const listeners = new Set<(on: boolean) => void>();

export function setHapticsEnabled(on: boolean): void {
  enabled = on;
  if (!on) stopAmbientTelemetry();
  listeners.forEach((listener) => listener(on));
}

export function isHapticsEnabled(): boolean {
  return enabled;
}

export function subscribeHaptics(listener: (on: boolean) => void): () => void {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

function vibrate(pattern: number | number[]): void {
  if (typeof navigator !== "undefined" && typeof navigator.vibrate === "function") {
    navigator.vibrate(pattern);
  }
}

function getAudioContext(): AudioContext | null {
  if (typeof window === "undefined") return null;

  let instance = ctx;
  if (!instance) {
    const w = window as unknown as {
      AudioContext?: typeof AudioContext;
      webkitAudioContext?: typeof AudioContext;
    };
    const Ctor = w.AudioContext ?? w.webkitAudioContext;
    if (!Ctor) return null;
    instance = new Ctor();
    ctx = instance;
  }
  if (instance.state === "suspended") void instance.resume();
  return instance;
}

function getNoiseBuffer(context: AudioContext): AudioBuffer {
  if (!noiseBuffer) {
    const length = Math.floor(context.sampleRate * 0.05);
    noiseBuffer = context.createBuffer(1, length, context.sampleRate);
    const data = noiseBuffer.getChannelData(0);
    for (let i = 0; i < length; i++) {
      data[i] = (Math.random() * 2 - 1) * (1 - i / length);
    }
  }
  return noiseBuffer;
}

export function playHapticClick(): void {
  if (!enabled) return;
  const context = getAudioContext();
  if (context) {
    const now = context.currentTime;

    // — Body: a short wooden "tick" from a pitched sine blip.
    const osc = context.createOscillator();
    const oscGain = context.createGain();
    osc.type = "sine";
    osc.frequency.setValueAtTime(1850, now);
    osc.frequency.exponentialRampToValueAtTime(620, now + 0.06);
    oscGain.gain.setValueAtTime(0.0001, now);
    oscGain.gain.exponentialRampToValueAtTime(0.12, now + 0.004);
    oscGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.09);
    osc.connect(oscGain).connect(context.destination);
    osc.start(now);
    osc.stop(now + 0.1);

    // — Air: a whisper of filtered noise so it feels material, not digital.
    const noise = context.createBufferSource();
    noise.buffer = getNoiseBuffer(context);
    const filter = context.createBiquadFilter();
    filter.type = "bandpass";
    filter.frequency.value = 2400;
    filter.Q.value = 0.9;
    const noiseGain = context.createGain();
    noiseGain.gain.setValueAtTime(0.06, now);
    noiseGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.05);
    noise.connect(filter).connect(noiseGain).connect(context.destination);
    noise.start(now);
    noise.stop(now + 0.06);
  }

  // — Touch: physical haptic pulse where supported.
  vibrate(8);
}

/**
 * playHapticFlick — a lighter, higher "tick" for filter tabs and
 * secondary gestures. Half the weight of the primary click.
 */
export function playHapticFlick(): void {
  if (!enabled) return;
  const context = getAudioContext();
  if (context) {
    const now = context.currentTime;

    const osc = context.createOscillator();
    const gain = context.createGain();
    osc.type = "triangle";
    osc.frequency.setValueAtTime(2400, now);
    osc.frequency.exponentialRampToValueAtTime(980, now + 0.05);
    gain.gain.setValueAtTime(0.0001, now);
    gain.gain.exponentialRampToValueAtTime(0.08, now + 0.003);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.07);
    osc.connect(gain).connect(context.destination);
    osc.start(now);
    osc.stop(now + 0.08);
  }
  vibrate(6);
}

/**
 * playHapticSwoosh — a filtered noise sweep for large surface movements
 * such as the commission drawer sliding in and out.
 */
export function playHapticSwoosh(): void {
  if (!enabled) return;
  const context = getAudioContext();
  if (context) {
    if (!swooshBuffer) {
      const length = Math.floor(context.sampleRate * 0.35);
      swooshBuffer = context.createBuffer(1, length, context.sampleRate);
      const data = swooshBuffer.getChannelData(0);
      for (let i = 0; i < length; i++) data[i] = Math.random() * 2 - 1;
    }
    const now = context.currentTime;

    const noise = context.createBufferSource();
    noise.buffer = swooshBuffer;
    const filter = context.createBiquadFilter();
    filter.type = "bandpass";
    filter.Q.value = 1.1;
    filter.frequency.setValueAtTime(320, now);
    filter.frequency.exponentialRampToValueAtTime(2600, now + 0.22);
    const gain = context.createGain();
    gain.gain.setValueAtTime(0.0001, now);
    gain.gain.exponentialRampToValueAtTime(0.13, now + 0.1);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.32);
    noise.connect(filter).connect(gain).connect(context.destination);
    noise.start(now);
    noise.stop(now + 0.34);
  }
  vibrate([6, 4, 10]);
}

/**
 * playHapticSuccess — two soft ascending tones confirming an action
 * (e.g. an inquiry submitted through the commission drawer).
 */
export function playHapticSuccess(): void {
  if (!enabled) return;
  const context = getAudioContext();
  if (context) {
    const notes = [659.25, 987.77]; // E5 → B5
    notes.forEach((freq, i) => {
      const start = context.currentTime + i * 0.11;
      const osc = context.createOscillator();
      const gain = context.createGain();
      osc.type = "sine";
      osc.frequency.setValueAtTime(freq, start);
      gain.gain.setValueAtTime(0.0001, start);
      gain.gain.exponentialRampToValueAtTime(0.1, start + 0.015);
      gain.gain.exponentialRampToValueAtTime(0.0001, start + 0.42);
      osc.connect(gain).connect(context.destination);
      osc.start(start);
      osc.stop(start + 0.45);
    });
  }
  vibrate([10, 30, 14]);
}

/* ——— Hover blip: whisper-quiet cursor feedback ————————————————————— */
let lastBlipAt = 0;

/**
 * playHoverBlip — an almost subliminal sine blip with a touch of random
 * pitch so repeated hovers never sound mechanical. Internally throttled
 * to at most one blip every 130 ms.
 */
export function playHoverBlip(): void {
  if (!enabled) return;
  const now = performance.now();
  if (now - lastBlipAt < 130) return;
  lastBlipAt = now;
  const context = getAudioContext();
  if (!context) return;
  const t = context.currentTime;
  const osc = context.createOscillator();
  const gain = context.createGain();
  osc.type = "sine";
  osc.frequency.setValueAtTime(1450 + Math.random() * 550, t);
  gain.gain.setValueAtTime(0.0001, t);
  gain.gain.exponentialRampToValueAtTime(0.026, t + 0.006);
  gain.gain.exponentialRampToValueAtTime(0.0001, t + 0.055);
  osc.connect(gain).connect(context.destination);
  osc.start(t);
  osc.stop(t + 0.07);
}

/**
 * playHapticTick — a dry, higher woodblock tick for light selections:
 * nav links, filter pills, small toggles. Distinct from the fuller click.
 */
export function playHapticTick(): void {
  if (!enabled) return;
  const context = getAudioContext();
  if (context) {
    const t = context.currentTime;
    [2350, 3650].forEach((freq, i) => {
      const osc = context.createOscillator();
      const gain = context.createGain();
      osc.type = "triangle";
      osc.frequency.setValueAtTime(freq, t);
      gain.gain.setValueAtTime(i === 0 ? 0.07 : 0.03, t);
      gain.gain.exponentialRampToValueAtTime(0.0001, t + 0.045 + i * 0.015);
      osc.connect(gain).connect(context.destination);
      osc.start(t);
      osc.stop(t + 0.07);
    });
  }
  vibrate(4);
}

/**
 * playHapticChime — a soft glassy bell with two shimmering harmonics,
 * reserved for arrivals: the commission drawer opening, confirmations.
 */
export function playHapticChime(): void {
  if (!enabled) return;
  const context = getAudioContext();
  if (context) {
    const t = context.currentTime;
    // Inharmonic partials give it a "struck glass" character.
    const partials: Array<[number, number, number]> = [
      [880, 0.055, 1.1],
      [1760, 0.02, 0.7],
      [2640, 0.008, 0.45],
    ];
    partials.forEach(([freq, level, decay]) => {
      const osc = context.createOscillator();
      const gain = context.createGain();
      osc.type = "sine";
      osc.frequency.setValueAtTime(freq, t);
      gain.gain.setValueAtTime(0.0001, t);
      gain.gain.exponentialRampToValueAtTime(level, t + 0.01);
      gain.gain.exponentialRampToValueAtTime(0.0001, t + decay);
      osc.connect(gain).connect(context.destination);
      osc.start(t);
      osc.stop(t + decay + 0.05);
    });
  }
  vibrate([5, 20, 6]);
}

/**
 * playHapticThud — a low warm landing: drawer closing, returning to top.
 * A descending sine drop softened by a breath of low-passed noise.
 */
export function playHapticThud(): void {
  if (!enabled) return;
  const context = getAudioContext();
  if (context) {
    const t = context.currentTime;
    const osc = context.createOscillator();
    const gain = context.createGain();
    osc.type = "sine";
    osc.frequency.setValueAtTime(170, t);
    osc.frequency.exponentialRampToValueAtTime(64, t + 0.16);
    gain.gain.setValueAtTime(0.0001, t);
    gain.gain.exponentialRampToValueAtTime(0.16, t + 0.012);
    gain.gain.exponentialRampToValueAtTime(0.0001, t + 0.22);
    osc.connect(gain).connect(context.destination);
    osc.start(t);
    osc.stop(t + 0.24);

    // Soft air cushion under the thump.
    const noise = context.createBufferSource();
    noise.buffer = getNoiseBuffer(context);
    const lowpass = context.createBiquadFilter();
    lowpass.type = "lowpass";
    lowpass.frequency.value = 420;
    const noiseGain = context.createGain();
    noiseGain.gain.setValueAtTime(0.05, t);
    noiseGain.gain.exponentialRampToValueAtTime(0.0001, t + 0.09);
    noise.connect(lowpass).connect(noiseGain).connect(context.destination);
    noise.start(t);
    noise.stop(t + 0.12);
  }
  vibrate([8]);
}

/*
 * Ambient telemetry engine — a quiet three-voice sine pad routed through
 * an AnalyserNode so the Telemetry waveform pulses with real Web Audio
 * frequency data instead of fake animation.
 */
type AmbientEngine = { stop: () => void };
let ambient: AmbientEngine | null = null;

export function startAmbientTelemetry(): AnalyserNode | null {
  if (!enabled) return null;
  const context = getAudioContext();
  if (!context) return null;
  stopAmbientTelemetry();

  const analyser = context.createAnalyser();
  analyser.fftSize = 256;
  analyser.smoothingTimeConstant = 0.82;

  const master = context.createGain();
  master.gain.setValueAtTime(0.0001, context.currentTime);
  master.gain.exponentialRampToValueAtTime(0.018, context.currentTime + 1.4);
  master.connect(analyser);
  analyser.connect(context.destination);

  const VOICES: Array<[number, number, number]> = [
    [110, 0.5, 0.07],
    [164.81, 0.28, 0.11],
    [220, 0.22, 0.15],
  ];
  const nodes = VOICES.map(([freq, level, lfoRate]) => {
    const osc = context.createOscillator();
    const voiceGain = context.createGain();
    osc.type = "sine";
    osc.frequency.value = freq;
    voiceGain.gain.value = level;

    // Slow per-voice breathing so the waveform never sits still.
    const lfo = context.createOscillator();
    const lfoGain = context.createGain();
    lfo.frequency.value = lfoRate;
    lfoGain.gain.value = 0.12;
    lfo.connect(lfoGain).connect(voiceGain.gain);

    osc.connect(voiceGain).connect(master);
    osc.start();
    lfo.start();
    return { osc, lfo };
  });

  ambient = {
    stop: () => {
      const t = context.currentTime;
      try {
        master.gain.cancelScheduledValues(t);
        master.gain.setValueAtTime(Math.max(master.gain.value, 0.0001), t);
        master.gain.exponentialRampToValueAtTime(0.0001, t + 0.35);
      } catch {
        /* noop */
      }
      window.setTimeout(() => {
        nodes.forEach(({ osc, lfo }) => {
          try {
            osc.stop();
            lfo.stop();
          } catch {
            /* noop */
          }
        });
        try {
          master.disconnect();
          analyser.disconnect();
        } catch {
          /* noop */
        }
      }, 420);
    },
  };
  return analyser;
}

export function stopAmbientTelemetry(): void {
  ambient?.stop();
  ambient = null;
}
