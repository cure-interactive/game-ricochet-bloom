import {PoolSound} from './sound.js?v=b832b95f1049218f81790d079dd54ee2556c85d3fece111b0e1695ad17e46dc5';
import {audioRecoveryMount} from './audio-recovery.js?v=331a520d868a95d215b7b468c29e1fa0f7aab53824ecc5332618f3aac4cafe98';

// Detached composition uses the game's finished arrangement/scheduler only.
// Events teach the composer, but never play collision, launch or power sounds.
export function menuMusicCreate(settings, sound=new PoolSound({media:false})){
 let active=false,preferences='';
 function sync(){
  const value=settings(),key=JSON.stringify(value);
  if(key!==preferences){preferences=key;sound.musicTheme=value.musicTheme;sound.musicLoadout=value.musicLoadout;sound.settingsSet(value.volume,value.muted);sound.ambienceSet(value.ambience);sound.ambienceVolumeSet(value.ambienceVolume);}
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
