import {CosmeticVisual} from './cosmetic-visual.js?v=6741340dcdbdeb9b7b21d3fcd03716bc3a3116707fec766e58ae0070be444e3e';
import {RULE,COLORS,POWERS,effectGet,seedBodies} from './engine.js?v=27a29e6d2cba5ed4d8a714591cb6751bcf16bb1cea5790adfc71e5146d80876e';
import {liveBubbles} from './wave.js?v=3a330797f014cf08578ea70085a2b36387b02f2893aaa7fb87cdbb78ea7469ea';
import {bubbleCreate,bubbleHit,bubbleRipple} from './bubble.js?v=385baeaa905192ab9831eba4809c9c2370062e45dd55402b892d2ea214a30bac';
import {poolBubbleRender,poolBubbleEvent} from './pool-bubble.js?v=2d8770cd4ef4e518190a8081f2b91c359e56e028630b14427dce3e88773d0919';
import {PowerVisual} from './power-visual.js?v=99e31341890e2474f25107e3d8d9c21a23a9a5f265411efc1bcd7161905ae1ac';

// One presentation owner for every physics pool: play, Casual and menu autoplay.
// Scores, aiming, audio and persistence belong to the caller, never this component.
export class PoolVisual {
 constructor(){this.cosmetics=new CosmeticVisual();this.membranes=new Map();this.powerVisual=new PowerVisual();this.clear();}
 configure(loadout){this.cosmetics.configure(loadout);}
 clear(){const loadout={trail:this.cosmetics.trail,bounce:this.cosmetics.bounce};this.cosmetics.clear();this.cosmetics.configure(loadout);this.membranes.clear();this.powerVisual.clear();this.trails=[];this.particles=[];this.rings=[];this.connections=[];this.reunions=[];}
 membrane(body){if(!this.membranes.has(body.id))this.membranes.set(body.id,bubbleCreate());return this.membranes.get(body.id);}
 hit(game,id,nx,ny,strength){const body=id<0?seedBodies(game).find(b=>b.id===id):game.bodies[id];if(!body)return; bubbleHit(this.membrane(body),body.radius,nx,ny,strength,!!effectGet(game,'stasis')?.targets.includes(id));}
 burst(x,y,color,count,low){
  if(low)return;
  for(let i=0;i<count;i++){const angle=Math.random()*Math.PI*2,speed=15+Math.random()*125;this.particles.push({x,y,vx:Math.cos(angle)*speed,vy:Math.sin(angle)*speed,life:.5+Math.random()*1.3,color,radius:1+Math.random()*2.5});}
  if(this.particles.length>350)this.particles.splice(0,this.particles.length-350);
 }
 event(event,game,low=false){
  if(event.type==='wave'){this.clear();return;}
  if(event.type==='impact'&&(event.a===0||event.b===0)||event.type==='wall'&&event.id===0)this.cosmetics.hit(event.x,event.y);
  if(['wrap','portal'].includes(event.type)||event.type==='power'&&['swap','split'].includes(event.kind))this.cosmetics.breakTrail();
  this.powerVisual.event(event,game);poolBubbleEvent(event,game,body=>this.membrane(body));
  const hit=(id,nx,ny,speed)=>this.hit(game,id,nx,ny,speed),burst=(x,y,color,n)=>this.burst(x,y,color,n,low);
  if(event.type==='impact'){hit(event.a,event.nx,event.ny,event.speed);hit(event.b,-event.nx,-event.ny,event.speed);}
  if(event.type==='wall')hit(event.id,-event.nx,-event.ny,event.speed);
  if(event.type==='blaster-hit'){hit(event.id,-event.nx,-event.ny,650);burst(event.x,event.y,POWERS.blaster.color,8);}
  if(event.type==='blaster-fire')hit(0,event.nx,event.ny,180);
  if(event.type==='note'){
   this.membrane(game.bodies[event.id]).glow=1;
   const previous=game.chain.length>1?game.bodies[game.chain.at(-2)]:game.bodies[0];
   this.connections.push({from:previous.id,to:event.id,life:2.4,color:COLORS[event.tone]});
   this.rings.push({x:event.x,y:event.y,radius:game.bodies[event.id].radius,life:1,color:COLORS[event.tone],bloom:false,touched:new Set([event.id])});
   burst(event.x,event.y,COLORS[event.tone],16);
  }
  if(event.type==='pop'){burst(event.x,event.y,COLORS[event.tone],22);this.rings.push({x:event.x,y:event.y,radius:event.radius,life:.4,color:COLORS[event.tone],bloom:false,touched:new Set()});}
  if(event.type==='echo-jump'){this.trails=this.trails.filter(point=>point.id!==-3);this.membranes.delete(-3);}
  if(event.type==='wrap'){this.trails=this.trails.filter(point=>point.id!==event.id);this.membranes.delete(event.id);for(const point of [{x:event.fromX,y:event.fromY},event])burst(point.x,point.y,POWERS.wrap.color,10);}
  if(event.type==='portal'){this.trails=[];this.membranes.delete(0);for(const point of [{x:event.fromX,y:event.fromY},event])burst(point.x,point.y,POWERS.portal.color,18);}
  if(event.type==='slingshot')burst(event.x,event.y,POWERS.slingshot.color,18);
  if(event.type==='reunite'){this.reunions=event.from.map(point=>({...point,life:.4}));this.membranes.delete(-1);this.membranes.delete(-2);}
  if(event.type==='tether')for(const id of [event.a,event.b])this.membrane(game.bodies[id]).glow=.35;
  if(event.type==='push'){hit(event.id,-event.nx,-event.ny,700);this.rings.push({x:event.x,y:event.y,radius:12,life:.7,color:POWERS[event.kind==='bulldozer'?'bulldozer':'impact'].color,kind:'impact'});}
  if(event.type==='power'){
   if(event.kind==='echo')this.membranes.delete(-3);
   if(event.kind==='split'){this.trails=[];this.membranes.delete(0);}
   const color=POWERS[event.kind].color;
   this.rings.push({x:event.x,y:event.y,radius:['attract','stasis'].includes(event.kind)?RULE.powerRadius:8,life:1.6,color,kind:event.kind,bloom:true});
   if(event.kind==='swap'){this.trails=[];this.membranes.clear();this.rings.push({x:event.exitX,y:event.exitY,radius:8,life:1.6,color,kind:'swap',bloom:true});burst(event.exitX,event.exitY,color,24);}
   burst(event.x,event.y,color,24);
  }
  if(event.type==='bloom'){this.rings.push({x:event.x,y:event.y,radius:20,life:2.5,color:'#c1b4ff',bloom:true});burst(event.x,event.y,'#ddcbff',80);}
  if(this.rings.length>128)this.rings.splice(0,this.rings.length-128);
  if(this.connections.length>96)this.connections.splice(0,this.connections.length-96);
 }
 before(context,game,time,visualDelta,isLowQuality=false){
  const seed=game.bodies[0];
  this.cosmetics.step(seed,visualDelta);this.cosmetics.render(context,isLowQuality,true);
  if(isLowQuality){this.trails=[];this.particles=[];}
  this.powerVisual.update(visualDelta,game);
  this.powerVisual.render(context, game, time, isLowQuality);
  const seeds = seedBodies(game);
  if (game.isFlying && !isLowQuality && visualDelta > 0) {
    for (const body of seeds) this.trails.push({ id: body.id, x: body.x, y: body.y, life: .7, comet: body.id === 0 && !!effectGet(game, 'comet'), drunk: body.id !== -3 && !!effectGet(game, 'drunk') });
    if (this.trails.length > 210) this.trails.splice(0, this.trails.length - 210);
  }
  this.trails = this.trails.filter(point => { point.life -= visualDelta; return point.life > 0; });
  const previous = new Map();
  for (const point of this.trails) {
    const a = previous.get(point.id); previous.set(point.id, point);
    if (!a || point.id===0&&!point.comet&&!point.drunk) continue;
    context.strokeStyle = point.comet ? `rgba(255,201,117,${point.life * .8})` : point.drunk ? `rgba(255,172,216,${point.life * .6})` : point.id === -3 ? `rgba(178,192,255,${point.life * .45})` : point.id === -1 ? `rgba(216,183,255,${point.life * .55})` : point.id === -2 ? `rgba(155,237,244,${point.life * .55})` : `rgba(191,246,226,${point.life * .32})`;
    context.lineWidth = point.life * (point.comet ? 24 : point.id < 0 ? 8 : 15); context.lineCap = 'round'; context.beginPath(); context.moveTo(a.x, a.y); context.lineTo(point.x, point.y); context.stroke();
    if (point.comet) { context.strokeStyle = `rgba(255,246,207,${point.life * .8})`; context.lineWidth = point.life * 5; context.stroke(); }
  }
  this.reunions = this.reunions.filter(point => { point.life -= visualDelta; return point.life > 0; });
  if (!isLowQuality) for (const point of this.reunions) {
    const progress = 1 - (point.life / .4) ** 2;
    context.globalAlpha = point.life / .4; context.fillStyle = POWERS.split.color;
    context.beginPath(); context.arc(point.x + (seed.x - point.x) * progress, point.y + (seed.y - point.y) * progress, 8 * point.life / .4 + 2, 0, Math.PI * 2); context.fill(); context.globalAlpha = 1;
  }
  this.connections = this.connections.filter(line => { line.life -= visualDelta; return line.life > 0; });
  if (!isLowQuality) for (const line of this.connections) { const a = game.bodies[line.from], b = game.bodies[line.to]; context.globalAlpha = line.life / 2.4; context.strokeStyle = line.color + '55'; context.lineWidth = .8; context.beginPath(); context.moveTo(a.x, a.y); context.quadraticCurveTo((a.x + b.x) / 2 + 15, (a.y + b.y) / 2 - 20, b.x, b.y); context.stroke(); context.globalAlpha = 1; }
 }
 bodies(context,game,dt,time,options={}){
  for(const body of [...liveBubbles(game),...seedBodies(game)]){
   context.save();if(body.id===-3)context.globalAlpha=.42;
   poolBubbleRender(context,game,body,this.membrane(body),dt,time,{...options,replayGlow:options.replayGlow?.(body)||0});context.restore();
  }
 }
 after(context,game,visualDelta,isLowQuality=false){
  const membraneHit=(...args)=>this.hit(game,...args);
  this.rings = this.rings.filter(ring => {
    ring.previousRadius = ring.radius; ring.life -= visualDelta; ring.radius = Math.max(8, ring.radius + visualDelta * (ring.kind ? (ring.kind === 'stasis' ? 0 : ring.kind === 'attract' ? -1 : 1) * ((['swap', 'comet', 'magnet', 'lightning', 'impact', 'tether', 'split', 'bubble', 'portal', 'echo', 'slingshot', 'drunk', 'wrap', 'homing'].includes(ring.kind) ? 150 : RULE.powerRadius) - 8) / 1.6 : ring.bloom ? 220 : 75));
    if (!isLowQuality && visualDelta > 0 && !['attract', 'stasis', 'swap', 'comet', 'magnet', 'lightning', 'impact', 'tether', 'split', 'bubble', 'portal', 'echo', 'slingshot', 'drunk', 'wrap', 'homing'].includes(ring.kind)) for (const body of game.bodies) {
      const pulse = bubbleRipple(ring, body);
      if (pulse) membraneHit(body.id, pulse.nx, pulse.ny, pulse.strength);
    }
    return ring.life > 0;
  });
  if (!isLowQuality) for (const ring of this.rings.filter(ring => !ring.kind)) { context.globalAlpha = Math.min(.5, ring.life * .5); context.strokeStyle = ring.color; context.lineWidth = ring.bloom ? 2 : 1; context.beginPath(); context.arc(ring.x, ring.y, ring.radius, 0, Math.PI * 2); context.stroke(); context.globalAlpha = 1; }
  this.particles = this.particles.filter(particle => particle.life > 0);
  for (const particle of this.particles) { particle.life -= visualDelta; particle.x += particle.vx * visualDelta; particle.y += particle.vy * visualDelta; context.globalAlpha = Math.min(.8, Math.max(0, particle.life)); context.fillStyle = particle.color; context.beginPath(); context.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2); context.fill(); } context.globalAlpha = 1;
 }
}
