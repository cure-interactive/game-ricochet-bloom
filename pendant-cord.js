import {accessoryTier} from './accessory.js?v=1a0c89daf9413e22b2da886efaa548450b52cc8b9950c576acd7e305c272ac53';

// Rarity artwork follows the simulated chain. Static icons can use a curve
// before their first simulation step. Rendering never advances joint history.
export function pendantCord(c,body,charm,length,item,time=0,low=false,attachment=null,inset=1,path=null){
 const r=body.radius,unit=r/14,dx=charm.x-body.x,dy=charm.y-body.y,d=Math.hypot(dx,dy)||1,nx=dx/d,ny=dy/d;
 const start=attachment||{x:body.x+nx*r,y:body.y+ny*r},slack=Math.max(0,r*(length-inset)-Math.hypot(charm.x-start.x,charm.y-start.y))*.3;
 const control={x:(body.x+charm.x)/2-ny*slack,y:(body.y+charm.y)/2+nx*slack};
 const curve=t=>({x:(1-t)**2*start.x+2*(1-t)*t*control.x+t*t*charm.x,y:(1-t)**2*start.y+2*(1-t)*t*control.y+t*t*charm.y});
 const joints=path?.length>1?path:null;
 const at=t=>{
  if(!joints)return curve(t);
  const index=Math.min(joints.length-2,Math.floor(t*(joints.length-1))),mix=t*(joints.length-1)-index,a=joints[index],b=joints[index+1];
  return {x:a.x+(b.x-a.x)*mix,y:a.y+(b.y-a.y)*mix};
 };
 const tangent=t=>{const a=at(Math.max(0,t-.015)),b=at(Math.min(1,t+.015)),d=Math.hypot(b.x-a.x,b.y-a.y)||1;return {x:(b.x-a.x)/d,y:(b.y-a.y)/d};};
 const tier=accessoryTier(item);
 c.save();c.lineWidth=unit*Math.max(.65,Math.min(1.4,2-d/(r*length)*.7));c.strokeStyle='#d7ebe9';c.globalAlpha=.8;
 c.beginPath();c.moveTo(start.x,start.y);if(joints){for(const p of joints.slice(1))c.lineTo(p.x,p.y);}else c.quadraticCurveTo(control.x,control.y,charm.x,charm.y);c.stroke();
 // Alternating link faces read as a chain even without rarity decoration.
 const links=Math.max(6,Math.round(r*(length-inset)/(unit*2.5)));c.lineWidth=unit*.55;
 for(let i=0;i<links;i++){const t=(i+.5)/links,p=at(t),n=tangent(t);c.beginPath();c.ellipse(p.x,p.y,unit*1.5,unit*(i%2?.4:.85),Math.atan2(n.y,n.x),0,Math.PI*2);c.stroke();}
 if(tier>=2){
  // Epic/Legendary filigree never reads time. Motion of the tether itself is
  // physical; the decorative strands and clasps have no autonomous animation.
  for(const side of [-1,1]){
   c.strokeStyle=side<0?item.color:'#fff1c6';c.lineWidth=unit*.8;c.globalAlpha=.9;c.beginPath();
   for(let i=0;i<=24;i++){const t=i/24,p=at(t),normal=tangent(t),offset=Math.sin(t*Math.PI*6)*unit*1.35*side;i?c.lineTo(p.x-normal.y*offset,p.y+normal.x*offset):c.moveTo(p.x,p.y);}
   c.stroke();
  }
  c.fillStyle=item.color;for(const t of [.18,.82]){const p=at(t);c.beginPath();c.arc(p.x,p.y,unit*1.5,0,Math.PI*2);c.fill();}
 }
 if(tier===4){
  const count=low?2:4;c.fillStyle='#f2fff5';
  for(let i=0;i<count;i++){
   const t=(time*.45+i/count)%1,p=at(t);c.globalAlpha=Math.sin(t*Math.PI)*.9;
   c.beginPath();c.arc(p.x,p.y,unit*(1.05+Math.sin(t*Math.PI)*.6),0,Math.PI*2);c.fill();
  }
 }
 c.restore();
}
