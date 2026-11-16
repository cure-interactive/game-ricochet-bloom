import {soundstageGet,ambienceGet} from './music-environment.js?v=5b1988e50253a514f7dd89a12a36a17f8292a9118e212e49e82b91dee76f069a';

// One music-only acoustic graph, shared by playback, auditions and WAV export.
// No feedback loop: all reverberation has a finite, bounded impulse response.
export function audioEnvironment(context,output){
 const input=context.createGain(),low=context.createBiquadFilter(),high=context.createBiquadFilter(),dry=context.createGain();
 low.type='lowpass';low.frequency.value=2200;low.Q.value=.5;high.type='highpass';high.frequency.value=70;
 input.connect(low);low.connect(high);high.connect(dry);dry.connect(output);
 let stage=null,room=null,bed=null,bedId=null;const cache=new Map(),retired=[];
 const disconnectRoom=old=>{high.disconnect(old.reverb);old.reverb.disconnect();old.wet.disconnect();};
 function stageSet(id){
  for(let i=retired.length-1;i>=0;i--)if(context.currentTime>=retired[i].until){disconnectRoom(retired[i]);retired.splice(i,1);}
  const next=soundstageGet(id);if(stage===next.id)return;stage=next.id;
  if(room){const gain=room.wet.gain,now=context.currentTime;if(gain.cancelAndHoldAtTime)gain.cancelAndHoldAtTime(now);else{gain.cancelScheduledValues(now);gain.setValueAtTime(gain.value,now);}gain.linearRampToValueAtTime(0,now+.2);retired.push({...room,until:now+.2});}
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
 return {input,stageSet,ambienceSet,get stage(){return stage;},get ambience(){return bedId;},dispose(){bedStop();input.disconnect();low.disconnect();high.disconnect();dry.disconnect();room?.reverb.disconnect();room?.wet.disconnect();for(const old of retired){old.reverb.disconnect();old.wet.disconnect();}retired.length=0;cache.clear();}};
}

// Long, seamless atmospheres. Recent buffers are shared across live playback
// and auditions, with a bounded cache on memory-constrained devices.
const ambienceCache=new WeakMap();
export function ambienceBuffer(context,style){
 let cache=ambienceCache.get(context);if(!cache){cache=new Map();ambienceCache.set(context,cache);}
 if(cache.has(style)){const buffer=cache.get(style);cache.delete(style);cache.set(style,buffer);return buffer;}
 const seconds=48,rate=Math.min(12000,context.sampleRate),length=Math.round(rate*seconds),buffer=context.createBuffer(2,length,rate),tau=Math.PI*2;
 for(let channel=0;channel<2;channel++){
  const samples=buffer.getChannelData(channel);let seed=991+channel*71;
  const random=()=>{seed=(Math.imul(seed,1664525)+1013904223)>>>0;return seed/4294967296;};
  const overlap=Math.round(rate),raw=new Float32Array(length+overlap);let smooth=0;
  const damping=style==='rain'?.35:style==='hearth'?.995:style==='forest'?.975:.85;
  if(style!=='orbit')for(let i=0;i<raw.length;i++){smooth=smooth*damping+(random()*2-1)*(1-damping);raw[i]=smooth;}
  for(let i=0;i<length;i++){
   const t=i/length,time=i/rate,mix=i<overlap?Math.sin(Math.PI*.5*i/overlap)**2:1;
   const noise=raw[i]*mix+(i<overlap?raw[length+i]*(1-mix):0),breath=.55+.45*Math.sin(tau*t*5-channel*.3)**2;
   let value=noise*(style==='rain'?.7:style==='shore'?breath:style==='hearth'?.5:.22);
   if(style==='orbit')value=(Math.sin(tau*110*time)+.4*Math.sin(tau*165*time)+.12*Math.sin(tau*66*time))*(.32+.16*Math.sin(tau*t*2+channel*.35)**2);
   if(style==='hearth')value+=.035*Math.sin(tau*50*time)*(.6+.4*Math.sin(tau*t*7)**2);
   samples[i]=value;
  }
  // Sparse, varied phrases with smooth attacks and releases, never a rapid
  // periodic gate. Every phrase finishes before the shared loop seam.
  if(style==='forest'||style==='hearth'){
   for(let at=.7+random();at<seconds-2;at+=1.5+random()*3.5){
    const duration=style==='forest'?.22+random()*.5:.18+random()*.6;
    const count=Math.round(duration*rate),offset=Math.round(at*rate),pitch=1200+random()*900,sweep=(random()-.5)*400,level=.07+random()*.1;
    for(let j=0;j<count;j++){
     const t=j/rate,envelope=Math.sin(Math.PI*j/count)**2;
     const voice=style==='forest'?Math.sin(tau*(pitch*t+sweep*t*t*.5)):raw[offset+j]*2;
     samples[offset+j]+=voice*envelope*level;
    }
   }
  }
  let peak=1;for(const value of samples)peak=Math.max(peak,Math.abs(value));
  for(let i=0;i<length;i++)samples[i]/=peak;
 }
 cache.set(style,buffer);while(cache.size>3)cache.delete(cache.keys().next().value);return buffer;
}
