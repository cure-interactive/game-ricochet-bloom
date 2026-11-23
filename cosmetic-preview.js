import {bubbleInteractionMount} from './bubble-interaction.js?v=3479767760180a37f4151682533ae16ec5f0a6f22f41d7a4c788a576855eb899';
import {cosmeticBounds,cosmeticPaint} from './cosmetic-paint.js?v=e134db80a925d08cbddcd187c3980d3332c8e1e0b8b22ce988aa293cd01944d5';
import {CosmeticVisual} from './cosmetic-visual.js?v=dd6ac47f2c68b84f599d6f18bf320ced66ddd903826a7649f059fa5e4359be65';
import {bubbleCreate,bubbleHit,bubbleStep,bubbleOutline} from './bubble.js?v=596f6e9b83b23b8703b38f1cca7caed5fa89f73e8ec111bf6dbbe8b1c7761300';
import {bubbleRender} from './bubble-render.js?v=352a85f75d04cfd6df233c288dd962bc7b50d9634e6c22640ae8d09903a0276b';
import {frameGate} from './performance.js?v=98f53fc38e408a68f5e1beee87a7d0e0066fe8a1093aa41acc5b7134cdaac489';
import {qualityPixelRatio} from './quality.js?v=33c4a6dbcda13ded7499caa9a3563afa6903c4346850134bc5bd467cbac4ad4e';
import {visualActivityMount} from './visual-activity.js?v=6f020d19b42eb883c5a1bd52e3b1fd9c9ce47af8512d72b2945fee1753764cba';
// A deterministic still from the real renderer, with no per-card animation loop.
export function cosmeticThumbnail(canvas,item,{color='#f1f9d7',style=''}={}){
 const c=canvas.getContext('2d'),visual=new CosmeticVisual(),body={id:0,x:150,y:60,radius:12,vx:260,vy:0};
 canvas.width=360;canvas.height=180;c.setTransform(2,0,0,2,0,0);c.clearRect(0,0,180,90);
 visual.configure({[item.kind]:item.id});
 if(item.kind==='trail')for(let i=0;i<24;i++)visual.step({...body,x:24+i*5.3,y:48+Math.sin(i*.18)*13},.028);
 else {body.x=90;body.y=45;visual.hit(body.x,body.y);for(let i=0;i<5;i++)visual.step(null,.04,false);}
 if(item.kind==='trail'){body.x=visual.points.at(-1).x;body.y=visual.points.at(-1).y;}
 visual.render(c,false,true);
 bubbleRender(c,body,bubbleOutline(bubbleCreate(),body),color||'#f1f9d7',{skinStyle:style,skinTime:1,glowExtent:1.8});visual.accessories.step(body,0);visual.renderAccessories(c);
}
// Small previews stay silent and use the same visibility/quality lifecycle as
// the selected viewer. The caller owns destruction when replacing its cards.
export function cosmeticThumbnailMount(canvas,item,{color,style,compact=false,motionArea=1,surface,diameter,icon=false,loadout,trailEnabled}={}){
 const get=()=>typeof item==='function'?item():item,value=x=>typeof x==='function'?x():x;
 return cosmeticPreviewMount(canvas,{thumbnail:get().kind,compact,motionArea,surface,diameter,icon,loadout:()=>({...value(loadout),[get().kind]:get().id}),trailEnabled:()=>get().kind==='trail'||(trailEnabled!==undefined?!!value(trailEnabled):icon),color:()=>value(color),style:()=>value(style)});
}
// Full detail arenas collide at the physical bubble edge, not an inner margin.
export function cosmeticPreviewStep(body,dt,width,height,hit){
 body.x+=body.vx*dt;body.y+=body.vy*dt;
 for(const [axis,velocity,max] of [['x','vx',width],['y','vy',height]]){
  const low=Math.min(body.radius,max/2),high=Math.max(low,max-body.radius),position=body[axis];
  body[axis]=Math.max(low,Math.min(high,position));
  const side=position<=low&&body[velocity]<0?-1:position>=high&&body[velocity]>0?1:0;
  if(!side)continue;
  body[velocity]*=-1;
  hit(axis==='x'?(side<0?0:max):Math.max(0,Math.min(width,body.x)),axis==='y'?(side<0?0:max):Math.max(0,Math.min(height,body.y)),axis==='x'?side:0,axis==='y'?side:0);
 }
}
let previewSequence=0;
// Detached presentation: the same membrane, materials and effect renderer as play.
export function cosmeticPreviewMount(canvas,host){
 const c=canvas.getContext('2d'),visual=new CosmeticVisual(),membrane=bubbleCreate(),body={id:0,x:90,y:100,radius:host.icon?14:host.compact?26:17,vx:130,vy:85},ready=frameGate();
 const doc=canvas.ownerDocument,win=doc.defaultView;
 let frame=0,last=0,active=true,activity,nextRipple=0,origin=null,geometry=null,offset={x:0,y:0,vx:0,vy:0};
 const surface=host.surface||canvas,phase=++previewSequence*2.4;
 const interaction=bubbleInteractionMount(surface,{active:()=>active&&!doc.hidden&&activity?.isActive()!==false,geometry:()=>{if(!geometry)return null;const r=surface.getBoundingClientRect(),unit=(r.width||r.right-r.left)/geometry.width;return {x:r.left+body.x*unit,y:r.top+body.y*unit,unit:unit*body.radius/14,visible:!!activity.clip(r)};},hit:(x,y,speed)=>bubbleHit(membrane,body.radius,x,y,speed*body.radius/14)});
 function draw(now){
  frame=0;if(!active||doc.hidden||activity?.isActive()===false)return;
  frame=win.requestAnimationFrame(draw);if(!ready(now))return;
  const dt=last?Math.min(.05,(now-last)/1000):0;last=now;
  const ratio=qualityPixelRatio(doc.body.dataset.quality,win.devicePixelRatio||1),width=Math.max(1,(host.surface||canvas).clientWidth),height=Math.max(1,(host.surface||canvas).clientHeight);
  // Keep gallery artwork at its enlarged scale independently of stage height.
  // Trail stages can be shorter without shrinking their bubble or trail.
  const scale=host.icon?28/Math.max(1,host.diameter()):host.thumbnail&&!host.compact?180/192:Math.max((host.compact?160:180)/height,(host.compact?160:400)/width),worldHeight=height*scale,worldWidth=width*scale;
  visual.configure(host.loadout());
  // Trail history belongs to local simulation, never scrolling or layout offsets.
  if(origin&&(Math.abs(origin.scale-scale)>.001||origin.width!==width||origin.height!==height))visual.breakTrail();
  origin={scale,width,height};geometry={width:worldWidth,height:worldHeight};
  body.x-=offset.x;body.y-=offset.y;body.vx-=offset.vx;body.vy-=offset.vy;
  if(host.thumbnail){
   const t=visual.elapsed,padding=host.icon?body.radius:host.motionArea<1?body.radius+4:host.compact?54:host.thumbnail==='trail'?body.radius+(42-body.radius)/2:72,area=host.motionArea||1,rx=Math.max(0,worldWidth*area/2-padding)+(host.icon&&host.thumbnail==='trail'?4:0),ry=Math.max(host.icon&&host.thumbnail==='trail'?body.radius:0,worldHeight*area/2-padding);
   body.x=worldWidth/2+(host.thumbnail==='trail'?Math.sin(t*2)*rx:0);body.y=worldHeight/2+(host.thumbnail==='trail'?Math.sin(t*4)*ry:0);
   body.vx=Math.cos(t*2)*rx*2;body.vy=Math.cos(t*4)*ry*4;
   if(['bounce','pendant','companion'].includes(host.thumbnail)&&t>=nextRipple){
    // Match the regular player current: changing phase, direction and spacing.
    const angle=phase+t*1.7,nx=Math.cos(angle),ny=Math.sin(angle);
    visual.hit(body.x+nx*body.radius,body.y+ny*body.radius);bubbleHit(membrane,body.radius,nx,ny,150);
    nextRipple=t+1.35+.35*(1+Math.sin(angle));
   }
  }else{
   cosmeticPreviewStep(body,dt,worldWidth,worldHeight,(x,y,nx,ny)=>{
    visual.hit(x,y);bubbleHit(membrane,body.radius,nx,ny,210);
   });
  }
  const sensor=interaction.step(dt),motion=interaction.state,factor=body.radius/14;
  offset={x:motion.x*factor,y:motion.y*factor,vx:motion.vx*factor,vy:motion.vy*factor};body.x+=offset.x;body.y+=offset.y;body.vx+=offset.vx;body.vy+=offset.vy;
  const trails=host.trailEnabled?.()!==false;
  if(!trails&&visual.points.length)visual.breakTrail();
  bubbleStep(membrane,body,dt,false,{vx:sensor.x,vy:sensor.y});if(dt>0)visual.step(body,dt,trails);
  const outline=bubbleOutline(membrane,body),paint=context=>{
   visual.render(context,doc.body.dataset.quality==='low',true);
   bubbleRender(context,body,outline,host.color?.()||'#f1f9d7',{skinTime:visual.elapsed,skinStyle:host.style?.(),lowQuality:doc.body.dataset.quality==='low',glowExtent:host.icon?1.3:2});
   visual.renderAccessories(context,doc.body.dataset.quality==='low'||doc.body.classList?.contains('motion-reduced'));
  };
  if(host.surface){cosmeticPaint(canvas,host.surface,activity,cosmeticBounds(body,outline,visual,1/scale),1/scale,ratio,paint);return;}
  if(!activity.clip(canvas.getBoundingClientRect()))return;
  if(canvas.width!==Math.round(width*ratio)||canvas.height!==Math.round(height*ratio)){canvas.width=Math.round(width*ratio);canvas.height=Math.round(height*ratio);}
  c.setTransform(canvas.width/worldWidth,0,0,canvas.height/worldHeight,0,0);c.clearRect(0,0,worldWidth,worldHeight);paint(c);
 }
 function sync(){if(doc.hidden||activity?.isActive()===false)interaction.clear();win.cancelAnimationFrame(frame);frame=0;last=0;if(active&&!doc.hidden&&activity?.isActive()!==false)frame=win.requestAnimationFrame(draw);}
 activity=visualActivityMount(host.surface||canvas,sync,{intersection:false});sync();
 return {destroy(){active=false;interaction.destroy();activity.destroy();win.cancelAnimationFrame(frame);}};
}
