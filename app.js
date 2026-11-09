import {songLibrarySetup} from './song-ui.js';
import { RULE, COLORS, gameCreate, gameWon, continueFree, launch, physicsStep, powerAvailable, powerAllowance, powerMarkers, effectGet, seedBodies, POWERS, OBJECTIVES, aimPreview } from './engine.js';
import { STORAGE, LEGACY_STORAGE, poolStoreRead, poolStoreSet } from './storage.js';
import { PoolSound } from './sound.js';
import { musicProgress, musicPhrasePreview, JELLY_ROLES, jellyRole } from './music.js';
import { jellyCreate, jellyHit, jellyStep, jellyOutline, jellyFlow, jellyRipple } from './jelly.js';
import { PowerVisual } from './power-visual.js';
const $ = id => document.getElementById(id), canvas = $('arena'), context = canvas.getContext('2d'), audio = new PoolSound();
let store = poolStoreRead(null), storageIsAvailable = true;
try { store = poolStoreRead(JSON.parse(localStorage.getItem(STORAGE) ?? localStorage.getItem(LEGACY_STORAGE) ?? 'null')); } catch { storageIsAvailable = false; }
let preferences = store.preferences, best = store.best, saved = store.pools[store.activeMode]?.game, savedMusic = store.pools[store.activeMode]?.music;
let game = saved || gameCreate(new URL(location.href).searchParams.get('seed')?.slice(0, 32) || 'LAGOON', store.activeMode);
let carrySong = false;
const modeName = mode => mode === 'free' ? 'Free play' : 'Challenge';

audio.musicRestore(savedMusic, game.blooms, game.launches);
let isStarted = false, isPaused = false, isGentle = preferences.gentle === true, isStream = preferences.stream === true;
let angle = -Math.PI / 2, power = .7, drag = null, previousTime = performance.now(), accumulator = 0, lastSaveTick = 0, lastUITick = -100;
let trails = [], particles = [], rings = [], connections = [], bolts = [], reunions = [], scorePopups = [], toastTimer, frameCount = 0, noteCount = 0;
const membranes = new Map();
const powerVisual = new PowerVisual();
const powerIcons = Object.fromEntries(Object.keys(POWERS).map(kind => {
  const icon = new Image(); icon.src = new URL(`./icon/power/${kind}.svg`, import.meta.url).href; return [kind, icon];
}));
for (const [kind, p] of Object.entries(POWERS)) {
  const card = document.createElement('div'); card.className = 'power-card'; card.style.setProperty('--power-color', p.color);
  const icon = document.createElement('img'); icon.src = powerIcons[kind].src; icon.alt = ''; icon.width = icon.height = 36;
  const copy = document.createElement('div'), name = document.createElement('strong'), detail = document.createElement('p');
  name.textContent = p.name; detail.textContent = p.description; copy.append(name, detail); card.append(icon, copy); $('power-guide').append(card);
}
$('power-guide-title').textContent = `Meet all ${Object.keys(POWERS).length} powers`;
$('play-location').textContent = location.protocol === 'https:' ? '● ONLINE PLAY' : '● LOCAL PLAY';

