import { playerBuild, playerSync } from './player-upgrade.js?v=fab6c92f134e88ebe641c4be9b87d9e46b857905b117a20831b164d5181c0c23';
import { poolMedalRecord, poolMedalRecords } from './storage.js?v=b0486b5e1c21ec227258e9e2560a61459aa28fc2fedb80eb91b582892904dfa5';
import { medalIcon, medalBadge } from './medal-ui.js?v=4fccbcfa467ab558a8cfba26398ff7d1b89d650b0664c6af2ba633490cf7ad0c';
import { poolConditions, poolMedalKey, medalEvaluate } from './medal.js?v=cd0d6145cbb29d0887e81e0978d8fd4d411c6c3ecac8f6eb29813d4d5677468e';
import { SCORE_DEFAULT, SCORE_SEED, scoreTargets, scoreMedal } from './score-attack.js?v=0f35b25842dfb9cfe110fc14f07cae2cd19505b3deda3b7e67833a9a8f1a9c1e';
import { scoreRead, scoreWrite } from './score-attack-store.js?v=5ff229a31a77b92b75b6336e1bb1d7143a5c4a32922a4c4f10e12c8f11de9e18';
import { earningAmount } from './earning.js?v=408b9cb571894b109f7df2643c488476ddad89967db77e8d677dfcca3957c9f0';
import { trialMount } from './trial-ui.js?v=a43e5634a1895fcb9673817b865bfd994580706527c98e30c8803d063d854e6c';
import { GAME_VERSION } from './version.js?v=7554369f5c557331fb9ed36e28ae98dd1bd49b4ea9de41b830a7883465b952ff';
import { powerSlots } from './power-ui.js?v=740d7f3f36f4da49cd7198c6edb00bf78e8ffd99529f41b29dfe32c77598f44b';
import { creditsMount } from './credit.js?v=c4046183d2832bfd89b418e62fc0f31c438ff69d93d20b503adc0750f974f22d';
import { liveBubbles, WAVE_ENTRY } from './wave.js?v=3a330797f014cf08578ea70085a2b36387b02f2893aaa7fb87cdbb78ea7469ea';
import { viewportMount } from './viewport.js?v=91bdd921ed550b7501c923fff9a5b64cb99a50cc24eee3375556a1c1c0f4b953';
import { edgeBackMount } from './edge-back.js?v=54b2fd4df4f0c89884aad5e21ea057445593e142f0a42262f79b0964d63b6fa6';
import { wikiMount } from './wiki.js?v=729df28ce2f38ed53e9fdeedc2714175043d62edbe6aba34c5fa0ffcffb341d2';
import { titleCase } from './ui-text.js?v=02f24218cfade2c1cf218f107876f5365ad03a4287cebbb4b8e0817ce89eb0d0';
import { POOL_NAMES } from './run.js?v=eb1f706f689b3079fea4ecb6e90354a12c77a1b51e17ab05552d3f14403957b8';
import { freePlaySync, freePlayBuild } from './free-play.js?v=ab6d5f75a0ad0461b01449fdb1557b742f9c237d7dec057c297fbcd41c6658d5';
import { fullscreenMount } from './fullscreen.js?v=0011717aaa92f510dacfcab6ab222ee5593e298cc8c6885cfb22ceb90859bdad';
import {lifecycleMount} from './lifecycle.js?v=748e534e99e5d77a2695a1c9cadf48a5f695f18ef98ee437691640771511eaf0';
import { gameMenuMount } from './game-menu.js?v=510a0a00c92d17dbcf124c496ad4368cd2d70b3bb0dfaef23cba7e9a3c225ddb';
import { environmentRender, regionFrozen, trackGet } from './track.js?v=36bf3603425adc5532331daf4647dba23a3d467e754a0405a1e7738fe443f03b';
import { POWER_TREES } from './power-tree.js?v=9fda938ef3e82ce596579a6bd292edca93bb30ccd3efb174b1a25b7d418fa895';
import { progressionMount } from './progression-ui.js?v=a4225c8dadb74d1936d06e750327b53f8de62449dbc8efe6cc530296c41479f0';
import {assetURL} from './asset.js?v=3cbfab492cc37c59b11a7e7ee1809773bc384873f2e900d7d5fa6526e0af4b91';
import {buttonLabel,iconHTML,iconNode} from './ui-icon.js?v=7e81246e997e2106001cc2f001032e68090a0c751f008678bd91820191a7979e';
import {poolView} from './view.js?v=26cab1c9efeb1cecf6a36401d7839290091b4296d5bc450e29d6f50e884e2bea';
import {songLibrarySetup} from './song-ui.js?v=dcee33edd8aaa975bd0cea86ae6fc72b214428efaef648ff024354d3950693ce';
import { RULE, COLORS, gameCreate, gameWon, continueFree, launch, physicsStep, powerAvailable, powerAllowance, powerMarkers, effectGet, frozenHit, seedBodies, POWERS, OBJECTIVES, objectiveProgress, aimPreview, blasterTarget } from './engine.js?v=5d4ecf80115d71c18a5182dcc78d6161803b2652f17a3fcec1c5a48a149bedd8';
import { STORAGE, LEGACY_STORAGE, poolStoreRead, poolStoreSet } from './storage.js?v=b0486b5e1c21ec227258e9e2560a61459aa28fc2fedb80eb91b582892904dfa5';
import { PoolSound } from './sound.js?v=c5b720a57ce4a0312d2ffe2245c1898646e079c438429550b2e8b861a164c2e5';
import { musicProgress, musicPhrasePreview, BUBBLE_ROLES, bubbleRole } from './music.js?v=f7242d62cbdb10208c01d67fbb890f8a3feebd44c08971b2dc574fe5d49ea9fb';
import { bubbleCreate, bubbleHit, bubbleStep, bubbleOutline, bubbleFlow, bubbleRipple } from './bubble.js?v=385baeaa905192ab9831eba4809c9c2370062e45dd55402b892d2ea214a30bac';
import { PowerVisual } from './power-visual.js?v=c7788524b879cfc0c6c42d35987dc218070330dfff70a3ba8f022fbc01673339';
viewportMount();
const $ = id => document.getElementById(id), canvas = $('arena'), context = canvas.getContext('2d'), audio = new PoolSound();
let store = poolStoreRead(null), storageIsAvailable = true;
try { store = poolStoreRead(JSON.parse(localStorage.getItem(STORAGE) ?? localStorage.getItem(LEGACY_STORAGE) ?? 'null')); } catch { storageIsAvailable = false; }
let preferences = store.preferences, best = store.best, saved = store.pools[store.activeMode]?.game, savedMusic = store.pools[store.activeMode]?.music;
let game = saved || gameCreate(new URL(location.href).searchParams.get('seed')?.slice(0, 32) || 'LAGOON', store.activeMode);
let carrySong = false, portraitView = false, progression = null, navigation = null, trials = null, physicsBatch = false;
const modeName = mode => progression?.context==='challenge'?'Shared Challenge':mode==='song-run'?'Melody Journey':mode==='score-attack'?'Score Attack':mode==='waves'?'Endless Waves':mode === 'free' ? 'Free play' : 'Challenge';

audio.musicRestore(savedMusic, game.blooms, game.launches);
let assistedControls = preferences.assistedControls === true;
let isStarted = false, isPaused = false, isGentle = preferences.gentle === true, isStream = preferences.stream === true;
let angle = -Math.PI / 2, power = .7, drag = null, previousTime = performance.now(), accumulator = 0, lastSaveTick = 0, lastUITick = -100;
let trails = [], particles = [], rings = [], connections = [], bolts = [], reunions = [], scorePopups = [], toastTimer, frameCount = 0, noteCount = 0;
const membranes = new Map();
const powerVisual = new PowerVisual();
const powerIcons = Object.fromEntries(Object.keys(POWERS).map(kind => {
  const icon = new Image(); icon.src = new URL(assetURL(`./icon/power/${kind}.svg`), import.meta.url).href; return [kind, icon];
}));
// Role markings use the same SVG geometry as the musical legend.
const roleIcons = Object.fromEntries(Object.keys(BUBBLE_ROLES).map(role => {
  const icon = new Image(); icon.src = new URL(assetURL(`./icon/ui/${role}.svg`), import.meta.url).href; return [role, icon];
}));
for (const [kind, p] of Object.entries(POWERS)) {
  const card = document.createElement('div'); card.className = 'power-card'; card.style.setProperty('--power-color', p.color);
  const icon = document.createElement('img'); icon.src = powerIcons[kind].src; icon.alt = ''; icon.width = icon.height = 36;
  const copy = document.createElement('div'), name = document.createElement('strong'), detail = document.createElement('p');
  name.textContent = p.name; detail.textContent = p.description; copy.append(name, detail); card.append(icon, copy); $('power-guide').append(card);
}
$('power-guide-title').textContent = `Meet All ${Object.keys(POWERS).length} Powers`;
$('play-location').textContent = location.protocol === 'https:' ? '● ONLINE PLAY' : '● LOCAL PLAY';

