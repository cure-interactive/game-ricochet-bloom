import {bubbleCreate,bubbleHit,bubbleStep,bubbleOutline} from './bubble.js?v=385baeaa905192ab9831eba4809c9c2370062e45dd55402b892d2ea214a30bac';
import {bubbleRender} from './bubble-render.js?v=997e50dee1966fa389f1522907cc5fcd744d3bb3525669d3e306cec729fe9b34';

// Decorative instances own only visual state. The surrounding button or large
// preview keeps its existing input, focus, navigation and progression contract.
export function registerPlayerBubble(win=window){
 if(win.customElements.get('player-bubble'))return;
 class PlayerBubble extends win.HTMLElement{
  connectedCallback(){
   if(this.canvas)return;
   this.membrane=bubbleCreate();this.body={x:39.2,y:39.2,radius:14,vx:0,vy:0};
   this.frame=0;this.last=0;this.visible=false;this.bounce=0;
   this.canvas=this.ownerDocument.createElement('canvas');this.canvas.setAttribute('aria-hidden','true');this.append(this.canvas);
   this.context=this.canvas.getContext('2d');
   this.media=win.matchMedia('(prefers-reduced-motion: reduce)');
   this.target=this.closest('button')||this;
   this.activate=()=>this.kick(0,1);
   this.change=()=>{if(this.reduced())this.reset();else this.request();};
   this.visibility=()=>{if(this.ownerDocument.hidden)this.reset();else this.request();};
   for(const event of ['pointerenter','pointerdown','focusin'])this.target.addEventListener(event,this.activate);
   this.media.addEventListener('change',this.change);this.ownerDocument.addEventListener('visibilitychange',this.visibility);
   this.resize=new win.ResizeObserver(()=>{this.size=this.getBoundingClientRect().width;this.request();});this.resize.observe(this);
   this.intersection=new win.IntersectionObserver(entries=>{
    const visible=entries[0].isIntersecting&&entries[0].intersectionRect.width>0;
    if(visible&&!this.visible){this.visible=true;this.kick(0,1,95);this.request();}else if(!visible){this.visible=false;this.reset();}
   });this.intersection.observe(this);
   this.preferences=new win.MutationObserver(this.change);
   // Skin colors can be overridden on a reward button, preview or active profile.
   for(let ancestor=this.parentElement;ancestor;ancestor=ancestor.parentElement)this.preferences.observe(ancestor,{attributes:true,attributeFilter:['class','style']});
  }
  reduced(){return this.media.matches||this.ownerDocument.body.classList.contains('motion-reduced');}
  request(){if(!this.frame&&this.visible&&!this.ownerDocument.hidden&&this.isConnected)this.frame=win.requestAnimationFrame(time=>this.tick(time));}
  kick(x=0,y=1,speed=140){
   if(!this.membrane||this.reduced())return;
   bubbleHit(this.membrane,14,x,y,speed);this.bounce=-.9;this.request();
  }
  velocity(x,y){if(!this.body)return;this.body.vx=x;this.body.vy=y;if(x||y)this.request();}
  reset(){
   if(this.frame)win.cancelAnimationFrame(this.frame);this.frame=0;this.last=0;this.bounce=0;
   this.membrane=bubbleCreate();if(this.body)this.body.vx=this.body.vy=0;
   this.style.transform='';if(this.visible)this.paint();
  }
  tick(time){
   this.frame=0;if(!this.isConnected||!this.visible||this.ownerDocument.hidden){this.reset();return;}
   if(this.reduced()){this.reset();return;}
   const dt=this.last?Math.min(.05,(time-this.last)/1000):1/60;this.last=time;
   bubbleStep(this.membrane,this.body,dt);
   this.bounce*=Math.exp(-dt*5);
   // A small tethered hop for decorative icons; the large viewer owns its drag tether.
   this.style.transform=this.closest('.skin-preview-interactive')?'':`translateY(${(Math.sin(time*.018)*this.bounce*12).toFixed(3)}%)`;
   this.paint();
   const active=this.body.vx||this.body.vy||Math.abs(this.bounce)>.002||
    [...this.membrane.offset,...this.membrane.speed,...this.membrane.strain,...this.membrane.strainSpeed,...this.membrane.core,...this.membrane.coreSpeed].some(value=>Math.abs(value)>.002);
   if(active)this.request();else this.reset();
  }
  paint(){
   if(!this.context||!this.size)return;
   const pixels=Math.ceil(this.size*2.8*Math.min(2,win.devicePixelRatio||1));
   if(this.canvas.width!==pixels||this.canvas.height!==pixels)this.canvas.width=this.canvas.height=pixels;
   const c=this.context;c.setTransform(1,0,0,1,0,0);c.clearRect(0,0,pixels,pixels);c.setTransform(pixels/78.4,0,0,pixels/78.4,0,0);
   const color=win.getComputedStyle(this).getPropertyValue('--skin-color').trim()||'#f1f9d7';
   bubbleRender(c,this.body,bubbleOutline(this.membrane,this.body),color,{glowExtent:1.3});
  }
  disconnectedCallback(){
   this.visible=false;this.reset();this.resize.disconnect();this.intersection.disconnect();this.preferences.disconnect();
   for(const event of ['pointerenter','pointerdown','focusin'])this.target.removeEventListener(event,this.activate);
   this.media.removeEventListener('change',this.change);this.ownerDocument.removeEventListener('visibilitychange',this.visibility);
   this.canvas.remove();this.canvas=null;
  }
 }
 win.customElements.define('player-bubble',PlayerBubble);
}
