import {rememberView} from './navigation-state.js?v=d7ae9a905aacccc9eaf9bbac7fc9b56f9cb442d4e202334ea0b1d7b5f2e82f2a';
import {segmentedPainter} from './segmented-paint.js?v=f3fcc78ca5b54f7fb6d7fce668b601d74b373a11d0d030833ba9c8a52c685508';
import {escapeHTML,titleCase} from './ui-text.js?v=00a346103c56a4d5af4ab71da4939d78074cf899c52e742eaaa1d86760183751';
import {uiWind,uiSelect,uiWindMoved} from './ui-sound.js?v=d2cdaa7255e60e9d5e6d0378ae12d627e9f22d0484f04c179f6c76d6eb3529b5';
export function segmentedHTML(buttons,{label,current,className=''}){
 return `<div class="tab-bar"><nav class="segmented-control ${escapeHTML(className)}" data-current="${escapeHTML(current)}" aria-label="${escapeHTML(titleCase(label))}" style="--segment-count:${buttons.length}"><span class="segment-selection" aria-hidden="true"></span>${buttons.join('')}</nav></div>`;
}
// Works within one panel or across dialogs. The caller owns destinations only.
export function segmentedMount(root,{attribute,change}){
 const doc=root.ownerDocument,win=doc.defaultView,selector=`[${attribute}]`;
 const draw=segmentedPainter(doc,win),positioned=new WeakSet();
 let drag=null,suppressClick=false,frame=0,followNav=null,edgeFrame=0,edgeTime=0,edgeSpeed=0;
 const buttons=nav=>[...nav.querySelectorAll(selector)].filter(button=>!button.hidden);
 const value=button=>button.getAttribute(attribute);
 function measure(nav){
  const bounds=nav.getBoundingClientRect(),pill=nav.querySelector('.segment-selection').getBoundingClientRect();
  const entries=buttons(nav).map(button=>{const icon=button.querySelector('.ui-icon');return {button,rect:button.getBoundingClientRect(),icon,iconRect:icon?.dataset?.icon==='player-skin'?icon.getBoundingClientRect():null};});
  return {bounds,origin:bounds.left+nav.clientLeft,pill,entries,bar:nav.classList?.contains('segment-scrollable')?nav.parentElement.getBoundingClientRect():null};
 }
 const layout=(geometry,left,width)=>segmentLayout(geometry,left,width,win.devicePixelRatio||1);
 function paint(nav,geometry,result){
  const pill=nav.querySelector('.segment-selection');pill.style.left=result.left+'px';pill.style.width=result.pill.width+'px';contrast(nav,geometry,result.pill);
 }
 function stopSettle(){win.cancelAnimationFrame(frame);frame=0;followNav=null;}
 function reveal(nav,button){
  if(!button||!nav.classList?.contains('segment-scrollable'))return;
  const bar=nav.parentElement,r=bar.getBoundingClientRect(),b=button.getBoundingClientRect();
  if(b.left<r.left+4)bar.scrollLeft+=b.left-r.left-4;
  else if(b.right>r.right-4)bar.scrollLeft+=b.right-r.right+4;
 }
 function position(nav){
  nav.style?.setProperty('--segment-count',String(buttons(nav).length));
  if(!nav.getClientRects().length)return;
  const geometry=measure(nav),selected=geometry.entries.find(entry=>value(entry.button)===nav.dataset.current);if(!selected)return;
  paint(nav,geometry,layout(geometry,selected.rect.left-geometry.origin,selected.rect.width));
 }
 function contrast(nav,geometry=measure(nav),pill=geometry.pill){
  for(const {icon:node,iconRect:r} of geometry.entries){
   if(!r)continue;node.style.color='#12332e';node.style.setProperty('--player-bubble-backing','1');
   node.style.setProperty('--player-backing-start',String((pill.left-r.left)/Math.max(1,r.width)));node.style.setProperty('--player-backing-end',String((pill.right-r.left)/Math.max(1,r.width)));
  }
  draw(nav,geometry.entries.map(entry=>entry.button),pill);
 }

 function select(nav,next,old){
  stopSettle();
  if(next!==nav.dataset.current)nav=change(next)||nav;
  nav.dataset.current=next;for(const button of buttons(nav))button.setAttribute('aria-pressed',String(value(button)===next));
  const selected=buttons(nav).find(button=>value(button)===next);if(!selected){position(nav);return;}
  const geometry=measure(nav);
  const from=old.left-geometry.origin,scrollFrom=nav.parentElement?.scrollLeft||0;let start;
  followNav=nav;paint(nav,geometry,layout(geometry,from,old.width));
  const tick=time=>{
   if(nav.dataset.current!==next){stopSettle();position(nav);return;}
   start??=time;const progress=Math.min(1,(time-start)/320),ease=1-(1-progress)**3;
   // Navigation can reparent the bar into its footer on the next frame. Read
   // its current geometry throughout settling, including after scroll changes.
   const bar=nav.parentElement;
   if(bar&&nav.classList?.contains('segment-scrollable')){const to=segmentCenter(bar,selected.getBoundingClientRect());bar.scrollLeft=scrollFrom+(to-scrollFrom)*ease;}
   const geometry=measure(nav),end=geometry.entries.find(entry=>entry.button===selected)?.rect;if(!end){stopSettle();position(nav);return;}
   const to=end.left-geometry.origin;
   paint(nav,geometry,layout(geometry,from+(to-from)*ease,old.width+(end.width-old.width)*ease));
   if(progress<1)frame=win.requestAnimationFrame(tick);else{frame=0;followNav=null;position(nav);}
  };
  frame=win.requestAnimationFrame(tick);
 }
 root.addEventListener('click',e=>{const button=e.target.closest(selector),nav=button?.closest('.segmented-control');if(!nav)return;if(suppressClick){suppressClick=false;if(e.detail!==0){e.preventDefault();e.stopPropagation();return;}}select(nav,value(button),nav.querySelector('.segment-selection').getBoundingClientRect());});
 function stopEdge(){win.cancelAnimationFrame(edgeFrame);edgeFrame=0;edgeTime=0;edgeSpeed=0;}
 function paintDrag(d,event){
  const geometry=measure(d.nav),result=segmentDrag(geometry,d,win.devicePixelRatio||1);
  paint(d.nav,geometry,result);
  const {center,index,progress}=result;
  if(uiWindMoved(d.cueCenter,center,index!==d.cueIndex)){uiWind(d.nav,center-d.cueCenter,event,progress);d.cueCenter=center;d.cueIndex=index;}
 }
 function edgeFollow(time){
  edgeFrame=0;const d=drag;if(!d?.moved||d.pan||!d.nav.classList?.contains('segment-scrollable'))return stopEdge();
  const bar=d.nav.parentElement,r=bar.getBoundingClientRect(),max=Math.max(0,bar.scrollWidth-bar.clientWidth),zone=Math.min(64,bar.clientWidth*.2);
  const side=d.pointerX<r.left+zone?-1:d.pointerX>r.right-zone?1:0;
  if(!side||!max)return stopEdge();
  const depth=Math.min(1,Math.max(0,side<0?(r.left+zone-d.pointerX)/zone:(d.pointerX-r.right+zone)/zone));
  const dt=edgeTime?Math.min(32,Math.max(0,time-edgeTime)):16;edgeTime=time;
  if(Math.sign(edgeSpeed)!==side)edgeSpeed=0;
  edgeSpeed+=(side*.55*depth*depth-edgeSpeed)*(1-Math.exp(-dt/70));
  const before=bar.scrollLeft,next=Math.max(0,Math.min(max,before+edgeSpeed*dt));
  if(Math.abs(next-before)<.001)return stopEdge();
  bar.scrollLeft=next;paintDrag(d,d.event);edgeFrame=win.requestAnimationFrame(edgeFollow);
 }
 function followEdge(){if(!edgeFrame)edgeFrame=win.requestAnimationFrame(edgeFollow);}
 function begin(e,point,id,touch=false){
  const nav=e.target.closest('.segmented-control')||e.target.closest('.tab-bar')?.querySelector('.segmented-control');if(!nav||!buttons(nav).length)return;stopEdge();if(followNav){stopSettle();position(nav);}suppressClick=false;
  const pill=nav.querySelector('.segment-selection'),rect=pill.getBoundingClientRect(),bar=nav.parentElement;
  const onPill=point.clientX>=rect.left&&point.clientX<=rect.right&&point.clientY>=rect.top&&point.clientY<=rect.bottom;
  const pan=!onPill&&nav.classList?.contains('segment-scrollable')&&bar.scrollWidth>bar.clientWidth+1;
  // Only the visible selected pill owns selection dragging. Unselected touch
  // gestures remain native even when their path later crosses that pill.
  if(!onPill&&(touch||!pan)){drag=null;return;}
  stopSettle();
  drag={id,touch,event:e,x:point.clientX,y:point.clientY,pointerX:point.clientX,nav,pill,moved:false,start:rect.left,pan,scroll:bar?.scrollLeft,cueCenter:rect.left+rect.width/2-nav.getBoundingClientRect().left,cueIndex:buttons(nav).findIndex(b=>value(b)===nav.dataset.current)};
 }
 function move(e,point,id){
  if(drag?.id!==id)return;const dx=point.clientX-drag.x,dy=point.clientY-drag.y;
  if(!drag.moved&&Math.abs(dy)>Math.abs(dx)+6){stopEdge();drag=null;return;}if(!drag.moved&&Math.abs(dx)<6)return;
  if(!drag.moved){drag.moved=true;if(!drag.touch)drag.nav.setPointerCapture(id);}
  if(drag.pan){e.preventDefault();drag.nav.parentElement.scrollLeft=drag.scroll-dx;return;}
  e.preventDefault();e.stopPropagation();drag.pointerX=point.clientX;paintDrag(drag,e);followEdge();
 }
 function finish(e,id,commit){if(drag?.id!==id)return;const d=drag;stopEdge();drag=null;if(!d.moved)return;
  if(d.pan){suppressClick=true;if(d.nav.hasPointerCapture(id))d.nav.releasePointerCapture(id);return;}
  const geometry=measure(d.nav),old=geometry.pill,result=layout(geometry,old.left-geometry.origin,old.width);
  const next=commit&&result.index>=0?value(geometry.entries[result.index].button):d.nav.dataset.current;
  suppressClick=true;if(d.touch&&e.cancelable)e.preventDefault();if(!d.touch&&d.nav.hasPointerCapture(id))d.nav.releasePointerCapture(id);if(commit)uiSelect(d.nav,e);select(d.nav,next,old);
 }
 root.addEventListener('pointerdown',e=>{if(e.pointerType!=='touch'&&e.button===0)begin(e,e,e.pointerId);});
 root.addEventListener('pointermove',e=>{if(e.pointerType!=='touch')move(e,e,e.pointerId);});
 for(const name of ['pointerup','pointercancel','lostpointercapture'])root.addEventListener(name,e=>{if(e.pointerType!=='touch')finish(e,e.pointerId,name==='pointerup');});
 // Safari can cancel Pointer Events when native touch panning begins. Touch
 // events keep their original target, so claim only a proven horizontal drag.
 root.addEventListener('touchstart',e=>{if(e.touches.length===1){const p=e.touches[0];begin(e,p,p.identifier,true);}else if(drag)finish(e,drag.id,false);},{passive:false});
 root.addEventListener('touchmove',e=>{if(!drag?.touch)return;if(e.touches.length!==1){finish(e,drag.id,false);return;}const p=e.touches[0];move(e,p,p.identifier);},{passive:false});
 for(const name of ['touchend','touchcancel'])root.addEventListener(name,e=>{if(!drag?.touch)return;const p=[...e.changedTouches].find(p=>p.identifier===drag.id);if(p)finish(e,p.identifier,name==='touchend');},{passive:false});
 const refresh=(revealSelection=false)=>{for(const nav of root.querySelectorAll('.segmented-control')){if(!buttons(nav).length||!nav.getClientRects().length||followNav===nav||drag?.nav===nav)continue;if(revealSelection===true||!positioned.has(nav))reveal(nav,buttons(nav).find(button=>value(button)===nav.dataset.current));positioned.add(nav);position(nav);}};
 root.addEventListener('focusin',e=>{const button=e.target.closest(selector),nav=button?.closest('.segmented-control');if(nav){if(!drag&&doc.body?.dataset?.inputModality!=='pointer')reveal(nav,button);contrast(nav);}});
 const cancelDrag=()=>{stopEdge();stopSettle();drag=null;refresh();};
 doc.addEventListener?.('visibilitychange',()=>{if(doc.hidden)cancelDrag();});win.addEventListener('blur',cancelDrag);
 root.addEventListener('close',cancelDrag);
 root.addEventListener('wheel',()=>{if(followNav){const nav=followNav;stopSettle();position(nav);}},{passive:true});
 root.addEventListener('focusout',()=>queueMicrotask(()=>{for(const nav of root.querySelectorAll('.segmented-control'))if(buttons(nav).length&&nav.getClientRects().length)contrast(nav);}));
 new win.MutationObserver(refresh).observe(root,{attributes:true,attributeFilter:['open']});
 new win.MutationObserver(()=>refresh(true)).observe(doc.body,{attributes:true,attributeFilter:['data-left-handed']});
 rememberView(root,attribute,()=>[...root.querySelectorAll('.segmented-control')].filter(nav=>nav.querySelector(selector)).map(nav=>({label:nav.getAttribute('aria-label'),value:nav.dataset.current})),items=>{for(const item of Array.isArray(items)?items:[]){let nav=[...root.querySelectorAll('.segmented-control')].find(nav=>titleCase(nav.getAttribute('aria-label'))===titleCase(item.label));const button=nav&&buttons(nav).find(button=>value(button)===item.value);if(!button||item.value===nav.dataset.current)continue;nav=change(item.value)||nav;nav.dataset.current=item.value;for(const b of buttons(nav))b.setAttribute('aria-pressed',String(value(b)===item.value));}refresh();},attribute==='data-rarity-filter'?10:0);
 win.addEventListener('resize',()=>refresh(true));return {refresh};
}

