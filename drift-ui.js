import { buttonHTML } from './ui-icon.js?v=b24f7ce2c068f52a69b32f410f4eb83685b949c9f2d77286fc6e72083b51fedb';

// Presentation only: the shared menu pool owns simulation and ambient audio.
export function driftMount(host,doc=document){
 const controls=doc.createElement('section');controls.id='drift-controls';controls.hidden=true;controls.setAttribute('aria-label','Casual');
 controls.innerHTML=buttonHTML('','pause',{id:'drift-pause','aria-label':'Pause Casual',title:'Pause Casual'});
 doc.body.append(controls);
 const pause=controls.querySelector('#drift-pause');let screen='';
 pause.onclick=host.pause;
 doc.addEventListener('keydown',event=>{
  if(event.repeat||event.ctrlKey||event.metaKey||event.altKey||event.target?.matches('input,select,textarea'))return;
  if(screen==='drift'&&(event.key==='Escape'||event.key.toLowerCase()==='p')){event.preventDefault();host.pause();}
  else if(screen==='drift-pause'&&event.key.toLowerCase()==='p'){
   const dialogs=doc.querySelectorAll('dialog[open]');
   if(dialogs.length===1&&dialogs[0].id==='menu-dialog'){event.preventDefault();host.resume();}
  }
 });
 return {show(name){
  const changed=screen!==name;screen=name;controls.hidden=name!=='drift';
  if(name==='drift'&&changed)pause.focus({preventScroll:true});
 }};
}
