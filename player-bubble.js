import {frameGate} from './performance.js?v=98f53fc38e408a68f5e1beee87a7d0e0066fe8a1093aa41acc5b7134cdaac489';
import {CosmeticVisual} from './cosmetic-visual.js?v=d2dfd408a59efedadf795dafbc89880e0da1cf9e6de3dd23277b9c9df98a7e02';
import {qualityPixelRatio} from './quality.js?v=33c4a6dbcda13ded7499caa9a3563afa6903c4346850134bc5bd467cbac4ad4e';
import {bubbleCreate,bubbleHit,bubbleStep,bubbleOutline} from './bubble.js?v=596f6e9b83b23b8703b38f1cca7caed5fa89f73e8ec111bf6dbbe8b1c7761300';
import {bubblePressure,bubbleContactMount} from './bubble-pressure.js?v=b5bc5af7a6c96099ebff8ebb3bdb5e8bd38cd0780e699102086111db5779588b';
import {menuPoolView} from './menu-pool.js?v=783c021cf6f11a52924efa9ab4e95a85fa34bc1887604a4ced50a0b5ea93b2dc';
import {skinSpringStep} from './skin-preview.js?v=18ffd23993b6d5cca1ef07433534c7facb9f35b6108875ac98d28c6d420fb096';
import {bubbleRender,bubblePath} from './bubble-render.js?v=d6880307de631dfa1357c83f8761b2bb7d6949cf62705023df35914c27cca07a';
import {visualActivityMount} from './visual-activity.js?v=6f020d19b42eb883c5a1bd52e3b1fd9c9ce47af8512d72b2945fee1753764cba';

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
    if(this.closest('.skin-preview-interactive')){
     this.pressure.vx=Math.max(-18,Math.min(18,(dx/distance*impulse/9-this.pressure.x)*6));
     this.pressure.vy=Math.max(-18,Math.min(18,(dy/distance*impulse/9-this.pressure.y)*6));
    }
    bubbleHit(this.membrane,14,-dx/distance,-dy/distance,impulse*.35);this.request();
   };
   this.ownerDocument.addEventListener('scroll',this.scrolled,true);
   this.target.addEventListener('focusin',this.activate);
   instances.add(this);if(!unmount)unmount=bubbleContactMount(input,this.ownerDocument,win);
   this.ownerDocument.addEventListener('visibilitychange',this.visibility);
   this.resize=new win.ResizeObserver(()=>{this.size=this.getBoundingClientRect().width;if(this.visible)this.paint();this.request();});this.resize.observe(this);
   this.intersection=new win.IntersectionObserver(entries=>{
    const visible=entries[0].isIntersecting&&entries[0].intersectionRect.width>0;
    if(visible&&!this.visible&&!this.age)this.kick(0,1,95);
    this.visible=visible;this.request();
   });this.intersection.observe(this);
   this.preferences=new win.MutationObserver(this.change);
   // Skin colors can be overridden on a reward button, preview or active profile.
   for(let ancestor=this.parentElement;ancestor;ancestor=ancestor.parentElement)this.preferences.observe(ancestor,{attributes:true,attributeFilter:['class','style','aria-pressed','aria-selected','data-quality']});
   this.activity=visualActivityMount(this,active=>{if(active)this.request();else this.halt();},{intersection:false});
  }
  canAnimate(){return !this.ownerDocument.hidden&&this.isConnected&&this.activity?.isActive()!==false;}
  request(){if(!this.frame&&this.canAnimate())this.frame=win.requestAnimationFrame(time=>this.tick(time));}
  kick(x=0,y=1,speed=140){
   if(!this.membrane)return;
   bubbleHit(this.membrane,14,x,y,speed);this.bounce=-.9;this.request();
  }
  velocity(x,y){if(!this.body)return;this.body.vx=x;this.body.vy=y;if(x||y)this.request();}
  pressureHit(point,kind,dt=1,age=0){
   if(!this.visible||!this.canAnimate())return;
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
   if(!this.visible||!this.canAnimate())return;
   this.pressureHit(point,'tap');this.pulses.push({...point,age:0});if(this.pulses.length>8)this.pulses.shift();
  }
  halt(){
   if(this.frame)win.cancelAnimationFrame(this.frame);this.frame=0;this.last=0;this.trail?.breakTrail();
  }
  reset(){
   if(this.frame)win.cancelAnimationFrame(this.frame);this.frame=0;this.last=0;this.bounce=0;this.hop=0;
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
   this.hop=this.closest('.skin-preview-interactive')?0:Math.sin(time*.018)*this.bounce*12/100*28;
   this.style.transform=this.closest('.skin-preview-interactive')?'':`translateY(${(this.hop/28*100).toFixed(3)}%)`;
   this.paint(dt);
   this.request();
  }
  paint(dt=0){
   if(!this.context||!this.size||!this.canAnimate())return;
   const c=this.context;
   const style=win.getComputedStyle(this),color=style.getPropertyValue('--skin-color').trim()||'#f1f9d7';
   const body={...this.body,x:this.body.x+this.pressure.x,y:this.body.y+this.pressure.y};
   // Large previews follow their parent tether in screen space. Equipped icons
   // sample only their own movement, so scrolling/layout cannot emit trails.
   const rect=this.getBoundingClientRect();if(!rect.width)return;this.size=rect.width;
   const measuredUnit=this.size/28,unit=this.trailUnit&&Math.abs(this.trailUnit-measuredUnit)<.001?this.trailUnit:measuredUnit;
   const parentScale=rect.width/(this.offsetWidth||rect.width),x=(rect.left+rect.width/2)/unit,y=(rect.top+rect.height/2)/unit;
   if(this.trailUnit!==unit){this.trail.breakTrail();this.trailUnit=unit;}
   const preview=!!this.closest('.skin-preview-interactive'),trails=preview||!this.closest('.skin-preview')||!!this.closest('.skin-choice.is-equipped');
   const tx=preview?x:0,ty=preview?y:(this.hop||0),tox=this.body.x-tx,toy=this.body.y-ty;
   if(trails)this.trail.configure({trail:style.getPropertyValue('--player-trail').trim()});else this.trail.breakTrail();
   // Style observers repaint during a grabbed parent's transform. A repaint
   // has no elapsed simulation time and must not break the continuous trail.
   if(trails&&dt>0)this.trail.step({x:tx+this.pressure.x,y:ty+this.pressure.y},dt);
   // The tail belongs to movement, not the icon's hit box. Extend this same
   // canvas around its live history, keeping the allocation viewport-bounded.
   // Quantized edges avoid reallocating the backing bitmap for every pixel.
   const points=bubbleOutline(this.membrane,body),ox=this.body.x-x,oy=this.body.y-y,pad=34;
   // Include the deformed rim, selected contour and device-pixel shadow.
   const rim=1+105/this.size,glow=Math.max(body.radius*1.3,15/unit);
   let left=body.x-glow,top=body.y-glow,right=body.x+glow,bottom=body.y+glow;
   for(const point of points){left=Math.min(left,point.x-rim-glow);right=Math.max(right,point.x+rim+glow);top=Math.min(top,point.y-rim-glow);bottom=Math.max(bottom,point.y+rim+glow);}
   for(const point of this.trail.points){
    left=Math.min(left,point.x+tox-pad);right=Math.max(right,point.x+tox+pad);
    top=Math.min(top,point.y+toy-pad);bottom=Math.max(bottom,point.y+toy+pad);
   }
   const clipped=this.activity?.clip({left:(left-ox)*unit,top:(top-oy)*unit,right:(right-ox)*unit,bottom:(bottom-oy)*unit});
   if(this.canvas.hidden===!!clipped)this.canvas.hidden=!clipped;if(!clipped)return;
   left=clipped.left/unit+ox;top=clipped.top/unit+oy;right=clipped.right/unit+ox;bottom=clipped.bottom/unit+oy;
   const edge=value=>Math.floor(value*unit/32)*32/unit;
   left=edge(left);top=edge(top);right=-edge(-right);bottom=-edge(-bottom);
   const width=(right-left)*unit,height=(bottom-top)*unit,ratio=qualityPixelRatio(this.ownerDocument.body.dataset?.quality,win.devicePixelRatio||1);
   const pixelWidth=Math.ceil(width*ratio),pixelHeight=Math.ceil(height*ratio);
   if(this.canvas.width!==pixelWidth)this.canvas.width=pixelWidth;
   if(this.canvas.height!==pixelHeight)this.canvas.height=pixelHeight;
   Object.assign(this.canvas.style,{width:`${width/parentScale}px`,height:`${height/parentScale}px`,left:`${((left-this.body.x)*unit+this.size/2)/parentScale}px`,top:`${((top-this.body.y)*unit+this.size/2)/parentScale}px`});
   c.setTransform(1,0,0,1,0,0);c.clearRect(0,0,pixelWidth,pixelHeight);
   c.setTransform(unit*ratio,0,0,unit*ratio,-left*unit*ratio,-top*unit*ratio);
   c.save();c.translate(tox,toy);if(trails)this.trail.render(c,this.ownerDocument.body.dataset?.quality==='low',true);c.restore();
   bubbleRender(c,body,points,color,{glowExtent:1.3,skinTime:this.age,skinStyle:style.getPropertyValue('--skin-style').trim()||style.getPropertyValue('--player-skin-style').trim(),lowQuality:this.ownerDocument.body.dataset?.quality==='low'});
   if(style.getPropertyValue('--player-bubble-outline').trim()==='1'){
    // A separate contour follows the membrane, leaving its luminous rim intact.
    const gap=.8+84/this.size;
    const outside=points.map(point=>{const dx=point.x-body.x,dy=point.y-body.y,d=Math.hypot(dx,dy);return {x:point.x+dx/d*gap,y:point.y+dy/d*gap};});
    c.save();const start=style.getPropertyValue('--player-outline-start').trim(),end=style.getPropertyValue('--player-outline-end').trim();
    if(start!==''&&end!==''){c.beginPath();c.rect(this.body.x-14+28*Number(start),-10000,28*(Number(end)-Number(start)),20000);c.clip();}
    c.strokeStyle=style.color;c.lineWidth=42/this.size;c.stroke(bubblePath(outside));c.restore();
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
