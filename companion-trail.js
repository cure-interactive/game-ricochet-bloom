// A short, bounded record of actual companion travel, separate from its leash.
export class CompanionTrail{
 constructor(){this.clear();}
 clear(){this.points=[];this.last=null;this.clock=0;}
 step(point,radius,dt,item){
  if(item?.rarity!=='mythic'){this.clear();return;}
  if(!(dt>0))return;
  this.clock+=dt;
  for(const p of this.points)p.age+=dt;
  this.points=this.points.filter(p=>p.age<1.1);
  if(!this.last){this.last={...point};return;}
  const distance=Math.hypot(point.x-this.last.x,point.y-this.last.y);
  if(distance<radius*.16)return;
  this.points.push({x:point.x,y:point.y,r:radius*.28,age:0,phase:this.clock*5});
  this.last={...point};
  if(this.points.length>48)this.points.shift();
 }
 render(c,item,low=false){
  c.save();c.fillStyle=item.color;
  for(let i=0;i<this.points.length;i+=low?2:1){
   const p=this.points[i],fade=1-p.age/1.1,size=p.r*(.3+fade*.5);
   const blink=item.style==='firefly'?.18+.82*Math.pow(.5+.5*Math.sin(this.clock*9+p.phase),3):1;
   c.globalAlpha=fade*.65*blink;c.save();c.translate(p.x,p.y);c.rotate(p.phase+p.age);
   if(item.style==='octopus'){c.strokeStyle=item.color;c.lineWidth=Math.max(.4,size*.3);c.beginPath();c.arc(0,0,size,0,Math.PI*2);c.stroke();}
   else if(item.style==='robot')c.fillRect(-size/2,-size/2,size,size);
   else {c.beginPath();c.ellipse(0,0,size,item.style==='dragon'?size*.4:size,0,0,Math.PI*2);c.fill();}
   if(item.style==='whale'||item.style==='firefly'){c.globalAlpha*=.25;c.beginPath();c.arc(0,0,size*2,0,Math.PI*2);c.fill();}
   c.restore();
  }
  c.restore();
 }
}
