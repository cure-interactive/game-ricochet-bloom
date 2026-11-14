import {playerBuild,playerConfig} from './player-upgrade.js?v=fab6c92f134e88ebe641c4be9b87d9e46b857905b117a20831b164d5181c0c23';
import {playerTreeGraph} from './player-tree.js?v=5091a8e71f9c7639a54f3e9237981fd6463a342a2d9d040ac73af413d6988b63';
import {mapCameraMount,nearestMapNode} from './tree-map.js?v=f0eef94b88145f071c75d50ebf488d06a1e21bb049a894a7abe1abb1393368ea';
import {tooltipPosition} from './skill-comparison.js?v=87d6fb2611413eb5abde2f85f577864043f616471e7bdc4c903738053c451fae';
import {treeSwitchHTML,treeSwitchMount} from './tree-switch.js?v=46e11becd200614c3e4abd19bfaeb47b3863fe7a36fe0637a50f2a057bd33b3a';
import {screenHeader} from './screen-header.js?v=b12f4a7f643a7ebc5d8945f2671aead3040da9be729bee110404af53f14e24e0';
import {buttonHTML,iconHTML} from './ui-icon.js?v=6065f2f855289781d664b0eef7a36edf88e6224fb7ef06fcec05e7e37df696b5';
import {escapeHTML as escape} from './ui-text.js?v=02f24218cfade2c1cf218f107876f5365ad03a4287cebbb4b8e0817ce89eb0d0';

const button=(action,label,icon='add',attrs={})=>buttonHTML(label,icon,{'aria-label':label,'data-tree-action':action,...attrs});
const rules='Every purchased upgrade stacks permanently. Open pools apply purchases between shots; Melody Journey applies them from the next pool. Score Attack fixes them at the start of a run. Fixed trials and shared challenges keep their authored rules.';

