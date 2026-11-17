// Retry browser audio permission at gestures and after interruptions, without
// changing the game's pause state or the player's mute/volume preferences.
export function audioRecoveryMount(sound,doc=document,win=window,active=()=>true){
 const pending=value=>{try{if(value===undefined)return win.sessionStorage?.getItem('ricochet-audio-return')==='1';if(value)win.sessionStorage?.setItem('ricochet-audio-return','1');else win.sessionStorage?.removeItem('ricochet-audio-return');}catch{}return false;};
 let context=null,disposed=false,needsWelcome=pending(),departed=needsWelcome,waiting=false,hadOutput=needsWelcome;
 if(departed)sound.outputHold?.();
 const allowed=()=>!disposed&&!departed&&!doc.hidden&&active()&&!sound.isMuted&&sound.volume>0;
 function bind(){
  if(context===sound.context)return;
  context?.removeEventListener?.('statechange',changed);context=sound.context;
  context?.addEventListener?.('statechange',changed);
 }
 function recover(event,prime=false,foreground=false){
  if(event?.isTrusted===false||disposed||doc.hidden)return;
  if(waiting)return;
  // Release before the active-owner check: menu visibility may be updated by
  // a later listener, whose direct unlock must also start a fresh graph.
  if(departed){
   if(!foreground||doc.hasFocus?.()===false)return;
   if(needsWelcome&&!sound.isMuted&&sound.volume>0&&doc.dispatchEvent){
    const EventType=win.CustomEvent||globalThis.CustomEvent;
    const request=new EventType('audio-return',{cancelable:true,detail:{resume(){
     waiting=false;needsWelcome=false;departed=false;pending(false);sound.outputRelease?.();
     if(doc.hidden||sound.isMuted||!sound.volume)return Promise.resolve(true);
     const result=sound.unlockAsync();bind();return result;
    }}});
    doc.dispatchEvent(request);if(request.defaultPrevented){waiting=true;if(gestures.includes(event?.type))event.stopImmediatePropagation?.();return;}
   }
   needsWelcome=false;departed=false;pending(false);sound.outputRelease?.();
  }
  if(!allowed())return;
  bind();
  // A running state alone does not prove the output route was unlocked. Keep
  // source priming inside real activation, even after a provisional resume.
  if(!prime&&context?.state==='running'&&!sound.clockStalled?.()){sound.media?.retry();sound.musicUpdate();return;}
  try{Promise.resolve(sound.unlockAsync()).then(()=>{bind();if(allowed())sound.musicUpdate();}).catch(()=>{});bind();}catch{}
 }
 function changed(){
  // iOS can interrupt the context before blur/visibilitychange. Resuming here
  // fights that interruption. Only a positive foreground/activation retries.
  if(context?.state==='running'&&allowed())sound.musicUpdate();
 }
 // Focus/foreground is our first opportunity, including a fresh context.
 // If autoplay rejects it, the next real activation retries synchronously;
 // never queue that gesture behind an unresolved foreground resume promise.
 const leave=event=>{if(event?.isTrusted===false||departed)return;hadOutput=!!sound.context;departed=true;sound.outputHold?.();bind();};
 const background=event=>{if(event?.isTrusted===false)return;leave(event);needsWelcome=hadOutput;if(needsWelcome&&!sound.isMuted&&sound.volume>0)pending(true);};
 const visible=event=>{if(doc.hidden)background(event);else recover(event,true,true);};
 const departure=event=>{if(doc.hidden)background(event);};
 const activate=event=>recover(event,true,true);
 const gestures=['pointerdown','pointerup','touchend','click','keydown'];
 for(const name of gestures)doc.addEventListener(name,activate,{capture:true,passive:true});
 // Capture departure before ordinary pause listeners stop individual voices;
 // the detached graph must retain those voices until its output fade finishes.
 doc.addEventListener('visibilitychange',departure,true);
 doc.addEventListener('visibilitychange',visible);win.addEventListener('pageshow',visible);win.addEventListener('focus',visible);bind();
 // Captured blur also sees every input/button losing focus. Only the window
 // departing may retire audio; ordinary focus movement must keep its graph.
 const windowBlur=event=>{if(!event.target||event.target===win)leave(event);};
 win.addEventListener('pagehide',background,true);win.addEventListener('blur',windowBlur,true);
 doc.addEventListener('freeze',background,true);
 if(doc.hasFocus?.())visible();
 return ()=>{disposed=true;context?.removeEventListener?.('statechange',changed);for(const name of gestures)doc.removeEventListener(name,activate,true);doc.removeEventListener('visibilitychange',departure,true);doc.removeEventListener('visibilitychange',visible);doc.removeEventListener('freeze',background,true);win.removeEventListener('pageshow',visible);win.removeEventListener('focus',visible);win.removeEventListener('pagehide',background,true);win.removeEventListener('blur',windowBlur,true);};
}
