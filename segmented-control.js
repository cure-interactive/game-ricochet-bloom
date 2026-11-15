import {escapeHTML} from './ui-text.js?v=02f24218cfade2c1cf218f107876f5365ad03a4287cebbb4b8e0817ce89eb0d0';
export function segmentedHTML(buttons,{label,current,className=''}){
 return `<nav class="segmented-control ${escapeHTML(className)}" data-current="${escapeHTML(current)}" aria-label="${escapeHTML(label)}" style="--segment-count:${buttons.length}"><span class="segment-selection" aria-hidden="true"></span>${buttons.join('')}</nav>`;
}
// Works within one panel or across dialogs. The caller owns destinations only.
export function segmentedMount(root,{attribute,change}){
 const doc=root.ownerDocument,win=doc.defaultView,selector=`[${attribute}]`;
 let drag=null,suppressClick=false,frame=0,followNav=null;
 const buttons=nav=>[...nav.querySelectorAll(selector)];
 const value=button=>button.getAttribute(attribute);
 function position(nav){
  const selected=buttons(nav).find(b=>value(b)===nav.dataset.current),pill=nav.querySelector('.segment-selection');
  if(!selected||!nav.getClientRects().length)return;
  const n=nav.getBoundingClientRect(),b=selected.getBoundingClientRect();
  pill.style.left=`${b.left-n.left-nav.clientLeft}px`;pill.style.width=b.width+'px';
 }
 function contrast(nav){
  const pill=nav.querySelector('.segment-selection').getBoundingClientRect();
  for(const button of buttons(nav)){
   const label=button.querySelector('span:not(.ui-icon)'),icon=button.querySelector('.ui-icon');
   if(label){const r=label.getBoundingClientRect(),left=Math.max(0,Math.min(r.width,pill.left-r.left)),right=Math.max(0,Math.min(r.width,pill.right-r.left));label.style.backgroundImage=`linear-gradient(to right,#dceeea 0px,#dceeea ${left}px,#12332e ${left}px,#12332e ${right}px,#dceeea ${right}px)`;}
   if(icon){const r=icon.getBoundingClientRect();icon.style.color=r.left+r.width/2>=pill.left&&r.left+r.width/2<=pill.right?'#12332e':'#dceeea';}
  }
 }
 function follow(nav){followNav=nav;win.cancelAnimationFrame(frame);const tick=()=>{contrast(nav);frame=nav.querySelector('.segment-selection').getAnimations().length?win.requestAnimationFrame(tick):0;};tick();}
 function select(nav,next,old){
  if(next!==nav.dataset.current)nav=change(next)||nav;
  nav.dataset.current=next;for(const button of buttons(nav))button.setAttribute('aria-pressed',String(value(button)===next));
  const pill=nav.querySelector('.segment-selection');for(const a of pill.getAnimations())a.cancel();position(nav);
  const end=pill.getBoundingClientRect(),dx=old.left-end.left;
  pill.animate?.([{translate:`${dx}px 0`,scale:`${old.width/Math.max(1,end.width)} 1`},{offset:.65,translate:`${dx*.03}px 0`,scale:'.96 1'},{translate:'0 0',scale:'1 1'}],{duration:420,easing:'ease-out'});follow(nav);
 }
 root.addEventListener('click',e=>{const button=e.target.closest(selector),nav=button?.closest('.segmented-control');if(!nav)return;if(suppressClick){suppressClick=false;e.preventDefault();e.stopPropagation();return;}select(nav,value(button),nav.querySelector('.segment-selection').getBoundingClientRect());});
 root.addEventListener('pointerdown',e=>{const nav=e.target.closest('.segmented-control');if(!nav||e.button!==0)return;suppressClick=false;const pill=nav.querySelector('.segment-selection');drag={id:e.pointerId,x:e.clientX,y:e.clientY,nav,pill,moved:false,start:pill.getBoundingClientRect().left};});
 root.addEventListener('pointermove',e=>{
  if(drag?.id!==e.pointerId)return;const dx=e.clientX-drag.x,dy=e.clientY-drag.y;
  if(!drag.moved&&Math.abs(dy)>Math.abs(dx)+6){drag=null;return;}if(!drag.moved&&Math.abs(dx)<6)return;
  if(!drag.moved){drag.moved=true;drag.nav.setPointerCapture(e.pointerId);for(const a of drag.pill.getAnimations())a.cancel();position(drag.nav);}
  e.preventDefault();e.stopPropagation();const rects=buttons(drag.nav).map(b=>b.getBoundingClientRect()),min=Math.min(...rects.map(r=>r.left)),max=Math.max(...rects.map(r=>r.right))-drag.pill.getBoundingClientRect().width;
  const base=parseFloat(drag.pill.style.left)+drag.nav.getBoundingClientRect().left+drag.nav.clientLeft;
  drag.pill.style.translate=`${Math.max(min,Math.min(max,drag.start+dx))-base}px 0`;contrast(drag.nav);
 });
 const finish=e=>{if(drag?.id!==e.pointerId)return;const d=drag;drag=null;if(!d.moved)return;const old=d.pill.getBoundingClientRect(),center=old.left+old.width/2;
  const next=e.type==='pointerup'?value(buttons(d.nav).sort((a,b)=>{const ar=a.getBoundingClientRect(),br=b.getBoundingClientRect();return Math.abs(ar.left+ar.width/2-center)-Math.abs(br.left+br.width/2-center);})[0]):d.nav.dataset.current;
  d.pill.style.translate='';suppressClick=true;if(d.nav.hasPointerCapture(e.pointerId))d.nav.releasePointerCapture(e.pointerId);select(d.nav,next,old);
 };
 for(const name of ['pointerup','pointercancel','lostpointercapture'])root.addEventListener(name,finish);
 const refresh=()=>{for(const nav of root.querySelectorAll('.segmented-control')){position(nav);contrast(nav);}};
 root.addEventListener('close',()=>{if(!followNav||root.contains(followNav))win.cancelAnimationFrame(frame);if(drag){drag.pill.style.translate='';drag=null;}});
 new win.MutationObserver(refresh).observe(root,{attributes:true,attributeFilter:['open']});
 new win.MutationObserver(refresh).observe(doc.body,{attributes:true,attributeFilter:['data-left-handed']});
 win.addEventListener('resize',refresh);return {refresh};
}
