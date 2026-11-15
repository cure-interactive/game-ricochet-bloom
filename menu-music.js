import {PoolSound} from './sound.js?v=1036cac58e3c724300f1f652d6f1c6854280fa02f98737a93a7a66da3066a944';

// Detached composition uses the game's finished arrangement/scheduler only.
// Events teach the composer, but never play collision, launch or power sounds.
export function menuMusicCreate(settings, sound=new PoolSound({media:false})){
 let active=false,preferences='';
 function sync(){
  const value=settings(),key=JSON.stringify(value);
  if(key!==preferences){preferences=key;sound.settingsSet(value.volume,value.muted);sound.ambienceSet(value.ambience);}
 }
 sound.musicStart();sound.pauseSet(true);
 return {
  event(event){sound.eventPlay(event,{effects:false});},
  update(bodies,portrait){sync();sound.portrait=portrait;sound.musicUpdate(bodies.reduce((sum,b)=>sum+Math.hypot(b.vx,b.vy),0)/(Math.max(1,bodies.length)*100));},
  active(value){active=value;sync();sound.pauseSet(!value);},
  unlock(){sync();if(active&&!sound.isMuted&&sound.volume>0&&sound.ambience>0&&sound.context?.state!=='running')void sound.unlockAsync().catch(()=>{});},
  reset(){sound.musicRestore(null,0,0);},
  get diagnostics(){return {bars:sound.music.bar,effectEvents:sound.eventCount,voices:sound.voiceCount,state:sound.isPaused?'paused':sound.context?.state||'locked'};},
 };
}
