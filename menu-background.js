import {frameGate} from './performance.js?v=98f53fc38e408a68f5e1beee87a7d0e0066fe8a1093aa41acc5b7134cdaac489';
import {qualityPixelRatio} from './quality.js?v=33c4a6dbcda13ded7499caa9a3563afa6903c4346850134bc5bd467cbac4ad4e';
import {bubbleContactMount as menuContactMount} from './bubble-pressure.js?v=b5bc5af7a6c96099ebff8ebb3bdb5e8bd38cd0780e699102086111db5779588b';
export {menuContactMount};
import {freePlayCreate,freePlayBuild} from './free-play.js?v=84c1283ff1af1a86937c3582a4b4650e69a38835a430acfce91ce450bdc6b62d';
import {playerBuild} from './player-upgrade.js?v=205999fde590d7ae1935c6f5a99938cc353989c1dae9cfab7129b62c0b60b55b';
import {progressionCreate} from './run.js?v=092dcb31aec037c2c2e756df3cc28906975a53fd312f249b8265916dc20ffdcc';
import {menuMusicCreate} from './menu-music.js?v=2843c3fd095048bf7904a2140cf66f0593d0e634db4d5d8e2c7304e554149b0d';
import {PoolVisual} from './pool-visual.js?v=a4c82d8948972af911f675109d66526102a1755fd5f94a0b103b25a442244b1b';
import { RULE, seedBodies, effectGet, frozenHit } from './engine.js?v=514a1bb2de32041b9d992eb1f14445cdb6d4cc4b4eadf2008a4ff26627a5f26d';
import { bubbleHit } from './bubble.js?v=385baeaa905192ab9831eba4809c9c2370062e45dd55402b892d2ea214a30bac';
import { menuPoolCreate, menuPoolStep, menuPoolTap, menuPoolHold, menuPoolRelease, menuPoolPoint, menuPoolView, menuPoolResize } from './menu-pool.js?v=0b5c07eac5ef4173f8d7da00f2fe5ee9727c47519b938fd37824f1538fccf955';

