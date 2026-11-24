import {entityImpulse} from './entity-motion.js?v=16ce17b5f60cb8d9e28697080edf32fb0049099a55fad2c27982aeec54cf66a8';
import {bubblePressure,bubbleContactMount} from './bubble-pressure.js?v=b5bc5af7a6c96099ebff8ebb3bdb5e8bd38cd0780e699102086111db5779588b';
import {skinSpringStep} from './skin-preview.js?v=208b099e60570883bba34fe5e670ffca5c81f12a01a2ef6b663936fd7ce70c0b';
import {menuPoolView} from './menu-pool.js?v=0e866a1660a7acc65182329803c6c4a50453e64b601a9916e3858326a1d2d90f';
import {playerMotion} from './player-motion.js?v=577160ddcb2e76940b04bf9ae7ff772b6ea10e077ac294aaa5ce572fbd733ce7';

// One input/response model for decorative players and cosmetic previews.
// Surface owners supply geometry and drawing; native navigation remains passive.
const hubs=new WeakMap();
function hubFor(doc,win){
 let hub=hubs.get(doc);if(hub)return hub;
 const instances=new Set(),contacts=new Map();
 const input={contact(id,x,y,pressed=false){const point={x,y};if(pressed&&!contacts.has(id))for(const item of instances)item.press(point);contacts.set(id,point);},release(id){contacts.delete(id);},clear(){contacts.clear();for(const item of instances)item.pulses=[];}};
 const unmount=bubbleContactMount(input,doc,win);hub={instances,contacts,input,unmount};hubs.set(doc,hub);return hub;
}
export function bubbleInteractionMount(surface,host){
 const doc=surface.ownerDocument,win=doc.defaultView,hub=hubFor(doc,win),sensor=playerMotion(win);
 const positions=new Map();for(let node=surface.parentElement;node;node=node.parentElement)positions.set(node,{x:node.scrollLeft||0,y:node.scrollTop||0});
 const target=surface.closest?.('button')||surface.closest?.('[role="button"]')||surface;
 const frame=()=>{
  const g=host.geometry(),r=host.frame?.()||surface.getBoundingClientRect();
  // Layout is a reference frame, not physical travel. Offsets exclude scrolling
  // and transforms; scroll extents also catch filter-induced scroll resets.
  let layout='';for(let node=surface;node;node=node.offsetParent)layout+=`${node.offsetLeft||0},${node.offsetTop||0};`;
  for(const node of positions.keys())layout+=`${node.scrollWidth||0},${node.scrollHeight||0};`;
  return g?.unit?{x:r.x??r.left,y:r.y??r.top,unit:g.unit,width:win.innerWidth,height:win.innerHeight,layout}:null;
 };
 const continuous=(a,b)=>a&&b&&a.layout===b.layout&&Math.abs(a.unit-b.unit)<.001&&a.width===b.width&&a.height===b.height;
 const rebaseScroll=()=>{for(const node of positions.keys())positions.set(node,{x:node.scrollLeft||0,y:node.scrollTop||0});};
 let drag=null;
 let previousFrame=frame(),pending={x:0,y:0},flow={x:0,y:0};
 const control={get dragging(){return !!drag;},state:{x:0,y:0,vx:0,vy:0},pulses:[],positions,
  viewportShift(dx,dy,unit){
   const distance=Math.hypot(dx,dy);if(distance<.001||!unit)return;
   const impulse=Math.min(18,distance/unit*1.2),x=-dx/distance*impulse,y=-dy/distance*impulse,s=control.state;
   s.vx=Math.max(-18,Math.min(18,(x/9-s.x)*6));s.vy=Math.max(-18,Math.min(18,(y/9-s.y)*6));
   pending.x=Math.max(-36,Math.min(36,pending.x+x));pending.y=Math.max(-36,Math.min(36,pending.y+y));flow={x:x*3,y:y*3};
   host.hit(dx/distance,dy/distance,impulse*.35,false);host.request?.();
  },
  pressure(point,kind,dt=1,age=0){
   if(!host.active())return;const g=host.geometry();if(!g||g.visible===false||!g.unit)return;
   const scale=menuPoolView(win.innerWidth,win.innerHeight).scale,convert=scale/g.unit;
   host.contact?.({x:(point.x-g.x)/g.unit,y:(point.y-g.y)/g.unit},kind,dt,age,convert);
   const hit=bubblePressure({id:host.id||0,x:g.x/scale,y:g.y/scale,radius:14*g.unit/scale},{x:point.x/scale,y:point.y/scale},kind,dt,age);if(!hit)return;
   entityImpulse(control.state,hit.vx*convert,hit.vy*convert,{limit:1100*convert});
   host.hit(hit.nx,hit.ny,hit.speed*convert,kind==='tap');host.request?.();
  },
  press(point){if(!host.active())return;control.pressure(point,'tap');control.pulses.push({...point,age:0});if(control.pulses.length>8)control.pulses.shift();},
  clear(){endDrag();control.pulses=[];previousFrame=null;rebaseScroll();pending={x:0,y:0};flow={x:0,y:0};},
  reset(){control.state={x:0,y:0,vx:0,vy:0};control.clear();previousFrame=frame();},
  scroll(event){
   const previous=positions.get(event.target);if(!previous)return;const next={x:event.target.scrollLeft||0,y:event.target.scrollTop||0};positions.set(event.target,next);if(!host.active())return;
   const current=frame();if(!current)return;
   if(!continuous(current,previousFrame)){previousFrame=current;rebaseScroll();return;}
   // Scroll is one observed frame displacement, never an impact. Remember the
   // new frame so its next sample cannot count the same movement twice.
   control.viewportShift(previous.x-next.x,previous.y-next.y,current.unit);previousFrame=current;
  },
  focus(){if(!host.active()||hub.contacts.size)return;control.state.vy-=60;host.hit(0,1,140,true);host.request?.();},
  step(dt){
   const current=frame();
   if(!continuous(current,previousFrame))rebaseScroll();
   else if(dt>0&&host.active()){
    const dx=current.x-previousFrame.x,dy=current.y-previousFrame.y;
    if(continuous(current,previousFrame)&&Math.hypot(dx,dy)<current.unit*100)control.viewportShift(dx,dy,current.unit);
    else rebaseScroll();
   }
   previousFrame=current;
   for(const point of hub.contacts.values())control.pressure(point,'hold',dt);
   for(const point of control.pulses){control.pressure(point,'pulse',dt,point.age);point.age+=dt;}control.pulses=control.pulses.filter(p=>p.age<1.25);
   const vector=sensor.sample();control.state.vx+=vector.x*dt;control.state.vy+=vector.y*dt;
   if(drag){control.state={x:drag.x,y:drag.y,vx:0,vy:0};return {x:vector.x,y:vector.y,impulse:{x:0,y:0},acceleration:vector};}
   control.state=skinSpringStep(control.state,dt,host.spring?.()||{stiffness:24,damping:10});const s=control.state,distance=Math.hypot(s.x,s.y);
   const limit=host.drag?.()?28:10;
   if(distance>limit){const nx=s.x/distance,ny=s.y/distance;s.x=nx*limit;s.y=ny*limit;const outward=s.vx*nx+s.vy*ny;if(outward>0){s.vx-=nx*outward;s.vy-=ny*outward;}}
   const impulse=dt>0?pending:{x:0,y:0};if(dt>0)pending={x:0,y:0};
   const result={x:vector.x+flow.x,y:vector.y+flow.y,impulse,acceleration:vector};
   flow.x*=Math.exp(-dt*12);flow.y*=Math.exp(-dt*12);
   return result;
  },
  destroy(){endDrag();surface.removeEventListener('pointerdown',startDrag);surface.removeEventListener('pointermove',moveDrag);for(const name of ['pointerup','pointercancel','lostpointercapture'])surface.removeEventListener(name,endDrag);win.removeEventListener('blur',endDrag);doc.removeEventListener('scroll',control.scroll,true);doc.removeEventListener('visibilitychange',visibility);target.removeEventListener?.('focusin',control.focus);positions.clear();hub.instances.delete(control);if(!hub.instances.size){hub.unmount();hubs.delete(doc);}}
 };
 function startDrag(e){
  if(!host.drag?.()||!host.active()||e.button!==0||drag)return;
  const g=host.geometry();if(!g?.unit||g.visible===false)return;
  drag={id:e.pointerId,clientX:e.clientX,clientY:e.clientY,unit:g.unit,startX:control.state.x,startY:control.state.y,x:control.state.x,y:control.state.y};
  surface.setPointerCapture?.(e.pointerId);e.preventDefault();
 }
 function moveDrag(e){
  if(!drag||drag.id!==e.pointerId)return;
  const x=drag.startX+(e.clientX-drag.clientX)/drag.unit,y=drag.startY+(e.clientY-drag.clientY)/drag.unit,d=Math.hypot(x,y),scale=d>28?28/d:1;
  drag.x=x*scale;drag.y=y*scale;e.preventDefault();host.request?.();
 }
 function endDrag(e){if(!drag||(e?.pointerId!==undefined&&e.pointerId!==drag.id))return;const id=drag.id;drag=null;if(surface.hasPointerCapture?.(id))surface.releasePointerCapture(id);}
 surface.addEventListener('pointerdown',startDrag);surface.addEventListener('pointermove',moveDrag);
 for(const name of ['pointerup','pointercancel','lostpointercapture'])surface.addEventListener(name,endDrag);
 win.addEventListener('blur',endDrag);
 function visibility(){if(doc.hidden){hub.input.clear();control.clear();}}
 doc.addEventListener('scroll',control.scroll,true);doc.addEventListener('visibilitychange',visibility);target.addEventListener?.('focusin',control.focus);hub.instances.add(control);return control;
}
