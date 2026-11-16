import {musicTheme} from './music-theme.js?v=88ea7b370c0695e982b380622f15db38e58496f3cd4335b7104b62ec49d0ad79';
// Shared finite instruments for live music and offline highlights.
import {voiceTrack,voicesReap} from './audio-voice.js?v=c0db179bcb018380a8604c761694e0021f5b46aae7b41ff0986bf44e98136bce';
const frequency=midi=>440*2**((midi-69)/12);
export function instrumentNote(rack,event) {
    voicesReap(rack);
    if (['kick', 'rim', 'shaker'].includes(event.role)) { instrumentPercussion(rack,event); return; }
    const theme=musicTheme(event.musicTheme??(typeof rack.musicTheme==='function'?rack.musicTheme():rack.musicTheme));
    const isLead = event.role === 'lead';
    const partials = theme.partials || (isLead ? [[1, 1, 1], [2, .28, .55], [3, .08, .3]] : [[1, 1, 1], [2, .13, .45]]);
    if (rack.phraseVoices.size + partials.length > (rack.voiceLimit??30) || rack.voiceCount + partials.length > (rack.voiceLimit??38)) return;
    const context = rack.context, start = Math.max(context.currentTime, event.at), pitch = frequency(event.midi);
    // Piano-like decay: upper partials disappear faster than the body of the note.
    // A soft hammer attack and short release avoid both clicks and organ-like sustain.
    for (const [multiple, strength, decay] of partials) {
      const oscillator = context.createOscillator(), gain = context.createGain(), stereo = context.createStereoPanner();
      oscillator.type = theme.wave || (event.role === 'accompaniment' ? 'triangle' : 'sine'); oscillator.frequency.value = pitch * multiple;
      const palette=event.palette??rack.music.palette;
      const brightness=(event.brightness??1)*(palette==='velvet'?.6:palette==='wood'?.85:1);
      const duration = event.duration * decay*(theme.duration||1)*(palette==='wood'?.65:1), peak = event.level * strength*(multiple>1?brightness:palette==='velvet'?1.05:1);
      const attack=Math.min(duration*.2,event.attack*(theme.attack||1)*(palette==='velvet'?1.5:1));
      gain.gain.setValueAtTime(.0001, start);
      gain.gain.linearRampToValueAtTime(peak, start + attack);
      gain.gain.exponentialRampToValueAtTime(peak * .22, start + Math.max(attack + .02, duration * .35));
      gain.gain.exponentialRampToValueAtTime(.0001, start + duration);
      stereo.pan.setValueAtTime(event.pan, start);
      oscillator.connect(gain); gain.connect(stereo); stereo.connect(event.output||rack.musicInput);
      const voice = { oscillator, gain, start,group:event.group }; rack.phraseVoices.add(voice);
      voiceTrack(rack,voice,start+duration+.03,[oscillator,gain,stereo]);
      oscillator.start(start); oscillator.stop(start + duration + .03);
    }
    if (event.sourceId > 0) { rack.playbackQueue.push({ at: start, sourceId: event.sourceId, step: event.step, phraseIndex: event.phraseIndex, reply: !!event.reply, role: event.role, pan: event.pan, phrase: event.phrase }); rack.playbackQueue.sort((a, b) => a.at - b.at); }
  }

export function instrumentPercussion(rack,event) {
    voicesReap(rack);
    if (rack.phraseVoices.size >= (rack.voiceLimit??30) || rack.voiceCount >= (rack.voiceLimit??38)) return;
    const context = rack.context, start = Math.max(context.currentTime, event.at), gain = context.createGain(), stereo = context.createStereoPanner();
    const oscillator = event.role === 'shaker' ? context.createBufferSource() : context.createOscillator();
    const filter = context.createBiquadFilter();
    if (event.role === 'shaker') { oscillator.buffer = rack.percussionNoise; filter.type = 'highpass'; filter.frequency.value = 1400; }
    else { oscillator.type = event.role === 'kick' ? 'sine' : 'triangle'; oscillator.frequency.setValueAtTime(event.role === 'kick' ? 125 : 900, start); oscillator.frequency.exponentialRampToValueAtTime(event.role === 'kick' ? 48 : 600, start + event.duration); filter.type = 'lowpass'; filter.frequency.value = event.role === 'kick' ? 240 : 1800; }
    gain.gain.setValueAtTime(.0001, start); gain.gain.linearRampToValueAtTime(event.level, start + .005); gain.gain.exponentialRampToValueAtTime(.0001, start + event.duration);
    stereo.pan.value = event.pan; oscillator.connect(filter); filter.connect(gain); gain.connect(stereo); stereo.connect(event.output||rack.musicInput);
    const voice = { oscillator, gain, start,group:event.group }; rack.phraseVoices.add(voice);
    voiceTrack(rack,voice,start+event.duration+.01,[oscillator,filter,gain,stereo]);
    oscillator.start(start); oscillator.stop(start + event.duration + .01);
    if(event.sourceId>0){rack.playbackQueue.push({at:start,sourceId:event.sourceId,step:event.step,role:event.role,pan:event.pan});rack.playbackQueue.sort((a,b)=>a.at-b.at);}
  }
