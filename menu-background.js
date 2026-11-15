import {qualityPixelRatio} from './quality.js?v=33c4a6dbcda13ded7499caa9a3563afa6903c4346850134bc5bd467cbac4ad4e';
import {bubbleContactMount as menuContactMount} from './bubble-pressure.js?v=0f0369c96892b587b973530192fa387903a71fa360cf582520cd16239bc7360c';
export {menuContactMount};
import {freePlayCreate,freePlayBuild} from './free-play.js?v=0756fd6c275d9b67a242f4bd1c6e4adb572e9b7bedd77ec79419dfae7e475473';
import {playerBuild} from './player-upgrade.js?v=2f8094123653e7654746e834352d2180922eb090ccd1d9e358a596ab2bcd37f9';
import {progressionCreate} from './run.js?v=aa118d34e3e643b1a488bc8d307b99a54e66ae474452ddcf6575bb9bee2e84a1';
import {menuMusicCreate} from './menu-music.js?v=eadf5534c4cc2c14e1ffb2b32d4ba8b1cf488c9cd7f993251ecddb3b196af2f0';
import {PoolVisual} from './pool-visual.js?v=595cb4850528ef70e4d69bbdd1562183e05c8b1371bb9065a1618a63af3c7b29';
import { RULE, seedBodies, effectGet, frozenHit } from './engine.js?v=f4899d3bd5ff9863ae40a80efbf8165a13d901cd4597a6be6d3d36e65255cd3b';
import { bubbleHit } from './bubble.js?v=385baeaa905192ab9831eba4809c9c2370062e45dd55402b892d2ea214a30bac';
import { menuPoolCreate, menuPoolStep, menuPoolTap, menuPoolHold, menuPoolRelease, menuPoolPoint, menuPoolView } from './menu-pool.js?v=7519519c05c10d989e0812a8dc056dd4651cbba92f1c83aa343877d1dcc87f3b';

export function menuBackgroundMount(canvas,gentle,{powerMarkings=()=>false,profile=()=>progressionCreate(),skin=()=>'#f1f9d7',audioSettings=()=>({volume:1,ambience:1,muted:false}),music=menuMusicCreate(audioSettings)}={}){
  const ctx=canvas.getContext('2d'),pool=menuPoolCreate(freePlayCreate('MENU BLOOM',profile())),visual=new PoolVisual();
  const skinFor=body=>visual.membrane(body);
  let active=false,audible=false,frame=0,previous=0,signature='';
  const covered=()=>[...(document.querySelectorAll?.('dialog[open]')||[])].some(dialog=>getComputedStyle(dialog).getPropertyValue('--pool-background-covered').trim()==='1');
  function draw(dt){
    if(covered())return;
    const width=canvas.clientWidth,height=canvas.clientHeight,dpr=qualityPixelRatio(document.body?.dataset?.quality,devicePixelRatio||1);
    if(!width||!height)return;
    if(canvas.width!==Math.round(width*dpr)||canvas.height!==Math.round(height*dpr)){canvas.width=Math.round(width*dpr);canvas.height=Math.round(height*dpr);}
    ctx.setTransform(dpr,0,0,dpr,0,0);ctx.clearRect(0,0,width,height);
    // Rotate the whole pool on phones so its geometry fills either orientation.
    const {portrait,scale}=menuPoolView(width,height);
    ctx.translate(width/2,height/2);ctx.scale(scale,scale);if(portrait)ctx.rotate(Math.PI/2);ctx.translate(-RULE.width/2,-RULE.height/2);
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
    visual.bodies(ctx,pool.game,dt,pool.game.tick*RULE.step,{gentle:gentle(),skinColor:skin(),portrait,markings:false,powerMarkings:powerMarkings()});
    visual.after(ctx,pool.game,dt,gentle());
    canvas.dataset.tick=String(pool.game.tick);
    canvas.dataset.effects=pool.game.effects.map(e=>e.kind).join(',');canvas.dataset.frozen=String(effectGet(pool.game,'stasis')?.targets.length||0);canvas.dataset.permeable=String(pool.game.bodies.filter(b=>b.id>0&&frozenHit(pool.game,b.id)).length);
    musicDiagnostics();
    canvas.dataset.powerHits=String(pool.hits);canvas.dataset.powerActivations=String(pool.activations);canvas.dataset.lastPower=pool.lastPower||'';canvas.dataset.powerChoices=pool.game.build.map(p=>p.power).join(',');
  }
  function animate(now){
    frame=0;if((!active&&!audible)||document.hidden)return;
    if(!active){music.update(bodiesFor(),menuPoolView(canvas.clientWidth,canvas.clientHeight).portrait);musicDiagnostics();frame=requestAnimationFrame(animate);return;}
    const dt=previous?Math.min(.05,(now-previous)/1000):0;
    if(!previous||dt>=1/30){
      previous=now;
      const obscured=covered();
      if(obscured){clear();pool.pressure=[];visual.clear();}
      for(const event of menuPoolStep(pool,dt)){
        music.event(event);if(obscured)continue;
        visual.event(event,pool.game,gentle());
      }
      music.update(bodiesFor(),menuPoolView(canvas.clientWidth,canvas.clientHeight).portrait);
      canvas.dataset.tick=String(pool.game.tick);canvas.dataset.covered=String(obscured);musicDiagnostics();
      if(!obscured)draw(dt);
    }
    frame=requestAnimationFrame(animate);
  }
  const bodiesFor=()=>[...seedBodies(pool.game),...pool.game.bodies.slice(1)];
  function musicDiagnostics(){if(music.diagnostics)for(const [key,value] of Object.entries(music.diagnostics))canvas.dataset['music'+key[0].toUpperCase()+key.slice(1)]=String(value);}
  function sync(){music.active(audible&&!document.hidden);musicDiagnostics(); cancelAnimationFrame(frame);frame=0;previous=0;if((active||audible)&&!document.hidden)frame=requestAnimationFrame(animate);}
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
