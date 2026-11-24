import {bubbleInteractionMount} from './bubble-interaction.js?v=6e496baf63684650a5c5e46f8c1ecc9358c9f4a5ce33f9bac61381b48fd1dfa7';
import {frameGate} from './performance.js?v=98f53fc38e408a68f5e1beee87a7d0e0066fe8a1093aa41acc5b7134cdaac489';
import {CosmeticVisual} from './cosmetic-visual.js?v=1fa80b97717a10678ad745b05162b61e2c273f0467e1a90bc60e6d8611f53a97';
import {qualityPixelRatio} from './quality.js?v=33c4a6dbcda13ded7499caa9a3563afa6903c4346850134bc5bd467cbac4ad4e';
import {bubbleCreate,bubbleHit,bubbleStep,bubbleOutline} from './bubble.js?v=596f6e9b83b23b8703b38f1cca7caed5fa89f73e8ec111bf6dbbe8b1c7761300';
import {bubbleRender,bubblePath} from './bubble-render.js?v=9b8e3c455a0794128139a4435b903daae6dbb8b7ce74ca8610f59c0d4af7ded8';
import {visualActivityMount} from './visual-activity.js?v=6f020d19b42eb883c5a1bd52e3b1fd9c9ce47af8512d72b2945fee1753764cba';

// Local movement is independent of DOM placement and the decorative current.
// The outer element already applies offset; the membrane adds pressure locally.
export function playerMotionSample(pressure,tether,hop=0){
 const offset={x:tether?.x||0,y:(tether?.y||0)+hop};
 return {x:offset.x+pressure.x,y:offset.y+pressure.y,vx:(tether?.vx||0)+pressure.vx,vy:(tether?.vy||0)+pressure.vy,offset};
}

