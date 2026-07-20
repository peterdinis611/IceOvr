/**
 * Procedural arena audio — snow wind loop + slapshot puck.
 * No external audio files required.
 */

type ArenaAudioApi = {
  ensure: () => Promise<void>;
  startSnow: () => void;
  stopSnow: () => void;
  playPuckShot: () => void;
  setMuted: (muted: boolean) => void;
  getMuted: () => boolean;
};

let ctx: AudioContext | null = null;
let master: GainNode | null = null;
let snowGain: GainNode | null = null;
let snowNodes: AudioNode[] = [];
let muted = true;
let snowRunning = false;

function getCtx(): AudioContext {
  if (!ctx) {
    const AC =
      window.AudioContext ||
      (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    ctx = new AC();
    master = ctx.createGain();
    master.gain.value = 0.7;
    master.connect(ctx.destination);
  }
  return ctx;
}

function noiseBuffer(audio: AudioContext, seconds = 2): AudioBuffer {
  const length = audio.sampleRate * seconds;
  const buffer = audio.createBuffer(1, length, audio.sampleRate);
  const data = buffer.getChannelData(0);
  for (let i = 0; i < length; i++) {
    data[i] = Math.random() * 2 - 1;
  }
  return buffer;
}

function buildSnowLoop(audio: AudioContext, dest: GainNode) {
  // Soft blizzard: filtered noise + slow amplitude sway
  const buffer = noiseBuffer(audio, 3);
  const src = audio.createBufferSource();
  src.buffer = buffer;
  src.loop = true;

  const filter = audio.createBiquadFilter();
  filter.type = "bandpass";
  filter.frequency.value = 680;
  filter.Q.value = 0.55;

  const low = audio.createBiquadFilter();
  low.type = "lowpass";
  low.frequency.value = 1400;

  const lfo = audio.createOscillator();
  lfo.type = "sine";
  lfo.frequency.value = 0.07;
  const lfoGain = audio.createGain();
  lfoGain.gain.value = 0.035;
  lfo.connect(lfoGain);
  lfoGain.connect(dest.gain);

  src.connect(filter);
  filter.connect(low);
  low.connect(dest);

  src.start();
  lfo.start();

  return [src, filter, low, lfo, lfoGain];
}

function playShot(audio: AudioContext, dest: GainNode) {
  const now = audio.currentTime;

  // Stick crack / ice bite — short bright noise
  const crackBuf = noiseBuffer(audio, 0.2);
  const crack = audio.createBufferSource();
  crack.buffer = crackBuf;
  const crackFilter = audio.createBiquadFilter();
  crackFilter.type = "highpass";
  crackFilter.frequency.value = 1800;
  const crackGain = audio.createGain();
  crackGain.gain.setValueAtTime(0.0001, now);
  crackGain.gain.exponentialRampToValueAtTime(0.55, now + 0.008);
  crackGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.12);
  crack.connect(crackFilter);
  crackFilter.connect(crackGain);
  crackGain.connect(dest);
  crack.start(now);
  crack.stop(now + 0.15);

  // Puck thud — low sine
  const thud = audio.createOscillator();
  thud.type = "sine";
  thud.frequency.setValueAtTime(140, now);
  thud.frequency.exponentialRampToValueAtTime(55, now + 0.18);
  const thudGain = audio.createGain();
  thudGain.gain.setValueAtTime(0.0001, now);
  thudGain.gain.exponentialRampToValueAtTime(0.7, now + 0.01);
  thudGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.28);
  thud.connect(thudGain);
  thudGain.connect(dest);
  thud.start(now);
  thud.stop(now + 0.3);

  // Whoosh after release — mid noise sweep
  const whooshBuf = noiseBuffer(audio, 0.35);
  const whoosh = audio.createBufferSource();
  whoosh.buffer = whooshBuf;
  const whooshFilter = audio.createBiquadFilter();
  whooshFilter.type = "bandpass";
  whooshFilter.frequency.setValueAtTime(900, now + 0.02);
  whooshFilter.frequency.exponentialRampToValueAtTime(2200, now + 0.22);
  whooshFilter.Q.value = 1.2;
  const whooshGain = audio.createGain();
  whooshGain.gain.setValueAtTime(0.0001, now + 0.02);
  whooshGain.gain.exponentialRampToValueAtTime(0.28, now + 0.05);
  whooshGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.32);
  whoosh.connect(whooshFilter);
  whooshFilter.connect(whooshGain);
  whooshGain.connect(dest);
  whoosh.start(now + 0.02);
  whoosh.stop(now + 0.35);

  // Boards / glass ping
  const ping = audio.createOscillator();
  ping.type = "triangle";
  ping.frequency.setValueAtTime(880, now + 0.14);
  ping.frequency.exponentialRampToValueAtTime(420, now + 0.35);
  const pingGain = audio.createGain();
  pingGain.gain.setValueAtTime(0.0001, now + 0.14);
  pingGain.gain.exponentialRampToValueAtTime(0.18, now + 0.16);
  pingGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.4);
  ping.connect(pingGain);
  pingGain.connect(dest);
  ping.start(now + 0.14);
  ping.stop(now + 0.42);
}

export const arenaAudio: ArenaAudioApi = {
  async ensure() {
    const audio = getCtx();
    if (audio.state === "suspended") {
      await audio.resume();
    }
  },

  startSnow() {
    if (muted || snowRunning || !master) return;
    const audio = getCtx();
    snowGain = audio.createGain();
    snowGain.gain.value = 0.12;
    snowGain.connect(master);
    snowNodes = buildSnowLoop(audio, snowGain);
    snowRunning = true;
  },

  stopSnow() {
    for (const node of snowNodes) {
      try {
        if ("stop" in node && typeof (node as AudioScheduledSourceNode).stop === "function") {
          (node as AudioScheduledSourceNode).stop();
        }
        node.disconnect();
      } catch {
        // already stopped
      }
    }
    snowNodes = [];
    snowGain?.disconnect();
    snowGain = null;
    snowRunning = false;
  },

  playPuckShot() {
    if (muted || !master) return;
    const audio = getCtx();
    const shotBus = audio.createGain();
    shotBus.gain.value = 0.85;
    shotBus.connect(master);
    playShot(audio, shotBus);
  },

  setMuted(next) {
    muted = next;
    if (muted) {
      arenaAudio.stopSnow();
      if (master) master.gain.value = 0;
    } else {
      if (master) master.gain.value = 0.7;
      void arenaAudio.ensure().then(() => arenaAudio.startSnow());
    }
  },

  getMuted() {
    return muted;
  },
};
