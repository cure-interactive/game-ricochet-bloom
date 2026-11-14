import {escapeHTML} from './ui-text.js?v=02f24218cfade2c1cf218f107876f5365ad03a4287cebbb4b8e0817ce89eb0d0';

// A presentation-only tether, shared by the two large skin viewers.
export function skinPreviewHTML(name){
 return `<div class="skin-preview skin-preview-large skin-preview-interactive"><i role="button" tabindex="0" aria-label="${escapeHTML(name)} player preview. Drag or tap to bounce; arrow keys also move it."><player-bubble></player-bubble></i></div>`;
}
export function skinSpringStep(state,seconds){
 const next={...state};
 for(let remaining=Math.min(.05,Math.max(0,seconds));remaining>0;){
  const dt=Math.min(remaining,1/120);remaining-=dt;
  for(const axis of ['x','y']){const v=axis==='x'?'vx':'vy';next[v]+=(-150*next[axis]-12*next[v])*dt;next[axis]+=next[v]*dt;}
 }
 if(Math.hypot(next.x,next.y)<.08&&Math.hypot(next.vx,next.vy)<.4)return {x:0,y:0,vx:0,vy:0};
 return next;
}
export function skinPreviewMount(element,{gentle=()=>false}={}){
 const orb=element.querySelector('i'),doc=element.ownerDocument,win=doc.defaultView,media=win.matchMedia('(prefers-reduced-motion: reduce)');
 const bubble=orb.querySelector('player-bubble');
 let state={x:0,y:0,vx:0,vy:0},pointer=null,frame=0,last=0,destroyed=false;
 const reduced=()=>gentle()||media.matches;
 function paint(){bubble?.velocity?.(state.vx/(Math.max(1,orb.clientWidth)/28),state.vy/(Math.max(1,orb.clientWidth)/28));orb.style.transform=`translate(${state.x.toFixed(2)}px,${state.y.toFixed(2)}px)`;}
 function stop(){if(frame)win.cancelAnimationFrame(frame);frame=0;last=0;}
 function releaseCapture(){const id=pointer?.id;pointer=null;orb.classList.remove('is-dragging');if(id!==undefined&&orb.hasPointerCapture(id))orb.releasePointerCapture(id);}
 function reset(){stop();releaseCapture();bubble?.reset?.();state={x:0,y:0,vx:0,vy:0};paint();}
 function tick(time){
  frame=0;if(destroyed||doc.hidden||!element.isConnected){reset();return;}
  if(reduced()){reset();return;}
  state=skinSpringStep(state,last?(time-last)/1000:1/60);last=time;paint();
  if(state.x||state.y||state.vx||state.vy)frame=win.requestAnimationFrame(tick);else last=0;
 }
 function animate(){if(reduced()){reset();return;}if(!frame)frame=win.requestAnimationFrame(tick);}
 function nudge(x=0,y=-1){stop();if(!reduced())bubble?.kick?.(-x,-y);state={x:x*24,y:y*24,vx:0,vy:0};paint();animate();}
 function down(e){
  if(pointer||e.isPrimary===false||e.button!==0)return;
  e.preventDefault();stop();orb.focus({preventScroll:true});
  pointer={id:e.pointerId,x:e.clientX,y:e.clientY,originX:state.x,originY:state.y,lastX:e.clientX,lastY:e.clientY,moved:false};
  state.vx=state.vy=0;orb.setPointerCapture(e.pointerId);orb.classList.add('is-dragging');
 }
 function move(e){
  if(e.pointerId!==pointer?.id)return;e.preventDefault();
  const dx=e.clientX-pointer.x,dy=e.clientY-pointer.y;
  if(Math.hypot(dx,dy)>4)pointer.moved=true;
  const x=pointer.originX+dx,y=pointer.originY+dy,limit=reduced()?10:Math.min(64,orb.clientWidth*.36),distance=Math.hypot(x,y),scale=distance?limit*Math.tanh(distance/limit)/distance:1;
  state={x:x*scale,y:y*scale,vx:0,vy:0};paint();
  if(!reduced()){const dx=e.clientX-pointer.lastX,dy=e.clientY-pointer.lastY,d=Math.hypot(dx,dy);if(d>0)bubble?.kick?.(-dx/d,-dy/d,Math.min(160,d*12));}
  pointer.lastX=e.clientX;pointer.lastY=e.clientY;
 }
 function up(e){if(e.pointerId!==pointer?.id)return;const moved=pointer.moved;releaseCapture();if(moved)animate();else nudge();}
 function cancel(e){if(e.pointerId===pointer?.id)reset();}
 function key(e){const direction={ArrowLeft:[-1,0],ArrowRight:[1,0],ArrowUp:[0,-1],ArrowDown:[0,1],Enter:[0,-1],' ':[0,-1]}[e.key];if(!direction||pointer)return;e.preventDefault();nudge(...direction);}
 function click(e){if(e.detail===0)nudge();} // Assistive activation without pointer events.
 function visibility(){if(doc.hidden)reset();}
 const listeners=[[orb,'pointerdown',down],[orb,'pointermove',move],[orb,'pointerup',up],[orb,'pointercancel',cancel],[orb,'lostpointercapture',cancel],[orb,'keydown',key],[orb,'click',click],[doc,'visibilitychange',visibility],[win,'blur',reset],[media,'change',reset]];
 for(const [target,event,handler] of listeners)target.addEventListener(event,handler);
 return {reset,destroy(){destroyed=true;reset();for(const [target,event,handler] of listeners)target.removeEventListener(event,handler);}};
}
