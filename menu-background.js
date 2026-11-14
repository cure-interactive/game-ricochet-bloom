import {poolBubbleRender} from './pool-bubble.js?v=d91dab27e50e91cdaceaaf9f26ec4685831623556a0c5a77bb1462e1c2492d5a';
import {freePlayCreate,freePlayBuild} from './free-play.js?v=2688950919d159815d3ffeb8bedaa0133731cda8f149bcf49906a2abc95845da';
import {playerBuild} from './player-upgrade.js?v=2f8094123653e7654746e834352d2180922eb090ccd1d9e358a596ab2bcd37f9';
import {progressionCreate} from './run.js?v=761d66a7f48a89837bd270e75d2f2fc05b570ad32da442ce146863b3344310db';
import {menuMusicCreate} from './menu-music.js?v=efe27ce829a4d07bd2490c733ea6bd366ec070324dbd27492f0620139233c982';
import {PowerVisual} from './power-visual.js?v=c1fa49a130dcf51e7d62ea8b27a6b927bc9a6dad0b11295f7beeead8e230b7e2';
import { RULE, seedBodies, effectGet, frozenHit } from './engine.js?v=458c79aff3093649ea2afe0eb37b7e12985acd4da09001bc1a5dcaa8a869557d';
import { bubbleCreate, bubbleHit } from './bubble.js?v=385baeaa905192ab9831eba4809c9c2370062e45dd55402b892d2ea214a30bac';
import { menuPoolCreate, menuPoolStep, menuPoolTap, menuPoolHold, menuPoolRelease, menuPoolPoint, menuPoolView } from './menu-pool.js?v=7ad269567cdd629f4796505360695356f102591a74757fa62553e87710dace77';

