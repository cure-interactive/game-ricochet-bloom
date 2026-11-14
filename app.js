import {poolBubbleRender,poolBubbleIcons} from './pool-bubble.js?v=8b97af0450a015c00563acbcfe9a07b5ea04bcd9affb853ba45125d618a07256';
import { playerMenuMount } from './player-menu.js?v=8f73ca344bfe482db186696442cd27864d7daef9c0b7b275ee352ded1bb1b7c4';
import { playerStatsMount } from './player-stats-ui.js?v=41a1355e44ee9312d220e40598741690165a33ebeb0e294ee3b080a077aceef8';
import { playerBuild, playerSync } from './player-upgrade.js?v=2f8094123653e7654746e834352d2180922eb090ccd1d9e358a596ab2bcd37f9';
import { poolMedalRecord, poolMedalRecords } from './storage.js?v=ddb84aea986a9f93582a75b5c9a98e7d1bf60a9e870308f6f5ccffe09140cc7b';
import { medalIcon, medalBadge } from './medal-ui.js?v=2de85a5d119ff2e038d0f73f7f0bfba8de0fd0bc7f8fcb706c93de67d9e12122';
import { poolConditions, poolMedalKey, medalEvaluate } from './medal.js?v=cd0d6145cbb29d0887e81e0978d8fd4d411c6c3ecac8f6eb29813d4d5677468e';
import { SCORE_DEFAULT, SCORE_SEED, scoreTargets, scoreMedal } from './score-attack.js?v=0f35b25842dfb9cfe110fc14f07cae2cd19505b3deda3b7e67833a9a8f1a9c1e';
import { scoreRead, scoreWrite } from './score-attack-store.js?v=57c2f32c90cea1d5c2d2601973e60b0926e5a5b233f60ffc9fc543e5a7f7903e';
import { earningAmount } from './earning.js?v=95a3b4796136fdaeecc73effb73229085d826719b7179b769a0c3482f2e13e20';
import { trialMount } from './trial-ui.js?v=80b5654749cb1b4f8f0b911846594ab3ac7557e7b3d696457f7546e6a71fc07f';
import { GAME_VERSION } from './version.js?v=3176ba1b65d923af80974ce5d737a60d5aef732f27d7828a12827b2ae8beb768';
import { powerSlots } from './power-ui.js?v=9f81f72e92a838c8da2b79df39602af4e6dc5a5833721734b78d9bcde99c5f1d';
import { creditsMount } from './credit.js?v=1ff3cc971da2ad365444c38dfac3c21ba3085f8851aedfabd1e3abff4af0bbbf';
import { liveBubbles, WAVE_ENTRY } from './wave.js?v=3a330797f014cf08578ea70085a2b36387b02f2893aaa7fb87cdbb78ea7469ea';
import { viewportMount } from './viewport.js?v=c76004d132b2ea92ec0cecf92a15fae0a4ec85781d19df28f70222f5ed78b04a';
import { edgeBackMount } from './edge-back.js?v=0fcf216d1ae3fbd02ef73298696e6e6527bed750f07b2c58e748e86971312b71';
import { wikiMount } from './wiki.js?v=c9abcbc8cd598f1b603b00ae447ccdd380030db09f1a824f63ae5519464311e7';
import { titleCase } from './ui-text.js?v=02f24218cfade2c1cf218f107876f5365ad03a4287cebbb4b8e0817ce89eb0d0';
import { POOL_NAMES } from './run.js?v=761d66a7f48a89837bd270e75d2f2fc05b570ad32da442ce146863b3344310db';
import { freePlaySync, freePlayBuild, freePlayCreate } from './free-play.js?v=2688950919d159815d3ffeb8bedaa0133731cda8f149bcf49906a2abc95845da';
import { fullscreenMount } from './fullscreen.js?v=24d2782ab1e4be2d089cea603d419704b9473d8c76c1cf33f34d0a89c1f84471';
import {lifecycleMount} from './lifecycle.js?v=748e534e99e5d77a2695a1c9cadf48a5f695f18ef98ee437691640771511eaf0';
import { gameMenuMount } from './game-menu.js?v=b4c984e98138e022697d4c0e1afbdaf6b9fe0a799479932f6ee16db9a9bd8e30';
import { environmentRender, trackGet } from './track.js?v=36bf3603425adc5532331daf4647dba23a3d467e754a0405a1e7738fe443f03b';
import { POWER_TREES } from './power-tree.js?v=23b163f47bcdbe9dbfbdcf62fe05b9aff2fb9d879e90084377e7c217105d2aca';
import { progressionMount } from './progression-ui.js?v=40ef8d23d25afe08e19be258a99de5cb28fea66dac6afee546f78b3ac284bca0';
import {assetURL} from './asset.js?v=d550b28d96684af605439d08505831edfd982d0886527d4831cff7ecdf4d0e66';
import {buttonLabel,iconHTML,iconNode} from './ui-icon.js?v=6ec8a4ba31addd578a8b719304a1ec4bd9a40353abff6d30f299787bf0d2481c';
import {poolView} from './view.js?v=26cab1c9efeb1cecf6a36401d7839290091b4296d5bc450e29d6f50e884e2bea';
import {songLibrarySetup} from './song-ui.js?v=4c63f881674618507b6620f80e39462ba9e911c3ea00a502e6c3484931b0d008';
import { RULE, COLORS, gameCreate, gameWon, continueFree, launch, physicsStep, powerAvailable, powerAllowance, powerMarkers, effectGet, frozenHit, seedBodies, POWERS, OBJECTIVES, objectiveProgress, aimPreview, blasterTarget } from './engine.js?v=458c79aff3093649ea2afe0eb37b7e12985acd4da09001bc1a5dcaa8a869557d';
import { STORAGE, LEGACY_STORAGE, poolStoreRead, poolStoreSet, poolPreferencesWrite } from './storage.js?v=ddb84aea986a9f93582a75b5c9a98e7d1bf60a9e870308f6f5ccffe09140cc7b';
import { PoolSound, SOUND_CHECK_SECONDS } from './sound.js?v=1c0c9ccaa648e198d69bf0f4b282d5ccd1dbbc00d51951cab43ad15ac9f44f3c';
import { musicProgress, musicPhrasePreview } from './music.js?v=f7242d62cbdb10208c01d67fbb890f8a3feebd44c08971b2dc574fe5d49ea9fb';
import { bubbleCreate, bubbleHit, bubbleRipple } from './bubble.js?v=385baeaa905192ab9831eba4809c9c2370062e45dd55402b892d2ea214a30bac';
import { PowerVisual } from './power-visual.js?v=c1fa49a130dcf51e7d62ea8b27a6b927bc9a6dad0b11295f7beeead8e230b7e2';
viewportMount();
const $ = id => document.getElementById(id), canvas = $('arena'), context = canvas.getContext('2d'), audio = new PoolSound();
let store = poolStoreRead(null), storageIsAvailable = true;
try { store = poolStoreRead(JSON.parse(localStorage.getItem(STORAGE) ?? localStorage.getItem(LEGACY_STORAGE) ?? 'null')); } catch { storageIsAvailable = false; }
let preferences = store.preferences, best = store.best, saved = store.pools[store.activeMode]?.game, savedMusic = store.pools[store.activeMode]?.music;
let game = saved || gameCreate(new URL(location.href).searchParams.get('seed')?.slice(0, 32) || 'LAGOON', store.activeMode);
let carrySong = false, portraitView = false, progression = null, navigation = null, trials = null, physicsBatch = false;
const modeName = mode => progression?.context==='challenge'?'Shared Challenge':mode==='song-run'?'Melody Journey':mode==='score-attack'?'Score Attack':mode==='waves'?'Endless Waves':mode === 'free' ? 'Free play' : 'Challenge';

