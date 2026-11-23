// Presentation-only loose bungee. Length/clearance/limit are in anchor radii;
// acceleration is supplied by intent, never by the tether or the game engine.
export function tetherStep(point,anchor,dt,config,drive={x:0,y:0}){
 const r=anchor.radius,dx=point.x-anchor.x,dy=point.y-anchor.y,d=Math.hypot(dx,dy);
 const nx=d>1e-6?dx/d:1,ny=d>1e-6?dy/d:0;
 const rx=point.vx-anchor.vx,ry=point.vy-anchor.vy,radial=rx*nx+ry*ny;
 const stretch=Math.max(0,d-config.length*r);
 // Slack never pushes out. Drag damps motion relative to the moving anchor;
 // extra radial damping engages gradually as the elastic cord stretches.
 const tension=stretch*config.stiffness+Math.max(0,radial)*config.damping*Math.min(1,stretch/r);
 const reach=config.clearance*r+Math.max(0,-radial)*.12;
 const avoidance=Math.max(0,reach-d)*450;
 point.vx+=(nx*(avoidance-tension)-rx*config.drag+drive.x)*dt;
 point.vy+=(ny*(avoidance-tension)-ry*config.drag+drive.y)*dt;
 point.x+=point.vx*dt;point.y+=point.vy*dt;
 // Only pathological motion reaches this safety leash. It never moves anchor.
 const ex=point.x-anchor.x,ey=point.y-anchor.y,distance=Math.hypot(ex,ey),limit=config.limit*r;
 if(distance>limit){
  const ux=ex/distance,uy=ey/distance,outward=Math.max(0,(point.vx-anchor.vx)*ux+(point.vy-anchor.vy)*uy);
  point.x=anchor.x+ux*limit;point.y=anchor.y+uy*limit;point.vx-=ux*outward;point.vy-=uy*outward;
 }
}
