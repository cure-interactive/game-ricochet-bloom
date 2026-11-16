// Retry browser audio permission at gestures and after interruptions, without
// changing the game's pause state or the player's mute/volume preferences.
export function audioRecoveryMount(sound,doc=document,win=window,active=()=>true){
 let context=null,attempted=false,disposed=false,departed=false;
 const allowed=()=>!disposed&&!doc.hidden&&active()&&!sound.isMuted&&sound.volume>0;
 function bind(){
  if(context===sound.context)return;
  context?.removeEventListener?.('statechange',changed);context=sound.context;attempted=false;
  context?.addEventListener?.('statechange',changed);
 }
 function recover(event,prime=false){
  if(event?.isTrusted===false||disposed||doc.hidden)return;
  // Release before the active-owner check: menu visibility may be updated by
  // a later listener, whose direct unlock must also start a fresh graph.
  if(departed){departed=false;sound.outputRelease?.();}
  if(!allowed())return;
  bind();
  // A running state alone does not prove the output route was unlocked. Keep
  // source priming inside real activation, even after a provisional resume.
  if(!prime&&context?.state==='running'&&!sound.clockStalled?.()){sound.media?.retry();sound.musicUpdate();return;}
  try{Promise.resolve(sound.unlockAsync()).then(()=>{bind();if(allowed())sound.musicUpdate();}).catch(()=>{});bind();}catch{}
 }
 function changed(){
  if(context?.state==='running'){attempted=false;if(allowed())sound.musicUpdate();}
  else if(!attempted&&allowed()){attempted=true;recover();}
 }
 // Focus/foreground is our first opportunity, including a fresh context.
 // If autoplay rejects it, the next real activation retries synchronously;
 // never queue that gesture behind an unresolved foreground resume promise.
 const leave=event=>{if(event?.isTrusted===false||departed)return;departed=true;sound.outputHold?.();bind();};
 const visible=event=>{if(doc.hidden)leave(event);else recover(event,true);};
 const activate=event=>recover(event,true);
 const gestures=['pointerdown','pointerup','touchend','click','keydown'];
 for(const name of gestures)doc.addEventListener(name,activate,{capture:true,passive:true});
 doc.addEventListener('visibilitychange',visible);win.addEventListener('pageshow',visible);win.addEventListener('focus',visible);bind();
 win.addEventListener('pagehide',leave);win.addEventListener('blur',leave);
 doc.addEventListener('freeze',leave);
 if(doc.hasFocus?.())visible();
 return ()=>{disposed=true;context?.removeEventListener?.('statechange',changed);for(const name of gestures)doc.removeEventListener(name,activate,true);doc.removeEventListener('visibilitychange',visible);doc.removeEventListener('freeze',leave);win.removeEventListener('pageshow',visible);win.removeEventListener('focus',visible);win.removeEventListener('pagehide',leave);win.removeEventListener('blur',leave);};
}
