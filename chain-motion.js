import {entityStep} from './entity-motion.js?v=16ce17b5f60cb8d9e28697080edf32fb0049099a55fad2c27982aeec54cf66a8';

// A gravity-free chain: light joints retain momentum, fixed-length links carry
// tension, and endpoint inverse masses decide whether that tension can move them.
export class ChainMotion{
 constructor(count=8){this.count=count;this.clear();}
 clear(){this.points=[];this.length=0;}
 step(start,end,dt,length,{startMass=0,endMass=0,endOffset={x:0,y:0},endRadius=0}={}){
  const finish={x:end.x+endOffset.x,y:end.y+endOffset.y};
  const fresh=this.points.length!==this.count+1||Math.abs(this.length-length)>.001;
  if(fresh){
   this.length=length;const dx=finish.x-start.x,dy=finish.y-start.y,d=Math.hypot(dx,dy)||1,bend=Math.sqrt(Math.max(0,length*length-d*d))*.65;
   this.points=Array.from({length:this.count+1},(_,i)=>{const t=i/this.count,s=Math.sin(t*Math.PI)*bend;return {x:start.x+dx*t-dy/d*s,y:start.y+dy*t+dx/d*s,vx:0,vy:0};});
  }
  if(!fresh&&!(dt>0))return;
  const points=this.points,n=this.count,h=Math.max(dt,1/120),rest=length/n;
  Object.assign(points[0],{x:start.x,y:start.y,vx:start.vx||0,vy:start.vy||0});
  Object.assign(points[n],{...finish,vx:end.vx||0,vy:end.vy||0});
  for(let i=1;i<n;i++)if(dt>0)entityStep(points[i],dt,{mass:.06,friction:.06*3});
  const before=points.map(p=>({x:p.x,y:p.y})),weight=i=>i===0?(startMass?1/startMass:0):i===n?(endMass?1/endMass:0):1/.06;
  // Symmetric passes avoid a preferred attachment direction.
  for(let pass=0;pass<(fresh?100:32);pass++){
   for(let k=0;k<n;k++){
   const i=pass%2?n-1-k:k,a=points[i],b=points[i+1],dx=b.x-a.x,dy=b.y-a.y,d=Math.hypot(dx,dy)||1,wa=weight(i),wb=weight(i+1),sum=wa+wb;if(!sum)continue;
   const error=(d-rest)/d; a.x+=dx*error*wa/sum;a.y+=dy*error*wa/sum;b.x-=dx*error*wb/sum;b.y-=dy*error*wb/sum;
   }
   // Keep joints outside the charm rather than letting the artwork mask a
   // chain passing through it. The last joint remains attached at its eyelet.
   if(endRadius>0)for(let i=1;i<n;i++){
    const p=points[i],tip=points[n];let dx=p.x-tip.x+endOffset.x,dy=p.y-tip.y+endOffset.y,d=Math.hypot(dx,dy);
    if(d<1e-6){dx=-endOffset.y||1;dy=endOffset.x;const scale=Math.hypot(dx,dy);dx=dx/scale*.0001;dy=dy/scale*.0001;d=.0001;}
    if(d>=endRadius)continue;const wa=weight(i),wb=weight(n),push=(endRadius-d)/d/(wa+wb);
    p.x+=dx*push*wa;p.y+=dy*push*wa;tip.x-=dx*push*wb;tip.y-=dy*push*wb;
   }
  }
  for(let i=0;i<=n;i++){
   const p=points[i];if(!weight(i))continue;
   if(dt>0&&!fresh){p.vx+=(p.x-before[i].x)/h;p.vy+=(p.y-before[i].y)/h;}
   if(i===0&&startMass)Object.assign(start,{x:p.x,y:p.y,vx:p.vx,vy:p.vy});
   if(i===n&&endMass)Object.assign(end,{x:p.x-endOffset.x,y:p.y-endOffset.y,vx:p.vx,vy:p.vy});
  }
 }
}
