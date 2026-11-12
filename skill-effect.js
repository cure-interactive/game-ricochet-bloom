import { POWER_TREES } from './power-tree.js?v=0bcdae42795671509b8c4f64ae024b263c7281e465d043ab76bd131d11397edc';

// Resolved configuration belongs to physics; profile ownership stays outside it.
export function buildValidate(build) {
  return Array.isArray(build) && build.length >= 1 && build.length <= Object.keys(POWER_TREES).length && new Set(build.map(p=>p?.power)).size===build.length && build.every(p=>p && Object.hasOwn(POWER_TREES,p.power) && typeof p.foundation==='boolean' && typeof p.capstone==='boolean' && Array.isArray(p.variants) && p.variants.length<=2 && new Set(p.variants).size===p.variants.length && p.variants.every(v=>v==='a'||v==='b') && (POWER_TREES[p.power].compatible || p.variants.length<=1));
}
export function skillFlags(state,power) {
  const choice=state.build?.find(p=>p.power===power);
  return choice ? {legacy:false,foundation:choice.foundation,a:choice.variants.includes('a'),b:choice.variants.includes('b'),capstone:choice.capstone} : {legacy:true,foundation:true,a:false,b:false,capstone:false};
}
export function skillConfig(state,power) {
  const f=skillFlags(state,power),c={...f};
  switch(power) {
    case 'magnet': Object.assign(c,{duration:f.legacy?2.4:f.foundation?3.2:2.4,reach:f.a?300:f.b?570:440,force:f.a?1750:f.b?950:1300});break;
    case 'homing': Object.assign(c,{duration:f.foundation?5:3,reach:f.a?450:f.b?260:360,turn:f.a?2.2:f.b?4.8:3.4});break;
    case 'bubble': Object.assign(c,{size:f.foundation?42:35,pressure:f.a?.65:f.b?1.4:1});break;
    case 'stasis': Object.assign(c,{reach:f.foundation?440:300,speed:f.a?65:f.b?145:100,pressure:f.b?.55:1});break;
    case 'echo': Object.assign(c,{leash:f.b?70:f.legacy||f.foundation?48:f.a?32:14,seek:f.legacy||f.a,elastic:f.legacy||f.foundation});break;
    case 'tether': Object.assign(c,{members:f.foundation?3:2,pull:f.a?360:240,spring:f.a?4.5:f.b?10:7});break;
    case 'split': Object.assign(c,{count:f.foundation?2:1,fan:f.a?.95:f.b?.32:.65,duration:f.b?3.5:3});break;
    case 'orbit': Object.assign(c,{count:f.foundation?2:1,duration:f.a?2.2:3,reach:f.a?20:f.b?60:35,turn:f.b?2.6:3.5});break;
    case 'spring': case 'wake': case 'portal': case 'wrap': Object.assign(c,{duration:f.foundation?5:3});break;
    case 'pulse': Object.assign(c,{count:f.foundation?3:2,beat:f.a?1:f.b?.5:.75,force:f.a?850:f.b?550:720});break;
    case 'lightning': case 'relay': Object.assign(c,{count:f.foundation?3:power==='relay'?1:2});break;
  }
  return c;
}
const effect=(s,k)=>s.effects.find(e=>e.kind===k);
const limit=b=>{const v=Math.hypot(b.vx,b.vy);if(v>1600){b.vx*=1600/v;b.vy*=1600/v;}};
export function pressure(state,x,y,radius,strength,kind='ripple',shape={}) {
  for(const b of state.bodies.slice(1)) {
    const dx=b.x-x,dy=b.y-y,d=Math.hypot(dx,dy);if(d<1||d>=radius)continue;
    let force=strength*(shape.a?(1-d/radius)**2:shape.b?1-Math.sqrt(d/radius):1-(d/radius)**2);
    let radial=kind==='attract'?-1:kind==='vortex'?(shape.a?-.45:shape.b?.45:0):1;
    if(kind==='attract'&&shape.b)radial=d<radius*.48?1:-1;
    if(kind==='attract'&&shape.a&&d<b.radius+30)force=0;
    b.vx+=(dx/d*radial+(kind==='vortex'?-dy/d:0))*force;b.vy+=(dy/d*radial+(kind==='vortex'?dx/d:0))*force;limit(b);
  }
}
export function skillStateCreate() { return {total:0,bankCharge:false,wallWaves:0,transfer:[],transferSpent:[],frostSpent:[],delayed:[],vortex:null,eddies:[],relayExtra:false,charged:null,chargedSpent:false,slingTarget:0,slingUsed:false,rewindBloom:false,echoDrain:false,teleport:0}; }
export function skillStateValid(v,count) {
  if(!v||typeof v!=='object'||Array.isArray(v)||Object.keys(v).some(k=>!Object.hasOwn(skillStateCreate(),k)))return false;
  if(!Number.isFinite(v.total)||v.total<0||v.total>33||!Number.isInteger(v.wallWaves)||v.wallWaves<0||v.wallWaves>2||!Number.isSafeInteger(v.teleport)||v.teleport<0||v.teleport>10000)return false;
  if(['bankCharge','relayExtra','chargedSpent','slingUsed','rewindBloom','echoDrain'].some(k=>typeof v[k]!=='boolean'))return false;
  const ids=a=>Array.isArray(a)&&a.length<=2&&new Set(a).size===a.length&&a.every(n=>Number.isInteger(n)&&n>0&&n<=count);
  if(!ids(v.transfer)||!ids(v.transferSpent)||!ids(v.frostSpent)||v.transferSpent.some(id=>!v.transfer.includes(id)))return false;
  if(v.charged!==null&&(!Number.isInteger(v.charged)||v.charged<1||v.charged>count)||!Number.isInteger(v.slingTarget)||v.slingTarget<0||v.slingTarget>count)return false;
  const point=p=>p&&Number.isFinite(p.x)&&Number.isFinite(p.y)&&p.x>=30&&p.x<=930&&p.y>=30&&p.y<=610&&Number.isFinite(p.seconds)&&p.seconds>=0&&p.seconds<=1;
  return Array.isArray(v.delayed)&&v.delayed.length<=2&&v.delayed.every(p=>point(p)&&['ripple','attract'].includes(p.kind)&&Number.isFinite(p.radius)&&p.radius>0&&p.radius<=528)&&Array.isArray(v.eddies)&&v.eddies.length<=2&&v.eddies.every(point)&&(v.vortex===null||point(v.vortex));
}
export function skillActivate(state,kind,body,events) {
  if(!state.build)return;
  const c=skillConfig(state,kind),e=effect(state,kind),v=state.skillState;
  if(['ripple','attract','vortex'].includes(kind)) {
    const radius=440*(c.foundation&&kind!=='vortex'?1.2:1),strength=640*(c.a?1.25:c.b?.85:1);
    pressure(state,body.x,body.y,radius,strength,kind,c);
    if(kind==='vortex'&&(c.foundation||c.capstone))v.vortex={x:body.x,y:body.y,seconds:1};
    if(c.capstone&&kind!=='vortex')v.delayed.push({x:body.x,y:body.y,radius,seconds:.5,kind:kind==='ripple'?'attract':'ripple'});
  }
  if(!e)return;
  if(c.duration)e.seconds=c.duration;
  if(kind==='orbit')e.satellites=e.satellites.slice(0,c.count);
  if(kind==='relay'){e.remaining=c.count;if(c.b)e.seconds=7;}
  if(kind==='lightning') {
    if(c.a||c.b) {const candidates=state.bodies.slice(1).filter(b=>b.id!==body.id&&!state.chain.includes(b.id));let chosen=[];while(chosen.length<c.count&&candidates.length){candidates.sort((a,b)=>{const dist=p=>Math.min(...(chosen.length?chosen:[body]).map(q=>Math.hypot(p.x-q.x,p.y-q.y)));return (c.a?-1:1)*(dist(a)-dist(b))||a.id-b.id;});chosen.push(candidates.shift());}if(chosen.length)e.targets=chosen.map(b=>b.id);}
    e.targets=e.targets.slice(0,c.count);if(c.capstone)v.charged=e.targets[0];
  }
  if(kind==='pulse'){e.remaining=c.count;e.next=(c.count-1)*c.beat;e.seconds=e.next+.01;}
  if(kind==='tether'&&!c.foundation)e.links=e.links.slice(0,1);
  if(kind==='split')e.shards=e.shards.slice(0,c.count);
  if(kind==='comet')v.bankCharge=false;
  if(kind==='impact') {
    if(c.b)pressure(state,body.x,body.y,150,150);
  }
}
export function skillContact(state,body,events) {
  if(!state.build)return;
  const v=state.skillState,s=state.bodies[0];
  if(effect(state,'comet')&&skillFlags(state,'comet').a)v.bankCharge=true;
  if(effect(state,'magnet')&&skillFlags(state,'magnet').capstone){const d=Math.max(1,Math.hypot(body.x-s.x,body.y-s.y));body.vx+=(body.x-s.x)/d*150;body.vy+=(body.y-s.y)/d*150;limit(body);}
  if(effect(state,'impact')&&skillFlags(state,'impact').capstone&&v.transfer.length<2&&!v.transfer.includes(body.id))v.transfer.push(body.id);
  if(v.slingTarget===body.id&&!v.slingUsed&&skillFlags(state,'slingshot').capstone){v.slingUsed=true;state.effects=state.effects.filter(e=>e.kind!=='slingshot');state.effects.push({kind:'slingshot',seconds:.42,targets:[],anchor:body.id,angle:Math.atan2(s.y-body.y,s.x-body.x),spin:1,radius:body.radius+30});}
  if(effect(state,'rewind')?.returning&&skillFlags(state,'rewind').capstone&&state.chain.length===5&&!v.rewindBloom){v.rewindBloom=true;pressure(state,s.x,s.y,300,200);events.push({type:'skill-wave',x:s.x,y:s.y});}
}
export function skillWall(state,body,nx,ny,events) {
  if(!state.build||body.id>0||!state.isFlying)return;
  const v=state.skillState;
  if(effect(state,'comet')&&skillFlags(state,'comet').a&&v.bankCharge){v.bankCharge=false;body.vx+=nx*150;body.vy+=ny*150;limit(body);}
  const c=effect(state,'comet')&&skillFlags(state,'comet').capstone,s=effect(state,'spring')&&skillFlags(state,'spring').capstone;
  if((c||s)&&v.wallWaves<2){v.wallWaves++;for(const b of state.bodies.slice(1)){const d=Math.hypot(b.x-body.x,b.y-body.y);if(d<230){b.vx+=nx*260*(1-d/230);b.vy+=ny*260*(1-d/230);limit(b);}}events.push({type:'skill-wave',x:body.x,y:body.y});}
  if(effect(state,'spring')&&skillFlags(state,'spring').b){const targets=state.bodies.slice(1).filter(b=>!state.chain.includes(b.id)&&((b.x-body.x)*body.vx+(b.y-body.y)*body.vy)>0).sort((a,b)=>Math.hypot(a.x-body.x,a.y-body.y)-Math.hypot(b.x-body.x,b.y-body.y));if(targets[0]){const t=targets[0],speed=Math.hypot(body.vx,body.vy),a=Math.atan2(body.vy,body.vx),d=Math.atan2(Math.sin(Math.atan2(t.y-body.y,t.x-body.x)-a),Math.cos(Math.atan2(t.y-body.y,t.x-body.x)-a)),turn=Math.max(-.2,Math.min(.2,d));body.vx=Math.cos(a+turn)*speed;body.vy=Math.sin(a+turn)*speed;}}
}
export function skillCollision(state,a,b,events,contact) {
  if(!state.build||!state.isFlying||a.id<=0||b.id<=0)return;
  const v=state.skillState,ice=effect(state,'stasis');
  for(const [from,to] of [[a,b],[b,a]]) {
    if(ice&&skillFlags(state,'stasis').capstone&&ice.targets.includes(from.id)&&!ice.targets.includes(to.id)&&v.frostSpent.length<2&&!v.frostSpent.includes(from.id)){ice.targets.push(to.id);v.frostSpent.push(from.id);}
    if(v.transfer.includes(from.id)&&!v.transferSpent.includes(from.id)){v.transferSpent.push(from.id);const d=Math.max(1,Math.hypot(to.x-from.x,to.y-from.y));to.vx+=(to.x-from.x)/d*240;to.vy+=(to.y-from.y)/d*240;limit(to);events.push({type:'push',id:to.id,x:to.x,y:to.y,nx:(to.x-from.x)/d,ny:(to.y-from.y)/d});}
    if(v.charged===from.id&&!v.chargedSpent&&!state.chain.includes(to.id)){v.chargedSpent=true;contact(to,from);events.push({type:'relay',fromX:from.x,fromY:from.y,x:to.x,y:to.y,id:to.id});}
  }
}
export function skillTeleport(state,fromX,fromY,x,y,kind) {
  if(!state.build)return;
  state.skillState.teleport++;state.skillState.vortex=null;
  if(kind==='swap'&&skillFlags(state,kind).capstone)pressure(state,fromX,fromY,220,200);
  if(kind==='wrap'&&skillFlags(state,kind).capstone)pressure(state,x,y,180,150);
}
export function skillStep(state,dt,events) {
  if(!state.build||!state.isFlying)return;
  const v=state.skillState,seed=state.bodies[0];
  // The power window can expire before the player finishes coasting.
  v.total=Math.min(32,v.total+dt);
  for(const d of v.delayed){d.seconds-=dt;if(d.seconds<=0){pressure(state,d.x,d.y,d.radius,230,d.kind);events.push({type:'skill-wave',x:d.x,y:d.y});}}v.delayed=v.delayed.filter(d=>d.seconds>0);
  if(v.vortex){const e=v.vortex,c=skillFlags(state,'vortex');e.seconds-=dt;if(c.capstone){e.x+=(seed.x-e.x)*Math.min(1,dt*5);e.y+=(seed.y-e.y)*Math.min(1,dt*5);}pressure(state,e.x,e.y,440,160*dt,'vortex',c);if(e.seconds<=0)v.vortex=null;}
  const portal=effect(state,'portal');if(portal&&skillFlags(state,'portal').capstone)for(const g of portal.gates)pressure(state,g.x,g.y,145,180*dt);
  const split=effect(state,'split');if(split&&skillFlags(state,'split').capstone&&split.seconds<.5)for(const b of split.shards){const d=Math.max(1,Math.hypot(seed.x-b.x,seed.y-b.y));b.vx+=(seed.x-b.x)/d*900*dt;b.vy+=(seed.y-b.y)/d*900*dt;limit(b);}
  if(effect(state,'drunk')&&skillFlags(state,'drunk').capstone)for(const b of state.bodies.slice(1).filter(b=>!state.chain.includes(b.id)&&Math.hypot(b.x-seed.x,b.y-seed.y)<230).slice(0,3)){const speed=Math.max(1,Math.hypot(seed.vx,seed.vy)),f=Math.sin(state.tick*dt*Math.PI*2/.75)*180*dt;b.vx-=seed.vy/speed*f;b.vy+=seed.vx/speed*f;limit(b);}
  // A crossing requires separated trail samples; adjacent samples never make an eddy.
  const wake=effect(state,'wake');if(wake&&skillFlags(state,'wake').capstone&&state.tick%12===0&&v.eddies.length<2){const p=wake.trail.at(-1);if(p&&wake.trail.some((q,i)=>i<wake.trail.length-24&&Math.hypot(p.x-q.x,p.y-q.y)<25)&&!v.eddies.some(e=>Math.hypot(e.x-p.x,e.y-p.y)<60))v.eddies.push({x:p.x,y:p.y,seconds:1});}
  for(const e of v.eddies){if(e.seconds>0){e.seconds=Math.max(0,e.seconds-dt);pressure(state,e.x,e.y,100,170*dt,'vortex');}}
}
