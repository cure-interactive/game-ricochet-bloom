import {PoolSound} from './sound.js?v=2154b7966424ef62803452c267bd48d5f9bfe734c106acbe5e3d86c7cbc6c9bd';
import {audioRecoveryMount} from './audio-recovery.js?v=a85fb9a491488097c2b0f96035839660330aad8818886f416d27aece76e4a1a1';

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
  update(bodies,portrait){sync();sound.portrait=portrait;sound.musicUpdate(bodies.reduce((sum,b)=>sum+Math.hypot(b.vx,b.vy),0)/(Math.max(1,bodies.length)*100));},
  active(value){active=value;sync();sound.pauseSet(!value);},
  unlock(){sync();if(active&&!sound.isMuted&&sound.volume>0&&sound.ambience>0&&sound.context?.state!=='running')void sound.unlockAsync().catch(()=>{});},
  reset(){sound.musicRestore(null,0,0);},
  get diagnostics(){return {bars:sound.music.bar,effectEvents:sound.eventCount,voices:sound.voiceCount,state:sound.isPaused?'paused':sound.context?.state||'locked'};},
 };
}
