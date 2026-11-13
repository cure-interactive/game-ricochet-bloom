import { COLORS, RULE } from './engine.js?v=8f3aec315f5641fc3607ff24db94ba5aedb253a753d259fc501c3a6fe65cad8a';
import { bubbleCreate, bubbleHit, bubbleStep, bubbleOutline, bubbleFlow } from './bubble.js?v=385baeaa905192ab9831eba4809c9c2370062e45dd55402b892d2ea214a30bac';
import { menuPoolCreate, menuPoolStep, menuPoolTap, menuPoolHold, menuPoolRelease, menuPoolPoint, menuPoolView } from './menu-pool.js?v=54482750db5b9077a8b09bb6a366c5b9ca2a1a6643e26416aab86bd95a320f4d';

export function menuBackgroundMount(canvas,gentle){
  const ctx=canvas.getContext('2d'),pool=menuPoolCreate(),skins=pool.game.bodies.map(()=>bubbleCreate());
  let active=false,frame=0,previous=0,rings=[];
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
    for(const body of pool.game.bodies){
      const skin=skins[body.id],color=body.id===0?'#f1f9d7':COLORS[body.tone],r=body.radius;
      bubbleStep(skin,body,dt,gentle(),bubbleFlow(body,pool.game.bodies));skin.glow=Math.max(0,skin.glow-dt);
      const glow=ctx.createRadialGradient(body.x,body.y,r*.2,body.x,body.y,r*3);
      glow.addColorStop(0,color+(skin.glow>.1?'65':'28'));glow.addColorStop(1,color+'00');ctx.fillStyle=glow;ctx.beginPath();ctx.arc(body.x,body.y,r*3,0,Math.PI*2);ctx.fill();
      const points=bubbleOutline(skin,body),path=new Path2D(),first=points[0],last=points.at(-1);
      path.moveTo((first.x+last.x)/2,(first.y+last.y)/2);
      points.forEach((p,i)=>{const next=points[(i+1)%points.length];path.quadraticCurveTo(p.x,p.y,(p.x+next.x)/2,(p.y+next.y)/2);});path.closePath();
      const fill=ctx.createRadialGradient(body.x-r*.3,body.y-r*.35,0,body.x,body.y,r*1.1);
      fill.addColorStop(0,body.id===0?'#ffffed':color+'dd');fill.addColorStop(.5,color+'70');fill.addColorStop(1,color+'18');
      ctx.fillStyle=fill;ctx.fill(path);ctx.strokeStyle=color+'bb';ctx.lineWidth=1.4;ctx.stroke(path);
      ctx.fillStyle=color+'aa';ctx.beginPath();ctx.arc(body.x+skin.core[0],body.y+skin.core[1],r*.17,0,Math.PI*2);ctx.fill();
    }
    canvas.dataset.tick=String(pool.game.tick);
  }
  function animate(now){
    frame=0;if(!active||document.hidden)return;
    const dt=previous?Math.min(.05,(now-previous)/1000):0;
    if(!previous||dt>=1/30){
      previous=now;
      for(const event of menuPoolStep(pool,dt*(gentle()?.45:.75))){
        if(event.type==='impact')for(const [id,sign] of [[event.a,1],[event.b,-1]])if(skins[id])bubbleHit(skins[id],pool.game.bodies[id].radius,event.nx*sign,event.ny*sign,event.speed);
        if(event.type==='note')skins[event.id].glow=.9;
        if(event.type==='bloom'&&!gentle())rings.push({x:event.x,y:event.y,age:0});
      }
      draw(dt);
    }
    frame=requestAnimationFrame(animate);
  }
  function sync(){cancelAnimationFrame(frame);frame=0;previous=0;if(active&&!document.hidden)frame=requestAnimationFrame(animate);}
  function clear(){pool.contacts.clear();canvas.dataset.contacts='0';}
  document.addEventListener('visibilitychange',()=>{clear();sync();});window.addEventListener('resize',()=>{clear();sync();});
  const background={show(value){if(active===value)return;clear();active=value;sync();},clear,
    contact(id,clientX,clientY,pulse=false){
      if(!active||document.hidden)return;
      const r=canvas.getBoundingClientRect();if(!r.width||!r.height)return;
      if(pulse&&!pool.contacts.has(id))background.tap(clientX,clientY);
      menuPoolHold(pool,id,menuPoolPoint(clientX-r.left,clientY-r.top,r.width,r.height));canvas.dataset.contacts=String(pool.contacts.size);
    },release(id){menuPoolRelease(pool,id);canvas.dataset.contacts=String(pool.contacts.size);},tap(clientX,clientY){
    if(!active)return;const r=canvas.getBoundingClientRect();if(!r.width||!r.height)return;
    const point=menuPoolPoint(clientX-r.left,clientY-r.top,r.width,r.height);
    for(const hit of menuPoolTap(pool,point)){bubbleHit(skins[hit.id],pool.game.bodies[hit.id].radius,hit.nx,hit.ny,hit.speed);skins[hit.id].glow=.8;}
    canvas.dataset.pulses=String(pool.pressure.length);draw(0);if(!frame)sync();
  }};
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
