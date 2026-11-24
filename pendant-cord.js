import {accessoryTier} from './accessory.js?v=91a2f322a8bbdc6a7838e7084cd7ebcc2fa4ecd86c974e585c13ea9f79a7b33c';

// Pendant artwork only. The invisible physical tether lives in tether-motion.
export function pendantCord(c,body,charm,length,item,time=0,low=false,attachment=null){
 const r=body.radius,unit=r/14,dx=charm.x-body.x,dy=charm.y-body.y,d=Math.hypot(dx,dy)||1,nx=dx/d,ny=dy/d;
 const start=attachment||{x:body.x+nx*r,y:body.y+ny*r},slack=Math.max(0,r*(length-1)-Math.hypot(charm.x-start.x,charm.y-start.y))*.3;
 const control={x:(body.x+charm.x)/2-ny*slack,y:(body.y+charm.y)/2+nx*slack};
 const at=t=>({x:(1-t)**2*start.x+2*(1-t)*t*control.x+t*t*charm.x,y:(1-t)**2*start.y+2*(1-t)*t*control.y+t*t*charm.y});
 const tier=accessoryTier(item);
 c.save();c.lineWidth=unit*Math.max(.65,Math.min(1.4,2-d/(r*length)*.7));c.strokeStyle='#d7ebe9';c.globalAlpha=.8;
 c.beginPath();c.moveTo(start.x,start.y);c.quadraticCurveTo(control.x,control.y,charm.x,charm.y);c.stroke();
 if(tier>=2){
  // Epic/Legendary filigree never reads time. Motion of the tether itself is
  // physical; the decorative strands and clasps have no autonomous animation.
  for(const side of [-1,1]){
   c.strokeStyle=side<0?item.color:'#fff1c6';c.lineWidth=unit*.8;c.globalAlpha=.9;c.beginPath();
   for(let i=0;i<=24;i++){const t=i/24,p=at(t),offset=Math.sin(t*Math.PI*6)*unit*1.35*side;i?c.lineTo(p.x-ny*offset,p.y+nx*offset):c.moveTo(p.x,p.y);}
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
