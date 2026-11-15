import {CosmeticVisual} from './cosmetic-visual.js?v=1f640ece765639eb262e5d176ef2852715c65b89f2f09139a1b0716a366b6906';
import {bubbleCreate,bubbleHit,bubbleStep,bubbleOutline} from './bubble.js?v=385baeaa905192ab9831eba4809c9c2370062e45dd55402b892d2ea214a30bac';
import {bubbleRender} from './bubble-render.js?v=c737019c0f2253fce960b1d1c5e7e2887dc8f4353a005295a2f0e21a14ff3e6a';
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
// Small previews stay silent and use the same visibility/quality lifecycle as
// the selected viewer. The caller owns destruction when replacing its cards.
export function cosmeticThumbnailMount(canvas,item,{color,style}={}){
 const get=()=>typeof item==='function'?item():item,value=x=>typeof x==='function'?x():x;
 return cosmeticPreviewMount(canvas,{thumbnail:get().kind,loadout:()=>({[get().kind]:get().id}),color:()=>value(color),style:()=>value(style)});
}
// Detached presentation: the same membrane, materials and effect renderer as play.
export function cosmeticPreviewMount(canvas,host){
 const c=canvas.getContext('2d'),visual=new CosmeticVisual(),membrane=bubbleCreate(),body={id:0,x:90,y:100,radius:17,vx:130,vy:85},ready=frameGate();
 const doc=canvas.ownerDocument,win=doc.defaultView;
 let frame=0,last=0,active=true,activity,pulse=-1;
 function draw(now){
  frame=0;if(!active||doc.hidden||activity?.isActive()===false)return;
  frame=win.requestAnimationFrame(draw);if(!ready(now))return;
  const dt=last?Math.min(.05,(now-last)/1000):0;last=now;
  const ratio=qualityPixelRatio(doc.body.dataset.quality,win.devicePixelRatio||1),width=Math.max(1,canvas.clientWidth),height=Math.max(1,canvas.clientHeight),scale=Math.max(180/height,(host.thumbnail?280:400)/width),worldHeight=height*scale,worldWidth=width*scale;
  visual.configure(host.loadout());
  if(host.thumbnail){
   const t=visual.elapsed,rx=Math.max(0,worldWidth/2-72),ry=Math.max(0,worldHeight/2-72);
   body.x=worldWidth/2+(host.thumbnail==='trail'?Math.sin(t*2)*rx:0);body.y=worldHeight/2+(host.thumbnail==='trail'?Math.sin(t*4)*ry:0);
   body.vx=Math.cos(t*2)*rx*2;body.vy=Math.cos(t*4)*ry*4;
   if(host.thumbnail==='bounce'&&Math.floor(t/.9)!==pulse){pulse=Math.floor(t/.9);visual.hit(body.x,body.y);bubbleHit(membrane,body.radius,1,0,150);}
  }else{
   body.x+=body.vx*dt;body.y+=body.vy*dt;
   for(const [axis,velocity,max] of [['x','vx',worldWidth],['y','vy',worldHeight]])if(body[axis]<72||body[axis]>max-72){body[axis]=Math.max(72,Math.min(max-72,body[axis]));body[velocity]*=-1;visual.hit(body.x,body.y);bubbleHit(membrane,body.radius,axis==='x'?-Math.sign(body.vx):0,axis==='y'?-Math.sign(body.vy):0,210);}
  }
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
