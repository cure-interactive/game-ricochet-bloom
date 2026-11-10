import {assetURL} from './asset.js?v=e72688f45fcfcc2089603f0a550e085481522963bf75007bbdd9a515622da561';
// OS media presentation for the live synthesizer. The silent media source only
// supplies the HTMLMediaElement session required by some mobile browsers.
export function mediaCarrier() {
  const rate = 8000, samples = rate * 8, bytes = new ArrayBuffer(44 + samples * 2), view = new DataView(bytes);
  const text = (at, value) => [...value].forEach((char, i) => view.setUint8(at + i, char.charCodeAt(0)));
  text(0, 'RIFF'); view.setUint32(4, bytes.byteLength - 8, true); text(8, 'WAVE'); text(12, 'fmt ');
  view.setUint32(16, 16, true); view.setUint16(20, 1, true); view.setUint16(22, 1, true);
  view.setUint32(24, rate, true); view.setUint32(28, rate * 2, true); view.setUint16(32, 2, true); view.setUint16(34, 16, true);
  text(36, 'data'); view.setUint32(40, samples * 2, true); return bytes;
}
export class PoolMedia {
  constructor(env = globalThis) { this.env = env; this.session = env.navigator?.mediaSession; this.state = 'none'; this.ready = false; this.pending = false; this.failed = false; this.enabled = false; this.key = ''; }
  describe(seed) {
    if (!this.session || !this.env.MediaMetadata || this.key === seed) return;
    try {
      this.artwork = [512, 256].map(size => ({ src: new URL(assetURL(`./artwork/pool-${size}.png`), this.env.location.href).href, sizes: `${size}x${size}`, type: 'image/png' }));
      this.session.metadata = new this.env.MediaMetadata({ title: `${seed} · Ricochet Bloom`, artist: 'Cure Interactive', album: 'A living light pool', artwork: this.artwork }); this.key = seed;
    } catch { /* Optional metadata must not affect the synthesizer. */ }
  }
  actions(play, pause) {
    if (!this.session) return;
    for (const [action, handler] of [['play', play], ['pause', pause], ['stop', pause]]) {
      try { this.session.setActionHandler(action, handler); } catch { /* Some browsers support only a subset. */ }
    }
  }
  prepare(context, destination) {
    if (!this.session || this.element || this.failed) return;
    try {
      const element = this.env.document.createElement('audio');
      element.loop = true; element.preload = 'auto'; element.setAttribute('playsinline', '');
      this.url = this.env.URL.createObjectURL(new this.env.Blob([mediaCarrier()], { type: 'audio/wav' }));
      element.src = this.url;
      // Feed silence into the existing graph; never duplicate or delay game audio.
      this.source = context.createMediaElementSource(element); this.source.connect(destination);
      this.element = element;
    } catch { this.failed = true; if (this.url) this.env.URL.revokeObjectURL(this.url); }
  }
  activate() {
    if (!this.element || this.pending || !this.enabled || !this.element.paused) return;
    this.pending = true;
    try {
      Promise.resolve(this.element.play()).then(() => {
        this.ready = true; this.failed = false;
        if (!this.enabled) this.element.pause();
      }).catch(() => { this.failed = true; }).finally(() => { this.pending = false; });
    } catch { this.pending = false; this.failed = true; }
  }
  update(playing) {
    this.enabled = !!playing;
    if (!playing) this.element?.pause();
    else if (!this.failed) this.activate();
    const state = playing ? 'playing' : this.key ? 'paused' : 'none';
    if (this.session && state !== this.state) {
      try { this.session.playbackState = state; this.state = state; } catch { /* Unsupported state reporting. */ }
    }
  }
  retry() { this.failed = false; this.activate(); }
  dispose() {
    this.enabled = false; this.element?.pause(); this.source?.disconnect();
    if (this.element) { this.element.removeAttribute('src'); this.element.load(); }
    if (this.url) this.env.URL.revokeObjectURL(this.url);
    if (this.session) { try { this.session.metadata = null; this.session.playbackState = 'none'; } catch {} }
    this.state = 'none';
  }
}
