import {WanderMotion} from './wander-motion.js?v=9828bf3538efbf59246439899737e5d16c23542544d6dc0a1058bd39f3000335';

// Curiosity is layered over ordinary roaming; the pendant shares only roaming.
export class CompanionWander{
 constructor(seed){this.roam=new WanderMotion(seed);this.reset();}
 reset(){this.roam.reset();this.curiousIn=1+this.roam.random()*2;this.pulse=0;this.interest=null;}
 step(dt,point,anchor,interests=[],range=4.8){
  this.curiousIn-=dt;this.pulse=Math.max(0,this.pulse-dt/1.2);
  if(this.curiousIn<=0){
   this.curiousIn+=3+this.roam.random()*3;this.pulse=1;this.interest=null;
   let count=0;
   for(const candidate of interests){
    if(!Number.isFinite(candidate.x)||!Number.isFinite(candidate.y))continue;
    const distance=Math.hypot(candidate.x-anchor.x,candidate.y-anchor.y);
    if(distance<anchor.radius*1.5||distance>anchor.radius*9)continue;
    if(this.roam.random()<1/++count)this.interest={x:candidate.x,y:candidate.y};
   }
  }
  if(this.pulse<=0)this.interest=null;
  return this.roam.step(dt,point,anchor,range,this.interest,1+Math.sin(this.pulse*Math.PI)*3);
 }
}
