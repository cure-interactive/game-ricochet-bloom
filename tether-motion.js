// Presentation-only leash. The interior has no target radius or anchor drag;
// only mild separation and the outer boundary constrain otherwise free motion.
export function tetherStep(point,anchor,dt,config,drive={x:0,y:0}){
 const r=anchor.radius,dx=point.x-anchor.x,dy=point.y-anchor.y,d=Math.hypot(dx,dy);
 const nx=d>1e-6?dx/d:1,ny=d>1e-6?dy/d:0;
 const radial=(point.vx-anchor.vx)*nx+(point.vy-anchor.vy)*ny;
 const edge=Math.max(0,Math.min(1,(d/r-config.length+.3)/.3));
 const incoming=Math.max(0,-radial);
 // Anticipate an approaching body, but retain only a gentle separation force
 // when still. This force acts on the accessory alone, never on the player.
 const avoidance=Math.max(0,config.clearance*r-d)*90+Math.max(0,config.clearance*r+incoming*.12-d)*Math.min(450,incoming*2);
 const restraint=Math.max(0,radial)*edge*8;
 point.vx+=(nx*(avoidance-restraint)-point.vx*config.drag+drive.x)*dt;
 point.vy+=(ny*(avoidance-restraint)-point.vy*config.drag+drive.y)*dt;
 point.x+=point.vx*dt;point.y+=point.vy*dt;
 // A maximum reach, never a resting position. Constrain only the accessory,
 // removing outward relative velocity while preserving its tangential motion.
 const ex=point.x-anchor.x,ey=point.y-anchor.y,distance=Math.hypot(ex,ey),limit=config.length*r;
 if(distance>limit){
  const ux=ex/distance,uy=ey/distance,outward=Math.max(0,(point.vx-anchor.vx)*ux+(point.vy-anchor.vy)*uy);
  point.x=anchor.x+ux*limit;point.y=anchor.y+uy*limit;point.vx-=ux*outward;point.vy-=uy*outward;
 }
}
