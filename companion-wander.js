import {angleApproach} from './angle.js?v=a877fbe89e9f287f68b69f52d76679cbf59de4428f5c6f8931471c8e40003750';
// Intent only: smoothly changing curiosity supplies acceleration, not position.
// A private random stream keeps presentation independent of gameplay randomness.
export class CompanionWander{
 constructor(seed=Math.floor(Math.random()*0xffffffff)){this.seed=seed>>>0||1;this.reset();}
 random(){let x=this.randomState;x^=x<<13;x^=x>>>17;x^=x<<5;this.randomState=x>>>0;return this.randomState/4294967296;}
 reset(){this.randomState=this.seed;this.angle=this.random()*Math.PI*2;this.aim=this.angle;this.next=0;this.curiousIn=1+this.random()*2;this.pulse=0;this.interest=null;}
 step(dt,point,anchor,interests=[]){
  this.next-=dt;this.curiousIn-=dt;this.pulse=Math.max(0,this.pulse-dt/1.2);
  if(this.next<=0){this.next+=1.3+this.random()*2;this.aim+=(this.random()-.5)*Math.PI*1.8;}
  if(this.curiousIn<=0){
   this.curiousIn+=3+this.random()*3;this.pulse=1;this.interest=null;
   let count=0;
   for(const candidate of interests){
    if(!Number.isFinite(candidate.x)||!Number.isFinite(candidate.y))continue;
    const distance=Math.hypot(candidate.x-anchor.x,candidate.y-anchor.y);
    if(distance<anchor.radius*1.5||distance>anchor.radius*9)continue;
    if(this.random()<1/++count)this.interest={x:candidate.x,y:candidate.y};
   }
   if(!this.interest)this.aim+=(this.random()-.5)*Math.PI;
  }
  if(this.pulse<=0)this.interest=null;
  const target=this.interest?Math.atan2(this.interest.y-point.y,this.interest.x-point.x):this.aim;
  this.angle=angleApproach(this.angle,target,this.interest?7:2.2,dt);
  const perk=Math.sin(this.pulse*Math.PI),force=anchor.radius*(7+perk*22);
  return {x:Math.cos(this.angle)*force,y:Math.sin(this.angle)*force};
 }
}
