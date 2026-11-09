import {instrumentNote,instrumentPercussion} from './instrument.js';
// Original procedural effects. No recordings or external audio requests.
import { PoolMedia } from './media.js';
import { CHORDS, musicCreate, musicStrike, musicBloom, musicLaunch, musicFinish, musicNextBar, musicAccent, jellyRole } from './music.js';
const SCALE = [261.63, 293.66, 329.63, 392, 440];
const frequency = midi => 440 * 2 ** ((midi - 69) / 12);
export class PoolSound {
  constructor() { this.media = new PoolMedia(); this.context = null; this.volume = 1; this.ambience = 1; this.isMuted = false; this.isPaused = false; this.voiceCount = 0; this.eventCount = 0; this.music = musicCreate(); this.phraseVoices = new Set(); this.musicQueue = []; this.phraseEnd = 0; this.activeChord = null; this.isMusicPlaying = false; this.passage = 0; this.previousPitch = 67; this.section = 'Quiet pool'; this.stage = 0; this.flow = 0; this.duckUntil = 0; this.lastMix = -1; this.playbackQueue = []; this.playbackLights = new Map(); this.playbackCount = 0; this.lastPlayback = null; this.replyUntil = 0; }
  get bloomCount() { return this.music.blooms; }
  get harmony() { const chord = this.activeChord ?? this.music.history.at(-1)?.chord; return chord === undefined || chord === null ? null : CHORDS[chord]; }
  musicSave() { return musicCreate(this.music, this.bloomCount); }
  musicRestore(saved, blooms, plucks = null) { this.phraseClear(); this.music = musicCreate(saved, blooms, plucks); this.activeChord = null; this.passage = 0; this.previousPitch = 67; this.stage = 0; this.section = 'Quiet pool'; }
  async unlockAsync() {
    if (this.isMuted) return false;
    // Music playback uses the media route on supporting iOS versions, including
    // when the ringer is silent. The optional API must never block other browsers.
    try { if (globalThis.navigator?.audioSession) globalThis.navigator.audioSession.type = 'playback'; } catch { /* Unsupported session policy: retain ordinary Web Audio. */ }
    this.context ||= new (window.AudioContext || window.webkitAudioContext)();
    const audioContext = this.context;
    // Call resume and start a source synchronously inside the tap handler. Safari
    // also reports "interrupted" after app switches, calls, or screen locking.
    const resuming = audioContext.state !== 'running' ? audioContext.resume() : Promise.resolve();
    const primer = audioContext.createBufferSource();
    primer.buffer = audioContext.createBuffer(1, 1, audioContext.sampleRate);
    primer.connect(audioContext.destination); primer.onended = () => primer.disconnect(); primer.start();
    if (!this.master) {
      const context = this.context; this.master = context.createGain(); this.master.gain.value = this.isMuted ? 0 : this.volume * .48;
      const compressor = context.createDynamicsCompressor(); compressor.threshold.value = -18; compressor.ratio.value = 5; this.master.connect(compressor); compressor.connect(context.destination);
      this.delay = context.createDelay(.6); this.delay.delayTime.value = .21;
      const feedback = context.createGain(); feedback.gain.value = .19; const wet = context.createGain(); wet.gain.value = .24;
      this.delay.connect(feedback); feedback.connect(this.delay); this.delay.connect(wet); wet.connect(this.master);
      this.musicInput = context.createGain(); this.musicOutput = context.createGain(); this.musicOutput.gain.value = 0;
      const lowpass = context.createBiquadFilter(); lowpass.type = 'lowpass'; lowpass.frequency.value = 2200; lowpass.Q.value = .5;
      const highpass = context.createBiquadFilter(); highpass.type = 'highpass'; highpass.frequency.value = 70;
      this.musicInput.connect(lowpass); lowpass.connect(highpass); highpass.connect(this.musicOutput); this.musicOutput.connect(this.master);
      // Original stereo impulse: a finite diffuse tail, with no feedback buildup.
      const reverb = context.createConvolver(), impulse = context.createBuffer(2, Math.ceil(context.sampleRate * 3), context.sampleRate);
      let seed = 8128;
      for (let channel = 0; channel < 2; channel++) {
        const samples = impulse.getChannelData(channel); let smooth = 0;
        for (let i = 0; i < samples.length; i++) { seed = (Math.imul(seed, 1664525) + 1013904223) >>> 0; smooth = smooth * .7 + (seed / 4294967296 * 2 - 1) * .3; samples[i] = smooth * Math.exp(-i / (context.sampleRate * .55)) * Math.min(1, i / (context.sampleRate * .025)); }
      }
      this.percussionNoise = context.createBuffer(1, Math.ceil(context.sampleRate * .15), context.sampleRate);
      const noise = this.percussionNoise.getChannelData(0);
      for (let i = 0; i < noise.length; i++) { seed = (Math.imul(seed, 1664525) + 1013904223) >>> 0; noise[i] = seed / 2147483648 - 1; }
      reverb.buffer = impulse; const room = context.createGain(); room.gain.value = .22;
      highpass.connect(reverb); reverb.connect(room); room.connect(this.musicOutput);
    }
    this.media.prepare(audioContext, this.master);
    this.media.update(this.isMusicPlaying && !this.isPaused && this.volume > 0 && this.ambience > 0);
    this.media.retry();
    await resuming;
    this.musicUpdate();
    return this.context.state === 'running';
  }
  harmonySet(blooms) {
    const count = Number.isSafeInteger(blooms) && blooms > 0 ? blooms : 0;
    if (count === this.bloomCount && count !== 0) return;
    this.musicRestore(null, count);
  }
  phraseClear() {
    this.musicQueue = []; this.phraseEnd = 0; this.activeChord = null; this.playbackQueue = []; this.playbackLights.clear(); this.lastPlayback = null; this.replyUntil = 0;
    if (!this.context) return;
    const now = this.context.currentTime;
    for (const voice of this.phraseVoices) {
      const { oscillator, gain } = voice;
      gain.gain.cancelScheduledValues(now); gain.gain.setTargetAtTime(0, now, .01);
      oscillator.stop(now + .05);
      this.phraseVoices.delete(voice);
    }
  }
  musicStart() { this.isMusicPlaying = true; this.musicUpdate(); }
  ambienceSet(value) { this.ambience = Number.isFinite(value) ? Math.max(0, Math.min(1, value)) : 1; if (!this.ambience) this.phraseClear(); this.mixUpdate(); }
  mixUpdate() {
    this.media.update(!!this.context && this.context.state === 'running' && this.isMusicPlaying && !this.isMuted && !this.isPaused && this.volume > 0 && this.ambience > 0);
    if (!this.musicOutput) return;
    const now = this.context.currentTime;
    const level = this.isMuted || this.isPaused || !this.isMusicPlaying ? 0 : this.ambience * (now < this.duckUntil ? .6 : 1);
    if (level !== this.lastMix) { this.musicOutput.gain.setTargetAtTime(level, now, level ? .35 : .04); this.lastMix = level; }
  }
  musicUpdate(flow = this.flow) {
    this.flow = Math.max(0, Math.min(1, Number.isFinite(flow) ? flow : 0)); this.mixUpdate();
    if (!this.isMusicPlaying || !this.context || this.context.state !== 'running' || this.isMuted || this.isPaused || !this.ambience) { this.playbackQueue = []; this.playbackLights.clear(); this.lastPlayback = null; return; }
    const now = this.context.currentTime;
    if (this.phraseEnd < now - 1) { this.musicQueue = []; this.playbackQueue = []; this.playbackLights.clear(); this.phraseEnd = now + .08; }
    if (this.phraseEnd <= now + .2) {
      const score = musicNextBar(this.music, this.flow, this.previousPitch), start = Math.max(now + .04, this.phraseEnd);
      if (score.isReply) {
        this.replyUntil = start + score.replyBars * score.duration;
      }
      this.passage = Math.floor(Math.max(0, this.music.bar - 1 - this.music.formStart) / 4) + 1; this.stage = score.stage;
      this.previousPitch = score.nextPitch; this.section = score.section;
      this.musicQueue.push(...score.events.map(event => ({ ...event, at: event.at + start })));
      this.musicQueue.sort((a, b) => a.at - b.at); this.phraseEnd = start + score.duration;
    }
    while (this.musicQueue.length && this.musicQueue[0].at <= now + .12) {
      const event = this.musicQueue.shift();
      if (event.chord !== undefined) { this.activeChord = event.chord; continue; }
      if (event.at < now - .2) continue; // A stalled/background frame never dumps overdue notes.
      this.musicVoice(event);
    }
    // Audio is scheduled ahead; visual feedback waits for the actual audio clock.
    while (this.playbackQueue.length && this.playbackQueue[0].at <= now) {
      const event = this.playbackQueue.shift();
      if (event.at < now - .2) continue;
      this.playbackLights.set(event.sourceId, { ...event, until: event.at + .7 });
      this.lastPlayback = event; this.playbackCount++;
    }
    for (const [id, event] of this.playbackLights) if (event.until <= now) this.playbackLights.delete(id);
  }
  musicVoice(event) { instrumentNote(this,event); }
  musicPercussion(event) { instrumentPercussion(this,event); }
  pauseSet(value) { this.isPaused = value; if (value) this.phraseClear(); this.mixUpdate(); }
  notePitch(tone) { return this.harmony ? frequency(this.harmony.notes[tone % 5]) : SCALE[tone % 5]; }
  settingsSet(volume, isMuted) { this.volume = volume; this.isMuted = isMuted; if (isMuted) this.phraseClear(); if (this.master) this.master.gain.setTargetAtTime(isMuted ? 0 : volume * .48, this.context.currentTime, .03); this.mixUpdate(); }
  tone(frequency, end, duration, level, pan = 0, offset = 0, type = 'sine', echo = false, phrase = false) {
    if (!this.context || this.context.state !== 'running' || this.isMuted || this.isPaused || this.voiceCount >= 46) return;
    const context = this.context, start = context.currentTime + offset, oscillator = context.createOscillator(), gain = context.createGain(), stereo = context.createStereoPanner();
    oscillator.type = type; oscillator.frequency.setValueAtTime(frequency, start); oscillator.frequency.exponentialRampToValueAtTime(Math.max(20, end), start + duration);
    gain.gain.setValueAtTime(.0001, start); gain.gain.exponentialRampToValueAtTime(Math.max(.001, level), start + .008); gain.gain.exponentialRampToValueAtTime(.0001, start + duration);
    stereo.pan.value = Math.max(-.85, Math.min(.85, pan)); oscillator.connect(gain); gain.connect(stereo); stereo.connect(this.master); if (echo) stereo.connect(this.delay);
    const voice = { oscillator, gain, start }; if (phrase) this.phraseVoices.add(voice);
    oscillator.start(start); oscillator.stop(start + duration + .02); this.voiceCount++;
    oscillator.onended = () => { oscillator.disconnect(); gain.disconnect(); stereo.disconnect(); this.phraseVoices.delete(voice); this.voiceCount--; };
  }
  eventPlay(event) {
    if (event.type === 'launch') musicLaunch(this.music);
    if (['rest', 'win', 'over'].includes(event.type)) musicFinish(this.music);
    if (event.type === 'note') musicStrike(this.music, event.tone, event.tick, event.chain, event.id, (this.harmony?.notes[event.tone % 5] ?? [60, 62, 64, 67, 69][event.tone % 5]) + (event.chain > 3 ? 12 : 0), event.speed);
    if (event.type === 'bloom') {musicBloom(this.music);if(event.banks>0)musicAccent(this.music);}
    if(event.type==='objective')musicAccent(this.music);
    if (!this.context || this.isMuted) return;
    this.eventCount++; const pan = ((event.x ?? 480) / 960 - .5) * 1.5;
    if (event.type === 'launch') { this.tone(130, 520, .13, .25, pan); this.tone(65, 38, .18, .25, pan); }
    if (event.type === 'wall') this.tone(190 + Math.min(300, event.speed), 85, .16, .1, pan);
    if (event.type === 'impact') this.tone(event.bubble ? 120 : 100 + Math.min(200, event.speed), event.bubble ? 42 : 55, event.bubble ? .18 : .095, Math.min(.15, event.speed / 2500), pan);
    if (event.type === 'note') { const gain = event.seedId < 0 ? .65 : 1; const pitch = this.notePitch(event.tone) * (jellyRole(event.id)==='bass'?.5:event.chain>3?2:1); this.tone(pitch * 2.2, pitch, .075, .23 * gain, pan); this.tone(pitch, pitch * .998, .65, .24 * gain, pan, .025, 'sine', true); this.tone(pitch * 2, pitch * 2, .32, .055 * gain, pan, .03, 'triangle', true); }
    if (event.type === 'note' || event.type === 'launch') { this.duckUntil = this.context.currentTime + .8; this.mixUpdate(); }
    if (event.type === 'power') {
      const degrees = ({ ripple: [0, 2, 3], attract: [3, 2, 0], vortex: [0, 3, 2, 3], stasis: [3, 0], comet: [0, 2, 3, 5], swap: [0, 3, 0, 2], magnet: [5, 3, 2, 0], lightning: [], impact: [0, 0, 3], tether: [0, 2, 0], split: [0, 3, 5], bubble: [0, 3, 2], portal: [0, 5], echo: [3, 0, 3], slingshot: [0, 2], drunk: [0, 3, 2, 5, 3] })[event.kind] || [0, 2, 3];
      degrees.forEach((degree, index) => { const pitch = this.notePitch(degree); this.tone(pitch, pitch, .65, .075, pan, index * .09, 'sine', true); });
      this.duckUntil = this.context.currentTime + .8; this.mixUpdate();
    }
    if (event.type === 'lightning') {
      const pitch = this.notePitch([0, 2, 3][event.index - 1] ?? 0);
      this.tone(pitch * 2, pitch, .12, .07, pan, 0, 'triangle', true);
      this.tone(pitch, pitch, .45, .065, pan, .015, 'sine', true);
    }
    if (event.type === 'tether') { const pitch = this.notePitch(event.tone); this.tone(pitch, pitch, .38, .035, pan, 0, 'triangle', true); }
    if (event.type === 'portal') {
      const pitch = this.notePitch(0), exit = this.notePitch(3);
      this.tone(pitch, pitch / 2, .2, .045, pan, 0, 'sine', true);
      this.tone(exit / 2, exit, .3, .055, pan, .1, 'sine', true);
    }
    if (event.type === 'wrap') {
      const pitch = this.notePitch(3), gain = event.id < 0 ? .02 : .035;
      this.tone(pitch, pitch / 2, .14, gain, event.fromX / 480 - 1, 0, 'sine', true);
      this.tone(pitch / 2, pitch, .22, gain, pan, .06, 'sine', true);
    }
    if (event.type === 'slingshot') { const pitch = this.notePitch(3); this.tone(pitch / 2, pitch, .25, .06, pan, 0, 'triangle', true); }
    if (event.type === 'reunite') { const pitch = this.notePitch(0); this.tone(pitch * 2, pitch, .24, .045, pan, 0, 'sine', true); }
    if(event.type==='spring') {const pitch=this.notePitch(0);this.tone(pitch*.65,pitch,.28,.09,pan,0,'sine',true);}
    if(event.type==='pulse') {const pitch=this.notePitch([0,2,3][event.beat]);this.tone(pitch/2,pitch/2,.4,.1,pan,0,'sine',true);}
    if(event.type==='relay') {const pitch=this.notePitch(2);this.tone(pitch*2,pitch*2,.35,.045,pan,0,'triangle',true);}
    if(event.type==='orbit-release'||event.type==='rewind') {const pitch=this.notePitch(3);this.tone(pitch*2,pitch,.3,.05,pan,0,'sine',true);}
    if (event.type === 'push') this.tone(100, 45, .12, .09, pan);
    if (event.type === 'win') { [this.notePitch(0), this.notePitch(2), this.notePitch(3), this.notePitch(0) * 2].forEach((pitch, index) => this.tone(pitch, pitch, 1.2, .12, 0, index * .22, 'sine', true)); }
    if (event.type === 'over') [523.25, 392, 329.63, 261.63].forEach((pitch, index) => this.tone(pitch, pitch, .75, .15, 0, index * .12, 'sine', true));
  }
  audition() {
    this.musicStart();
    // An immediate check remains audible even with the ambience slider at zero.
    [0, 2, 3].forEach((degree, index) => { const pitch = this.notePitch(degree); this.tone(pitch, pitch, .5, .12, 0, index * .16, 'sine', true); });
  }
}
