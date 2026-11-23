import {cosmeticGet} from './cosmetic.js?v=5fce426acea1cc7e8321f13619eaedbf2850895e457e202e7acc7843946b35d9';
import {accessoryTier,accessoryPulse} from './accessory.js?v=4d13cc3b9bb353e9a5ba36bbea63f73cf346bf99b33ef7eba5bde79cf60c9e30';
const tau=Math.PI*2,clamp=(x,a,b)=>Math.max(a,Math.min(b,x));
const circle=(c,x,y,r)=>{c.beginPath();c.arc(x,y,r,0,tau);c.fill();};
const ellipse=(c,x,y,rx,ry,a=0)=>{c.beginPath();c.ellipse(x,y,rx,ry,a,0,tau);c.fill();};
const star=(c,r,n=5)=>{c.beginPath();for(let i=0;i<n*2;i++){const a=i*Math.PI/n-Math.PI/2,s=i%2?r*.45:r;i?c.lineTo(Math.cos(a)*s,Math.sin(a)*s):c.moveTo(Math.cos(a)*s,Math.sin(a)*s);}c.closePath();c.fill();};

// Analytic particles have no allocations or lingering history. Every burst ends
// with its celebration; Low keeps the same identity with four instead of twelve.
function flourish(c,item,t,celebration,low,pendant=false){
 const tier=accessoryTier(item);if(tier<2)return;
 const pulse=accessoryPulse(celebration),radius=pendant?9:13,age=(1-celebration)*1.5;
 c.save();c.strokeStyle=item.color;c.fillStyle=item.color;c.lineWidth=.8;
 c.globalAlpha=.3+pulse*.4;c.beginPath();c.arc(0,0,radius+pulse*3,t*.8,t*.8+Math.PI*1.3);c.stroke();
 if(tier>=3){c.rotate(-t*.6);c.globalAlpha=.7;c.translate(radius+2,0);star(c,2.2);c.translate(-radius-2,0);}
 if(tier===4&&celebration>0&&age>.18){
  const p=clamp((age-.18)/1.25,0,1),count=low?4:12;c.globalAlpha=(1-p)*.85;
  for(let i=0;i<count;i++){
   const angle=i*tau/count+(item.style==='whale'?-.7:0),distance=radius+3+p*(pendant?10:14);
   c.save();c.translate(Math.cos(angle)*distance,Math.sin(angle)*distance*.8-p*4);c.rotate(angle+p*2);
   c.fillStyle=i%2?item.color:'#f4fff1';
   if(['dragon','seed'].includes(item.style))ellipse(c,0,0,1.6*(1-p)+.5,3*(1-p)+.5);else star(c,2.2*(1-p)+.4,4);
   c.restore();
  }
 }
 c.restore();
}

// Soft exclusion is one-way steering, never a collision with the engine body.
function avoid(point,anchor,radius,dt,stiffness){
 const dx=point.x-anchor.x,dy=point.y-anchor.y,d=Math.hypot(dx,dy);
 const nx=d>1e-6?dx/d:1,ny=d>1e-6?dy/d:0,approach=(point.vx-anchor.vx)*nx+(point.vy-anchor.vy)*ny;
 const reach=radius+Math.max(0,-approach)*.12;if(d>=reach)return;
 const force=(reach-d)*stiffness;
 point.vx+=nx*force*dt;point.vy+=ny*force*dt;
}
// Emergency leash only for extreme motion; ordinary following uses the springs.
function limit(point,anchor,radius){
 const dx=point.x-anchor.x,dy=point.y-anchor.y,d=Math.hypot(dx,dy);if(d<=radius)return;
 const nx=dx/d,ny=dy/d,outward=Math.max(0,(point.vx-anchor.vx)*nx+(point.vy-anchor.vy)*ny);
 point.x=anchor.x+nx*radius;point.y=anchor.y+ny*radius;point.vx-=nx*outward;point.vy-=ny*outward;
}

