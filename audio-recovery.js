// Recovery owns output permission, not gameplay pause or musical arrangement.
// Browser facts enter here; effects run only after the new state is installed.
export function audioRecoveryTransition(state,event,facts){
 let next={...state};const effects=[];
 if(state.phase==='disposed')return {state:next,effects};
 if(event==='dispose')return {state:{...next,phase:'disposed',generation:next.generation+1},effects};
 if(event==='leave'||event==='background'){
  if(next.phase==='active'){
   next={...next,phase:'departed',hadOutput:facts.hasContext,welcome:false,generation:next.generation+1};effects.push('hold');
  }else if(next.phase==='waiting')next={...next,phase:'departed',generation:next.generation+1};
  if(event==='background'){next.welcome=next.hadOutput;if(next.welcome&&facts.audible)effects.push('persist');}
  return {state:next,effects};
 }
 if(facts.hidden)return {state:next,effects};
 if(event==='recover'){
  if(next.phase==='waiting')return {state:next,effects};
  if(next.phase==='departed'){
   if(!facts.focused)return {state:next,effects};
   if(next.welcome&&facts.audible&&facts.canRequest){next.phase='waiting';effects.push('welcome');return {state:next,effects};}
   next.phase='active';next.welcome=false;effects.push('clear','release');
  }
  if(facts.active&&facts.audible)effects.push('unlock');
 }else if(event==='acknowledge'){
  if(!facts.focused)return {state:next,effects};
  if(next.phase==='waiting'){next.phase='active';next.welcome=false;effects.push('clear','release');}
  // Continue unlocks collected outputs synchronously, even if their owner
  // becomes active only after the welcome dialog closes.
  if(next.phase==='active'&&facts.audible)effects.push('unlock');
 }else if(event==='running'&&next.phase==='active'&&facts.active&&facts.audible)effects.push('music');
 return {state:next,effects};
}

export function audioRecoveryMount(sound,doc=document,win=window,active=()=>true){
 const pending=value=>{try{if(value===undefined)return win.sessionStorage?.getItem('ricochet-audio-return')==='1';if(value)win.sessionStorage?.setItem('ricochet-audio-return','1');else win.sessionStorage?.removeItem('ricochet-audio-return');}catch{}return false;};
 const saved=pending();let state={phase:saved?'departed':'active',welcome:saved,hadOutput:saved,generation:0},context=null;
 if(saved)sound.outputHold?.();
 const facts=()=>({hidden:!!doc.hidden,focused:doc.hasFocus?.()!==false,active:active(),audible:!sound.isMuted&&sound.volume>0,hasContext:!!sound.context,canRequest:!!doc.dispatchEvent});
 const allowed=()=>state.phase==='active'&&!doc.hidden&&active()&&!sound.isMuted&&sound.volume>0;
 const gestures=['pointerdown','pointerup','touchend','click','keydown'];
 function bind(){
  if(context===sound.context)return;
  context?.removeEventListener?.('statechange',changed);context=sound.context;
  context?.addEventListener?.('statechange',changed);
 }
 function unlock(){
  // Never queue trusted activation behind an unresolved foreground resume.
  const generation=state.generation;let result;
  try{result=sound.unlockAsync();}catch{return Promise.resolve(false);}
  bind();const graph=sound.context,outputGeneration=sound.outputGeneration;
  return Promise.resolve(result).then(value=>{
   if(state.phase==='disposed'||state.generation!==generation||sound.context!==graph||sound.outputGeneration!==outputGeneration)return false;
   if(value!==false&&allowed())sound.musicUpdate();return value;
  }).catch(()=>false);
 }
 function requestWelcome(event){
  const generation=state.generation;let completed=false;
  const resume=()=>{
   if(completed||state.phase==='disposed'||state.generation!==generation)return Promise.resolve(true);
   if(doc.hidden||doc.hasFocus?.()===false)return Promise.resolve(false);
   return Promise.resolve(send('acknowledge')).then(value=>{completed=value!==false;return value;});
  };
  const EventType=win.CustomEvent||globalThis.CustomEvent;
  const request=new EventType('audio-return',{cancelable:true,detail:{resume}});
  doc.dispatchEvent(request);
  if(request.defaultPrevented){if(gestures.includes(event?.type))event.stopImmediatePropagation?.();}
  else return send('acknowledge');
 }
 function send(type,event){
  if(event?.isTrusted===false)return;
  const transition=audioRecoveryTransition(state,type,facts());state=transition.state;let result=true;
  for(const effect of transition.effects){
   if(effect==='hold')sound.outputHold?.();
   else if(effect==='release')sound.outputRelease?.();
   else if(effect==='persist')pending(true);
   else if(effect==='clear')pending(false);
   else if(effect==='welcome')result=requestWelcome(event);
   else if(effect==='unlock')result=unlock();
   else if(effect==='music')sound.musicUpdate();
  }
  bind();return result;
 }
 function changed(){
  // An OS interruption is not permission to resume. Only foreground or
  // activation retries; retired graph notifications have no authority.
  if(context===sound.context&&context?.state==='running')send('running');
 }
 const leave=event=>send('leave',event),background=event=>send('background',event);
 const visible=event=>send(doc.hidden?'background':'recover',event);
 const departure=event=>{if(doc.hidden)background(event);};
 const activate=event=>send('recover',event);
 for(const name of gestures)doc.addEventListener(name,activate,{capture:true,passive:true});
 // Capture before ordinary pause listeners so the detached graph can fade.
 doc.addEventListener('visibilitychange',departure,true);
 doc.addEventListener('visibilitychange',visible);win.addEventListener('pageshow',visible);win.addEventListener('focus',visible);bind();
 const windowBlur=event=>{if(!event.target||event.target===win)leave(event);};
 win.addEventListener('pagehide',background,true);win.addEventListener('blur',windowBlur,true);doc.addEventListener('freeze',background,true);
 if(doc.hasFocus?.())visible();
 return ()=>{send('dispose');context?.removeEventListener?.('statechange',changed);for(const name of gestures)doc.removeEventListener(name,activate,true);doc.removeEventListener('visibilitychange',departure,true);doc.removeEventListener('visibilitychange',visible);doc.removeEventListener('freeze',background,true);win.removeEventListener('pageshow',visible);win.removeEventListener('focus',visible);win.removeEventListener('pagehide',background,true);win.removeEventListener('blur',windowBlur,true);};
}