audio.settingsSet(Number.isFinite(preferences.volume) ? Math.max(0, Math.min(1, preferences.volume)) : audio.volume, preferences.muted === true);
audio.ambienceSet(preferences.ambience);
function save() {
  if(trials?.active)return trials.save();
  if (game.mode === 'challenge') best = Math.max(best, game.score);
  if(game.mode==='score-attack'){if(!scoreWrite(localStorage,game,audio.musicSave())){storageIsAvailable=false;isPaused=true;audio.pauseSet(true);$('save-status').textContent='Score Attack could not be saved. Keep this tab open and retry from Pause.';return false;}}
  else if(!progression||progression.context==='legacy')poolStoreSet(store, game, audio.musicSave());
  else if(!physicsBatch&&progression.checkpoint(game,audio.musicSave())===false)return false; store.best = best; store.preferences = { ...preferences, volume: audio.volume, ambience: audio.ambience, muted: audio.isMuted, gentle: isGentle, stream: isStream, assistedControls };
  if(!progression||progression.context==='legacy')poolMedalRecord(store,game,game.earning?.kind??progression?.trialKind??'normal');
  try { localStorage.setItem(STORAGE, JSON.stringify(store)); storageIsAvailable = true; } catch { storageIsAvailable = false; }
  $('save-status').textContent = storageIsAvailable ? '● Pool saved on this browser' : 'Save unavailable · keep this tab open'; lastSaveTick = game.tick;
  return storageIsAvailable;
}
function announce(text) { $('announcement').textContent = text; }
function toast(text) { $('toast').textContent = text; $('toast').classList.add('show'); clearTimeout(toastTimer); toastTimer = setTimeout(() => $('toast').classList.remove('show'), 1600); announce(text); }
async function audioUnlockAsync() { try { await audio.unlockAsync(); } catch { toast('Audio unavailable in this browser'); } }
function membraneGet(body) {
  if (!membranes.has(body.id)) membranes.set(body.id, bubbleCreate());
  return membranes.get(body.id);
}
function membraneHit(id, nx, ny, strength) {
  const body = id < 0 ? seedBodies(game).find(body => body.id === id) : game.bodies[id]; if (!body || isGentle) return;
  bubbleHit(membraneGet(body), body.radius, nx, ny, strength, !!effectGet(game, 'stasis')?.targets.includes(id));
}
function eventHandle(event) {
  audio.eventPlay({ ...event, tick: game.tick });
  powerVisual.event(event, game);
  if (Number.isFinite(event.points) && event.points > 0) {
    scorePopups.push({ x: event.x, y: event.y, points: event.points, age: 0, isBloom: event.type === 'bloom', color: event.type === 'bloom' ? '#e1d4ff' : COLORS[event.tone] || '#e4ffcb' });
    if (scorePopups.length > 32) scorePopups.shift();
  }
  if(event.type==='pop'){particleBurst(event.x,event.y,COLORS[event.tone],22);rings.push({x:event.x,y:event.y,radius:event.radius,life:.4,color:COLORS[event.tone],bloom:false,touched:new Set()});}
  if(event.type==='wave-clear'){const medal=poolMedalRecord(store,game,game.earning?.kind??progression?.trialKind??'normal',event);toast(`Wave ${event.number} cleared · ${medal||'Complete'} · +${event.points}`);}
  if(event.type==='wave'){membranes.clear();powerVisual.clear();trails=[];connections=[];bolts=[];reunions=[];announce(`Wave ${event.number}. Five shots to pop every bubble.`);save();}
  if (event.type === 'impact') { membraneHit(event.a, event.nx, event.ny, event.speed); membraneHit(event.b, -event.nx, -event.ny, event.speed); }
  if (event.type === 'blaster-hit') { membraneHit(event.id,-event.nx,-event.ny,650); particleBurst(event.x,event.y,POWERS.blaster.color,8); }
  if (event.type === 'blaster-fire') { membraneHit(0,event.nx,event.ny,180); save(); }
  if (event.type === 'blaster-reload') toast('Bloom reload · magazine refilled');
  if (event.type === 'wall') membraneHit(event.id, -event.nx, -event.ny, event.speed);
  if(event.type==='objective') {toast(`Bonus complete · +${event.points} ${event.points===1?'Point':'Points'} when this shot settles.`);save();}
  if (event.type === 'note') {
    noteCount++; membraneGet(game.bodies[event.id]).glow = 1;
    const previous = game.chain.length > 1 ? game.bodies[game.chain.at(-2)] : game.bodies[0];
    connections.push({ from: previous.id, to: event.id, life: 2.4, color: COLORS[event.tone] });
    rings.push({ x: event.x, y: event.y, radius: game.bodies[event.id].radius, life: 1, color: COLORS[event.tone], bloom: false, touched: new Set([event.id]) });
    particleBurst(event.x, event.y, COLORS[event.tone], 16);
    if (event.chain === 3) toast('The pool is listening.');
    announce(`${event.chain} contacts, ${game.score} score.`); save();
  }
  if (event.type === 'lightning') {
    bolts.push({ ...event, life: .32 });
    membraneHit(event.id, -event.nx, -event.ny, 850);
    membraneGet(game.bodies[event.id]).glow = .8;
    particleBurst(event.x, event.y, POWERS.lightning.color, 12); save();
  }
  if (event.type === 'echo-jump') { trails = trails.filter(point => point.id !== -3); membranes.delete(-3); }
  if (event.type === 'wrap') {
    trails = trails.filter(point => point.id !== event.id); membranes.delete(event.id);
    for (const point of [{ x: event.fromX, y: event.fromY }, event]) particleBurst(point.x, point.y, POWERS.wrap.color, 10);
    save();
  }
  if (event.type === 'portal') {
    trails = []; membranes.delete(0);
    for (const point of [{ x: event.fromX, y: event.fromY }, event]) particleBurst(point.x, point.y, POWERS.portal.color, 18);
    toast('Through the portal · momentum intact.'); save();
  }
  if (event.type === 'slingshot') { particleBurst(event.x, event.y, POWERS.slingshot.color, 18); toast(event.target ? 'Slingshot · heading for an unhit bubble.' : 'Slingshot · away you go.'); save(); }
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
    if (event.successful) toast(`${event.capacity} powers next shot · bloom streak${event.capacity === 3 ? ' at maximum' : ' growing'}.`);
    else if (event.previousCapacity > 1) toast('Streak reset · one power next shot.');
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
  if (event.type === 'bloom') { toast(`Bloom! +500 · ${Math.min(3, game.power.capacity + 1)} powers next shot.`); rings.push({ x: event.x, y: event.y, radius: 20, life: 2.5, color: '#c1b4ff', bloom: true }); particleBurst(event.x, event.y, '#ddcbff', 80); save(); }
  if (['rest', 'over', 'win'].includes(event.type)) { freePlayRefresh(); save(); if (event.type !== 'rest') announce(`${game.mode==='score-attack'?'Score Attack complete.':gameWon(game) ? 'You won! Three blooms.' : 'Out of shots. Try again.'} ${game.score} score.`); }
  uiRender();
}
function particleBurst(x, y, color, count) {
  if (isGentle) return;
  for (let index = 0; index < count; index++) { const angle = Math.random() * Math.PI * 2, speed = 15 + Math.random() * 125; particles.push({ x, y, vx: Math.cos(angle) * speed, vy: Math.sin(angle) * speed, life: .5 + Math.random() * 1.3, color, radius: 1 + Math.random() * 2.5 }); }
  if (particles.length > 350) particles.splice(0, particles.length - 350);
}
// Transient score feedback uses the exact event award, including bank bonuses.
function scorePopupRender(dt, view, ratio) {
  scorePopups = scorePopups.filter(popup => { popup.age += dt; return popup.age < 1.8; });
  const occupied = [];
  context.save(); context.setTransform(ratio,0,0,ratio,0,0);context.textAlign = 'center'; context.textBaseline = 'middle'; context.lineJoin = 'round';
  for (const popup of scorePopups) {
    const size = popup.isBloom ? 24 : 18, text = `+${popup.points.toLocaleString('en-US')}`;
    context.font = `700 ${size}px system-ui, sans-serif`;
    const halfWidth = context.measureText(text).width / 2 + 6;
    const point=view.screen(popup.x,popup.y);
    const x = Math.max(halfWidth+4, Math.min(view.rect.width-halfWidth-4,point.x));
    const rise = (isGentle ? 10 : 46) * (1 - Math.pow(1 - popup.age / 1.8, 2));
    let y = Math.max(size, Math.min(view.rect.height-size,point.y-12-rise));
    // Separate simultaneous hit and bloom awards, including dense Split/Echo hits.
    for (const other of occupied) if (Math.abs(x - other.x) < halfWidth + other.halfWidth && Math.abs(y - other.y) < size * 1.25) y = other.y + size * 1.3;
    if (y > view.rect.height-size) y = Math.max(size,point.y-rise-size*2);
    occupied.push({ x, y, halfWidth });
    context.globalAlpha = Math.pow(Math.max(0, 1 - popup.age / 1.8), 1.2);
    context.lineWidth = 4; context.strokeStyle = '#0b1325'; context.strokeText(text, x, y);
    context.fillStyle = popup.color; context.fillText(text, x, y);
  }
  context.restore();
  canvas.dataset.scorePopups = scorePopups.map(popup => `+${popup.points}`).join(',');
  canvas.dataset.scorePopupOpacity = scorePopups.map(popup => Math.pow(Math.max(0, 1 - popup.age / 1.8), 1.2).toFixed(3)).join(',');
}
// Browser chrome and HUD height can change the canvas shape without rotating the phone.
// Keep drawing, aiming and stereo mapped to the viewport orientation instead.
function geometry() { const rect=canvas.getBoundingClientRect(); return {rect,...poolView(rect.width,rect.height,RULE.width,RULE.height,matchMedia('(orientation: portrait)').matches)}; }
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
  const membrane = membraneGet(body), isSeed = body.id <= 0, isBubble = body.id === 0 && !!effectGet(game, 'bubble'), hue = isSeed ? body.id === -3 ? POWERS.echo.color : body.id < 0 ? POWERS.split.color : isBubble ? POWERS.bubble.color : progression?.skin||'#f1f9d7' : COLORS[body.tone], radius = body.radius;
  const isPermeable = !isSeed && frozenHit(game, body.id);
  membrane.glow = Math.max(0, membrane.glow - dt * 1.4);
  const playback = audio.playbackLights.get(body.id);
  const replayGlow = playback ? Math.max(0, (playback.until - audio.context.currentTime) / .7) * (isGentle ? .18 : .7) : 0;
  const light = Math.max(membrane.glow, replayGlow);
  bubbleStep(membrane, body, dt, isGentle, isGentle ? undefined : bubbleFlow(body, game.bodies), !isSeed && (!!effectGet(game, 'stasis')?.targets.includes(body.id)||regionFrozen(game,body.id)));
  const points = bubbleOutline(membrane, body).map(point => ({ x: Math.max(RULE.inset, Math.min(RULE.width - RULE.inset, point.x)), y: Math.max(RULE.inset, Math.min(RULE.height - RULE.inset, point.y)) }));
  const glow = context.createRadialGradient(body.x, body.y, radius * .3, body.x, body.y, radius * 2.8);
  glow.addColorStop(0, hue + (isPermeable ? '0c' : light > .2 ? '70' : isSeed ? '40' : '33')); glow.addColorStop(1, hue + '00');
  context.fillStyle = glow; context.beginPath(); context.arc(body.x, body.y, radius * 2.8, 0, Math.PI * 2); context.fill();
  const skin = new Path2D();
  const first = points[0], last = points.at(-1); skin.moveTo((first.x + last.x) / 2, (first.y + last.y) / 2);
  for (let index = 0; index < points.length; index++) { const a = points[index], b = points[(index + 1) % points.length]; skin.quadraticCurveTo(a.x, a.y, (a.x + b.x) / 2, (a.y + b.y) / 2); }
  skin.closePath();
  const fill = context.createRadialGradient(body.x - radius * .35, body.y - radius * .4, 0, body.x, body.y, radius * 1.1);
  fill.addColorStop(0, isPermeable ? hue + '18' : isBubble ? hue + '60' : isSeed ? '#ffffed' : hue + 'bb'); fill.addColorStop(.45, hue + (isPermeable ? '0a' : isBubble ? '28' : isSeed ? 'ee' : '6c')); fill.addColorStop(1, hue + (isPermeable ? '02' : isBubble ? '08' : '20'));
  context.fillStyle = fill; context.strokeStyle = hue + (isPermeable ? '48' : 'c0'); context.lineWidth = isSeed ? 1.6 : 1.1; context.shadowColor = hue; context.shadowBlur = isPermeable ? 2 : (isSeed ? 15 : 7) + light * 20; context.fill(skin); context.stroke(skin); context.shadowBlur = 0;
  context.save(); context.clip(skin);
  // Skin highlight follows the deformed upper-left rim instead of floating on a circle.
  context.beginPath();
  for (let index = 14; index <= 20; index++) { const point = points[index], x = body.x + (point.x - body.x) * .79, y = body.y + (point.y - body.y) * .79; if (index === 14) context.moveTo(x, y); else context.lineTo(x, y); }
  context.strokeStyle = isPermeable ? '#ffffff25' : '#ffffff70'; context.lineWidth = radius * .08; context.lineCap = 'round'; context.lineJoin = 'round'; context.stroke();
  if (!isSeed) {
    // A pearly nucleus and drifting flecks make each bubble feel inhabited.
    const x = body.x + membrane.core[0], y = body.y + radius * .1 + membrane.core[1];
    const nucleus = context.createRadialGradient(x, y, 0, x, y, radius * .34); nucleus.addColorStop(0, hue + (isPermeable ? '20' : 'd0')); nucleus.addColorStop(1, hue + '00'); context.fillStyle = nucleus; context.beginPath(); context.arc(x, y, radius * .34, 0, Math.PI * 2); context.fill();
    for (let index = 0; index < 5; index++) { const point = points[(index * 5 + body.id) % points.length]; context.beginPath(); context.arc(x + (point.x - body.x) * .45, y + (point.y - body.y) * .4, 1.4, 0, Math.PI * 2); context.fillStyle = hue + (isPermeable ? '25' : 'a0'); context.fill(); }
  }
  if (!isSeed && membrane.frost > .01) frostRender(body, points, skin, membrane.frost);
  if (isBubble) {
    // Keep overlapping bubbles visible through the pressure shell and its small core.
    const coreRadius = effectGet(game, 'split') ? 10 : RULE.seedRadius;
    const core = context.createRadialGradient(body.x, body.y, 0, body.x, body.y, coreRadius * 1.5);
    core.addColorStop(0, '#ffffede0'); core.addColorStop(.5, '#ddfff4a0'); core.addColorStop(1, '#aaeaff00');
    context.fillStyle = core; context.beginPath(); context.arc(body.x, body.y, coreRadius * 1.5, 0, Math.PI * 2); context.fill();
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
  if(!isSeed) {
    const role=bubbleRole(body.id),icon=roleIcons[role],size=marker?18:Math.min(32,body.radius*1.25),y=marker?Math.min(body.radius*.68,body.radius-size*.5):0;
    context.save();if(isPermeable)context.globalAlpha=.35;context.translate(body.x,body.y);if(portraitView)context.rotate(-Math.PI/2);
    if(icon.complete&&icon.naturalWidth)context.drawImage(icon,-size/2,y-size/2,size,size);
    else {context.fillStyle='#e9ffed';context.font=`${size*.7}px Fredoka,sans-serif`;context.textAlign='center';context.textBaseline='middle';context.fillText(BUBBLE_ROLES[role].name[0],0,y);}
    context.restore();
  }
  if (marker) {
    const p = POWERS[marker.kind], icon = powerIcons[marker.kind], size = Math.min(52, body.radius * 1.25);
    context.save(); context.translate(body.x,body.y);if(portraitView)context.rotate(-Math.PI/2);context.shadowColor = p.color; context.shadowBlur = isGentle ? 0 : 12;
    if (icon.complete && icon.naturalWidth) context.drawImage(icon, -size / 2, -size / 2, size, size);
    else { context.fillStyle = '#f3fff5'; context.font = '32px Arial'; context.textAlign = 'center'; context.textBaseline = 'middle'; context.fillText(p.symbol, 0, 0); }
    context.restore();
  }
  if (!isSeed && game.chain.includes(body.id)) { context.strokeStyle = hue + (isPermeable ? '28' : '88'); context.lineWidth = 1; context.beginPath(); for (const [index, point] of points.entries()) { const x = body.x + (point.x - body.x) * 1.1, y = body.y + (point.y - body.y) * 1.1; if (!index) context.moveTo(x, y); else context.lineTo(x, y); } context.closePath(); context.stroke(); }
}
function render(now) {
  if (navigation && navigation.current !== 'play') { previousTime=now;accumulator=0;requestAnimationFrame(render);return; }
  const view=geometry(), {rect,scale}=view, ratio=canvas.width/rect.width; portraitView=view.portrait; audio.portrait=portraitView;
  audio.musicUpdate(game.bodies.reduce((sum, body) => sum + Math.hypot(body.vx, body.vy), 0) / (game.bodies.length * 100));
  const elapsed = Math.min(.06, (now - previousTime) / 1000); previousTime = now;
  const isActive = isStarted && !isPaused && !game.isOver && !document.querySelector('dialog[open]') && !document.hidden;
  if (isActive && !progression?.blocked) { accumulator += elapsed; while (accumulator >= RULE.step&&!progression?.blocked) { const events = physicsStep(game); physicsBatch=true;events.forEach(eventHandle);physicsBatch=false;if(events.some(e=>['note','power','bloom','rest','over','win','objective','wave'].includes(e.type)))progression?.observe(game,events,audio.musicSave()); accumulator -= RULE.step; } if (game.tick - lastSaveTick >= 60) save(); }
  else accumulator = 0;
  const visualDelta = isPaused || document.hidden || document.querySelector('dialog[open]') ? 0 : elapsed;
  const time = isStarted ? game.tick * RULE.step : now / 1000;
  context.setTransform(1, 0, 0, 1, 0, 0); context.clearRect(0, 0, canvas.width, canvas.height); context.setTransform(...view.matrix.map(value=>value*ratio));
  environmentRender(context,game,isGentle);
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
  const blaster=effectGet(game,'blaster');
  if(blaster) {
    context.save();context.fillStyle=POWERS.blaster.color;context.strokeStyle=POWERS.blaster.color;context.lineCap='round';context.lineWidth=3;
    context.shadowColor=POWERS.blaster.color;context.shadowBlur=isGentle?0:10;
    const target=blaster.ammo?blasterTarget(game):null;if(target){context.globalAlpha=.45;context.beginPath();context.arc(game.bodies[target.id].x,game.bodies[target.id].y,game.bodies[target.id].radius+9,0,Math.PI*2);context.stroke();context.globalAlpha=1;}
    for(const shot of blaster.shots) {context.beginPath();context.moveTo(shot.x-shot.vx*.014,shot.y-shot.vy*.014);context.lineTo(shot.x,shot.y);context.stroke();context.beginPath();context.arc(shot.x,shot.y,4,0,Math.PI*2);context.fill();}
    for(let i=0;i<blaster.ammo;i++) {const a=-Math.PI/2+(i-(blaster.ammo-1)/2)*.38;context.beginPath();context.arc(seed.x+Math.cos(a)*(seed.radius+13),seed.y+Math.sin(a)*(seed.radius+13),3,0,Math.PI*2);context.fill();}
    context.restore();
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
  for (const body of liveBubbles(game)) blobRender(body, visualDelta, time);
  for (const body of seeds) { context.save(); if (body.id === -3) context.globalAlpha = .42; blobRender(body, visualDelta, time); context.restore(); }
  if (!game.isFlying && isStarted && !isPaused && !game.isOver) {
    const path=aimPreview(game,angle,power);
    context.save();context.strokeStyle='#e4ffcb88';context.lineWidth=1.5;context.setLineDash([3,8]);context.beginPath();path.forEach((p,i)=>i?context.lineTo(p.x,p.y):context.moveTo(p.x,p.y));context.stroke();context.setLineDash([]);
    if(path.length===3){context.beginPath();context.arc(path[1].x,path[1].y,5,0,Math.PI*2);context.stroke();}context.restore();
    context.strokeStyle = '#dbf8c833'; context.lineWidth = 1; context.beginPath(); context.arc(seed.x, seed.y, 26 + (isGentle ? 0 : Math.sin(time * 2) * 2), 0, Math.PI * 2); context.stroke();
    if (drag) { context.beginPath(); context.moveTo(seed.x, seed.y); context.lineTo(seed.x - Math.cos(angle) * power * 100, seed.y - Math.sin(angle) * power * 100); context.strokeStyle = '#d8f5caaa'; context.lineWidth = 2; context.stroke(); }
  }
  rings = rings.filter(ring => {
    ring.previousRadius = ring.radius; ring.life -= visualDelta; ring.radius = Math.max(8, ring.radius + visualDelta * (ring.kind ? (ring.kind === 'stasis' ? 0 : ring.kind === 'attract' ? -1 : 1) * ((['swap', 'comet', 'magnet', 'lightning', 'impact', 'tether', 'split', 'bubble', 'portal', 'echo', 'slingshot', 'drunk', 'wrap', 'homing'].includes(ring.kind) ? 150 : RULE.powerRadius) - 8) / 1.6 : ring.bloom ? 220 : 75));
    if (!isGentle && visualDelta > 0 && !['attract', 'stasis', 'swap', 'comet', 'magnet', 'lightning', 'impact', 'tether', 'split', 'bubble', 'portal', 'echo', 'slingshot', 'drunk', 'wrap', 'homing'].includes(ring.kind)) for (const body of game.bodies) {
      const pulse = bubbleRipple(ring, body);
      if (pulse) membraneHit(body.id, pulse.nx, pulse.ny, pulse.strength);
    }
    return ring.life > 0;
  });
  if (!isGentle) for (const ring of rings.filter(ring => !ring.kind)) { context.globalAlpha = Math.min(.5, ring.life * .5); context.strokeStyle = ring.color; context.lineWidth = ring.bloom ? 2 : 1; context.beginPath(); context.arc(ring.x, ring.y, ring.radius, 0, Math.PI * 2); context.stroke(); context.globalAlpha = 1; }
  particles = particles.filter(particle => particle.life > 0);
  for (const particle of particles) { particle.life -= visualDelta; particle.x += particle.vx * visualDelta; particle.y += particle.vy * visualDelta; context.globalAlpha = Math.min(.8, Math.max(0, particle.life)); context.fillStyle = particle.color; context.beginPath(); context.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2); context.fill(); } context.globalAlpha = 1;
  scorePopupRender(visualDelta, view, ratio);
  if (game.tick - lastUITick >= 12 || frameCount++ % 20 === 0) { uiRender(); lastUITick = game.tick; }
  requestAnimationFrame(render);
}
function bonusRender() {
  const bonus=objectiveProgress(game);
  const progress=bonus.steps.map(step=>`${step.value}/${step.target} ${step.label}`).join(' · ');
  const status=bonus.complete?'Complete! Next target after this shot.':progress;
  $('bonus-title').textContent=bonus.title;
  $('bonus-status').textContent=status;
  const legacy=bonus.complete&&game.objective.rewardPoints===undefined;
  const reward=legacy?'Completed':`+${bonus.reward} ${bonus.reward===1?'Point':'Points'}`;
  $('bonus-reward').replaceChildren(...(bonus.complete?[iconNode('check')]:[]),document.createTextNode(reward));
  $('bonus-open').classList.toggle('is-complete',bonus.complete);
  $('bonus-open').setAttribute('aria-label',`Bonus objective: ${bonus.title}. Difficulty ${bonus.difficulty}. ${status} ${legacy?'Completed under previous reward rules.':`${bonus.complete?'Earned':'Reward'} ${reward}.`} View details.`);
  $('bonus-fill').style.width=`${bonus.progress*100}%`;
  $('bonus-dialog-title').textContent=bonus.title;
  $('bonus-description').textContent=bonus.description;
  $('bonus-tip').textContent=bonus.tip;
  $('bonus-count').textContent=`${game.objective.completed} completed`;
  $('bonus-prize').replaceChildren(...(bonus.complete?[iconNode('check')]:[]),document.createTextNode(legacy?'Completed under previous reward rules':`Difficulty ${bonus.difficulty} · ${reward}${bonus.complete?' earned':''}`));
  $('bonus-next').textContent=game.mode==='song-run'?'New bonus in the next pool':OBJECTIVES[(bonus.index+1)%OBJECTIVES.length].title;
  document.querySelector('.bonus-rules').textContent=`Earn 1 Point per difficulty level, banked when the shot settles. Spend Points in the Skill Tree. ${game.mode==='song-run'?'One bonus per pool; no extra bonus payout at pool clear.':'The next objective begins after success.'}`;
  $('bonus-steps').replaceChildren(...bonus.steps.map(step=>{
    const row=document.createElement('div'),label=document.createElement('span'),meter=document.createElement('progress');
    label.append(...(step.value===step.target?[iconNode('check')]:[]),document.createTextNode(`${step.value} / ${step.target} ${step.label}`));
    meter.max=step.target;meter.value=step.value;meter.setAttribute('aria-label',step.label);
    row.append(label,meter);return row;
  }));
}
function uiRender() {
  $('points').textContent=(progression?.points??0).toLocaleString('en-US');
  if (game.mode === 'challenge') best = Math.max(best, game.score);
  $('score').textContent = game.score.toLocaleString('en-US');
  $('plucks').textContent = game.mode === 'free' ? '∞' : game.plucks; $('pluck-label').textContent = game.mode === 'free' ? 'FREE PLAY' : 'SHOTS LEFT';
  $('pool-seed').textContent = `POOL / ${game.seed}`;
  progression?.profileIndicator();
  const medal=game.mode==='score-attack'?{targets:scoreTargets(game.attack.budget),best:scoreRead(localStorage,game.attack.kind,game.attack.budget).best}:progression?.medalHud();$('pool-medals').hidden=!medal;
  if(medal){for(const el of $('pool-medals').querySelectorAll('[data-medal]')){const name=el.dataset.medal,target=medal.targets[name];el.innerHTML=medalIcon(name)+`<span>${game.score>=target?'✓ ':''}${name} ${target.toLocaleString('en-US')}</span>`;el.classList.toggle('is-reached',game.score>=target);} $('pool-best-score').textContent=medal.best===null?'Clear the goal to earn a medal':`Best ${medal.best.toLocaleString('en-US')} · clear the goal to earn a medal`;}
  if(game.mode==='score-attack')$('pool-best-score').textContent=medal.best===null?'Finish every shot to record your score':`Best ${medal.best.toLocaleString('en-US')} · ${game.attack.budget}-shot runs`;
  if(!medal&&poolConditions(game.mode)){
    $('pool-medals').hidden=false;const conditions=poolConditions(game.mode),earned=store.medals?.[poolMedalKey(game,game.earning?.kind??progression?.trialKind??'normal')];
    for(const el of $('pool-medals').querySelectorAll('[data-medal]')){const c=conditions.find(c=>c.name===el.dataset.medal);el.innerHTML=medalIcon(c.name)+`<span>${c.name} · ${c.metric==='score'?c.target.toLocaleString('en-US'):c.metric==='complete'?'Clear':c.target+' shots'}</span>`;el.title=c.text;el.classList.toggle('is-reached',!!earned&&['Bronze','Silver','Gold'].indexOf(earned)>=['Bronze','Silver','Gold'].indexOf(c.name));}
    $('pool-best-score').textContent=(earned?'Best: '+earned+' · ':'')+(game.mode==='waves'?`Wave ${game.wave.number}: clear every bubble` : game.mode==='free'?'Score milestones · awarded after a shot settles':'Make 3 blooms · the full final shot counts');
  }
  $('end-medal').innerHTML=game.isOver?medalBadge(game.mode==='score-attack'?scoreMedal(game.score,game.attack.budget):game.mode==='challenge'&&gameWon(game)?medalEvaluate(poolConditions('challenge'),{complete:1,shots:game.launches}):null):'';
  $('chain-label').textContent = game.chain.length ? `${game.chain.length} CONTACTS ${game.chain.length >= 5 ? '· BEAUTIFUL.' : '· KEEP THE CHAIN GOING.'}` : 'FIVE DIFFERENT BUBBLES. ONE BLOOM.';
  $('note-meter').replaceChildren(...Array.from({ length: 5 }, (_, index) => { const item = document.createElement('i'); if (game.chain[index]) { item.className = 'active'; item.style.setProperty('--note', COLORS[game.bodies[game.chain[index]].tone]); } return item; }));
  $('note-meter').setAttribute('aria-label', `${game.chain.length} unique contacts this shot`);
  $('state-label').textContent = isPaused ? 'A QUIET MOMENT.' : game.isOver ? 'RUN COMPLETE.' : !isStarted ? 'YOUR NEXT LITTLE OBSESSION.' : game.isFlying ? game.flightAge >= RULE.flightSeconds ? 'SETTLING INTO THE POOL' : `FOLLOW THE LIGHT · ${Math.max(0, Math.ceil(RULE.flightSeconds - game.flightAge))}s` : 'AIM. RELEASE. BLOOM.';
  $('goal-label').textContent = game.mode==='score-attack'?'Score Attack':game.mode==='waves'?'Endless Waves':game.mode === 'free' ? 'Free play' : gameWon(game) ? 'Three blooms complete' : `Blooms ${Math.min(game.blooms, RULE.goalBlooms)} / ${RULE.goalBlooms}`;
  $('goal-progress').setAttribute('aria-label','Blooms toward victory');$('goal-progress').hidden = game.mode === 'free'; $('goal-progress').max = RULE.goalBlooms; $('goal-progress').value = Math.min(game.blooms, RULE.goalBlooms);
  if(progression?.hud()) {$('goal-label').textContent=progression.hud();$('goal-progress').hidden=true;}
  if(game.mode==='waves'){const left=liveBubbles(game).length,total=game.bodies.length-1;$('goal-label').textContent=`Wave ${game.wave.number} · ${left} / ${total} bubbles left`;$('goal-progress').hidden=false;$('goal-progress').setAttribute('aria-label','Bubbles popped this wave');$('goal-progress').max=total;$('goal-progress').value=total-left;$('state-label').textContent=game.wave.entry<WAVE_ENTRY?'BUBBLES INCOMING':left===0?'WAVE CLEARED · COASTING':game.isFlying?'POP EVERY BUBBLE':`${game.plucks} SHOTS TO CLEAR THE BOARD`;Object.assign(canvas.dataset,{wave:String(game.wave.number),bubblesLeft:String(left),waveEntering:String(game.wave.entry<WAVE_ENTRY)});}
  if(game.mode==='score-attack'){$('goal-label').textContent=`Score Attack · ${game.attack.budget} Shots`;$('goal-progress').hidden=false;$('goal-progress').max=game.attack.budget;$('goal-progress').value=game.launches-(game.isFlying?1:0);$('goal-progress').setAttribute('aria-label','Shots completed');$('state-label').textContent=isPaused?'PAUSED':game.isOver?'RUN COMPLETE':game.isFlying?'SHOT IN MOTION':'BUILD CHAINS. BANK. BLOOM.';$('chain-label').textContent=game.chain.length?`${game.chain.length} UNIQUE CONTACTS`:'FIVE DIFFERENT BUBBLES. ONE BLOOM.';}
  bonusRender();
  $('palette').value=audio.music.palette;
  const shot=game.lastShot;
  $('shot-result').textContent=game.isFlying?`${game.chain.length} unique contacts · ${game.banks} banks · ${game.power.used} powers`:shot?`${shot.bloom?'Bloom!':shot.notes===4?'One bubble short of a bloom.':`${shot.notes} of 5 contacts toward a bloom.`}${shot.points===null?' · Resumed shot':` +${shot.points}`} · ${shot.banks} banks · ${shot.powers} powers${shot.objective?' · Objective complete':''}`:'Aim for a wall bank. The dotted guide shows your first rebound; drifting bubbles can change the path.';
  $('edge-idle').textContent=game.isFlying?'':game.mode==='score-attack'?'Drag back and release to launch':game.launches?'Drag back for another shot':'Drag back anywhere to launch';
  if(game.mode==='score-attack'){$('shot-result').textContent=game.isFlying?`${game.chain.length} unique contacts · ${game.banks} banks · ${game.power.used} powers`:shot?`${shot.notes} contacts${shot.bloom?' · Bloom!':''} · +${shot.points??0} score · ${shot.banks} banks${shot.objective?' · Bonus complete':''}`:'Bank off walls and chain different bubbles to build your score.';$('note-meter').setAttribute('aria-label',`${game.chain.length} unique contacts this shot`);}
  const song = musicProgress(audio.music);
  $('song-stage').textContent = `${song.name}${audio.isMusicPlaying && !audio.isMuted && !audio.isPaused && audio.ambience ? audio.stage < song.stage ? ' · joining on the next bar' : audio.section !== song.name ? ` · ${audio.section}` : '' : ''}`;
  $('song-next').textContent = song.next;
  $('song-growth').value = song.stage;
  phraseRender();
  $('power-active').hidden = game.effects.length === 0;
  $('power-active').textContent = game.effects.map(effect => `${POWERS[effect.kind].name}${effect.kind === 'echo' && !effect.isReady ? ' forming' : effect.kind === 'slingshot' ? ' winding up' : ' active'} · ${effect.seconds.toFixed(1)}s`).join('  /  ');
  canvas.dataset.powerEffect = game.effects.map(effect => effect.kind).join(',') || 'none';
  const allowance = powerAllowance(game), used = game.isFlying ? game.power.used : 0, markers = powerMarkers(game);
  const slots=powerSlots(game);
  for (const [index, slot] of Array.from($('power-slots').children).entries()) {
    const view=slots[index];
    slot.dataset.state=view.status;slot.title=view.title;slot.setAttribute('aria-label',view.label);
    if(slot.innerHTML!==view.html)slot.innerHTML=view.html;
  }
  $('power-progress').textContent = game.isFlying ? `${used} / ${allowance} powers used · bloom to ${allowance === 3 ? 'keep all three' : `earn ${allowance + 1} next shot`}` : `${allowance} ${allowance === 1 ? 'power' : 'powers'} this shot · ${allowance === 3 ? 'bloom to keep all three' : `bloom to earn ${allowance + 1} next shot`}. No bloom resets to 1.`;
  canvas.dataset.frozenHit = game.chain.filter(id => frozenHit(game, id)).join(',');
  canvas.dataset.stasisTargets = (effectGet(game, 'stasis')?.targets || []).join(','); canvas.dataset.stasisSpeed = String(Math.max(0, ...(effectGet(game, 'stasis')?.targets || []).map(id => Math.hypot(game.bodies[id].vx, game.bodies[id].vy))));
  canvas.dataset.seedCount = String(seedBodies(game).length); canvas.dataset.seedRadius = game.bodies[0].radius.toFixed(1);
  const power = game.power, first = markers[0], kind = first?.kind || power.offer, p = POWERS[kind], available = powerAvailable(game);
  if ($('power-icon').dataset.kind !== kind) { $('power-icon').src = powerIcons[kind].src; $('power-icon').dataset.kind = kind; $('power-icon').style.setProperty('--power-color', p.color); }
  $('power-title').textContent = markers.length > 1 ? `${markers.length} powers · all in the pool` : available ? `${p.name} · activates on contact` : 'All powers collected';
  const choice=game.build?.find(x=>x.power===kind), description=choice?POWER_TREES[kind].nodes.filter((n,i)=>i===0||i===1&&choice.foundation||i===2&&choice.variants.includes('a')||i===3&&choice.variants.includes('b')||i===4&&choice.capstone).map(n=>n.description).join(' '):p.description;
  $('power-status').textContent = markers.length > 1 ? `${markers.map(marker => POWERS[marker.kind].name).join(' + ')}. All marked bubbles are ready now. Hit them in any order to activate.` : available ? `Hit the marked ${p.name} bubble with your seed. ${description}` : `All ${allowance} ${allowance === 1 ? 'power used' : 'powers used'} this shot. The next set appears when this shot ends.`;
  Object.assign(canvas.dataset, { power: available ? 'ready' : 'used', powerKind: kind, powerTarget: String(first?.target || 0), powerMarkers: markers.map(marker => `${marker.kind}:${marker.target}`).join(','), powerOffer: power.offer, powerClaims: String(power.claims), powerUsed: String(used), powerAllowance: String(allowance) });
  const ammo=effectGet(game,'blaster')?.ammo||0;
  $('shoot').disabled = !isStarted || isPaused || game.isOver || game.isFlying || game.wave?.entry<WAVE_ENTRY;
  buttonLabel($('shoot'),'Launch','play');
  if(ammo) $('shot-result').textContent=`Blaster · automatic · ${ammo} shots remaining`;
  canvas.dataset.ammo=String(ammo);canvas.setAttribute('aria-label',ammo?'Blaster automatically aims and fires at unhit bubbles. No input needed.':'Living pool. Drag to launch. Arrow keys aim, up and down change power, Space launches.');
  if(game.mode==='score-attack')canvas.setAttribute('aria-label','Score Attack pool. Drag back and release to launch. Arrow keys aim, up and down change power, Space launches.');
  $('pause').disabled = !isStarted || game.isOver; buttonLabel($('pause'),'',isPaused?'play':'pause'); $('pause').setAttribute('aria-label', isPaused ? 'Resume game' : 'Pause game');
  $('over-overlay').hidden = !isStarted || !game.isOver || progression?.context==='run';
  if (game.isOver) { $('end-title').textContent = gameWon(game) ? 'You Made It Bloom.' : 'One More Ripple?'; $('end-label').textContent = gameWon(game) ? 'YOU WON · THREE BLOOMS' : 'OUT OF SHOTS'; $('end-score').textContent = game.score.toLocaleString('en-US'); $('end-detail').textContent = `${game.blooms} / ${RULE.goalBlooms} blooms · ${game.launches} shots used${gameWon(game) ? ' · Keep playing in Free Play below.' : ' · Reach three blooms to win.'}`; }
  $('continue-free').hidden=['waves','score-attack'].includes(game.mode);
  if(game.mode==='score-attack'&&game.isOver){const medal=scoreMedal(game.score,game.attack.budget);$('end-title').textContent=medal?`${titleCase(medal)} Medal`:'Run Complete';$('end-label').textContent=`SCORE ATTACK · ${game.attack.budget} SHOTS`;$('end-detail').textContent=`${game.blooms} blooms · ${game.earning?earningAmount(game.earning):0} Points earned · Best ${Math.max(scoreRead(localStorage,game.attack.kind,game.attack.budget).best??0,game.score).toLocaleString('en-US')}`;}
  $('wave-medal-results').hidden=game.mode!=='waves'||!game.isOver;
  if(game.mode==='waves'&&game.isOver){$('wave-medal-results').innerHTML=game.wave.number>1?`<p>Best medals for cleared waves</p><div class="wave-medal-summary">${poolMedalRecords(store,{kind:game.earning?.kind??progression?.trialKind??'normal',mode:'waves',seed:game.seed}).filter(r=>r.wave<game.wave.number).sort((a,b)=>a.wave-b.wave).map(r=>`<span>Wave ${r.wave} ${medalBadge(r.medal)}</span>`).join('')}</div>`:'';$('end-title').textContent='Endless Waves';$('end-label').textContent=`WAVE ${game.wave.number} · OUT OF SHOTS`;$('end-detail').textContent=`${game.wave.number-1} waves cleared · ${game.earning?earningAmount(game.earning):0} Points earned · Best wave ${Math.max(store.waveBest?.wave||1,game.wave.number)} · Best score ${Math.max(store.waveBest?.score||0,game.score).toLocaleString('en-US')}`;}
  // Read-only observability for live-browser QA. Never drives gameplay.
  canvas.dataset.gentle = String(isGentle);
  canvas.dataset.bubbleDeformation = Math.max(0, ...Array.from(membranes.values(), skin => Math.hypot(...skin.strain))).toFixed(3);
  Object.assign(canvas.dataset, { physicsTick: String(game.tick), flying: String(game.isFlying), score: String(game.score), seedX: game.bodies[0].x.toFixed(2), seedY: game.bodies[0].y.toFixed(2), chain: String(game.chain.length), audioState: audio.context?.state || 'locked', soundEvents: String(audio.eventCount), notes: String(noteCount), mode: game.mode, harmony: audio.harmony?.name || 'none', songChords: String(audio.music.history.length), songTheme: audio.music.theme.join(','), musicPending: String(audio.musicQueue.length), musicVoices: String(audio.phraseVoices.size), audioVoices: String(audio.voiceCount), harmonyPaused: String(audio.isPaused), musicPassage: String(audio.passage), musicSection: audio.section, musicStage: String(audio.stage), songStage: String(song.stage), songPlucks: String(audio.music.plucks), songBar: String(audio.music.bar), mediaState: audio.media.state, mediaReady: String(audio.media.ready), mediaArtwork: audio.media.artwork?.[0]?.src || '', hookNextBar: String(audio.music.evolution.nextBar), hookPending: String(!!audio.music.evolution.pending), phraseSteps: (audio.music.motifs.at(-1)?.steps || []).join(','), hookSteps: (audio.music.hook?.steps || []).join(','), phraseReplayCount: String(audio.playbackCount), phraseReplayIds: [...audio.playbackLights.keys()].join(','), ambience: String(audio.ambience) });
}
function phraseRender() {
  if($('game-music-bar').hidden)return;
  const isLive = game.isFlying, phrase = isLive ? musicPhrasePreview(audio.music) : audio.playbackPhrase || audio.music.motifs.at(-1), now = audio.context?.currentTime ?? 0;
  const isAudible = audio.isMusicPlaying && audio.context?.state === 'running' && !audio.isMuted && !audio.isPaused && audio.volume > 0 && audio.ambience > 0;
  const count = phrase?.tones.length || 0;
  $('phrase-title').textContent = isLive ? `Your Phrase · Live · ${count} ${count === 1 ? 'Note' : 'Notes'}` : phrase ? `${audio.playbackPhrase ? audio.lastPlayback?.reply ? 'Your Phrase · Reply' : 'Your Melody' : 'Your Latest Phrase'} · ${count} ${count === 1 ? 'Note' : 'Notes'}` : 'Your Phrase';
  $('phrase-status').textContent = isLive ? !isStarted ? 'Your unfinished phrase is saved. Return to keep playing.' : audio.isPaused ? 'Paused · your growing phrase is saved.' : phrase ? 'Each bubble adds a note. Your phrase is taking shape.' : 'Your new phrase starts with the first bubble.' : !phrase ? 'Pluck through the bubbles. Listen for their reply.' : !isStarted ? 'Your phrase is saved. Return to hear it.' : audio.isPaused ? 'Paused · your phrase is saved.' : !isAudible ? 'Phrase saved · turn on sound and ambience to hear it.' : now < audio.replyUntil ? 'The pool is playing your phrase back.' : audio.music.reply ? 'Your phrase joins on the next bar.' : 'Follow the glowing bubbles as your melody returns.';
  $('phrase-choice').textContent=!audio.music.hook?'Hit three different bubbles in one pluck to establish your melody.':audio.music.evolution.pending?'Your melody repeats. New notes will join at the next section.':'Your melody repeats and gradually absorbs new ideas.';
  const pattern = $('phrase-pattern'), pans = phrase?.pans || phrase?.ids.map(id=>audio.music.pans[id]??0) || [], key = JSON.stringify([isLive, phrase || null, pans]);
  pattern.dataset.live = String(isLive); pattern.dataset.noteCount = String(count);
  if (pattern.dataset.phrase !== key) {
    pattern.dataset.phrase = key;
    pattern.replaceChildren(...Array.from({ length: 16 }, (_, step) => {
      const item = document.createElement('i'), index = phrase?.steps.indexOf(step) ?? -1;
      if (index >= 0) {
        item.style.setProperty('--note', COLORS[phrase.tones[index]]);
        item.style.setProperty('--pan', `${50 + pans[index] * 35}%`);
        item.dataset.pan = String(pans[index]); item.append(document.createElement('b'));
        item.title = `Step ${step+1} · ${Math.abs(pans[index])<.08?'Centre':pans[index]<0?'Left':'Right'}`;
      }
      return item;
    }));
    pattern.setAttribute('aria-label', phrase ? `${isLive ? 'Live two-bar phrase' : 'Two-bar phrase'}, ${phrase.tones.length} notes. Top is left audio, bottom is right. ${phrase.steps.map((step,i)=>`Step ${step+1}: ${Math.abs(pans[i])<.08?'centre':pans[i]<0?'left':'right'}`).join('; ')}` : isLive ? 'Live phrase, waiting for the first note. Top is left audio, bottom is right.' : 'No phrase recorded yet. Top is left audio, bottom is right.');
  }
  const lastStrike = audio.music.strikes.at(-1);
  const activeStep = isLive ? phrase && lastStrike && game.tick - lastStrike.tick < 42 ? phrase.steps.at(-1) : -1 : isAudible && audio.lastPlayback && now - audio.lastPlayback.at < .35 ? audio.lastPlayback.step : -1;
  for (const [step, item] of [...pattern.children].entries()) item.classList.toggle('active', step === activeStep);
}
function controlsRender() { $('button-controls').checked=assistedControls; document.querySelector('.control-strip').hidden=!assistedControls; document.body.classList.toggle('assisted-controls',assistedControls); $('sound').checked = !audio.isMuted; document.querySelector('.sound-hint').replaceChildren(iconNode('music-note'),document.createTextNode(audio.isMuted?'Sound is off. Enable Sound to listen.':'Sound on. Headphones make it lovelier.')); $('volume').value = audio.volume * 100; $('ambience').value = audio.ambience * 100; $('motion').checked = isGentle; $('stream').checked = isStream; document.body.classList.toggle('motion-reduced', isGentle); document.body.classList.toggle('stream-mode', isStream); }
function freePlayRefresh(){if(progression?.context==='legacy'){freePlaySync(game,progression.state);playerSync(game,progression.state.profile);}}
function shoot() { if(progression?.blocked)return; if(game.isFlying) return; if (!isStarted || isPaused || document.querySelector('dialog[open]')) return; freePlayRefresh(); audioUnlockAsync(); if(!progression.prepareShot(game))return; if (launch(game, angle, power)) { audio.eventPlay({ type: 'launch', x: game.bodies[0].x, y: game.bodies[0].y }); save(); uiRender(); } }
function pauseSet(value) { if (!isStarted || game.isOver) return; isPaused = value; audio.pauseSet(value); dragCancel(); $('pause-overlay').hidden = !value; save(); uiRender(); if (!value) { audioUnlockAsync(); canvas.focus({ preventScroll: true }); } }
function start() { preferences.lastPlay=game.mode;if(game.attack)preferences.scoreBudget=game.attack.budget; freePlayRefresh(); navigation?.play(); audio.media.describe(game.seed); isStarted = true; isPaused = false; $('welcome').hidden = true; $('pause-overlay').hidden = true; if (game.mode!=='song-run' && audio.bloomCount !== game.blooms) audio.harmonySet(game.blooms); audio.pauseSet(false); audio.musicStart(); audioUnlockAsync(); save(); uiRender(); canvas.focus({ preventScroll: true }); }
function loadPool(nextGame, music = null) {
  game = structuredClone(nextGame); progression?.settle(game,false); audio.musicRestore(music, music?music.blooms:game.blooms, music?music.plucks:game.launches);
  membranes.clear(); powerVisual.clear(); trails = []; particles = []; rings = []; connections = []; bolts = []; reunions = []; scorePopups = []; dragCancel(); accumulator = 0;
  angle = -Math.PI / 2; power = .7; $('power').value = 70; clearTimeout(toastTimer); $('toast').classList.remove('show'); buttonLabel($('copy-result'),'Copy this result','copy'); start();
}
function newPool(seed, mode) { if(mode==='score-attack'){scorePlay(game.attack.budget,true);return;}loadPool(gameCreate(seed, mode,mode==='waves'?{build:freePlayBuild(progression.state),randomPowers:true}:{})); }
function dialogOpen(continueSong = false) {
  if(progression?.context!=='legacy'){progression.campaign();return;}
  if(game.mode==='score-attack'){save();trials.scoreSetup();return;}
  carrySong = continueSong;
  $('seed-input').value = game.seed;
  $('new-title').textContent = titleCase(continueSong ? 'Continue this pool in Free Play?' : `New ${modeName(game.mode)} game?`);
  $('new-copy').textContent = continueSong ? 'This replaces your saved Free Play progress. Your completed Challenge stays saved.' : `This replaces only your ${modeName(game.mode)} progress. Your campaign progress and personal best stay saved.`;
  $('pool-options').hidden = continueSong;
  buttonLabel($('new-confirm'),continueSong?'Replace Free play & continue':`Start new ${modeName(game.mode)} game`,'add');
  $('new-dialog').showModal();
}
function freePlay() {
  if(progression?.context!=='legacy')progression.leave();
  save();
  if (game.mode === 'free') { start(); return; }
  const entry = store.pools.free; loadPool(entry?.game || gameCreate(game.seed, 'free'), entry?.music);
}
function wavesPlay(){
  if(progression?.context!=='legacy')progression.leave();save();
  const entry=store.pools.waves;
  if(entry&&!entry.game.isOver)loadPool(entry.game,entry.music);
  else newPool('WAVES-'+Date.now().toString(36),'waves');
}
function scorePlay(budget=SCORE_DEFAULT,fresh=false){
  if(progression?.context!=='legacy')progression.leave();if(save()===false)return;
  const kind=progression.trialKind,saved=scoreRead(localStorage,kind,budget);
  if(!fresh&&saved.ok&&saved.entry){loadPool(saved.entry.game,saved.entry.music);return;}
  const next=gameCreate(SCORE_SEED,'score-attack',{budget,kind,build:freePlayBuild(progression.state),playerBuild:playerBuild(progression.state.profile),randomPowers:true});
  if(!scoreWrite(localStorage,next,null,{replace:true})){toast('Score Attack could not be saved. Free storage and try again.');trials.scoreSetup();return;}
  loadPool(next);
}
function carryToFree() {
  save(); const next = structuredClone(game), music = audio.musicSave();
  if (continueFree(next)) loadPool(next, music);
}
function pointerWorld(event) { const view=geometry();return view.world(event.clientX-view.rect.left,event.clientY-view.rect.top); }
function shotPowerSet(next, previous = power) {
  power = Math.max(0, Math.min(1, next)); $('power').value = power * 100;
  if (isStarted && !isPaused && !game.isFlying && !game.isOver && !progression?.blocked && !document.querySelector('dialog[open]')) {
    audioUnlockAsync(); audio.strengthChange(previous, power);
  }
}
function dragUpdate(event) {
  if (!drag || drag.id !== event.pointerId) return;
  const point = pointerWorld(event), dx = drag.x - point.x, dy = drag.y - point.y, distance = Math.hypot(dx, dy);
  if (distance > 3) angle = Math.atan2(dy, dx);
  shotPowerSet(distance / 150, Math.min(1, (drag.distance || 0) / 150)); drag.distance = distance;
}
function dragCancel(event) {
  if (!drag || event?.pointerId !== undefined && drag.id !== event.pointerId) return;
  const id = drag.id; drag = null;
  if (canvas.hasPointerCapture(id)) canvas.releasePointerCapture(id);
}
canvas.addEventListener('pointerdown', event => {
  if (event.button !== 0) return;
  // Prevent native focus/selection from moving the page before capture begins.
  event.preventDefault();
  if (drag || !event.isPrimary || !isStarted || isPaused || game.isOver || progression?.blocked) return;
  if(game.isFlying) return;
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
// Keep the listener local and explicitly non-passive so dialogs retain their own scrolling.
canvas.addEventListener('touchmove', event => { if (event.cancelable) event.preventDefault(); }, { passive: false });
window.addEventListener('keydown', event => {
  if (navigation?.current !== 'play' || event.target.matches('input,select,textarea') || document.querySelector('dialog[open]')) return;
  if (event.target.matches('button') && event.key === ' ') return;
  if (['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown', ' ', 'p', 'P'].includes(event.key)) event.preventDefault();
  if (event.key === 'ArrowLeft') angle -= event.shiftKey ? .02 : .09;
  if (event.key === 'ArrowRight') angle += event.shiftKey ? .02 : .09;
  if (event.key === 'ArrowUp') shotPowerSet(power + .05);
  if (event.key === 'ArrowDown') shotPowerSet(power - .05);
  $('power').value = power * 100;
  if (event.key === ' ' && !event.repeat) shoot();
  if (event.key.toLowerCase() === 'p' && !event.repeat) { if(isPaused)start();else navigation.pause(); }
});
$('continue-free').onclick = () => { if (store.pools.free) dialogOpen(true); else carryToFree(); };
$('start').onclick = start; $('shoot').onclick = shoot; $('pause').onclick = () => { if(isPaused)start();else navigation.pause(); }; $('resume').onclick = () => pauseSet(false);
$('aim-left').onclick = () => { angle -= .14; }; $('aim-right').onclick = () => { angle += .14; }; $('power').oninput = () => shotPowerSet(Number($('power').value) / 100);
$('palette').onchange=event=>{audio.music.palette=event.currentTarget.value;save();};
$('sound').onchange = event => { audio.settingsSet(audio.volume, !event.currentTarget.checked); audioUnlockAsync(); controlsRender(); save(); };
$('ambience').oninput = () => { audio.ambienceSet(Number($('ambience').value) / 100); save(); };
$('volume').oninput = () => { audio.settingsSet(Number($('volume').value) / 100, audio.isMuted); save(); };
$('audition').onclick = async () => {
  const button=$('audition'), status=$('sound-check-status');
  if (audio.isMuted) { status.textContent='Enable Sound above, then try again.'; return; }
  if (!audio.volume) { status.textContent='Raise Volume above zero, then try again.'; return; }
  button.disabled=true; status.textContent='Starting sound check…';
  try {
    audio.media.describe(game.seed);
    if (!await audio.unlockAsync()) throw new Error('Audio is not running');
    if (!audio.audition()) { status.textContent='Sound check is busy. Try again in a moment.'; return; }
    buttonLabel(button,'Playing test notes…','music-note');
    status.textContent='Playing three notes at your Volume setting.';
    await new Promise(resolve=>setTimeout(resolve,1200));
    status.textContent='Test finished. Tap Sound check to replay.';
  } catch { status.textContent='Audio could not start. Tap Sound check to try again.'; }
  finally { button.disabled=false; buttonLabel(button,'Sound check','play'); }
};
$('motion').onchange = event => { isGentle = event.currentTarget.checked; if (isGentle) { particles = []; trails = []; } controlsRender(); save(); };
$('stream').onchange = event => { isStream = event.currentTarget.checked; controlsRender(); save(); };
creditsMount($('credits-dialog'));
$('credits-open').onclick=()=>$('credits-dialog').showModal();
$('button-controls').onchange=event=>{assistedControls=event.currentTarget.checked;controlsRender();save();};
for(const name of ['powers','music','bonus']) $(name+'-open').onclick=()=>{document.querySelectorAll('dialog[open]').forEach(dialog=>dialog.close());$(name+'-dialog').showModal();};
$('retry').onclick = () => dialogOpen();
$('result-home').onclick=()=>{if(save())navigation.home();else toast('Your result could not be saved. Keep this tab open and try Main Menu again.');};
$('seed-form').onsubmit = event => { event.preventDefault(); const seed = $('seed-input').value.trim(); if (!seed) return; $('new-dialog').close(); if (carrySong) carryToFree(); else newPool(seed, game.mode); };
document.querySelectorAll('[data-close]').forEach(button => { button.onclick = () => button.closest('dialog').close(); });
document.querySelectorAll('dialog').forEach(dialog => dialog.addEventListener('close', () => { if (isStarted) canvas.focus({ preventScroll: true }); }));
$('copy-result').onclick = async () => { try { await navigator.clipboard.writeText(`Ricochet Bloom · ${gameWon(game) ? 'WIN · ' : ''}${game.score} score · ${game.blooms} blooms · ${game.bestChain} best chain · seed ${game.seed}`); buttonLabel($('copy-result'),'Copied','check'); } catch { buttonLabel($('copy-result'),'Clipboard unavailable','copy'); } };
lifecycleMount(document, window, () => {
  audio.pauseSet(true); dragCancel();
  if (isStarted && !game.isOver) pauseSet(true);
  else save();
}, () => {
  if (isStarted && game.isOver && navigation?.current === 'play') { audio.pauseSet(false); audioUnlockAsync(); }
});
if (saved) { $('welcome-copy').textContent = `Your ${saved.mode === 'free' ? 'free-play' : 'challenge'} pool is saved. Pick up where you left off.`; buttonLabel($('start'),saved.isOver?'View your result':'Return to the pool','play'); }
if (!storageIsAvailable) $('save-status').textContent = 'Save unavailable · keep this tab open';
audio.media.actions(() => {
  if(trials?.active){trials.pause(false);return;}
  if (document.hidden || audio.isMuted || !audio.volume || !audio.ambience) return;
  if (!isStarted) start();
  else if (!game.isOver) pauseSet(false);
  else { audio.pauseSet(false); audioUnlockAsync(); }
}, () => { if(trials?.active){trials.pause();return;}audio.pauseSet(true); if (isStarted && !game.isOver) pauseSet(true); });
const songLibrary=songLibrarySetup(()=>({name:`${game.seed} · ${game.blooms} Blooms`,music:audio.musicSave()}),()=>progression.campaign('songs'));
controlsRender(); uiRender(); requestAnimationFrame(render);
if (['127.0.0.1', 'localhost', '[::1]'].includes(location.hostname)) {
  fetch('/api/status').then(response => response.ok ? response.json() : null).then(status => {
    if (status?.app !== 'ricochet-bloom') return;
    $('shutdown').hidden = false; $('shutdown').onclick = () => $('shutdown-dialog').showModal();
    $('shutdown-confirm').onclick = async () => { save(); try { const response = await fetch('/api/shutdown', { method: 'POST', headers: { 'X-Ricochet-Local': 'shutdown' } }); if (!response.ok) throw new Error(); audio.harmonySet(0); document.body.replaceChildren(Object.assign(document.createElement('p'), { textContent: 'Your pool is saved. The local server is shut down; you can close this tab.' })); } catch { toast('Shutdown failed. The server may still be running.'); } };
  }).catch(() => {});
}

progression=progressionMount({songsMount:(host,track)=>songLibrary.mount(host,track),songsClose:()=>songLibrary.close(),songsRefresh:()=>songLibrary.refresh(),gentle:()=>isGentle,currentScreen:()=>navigation?.current||'home',screen:name=>navigation?.show(name),back:()=>navigation?.back(),home:()=>navigation?.home(),save:()=>save(),play:loadPool,message:toast,runMusic(music){if(music.run)audio.music.run=structuredClone(music.run);},restoreLegacy(){const entry=store.pools[store.activeMode];loadPool(entry?.game||gameCreate('LAGOON',store.activeMode),entry?.music);}});

for(const entry of Object.values(store.pools))if(entry&&!progression.settle(entry.game,false))break;
if(progression.state.run)progression.settle(progression.state.run.game,false);

$('game-version').textContent='Version '+GAME_VERSION;
trials=trialMount({poolMedals:mode=>poolMedalRecords(store,{kind:progression.trialKind,mode}),wiki:id=>wiki.open(/^\d{3}$/.test(id)?'game-modes':'experiments',/^\d{3}$/.test(id)?'experiment-'+id:''),scorePlay,sound:audio,unlock:audioUnlockAsync,save,kind:()=>progression.trialKind,points:()=>progression.points,reward:e=>progression.trialReward(e),screen:name=>navigation?.show(name),back:()=>navigation?.back(),home:()=>navigation?.home(),legacy(mode){if(mode==='campaign')progression.campaign('tracks');else if(mode==='free')freePlay();else if(mode==='waves')wavesPlay();else {if(progression.context!=='legacy')progression.leave();save();const entry=store.pools.challenge;loadPool(entry?.game||gameCreate('LAGOON','challenge'),entry?.music);}}});

const wiki=wikiMount({screen:()=>navigation?.show('wiki'),back:()=>navigation?.back()});
navigation=gameMenuMount({
  gentle:()=>isGentle,
  skin:()=>progression.skin,
  suspend(){dragCancel();if(isStarted)save();isPaused=true;audio.pauseSet(true);uiRender();},
  resume:start,
  freePlay, wavesPlay,
  info(){if(preferences.lastPlay==='score-attack'){const attack=scoreRead(localStorage,progression.trialKind,preferences.scoreBudget||SCORE_DEFAULT).entry;if(attack&&!attack.game.isOver)return {resume:{artwork:assetURL('artwork/mode/score-attack.svg'),detail:`Score Attack · ${attack.game.attack.budget} Shots · ${attack.game.plucks} Left`}};}const wave=store.pools.waves;if(preferences.lastPlay==='waves'&&wave&&!wave.game.isOver)return {resume:{artwork:assetURL('artwork/pool-512.png'),detail:`Endless Waves · Wave ${wave.game.wave.number} · ${wave.game.plucks} Shots Left`}};const s=progression.state;if(s.phase==='shop')return {resume:null};const next=s.phase==='interlude',pool=s.pool+(next?1:0);return {resume:{artwork:assetURL('artwork/'+s.track+'.svg'),detail:trackGet(s.track).name+' · '+(next?'Next: ':'')+'Pool '+(pool+1)+' — '+POOL_NAMES[pool]}};},
  continue(){if(preferences.lastPlay==='score-attack'){const attack=scoreRead(localStorage,progression.trialKind,preferences.scoreBudget||SCORE_DEFAULT).entry;if(attack&&!attack.game.isOver){scorePlay(preferences.scoreBudget||SCORE_DEFAULT);return;}}if(preferences.lastPlay==='waves'&&store.pools.waves&&!store.pools.waves.game.isOver){wavesPlay();return;}if(progression.state.phase==='run')progression.play();else if(progression.state.phase==='interlude')progression.campaign();else start();},
  open(screen){if(screen==='gamemodes')trials.gallery();else if(screen.startsWith('gamemodes:'))trials.gallery(screen.slice(10));else if(screen.startsWith('pool-setup:'))trials.poolSetup(screen.slice(11));else if(screen==='score-setup')trials.scoreSetup();else if(screen==='trial-setup')trials.setup();else if(screen==='experiment-hub')trials.hub();else if(screen==='experiment-family')trials.family();else if(screen==='experiment-detail')trials.detail();else if(screen==='pause')$('menu-dialog').showModal();else if(screen==='levels')progression.campaign('tracks');else if(screen==='tree')progression.tree();else if(screen==='skins')progression.skins();else if(screen==='player-upgrades')progression.players();else if(screen==='wiki')wiki.open();else if(screen==='help')wiki.open('how-to-play');else $('settings-dialog').showModal();}
});
fullscreenMount(document,window);
edgeBackMount(document,window);
$('welcome').hidden=true;
$('menu-home').onclick=()=>navigation.home();
$('pause-home').onclick=()=>navigation.home();
$('menu-resume').onclick=()=>start();
$('menu-dialog').querySelector('[data-close]').onclick=()=>start();
$('menu-dialog').addEventListener('cancel',event=>{event.preventDefault();start();});
$('menu-wiki').onclick=()=>wiki.open();
$('menu-help').onclick=()=>wiki.open('how-to-play');
$('menu-settings').onclick=()=>$('settings-dialog').showModal();
if($('tree-dialog').open)navigation.show('tree');
window.dispatchEvent(new Event('ricochet-ready'));
