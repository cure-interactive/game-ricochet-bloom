export const SKIN_DESIGNS=new Set(['porcelain','copper','tidepool','honeycomb','circuit','inkswirl','stormheart','clockwork','eventhorizon','worldseed','linen','malachite','koipond','orrery','chronosphere']);
const tau=Math.PI*2;
const ring=(c,r,start=0,end=tau)=>{c.beginPath();c.arc(0,0,r,start,end);c.stroke();};
function polygon(c,x,y,r,n,phase=0){c.beginPath();for(let i=0;i<n;i++){const a=i*tau/n+phase;i?c.lineTo(x+Math.cos(a)*r,y+Math.sin(a)*r):c.moveTo(x+Math.cos(a)*r,y+Math.sin(a)*r);}c.closePath();}
export function skinDesign(c,style,r,time,speed,low){
 if(!SKIN_DESIGNS.has(style))return false;
 const phase=time*.4;
 if(style==='linen'){
  c.lineWidth=r*.025;for(let i=-3;i<=3;i++){const p=i*r*.22;c.strokeStyle='#fff4dc99';c.beginPath();c.moveTo(-r,p);c.lineTo(r,p);c.stroke();c.strokeStyle='#94836c88';c.beginPath();c.moveTo(p,-r);c.lineTo(p,r);c.stroke();}
 }else if(style==='malachite'){
  for(let i=0;i<5;i++){c.strokeStyle=i%2?'#d0f7c4':'#26785f';c.lineWidth=r*.07;c.beginPath();c.ellipse(-r*.16,r*.12,r*(.2+i*.15),r*(.12+i*.16),-.6,0,tau);c.stroke();}
 }else if(style==='koipond'){
  c.strokeStyle='#e0fff599';c.lineWidth=r*.025;ring(c,r*.75);ring(c,r*.51,phase,phase+4);
  for(let i=0;i<2;i++){c.save();c.rotate(phase+i*Math.PI);c.translate(r*.44,0);c.fillStyle=i?'#fff1d2':'#ec997e';c.beginPath();c.ellipse(0,0,r*.14,r*.3,.3,0,tau);c.fill();polygon(c,-r*.06,r*.29,r*.13,3,phase);c.fill();c.fillStyle='#263c4e';c.beginPath();c.arc(r*.04,-r*.16,r*.035,0,tau);c.fill();c.restore();}
 }else if(style==='orrery'){
  c.fillStyle='#ffe1a0';c.beginPath();c.arc(0,0,r*.2,0,tau);c.fill();c.lineWidth=r*.035;
  for(let i=0;i<3;i++){c.save();c.rotate(i*.8);c.strokeStyle='#eed7a0';c.beginPath();c.ellipse(0,0,r*(.48+i*.13),r*.32,0,0,tau);c.stroke();const a=phase/(i+1)+i;c.fillStyle=['#8bbed7','#eaa78c','#c6b4ee'][i];c.beginPath();c.arc(Math.cos(a)*r*(.48+i*.13),Math.sin(a)*r*.32,r*.09,0,tau);c.fill();c.restore();}
 }else if(style==='chronosphere'){
  for(let i=0;i<3;i++){const a=phase*(i%2?-1:1)+i*2;c.strokeStyle=['#d4f2ff','#b39bf1','#fff2cc'][i];c.lineWidth=r*.045;ring(c,r*(.55+i*.13+speed*.04),a,a+tau*.72);}
  c.save();c.rotate(-phase*.4);c.fillStyle='#edecff';c.beginPath();c.moveTo(-r*.24,-r*.35);c.lineTo(r*.24,-r*.35);c.lineTo(-r*.24,r*.35);c.lineTo(r*.24,r*.35);c.closePath();c.fill();c.restore();
 }else if(style==='porcelain'){
  c.strokeStyle='#275589';c.lineWidth=r*.15;c.beginPath();c.ellipse(0,r*.12,r*.86,r*.32,-.3,0,tau);c.stroke();c.strokeStyle='#fafff0';c.lineWidth=r*.035;ring(c,r*.74,.3,2.2);
 }else if(style==='copper'){
  c.strokeStyle='#327e70';c.lineWidth=r*.1;ring(c,r*.82);c.lineWidth=r*.025;
  for(let i=0;i<7;i++){c.strokeStyle=i%2?'#85583d88':'#f2ce9f99';c.beginPath();c.moveTo(-r*.7,(-.6+i*.18)*r);c.lineTo(r*.7,(-.48+i*.18)*r);c.stroke();}
 }else if(style==='tidepool'){
  c.strokeStyle='#d5fff2a0';c.lineWidth=r*.04;
  for(let i=0;i<(low?3:5);i++){c.beginPath();c.ellipse(Math.sin(phase+i)*r*.18,Math.cos(phase*.7+i)*r*.16,r*(.3+i*.1),r*.23,phase*.2+i,0,tau);c.stroke();}
 }else if(style==='honeycomb'){
  c.strokeStyle='#fff3b7';c.lineWidth=r*.035;
  for(let i=0;i<7;i++){const a=i*tau/6;polygon(c,i===6?0:Math.cos(a)*r*.43,i===6?0:Math.sin(a)*r*.43,r*.24,6,Math.PI/6);c.stroke();}c.fillStyle='#c98735';polygon(c,0,0,r*.18,6,Math.PI/6);c.fill();
 }else if(style==='circuit'){
  for(let i=0;i<6;i++){c.save();c.rotate(i*tau/6);c.strokeStyle=i===Math.floor(time*2)%6?'#f0fff8':'#267e83';c.lineWidth=r*.05;c.beginPath();c.moveTo(r*.18,0);c.lineTo(r*.42,0);c.lineTo(r*.57,r*.17);c.lineTo(r*.78,r*.17);c.stroke();c.fillStyle='#c0fff0';c.beginPath();c.arc(r*.77,r*.17,r*.055,0,tau);c.fill();c.restore();}ring(c,r*.17);
 }else if(style==='inkswirl'){
  for(let i=0;i<2;i++){c.strokeStyle=i?'#eea6cba8':'#513b9399';c.lineWidth=r*(.21+i*.04);c.beginPath();c.ellipse(Math.sin(phase+i*3)*r*.2,Math.cos(phase+i*3)*r*.15,r*.62,r*.23,phase*(i?-1:1)+i,0,tau*.83);c.stroke();}
 }else if(style==='stormheart'){
  for(let i=0;i<3;i++){c.strokeStyle=['#49668d99','#e1e9ff88','#7486bbaa'][i];c.lineWidth=r*.2;c.beginPath();c.ellipse(Math.sin(phase+i)*r*.12,(i-1)*r*.25,r*.67,r*.19,-phase*.2+i*.4,0,tau);c.stroke();}
  c.globalAlpha=.3+.65*(.5+.5*Math.sin(time*3))**6;c.strokeStyle='#e7faff';c.lineWidth=r*.055;c.beginPath();c.moveTo(r*.12,-r*.58);c.lineTo(-r*.2,0);c.lineTo(r*.18,-r*.07);c.lineTo(-r*.1,r*.55);c.stroke();c.globalAlpha=1;ring(c,r*(.83+speed*.04),phase,phase+tau*.75);
 }else if(style==='clockwork'){
  c.strokeStyle='#6f633e';c.lineWidth=r*.12;ring(c,r*.65);c.strokeStyle='#fff0c0';c.lineWidth=r*.045;
  for(let i=0;i<12;i++){const a=i*tau/12+phase;c.beginPath();c.moveTo(Math.cos(a)*r*.57,Math.sin(a)*r*.57);c.lineTo(Math.cos(a)*r*.78,Math.sin(a)*r*.78);c.stroke();}
  c.rotate(-phase);polygon(c,0,0,r*(.3+speed*.12),6);c.stroke();c.fillStyle='#514a3d';polygon(c,0,0,r*.14,6);c.fill();
 }else if(style==='eventhorizon'){
  c.fillStyle='#101426';c.beginPath();c.arc(0,0,r*.32,0,tau);c.fill();
  for(let i=0;i<3;i++){c.strokeStyle=['#f0d9ff','#8d79c9','#ffe7b9'][i];c.lineWidth=r*(.045+i*.02);c.beginPath();c.ellipse(0,0,r*(.63+i*.09+speed*.04),r*(.18+i*.06),-.4+Math.sin(phase)*.14,phase+i,phase+i+tau*.88);c.stroke();}
  c.strokeStyle='#f9ecff';ring(c,r*.37);
 }else if(style==='worldseed'){
  const opening=.42+speed*.25+.04*Math.sin(time*1.8);
  for(let i=0;i<(low?5:8);i++){const a=i*tau/(low?5:8)+phase*.2;c.save();c.rotate(a);c.fillStyle=i%2?'#6fa77ca0':'#d5efafcc';c.beginPath();c.ellipse(0,-r*opening*.65,r*.14,r*opening*.55,.2,0,tau);c.fill();c.strokeStyle='#efffd4';c.lineWidth=r*.025;c.beginPath();c.moveTo(0,0);c.lineTo(0,-r*opening*1.15);c.stroke();c.restore();}c.fillStyle='#f7f0c3';c.beginPath();c.arc(0,0,r*.18,0,tau);c.fill();
 }
 return true;
}
