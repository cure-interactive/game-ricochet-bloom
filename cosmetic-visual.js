import {trailDesign,impactDesign} from './cosmetic-design.js?v=5b25db6c70e995cb17ec5124f92bdb3e6e662cbc3b11373d85739d1868ee2b67';
import {cosmeticGet} from './cosmetic.js?v=91c84c76f4cab70c42d98d3478ee3f1de65abb45f7542101028be9084fe96d9e';
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
  if(!this.last||distance>.05){this.points.push({x:body.x,y:body.y,age:0,t:this.elapsed,energy:Math.min(1,Math.max(Math.hypot(body.vx||0,body.vy||0),distance/dt)/500),break:!this.last});this.last={x:body.x,y:body.y};}
  if(this.points.length>100)this.points.splice(0,this.points.length-100);
 }
 render(c,low=false,showOriginal=false){
  c.save();c.lineCap='round';const item=cosmeticGet(this.trail),style=item?.style;
  if(style&&(style!=='original'||showOriginal))for(let i=1;i<this.points.length;i++){
   const p=this.points[i],a=this.points[i-1];if(p.break)continue;const fade=Math.max(0,1-p.age/.85),angle=Math.atan2(p.y-a.y,p.x-a.x),nx=-Math.sin(angle),ny=Math.cos(angle);
   c.globalAlpha=fade*.7;c.strokeStyle=item.color;c.fillStyle=item.color;
   if(trailDesign(c,item,a,p,i,low))continue;
   if(style==='original'){c.globalAlpha=fade*.22;c.strokeStyle='#bff6e2';c.lineWidth=fade*10;c.beginPath();c.moveTo(a.x,a.y);c.lineTo(p.x,p.y);c.stroke();}
   else if(style==='stardust'){
    if(i%(low?4:2))continue;const x=p.x,y=p.y;c.lineWidth=1.4;c.beginPath();line(c,x,y,4*fade,0);line(c,x,y,4*fade,Math.PI);line(c,x,y,4*fade,Math.PI/2);line(c,x,y,4*fade,-Math.PI/2);c.stroke();
   }else if(style==='ember'){
    const spread=5+p.energy*5,offset=Math.sin(p.t*18)*spread,previous=Math.sin(a.t*18)*spread;
    for(let k=0;k<(low?1:2);k++){const side=k?-1:1;c.strokeStyle=k?'#ff9455':'#ffdc8a';c.lineWidth=fade*(2+p.energy*2);c.beginPath();c.moveTo(a.x+nx*previous*side,a.y+ny*previous*side);c.lineTo(p.x+nx*offset*side,p.y+ny*offset*side);c.stroke();}
    if(!(i%(low?6:3))){c.fillStyle=p.age<.25?'#fff2bd':'#e98a4b';c.beginPath();c.arc(p.x+nx*(offset+p.age*18),p.y+ny*(offset+p.age*18),Math.max(.4,2.6*fade),0,tau);c.fill();}
   }else{
    const colors=style==='prism'?['#99e9ff','#e1a2ff','#aaf5cf']:style==='aurora'?['#9debd9','#bca0ff','#f4add6']:['#a9f1df'];
    for(let k=0;k<(low&&style!=='aurora'?1:colors.length);k++){
     const offset=t=>style==='prism'?Math.sin(t*15+k*tau/3)*5:style==='aurora'?(k-1)*(6+p.energy*4)+Math.sin(t*9+k*1.8)*6:0;
     c.strokeStyle=colors[k];c.globalAlpha=fade*(style==='aurora'?.36:.7);c.lineWidth=fade*(style==='silk'?6:style==='aurora'?6+p.energy*4:2.3);c.beginPath();c.moveTo(a.x+nx*offset(a.t),a.y+ny*offset(a.t));c.lineTo(p.x+nx*offset(p.t),p.y+ny*offset(p.t));c.stroke();
    }
    if(style==='aurora'&&!(i%(low?12:6))){const drift=Math.sin(p.t*11)*15*(1+p.age),x=p.x+nx*drift,y=p.y+ny*drift;c.globalAlpha=fade*.85;c.strokeStyle='#e9fff5';c.lineWidth=1;c.beginPath();for(let k=0;k<4;k++)line(c,x,y,2+fade*2,k*tau/4);c.stroke();}
   }
  }
  for(const b of this.bounces){const item=cosmeticGet(b.id),t=b.age/.7,r=8+55*t,fade=(1-t)**2,count=low?6:12;c.globalAlpha=fade*.85;c.strokeStyle=item.color;c.fillStyle=item.color;c.lineWidth=2;
   if(impactDesign(c,item,b,low))continue;
   if(item.style==='nova'){
    const colors=['#99e9ff','#e1a2ff','#aaf5cf'];for(let k=0;k<3;k++){const stage=Math.max(0,(t-k*.13)/(1-k*.13));if(!stage)continue;c.strokeStyle=colors[k];c.globalAlpha=(1-stage)**2*.8;c.lineWidth=low?1.5:2.5;c.beginPath();c.arc(b.x,b.y,6+55*stage,0,tau);c.stroke();}
    c.globalAlpha=fade*.9;c.strokeStyle='#f5eaff';c.lineWidth=2;c.beginPath();for(let i=0;i<12;i++){const a=i*tau/12+t*.6,reach=(i%2?.32:1)*(9+22*Math.sin(Math.min(1,t*2)*Math.PI/2));i?c.lineTo(b.x+Math.cos(a)*reach,b.y+Math.sin(a)*reach):c.moveTo(b.x+Math.cos(a)*reach,b.y+Math.sin(a)*reach);}c.closePath();c.stroke();
   }else if(['rings','sunburst'].includes(item.style))for(let k=0;k<(low?1:2);k++){c.beginPath();c.arc(b.x,b.y,Math.max(1,r-k*8),0,tau);c.stroke();}
   if(item.style==='sunburst'){c.globalAlpha=fade*.6;c.fillStyle='#fff1ba';c.beginPath();c.arc(b.x,b.y,3+8*(1-t),0,tau);c.fill();c.globalAlpha=fade*.85;}
   if(item.style!=='rings')for(let i=0;i<count;i++){const a=i*tau/count+t*.25,x=b.x+Math.cos(a)*r,y=b.y+Math.sin(a)*r;c.beginPath();if(item.style==='petals')c.ellipse(x,y,3+5*fade,2+2*fade,a,0,tau);else if(item.style==='sunburst')line(c,b.x,b.y,r,a);else {line(c,x,y,3+fade*3,0);line(c,x,y,3+fade*3,Math.PI);line(c,x,y,3+fade*3,Math.PI/2);line(c,x,y,3+fade*3,-Math.PI/2);}c.stroke();}
  }
  c.restore();
 }
}
