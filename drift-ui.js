import { buttonHTML } from './ui-icon.js?v=c80973e44aaefb9769e151ec4746d8d0a0a1f5288dcb1c3e24c1fac2286b0658';
import { screenHeader } from './screen-header.js?v=a0375361ae407ee8e60d3ed09355baf5bb084d84a2dc95aab41b05185b186b82';

// Presentation only: the shared menu pool owns simulation and ambient audio.
export function driftMount(host,doc=document){
 const controls=doc.createElement('section');controls.id='drift-controls';controls.hidden=true;controls.setAttribute('aria-label','Casual');
 controls.innerHTML=buttonHTML('','pause',{id:'drift-pause','aria-label':'Pause Casual',title:'Pause Casual'});
 const panel=doc.createElement('dialog');panel.id='drift-dialog';panel.setAttribute('aria-labelledby','drift-title');
 panel.innerHTML=`${screenHeader({title:'Casual Paused',titleId:'drift-title',icon:'pause',back:buttonHTML('Close','close',{id:'drift-close'})})}<div class="drift-actions"><p>No Points or medals. Just enjoy the pool.</p>${buttonHTML('Resume','play',{id:'drift-resume',class:'primary'})}${buttonHTML('Gamemodes','grid',{id:'drift-modes'})}${buttonHTML('Main Menu','grid',{id:'drift-home'})}</div>`;
 doc.body.append(controls,panel);
 const pause=controls.querySelector('#drift-pause');let screen='';
 pause.onclick=host.pause;
 for(const [id,action] of [['close','resume'],['resume','resume'],['modes','modes'],['home','home']])panel.querySelector('#drift-'+id).onclick=()=>host[action]();
 panel.addEventListener('cancel',event=>{event.preventDefault();host.resume();});
 doc.addEventListener('keydown',event=>{
  if(event.repeat||event.ctrlKey||event.metaKey||event.altKey)return;
  if(screen==='drift'&&(event.key==='Escape'||event.key.toLowerCase()==='p')){event.preventDefault();host.pause();}
  else if(screen==='drift-pause'&&event.key.toLowerCase()==='p'){event.preventDefault();host.resume();}
 });
 return {show(name){
  const changed=screen!==name;screen=name;controls.hidden=name!=='drift';
  if(name==='drift-pause'){if(!panel.open)panel.showModal();if(changed)panel.querySelector('#drift-resume').focus({preventScroll:true});}
  else {if(panel.open)panel.close();if(name==='drift'&&changed)pause.focus({preventScroll:true});}
 }};
}
