import {cosmeticGet} from './cosmetic.js?v=ceab45e8d91f7bc0277fcd57d0ba195cbeba296978e36bbc935740f4ee047132';
const tau=Math.PI*2,clamp=(x,a,b)=>Math.max(a,Math.min(b,x));
const circle=(c,x,y,r)=>{c.beginPath();c.arc(x,y,r,0,tau);c.fill();};
const ellipse=(c,x,y,rx,ry,a=0)=>{c.beginPath();c.ellipse(x,y,rx,ry,a,0,tau);c.fill();};
const star=(c,r,n=5)=>{c.beginPath();for(let i=0;i<n*2;i++){const a=i*Math.PI/n-Math.PI/2,s=i%2?r*.45:r;i?c.lineTo(Math.cos(a)*s,Math.sin(a)*s):c.moveTo(Math.cos(a)*s,Math.sin(a)*s);}c.closePath();c.fill();};

// Independent, bounded presentation state. Never retains or mutates an engine body.
export class AccessoryVisual{
 constructor(){this.clear();}
 clear(){this.body=null;this.follower=null;this.elapsed=0;this.reaction=0;this.celebration=0;this.swing=0;this.pendant='pendant.none';this.companion='companion.none';}
 configure(loadout={}){for(const kind of ['pendant','companion']){const id=cosmeticGet(loadout[kind])?.kind===kind?loadout[kind]:kind+'.none';if(id!==this[kind]&&kind==='companion')this.follower=null;this[kind]=id;}}
 react(celebrate=false){this.reaction=1;if(celebrate)this.celebration=1;}
 resetMotion(){this.body=null;this.follower=null;this.swing=0;}
 step(body,seconds){
  const dt=clamp(Number.isFinite(seconds)?seconds:0,0,.05);this.elapsed+=dt;this.reaction=Math.max(0,this.reaction-dt*2.5);this.celebration=Math.max(0,this.celebration-dt*.8);
  if(!body||!Number.isFinite(body.x)||!Number.isFinite(body.y)){this.body=null;this.follower=null;return;}
  const r=body.radius||14,vx=body.vx||0,vy=body.vy||0,speed=Math.hypot(vx,vy),previous=this.body;
  this.body={x:body.x,y:body.y,radius:r,vx,vy};
  this.swing+=(clamp(-vx/650,-.65,.65)-this.swing)*(1-Math.exp(-dt*8));
  const moving=speed>30,dx=moving?-vx/speed:.82,dy=moving?-vy/speed:-.57;
  const target={x:body.x+dx*r*2.8,y:body.y+dy*r*2.8};
  if(!this.follower||!previous||Math.hypot(body.x-previous.x,body.y-previous.y)>r*10)this.follower=target;
  else{const blend=1-Math.exp(-dt*9);this.follower.x+=(target.x-this.follower.x)*blend;this.follower.y+=(target.y-this.follower.y)*blend;}
  const fx=this.follower.x-body.x,fy=this.follower.y-body.y,d=Math.hypot(fx,fy),limit=r*4.5;
  if(d>limit){this.follower.x=body.x+fx/d*limit;this.follower.y=body.y+fy/d*limit;}
 }
 bounds(){
  if(!this.body)return [];
  const b=this.body,points=[];
  if(this.pendant!=='pendant.none')points.push({x:b.x,y:b.y+b.radius,r:b.radius*1.8});
  if(this.companion!=='companion.none'&&this.follower)points.push({...this.follower,r:b.radius*1.7});
  return points;
 }
 render(c,gentle=false){
  if(!this.body)return;const b=this.body,r=b.radius,t=this.elapsed;
  const pendant=cosmeticGet(this.pendant),companion=cosmeticGet(this.companion);
  if(pendant&&pendant.style!=='none'){
   c.save();c.translate(b.x,b.y+r*.6);c.rotate(this.swing+(gentle?0:Math.sin(t*2.2)*.07));c.scale(r/14,r/14);
   c.lineWidth=1.1;c.strokeStyle='#d7ebe9';c.globalAlpha=.85;c.beginPath();c.moveTo(0,0);c.quadraticCurveTo(-1,6,0,13);c.stroke();c.globalAlpha=1;c.translate(0,16);
   c.fillStyle='#081b2a';ellipse(c,0,0,6.3,7.3);c.fillStyle=pendant.color;c.strokeStyle='#f1fff2';c.lineWidth=.7;
   if(pendant.style==='drop'){c.beginPath();c.moveTo(0,-6);c.bezierCurveTo(1,-3,6,0,4,4);c.bezierCurveTo(1,8,-5,5,-4,1);c.closePath();c.fill();c.stroke();}
   if(pendant.style==='leaf'){ellipse(c,0,0,3.7,6.2,.4);c.beginPath();c.moveTo(-2,5);c.lineTo(2,-5);c.stroke();}
   if(pendant.style==='moon'){circle(c,0,0,5.7);c.fillStyle='#081b2a';circle(c,2.5,-2,4.7);}
   if(pendant.style==='sun'){c.rotate(gentle?0:t*.3);star(c,7,10);c.fillStyle='#fff1b9';circle(c,0,0,3.4);}
   if(pendant.style==='prism'){c.beginPath();c.moveTo(0,-7);c.lineTo(5,0);c.lineTo(0,7);c.lineTo(-5,0);c.closePath();c.fill();c.stroke();c.fillStyle='#a9eaff';c.beginPath();c.moveTo(0,-6);c.lineTo(0,6);c.lineTo(-4,0);c.fill();}
   c.fillStyle='#ffffff';c.globalAlpha=.6+this.reaction*.35;ellipse(c,-1.5,-2,1,1.8);c.restore();
  }
  if(companion&&companion.style!=='none'&&this.follower){
   const f=this.follower,bob=gentle?0:Math.sin(t*3)*r*.12,lift=gentle?0:Math.sin(this.celebration*Math.PI)*r*.45;
   c.save();c.translate(f.x,f.y+bob-lift);c.scale(r/14,r/14);c.lineCap='round';c.lineJoin='round';c.lineWidth=1.3;c.strokeStyle='#263c4e';c.fillStyle=companion.color;
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
   // A dark outline separates the small companion from bubbles and power cues.
   c.beginPath();c.ellipse(0,0,companion.style==='jelly'?8:6.5,companion.style==='firefly'?8:6.5,0,0,tau);c.fill();c.stroke();
   if(companion.style==='sprout'){c.strokeStyle='#7dc79d';c.beginPath();c.moveTo(0,-5);c.lineTo(0,-10-happy);c.stroke();c.fillStyle='#d6f6aa';ellipse(c,-3,-10-happy,4.5,2.4,.4);ellipse(c,3,-11-happy,4.5,2.4,-.5);}
   if(companion.style==='dragon'){c.fillStyle='#fff0cf';ellipse(c,-4,-6,1.8,3,-.4);ellipse(c,4,-6,1.8,3,.4);}
   const look=clamp((b.x-f.x)/80,-1,1);c.fillStyle='#142535';const blink=!gentle&&Math.sin(t*1.1)>.995;
   for(const x of [-2.7,2.7])ellipse(c,x+look,-.5,1,blink?.35:1.5);
   c.strokeStyle='#233346';c.lineWidth=.8;c.beginPath();c.moveTo(-1.5,2.2);c.quadraticCurveTo(0,3.4+happy,1.5,2.2);c.stroke();
   c.fillStyle='#fff';c.globalAlpha=.5;ellipse(c,-2,-3.5,1.8,.8);
   if(this.celebration>0&&!gentle){c.globalAlpha=this.celebration;c.translate(0,-15);c.fillStyle='#fff0b8';star(c,2.5+this.celebration);}
   c.restore();
  }
 }
}
