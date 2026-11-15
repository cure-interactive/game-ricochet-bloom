import {CosmeticVisual} from './cosmetic-visual.js?v=35ae279ae6932928562e960c4333af77f4f1afda10bf8702ea90f75ac7acae2c';
import {bubbleCreate,bubbleHit,bubbleStep,bubbleOutline} from './bubble.js?v=385baeaa905192ab9831eba4809c9c2370062e45dd55402b892d2ea214a30bac';
import {bubbleRender} from './bubble-render.js?v=17568e8082c50add06a13b44e7a1f3b5d3a282771e4f420fb68c8fb14028695d';
import {frameGate} from './performance.js?v=98f53fc38e408a68f5e1beee87a7d0e0066fe8a1093aa41acc5b7134cdaac489';
import {qualityPixelRatio} from './quality.js?v=33c4a6dbcda13ded7499caa9a3563afa6903c4346850134bc5bd467cbac4ad4e';
import {visualActivityMount} from './visual-activity.js?v=ca1926027ea9e579abb4052b949a9fce925b332e26c2fba1d6009efe4436bf1f';
// A deterministic still from the real renderer, with no per-card animation loop.
export function cosmeticThumbnail(canvas,item,{color='#f1f9d7',style=''}={}){
 const c=canvas.getContext('2d'),visual=new CosmeticVisual(),body={id:0,x:150,y:60,radius:12,vx:260,vy:0};
 canvas.width=360;canvas.height=180;c.setTransform(2,0,0,2,0,0);c.clearRect(0,0,180,90);
 visual.configure({[item.kind]:item.id});
 if(item.kind==='trail')for(let i=0;i<24;i++)visual.step({...body,x:24+i*5.3,y:48+Math.sin(i*.18)*13},.028);
 else {body.x=90;body.y=45;visual.hit(body.x,body.y);for(let i=0;i<5;i++)visual.step(null,.04,false);}
 if(item.kind==='trail'){body.x=visual.points.at(-1).x;body.y=visual.points.at(-1).y;}
 visual.render(c,false,true);
 bubbleRender(c,body,bubbleOutline(bubbleCreate(),body),color||'#f1f9d7',{skinStyle:style,skinTime:1,glowExtent:1.8});
}
// Detached presentation: the same membrane, materials and effect renderer as play.
export function cosmeticPreviewMount(canvas,host){
 const c=canvas.getContext('2d'),visual=new CosmeticVisual(),membrane=bubbleCreate(),body={id:0,x:90,y:100,radius:17,vx:130,vy:85},ready=frameGate();
 const doc=canvas.ownerDocument,win=doc.defaultView;
 let frame=0,last=0,active=true,activity;
 function draw(now){
  frame=0;if(!active||doc.hidden||activity?.isActive()===false)return;
  frame=win.requestAnimationFrame(draw);if(!ready(now))return;
  const dt=last?Math.min(.05,(now-last)/1000):0;last=now;
  const ratio=qualityPixelRatio(doc.body.dataset.quality,win.devicePixelRatio||1),width=Math.max(1,canvas.clientWidth),height=Math.max(1,canvas.clientHeight),worldHeight=Math.max(80,400*height/width),worldWidth=worldHeight*width/height;
  visual.configure(host.loadout());body.x+=body.vx*dt;body.y+=body.vy*dt;
  for(const [axis,velocity,max] of [['x','vx',worldWidth],['y','vy',worldHeight]])if(body[axis]<36||body[axis]>max-36){body[axis]=Math.max(36,Math.min(max-36,body[axis]));body[velocity]*=-1;visual.hit(body.x,body.y);bubbleHit(membrane,body.radius,axis==='x'?-Math.sign(body.vx):0,axis==='y'?-Math.sign(body.vy):0,210);}
  bubbleStep(membrane,body,dt);visual.step(body,dt,true);
  if(canvas.width!==Math.round(width*ratio)||canvas.height!==Math.round(height*ratio)){canvas.width=Math.round(width*ratio);canvas.height=Math.round(height*ratio);}
  c.setTransform(canvas.width/worldWidth,0,0,canvas.height/worldHeight,0,0);c.clearRect(0,0,worldWidth,worldHeight);
  visual.render(c,doc.body.dataset.quality==='low',true);
  bubbleRender(c,body,bubbleOutline(membrane,body),host.color?.()||'#f1f9d7',{skinTime:visual.elapsed,skinStyle:host.style?.(),lowQuality:doc.body.dataset.quality==='low',glowExtent:2});
 }
 function sync(){win.cancelAnimationFrame(frame);frame=0;last=0;if(active&&!doc.hidden&&activity?.isActive()!==false)frame=win.requestAnimationFrame(draw);}
 activity=visualActivityMount(canvas,sync);sync();
 return {destroy(){active=false;activity.destroy();win.cancelAnimationFrame(frame);}};
}
