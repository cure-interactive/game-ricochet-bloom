import {assetURL} from './asset.js?v=4bfc215978ddb2faa5f215313763b4a44ba960a1982aaa13417639cc1020a545';
let cure;
export function skinMaterial(c,body,points,style,rotation=0,time=0,low=false){
 if(!['cure','frost','nebula','solar','seaglass','spectrum'].includes(style))return;
 const {x,y,radius:r}=body,tau=Math.PI*2,speed=Math.min(1,Math.hypot(body.vx||0,body.vy||0)/500),phase=time*.65;
 // The decoration stretches with the real membrane and remains clipped to it.
 const xs=points.map(p=>p.x),ys=points.map(p=>p.y),sx=(Math.max(...xs)-Math.min(...xs))/(r*2),sy=(Math.max(...ys)-Math.min(...ys))/(r*2);
 c.save();c.translate(x,y);c.scale(sx,sy);c.rotate(rotation);c.lineWidth=r*.065;c.strokeStyle='#ffffffb0';c.fillStyle='#ffffffb0';c.lineCap='round';
 if(style==='cure'){
  if(!cure&&typeof Image!=='undefined'){cure=new Image();cure.src=assetURL('brand/cure-interactive.svg');}
  c.strokeStyle='#9feaff';for(const [i,radius] of [.64,.83].entries()){c.beginPath();c.arc(0,0,r*radius,phase*(i?-1:1),phase*(i?-1:1)+tau*.78);c.stroke();}
  c.strokeStyle='#ebffff90';c.lineWidth=r*(.035+speed*.025);c.beginPath();c.arc(0,0,r*(.76+.06*Math.sin(time*2)),0,tau);c.stroke();
  if(cure?.complete&&cure.naturalWidth)c.drawImage(cure,-r*.72,-r*.33,r*1.44,r*1.44*4097.333/8875.333);
 }else if(style==='frost'){
  for(let i=0;i<6;i++){c.save();c.rotate(i*tau/6);c.beginPath();c.moveTo(0,0);c.lineTo(0,-r*.65);c.moveTo(-r*.18,-r*.38);c.lineTo(0,-r*.23);c.lineTo(r*.18,-r*.38);c.stroke();c.restore();}
 }else if(style==='nebula'){
  c.rotate(phase*.18);c.strokeStyle='#a35ce9';c.lineWidth=r*.18;c.beginPath();c.ellipse(0,0,r*.68,r*.3,-.55,0,tau);c.stroke();c.strokeStyle='#eee3ff';c.fillStyle='#fff4ff';c.lineWidth=r*.04;
  const stars=[[-.45,-.18],[-.12,.35],[.2,-.36],[.5,.16],[.05,.05]];c.beginPath();stars.forEach(([a,b],i)=>i?c.lineTo(a*r,b*r):c.moveTo(a*r,b*r));c.stroke();for(const [a,b] of stars){c.beginPath();c.arc(a*r,b*r,r*.07,0,tau);c.fill();}
 }else if(style==='solar'){
  c.fillStyle='#e78925';c.beginPath();c.arc(0,0,r*.32,0,tau);c.fill();c.strokeStyle='#fff3be';c.stroke();
  for(let i=0;i<(low?8:12);i++){const a=i*tau/(low?8:12)+phase,reach=.63+.12*Math.sin(time*2+i*1.7)+speed*.1;c.beginPath();c.moveTo(Math.cos(a)*r*.42,Math.sin(a)*r*.42);c.lineTo(Math.cos(a)*r*reach,Math.sin(a)*r*reach);c.stroke();}
  c.strokeStyle='#f6a238';c.lineWidth=r*.045;c.beginPath();c.arc(0,0,r*.82,-phase,-phase+tau*.64);c.stroke();
 }else if(style==='spectrum'){
  const colors=['#5ec8ef','#be79f0','#5ad8b0'];c.lineWidth=r*.085;
  for(let i=0;i<3;i++){const angle=phase*(i%2?-1:1)+i*tau/3;c.strokeStyle=colors[i];c.beginPath();c.ellipse(0,0,r*(.69+speed*.07),r*(.25+.08*Math.sin(time+i)),angle,0,tau);c.stroke();if(!low){c.fillStyle=colors[i];c.beginPath();c.arc(Math.cos(angle)*r*.72,Math.sin(angle)*r*.72,r*.075,0,tau);c.fill();}}
  c.rotate(-phase*.7);c.fillStyle='#fff9e5';c.strokeStyle='#8d6bc8';c.lineWidth=r*.035;c.beginPath();for(let i=0;i<12;i++){const a=i*tau/12,rr=r*(i%2?.12:.35+speed*.1);i?c.lineTo(Math.cos(a)*rr,Math.sin(a)*rr):c.moveTo(Math.cos(a)*rr,Math.sin(a)*rr);}c.closePath();c.fill();c.stroke();
 }else{
  const colors=style==='spectrum'?['#9ae8ff','#dba0ff','#a5f3d4']:['#e3fff0','#9be3d8','#ffffff'];
  for(let i=0;i<3;i++){c.strokeStyle=colors[i];c.lineWidth=r*.1;c.beginPath();c.ellipse(0,(i-1)*r*.18,r*.69,r*.26,-.55,0,tau);c.stroke();}
 }
 c.restore();
}