// One snapshot defines both physical feedback and the candidate destination.
// Keep gesture history independent: viewport movement changes the reference
// frame, while the held pill remains at the pointer's screen-space position.
export function segmentLayout(geometry,left,width,ratio=1){
 const pixel=value=>Math.round(value*ratio)/ratio;
 left=pixel(left);width=pixel(width);
 const pill={left:geometry.origin+left,right:geometry.origin+left+width,width,top:geometry.pill.top,bottom:geometry.pill.bottom,height:geometry.pill.height};
 const center=pill.left+width/2-geometry.bounds.left,centers=geometry.entries.map(({rect})=>rect.left+rect.width/2-geometry.bounds.left);
 const index=centers.reduce((best,x,i)=>best<0||Math.abs(x-center)<Math.abs(centers[best]-center)?i:best,-1);
 const min=Math.min(...centers),max=Math.max(...centers);
 return {left,pill,center,index,progress:index<0?0:(center-min)/Math.max(1,max-min)};
}
export function segmentDrag(geometry,gesture,ratio=1){
 const rects=geometry.entries.map(entry=>entry.rect),width=geometry.pill.width;
 if(!rects.length)return segmentLayout(geometry,geometry.pill.left-geometry.origin,width,ratio);
 let min=Math.min(...rects.map(rect=>rect.left)),max=Math.max(...rects.map(rect=>rect.right??rect.left+rect.width))-width;
 if(geometry.bar){min=Math.max(min,geometry.bar.left+4);max=Math.min(max,geometry.bar.right-width-4);}
 const left=Math.max(min,Math.min(max,gesture.start+gesture.pointerX-gesture.x));
 return segmentLayout(geometry,left-geometry.origin,width,ratio);
}
export function segmentOverlap(rect,pill){return {left:Math.max(0,Math.min(rect.width,pill.left-rect.left)),right:Math.max(0,Math.min(rect.width,pill.right-rect.left))};}

export function segmentCenter(bar,button){const r=bar.getBoundingClientRect();return Math.max(0,Math.min(Math.max(0,bar.scrollWidth-bar.clientWidth),bar.scrollLeft+button.left+button.width/2-r.left-bar.clientWidth/2));}