export function menuBackgroundMount(canvas,gentle,{powerMarkings=()=>false,profile=()=>progressionCreate(),skin=()=>'#f1f9d7',skinStyle=()=>'original',audioSettings=()=>({volume:1,ambience:1,muted:false}),music=menuMusicCreate(audioSettings)}={}){
  const ctx=canvas.getContext('2d'),pool=menuPoolCreate(freePlayCreate('MENU BLOOM',profile())),visual=new PoolVisual();
  const skinFor=body=>visual.membrane(body);
  const renderReady=frameGate();
  let active=false,audible=false,frame=0,previous=0,signature='';
  const covered=()=>[...(document.querySelectorAll?.('dialog[open]')||[])].some(dialog=>getComputedStyle(dialog).getPropertyValue('--pool-background-covered').trim()==='1');
  function draw(dt){
    if(covered())return;
    const width=canvas.clientWidth,height=canvas.clientHeight,dpr=qualityPixelRatio(document.body?.dataset?.quality,devicePixelRatio||1);
    if(!width||!height)return;
    if(canvas.width!==Math.round(width*dpr)||canvas.height!==Math.round(height*dpr)){canvas.width=Math.round(width*dpr);canvas.height=Math.round(height*dpr);}
    ctx.setTransform(dpr,0,0,dpr,0,0);ctx.clearRect(0,0,width,height);
    // Fit the whole pool on phones and desktop; input uses the same transform.
    menuPoolResize(pool,width,height);
    const {portrait,scale,worldWidth,worldHeight}=menuPoolView(width,height);
    ctx.translate(width/2,height/2);ctx.scale(scale,scale);if(portrait)ctx.rotate(Math.PI/2);ctx.translate(-worldWidth/2,-worldHeight/2);
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
    visual.before(ctx,pool.game,pool.game.tick*RULE.step,dt,gentle());
    visual.bodies(ctx,pool.game,dt,pool.game.tick*RULE.step,{gentle:gentle(),skinColor:skin(),skinStyle:skinStyle(),portrait,markings:false,powerMarkings:powerMarkings()});
    visual.after(ctx,pool.game,dt,gentle());
    canvas.dataset.tick=String(pool.game.tick);
    canvas.dataset.effects=pool.game.effects.map(e=>e.kind).join(',');canvas.dataset.frozen=String(effectGet(pool.game,'stasis')?.targets.length||0);canvas.dataset.permeable=String(pool.game.bodies.filter(b=>b.id>0&&frozenHit(pool.game,b.id)).length);
    musicDiagnostics();
    canvas.dataset.powerHits=String(pool.hits);canvas.dataset.powerActivations=String(pool.activations);canvas.dataset.lastPower=pool.lastPower||'';canvas.dataset.powerChoices=pool.game.build.map(p=>p.power).join(',');
  }
  function animate(now){
    frame=0;if((!active&&!audible)||document.hidden)return;
    if(!renderReady(now)){frame=requestAnimationFrame(animate);return;}
    if(!active){music.update(bodiesFor(),menuPoolView(canvas.clientWidth,canvas.clientHeight).portrait);musicDiagnostics();frame=requestAnimationFrame(animate);return;}
    const dt=previous?Math.min(.05,(now-previous)/1000):0;
    if(!previous||dt>=1/30-.001){
      previous=now;
      visual.configure(profile().profile?.cosmetics);
      menuPoolResize(pool,canvas.clientWidth,canvas.clientHeight);
      const obscured=covered();
      if(obscured){clear();pool.pressure=[];visual.clear();}
      for(const event of menuPoolStep(pool,dt)){
        music.event(event);if(obscured)continue;
        visual.event(event,pool.game,gentle());
        if(document.body?.dataset?.screen==='drift')music.cosmetic?.(event,profile().profile?.cosmetics);
      }
      music.update(bodiesFor(),menuPoolView(canvas.clientWidth,canvas.clientHeight).portrait);
      canvas.dataset.tick=String(pool.game.tick);canvas.dataset.covered=String(obscured);musicDiagnostics();
      if(!obscured)draw(dt);
    }
    frame=requestAnimationFrame(animate);
  }
  const bodiesFor=()=>[...seedBodies(pool.game),...pool.game.bodies.slice(1)];
  function musicDiagnostics(){if(music.diagnostics)for(const [key,value] of Object.entries(music.diagnostics))canvas.dataset['music'+key[0].toUpperCase()+key.slice(1)]=String(value);}
  function sync(){music.active(audible&&!document.hidden);if(!active||document.hidden)music.cosmeticStop?.();musicDiagnostics(); cancelAnimationFrame(frame);frame=0;previous=0;if((active||audible)&&!document.hidden)frame=requestAnimationFrame(animate);}
  function clear(){pool.contacts.clear();canvas.dataset.contacts='0';}
  document.addEventListener('visibilitychange',()=>{clear();sync();});window.addEventListener('resize',()=>{clear();sync();});
  // App height settles after the window event; redraw the actual canvas size.
  new ResizeObserver(()=>{if(!active&&!document.hidden)draw(0);}).observe(canvas);
  const background={refresh(){
    const progress=profile(),next=JSON.stringify([freePlayBuild(progress),playerBuild(progress.profile)]);
    if(signature===next)return;signature=next;
    Object.assign(pool,menuPoolCreate(freePlayCreate('MENU BLOOM',progress)));visual.clear();music.reset();canvas.dataset.contacts='0';draw(0);
  },show(value,{ambient=value}={}){if(active===value&&audible===ambient)return;clear();active=value;audible=ambient;sync();},clear,
    contact(id,clientX,clientY,pulse=false){
      if(!active||document.hidden||covered()){clear();return;}
      const r=canvas.getBoundingClientRect();if(!r.width||!r.height)return;
      if(pulse&&!pool.contacts.has(id))background.tap(clientX,clientY);
      menuPoolHold(pool,id,menuPoolPoint(clientX-r.left,clientY-r.top,r.width,r.height));canvas.dataset.contacts=String(pool.contacts.size);
    },release(id){menuPoolRelease(pool,id);canvas.dataset.contacts=String(pool.contacts.size);},tap(clientX,clientY){
    if(!active||document.hidden||covered())return;const r=canvas.getBoundingClientRect();if(!r.width||!r.height)return;
    const point=menuPoolPoint(clientX-r.left,clientY-r.top,r.width,r.height);
    for(const hit of menuPoolTap(pool,point)){bubbleHit(skinFor(pool.game.bodies[hit.id]),pool.game.bodies[hit.id].radius,hit.nx,hit.ny,hit.speed);skinFor(pool.game.bodies[hit.id]).glow=.8;}
    canvas.dataset.pulses=String(pool.pressure.length);draw(0);if(!frame)sync();
  }};
  // Bubble after the control handler: Resume may activate a previously paused
  // pool. Click also provides Safari's completed touch activation for recovery.
  for(const event of ['pointerdown','click','keydown'])document.addEventListener(event,()=>{if(audible&&!document.hidden)music.unlock();},{passive:true});
  menuContactMount(background,document,window);
  return background;
}
