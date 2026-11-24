// Presentation-only leash. The interior has no target radius or anchor drag;
// only mild separation and the outer boundary constrain otherwise free motion.
import {entityStep} from './entity-motion.js?v=16ce17b5f60cb8d9e28697080edf32fb0049099a55fad2c27982aeec54cf66a8';
export function tetherStep(point,anchor,dt,config,drive={x:0,y:0},attachment=null){
 const r=anchor.radius,dx=point.x-anchor.x,dy=point.y-anchor.y,d=Math.hypot(dx,dy);
 const nx=d>1e-6?dx/d:1,ny=d>1e-6?dy/d:0;
 const radial=(point.vx-anchor.vx)*nx+(point.vy-anchor.vy)*ny;
 const leash=attachment||anchor,lx=point.x-leash.x,ly=point.y-leash.y,ld=Math.hypot(lx,ly)||1,ux=lx/ld,uy=ly/ld;
 const length=config.length-(attachment?1:0),edge=Math.max(0,Math.min(1,(ld/r-length+.3)/.3));
 const incoming=Math.max(0,-radial);
 // Anticipate an approaching body, but retain only a gentle separation force
 // when still. This force acts on the accessory alone, never on the player.
 const avoidance=Math.max(0,config.clearance*r-d)*90+Math.max(0,config.clearance*r+incoming*.12-d)*Math.min(450,incoming*2);
 const restraint=Math.max(0,(point.vx-leash.vx)*ux+(point.vy-leash.vy)*uy)*edge*8;
 const mass=config.mass||1;
 entityStep(point,dt,{mass,friction:config.drag*mass},{x:(nx*avoidance-ux*restraint+drive.x)*mass,y:(ny*avoidance-uy*restraint+drive.y)*mass});
 // A maximum reach, never a resting position. Constrain only the accessory,
 // removing outward relative velocity while preserving its tangential motion.
 const ex=point.x-leash.x,ey=point.y-leash.y,distance=Math.hypot(ex,ey),limit=length*r;
 if(distance>limit){
  const ux=ex/distance,uy=ey/distance,outward=Math.max(0,(point.vx-leash.vx)*ux+(point.vy-leash.vy)*uy);
  point.x=leash.x+ux*limit;point.y=leash.y+uy*limit;point.vx-=ux*outward;point.vy-=uy*outward;
 }
 if(attachment){const dx=point.x-anchor.x,dy=point.y-anchor.y,d=Math.hypot(dx,dy),max=config.length*r;if(d>max){point.x=anchor.x+dx/d*max;point.y=anchor.y+dy/d*max;}}
}
