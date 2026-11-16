import {audioEnvironment} from './audio-environment.js?v=5f951fd5c399f22b78c1cf60e0482d14934549e7a2fbb76fb8d3dc6751900570';
import {instrumentNote,instrumentPercussion} from './instrument.js?v=a60e71fef74fdec8b7dd85332250a173932596a5d4a6680ea91c217b73baf01b';
import {voiceTrack,voicesReap,voicesStop} from './audio-voice.js?v=c0db179bcb018380a8604c761694e0021f5b46aae7b41ff0986bf44e98136bce';
import {cosmeticGet,cosmeticHasSound} from './cosmetic.js?v=61a0093e32ea698e1cd5c0a834a10234875ae75bb6ff4247be147a3b78edee0b';
import {poolPan} from './view.js?v=26cab1c9efeb1cecf6a36401d7839290091b4296d5bc450e29d6f50e884e2bea';
// Original procedural effects. No recordings or external audio requests.
import { PoolMedia } from './media.js?v=d31acea21b543a610f696e47d50a254ce52527d06e488d6e72309535656e4d38';
import { CHORDS, musicCreate, musicStrike, musicBloom, musicLaunch, musicFinish, musicNextBar, musicAccent, musicPower, bubbleRole } from './music.js?v=e7a5a17eb66e892fcfde7da0cd1da25876f188e8fdc235a3b66388f997dda0f3';
const SCALE = [261.63, 293.66, 329.63, 392, 440];
const frequency = midi => 440 * 2 ** ((midi - 69) / 12);
export const SOUND_CHECK_SECONDS = 2.8;
// Octave-spaced clicks crossfade through a fixed register, with silent ends.
// Wrapping phase changes voice indices, never the audible spectrum.
export function uiWindTones(phase){
 const fraction=((phase%1)+1)%1;
 return Array.from({length:4},(_,i)=>{const octave=i+fraction;return {pitch:140*2**octave,level:Math.sin(Math.PI*octave/4)**2};});
}
// A rounded attack and release avoid broadband spikes in these short taps.
const windEnvelope=Float32Array.from({length:129},(_,i)=>{const t=i/128;return i===0||i===128?0:t<.16?Math.sin(Math.PI*t/.32)**2:Math.cos(Math.PI*(t-.16)/1.68)**2;});
export class PoolSound {
  constructor({media=true}={}) { this.media = media?new PoolMedia():null; this.context = null; this.volume = 1; this.ambience = 1; this.isMuted = false; this.isPaused = false; this.voiceCount = 0; this.eventCount = 0; this.strengthAt = -Infinity; this.auditionUntil = 0; this.music = musicCreate(); this.phraseVoices = new Set(); this.musicQueue = []; this.phraseEnd = 0; this.activeChord = null; this.isMusicPlaying = false; this.passage = 0; this.previousPitch = 67; this.section = 'Quiet pool'; this.stage = 0; this.flow = 0; this.duckUntil = 0; this.lastMix = -1; this.playbackQueue = []; this.playbackLights = new Map(); this.playbackCount = 0; this.lastPlayback = null; this.playbackPhrase = null; this.replyUntil = 0; }
  get isMusicPaused() { return this.isPaused&&!this.keepAmbient; }
  get bloomCount() { return this.music.blooms; }
  get harmony() { const chord = this.activeChord ?? this.music.history.at(-1)?.chord; return chord === undefined || chord === null ? null : CHORDS[chord]; }
  musicSave() { return musicCreate(this.music, this.bloomCount); }
  musicRestore(saved, blooms, plucks = null) { this.phraseClear(); this.music = musicCreate(saved, blooms, plucks); this.activeChord = null; this.passage = 0; this.previousPitch = 67; this.stage = 0; this.section = 'Quiet pool'; }
  async unlockAsync() {
    if (this.isMuted||this.outputHeld||globalThis.document?.hidden) return false;
    // Music playback uses the media route on supporting iOS versions, including
    // when the ringer is silent. The optional API must never block other browsers.
    try { if (globalThis.navigator?.audioSession&&globalThis.navigator.audioSession.type!=='playback') globalThis.navigator.audioSession.type = 'playback'; } catch { /* Unsupported session policy: retain ordinary Web Audio. */ }
    if(this.refreshOutput||this.context?.state==='closed'||this.resumeTimedOut||this.clockStalled())this.graphReset();
    if(!this.context){this.context=new (window.AudioContext || window.webkitAudioContext)({latencyHint:'interactive'});this.outputGeneration=(this.outputGeneration||0)+1;}
    const audioContext = this.context;
    // Call resume and start a source synchronously inside the tap handler. Safari
    // also reports "interrupted" after app switches, calls, or screen locking.
    const resuming = audioContext.state !== 'running' ? audioContext.resume() : Promise.resolve();
    const primer = audioContext.createBufferSource();
    primer.buffer = audioContext.createBuffer(1, 1, audioContext.sampleRate);
    primer.connect(audioContext.destination); primer.onended = () => primer.disconnect(); primer.start();
    if (!this.master) {
      const context = this.context; this.master = context.createGain(); this.master.gain.value = this.isMuted ? 0 : this.volume * .48;
      const compressor = context.createDynamicsCompressor(); compressor.threshold.value = -18; compressor.ratio.value = 5; this.master.connect(compressor);
      // Gate after the compressor: its lookahead buffer must not survive an
      // output retirement. New output enters gently after route activation.
      this.outputGate=context.createGain();this.outputGate.gain.setValueAtTime(0,context.currentTime);this.outputGate.gain.linearRampToValueAtTime(1,context.currentTime+.06);
      compressor.connect(this.outputGate);this.outputGate.connect(context.destination);this.compressor=compressor;
      this.delay = context.createDelay(.6); this.delay.delayTime.value = .21;
      const feedback = context.createGain(); feedback.gain.value = .19; const wet = context.createGain(); wet.gain.value = .24;
      this.delay.connect(feedback); feedback.connect(this.delay); this.delay.connect(wet); wet.connect(this.master);
      this.musicOutput=context.createGain();this.musicOutput.gain.value=0;this.musicDuck=context.createGain();this.musicDuck.gain.value=1;this.musicOutput.connect(this.musicDuck);this.musicDuck.connect(this.master);
      this.musicEnvironment=audioEnvironment(context,this.musicOutput);this.musicInput=this.musicEnvironment.input;
      let seed=8128;
      this.percussionNoise = context.createBuffer(1, Math.ceil(context.sampleRate * .15), context.sampleRate);
      const noise = this.percussionNoise.getChannelData(0);
      for (let i = 0; i < noise.length; i++) { seed = (Math.imul(seed, 1664525) + 1013904223) >>> 0; noise[i] = seed / 2147483648 - 1; }

    }
    this.media?.prepare(audioContext, this.master);
    this.media?.update(this.isMusicPlaying && !this.isMusicPaused && this.volume > 0 && this.ambience > 0);
    this.media?.retry();
    let timeout;
    try{await Promise.race([resuming,new Promise((_,reject)=>{timeout=setTimeout(()=>{if(this.context===audioContext)this.resumeTimedOut=true;reject(new Error('Audio resume timed out'));},1800);})]);}finally{clearTimeout(timeout);}
    if(this.context!==audioContext)return false;
    this.musicUpdate();
    return this.context.state === 'running';
  }
  clockStalled(){
    if(!this.context||this.context.state!=='running'){this.clockSample=null;return false;}
    const wall=globalThis.performance?.now?.()??Date.now(),time=this.context.currentTime,previous=this.clockSample;
    if(!previous||time!==previous.time){this.clockSample={wall,time};return false;}
    return wall-previous.wall>1800;
  }
  outputRefresh(){if(this.context)this.refreshOutput=true;}
  outputHold(){
    if(this.outputHeld)return;
    this.outputHeld=true;this.outputHiddenAt=performance.now();this.graphReset();
  }
  outputRelease(){this.outputHeld=false;this.outputVisibleAt=performance.now();}
  get outputDiagnostics(){
    const context=this.context,round=value=>Number.isFinite(value)?Math.round(value*1000)/1000:null;
    let stamp;try{stamp=context?.getOutputTimestamp?.();}catch{}
    return {generation:this.outputGeneration||0,held:!!this.outputHeld,state:context?.state||'none',contextTime:round(context?.currentTime),baseLatency:round(context?.baseLatency),outputLatency:round(context?.outputLatency),outputTimestamp:stamp?{contextTime:round(stamp.contextTime),performanceTime:round(stamp.performanceTime)}:null,closePending:this.outputClosing||0,lastCloseMs:round(this.outputCloseMs),hiddenAt:round(this.outputHiddenAt),visibleAt:round(this.outputVisibleAt)};
  }
  graphReset(){
    this.refreshOutput=false;
    const retired=this.context,closedAt=performance.now();
    if(this.outputGate){this.outputGate.gain.cancelScheduledValues(0);this.outputGate.gain.setValueAtTime(0,retired.currentTime);this.outputGate.disconnect();this.compressor?.disconnect();}
    // Disconnect before any fade or close promise. A frozen audio clock must
    // not retain a future fade, delay tail or looping ambience through return.
    if(this.master){this.master.gain.cancelScheduledValues(0);this.master.gain.setValueAtTime(0,retired.currentTime);this.master.disconnect();}
    const mediaKey=this.media?.key,mediaEnv=this.media?.env;
    this.cosmeticPreviewStop();this.musicEnvironment?.dispose();this.musicEnvironment=null;voicesStop(this);this.phraseClear();this.media?.dispose();
    if(this.media){this.media=new PoolMedia(mediaEnv);if(mediaKey)this.media.describe(mediaKey);}
    this.context=null;this.master=null;this.outputGate=null;this.compressor=null;this.musicInput=null;this.musicOutput=null;this.musicDuck=null;this.previewEnvelope=null;this.delay=null;
    this.lastMix=-1;this.voiceCount=0;this.auditionUntil=0;this.uiLastAt=-Infinity;this.uiWindLastAt=-Infinity;this.strengthAt=-Infinity;this.duckUntil=0;this.previewStarted=0;this.clockSample=null;this.resumeTimedOut=false;this.cosmeticAt={};this.travelState=null;
    if(retired?.close){this.outputClosing=(this.outputClosing||0)+1;try{Promise.resolve(retired.close()).catch(()=>{}).finally(()=>{this.outputClosing--;this.outputCloseMs=performance.now()-closedAt;});}catch{this.outputClosing--;}}
  }
  harmonySet(blooms) {
    const count = Number.isSafeInteger(blooms) && blooms > 0 ? blooms : 0;
    if (count === this.bloomCount && count !== 0) return;
    this.musicRestore(null, count);
  }
  phraseClear() {
    this.musicQueue = []; this.phraseEnd = 0; this.activeChord = null; this.playbackQueue = []; this.playbackLights.clear(); this.lastPlayback = null; this.playbackPhrase = null; this.replyUntil = 0;
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
  ambienceSet(value) { this.ambience = Number.isFinite(value) ? Math.max(0, Math.min(1, value)) : 1; if (!this.ambience){this.phraseClear();this.cosmeticPreviewStop();} this.mixUpdate(); }
  mixUpdate() {
    this.media?.update(!!this.context && this.context.state === 'running' && this.isMusicPlaying && !this.isMuted && !this.isMusicPaused && this.volume > 0 && this.ambience > 0);
    if (!this.musicOutput||this.outputHeld) return;
    const now = this.context.currentTime,loadout=typeof this.musicLoadout==='function'?this.musicLoadout():this.musicLoadout||{};
    if(this.previewSelection&&now>=this.previewUntil)this.previewSelection=null;
    this.musicEnvironment?.stageSet(this.previewSelection?.kind==='soundstage'?this.previewSelection.id:loadout.soundstage);
    this.musicEnvironment?.ambienceSet(this.previewSelection?.kind==='ambience'?this.previewSelection.id:loadout.ambience,!this.isMuted&&this.volume>0&&this.ambience>0&&!this.isMusicPaused&&this.isMusicPlaying&&!globalThis.document?.hidden);
    const level = this.isMuted || this.isMusicPaused || !this.isMusicPlaying ? 0 : this.ambience * (now < this.duckUntil ? .6 : 1);
    if (level !== this.lastMix) { this.musicOutput.gain.setTargetAtTime(level, now, level ? .35 : .04); this.lastMix = level; }
  }
  musicUpdate(flow = this.flow) {
    voicesReap(this);
    this.flow = Math.max(0, Math.min(1, Number.isFinite(flow) ? flow : 0)); this.mixUpdate();
    if (!this.isMusicPlaying || !this.context || this.context.state !== 'running' || this.isMuted || this.isMusicPaused || !this.ambience) { this.playbackQueue = []; this.playbackLights.clear(); this.lastPlayback = null; return; }
    const now = this.context.currentTime;
    if (this.phraseEnd < now - 1) { this.musicQueue = []; this.playbackQueue = []; this.playbackLights.clear(); this.phraseEnd = now + .08; }
    if (this.phraseEnd <= now + .2) {
      const score = musicNextBar(this.music, this.flow, this.previousPitch), start = Math.max(now + .04, this.phraseEnd);
      if (score.isReply) {
        this.replyUntil = start + score.replyBars * score.duration;
      }
      this.passage = Math.floor(Math.max(0, this.music.bar - 1 - this.music.formStart) / 4) + 1; this.stage = score.stage;
      this.previousPitch = score.nextPitch; this.section = score.section;
      const phrase = score.phrase ? { ...score.phrase, pans: score.phrase.ids.map(id=>this.music.pans[id]??0) } : null;
      this.musicQueue.push(...score.events.map(event => ({ ...event, at: event.at + start, ...(event.role === 'lead' ? { phrase } : {}) })));
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
      if (event.role === 'lead') { this.lastPlayback = event; this.playbackPhrase = event.phrase; }
      this.playbackCount++;
    }
    for (const [id, event] of this.playbackLights) if (event.until <= now) this.playbackLights.delete(id);
  }
  musicVoice(event) { instrumentNote(this,this.previewSelection?.kind==='music'?{...event,musicTheme:this.previewSelection.id}:event); }
  musicPercussion(event) { instrumentPercussion(this,event); }
  pauseSet(value,{ambient=false}={}) { this.isPaused=value; this.keepAmbient=value&&ambient; if(value){this.cosmeticStop();if(!ambient)this.phraseClear();} this.mixUpdate(); }
  notePitch(tone) { return this.harmony ? frequency(this.harmony.notes[tone % 5]) : SCALE[tone % 5]; }
  settingsSet(volume, isMuted) { this.volume = volume; this.isMuted = isMuted; if (isMuted) this.phraseClear(); if(isMuted||!volume)this.cosmeticStop(); if (this.master) this.master.gain.setTargetAtTime(isMuted ? 0 : volume * .48, this.context.currentTime, .03); this.mixUpdate(); }
  tone(frequency, end, duration, level, pan = 0, offset = 0, type = 'sine', echo = false, phrase = false, { allowPaused = false,group,fadeOut=duration,attack=.008,envelope=null,at=null } = {}) {
    voicesReap(this);
    if (!this.context || this.context.state !== 'running' || this.isMuted || (this.isPaused && !allowPaused && !(phrase&&this.keepAmbient)) || this.voiceCount >= (group==='audition'?55:46)) return;
    const context = this.context, start = at ?? context.currentTime + offset, oscillator = context.createOscillator(), gain = context.createGain(), stereo = context.createStereoPanner();
    oscillator.type = type; oscillator.frequency.setValueAtTime(frequency, start); oscillator.frequency.exponentialRampToValueAtTime(Math.max(20, end), start + duration);
    if(envelope)gain.gain.setValueCurveAtTime(envelope.map(value=>value*level),start,duration);
    else {gain.gain.setValueAtTime(.0001, start); gain.gain.exponentialRampToValueAtTime(Math.max(.001, level), start + Math.min(attack,duration*.5)); if(fadeOut<duration)gain.gain.setValueAtTime(Math.max(.001,level),start+duration-fadeOut); gain.gain.exponentialRampToValueAtTime(.0001, start + duration);}
    stereo.pan.value = Math.max(-.85, Math.min(.85, pan)); oscillator.connect(gain); gain.connect(stereo); stereo.connect(this.master); if (echo) stereo.connect(this.delay);
    const voice = { oscillator, gain, start,group }; if (phrase) this.phraseVoices.add(voice);
    voiceTrack(this,voice,start+duration+.02,[oscillator,gain,stereo]);
    oscillator.start(start); oscillator.stop(start + duration + .02);
  }
  contactNote(pitch, level=1, pan=0, offset=0, options={}) {
    this.tone(pitch * 2.2, pitch, .075, .23 * level, pan, offset, 'sine', false, false, options);
    this.tone(pitch, pitch * .998, .65, .24 * level, pan, offset + .025, 'sine', true, false, options);
    this.tone(pitch * 2, pitch * 2, .32, .055 * level, pan, offset + .03, 'triangle', true, false, options);
  }
  strengthChange(previous, next) {
    if (!Number.isFinite(previous) || !Number.isFinite(next)) return false;
    const from = Math.round(Math.max(0, Math.min(1, previous)) * 20);
    const to = Math.round(Math.max(0, Math.min(1, next)) * 20);
    if (from === to || !this.context || this.context.state !== 'running' || this.isMuted || this.isPaused || !this.volume || this.voiceCount >= 46) return false;
    const now = this.context.currentTime;
    // No queue: rapid pointer events produce at most one short cue every 60 ms.
    if (now - this.strengthAt < .06) return false;
    this.strengthAt = now;
    const degree = Math.floor(to / 2), pitch = this.notePitch(degree % 5) * 2 ** (Math.floor(degree / 5) - 1);
    this.tone(pitch * (to > from ? .86 : 1.16), pitch, .075, .09);
    this.eventCount++;
    return true;
  }
  eventPlay(event,{effects=true}={}) {
    const pan = poolPan(event.x, event.y, this.portrait);
    const explicitMidi=Number.isInteger(event.midi)&&event.midi>=48&&event.midi<=84&&[0,2,4,5,7,9,11].includes(event.midi%12)?event.midi:null;
    if (event.type === 'launch') musicLaunch(this.music);
    if (['rest', 'win', 'over', 'wave-clear'].includes(event.type)) musicFinish(this.music);
    if (event.type === 'note') musicStrike(this.music, event.tone, event.tick, event.chain, event.id, explicitMidi??((this.harmony?.notes[event.tone % 5] ?? [60, 62, 64, 67, 69][event.tone % 5]) + (event.chain > 3 ? 12 : 0)), event.speed, pan);
    if (event.type === 'bloom') {musicBloom(this.music);if(event.banks>0)musicAccent(this.music);}
    if(event.type==='objective')musicAccent(this.music);
    if(event.type==='blaster-fire')musicPower(this.music,'blaster',pan);
    if(event.type==='power'&&event.kind==='echo')musicPower(this.music,'echo',pan);
    if (!effects || !this.context || this.isMuted) return;
    this.eventCount++;
    if (event.type === 'blaster-fire') { const pitch=this.notePitch(0)*2;this.tone(pitch*1.08,pitch,.09,.045,pan); }
    if (event.type === 'blaster-bank') this.tone(880,1320,.08,.06,pan);
    if(event.type==='pop')this.tone(620,110,.09,.07,pan);
    if(event.type==='wave-clear')[0,2,4].forEach((tone,i)=>this.tone(this.notePitch(tone),this.notePitch(tone),.7,.08,0,i*.14,'sine',true));
    if (event.type === 'launch') { this.tone(130, 520, .13, .25, pan); this.tone(65, 38, .18, .25, pan); }
    if (event.type === 'wall') this.tone(190 + Math.min(300, event.speed), 85, .16, .1, pan);
    if (event.type === 'impact') this.tone(event.bubble ? 120 : 100 + Math.min(200, event.speed), event.bubble ? 42 : 55, event.bubble ? .18 : .095, Math.min(.15, event.speed / 2500), pan);
    if(event.type==='music-cue'&&explicitMidi!==null){const pitch=440*2**((explicitMidi-69)/12);this.tone(pitch,pitch,.45,.18,pan,0,'sine',true);}
    if (event.type === 'note') { const gain = event.seedId < 0 ? .65 : 1; const pitch = explicitMidi!==null?440*2**((explicitMidi-69)/12):this.notePitch(event.tone) * (bubbleRole(event.id)==='bass'?.5:event.chain>3?2:1); this.contactNote(pitch,gain,pan); }
    if (event.type === 'note' || event.type === 'launch') { this.duckUntil = this.context.currentTime + .8; this.mixUpdate(); }
    if (event.type === 'power'&&!['echo','blaster'].includes(event.kind)) {
      const degrees = ({ ripple: [0, 2, 3], attract: [3, 2, 0], vortex: [0, 3, 2, 3], stasis: [3, 0], comet: [0, 2, 3, 5], swap: [0, 3, 0, 2], magnet: [5, 3, 2, 0], lightning: [], impact: [0, 0, 3], tether: [0, 2, 0], split: [0, 3, 5], bubble: [0, 3, 2], portal: [0, 5], echo: [3, 0, 3], slingshot: [0, 2], drunk: [0, 3, 2, 5, 3], homing: [0, 2, 5] })[event.kind] || [0, 2, 3];
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
  uiPlay(kind='select') {
    voicesReap(this);
    if(!this.context||this.context.state!=='running'||this.isMuted||!this.volume||this.voiceCount>40)return false;
    const now=this.context.currentTime;
    const wind=kind?.type==='wind'&&Number.isFinite(kind.delta);
    if(wind)this.uiWindPhase=((this.uiWindPhase||0)+Math.max(-.25,Math.min(.25,kind.delta))*2)%1;
    const last=wind?'uiWindLastAt':'uiLastAt';
    if(kind!=='back-complete'&&now-(this[last]??-Infinity)<(wind?.14:.06))return false;
    this[last]=now;
    const back=kind==='back'||kind==='back-complete';
    const pitch=kind==='back-start'?300:back?440:kind==='confirm'?660:560;
    if(wind){for(const {pitch,level} of uiWindTones(this.uiWindPhase))if(level>.001)this.tone(pitch,pitch,.05,.035*level,0,0,'sine',false,false,{allowPaused:true,envelope:windEnvelope,at:now+.006});}
    else this.tone(pitch,back?330:pitch*1.08,.085,.09,0,0,'sine',false,false,{allowPaused:true});
    if(kind==='confirm')this.tone(880,880,.09,.055,0,.055,'sine',false,false,{allowPaused:true});
    this.uiCount=(this.uiCount||0)+1;
    return true;
  }
  cosmeticStop(){this.cosmeticPreviewStop();voicesStop(this,'cosmetic');voicesStop(this,'cosmetic-preview');voicesStop(this,'cosmetic-travel');this.travelState=null;}
  cosmeticPreviewStop({replace=false}={}){this.previewSelection=null;this.previewUntil=0;if(!replace)this.previewMusicFade(0);voicesStop(this,'cosmetic-preview');if(this.context?.state!=='closed')this.mixUpdate();}
  cosmeticPreviewStatus(){const now=this.context?.currentTime||0,duration=Math.max(0,(this.previewUntil||0)-(this.previewStarted||0));return {active:duration>0&&now<this.previewUntil,duration,progress:duration>0?Math.max(0,Math.min(1,(now-this.previewStarted)/duration)):0};}
  previewMusicFade(duration){
    if(!this.musicDuck)return 0;
    const now=this.context.currentTime,p=this.musicDuck.gain,e=this.previewEnvelope;
    // Evaluate our own linear envelope so replacement is continuous, including
    // hosts without cancelAndHoldAtTime. The normal music mix owns another bus.
    let value=1;
    if(e){if(now<e.down)value=e.from+(e.to-e.from)*Math.max(0,(now-e.start)/(e.down-e.start));else if(now<e.end)value=e.to;else value=e.to+(1-e.to)*Math.min(1,(now-e.end)/.35);}
    p.cancelScheduledValues(now);p.setValueAtTime(value,now);
    const delay=duration>0?.12:0,down=now+(delay||.35),end=duration>0?down+duration:down;
    p.linearRampToValueAtTime(duration>0?0:1,down);
    if(duration>0){p.setValueAtTime(0,end);p.linearRampToValueAtTime(1,end+.35);}
    this.previewStarted=now;this.previewUntil=duration>0?end:0;
    this.previewEnvelope={start:now,down,end,from:value,to:duration>0?0:1};return delay;
  }
  cosmeticAudition(id){const item=cosmeticGet(id);if(['music','soundstage','ambience'].includes(item?.kind))return this.musicThemeAudition(id);return !!item&&this.cosmeticPlay({[item.kind]:id},{type:item.kind==='trail'?'launch':'cosmetic-hit'},{preview:true});}
  musicThemeAudition(id){
    if(!this.context||this.context.state!=='running'||this.isMuted||!this.volume||!this.ambience||this.isMusicPaused||!this.isMusicPlaying||globalThis.document?.hidden)return false;
    const selected=cosmeticGet(id);if(!['music','soundstage','ambience'].includes(selected?.kind))return false;
    // A temporary layer on the audible arrangement, never a second demo song.
    // Existing notes finish naturally; scheduled notes keep their pitches/clock.
    this.cosmeticPreviewStop({replace:true});this.previewMusicFade(0);
    this.previewStarted=this.context.currentTime;this.previewUntil=this.previewStarted+10;
    this.previewSelection=selected;this.mixUpdate();return true;
  }
  cosmeticPlay(loadout,event,{preview=false}={}){
    const kind=event.type==='launch'?'trail':event.type==='cosmetic-hit'||event.type==='wall'&&event.id===0||event.type==='impact'&&(event.a===0||event.b===0)?'bounce':null;
    const item=cosmeticGet(loadout?.[kind]);
    if(!kind||item?.kind!==kind||!cosmeticHasSound(item))return false;
    if(!this.context||this.context.state!=='running'||this.isMuted||!this.volume||this.isPaused&&!preview||globalThis.document?.hidden)return false;
    voicesReap(this);if(preview)this.cosmeticPreviewStop({replace:true});
    if(this.voiceCount>40)return false;
    const now=this.context.currentTime;this.cosmeticAt||={};
    if(!preview&&now-(this.cosmeticAt[kind]??-Infinity)<(kind==='trail'?1.2:.22))return false;
    if(!preview)this.cosmeticAt[kind]=now;
    const pan=preview?0:poolPan(event.x,event.y,this.portrait),options={allowPaused:preview,group:preview?'cosmetic-preview':'cosmetic'};
    // Original finite accents: a rising airy wake and a low crystalline impact.
    // No feedback delay or continuing oscillator can accumulate between hits.
    const accents={stormwake:[[220,880,.18,.035,0,'triangle'],[880,440,.35,.02,.08,'sine']],clockstream:[[392,392,.12,.04,0,'triangle'],[588,294,.25,.025,.1,'sine']],riftwake:[[220,330,.7,.03,0,'sine'],[440,660,.6,.02,.12,'sine'],[880,440,.5,.012,.24,'triangle']],livingvine:[[392,523,.5,.03,0,'sine'],[587,784,.6,.02,.1,'sine'],[784,1046,.5,.012,.2,'sine']],horizoncollapse:[[110,44,.3,.06,0,'sine'],[440,220,.5,.03,.06,'sine'],[880,440,.45,.018,.12,'sine'],[660,330,.5,.012,.16,'sine']],worldbloom:[[262,523,.3,.04,0,'sine'],[523,784,.45,.025,.04,'sine'],[659,988,.4,.02,.1,'sine'],[784,1046,.4,.012,.16,'sine']]};
    const notes=accents[item.style]||(item.style==='ember'?[[180,440,.24,.055,0,'triangle'],[360,720,.34,.025,.06,'sine']]:kind==='trail'?[[330,660,.6,.035,0,'sine'],[495,990,.55,.025,.1,'sine'],[990,1320,.45,.016,.2,'triangle']]:[[150,55,.18,.075,0,'sine'],[660,990,.42,.035,0,'sine'],[990,1320,.38,.025,.06,'triangle'],[1320,1760,.32,.016,.12,'sine']]);
    const delay=preview?this.previewMusicFade(kind==='trail'&&item.rarity==='mythic'?3.82:Math.max(...notes.map(n=>n[2]+n[4]))+.03):0;
    for(const [start,end,duration,level,offset,type] of notes)this.tone(start,end,duration,level,pan,offset+delay,type,false,false,options);
    if(preview&&kind==='trail'&&item.rarity==='mythic')this.travelVoices(0,.2+delay,3.6,.02,{...options,style:item.style,fadeOut:1});
    return true;
  }
  travelVoices(pan,offset,duration,level,options){
    // Aurora is a soft, slowly beating pad. Sustained oscillators keep phase
    // across motion updates: no repeating attacks, pitch resets or loop seam.
    const context=this.context,start=context.currentTime+offset;
    const pitches=options.style==='riftwake'?[[220,1],[220.14,.65],[330,.35]]:options.style==='livingvine'?[[392,1],[392.16,.65],[587.33,.35]]:[[440,1],[440.18,.65],[660,.35]];
    return pitches.map(([pitch,weight])=>{
      const oscillator=context.createOscillator(),gain=context.createGain(),stereo=context.createStereoPanner();
      oscillator.type='sine';oscillator.frequency.setValueAtTime(pitch,start);
      gain.gain.setValueAtTime(.0001,start);gain.gain.linearRampToValueAtTime(level*weight,start+.45);
      gain.gain.setValueAtTime(level*weight,start+duration-1);gain.gain.linearRampToValueAtTime(.0001,start+duration);
      stereo.pan.value=Math.max(-.85,Math.min(.85,pan));oscillator.connect(gain);gain.connect(stereo);stereo.connect(this.master);
      const voice=voiceTrack(this,{oscillator,gain,stereo,weight,start,group:options.group},start+duration+.02,[oscillator,gain,stereo]);
      oscillator.start(start);oscillator.stop(voice.end);return voice;
    });
  }
  cosmeticTravel(loadout,body,active=true){
    const item=cosmeticGet(loadout?.trail);
    if(!active||item?.rarity!=='mythic'||item.kind!=='trail'||!body||!this.context||this.context.state!=='running'||this.isMuted||!this.volume||this.isPaused||globalThis.document?.hidden){voicesStop(this,'cosmetic-travel');this.travelState=null;return false;}
    voicesReap(this);const now=this.context.currentTime,old=this.travelState;
    const speed=old&&now>old.time?Math.hypot(body.x-old.x,body.y-old.y)/(now-old.time):Math.hypot(body.vx||0,body.vy||0);
    this.travelState={x:body.x,y:body.y,time:now,at:old?.at??-Infinity,voices:old?.voices};
    if(speed<1||now-this.travelState.at<.08)return false;
    const state=this.travelState,level=.008+Math.min(1,speed/500)*.012,pan=poolPan(body.x,body.y,this.portrait);
    if(!state.voices?.every(v=>this.audioVoices.has(v)&&v.end>now)){
      if(this.voiceCount>40)return false;
      state.voices=this.travelVoices(pan,0,2,level,{group:'cosmetic-travel',style:item.style});
    }
    state.at=now;
    for(const voice of state.voices){
      const gain=voice.gain.gain;
      if(gain.cancelAndHoldAtTime)gain.cancelAndHoldAtTime(now);
      else {const current=gain.value;gain.cancelScheduledValues(now);gain.setValueAtTime(current,now);}
      gain.setTargetAtTime(level*voice.weight,now,.22);
      // A renewable audio-clock lease fades automatically even if updates stop.
      gain.setTargetAtTime(.0001,now+.35,.14);
      voice.stereo.pan.setTargetAtTime(Math.max(-.85,Math.min(.85,pan)),now,.15);
      voice.end=now+1.2;voice.oscillator.stop(voice.end);
    }
    return true;
  }
  audition() {
    if (!this.context || this.context.state !== 'running' || this.isMuted || !this.volume) return false;
    voicesStop(this,'audition');voicesReap(this);
    this.auditionUntil = this.context.currentTime + SOUND_CHECK_SECONDS;
    // A finite UI cue bypasses only pause, never mute or master volume. It must
    // not start the composer or advance the player's saved song from a menu.
    // Use one pitch and the real contact-note envelope so only loudness changes.
    // The final note is the full-strength player contact, through the same mixer.
    [.25, .6, 1].forEach((level,index)=>this.contactNote(440,level,0,index*.9,{allowPaused:true,group:'audition'}));
    return true;
  }
}
