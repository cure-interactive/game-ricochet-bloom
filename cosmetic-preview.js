import {CosmeticVisual} from './cosmetic-visual.js?v=971f8b3ef6ea7b181b3c91ef6411b9b21c431dd9f29b88db57a10fb1d2a63319';
import {bubbleCreate,bubbleHit,bubbleStep,bubbleOutline} from './bubble.js?v=385baeaa905192ab9831eba4809c9c2370062e45dd55402b892d2ea214a30bac';
import {bubbleRender} from './bubble-render.js?v=a5ba51fcc93401722fd8cb22fc06d3b5d79138cf35829de911ecfdf3fb48aafd';
import {frameGate} from './performance.js?v=96d3b24da7cb64e9aca058671790f2492e43852e6c0669ccd169e7399c39a51b';
import {qualityPixelRatio} from './quality.js?v=33c4a6dbcda13ded7499caa9a3563afa6903c4346850134bc5bd467cbac4ad4e';
// Detached presentation: the same membrane, materials and effect renderer as play.
export function cosmeticPreviewMount(canvas,host){
 const c=canvas.getContext('2d'),visual=new CosmeticVisual(),membrane=bubbleCreate(),body={id:0,x:90,y:100,radius:17,vx:130,vy:85},ready=frameGate();
 let frame=0,last=0,active=true;
 function draw(now){
  frame=0;if(!active||document.hidden)return;
  frame=requestAnimationFrame(draw);if(!ready(now))return;
  const dt=last?Math.min(.05,(now-last)/1000):0;last=now;
  visual.configure(host.loadout());body.x+=body.vx*dt;body.y+=body.vy*dt;
  for(const [axis,velocity,max] of [['x','vx',400],['y','vy',220]])if(body[axis]<36||body[axis]>max-36){body[axis]=Math.max(36,Math.min(max-36,body[axis]));body[velocity]*=-1;visual.hit(body.x,body.y);bubbleHit(membrane,body.radius,axis==='x'?-Math.sign(body.vx):0,axis==='y'?-Math.sign(body.vy):0,210);}
  bubbleStep(membrane,body,dt);visual.step(body,dt,true);
  const ratio=qualityPixelRatio(document.body.dataset.quality,devicePixelRatio||1),width=Math.max(1,canvas.clientWidth),height=width*220/400;
  if(canvas.width!==Math.round(width*ratio)||canvas.height!==Math.round(height*ratio)){canvas.width=Math.round(width*ratio);canvas.height=Math.round(height*ratio);}
  c.setTransform(canvas.width/400,0,0,canvas.height/220,0,0);c.clearRect(0,0,400,220);
  visual.render(c,document.body.dataset.quality==='low',true);
  bubbleRender(c,body,bubbleOutline(membrane,body),host.color?.()||'#f1f9d7',{skinStyle:host.style?.(),lowQuality:document.body.dataset.quality==='low',glowExtent:2});
 }
 function sync(){cancelAnimationFrame(frame);frame=0;last=0;if(active&&!document.hidden)frame=requestAnimationFrame(draw);}
 document.addEventListener('visibilitychange',sync);sync();
 return {destroy(){active=false;cancelAnimationFrame(frame);document.removeEventListener('visibilitychange',sync);}};
}
