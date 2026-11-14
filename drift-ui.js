import { buttonHTML } from './ui-icon.js?v=6ec8a4ba31addd578a8b719304a1ec4bd9a40353abff6d30f299787bf0d2481c';
import { screenHeader } from './screen-header.js?v=883c141deaf0d60097c4b99c555371897614dfd0bde5d3229b4a41e5450222e0';

// Presentation only: the shared menu pool owns simulation and ambient audio.
export function driftMount(host,doc=document){
 const controls=doc.createElement('section');controls.id='drift-controls';controls.hidden=true;controls.setAttribute('aria-label','Drift');
 controls.innerHTML=buttonHTML('','pause',{id:'drift-pause','aria-label':'Pause Drift',title:'Pause Drift'});
 const panel=doc.createElement('dialog');panel.id='drift-dialog';panel.setAttribute('aria-labelledby','drift-title');
 panel.innerHTML=`${screenHeader({title:'Drift Paused',titleId:'drift-title',icon:'pause',back:buttonHTML('Close','close',{id:'drift-close'})})}<div class="drift-actions"><p>No Points or medals. Just enjoy the pool.</p>${buttonHTML('Resume','play',{id:'drift-resume',class:'primary'})}${buttonHTML('Gamemodes','grid',{id:'drift-modes'})}${buttonHTML('Main Menu','grid',{id:'drift-home'})}</div>`;
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
