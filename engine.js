import { trackLayout, environmentValid, environmentStep, regionFrozen } from './track.js?v=ff2e6bff1b7be4153335e346786927680ea20b642555b591226b0cfb27ff13ff';
import { jellyRole } from './music.js?v=b5008c456a438e56836f418bb2a46e76360a0b81d9e9ecd8f24456170e3e90e8';
import { buildValidate, skillFlags, skillConfig, skillStateCreate, skillStateValid, skillActivate, skillContact, skillWall, skillCollision, skillTeleport, skillStep, pressure } from './skill-effect.js?v=2fc91b76fce932fd628970e620536c90ac0648f4d8d41e17bc386ffa52a77a63';
export { skillFlags } from './skill-effect.js?v=2fc91b76fce932fd628970e620536c90ac0648f4d8d41e17bc386ffa52a77a63';
// Deterministic fixed-step circle physics; the renderer and audio consume events.
export const RULE = Object.freeze({ width: 960, height: 640, inset: 30, step: 1 / 120, version: 18, settleSeconds: 2, settleSpeed: 12, settleDrag: 4.8, homingSeconds: 5, homingReach: 360, homingTurn: 3.4, drunkSeconds: 4, echoLeash: 48, stasisSpeed: 100, powerRadius: 440, powerImpulse: 640, plucks: 12, bloomNotes: 5, goalBlooms: 3, flightSeconds: 7, seedRadius: 14 });
export const COLORS = ['#73f5dc', '#a7a0ff', '#ff97d9', '#8bd8ff', '#e3f48f'];
export function seedHash(seed) { let hash = 2166136261; for (const char of String(seed)) hash = Math.imul(hash ^ char.charCodeAt(0), 16777619); return hash >>> 0 || 1; }
export const POWERS = Object.freeze({
  ripple: { name: 'Ripple', symbol: '◎', color: '#9ff5df', description: 'Push nearby jellies outward.' },
  attract: { name: 'Attract', symbol: '✦', color: '#ffb5de', description: 'Pull nearby jellies together.' },
  vortex: { name: 'Vortex', symbol: '↻', color: '#c4b6ff', description: 'Send nearby jellies swirling.' },
  stasis: { name: 'Stasis', symbol: '❄', color: '#a4e8ff', description: 'Freeze jellies for this pluck. After a hit they turn translucent: pass through their soft outward pressure without losing speed.' },
  comet: { name: 'Comet', symbol: '☄', color: '#ffd293', description: 'Launch at comet speed and keep your momentum through bounces for this pluck.' },
  swap: { name: 'Swap', symbol: '⇄', color: '#f3b3ff', description: 'Exchange places with the farthest jelly and keep moving.' },
  magnet: { name: 'Magnet', symbol: '∩', color: '#ffb3cd', description: 'Draw unhit jellies toward your moving seed for 2.4 seconds.' },
  lightning: { name: 'Lightning', symbol: 'ϟ', color: '#b9dfff', description: 'Strike three different jellies in quick succession and knock them away.' },
  impact: { name: 'Impact', symbol: '»', color: '#ffe39e', description: 'Give your seed much stronger pushes for the rest of this pluck.' },
  tether: { name: 'Tether', symbol: '△', color: '#b4f6d2', description: 'Link three jellies with stretchy musical threads. The group drifts toward your moving seed for four seconds.' },
  split: { name: 'Split', symbol: '⋔', color: '#c9c0ff', description: 'Fan into three little seeds for three seconds. All three collect powers; every jelly still scores once.' },
  bubble: { name: 'Bubble', symbol: '◯', color: '#aaeaff', description: 'Float through jellies without bouncing. Smooth pressure pushes them outward and gently nudges you away, growing stronger with overlap; touches still play notes.' },
  portal: { name: 'Portal', symbol: '◌', color: '#b4ffe7', description: 'Open two gates across the pool. Pass through either and keep your speed.' },
  echo: { name: 'Echo', symbol: '◔', color: '#c7d1ff', description: 'A ghost trails half a second behind, gently seeking nearby unhit jellies. It shares your chain and springs back toward your path.' },
  slingshot: { name: 'Slingshot', symbol: '➹', color: '#ffc99f', description: 'Orbit the marked jelly briefly, then launch toward an untouched jelly.' },
  relay: { name: 'Relay', symbol: '⌁', color: '#ffe6a3', description: 'The next three scored jellies each relay one bump: wake a new jelly or activate a marked power, refreshing your flight.' },
  wake: { name: 'Wake', symbol: '≋', color: '#89f4ef', description: 'Leave a flowing current for five seconds. Crossing jellies are swept along your trail.' },
  spring: { name: 'Spring', symbol: '∧', color: '#f6c0ff', description: 'Elastic walls launch your seeds back into the pool for five seconds.' },
  orbit: { name: 'Orbit', symbol: '◉', color: '#ffdc9a', description: 'Gather up to two untouched jellies as satellites, then fling them outward after three seconds.' },
  rewind: { name: 'Rewind', symbol: '≪', color: '#b7b9ff', description: 'At the end of this flight, retrace its recent path for a quick encore. Moving jellies can become new notes.' },
  pulse: { name: 'Pulse', symbol: '◴', color: '#ffadc7', description: 'Erupt at three random spots across the pool, pushing jellies away one beat at a time.' },
  drunk: { name: 'Drunk', symbol: '∿', color: '#ffacd8', description: 'Swerve side to side for four seconds without losing speed. Split seeds get tipsy too.' },
  wrap: { name: 'Wrap', symbol: '⇥', color: '#8cefff', description: 'Cross any wall and emerge at the opposite edge for five seconds. Keep your direction and momentum; Split seeds wrap too. Replaces wall bounces, including Spring.' },
  blaster: { name: 'Blaster', symbol: '✧', color: '#fff0a8', description: 'Automatically aim and fire three gel shots after contact, with no further input. Shots push jellies, play notes and give you a little recoil.' },
  homing: { name: 'Homing', symbol: '➶', color: '#c1ffa2', description: 'Curve toward nearby unhit jellies ahead for five seconds. Keep your momentum and seek a new target after each hit. Split seeds home too; green brackets show the target.' }
});
const powerKinds = Object.keys(POWERS);
const offeredKinds = state => state.build ? state.build.map(p=>p.power) : powerKinds;
// A seeded shuffle changes each offer, with distinct powers in a multi-pickup shot.
function randomOfferKinds(state){return offeredKinds(state).slice().sort((a,b)=>seedHash(state.seed+':offer:'+state.power.claims+':'+a)-seedHash(state.seed+':offer:'+state.power.claims+':'+b));}
function powerCreate(seed) { const hash = seedHash(seed); return { offer: powerKinds[hash % powerKinds.length], target: hash % 14 + 1, shot: 0, claims: 0, used: 0, capacity: 1, markers: [] }; }
export function powerAllowance(state) { return state.power.capacity; }
// The preview and flight share one allocation; contacts only remove existing markers.
function powerPlan(state, count = powerAllowance(state)) {
  const markers = [], power = state.power, kinds=state.randomPowers?randomOfferKinds(state):offeredKinds(state);
  for (let index = 0; index < count; index++) {
    const kind = kinds[((state.randomPowers?0:Math.max(0,kinds.indexOf(power.offer))) + index) % kinds.length];
    const candidates = state.bodies.slice(1).filter(body => body.id !== power.target && !markers.some(marker => marker.target === body.id));
    const unhit = candidates.filter(body => !state.chain.includes(body.id));
    const pool = unhit.length ? unhit : candidates;
    const target = index === 0 ? power.target : pool[seedHash(state.seed + ':' + power.claims + ':' + index) % pool.length].id;
    markers.push({ kind, target });
  }
  return markers;
}
export function powerMarkers(state) { return state.isFlying ? state.power.markers : powerPlan(state); }
export function powerAvailable(state) { return powerMarkers(state).length > 0; }
function powerNext(state) {
  const power = state.power; power.claims++;
  const kinds=offeredKinds(state);power.offer = state.randomPowers?randomOfferKinds(state)[0]:kinds[(kinds.indexOf(power.offer) + 1) % kinds.length];
  powerTargetNext(state);
}
function powerTargetNext(state) {
  const power = state.power;
  const candidates = state.bodies.slice(1).filter(body => body.id !== power.target && !state.chain.includes(body.id));
  power.target = candidates.length ? candidates[seedHash(state.seed + ':' + power.claims) % candidates.length].id : (power.target + seedHash(state.seed + ':' + power.claims) % (state.bodies.length-2)) % (state.bodies.length-1) + 1;
}
// Optional v2 configuration. Missing configuration preserves legacy power behavior.
export function blasterTarget(state) {
  const seed=state.bodies[0];
  const pending=new Set((effectGet(state,'blaster')?.shots||[]).map(shot=>shot.target));
  const candidates=state.bodies.slice(1).filter(body=>!state.chain.includes(body.id)&&!pending.has(body.id));
  candidates.sort((a,b)=>Math.hypot(a.x-seed.x,a.y-seed.y)-Math.hypot(b.x-seed.x,b.y-seed.y)||a.id-b.id);
  const target=candidates[0];if(!target)return null;
  // Predict the intercept; targeting remains deterministic and never changes launch aim.
  const dx=target.x-seed.x,dy=target.y-seed.y;
  const a=target.vx**2+target.vy**2-980**2,b=2*(dx*target.vx+dy*target.vy),c=dx**2+dy**2;
  const disc=b*b-4*a*c;
  const roots=disc>=0&&Math.abs(a)>1e-6?[(-b-Math.sqrt(disc))/(2*a),(-b+Math.sqrt(disc))/(2*a)]:[];
  const time=Math.min(1.2,...roots.filter(t=>t>0));
  return {id:target.id,x:Math.max(35,Math.min(925,target.x+target.vx*time)),y:Math.max(35,Math.min(605,target.y+target.vy*time))};
}
function blasterFire(state) {
  const target=blasterTarget(state);if(!target)return [];
  const {x,y}=target;
  const effect = effectGet(state, 'blaster'), seed = state.bodies[0];
  if (!state.isFlying || state.isOver || !effect || effect.ammo < 1 || effect.cooldown > 0 || !Number.isFinite(x) || !Number.isFinite(y)) return [];
  const distance = Math.hypot(x-seed.x,y-seed.y);
  if (distance < 1) return [];
  const aim = Math.atan2(y-seed.y,x-seed.x), flags = skillFlags(state,'blaster'), volley = effect.volley++;
  effect.ammo--; effect.cooldown = .45; effect.hits.push([]);
  for (const offset of flags.b ? [-.14,0,.14] : [0]) {
    const a=aim+offset, nx=Math.cos(a),ny=Math.sin(a);
    effect.shots.push({x:Math.max(35,Math.min(925,seed.x+nx*(seed.radius+7))),y:Math.max(35,Math.min(605,seed.y+ny*(seed.radius+7))),vx:nx*980,vy:ny*980,life:1.6,bounces:flags.a?1:0,volley,target:target.id});
  }
  seed.vx-=Math.cos(aim)*45;seed.vy-=Math.sin(aim)*45;velocityLimit(seed);
  return [{type:'blaster-fire',x:seed.x,y:seed.y,nx:Math.cos(aim),ny:Math.sin(aim),ammo:effect.ammo}];
}
function blasterStep(state, events) {
  const effect=effectGet(state,'blaster'); if(!effect) return;
  effect.cooldown=Math.max(0,effect.cooldown-RULE.step);
  for(const shot of effect.shots) {
    shot.life-=RULE.step;shot.x+=shot.vx*RULE.step;shot.y+=shot.vy*RULE.step;
    const nx=shot.x<35?1:shot.x>925?-1:0,ny=shot.y<35?1:shot.y>605?-1:0;
    if(nx||ny) {
      if(shot.bounces>0) {shot.bounces--;if(nx)shot.vx*=-1;if(ny)shot.vy*=-1;shot.x=Math.max(35,Math.min(925,shot.x));shot.y=Math.max(35,Math.min(605,shot.y));events.push({type:'blaster-bank',x:shot.x,y:shot.y});}
      else shot.life=0;
    }
    if(shot.life<=0)continue;
    for(const jelly of state.bodies.slice(1)) {
      if(effect.hits[shot.volley].includes(jelly.id)||Math.hypot(jelly.x-shot.x,jelly.y-shot.y)>jelly.radius+5)continue;
      effect.hits[shot.volley].push(jelly.id);shot.life=0;
      const speed=Math.hypot(shot.vx,shot.vy),dx=shot.vx/speed,dy=shot.vy/speed;
      jelly.vx+=dx*260;jelly.vy+=dy*260;velocityLimit(jelly);
      const marker=state.power.markers.find(item=>item.target===jelly.id);
      if(marker)powerCollect(state,marker,state.bodies[0],jelly,dx,dy,events);
      scoreContact(state,jelly,{id:-4,vx:shot.vx,vy:shot.vy},events);
      events.push({type:'blaster-hit',id:jelly.id,x:jelly.x,y:jelly.y,nx:dx,ny:dy});break;
    }
  }
  effect.shots=effect.shots.filter(shot=>shot.life>0);
  events.push(...blasterFire(state));
}
export function effectGet(state, kind) { return state.effects.find(effect => effect.kind === kind); }
export function frozenHit(state, id) { return state.isFlying && state.chain.includes(id) && (!!effectGet(state, 'stasis')?.targets.includes(id)||regionFrozen(state,id)); }
export function seedBodies(state) { return [state.bodies[0], ...(effectGet(state, 'split')?.shards || []), ...(effectGet(state, 'echo')?.isReady ? [effectGet(state, 'echo').ghost] : [])]; }
export function flightDrag(age) {
  const settling = Math.max(0, Math.min(1, (age - (RULE.flightSeconds - RULE.settleSeconds)) / RULE.settleSeconds));
  return .1 + RULE.settleDrag * settling * settling;
}
// Shared by steering and its target cue; selection has no hidden state to save.
export function homingTarget(state, seed) {
  if (!state.isFlying || !effectGet(state, 'homing') || seed.id === -3 ||
      seed.id === 0 && (effectGet(state, 'slingshot') || effectGet(state, 'rewind')?.returning)) return null;
  const speed = Math.hypot(seed.vx, seed.vy);
  if (speed < 45) return null;
  let target = null, best = Infinity;
  for (const body of state.bodies.slice(1)) {
    if (state.chain.includes(body.id) || effectGet(state, 'orbit')?.satellites.includes(body.id)) continue;
    const dx = body.x - seed.x, dy = body.y - seed.y, distance = Math.hypot(dx, dy);
    if (distance < 1 || distance > skillConfig(state,'homing').reach) continue;
    const ahead = (dx * seed.vx + dy * seed.vy) / (distance * speed);
    if (ahead < -.15) continue; // Keep the shot's direction instead of making a U-turn.
    const missingRole=skillFlags(state,'homing').capstone&&!state.chain.some(id=>jellyRole(id)===jellyRole(body.id));
    const cost = distance * (1 + .7 * (1 - ahead))*(missingRole?.7:1);
    if (cost < best || cost === best && body.id < target.id) { target = body; best = cost; }
  }
  return target;
}
function effectClear(state, events = [], kind = null) {
  const split = effectGet(state, 'split');
  if (split && (!kind || kind === 'split')) events.push({ type: 'reunite', x: state.bodies[0].x, y: state.bodies[0].y, from: split.shards.map(({ x, y }) => ({ x, y })) });
  state.effects = kind ? state.effects.filter(effect => effect.kind !== kind) : [];
  if (!effectGet(state, 'bubble')) state.bodies[0].radius = effectGet(state, 'split') ? 10 : RULE.seedRadius;
  const seed = state.bodies[0], inset = RULE.inset + seed.radius;
  seed.x = Math.max(inset, Math.min(RULE.width - inset, seed.x)); seed.y = Math.max(inset, Math.min(RULE.height - inset, seed.y));
}
function velocityLimit(body) {
  const speed = Math.hypot(body.vx, body.vy);
  if (speed > 1600) { body.vx *= 1600 / speed; body.vy *= 1600 / speed; }
}
function effectStep(state, events) {
  if (!state.isFlying) return;
  const seed = state.bodies[0];
  for (const effect of [...state.effects]) {
  const previousSeconds = effect.seconds, config=skillConfig(state,effect.kind);
  if (effect.kind !== 'rewind' || effect.returning) effect.seconds = Math.max(0, effect.seconds - RULE.step);
  if (effect.kind === 'wake') {
    effect.trail = effect.trail.map(p => ({ ...p, age: p.age + RULE.step })).filter(p => p.age < 1.8);
    if (state.tick % 4 === 0) for (const body of [seed, ...(effectGet(state, 'split')?.shards || [])]) {
      const speed = Math.max(1, Math.hypot(body.vx, body.vy));
      effect.trail.push({ x: body.x, y: body.y, nx: body.vx / speed, ny: body.vy / speed, age: 0 });
    }
    effect.trail = effect.trail.slice(-162);
    for (const body of state.bodies.slice(1)) {
      const point = effect.trail.filter(p => Math.hypot(body.x-p.x,body.y-p.y)<body.radius+(config.a?16:config.b?44:28)).sort((a,b)=>a.age-b.age)[0];
      if (point) { body.vx += point.nx * (config.a?1450:config.b?700:1000) * RULE.step; body.vy += point.ny * (config.a?1450:config.b?700:1000) * RULE.step; velocityLimit(body); }
    }
  }
  if (effect.kind === 'orbit') {
    effect.phase += RULE.step * config.turn;
    for (const [i, id] of effect.satellites.entries()) {
      const body = state.bodies[id], angle = effect.phase + i * Math.PI, radius = seed.radius + body.radius + config.reach;
      body.x = seed.x + Math.cos(angle) * radius; body.y = seed.y + Math.sin(angle) * radius;
      body.vx = seed.vx - Math.sin(angle) * 500; body.vy = seed.vy + Math.cos(angle) * 500;
      if (effect.seconds === 0) { const out=config.capstone?Math.atan2(Math.sin(angle)*.55+Math.sin(Math.atan2(seed.vy,seed.vx))*.45,Math.cos(angle)*.55+Math.cos(Math.atan2(seed.vy,seed.vx))*.45):angle;body.vx = Math.cos(out)*800 + seed.vx*.3; body.vy = Math.sin(out)*800 + seed.vy*.3; velocityLimit(body); events.push({type:'orbit-release',id,x:body.x,y:body.y,nx:Math.cos(angle),ny:Math.sin(angle)}); }
    }
  }
  if (effect.kind === 'pulse' && effect.seconds <= effect.next) {
    const beat = config.count - effect.remaining, margin = RULE.inset + 60;
    // Saved RNG keeps each new wave unpredictable in play and exact on resume.
    let x=margin+random(state)*(RULE.width-2*margin),y=margin+random(state)*(RULE.height-2*margin);
    if(config.capstone&&effect.remaining===1){const targets=state.bodies.slice(1).filter(b=>!state.chain.includes(b.id));if(targets.length){const t=targets[Math.floor(random(state)*targets.length)];x=x*.35+t.x*.65;y=y*.35+t.y*.65;}}
    for (const body of state.bodies.slice(1)) {
      const dx=body.x-x,dy=body.y-y,d=Math.max(1,Math.hypot(dx,dy));
      if(d<460) { const impulse=config.force*(1-d/600); body.vx+=dx/d*impulse;body.vy+=dy/d*impulse;velocityLimit(body); }
    }
    events.push({type:'pulse',x,y,beat}); effect.remaining--; effect.next=Math.max(0,effect.next-config.beat);
    if (!effect.remaining) effect.seconds=0;
  }
  if (effect.kind === 'rewind' && effect.returning) {
    const point=!config.legacy&&config.a&&state.tick%2?effect.route.at(-1):effect.route.pop();
    if(point) { const dx=point.x-seed.x,dy=point.y-seed.y;if(state.build&&Math.hypot(dx,dy)>60){skillTeleport(state,seed.x,seed.y,point.x,point.y,'rewind');events.push({type:'teleport',id:0,x:point.x,y:point.y,from:{x:seed.x,y:seed.y}});}seed.vx=dx/RULE.step;seed.vy=dy/RULE.step;velocityLimit(seed);seed.x=point.x;seed.y=point.y;
      if(!config.legacy&&config.b){const fade=Math.sin(Math.PI*Math.min(1,effect.route.length/(config.foundation?240:120)));seed.x=Math.max(44,Math.min(916,seed.x+Math.cos(state.tick*.025)*12*fade));seed.y=Math.max(44,Math.min(596,seed.y+Math.sin(state.tick*.025)*12*fade));} }
    if(!effect.route.length) effect.seconds=0;
  }
  if (effect.kind === 'homing' && effect.seconds > 0) {
    for (const body of [seed, ...(effectGet(state, 'split')?.shards || [])]) {
      const target = homingTarget(state, body);
      if (!target) continue;
      const speed = Math.hypot(body.vx, body.vy), heading = Math.atan2(body.vy, body.vx);
      const lead = Math.min(.25, Math.hypot(target.x - body.x, target.y - body.y) / speed * .4);
      const aim = Math.atan2(target.y + target.vy * lead - body.y, target.x + target.vx * lead - body.x);
      const error = Math.atan2(Math.sin(aim - heading), Math.cos(aim - heading));
      const limit = skillConfig(state,'homing').turn * RULE.step, turn = Math.max(-limit, Math.min(limit, error));
      body.vx = Math.cos(heading + turn) * speed; body.vy = Math.sin(heading + turn) * speed;
    }
  }
  if (effect.kind === 'drunk') {
    // Integrate a bounded heading offset, preserving speed and deterministic saves.
    const sway = t => Math.sin(Math.PI * Math.min(1, t / .3) / 2) * Math.sin(Math.PI * Math.min(1, (RULE.drunkSeconds - t) / .6) / 2)
      * (config.a?.55:config.b?1.35:1)*(.68 * Math.sin(t * Math.PI * 2 / (!config.legacy&&config.foundation?.75:config.b?1.6:1.2)) + .16 * Math.sin(t * Math.PI * 2 / (!config.legacy&&config.foundation?1.5:config.b?1:.7)));
    const turn = sway(RULE.drunkSeconds - effect.seconds) - sway(RULE.drunkSeconds - previousSeconds);
    const cos = Math.cos(turn), sin = Math.sin(turn);
    for (const body of [seed, ...(effectGet(state, 'split')?.shards || [])]) {
      if (body.id === 0 && effectGet(state, 'slingshot')) continue;
      const vx = body.vx; body.vx = vx * cos - body.vy * sin; body.vy = vx * sin + body.vy * cos;
    }
  }
  if (effect.kind === 'portal') effect.cooldown = Math.max(0, effect.cooldown - RULE.step);
  if (effect.kind === 'echo' && (effect.path.length === 60 || state.skillState?.echoDrain && effect.path.length)) {
    const point = effect.path.shift(), ghost = effect.ghost, follow = effect.follow;
    const jumped = effect.isReady && (Math.hypot(point.x - follow.x, point.y - follow.y) > 60 || state.build&&point.teleport!==follow.teleport);
    if (jumped) events.push({ type: 'echo-jump', x: point.x, y: point.y });
    const vx = effect.isReady && !jumped ? (point.x - follow.x) / RULE.step : 0;
    const vy = effect.isReady && !jumped ? (point.y - follow.y) / RULE.step : 0;
    // Bias the existing spring, never teleport or detach from the delayed route.
    // Nearby unhit surfaces compete by distance; targets behind the path are left behind.
    let seekX = 0, seekY = 0, nearest = skillConfig(state,'echo').leash;
    if (config.seek && effect.isReady && !jumped) for (const body of state.bodies.slice(1)) {
      if (state.chain.includes(body.id)) continue;
      const dx = body.x - point.x, dy = body.y - point.y, distance = Math.hypot(dx, dy);
      const gap = Math.max(0, distance - body.radius - point.radius);
      if (gap >= nearest || distance < .001 || dx * vx + dy * vy < -body.radius * Math.hypot(vx, vy)) continue;
      nearest = gap;
      const proximity = 1 - gap / skillConfig(state,'echo').leash;
      const reach = Math.min(distance, skillConfig(state,'echo').leash * .75) * proximity * proximity * (3 - 2 * proximity);
      seekX = dx / distance * reach; seekY = dy / distance * reach;
    }
    for (const [axis, velocity, speed] of [['x', 'vx', vx], ['y', 'vy', vy]]) {
      const offset = effect.isReady && !jumped ? ghost[axis] - follow[axis] : 0;
      const relative = effect.isReady && !jumped ? ghost[velocity] - follow[velocity] : 0;
      const spring = relative + ((config.elastic?100:180) * ((axis === 'x' ? seekX : seekY) - offset) - (config.elastic?14:25) * relative) * RULE.step;
      ghost[axis] = point[axis] + offset + spring * RULE.step;
      ghost[velocity] = speed + spring;
    }
    effect.follow = { x: point.x, y: point.y, vx, vy, ...(state.build?{teleport:point.teleport||0}:{}) };
    ghost.radius = point.radius; velocityLimit(ghost); effect.isReady = true;
  }
  if (effect.kind === 'slingshot') {
    effect.angle += effect.spin * 7 * RULE.step;
    if (effect.seconds === 0) {
      const flags=skillFlags(state,'slingshot'),candidates=state.bodies.slice(1).filter(body=>!state.chain.includes(body.id));
      const forward=candidates.filter(b=>(b.x-seed.x)*seed.vx+(b.y-seed.y)*seed.vy>=0),pool=(flags.a||flags.b)&&forward.length?forward:candidates;
      const target=(flags.legacy||flags.foundation||flags.a||flags.b||flags.capstone)?pool.sort((a,b)=>(flags.b?-1:1)*(Math.hypot(a.x-seed.x,a.y-seed.y)-Math.hypot(b.x-seed.x,b.y-seed.y))||a.id-b.id)[0]:null;
      const lead=target&&(flags.legacy||flags.foundation)?Math.min(.25,Math.hypot(target.x-seed.x,target.y-seed.y)/1050):0;
      if(state.build&&flags.capstone&&!state.skillState.slingUsed)state.skillState.slingTarget=target?.id||0;
      const angle = target ? Math.atan2(Math.max(60, Math.min(580, target.y + target.vy * lead)) - seed.y,
        Math.max(60, Math.min(900, target.x + target.vx * lead)) - seed.x) : effect.angle + effect.spin * Math.PI / 2;
      seed.vx = Math.cos(angle) * 1050; seed.vy = Math.sin(angle) * 1050;
      events.push({ type: 'slingshot', x: seed.x, y: seed.y, target: target?.id || 0 });
    }
  }
  if (effect.kind === 'bubble') {const size=config.size*(config.capstone?1+.1*Math.sin(state.tick*RULE.step*Math.PI*2/.75):1);seed.radius+=Math.max(-140*RULE.step,Math.min(140*RULE.step,size-seed.radius));}
  if (effect.kind === 'tether') {
    // Each member receives one gentle pull, independent of how many links it has.
    for (const id of new Set(effect.links.flatMap(link => [link.a, link.b]))) {
      const body = state.bodies[id], dx = seed.x - body.x, dy = seed.y - body.y, distance = Math.hypot(dx, dy);
      const proximity = Math.min(1, Math.max(0, distance - seed.radius - body.radius) / 180);
      if (distance > .001) {
        const pull = config.pull * proximity * proximity * (3 - 2 * proximity) * RULE.step;
        body.vx += dx / distance * pull; body.vy += dy / distance * pull; velocityLimit(body);
      }
    }
    for (const link of effect.links) {
      const a = state.bodies[link.a], b = state.bodies[link.b], dx = b.x - a.x, dy = b.y - a.y;
      const distance = Math.hypot(dx, dy), nx = distance > .001 ? dx / distance : 1, ny = distance > .001 ? dy / distance : 0;
      const stretch = distance - link.length, relative = (b.vx - a.vx) * nx + (b.vy - a.vy) * ny;
      const force = Math.max(-1100, Math.min(1100, stretch * config.spring + relative * 2));
      a.vx += nx * force * RULE.step; a.vy += ny * force * RULE.step;
      b.vx -= nx * force * RULE.step; b.vy -= ny * force * RULE.step; velocityLimit(a); velocityLimit(b);
      link.cooldown = Math.max(0, link.cooldown - RULE.step);
      if (link.cooldown === 0 && stretch > 14 && Math.abs(relative) > 35) {
        events.push({ type: 'tether', a: a.id, b: b.id, tone: a.tone, x: (a.x + b.x) / 2, y: (a.y + b.y) / 2 });
        link.cooldown = .55;
      }
    }
  }
  if (effect.kind === 'magnet') {
    for (const body of state.bodies.slice(1)) {
      if (state.chain.includes(body.id)) continue;
      const dx = seed.x - body.x, dy = seed.y - body.y, distance = Math.hypot(dx, dy);
      if (distance > seed.radius + body.radius && distance < config.reach) {
        const force = config.force * (1 - .5 * distance / config.reach) * RULE.step;
        body.vx += dx / distance * force; body.vy += dy / distance * force; velocityLimit(body);
      }
    }
  }
  if (effect.kind === 'lightning' && effect.seconds === 0) {
    const body = state.bodies[effect.targets.shift()], dx = body.x - seed.x, dy = body.y - seed.y;
    const distance = Math.hypot(dx, dy), nx = distance > .001 ? dx / distance : 1, ny = distance > .001 ? dy / distance : 0;
    body.vx += nx * 850; body.vy += ny * 850; velocityLimit(body);
    events.push({ type: 'lightning', id: body.id, index: 3 - effect.targets.length, x: body.x, y: body.y, fromX: seed.x, fromY: seed.y, nx, ny });
    if (effect.targets.length) effect.seconds = .22;
  }
  if(effect.seconds===0&&effect.kind==='tether'&&config.capstone)for(const link of effect.links){const a=state.bodies[link.a],b=state.bodies[link.b],d=Math.max(1,Math.hypot(b.x-a.x,b.y-a.y)),force=Math.max(0,Math.min(300,(d-link.length)*5));a.vx-=(b.x-a.x)/d*force;a.vy-=(b.y-a.y)/d*force;b.vx+=(b.x-a.x)/d*force;b.vy+=(b.y-a.y)/d*force;velocityLimit(a);velocityLimit(b);}
  if (effect.seconds === 0) effectClear(state, events, effect.kind);
  }
}
function random(state) { let value = state.rng; value ^= value << 13; value ^= value >>> 17; value ^= value << 5; state.rng = value >>> 0; return state.rng / 4294967296; }
export function gameCreate(seed = 'LAGOON', mode = 'challenge', options = {}) {
  const state = { version: RULE.version, seed: String(seed).slice(0, 32), mode, rng: seedHash(seed), tick: 0, score: 0, plucks: RULE.plucks, launches: 0, blooms: 0, bestChain: 0, chain: [], banks: 0, flightAge: 0, isFlying: false, isOver: false, power: powerCreate(seed), effects: [], flightPath: [], objective:{enabled:true,index:0,completed:0,earned:false}, shotStart:0, lastShot:null, bodies: [{ id: 0, x: 480, y: 550, vx: 0, vy: 0, radius: RULE.seedRadius, tone: 0, cooldown: 0 }] };
  const count = options.build && buildValidate(options.build) ? Math.max(12,Math.min(20,Math.trunc(options.population||14))) : 14;
  if(options.build) {if(!buildValidate(options.build))throw new TypeError('Invalid skill build');state.build=structuredClone(options.build);state.skillState=skillStateCreate();state.power.offer=state.build[0].power;state.plucks=options.relaxed?8:6;if(options.randomPowers){state.randomPowers=true;state.power.offer=randomOfferKinds(state)[0];}}
  if(state.build)state.power.target=(state.power.target-1)%count+1;
  for (let index = 0; index < count; index++) {
    const angle = index * 2.399963, ring = index < 5 ? 125 : 270;
    const radius = state.build ? 25+random(state)*13 : 34 + random(state) * 18;
    state.bodies.push({ id: index + 1, x: 480 + Math.cos(angle) * ring + (random(state) - .5) * 24, y: 310 + Math.sin(angle) * ring * .69 + (random(state) - .5) * 24, vx: (random(state) - .5) * 24, vy: (random(state) - .5) * 24, radius, tone: index % COLORS.length, cooldown: 0 });
  }
  if(options.environment){if(!environmentValid(options.environment))throw new TypeError('Invalid track environment');state.environment=structuredClone(options.environment);state.objective.index=(state.environment.pool+seedHash(state.seed))%3;if(state.objective.index===2&&state.build.some(p=>p.power==='wrap'))state.objective.index=1;trackLayout(state,state.environment.pool,state.environment.route);}
  return state;
}
export const gameWon = state => state.mode === 'challenge' && state.isOver && state.blooms >= RULE.goalBlooms;
export function continueFree(state) { if (!state.isOver) return false; state.mode = 'free'; state.isOver = false; return true; }
export function launch(state, angle, power = .7) {
  if (state.isOver || state.isFlying || !Number.isFinite(angle) || !Number.isFinite(power)) return false;
  const seed = state.bodies[0], speed = 280 + Math.max(0, Math.min(1, power)) * 570;
  seed.vx = Math.cos(angle) * speed; seed.vy = Math.sin(angle) * speed;
  state.power.markers = powerPlan(state);
  effectClear(state); state.isFlying = true; state.flightAge = 0; state.chain = []; state.flightPath = []; state.banks = 0; state.launches++; state.power.used = 0; state.shotStart=state.score;state.lastShot=null;if(state.mode!=='song-run')state.objective.earned=false;
  if(state.build)state.skillState=skillStateCreate();
  if (state.mode !== 'free') state.plucks--;
  for (const body of state.bodies) body.cooldown = 0;
  return true;
}
function scoreContact(state, body, collector, events) {
  if(state.chain.includes(body.id)) return;
  state.chain.push(body.id); const chain=state.chain.length;
  skillContact(state,body,events);
  const points=chain*25+(state.banks>0?25:0);state.score+=points;state.bestChain=Math.max(state.bestChain,chain);
  events.push({type:'note',id:body.id,x:body.x,y:body.y,tone:body.tone,chain,points,seedId:collector.id,speed:Math.hypot(collector.vx,collector.vy)});
  const relay=effectGet(state,'relay');
  if(relay && collector.id<=0 && relay.remaining>0) {relay.armed.push(body.id);relay.remaining--;}
  const speed=Math.hypot(collector.vx,collector.vy),boost=Math.max(1,390/Math.max(1,speed));
  if(speed>1 && collector.id<=0 && collector.id!==-3 && !effectGet(state,'slingshot')) {collector.vx*=boost;collector.vy*=boost;}
  if(chain===RULE.bloomNotes) {
    const blaster=effectGet(state,'blaster');
    if(blaster && skillFlags(state,'blaster').capstone && !blaster.reloaded) {blaster.ammo=skillFlags(state,'blaster').foundation?5:3;blaster.reloaded=true;events.push({type:'blaster-reload',x:state.bodies[0].x,y:state.bodies[0].y});}
    const seed=state.bodies[0];if(state.mode==='song-run'&&state.banks>=2)state.objective.bankBloom=true;state.blooms++;state.score+=500;if(state.mode==='challenge'||state.mode==='song-run'&&state.blooms===1)state.plucks++;
    events.push({type:'bloom',x:seed.x,y:seed.y,points:500,banks:state.banks});
    for(const jelly of state.bodies.slice(1)) {const d=Math.max(1,Math.hypot(jelly.x-seed.x,jelly.y-seed.y));jelly.vx+=(jelly.x-seed.x)/d*120;jelly.vy+=(jelly.y-seed.y)/d*120;}
  }
}
function powerCollect(state, marker, a, b, nx, ny, events) {
  const dt=RULE.step,seed=state.bodies[0];
  const kind = marker.kind; state.power.markers = state.power.markers.filter(item => item !== marker); state.power.shot = state.launches; state.power.used++;
  state.flightAge = 0;
  // Pluck-long effects follow the renewed flight; short-lived powers keep their own clocks.
  for (const effect of state.effects) if (['comet', 'impact', 'bubble', 'stasis', 'echo', 'blaster'].includes(effect.kind)) effect.seconds = RULE.flightSeconds;
  const event = { type: 'power', kind, seedId: a.id, x: b.x, y: b.y };
  if(kind==='blaster') {
    const flags=skillFlags(state,'blaster');state.effects.push({kind,seconds:RULE.flightSeconds,targets:[],ammo:!flags.legacy&&flags.foundation?5:3,cooldown:0,volley:0,hits:[],shots:[],reloaded:false});
  } else if (['relay','wake','spring','orbit','rewind','pulse','wrap','homing'].includes(kind)) {
    const effect={kind, seconds:kind==='orbit'?3:kind==='pulse'?2.3:kind==='rewind'?7:5, targets:[]};
    if(kind==='relay') Object.assign(effect,{armed:[],spent:[],remaining:3});
    if(kind==='wake') effect.trail=[];
    if(kind==='orbit') Object.assign(effect,{phase:0,satellites:state.bodies.slice(1).filter(body=>body!==b&&!state.chain.includes(body.id)).sort((a,c)=>Math.hypot(a.x-seed.x,a.y-seed.y)-Math.hypot(c.x-seed.x,c.y-seed.y)||a.id-c.id).slice(0,2).map(body=>body.id)});
    if(kind==='rewind') Object.assign(effect,{returning:false,route:[]});
    if(kind==='pulse') { const beat=.75, delay=(beat-(state.tick*RULE.step)%beat)%beat;Object.assign(effect,{seconds:delay+1.5+RULE.step,next:1.5,remaining:3}); }
    state.effects.push(effect);
  } else if (kind === 'portal') {
    const speed = Math.hypot(seed.vx, seed.vy), dx = speed > 1 ? seed.vx / speed : -nx, dy = speed > 1 ? seed.vy / speed : -ny;
    const entrance = { x: Math.max(100, Math.min(860, seed.x + dx * 70)), y: Math.max(100, Math.min(540, seed.y + dy * 70)) };
    let exit = { x: RULE.width - entrance.x, y: RULE.height - entrance.y };
    if (Math.hypot(exit.x - entrance.x, exit.y - entrance.y) < 300) exit = { x: entrance.x < 480 ? 800 : 160, y: entrance.y < 320 ? 500 : 140 };
    state.effects.push({ kind, seconds: Math.min(5, Math.max(dt, RULE.flightSeconds - state.flightAge)), targets: [], gates: [entrance, exit], cooldown: 0 });
  } else if (kind === 'echo') {
    state.effects.push({ kind, seconds: Math.max(dt, RULE.flightSeconds - state.flightAge), targets: [], path: [], ghost: { ...seed, id: -3, radius: 12, cooldown: 0 }, follow: { x: seed.x, y: seed.y, vx: 0, vy: 0 }, isReady: false });
  } else if (kind === 'slingshot') {
    const angle = Math.atan2(seed.y - b.y, seed.x - b.x), spin = Math.sign((seed.x - b.x) * seed.vy - (seed.y - b.y) * seed.vx) || 1;
    state.effects.push({ kind, seconds: Math.min(.85, Math.max(dt, RULE.flightSeconds - state.flightAge)), targets: [], anchor: b.id, angle, spin, radius: b.radius + RULE.seedRadius + 16 });
  } else if (kind === 'tether') {
    const nearby = state.bodies.slice(1).filter(body => body !== b).sort((a, c) => Math.hypot(a.x - b.x, a.y - b.y) - Math.hypot(c.x - b.x, c.y - b.y) || a.id - c.id).slice(0, 2);
    const linked = [b, ...nearby];
    const links = linked.map((a, index) => { const c = linked[(index + 1) % 3]; return { a: a.id, b: c.id, length: Math.max(a.radius + c.radius + 6, Math.hypot(a.x - c.x, a.y - c.y) * .85), cooldown: index * .15 }; });
    state.effects.push({ kind, seconds: Math.min(4, Math.max(dt, RULE.flightSeconds - state.flightAge)), targets: [], links });
  } else if (kind === 'split') {
    // The fan leaves the contact, so all three seeds have a clear outward launch.
    const angle = Math.atan2(-ny, -nx), speed = Math.max(650, Math.min(1000, Math.hypot(seed.vx, seed.vy)));
    if (!effectGet(state, 'bubble')) seed.radius = 10; seed.vx = Math.cos(angle) * speed; seed.vy = Math.sin(angle) * speed;
    const shards = [-skillConfig(state,'split').fan, skillConfig(state,'split').fan].map((offset, index) => ({ ...seed, id: -index - 1, radius: 10, vx: Math.cos(angle + offset) * speed, vy: Math.sin(angle + offset) * speed }));
    state.effects.push({ kind, seconds: Math.min(3, Math.max(dt, RULE.flightSeconds - state.flightAge)), targets: [], shards });
  } else if (kind === 'bubble') {
    state.effects.push({ kind, seconds: Math.max(dt, RULE.flightSeconds - state.flightAge), targets: [] });
  } else if (kind === 'drunk') {
    state.effects.push({ kind, seconds: RULE.drunkSeconds, targets: [] });
  } else if (kind === 'magnet') {
    state.effects.push({ kind, seconds: 2.4, targets: [] });
  } else if (kind === 'lightning') {
    const targets = state.bodies.slice(1).filter(body => body !== b).sort((a, b) =>
      Number(state.chain.includes(a.id)) - Number(state.chain.includes(b.id)) ||
      Math.hypot(a.x - seed.x, a.y - seed.y) - Math.hypot(b.x - seed.x, b.y - seed.y) || a.id - b.id).slice(0, 3).map(body => body.id);
    state.effects.push({ kind, seconds: .09, targets });
  } else if (kind === 'impact') {
    state.effects.push({ kind, seconds: Math.max(dt, RULE.flightSeconds - state.flightAge), targets: [] });
    const impactForce=450*(skillFlags(state,'impact').a?1.35:skillFlags(state,'impact').b?.7:1);b.vx += nx * impactForce; b.vy += ny * impactForce; velocityLimit(b);
    events.push({ type: 'push', id: b.id, x: b.x, y: b.y, nx, ny });
  } else if (kind === 'comet') {
    state.effects.push({ kind, seconds: Math.max(dt, RULE.flightSeconds - state.flightAge), targets: [] });
    seed.vx = -nx * 1150; seed.vy = -ny * 1150;
  } else if (kind === 'stasis') {
    const targets = state.bodies.slice(1).filter(body => Math.hypot(body.x - b.x, body.y - b.y) < skillConfig(state,'stasis').reach);
    for (const body of targets) {
      if (body === b) continue; // Finish the activating collision before applying its slow cap.
      const falloff = 1 - (Math.hypot(body.x - b.x, body.y - b.y) / RULE.powerRadius) ** 2;
      body.vx *= 1 - .88 * falloff; body.vy *= 1 - .88 * falloff;
    }
    state.effects.push({ kind, seconds: Math.max(dt, RULE.flightSeconds - state.flightAge), targets: targets.map(body => body.id) });
  } else if (kind === 'swap') {
    const flags=skillFlags(state,'swap');
    let candidates=state.bodies.slice(1).filter(body=>body!==b);
    if(!flags.legacy&&flags.foundation){const unhit=candidates.filter(b=>!state.chain.includes(b.id));if(unhit.length)candidates=unhit;}
    if(flags.a){const forward=candidates.filter(b=>(b.x-seed.x)*seed.vx+(b.y-seed.y)*seed.vy>0);if(forward.length)candidates=forward;}
    const rank=body=>flags.b?Math.min(...state.bodies.slice(1).filter(b=>b!==body).map(b=>Math.hypot(b.x-body.x,b.y-body.y)-b.radius-body.radius)):Math.hypot(body.x-seed.x,body.y-seed.y);
    const destination=candidates.sort((a,b)=>rank(b)-rank(a)||a.id-b.id)[0];
    const x = seed.x, y = seed.y;
    seed.x = destination.x; seed.y = destination.y; destination.x = x; destination.y = y;
    Object.assign(event, { exitX: seed.x, exitY: seed.y, destination: destination.id });
  } else if(!state.build) for (const body of state.bodies.slice(1)) {
    if (body === b) continue;
    const dx = body.x - b.x, dy = body.y - b.y, distance = Math.hypot(dx, dy);
    if (distance < RULE.powerRadius) {
      const falloff = 1 - (distance / RULE.powerRadius) ** 2;
      if (distance > 1) {
        const impulse = RULE.powerImpulse * falloff, nx = dx / distance, ny = dy / distance;
        body.vx += (kind === 'vortex' ? -ny : kind === 'attract' ? -nx : nx) * impulse;
        body.vy += (kind === 'vortex' ? nx : kind === 'attract' ? -ny : ny) * impulse;
      }
    }
  }
  skillActivate(state,kind,b,events);
  if(kind==='swap')skillTeleport(state,event.x,event.y,event.exitX,event.exitY,'swap');
  events.push(event);
  powerNext(state);
}
export function physicsStep(state) {
  if (state.isOver) return [];
  const dt = RULE.step, events = [], seed = state.bodies[0]; state.tick++;
  if (state.isFlying) state.flightAge = Math.min(RULE.flightSeconds, state.flightAge + dt);
  skillStep(state,dt,events);
  effectStep(state, events);
  environmentStep(state,dt,skillTeleport,events);
  const bodies = [...seedBodies(state), ...state.bodies.slice(1)];
  for (const body of bodies) {
    body.cooldown = Math.max(0, body.cooldown - dt);
    if (body.id === -3 || effectGet(state, 'orbit')?.satellites.includes(body.id) || body.id === 0 && (effectGet(state, 'slingshot') || effectGet(state,'rewind')?.returning)) continue;
    if (body.id > 0) { body.vx += Math.cos(state.tick * .002 + body.id * 1.7) * 4 * dt; body.vy += Math.sin(state.tick * .0025 + body.id * 2.1) * 4 * dt; }
    const drag = Math.exp(-(body.id <= 0 ? state.isFlying ? flightDrag(state.flightAge)*(effectGet(state,'comet')&&skillFlags(state,'comet').b&&state.flightAge>3?.5:1) : 3 : (effectGet(state, 'stasis')?.targets.includes(body.id)||regionFrozen(state,body.id)) ? 5 : .65) * dt);
    body.vx *= drag; body.vy *= drag; body.x += body.vx * dt; body.y += body.vy * dt;
    const left = RULE.inset + body.radius, right = RULE.width - left, top = RULE.inset + body.radius, bottom = RULE.height - top;
    if (body.id <= 0 && state.isFlying && effectGet(state, 'wrap')) {
      const wrap=skillFlags(state,'wrap');
      const nx = !wrap.legacy&&wrap.b&&!wrap.a ? 0 : body.x < left && body.vx < 0 ? 1 : body.x > right && body.vx > 0 ? -1 : 0;
      const ny = !wrap.legacy&&wrap.a&&!wrap.b ? 0 : body.y < top && body.vy < 0 ? 1 : body.y > bottom && body.vy > 0 ? -1 : 0;
      if (nx || ny) {
        const fromX = Math.max(left, Math.min(right, body.x)), fromY = Math.max(top, Math.min(bottom, body.y));
        // Carry the overshoot across each crossed edge, including diagonal corners.
        if (nx) body.x = left + ((body.x - left) % (right - left) + right - left) % (right - left);
        if (ny) body.y = top + ((body.y - top) % (bottom - top) + bottom - top) % (bottom - top);
        skillTeleport(state,fromX,fromY,body.x,body.y,'wrap');events.push({ type: 'wrap', id: body.id, fromX, fromY, x: body.x, y: body.y, nx, ny });
      }
    }
    const restitution = body.id === 0 && effectGet(state, 'comet') && skillFlags(state,'comet').foundation ? .99 : .94;
    let speed = 0, normalX = 0, normalY = 0;
    if (body.x < left) { body.x = left; if (body.vx < 0) { speed = -body.vx; body.vx *= -restitution; normalX = 1; } }
    if (body.x > right) { body.x = right; if (body.vx > 0) { speed = body.vx; body.vx *= -restitution; normalX = -1; } }
    if (body.y < top) { body.y = top; if (body.vy < 0) { speed = -body.vy; body.vy *= -restitution; normalY = 1; } }
    if (body.y > bottom) { body.y = bottom; if (body.vy > 0) { speed = body.vy; body.vy *= -restitution; normalY = -1; } }
    if (speed > 25 && body.id <= 0 && effectGet(state,'spring')) {
      body.vx += normalX * Math.max(220,speed*.35)*(skillFlags(state,'spring').a?1.3:1); body.vy += normalY * Math.max(220,speed*.35)*(skillFlags(state,'spring').a?1.3:1); velocityLimit(body);
      events.push({type:'spring',x:body.x,y:body.y,nx:normalX,ny:normalY,speed});
    }
    if (speed > 25) { if (body.id <= 0 && state.isFlying) state.banks++; skillWall(state,body,normalX,normalY,events);events.push({ type: 'wall', id: body.id, x: body.x, y: body.y, nx: normalX, ny: normalY, speed }); }
  }
  if (effectGet(state, 'portal')?.cooldown === 0 && !effectGet(state, 'slingshot') && !effectGet(state,'rewind')?.returning) {
    const effect = effectGet(state, 'portal');
    for (const [index, gate] of effect.gates.entries()) if (Math.hypot(seed.x - gate.x, seed.y - gate.y) < (skillFlags(state,'portal').a?44:30) + seed.radius) {
      const exit = effect.gates[1 - index], speed = Math.hypot(seed.vx, seed.vy);
      if(skillFlags(state,'portal').b){const t=state.bodies.slice(1).filter(b=>!state.chain.includes(b.id)&&((b.x-exit.x)*seed.vx+(b.y-exit.y)*seed.vy)>0).sort((a,b)=>Math.hypot(a.x-exit.x,a.y-exit.y)-Math.hypot(b.x-exit.x,b.y-exit.y))[0];if(t){const a=Math.atan2(seed.vy,seed.vx),d=Math.atan2(Math.sin(Math.atan2(t.y-exit.y,t.x-exit.x)-a),Math.cos(Math.atan2(t.y-exit.y,t.x-exit.x)-a)),turn=Math.max(-.3,Math.min(.3,d));seed.vx=Math.cos(a+turn)*speed;seed.vy=Math.sin(a+turn)*speed;}}
      const nx = speed > .001 ? seed.vx / speed : 1, ny = speed > .001 ? seed.vy / speed : 0;
      const fromX = seed.x, fromY = seed.y;
      seed.x = exit.x + nx * (35 + seed.radius); seed.y = exit.y + ny * (35 + seed.radius); effect.cooldown = .45;
      skillTeleport(state,fromX,fromY,seed.x,seed.y,'portal');events.push({ type: 'portal', fromX, fromY, x: seed.x, y: seed.y }); break;
    }
  }
  for (let pass = 0; pass < 3; pass++) for (let first = 0; first < bodies.length; first++) for (let second = first + 1; second < bodies.length; second++) {
    const a = bodies[first], b = bodies[second];
    if (a.id <= 0 && b.id <= 0 || a.id === 0 && effectGet(state, 'slingshot')) continue;
    if (effectGet(state,'orbit')?.satellites.some(id=>id===a.id||id===b.id)) continue;
    const dx = b.x - a.x, dy = b.y - a.y;
    const distance = Math.hypot(dx, dy), target = a.radius + b.radius;
    if (distance >= target) continue;
    // Physical split seeds collect from the same set; the delayed Echo only scores.
    const marker = a.id <= 0 && a.id >= -2 && state.isFlying ? state.power.markers.find(marker => marker.target === b.id) : null;
    const isFrozenContact = a.id <= 0 && a.id >= -2 && state.isFlying && (effectGet(state, 'stasis') || marker?.kind === 'stasis'||regionFrozen(state,b.id));
    const nx = distance > .0001 ? dx / distance : 1, ny = distance > .0001 ? dy / distance : 0;
    const isBubble = a.id === 0 && state.isFlying && (!!effectGet(state, 'bubble') || marker?.kind === 'bubble');
    const isPermeable = a.id <= 0 && frozenHit(state, b.id);
    if (isPermeable && !isBubble && pass === 0) {
      const depth = 1 - distance / target, pressure = 2200 * skillConfig(state,'stasis').pressure * depth * depth * (3 - 2 * depth) * dt;
      const incomingX = a.vx, incomingY = a.vy, incomingSpeed = Math.hypot(incomingX, incomingY);
      a.vx -= nx * pressure; a.vy -= ny * pressure;
      const speed = Math.hypot(a.vx, a.vy);
      // Pressure bends the shot without letting an opposing field stall it.
      if (speed < incomingSpeed) {
        if (speed > .0001) { a.vx *= incomingSpeed / speed; a.vy *= incomingSpeed / speed; }
        else { a.vx = incomingX; a.vy = incomingY; }
      }
      velocityLimit(a);
    }
    const solidTarget = isPermeable || isBubble ? 0 : target;
    // Bubble is soft all the way through: no core reflection or positional separation.
    // Apply continuous pressure once per step, not once per solver pass.
    if (isBubble && pass === 0) {
      const width = Math.max(RULE.seedRadius, a.radius - (effectGet(state, 'split') ? 10 : RULE.seedRadius));
      const depth = Math.min(1, (target - distance) / width);
      const pressure = 2400 * skillConfig(state,'bubble').pressure * depth * depth * (3 - 2 * depth) * dt * (effectGet(state, 'impact') ? 1.8 : 1);
      b.vx += nx * pressure; b.vy += ny * pressure; velocityLimit(b);
      // A light reaction bends/slows the player gradually instead of ricocheting.
      a.vx -= nx * pressure * .18; a.vy -= ny * pressure * .18; velocityLimit(a);
    }
    const inverseA = a.id === -3 ? .55 : a.id <= 0 ? 1 : 900 / (a.radius * a.radius), inverseB = 900 / (b.radius * b.radius), inverseSum = inverseA + inverseB;
    const correction = Math.max(0, solidTarget - distance - .01) * .92 / inverseSum;
    a.x -= nx * correction * inverseA; a.y -= ny * correction * inverseA; b.x += nx * correction * inverseB; b.y += ny * correction * inverseB;
    const relative = (b.vx - a.vx) * nx + (b.vy - a.vy) * ny;
    if (relative < 0 && distance < solidTarget) {
      const incomingX = a.vx, incomingY = a.vy;
      const impulse = -(1 + .94) * relative / inverseSum;
      a.vx -= impulse * inverseA * nx; a.vy -= impulse * inverseA * ny; b.vx += impulse * inverseB * nx; b.vy += impulse * inverseB * ny;
      if (a.id === -3) { velocityLimit(a); velocityLimit(b); }
      if (isFrozenContact || a.id === 0 && state.isFlying && effectGet(state, 'comet') && skillFlags(state,'comet').foundation) {
        // Frozen surfaces and Comet preserve the same incoming ricochet, applied only once.
        // Only reflect when heading into the jelly; a jelly may catch an outgoing seed.
        const toward = incomingX * nx + incomingY * ny;
        if (toward > 0) {
          a.vx = (incomingX - 2 * toward * nx) * .99;
          a.vy = (incomingY - 2 * toward * ny) * .99;
        }
        velocityLimit(a);
      }
      if (a.id === 0 && state.isFlying && effectGet(state, 'impact') && skillFlags(state,'impact').foundation) {
        const push = Math.max(260, impulse * inverseB * .9)*(skillFlags(state,'impact').a?1.35:skillFlags(state,'impact').b?.7:1);
        b.vx += nx * push; b.vy += ny * push; velocityLimit(b);
        if(skillFlags(state,'impact').b)pressure(state,b.x,b.y,150,150);
        events.push({ type: 'push', id: b.id, x: b.x, y: b.y, nx, ny });
      }
      if (-relative > 22 && a.cooldown <= 0 && b.cooldown <= 0) { events.push({ type: 'impact', a: a.id, b: b.id, x: (a.x + b.x) / 2, y: (a.y + b.y) / 2, nx, ny, speed: -relative, bubble: a.id === 0 && !!effectGet(state, 'bubble') }); a.cooldown = .08; b.cooldown = .08; }
    }
    if (marker) powerCollect(state,marker,a,b,nx,ny,events);
    const stasis = effectGet(state, 'stasis');
    if (a.id <= 0 && state.isFlying && stasis && !stasis.targets.includes(b.id)) stasis.targets.push(b.id);
    if (a.id <= 0 && state.isFlying) scoreContact(state,b,a,events);
    if(pass===0&&relative < -12)skillCollision(state,a,b,events,(target,from)=>{const m=state.power.markers.find(m=>m.target===target.id);if(m)powerCollect(state,m,seed,target,nx,ny,events);scoreContact(state,target,from,events);});
    const relay=effectGet(state,'relay');
    if (state.isFlying && relay && a.id>0 && b.id>0 && relative < -12) {
      for (const [from,to] of [[a,b],[b,a]]) {
        if(!relay.armed.includes(from.id)||relay.spent.includes(from.id)) continue;
        const relayMarker=state.power.markers.find(marker=>marker.target===to.id);
        if(state.chain.includes(to.id)&&!relayMarker) continue;
        relay.spent.push(from.id);
        const flags=skillFlags(state,'relay');if(flags.a){const d=Math.max(1,Math.hypot(to.x-from.x,to.y-from.y));to.vx+=(to.x-from.x)/d*200;to.vy+=(to.y-from.y)/d*200;velocityLimit(to);}
        if(state.build&&flags.capstone&&!state.skillState.relayExtra&&!relay.armed.includes(to.id)){state.skillState.relayExtra=true;relay.armed.push(to.id);}
        // The impact collects for the player, with the same marker and flight rules as a seed hit.
        if(relayMarker) powerCollect(state,relayMarker,seed,to,from===a?nx:-nx,from===a?ny:-ny,events);
        scoreContact(state,to,from,events);
        events.push({type:'relay',x:to.x,y:to.y,fromX:from.x,fromY:from.y,id:to.id});
      }
    }
  }
  if(state.isFlying) blasterStep(state,events);
  if(state.isFlying && !state.objective.earned) {
    const goal=state.objective.index%OBJECTIVES.length,achieved=objectiveProgress(state).progress===1;
    if(achieved) {state.objective.earned=true;state.objective.completed++;state.score+=200;events.push({type:'objective',index:goal,points:200,x:seed.x,y:seed.y});}
  }
  // Apply after every collision, bloom and power impulse so impacts cannot cancel Stasis.
  for (const body of state.bodies.slice(1)) {
    const frozen=effectGet(state,'stasis')?.targets.includes(body.id),region=regionFrozen(state,body.id);if(!frozen&&!region)continue;
    const speed=Math.hypot(body.vx,body.vy),limit=frozen?skillConfig(state,'stasis').speed:100;
    if(speed>limit){body.vx*=limit/speed;body.vy*=limit/speed;}
  }
  if (effectGet(state, 'slingshot')) {
    const effect = effectGet(state, 'slingshot'), anchor = state.bodies[effect.anchor], radius = effect.radius + Math.max(0, seed.radius - RULE.seedRadius);
    seed.x = Math.max(44, Math.min(916, anchor.x + Math.cos(effect.angle) * radius));
    seed.y = Math.max(44, Math.min(596, anchor.y + Math.sin(effect.angle) * radius));
    seed.vx = -Math.sin(effect.angle) * effect.spin * radius * 7;
    seed.vy = Math.cos(effect.angle) * effect.spin * radius * 7;
  }
  for (const body of bodies) { body.x = Math.max(RULE.inset + body.radius, Math.min(RULE.width - RULE.inset - body.radius, body.x)); body.y = Math.max(RULE.inset + body.radius, Math.min(RULE.height - RULE.inset - body.radius, body.y)); }
  if (effectGet(state, 'echo')) {
    const effect = effectGet(state, 'echo'), ghost = effect.ghost, follow = effect.follow;
    if(!state.skillState?.echoDrain)effect.path.push({ x: seed.x, y: seed.y, radius: Math.min(12, seed.radius), ...(state.build?{teleport:state.skillState.teleport}:{}) });
    if(state.build&&skillFlags(state,'echo').capstone&&!state.skillState.echoDrain&&state.flightAge>=6.5&&Math.hypot(seed.vx,seed.vy)<100){state.skillState.echoDrain=true;effect.seconds=.6;}
    if(state.skillState?.echoDrain&&!effect.path.length){effectClear(state,events,'echo');}
    if (!effect.isReady && effect.path.length) { ghost.x = follow.x = effect.path[0].x; ghost.y = follow.y = effect.path[0].y; ghost.radius = effect.path[0].radius; }
    else {
      // Bound the elastic excursion after all contact corrections, without a new bank.
      const dx = ghost.x - follow.x, dy = ghost.y - follow.y, distance = Math.hypot(dx, dy);
      if (distance > skillConfig(state,'echo').leash) {
        const nx = dx / distance, ny = dy / distance;
        ghost.x = follow.x + nx * skillConfig(state,'echo').leash; ghost.y = follow.y + ny * skillConfig(state,'echo').leash;
        const outward = (ghost.vx - follow.vx) * nx + (ghost.vy - follow.vy) * ny;
        if (outward > 0) { ghost.vx -= outward * nx; ghost.vy -= outward * ny; }
        velocityLimit(ghost);
      }
    }
  }
  const rewind=effectGet(state,'rewind');
  if(state.isFlying && !rewind?.returning && (state.build||state.tick%4===0)) { state.flightPath.push({x:seed.x,y:seed.y,...(state.build?{teleport:state.skillState.teleport}:{})});state.flightPath=state.flightPath.slice(state.build?-240:-420); }
  if(state.build&&state.skillState.total>=28)state.flightAge=RULE.flightSeconds;
  if(state.build&&state.skillState.total>=32){effectClear(state,events);seed.vx=seed.vy=0;}
  const ending=!effectGet(state,'echo')&&!effectGet(state,'slingshot')&&!effectGet(state,'orbit')&&!effectGet(state,'pulse')&&state.flightAge>1.5&&seedBodies(state).every(body=>Math.hypot(body.vx,body.vy)<=RULE.settleSpeed);
  if(state.isFlying && (state.flightAge>=RULE.flightSeconds||ending) && rewind && !rewind.returning && state.flightPath.length) {
    rewind.returning=true;rewind.route=(state.build?state.flightPath.slice(-(skillFlags(state,'rewind').foundation?240:120)):state.flightPath).map(p=>({...p}));rewind.seconds=Math.min(state.build?4.1:3.5,rewind.route.length*RULE.step*(skillFlags(state,'rewind').a?2:1)+RULE.step);
    effectClear(state,events,'slingshot');events.push({type:'rewind',x:seed.x,y:seed.y});
  }
  if (state.isFlying && !rewind?.returning && ending) {
    const successful = state.chain.length >= RULE.bloomNotes, previousCapacity = state.power.capacity;
    state.power.capacity = successful ? Math.min(3, previousCapacity + 1) : 1;
    state.power.markers = [];
    effectClear(state, events); state.isFlying = false; seed.vx = seed.vy = 0; state.isOver = state.mode === 'challenge' && (state.blooms >= RULE.goalBlooms || state.plucks <= 0) || state.mode==='song-run'&&state.plucks<=0;
    state.lastShot={notes:state.chain.length,banks:state.banks,points:state.shotStart===null?null:state.score-state.shotStart,powers:state.power.used,bloom:successful,objective:state.objective.earned};
    if(state.objective.earned&&state.mode!=='song-run')state.objective.index++;
    events.push({ type: 'power-streak', successful, capacity: state.power.capacity, previousCapacity });
    events.push({ type: gameWon(state) ? 'win' : state.isOver ? 'over' : 'rest', chain: state.chain.length });
  }
  return events;
}
export function saveValidate(input) {
  if (!input || ![2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, RULE.version].includes(input.version) || typeof input.seed !== 'string' || input.seed.length > 32 || !['challenge', 'free', 'song-run'].includes(input.mode)) return null;
  const count=Array.isArray(input.bodies)?input.bodies.length-1:0;
  if(input.build!==undefined&&(!buildValidate(input.build)||count<12||count>20||!skillStateValid(input.skillState,count)))return null;
  if(input.mode==='song-run'&&!input.build)return null;
  if(input.randomPowers!==undefined&&(input.randomPowers!==true||!input.build))return null;
  if(input.environment!==undefined&&!environmentValid(input.environment))return null;
  if (input.version >= 9 && (!Array.isArray(input.effects) || input.effects.length > 3 || input.effect !== undefined || input.effects.some(effect => !effect?.kind) || new Set(input.effects.map(effect => effect.kind)).size !== input.effects.length)) return null;
  const effects = input.version >= 9 ? input.effects : input.version >= 6 ? [input.effect] : [];
  const hasEffect = kind => effects.some(effect => effect?.kind === kind);
  for (const field of ['rng', 'tick', 'score', 'plucks', 'launches', 'blooms', 'bestChain', 'banks']) if (!Number.isSafeInteger(input[field]) || input[field] < 0) return null;
  if (input.rng < 1 || input.rng > 4294967295 || input.plucks > RULE.plucks || input.bestChain > count || !Number.isFinite(input.flightAge) || input.flightAge < 0 || input.flightAge > RULE.flightSeconds + RULE.step * 2) return null;
  if (typeof input.isFlying !== 'boolean' || typeof input.isOver !== 'boolean' || !Array.isArray(input.bodies) || (!input.build && input.bodies.length !== 15) || !Array.isArray(input.chain) || new Set(input.chain).size !== input.chain.length || input.chain.some(id => !Number.isInteger(id) || id < 1 || id > count)) return null;
  for (const [index, body] of input.bodies.entries()) {
    if (!body || body.id !== index || !Number.isInteger(body.tone) || body.tone < 0 || body.tone >= COLORS.length) return null;
    for (const field of ['x', 'y', 'vx', 'vy', 'radius', 'cooldown']) if (!Number.isFinite(body[field])) return null;
    const seedRadiusValid = input.version >= 7 && hasEffect('bubble') ? body.radius >= (hasEffect('split') ? 10 : 14) && body.radius <= (input.build?46.2:42) : input.version >= 7 && hasEffect('split') ? body.radius === 10 : body.radius === RULE.seedRadius;
    if ((index === 0 ? !seedRadiusValid : body.radius < 14 || body.radius > 52) || Math.abs(body.vx) > 3000 || Math.abs(body.vy) > 3000 || body.cooldown < 0 || body.cooldown > .1) return null;
    if (body.x < RULE.inset + body.radius - 1 || body.x > RULE.width - RULE.inset - body.radius + 1 || body.y < RULE.inset + body.radius - 1 || body.y > RULE.height - RULE.inset - body.radius + 1) return null;
  }
  if (input.isOver && (!['challenge','song-run'].includes(input.mode) || (input.plucks !== 0 && input.blooms < RULE.goalBlooms) || input.isFlying)) return null;
  if (!input.isOver && !input.isFlying && input.mode !== 'free' && input.plucks === 0) return null;
  if (input.version === 3) {
    const ripple = input.ripple;
    if (!ripple || ['charge', 'armed', 'pending'].some(key => typeof ripple[key] !== 'boolean') || !Number.isSafeInteger(ripple.shot) || ripple.shot < 0 || ripple.shot > input.launches) return null;
    if (ripple.armed && (!ripple.charge || input.isFlying) || ripple.pending && (!input.isFlying || ripple.charge || ripple.armed || ripple.shot !== input.launches)) return null;
  }
  if (input.version >= 4) {
    const power = input.power;
    if (!power || !powerKinds.includes(power.offer) || !Number.isInteger(power.target) || power.target < 1 || power.target > count || !Number.isSafeInteger(power.claims) || power.claims < 0 || !Number.isSafeInteger(power.shot) || power.shot < 0 || power.shot > input.launches) return null;
    if (input.version >= 9 && (!Number.isInteger(power.used) || power.used < 0 || power.used > 3 || !Number.isInteger(power.capacity) || power.capacity < 1 || power.capacity > 3 || input.isFlying && power.used > power.capacity || power.used > 0 && power.shot !== input.launches || effects.length > power.used)) return null;
    if (input.version >= 11) {
      const markers = power.markers;
      if (!Array.isArray(markers) || markers.length !== (input.isFlying ? power.capacity - power.used : 0) || markers.some(marker => !marker || !powerKinds.includes(marker.kind) || !Number.isInteger(marker.target) || marker.target < 1 || marker.target > count)) return null;
      if (new Set(markers.map(marker => marker.target)).size !== markers.length || new Set(markers.map(marker => marker.kind)).size !== markers.length || markers.some(marker => hasEffect(marker.kind))) return null;
    }
    if (input.version === 4) {
      if (![null, ...powerKinds].includes(power.held) || ![null, ...powerKinds].includes(power.pending) || typeof power.armed !== 'boolean') return null;
      if (power.armed && (!power.held || input.isFlying) || power.pending && (!input.isFlying || power.held || power.armed || power.shot !== input.launches)) return null;
    }
  }
  if (input.version >= 6) {
    for (const effect of effects) {
    if (!effect || ![null, 'magnet', 'lightning', 'impact', 'comet', ...(input.version >= 7 ? ['tether', 'split', 'bubble'] : []), ...(input.version >= 8 ? ['portal', 'echo', 'slingshot'] : []), ...(input.version >= 10 ? ['stasis'] : []), ...(input.version >= 13 ? ['drunk'] : []), ...(input.version >= 14 ? ['relay','wake','spring','orbit','rewind','pulse'] : []), ...(input.version >= 16 ? ['wrap'] : []), ...(input.version >= 17 ? ['homing'] : []), ...(input.version >= 18 ? ['blaster'] : [])].includes(effect.kind) || !Number.isFinite(effect.seconds) || effect.seconds < 0 || effect.seconds > RULE.flightSeconds || !Array.isArray(effect.targets)) return null;
    if (effect.kind && (!input.isFlying || input.power.shot !== input.launches || effect.seconds <= 0)) return null;
    if (!effect.kind && effect.seconds !== 0) return null;
    if(effect.kind==='blaster') {
      if(!Number.isInteger(effect.ammo)||effect.ammo<0||effect.ammo>5||!Number.isInteger(effect.volley)||effect.volley<0||effect.volley>10||typeof effect.reloaded!=='boolean'||!Number.isFinite(effect.cooldown)||effect.cooldown<0||effect.cooldown>.45||!Array.isArray(effect.hits)||effect.hits.length!==effect.volley||effect.hits.some(ids=>!Array.isArray(ids)||ids.length>14||new Set(ids).size!==ids.length||ids.some(id=>!Number.isInteger(id)||id<1||id>count))||!Array.isArray(effect.shots)||effect.shots.length>30)return null;
      for(const shot of effect.shots) if(!shot||['x','y','vx','vy','life'].some(k=>!Number.isFinite(shot[k]))||shot.x<30||shot.x>930||shot.y<30||shot.y>610||Math.hypot(shot.vx,shot.vy)>981||shot.life<=0||shot.life>1.6||![0,1].includes(shot.bounces)||!Number.isInteger(shot.volley)||shot.volley<0||shot.volley>=effect.volley||(shot.target!==undefined&&(!Number.isInteger(shot.target)||shot.target<1||shot.target>count)))return null;
    }
    if (effect.kind === 'drunk' && effect.seconds > RULE.drunkSeconds) return null;
    if (effect.kind === 'wrap' && effect.seconds > 5 || effect.kind === 'homing' && effect.seconds > RULE.homingSeconds) return null;
    if (effect.kind === 'magnet' && effect.seconds > (input.build?3.2:2.4) || effect.kind === 'lightning' && effect.seconds > .22) return null;
    if (effect.kind === 'lightning' || effect.kind === 'stasis') {
      if (effect.targets.length < 1 || effect.targets.length > (effect.kind === 'stasis' ? count : 3) || new Set(effect.targets).size !== effect.targets.length || effect.targets.some(id => !Number.isInteger(id) || id < 1 || id > count)) return null;
    } else if (effect.targets.length) return null;
    const idsValid=ids=>Array.isArray(ids)&&new Set(ids).size===ids.length&&ids.every(id=>Number.isInteger(id)&&id>=1&&id<=count);
    if(effect.kind==='relay' && (!idsValid(effect.armed)||!idsValid(effect.spent)||effect.armed.length>(input.build?4:3)||effect.spent.some(id=>!effect.armed.includes(id))||!Number.isInteger(effect.remaining)||effect.remaining<0||effect.remaining>3||effect.remaining+effect.armed.length>4)) return null;
    if(effect.kind==='wake' && (!Array.isArray(effect.trail)||effect.trail.length>162||effect.trail.some(p=>!p||['x','y','nx','ny','age'].some(k=>!Number.isFinite(p[k]))||p.x<40||p.x>920||p.y<40||p.y>600||Math.hypot(p.nx,p.ny)>1.00001||p.age<0||p.age>1.8))) return null;
    if(effect.kind==='orbit' && (!idsValid(effect.satellites)||effect.satellites.length>2||!Number.isFinite(effect.phase)||effect.phase<0||effect.phase>11||effect.seconds>3)) return null;
    if(effect.kind==='rewind' && (typeof effect.returning!=='boolean'||!Array.isArray(effect.route)||effect.route.length>420||effect.route.some(p=>!p||!Number.isFinite(p.x)||!Number.isFinite(p.y)||p.x<40||p.x>920||p.y<40||p.y>600))) return null;
    if(effect.kind==='pulse' && (!Number.isInteger(effect.remaining)||effect.remaining<1||effect.remaining>3||!Number.isFinite(effect.next)||effect.next<0||effect.next>2||effect.seconds>3.1)) return null;
    if (effect.kind === 'split') {
      if (effect.seconds > (input.build?3.5:3) || !Array.isArray(effect.shards) || (input.build?![1,2].includes(effect.shards.length):effect.shards.length !== 2)) return null;
      for (const [index, body] of effect.shards.entries()) {
        if (!body || body.id !== -index - 1 || body.radius !== 10 || body.tone !== 0) return null;
        if (['x', 'y', 'vx', 'vy', 'cooldown'].some(key => !Number.isFinite(body[key]))) return null;
        if (Math.hypot(body.vx, body.vy) > 3000 || body.cooldown < 0 || body.cooldown > .1 || body.x < 40 || body.x > 920 || body.y < 40 || body.y > 600) return null;
      }
    } else if (effect.shards !== undefined) return null;
    if (effect.kind === 'tether') {
      if (effect.seconds > 4 || !Array.isArray(effect.links) || (input.build?![1,3].includes(effect.links.length):effect.links.length !== 3)) return null;
      const pairs = new Set(), nodes = new Set();
      for (const link of effect.links) {
        if (!link || !Number.isInteger(link.a) || !Number.isInteger(link.b) || link.a < 1 || link.a > count || link.b < 1 || link.b > count || link.a === link.b) return null;
        if (!Number.isFinite(link.length) || link.length < 28 || link.length > 1100 || !Number.isFinite(link.cooldown) || link.cooldown < 0 || link.cooldown > .55) return null;
        pairs.add([link.a, link.b].sort((a,b) => a-b).join(':')); nodes.add(link.a); nodes.add(link.b);
      }
      if (pairs.size !== effect.links.length || nodes.size !== (effect.links.length===1?2:3)) return null;
    } else if (effect.links !== undefined) return null;
    const pointValid = point => point && Number.isFinite(point.x) && Number.isFinite(point.y) && point.x >= 40 && point.x <= 920 && point.y >= 40 && point.y <= 600;
    if (effect.kind === 'portal') {
      if (effect.seconds > 5 || !Number.isFinite(effect.cooldown) || effect.cooldown < 0 || effect.cooldown > .45 || !Array.isArray(effect.gates) || effect.gates.length !== 2) return null;
      if (effect.gates.some(point => !pointValid(point) || point.x < 100 || point.x > 860 || point.y < 100 || point.y > 540)) return null;
      if (Math.hypot(effect.gates[0].x - effect.gates[1].x, effect.gates[0].y - effect.gates[1].y) < 300) return null;
    } else if (effect.gates !== undefined || effect.kind !== 'blaster' && effect.cooldown !== undefined) return null;
    if (effect.kind === 'echo') {
      const ghost = effect.ghost;
      if (typeof effect.isReady !== 'boolean' || !Array.isArray(effect.path) || effect.path.length < 1 || effect.path.length > 60 || effect.path.some(point => !pointValid(point) || input.version >= 9 && ![10, 12].includes(point.radius))) return null;
      if (effect.isReady && !input.skillState?.echoDrain && effect.path.length !== 60 || !pointValid(ghost) || ghost.id !== -3 || !(input.version >= 9 ? [10, 12] : [12]).includes(ghost.radius) || ghost.tone !== 0) return null;
      if (!Number.isFinite(ghost.vx) || !Number.isFinite(ghost.vy) || Math.hypot(ghost.vx, ghost.vy) > 1600.000001 || !Number.isFinite(ghost.cooldown) || ghost.cooldown < 0 || ghost.cooldown > .1) return null;
      if (input.version >= 12 && (!pointValid(effect.follow) || !Number.isFinite(effect.follow.vx) || !Number.isFinite(effect.follow.vy) || Math.hypot(effect.follow.vx, effect.follow.vy) > 7200.000001 || Math.hypot(ghost.x - effect.follow.x, ghost.y - effect.follow.y) > skillConfig(input,'echo').leash + .000001)) return null;
    } else if (effect.path !== undefined || effect.ghost !== undefined || effect.isReady !== undefined || effect.follow !== undefined) return null;
    if (effect.kind === 'slingshot') {
      if (effect.seconds > .85 || !Number.isInteger(effect.anchor) || effect.anchor < 1 || effect.anchor > count || !input.chain.includes(effect.anchor) || ![-1, 1].includes(effect.spin)) return null;
      if (!Number.isFinite(effect.angle) || Math.abs(effect.angle) > 10 || effect.radius !== input.bodies[effect.anchor].radius + RULE.seedRadius + 16) return null;
    } else if (['anchor', 'angle', 'spin', 'radius'].some(key => effect[key] !== undefined)) return null;
    }
  }
  const routeValid=route=>Array.isArray(route)&&route.length<=420&&route.every(p=>p&&Number.isFinite(p.x)&&Number.isFinite(p.y)&&p.x>=40&&p.x<=920&&p.y>=40&&p.y<=600);
  if(input.version>=14 && !routeValid(input.flightPath)) return null;
  if(input.version>=15) {
    const o=input.objective;
    if(!o||typeof o.enabled!=='boolean'||typeof o.earned!=='boolean'||!Number.isSafeInteger(o.index)||o.index<0||!Number.isSafeInteger(o.completed)||o.completed<0||(input.shotStart!==null&&(!Number.isSafeInteger(input.shotStart)||input.shotStart<0||input.shotStart>input.score)))return null;
    if(o.bankBloom!==undefined&&typeof o.bankBloom!=='boolean')return null;
    const shot=input.lastShot;
    if(shot!==null&&(!shot||!Number.isInteger(shot.notes)||shot.notes<0||shot.notes>count||!Number.isSafeInteger(shot.banks)||shot.banks<0||(shot.points!==null&&(!Number.isSafeInteger(shot.points)||shot.points<0))||!Number.isInteger(shot.powers)||shot.powers<0||shot.powers>3||typeof shot.bloom!=='boolean'||typeof shot.objective!=='boolean'))return null;
  }
  const restored = structuredClone(input);
  if(input.version<15) {restored.objective??={enabled:true,index:0,completed:0,earned:false};restored.shotStart=input.shotStart??(input.isFlying?null:input.score);restored.lastShot=input.lastShot??null;}
  // Retain the legacy field for save compatibility; objectives are now a permanent rule.
  restored.objective.enabled=true;
  if(input.version<14 && !routeValid(input.flightPath)) restored.flightPath=[];
  if (input.version < 9) {
    restored.version = RULE.version; restored.effects = input.version >= 6 && input.effect.kind ? [structuredClone(input.effect)] : []; delete restored.effect; restored.power = input.version >= 5 ? structuredClone(input.power) : powerCreate(input.seed);
    if (input.version === 3) {
      const old = input.ripple;
      if (old.charge || old.pending) { restored.power.offer = 'ripple'; restored.power.target = 7; }
      else if (old.shot > 0) { restored.power.offer = 'ripple'; restored.power.target = 7; restored.power.shot = old.shot; powerNext(restored); }
    }
    if (input.version === 4) {
      const old = input.power;
      restored.power = { offer: old.held || old.pending || old.offer, target: old.target, shot: old.held || old.pending ? 0 : old.shot, claims: old.claims };
    }
    restored.power.capacity = 1;
    restored.power.used = restored.power.shot === restored.launches && restored.launches > 0 ? 1 : 0;
    for (const effect of restored.effects) if (effect.kind === 'echo') effect.path = effect.path.map(point => ({ ...point, radius: 12 }));
    delete restored.ripple;
  }
  if (input.version < 11) restored.power.markers = restored.isFlying ? powerPlan(restored, restored.power.capacity - restored.power.used) : [];
  if (input.version < 12) for (const effect of restored.effects) if (effect.kind === 'echo') {
    const { x, y, vx, vy } = effect.ghost; effect.follow = { x, y, vx: effect.isReady ? vx : 0, vy: effect.isReady ? vy : 0 };
  }
  restored.version = RULE.version;
  // Older completed flights already at the goal become wins without losing the pool.
  if (restored.mode === 'challenge' && !restored.isFlying && restored.blooms >= RULE.goalBlooms) restored.isOver = true;
  return restored;
}

