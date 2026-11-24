// Extra catalogue artwork uses the same finite trail and impact history.
const tau=Math.PI*2;
const trails=new Set(['mist','dashes','fireflies','rainstream','lattice','inkbrush','stormwake','clockstream','riftwake','livingvine','chalk','mapledrift','spectralbraid','brassribbon','galaxystream']);
const impacts=new Set(['droplet','crossflash','iceshards','honeycombpulse','circuitbloom','inksplash','thunderseal','clockburst','horizoncollapse','worldbloom','chalkdust','mapleburst','spectralbloom','brasschime','galaxybloom']);
function polygon(c,x,y,r,n,phase=0){c.beginPath();for(let i=0;i<n;i++){const a=i*tau/n+phase;i?c.lineTo(x+Math.cos(a)*r,y+Math.sin(a)*r):c.moveTo(x+Math.cos(a)*r,y+Math.sin(a)*r);}c.closePath();}
function leaf(c,x,y,r,phase=0){c.beginPath();for(let i=0;i<10;i++){const a=i*Math.PI/5+phase,s=i%2?r*.42:r;i?c.lineTo(x+Math.cos(a)*s,y+Math.sin(a)*s):c.moveTo(x+Math.cos(a)*s,y+Math.sin(a)*s);}c.closePath();}
const stroke=(c,x,y,xx,yy)=>{c.beginPath();c.moveTo(x,y);c.lineTo(xx,yy);c.stroke();};
const circle=(c,x,y,r,fill=false)=>{c.beginPath();c.arc(x,y,Math.max(.01,r),0,tau);fill?c.fill():c.stroke();};
export function trailDesign(c,item,a,p,i,low){
 const s=item.style;if(!trails.has(s))return false;
 const f=Math.max(0,1-p.age/.85),angle=Math.atan2(p.y-a.y,p.x-a.x),nx=-Math.sin(angle),ny=Math.cos(angle),wave=Math.sin(p.t*14),detail=!(i%(low?8:4));
 c.strokeStyle=item.color;c.fillStyle=item.color;c.globalAlpha=f*.7;c.lineWidth=Math.max(.1,f*2);
 if(s==='chalk'){c.globalAlpha=f*.45;c.lineWidth=2*f;if(i%3)stroke(c,a.x,a.y,p.x,p.y);if(detail)circle(c,p.x+nx*wave*3,p.y+ny*wave*3,.7*f,true);}
 else if(s==='mapledrift'){if(detail){c.save();c.translate(p.x+nx*p.age*12,p.y+ny*p.age*12);c.rotate(p.t+p.age*3);leaf(c,0,0,4*f);c.fill();c.strokeStyle='#966943';stroke(c,0,-2*f,0,6*f);c.restore();}}
 else if(s==='spectralbraid'){for(const side of [-1,1]){c.strokeStyle=side<0?'#9ce8e1':'#d6b0f1';stroke(c,a.x+nx*side*Math.sin(a.t*14)*4,a.y+ny*side*Math.sin(a.t*14)*4,p.x+nx*side*wave*4,p.y+ny*side*wave*4);}if(detail){polygon(c,p.x,p.y,3*f,4,p.t);c.stroke();}}
 else if(s==='brassribbon'){c.lineWidth=3*f;stroke(c,a.x+nx*Math.sin(a.t*10)*4,a.y+ny*Math.sin(a.t*10)*4,p.x+nx*Math.sin(p.t*10)*4,p.y+ny*Math.sin(p.t*10)*4);if(detail){c.strokeStyle='#fff2c6';circle(c,p.x+nx*7,p.y+ny*7,2*f);}}
 else if(s==='galaxystream'){for(const side of [-1,1]){c.strokeStyle=side<0?'#a79ae9':'#f2c8ef';c.lineWidth=(1+p.energy*2)*f;stroke(c,a.x+nx*Math.sin(a.t*9+side)*7,a.y+ny*Math.sin(a.t*9+side)*7,p.x+nx*Math.sin(p.t*9+side)*7,p.y+ny*Math.sin(p.t*9+side)*7);}if(detail){c.fillStyle='#fff0c9';polygon(c,p.x+nx*wave*(8+p.age*18),p.y+ny*wave*(8+p.age*18),2.5*f,4,p.t);c.fill();}}
 else if(s==='mist'){c.globalAlpha=f*.12;c.lineWidth=4+p.age*14;stroke(c,a.x,a.y,p.x,p.y);}
 else if(s==='dashes'){if(Math.floor(p.t*16)%2){c.lineWidth=f*3;stroke(c,a.x,a.y,p.x,p.y);}}
 else if(s==='fireflies'){if(detail){c.globalAlpha=f*(.5+.4*Math.sin(p.t*31)**2);circle(c,p.x+nx*wave*p.age*22,p.y+ny*wave*p.age*22,1.5+f*1.5,true);}}
 else if(s==='rainstream'){c.globalAlpha=f*.3;stroke(c,a.x,a.y,p.x,p.y);if(detail){c.globalAlpha=f*.8;c.beginPath();c.ellipse(p.x+nx*wave*5,p.y+ny*wave*5+p.age*15,1.3*f,4*f,angle,0,tau);c.fill();}}
 else if(s==='lattice'){stroke(c,a.x,a.y,p.x,p.y);if(detail){polygon(c,p.x,p.y,5*f,6,angle);c.stroke();}}
 else if(s==='inkbrush'){c.globalAlpha=f*.5;c.lineWidth=f*(3+wave*2+p.energy*4);stroke(c,a.x,a.y,p.x,p.y);if(detail){c.globalAlpha=f*.3;circle(c,p.x+nx*wave*10,p.y+ny*wave*10,2*f,true);}}
 else if(s==='stormwake'){c.lineWidth=f*2;stroke(c,a.x,a.y,p.x,p.y);if(detail){c.globalAlpha=f*.85;c.beginPath();c.moveTo(p.x,p.y);c.lineTo(p.x+nx*7,p.y+ny*7);c.lineTo(p.x+nx*4-Math.cos(angle)*4,p.y+ny*4-Math.sin(angle)*4);c.lineTo(p.x+nx*14,p.y+ny*14);c.stroke();}}
 else if(s==='clockstream'){c.globalAlpha=f*.35;stroke(c,a.x,a.y,p.x,p.y);if(detail){c.globalAlpha=f*.8;for(let k=0;k<(low?2:3);k++){c.beginPath();c.arc(p.x,p.y,6*f,k*tau/3+p.t,k*tau/3+p.t+.9);c.stroke();}}}
 else if(s==='riftwake'){for(let side of [-1,1]){c.strokeStyle=side<0?'#8e7ae2':'#e5baff';c.lineWidth=f*(2+p.energy*3);stroke(c,a.x+nx*side*3,a.y+ny*side*3,p.x+nx*side*(3+wave*2),p.y+ny*side*(3+wave*2));}if(detail){polygon(c,p.x+nx*wave*16*f,p.y+ny*wave*16*f,2*f,3,p.t);c.fill();}}
 else if(s==='livingvine'){c.lineWidth=f*2;stroke(c,a.x+nx*Math.sin(a.t*14)*3,a.y+ny*Math.sin(a.t*14)*3,p.x+nx*wave*3,p.y+ny*wave*3);if(detail){c.beginPath();c.ellipse(p.x+nx*5,p.y+ny*5,6*f,2.5*f,angle+.8,0,tau);c.fill();circle(c,p.x-nx*(7+p.age*8),p.y-ny*(7+p.age*8),f,true);}}
 return true;
}
export function impactDesign(c,item,b,low){
 const s=item.style;if(!impacts.has(s))return false;
 const t=Math.min(1,b.age/.7),f=(1-t)**2,r=5+45*(1-(1-t)**3),n=low?6:12;
 c.save();c.translate(b.x,b.y);c.strokeStyle=item.color;c.fillStyle=item.color;c.globalAlpha=f*.85;c.lineWidth=1.5+f;
 if(s==='chalkdust'){for(let i=0;i<n;i++){const a=i*tau/n;circle(c,Math.cos(a)*r*.6,Math.sin(a)*r*.6,(1+i%3)*f,true);}}
 else if(s==='mapleburst'){for(let i=0;i<n/2;i++){const a=i*tau/(n/2);leaf(c,Math.cos(a)*r*.75,Math.sin(a)*r*.75,5*f,a+t*3);c.fill();}}
 else if(s==='spectralbloom'){for(let i=0;i<2;i++){c.strokeStyle=i?'#b6f2df':'#dcbcff';polygon(c,0,0,r*(i?.7:1),4,t*(i?-1:1));c.stroke();}circle(c,0,0,5*f,true);}
 else if(s==='brasschime'){for(let i=0;i<3;i++){c.globalAlpha=f*(1-i*.2);c.beginPath();c.ellipse(0,-r*.1,r*(.4+i*.2),r*(.25+i*.15),0,0,tau);c.stroke();}for(let i=0;i<n;i++){const a=i*tau/n;circle(c,Math.cos(a)*r,Math.sin(a)*r,2*f,true);}}
 else if(s==='galaxybloom'){circle(c,0,0,8*f,true);for(let i=0;i<(low?3:5);i++){c.save();c.rotate(i*tau/(low?3:5)+t*2);c.beginPath();c.moveTo(0,0);c.bezierCurveTo(r,-r*.5,r*.3,r*.8,r,0);c.stroke();polygon(c,r,0,3*f,4,t);c.fill();c.restore();}}
 else if(s==='droplet'){circle(c,0,0,r);for(let i=0;i<6;i++){const a=i*tau/6;circle(c,Math.cos(a)*r*.75,Math.sin(a)*r*.75,3*f,true);}}
 else if(s==='crossflash'){c.lineWidth=3*f+.1;for(let i=0;i<4;i++){const a=i*tau/4;stroke(c,Math.cos(a)*r*.2,Math.sin(a)*r*.2,Math.cos(a)*r,Math.sin(a)*r);}c.globalAlpha=f*.3;circle(c,0,0,10*f,true);}
 else if(s==='iceshards'){for(let i=0;i<n;i++){const a=i*tau/n;polygon(c,Math.cos(a)*r,Math.sin(a)*r,(3+i%3)*f,3,a+t);c.fill();}}
 else if(s==='honeycombpulse'){polygon(c,0,0,9+8*t,6);c.stroke();for(let i=0;i<6;i++){const a=i*tau/6;c.globalAlpha=f*Math.min(1,t*6);polygon(c,Math.cos(a)*r*.65,Math.sin(a)*r*.65,7+5*t,6);c.stroke();}}
 else if(s==='circuitbloom'){for(let i=0;i<(low?4:8);i++){c.save();c.rotate(i*tau/8);c.beginPath();c.moveTo(4,0);c.lineTo(r*.45,0);c.lineTo(r*.45,r*.25);c.lineTo(r,r*.25);c.stroke();circle(c,r,r*.25,2*f,true);c.restore();}}
 else if(s==='inksplash'){c.globalAlpha=f*.4;circle(c,0,0,r*.35,true);for(let i=0;i<n;i++){const a=i*tau/n+t*.2;circle(c,Math.cos(a)*r,Math.sin(a)*r,(3+i%4)*f,true);}}
 else if(s==='thunderseal'){circle(c,0,0,r);c.globalAlpha=f*.35;circle(c,0,0,12*f,true);c.globalAlpha=f;for(let i=0;i<6;i++){c.save();c.rotate(i*tau/6);c.beginPath();c.moveTo(3,0);c.lineTo(r*.6,5);c.lineTo(r*.45,-3);c.lineTo(r,0);c.stroke();c.restore();}}
 else if(s==='clockburst'){c.rotate(t*.8);circle(c,0,0,r*.65);for(let i=0;i<n;i++){c.save();c.rotate(i*tau/n);c.beginPath();c.moveTo(r*.45,-3);c.lineTo(r,-3);c.lineTo(r,3);c.lineTo(r*.8,3);c.stroke();c.restore();}}
 else if(s==='horizoncollapse'){const collapse=t<.3?1-t/.3:(t-.3)/.7;c.beginPath();c.ellipse(0,0,7+collapse*45,3+collapse*20,-.4,0,tau);c.stroke();c.globalAlpha=f*.65;circle(c,0,0,11*(1-t),true);if(t>.3)for(let i=0;i<n;i++){const a=i*tau/n;circle(c,Math.cos(a)*r,Math.sin(a)*r*.7,1.5*f,true);}}
 else if(s==='worldbloom'){for(let i=0;i<(low?6:10);i++){const a=i*tau/(low?6:10);c.beginPath();c.ellipse(Math.cos(a)*r*.55,Math.sin(a)*r*.55,r*.4,4+f*3,a,0,tau);c.stroke();if(t>.35)circle(c,Math.cos(a)*r,Math.sin(a)*r,2*f,true);}circle(c,0,0,5*f,true);}
 c.restore();return true;
}
