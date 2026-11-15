import {buttonHTML} from './ui-icon.js?v=e77c8634175296f7fa7b6ad85ade1b42bdf0d89af6f8099b5d6206fb97d7a067';
export function treeSwitchHTML(current){
 return `<nav class="tree-switch" data-current="${current}" aria-label="Skills Views"><span class="tree-switch-selection" aria-hidden="true"></span>${[['powers','Powers','powers'],['player','Player','player-skin']].map(([id,label,icon])=>buttonHTML(label,icon,{'data-tree-view':id,'aria-pressed':id===current})).join('')}</nav>`;
}
export function treeSwitchMount(dialog,current,change){
 let drag=null,suppressClick=false;
 function select(view,old){
  if(view!==current)change(view);
  const nav=dialog.ownerDocument.querySelector(`dialog[open] .tree-switch[data-current="${view}"]`),pill=nav?.querySelector('.tree-switch-selection');
  if(!pill?.animate)return;
  // Both trees have their own dialog. Transfer the visible pill position into
  // the newly opened shared control, including an interrupted reverse slide.
  for(const animation of pill.getAnimations())animation.cancel();
  const destination=pill.getBoundingClientRect();
  const dx=old.left-destination.left,ratio=old.width/Math.max(1,destination.width),direction=Math.sign(dx);
  pill.animate([
   {offset:0,translate:`${dx}px 0`,scale:`${ratio} 1`},
   {offset:.36,translate:`${dx*.28}px 0`,scale:'1.12 .94'},
   {offset:.64,translate:`${-direction*5}px 0`,scale:'.97 1.03'},
   {offset:.82,translate:`${direction*2}px 0`,scale:'1.02 .99'},
   {offset:1,translate:'0 0',scale:'1 1'}
  ],{duration:480,easing:'ease-out'});
 }
 dialog.addEventListener('click',event=>{
  const view=event.target.closest('[data-tree-view]')?.dataset.treeView;
  if(!view)return;
  if(suppressClick){suppressClick=false;event.preventDefault();event.stopPropagation();return;}
  if(view!==current)select(view,dialog.querySelector('.tree-switch-selection').getBoundingClientRect());
 });
 dialog.addEventListener('pointerdown',event=>{
  const nav=event.target.closest('.tree-switch');if(!nav||event.button!==0)return;
  suppressClick=false;const pill=nav.querySelector('.tree-switch-selection');
  drag={id:event.pointerId,x:event.clientX,y:event.clientY,nav,pill,moved:false};
 });
 dialog.addEventListener('pointermove',event=>{
  if(drag?.id!==event.pointerId)return;
  const dx=event.clientX-drag.x,dy=event.clientY-drag.y;
  if(!drag.moved&&Math.abs(dy)>Math.abs(dx)+6){drag=null;return;}
  if(!drag.moved&&Math.abs(dx)<6)return;
  if(!drag.moved){drag.moved=true;drag.nav.setPointerCapture(event.pointerId);for(const a of drag.pill.getAnimations())a.cancel();}
  event.preventDefault();event.stopPropagation();
  const width=drag.nav.getBoundingClientRect().width/2,start=current==='player'?width:0;
  const raw=start+dx,bounded=Math.max(0,Math.min(width,raw)),rubber=(raw-bounded)*.18;
  drag.pill.style.translate=`${bounded+rubber-start}px 0`;drag.pill.style.scale=`${1+Math.min(.08,Math.abs(dx)/width*.04)} .98`;
 });
 const finish=event=>{
  if(drag?.id!==event.pointerId)return;const d=drag;drag=null;if(!d.moved)return;
  const old=d.pill.getBoundingClientRect(),nav=d.nav.getBoundingClientRect();
  const view=event.type==='pointerup'?(old.left+old.width/2>nav.left+nav.width/2?'player':'powers'):current;
  d.pill.style.translate='';d.pill.style.scale='';suppressClick=true;
  if(d.nav.hasPointerCapture(event.pointerId))d.nav.releasePointerCapture(event.pointerId);
  select(view,old);
 };
 for(const name of ['pointerup','pointercancel','lostpointercapture'])dialog.addEventListener(name,finish);
 dialog.addEventListener('close',()=>{if(drag){drag.pill.style.translate='';drag.pill.style.scale='';drag=null;}});
}
