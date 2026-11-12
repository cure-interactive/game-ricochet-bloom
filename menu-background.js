import { COLORS, RULE } from './engine.js?v=78193f8961efde0cbc94b402713c23a61d5384166c5a072df3d3e9cd12e7b310';
import { jellyCreate, jellyHit, jellyStep, jellyOutline, jellyFlow } from './jelly.js?v=bd31003d62a0c49595da51b1cbe150b04cc6284fd19b78e11ff15c7b30380529';
import { menuPoolCreate, menuPoolStep, menuPoolTap, menuPoolPoint, menuPoolView } from './menu-pool.js?v=d2d8b81bc8e71a1c91d0ec7fec5f2eb774328de2a0037e5803ea5c8d998d81ee';

export function menuBackgroundMount(canvas,gentle){
  const ctx=canvas.getContext('2d'),pool=menuPoolCreate(),skins=pool.game.bodies.map(()=>jellyCreate());
  const reduced=matchMedia('(prefers-reduced-motion: reduce)');
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
    for(const pulse of pool.pressure){
      const fade=1-pulse.age/1.25,radius=12+pulse.age*(gentle()||reduced.matches?120:250);
      ctx.strokeStyle=`rgba(177,244,219,${fade*.65})`;ctx.lineWidth=2.5*fade;ctx.beginPath();ctx.arc(pulse.x,pulse.y,radius,0,Math.PI*2);ctx.stroke();
      const glow=ctx.createRadialGradient(pulse.x,pulse.y,0,pulse.x,pulse.y,100);
      glow.addColorStop(0,`rgba(177,244,219,${fade*.12})`);glow.addColorStop(1,'rgba(177,244,219,0)');ctx.fillStyle=glow;ctx.fillRect(pulse.x-100,pulse.y-100,200,200);
    }
    for(const body of pool.game.bodies){
      const skin=skins[body.id],color=body.id===0?'#f1f9d7':COLORS[body.tone],r=body.radius;
      jellyStep(skin,body,dt,gentle(),jellyFlow(body,pool.game.bodies));skin.glow=Math.max(0,skin.glow-dt);
      const glow=ctx.createRadialGradient(body.x,body.y,r*.2,body.x,body.y,r*3);
      glow.addColorStop(0,color+(skin.glow>.1?'65':'28'));glow.addColorStop(1,color+'00');ctx.fillStyle=glow;ctx.beginPath();ctx.arc(body.x,body.y,r*3,0,Math.PI*2);ctx.fill();
      const points=jellyOutline(skin,body),path=new Path2D(),first=points[0],last=points.at(-1);
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
      if(!reduced.matches||pool.pressure.length){
        for(const event of menuPoolStep(pool,dt*(gentle()?.45:.75),!reduced.matches)){
          if(event.type==='impact')for(const [id,sign] of [[event.a,1],[event.b,-1]])if(skins[id])jellyHit(skins[id],pool.game.bodies[id].radius,event.nx*sign,event.ny*sign,event.speed);
          if(event.type==='note')skins[event.id].glow=.9;
          if(event.type==='bloom'&&!gentle())rings.push({x:event.x,y:event.y,age:0});
        }
      }
      draw(reduced.matches&&!pool.pressure.length?0:dt);
    }
    if(!reduced.matches||pool.pressure.length)frame=requestAnimationFrame(animate);
  }
  function sync(){cancelAnimationFrame(frame);frame=0;previous=0;if(active&&!document.hidden)frame=requestAnimationFrame(animate);}
  document.addEventListener('visibilitychange',sync);reduced.addEventListener('change',sync);window.addEventListener('resize',sync);
  return {show(value){active=value;sync();},tap(clientX,clientY){
    if(!active)return;const r=canvas.getBoundingClientRect();if(!r.width||!r.height)return;
    const point=menuPoolPoint(clientX-r.left,clientY-r.top,r.width,r.height);
    for(const hit of menuPoolTap(pool,point)){jellyHit(skins[hit.id],pool.game.bodies[hit.id].radius,hit.nx,hit.ny,hit.speed);skins[hit.id].glow=.8;}
    canvas.dataset.pulses=String(pool.pressure.length);draw(0);if(!frame)sync();
  }};
}
