import {soundstageGet,ambienceGet} from './music-environment.js?v=5b1988e50253a514f7dd89a12a36a17f8292a9118e212e49e82b91dee76f069a';

// One music-only acoustic graph, shared by playback, auditions and WAV export.
// No feedback loop: all reverberation has a finite, bounded impulse response.
export function audioEnvironment(context,output){
 const input=context.createGain(),low=context.createBiquadFilter(),high=context.createBiquadFilter(),dry=context.createGain();
 low.type='lowpass';low.frequency.value=2200;low.Q.value=.5;high.type='highpass';high.frequency.value=70;
 input.connect(low);low.connect(high);high.connect(dry);dry.connect(output);
 let stage=null,room=null,bed=null,bedId=null;const cache=new Map();
 function stageSet(id){
  const next=soundstageGet(id);if(stage===next.id)return;stage=next.id;
  if(room){room.reverb.disconnect();room.wet.disconnect();high.disconnect(room.reverb);}
  let impulse=cache.get(stage);
  if(!impulse){
   const length=Math.ceil(context.sampleRate*next.seconds);impulse=context.createBuffer(2,length,context.sampleRate);let seed=8128;
   for(let channel=0;channel<2;channel++){
    const data=impulse.getChannelData(channel);let smooth=0;
    for(let i=0;i<length;i++){
     seed=(Math.imul(seed,1664525)+1013904223)>>>0;smooth=smooth*next.damping+(seed/4294967296*2-1)*(1-next.damping);
     const time=i/context.sampleRate;
     data[i]=smooth*Math.exp(-time/next.decay)*Math.min(1,time/.025)*(next.diffuse?.8+.2*Math.sin(time*5+channel*2):1);
    }
    if(next.echo)for(let n=1;n<=3;n++){const at=Math.floor(context.sampleRate*(next.echo*n+channel*.009));if(at<length)data[at]+=.25/n;}
   }
   cache.set(stage,impulse);
  }
  const reverb=context.createConvolver(),wet=context.createGain();reverb.buffer=impulse;wet.gain.value=0;
  high.connect(reverb);reverb.connect(wet);wet.connect(output);wet.gain.setTargetAtTime(next.wet,context.currentTime,.08);
  dry.gain.setTargetAtTime(next.id==='soundstage.original'?1:1-next.wet*.35,context.currentTime,.08);room={reverb,wet};
 }
 function bedStop(){if(!bed)return;const old=bed;bed=null;bedId=null;const now=context.currentTime;old.gain.gain.cancelScheduledValues(now);old.gain.gain.setTargetAtTime(0,now,.03);try{old.source.stop(now+.15);}catch{} }
 function ambienceSet(id,active=true,duration=Infinity){
  const item=ambienceGet(id);if(!active||item.style==='none'){bedStop();return;}
  if(bedId===item.id)return;
  bedStop();bedId=item.id;
  const source=context.createBufferSource(),gain=context.createGain(),buffer=ambienceBuffer(context,item.style);
  source.buffer=buffer;source.loop=true;source.connect(gain);gain.connect(output);
  const now=context.currentTime;gain.gain.setValueAtTime(0,now);gain.gain.linearRampToValueAtTime(.055,now+.6);
  if(Number.isFinite(duration)){gain.gain.setValueAtTime(.055,now+Math.max(.6,duration-1));gain.gain.linearRampToValueAtTime(0,now+duration);}
  const current={source,gain};bed=current;source.onended=()=>{source.disconnect();gain.disconnect();if(bed===current){bed=null;bedId=null;}};source.start(now);if(Number.isFinite(duration))source.stop(now+duration+.05);
 }
 return {input,stageSet,ambienceSet,get ambience(){return bedId;},dispose(){bedStop();input.disconnect();low.disconnect();high.disconnect();dry.disconnect();room?.reverb.disconnect();room?.wet.disconnect();cache.clear();}};
}

// Overlapped seeded noise joins across the loop seam; modulation is periodic.
// Sixteen seconds of stereo atmosphere; generated once per context and style.
const ambienceCache=new WeakMap();
export function ambienceBuffer(context,style){
 let cache=ambienceCache.get(context);if(!cache){cache=new Map();ambienceCache.set(context,cache);}if(cache.has(style))return cache.get(style);
 const seconds=16,rate=Math.min(12000,context.sampleRate),length=Math.round(rate*seconds),buffer=context.createBuffer(2,length,rate),tau=Math.PI*2;
 for(let channel=0;channel<2;channel++){
  const samples=buffer.getChannelData(channel);let seed=991+channel*71,peak=0;
  const overlap=Math.round(rate),raw=new Float32Array(length+overlap);let smooth=0;
  const damping=style==='rain'?.35:style==='forest'?.7:style==='hearth'?.96:style==='orbit'?.985:.85;
  for(let i=0;i<raw.length;i++){seed=(Math.imul(seed,1664525)+1013904223)>>>0;smooth=smooth*damping+(seed/2147483648-1)*(1-damping);raw[i]=smooth;}
  for(let i=0;i<length;i++){const mix=i<overlap?Math.sin(Math.PI*.5*i/overlap)**2:1;samples[i]=raw[i]*mix+(i<overlap?raw[length+i]*(1-mix):0);}
  for(let i=0;i<length;i++){
   const t=i/length,breath=.55+.45*Math.sin(tau*t*2-channel*.3)**2;
   let value=samples[i]*(style==='rain'?.7:style==='shore'?breath:style==='hearth'?.55+.45*Math.sin(tau*t*19)**8:.45+.25*Math.sin(tau*t*3)**2);
   if(style==='forest')value+=Math.sin(tau*24000*t)*Math.sin(tau*7*t)**12*.5;
   if(style==='orbit')value+=(Math.sin(tau*1760*t)+.4*Math.sin(tau*2640*t))*(.35+.25*Math.sin(tau*t)**2);
   samples[i]=value;peak=Math.max(peak,Math.abs(value));
  }
  for(let i=0;i<length;i++)samples[i]/=Math.max(1,peak);
 }
 cache.set(style,buffer);return buffer;
}
