import { iconHTML } from './ui-icon.js?v=6eefd3a5e72d754fea063666baf3166c1c88b5e72db4ab97072da15565143b81';

export function edgeBackReady(dx,dy,width) {
  return dx>=Math.min(100,Math.max(60,width*.22))&&dx>Math.abs(dy)*1.5;
}
// Dispatch the same cancel contract used by Escape, including nested page Back.
export function dialogBack(dialog) {
  if(!dialog?.open)return false;
  if(dialog.dispatchEvent(new Event('cancel',{cancelable:true})))dialog.close();
  return true;
}
export function edgeBackMount(doc=document,win=window) {
  let gesture=null,suppressClick=false;
  const stop=event=>{if(event.cancelable)event.preventDefault();event.stopImmediatePropagation();};
  function cancel(){if(!gesture)return;gesture.cue.remove();gesture=null;}
  function begin(event,point,id){
    cancel();suppressClick=false;
    const dialog=event.target.closest?.('dialog[open]');
    if(!dialog||point.clientX>24||point.clientX<0)return false;
    const cue=doc.createElement('div');cue.className='edge-back-feedback';cue.setAttribute('aria-hidden','true');
    cue.innerHTML=iconHTML('arrow-left')+'<span>Back</span>';dialog.append(cue);
    gesture={dialog,cue,id,x:point.clientX,y:point.clientY,dx:0,dy:0};suppressClick=false;stop(event);return true;
  }
  function move(event,point){
    if(!gesture)return;
    if(!gesture.dialog.open){cancel();return;}
    stop(event);suppressClick=true;const g=gesture;g.dx=point.clientX-g.x;g.dy=point.clientY-g.y;
    if(g.dx < -12||Math.abs(g.dy)>Math.max(18,g.dx*1.2)){cancel();return;}
    const r=g.dialog.getBoundingClientRect();
    g.cue.style.top=Math.max(12,Math.min(r.height-56,g.y-r.top-22))+'px';
    g.cue.style.left=Math.max(8,Math.min(80,g.dx*.35))+'px';
    g.cue.classList.toggle('is-ready',edgeBackReady(g.dx,g.dy,win.innerWidth));
  }
  function finish(event,point){
    if(!gesture)return;move(event,point);if(!gesture)return;
    const g=gesture,ready=edgeBackReady(g.dx,g.dy,win.innerWidth);cancel();
    suppressClick=true;if(ready)dialogBack(g.dialog);
  }
  // Touch-start cancellation reserves only the left edge, before Safari can
  // claim its browser navigation gesture. Interior panning stays untouched.
  doc.addEventListener('touchstart',event=>{
    if(event.touches.length!==1){cancel();return;}
    const point=event.touches[0];begin(event,point,point.identifier);
  },{capture:true,passive:false});
  doc.addEventListener('touchmove',event=>{
    if(!gesture)return;if(event.touches.length!==1){cancel();return;}
    const point=[...event.touches].find(t=>t.identifier===gesture.id);if(point)move(event,point);else cancel();
  },{capture:true,passive:false});
  doc.addEventListener('touchend',event=>{
    if(!gesture)return;const point=[...event.changedTouches].find(t=>t.identifier===gesture.id);
    if(point)finish(event,point);
  },{capture:true,passive:false});
  doc.addEventListener('touchcancel',cancel,true);
  doc.addEventListener('pointerdown',event=>{
    if(event.pointerType==='touch'){
      if(event.clientX>=0&&event.clientX<=24&&event.target.closest?.('dialog[open]'))stop(event);
      return;
    }
    if(event.button!==0||event.isPrimary===false){cancel();return;}
    begin(event,event,event.pointerId);
  },true);
  doc.addEventListener('pointermove',event=>{if(event.pointerType==='touch'){if(gesture)stop(event);return;}if(gesture?.id===event.pointerId){if(!event.buttons)cancel();else move(event,event);}},true);
  doc.addEventListener('pointerup',event=>{if(event.pointerType==='touch'){if(gesture)stop(event);return;}if(gesture?.id===event.pointerId)finish(event,event);},true);
  doc.addEventListener('pointercancel',cancel,true);
  doc.addEventListener('click',event=>{if(suppressClick){suppressClick=false;stop(event);}},true);
  doc.addEventListener('close',cancel,true);
  doc.addEventListener('visibilitychange',()=>{if(doc.hidden)cancel();});
  win.addEventListener('blur',cancel);win.addEventListener('resize',cancel);
  return {cancel};
}