// Independent, bounded presentation state. Never retains or mutates an engine body.
export class AccessoryVisual{
 constructor(){this.clear();}
 clear(){this.resetMotion();this.elapsed=0;this.reaction=0;this.celebration=0;this.pendant='pendant.none';this.companion='companion.none';}
 configure(loadout={}){for(const kind of ['pendant','companion']){const id=cosmeticGet(loadout[kind])?.kind===kind?loadout[kind]:kind+'.none';if(id!==this[kind]){if(kind==='companion')this.follower=null;else this.charm=null;this.celebration=0;}this[kind]=id;}}
 react(celebrate=false){this.reaction=1;if(celebrate)this.celebration=1;}
 resetMotion(){this.body=null;this.follower=null;this.charm=null;this.heading=0;}
 step(body,seconds){
  const dt=clamp(Number.isFinite(seconds)?seconds:0,0,.05);
  if(!body||!Number.isFinite(body.x)||!Number.isFinite(body.y)){this.resetMotion();return;}
  if(this.body&&!dt)return; // Observer repaints and paused frames cannot inject motion.
  const r=Number.isFinite(body.radius)&&body.radius>0?body.radius:14,previous=this.body;
  const teleport=previous&&Math.hypot(body.x-previous.x,body.y-previous.y)>r*12;
  if(!previous||teleport){
   const speed=Math.hypot(body.vx||0,body.vy||0);this.heading=speed>1?Math.atan2(body.vy||0,body.vx||0):0;
   this.follower=null;this.charm=null;
  }
  const vx=previous&&!teleport&&dt?(body.x-previous.x)/dt:0,vy=previous&&!teleport&&dt?(body.y-previous.y)/dt:0;
  this.body={x:body.x,y:body.y,radius:r,vx,vy};
  const seed=(angle,distance)=>({x:body.x+Math.cos(angle)*r*distance,y:body.y+Math.sin(angle)*r*distance,vx,vy});
  this.follower||=seed(this.heading-Math.PI/2,3.4);
  this.charm||=seed(this.heading+2.35,2);
  if(!dt||!previous||teleport)return;
  this.elapsed+=dt;this.reaction=Math.max(0,this.reaction-dt*2.5);this.celebration=Math.max(0,this.celebration-dt/1.5);
  // Interpolate the anchor across bounded substeps. Motion comes from actual
  // displacement, so stationary/held previews cannot invent velocity or gravity.
  const steps=Math.ceil(dt/(1/120)),h=dt/steps,speed=Math.hypot(vx,vy);
  for(let i=1;i<=steps;i++){
   const anchor={x:previous.x+(body.x-previous.x)*i/steps,y:previous.y+(body.y-previous.y)*i/steps,vx,vy};
   const turn=Math.atan2(Math.sin(Math.atan2(vy,vx)-this.heading),Math.cos(Math.atan2(vy,vx)-this.heading));
   this.heading+=turn*(1-Math.exp(-h*4.5*speed/(speed+40)));
   const forward={x:Math.cos(this.heading),y:Math.sin(this.heading)},side=3.4+Math.sin(this.elapsed*.8)*.16;
   const target={x:anchor.x+(forward.y*side-forward.x*.3)*r,y:anchor.y+(-forward.x*side-forward.y*.3)*r};
   const f=this.follower;
   f.vx+=((target.x-f.x)*64+(vx-f.vx)*16)*h;
   f.vy+=((target.y-f.y)*64+(vy-f.vy)*16)*h;
   avoid(f,anchor,r*2.2,h,180);
   f.x+=f.vx*h;f.y+=f.vy*h;limit(f,anchor,r*8);
   // A radial, underdamped spring: no preferred down direction, no force on
   // the player, and no contact impulse. Soft exclusion keeps the charm clear.
   const p=this.charm,dx=p.x-anchor.x,dy=p.y-anchor.y,d=Math.hypot(dx,dy),nx=d?dx/d:Math.cos(this.heading+2.35),ny=d?dy/d:Math.sin(this.heading+2.35);
   const force=(r*2-d)*58;
   p.vx+=(nx*force+(vx-p.vx)*5)*h;p.vy+=(ny*force+(vy-p.vy)*5)*h;
   avoid(p,anchor,r*2.25,h,450);
   p.x+=p.vx*h;p.y+=p.vy*h;limit(p,anchor,r*7);
  }
 }
 bounds(){
  if(!this.body)return [];
  const b=this.body,points=[];
  if(this.pendant!=='pendant.none'&&this.charm)points.push({...this.charm,r:b.radius*2.8});
  if(this.companion!=='companion.none'&&this.follower)points.push({...this.follower,r:b.radius*4.4});
  return points;
 }
 render(c,gentle=false){
  if(!this.body)return;const b=this.body,r=b.radius,t=this.elapsed;
  const pendant=cosmeticGet(this.pendant),companion=cosmeticGet(this.companion);
  if(pendant&&pendant.style!=='none'&&this.charm){
   const p=this.charm,dx=p.x-b.x,dy=p.y-b.y,d=Math.hypot(dx,dy)||1,nx=dx/d,ny=dy/d;
   c.save();c.lineWidth=r/14*clamp(2-d/r*.3,.65,1.4);c.strokeStyle='#d7ebe9';c.globalAlpha=.8;
   const slack=Math.max(0,r*2-d)*.3;c.beginPath();c.moveTo(b.x+nx*r*.92,b.y+ny*r*.92);c.quadraticCurveTo((b.x+p.x)/2-ny*slack,(b.y+p.y)/2+nx*slack,p.x,p.y);c.stroke();
   c.globalAlpha=1;c.translate(p.x,p.y);c.rotate(Math.atan2(dy,dx)-Math.PI/2);c.scale(r/14,r/14);
   const pendantPulse=accessoryTier(pendant)>=2?accessoryPulse(this.celebration):0;c.scale(1+pendantPulse*.16,1+pendantPulse*.16);flourish(c,pendant,t,this.celebration,gentle,true);
   c.fillStyle='#081b2a';ellipse(c,0,0,6.3,7.3);c.fillStyle=pendant.color;c.strokeStyle='#f1fff2';c.lineWidth=.7;
   if(pendant.style==='drop'){c.beginPath();c.moveTo(0,-6);c.bezierCurveTo(1,-3,6,0,4,4);c.bezierCurveTo(1,8,-5,5,-4,1);c.closePath();c.fill();c.stroke();}
   if(pendant.style==='leaf'){ellipse(c,0,0,3.7,6.2,.4);c.beginPath();c.moveTo(-2,5);c.lineTo(2,-5);c.stroke();}
   if(pendant.style==='moon'){circle(c,0,0,5.7);c.fillStyle='#081b2a';circle(c,2.5,-2,4.7);}
   if(pendant.style==='sun'){c.rotate(gentle?0:t*.3);star(c,7,10);c.fillStyle='#fff1b9';circle(c,0,0,3.4);}
   if(pendant.style==='prism'){c.beginPath();c.moveTo(0,-7);c.lineTo(5,0);c.lineTo(0,7);c.lineTo(-5,0);c.closePath();c.fill();c.stroke();c.fillStyle='#a9eaff';c.beginPath();c.moveTo(0,-6);c.lineTo(0,6);c.lineTo(-4,0);c.fill();}
   if(pendant.style==='pebble'){ellipse(c,0,0,4.5,6,.3);c.beginPath();c.moveTo(-4,1);c.quadraticCurveTo(0,3,4,-1);c.stroke();}
   if(pendant.style==='shell'){c.beginPath();c.moveTo(0,6);c.bezierCurveTo(-12,-3,-3,-9,0,-5);c.bezierCurveTo(3,-9,12,-3,0,6);c.fill();c.stroke();for(let k=-1;k<=1;k++){c.beginPath();c.moveTo(0,5);c.lineTo(k*4,-3);c.stroke();}}
   if(pendant.style==='key'){c.save();c.translate(0,-4);star(c,4);c.restore();c.lineWidth=2;c.strokeStyle=pendant.color;c.beginPath();c.moveTo(0,-1);c.lineTo(0,7);c.lineTo(3,7);c.moveTo(0,4);c.lineTo(2,4);c.stroke();}
   if(pendant.style==='compass'){circle(c,0,0,6);c.fillStyle='#234a62';c.save();c.rotate(t*.35);star(c,5,4);c.restore();c.fillStyle='#fff7cb';circle(c,0,0,1.3);}
   if(pendant.style==='seed'){ellipse(c,0,1,4,6,-.2);c.fillStyle='#edffe1';ellipse(c,-2,-3,3.5,1.8,.5);ellipse(c,2,-4,3.5,1.8,-.5);}
   c.fillStyle='#ffffff';c.globalAlpha=.6+this.reaction*.35;ellipse(c,-1.5,-2,1,1.8);c.restore();
  }
  if(companion&&companion.style!=='none'&&this.follower){
   const f=this.follower,bob=gentle?0:Math.sin(t*2)*r*.06,lift=gentle?0:Math.sin(this.celebration*Math.PI)*r*.45;
   c.save();c.translate(f.x,f.y+bob-lift);c.scale(r/14*1.2,r/14*1.2);c.lineCap='round';c.lineJoin='round';c.lineWidth=1.3;c.strokeStyle='#263c4e';c.fillStyle=companion.color;
   const tier=accessoryTier(companion),pulse=tier>=2?accessoryPulse(this.celebration):0,size=1+pulse*(tier===4?.28:tier===3?.22:.18);c.scale(size,size);flourish(c,companion,t,this.celebration,gentle);
   const flutter=gentle?.6:.55+.35*Math.sin(t*9),happy=this.reaction*.7+this.celebration;
   if(companion.style==='firefly'||companion.style==='moth'){
    c.globalAlpha=.75;c.fillStyle=companion.style==='moth'?'#9cdfff':'#d6f6ef';
    ellipse(c,-6,-2,companion.style==='moth'?7:5,3+flutter*3,-.5);ellipse(c,6,-2,companion.style==='moth'?7:5,3+flutter*3,.5);
    c.globalAlpha=1;c.fillStyle=companion.color;
   }
   if(companion.style==='jelly'){
    c.strokeStyle='#a59be1';for(let k=-1;k<=1;k++){c.beginPath();c.moveTo(k*4,3);c.quadraticCurveTo(k*5+(gentle?0:Math.sin(t*3+k)*3),12,k*4+2,14);c.stroke();}
   }
   if(companion.style==='dragon'){
    c.strokeStyle=companion.color;c.lineWidth=3;c.beginPath();c.moveTo(4,4);c.bezierCurveTo(18,14,20,-4,12,1);c.stroke();c.fillStyle='#bfa9ed';ellipse(c,-7,0,5,7,-.7);ellipse(c,7,0,5,7,.7);c.fillStyle=companion.color;
   }
   if(companion.style==='puff'){ellipse(c,-5,0,5,5);ellipse(c,4,-3,5,5);ellipse(c,6,2,4,4);}
   if(companion.style==='fox'){c.beginPath();c.moveTo(-6,-3);c.lineTo(-7,-12);c.lineTo(-1,-6);c.lineTo(4,-11);c.lineTo(7,-3);c.fill();c.stroke();ellipse(c,10,5,8,4,-.5);c.fillStyle='#fff2df';ellipse(c,14,3,3.5,3,-.5);c.fillStyle=companion.color;}
   if(companion.style==='bird'){ellipse(c,-7,1,6,3+flutter*2,-.5);ellipse(c,7,1,6,3+flutter*2,.5);c.fillStyle='#ffad76';ellipse(c,0,-7,2,5,-.3);c.fillStyle=companion.color;}
   if(companion.style==='whale'){ellipse(c,3,1,10,6);ellipse(c,13,-1,4,2,-.7);ellipse(c,14,3,4,2,.7);ellipse(c,-3,6,4,2,.6);}
   // A dark outline separates the small companion from bubbles and power cues.
   c.beginPath();c.ellipse(0,0,companion.style==='jelly'?8:6.5,companion.style==='firefly'?8:6.5,0,0,tau);c.fill();c.stroke();
   if(companion.style==='sprout'){c.strokeStyle='#7dc79d';c.beginPath();c.moveTo(0,-5);c.lineTo(0,-10-happy);c.stroke();c.fillStyle='#d6f6aa';ellipse(c,-3,-10-happy,4.5,2.4,.4);ellipse(c,3,-11-happy,4.5,2.4,-.5);}
   if(companion.style==='dragon'){c.fillStyle='#fff0cf';ellipse(c,-4,-6,1.8,3,-.4);ellipse(c,4,-6,1.8,3,.4);}
   if(companion.style==='ladybug'){c.strokeStyle='#34414e';c.beginPath();c.moveTo(0,-5);c.lineTo(0,6);c.moveTo(-3,-5);c.lineTo(-5,-10);c.moveTo(3,-5);c.lineTo(5,-10);c.stroke();c.fillStyle='#574b68';for(const x of [-4,4])for(const y of [-3,3])circle(c,x,y,1.3);}
   if(['fox','whale'].includes(companion.style)){c.fillStyle='#f2fff5';ellipse(c,0,3,4.5,2.5);}
   if(companion.style==='bird'){c.fillStyle='#e8a25f';c.beginPath();c.moveTo(6,0);c.lineTo(10,2);c.lineTo(6,3);c.fill();}
   const look=clamp((b.x-f.x)/80,-1,1);c.fillStyle='#142535';const blink=!gentle&&Math.sin(t*1.1)>.995;
   for(const x of [-2.7,2.7])ellipse(c,x+look,-.5,1,blink?.35:1.5);
   c.strokeStyle='#233346';c.lineWidth=.8;c.beginPath();c.moveTo(-1.5,2.2);c.quadraticCurveTo(0,3.4+happy,1.5,2.2);c.stroke();
   c.fillStyle='#fff';c.globalAlpha=.5;ellipse(c,-2,-3.5,1.8,.8);
   if(this.celebration>0&&!gentle){c.globalAlpha=this.celebration;c.translate(0,-15);c.fillStyle='#fff0b8';star(c,2.5+this.celebration);}
   c.restore();
  }
 }
}
