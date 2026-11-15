import {PoolSound} from './sound.js?v=5da07fec8dab2c418c3da527e89c5d819ad9dcc08494fdeea12510ddc75c4a4c';
import {audioRecoveryMount} from './audio-recovery.js?v=d57b363d06436356ab5fb4205ec5e5b1764e6f4d10c9811c651be0c92b732586';

// Detached composition uses the game's finished arrangement/scheduler only.
// Events teach the composer, but never play collision, launch or power sounds.
export function menuMusicCreate(settings, sound=new PoolSound({media:false})){
 let active=false,preferences='';
 function sync(){
  const value=settings(),key=JSON.stringify(value);
  if(key!==preferences){preferences=key;sound.settingsSet(value.volume,value.muted);sound.ambienceSet(value.ambience);}
 }
 sound.musicStart();sound.pauseSet(true);
 if(typeof document!=='undefined')audioRecoveryMount(sound,document,window,()=>{sync();return active;});
 return {
  event(event){sound.eventPlay(event,{effects:false});},
  cosmetic(event,loadout){sync();if(active)sound.cosmeticPlay(loadout,event);},
  cosmeticStop(){sound.cosmeticStop();},
  update(bodies,portrait){sync();sound.portrait=portrait;sound.musicUpdate(bodies.reduce((sum,b)=>sum+Math.hypot(b.vx,b.vy),0)/(Math.max(1,bodies.length)*100));},
  active(value){active=value;sync();sound.pauseSet(!value);},
  unlock(){sync();if(active&&!sound.isMuted&&sound.volume>0&&sound.context?.state!=='running')void sound.unlockAsync().catch(()=>{});},
  reset(){sound.musicRestore(null,0,0);},
  get diagnostics(){return {bars:sound.music.bar,effectEvents:sound.eventCount,voices:sound.voiceCount,state:sound.isPaused?'paused':sound.context?.state||'locked'};},
 };
}
