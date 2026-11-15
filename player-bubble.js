import {frameGate} from './performance.js?v=98f53fc38e408a68f5e1beee87a7d0e0066fe8a1093aa41acc5b7134cdaac489';
import {CosmeticVisual} from './cosmetic-visual.js?v=75f3164bf98cdce5c7f48f0695f5df0bda00b2bcaecbfef14cd35613cba151f0';
import {qualityPixelRatio} from './quality.js?v=33c4a6dbcda13ded7499caa9a3563afa6903c4346850134bc5bd467cbac4ad4e';
import {bubbleCreate,bubbleHit,bubbleStep,bubbleOutline} from './bubble.js?v=385baeaa905192ab9831eba4809c9c2370062e45dd55402b892d2ea214a30bac';
import {bubblePressure,bubbleContactMount} from './bubble-pressure.js?v=b5bc5af7a6c96099ebff8ebb3bdb5e8bd38cd0780e699102086111db5779588b';
import {menuPoolView} from './menu-pool.js?v=d66dd93f756efc88d83a2916e508a39825ae5fec916e47ea0ae44d23f18e543e';
import {skinSpringStep} from './skin-preview.js?v=f6a2f88366df07d470289950dc3f210a87107edc99259fc29ce505ba69a2567a';
import {bubbleRender,bubblePath} from './bubble-render.js?v=0fb077e27e26a90c91049d6eba0ddb11d51a8b23c41c77fb68026af650ecc46a';
import {visualActivityMount} from './visual-activity.js?v=ca1926027ea9e579abb4052b949a9fce925b332e26c2fba1d6009efe4436bf1f';