audio.musicRestore(savedMusic, game.blooms, game.launches);
document.body.dataset.leftHanded = String(preferences.leftHanded === true);
let assistedControls = preferences.assistedControls === true;
let isStarted = false, isPaused = false, isGentle = preferences.gentle === true;
let angle = -Math.PI / 2, power = .7, drag = null, previousTime = performance.now(), accumulator = 0, lastSaveTick = 0, lastUITick = -100;
let trails = [], particles = [], rings = [], connections = [], bolts = [], reunions = [], scorePopups = [], toastTimer, frameCount = 0, noteCount = 0;
const membranes = new Map();
const powerVisual = new PowerVisual();
const {powerIcons}=poolBubbleIcons();
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
  else if(!physicsBatch&&progression.checkpoint(game,audio.musicSave())===false)return false; store.best = best; store.preferences = { ...preferences, volume: audio.volume, ambience: audio.ambience, muted: audio.isMuted, gentle: isGentle, assistedControls };
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
function blobRender(body,dt,time){
 const playback=audio.playbackLights.get(body.id);
 const replayGlow=playback?Math.max(0,(playback.until-audio.context.currentTime)/.7)*(isGentle?.18:.7):0;
 poolBubbleRender(context,game,body,membraneGet(body),dt,time,{gentle:isGentle,skinColor:progression?.skin||'#f1f9d7',portrait:portraitView,replayGlow});
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
  document.querySelector('.bonus-rules').textContent=`Earn 1 Point per difficulty level, banked when the shot settles. Spend Points in Skills. ${game.mode==='song-run'?'One bonus per pool; no extra bonus payout at pool clear.':'The next objective begins after success.'}`;
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
function controlsRender() { $('left-handed').checked=preferences.leftHanded===true; document.body.dataset.leftHanded=String(preferences.leftHanded===true); $('button-controls').checked=assistedControls; document.querySelector('.control-strip').hidden=!assistedControls; document.body.classList.toggle('assisted-controls',assistedControls); $('sound').checked = !audio.isMuted; document.querySelector('.sound-hint').replaceChildren(iconNode('music-note'),document.createTextNode(audio.isMuted?'Sound is off. Enable Sound to listen.':'Sound on. Headphones make it lovelier.')); $('volume').value = audio.volume * 100; $('ambience').value = audio.ambience * 100; $('motion').checked = isGentle; document.body.classList.toggle('motion-reduced', isGentle); }
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
  const entry = store.pools.free; loadPool(entry?.game || freePlayCreate(game.seed,progression.state), entry?.music);
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
    status.textContent='Playing low → medium → full-strength gameplay notes at your Volume setting.';
    await new Promise(resolve=>setTimeout(resolve,SOUND_CHECK_SECONDS*1000));
    status.textContent='Test finished. Tap Sound check to replay.';
  } catch { status.textContent='Audio could not start. Tap Sound check to try again.'; }
  finally { button.disabled=false; buttonLabel(button,'Sound check','play'); }
};
$('motion').onchange = event => { isGentle = event.currentTarget.checked; if (isGentle) { particles = []; trails = []; } controlsRender(); save(); };
creditsMount($('credits-dialog'));
$('credits-open').onclick=()=>$('credits-dialog').showModal();
$('left-handed').onchange=event=>{preferences.leftHanded=event.currentTarget.checked;store.preferences.leftHanded=preferences.leftHanded;controlsRender();$('left-handed-status').textContent=poolPreferencesWrite(localStorage,{leftHanded:preferences.leftHanded})?'':'Layout changed for this session. This browser could not save the preference.';};
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
trials=trialMount({drift:()=>navigation?.drift(),poolMedals:mode=>poolMedalRecords(store,{kind:progression.trialKind,mode}),wiki:id=>wiki.open(/^\d{3}$/.test(id)&&progression.developmentEnabled?'game-modes':'experiments',/^\d{3}$/.test(id)&&progression.developmentEnabled?'experiment-'+id:''),scorePlay,sound:audio,unlock:audioUnlockAsync,save,kind:()=>progression.trialKind,points:()=>progression.points,reward:e=>progression.trialReward(e),screen:name=>navigation?.show(name),back:()=>navigation?.back(),home:()=>navigation?.home(),legacy(mode){if(mode==='campaign')progression.campaign('tracks');else if(mode==='free')freePlay();else if(mode==='waves')wavesPlay();else {if(progression.context!=='legacy')progression.leave();save();const entry=store.pools.challenge;loadPool(entry?.game||gameCreate('LAGOON','challenge'),entry?.music);}}});

