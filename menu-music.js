import {PoolSound} from './sound.js?v=c359d93050d39869c2185a6f5eec9121e16270403e3fe509a0a1dedbcf003a21';
import {audioRecoveryMount} from './audio-recovery.js?v=80fda178ed04bc75426c8a2a5c9201279337ca3cc7bdb8eb55441c00ac509982';

// Detached composition uses the game's finished arrangement/scheduler only.
// Events teach the composer, but never play collision, launch or power sounds.
export function menuMusicCreate(settings, sound=new PoolSound({media:false})){
 let active=false,preferences='';
 function sync(){
  const value=settings(),key=JSON.stringify(value);
  if(key!==preferences){preferences=key;sound.musicTheme=value.musicTheme;sound.musicLoadout=value.musicLoadout;sound.settingsSet(value.volume,value.muted);sound.ambienceSet(value.ambience);}
 }
 function unlock(){sync();if(active&&!sound.isMuted&&sound.volume>0)void sound.unlockAsync().catch(()=>{});}
 sound.musicStart();sound.pauseSet(true);
 if(typeof document!=='undefined')audioRecoveryMount(sound,document,window,()=>{sync();return active;});
 return {
  get audio(){return active?sound:null;},
  event(event){sound.eventPlay(event,{effects:false});},
  cosmetic(event,loadout){sync();if(active)sound.cosmeticPlay(loadout,event);},
  travel(loadout,body,enabled){sync();sound.cosmeticTravel(loadout,body,active&&enabled);},
  cosmeticStop(){sound.cosmeticStop();},
  update(bodies,portrait){sync();sound.portrait=portrait;sound.musicUpdate(bodies.reduce((sum,b)=>sum+Math.hypot(b.vx,b.vy),0)/(Math.max(1,bodies.length)*100));},
  active(value){const entering=value&&!active;active=value;sync();sound.pauseSet(!value);if(entering)unlock();},
  unlock(){if(sound.context?.state!=='running')unlock();},
  reset(){sound.musicRestore(null,0,0);},
  get diagnostics(){return {preview:sound.previewSelection?.id||'',soundstage:sound.musicEnvironment?.stage||'',ambience:sound.musicEnvironment?.ambience||'',bars:sound.music.bar,effectEvents:sound.eventCount,voices:sound.voiceCount,state:sound.isPaused?'paused':sound.context?.state||'locked'};},
 };
}
