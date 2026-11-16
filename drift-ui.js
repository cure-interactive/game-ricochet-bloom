import { buttonHTML } from './ui-icon.js?v=b97a13e492ce3889e47a205f1e9246f2161ee728ca7630e71570cedfd636805d';

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