const wiki=wikiMount({development:()=>progression.developmentEnabled,screen:()=>navigation?.show('wiki'),back:()=>navigation?.back()});
const playerMenuScreen=playerMenuMount({get:()=>progression.state,profile:()=>progression.statsProfile.state.profile,rename:name=>progression.renamePlayer(name),gentle:()=>isGentle,screen:()=>navigation?.show('player'),back:()=>navigation?.back(),open:destination=>{if(destination==='skins')progression.skins();else if(destination==='stats')playerStatsScreen.open();else if(destination==='skills')progression.players();}});
const playerStatsScreen=playerStatsMount({get:()=>({...progression.statsProfile,storage:localStorage,poolStore:store}),screen:()=>navigation?.show('stats'),back:()=>navigation?.back(),open:destination=>destination==='upgrades'?progression.players():progression.tree()});
navigation=gameMenuMount({
  recoveryNotice:progression.recoveryNotice,
  gentle:()=>isGentle,
  skin:()=>progression.skin,
  profile:()=>progression.statsProfile.state,
  audioSettings:()=>({volume:audio.volume,ambience:audio.ambience,muted:audio.isMuted}),
  suspend(){dragCancel();if(isStarted)save();isPaused=true;audio.pauseSet(true);uiRender();},
  resume:start,
  freePlay, wavesPlay,
  info(){if(preferences.lastPlay==='score-attack'){const attack=scoreRead(localStorage,progression.trialKind,preferences.scoreBudget||SCORE_DEFAULT).entry;if(attack&&!attack.game.isOver)return {resume:{artwork:assetURL('artwork/mode/score-attack.svg'),detail:`Score Attack · ${attack.game.attack.budget} Shots · ${attack.game.plucks} Left`}};}const wave=store.pools.waves;if(preferences.lastPlay==='waves'&&wave&&!wave.game.isOver)return {resume:{artwork:assetURL('artwork/pool-512.png'),detail:`Endless Waves · Wave ${wave.game.wave.number} · ${wave.game.plucks} Shots Left`}};const s=progression.state;if(s.phase==='shop')return {resume:null};const next=s.phase==='interlude',pool=s.pool+(next?1:0);return {resume:{artwork:assetURL('artwork/'+s.track+'.svg'),detail:trackGet(s.track).name+' · '+(next?'Next: ':'')+'Pool '+(pool+1)+' — '+POOL_NAMES[pool]}};},
  continue(){if(preferences.lastPlay==='score-attack'){const attack=scoreRead(localStorage,progression.trialKind,preferences.scoreBudget||SCORE_DEFAULT).entry;if(attack&&!attack.game.isOver){scorePlay(preferences.scoreBudget||SCORE_DEFAULT);return;}}if(preferences.lastPlay==='waves'&&store.pools.waves&&!store.pools.waves.game.isOver){wavesPlay();return;}if(progression.state.phase==='run')progression.play();else if(progression.state.phase==='interlude')progression.campaign();else start();},
  open(screen){if(screen==='gamemodes')trials.gallery();else if(screen.startsWith('gamemodes:'))trials.gallery(screen.slice(10));else if(screen.startsWith('pool-setup:'))trials.poolSetup(screen.slice(11));else if(screen==='score-setup')trials.scoreSetup();else if(screen==='trial-setup')trials.setup();else if(screen==='experiment-hub')trials.hub();else if(screen==='experiment-family')trials.family();else if(screen==='experiment-detail')trials.detail();else if(screen==='pause')$('menu-dialog').showModal();else if(screen==='levels')progression.campaign('tracks');else if(screen==='player')playerMenuScreen.open();else if(screen==='stats')playerStatsScreen.open();else if(screen==='tree')progression.tree();else if(screen==='skins')progression.skins();else if(screen==='player-upgrades')progression.players();else if(screen==='wiki')wiki.open();else if(screen==='help')wiki.open('how-to-play');else $('settings-dialog').showModal();}
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
window.ricochetDiagnostics?.setContext(()=>({initialized:true,mode:game.mode,progressAvailable:progression.statsProfile.available,poolAvailable:storageIsAvailable}));
window.dispatchEvent(new Event('ricochet-ready'));
