const tau=Math.PI*2;
const circle=(c,x,y,r)=>{c.beginPath();c.arc(x,y,r,0,tau);c.fill();};
const ellipse=(c,x,y,rx,ry,a=0)=>{c.beginPath();c.ellipse(x,y,rx,ry,a,0,tau);c.fill();};
const panel=(c,x,y,w,h,r=2)=>{c.beginPath();c.roundRect(x,y,w,h,r);c.fill();c.stroke();};

// Species artwork in a shared local coordinate system. Motion, scale, rarity
// effects and lifecycle belong to AccessoryVisual; every surface uses this art.
export function companionArt(c,companion,{t,gentle,happy,look}){
 const flutter=gentle?.6:.55+.35*Math.sin(t*9);
   if(companion.style==='snail'){
    c.fillStyle='#f5dfc1';ellipse(c,6,1,8,7);c.strokeStyle='#b79aaf';c.beginPath();c.arc(6,1,4,0,Math.PI*1.8);c.arc(6,1,1.7,Math.PI*1.8,Math.PI*3.4,true);c.stroke();c.fillStyle=companion.color;ellipse(c,1,6,11,2.5);
    c.strokeStyle=companion.color;c.lineWidth=2;for(const x of [-4,3]){c.beginPath();c.moveTo(x,-3);c.lineTo(x*1.5,-10-happy);c.stroke();circle(c,x*1.5,-10-happy,2);}
   }
   if(companion.style==='crane'){
    for(const side of [-1,1]){c.beginPath();c.moveTo(side*2,4);c.lineTo(side*15,-9-flutter*4);c.lineTo(side*10,4);c.closePath();c.fill();c.stroke();c.beginPath();c.moveTo(side*3,3);c.lineTo(side*12,-6);c.stroke();}
    c.fillStyle='#c28272';c.beginPath();c.moveTo(5,-3);c.lineTo(12,-1);c.lineTo(5,1);c.fill();c.fillStyle=companion.color;
   }
   if(companion.style==='axolotl'){
    c.strokeStyle='#d78ac6';c.lineWidth=2;for(const side of [-1,1])for(let j=-1;j<=1;j++){c.beginPath();c.moveTo(side*5,j*2);c.lineTo(side*11,j*6+flutter);c.stroke();c.fillStyle='#ffcde9';ellipse(c,side*11,j*6+flutter,2,3,side*.5);}
    c.fillStyle=companion.color;ellipse(c,9,5,7,3,-.4);ellipse(c,-5,7,2,3,-.6);ellipse(c,4,7,2,3,.6);
   }
   if(companion.style==='lion'){
    c.fillStyle='#b68bd7';for(let i=0;i<10;i++){const a=i*tau/10;ellipse(c,Math.cos(a)*7,Math.sin(a)*7,3,4,a);}
    c.fillStyle=companion.color;circle(c,-5,-6,3);circle(c,5,-6,3);
   }
   if(companion.style==='firefly'||companion.style==='moth'){
    c.globalAlpha=.75;c.fillStyle=companion.style==='moth'?'#9cdfff':'#d6f6ef';
    ellipse(c,-6,-2,companion.style==='moth'?7:5,3+flutter*3,-.5);ellipse(c,6,-2,companion.style==='moth'?7:5,3+flutter*3,.5);
    c.globalAlpha=1;c.fillStyle=companion.color;
   }
   if(companion.style==='jelly'){
    c.strokeStyle='#a59be1';for(let k=-1;k<=1;k++){c.beginPath();c.moveTo(k*4,3);c.quadraticCurveTo(k*5+(gentle?0:Math.sin(t*3+k)*3),12,k*4+2,14);c.stroke();}
   }
   if(companion.style==='dragon'){
    c.strokeStyle=companion.color;c.lineWidth=3;c.beginPath();c.moveTo(4,4);c.bezierCurveTo(18,14,20,-4,12,1);c.stroke();c.fillStyle='#bfa9ed';ellipse(c,-7,0,5,7,-.7);ellipse(c,7,0,5,7,.7);c.fillStyle=companion.color;
   }
   if(companion.style==='puff'){ellipse(c,-5,0,5,5);ellipse(c,4,-3,5,5);ellipse(c,6,2,4,4);}
   if(companion.style==='fox'){c.beginPath();c.moveTo(-6,-3);c.lineTo(-7,-12);c.lineTo(-1,-6);c.lineTo(4,-11);c.lineTo(7,-3);c.fill();c.stroke();ellipse(c,10,5,8,4,-.5);c.fillStyle='#fff2df';ellipse(c,14,3,3.5,3,-.5);c.fillStyle=companion.color;}
   if(companion.style==='bird'){ellipse(c,-7,1,6,3+flutter*2,-.5);ellipse(c,7,1,6,3+flutter*2,.5);c.fillStyle='#ffad76';ellipse(c,0,-7,2,5,-.3);c.fillStyle=companion.color;}
   if(companion.style==='whale'){ellipse(c,3,1,10,6);ellipse(c,13,-1,4,2,-.7);ellipse(c,14,3,4,2,.7);ellipse(c,-3,6,4,2,.6);}
   if(companion.style==='bunny'){
    ellipse(c,-4,-10,3,8,-.18);ellipse(c,4,-9,3,7,.35);c.fillStyle='#f3aeb5';ellipse(c,-4,-11,1.2,4.5,-.18);ellipse(c,4,-10,1.2,4,.35);
    c.fillStyle=companion.color;ellipse(c,-5,6,3,2);ellipse(c,5,6,3,2);
   }
   if(companion.style==='crab'){
    c.fillStyle='#eec69b';ellipse(c,5,0,8,7,.2);c.strokeStyle='#ac7965';c.lineWidth=1.2;c.beginPath();c.arc(5,0,4,0,Math.PI*1.8);c.arc(5,0,1.8,Math.PI*1.8,Math.PI*3.4,true);c.stroke();
    c.strokeStyle=companion.color;c.lineWidth=2;
    for(const side of [-1,1]){c.beginPath();c.moveTo(side*4,4);c.lineTo(side*9,8);c.moveTo(side*5,1);c.lineTo(side*11,-2-happy);c.stroke();c.fillStyle=companion.color;ellipse(c,side*12,-3-happy,3,4,side*.4);c.strokeStyle='#263c4e';c.beginPath();c.moveTo(side*12,-6-happy);c.lineTo(side*12,-3-happy);c.stroke();c.strokeStyle=companion.color;}
    c.fillStyle=companion.color;c.strokeStyle='#263c4e';c.lineWidth=1.3;
   }
   if(companion.style==='owl'){
    for(const side of [-1,1]){c.save();c.translate(side*6,0);c.rotate(side*(.2+flutter*.25+happy*.08));ellipse(c,side*3,2,4,7,side*.2);c.strokeStyle='#866247';c.beginPath();c.moveTo(side*2,-1);c.lineTo(side*4,5);c.stroke();c.restore();}
    c.beginPath();c.moveTo(-6,-3);c.lineTo(-7,-10);c.lineTo(-1,-6);c.lineTo(7,-10);c.lineTo(6,-2);c.fill();c.stroke();
   }
   if(companion.style==='robot'){
    c.strokeStyle='#7795ad';c.lineWidth=1.5;
    for(const side of [-1,1]){c.beginPath();c.moveTo(side*4,-5);c.lineTo(side*6,-11);c.moveTo(side*6,2);c.lineTo(side*10,4-happy*3);c.stroke();c.fillStyle='#91fff0';circle(c,side*6,-11,1.5);c.fillStyle=companion.color;panel(c,side*10-1.5,2-happy*3,3,4,1);}
    c.fillStyle='#466a85';panel(c,-4,5,8,3,1);c.fillStyle='#91fff0';ellipse(c,0,9,2.5,gentle?2:2+Math.sin(t*7)*.7);
    c.strokeStyle='#263c4e';c.fillStyle=companion.color;
   }
   // A dark outline separates the small companion from bubbles and power cues.
   if(companion.style==='robot'){panel(c,-7,-6,14,12,2.5);c.fillStyle='#173344';panel(c,-5.5,-3.5,11,6,1.5);c.fillStyle='#91fff0';for(let i=0;i<3;i++){c.globalAlpha=gentle?.8:.45+.45*Math.sin(t*3+i);circle(c,-2+i*2,4.3,.55);}c.globalAlpha=1;}
   else if(companion.style==='ghost'){c.beginPath();c.moveTo(-7,2);c.bezierCurveTo(-10,-10,10,-10,7,2);c.lineTo(9,9);c.lineTo(4,7);c.lineTo(0,10);c.lineTo(-4,7);c.lineTo(-9,9);c.closePath();c.fill();c.stroke();c.fillStyle='#f9cb7f';panel(c,6,4,5,7,1);c.fillStyle='#fff3b8';ellipse(c,8.5,7.5,1.3,2);}
   else {c.beginPath();c.ellipse(0,0,companion.style==='jelly'?8:6.5,companion.style==='firefly'?8:6.5,0,0,tau);c.fill();c.stroke();}
   if(companion.style==='owl'){c.fillStyle='#f7df9b';circle(c,-2.7,-.5,2.6);circle(c,2.7,-.5,2.6);c.strokeStyle='#866247';c.lineWidth=.7;c.beginPath();c.arc(0,4.3,1.4,0,tau);c.moveTo(0,4.3);c.lineTo(Math.sin(t)*1.2,4.3-Math.cos(t)*1.2);c.stroke();}

   if(companion.style==='sprout'){c.strokeStyle='#7dc79d';c.beginPath();c.moveTo(0,-5);c.lineTo(0,-10-happy);c.stroke();c.fillStyle='#d6f6aa';ellipse(c,-3,-10-happy,4.5,2.4,.4);ellipse(c,3,-11-happy,4.5,2.4,-.5);}
   if(companion.style==='mushroom'){
    c.fillStyle='#ab6d79';c.beginPath();c.moveTo(-11,-3);c.bezierCurveTo(-10,-17,10,-17,11,-3);c.quadraticCurveTo(0,0,-11,-3);c.fill();c.stroke();c.fillStyle='#ffe6cc';for(const [x,y,r] of [[-5,-7,2],[2,-10,2.5],[7,-5,1.5]])circle(c,x,y,r);c.fillStyle='#8fbfa4';ellipse(c,-4,6,3,2);ellipse(c,4,6,3,2);
   }
   if(companion.style==='lion'){c.fillStyle='#fff0cf';ellipse(c,0,3,4,2.5);}
   if(companion.style==='dragon'){c.fillStyle='#fff0cf';ellipse(c,-4,-6,1.8,3,-.4);ellipse(c,4,-6,1.8,3,.4);}
   if(companion.style==='ladybug'){c.strokeStyle='#34414e';c.beginPath();c.moveTo(0,-5);c.lineTo(0,6);c.moveTo(-3,-5);c.lineTo(-5,-10);c.moveTo(3,-5);c.lineTo(5,-10);c.stroke();c.fillStyle='#574b68';for(const x of [-4,4])for(const y of [-3,3])circle(c,x,y,1.3);}
   if(['fox','whale'].includes(companion.style)){c.fillStyle='#f2fff5';ellipse(c,0,3,4.5,2.5);}
   if(companion.style==='bird'){c.fillStyle='#e8a25f';c.beginPath();c.moveTo(6,0);c.lineTo(10,2);c.lineTo(6,3);c.fill();}
   c.fillStyle=companion.style==='robot'?'#91fff0':'#142535';const blink=!gentle&&Math.sin(t*1.1)>.995;
   for(const x of [-2.7,2.7])ellipse(c,x+look,-.5,1,blink?.35:1.5);
   c.strokeStyle=companion.style==='robot'?'#91fff0':'#233346';c.lineWidth=.8;c.beginPath();c.moveTo(-1.5,2.2);c.quadraticCurveTo(0,3.4+happy,1.5,2.2);c.stroke();
   c.fillStyle='#fff';c.globalAlpha=.5;ellipse(c,-2,-3.5,1.8,.8);
   if(companion.style==='bunny'){c.globalAlpha=1;c.fillStyle='#77677c';circle(c,-2.7+look,-.5,1.8);c.strokeStyle='#ffe8d6';c.lineWidth=.55;c.beginPath();c.moveTo(-3.5+look,-1.3);c.lineTo(-1.9+look,.3);c.moveTo(-3.5+look,.3);c.lineTo(-1.9+look,-1.3);c.stroke();c.strokeStyle='#a0857d';c.beginPath();c.moveTo(2,4);c.lineTo(5,5);c.moveTo(3,3.5);c.lineTo(3,5.5);c.stroke();}
}
