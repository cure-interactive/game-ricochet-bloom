import {musicCreate,musicFinish,musicNextBar,BAR_SECONDS} from './music.js?v=b5008c456a438e56836f418bb2a46e76360a0b81d9e9ecd8f24456170e3e90e8';
import {instrumentNote} from './instrument.js?v=54c0e4fa3eab549d2e5ab1ff2eca9c9fb14a046e20c1345e853b451955c0697c';
export const SONG_STORAGE='ricochet-bloom-songs-v1', SONG_LIMIT=24;
export function songLibraryRead(value) {
  if(!value||value.version!==1||!Array.isArray(value.songs))return {version:1,songs:[]};
  const ids=new Set();
  return {version:1,songs:value.songs.slice(0,SONG_LIMIT).filter(s=>s&&typeof s.id==='string'&&s.id.length<=80&&typeof s.name==='string'&&s.name.trim()&&s.name.length<=60&&Number.isSafeInteger(s.created)&&s.created>=0&&[3,4].includes(s.music?.version)&&Number.isSafeInteger(s.music.blooms)&&s.music.blooms>=0&&Number.isSafeInteger(s.music.plucks)&&s.music.plucks>=0&&!ids.has(s.id)&&ids.add(s.id)).map(s=>({id:s.id,name:s.name,created:s.created,music:musicCreate(s.music,s.music.blooms,s.music.plucks)}))};
}
export function songSnapshot(music) {const copy=musicCreate(music,music.blooms,music.plucks);if(copy.strikes.length)musicFinish(copy);return copy;}
export function wavEncode(buffer) {
  const channels=Math.min(2,buffer.numberOfChannels),frames=buffer.length,bytes=frames*channels*2;
  const data=new ArrayBuffer(44+bytes),view=new DataView(data),text=(at,s)=>{for(let i=0;i<s.length;i++)view.setUint8(at+i,s.charCodeAt(i));};
  text(0,'RIFF');view.setUint32(4,36+bytes,true);text(8,'WAVE');text(12,'fmt ');view.setUint32(16,16,true);view.setUint16(20,1,true);view.setUint16(22,channels,true);view.setUint32(24,buffer.sampleRate,true);view.setUint32(28,buffer.sampleRate*channels*2,true);view.setUint16(32,channels*2,true);view.setUint16(34,16,true);text(36,'data');view.setUint32(40,bytes,true);
  const samples=Array.from({length:channels},(_,i)=>buffer.getChannelData(i));
  for(let i=0;i<frames;i++)for(let c=0;c<channels;c++){const n=Math.max(-1,Math.min(1,samples[c][i]||0));view.setInt16(44+(i*channels+c)*2,Math.round(n*(n<0?32768:32767)),true);}
  return data;
}
export async function songRender(music) {
  const Offline=globalThis.OfflineAudioContext||globalThis.webkitOfflineAudioContext;
  if(!Offline)throw new Error('Audio export is unavailable in this browser. Your saved song is safe.');
  const context=new Offline(2,44100*26,44100),input=context.createGain(),low=context.createBiquadFilter(),high=context.createBiquadFilter(),master=context.createGain();
  low.type='lowpass';low.frequency.value=2200;high.type='highpass';high.frequency.value=70;input.connect(low);low.connect(high);high.connect(master);master.connect(context.destination);
  master.gain.setValueAtTime(.7,0);master.gain.setValueAtTime(.7,22.5);master.gain.linearRampToValueAtTime(0,25.5);
  const delay=context.createDelay(.6),wet=context.createGain();delay.delayTime.value=.21;wet.gain.value=.18;high.connect(delay);delay.connect(wet);wet.connect(master);
  const noise=context.createBuffer(1,Math.ceil(context.sampleRate*.15),context.sampleRate);let seed=8128;
  for(let i=0;i<noise.length;i++){seed=(Math.imul(seed,1664525)+1013904223)>>>0;noise.getChannelData(0)[i]=seed/2147483648-1;}
  const copy=songSnapshot(music),rack={context,musicInput:input,music:copy,percussionNoise:noise,phraseVoices:new Set(),voiceCount:0,voiceLimit:Infinity,playbackQueue:[]};let previous=67;
  for(let bar=0;bar<8;bar++) {const score=musicNextBar(copy,.35,previous);previous=score.nextPitch;for(const event of score.events)if(event.role)instrumentNote(rack,{...event,at:event.at+bar*BAR_SECONDS});}
  const rendered=await context.startRendering();let peak=0;
  for(let c=0;c<rendered.numberOfChannels;c++)for(const sample of rendered.getChannelData(c))peak=Math.max(peak,Math.abs(sample));
  // A quiet pool still makes a listenable keepsake; retain dynamics and headroom.
  const gain=peak>0?Math.min(10,.75/peak):1;
  for(let c=0;c<rendered.numberOfChannels;c++){const channel=rendered.getChannelData(c);for(let i=0;i<channel.length;i++)channel[i]*=gain;}
  return new Blob([wavEncode(rendered)],{type:'audio/wav'});
}
