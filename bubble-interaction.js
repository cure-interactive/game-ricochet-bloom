import {bubblePressure,bubbleContactMount} from './bubble-pressure.js?v=b5bc5af7a6c96099ebff8ebb3bdb5e8bd38cd0780e699102086111db5779588b';
import {skinSpringStep} from './skin-preview.js?v=b46bca5bc442cdd7344540ae811a729c603404d562061865b86a0a763f14c141';
import {menuPoolView} from './menu-pool.js?v=12b1ea36e45149e4c2229016ccdf23eba2431f6707f637c564ca7422762115d3';
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
 const control={state:{x:0,y:0,vx:0,vy:0},pulses:[],positions,
  pressure(point,kind,dt=1,age=0){
   if(!host.active())return;const g=host.geometry();if(!g||g.visible===false||!g.unit)return;
   const scale=menuPoolView(win.innerWidth,win.innerHeight).scale,hit=bubblePressure({id:host.id||0,x:g.x/scale,y:g.y/scale,radius:14*g.unit/scale},{x:point.x/scale,y:point.y/scale},kind,dt,age);if(!hit)return;
   const convert=scale/g.unit,s=control.state;s.vx+=hit.vx*convert;s.vy+=hit.vy*convert;const speed=Math.hypot(s.vx,s.vy),limit=1100*convert;if(speed>limit){s.vx*=limit/speed;s.vy*=limit/speed;}
   host.hit(hit.nx,hit.ny,hit.speed*convert,kind==='tap');host.request?.();
  },
  press(point){if(!host.active())return;control.pressure(point,'tap');control.pulses.push({...point,age:0});if(control.pulses.length>8)control.pulses.shift();},
  clear(){control.pulses=[];},
  reset(){control.state={x:0,y:0,vx:0,vy:0};control.clear();},
  scroll(event){
   const previous=positions.get(event.target);if(!previous)return;const next={x:event.target.scrollLeft||0,y:event.target.scrollTop||0};positions.set(event.target,next);if(!host.active())return;
   const dx=next.x-previous.x,dy=next.y-previous.y,distance=Math.hypot(dx,dy),g=host.geometry();if(!distance||!g?.unit)return;
   const impulse=Math.min(18,distance/g.unit*1.2),s=control.state;
   s.vx=Math.max(-18,Math.min(18,(dx/distance*impulse/9-s.x)*6));s.vy=Math.max(-18,Math.min(18,(dy/distance*impulse/9-s.y)*6));
   // Scrolling displaces and deforms the tether; it is not a collision.
   host.hit(-dx/distance,-dy/distance,impulse*.35,false);host.request?.();
  },
  focus(){if(!host.active()||hub.contacts.size)return;control.state.vy-=60;host.hit(0,1,140,true);host.request?.();},
  step(dt){
   for(const point of hub.contacts.values())control.pressure(point,'hold',dt);
   for(const point of control.pulses){control.pressure(point,'pulse',dt,point.age);point.age+=dt;}control.pulses=control.pulses.filter(p=>p.age<1.25);
   const vector=sensor.sample();control.state.vx+=vector.x*dt;control.state.vy+=vector.y*dt;
   control.state=skinSpringStep(control.state,dt,{stiffness:24,damping:10});const s=control.state,distance=Math.hypot(s.x,s.y);
   if(distance>10){const nx=s.x/distance,ny=s.y/distance;s.x=nx*10;s.y=ny*10;const outward=s.vx*nx+s.vy*ny;if(outward>0){s.vx-=nx*outward;s.vy-=ny*outward;}}
   return vector;
  },
  destroy(){doc.removeEventListener('scroll',control.scroll,true);doc.removeEventListener('visibilitychange',visibility);target.removeEventListener?.('focusin',control.focus);positions.clear();hub.instances.delete(control);if(!hub.instances.size){hub.unmount();hubs.delete(doc);}}
 };
 function visibility(){if(doc.hidden)hub.input.clear();}
 doc.addEventListener('scroll',control.scroll,true);doc.addEventListener('visibilitychange',visibility);target.addEventListener?.('focusin',control.focus);hub.instances.add(control);return control;
}
