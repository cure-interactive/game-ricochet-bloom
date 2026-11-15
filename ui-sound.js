// One delegated route covers mouse, touch and keyboard-activated controls.
// Unlock stays in the gesture; the cue follows the action's mute/volume changes.
export function uiSoundMount(sound,doc=document){
 function play(kind){
  if(doc.hidden||sound.isMuted||!sound.volume)return;
  const report=()=>{if(doc.documentElement?.dataset){doc.documentElement.dataset.uiSoundState=sound.context?.state||'locked';doc.documentElement.dataset.uiSounds=String(sound.uiCount||0);}};
  try{
   const ready=sound.context?.state==='running'?true:sound.unlockAsync();
   Promise.resolve(ready).then(ok=>{if(ok&&!doc.hidden)sound.uiPlay(kind);report();}).catch(()=>{report();});
  }catch{report();}
 }
 function click(event){
  if(event.isTrusted===false)return;
  const button=event.target?.closest?.('button,a[href],summary,[role="button"],[role="tab"]');
  if(!button||button.disabled||button.getAttribute('aria-disabled')==='true')return;
  const icon=button.querySelector('[data-icon]')?.dataset.icon;
  play(icon==='close'||icon==='arrow-left'?'back':button.classList.contains('primary')?'confirm':'select');
 }
 function change(event){
  if(event.isTrusted===false)return;
  if(event.target?.matches?.('select,input[type="checkbox"],input[type="radio"],input[type="range"]')&&!event.target.disabled)play('select');
 }
 doc.addEventListener('click',click,true);
 doc.addEventListener('change',change);
 return ()=>{doc.removeEventListener('click',click,true);doc.removeEventListener('change',change);};
}
