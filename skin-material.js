import {assetURL} from './asset.js?v=cb684ea278b2dc6b1457e951b71d22eea4538d738b252e9abd7f743632acdfd4';
let cure;
export function skinMaterial(c,body,points,style,rotation=0){
 if(!['cure','frost','nebula','solar','seaglass','spectrum'].includes(style))return;
 const {x,y,radius:r}=body,tau=Math.PI*2;
 // The decoration stretches with the real membrane and remains clipped to it.
 const xs=points.map(p=>p.x),ys=points.map(p=>p.y),sx=(Math.max(...xs)-Math.min(...xs))/(r*2),sy=(Math.max(...ys)-Math.min(...ys))/(r*2);
 c.save();c.translate(x,y);c.scale(sx,sy);c.rotate(rotation);c.lineWidth=r*.065;c.strokeStyle='#ffffffb0';c.fillStyle='#ffffffb0';c.lineCap='round';
 if(style==='cure'){
  if(!cure&&typeof Image!=='undefined'){cure=new Image();cure.src=assetURL('brand/cure-interactive.svg');}
  c.strokeStyle='#ebffffa0';for(const radius of [.64,.83]){c.beginPath();c.arc(0,0,r*radius,0,tau);c.stroke();}
  if(cure?.complete&&cure.naturalWidth)c.drawImage(cure,-r*.72,-r*.33,r*1.44,r*1.44*4097.333/8875.333);
 }else if(style==='frost'){
  for(let i=0;i<6;i++){c.save();c.rotate(i*tau/6);c.beginPath();c.moveTo(0,0);c.lineTo(0,-r*.65);c.moveTo(-r*.18,-r*.38);c.lineTo(0,-r*.23);c.lineTo(r*.18,-r*.38);c.stroke();c.restore();}
 }else if(style==='nebula'){
  const stars=[[-.45,-.18],[-.12,.35],[.2,-.36],[.5,.16],[.05,.05]];c.beginPath();stars.forEach(([a,b],i)=>i?c.lineTo(a*r,b*r):c.moveTo(a*r,b*r));c.stroke();for(const [a,b] of stars){c.beginPath();c.arc(a*r,b*r,r*.07,0,tau);c.fill();}
 }else if(style==='solar'){
  c.strokeStyle='#fff3be';c.beginPath();c.arc(0,0,r*.29,0,tau);c.stroke();for(let i=0;i<12;i++){const a=i*tau/12;c.beginPath();c.moveTo(Math.cos(a)*r*.42,Math.sin(a)*r*.42);c.lineTo(Math.cos(a)*r*.68,Math.sin(a)*r*.68);c.stroke();}
 }else{
  const colors=style==='spectrum'?['#9ae8ff','#dba0ff','#a5f3d4']:['#e3fff0','#9be3d8','#ffffff'];
  for(let i=0;i<3;i++){c.strokeStyle=colors[i];c.lineWidth=r*.1;c.beginPath();c.ellipse(0,(i-1)*r*.18,r*.69,r*.26,-.55,0,tau);c.stroke();}
 }
 c.restore();
}
