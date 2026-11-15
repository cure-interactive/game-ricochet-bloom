import {frameGate} from './performance.js?v=96d3b24da7cb64e9aca058671790f2492e43852e6c0669ccd169e7399c39a51b';
import {qualityPixelRatio} from './quality.js?v=33c4a6dbcda13ded7499caa9a3563afa6903c4346850134bc5bd467cbac4ad4e';
import {bubbleCreate,bubbleHit,bubbleStep,bubbleOutline} from './bubble.js?v=385baeaa905192ab9831eba4809c9c2370062e45dd55402b892d2ea214a30bac';
import {bubblePressure,bubbleContactMount} from './bubble-pressure.js?v=0f0369c96892b587b973530192fa387903a71fa360cf582520cd16239bc7360c';
import {menuPoolView} from './menu-pool.js?v=d73b02edc746dd5fddf9898200d8fe2f3fe9b91e08924d2d5b874729f1ef172a';
import {skinSpringStep} from './skin-preview.js?v=e6fa5d2b4812a18e495e4f673ba1d1c774eb5140702e19298017892c8fe38991';
import {bubbleRender,bubblePath} from './bubble-render.js?v=0b5db9753621bde8a86ab88be698cb900831918934659548b20bbe78ef0599fc';

// Decorative instances own only visual state. The surrounding button or large
// preview keeps its existing input, focus, navigation and progression contract.
import {playerMotion} from './player-motion.js?v=c210823f435f420a067442185bdcdb36345840686de4305d81befdc695e92578';
export function registerPlayerBubble(win=window){
 if(win.customElements.get('player-bubble'))return;
 const motion=playerMotion(win);
 let sequence=0,unmount;
 const instances=new Set(),contacts=new Map();
 const input={contact(id,x,y,pulse=false){
  const point={x,y};
  if(pulse&&!contacts.has(id))for(const el of instances)el.press(point);
  contacts.set(id,point);
 },release(id){contacts.delete(id);},clear(){contacts.clear();for(const el of instances)el.pulses=[];}};
 class PlayerBubble extends win.HTMLElement{
  connectedCallback(){
   if(this.resize)return;
   if(!this.membrane){
   this.membrane=bubbleCreate();this.body={x:50.4,y:50.4,radius:14,vx:0,vy:0};
   this.renderReady=frameGate();this.frame=0;this.last=0;this.visible=false;this.bounce=0;
   this.pressure={x:0,y:0,vx:0,vy:0};this.pulses=[];
   this.phase=++sequence*2.4;this.age=0;this.nextRipple=1.1+(sequence%4)*.23;
   }
   if(!this.canvas){
   this.canvas=this.ownerDocument.createElement('canvas');this.canvas.setAttribute('aria-hidden','true');this.append(this.canvas);
   this.context=this.canvas.getContext('2d');
   }
   this.target=this.closest('button')||this;
   this.activate=()=>{if(!contacts.size)this.kick(0,1);};
   this.change=()=>{if(this.visible)this.paint();this.request();};
   this.visibility=()=>{if(this.ownerDocument.hidden){input.clear();this.halt();}else this.request();};
   this.scrollPositions=new Map();
   for(let ancestor=this.parentElement;ancestor;ancestor=ancestor.parentElement)this.scrollPositions.set(ancestor,{x:ancestor.scrollLeft||0,y:ancestor.scrollTop||0});
   this.scrolled=event=>{
    const previous=this.scrollPositions.get(event.target);if(!previous)return;
    const next={x:event.target.scrollLeft||0,y:event.target.scrollTop||0};this.scrollPositions.set(event.target,next);
    if(!this.visible||this.ownerDocument.hidden)return;
    const dx=next.x-previous.x,dy=next.y-previous.y,distance=Math.hypot(dx,dy);if(!distance)return;
    const impulse=Math.min(100,distance*28/Math.max(1,this.size)*8);
    this.pressure.vx=Math.max(-180,Math.min(180,this.pressure.vx+dx/distance*impulse));
    this.pressure.vy=Math.max(-180,Math.min(180,this.pressure.vy+dy/distance*impulse));
    this.kick(-dx/distance,-dy/distance,impulse);
   };
   this.ownerDocument.addEventListener('scroll',this.scrolled,true);
   this.target.addEventListener('focusin',this.activate);
   instances.add(this);if(!unmount)unmount=bubbleContactMount(input,this.ownerDocument,win);
   this.ownerDocument.addEventListener('visibilitychange',this.visibility);
   this.resize=new win.ResizeObserver(()=>{this.size=this.getBoundingClientRect().width;if(this.visible)this.paint();this.request();});this.resize.observe(this);
   this.intersection=new win.IntersectionObserver(entries=>{
    const visible=entries[0].isIntersecting&&entries[0].intersectionRect.width>0;
    if(visible&&!this.visible){this.visible=true;if(!this.age)this.kick(0,1,95);this.request();}else if(!visible){this.visible=false;this.halt();}
   });this.intersection.observe(this);
   this.preferences=new win.MutationObserver(this.change);
   // Skin colors can be overridden on a reward button, preview or active profile.
   for(let ancestor=this.parentElement;ancestor;ancestor=ancestor.parentElement)this.preferences.observe(ancestor,{attributes:true,attributeFilter:['class','style','aria-pressed','aria-selected','data-quality']});
  }
  request(){if(!this.frame&&this.visible&&!this.ownerDocument.hidden&&this.isConnected)this.frame=win.requestAnimationFrame(time=>this.tick(time));}
  kick(x=0,y=1,speed=140){
   if(!this.membrane)return;
   bubbleHit(this.membrane,14,x,y,speed);this.bounce=-.9;this.request();
  }
  velocity(x,y){if(!this.body)return;this.body.vx=x;this.body.vy=y;if(x||y)this.request();}
  pressureHit(point,kind,dt=1,age=0){
   if(!this.visible||this.ownerDocument.hidden)return;
   const r=this.getBoundingClientRect();if(!r.width||!r.height)return;
   const scale=menuPoolView(win.innerWidth,win.innerHeight).scale,unit=r.width/28;
   const body={id:this.phase,x:(r.left+r.width/2+this.pressure.x*unit)/scale,y:(r.top+r.height/2+this.pressure.y*unit)/scale,radius:r.width/2/scale};
   const hit=bubblePressure(body,{x:point.x/scale,y:point.y/scale},kind,dt,age);if(!hit)return;
   const convert=scale/unit;
   this.pressure.vx+=hit.vx*convert;this.pressure.vy+=hit.vy*convert;
   const speed=Math.hypot(this.pressure.vx,this.pressure.vy),limit=1100*convert;
   if(speed>limit){this.pressure.vx*=limit/speed;this.pressure.vy*=limit/speed;}
   bubbleHit(this.membrane,14,hit.nx,hit.ny,hit.speed*convert);
   this.request();
  }
  press(point){
   if(!this.visible||this.ownerDocument.hidden)return;
   this.pressureHit(point,'tap');this.pulses.push({...point,age:0});if(this.pulses.length>8)this.pulses.shift();
  }
  halt(){
   if(this.frame)win.cancelAnimationFrame(this.frame);this.frame=0;this.last=0;
  }
  reset(){
   if(this.frame)win.cancelAnimationFrame(this.frame);this.frame=0;this.last=0;this.bounce=0;
   this.membrane=bubbleCreate();if(this.body)this.body.vx=this.body.vy=0;
   this.pressure={x:0,y:0,vx:0,vy:0};this.pulses=[];
   this.style.transform='';if(this.visible)this.paint();
  }
  tick(time){
   this.frame=0;if(!this.isConnected||!this.visible||this.ownerDocument.hidden){this.halt();return;}
   if(!this.renderReady(time)){this.request();return;}
   const dt=this.last?Math.min(.05,(time-this.last)/1000):1/60;this.last=time;
   this.age+=dt;
   for(const point of contacts.values())this.pressureHit(point,'hold',dt);
   for(const point of this.pulses){this.pressureHit(point,'pulse',dt,point.age);point.age+=dt;}
   this.pulses=this.pulses.filter(point=>point.age<1.25);
   const sensor=motion.sample();
   this.pressure.vx+=sensor.x*dt;this.pressure.vy+=sensor.y*dt;
   this.pressure=skinSpringStep(this.pressure,dt,{stiffness:24,damping:5});
   // Keep the membrane tethered inside its unchanged control target.
   const distance=Math.hypot(this.pressure.x,this.pressure.y),limit=10;
   if(distance>limit){const nx=this.pressure.x/distance,ny=this.pressure.y/distance;this.pressure.x=nx*limit;this.pressure.y=ny*limit;
    const outward=this.pressure.vx*nx+this.pressure.vy*ny;if(outward>0){this.pressure.vx-=nx*outward;this.pressure.vy-=ny*outward;}}
   // In the pool, nearby motion and contacts keep the membrane alive. UI
   // bubbles have no physical neighbours, so give that same spring model a
   // bounded current and occasional small impacts instead of freezing it.
   const angle=this.phase+this.age*1.7;
   const flow={vx:34*Math.cos(angle)+sensor.x,vy:28*Math.sin(angle*.83)+sensor.y};
   if(this.age>=this.nextRipple){
    bubbleHit(this.membrane,14,Math.cos(angle),Math.sin(angle),60);
    this.nextRipple=this.age+1.35+.35*(1+Math.sin(angle));
   }
   bubbleStep(this.membrane,{...this.body,vx:this.body.vx+this.pressure.vx,vy:this.body.vy+this.pressure.vy},dt,false,flow);
   this.bounce*=Math.exp(-dt*5);
   // A small tethered hop for decorative icons; the large viewer owns its drag tether.
   this.style.transform=this.closest('.skin-preview-interactive')?'':`translateY(${(Math.sin(time*.018)*this.bounce*12).toFixed(3)}%)`;
   this.paint();
   this.request();
  }
  paint(){
   if(!this.context||!this.size)return;
   const pixels=Math.ceil(this.size*3.6*qualityPixelRatio(this.ownerDocument.body.dataset?.quality,win.devicePixelRatio||1));
   if(this.canvas.width!==pixels||this.canvas.height!==pixels)this.canvas.width=this.canvas.height=pixels;
   const c=this.context;c.setTransform(1,0,0,1,0,0);c.clearRect(0,0,pixels,pixels);c.setTransform(pixels/100.8,0,0,pixels/100.8,0,0);
   const style=win.getComputedStyle(this),color=style.getPropertyValue('--skin-color').trim()||'#f1f9d7';
   const body={...this.body,x:this.body.x+this.pressure.x,y:this.body.y+this.pressure.y};
   const points=bubbleOutline(this.membrane,body);
   bubbleRender(c,body,points,color,{glowExtent:1.3,lowQuality:this.ownerDocument.body.dataset?.quality==='low'});
   if(style.getPropertyValue('--player-bubble-outline').trim()==='1'){
    // A separate contour follows the membrane, leaving its luminous rim intact.
    const gap=.8+84/this.size;
    const outside=points.map(point=>{const dx=point.x-body.x,dy=point.y-body.y,d=Math.hypot(dx,dy);return {x:point.x+dx/d*gap,y:point.y+dy/d*gap};});
    c.strokeStyle=style.color;c.lineWidth=42/this.size;c.stroke(bubblePath(outside));
   }
  }
  disconnectedCallback(){
   this.visible=false;this.halt();this.resize.disconnect();this.resize=null;this.intersection.disconnect();this.preferences.disconnect();
   this.target.removeEventListener('focusin',this.activate);
   this.ownerDocument.removeEventListener('scroll',this.scrolled,true);this.scrollPositions.clear();
   instances.delete(this);if(!instances.size){unmount?.();unmount=null;}
   this.ownerDocument.removeEventListener('visibilitychange',this.visibility);
  }
 }
 win.customElements.define('player-bubble',PlayerBubble);
}
