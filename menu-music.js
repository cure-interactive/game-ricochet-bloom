import {PoolSound} from './sound.js?v=e7ba7868fd93893fafe9b1cfb8befc55911242bf939b9c4960d50aea1d529b5a';
import {audioRecoveryMount} from './audio-recovery.js?v=c91d1ceb05a63ab8b95902015ad3e9494d637ae11904748f7d95d1422772405e';

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