audio.settingsSet(Number.isFinite(preferences.volume) ? Math.max(0, Math.min(1, preferences.volume)) : .45, preferences.muted === true);
audio.ambienceSet(preferences.ambience);
function save() {
  if (game.mode === 'challenge') best = Math.max(best, game.score);
  poolStoreSet(store, game, audio.musicSave()); store.best = best; store.preferences = { volume: audio.volume, ambience: audio.ambience, muted: audio.isMuted, gentle: isGentle, stream: isStream };
  try { localStorage.setItem(STORAGE, JSON.stringify(store)); storageIsAvailable = true; } catch { storageIsAvailable = false; }
  $('save-status').textContent = storageIsAvailable ? '● Pool saved on this browser' : 'Save unavailable · keep this tab open'; lastSaveTick = game.tick;
}
function announce(text) { $('announcement').textContent = text; }
function toast(text) { $('toast').textContent = text; $('toast').classList.add('show'); clearTimeout(toastTimer); toastTimer = setTimeout(() => $('toast').classList.remove('show'), 1600); announce(text); }
async function audioUnlockAsync() { try { await audio.unlockAsync(); } catch { toast('Audio unavailable in this browser'); } }
function membraneGet(body) {
  if (!membranes.has(body.id)) membranes.set(body.id, jellyCreate());
  return membranes.get(body.id);
}
function membraneHit(id, nx, ny, strength) {
  const body = id < 0 ? seedBodies(game).find(body => body.id === id) : game.bodies[id]; if (!body || isGentle) return;
  jellyHit(membraneGet(body), body.radius, nx, ny, strength, !!effectGet(game, 'stasis')?.targets.includes(id));
}
function eventHandle(event) {
  audio.eventPlay({ ...event, tick: game.tick });
  powerVisual.event(event, game);
  if (Number.isFinite(event.points) && event.points > 0) {
    scorePopups.push({ x: event.x, y: event.y, points: event.points, age: 0, isBloom: event.type === 'bloom', color: event.type === 'bloom' ? '#e1d4ff' : COLORS[event.tone] || '#e4ffcb' });
    if (scorePopups.length > 32) scorePopups.shift();
  }
  if (event.type === 'impact') { membraneHit(event.a, event.nx, event.ny, event.speed); membraneHit(event.b, -event.nx, -event.ny, event.speed); }
  if (event.type === 'wall') membraneHit(event.id, -event.nx, -event.ny, event.speed);
  if(event.type==='objective') {toast('Objective complete · +200 · a musical lift is on its way.');save();}
  if (event.type === 'note') {
    noteCount++; membraneGet(game.bodies[event.id]).glow = 1;
    const previous = game.chain.length > 1 ? game.bodies[game.chain.at(-2)] : game.bodies[0];
    connections.push({ from: previous.id, to: event.id, life: 2.4, color: COLORS[event.tone] });
    rings.push({ x: event.x, y: event.y, radius: game.bodies[event.id].radius, life: 1, color: COLORS[event.tone], bloom: false, touched: new Set([event.id]) });
    particleBurst(event.x, event.y, COLORS[event.tone], 16);
    if (event.chain === 3) toast('The pool is listening.');
    announce(`${event.chain} notes, ${game.score} resonance.`); save();
  }
  if (event.type === 'lightning') {
    bolts.push({ ...event, life: .32 });
    membraneHit(event.id, -event.nx, -event.ny, 850);
    membraneGet(game.bodies[event.id]).glow = .8;
    particleBurst(event.x, event.y, POWERS.lightning.color, 12); save();
  }
  if (event.type === 'echo-jump') { trails = trails.filter(point => point.id !== -3); membranes.delete(-3); }
  if (event.type === 'portal') {
    trails = []; membranes.delete(0);
    for (const point of [{ x: event.fromX, y: event.fromY }, event]) particleBurst(point.x, point.y, POWERS.portal.color, 18);
    toast('Through the portal · momentum intact.'); save();
  }
  if (event.type === 'slingshot') { particleBurst(event.x, event.y, POWERS.slingshot.color, 18); toast(event.target ? 'Slingshot · heading for an unhit jelly.' : 'Slingshot · away you go.'); save(); }
  if (event.type === 'reunite') {
    reunions = event.from.map(point => ({ ...point, life: .4 }));
    membranes.delete(-1); membranes.delete(-2); save();
  }
  if (event.type === 'tether') {
    membraneGet(game.bodies[event.a]).glow = .35; membraneGet(game.bodies[event.b]).glow = .35;
  }
  if (event.type === 'push') {
    membraneHit(event.id, -event.nx, -event.ny, 700);
    rings.push({ x: event.x, y: event.y, radius: 12, life: .7, color: POWERS.impact.color, kind: 'impact' });
  }
  if (event.type === 'power-streak') {
    if (event.successful) toast(`${event.capacity} powers next pluck · bloom streak${event.capacity === 3 ? ' at maximum' : ' growing'}.`);
    else if (event.previousCapacity > 1) toast('Streak reset · one power next pluck.');
    save();
  }
  if (event.type === 'power') {
    if (event.kind === 'echo') membranes.delete(-3);
    if (event.kind === 'split') { trails = []; membranes.delete(0); }
    const p = POWERS[event.kind]; toast(`${p.name} · flight refreshed to ${RULE.flightSeconds}s`);
    rings.push({ x: event.x, y: event.y, radius: event.kind === 'attract' || event.kind === 'stasis' ? RULE.powerRadius : 8, life: 1.6, color: p.color, kind: event.kind, bloom: true });
    if (event.kind === 'swap') {
      trails = []; membranes.clear();
      rings.push({ x: event.exitX, y: event.exitY, radius: 8, life: 1.6, color: p.color, kind: 'swap', bloom: true });
      particleBurst(event.exitX, event.exitY, p.color, 24);
    }
    particleBurst(event.x, event.y, p.color, 24); save();
  }
  if (event.type === 'bloom') { toast(`Bloom! +500 · ${Math.min(3, game.power.capacity + 1)} powers next pluck.`); rings.push({ x: event.x, y: event.y, radius: 20, life: 2.5, color: '#c1b4ff', bloom: true }); particleBurst(event.x, event.y, '#ddcbff', 80); save(); }
  if (['rest', 'over', 'win'].includes(event.type)) { save(); if (event.type !== 'rest') announce(`${gameWon(game) ? 'You won! Three blooms.' : 'Out of plucks. Try again.'} ${game.score} resonance.`); }
  uiRender();
}
function particleBurst(x, y, color, count) {
  if (isGentle) return;
  for (let index = 0; index < count; index++) { const angle = Math.random() * Math.PI * 2, speed = 15 + Math.random() * 125; particles.push({ x, y, vx: Math.cos(angle) * speed, vy: Math.sin(angle) * speed, life: .5 + Math.random() * 1.3, color, radius: 1 + Math.random() * 2.5 }); }
  if (particles.length > 350) particles.splice(0, particles.length - 350);
}
// Transient score feedback uses the exact event award, including bank bonuses.
function scorePopupRender(dt, scale) {
  scorePopups = scorePopups.filter(popup => { popup.age += dt; return popup.age < 1.8; });
  const occupied = [];
  context.save(); context.textAlign = 'center'; context.textBaseline = 'middle'; context.lineJoin = 'round';
  for (const popup of scorePopups) {
    const size = (popup.isBloom ? 24 : 18) / scale, text = `+${popup.points.toLocaleString('en-US')}`;
    context.font = `700 ${size}px system-ui, sans-serif`;
    const halfWidth = context.measureText(text).width / 2 + 6 / scale;
    const x = Math.max(RULE.inset + halfWidth, Math.min(RULE.width - RULE.inset - halfWidth, popup.x));
    const rise = (isGentle ? 10 : 46) * (1 - Math.pow(1 - popup.age / 1.8, 2)) / scale;
    let y = Math.max(88 + size, Math.min(RULE.height - 48 - size, popup.y - 12 / scale - rise));
    // Separate simultaneous hit and bloom awards, including dense Split/Echo hits.
    for (const other of occupied) if (Math.abs(x - other.x) < halfWidth + other.halfWidth && Math.abs(y - other.y) < size * 1.25) y = other.y + size * 1.3;
    if (y > RULE.height - 48 - size) y = Math.max(88 + size, popup.y - rise - size * 2);
    occupied.push({ x, y, halfWidth });
    context.globalAlpha = Math.pow(Math.max(0, 1 - popup.age / 1.8), 1.2);
    context.lineWidth = 4 / scale; context.strokeStyle = '#0b1325'; context.strokeText(text, x, y);
    context.fillStyle = popup.color; context.fillText(text, x, y);
  }
  context.restore();
  canvas.dataset.scorePopups = scorePopups.map(popup => `+${popup.points}`).join(',');
  canvas.dataset.scorePopupOpacity = scorePopups.map(popup => Math.pow(Math.max(0, 1 - popup.age / 1.8), 1.2).toFixed(3)).join(',');
}
function geometry() { const rect = canvas.getBoundingClientRect(), scale = rect.width / RULE.width; return { rect, scale, offset: (rect.height / scale - RULE.height) / 2 }; }
function resize() { const { rect } = geometry(), ratio = Math.min(2, devicePixelRatio || 1); canvas.width = Math.round(rect.width * ratio); canvas.height = Math.round(rect.height * ratio); }
new ResizeObserver(resize).observe(canvas);
// Frost is attached to the actual membrane and clipped inside its surface.
function frostRender(body, points, skin, frost) {
  const radius = body.radius;
  context.save(); context.globalAlpha = frost * (isGentle ? .8 : 1);
  const rim = context.createLinearGradient(body.x - radius, body.y - radius, body.x + radius, body.y + radius);
  rim.addColorStop(0, '#f1fcffdd'); rim.addColorStop(.45, '#c5eeff99'); rim.addColorStop(1, '#83c9e875');
  context.strokeStyle = rim; context.lineWidth = radius * .34; context.stroke(skin);
  context.strokeStyle = '#f0fcffe0'; context.lineWidth = radius * .065; context.stroke(skin);
  // Stable fine grains and short branching crystals, never flickering particles.
  for (let index = 0; index < 72; index++) {
    const segment = index % points.length, point = points[segment], next = points[(segment + 1) % points.length];
    const fraction = ((index * 37 + body.id * 11) % 97) / 97, depth = .82 + ((index * 19 + body.id * 7) % 23) / 150;
    const x = body.x + ((point.x + (next.x - point.x) * fraction) - body.x) * depth;
    const y = body.y + ((point.y + (next.y - point.y) * fraction) - body.y) * depth;
    context.fillStyle = index % 3 ? '#edfbff90' : '#ffffffd0';
    context.beginPath(); context.arc(x, y, radius * (index % 4 ? .012 : .022), 0, Math.PI * 2); context.fill();
  }
  context.strokeStyle = '#e4f8ffb0'; context.lineWidth = radius * .018; context.lineCap = 'round';
  for (let index = 0; index < points.length; index += 3) {
    const point = points[index], dx = point.x - body.x, dy = point.y - body.y;
    const x = body.x + dx * .94, y = body.y + dy * .94;
    context.beginPath(); context.moveTo(x, y); context.lineTo(body.x + dx * .77, body.y + dy * .77);
    context.moveTo(body.x + dx * .85, body.y + dy * .85); context.lineTo(x - dy * .06, y + dx * .06);
    context.moveTo(body.x + dx * .85, body.y + dy * .85); context.lineTo(x + dy * .06, y - dx * .06); context.stroke();
  }
  context.restore();
}
function blobRender(body, dt, time) {
  const membrane = membraneGet(body), isSeed = body.id <= 0, hue = isSeed ? body.id === -3 ? POWERS.echo.color : body.id < 0 ? POWERS.split.color : effectGet(game, 'bubble') ? POWERS.bubble.color : '#f1f9d7' : COLORS[body.tone], radius = body.radius;
  membrane.glow = Math.max(0, membrane.glow - dt * 1.4);
  const playback = audio.playbackLights.get(body.id);
  const replayGlow = playback ? Math.max(0, (playback.until - audio.context.currentTime) / .7) * (isGentle ? .18 : .7) : 0;
  const light = Math.max(membrane.glow, replayGlow);
  jellyStep(membrane, body, dt, isGentle, isGentle ? undefined : jellyFlow(body, game.bodies), !isSeed && !!effectGet(game, 'stasis')?.targets.includes(body.id));
  const points = jellyOutline(membrane, body).map(point => ({ x: Math.max(RULE.inset, Math.min(RULE.width - RULE.inset, point.x)), y: Math.max(RULE.inset, Math.min(RULE.height - RULE.inset, point.y)) }));
  const glow = context.createRadialGradient(body.x, body.y, radius * .3, body.x, body.y, radius * 2.8);
  glow.addColorStop(0, hue + (light > .2 ? '70' : isSeed ? '40' : '33')); glow.addColorStop(1, hue + '00');
  context.fillStyle = glow; context.beginPath(); context.arc(body.x, body.y, radius * 2.8, 0, Math.PI * 2); context.fill();
  const skin = new Path2D();
  const first = points[0], last = points.at(-1); skin.moveTo((first.x + last.x) / 2, (first.y + last.y) / 2);
  for (let index = 0; index < points.length; index++) { const a = points[index], b = points[(index + 1) % points.length]; skin.quadraticCurveTo(a.x, a.y, (a.x + b.x) / 2, (a.y + b.y) / 2); }
  skin.closePath();
  const fill = context.createRadialGradient(body.x - radius * .35, body.y - radius * .4, 0, body.x, body.y, radius * 1.1);
  fill.addColorStop(0, isSeed && !effectGet(game, 'bubble') ? '#ffffed' : hue + 'bb'); fill.addColorStop(.45, hue + (isSeed && !effectGet(game, 'bubble') ? 'ee' : '6c')); fill.addColorStop(1, hue + '20');
  context.fillStyle = fill; context.strokeStyle = hue + 'c0'; context.lineWidth = isSeed ? 1.6 : 1.1; context.shadowColor = hue; context.shadowBlur = (isSeed ? 15 : 7) + light * 20; context.fill(skin); context.stroke(skin); context.shadowBlur = 0;
  context.save(); context.clip(skin);
  // Skin highlight follows the deformed upper-left rim instead of floating on a circle.
  context.beginPath();
  for (let index = 14; index <= 20; index++) { const point = points[index], x = body.x + (point.x - body.x) * .79, y = body.y + (point.y - body.y) * .79; if (index === 14) context.moveTo(x, y); else context.lineTo(x, y); }
  context.strokeStyle = '#ffffff70'; context.lineWidth = radius * .08; context.lineCap = 'round'; context.lineJoin = 'round'; context.stroke();
  if (!isSeed) {
    // A pearly nucleus and drifting flecks make each jelly feel inhabited.
    const x = body.x + membrane.core[0], y = body.y + radius * .1 + membrane.core[1];
    const nucleus = context.createRadialGradient(x, y, 0, x, y, radius * .34); nucleus.addColorStop(0, hue + 'd0'); nucleus.addColorStop(1, hue + '00'); context.fillStyle = nucleus; context.beginPath(); context.arc(x, y, radius * .34, 0, Math.PI * 2); context.fill();
    for (let index = 0; index < 5; index++) { const point = points[(index * 5 + body.id) % points.length]; context.beginPath(); context.arc(x + (point.x - body.x) * .45, y + (point.y - body.y) * .4, 1.4, 0, Math.PI * 2); context.fillStyle = hue + 'a0'; context.fill(); }
  }
  if (!isSeed && membrane.frost > .01) frostRender(body, points, skin, membrane.frost);
  if (body.id === 0 && effectGet(game, 'bubble')) {
    // Pearly bands follow the existing soft-body outline, including impact flattening.
    const pearl = context.createLinearGradient(body.x - radius, body.y - radius, body.x + radius, body.y + radius);
    for (const [stop, color] of [[0, '#ffe4fd'], [.3, '#c4b2ff'], [.6, '#9ff9ee'], [1, '#fff4c0']]) pearl.addColorStop(stop, color);
    context.strokeStyle = pearl; context.lineWidth = isGentle ? 2.5 : 4; context.globalAlpha = isGentle ? .55 : .85; context.stroke(skin);
    context.lineWidth = 1.5; context.globalAlpha = .5;
    for (const [start, end] of [[1, 8], [12, 18]]) {
      context.beginPath();
      for (let i = start; i <= end; i++) { const point = points[i], x = body.x + (point.x - body.x) * .88, y = body.y + (point.y - body.y) * .88; if (i === start) context.moveTo(x, y); else context.lineTo(x, y); }
      context.stroke();
    }
  }
  context.restore();
  if (!isSeed && membrane.frost > .03 && (!effectGet(game, 'stasis') || effectGet(game, 'stasis').seconds < 1)) {
    context.save(); context.fillStyle = '#d5f5ff';
    for (let i = 0; i < (isGentle ? 2 : 6); i++) {
      const phase = isGentle ? .3 : (time * .8 + i * .17 + body.id * .11) % 1, angle = i * Math.PI / 3 + body.id;
      const distance = radius + 3 + phase * (isGentle ? 3 : 18);
      context.globalAlpha = membrane.frost * (1 - phase) * (isGentle ? .3 : .65);
      context.beginPath(); context.arc(body.x + Math.cos(angle) * distance, body.y + Math.sin(angle) * distance + phase * 8, 1.6 * (1 - phase) + .4, 0, Math.PI * 2); context.fill();
    }
    context.restore();
  }
  const marker = powerMarkers(game).find(marker => marker.target === body.id);
  if(!isSeed) {context.save();context.fillStyle='#e9ffed';context.font=`${marker?18:26}px Fredoka, sans-serif`;context.textAlign='center';context.textBaseline='middle';context.fillText(JELLY_ROLES[jellyRole(body.id)].mark,body.x,body.y+(marker?body.radius*.68:0));context.restore();}
  if (marker) {
    const p = POWERS[marker.kind], icon = powerIcons[marker.kind], size = Math.min(52, body.radius * 1.25);
    context.save(); context.shadowColor = p.color; context.shadowBlur = isGentle ? 0 : 12;
    if (icon.complete && icon.naturalWidth) context.drawImage(icon, body.x - size / 2, body.y - size / 2, size, size);
    else { context.fillStyle = '#f3fff5'; context.font = '32px Arial'; context.textAlign = 'center'; context.textBaseline = 'middle'; context.fillText(p.symbol, body.x, body.y); }
    context.restore();
  }
  if (!isSeed && game.chain.includes(body.id)) { context.strokeStyle = hue + '88'; context.lineWidth = 1; context.beginPath(); for (const [index, point] of points.entries()) { const x = body.x + (point.x - body.x) * 1.1, y = body.y + (point.y - body.y) * 1.1; if (!index) context.moveTo(x, y); else context.lineTo(x, y); } context.closePath(); context.stroke(); }
}
function render(now) {
  audio.musicUpdate(game.bodies.reduce((sum, body) => sum + Math.hypot(body.vx, body.vy), 0) / (game.bodies.length * 100));
  const elapsed = Math.min(.06, (now - previousTime) / 1000); previousTime = now;
  const isActive = isStarted && !isPaused && !game.isOver && !document.querySelector('dialog[open]') && !document.hidden;
  if (isActive) { accumulator += elapsed; while (accumulator >= RULE.step) { const events = physicsStep(game); events.forEach(eventHandle); accumulator -= RULE.step; } if (game.tick - lastSaveTick >= 60) save(); }
  else accumulator = 0;
  const visualDelta = isPaused || document.hidden || document.querySelector('dialog[open]') ? 0 : elapsed;
  const time = isStarted ? game.tick * RULE.step : now / 1000;
  const { rect, scale, offset } = geometry(), ratio = canvas.width / rect.width;
  context.setTransform(1, 0, 0, 1, 0, 0); context.clearRect(0, 0, canvas.width, canvas.height); context.setTransform(scale * ratio, 0, 0, scale * ratio, 0, offset * scale * ratio);
  // Slow luminous currents, not a grid.
  context.lineWidth = 1;
  for (let ring = 0; ring < 6; ring++) { context.beginPath(); context.ellipse(480 + Math.sin(time * .12 + ring) * 12, 320, 140 + ring * 72, 90 + ring * 50, -.3, 0, Math.PI * 2); context.strokeStyle = '#77b2e0' + (ring % 2 ? '0a' : '10'); context.stroke(); }
  for (let index = 0; index < 75; index++) { const x = ((index * 137.5 + Math.sin(time * .12 + index) * 7) % 900) + 30, y = ((index * 89.7 + Math.cos(time * .17 + index) * 9) % 550) + 45; context.fillStyle = index % 3 ? '#86b7df28' : '#c6c6ff50'; context.beginPath(); context.arc(x, y, index % 4 === 0 ? 1.3 : .7, 0, Math.PI * 2); context.fill(); }
  context.strokeStyle = '#8db9e819'; context.lineWidth = 1; context.beginPath(); context.roundRect(30, 30, 900, 580, 50); context.stroke();
  const seed = game.bodies[0];
  powerVisual.update(visualDelta);
  powerVisual.render(context, game, time, isGentle);
  bolts = bolts.filter(bolt => { bolt.life -= visualDelta; return bolt.life > 0; });
  for (const bolt of bolts) {
    const dx = bolt.x - bolt.fromX, dy = bolt.y - bolt.fromY, distance = Math.max(1, Math.hypot(dx, dy));
    context.save(); context.globalAlpha = Math.min(1, bolt.life / .18); context.strokeStyle = POWERS.lightning.color;
    context.lineWidth = isGentle ? 2 : 3; context.shadowColor = POWERS.lightning.color; context.shadowBlur = isGentle ? 0 : 12;
    context.beginPath(); context.moveTo(bolt.fromX, bolt.fromY);
    for (let index = 1; index <= 6; index++) {
      const offset = isGentle || index === 6 ? 0 : (index % 2 ? 13 : -13);
      context.lineTo(bolt.fromX + dx * index / 6 - dy / distance * offset, bolt.fromY + dy * index / 6 + dx / distance * offset);
    }
    context.stroke(); context.restore();
  }
  const seeds = seedBodies(game);
  if (game.isFlying && !isGentle && isActive) {
    for (const body of seeds) trails.push({ id: body.id, x: body.x, y: body.y, life: .7, comet: body.id === 0 && !!effectGet(game, 'comet'), drunk: body.id !== -3 && !!effectGet(game, 'drunk') });
    if (trails.length > 210) trails.splice(0, trails.length - 210);
  }
  trails = trails.filter(point => { point.life -= visualDelta; return point.life > 0; });
  const previous = new Map();
  for (const point of trails) {
    const a = previous.get(point.id); previous.set(point.id, point);
    if (!a) continue;
    context.strokeStyle = point.comet ? `rgba(255,201,117,${point.life * .8})` : point.drunk ? `rgba(255,172,216,${point.life * .6})` : point.id === -3 ? `rgba(178,192,255,${point.life * .45})` : point.id === -1 ? `rgba(216,183,255,${point.life * .55})` : point.id === -2 ? `rgba(155,237,244,${point.life * .55})` : `rgba(191,246,226,${point.life * .32})`;
    context.lineWidth = point.life * (point.comet ? 24 : point.id < 0 ? 8 : 15); context.lineCap = 'round'; context.beginPath(); context.moveTo(a.x, a.y); context.lineTo(point.x, point.y); context.stroke();
    if (point.comet) { context.strokeStyle = `rgba(255,246,207,${point.life * .8})`; context.lineWidth = point.life * 5; context.stroke(); }
  }
  if (effectGet(game, 'portal')) for (const [index, gate] of effectGet(game, 'portal').gates.entries()) {
    context.save(); context.translate(gate.x, gate.y); context.strokeStyle = index ? '#d4baff' : POWERS.portal.color;
    context.shadowColor = context.strokeStyle; context.shadowBlur = isGentle ? 0 : 14; context.lineWidth = 3;
    context.globalAlpha = effectGet(game, 'portal').cooldown > 0 ? .45 : .9;
    context.beginPath(); context.ellipse(0, 0, 25, 34, -.25, 0, Math.PI * 2); context.stroke();
    context.rotate(isGentle ? index : time * (index ? -1 : 1)); context.lineWidth = 1.5; context.globalAlpha *= .55;
    for (let arc = 0; arc < 3; arc++) { context.beginPath(); context.arc(0, 0, 40, arc * Math.PI * 2 / 3, arc * Math.PI * 2 / 3 + 1); context.stroke(); }
    context.restore();
  }
  if (effectGet(game, 'slingshot')) {
    const effect = effectGet(game, 'slingshot'), anchor = game.bodies[effect.anchor];
    context.save(); context.strokeStyle = POWERS.slingshot.color; context.lineWidth = 2; context.globalAlpha = .6;
    context.setLineDash([4, 6]); context.beginPath(); context.arc(anchor.x, anchor.y, effect.radius + Math.max(0, seed.radius - RULE.seedRadius), 0, Math.PI * 2); context.stroke();
    context.setLineDash([]); context.beginPath(); context.moveTo(anchor.x, anchor.y); context.lineTo(seed.x, seed.y); context.stroke(); context.restore();
  }
  reunions = reunions.filter(point => { point.life -= visualDelta; return point.life > 0; });
  if (!isGentle) for (const point of reunions) {
    const progress = 1 - (point.life / .4) ** 2;
    context.globalAlpha = point.life / .4; context.fillStyle = POWERS.split.color;
    context.beginPath(); context.arc(point.x + (seed.x - point.x) * progress, point.y + (seed.y - point.y) * progress, 8 * point.life / .4 + 2, 0, Math.PI * 2); context.fill(); context.globalAlpha = 1;
  }
  connections = connections.filter(line => { line.life -= visualDelta; return line.life > 0; });
  if (!isGentle) for (const line of connections) { const a = game.bodies[line.from], b = game.bodies[line.to]; context.globalAlpha = line.life / 2.4; context.strokeStyle = line.color + '55'; context.lineWidth = .8; context.beginPath(); context.moveTo(a.x, a.y); context.quadraticCurveTo((a.x + b.x) / 2 + 15, (a.y + b.y) / 2 - 20, b.x, b.y); context.stroke(); context.globalAlpha = 1; }
  for (const body of game.bodies.slice(1)) blobRender(body, visualDelta, time);
  for (const body of seeds) { context.save(); if (body.id === -3) context.globalAlpha = .42; blobRender(body, visualDelta, time); context.restore(); }
  if (!game.isFlying && isStarted && !isPaused && !game.isOver) {
    const path=aimPreview(game,angle,power);
    context.save();context.strokeStyle='#e4ffcb88';context.lineWidth=1.5;context.setLineDash([3,8]);context.beginPath();path.forEach((p,i)=>i?context.lineTo(p.x,p.y):context.moveTo(p.x,p.y));context.stroke();context.setLineDash([]);
    if(path.length===3){context.beginPath();context.arc(path[1].x,path[1].y,5,0,Math.PI*2);context.stroke();}context.restore();
    context.strokeStyle = '#dbf8c833'; context.lineWidth = 1; context.beginPath(); context.arc(seed.x, seed.y, 26 + (isGentle ? 0 : Math.sin(time * 2) * 2), 0, Math.PI * 2); context.stroke();
    if (drag) { context.beginPath(); context.moveTo(seed.x, seed.y); context.lineTo(seed.x - Math.cos(angle) * power * 100, seed.y - Math.sin(angle) * power * 100); context.strokeStyle = '#d8f5caaa'; context.lineWidth = 2; context.stroke(); }
  }
  rings = rings.filter(ring => {
    ring.previousRadius = ring.radius; ring.life -= visualDelta; ring.radius = Math.max(8, ring.radius + visualDelta * (ring.kind ? (ring.kind === 'stasis' ? 0 : ring.kind === 'attract' ? -1 : 1) * ((['swap', 'comet', 'magnet', 'lightning', 'impact', 'tether', 'split', 'bubble', 'portal', 'echo', 'slingshot', 'drunk'].includes(ring.kind) ? 150 : RULE.powerRadius) - 8) / 1.6 : ring.bloom ? 220 : 75));
    if (!isGentle && visualDelta > 0 && !['attract', 'stasis', 'swap', 'comet', 'magnet', 'lightning', 'impact', 'tether', 'split', 'bubble', 'portal', 'echo', 'slingshot', 'drunk'].includes(ring.kind)) for (const body of game.bodies) {
      const pulse = jellyRipple(ring, body);
      if (pulse) membraneHit(body.id, pulse.nx, pulse.ny, pulse.strength);
    }
    return ring.life > 0;
  });
  if (!isGentle) for (const ring of rings.filter(ring => !ring.kind)) { context.globalAlpha = Math.min(.5, ring.life * .5); context.strokeStyle = ring.color; context.lineWidth = ring.bloom ? 2 : 1; context.beginPath(); context.arc(ring.x, ring.y, ring.radius, 0, Math.PI * 2); context.stroke(); context.globalAlpha = 1; }
  particles = particles.filter(particle => particle.life > 0);
  for (const particle of particles) { particle.life -= visualDelta; particle.x += particle.vx * visualDelta; particle.y += particle.vy * visualDelta; context.globalAlpha = Math.min(.8, Math.max(0, particle.life)); context.fillStyle = particle.color; context.beginPath(); context.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2); context.fill(); } context.globalAlpha = 1;
  scorePopupRender(visualDelta, scale);
  if (game.tick - lastUITick >= 12 || frameCount++ % 20 === 0) { uiRender(); lastUITick = game.tick; }
  requestAnimationFrame(render);
}
function uiRender() {
  if (game.mode === 'challenge') best = Math.max(best, game.score);
  $('score').textContent = game.score.toLocaleString('en-US'); $('best').textContent = best.toLocaleString('en-US');
  $('plucks').textContent = game.mode === 'free' ? '∞' : game.plucks; $('pluck-label').textContent = game.mode === 'free' ? 'FREE PLAY' : 'PLUCKS LEFT';
  $('pool-seed').textContent = `POOL / ${game.seed}`;
  $('mode-open').textContent = `Mode: ${modeName(game.mode)} ▾`;
  $('chain-label').textContent = game.chain.length ? `${game.chain.length} NOTES ${game.chain.length >= 5 ? '· BEAUTIFUL.' : '· KEEP IT SINGING.'}` : 'FIVE DIFFERENT JELLIES. ONE BLOOM.';
  $('note-meter').replaceChildren(...Array.from({ length: 5 }, (_, index) => { const item = document.createElement('i'); if (game.chain[index]) { item.className = 'active'; item.style.setProperty('--note', COLORS[game.bodies[game.chain[index]].tone]); } return item; }));
  $('note-meter').setAttribute('aria-label', `${game.chain.length} unique notes this pluck`);
  $('state-label').textContent = isPaused ? 'A QUIET MOMENT.' : game.isOver ? 'EVERY POOL HAS ITS OWN SONG.' : !isStarted ? 'YOUR NEXT LITTLE OBSESSION.' : game.isFlying ? `FOLLOW THE LIGHT · ${Math.max(0, Math.ceil(RULE.flightSeconds - game.flightAge))}s` : 'PULL BACK. LET GO. LISTEN.';
  $('goal-label').textContent = game.mode === 'free' ? 'FREE PLAY · Let the pool sing' : gameWon(game) ? 'YOU WON · Three blooms complete' : `MAKE ${RULE.goalBlooms} BLOOMS TO WIN · ${Math.min(game.blooms, RULE.goalBlooms)} / ${RULE.goalBlooms}`;
  $('goal-progress').hidden = game.mode === 'free'; $('goal-progress').max = RULE.goalBlooms; $('goal-progress').value = Math.min(game.blooms, RULE.goalBlooms);
  $('objectives').checked=game.objective.enabled;$('objectives').disabled=game.isFlying;
  $('objective-status').textContent=game.objective.enabled?`${game.objective.earned?'Complete · next: ':''}${OBJECTIVES[(game.objective.index+(game.isFlying&&game.objective.earned?1:0))%3]} · +200 · ${game.objective.completed} completed`:'Optional goals · enable between plucks for a little direction.';
  $('palette').value=audio.music.palette;
  const shot=game.lastShot;
  $('shot-result').textContent=game.isFlying?`${game.chain.length} unique notes · ${game.banks} banks · ${game.power.used} powers`:shot?`${shot.bloom?'Bloom!':shot.notes===4?'One jelly short of a bloom.':`${shot.notes} of 5 notes toward a bloom.`}${shot.points===null?' · Resumed shot':` +${shot.points}`} · ${shot.banks} banks · ${shot.powers} powers${shot.objective?' · Objective complete':''}`:'Aim for a wall bank. The dotted guide shows your first rebound; drifting jellies can change the path.';
  const song = musicProgress(audio.music);
  $('song-stage').textContent = `${song.name}${audio.isMusicPlaying && !audio.isMuted && !audio.isPaused && audio.ambience ? audio.stage < song.stage ? ' · joining on the next bar' : audio.section !== song.name ? ` · ${audio.section}` : '' : ''}`;
  $('song-next').textContent = song.next;
  $('song-growth').value = song.stage;
  phraseRender();
  $('run-stats').textContent = `${game.blooms} blooms · ${game.bestChain} best chain`;
  $('power-active').hidden = game.effects.length === 0;
  $('power-active').textContent = game.effects.map(effect => `${POWERS[effect.kind].name}${effect.kind === 'echo' && !effect.isReady ? ' forming' : effect.kind === 'slingshot' ? ' winding up' : ' active'} · ${effect.seconds.toFixed(1)}s`).join('  /  ');
  canvas.dataset.powerEffect = game.effects.map(effect => effect.kind).join(',') || 'none';
  const allowance = powerAllowance(game), used = game.isFlying ? game.power.used : 0, markers = powerMarkers(game);
  for (const [index, slot] of Array.from($('power-slots').children).entries()) {
    const status = index < used ? 'used' : index < allowance ? 'ready' : 'locked';
    slot.dataset.state = status;
    const marker = markers[index - used], name = marker ? POWERS[marker.kind].name : '';
    const label = status === 'ready' ? `${name} · Ready` : status === 'used' ? 'Used ✓' : 'Locked';
    const content = `${status === 'ready' ? `<img src="./icon/power/${marker.kind}.svg" alt="" width="24" height="24">` : ''}<span>${label}</span>`;
    if (slot.innerHTML !== content) slot.innerHTML = content;
  }
  $('power-progress').textContent = game.isFlying ? `${used} / ${allowance} powers used · bloom to ${allowance === 3 ? 'keep all three' : `earn ${allowance + 1} next pluck`}` : `${allowance} ${allowance === 1 ? 'power' : 'powers'} this pluck · ${allowance === 3 ? 'bloom to keep all three' : `bloom to earn ${allowance + 1} next pluck`}. No bloom resets to 1.`;
  canvas.dataset.stasisTargets = (effectGet(game, 'stasis')?.targets || []).join(','); canvas.dataset.stasisSpeed = String(Math.max(0, ...(effectGet(game, 'stasis')?.targets || []).map(id => Math.hypot(game.bodies[id].vx, game.bodies[id].vy))));
  canvas.dataset.seedCount = String(seedBodies(game).length); canvas.dataset.seedRadius = game.bodies[0].radius.toFixed(1);
  const power = game.power, first = markers[0], kind = first?.kind || power.offer, p = POWERS[kind], available = powerAvailable(game);
  if ($('power-icon').dataset.kind !== kind) { $('power-icon').src = powerIcons[kind].src; $('power-icon').dataset.kind = kind; $('power-icon').style.setProperty('--power-color', p.color); }
  $('power-title').textContent = markers.length > 1 ? `${markers.length} powers · all in the pool` : available ? `${p.name} · activates on contact` : 'All powers collected';
  $('power-status').textContent = markers.length > 1 ? `${markers.map(marker => POWERS[marker.kind].name).join(' + ')}. All marked jellies are ready now. Hit them in any order to activate.` : available ? `Hit the marked ${p.name} jelly with your seed. ${p.description}` : `All ${allowance} ${allowance === 1 ? 'power used' : 'powers used'} this pluck. The next set appears when this pluck ends.`;
  Object.assign(canvas.dataset, { power: available ? 'ready' : 'used', powerKind: kind, powerTarget: String(first?.target || 0), powerMarkers: markers.map(marker => `${marker.kind}:${marker.target}`).join(','), powerOffer: power.offer, powerClaims: String(power.claims), powerUsed: String(used), powerAllowance: String(allowance) });
  $('shoot').disabled = !isStarted || isPaused || game.isOver || game.isFlying;
  $('pause').disabled = !isStarted || game.isOver; $('pause').textContent = isPaused ? '▷' : 'Ⅱ'; $('pause').setAttribute('aria-label', isPaused ? 'Resume game' : 'Pause game');
  $('over-overlay').hidden = !isStarted || !game.isOver;
  if (game.isOver) { $('end-title').textContent = gameWon(game) ? 'You made it bloom.' : 'One more ripple?'; $('end-label').textContent = gameWon(game) ? 'YOU WON · THREE BLOOMS' : 'OUT OF PLUCKS'; $('end-score').textContent = game.score.toLocaleString('en-US'); $('end-detail').textContent = `${game.blooms} / ${RULE.goalBlooms} blooms · ${game.launches} plucks used${gameWon(game) ? ' · Keep the song going below.' : ' · Reach three blooms to win.'}`; }
  // Read-only observability for live-browser QA. Never drives gameplay.
  canvas.dataset.gentle = String(isGentle);
  canvas.dataset.jellyDeformation = Math.max(0, ...Array.from(membranes.values(), skin => Math.hypot(...skin.strain))).toFixed(3);
  Object.assign(canvas.dataset, { physicsTick: String(game.tick), flying: String(game.isFlying), score: String(game.score), seedX: game.bodies[0].x.toFixed(2), seedY: game.bodies[0].y.toFixed(2), chain: String(game.chain.length), audioState: audio.context?.state || 'locked', soundEvents: String(audio.eventCount), notes: String(noteCount), mode: game.mode, harmony: audio.harmony?.name || 'none', songChords: String(audio.music.history.length), songTheme: audio.music.theme.join(','), musicPending: String(audio.musicQueue.length), musicVoices: String(audio.phraseVoices.size), audioVoices: String(audio.voiceCount), harmonyPaused: String(audio.isPaused), musicPassage: String(audio.passage), musicSection: audio.section, musicStage: String(audio.stage), songStage: String(song.stage), songPlucks: String(audio.music.plucks), songBar: String(audio.music.bar), mediaState: audio.media.state, mediaReady: String(audio.media.ready), mediaArtwork: audio.media.artwork?.[0]?.src || '', hookNextBar: String(audio.music.evolution.nextBar), hookPending: String(!!audio.music.evolution.pending), phraseSteps: (audio.music.motifs.at(-1)?.steps || []).join(','), hookSteps: (audio.music.hook?.steps || []).join(','), phraseReplayCount: String(audio.playbackCount), phraseReplayIds: [...audio.playbackLights.keys()].join(','), ambience: String(audio.ambience) });
}
function phraseRender() {
  const isLive = game.isFlying, phrase = isLive ? musicPhrasePreview(audio.music) : audio.music.motifs.at(-1), now = audio.context?.currentTime ?? 0;
  const isAudible = audio.isMusicPlaying && audio.context?.state === 'running' && !audio.isMuted && !audio.isPaused && audio.ambience > 0;
  const count = phrase?.tones.length || 0;
  $('phrase-title').textContent = isLive ? `YOUR PHRASE · LIVE · ${count} ${count === 1 ? 'NOTE' : 'NOTES'}` : phrase ? `YOUR LATEST PHRASE · ${count} ${count === 1 ? 'NOTE' : 'NOTES'}` : 'YOUR PHRASE';
  $('phrase-status').textContent = isLive ? !isStarted ? 'Your unfinished phrase is saved. Return to keep playing.' : audio.isPaused ? 'Paused · your growing phrase is saved.' : phrase ? 'Each jelly adds a note. Your phrase is taking shape.' : 'Your new phrase starts with the first jelly.' : !phrase ? 'Pluck through the jellies. Listen for their reply.' : !isStarted ? 'Your phrase is saved. Return to hear it.' : audio.isPaused ? 'Paused · your phrase is saved.' : !isAudible ? 'Phrase saved · turn on sound and ambience to hear it.' : now < audio.replyUntil ? 'The pool is playing your phrase back.' : audio.music.reply ? 'Your phrase joins on the next bar.' : 'Follow the glowing jellies as your melody returns.';
  $('phrase-choice').textContent=!audio.music.hook?'Hit three different jellies in one pluck to establish your melody.':audio.music.evolution.pending?'Your melody repeats. New notes will join at the next section.':'Your melody repeats and gradually absorbs new ideas.';
  const pattern = $('phrase-pattern'), key = JSON.stringify([isLive, phrase || null]);
  pattern.dataset.live = String(isLive); pattern.dataset.noteCount = String(count);
  if (pattern.dataset.phrase !== key) {
    pattern.dataset.phrase = key;
    pattern.replaceChildren(...Array.from({ length: 16 }, (_, step) => {
      const item = document.createElement('i'), index = phrase?.steps.indexOf(step) ?? -1;
      if (index >= 0) { item.style.setProperty('--note', COLORS[phrase.tones[index]]); item.style.setProperty('--height', `${9 + (phrase.pitches[index] - 48) * .45}px`); }
      return item;
    }));
    pattern.setAttribute('aria-label', phrase ? `${isLive ? 'Live two-bar phrase' : 'Two-bar phrase'}, ${phrase.tones.length} notes at steps ${phrase.steps.map(step => step + 1).join(', ')}` : isLive ? 'Live phrase, waiting for the first note' : 'No phrase recorded yet');
  }
  const lastStrike = audio.music.strikes.at(-1);
  const activeStep = isLive ? phrase && lastStrike && game.tick - lastStrike.tick < 42 ? phrase.steps.at(-1) : -1 : isAudible && audio.lastPlayback?.reply && now - audio.lastPlayback.at < .35 ? audio.lastPlayback.step : -1;
  for (const [step, item] of [...pattern.children].entries()) item.classList.toggle('active', step === activeStep);
}
function controlsRender() { $('sound').checked = !audio.isMuted; document.querySelector('.sound-hint').textContent = audio.isMuted ? 'Sound is off. Check Sound below to listen.' : '♪ Sound on. Headphones make it lovelier.'; $('volume').value = audio.volume * 100; $('ambience').value = audio.ambience * 100; $('motion').checked = isGentle; $('stream').checked = isStream; document.body.classList.toggle('motion-reduced', isGentle); document.body.classList.toggle('stream-mode', isStream); }
function shoot() { if (!isStarted || isPaused || document.querySelector('dialog[open]')) return; audioUnlockAsync(); if (launch(game, angle, power)) { audio.eventPlay({ type: 'launch', x: game.bodies[0].x }); save(); uiRender(); } }
function pauseSet(value) { if (!isStarted || game.isOver) return; isPaused = value; audio.pauseSet(value); dragCancel(); $('pause-overlay').hidden = !value; save(); uiRender(); if (!value) { audioUnlockAsync(); canvas.focus({ preventScroll: true }); } }
function start() { audio.media.describe(game.seed); isStarted = true; isPaused = false; $('welcome').hidden = true; $('pause-overlay').hidden = true; if (audio.bloomCount !== game.blooms) audio.harmonySet(game.blooms); audio.pauseSet(false); audio.musicStart(); audioUnlockAsync(); save(); uiRender(); canvas.focus({ preventScroll: true }); }
function loadPool(nextGame, music = null) {
  game = structuredClone(nextGame); audio.musicRestore(music, game.blooms, game.launches);
  membranes.clear(); powerVisual.clear(); trails = []; particles = []; rings = []; connections = []; bolts = []; reunions = []; scorePopups = []; dragCancel(); accumulator = 0;
  angle = -Math.PI / 2; power = .7; $('power').value = 70; clearTimeout(toastTimer); $('toast').classList.remove('show'); $('copy-result').textContent = 'Copy this result ↗'; start();
}
function newPool(seed, mode) { loadPool(gameCreate(seed, mode)); }
function dialogOpen(continueSong = false) {
  carrySong = continueSong;
  $('seed-input').value = game.seed;
  $('new-title').textContent = continueSong ? 'Continue this song in Free play?' : `New ${modeName(game.mode)} game?`;
  $('new-copy').textContent = continueSong ? 'This replaces your saved Free play pool and song. Your completed Challenge stays saved.' : `This replaces only your ${modeName(game.mode)} pool and song. Your other mode and personal best stay saved.`;
  $('pool-options').hidden = continueSong;
  $('new-confirm').textContent = continueSong ? 'Replace Free play & continue' : `Start new ${modeName(game.mode)} game`;
  $('new-dialog').showModal();
}
function modeOpen() {
  save();
  for (const mode of ['challenge', 'free']) {
    const entry = store.pools[mode];
    $(`choose-${mode}`).textContent = mode === game.mode ? `✓ Current: ${modeName(mode)}` : `${entry ? 'Resume' : 'Start'} ${modeName(mode)}`;
    $(`choose-${mode}`).setAttribute('aria-pressed', String(mode === game.mode));
    $(`saved-${mode}`).textContent = entry ? `${entry.game.score.toLocaleString()} resonance · ${entry.game.blooms} blooms${entry.game.isOver ? ' · completed' : ''}` : 'No saved pool yet';
  }
  $('mode-dialog').showModal();
}
function switchMode(mode) {
  save(); $('mode-dialog').close();
  if (mode === game.mode) return;
  const entry = store.pools[mode]; loadPool(entry?.game || gameCreate(game.seed, mode), entry?.music);
}
function carryToFree() {
  save(); const next = structuredClone(game), music = audio.musicSave();
  if (continueFree(next)) loadPool(next, music);
}
function pointerWorld(event) { const { rect, scale, offset } = geometry(); return { x: (event.clientX - rect.left) / scale, y: (event.clientY - rect.top) / scale - offset }; }
function dragUpdate(event) { if (!drag || drag.id !== event.pointerId) return; const point = pointerWorld(event), dx = drag.x - point.x, dy = drag.y - point.y, distance = Math.hypot(dx, dy); if (distance > 3) { angle = Math.atan2(dy, dx); power = Math.min(1, distance / 150); drag.distance = distance; $('power').value = power * 100; } }
function dragCancel(event) {
  if (!drag || event?.pointerId !== undefined && drag.id !== event.pointerId) return;
  const id = drag.id; drag = null;
  if (canvas.hasPointerCapture(id)) canvas.releasePointerCapture(id);
}
canvas.addEventListener('pointerdown', event => {
  if (event.button !== 0) return;
  // Prevent native focus/selection from moving the page before capture begins.
  event.preventDefault();
  if (drag || !event.isPrimary || !isStarted || isPaused || game.isFlying || game.isOver) return;
  canvas.focus({ preventScroll: true });
  drag = { ...pointerWorld(event), id: event.pointerId, distance: 0 };
  canvas.setPointerCapture(event.pointerId); audioUnlockAsync();
});
canvas.addEventListener('pointermove', event => {
  if (!drag || drag.id !== event.pointerId) return;
  event.preventDefault(); dragUpdate(event);
});
canvas.addEventListener('pointerup', event => {
  if (!drag || drag.id !== event.pointerId) return;
  event.preventDefault(); dragUpdate(event);
  const distance = drag.distance; dragCancel(event);
  if (distance > 8) shoot();
});
canvas.addEventListener('pointercancel', dragCancel);
canvas.addEventListener('lostpointercapture', dragCancel);
window.addEventListener('blur', () => dragCancel());
// Safari fallback: touchmove remains targeted at this canvas even outside its bounds.
// Keep the listener local and explicitly non-passive so the rest of the page scrolls.
canvas.addEventListener('touchmove', event => { if (event.cancelable) event.preventDefault(); }, { passive: false });
window.addEventListener('keydown', event => {
  if (event.target.matches('input,select,textarea') || document.querySelector('dialog[open]')) return;
  if (event.target.matches('button') && event.key === ' ') return;
  if (['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown', ' ', 'p', 'P'].includes(event.key)) event.preventDefault();
  if (event.key === 'ArrowLeft') angle -= event.shiftKey ? .02 : .09;
  if (event.key === 'ArrowRight') angle += event.shiftKey ? .02 : .09;
  if (event.key === 'ArrowUp') power = Math.min(1, power + .05);
  if (event.key === 'ArrowDown') power = Math.max(0, power - .05);
  $('power').value = power * 100;
  if (event.key === ' ' && !event.repeat) shoot();
  if (event.key.toLowerCase() === 'p' && !event.repeat) pauseSet(!isPaused);
});
$('continue-free').onclick = () => { if (store.pools.free) dialogOpen(true); else carryToFree(); };
$('start').onclick = start; $('shoot').onclick = shoot; $('pause').onclick = () => pauseSet(!isPaused); $('resume').onclick = () => pauseSet(false);
$('aim-left').onclick = () => { angle -= .14; }; $('aim-right').onclick = () => { angle += .14; }; $('power').oninput = () => { power = Number($('power').value) / 100; };
$('objectives').onchange=event=>{if(!game.isFlying){game.objective.enabled=event.currentTarget.checked;save();uiRender();}};
$('palette').onchange=event=>{audio.music.palette=event.currentTarget.value;save();};
$('sound').onchange = event => { audio.settingsSet(audio.volume, !event.currentTarget.checked); audioUnlockAsync(); controlsRender(); save(); };
$('ambience').oninput = () => { audio.ambienceSet(Number($('ambience').value) / 100); save(); };
$('volume').oninput = () => { audio.settingsSet(Number($('volume').value) / 100, audio.isMuted); save(); };
$('audition').onclick = async () => { if (audio.isMuted) { toast('Check Sound below to listen'); return; } audio.media.describe(game.seed); await audioUnlockAsync(); audio.audition(); };
$('motion').onchange = event => { isGentle = event.currentTarget.checked; if (isGentle) { particles = []; trails = []; } controlsRender(); save(); };
$('stream').onchange = event => { isStream = event.currentTarget.checked; controlsRender(); save(); };
$('fullscreen').onclick = async () => { try { if (document.fullscreenElement) await document.exitFullscreen(); else await document.documentElement.requestFullscreen(); } catch { toast('Fullscreen is unavailable here'); } };
$('help-open').onclick = () => $('help-dialog').showModal();
$('restart').onclick = () => dialogOpen(); $('mode-open').onclick = modeOpen; $('retry').onclick = () => dialogOpen();
for (const mode of ['challenge', 'free']) $(`choose-${mode}`).onclick = () => switchMode(mode);
$('seed-form').onsubmit = event => { event.preventDefault(); const seed = $('seed-input').value.trim(); if (!seed) return; $('new-dialog').close(); if (carrySong) carryToFree(); else newPool(seed, game.mode); };
document.querySelectorAll('[data-close]').forEach(button => { button.onclick = () => button.closest('dialog').close(); });
document.querySelectorAll('dialog').forEach(dialog => dialog.addEventListener('close', () => { if (isStarted) canvas.focus({ preventScroll: true }); }));
$('copy-result').onclick = async () => { try { await navigator.clipboard.writeText(`Ricochet Bloom · ${gameWon(game) ? 'WIN · ' : ''}${game.score} resonance · ${game.blooms} blooms · ${game.bestChain} best chain · seed ${game.seed}`); $('copy-result').textContent = 'Copied ✓'; } catch { $('copy-result').textContent = 'Clipboard unavailable'; } };
document.addEventListener('visibilitychange', () => { if (document.hidden) { audio.pauseSet(true); if (isStarted) pauseSet(true); } else if (isStarted && game.isOver) { audio.pauseSet(false); audioUnlockAsync(); } });
window.addEventListener('pagehide', () => { audio.pauseSet(true); save(); });
if (saved) { $('welcome-copy').textContent = `Your ${saved.mode === 'free' ? 'free-play' : 'challenge'} pool is waiting. ${saved.score} resonance, seed ${saved.seed}.`; $('start').textContent = saved.isOver ? 'View your result ↗' : 'Return to the pool ↗'; }
if (!storageIsAvailable) $('save-status').textContent = 'Save unavailable · keep this tab open';
audio.media.actions(() => {
  if (document.hidden || audio.isMuted || !audio.volume || !audio.ambience) return;
  if (!isStarted) start();
  else if (!game.isOver) pauseSet(false);
  else { audio.pauseSet(false); audioUnlockAsync(); }
}, () => { audio.pauseSet(true); if (isStarted && !game.isOver) pauseSet(true); });
songLibrarySetup(()=>({name:`${game.seed} · ${game.blooms} blooms`,music:audio.musicSave()}),()=>{dragCancel();save();audio.pauseSet(true);},()=>audio.pauseSet(isPaused||!isStarted));
controlsRender(); uiRender(); requestAnimationFrame(render);
if (['127.0.0.1', 'localhost', '[::1]'].includes(location.hostname)) {
  fetch('/api/status').then(response => response.ok ? response.json() : null).then(status => {
    if (status?.app !== 'ricochet-bloom') return;
    $('shutdown').hidden = false; $('shutdown').onclick = () => $('shutdown-dialog').showModal();
    $('shutdown-confirm').onclick = async () => { save(); try { const response = await fetch('/api/shutdown', { method: 'POST', headers: { 'X-Ricochet-Local': 'shutdown' } }); if (!response.ok) throw new Error(); audio.harmonySet(0); document.body.replaceChildren(Object.assign(document.createElement('p'), { textContent: 'Your pool is saved. The local server is shut down; you can close this tab.' })); } catch { toast('Shutdown failed. The server may still be running.'); } };
  }).catch(() => {});
}
