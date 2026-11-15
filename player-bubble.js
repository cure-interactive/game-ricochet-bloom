import {qualityPixelRatio} from './quality.js?v=33c4a6dbcda13ded7499caa9a3563afa6903c4346850134bc5bd467cbac4ad4e';
import {bubbleCreate,bubbleHit,bubbleStep,bubbleOutline} from './bubble.js?v=385baeaa905192ab9831eba4809c9c2370062e45dd55402b892d2ea214a30bac';
import {bubblePressure,bubbleContactMount} from './bubble-pressure.js?v=0f0369c96892b587b973530192fa387903a71fa360cf582520cd16239bc7360c';
import {menuPoolView} from './menu-pool.js?v=a5ed2d2493c9c0b42afc144cd7c629a1a1a90e62d06cef37694428adee94911b';
import {skinSpringStep} from './skin-preview.js?v=8e77b5504c857a83a814dcd61206c7f9fe8a72da3f327516a56db73a51645e2e';
import {bubbleRender} from './bubble-render.js?v=c5d036382edf95377b9d55c39b58264bb3af9c05e2412b3aca4b1d04215a6388';

// Decorative instances own only visual state. The surrounding button or large
// preview keeps its existing input, focus, navigation and progression contract.
export function registerPlayerBubble(win=window){
 if(win.customElements.get('player-bubble'))return;
 let sequence=0,unmount;
 const instances=new Set(),contacts=new Map();
 const input={contact(id,x,y,pulse=false){
  const point={x,y};
  if(pulse&&!contacts.has(id))for(const el of instances)el.press(point);
  contacts.set(id,point);
 },release(id){contacts.delete(id);},clear(){contacts.clear();for(const el of instances)el.reset();}};
 class PlayerBubble extends win.HTMLElement{
  connectedCallback(){
   if(this.canvas)return;
   this.membrane=bubbleCreate();this.body={x:39.2,y:39.2,radius:14,vx:0,vy:0};
   this.frame=0;this.last=0;this.visible=false;this.bounce=0;
   this.pressure={x:0,y:0,vx:0,vy:0};this.pulses=[];
   this.phase=++sequence*2.4;this.age=0;this.nextRipple=1.1+(sequence%4)*.23;
   this.canvas=this.ownerDocument.createElement('canvas');this.canvas.setAttribute('aria-hidden','true');this.append(this.canvas);
   this.context=this.canvas.getContext('2d');
   this.target=this.closest('button')||this;
   this.activate=()=>{if(!contacts.size)this.kick(0,1);};
   this.change=()=>{if(this.visible)this.paint();this.request();};
   this.visibility=()=>{if(this.ownerDocument.hidden)input.clear();else this.request();};
   this.target.addEventListener('focusin',this.activate);
   instances.add(this);if(!unmount)unmount=bubbleContactMount(input,this.ownerDocument,win);
   this.ownerDocument.addEventListener('visibilitychange',this.visibility);
   this.resize=new win.ResizeObserver(()=>{this.size=this.getBoundingClientRect().width;contacts.clear();this.reset();this.request();});this.resize.observe(this);
   this.intersection=new win.IntersectionObserver(entries=>{
    const visible=entries[0].isIntersecting&&entries[0].intersectionRect.width>0;
    if(visible&&!this.visible){this.visible=true;this.kick(0,1,95);this.request();}else if(!visible){this.visible=false;this.reset();}
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
  reset(){
   if(this.frame)win.cancelAnimationFrame(this.frame);this.frame=0;this.last=0;this.bounce=0;
   this.membrane=bubbleCreate();if(this.body)this.body.vx=this.body.vy=0;
   this.pressure={x:0,y:0,vx:0,vy:0};this.pulses=[];
   this.style.transform='';if(this.visible)this.paint();
  }
  tick(time){
   this.frame=0;if(!this.isConnected||!this.visible||this.ownerDocument.hidden){this.reset();return;}
   const dt=this.last?Math.min(.05,(time-this.last)/1000):1/60;this.last=time;
   this.age+=dt;
   for(const point of contacts.values())this.pressureHit(point,'hold',dt);
   for(const point of this.pulses){this.pressureHit(point,'pulse',dt,point.age);point.age+=dt;}
   this.pulses=this.pulses.filter(point=>point.age<1.25);
   this.pressure=skinSpringStep(this.pressure,dt,{stiffness:24,damping:5});
   // Keep the membrane tethered inside its unchanged control target.
   const distance=Math.hypot(this.pressure.x,this.pressure.y),limit=10;
   if(distance>limit){const nx=this.pressure.x/distance,ny=this.pressure.y/distance;this.pressure.x=nx*limit;this.pressure.y=ny*limit;
    const outward=this.pressure.vx*nx+this.pressure.vy*ny;if(outward>0){this.pressure.vx-=nx*outward;this.pressure.vy-=ny*outward;}}
   // In the pool, nearby motion and contacts keep the membrane alive. UI
   // bubbles have no physical neighbours, so give that same spring model a
   // bounded current and occasional small impacts instead of freezing it.
   const angle=this.phase+this.age*1.7;
   const flow={vx:34*Math.cos(angle),vy:28*Math.sin(angle*.83)};
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
   const pixels=Math.ceil(this.size*2.8*qualityPixelRatio(this.ownerDocument.body.dataset?.quality,win.devicePixelRatio||1));
   if(this.canvas.width!==pixels||this.canvas.height!==pixels)this.canvas.width=this.canvas.height=pixels;
   const c=this.context;c.setTransform(1,0,0,1,0,0);c.clearRect(0,0,pixels,pixels);c.setTransform(pixels/78.4,0,0,pixels/78.4,0,0);
   const style=win.getComputedStyle(this),color=style.getPropertyValue('--skin-color').trim()||'#f1f9d7';
   const body={...this.body,x:this.body.x+this.pressure.x,y:this.body.y+this.pressure.y};
   const skin=bubbleRender(c,body,bubbleOutline(this.membrane,body),color,{glowExtent:1.3,lowQuality:this.ownerDocument.body.dataset?.quality==='low'});
   if(style.getPropertyValue('--player-bubble-outline').trim()==='1'){
    // Follow the actual membrane, keeping a 1.5 CSS-pixel edge at icon sizes.
    c.strokeStyle=style.color;c.lineWidth=42/this.size;c.stroke(skin);
   }
  }
  disconnectedCallback(){
   this.visible=false;this.reset();this.resize.disconnect();this.intersection.disconnect();this.preferences.disconnect();
   this.target.removeEventListener('focusin',this.activate);
   instances.delete(this);if(!instances.size){unmount?.();unmount=null;}
   this.ownerDocument.removeEventListener('visibilitychange',this.visibility);
   this.canvas.remove();this.canvas=null;
  }
 }
 win.customElements.define('player-bubble',PlayerBubble);
}
