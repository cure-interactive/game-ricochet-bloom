import { gameCreate, launch, physicsStep, powerMarkers, seedBodies, RULE, COLORS, POWERS } from './engine.js?v=484625264dc5bfa76ad46aa629ce94a11081c33309a67c50b27eb49df438cff8';
import { GAME_CATALOGUE as cat } from './run.js?v=d9759df78dc498217dd53b586f16048feafa7f17faf634eef9e660eb088ccee5';
import { POWER_TREES } from './power-tree.js?v=4929fc5eda5a5d405a8ac330c9b14b440804ab62150439a106e28084bb1f9f19';
import { PowerVisual } from './power-visual.js?v=837d7039642c8ca1aed9c0883dd76f8e5f60f1b082c2b52248712827a6675fdb';
import { iconHTML } from './ui-icon.js?v=6eefd3a5e72d754fea063666baf3166c1c88b5e72db4ab97072da15565143b81';

export const BUILD_EXAMPLES=Object.freeze([
  {id:'bank',name:'Bank & reply',powers:['comet','spring','echo'],nodes:['comet.foundation','spring.b','echo.a'],description:'Keep momentum, turn a rebound, then let Echo seek a missed jelly.'},
  {id:'current',name:'Gather & release',powers:['attract','vortex','ripple'],nodes:['attract.foundation','vortex.foundation','ripple.capstone'],description:'Gather bodies, circulate them, then send a returning pressure wave.'},
  {id:'cascade',name:'Contact cascade',powers:['blaster','split','relay'],nodes:['blaster.foundation','split.foundation','relay.foundation'],description:'Automatic shots, side seeds and physical relays share one contact chain.'}
]);
export function upgradeFixture(id,after=true,autoplay=true){
  const example=BUILD_EXAMPLES.find(x=>x.id===id),node=cat.nodes[id];
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
  return game;
}
export function upgradePreviewMount(controller){
  const dialog=document.createElement('dialog');dialog.id='upgrade-preview';dialog.setAttribute('aria-label','Upgrade comparison');document.body.append(dialog);
  let id,side=true,game,visual=new PowerVisual(),frame=0,last=0,accumulator=0,ticks=0;
  const button=(action,label,icon)=>`<button type="button" aria-label="${label}" data-preview="${action}">${iconHTML(icon)}<span>${label}</span></button>`;
  function reset(){game=upgradeFixture(id,side);visual.clear();ticks=0;accumulator=0;last=0;dialog.querySelector('[role=status]').textContent='Same pool. Same launch. Real physics.';draw();}
  function draw(){const canvas=dialog.querySelector('canvas'),c=canvas.getContext('2d');c.clearRect(0,0,960,640);c.fillStyle='#0c1929';c.fillRect(0,0,960,640);c.strokeStyle='#56767f';c.lineWidth=3;c.beginPath();c.roundRect(30,30,900,580,45);c.stroke();
    for(const b of game.bodies){c.save();c.fillStyle=b.id?COLORS[b.tone]:'#effff9';c.globalAlpha=b.id&&game.chain.includes(b.id)?.5:1;c.shadowColor=c.fillStyle;c.shadowBlur=controller.gentle?.()?0:18;c.beginPath();c.arc(b.x,b.y,b.radius,0,Math.PI*2);c.fill();c.restore();}
    visual.render(c,game,ticks/120,controller.gentle?.()||false);
    for(const marker of powerMarkers(game)){const b=game.bodies[marker.target];c.strokeStyle=POWERS[marker.kind].color;c.lineWidth=5;c.beginPath();c.arc(b.x,b.y,b.radius+9,0,Math.PI*2);c.stroke();}
    for(const effect of game.effects){for(const b of effect.shards||[]){c.fillStyle='#e8ffea';c.beginPath();c.arc(b.x,b.y,b.radius||9,0,Math.PI*2);c.fill();}}
    for(const b of seedBodies(game).slice(1)){c.fillStyle='#cbb9ff';c.beginPath();c.arc(b.x,b.y,b.radius||10,0,Math.PI*2);c.fill();}
    for(const shot of game.effects.find(e=>e.kind==='blaster')?.shots||[]){c.fillStyle='#ffdfa0';c.beginPath();c.arc(shot.x,shot.y,5,0,Math.PI*2);c.fill();}
    canvas.setAttribute('aria-label',`${side?'After':'Before'} preview: ${game.chain.length} unique contacts, ${game.banks} wall banks`);
  }
  function tick(now){if(!dialog.open)return;if(!document.hidden){accumulator+=last?Math.min(.05,(now-last)/1000):0;while(accumulator>=RULE.step&&ticks<1800&&game.isFlying){const events=physicsStep(game);for(const e of events){visual.event(e,game);if(e.type==='power')dialog.querySelector('[role=status]').textContent=POWER_TREES[e.kind].name+' activated on contact';if(e.type==='skill-wave'||e.type==='reunite')dialog.querySelector('[role=status]').textContent='Capstone response';}visual.update(RULE.step);accumulator-=RULE.step;ticks++;}draw();if(!game.isFlying||ticks>=1800)dialog.querySelector('[role=status]').textContent=`${game.chain.length} unique contacts · ${game.banks} banks. Replay or try it yourself.`;}last=now;frame=requestAnimationFrame(tick);}
  function open(next){id=next;side=true;const example=BUILD_EXAMPLES.find(x=>x.id===id),node=cat.nodes[id];dialog.innerHTML=`<div class="preview-heading"><h2>${example?.name||node.name}</h2>${button('close','Done','close')}</div><p>${example?.description||node.description}</p><div class="preview-switch" role="group" aria-label="Compare behavior">${button('before',example?'Base powers':node.kind==='base'?'Without power':'Base power','arrow-left')}${button('after',example?'Example upgrades':'With '+node.name,'epic')}</div><canvas width="960" height="640"></canvas><p role="status" aria-live="polite"></p><div class="preview-actions">${button('replay','Replay shot','reset')}${button('try','Try it yourself','gamepad')}</div><small>Isolated practice · no Seeds spent or earned</small>`;dialog.showModal();reset();mark();frame=requestAnimationFrame(tick);}
  function mark(){dialog.querySelector('[data-preview=before]').setAttribute('aria-pressed',String(!side));dialog.querySelector('[data-preview=after]').setAttribute('aria-pressed',String(side));}
  dialog.onclick=e=>{const action=e.target.closest('[data-preview]')?.dataset.preview;if(action==='close')dialog.close();if(action==='before'||action==='after'){side=action==='after';reset();mark();}if(action==='replay')reset();if(action==='try'){dialog.close();controller.practice(id);}};
  dialog.addEventListener('close',()=>{cancelAnimationFrame(frame);visual.clear();});
  return {open};
}