export function menuBackgroundMount(canvas,gentle,{profile=()=>progressionCreate(),skin=()=>'#f1f9d7',audioSettings=()=>({volume:1,ambience:1,muted:false}),music=menuMusicCreate(audioSettings)}={}){
  const ctx=canvas.getContext('2d'),pool=menuPoolCreate(freePlayCreate('MENU BLOOM',profile())),skins=new Map(),powerVisual=new PowerVisual();
  const skinFor=body=>{if(!skins.has(body.id))skins.set(body.id,bubbleCreate());return skins.get(body.id);};
  let active=false,frame=0,previous=0,rings=[],signature='';
  function draw(dt){
    const width=canvas.clientWidth,height=canvas.clientHeight,dpr=Math.min(2,devicePixelRatio||1);
    if(!width||!height)return;
    if(canvas.width!==Math.round(width*dpr)||canvas.height!==Math.round(height*dpr)){canvas.width=Math.round(width*dpr);canvas.height=Math.round(height*dpr);}
    ctx.setTransform(dpr,0,0,dpr,0,0);ctx.clearRect(0,0,width,height);
    // Rotate the whole pool on phones so its geometry fills either orientation.
    const {portrait,scale}=menuPoolView(width,height);
    ctx.translate(width/2,height/2);ctx.scale(scale,scale);if(portrait)ctx.rotate(Math.PI/2);ctx.translate(-RULE.width/2,-RULE.height/2);
    for(const ring of rings){ctx.strokeStyle=`rgba(177,244,219,${Math.max(0,1-ring.age/2)*.35})`;ctx.lineWidth=2;ctx.beginPath();ctx.arc(ring.x,ring.y,20+ring.age*160,0,Math.PI*2);ctx.stroke();ring.age+=dt;}
    rings=rings.filter(r=>r.age<2);
    for(const point of pool.contacts.values()){
      const glow=ctx.createRadialGradient(point.x,point.y,0,point.x,point.y,180);
      glow.addColorStop(0,'#b1f4db20');glow.addColorStop(1,'#b1f4db00');
      ctx.fillStyle=glow;ctx.fillRect(point.x-180,point.y-180,360,360);
    }
    for(const pulse of pool.pressure){
      const fade=1-pulse.age/1.25,radius=12+pulse.age*(gentle()?120:250);
      ctx.strokeStyle=`rgba(177,244,219,${fade*.65})`;ctx.lineWidth=2.5*fade;ctx.beginPath();ctx.arc(pulse.x,pulse.y,radius,0,Math.PI*2);ctx.stroke();
      const glow=ctx.createRadialGradient(pulse.x,pulse.y,0,pulse.x,pulse.y,100);
      glow.addColorStop(0,`rgba(177,244,219,${fade*.12})`);glow.addColorStop(1,'rgba(177,244,219,0)');ctx.fillStyle=glow;ctx.fillRect(pulse.x-100,pulse.y-100,200,200);
    }
    powerVisual.update(dt);powerVisual.render(ctx,pool.game,pool.game.tick*RULE.step,gentle());
    const bodies=[...seedBodies(pool.game),...pool.game.bodies.slice(1)];
    for(const body of bodies){
      poolBubbleRender(ctx,pool.game,body,skinFor(body),dt,pool.game.tick*RULE.step,{gentle:gentle(),skinColor:skin(),portrait});
    }
    canvas.dataset.tick=String(pool.game.tick);
    canvas.dataset.effects=pool.game.effects.map(e=>e.kind).join(',');canvas.dataset.frozen=String(effectGet(pool.game,'stasis')?.targets.length||0);canvas.dataset.permeable=String(pool.game.bodies.filter(b=>b.id>0&&frozenHit(pool.game,b.id)).length);
    musicDiagnostics();
    canvas.dataset.powerHits=String(pool.hits);canvas.dataset.powerActivations=String(pool.activations);canvas.dataset.lastPower=pool.lastPower||'';canvas.dataset.powerChoices=pool.game.build.map(p=>p.power).join(',');
  }
  function animate(now){
    frame=0;if(!active||document.hidden)return;
    const dt=previous?Math.min(.05,(now-previous)/1000):0;
    if(!previous||dt>=1/30){
      previous=now;
      for(const event of menuPoolStep(pool,dt)){
        if(event.type==='impact')for(const [id,sign] of [[event.a,1],[event.b,-1]]){const body=seedBodies(pool.game).find(b=>b.id===id)||pool.game.bodies[id];if(body)bubbleHit(skinFor(body),body.radius,event.nx*sign,event.ny*sign,event.speed,!!effectGet(pool.game,'stasis')?.targets.includes(id));}
        if(event.type==='wall'){const body=bodiesFor().find(b=>b.id===event.id);if(body)bubbleHit(skinFor(body),body.radius,-event.nx,-event.ny,event.speed,!!effectGet(pool.game,'stasis')?.targets.includes(body.id));}
        powerVisual.event(event,pool.game);music.event(event);
        if(event.type==='note'&&pool.game.bodies[event.id])skinFor(pool.game.bodies[event.id]).glow=.9;
        if(event.type==='bloom'&&!gentle())rings.push({x:event.x,y:event.y,age:0});
      }
      music.update(bodiesFor(),menuPoolView(canvas.clientWidth,canvas.clientHeight).portrait);
      draw(dt);
    }
    frame=requestAnimationFrame(animate);
  }
  const bodiesFor=()=>[...seedBodies(pool.game),...pool.game.bodies.slice(1)];
  function musicDiagnostics(){if(music.diagnostics)for(const [key,value] of Object.entries(music.diagnostics))canvas.dataset['music'+key[0].toUpperCase()+key.slice(1)]=String(value);}
  function sync(){music.active(active&&!document.hidden);musicDiagnostics(); cancelAnimationFrame(frame);frame=0;previous=0;if(active&&!document.hidden)frame=requestAnimationFrame(animate);}
  function clear(){pool.contacts.clear();canvas.dataset.contacts='0';}
  document.addEventListener('visibilitychange',()=>{clear();sync();});window.addEventListener('resize',()=>{clear();sync();});
  const background={refresh(){
    const progress=profile(),next=JSON.stringify([freePlayBuild(progress),playerBuild(progress.profile)]);
    if(signature===next)return;signature=next;
    Object.assign(pool,menuPoolCreate(freePlayCreate('MENU BLOOM',progress)));skins.clear();powerVisual.clear();rings=[];music.reset();canvas.dataset.contacts='0';draw(0);
  },show(value){if(active===value)return;clear();active=value;sync();},clear,
    contact(id,clientX,clientY,pulse=false){
      if(!active||document.hidden)return;
      const r=canvas.getBoundingClientRect();if(!r.width||!r.height)return;
      if(pulse&&!pool.contacts.has(id))background.tap(clientX,clientY);
      menuPoolHold(pool,id,menuPoolPoint(clientX-r.left,clientY-r.top,r.width,r.height));canvas.dataset.contacts=String(pool.contacts.size);
    },release(id){menuPoolRelease(pool,id);canvas.dataset.contacts=String(pool.contacts.size);},tap(clientX,clientY){
    if(!active)return;const r=canvas.getBoundingClientRect();if(!r.width||!r.height)return;
    const point=menuPoolPoint(clientX-r.left,clientY-r.top,r.width,r.height);
    for(const hit of menuPoolTap(pool,point)){bubbleHit(skinFor(pool.game.bodies[hit.id]),pool.game.bodies[hit.id].radius,hit.nx,hit.ny,hit.speed);skinFor(pool.game.bodies[hit.id]).glow=.8;}
    canvas.dataset.pulses=String(pool.pressure.length);draw(0);if(!frame)sync();
  }};
  for(const event of ['pointerdown','keydown'])document.addEventListener(event,()=>{if(active&&!document.hidden)music.unlock();},{capture:true,passive:true});
  menuContactMount(background,document,window);
  return background;
}

// Observe input without capture ownership or cancellation: scrolling, buttons and
// the skill-tree camera keep their normal gestures. Touch events survive scroll.
export function menuContactMount(background,doc,win){
  const options={capture:true,passive:true};
  doc.addEventListener('touchstart',event=>{for(const touch of event.changedTouches)background.contact(`touch:${touch.identifier}`,touch.clientX,touch.clientY,true);},options);
  doc.addEventListener('touchmove',event=>{for(const touch of event.touches)background.contact(`touch:${touch.identifier}`,touch.clientX,touch.clientY);},options);
  const releaseTouches=event=>{for(const touch of event.changedTouches)background.release(`touch:${touch.identifier}`);};
  doc.addEventListener('touchend',releaseTouches,options);doc.addEventListener('touchcancel',releaseTouches,options);
  doc.addEventListener('pointerdown',event=>{if(event.pointerType!=='touch'&&event.button===0)background.contact(event.pointerId,event.clientX,event.clientY,true);},options);
  doc.addEventListener('pointermove',event=>{if(event.pointerType==='touch')return;if(event.buttons&1)background.contact(event.pointerId,event.clientX,event.clientY);else background.release(event.pointerId);},options);
  const releasePointer=event=>{if(event.pointerType!=='touch')background.release(event.pointerId);};
  for(const name of ['pointerup','pointercancel','lostpointercapture'])doc.addEventListener(name,releasePointer,options);
  win.addEventListener('blur',()=>background.clear());
}