// Decorative instances own only visual state. The surrounding button or large
// preview keeps its existing input, focus, navigation and progression contract.
import {playerMotion} from './player-motion.js?v=577160ddcb2e76940b04bf9ae7ff772b6ea10e077ac294aaa5ce572fbd733ce7';
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
   this.membrane=bubbleCreate();this.body={x:50.4,y:50.4,radius:14,vx:0,vy:0};this.trail=new CosmeticVisual();
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
   this.change=()=>{this.activity?.refresh();if(this.canAnimate())this.paint();this.request();};
   this.visibility=()=>{if(this.ownerDocument.hidden){input.clear();this.halt();}else this.request();};
   this.scrollPositions=new Map();
   for(let ancestor=this.parentElement;ancestor;ancestor=ancestor.parentElement)this.scrollPositions.set(ancestor,{x:ancestor.scrollLeft||0,y:ancestor.scrollTop||0});
   this.scrolled=event=>{
    const previous=this.scrollPositions.get(event.target);if(!previous)return;
    const next={x:event.target.scrollLeft||0,y:event.target.scrollTop||0};this.scrollPositions.set(event.target,next);
    if(!this.canAnimate())return;
    const dx=next.x-previous.x,dy=next.y-previous.y,distance=Math.hypot(dx,dy);if(!distance)return;
    const impulse=Math.min(18,distance*28/Math.max(1,this.size)*1.2);
    this.pressure.vx=Math.max(-18,Math.min(18,(dx/distance*impulse/9-this.pressure.x)*6));
    this.pressure.vy=Math.max(-18,Math.min(18,(dy/distance*impulse/9-this.pressure.y)*6));
    bubbleHit(this.membrane,14,-dx/distance,-dy/distance,impulse*.35);this.request();
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
   this.activity=visualActivityMount(this,active=>{if(active)this.request();else this.halt();},{intersection:false});
  }
  canAnimate(){return this.visible&&!this.ownerDocument.hidden&&this.isConnected&&this.activity?.isActive()!==false;}
  request(){if(!this.frame&&this.canAnimate())this.frame=win.requestAnimationFrame(time=>this.tick(time));}
  kick(x=0,y=1,speed=140){
   if(!this.membrane)return;
   bubbleHit(this.membrane,14,x,y,speed);this.bounce=-.9;this.request();
  }
  velocity(x,y){if(!this.body)return;this.body.vx=x;this.body.vy=y;if(x||y)this.request();}
  pressureHit(point,kind,dt=1,age=0){
   if(!this.canAnimate())return;
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
   if(!this.canAnimate())return;
   this.pressureHit(point,'tap');this.pulses.push({...point,age:0});if(this.pulses.length>8)this.pulses.shift();
  }
  halt(){
   if(this.frame)win.cancelAnimationFrame(this.frame);this.frame=0;this.last=0;this.trail?.breakTrail();
  }
  reset(){
   if(this.frame)win.cancelAnimationFrame(this.frame);this.frame=0;this.last=0;this.bounce=0;
   this.membrane=bubbleCreate();this.trail?.breakTrail();if(this.body)this.body.vx=this.body.vy=0;
   this.pressure={x:0,y:0,vx:0,vy:0};this.pulses=[];
   this.style.transform='';if(this.visible)this.paint();
  }
  tick(time){
   this.frame=0;if(!this.canAnimate()){this.halt();return;}
   if(!this.renderReady(time)){this.request();return;}
   const dt=this.last?Math.min(.05,(time-this.last)/1000):1/60;this.last=time;
   this.age+=dt;
   for(const point of contacts.values())this.pressureHit(point,'hold',dt);
   for(const point of this.pulses){this.pressureHit(point,'pulse',dt,point.age);point.age+=dt;}
   this.pulses=this.pulses.filter(point=>point.age<1.25);
   const sensor=motion.sample();
   this.pressure.vx+=sensor.x*dt;this.pressure.vy+=sensor.y*dt;
   this.pressure=skinSpringStep(this.pressure,dt,{stiffness:24,damping:10});
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
   this.paint(dt);
   this.request();
  }
  paint(dt=0){
   if(!this.context||!this.size||!this.canAnimate())return;
   const c=this.context;
   const style=win.getComputedStyle(this),color=style.getPropertyValue('--skin-color').trim()||'#f1f9d7';
   const body={...this.body,x:this.body.x+this.pressure.x,y:this.body.y+this.pressure.y};
   // Sample actual screen movement, including parent drag/scroll and the icon's
   // own hop. Reproject the old points into this moving canvas so the tail stays
   // behind, rather than moving with the element. Resizes are discontinuities.
   const rect=this.getBoundingClientRect(),unit=this.size/28,x=(rect.left+rect.width/2)/unit,y=(rect.top+rect.height/2)/unit;
   if(this.trailUnit!==unit){this.trail.breakTrail();this.trailUnit=unit;}
   this.trail.configure({trail:style.getPropertyValue('--player-trail').trim()});
   // Style observers repaint during a grabbed parent's transform. A repaint
   // has no elapsed simulation time and must not break the continuous trail.
   if(dt>0)this.trail.step({x:x+this.pressure.x,y:y+this.pressure.y},dt);
   // The tail belongs to movement, not the icon's hit box. Extend this same
   // canvas around its live history, keeping the allocation viewport-bounded.
   // Quantized edges avoid reallocating the backing bitmap for every pixel.
   let left=0,top=0,right=100.8,bottom=100.8;
   const ox=this.body.x-x,oy=this.body.y-y,pad=22;
   for(const point of this.trail.points){
    left=Math.min(left,Math.max(ox,point.x+ox-pad));right=Math.max(right,Math.min(ox+win.innerWidth/unit,point.x+ox+pad));
    top=Math.min(top,Math.max(oy,point.y+oy-pad));bottom=Math.max(bottom,Math.min(oy+win.innerHeight/unit,point.y+oy+pad));
   }
   const edge=value=>Math.floor(value*unit/32)*32/unit;
   left=edge(left);top=edge(top);right=-edge(-right);bottom=-edge(-bottom);
   const width=(right-left)*unit,height=(bottom-top)*unit,ratio=qualityPixelRatio(this.ownerDocument.body.dataset?.quality,win.devicePixelRatio||1);
   const pixelWidth=Math.ceil(width*ratio),pixelHeight=Math.ceil(height*ratio);
   if(this.canvas.width!==pixelWidth)this.canvas.width=pixelWidth;
   if(this.canvas.height!==pixelHeight)this.canvas.height=pixelHeight;
   Object.assign(this.canvas.style,{width:`${width}px`,height:`${height}px`,left:`${(left-this.body.x)*unit+this.size/2}px`,top:`${(top-this.body.y)*unit+this.size/2}px`});
   c.setTransform(1,0,0,1,0,0);c.clearRect(0,0,pixelWidth,pixelHeight);
   c.setTransform(unit*ratio,0,0,unit*ratio,-left*unit*ratio,-top*unit*ratio);
   c.save();c.translate(this.body.x-x,this.body.y-y);this.trail.render(c,this.ownerDocument.body.dataset?.quality==='low',true);c.restore();
   const points=bubbleOutline(this.membrane,body);
   bubbleRender(c,body,points,color,{glowExtent:1.3,skinTime:this.age,skinStyle:style.getPropertyValue('--skin-style').trim()||style.getPropertyValue('--player-skin-style').trim(),lowQuality:this.ownerDocument.body.dataset?.quality==='low'});
   if(style.getPropertyValue('--player-bubble-outline').trim()==='1'){
    // A separate contour follows the membrane, leaving its luminous rim intact.
    const gap=.8+84/this.size;
    const outside=points.map(point=>{const dx=point.x-body.x,dy=point.y-body.y,d=Math.hypot(dx,dy);return {x:point.x+dx/d*gap,y:point.y+dy/d*gap};});
    c.strokeStyle=style.color;c.lineWidth=42/this.size;c.stroke(bubblePath(outside));
   }
  }
  disconnectedCallback(){
   this.visible=false;this.halt();this.activity?.destroy();this.activity=null;this.resize.disconnect();this.resize=null;this.intersection.disconnect();this.preferences.disconnect();
   this.target.removeEventListener('focusin',this.activate);
   this.ownerDocument.removeEventListener('scroll',this.scrolled,true);this.scrollPositions.clear();
   instances.delete(this);if(!instances.size){unmount?.();unmount=null;}
   this.ownerDocument.removeEventListener('visibilitychange',this.visibility);
  }
 }
 win.customElements.define('player-bubble',PlayerBubble);
}
