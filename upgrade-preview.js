import { gameCreate, launch, physicsStep, powerMarkers, seedBodies, RULE, COLORS, POWERS } from './engine.js?v=53c12a3b8ec5b7bda0625a1e527cb498490b7df27796c02c3c3d133a93b14c7c';
import { GAME_CATALOGUE as cat } from './run.js?v=ddcdce8b7a5156a16f65833c3f1b37eb1b5a8b4f002512cda831b395bba97739';
import { POWER_TREES } from './power-tree.js?v=c9a5802f7ef4e448c825a7917910994fd4d5dc8753c92d94db7b9abffaa78827';
import { PowerVisual } from './power-visual.js?v=50383007b2d63f85e9a17663aa370dba31f5a89a64f226ec24e52196843fb783';
import { iconHTML } from './ui-icon.js?v=6eefd3a5e72d754fea063666baf3166c1c88b5e72db4ab97072da15565143b81';

export const BUILD_EXAMPLES=Object.freeze([
  {id:'bank',name:'Bank & Reply',powers:['comet','spring','echo'],nodes:['comet.foundation','spring.b','echo.a'],description:'Keep momentum, turn a rebound, then let Echo seek a missed jelly.'},
  {id:'current',name:'Gather & Release',powers:['attract','vortex','ripple'],nodes:['attract.foundation','vortex.foundation','ripple.capstone'],description:'Gather bodies, circulate them, then send a returning pressure wave.'},
  {id:'cascade',name:'Contact Cascade',powers:['blaster','split','relay'],nodes:['blaster.foundation','split.foundation','relay.foundation'],description:'Automatic shots, side seeds and physical relays share one contact chain.'}
]);
export function upgradeFixture(id,after=true,autoplay=true){
  const example=BUILD_EXAMPLES.find(x=>x.id===id),node=cat.nodes[id]||cat.legacyNodes[id];
  if(!example&&!node)throw new TypeError('Unknown preview');
  const power=node?.power,powers=example?.powers||[power,...['ripple','attract','comet'].filter(x=>x!==power)].slice(0,3),nodes=after?(example?.nodes||[id]):[];
  const build=powers.map(p=>({power:p,foundation:nodes.includes(p+'.foundation'),variants:['a','b'].filter(k=>nodes.includes(p+'.'+k)),capstone:nodes.includes(p+'.capstone')}));
  const game=gameCreate(({bank:'STUDY-5',current:'STUDY-1',cascade:'STUDY-6'})[id]||'UPGRADE-STUDY','free',{build,population:14});
  for(const b of game.bodies.slice(1)){b.vx=0;b.vy=0;}
  Object.assign(game.bodies[1],{x:496,y:422,radius:28});
  game.power.offer=powers[0];game.power.target=1;game.power.capacity=example?3:1;
  if(autoplay)launch(game,-Math.PI/2,.85);
  // Base unlock comparison has no marked contact; all bodies and launch remain identical.
  if(node?.kind==='base'&&!after)game.power.markers=[];
  if(autoplay)prepareStudy(game,id);
  return game;
}
// Controlled continuations expose conditional benefits without changing live physics.
// Both sides receive the same scene; only the selected upgrade differs.
export const STUDY_SCENES=Object.freeze({
 'echo.foundation':'Prepared rebound: watch the violet Echo stretch away from its dotted route.',
 'echo.a':'Prepared near miss: an unhit jelly sits beside the Echo’s delayed route.',
 'echo.b':'Prepared rebound: compare the Echo’s maximum distance from its delayed route.',
 'echo.capstone':'Late-flight study: the player is slowing with one last Echo phrase to finish.',
 'stasis.capstone':'Contact study: a frosted jelly approaches an unfrozen jelly.',
 'wake.capstone':'Crossing study: the player returns across an older part of its wake.',
 'rewind.capstone':'Encore study: four notes are already struck; Rewind approaches the fifth.',
 'blaster.a':'Missed-shot study: a projectile approaches the wall with time left to fly.',
 'swap.foundation':'One distant jelly is already hit. Compare the chosen destination.',
 'swap.a':'The farthest jelly is behind the departing player. Compare destinations.'
});
function prepareStudy(game,id){
 if(id==='swap.foundation'||id==='swap.a'){
  for(const b of game.bodies.slice(1))Object.assign(b,{x:400+(b.id%7)*55,y:b.id<7?420:540,vx:0,vy:0,radius:22});
  Object.assign(game.bodies[0],{x:480,y:320,vx:0,vy:-300});Object.assign(game.bodies[1],{x:480,y:279,radius:28});
  Object.assign(game.bodies[2],{x:80,y:60});Object.assign(game.bodies[3],{x:860,y:540});
  if(id==='swap.foundation')game.chain=[2];else {game.bodies[2].y=580;game.bodies[3].y=80;}return;
 }
 if(!STUDY_SCENES[id])return;
 const power=cat.nodes[id].power;
 for(let i=0;i<180&&!game.effects.some(e=>e.kind===power);i++)physicsStep(game);
 const e=game.effects.find(e=>e.kind===power),seed=game.bodies[0];if(!e)throw new Error('Study activation failed: '+id);
 // Park the unrelated bodies; the studied contacts stay identical on both sides.
 for(const b of game.bodies.slice(1))Object.assign(b,{x:80+(b.id%7)*125,y:b.id<7?80:560,vx:0,vy:0,radius:22});
 Object.assign(seed,{x:480,y:320,vx:180,vy:0});
 if(power==='echo'){
  e.isReady=true;e.path=Array.from({length:60},(_,i)=>({x:360+i*1.5,y:320,radius:12,teleport:0}));
  e.follow={x:358.5,y:320,vx:180,vy:0,teleport:0};Object.assign(e.ghost,{x:358.5,y:330,vx:180,vy:300});
  Object.assign(game.bodies[2],{x:402,y:354,radius:18});
  if(id.endsWith('capstone')){game.flightAge=6.5;seed.vx=50;}
 }
 if(power==='stasis'){e.targets=[1,2];Object.assign(game.bodies[2],{x:240,y:220,vx:80,radius:28});Object.assign(game.bodies[3],{x:301,y:220,radius:28});}
 if(power==='wake'){game.tick=Math.ceil(game.tick/12)*12-1;e.trail=Array.from({length:30},(_,i)=>({x:i===0?480:200+i*5,y:i===0?320:200,nx:1,ny:0,age:.4}));e.trail.push({x:480,y:320,nx:1,ny:0,age:0});Object.assign(game.bodies[2],{x:530,y:320});}
 if(power==='rewind'){game.chain=[1,2,3,4];Object.assign(game.bodies[5],{x:480,y:240,radius:22});e.returning=true;e.route=Array.from({length:60},(_,i)=>({x:480,y:220+i*100/60,teleport:0}));e.seconds=1;}
 if(power==='blaster'){e.shots=[{x:915,y:320,vx:980,vy:0,life:1.6,bounces:id.endsWith('.a')&&game.build[0].variants.includes('a')?1:0,volley:0,target:2}];e.ammo=0;}
}
export function studyMeasure(game,previous={}){
 const m={contacts:game.chain.length,banks:game.banks,...previous};m.contacts=game.chain.length;m.banks=game.banks;
 for(const e of game.effects){m.duration=Math.max(m.duration||0,e.seconds);if(e.kind==='echo'){m.excursion=Math.max(m.excursion||0,Math.hypot(e.ghost.x-e.follow.x,e.ghost.y-e.follow.y));m.echoPoints=e.path.length;}
 if(e.kind==='split'&&e.seconds<.5)m.separation=Math.max(...e.shards.map(b=>Math.hypot(b.x-game.bodies[0].x,b.y-game.bodies[0].y)));
 if(e.kind==='stasis')m.frozen=Math.max(m.frozen||0,e.targets.length);
 }
 m.eddies=Math.max(m.eddies||0,game.skillState?.eddies.length||0);m.frost=Math.max(m.frost||0,game.skillState?.frostSpent.length||0);m.encore=game.skillState?.rewindBloom||m.encore||false;m.drain=game.skillState?.echoDrain||m.drain||false;
 return m;
}
function studyReading(id,m){
 if(id==='stasis.capstone')return `${m.frost||0} frost transfers`;
 if(id==='wake.capstone')return `${m.eddies||0} crossing eddies`;
 if(id==='rewind.capstone')return m.encore?'Encore pressure wave':'No encore pressure wave';
 if(id==='echo.capstone')return m.drain?'Final Echo drains its path':'Echo keeps following';
 if(id.startsWith('echo.'))return `${Math.round(m.excursion||0)} units of Echo stretch`;
 if(id==='split.capstone')return `${Math.round(m.separation||0)} units apart before rejoining`;
 if(id==='blaster.a')return `${m.shotBanks||0} projectile rebounds`;
 if(['spring.foundation','portal.foundation','wrap.foundation','relay.b'].includes(id))return `${(m.duration||0).toFixed(1)} seconds active`;
 if(id.startsWith('swap.'))return `Destination jelly ${m.destination||'…'}`;
 return `${m.contacts||0} contacts · ${m.banks||0} banks`;
}
export function upgradePreviewMount(controller){
  const dialog=document.createElement('dialog');dialog.id='upgrade-preview';dialog.setAttribute('aria-label','Upgrade comparison');document.body.append(dialog);
  let id,side=true,game,studies,measures,visual=new PowerVisual(),frame=0,last=0,accumulator=0,ticks=0;
  const button=(action,label,icon)=>`<button type="button" aria-label="${label}" data-preview="${action}">${iconHTML(icon)}<span>${label}</span></button>`;
  function reset(){studies=[upgradeFixture(id,false),upgradeFixture(id,true)];measures=studies.map(g=>studyMeasure(g));game=studies[Number(side)];visual.clear();ticks=0;accumulator=0;last=0;dialog.querySelector('[role=status]').textContent=STUDY_SCENES[id]||'Same pool and launch. Only the upgrade changes.';draw();}
  function draw(){const canvas=dialog.querySelector('canvas'),c=canvas.getContext('2d');c.clearRect(0,0,960,640);c.fillStyle='#0c1929';c.fillRect(0,0,960,640);c.strokeStyle='#56767f';c.lineWidth=3;c.beginPath();c.roundRect(30,30,900,580,45);c.stroke();
    for(const b of game.bodies){c.save();c.fillStyle=b.id?COLORS[b.tone]:'#effff9';c.globalAlpha=b.id&&game.chain.includes(b.id)?.5:1;c.shadowColor=c.fillStyle;c.shadowBlur=controller.gentle?.()?0:18;c.beginPath();c.arc(b.x,b.y,b.radius,0,Math.PI*2);c.fill();c.restore();}
    const echo=game.effects.find(e=>e.kind==='echo');if(echo){c.save();c.strokeStyle='#cbb9ff';c.setLineDash([5,6]);c.beginPath();echo.path.forEach((p,i)=>i?c.lineTo(p.x,p.y):c.moveTo(p.x,p.y));c.stroke();c.restore();}
    const ice=game.effects.find(e=>e.kind==='stasis');for(const id of ice?.targets||[]){const b=game.bodies[id];c.strokeStyle='#d8f8ff';c.lineWidth=6;c.beginPath();c.arc(b.x,b.y,b.radius+3,0,Math.PI*2);c.stroke();}
    visual.render(c,game,ticks/120,controller.gentle?.()||false);
    for(const marker of powerMarkers(game)){const b=game.bodies[marker.target];c.strokeStyle=POWERS[marker.kind].color;c.lineWidth=5;c.beginPath();c.arc(b.x,b.y,b.radius+9,0,Math.PI*2);c.stroke();}
    for(const effect of game.effects){for(const b of effect.shards||[]){c.fillStyle='#e8ffea';c.beginPath();c.arc(b.x,b.y,b.radius||9,0,Math.PI*2);c.fill();}}
    for(const b of seedBodies(game).slice(1)){c.fillStyle='#cbb9ff';c.beginPath();c.arc(b.x,b.y,b.radius||10,0,Math.PI*2);c.fill();}
    for(const shot of game.effects.find(e=>e.kind==='blaster')?.shots||[]){c.fillStyle='#ffdfa0';c.beginPath();c.arc(shot.x,shot.y,5,0,Math.PI*2);c.fill();}
    c.fillStyle='#e7f4f1';c.font='22px system-ui';c.fillText(game.effects.filter(e=>e.seconds>0).map(e=>POWERS[e.kind].name+' '+e.seconds.toFixed(1)+'s').join(' · '),48,620);
    canvas.setAttribute('aria-label',`${side?'After':'Before'} preview: ${game.chain.length} unique contacts, ${game.banks} wall banks`);
  }
  function tick(now){if(!dialog.open)return;if(!document.hidden){accumulator+=last?Math.min(.05,(now-last)/1000):0;while(accumulator>=RULE.step&&ticks<1800&&studies.some(g=>g.isFlying)){studies.forEach((g,index)=>{if(!g.isFlying)return;const events=physicsStep(g);for(const e of events){if(index===Number(side))visual.event(e,g);if(e.type==='blaster-bank')measures[index].shotBanks=(measures[index].shotBanks||0)+1;if(e.type==='power'&&e.kind==='swap')measures[index].destination=e.destination;}measures[index]=studyMeasure(g,measures[index]);});visual.update(RULE.step);accumulator-=RULE.step;ticks++;}game=studies[Number(side)];draw();dialog.querySelector('.preview-evidence').textContent='Base: '+studyReading(id,measures[0])+' · Upgrade: '+studyReading(id,measures[1]);if(!studies.some(g=>g.isFlying)||ticks>=1800)dialog.querySelector('[role=status]').textContent='Study complete. Replay, switch views, or try it yourself.';}last=now;frame=requestAnimationFrame(tick);}
  function open(next){id=next;side=true;const example=BUILD_EXAMPLES.find(x=>x.id===id),node=cat.nodes[id]||cat.legacyNodes[id];dialog.innerHTML=`<div class="preview-heading"><h2>${example?.name||node.name}</h2>${button('close','Done','close')}</div><p>${example?.description||node.description}</p><div class="preview-switch" role="group" aria-label="Compare behavior">${button('before',example?'Base powers':node.kind==='base'?'Without power':'Base power','arrow-left')}${button('after',example?'Example upgrades':'With '+node.name,'epic')}</div><canvas width="960" height="640"></canvas><p role="status" aria-live="polite"></p><p class="preview-evidence" aria-label="Measured comparison"></p><div class="preview-actions">${button('replay','Replay shot','reset')}${button('try','Try it yourself','gamepad')}</div><small>Isolated practice · no Points spent or earned</small>`;dialog.showModal();reset();mark();frame=requestAnimationFrame(tick);}
  function mark(){dialog.querySelector('[data-preview=before]').setAttribute('aria-pressed',String(!side));dialog.querySelector('[data-preview=after]').setAttribute('aria-pressed',String(side));}
  dialog.onclick=e=>{const action=e.target.closest('[data-preview]')?.dataset.preview;if(action==='close')dialog.close();if(action==='before'||action==='after'){side=action==='after';game=studies[Number(side)];visual.clear();draw();mark();}if(action==='replay')reset();if(action==='try'){dialog.close();controller.practice(id);}};
  dialog.addEventListener('close',()=>{cancelAnimationFrame(frame);visual.clear();});
  return {open};
}
