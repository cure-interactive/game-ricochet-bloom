import {menuSummaryRender} from './menu-summary.js?v=ae45281d84da1bab2004670a7e08413c46eec38f2c344291b3c7b345710e5910';
import {gameToastMount} from './game-toast.js?v=b8c9bf958cb4ef37eb54fff95cc18092bddd37d96938fe424e676d01fccdd39b';
import {sliderMount} from './slider.js?v=634a2dbe865437c87bc1771f8063de75419d1b3fca5c341c073b6e1ee8309697';
import {frameGate,performanceMount} from './performance.js?v=98f53fc38e408a68f5e1beee87a7d0e0066fe8a1093aa41acc5b7134cdaac489';
const renderReady=frameGate();
import {audioRecoveryMount} from './audio-recovery.js?v=3f2f3bad665cb46972bd146af40fe297d8bd7746dc16341538d0e1e5298b84a0';
import {turnHits} from './turn-hits.js?v=601ae75742860558121ef0d4bb066017b87650900bbeeb17e8bf8d359fbcdd5d';
import {inputModalityMount} from './input-modality.js?v=ec290657f7857743c779cffb29f79cca250e53ba1c39cce335ca91e5309a43ee';
import {scrollbarsMount} from './scrollbar.js?v=084e38dd230e14b3811e8974d55ba96d14b3f882c3b9e71daee846ae39ef090c';
import {QUALITY,qualityRead,qualityPixelRatio} from './quality.js?v=33c4a6dbcda13ded7499caa9a3563afa6903c4346850134bc5bd467cbac4ad4e';
import { uiSoundMount, uiSoundFeedback } from './ui-sound.js?v=c8318423c1565fbab4d63567ad32cdd01eaf2bef81da713cf2f2060b3ca69e7d';
import {hudCardsMount} from './hud-help.js?v=9896c599ce88bdc1c4531ccb545aa3c20eebd27f2cbbad3fb2193d159da34c63';
import { hudMedal, hudMedalRender } from './hud-medal.js?v=3510a7968390a8a40c87f36db8328f9146328ae1ad54a5eec192d4701b89536a';
import {poolBubbleIcons} from './pool-bubble.js?v=b9aa88a0058091c8f20ec34695b3b000610c105f5f2590f8166a9b00dc4a585d';
import {appUpdateMount} from './app-update.js?v=0d3e3b14197d18495c87c1188d79722457485db9c64cb9a42127dda910c9f52b';
import {BUILD_TIME} from './build.js?v=c561286cfcb3662d0fafa4c1dd2168571cab6e64256f618453bd2ffac40400ec';
import {cosmeticMount} from './cosmetic-ui.js?v=f4b1e756379ba2dcda8d2dc9cdea8e61df5acfd43623eb61fe1009ed5c63577b';
import { playerMenuMount } from './player-menu.js?v=996519f7aa4239143c7d29ba6e2a5cfd18ccf39250b30b211b735332225cd550';
import { playerStatsMount } from './player-stats-ui.js?v=1db33f60a34298030f2d5351077f7d45325a98b4299c35e2583d0fdb7ede2365';
import { playerBuild, playerSync } from './player-upgrade.js?v=205999fde590d7ae1935c6f5a99938cc353989c1dae9cfab7129b62c0b60b55b';
import { poolMedalRecord, poolMedalRecords } from './storage.js?v=4035b7e0446de4065d5ac53c5f46f25627c8e6c6a37b634df4e17bb336db7992';
import { medalIcon, medalBadge } from './medal-ui.js?v=06712ea7606e557f4f58ab781e63550ed1e2d5ec646b691e108df5a16d62d646';
import { poolConditions, poolMedalKey, medalEvaluate, scoreConditions } from './medal.js?v=97f2ce6ed69f5c8834ecd381128c29d366fdfc9390080f59a05049d77db5f006';
import { SCORE_DEFAULT, SCORE_SEED, scoreTargets, scoreMedal } from './score-attack.js?v=0f35b25842dfb9cfe110fc14f07cae2cd19505b3deda3b7e67833a9a8f1a9c1e';
import { scoreRead, scoreWrite } from './score-attack-store.js?v=91c32040ebff52d0172d69c733500a09949982b068bf12d7060e225f58000a47';
import { earningAmount } from './earning.js?v=6e78b642b40a8b5067bb53b7a8694613a999b1c158bcef5909c8bb927ddad43f';
import { trialMount } from './trial-ui.js?v=8f905ae176bec62a614ce2fce7de1ae170599ad9bc00ed659ef0efd936148701';
import { GAME_VERSION } from './version.js?v=e8d96ca6a8ebda7d105a22d761601c6dc3c65f2e6114e4ebbcd35bde368f2083';
import { powerSlots } from './power-ui.js?v=264f7e6798b7f4223f5ba6213999b764d206b354e170cdad35e7c02065a44ea3';
import { creditsMount } from './credit.js?v=4e631af163939b536e4201a3846c1a5ad99997d9a675d3300c8b41efa348c100';
import { liveBubbles, WAVE_ENTRY } from './wave.js?v=3a330797f014cf08578ea70085a2b36387b02f2893aaa7fb87cdbb78ea7469ea';
import { viewportMount } from './viewport.js?v=c7cd3ffd13579341c8b8dc3cc012a6b9cf58387595eaca2a5e88260863c31b20';
import { edgeBackMount } from './edge-back.js?v=fd08c81060553978b4bd4b5746060ef02d8b884b62ea0a2feb7fa7c1edff921c';
import { wikiMount } from './wiki.js?v=b431ef23d1df48ce8a21b9ab87ccf3e59fc85b90247ec384e76f68fe30b8c089';
import { titleCase } from './ui-text.js?v=02f24218cfade2c1cf218f107876f5365ad03a4287cebbb4b8e0817ce89eb0d0';
import { POOL_NAMES, goalRemaining } from './run.js?v=13cddd0791aa2c8ea509a45b8136591b3e0359519cf8ebb3be6fefb2c61961d8';
import { freePlaySync, freePlayBuild, freePlayCreate } from './free-play.js?v=e88f49ff1076d3ac319c33099dcb495a99d32ba426fe0d458462baa2a8cef924';
import { fullscreenMount } from './fullscreen.js?v=be161d7d613a23200ce063c3f427f4828c781ce939c5635443dba9ac478c84f7';
import {lifecycleMount} from './lifecycle.js?v=037e17bc4ecc56d32887a05e67bc7381675f4584af115e9ac420c622eaea0871';
import { gameMenuMount } from './game-menu.js?v=1825a668090278792d56c77dd8d98b66e90d46dc7fe0bfedd3a7a0a6b339b19d';
import { environmentRender, trackGet } from './track.js?v=36bf3603425adc5532331daf4647dba23a3d467e754a0405a1e7738fe443f03b';
import { POWER_TREES } from './power-tree.js?v=2a64a8c4a0ad6dc1f93d8385f13952b46869143cbf7dc606ecd40164a825481b';
import { progressionMount } from './progression-ui.js?v=64326826c10d5f97cf48adacb80239f5ca8d4b79dd2dff1939aed68c9cf5952c';
import {assetURL} from './asset.js?v=637716717d2250f0d96d961614bfe2ace0e7a403d7f201f26f134e685de2062c';
import {buttonLabel,iconHTML,iconNode} from './ui-icon.js?v=b24f7ce2c068f52a69b32f410f4eb83685b949c9f2d77286fc6e72083b51fedb';
import {poolView} from './view.js?v=26cab1c9efeb1cecf6a36401d7839290091b4296d5bc450e29d6f50e884e2bea';
import {songLibrarySetup} from './song-ui.js?v=1bcf4918033b8bca3430a0beb8bd67029f8ef409e60166566d4f819d25e9cd69';
import { RULE, COLORS, gameCreate, gameWon, continueFree, launch, physicsStep, powerAvailable, powerAllowance, powerMarkers, effectGet, frozenHit, seedBodies, POWERS, OBJECTIVES, objectiveProgress, aimPreview, blasterTarget } from './engine.js?v=adc6d69546723ce9f5131bf144815dc0a4f6fc6682ee59318309f9f62ca6bed0';
import { STORAGE, LEGACY_STORAGE, poolStoreRead, poolStoreSet, poolPreferencesWrite } from './storage.js?v=4035b7e0446de4065d5ac53c5f46f25627c8e6c6a37b634df4e17bb336db7992';
import { PoolSound, SOUND_CHECK_SECONDS } from './sound.js?v=fac08a4e3d77315d2160800d9ede8919466507cb4be09ab565321509877f2012';
import { musicProgress, musicPhrasePreview } from './music.js?v=e7a5a17eb66e892fcfde7da0cd1da25876f188e8fdc235a3b66388f997dda0f3';
import {PoolVisual} from './pool-visual.js?v=27d09978be91922cd44fd73ef79fa3476636a5ada91045a820cafc7fe5c945d6';
import {wakeLockMount} from './wake-lock.js?v=154014a91b4cd2b75bb445ea16836bbcf58eb0e1b0e3c5ac6991b66dc38beea5';
import {dropdownMount} from './dropdown.js?v=889bd295ecd00898ec6e1b094a477a2c9768858191fa3378272f8833ddf0c3e7';
viewportMount();
inputModalityMount();
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
preferences.quality=qualityRead(preferences);
let quality=preferences.quality;
let isStarted = false, isPaused = false, isLowQuality = quality==='low';
let angle = -Math.PI / 2, power = .7, drag = null, previousTime = performance.now(), accumulator = 0, lastSaveTick = 0, lastUITick = -100;
let scorePopups = [], frameCount = 0, noteCount = 0;
const poolVisual=new PoolVisual(),membranes=poolVisual.membranes;
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
  else if(!physicsBatch&&progression.checkpoint(game,audio.musicSave())===false)return false; store.best = best; store.preferences = { ...preferences, volume: audio.volume, ambience: audio.ambience, muted: audio.isMuted, quality:preferences.quality, assistedControls };
  if(!progression||progression.context==='legacy')poolMedalRecord(store,game,game.earning?.kind??progression?.trialKind??'normal');
  try { localStorage.setItem(STORAGE, JSON.stringify(store)); storageIsAvailable = true; } catch { storageIsAvailable = false; }
  $('save-status').textContent = storageIsAvailable ? '● Pool saved on this browser' : 'Save unavailable · keep this tab open'; lastSaveTick = game.tick;
  return storageIsAvailable;
}
function announce(text) { $('announcement').textContent = text; }
const gameToast=gameToastMount($('toast'),{needsHint:()=>isStarted&&!game.launches&&!game.isOver,announce});
const toast=text=>gameToast.show(text);
async function audioUnlockAsync() { try { await audio.unlockAsync(); } catch { toast('Audio unavailable in this browser'); } }
function eventHandle(event) {
  audio.eventPlay({ ...event, tick: game.tick });audio.cosmeticPlay(progression?.cosmetics,event);
  poolVisual.configure(progression?.cosmetics);poolVisual.event(event,game,isLowQuality);
  if (Number.isFinite(event.points) && event.points > 0) {
    scorePopups.push({ x: event.x, y: event.y, points: event.points, age: 0, isBloom: event.type === 'bloom', color: event.type === 'bloom' ? '#e1d4ff' : COLORS[event.tone] || '#e4ffcb' });
    if (scorePopups.length > 32) scorePopups.shift();
  }
  if(event.type==='wave-clear'){const medal=poolMedalRecord(store,game,game.earning?.kind??progression?.trialKind??'normal',event);toast(`Wave ${event.number} cleared · ${medal||'Complete'} · +${event.points}`);}
  if(event.type==='wave'){announce(`Wave ${event.number}. Five shots to pop every bubble.`);save();}
  if(event.type==='blaster-fire')save();
  if (event.type === 'blaster-reload') toast('5-Chain reload · magazine refilled');
  if(event.type==='objective') {toast(`Bonus complete · +${event.points} ${event.points===1?'Point':'Points'} when this shot settles.`);save();}
  if (event.type === 'note') {
    noteCount++;
    if (event.chain === 3) toast('The pool is listening.');
    announce(`${event.chain} contacts, ${game.score} score.`); save();
  }
  if(event.type==='lightning')save();
  if(event.type==='wrap'||event.type==='reunite')save();
  if(event.type==='portal'){toast('Through the portal · momentum intact.');save();}
  if(event.type==='slingshot'){toast(event.target?'Slingshot · heading for an unhit bubble.':'Slingshot · away you go.');save();}
  if (event.type === 'power-streak') {
    if (event.successful) toast(`${event.capacity} powers next shot · 5-Chain streak${event.capacity === 3 ? ' at maximum' : ' growing'}.`);
    else if (event.previousCapacity > 1) toast('Streak reset · one power next shot.');
    save();
  }
  if(event.type==='power'){toast(`${POWERS[event.kind].name} · flight refreshed to ${RULE.flightSeconds}s`);save();}
  if(event.type==='bloom'){toast(`5-Chain! +500 · ${Math.min(3,game.power.capacity+1)} powers next shot.`);save();}
  if (['rest', 'over', 'win'].includes(event.type)) { freePlayRefresh(); save(); if (event.type !== 'rest') announce(`${game.mode==='score-attack'?'Score Attack complete.':gameWon(game) ? 'You won! Three 5-Chains.' : 'Out of shots. Try again.'} ${game.score} score.`); }
  uiRender();
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
    const rise = (isLowQuality ? 10 : 46) * (1 - Math.pow(1 - popup.age / 1.8, 2));
    let y = Math.max(size, Math.min(view.rect.height-size,point.y-12-rise));
    // Separate simultaneous hit and 5-Chain awards, including dense Split/Echo hits.
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
function resize() { const { rect } = geometry(), ratio = qualityPixelRatio(quality,devicePixelRatio || 1); canvas.width = Math.round(rect.width * ratio); canvas.height = Math.round(rect.height * ratio); }
new ResizeObserver(resize).observe(canvas);

function render(now) {
  if(!renderReady(now)){requestAnimationFrame(render);return;}
  if (navigation && navigation.current !== 'play') { if(audio.keepAmbient&&!document.hidden){audio.musicUpdate(0);canvas.dataset.songBar=String(audio.music.bar);canvas.dataset.musicVoices=String(audio.phraseVoices.size);canvas.dataset.musicPaused=String(audio.isMusicPaused);} previousTime=now;accumulator=0;requestAnimationFrame(render);return; }
  const view=geometry(), {rect,scale}=view, ratio=canvas.width/rect.width; portraitView=view.portrait; audio.portrait=portraitView;
  audio.musicUpdate(game.bodies.reduce((sum, body) => sum + Math.hypot(body.vx, body.vy), 0) / (game.bodies.length * 100));
  const elapsed = Math.min(.06, (now - previousTime) / 1000); previousTime = now;
  const isActive = isStarted && !isPaused && !game.isOver && !document.querySelector('dialog[open]') && !document.hidden;
  if (isActive && !progression?.blocked) { accumulator += elapsed; while (accumulator >= RULE.step&&!progression?.blocked) { const events = physicsStep(game); physicsBatch=true;events.forEach(eventHandle);physicsBatch=false;if(events.some(e=>['note','power','bloom','rest','over','win','objective','wave'].includes(e.type)))progression?.observe(game,events,audio.musicSave()); accumulator -= RULE.step; } if (game.tick - lastSaveTick >= 60) save(); }
  else accumulator = 0;
  const visualDelta = isPaused || document.hidden || document.querySelector('dialog[open]') ? 0 : elapsed;
  const time = isStarted ? game.tick * RULE.step : now / 1000;
  context.setTransform(1, 0, 0, 1, 0, 0); context.clearRect(0, 0, canvas.width, canvas.height); context.setTransform(...view.matrix.map(value=>value*ratio));
  environmentRender(context,game,isLowQuality);
  // Slow luminous currents, not a grid.
  context.lineWidth = 1;
  for (let ring = 0; ring < 6; ring++) { context.beginPath(); context.ellipse(480 + Math.sin(time * .12 + ring) * 12, 320, 140 + ring * 72, 90 + ring * 50, -.3, 0, Math.PI * 2); context.strokeStyle = '#77b2e0' + (ring % 2 ? '0a' : '10'); context.stroke(); }
  for (let index = 0; index < 75; index++) { const x = ((index * 137.5 + Math.sin(time * .12 + index) * 7) % 900) + 30, y = ((index * 89.7 + Math.cos(time * .17 + index) * 9) % 550) + 45; context.fillStyle = index % 3 ? '#86b7df28' : '#c6c6ff50'; context.beginPath(); context.arc(x, y, index % 4 === 0 ? 1.3 : .7, 0, Math.PI * 2); context.fill(); }
  context.strokeStyle = '#8db9e819'; context.lineWidth = 1; context.beginPath(); context.roundRect(30, 30, 900, 580, 50); context.stroke();
  const seed = game.bodies[0];
  audio.cosmeticTravel(progression?.cosmetics,game.bodies[0],isActive);
  poolVisual.configure(progression?.cosmetics);poolVisual.before(context,game,time,visualDelta,isLowQuality);
  poolVisual.bodies(context,game,visualDelta,time,{gentle:isLowQuality,skinColor:progression?.skin||'#f1f9d7',skinStyle:progression?.skinStyle,portrait:portraitView,replayGlow:body=>{const playback=audio.playbackLights.get(body.id);return playback?Math.max(0,(playback.until-audio.context.currentTime)/.7)*(isLowQuality?.18:.7):0;}});
  if (!game.isFlying && isStarted && !isPaused && !game.isOver) {
    const path=aimPreview(game,angle,power);
    context.save();context.strokeStyle='#e4ffcb88';context.lineWidth=1.5;context.setLineDash([3,8]);context.beginPath();path.forEach((p,i)=>i?context.lineTo(p.x,p.y):context.moveTo(p.x,p.y));context.stroke();context.setLineDash([]);
    if(path.length===3){context.beginPath();context.arc(path[1].x,path[1].y,5,0,Math.PI*2);context.stroke();}context.restore();
    context.strokeStyle = '#dbf8c833'; context.lineWidth = 1; context.beginPath(); context.arc(seed.x, seed.y, 26 + (isLowQuality ? 0 : Math.sin(time * 2) * 2), 0, Math.PI * 2); context.stroke();
    if (drag) { context.beginPath(); context.moveTo(seed.x, seed.y); context.lineTo(seed.x - Math.cos(angle) * power * 100, seed.y - Math.sin(angle) * power * 100); context.strokeStyle = '#d8f5caaa'; context.lineWidth = 2; context.stroke(); }
  }
  poolVisual.after(context,game,visualDelta,isLowQuality);
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
  gameToast.refresh();
  $('points').textContent=(progression?.points??0).toLocaleString('en-US');
  if (game.mode === 'challenge') best = Math.max(best, game.score);
  $('score').textContent = game.score.toLocaleString('en-US');
  $('plucks').textContent = game.mode === 'free' ? '∞' : game.plucks; $('pluck-label').textContent = 'SHOTS';
  $('pool-seed').textContent = `POOL / ${game.seed}`;
  progression?.profileIndicator();
  let medalEarned=null;
  const medal=game.mode==='score-attack'?{targets:scoreTargets(game.attack.budget),best:scoreRead(localStorage,game.attack.kind,game.attack.budget).best}:progression?.medalHud();$('pool-medals').hidden=!medal;
  if(medal){medalEarned=medalEvaluate(scoreConditions(medal.targets),{complete:1,score:medal.best??-1});for(const el of $('pool-medals').querySelectorAll('[data-medal]')){const name=el.dataset.medal,target=medal.targets[name];el.innerHTML=medalIcon(name)+`<span>${game.score>=target?'✓ ':''}${name} ${target.toLocaleString('en-US')}</span>`;el.classList.toggle('is-reached',game.score>=target);} $('pool-best-score').textContent=medal.best===null?'Clear the goal to earn a medal':`Best ${medal.best.toLocaleString('en-US')} · clear the goal to earn a medal`;}
  if(game.mode==='score-attack')$('pool-best-score').textContent=medal.best===null?'Finish every shot to record your score':`Best ${medal.best.toLocaleString('en-US')} · ${game.attack.budget}-shot runs`;
  if(!medal&&poolConditions(game.mode)){
    $('pool-medals').hidden=false;const conditions=poolConditions(game.mode),earned=store.medals?.[poolMedalKey(game,game.earning?.kind??progression?.trialKind??'normal')];
    medalEarned=earned??null;
    for(const el of $('pool-medals').querySelectorAll('[data-medal]')){const c=conditions.find(c=>c.name===el.dataset.medal);el.innerHTML=medalIcon(c.name)+`<span>${c.name} · ${c.text}</span>`;el.title=c.text;el.classList.toggle('is-reached',!!earned&&['Bronze','Silver','Gold'].indexOf(earned)>=['Bronze','Silver','Gold'].indexOf(c.name));}
    $('pool-best-score').textContent=(earned?'Best: '+earned+' · ':'')+(game.mode==='waves'?`Wave ${game.wave.number}: clear every bubble` : game.mode==='free'?'Score milestones · awarded after a shot settles':'Make 3 5-Chains · the full final shot counts');
  }
  hudMedalRender($('medals-open'),hudMedal(medal?scoreConditions(medal.targets,game.mode==='song-run'?'Clear the pool':'Finish the run'):poolConditions(game.mode),{score:game.score,shots:game.mode==='waves'?5-game.plucks:game.launches,earned:medalEarned}));
  $('end-medal').innerHTML=game.isOver?medalBadge(game.mode==='score-attack'?scoreMedal(game.score,game.attack.budget):game.mode==='challenge'&&gameWon(game)?medalEvaluate(poolConditions('challenge'),{complete:1,shots:game.launches}):null):'';
  $('chain-label').textContent = turnHits(game).length ? `${turnHits(game).length} CONTACTS ${turnHits(game).length >= 5 ? '· BEAUTIFUL.' : '· KEEP THE CHAIN GOING.'}` : 'FIVE DIFFERENT BUBBLES. ONE 5-CHAIN.';
  $('note-meter').replaceChildren(...Array.from({ length: 5 }, (_, index) => { const item = document.createElement('i'); if (turnHits(game)[index]) { item.className = 'active'; item.style.setProperty('--note', COLORS[game.bodies[turnHits(game)[index]].tone]); } return item; }));
  $('note-meter').dataset.count=turnHits(game).length>5?String(turnHits(game).length):'';
  $('note-meter').setAttribute('aria-label', `${turnHits(game).length} unique contacts this shot`);
  $('state-label').textContent = isPaused ? 'A QUIET MOMENT.' : game.isOver ? 'RUN COMPLETE.' : !isStarted ? 'YOUR NEXT LITTLE OBSESSION.' : game.isFlying ? game.flightAge >= RULE.flightSeconds ? 'SETTLING INTO THE POOL' : `FOLLOW THE LIGHT · ${Math.max(0, Math.ceil(RULE.flightSeconds - game.flightAge))}s` : 'AIM. RELEASE. CHAIN.';
  $('goal-label').textContent = game.mode==='score-attack'?'Score Attack':game.mode==='waves'?'Endless Waves':game.mode === 'free' ? 'Free play' : gameWon(game) ? 'Three 5-Chains complete' : `5-Chains ${Math.min(game.blooms, RULE.goalBlooms)} / ${RULE.goalBlooms}`;
  $('goal-progress').setAttribute('aria-label','5-Chains toward victory');$('goal-progress').hidden = game.mode === 'free'; $('goal-progress').max = RULE.goalBlooms; $('goal-progress').value = Math.min(game.blooms, RULE.goalBlooms);
  if(progression?.hud()) {$('goal-label').textContent=progression.hud();$('goal-progress').hidden=true;}
  if(game.mode==='waves'){const left=liveBubbles(game).length,total=game.bodies.length-1;$('goal-label').textContent=`Wave ${game.wave.number} · ${left} / ${total} bubbles left`;$('goal-progress').hidden=false;$('goal-progress').setAttribute('aria-label','Bubbles popped this wave');$('goal-progress').max=total;$('goal-progress').value=total-left;$('state-label').textContent=game.wave.entry<WAVE_ENTRY?'BUBBLES INCOMING':left===0?'WAVE CLEARED · COASTING':game.isFlying?'POP EVERY BUBBLE':`${game.plucks} SHOTS TO CLEAR THE BOARD`;Object.assign(canvas.dataset,{wave:String(game.wave.number),bubblesLeft:String(left),waveEntering:String(game.wave.entry<WAVE_ENTRY)});}
  if(game.mode==='score-attack'){$('goal-label').textContent=`Score Attack · ${game.attack.budget} Shots`;$('goal-progress').hidden=false;$('goal-progress').max=game.attack.budget;$('goal-progress').value=game.launches-(game.isFlying?1:0);$('goal-progress').setAttribute('aria-label','Shots completed');$('state-label').textContent=isPaused?'PAUSED':game.isOver?'RUN COMPLETE':game.isFlying?'SHOT IN MOTION':'BUILD CHAINS. BANK. SCORE.';$('chain-label').textContent=turnHits(game).length?`${turnHits(game).length} UNIQUE CONTACTS`:'FIVE DIFFERENT BUBBLES. ONE 5-CHAIN.';}
  document.querySelector('.goal-strip').hidden=progression?.context!=='listening'&&(game.mode==='free'||game.mode==='score-attack');
  pauseSummaryRender();
  bonusRender();
  $('palette').value=audio.music.palette;
  const shot=game.lastShot;
  $('shot-result').textContent=game.isFlying?`${turnHits(game).length} unique contacts · ${game.banks} banks · ${game.power.used} powers`:shot?`${shot.bloom?'5-Chain!':shot.notes===4?'One bubble short of a 5-Chain.':`${shot.notes} of 5 contacts toward a 5-Chain.`}${shot.points===null?' · Resumed shot':` +${shot.points}`} · ${shot.banks} banks · ${shot.powers} powers${shot.objective?' · Objective complete':''}`:'Aim for a wall bank. The dotted guide shows your first rebound; drifting bubbles can change the path.';
  $('edge-idle').textContent=game.isFlying?'':game.mode==='score-attack'?'Drag back and release to launch':game.launches?'Drag back for another shot':'Drag back anywhere to launch';
  if(game.mode==='score-attack'){$('shot-result').textContent=game.isFlying?`${turnHits(game).length} unique contacts · ${game.banks} banks · ${game.power.used} powers`:shot?`${shot.notes} contacts${shot.bloom?' · 5-Chain!':''} · +${shot.points??0} score · ${shot.banks} banks${shot.objective?' · Bonus complete':''}`:'Bank off walls and chain different bubbles to build your score.';}
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
  $('power-progress').textContent = game.isFlying ? `${used} / ${allowance} powers used · make a 5-Chain to ${allowance === 3 ? 'keep all three' : `earn ${allowance + 1} next shot`}` : `${allowance} ${allowance === 1 ? 'power' : 'powers'} this shot · ${allowance === 3 ? 'make a 5-Chain to keep all three' : `make a 5-Chain to earn ${allowance + 1} next shot`}. No 5-Chain resets to 1.`;
  canvas.dataset.frozenHit = turnHits(game).filter(id => frozenHit(game, id)).join(',');
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
  if (game.isOver) { $('end-title').textContent = gameWon(game) ? 'You Made a 5-Chain.' : 'One More Ripple?'; $('end-label').textContent = gameWon(game) ? 'YOU WON · THREE BLOOMS' : 'OUT OF SHOTS'; $('end-score').textContent = game.score.toLocaleString('en-US'); $('end-detail').textContent = `${game.blooms} / ${RULE.goalBlooms} 5-Chains · ${game.launches} shots used${gameWon(game) ? ' · Keep playing in Free Play below.' : ' · Reach three 5-Chains to win.'}`; }
  $('continue-free').hidden=['waves','score-attack'].includes(game.mode);
  if(game.mode==='score-attack'&&game.isOver){const medal=scoreMedal(game.score,game.attack.budget);$('end-title').textContent=medal?`${titleCase(medal)} Medal`:'Run Complete';$('end-label').textContent=`SCORE ATTACK · ${game.attack.budget} SHOTS`;$('end-detail').textContent=`${game.blooms} 5-Chains · ${game.earning?earningAmount(game.earning):0} Points earned · Best ${Math.max(scoreRead(localStorage,game.attack.kind,game.attack.budget).best??0,game.score).toLocaleString('en-US')}`;}
  $('wave-medal-results').hidden=game.mode!=='waves'||!game.isOver;
  if(game.mode==='waves'&&game.isOver){$('wave-medal-results').innerHTML=game.wave.number>1?`<p>Best medals for cleared waves</p><div class="wave-medal-summary">${poolMedalRecords(store,{kind:game.earning?.kind??progression?.trialKind??'normal',mode:'waves',seed:game.seed}).filter(r=>r.wave<game.wave.number).sort((a,b)=>a.wave-b.wave).map(r=>`<span>Wave ${r.wave} ${medalBadge(r.medal)}</span>`).join('')}</div>`:'';$('end-title').textContent='Endless Waves';$('end-label').textContent=`WAVE ${game.wave.number} · OUT OF SHOTS`;$('end-detail').textContent=`${game.wave.number-1} waves cleared · ${game.earning?earningAmount(game.earning):0} Points earned · Best wave ${Math.max(store.waveBest?.wave||1,game.wave.number)} · Best score ${Math.max(store.waveBest?.score||0,game.score).toLocaleString('en-US')}`;}
  // Read-only observability for live-browser QA. Never drives gameplay.
  canvas.dataset.quality = quality;
  canvas.dataset.bubbleDeformation = Math.max(0, ...Array.from(membranes.values(), skin => Math.hypot(...skin.strain))).toFixed(3);
  Object.assign(canvas.dataset, { physicsTick: String(game.tick), flying: String(game.isFlying), score: String(game.score), seedX: game.bodies[0].x.toFixed(2), seedY: game.bodies[0].y.toFixed(2), chain: String(turnHits(game).length), audioState: audio.context?.state || 'locked', soundEvents: String(audio.eventCount), notes: String(noteCount), mode: game.mode, harmony: audio.harmony?.name || 'none', songChords: String(audio.music.history.length), songTheme: audio.music.theme.join(','), musicPending: String(audio.musicQueue.length), musicVoices: String(audio.phraseVoices.size), audioVoices: String(audio.voiceCount), harmonyPaused: String(audio.isMusicPaused), musicPassage: String(audio.passage), musicSection: audio.section, musicStage: String(audio.stage), songStage: String(song.stage), songPlucks: String(audio.music.plucks), songBar: String(audio.music.bar), mediaState: audio.media.state, mediaReady: String(audio.media.ready), mediaArtwork: audio.media.artwork?.[0]?.src || '', hookNextBar: String(audio.music.evolution.nextBar), hookPending: String(!!audio.music.evolution.pending), phraseSteps: (audio.music.motifs.at(-1)?.steps || []).join(','), hookSteps: (audio.music.hook?.steps || []).join(','), phraseReplayCount: String(audio.playbackCount), phraseReplayIds: [...audio.playbackLights.keys()].join(','), ambience: String(audio.ambience) });
}
function phraseRender() {
  if($('game-music-bar').hidden)return;
  const isLive = game.isFlying, phrase = isLive ? musicPhrasePreview(audio.music) : audio.playbackPhrase || audio.music.motifs.at(-1), now = audio.context?.currentTime ?? 0;
  const isAudible = audio.isMusicPlaying && audio.context?.state === 'running' && !audio.isMuted && !audio.isMusicPaused && audio.volume > 0 && audio.ambience > 0;
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
function pauseSummaryRender(casual=false){
 let title,detail='',progress='',artwork;
 if(casual||navigation?.current==='drift-pause'){
  title='Casual';detail='A relaxing, free-flowing pool';artwork='artwork/mode/drift.svg';
 }else if(game.mode==='song-run'&&progression){
  const state=progression.state;
  title=progression.context==='challenge'?'Shared Melody Journey':'Melody Journey';
  detail=trackGet(state.track).name+' · Pool '+(state.pool+1)+' — '+POOL_NAMES[state.pool];
  progress=progression.context==='listening'?'Listening · Your saved song':state.run?goalRemaining(state):'Run complete · open Skills';
  artwork='artwork/'+state.track+'.svg';
 }else if(game.mode==='score-attack'){
  title='Score Attack';detail=game.attack.budget+' Shots · '+game.plucks+' Left';artwork='artwork/mode/score-attack.svg';
 }else if(game.mode==='waves'){
  title='Endless Waves';detail=$('goal-label').textContent;artwork='artwork/mode/waves.svg';
 }else if(game.mode==='free'){
  title='Free Play';detail='Unlimited shots';artwork='artwork/mode/free.svg';
 }else{title='Challenge';detail='Three 5-Chains';artwork='artwork/mode/challenge.svg';}
 menuSummaryRender($('menu-mode'),{title,detail,progress,artwork:assetURL(artwork)});
}
function controlsRender() { $('left-handed').checked=preferences.leftHanded===true; document.body.dataset.leftHanded=String(preferences.leftHanded===true); $('button-controls').checked=assistedControls; document.querySelector('.control-strip').hidden=!assistedControls; document.body.classList.toggle('assisted-controls',assistedControls); $('sound').checked = !audio.isMuted; document.querySelector('.sound-hint').replaceChildren(iconNode('music-note'),document.createTextNode(audio.isMuted?'Sound is off. Enable Sound to listen.':'Sound on. Headphones make it lovelier.')); $('volume').value = audio.volume * 100; $('ambience').value = audio.ambience * 100; $('quality').value=preferences.quality; $('quality-description').textContent=QUALITY[quality].description; document.body.dataset.quality=quality; }
function freePlayRefresh(){if(progression?.context==='legacy'){freePlaySync(game,progression.state);playerSync(game,progression.state.profile);}}
function shoot() { if(progression?.blocked)return; if(game.isFlying) return; if (!isStarted || isPaused || document.querySelector('dialog[open]')) return; freePlayRefresh(); audioUnlockAsync(); if(!progression.prepareShot(game))return; if (launch(game, angle, power)) { audio.eventPlay({ type: 'launch', x: game.bodies[0].x, y: game.bodies[0].y });audio.cosmeticPlay(progression?.cosmetics,{type:'launch',x:game.bodies[0].x,y:game.bodies[0].y}); save(); uiRender(); } }
function pauseSet(value) { if (!isStarted || game.isOver) return; isPaused = value; audio.pauseSet(value); dragCancel(); save(); uiRender(); if (!value) { audioUnlockAsync(); canvas.focus({ preventScroll: true }); } }
function start() { preferences.lastPlay=game.mode;if(game.attack)preferences.scoreBudget=game.attack.budget; freePlayRefresh(); navigation?.play(); audio.media.describe(game.seed); isStarted = true; isPaused = false; $('welcome').hidden = true; if (game.mode!=='song-run' && audio.bloomCount !== game.blooms) audio.harmonySet(game.blooms); audio.pauseSet(false); audio.musicStart(); audioUnlockAsync(); save(); uiRender(); gameToast.refresh(); canvas.focus({ preventScroll: true }); }
function loadPool(nextGame, music = null) {
  game = structuredClone(nextGame); progression?.settle(game,false); audio.musicRestore(music, music?music.blooms:game.blooms, music?music.plucks:game.launches);
  poolVisual.clear(); scorePopups = []; dragCancel(); accumulator = 0;
  angle = -Math.PI / 2; power = .7; $('power').value = 70; gameToast.clear(); buttonLabel($('copy-result'),'Copy this result','copy'); start();
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
$('start').onclick = start; $('shoot').onclick = shoot; $('pause').onclick = () => { if(isPaused)start();else navigation.pause(); };
$('aim-left').onclick = () => { angle -= .14; }; $('aim-right').onclick = () => { angle += .14; }; $('power').oninput = () => shotPowerSet(Number($('power').value) / 100);
$('palette').onchange=event=>{audio.music.palette=event.currentTarget.value;save();};
$('sound').onchange = event => { audio.settingsSet(audio.volume, !event.currentTarget.checked); audioUnlockAsync(); controlsRender(); save(); };
$('ambience').oninput = () => { audio.ambienceSet(Number($('ambience').value) / 100); save(); };
$('volume').oninput = () => { audio.settingsSet(Number($('volume').value) / 100, audio.isMuted); save(); };
let soundCheckRequest=0,soundCheckTimer;
$('audition').onclick = async () => {
  const request=++soundCheckRequest;clearTimeout(soundCheckTimer);
  const button=$('audition'), status=$('sound-check-status');
  if (audio.isMuted) { status.textContent='Enable Sound above, then try again.'; return; }
  if (!audio.volume) { status.textContent='Raise Volume above zero, then try again.'; return; }
  status.textContent='Starting sound check…';
  try {
    audio.media.describe(game.seed);
    if (!await audio.unlockAsync()) throw new Error('Audio is not running');
    if(request!==soundCheckRequest)return;
    if (!audio.audition()) throw new Error('Audio is not running');
    buttonLabel(button,'Restart sound check','play');
    status.textContent='Playing low → medium → full-strength gameplay notes at your Volume setting.';
    soundCheckTimer=setTimeout(()=>{if(request!==soundCheckRequest)return;status.textContent='Test finished. Tap Sound check to replay.';buttonLabel(button,'Sound check','play');},SOUND_CHECK_SECONDS*1000);
  } catch { if(request===soundCheckRequest){status.textContent='Audio could not start. Tap Sound check to try again.';buttonLabel(button,'Sound check','play');} }
};

creditsMount($('credits-dialog'));
$('credits-open').onclick=()=>$('credits-dialog').showModal();
$('left-handed').onchange=event=>{preferences.leftHanded=event.currentTarget.checked;store.preferences.leftHanded=preferences.leftHanded;controlsRender();$('left-handed-status').textContent=poolPreferencesWrite(localStorage,{leftHanded:preferences.leftHanded})?'':'Layout changed for this session. This browser could not save the preference.';};
$('button-controls').onchange=event=>{assistedControls=event.currentTarget.checked;controlsRender();save();};
hudCardsMount(()=>({score:game.score,points:progression?.points??0,shots:game.plucks,mode:game.mode,contacts:turnHits(game).length}));
for(const name of ['powers','music','bonus','medals']) $(name+'-open').onclick=()=>{document.querySelectorAll('dialog[open]').forEach(dialog=>dialog.close());$(name+'-dialog').showModal();};
$('retry').onclick = () => dialogOpen();
$('result-home').onclick=()=>{if(save())navigation.home();else toast('Your result could not be saved. Keep this tab open and try Main Menu again.');};
$('seed-form').onsubmit = event => { event.preventDefault(); const seed = $('seed-input').value.trim(); if (!seed) return; $('new-dialog').close(); if (carrySong) carryToFree(); else newPool(seed, game.mode); };
document.querySelectorAll('[data-close]').forEach(button => { button.onclick = () => button.closest('dialog').close(); });
document.querySelectorAll('dialog').forEach(dialog => dialog.addEventListener('close', () => { if (isStarted) canvas.focus({ preventScroll: true }); }));
$('copy-result').onclick = async () => { try { await navigator.clipboard.writeText(`Ricochet Bloom · ${gameWon(game) ? 'WIN · ' : ''}${game.score} score · ${game.blooms} 5-Chains · ${game.bestChain} best chain · seed ${game.seed}`); buttonLabel($('copy-result'),'Copied','check'); } catch { buttonLabel($('copy-result'),'Clipboard unavailable','copy'); } };
let restorePausedAmbient=false;
lifecycleMount(document, window, () => {
  restorePausedAmbient ||= audio.keepAmbient===true;
  audio.pauseSet(true); dragCancel();
  if (isStarted && !game.isOver) pauseSet(true);
  else save();
}, () => {
  if(restorePausedAmbient&&!document.hidden){audio.pauseSet(true,{ambient:true});audioUnlockAsync();restorePausedAmbient=false;}
  if (isStarted && game.isOver && navigation?.current === 'play') { audio.pauseSet(false); audioUnlockAsync(); }
}, () => {
  const screen=navigation?.current;
  if(screen==='drift'||screen==='play'&&isStarted&&!game.isOver&&!document.querySelector('dialog[open]'))navigation.pause();
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
const songLibrary=songLibrarySetup(()=>({name:`${game.seed} · ${game.blooms} 5-Chains`,music:audio.musicSave()}),()=>progression.campaign('songs'),()=>progression.cosmetics.music,()=>progression.cosmetics);
controlsRender(); uiRender(); requestAnimationFrame(render);
if (['127.0.0.1', 'localhost', '[::1]'].includes(location.hostname)) {
  fetch('/api/status').then(response => response.ok ? response.json() : null).then(status => {
    if (status?.app !== 'ricochet-bloom') return;
    $('shutdown').hidden = false; $('shutdown').onclick = () => $('shutdown-dialog').showModal();
    $('shutdown-confirm').onclick = async () => { save(); try { const response = await fetch('/api/shutdown', { method: 'POST', headers: { 'X-Ricochet-Local': 'shutdown' } }); if (!response.ok) throw new Error(); audio.harmonySet(0); document.body.replaceChildren(Object.assign(document.createElement('p'), { textContent: 'Your pool is saved. The local server is shut down; you can close this tab.' })); } catch { toast('Shutdown failed. The server may still be running.'); } };
  }).catch(() => {});
}

progression=progressionMount({songsMount:(host,track)=>songLibrary.mount(host,track),songsClose:()=>songLibrary.close(),songsRefresh:()=>songLibrary.refresh(),gentle:()=>isLowQuality,currentScreen:()=>navigation?.current||'home',screen:name=>navigation?.show(name),back:()=>navigation?.back(),home:()=>navigation?.home(),save:()=>save(),play:loadPool,message:toast,runMusic(music){if(music.run)audio.music.run=structuredClone(music.run);},restoreLegacy(){const entry=store.pools[store.activeMode];loadPool(entry?.game||gameCreate('LAGOON',store.activeMode),entry?.music);}});

for(const entry of Object.values(store.pools))if(entry&&!progression.settle(entry.game,false))break;
if(progression.state.run)progression.settle(progression.state.run.game,false);

$('game-version').textContent='Version '+GAME_VERSION;
const buildDate=document.createElement('p');buildDate.className='about-build';buildDate.textContent='Built '+new Intl.DateTimeFormat(undefined,{dateStyle:'medium',timeStyle:'long'}).format(new Date(BUILD_TIME));$('game-version').after(buildDate);
audio.musicTheme=()=>progression.cosmetics.music;audio.musicLoadout=()=>progression.cosmetics;
appUpdateMount({getAutomatic:()=>preferences.automaticUpdates!==false,setAutomatic:value=>{preferences.automaticUpdates=value;store.preferences.automaticUpdates=value;return poolPreferencesWrite(localStorage,{automaticUpdates:value});},save:()=>{const status=progression.saveDiagnostics;return !status.blocked&&!status.pending&&save();}});
trials=trialMount({cosmetics:()=>progression.cosmetics,skin:()=>progression.skin,skinStyle:()=>progression.skinStyle,drift:()=>navigation?.drift(),poolMedals:mode=>poolMedalRecords(store,{kind:progression.trialKind,mode}),wiki:id=>wiki.open(/^\d{3}$/.test(id)&&progression.developmentEnabled?'game-modes':'experiments',/^\d{3}$/.test(id)&&progression.developmentEnabled?'experiment-'+id:''),scorePlay,sound:audio,unlock:audioUnlockAsync,save,kind:()=>progression.trialKind,generation:()=>progression.trialGeneration,points:()=>progression.points,reward:e=>progression.trialReward(e),screen:name=>navigation?.show(name),back:()=>navigation?.back(),home:()=>navigation?.home(),legacy(mode){if(mode==='campaign')progression.campaign('tracks');else if(mode==='free')freePlay();else if(mode==='waves')wavesPlay();else {if(progression.context!=='legacy')progression.leave();save();const entry=store.pools.challenge;loadPool(entry?.game||gameCreate('LAGOON','challenge'),entry?.music);}}});

const wiki=wikiMount({development:()=>progression.developmentEnabled,screen:()=>navigation?.show('wiki'),back:()=>navigation?.back()});
$('game-changelog').onclick=()=>{navigation.show('settings');wiki.open('changelog');};
const playerMenuScreen=playerMenuMount({get:()=>progression.statsProfile.state,profile:()=>progression.statsProfile.state.profile,rename:name=>progression.renamePlayer(name),gentle:()=>isLowQuality,screen:()=>navigation?.show('player'),back:()=>navigation?.back(),open:destination=>{if(destination==='skins')progression.skins();else if(destination==='stats')playerStatsScreen.open();else if(destination==='skills')progression.players();else if(['trails','bounce-effects','music-themes'].includes(destination))cosmeticsScreen.open(destination);}});
let cosmeticAudio=null;
const cosmeticsScreen=cosmeticMount({showPurchasedCosts:()=>progression.showPurchasedCosts,unlock:()=>{cosmeticAudio=navigation?.musicAudio||audio;return cosmeticAudio.unlockAsync().catch(()=>false);},sound:id=>cosmeticAudio?.cosmeticAudition(id),previewStatus:()=>cosmeticAudio?.cosmeticPreviewStatus(),stopSound:()=>{cosmeticAudio?.cosmeticPreviewStop();cosmeticAudio=null;},profile:()=>progression.statsProfile.state.profile,act:action=>{const result=progression.cosmeticAct(action);navigation?.refresh();return result;},color:()=>progression.skin,style:()=>progression.skinStyle,screen:name=>navigation?.show(name),back:()=>navigation?.back()});
const playerStatsScreen=playerStatsMount({get:()=>({...progression.statsProfile,storage:localStorage,poolStore:store}),screen:()=>navigation?.show('stats'),back:()=>navigation?.back(),open:destination=>destination==='upgrades'?progression.players():progression.tree()});
navigation=gameMenuMount({
  recoveryNotice:progression.recoveryNotice,
  gentle:()=>isLowQuality,
  skin:()=>progression.skin,skinStyle:()=>progression.skinStyle,
  profile:()=>progression.statsProfile.state,
  audioSettings:()=>({musicTheme:progression.cosmetics.music,musicLoadout:progression.cosmetics,volume:audio.volume,ambience:audio.ambience,muted:audio.isMuted}),
  suspend({ambient=false}={}){dragCancel();if(isStarted)save();isPaused=true;audio.pauseSet(true,{ambient:ambient&&isStarted});uiRender();},
  resume:start,
  freePlay, wavesPlay,
  info(){if(preferences.lastPlay==='score-attack'){const attack=scoreRead(localStorage,progression.trialKind,preferences.scoreBudget||SCORE_DEFAULT).entry;if(attack&&!attack.game.isOver)return {resume:{artwork:assetURL('artwork/mode/score-attack.svg'),detail:`Score Attack · ${attack.game.attack.budget} Shots · ${attack.game.plucks} Left`}};}const wave=store.pools.waves;if(preferences.lastPlay==='waves'&&wave&&!wave.game.isOver)return {resume:{artwork:assetURL('artwork/pool-512.png'),detail:`Endless Waves · Wave ${wave.game.wave.number} · ${wave.game.plucks} Shots Left`}};const s=progression.state;if(s.phase==='shop')return {resume:null};const next=s.phase==='interlude',pool=s.pool+(next?1:0);return {resume:{artwork:assetURL('artwork/'+s.track+'.svg'),detail:trackGet(s.track).name+' · '+(next?'Next: ':'')+'Pool '+(pool+1)+' — '+POOL_NAMES[pool]}};},
  continue(){if(preferences.lastPlay==='score-attack'){const attack=scoreRead(localStorage,progression.trialKind,preferences.scoreBudget||SCORE_DEFAULT).entry;if(attack&&!attack.game.isOver){scorePlay(preferences.scoreBudget||SCORE_DEFAULT);return;}}if(preferences.lastPlay==='waves'&&store.pools.waves&&!store.pools.waves.game.isOver){wavesPlay();return;}if(progression.state.phase==='run')progression.play();else if(progression.state.phase==='interlude')progression.campaign();else start();},
  open(screen){if(screen==='gamemodes')trials.gallery();else if(screen.startsWith('gamemodes:'))trials.gallery(screen.slice(10));else if(screen.startsWith('pool-setup:'))trials.poolSetup(screen.slice(11));else if(screen==='score-setup')trials.scoreSetup();else if(screen==='trial-setup')trials.setup();else if(screen==='experiment-hub')trials.hub();else if(screen==='experiment-family')trials.family();else if(screen==='experiment-detail')trials.detail();else if(screen==='pause'||screen==='drift-pause'){pauseSummaryRender(screen==='drift-pause');$('menu-dialog').showModal();}else if(screen==='levels')progression.campaign('tracks');else if(screen==='player')playerMenuScreen.open();else if(screen==='stats')playerStatsScreen.open();else if(['trails','bounce-effects','music-themes'].includes(screen))cosmeticsScreen.open(screen);else if(screen==='tree')progression.tree();else if(screen==='skins')progression.skins();else if(screen==='player-upgrades')progression.players();else if(screen==='wiki')wiki.open();else if(screen==='help')wiki.open('how-to-play');else $('settings-dialog').showModal();}
});
const uiFeedback=uiSoundFeedback(audio,document);
uiSoundMount(audio,document,uiFeedback);
audioRecoveryMount(audio,document,window);
fullscreenMount(document,window);
performanceMount({preferences,save:patch=>poolPreferencesWrite(localStorage,patch),apply:state=>{const changed=quality!==state.quality;quality=state.quality;isLowQuality=quality==='low';controlsRender();if(changed)resize();}});
edgeBackMount(document,window,{feedback:uiFeedback});
scrollbarsMount(document,window);
wakeLockMount();
dropdownMount();sliderMount();
$('welcome').hidden=true;
$('menu-home').onclick=()=>navigation.home();
$('menu-resume').onclick=()=>navigation.resume();
$('menu-dialog').querySelector('[data-close]').onclick=()=>navigation.resume();
$('menu-dialog').addEventListener('cancel',event=>{event.preventDefault();navigation.resume();});
$('menu-wiki').onclick=()=>wiki.open();
$('menu-help').onclick=()=>wiki.open('how-to-play');
$('menu-settings').onclick=()=>$('settings-dialog').showModal();
if($('tree-dialog').open)navigation.show('tree');
window.ricochetDiagnostics?.setContext(()=>({initialized:true,mode:game.mode,progressAvailable:progression.statsProfile.available,progressSave:progression.saveDiagnostics,poolAvailable:storageIsAvailable,audio:{state:audio.context?.state||'not initialized',muted:audio.isMuted,master:audio.volume,music:audio.ambience,voices:audio.voiceCount,paused:audio.isMusicPaused},rendering:{quality,frameRate:preferences.frameRate||'default'},automaticUpdates:preferences.automaticUpdates!==false}));
window.dispatchEvent(new Event('ricochet-ready'));
