// One delegated route covers mouse, touch and keyboard-activated controls.
// Unlock stays in the gesture; the cue follows the action's mute/volume changes.
export function uiSoundFeedback(sound,doc=document,clock=()=>performance.now()){
 let latest=0;
 return function play(kind){
  if(doc.hidden||sound.isMuted||!sound.volume)return;
  const ticket=++latest,at=clock();
  const report=()=>{if(doc.documentElement?.dataset){doc.documentElement.dataset.uiSoundState=sound.context?.state||'locked';doc.documentElement.dataset.uiSounds=String(sound.uiCount||0);}};
  try{
   const ready=sound.context?.state==='running'?true:sound.unlockAsync();
   const context=sound.context;
   Promise.resolve(ready).then(ok=>{if(ok&&ticket===latest&&clock()-at<150&&context===sound.context&&!doc.hidden&&!sound.isMuted&&sound.volume)sound.uiPlay(kind);report();}).catch(()=>{report();});
  }catch{report();}
 };
}
// Components report signed movement; the delegated audio owner sets its sound.
export function uiWind(target,delta,event){
 if(event?.isTrusted===false||!Number.isFinite(delta)||!delta)return;
 const EventType=target.ownerDocument?.defaultView?.CustomEvent||globalThis.CustomEvent;
 target.dispatchEvent(new EventType('ui-wind',{bubbles:true,detail:{type:'wind',delta}}));
}
export function uiSoundMount(sound,doc=document,play=uiSoundFeedback(sound,doc)){
 const wind=event=>play(event.detail);
 function click(event){
  if(event.isTrusted===false)return;
  const button=event.target?.closest?.('button,a[href],summary,[role="button"],[role="tab"]');
  if(!button||button.disabled||button.getAttribute('aria-disabled')==='true')return;
  const icon=button.querySelector('[data-icon]')?.dataset.icon;
  play(icon==='close'||icon==='arrow-left'?'back':button.classList.contains('primary')?'confirm':'select');
 }
 function change(event){
  if(event.isTrusted===false)return;
  if(event.target?.matches?.('select,input[type="checkbox"],input[type="radio"]')&&!event.target.disabled)play('select');
 }
 doc.addEventListener('click',click,true);
 doc.addEventListener('change',change);
 doc.addEventListener('ui-wind',wind);
 return ()=>{doc.removeEventListener('click',click,true);doc.removeEventListener('change',change);doc.removeEventListener('ui-wind',wind);};
}