export const OBJECTIVES=Object.freeze([
  {title:'Bank a bloom',description:'Touch five different jellies and bounce off a wall in one pluck.',targets:{notes:5,banks:1},tip:'Aim toward a wall with jellies along the rebound path.'},
  {title:'Seven-note run',description:'Touch seven different jellies in one pluck.',targets:{notes:7},tip:'Every new jelly counts, including contacts made by your powers.'},
  {title:'Power play',description:'Collect two powers and bounce off a wall in one pluck.',targets:{powers:2,banks:1},tip:'Build a bloom streak to begin a pluck with two or three power jellies.'}
]);
export function objectiveProgress(state) {
  const index=state.objective.index%OBJECTIVES.length,definition=OBJECTIVES[index];
  if(state.mode==='song-run'){
    const complete=state.objective.completed>0,kind=state.objective.index%3,roles=new Set(state.chain.map(jellyRole)).size;
    const definition=kind===1?{title:'Three voices',description:'Contact melody, bass and rhythm in one pluck.',target:3,value:roles,label:'musical roles'}:kind===2?{title:'Double-bank bloom',description:'Bounce off two walls before the fifth contact of a bloom.',target:1,value:Number(!!state.objective.bankBloom),label:'double-bank bloom'}:{title:'Seven-note run',description:'Touch seven different jellies in one pluck.',target:7,value:Math.min(7,state.chain.length),label:'jellies'};
    const value=complete?definition.target:definition.value;return {...definition,tip:'Every collector counts. The bonus stays earned for this pool.',index:kind,steps:[{key:'notes',label:definition.label,target:definition.target,value}],progress:value/definition.target,complete,reward:200};
  }
  const values={notes:state.chain.length,banks:state.banks,powers:state.power.used};
  const labels={notes:'jellies',banks:'wall bounce',powers:'powers'};
  const steps=Object.entries(definition.targets).map(([key,target])=>({key,label:labels[key],target,value:state.isFlying?Math.min(values[key],target):0}));
  return {...definition,index,steps,progress:steps.reduce((sum,step)=>sum+step.value/step.target,0)/steps.length,complete:state.isFlying&&state.objective.earned,reward:200};
}
export function aimPreview(state,angle,power=.7) {
  const seed=state.bodies[0],dx=Math.cos(angle),dy=Math.sin(angle),edge=RULE.inset+seed.radius;
  const tx=Math.abs(dx)<1e-8?Infinity:((dx>0?RULE.width-edge:edge)-seed.x)/dx;
  const ty=Math.abs(dy)<1e-8?Infinity:((dy>0?RULE.height-edge:edge)-seed.y)/dy;
  const distance=Math.min(tx,ty),limit=260+Math.max(0,Math.min(1,power))*500;
  const end={x:seed.x+dx*Math.min(distance,limit),y:seed.y+dy*Math.min(distance,limit)};
  const points=[{x:seed.x,y:seed.y},end];
  if(distance<=limit) {const rx=tx<=ty?-dx:dx,ry=ty<=tx?-dy:dy;const nextX=Math.abs(rx)<1e-8?Infinity:((rx>0?RULE.width-edge:edge)-end.x)/rx,nextY=Math.abs(ry)<1e-8?Infinity:((ry>0?RULE.height-edge:edge)-end.y)/ry;const remaining=Math.max(0,Math.min(140,limit-distance,nextX,nextY));points.push({x:end.x+rx*remaining,y:end.y+ry*remaining});}
  return points;
}
