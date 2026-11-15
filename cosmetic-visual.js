import {cosmeticGet} from './cosmetic.js?v=1b311bc177fb26970783e2cc6a501de7066f96f2d1f5e34527d39000881ba8cd';
const tau=Math.PI*2;
const line=(c,x,y,r,a)=>{c.moveTo(x+Math.cos(a)*r*.55,y+Math.sin(a)*r*.55);c.lineTo(x+Math.cos(a)*r,y+Math.sin(a)*r);};
// Cosmetics draw only: no collisions, random engine state, audio or rewards.
export class CosmeticVisual{
 constructor(){this.clear();}
 clear(){this.points=[];this.bounces=[];this.last=null;this.elapsed=0;this.trail='trail.original';this.bounce='bounce.none';}
 configure(loadout={}){const trail=cosmeticGet(loadout.trail)?.kind==='trail'?loadout.trail:'trail.original',bounce=cosmeticGet(loadout.bounce)?.kind==='bounce'?loadout.bounce:'bounce.none';if(trail!==this.trail){this.points=[];this.last=null;}this.trail=trail;this.bounce=bounce;}
 hit(x,y){if(this.bounce==='bounce.none'||!Number.isFinite(x)||!Number.isFinite(y))return;this.bounces.push({x,y,age:0,id:this.bounce});if(this.bounces.length>24)this.bounces.shift();}
 breakTrail(){this.last=null;this.points=[];}
 step(body,dt,moving=true){
  dt=Math.min(.05,Math.max(0,dt));this.elapsed+=dt;
  for(const p of this.points)p.age+=dt;for(const b of this.bounces)b.age+=dt;
  this.points=this.points.filter(p=>p.age<.85);this.bounces=this.bounces.filter(b=>b.age<.7);
  if(!body||!moving||!dt){this.last=null;return;}
  const distance=this.last?Math.hypot(body.x-this.last.x,body.y-this.last.y):0;
  if(distance>180)this.breakTrail();
  if(!this.last||distance>2){this.points.push({x:body.x,y:body.y,age:0,t:this.elapsed,break:!this.last});this.last={x:body.x,y:body.y};}
  if(this.points.length>100)this.points.splice(0,this.points.length-100);
 }
 render(c,low=false,showOriginal=false){
  c.save();c.lineCap='round';const item=cosmeticGet(this.trail),style=item?.style;
  if(style&&(style!=='original'||showOriginal))for(let i=1;i<this.points.length;i++){
   const p=this.points[i],a=this.points[i-1];if(p.break)continue;const fade=Math.max(0,1-p.age/.85),angle=Math.atan2(p.y-a.y,p.x-a.x),nx=-Math.sin(angle),ny=Math.cos(angle);
   c.globalAlpha=fade*.7;c.strokeStyle=item.color;c.fillStyle=item.color;
   if(style==='original'){c.globalAlpha=fade*.22;c.strokeStyle='#bff6e2';c.lineWidth=fade*10;c.beginPath();c.moveTo(a.x,a.y);c.lineTo(p.x,p.y);c.stroke();}
   else if(style==='stardust'||style==='ember'){
    if(i%(low?4:2))continue;const offset=style==='ember'?Math.sin(p.t*26)*8:0,x=p.x+nx*offset,y=p.y+ny*offset;
    if(style==='stardust'){c.lineWidth=1.4;c.beginPath();line(c,x,y,4*fade,0);line(c,x,y,4*fade,Math.PI);line(c,x,y,4*fade,Math.PI/2);line(c,x,y,4*fade,-Math.PI/2);c.stroke();}
    else {c.beginPath();c.arc(x,y,Math.max(.4,3*fade),0,tau);c.fill();}
   }else{
    const colors=style==='prism'?['#99e9ff','#e1a2ff','#aaf5cf']:style==='aurora'?['#9debd9','#bca0ff','#f4add6']:['#a9f1df'];
    for(let k=0;k<(low?1:colors.length);k++){const offset=(k-(colors.length-1)/2)*(style==='aurora'?7:4),wave=style==='aurora'?Math.sin(p.t*13+k)*4:0;c.strokeStyle=colors[k];c.lineWidth=fade*(style==='silk'?6:style==='aurora'?9:3);c.beginPath();c.moveTo(a.x+nx*(offset+wave),a.y+ny*(offset+wave));c.lineTo(p.x+nx*(offset+wave),p.y+ny*(offset+wave));c.stroke();}
   }
  }
  for(const b of this.bounces){const item=cosmeticGet(b.id),t=b.age/.7,r=8+55*t,fade=(1-t)**2,count=low?6:12;c.globalAlpha=fade*.85;c.strokeStyle=item.color;c.fillStyle=item.color;c.lineWidth=2;
   if(['rings','nova','sunburst'].includes(item.style))for(let k=0;k<(low?1:item.style==='nova'?3:2);k++){c.strokeStyle=item.style==='nova'?['#99e9ff','#e1a2ff','#aaf5cf'][k]:item.color;c.beginPath();c.arc(b.x,b.y,Math.max(1,r-k*8),0,tau);c.stroke();}
   if(item.style!=='rings')for(let i=0;i<count;i++){const a=i*tau/count+t*.25,x=b.x+Math.cos(a)*r,y=b.y+Math.sin(a)*r;c.beginPath();if(item.style==='petals')c.ellipse(x,y,3+5*fade,2+2*fade,a,0,tau);else if(item.style==='sunburst')line(c,b.x,b.y,r,a);else {line(c,x,y,3+fade*3,0);line(c,x,y,3+fade*3,Math.PI);line(c,x,y,3+fade*3,Math.PI/2);line(c,x,y,3+fade*3,-Math.PI/2);}c.stroke();}
  }
  c.restore();
 }
}
