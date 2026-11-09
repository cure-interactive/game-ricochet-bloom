// Presentation only: engine events supply impulses; active effects supply geometry.
import { RULE, POWERS, effectGet } from './engine.js';
const TAU = Math.PI * 2;
const clamp = (value, low, high) => Math.max(low, Math.min(high, value));
function line(c, x, y, endX, endY) { c.beginPath(); c.moveTo(x, y); c.lineTo(endX, endY); c.stroke(); }
function dot(c, x, y, radius) { c.beginPath(); c.arc(x, y, radius, 0, TAU); c.fill(); }
function arrow(c, x, y, angle, size = 7) {
  c.beginPath(); c.moveTo(x - Math.cos(angle - .55) * size, y - Math.sin(angle - .55) * size);
  c.lineTo(x, y); c.lineTo(x - Math.cos(angle + .55) * size, y - Math.sin(angle + .55) * size); c.stroke();
}
function curvePoint(a, b, bend, t) {
  const dx = b.x - a.x, dy = b.y - a.y, length = Math.max(1, Math.hypot(dx, dy));
  return { x: a.x + dx * t - dy / length * bend * 4 * t * (1 - t), y: a.y + dy * t + dx / length * bend * 4 * t * (1 - t) };
}
function curve(c, a, b, bend) {
  const middle = curvePoint(a, b, bend * 2, .5);
  c.beginPath(); c.moveTo(a.x, a.y); c.quadraticCurveTo(middle.x, middle.y, b.x, b.y); c.stroke();
}
function springWall(c, cues, gentle, active) {
  const inset = RULE.inset + 2, right = RULE.width - inset, bottom = RULE.height - inset, radius = 40;
  // Deform the wall itself along the inward collision normal, never the collider.
  function edge(x, y, dx, dy, length, nx, ny) {
    const steps = Math.ceil(length / 8);
    for (let i = 1; i <= steps; i++) {
      const along = length * i / steps, px = x + dx * along, py = y + dy * along;
      let offset = 0;
      for (const cue of cues) {
        if (nx * cue.nx + ny * cue.ny <= 0) continue;
        const distance = Math.abs((px - cue.x) * dx + (py - cue.y) * dy), width = 140;
        if (distance >= width) continue;
        const progress = cue.age / cue.duration;
        const rebound = gentle ? Math.sin(progress * Math.PI) * 8
          : Math.sin(cue.age * 16) ** 2 * Math.exp(-cue.age * 5) * (1 - progress) * (36 + clamp(cue.speed, 0, 1000) * .06);
        offset += rebound * Math.cos(distance / width * Math.PI / 2) ** 2;
      }
      // Keep the rounded corners anchored and overlapping impacts bounded.
      const endFade = Math.min(1, along / 60, (length - along) / 60);
      offset = Math.min(gentle ? 8 : 48, offset) * endFade * endFade * (3 - 2 * endFade);
      c.lineTo(px + nx * offset, py + ny * offset);
    }
  }
  c.save(); c.strokeStyle = POWERS.spring.color;
  c.globalAlpha = (gentle ? .3 : .75) * (active ? 1 : Math.max(...cues.map(cue => 1 - cue.age / cue.duration)));
  c.lineWidth = gentle ? 2 : 3; c.shadowColor = POWERS.spring.color; c.shadowBlur = gentle ? 0 : 10;
  c.setLineDash([16, 8]); c.beginPath(); c.moveTo(inset + radius, inset);
  edge(inset + radius, inset, 1, 0, right - inset - radius * 2, 0, 1);
  c.quadraticCurveTo(right, inset, right, inset + radius);
  edge(right, inset + radius, 0, 1, bottom - inset - radius * 2, -1, 0);
  c.quadraticCurveTo(right, bottom, right - radius, bottom);
  edge(right - radius, bottom, -1, 0, right - inset - radius * 2, 0, -1);
  c.quadraticCurveTo(inset, bottom, inset, bottom - radius);
  edge(inset, bottom - radius, 0, -1, bottom - inset - radius * 2, 1, 0);
  c.quadraticCurveTo(inset, inset, inset + radius, inset); c.closePath(); c.stroke(); c.restore();
}
export class PowerVisual {
  constructor() { this.cues = []; }
  clear() { this.cues = []; }
  add(cue) { this.cues.push({ age: 0, duration: .65, ...cue }); if (this.cues.length > 72) this.cues.splice(0, this.cues.length - 72); }
  update(dt) { for (const cue of this.cues) cue.age += dt; this.cues = this.cues.filter(cue => cue.age < cue.duration); }
  event(event, game) {
    const seed = game.bodies[0];
    if (event.type === 'power') {
      if (['ripple', 'attract', 'vortex'].includes(event.kind)) this.add({ ...event, duration: 1.6 });
      if (event.kind === 'swap') for (const point of [{ x: event.x, y: event.y }, { x: event.exitX, y: event.exitY }]) this.add({ kind: 'endpoint', color: POWERS.swap.color, ...point, duration: .85 });
      if (event.kind === 'split') for (const shard of effectGet(game, 'split')?.shards || []) this.add({ kind: 'branch', x: seed.x, y: seed.y, endX: shard.x + shard.vx * .12, endY: shard.y + shard.vy * .12, duration: .65 });
    }
    if(event.type==='pulse') this.add({kind:'ripple',color:POWERS.pulse.color,x:event.x,y:event.y,duration:.72});
    if(event.type==='relay') this.add({kind:'branch',x:event.fromX,y:event.fromY,endX:event.x,endY:event.y,color:POWERS.relay.color,duration:.7});
    if(event.type==='orbit-release') this.add({kind:'shock',...event,color:POWERS.orbit.color,duration:.7});
    if(event.type==='spring') this.add({kind:'spring',...event,color:POWERS.spring.color,duration:.85});
    if (event.type === 'wrap') {
      this.add({ kind: 'wrap', x: event.fromX, y: event.fromY, nx: -event.nx, ny: -event.ny, color: POWERS.wrap.color, duration: .55 });
      this.add({ kind: 'wrap', x: event.x, y: event.y, nx: -event.nx, ny: -event.ny, color: POWERS.wrap.color, duration: .55 });
    }
    if (event.type === 'portal') for (const point of [{ x: event.fromX, y: event.fromY }, event]) this.add({ kind: 'endpoint', color: POWERS.portal.color, x: point.x, y: point.y, duration: .7 });
    if (event.type === 'push' || event.type === 'lightning') {
      const color = POWERS[event.type === 'push' ? 'impact' : 'lightning'].color;
      this.add({ kind: 'shock', x: event.x, y: event.y, nx: event.nx, ny: event.ny, color, duration: .5 });
      this.add({ kind: 'wake', id: event.id, x: event.x, y: event.y, nx: event.nx, ny: event.ny, color, duration: .8 });
    }
    if (event.type === 'slingshot') this.add({ kind: 'launch', x: event.x, y: event.y, angle: Math.atan2(seed.vy, seed.vx), duration: .7 });
    if (effectGet(game, 'comet') && (event.type === 'wall' && event.id === 0 || event.type === 'impact' && event.a === 0)) {
      this.add({ kind: 'spark', x: event.x, y: event.y, angle: Math.atan2(seed.vy, seed.vx), duration: .45 });
    }
  }
  render(c, game, time, gentle) {
    c.save(); c.lineCap = 'round'; c.lineJoin = 'round';
    // Clip large currents and wakes to the pool, keeping controls and labels clear.
    c.beginPath(); c.roundRect(RULE.inset, RULE.inset, RULE.width - RULE.inset * 2, RULE.height - RULE.inset * 2, 45); c.clip();
    for (const cue of this.cues) {
      if (cue.kind === 'spring') continue;
      const progress = cue.age / cue.duration, travel = gentle ? .35 : progress;
      c.save(); c.globalAlpha = (1 - progress) * (gentle ? .3 : .65); c.lineWidth = gentle ? 1.4 : 2;
      c.strokeStyle = c.fillStyle = cue.color || POWERS[cue.kind]?.color || POWERS.split.color;
      if (cue.kind === 'wrap') {
        const angle = Math.atan2(cue.ny, cue.nx), radius = 12 + travel * 28;
        c.beginPath(); c.ellipse(cue.x, cue.y, radius * .5, radius, angle, 0, TAU); c.stroke();
        arrow(c, cue.x + Math.cos(angle) * travel * 42, cue.y + Math.sin(angle) * travel * 42, angle, gentle ? 6 : 10);
      } else if (['ripple', 'attract'].includes(cue.kind)) {
        const inward = cue.kind === 'attract';
        for (let i = 0; i < (gentle ? 8 : 14); i++) {
          const angle = i * TAU / (gentle ? 8 : 14), radius = 30 + (inward ? 1 - travel : travel) * (RULE.powerRadius - 30);
          const x = cue.x + Math.cos(angle) * radius, y = cue.y + Math.sin(angle) * radius;
          const direction = angle + (inward ? Math.PI : 0);
          line(c, x - Math.cos(direction) * 28, y - Math.sin(direction) * 28, x, y); arrow(c, x, y, direction);
        }
      } else if (cue.kind === 'vortex') {
        for (let arm = 0; arm < 3; arm++) {
          c.beginPath();
          let last;
          for (let i = 0; i <= 40; i++) {
            const t = i / 40, angle = arm * TAU / 3 + t * 3.6 + travel * 3.5, radius = 35 + t * 250;
            last = { x: cue.x + Math.cos(angle) * radius, y: cue.y + Math.sin(angle) * radius, angle };
            if (!i) c.moveTo(last.x, last.y); else c.lineTo(last.x, last.y);
          }
          c.stroke(); arrow(c, last.x, last.y, last.angle + 1.3, 11);
        }
      } else if (cue.kind === 'shock') {
        const angle = Math.atan2(cue.ny, cue.nx), radius = 25 + travel * 85;
        c.lineWidth = (gentle ? 2 : 4) * (1 - progress) + 1;
        c.beginPath(); c.arc(cue.x, cue.y, radius, angle - .95, angle + .95); c.stroke();
        arrow(c, cue.x + cue.nx * radius, cue.y + cue.ny * radius, angle, 12);
      } else if (cue.kind === 'wake') {
        const body = game.bodies[cue.id];
        if (body) {
          for (const side of [-1, 1]) {
            const offset = body.radius * .65 * side;
            line(c, cue.x - cue.ny * offset, cue.y + cue.nx * offset, body.x - cue.nx * body.radius - cue.ny * offset, body.y - cue.ny * body.radius + cue.nx * offset);
          }
          if (!gentle) { c.globalAlpha *= .4; c.lineWidth = 6; c.beginPath(); c.arc(body.x, body.y, body.radius + 4, 0, TAU); c.stroke(); }
        }
      } else if (cue.kind === 'endpoint') {
        for (let i = 0; i < 2; i++) { c.beginPath(); c.ellipse(cue.x, cue.y, 18 + travel * 55 + i * 8, 28 + travel * 55 + i * 8, -.25, 0, TAU); c.stroke(); }
      } else if (cue.kind === 'branch') {
        line(c, cue.x, cue.y, cue.endX, cue.endY); arrow(c, cue.endX, cue.endY, Math.atan2(cue.endY - cue.y, cue.endX - cue.x), 9);
      } else if (cue.kind === 'launch' || cue.kind === 'spark') {
        c.strokeStyle = cue.kind === 'launch' ? POWERS.slingshot.color : POWERS.comet.color;
        for (let i = -2; i <= 2; i++) {
          const angle = cue.angle + i * (cue.kind === 'spark' ? .32 : .09), distance = (cue.kind === 'spark' ? 70 : 170) * travel;
          const x = cue.x + Math.cos(angle) * distance, y = cue.y + Math.sin(angle) * distance;
          line(c, x, y, x + Math.cos(angle) * (gentle ? 8 : 20), y + Math.sin(angle) * (gentle ? 8 : 20));
        }
      }
      c.restore();
    }
    const seed = game.bodies[0], phase = gentle ? .5 : time;
    const drunk = effectGet(game, 'drunk');
    if (drunk) {
      const elapsed = RULE.drunkSeconds - drunk.seconds, fade = Math.min(1, drunk.seconds / .6);
      c.strokeStyle = c.fillStyle = POWERS.drunk.color; c.lineWidth = gentle ? 1.4 : 2;
      for (const body of [seed, ...(effectGet(game, 'split')?.shards || [])]) {
        const angle = Math.atan2(body.vy, body.vx), nx = Math.cos(angle), ny = Math.sin(angle);
        c.globalAlpha = (gentle ? .25 : .6) * fade;
        for (const side of [-1, 1]) {
          c.beginPath();
          for (let i = 0; i <= 24; i++) {
            const t = i / 24, back = body.radius + t * (gentle ? 35 : 85);
            const offset = side * (body.radius + 6) + Math.sin(t * TAU * 1.2 - (gentle ? 0 : elapsed * 5)) * (gentle ? 3 : 12) * t;
            const x = body.x - nx * back - ny * offset, y = body.y - ny * back + nx * offset;
            if (!i) c.moveTo(x, y); else c.lineTo(x, y);
          }
          c.stroke();
        }
        if (!gentle) for (let i = 0; i < 3; i++) {
          const orbit = elapsed * 2.3 + i * TAU / 3, radius = body.radius + 13;
          c.globalAlpha = .65 * fade;
          dot(c, body.x + Math.cos(orbit) * radius, body.y + Math.sin(orbit) * radius * .65, 2 + i * .6);
        }
      }
    }
    const relay=effectGet(game,'relay');
    if(relay) for(const id of relay.armed.filter(id=>!relay.spent.includes(id))) {
      const b=game.bodies[id];c.strokeStyle=POWERS.relay.color;c.globalAlpha=gentle?.4:.75;c.lineWidth=2;
      c.setLineDash([5,7]);c.beginPath();c.arc(b.x,b.y,b.radius+9,0,TAU);c.stroke();c.setLineDash([]);
    }
    const wake=effectGet(game,'wake');
    if(wake) for(let i=0;i<wake.trail.length;i+=gentle?9:4) {
      const p=wake.trail[i];c.strokeStyle=POWERS.wake.color;c.globalAlpha=(1-p.age/1.8)*(gentle?.2:.5);c.lineWidth=2;
      line(c,p.x-p.nx*18,p.y-p.ny*18,p.x+p.nx*12,p.y+p.ny*12);arrow(c,p.x+p.nx*12,p.y+p.ny*12,Math.atan2(p.ny,p.nx),6);
    }
    const wrap = effectGet(game, 'wrap');
    const springCues = this.cues.filter(cue => cue.kind === 'spring'), springActive = !!effectGet(game, 'spring') && !wrap;
    if (springActive || springCues.length) springWall(c, springCues, gentle, springActive);
    if (wrap) {
      const fade = Math.min(1, wrap.seconds / .5), inset = RULE.inset + 6;
      c.strokeStyle = POWERS.wrap.color; c.globalAlpha = (gentle ? .25 : .5) * fade; c.lineWidth = 2;
      c.setLineDash([4, 16]); c.beginPath(); c.roundRect(inset, inset, RULE.width - inset * 2, RULE.height - inset * 2, 40); c.stroke(); c.setLineDash([]);
      for (const [x, y, nx, ny] of [[inset, RULE.height / 2, -1, 0], [RULE.width - inset, RULE.height / 2, 1, 0], [RULE.width / 2, inset, 0, -1], [RULE.width / 2, RULE.height - inset, 0, 1]]) {
        const travel = gentle ? 12 : 8 + ((5 - wrap.seconds) * 24) % 20;
        c.globalAlpha = (gentle ? .45 : .85) * fade;
        for (let i = 0; i < 2; i++) arrow(c, x - nx * (travel + i * 12), y - ny * (travel + i * 12), Math.atan2(ny, nx), 8);
      }
    }
    const orbit=effectGet(game,'orbit');
    if(orbit) for(const id of orbit.satellites) {const b=game.bodies[id];c.strokeStyle=POWERS.orbit.color;c.globalAlpha=gentle?.3:.65;c.lineWidth=1.5;curve(c,seed,b,25);c.beginPath();c.arc(b.x,b.y,b.radius+5,0,TAU);c.stroke();}
    const rewind=effectGet(game,'rewind');
    if(rewind) {const path=rewind.returning?rewind.route:game.flightPath;c.strokeStyle=POWERS.rewind.color;c.globalAlpha=gentle?.22:.5;c.lineWidth=2;c.setLineDash([4,8]);c.beginPath();let prev;
      for(let i=0;i<path.length;i+=3) {const p=path[i];if(!prev||Math.hypot(p.x-prev.x,p.y-prev.y)>100)c.moveTo(p.x,p.y);else c.lineTo(p.x,p.y);prev=p;} c.stroke();c.setLineDash([]);
      if(rewind.returning) {c.globalAlpha=.8;arrow(c,seed.x,seed.y,Math.atan2(seed.vy,seed.vx),18);}
    }
    if (effectGet(game, 'comet')) {
      const speed = Math.max(1, Math.hypot(seed.vx, seed.vy)), nx = seed.vx / speed, ny = seed.vy / speed;
      const length = gentle ? 32 : Math.min(115, speed * .12), width = seed.radius * .7;
      const glow = c.createLinearGradient(seed.x, seed.y, seed.x - nx * length, seed.y - ny * length);
      glow.addColorStop(0, '#ffe4a9b0'); glow.addColorStop(1, '#ffb34700'); c.fillStyle = glow; c.globalAlpha = gentle ? .4 : .75;
      c.beginPath(); c.moveTo(seed.x - ny * width, seed.y + nx * width); c.lineTo(seed.x - nx * length, seed.y - ny * length); c.lineTo(seed.x + ny * width, seed.y - nx * width); c.closePath(); c.fill();
    }
    if (effectGet(game, 'magnet')) {
      const targets = game.bodies.slice(1).filter(body => !game.chain.includes(body.id) && Math.hypot(body.x - seed.x, body.y - seed.y) < RULE.powerRadius)
        .sort((a, b) => Math.hypot(a.x - seed.x, a.y - seed.y) - Math.hypot(b.x - seed.x, b.y - seed.y)).slice(0, gentle ? 3 : 6);
      c.strokeStyle = c.fillStyle = POWERS.magnet.color; c.lineWidth = 1.3;
      for (const body of targets) {
        const dx = seed.x - body.x, dy = seed.y - body.y, distance = Math.max(1, Math.hypot(dx, dy));
        const start = { x: body.x + dx / distance * body.radius, y: body.y + dy / distance * body.radius }, bend = 14 * (body.id % 2 ? 1 : -1);
        c.globalAlpha = gentle ? .2 : .28; curve(c, start, seed, bend);
        for (let i = 0; i < (gentle ? 1 : 3); i++) {
          const t = gentle ? .7 : (phase * 1.3 + i / 3 + body.id * .17) % 1, p = curvePoint(start, seed, bend, t), next = curvePoint(start, seed, bend, Math.min(1, t + .02));
          c.globalAlpha = gentle ? .4 : .65 * Math.sin(t * Math.PI); arrow(c, p.x, p.y, Math.atan2(next.y - p.y, next.x - p.x), 7);
        }
      }
    }
    if (effectGet(game, 'impact')) {
      const angle = Math.atan2(seed.vy, seed.vx); c.strokeStyle = POWERS.impact.color; c.globalAlpha = gentle ? .35 : .7; c.lineWidth = 2.5;
      for (let i = 0; i < 2; i++) arrow(c, seed.x + Math.cos(angle) * (seed.radius + 13 + i * 9), seed.y + Math.sin(angle) * (seed.radius + 13 + i * 9), angle, 12);
    }
    if (effectGet(game, 'portal')) {
      const radius = 46 + (gentle ? 0 : Math.sin(time * 3) * 4);
      c.strokeStyle = POWERS.portal.color; c.globalAlpha = gentle ? .25 : .4; c.lineWidth = 1.5;
      for (const gate of effectGet(game, 'portal').gates) { c.beginPath(); c.arc(gate.x, gate.y, radius, 0, TAU); c.stroke(); }
    }
    if (effectGet(game, 'slingshot')) {
      const effect = effectGet(game, 'slingshot'), anchor = game.bodies[effect.anchor], progress = 1 - effect.seconds / .85;
      c.strokeStyle = POWERS.slingshot.color; c.globalAlpha = gentle ? .35 : .7; c.lineWidth = 2; c.beginPath();
      for (let i = 0; i <= 48; i++) {
        const t = i / 48, angle = effect.angle - effect.spin * (1 - t) * TAU * 1.3, radius = effect.radius + (1 - t) * (gentle ? 12 : 48 * (1 - progress));
        const x = anchor.x + Math.cos(angle) * radius, y = anchor.y + Math.sin(angle) * radius;
        if (!i) c.moveTo(x, y); else c.lineTo(x, y);
      }
      c.stroke();
    }
    for (const link of effectGet(game, 'tether')?.links || []) {
      const a = game.bodies[link.a], b = game.bodies[link.b], distance = Math.hypot(b.x - a.x, b.y - a.y), tension = clamp((distance - link.length) / 55, 0, 1), bend = Math.max(0, link.length - distance) * .3;
      c.strokeStyle = c.fillStyle = POWERS.tether.color; c.globalAlpha = (gentle ? .25 : .35) + tension * .4; c.lineWidth = 1.5 + tension * 2; curve(c, a, b, bend);
      for (let i = 0; i < (gentle ? 1 : 3); i++) { const t = gentle ? .5 : (time * (1 + tension) + i / 3) % 1, p = curvePoint(a, b, bend, t); dot(c, p.x, p.y, 2 + tension * 2); }
    }
    const echo = effectGet(game, 'echo');
    if (echo?.isReady) {
      c.strokeStyle = c.fillStyle = POWERS.echo.color; c.globalAlpha = gentle ? .18 : .24; c.lineWidth = 1; c.setLineDash([3, 8]);
      c.beginPath(); c.moveTo(echo.follow.x, echo.follow.y);
      let previous = echo.follow;
      for (let i = 0; i < echo.path.length; i += 5) { const point = echo.path[i]; if (Math.hypot(point.x - previous.x, point.y - previous.y) > 80) c.moveTo(point.x, point.y); else c.lineTo(point.x, point.y); previous = point; }
      c.stroke(); c.setLineDash([]);
      const stretch = Math.hypot(echo.ghost.x - echo.follow.x, echo.ghost.y - echo.follow.y);
      if (stretch > 1) { c.globalAlpha = gentle ? .4 : .65; c.lineWidth = 1.5; curve(c, echo.follow, echo.ghost, Math.min(10, stretch * .3)); dot(c, echo.follow.x, echo.follow.y, 2.5); }
    }
    c.restore();
  }
}
