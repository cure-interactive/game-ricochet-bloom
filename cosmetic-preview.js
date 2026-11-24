import {bubbleCurrent} from './bubble-current.js?v=76ca86b0c821ae31d911e894866bcca026dd0efaa73164053f72f1d70d8207cd';
import {cosmeticTrailShowcase,cosmeticTrailOrbit,cosmeticCardLoadout,cosmeticShowcaseFrame,cosmeticSoloKind,cosmeticPreviewLoadout} from './cosmetic-presentation.js?v=b32f319d53941d567a86e5aa404aec8f9c0cd3fd7f4b3e5cb7b91567b7b0c228';
import {bubbleInteractionMount} from './bubble-interaction.js?v=f93c99730054bbc2f5c3715863fc2759d8a6eb662a5b0fb784ff95cda0725591';
import {cosmeticBounds,cosmeticPaint} from './cosmetic-paint.js?v=e5d682d54726c402cbba21b5c0dd0415557d7ed9f44a5f144c7dba8c36cb5a58';
import {CosmeticVisual} from './cosmetic-visual.js?v=a60ccf395c9317a69cc85338b327ecc5b54b53ae103faf946368acc632c30cc5';
import {bubbleCreate,bubbleHit,bubbleStep,bubbleOutline} from './bubble.js?v=596f6e9b83b23b8703b38f1cca7caed5fa89f73e8ec111bf6dbbe8b1c7761300';
import {bubbleRender} from './bubble-render.js?v=9b2f2b87f161370be645295a8959febcc9a37c1e4aa39bed2a0fb875973c3b4f';
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
 return cosmeticPreviewMount(canvas,{thumbnail:get().kind,compact,motionArea,surface,diameter,icon,loadout:()=>cosmeticCardLoadout(get(),value(loadout)),trailEnabled:()=>get().kind==='trail'||(trailEnabled!==undefined?!!value(trailEnabled):true),color:()=>value(color),style:()=>value(style)});
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
 let frame=0,last=0,active=true,activity,nextRipple=0,origin=null,geometry=null,celebration=null,view=host.view||'motion',camera={x:0,y:0,zoom:1},offset={x:0,y:0,vx:0,vy:0};
 const surface=host.surface||canvas,phase=++previewSequence*2.4;
 const solo=()=>host.thumbnail?null:cosmeticSoloKind(view,host.kind?.());
 const touchAction=surface.style.touchAction;
 const syncInput=()=>{surface.style.touchAction=solo()==='pendant'?'none':touchAction;};syncInput();
 const interaction=bubbleInteractionMount(surface,{drag:()=>solo()==='pendant',bodyPressure:()=>solo()!=='pendant',dragPosition:()=>{const p=visual.accessories.charm||body,f=body.radius/14;return {x:(p.x-body.x)/f,y:(p.y-body.y)/f};},contact:(...args)=>visual.accessories.contact(...args),active:()=>active&&!doc.hidden&&activity?.isActive()!==false,geometry:()=>{if(!geometry)return null;const p=solo()==='pendant'?(visual.accessories.charm||body):body,r=surface.getBoundingClientRect(),unit=(r.width||r.right-r.left)/geometry.width;return {x:r.left+(p.x*camera.zoom+camera.x)*unit,y:r.top+(p.y*camera.zoom+camera.y)*unit,unit:unit*camera.zoom*body.radius/14,visible:!!activity.clip(r)};},hit:(x,y,speed)=>{if(solo()!=='pendant')bubbleHit(membrane,body.radius,x,y,speed*body.radius/14);}});
 function key(event){
  if(host.thumbnail)return;const direction={ArrowLeft:[-1,0],ArrowRight:[1,0],ArrowUp:[0,-1],ArrowDown:[0,1],Enter:[0,-1],' ':[0,-1]}[event.key];if(!direction)return;
  event.preventDefault();if(solo()==='pendant'&&visual.accessories.charm){visual.accessories.nudgePendant(direction[0]*60,direction[1]*60);return;}interaction.state.vx+=direction[0]*60;interaction.state.vy+=direction[1]*60;if(solo()!=='pendant')bubbleHit(membrane,body.radius,-direction[0],-direction[1],140);
 }
 surface.addEventListener('keydown',key);
 function draw(now){
  frame=0;if(!active||doc.hidden||activity?.isActive()===false)return;
  frame=win.requestAnimationFrame(draw);if(!ready(now))return;
  const dt=last?Math.min(.05,(now-last)/1000):0;last=now;
  const ratio=qualityPixelRatio(doc.body.dataset.quality,win.devicePixelRatio||1),width=Math.max(1,(host.surface||canvas).clientWidth),height=Math.max(1,(host.surface||canvas).clientHeight);
  // Keep gallery artwork at its enlarged scale independently of stage height.
  // Trail stages can be shorter without shrinking their bubble or trail.
  const scale=host.icon?28/Math.max(1,host.diameter()):host.thumbnail&&!host.compact?180/192:Math.max((host.compact?160:180)/height,(host.compact?160:400)/width),worldHeight=height*scale,worldWidth=width*scale;
  const isolated=solo(),showcaseKind=!host.thumbnail&&view==='showcase'?host.kind?.():null;visual.configure(cosmeticPreviewLoadout(host.loadout(),isolated,showcaseKind));
  // Trail history belongs to local simulation, never scrolling or layout offsets.
  if(origin&&(Math.abs(origin.scale-scale)>.001||origin.width!==width||origin.height!==height))visual.breakTrail();
  origin={scale,width,height};geometry={width:worldWidth,height:worldHeight};
  body.x-=offset.x;body.y-=offset.y;body.vx-=offset.vx;body.vy-=offset.vy;
   if(celebration){
    const state=celebration;state.age+=dt;let speed=0;
    const ease=t=>{t=Math.max(0,Math.min(1,t));return t*t*(3-2*t);};
    if(state.phase==='brake'){
     speed=1-ease(state.age/.35);
     if(state.age>=.35){state.phase='hold';state.age=0;visual.accessories.react(true);state.start?.();state.soundDuration=state.soundStatus?.()?.duration||0;}
    }else if(state.phase==='hold'){
     if(state.age>=1.5&&state.soundDone?.()!==false){state.phase='resume';state.age=0;}
    }else{
     speed=ease(state.age/.45);
     if(state.age>=.45){celebration=null;state.finish?.();}
    }
    body.vx=state.vx*speed;body.vy=state.vy*speed;
   }
  if(host.thumbnail||view==='showcase'){
   const subject=host.thumbnail||host.kind?.();
   const t=visual.elapsed,padding=host.icon?body.radius:host.motionArea<1?body.radius+4:host.compact?54:subject==='trail'?body.radius+(42-body.radius)/2:72,area=host.motionArea||1,rx=Math.max(0,worldWidth*area/2-padding)+(host.icon&&subject==='trail'?4:0),ry=Math.max(host.icon&&subject==='trail'?body.radius:0,worldHeight*area/2-padding);
   const orbit=showcaseKind==='trail'?cosmeticTrailShowcase(body.radius,worldWidth,worldHeight):subject==='trail'&&host.icon?cosmeticTrailOrbit(body.radius,worldWidth,worldHeight):{rx,ry};
   body.x=worldWidth/2+(subject==='trail'?Math.sin(t*2)*orbit.rx:0);body.y=worldHeight/2+(subject==='trail'?Math.sin(t*4)*orbit.ry:0);
   body.vx=subject==='trail'?Math.cos(t*2)*orbit.rx*2:0;body.vy=subject==='trail'?Math.cos(t*4)*orbit.ry*4:0;
   if((['bounce','pendant','companion'].includes(subject)||showcaseKind==='skin')&&t>=nextRipple&&!celebration){
    // Match the regular player current: changing phase, direction and spacing.
    const current=bubbleCurrent(phase,t),nx=current.x,ny=current.y;
    if(showcaseKind!=='skin')visual.hit(body.x+nx*body.radius,body.y+ny*body.radius);if(isolated!=='pendant')bubbleHit(membrane,body.radius,nx,ny,showcaseKind==='skin'?60*body.radius/14:150);
    nextRipple=current.next;
   }
  }else{
   cosmeticPreviewStep(body,dt,worldWidth,worldHeight,(x,y,nx,ny)=>{
    visual.hit(x,y);bubbleHit(membrane,body.radius,nx,ny,210);
   });
   if(celebration){if(body.vx)celebration.vx=Math.sign(body.vx)*Math.abs(celebration.vx);if(body.vy)celebration.vy=Math.sign(body.vy)*Math.abs(celebration.vy);}
  }
  const sensor=interaction.step(dt),motion=interaction.state,factor=body.radius/14;
  offset=isolated==='pendant'?{x:0,y:0,vx:0,vy:0}:{x:motion.x*factor,y:motion.y*factor,vx:motion.vx*factor,vy:motion.vy*factor};body.x+=offset.x;body.y+=offset.y;body.vx+=offset.vx;body.vy+=offset.vy;
  const trails=!isolated&&host.trailEnabled?.()!==false;
  if(!trails&&visual.points.length)visual.breakTrail();
  // Pendant Showcase uses two moving bodies. This body supplies the stage
  // center and scale only; input reaches the actual charm and loose endpoint.
  const current=showcaseKind==='skin'?bubbleCurrent(phase,visual.elapsed):{vx:0,vy:0};
  if(isolated!=='pendant')bubbleStep(membrane,body,dt,false,{vx:sensor.x+current.vx*factor,vy:sensor.y+current.vy*factor});
  const environment={grab:isolated==='pendant'&&interaction.dragging?{x:body.x+motion.x*factor,y:body.y+motion.y*factor}:null,impulse:sensor.impulse,acceleration:sensor.acceleration,anchor:isolated==='pendant'?'point':'shell',shell:isolated==='pendant'?null:bubbleOutline(membrane,body)};
  if(dt>0)visual.step(body,dt,trails,environment);else if(!visual.accessories.body)visual.accessories.step(body,0,environment);
  const nextCamera=view==='showcase'&&!host.thumbnail?cosmeticShowcaseFrame(body,visual.accessories,host.kind?.(),worldWidth,worldHeight):{x:0,y:0,zoom:1};
  if(!interaction.dragging){const blend=isolated&&dt>0?1-Math.exp(-dt*6):1;for(const key of ['x','y','zoom'])camera[key]+=(nextCamera[key]-camera[key])*blend;}
  const outline=bubbleOutline(membrane,body),paint=context=>{
   context.save();context.translate(camera.x,camera.y);context.scale(camera.zoom,camera.zoom);
   if(!isolated)visual.render(context,doc.body.dataset.quality==='low',true);
   if(!isolated)bubbleRender(context,body,outline,host.color?.()||'#f1f9d7',{skinTime:visual.elapsed,skinStyle:host.style?.(),lowQuality:doc.body.dataset.quality==='low',glowExtent:host.icon?1.3:2});
   visual.renderAccessories(context,doc.body.dataset.quality==='low'||doc.body.classList?.contains('motion-reduced'));context.restore();
  };
  if(host.surface){cosmeticPaint(canvas,host.surface,activity,(()=>{const b=cosmeticBounds(body,outline,visual,1/scale);return {left:b.left*camera.zoom+camera.x,right:b.right*camera.zoom+camera.x,top:b.top*camera.zoom+camera.y,bottom:b.bottom*camera.zoom+camera.y};})(),1/scale,ratio,paint);return;}
  if(!activity.clip(canvas.getBoundingClientRect()))return;
  if(canvas.width!==Math.round(width*ratio)||canvas.height!==Math.round(height*ratio)){canvas.width=Math.round(width*ratio);canvas.height=Math.round(height*ratio);}
  c.setTransform(canvas.width/worldWidth,0,0,canvas.height/worldHeight,0,0);c.clearRect(0,0,worldWidth,worldHeight);paint(c);
 }
 function sync(){if(doc.hidden||activity?.isActive()===false)interaction.clear();win.cancelAnimationFrame(frame);frame=0;last=0;if(active&&!doc.hidden&&activity?.isActive()!==false)frame=win.requestAnimationFrame(draw);}
 activity=visualActivityMount(host.surface||canvas,sync,{intersection:false});sync();
 function celebrationStatus(){
  if(!celebration)return {active:false,progress:0};
  const state=celebration,clamp=value=>Math.max(0,Math.min(1,value));
  // Keep phase boundaries stable when the voice duration becomes known at rest.
  const progress=state.phase==='brake'?.15*clamp(state.age/.35):state.phase==='hold'?.15+.65*clamp(state.age/Math.max(1.5,state.soundDuration||0)):.8+.2*clamp(state.age/.45);
  return {active:true,progress};
 }
 function cancelCelebration(){if(!celebration)return;const state=celebration;celebration=null;body.vx=state.vx+offset.vx;body.vy=state.vy+offset.vy;visual.accessories.celebration=0;state.finish?.();}
 return {viewSet(next){if(next===view)return;cancelCelebration();view=next;syncInput();visual.breakTrail();visual.accessories.resetMotion();interaction.reset();offset={x:0,y:0,vx:0,vy:0};body.vx=130;body.vy=85;if(geometry){body.x=geometry.width/2;body.y=geometry.height/2;}camera={x:0,y:0,zoom:1};},celebrate(callbacks={}){if(!celebration)celebration={phase:'brake',age:0,vx:body.vx-offset.vx,vy:body.vy-offset.vy,...callbacks};},celebrationStatus,cancelCelebration,destroy(){cancelCelebration();active=false;surface.style.touchAction=touchAction;surface.removeEventListener('keydown',key);interaction.destroy();activity.destroy();win.cancelAnimationFrame(frame);}};
}
