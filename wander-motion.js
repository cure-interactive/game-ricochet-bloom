import {angleApproach} from './angle.js?v=a877fbe89e9f287f68b69f52d76679cbf59de4428f5c6f8931471c8e40003750';

// Unbiased roaming intent: destinations fill the available disc rather than
// pushing continuously in one heading or seeking a fixed orbit radius.
export class WanderMotion{
 constructor(seed=Math.floor(Math.random()*0xffffffff),{speed=1.8,interval=2.5}={}){this.seed=seed>>>0||1;this.speed=speed;this.interval=interval;this.reset();}
 random(){let x=this.randomState;x^=x<<13;x^=x>>>17;x^=x<<5;this.randomState=x>>>0;return this.randomState/4294967296;}
 reset(){this.randomState=this.seed;this.angle=this.random()*Math.PI*2;this.destination=null;this.remaining=0;}
 step(dt,point,anchor,range,interest=null,boost=1){
  this.remaining-=dt;
  const arrived=this.destination&&Math.hypot(anchor.x+this.destination.x-point.x,anchor.y+this.destination.y-point.y)<anchor.radius*.25;
  if(!this.destination||this.remaining<=0||arrived){
   const angle=this.random()*Math.PI*2,distance=Math.sqrt(this.random())*range*anchor.radius*.9;
   this.destination={x:Math.cos(angle)*distance,y:Math.sin(angle)*distance};this.remaining=this.interval*(.7+this.random()*.6);
  }
  const target=interest||{x:anchor.x+this.destination.x,y:anchor.y+this.destination.y};
  const dx=target.x-point.x,dy=target.y-point.y,distance=Math.hypot(dx,dy);
  this.angle=angleApproach(this.angle,Math.atan2(dy,dx),interest?7:3,dt);
  const force=anchor.radius*this.speed*3*boost*Math.min(1,distance/anchor.radius);
  return {x:Math.cos(this.angle)*force,y:Math.sin(this.angle)*force};
 }
}
