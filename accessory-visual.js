import {CompanionTrail} from './companion-trail.js?v=2b2a4606b404ae7e1713cadc24b7d2dd797d4ddf72f8a78a1c5d529f2bd718ae';
import {entityImpulse} from './entity-motion.js?v=16ce17b5f60cb8d9e28697080edf32fb0049099a55fad2c27982aeec54cf66a8';
import {bubblePressure} from './bubble-pressure.js?v=b5bc5af7a6c96099ebff8ebb3bdb5e8bd38cd0780e699102086111db5779588b';
import {bubbleShellPoint} from './bubble-render.js?v=9b2f2b87f161370be645295a8959febcc9a37c1e4aa39bed2a0fb875973c3b4f';
import {companionArt} from './companion-art.js?v=f9f8456faee7b4b466548f9fe2c3e0dcba123aeb64ffa0e955b9fcd8808c0715';
import {WanderMotion} from './wander-motion.js?v=9828bf3538efbf59246439899737e5d16c23542544d6dc0a1058bd39f3000335';
import {angleApproach} from './angle.js?v=a877fbe89e9f287f68b69f52d76679cbf59de4428f5c6f8931471c8e40003750';
import {pendantCord} from './pendant-cord.js?v=c2cf63ffc76d047316fad7741f741b326499b6aef4d4198a0dc2f53ad7b45d43';
import {tetherStep} from './tether-motion.js?v=befaaaaa72aea69adbf2f8d7d061eb749b82581af3775ba1daa008ec80bc7f1a';
import {CompanionWander} from './companion-wander.js?v=1b58a1d1c39662eca6ef433f02dcf08b3fa32a40898d7924bcea334633f6e656';
import {cosmeticGet} from './cosmetic.js?v=ddc203acc7e92b1a16f24947665f4dbf857da6e9dea64f178d61d81305382532';
import {accessoryTier,accessoryPulse} from './accessory.js?v=36e0b1d7f9877e5301b225524a87160ca48e5e617f00d5d7fa21c76e0150481e';
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
   if(item.style==='robot')c.fillRect(-1.5,-1.5,3*(1-p)+.6,3*(1-p)+.6);else if(['dragon','seed'].includes(item.style))ellipse(c,0,0,1.6*(1-p)+.5,3*(1-p)+.5);else star(c,2.2*(1-p)+.4,4);
   c.restore();
  }
 }
 c.restore();
}

const pendantTether={length:2.6,clearance:1.55,drag:3,mass:.65};
const companionTether={length:4.8,clearance:1.8,drag:3,mass:.9};

