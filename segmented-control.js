import {escapeHTML} from './ui-text.js?v=02f24218cfade2c1cf218f107876f5365ad03a4287cebbb4b8e0817ce89eb0d0';
import {uiWind} from './ui-sound.js?v=c8318423c1565fbab4d63567ad32cdd01eaf2bef81da713cf2f2060b3ca69e7d';
export function segmentedHTML(buttons,{label,current,className=''}){
 return `<div class="tab-bar"><nav class="segmented-control ${escapeHTML(className)}" data-current="${escapeHTML(current)}" aria-label="${escapeHTML(label)}" style="--segment-count:${buttons.length}"><span class="segment-selection" aria-hidden="true"></span>${buttons.join('')}</nav></div>`;
}
// Works within one panel or across dialogs. The caller owns destinations only.
export function segmentedMount(root,{attribute,change}){
 const doc=root.ownerDocument,win=doc.defaultView,selector=`[${attribute}]`;
 const overlays=new WeakMap(),positioned=new WeakSet();
 let drag=null,suppressClick=false,frame=0,followNav=null,edgeFrame=0,edgeTime=0,edgeSpeed=0;
 const buttons=nav=>[...nav.querySelectorAll(selector)];
 const value=button=>button.getAttribute(attribute);
 const pixel=value=>Math.round(value*(win.devicePixelRatio||1))/(win.devicePixelRatio||1);
 function paint(nav,left,width){const pill=nav.querySelector('.segment-selection');pill.style.left=pixel(left)+'px';pill.style.width=pixel(width)+'px';contrast(nav);}
 function stopSettle(){win.cancelAnimationFrame(frame);frame=0;followNav=null;}
 function reveal(nav,button){
  if(!button||!nav.classList?.contains('segment-scrollable'))return;
  const bar=nav.parentElement,r=bar.getBoundingClientRect(),b=button.getBoundingClientRect();
  if(b.left<r.left+4)bar.scrollLeft+=b.left-r.left-4;
  else if(b.right>r.right-4)bar.scrollLeft+=b.right-r.right+4;
 }
 function position(nav){
  const selected=buttons(nav).find(b=>value(b)===nav.dataset.current),pill=nav.querySelector('.segment-selection');
  if(!selected||!nav.getClientRects().length)return;
  const n=nav.getBoundingClientRect(),b=selected.getBoundingClientRect();
  paint(nav,b.left-n.left-nav.clientLeft,b.width);
 }
 function contrast(nav){
  const pill=nav.querySelector('.segment-selection').getBoundingClientRect();
  for(const button of buttons(nav))for(const node of [button.querySelector('span:not(.ui-icon)'),button.querySelector('.ui-icon')]){
   if(!node)continue;const r=node.getBoundingClientRect(),{left,right}=segmentOverlap(r,pill);
   if(node.dataset?.icon==='player-skin'){
    // The membrane and backing overflow the nominal icon slot. Clip at the
    // actual pill edges, not the slot edges used by text and masked icons.
    node.style.color='#12332e';node.style.setProperty('--player-bubble-backing','1');
    node.style.setProperty('--player-backing-start',String((pill.left-r.left)/Math.max(1,r.width)));node.style.setProperty('--player-backing-end',String((pill.right-r.left)/Math.max(1,r.width)));
   }else{
    // Solid layers avoid WebKit's stale text-gradient raster fragments while
    // keeping contrast spatial under a moving selection, including masked SVGs.
    let overlay=overlays.get(node);
    if(!overlay){
     if(node.classList.contains('ui-icon')){node.classList.add('segment-mask');overlay=node;}
     else{overlay=doc.createElement('span');overlay.className='segment-contrast';overlay.setAttribute('aria-hidden','true');const ink=doc.createElement('span');ink.textContent=node.textContent;overlay.append(ink);node.append(overlay);}
     overlays.set(node,overlay);
    }
    const ratio=win.devicePixelRatio||1,start=Math.round(left*ratio)/ratio,end=Math.round(right*ratio)/ratio;
    for(const [key,value] of [['--segment-clip-left',start+'px'],['--segment-clip-width',Math.max(0,end-start)+'px']])if(overlay.style.getPropertyValue?.(key)!==value)overlay.style.setProperty(key,value);
   }
  }
 }
 function select(nav,next,old){
  stopSettle();
  if(next!==nav.dataset.current)nav=change(next)||nav;
  nav.dataset.current=next;for(const button of buttons(nav))button.setAttribute('aria-pressed',String(value(button)===next));
  reveal(nav,buttons(nav).find(button=>value(button)===next));
  const selected=buttons(nav).find(button=>value(button)===next),n=nav.getBoundingClientRect(),end=selected.getBoundingClientRect();
  const from=old.left-n.left-nav.clientLeft,to=end.left-n.left-nav.clientLeft;let start;
  followNav=nav;paint(nav,from,old.width);
  const tick=time=>{start??=time;const progress=Math.min(1,(time-start)/320),ease=1-(1-progress)**3;paint(nav,from+(to-from)*ease,old.width+(end.width-old.width)*ease);if(progress<1)frame=win.requestAnimationFrame(tick);else{frame=0;followNav=null;}};
  frame=win.requestAnimationFrame(tick);
 }
 root.addEventListener('click',e=>{const button=e.target.closest(selector),nav=button?.closest('.segmented-control');if(!nav)return;if(suppressClick){suppressClick=false;e.preventDefault();e.stopPropagation();return;}select(nav,value(button),nav.querySelector('.segment-selection').getBoundingClientRect());});
 function stopEdge(){win.cancelAnimationFrame(edgeFrame);edgeFrame=0;edgeTime=0;edgeSpeed=0;}
 function paintDrag(d){
  const rects=buttons(d.nav).map(b=>b.getBoundingClientRect()),width=d.pill.getBoundingClientRect().width;
  let min=Math.min(...rects.map(r=>r.left)),max=Math.max(...rects.map(r=>r.right))-width;
  if(d.nav.classList?.contains('segment-scrollable')){const r=d.nav.parentElement.getBoundingClientRect();min=Math.max(min,r.left+4);max=Math.min(max,r.right-width-4);}
  const base=d.nav.getBoundingClientRect().left+d.nav.clientLeft;
  paint(d.nav,Math.max(min,Math.min(max,d.start+d.pointerX-d.x))-base,width);
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
  bar.scrollLeft=next;paintDrag(d);edgeFrame=win.requestAnimationFrame(edgeFollow);
 }
 function followEdge(){if(!edgeFrame)edgeFrame=win.requestAnimationFrame(edgeFollow);}
 function begin(e,point,id,touch=false){
  const nav=e.target.closest('.segmented-control');if(!nav||!buttons(nav).length)return;stopEdge();suppressClick=false;
  const pill=nav.querySelector('.segment-selection'),rect=pill.getBoundingClientRect(),bar=nav.parentElement;
  const onPill=point.clientX>=rect.left&&point.clientX<=rect.right&&point.clientY>=rect.top&&point.clientY<=rect.bottom;
  const pan=!onPill&&nav.classList?.contains('segment-scrollable')&&bar.scrollWidth>bar.clientWidth+1;
  // Only the visible selected pill owns selection dragging. Unselected touch
  // gestures remain native even when their path later crosses that pill.
  if(!onPill&&(touch||!pan)){drag=null;return;}
  stopSettle();
  drag={id,touch,x:point.clientX,y:point.clientY,pointerX:point.clientX,nav,pill,moved:false,start:rect.left,pan,scroll:bar?.scrollLeft};
 }
 function move(e,point,id){
  if(drag?.id!==id)return;const dx=point.clientX-drag.x,dy=point.clientY-drag.y;
  if(!drag.moved&&Math.abs(dy)>Math.abs(dx)+6){stopEdge();drag=null;return;}if(!drag.moved&&Math.abs(dx)<6)return;
  if(!drag.moved){drag.moved=true;if(!drag.touch)drag.nav.setPointerCapture(id);}
  if(drag.pan){e.preventDefault();drag.nav.parentElement.scrollLeft=drag.scroll-dx;return;}
  e.preventDefault();e.stopPropagation();const before=drag.pill.getBoundingClientRect().left;drag.pointerX=point.clientX;paintDrag(drag);uiWind(drag.nav,(drag.pill.getBoundingClientRect().left-before)/Math.max(1,drag.pill.getBoundingClientRect().width),e);followEdge();
 }
 function finish(e,id,commit){if(drag?.id!==id)return;const d=drag;stopEdge();drag=null;if(!d.moved)return;
  if(d.pan){suppressClick=true;if(d.nav.hasPointerCapture(id))d.nav.releasePointerCapture(id);return;}
  const old=d.pill.getBoundingClientRect(),center=old.left+old.width/2;
  const next=commit?value(buttons(d.nav).sort((a,b)=>{const ar=a.getBoundingClientRect(),br=b.getBoundingClientRect();return Math.abs(ar.left+ar.width/2-center)-Math.abs(br.left+br.width/2-center);})[0]):d.nav.dataset.current;
  suppressClick=true;if(d.touch&&e.cancelable)e.preventDefault();if(!d.touch&&d.nav.hasPointerCapture(id))d.nav.releasePointerCapture(id);select(d.nav,next,old);
 }
 root.addEventListener('pointerdown',e=>{if(e.pointerType!=='touch'&&e.button===0)begin(e,e,e.pointerId);});
 root.addEventListener('pointermove',e=>{if(e.pointerType!=='touch')move(e,e,e.pointerId);});
 for(const name of ['pointerup','pointercancel','lostpointercapture'])root.addEventListener(name,e=>{if(e.pointerType!=='touch')finish(e,e.pointerId,name==='pointerup');});
 // Safari can cancel Pointer Events when native touch panning begins. Touch
 // events keep their original target, so claim only a proven horizontal drag.
 root.addEventListener('touchstart',e=>{if(e.touches.length===1){const p=e.touches[0];begin(e,p,p.identifier,true);}else if(drag)finish(e,drag.id,false);},{passive:false});
 root.addEventListener('touchmove',e=>{if(!drag?.touch)return;if(e.touches.length!==1){finish(e,drag.id,false);return;}const p=e.touches[0];move(e,p,p.identifier);},{passive:false});
 for(const name of ['touchend','touchcancel'])root.addEventListener(name,e=>{if(!drag?.touch)return;const p=[...e.changedTouches].find(p=>p.identifier===drag.id);if(p)finish(e,p.identifier,name==='touchend');},{passive:false});
 const refresh=(revealSelection=false)=>{for(const nav of root.querySelectorAll('.segmented-control')){if(!nav.getClientRects().length||followNav===nav||drag?.nav===nav)continue;if(revealSelection===true||!positioned.has(nav))reveal(nav,buttons(nav).find(button=>value(button)===nav.dataset.current));positioned.add(nav);position(nav);contrast(nav);}};
 root.addEventListener('focusin',e=>{const button=e.target.closest(selector),nav=button?.closest('.segmented-control');if(nav&&!drag&&doc.body?.dataset?.inputModality!=='pointer')reveal(nav,button);});
 const cancelDrag=()=>{stopEdge();stopSettle();drag=null;refresh();};
 doc.addEventListener?.('visibilitychange',()=>{if(doc.hidden)cancelDrag();});win.addEventListener('blur',cancelDrag);
 root.addEventListener('close',cancelDrag);
 new win.MutationObserver(refresh).observe(root,{attributes:true,attributeFilter:['open']});
 new win.MutationObserver(()=>refresh(true)).observe(doc.body,{attributes:true,attributeFilter:['data-left-handed']});
 win.addEventListener('resize',()=>refresh(true));return {refresh};
}

export function segmentOverlap(rect,pill){return {left:Math.max(0,Math.min(rect.width,pill.left-rect.left)),right:Math.max(0,Math.min(rect.width,pill.right-rect.left))};}