export function playerUpgradeMount(host){
 const dialog=document.createElement('dialog');dialog.id='player-upgrade-dialog';dialog.setAttribute('aria-label','Player Skill Tree');
 dialog.innerHTML=screenHeader({className:'tree-heading',title:'Skill Tree',back:button('back','Back','arrow-left'),actions:treeSwitchHTML('player')+'<div class="tree-wallet-summary"></div>'})+
  `<p class="tree-status sr-only" role="status" aria-live="polite"></p><div class="tree-workspace"><section class="tree-map-section" aria-label="Connected player tree"><div class="tree-map-stage">${button('build','Your Build','player-skin',{class:'tree-legend'})}<div class="tree-map-scroll" tabindex="0" aria-label="Player skill map. Drag to pan; pinch or scroll to zoom. Arrow keys move between skills."><div class="tree-map"></div></div><div class="tree-camera-controls" aria-label="Map controls"><button type="button" data-tree-action="zoom-out" aria-label="Zoom out"><span aria-hidden="true">−</span></button><output class="tree-zoom" aria-label="Map zoom"></output>${button('zoom-in','Zoom in','add')}${button('fit','Fit tree','fullscreen-enable')}${button('focus','Focus','reset')}</div></div></section></div><footer class="tree-map-hint">Tap a skill for details · Drag to move · Pinch or scroll to zoom</footer><section class="skill-tooltip" role="dialog" aria-modal="false" aria-labelledby="player-skill-title" hidden></section>`;
 document.body.append(dialog);
 const surface=dialog.querySelector('.tree-map-scroll'),map=dialog.querySelector('.tree-map'),stage=dialog.querySelector('.tree-map-stage'),tip=dialog.querySelector('.skill-tooltip');
 let graph=playerTreeGraph(host.get()),selected='player',tipId=null,lastView=null;
 const world={width:graph.width,height:graph.height};
 function hide(restore=false){tip.hidden=true;tipId=null;map.querySelectorAll('[aria-expanded=true]').forEach(n=>n.setAttribute('aria-expanded','false'));if(restore)map.querySelector(`[data-player-node="${selected}"]`)?.focus({preventScroll:true});}
 const camera=mapCameraMount(surface,world,(view,limits)=>{
  if(lastView&&(view.x!==lastView.x||view.y!==lastView.y||view.scale!==lastView.scale))hide();lastView={...view};
  map.style.transform=`translate(${view.x}px,${view.y}px) scale(${view.scale})`;
  dialog.querySelector('.tree-zoom').textContent=Math.round(view.scale*100)+'%';
  dialog.querySelector('[data-tree-action=zoom-out]').disabled=view.scale<=limits.minScale+1e-6;
  dialog.querySelector('[data-tree-action=zoom-in]').disabled=view.scale>=1.799;
 });
 function selection(){
  const route=new Set(['player']);let n=graph.byId[selected];while(n){route.add(n.id);n=graph.byId[n.requires];}
  map.querySelectorAll('[data-player-node]').forEach(n=>{n.setAttribute('aria-pressed',String(n.dataset.playerNode===selected));n.classList.toggle('is-route',route.has(n.dataset.playerNode));});
  map.querySelectorAll('path').forEach(p=>p.classList.toggle('is-route',route.has(p.dataset.from)&&route.has(p.dataset.to)));
 }
 function render(message=''){
  hide();const state=host.get();graph=playerTreeGraph(state);
  dialog.querySelector('.tree-wallet-summary').innerHTML=`<strong>${iconHTML('coin')}${state.profile.wallet.seeds}<span> Points</span></strong>`;
  dialog.querySelector('.tree-status').textContent=message;
  map.style.width=graph.width+'px';map.style.height=graph.height+'px';
  map.innerHTML=`<svg class="tree-world-links" viewBox="0 0 ${graph.width} ${graph.height}" aria-hidden="true">${graph.edges.map(e=>`<path data-from="${e.from}" data-to="${e.to}" class="${graph.byId[e.to].owned?'is-active':graph.byId[e.from].owned?'is-open':'is-locked'}" style="--rarity-color:${graph.byId[e.to].color}" d="${e.path}"/>`).join('')}</svg>`+
   graph.nodes.map(n=>{const cost=n.owned&&!host.showPurchasedCosts?.()?null:n.cost;return `<button type="button" data-player-node="${n.id}" class="skill-node ${n.id==='player'?'is-base':''} ${n.owned?'is-owned is-active':n.canBuy?'is-available':'is-locked'}" style="--node-x:${n.x}px;--node-y:${n.y}px;--rarity-color:${n.color}" aria-label="${escape(n.name+', '+(n.owned?'Owned':n.reason||'Available')+(cost===null?'':', '+cost+' Points'))}" aria-pressed="false" aria-haspopup="dialog" aria-expanded="false"><span class="skill-orb">${iconHTML(n.icon)}<i class="skill-badge">${iconHTML(n.owned?'check':n.canBuy?'add':'lock')}</i></span><strong>${escape(n.name)}</strong>${n.id==='player'?'<small>Permanent Upgrades</small>':cost===null?'':`<small class="skill-node-cost">${iconHTML('coin')}<span>${n.cost} Points</span></small>`}</button>`;}).join('');selection();
 }
 function show(id,keyboard=false){
  if(tipId===id){hide(keyboard);return;}
  hide();selected=id;selection();camera.ensure(graph.byId[id]);
  const n=graph.byId[id],profile=host.get().profile,config=playerConfig(playerBuild(profile));
  const description=id==='player'?`<p>${rules}</p><dl class="player-build-stats"><dt>Extra Guide Length</dt><dd>+${config.guideExtra}</dd><dt>Maximum Launch Speed</dt><dd>${config.maxLaunch}</dd><dt>Wall Speed Retained</dt><dd>${Math.round(config.wallRetention*100)}%</dd></dl>`:`<p>${escape(n.description)}</p><p>${escape(n.owned?'Owned · Cumulative':n.reason||'Ready to unlock')}</p><p>${escape(n.requires?'Requires '+graph.byId[n.requires].name+'.':'Starts the '+n.branch+' branch.')} All branches can be researched.</p>`;
  tip.innerHTML=`<div class="skill-tooltip-heading"><span class="player-tree-icon" style="color:${n.color}">${iconHTML(n.icon)}</span><h3 id="player-skill-title">${escape(n.name)}</h3>${button('dismiss','Close','close',{'aria-label':'Close skill details'})}</div><div class="skill-tooltip-body">${description}</div>${n.cost!==null&&!n.owned?`<div class="skill-tooltip-action">${button('buy',`Unlock · ${n.cost} Points`,'coin',{class:'primary',disabled:!n.canBuy,'aria-label':`Unlock ${n.name} for ${n.cost} Points`})}</div>`:''}`;
  const source=map.querySelector(`[data-player-node="${id}"]`),bounds=stage.getBoundingClientRect();tip.style.maxHeight=Math.max(44,bounds.height-16)+'px';tip.style.maxWidth=Math.max(0,bounds.width-16)+'px';
  tip.hidden=false;tipId=id;source.setAttribute('aria-expanded','true');
  const size=tip.getBoundingClientRect(),position=tooltipPosition(source.getBoundingClientRect(),bounds,size.width,size.height),origin=dialog.getBoundingClientRect();tip.style.left=position.left-origin.left+'px';tip.style.top=position.top-origin.top+'px';
  if(keyboard)(tip.querySelector('.primary:not(:disabled)')||tip.querySelector('[data-tree-action=dismiss]')).focus();
 }
 treeSwitchMount(dialog,'player',()=>host.powers());
 dialog.addEventListener('click',event=>{
  const node=event.target.closest('[data-player-node]');if(node){show(node.dataset.playerNode,event.detail===0);return;}
  const action=event.target.closest('[data-tree-action]')?.dataset.treeAction;
  if(action==='back')host.back();else if(action==='dismiss')hide(true);else if(action==='build')show('player',event.detail===0);
  else if(action==='fit')camera.fit();else if(action==='focus')camera.focus(graph.byId[selected],1);
  else if(action==='zoom-in'||action==='zoom-out')camera.zoom(action==='zoom-in'?1.25:.8);
  else if(action==='buy'){
   const id=tipId;if(!id)return;const current=playerTreeGraph(host.get()).byId[id];if(!current?.canBuy){render(current?.reason);return;}
   const result=host.act({type:'buy-player',id});render(result.ok?result.message:result.reason);show(id);map.querySelector(`[data-player-node="${id}"]`)?.focus({preventScroll:true});
  }else if(!tip.contains(event.target))hide();
 });
 dialog.addEventListener('pointerdown',event=>{if(!tip.contains(event.target)&&!event.target.closest('[data-player-node]'))hide();});
 surface.addEventListener('focusin',event=>{const node=event.target.closest('[data-player-node]');if(node&&node.matches(':focus-visible'))camera.ensure(graph.byId[node.dataset.playerNode]);});
 dialog.addEventListener('keydown',event=>{
  if(event.key==='Escape'&&!tip.hidden){event.preventDefault();event.stopPropagation();hide(true);return;}
  const from=event.target.closest('[data-player-node]'),direction={ArrowLeft:[-1,0],ArrowRight:[1,0],ArrowUp:[0,-1],ArrowDown:[0,1]}[event.key];
  if(from&&direction){const next=nearestMapNode(graph.byId,from.dataset.playerNode,...direction);if(next){event.preventDefault();camera.ensure(graph.byId[next]);map.querySelector(`[data-player-node="${next}"]`).focus({preventScroll:true});}}
 });
 dialog.addEventListener('cancel',event=>{event.preventDefault();if(!tip.hidden)hide(true);else host.back();});
 dialog.addEventListener('close',()=>{hide();camera.cancel();});
 let viewport={width:window.innerWidth,height:window.innerHeight};
 window.addEventListener('resize',()=>{if(viewport.width!==window.innerWidth||viewport.height!==window.innerHeight)hide();viewport={width:window.innerWidth,height:window.innerHeight};});
 document.addEventListener('visibilitychange',()=>{if(document.hidden)hide();});
 return {open(){host.screen();document.querySelectorAll('dialog[open]').forEach(d=>d.close());render();dialog.showModal();camera.fit();if(camera.value.scale<.6)camera.focus(graph.byId[selected],.85,.3);dialog.querySelector('[data-tree-action=back]').focus({preventScroll:true});},refresh(){if(dialog.open)render();}};
}