// Independent, bounded presentation state. Never retains or mutates an engine body.
export class AccessoryVisual{
 constructor(seed){this.trail=new CompanionTrail();this.spawnState=(seed??Math.floor(Math.random()*0xffffffff))>>>0||1;this.wander=new CompanionWander(seed);this.pendantWander=new WanderMotion(seed===undefined?undefined:seed^0x9e3779b9,{speed:.3,interval:8});this.clear();}
 spawn(body,{clearance,length}){
  // Separate from wander clocks: every respawn consumes fresh samples, while
  // a supplied seed still reproduces the complete presentation sequence.
  const random=()=>{let x=this.spawnState;x^=x<<13;x^=x>>>17;x^=x<<5;this.spawnState=x>>>0;return this.spawnState/4294967296;};
  const angle=random()*tau,distance=body.radius*Math.sqrt(clearance**2+random()*(length**2-clearance**2));
  return {x:body.x+Math.cos(angle)*distance,y:body.y+Math.sin(angle)*distance,vx:body.vx,vy:body.vy};
 }
 clear(){this.resetMotion();this.elapsed=0;this.reaction=0;this.celebration=0;this.pendant='pendant.none';this.companion='companion.none';}
 configure(loadout={}){for(const kind of ['pendant','companion']){const id=cosmeticGet(loadout[kind])?.kind===kind?loadout[kind]:kind+'.none';if(id!==this[kind]){if(kind==='companion'){this.trail.clear();this.follower=null;this.companionAngle=0;this.wander.reset();}else {this.charm=null;this.pendantWander.reset();}this.celebration=0;}this[kind]=id;}}
 react(celebrate=false){this.reaction=1;if(celebrate)this.celebration=1;}
 resetMotion(){this.trail.clear();this.body=null;this.shell=null;this.follower=null;this.charm=null;this.heading=0;this.companionAngle=0;this.wander.reset();this.pendantWander.reset();}
 // UI contact positions are relative to the player's center in radius-14 units.
 contact(point,kind,seconds=1,age=0,scale=1){
  if(!this.body)return;const unit=this.body.radius/14;
  this.pressure({x:this.body.x+point.x*unit,y:this.body.y+point.y*unit},kind,seconds,age,scale*unit);
 }
 pressure(point,kind,seconds=1,age=0,scale=1){
  if(!this.body||!(scale>0))return;
  for(const [name,slot,radius,config] of [['charm','pendant',.48,pendantTether],['follower','companion',.85,companionTether]]){
   const body=this[name];if(!body||this[slot]===slot+'.none')continue;
   const hit=bubblePressure({id:slot==='pendant'?1:2,x:body.x/scale,y:body.y/scale,radius:this.body.radius*radius/scale},{x:point.x/scale,y:point.y/scale},kind,seconds,age);
   if(hit)entityImpulse(body,hit.vx*scale,hit.vy*scale,{mass:config.mass,limit:this.body.radius*18});
  }
 }
 attachment(body,charm,shell=this.shell){
  const angle=Math.atan2(charm.y-body.y,charm.x-body.x);
  return shell?.length?bubbleShellPoint(shell,angle):{x:body.x+Math.cos(angle)*body.radius,y:body.y+Math.sin(angle)*body.radius};
 }
 step(body,seconds,{interests=[],rotation=0,shell=null,impulse={x:0,y:0},acceleration={x:0,y:0}}={}){
  const dt=clamp(Number.isFinite(seconds)?seconds:0,0,.05);
  if(!body||!Number.isFinite(body.x)||!Number.isFinite(body.y)){this.resetMotion();return;}
  if(this.body&&!dt)return; // Observer repaints and paused frames cannot inject motion.
  const r=Number.isFinite(body.radius)&&body.radius>0?body.radius:14,previous=this.body,previousShell=this.shell;
  const teleport=previous&&Math.hypot(body.x-previous.x,body.y-previous.y)>r*12;
  if(!previous||teleport){
   this.trail.clear();
   const speed=Math.hypot(body.vx||0,body.vy||0);this.heading=speed>1?Math.atan2(body.vy||0,body.vx||0):0;
   this.follower=null;this.charm=null;this.companionAngle=0;this.wander.reset();this.pendantWander.reset();
  }
  const vx=previous&&!teleport&&dt?(body.x-previous.x)/dt:0,vy=previous&&!teleport&&dt?(body.y-previous.y)/dt:0;
  this.body={x:body.x,y:body.y,radius:r,vx,vy};
  this.shell=shell?.map(p=>({x:p.x,y:p.y}))||null;
  this.follower||=this.spawn(this.body,companionTether);
  this.charm||=this.spawn(this.body,pendantTether);
  if(!dt||!previous||teleport)return;
  for(const point of [this.follower,this.charm]){point.vx+=impulse.x*r/14;point.vy+=impulse.y*r/14;}
  this.elapsed+=dt;this.reaction=Math.max(0,this.reaction-dt*2.5);this.celebration=Math.max(0,this.celebration-dt/1.5);
  // Interpolate the anchor across bounded substeps. Motion comes from actual
  // displacement, so stationary/held previews cannot invent velocity or gravity.
  const steps=Math.ceil(dt/(1/120)),h=dt/steps;
  for(let i=1;i<=steps;i++){
   const anchor={x:previous.x+(body.x-previous.x)*i/steps,y:previous.y+(body.y-previous.y)*i/steps,radius:r,vx,vy};
   const drive=this.wander.step(h,this.follower,anchor,interests,companionTether.length);
   drive.x+=acceleration.x*r/14;drive.y+=acceleration.y*r/14;
   tetherStep(this.follower,anchor,h,companionTether,drive);
   const lateral=(this.follower.vx-vx)*Math.cos(rotation)-(this.follower.vy-vy)*Math.sin(rotation);
   this.companionAngle=angleApproach(this.companionAngle,clamp(lateral/(r*12),-.25,.25),5,h);
   const drift=this.pendantWander.step(h,this.charm,anchor,pendantTether.length);
   drift.x+=acceleration.x*r/14;drift.y+=acceleration.y*r/14;
   const end=this.attachment(this.body,this.charm),start=this.attachment(previous,this.charm,previousShell);
   const attachment={x:start.x+(end.x-start.x)*i/steps,y:start.y+(end.y-start.y)*i/steps,vx:(end.x-start.x)/dt,vy:(end.y-start.y)/dt};
   tetherStep(this.charm,anchor,h,pendantTether,drift,attachment);
  }
  this.trail.step(this.follower,r,dt,cosmeticGet(this.companion));
 }
 bounds(){
  if(!this.body)return [];
  const b=this.body,points=[];
  if(this.pendant!=='pendant.none'&&this.charm)points.push({...this.charm,r:b.radius*2.8});
  if(this.companion!=='companion.none'&&this.follower)points.push({...this.follower,r:b.radius*4.4});
  points.push(...this.trail.points.map(p=>({x:p.x,y:p.y,r:p.r*2})));
  return points;
 }
 render(c,gentle=false,rotation=0,shell=this.shell){
  if(!this.body)return;const b=this.body,r=b.radius,t=this.elapsed;
  const pendant=cosmeticGet(this.pendant),companion=cosmeticGet(this.companion);
  if(pendant&&pendant.style!=='none'&&this.charm){
   const p=this.charm,dx=p.x-b.x,dy=p.y-b.y;
   pendantCord(c,b,p,pendantTether.length,pendant,t,gentle,this.attachment(b,p,shell));c.save();c.translate(p.x,p.y);c.rotate(Math.atan2(dy,dx)-Math.PI/2);c.scale(r/14,r/14);
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
   if(pendant.style==='acorn'){ellipse(c,0,2,4,5);c.fillStyle='#78634e';ellipse(c,0,-2,5,2.6);c.strokeStyle='#dbc297';for(let x=-3;x<=3;x+=2){c.beginPath();c.moveTo(x,-4);c.lineTo(x+1,-1);c.stroke();}c.fillStyle='#78634e';ellipse(c,0,-5,1,2);}
   if(pendant.style==='kite'){c.beginPath();c.moveTo(0,-7);c.lineTo(5,-1);c.lineTo(0,5);c.lineTo(-5,-1);c.closePath();c.fill();c.stroke();c.beginPath();c.moveTo(0,-7);c.lineTo(0,9);c.moveTo(-5,-1);c.lineTo(5,-1);c.stroke();c.fillStyle='#f1c69c';for(let y=5;y<10;y+=3){c.beginPath();c.moveTo(-2,y-1);c.lineTo(2,y+1);c.lineTo(2,y-1);c.lineTo(-2,y+1);c.fill();}}
   if(pendant.style==='bell'){c.beginPath();c.moveTo(-5,4);c.quadraticCurveTo(-3,1,-3,-3);c.quadraticCurveTo(0,-8,3,-3);c.quadraticCurveTo(3,1,5,4);c.closePath();c.fill();c.stroke();c.fillStyle='#fff2c8';circle(c,0,5,1.4);c.strokeStyle='#f5f0ff';c.beginPath();c.moveTo(-1,-3);c.lineTo(-2,2);c.stroke();}
   if(pendant.style==='hourglass'){c.strokeStyle=pendant.color;c.lineWidth=1.5;c.beginPath();c.moveTo(-4,-6);c.lineTo(4,-6);c.moveTo(-4,6);c.lineTo(4,6);c.moveTo(-3,-5);c.lineTo(3,5);c.moveTo(3,-5);c.lineTo(-3,5);c.stroke();c.fillStyle='#fff0ba';const sand=gentle?.5:.5+.2*Math.sin(t*.7);c.beginPath();c.moveTo(-3,-5);c.lineTo(3,-5);c.lineTo(0,-1-sand);c.fill();c.beginPath();c.moveTo(-3,5);c.lineTo(3,5);c.lineTo(0,2-sand);c.fill();circle(c,0,Math.sin(t*4)*2,.5);}
   if(pendant.style==='pearl'){c.fillStyle='#292343';circle(c,0,0,5.5);c.strokeStyle='#ccb9f3';c.lineWidth=.8;for(let i=0;i<4;i++){const a=t*.4+i*tau/4;c.save();c.translate(Math.cos(a)*3.8,Math.sin(a)*3.8);c.fillStyle='#f5dffa';star(c,1.2,4);c.restore();}c.beginPath();c.ellipse(0,0,6.6,2.4,-.5,0,tau);c.stroke();}
   c.fillStyle='#ffffff';c.globalAlpha=.6+this.reaction*.35;ellipse(c,-1.5,-2,1,1.8);c.restore();
  }
  if(companion&&companion.style!=='none'&&this.follower){
   this.trail.render(c,companion,gentle);
   const f=this.follower,bob=gentle?0:Math.sin(t*2)*r*.06,lift=gentle?0:Math.sin(this.celebration*Math.PI)*r*.45;
   c.save();c.translate(f.x+Math.sin(rotation)*(bob-lift),f.y+Math.cos(rotation)*(bob-lift));c.rotate(this.companionAngle-rotation);c.scale(r/14*1.2,r/14*1.2);c.lineCap='round';c.lineJoin='round';c.lineWidth=1.3;c.strokeStyle='#263c4e';c.fillStyle=companion.color;
   const curiosity=Math.sin(this.wander.pulse*Math.PI);c.scale(1+curiosity*.07,1+curiosity*.07);
   const tier=accessoryTier(companion),pulse=tier>=2?accessoryPulse(this.celebration):0,size=1+pulse*(tier===4?.28:tier===3?.22:.18);c.scale(size,size);flourish(c,companion,t,this.celebration,gentle);
   companionArt(c,companion,{t,gentle,happy:this.reaction*.7+this.celebration+curiosity*.45,look:clamp((b.x-f.x)/80,-1,1)});
   if(this.celebration>0&&!gentle){c.globalAlpha=this.celebration;c.translate(0,-15);c.fillStyle='#fff0b8';star(c,2.5+this.celebration);}
   c.restore();
  }
 }
}
