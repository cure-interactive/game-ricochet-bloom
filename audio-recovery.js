// Retry browser audio permission at gestures and after interruptions, without
// changing the game's pause state or the player's mute/volume preferences.
export function audioRecoveryMount(sound,doc=document,win=window,active=()=>true){
 let context=null,attempted=false,disposed=false;
 const allowed=()=>!disposed&&!doc.hidden&&active()&&!sound.isMuted&&sound.volume>0;
 function bind(){
  if(context===sound.context)return;
  context?.removeEventListener?.('statechange',changed);context=sound.context;attempted=false;
  context?.addEventListener?.('statechange',changed);
 }
 function recover(event,gesture=false){
  if(event?.isTrusted===false||!allowed())return;
  bind();
  // A running state alone does not prove the output route was unlocked. Keep
  // source priming inside real activation, even after a provisional resume.
  if(!gesture&&context?.state==='running'&&!sound.clockStalled?.()){sound.media?.retry();sound.musicUpdate();return;}
  try{Promise.resolve(sound.unlockAsync()).then(()=>{bind();if(allowed())sound.musicUpdate();}).catch(()=>{});bind();}catch{}
 }
 function changed(){
  if(context?.state==='running'){attempted=false;if(allowed())sound.musicUpdate();}
  else if(!attempted&&allowed()){attempted=true;recover();}
 }
 const visible=()=>{if(!doc.hidden&&sound.context)recover();};
 const activate=event=>recover(event,true);
 const gestures=['pointerdown','pointerup','touchend','click','keydown'];
 for(const name of gestures)doc.addEventListener(name,activate,{capture:true,passive:true});
 doc.addEventListener('visibilitychange',visible);win.addEventListener('pageshow',visible);win.addEventListener('focus',visible);bind();
 return ()=>{disposed=true;context?.removeEventListener?.('statechange',changed);for(const name of gestures)doc.removeEventListener(name,activate,true);doc.removeEventListener('visibilitychange',visible);win.removeEventListener('pageshow',visible);win.removeEventListener('focus',visible);};
}
