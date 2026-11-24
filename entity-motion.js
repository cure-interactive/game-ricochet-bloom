// Shared presentation mechanics. Impulses change momentum; friction opposes
// velocity. Callers own forces, constraints and whether a body is gameplay state.
export function entityImpulse(body,x,y,{mass=1,limit=Infinity}={}){
 body.vx+=x/mass;body.vy+=y/mass;
 const speed=Math.hypot(body.vx,body.vy);if(speed>limit){body.vx*=limit/speed;body.vy*=limit/speed;}
}
export function entityStep(body,dt,{mass=1,friction=0}={},force={x:0,y:0}){
 entityImpulse(body,(force.x-body.vx*friction)*dt,(force.y-body.vy*friction)*dt,{mass});
 body.x+=body.vx*dt;body.y+=body.vy*dt;
}