// Decorative instances own only visual state. The surrounding button or large
// preview keeps its existing input, focus, navigation and progression contract.
export function registerPlayerBubble(win=window){
 if(win.customElements.get('player-bubble'))return;
 let sequence=0;
 class PlayerBubble extends win.HTMLElement{
  static get observedAttributes(){return ['motion','trail'];}
  attributeChangedCallback(){this.change?.();}
  connectedCallback(){
   if(this.resize)return;
   if(!this.membrane){
   this.membrane=bubbleCreate();this.body={x:50.4,y:50.4,radius:14,vx:0,vy:0};this.trail=new CosmeticVisual();
   this.renderReady=frameGate();this.frame=0;this.last=0;this.visible=false;this.bounce=0;
   this.savedPressure={x:0,y:0,vx:0,vy:0};
   this.phase=++sequence*2.4;this.age=0;this.nextRipple=1.1+(sequence%4)*.23;
   }
   if(!this.canvas){
   this.canvas=this.ownerDocument.createElement('canvas');this.canvas.setAttribute('aria-hidden','true');this.append(this.canvas);
   this.context=this.canvas.getContext('2d');
   }
   this.target=this.closest('button')||this;
   this.change=()=>{this.activity?.refresh();if(this.canAnimate())this.paint();this.request();};
   this.visibility=()=>{if(this.ownerDocument.hidden){this.interaction?.clear();this.halt();}else this.request();};
   this.interaction=bubbleInteractionMount(this,{contact:(...args)=>this.trail.accessories.contact(...args),id:this.phase,active:()=>this.canAnimate(),request:()=>this.request(),frame:()=>{const r=this.getBoundingClientRect(),unit=r.width/28,offset=this.motionSample().offset;return {x:r.left-offset.x*unit,y:r.top-offset.y*unit};},geometry:()=>{const r=this.getBoundingClientRect(),unit=r.width/28;return {x:r.left+r.width/2+this.pressure.x*unit,y:r.top+r.height/2+this.pressure.y*unit,unit,visible:this.visible};},hit:(x,y,speed)=>bubbleHit(this.membrane,14,x,y,speed)});
   this.interaction.state=this.savedPressure;this.scrolled=this.interaction.scroll;this.scrollPositions=this.interaction.positions;
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
  motionSet(value){this.motionState={...value};if(this.body)this.request();}
  tether(x,y){this.motionSet({...this.motionState,x,y});}
  velocity(vx,vy){this.motionSet({...this.motionState,vx,vy});}
  motionSample(){return playerMotionSample(this.pressure,this.getAttribute('motion')==='tether'?this.motionState:null,this.hop||0);}
  get pressure(){return this.interaction?.state||this.savedPressure;}
  set pressure(value){this.savedPressure=value;if(this.interaction)this.interaction.state=value;}
  get pulses(){return this.interaction?.pulses||[];}
  pressureHit(...args){this.interaction?.pressure(...args);}
  press(point){this.interaction?.press(point);}
  halt(){
   if(this.frame)win.cancelAnimationFrame(this.frame);this.frame=0;this.last=0;this.trail?.breakTrail();
  }
  reset(){
   if(this.frame)win.cancelAnimationFrame(this.frame);this.frame=0;this.last=0;this.bounce=0;this.hop=0;
   this.membrane=bubbleCreate();this.trail?.breakTrail();this.motionState={x:0,y:0,vx:0,vy:0};
   this.interaction?.reset();this.savedPressure=this.pressure;
   this.style.transform='';if(this.visible)this.paint();
  }
  tick(time){
   this.frame=0;if(!this.canAnimate()){this.halt();return;}
   if(!this.renderReady(time)){this.request();return;}
   const dt=this.last?Math.min(.05,(time-this.last)/1000):1/60;this.last=time;
   this.age+=dt;
   const sensor=this.interaction.step(dt);
   // In the pool, nearby motion and contacts keep the membrane alive. UI
   // bubbles have no physical neighbours, so give that same spring model a
   // bounded current and occasional small impacts instead of freezing it.
   const angle=this.phase+this.age*1.7;
   const flow={vx:34*Math.cos(angle)+sensor.x,vy:28*Math.sin(angle*.83)+sensor.y};
   if(this.age>=this.nextRipple){
    bubbleHit(this.membrane,14,Math.cos(angle),Math.sin(angle),60);
    this.nextRipple=this.age+1.35+.35*(1+Math.sin(angle));
   }
   this.bounce*=Math.exp(-dt*5);
   // A small tethered hop for decorative icons; the large viewer owns its drag tether.
   const tether=this.getAttribute('motion')==='tether';
   this.hop=tether?0:Math.sin(time*.018)*this.bounce*12/100*28;
   this.style.transform=tether?'':`translateY(${(this.hop/28*100).toFixed(3)}%)`;
   const motion=this.motionSample();
   bubbleStep(this.membrane,{...this.body,vx:motion.vx,vy:motion.vy},dt,false,flow);
   this.paint(dt,motion,{impulse:sensor.impulse,acceleration:sensor.acceleration});
   this.request();
  }
  paint(dt=0,motion=this.motionSample(),environment={}){
   if(!this.context||!this.size||!this.canAnimate())return;
   const c=this.context;
   const style=win.getComputedStyle(this),color=style.getPropertyValue('--skin-color').trim()||'#f1f9d7';
   const body={...this.body,x:this.body.x+motion.x-motion.offset.x,y:this.body.y+motion.y-motion.offset.y};
   // Explicit local tether motion excludes scrolling/layout in every preview.
   const rect=this.getBoundingClientRect();if(!rect.width)return;this.size=rect.width;
   const measuredUnit=this.size/28,unit=this.trailUnit&&Math.abs(this.trailUnit-measuredUnit)<.001?this.trailUnit:measuredUnit;
   const parentScale=rect.width/(this.offsetWidth||rect.width),x=(rect.left+rect.width/2)/unit,y=(rect.top+rect.height/2)/unit;
   if(this.trailUnit!==unit){this.trail.breakTrail();this.trailUnit=unit;}
   const trails=this.getAttribute('trail')!=='none',tox=this.body.x-motion.offset.x,toy=this.body.y-motion.offset.y;
   const accessories=this.getAttribute('accessories')!==null;
   this.trail.configure({trail:style.getPropertyValue('--player-trail').trim(),pendant:accessories?style.getPropertyValue('--player-pendant').trim():undefined,companion:accessories?style.getPropertyValue('--player-companion').trim():undefined});if(!trails)this.trail.breakTrail();
   // Style observers repaint during a grabbed parent's transform. A repaint
   // has no elapsed simulation time and must not break the continuous trail.
   const accessoryBody={x:motion.x,y:motion.y,radius:14,vx:motion.vx,vy:motion.vy};
   if(dt>0)this.trail.step(accessoryBody,dt,trails,{...environment,shell:bubbleOutline(this.membrane,accessoryBody)});
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
   for(const point of this.trail.accessories.bounds()){left=Math.min(left,point.x+tox-point.r);right=Math.max(right,point.x+tox+point.r);top=Math.min(top,point.y+toy-point.r);bottom=Math.max(bottom,point.y+toy+point.r);}
   // Snap allocation before clipping, never beyond the native scroll viewport.
   const edge=value=>Math.floor(value*unit/32)*32/unit;
   left=edge(left);top=edge(top);right=-edge(-right);bottom=-edge(-bottom);
   const clipped=this.activity?.clip({left:(left-ox)*unit,top:(top-oy)*unit,right:(right-ox)*unit,bottom:(bottom-oy)*unit});
   if(this.canvas.hidden===!!clipped)this.canvas.hidden=!clipped;if(!clipped)return;
   left=clipped.left/unit+ox;top=clipped.top/unit+oy;right=clipped.right/unit+ox;bottom=clipped.bottom/unit+oy;
   const width=(right-left)*unit,height=(bottom-top)*unit,ratio=qualityPixelRatio(this.ownerDocument.body.dataset?.quality,win.devicePixelRatio||1);
   const pixelWidth=Math.ceil(width*ratio),pixelHeight=Math.ceil(height*ratio);
   if(this.canvas.width!==pixelWidth)this.canvas.width=pixelWidth;
   if(this.canvas.height!==pixelHeight)this.canvas.height=pixelHeight;
   Object.assign(this.canvas.style,{width:`${width/parentScale}px`,height:`${height/parentScale}px`,left:`${((left-this.body.x)*unit+this.size/2)/parentScale}px`,top:`${((top-this.body.y)*unit+this.size/2)/parentScale}px`});
   c.setTransform(1,0,0,1,0,0);c.clearRect(0,0,pixelWidth,pixelHeight);
   const sx=pixelWidth/width,sy=pixelHeight/height;
   c.setTransform(unit*sx,0,0,unit*sy,-left*unit*sx,-top*unit*sy);
   c.save();c.translate(tox,toy);if(trails)this.trail.render(c,this.ownerDocument.body.dataset?.quality==='low',true);c.restore();

   if(style.getPropertyValue('--player-bubble-backing').trim()==='1'){
    // A filled backing follows the same membrane and sits beneath its material.
    const gap=.5+56/this.size;
    const outside=points.map(point=>{const dx=point.x-body.x,dy=point.y-body.y,d=Math.hypot(dx,dy);return {x:point.x+dx/d*gap,y:point.y+dy/d*gap};});
    c.save();const start=style.getPropertyValue('--player-backing-start').trim(),end=style.getPropertyValue('--player-backing-end').trim();
    if(start!==''&&end!==''){c.beginPath();c.rect(this.body.x-14+28*Number(start),-10000,28*(Number(end)-Number(start)),20000);c.clip();}
    c.fillStyle=style.color;c.fill(bubblePath(outside));c.restore();
   }
   bubbleRender(c,body,points,color,{glowExtent:1.3,skinTime:this.age,skinStyle:style.getPropertyValue('--skin-style').trim()||style.getPropertyValue('--player-skin-style').trim(),lowQuality:this.ownerDocument.body.dataset?.quality==='low'});
   c.save();c.translate(tox,toy);this.trail.renderAccessories(c,this.ownerDocument.body.dataset?.quality==='low'||this.ownerDocument.body.classList.contains('motion-reduced'));c.restore();
  }
  disconnectedCallback(){
   this.visible=false;this.halt();this.activity?.destroy();this.activity=null;this.resize.disconnect();this.resize=null;this.intersection.disconnect();this.preferences.disconnect();
   this.savedPressure=this.pressure;this.interaction.destroy();this.interaction=null;
   this.ownerDocument.removeEventListener('visibilitychange',this.visibility);
  }
 }
 win.customElements.define('player-bubble',PlayerBubble);
}
