import {skillNodeHTML,skillLegendHTML,showSkillCard} from './skill-card.js?v=fda96e2518ace5768814fb9057cfb36dd9dee195f00d794c32b43d5621be8822';
import {playerSkillStats} from './player-skill-comparison.js?v=c6fc3e9ec2d608168faa5cc4b704a13e457e92aa892aae3a7766d1520eab501c';
import {RARITIES} from './skill-trait.js?v=e149e64c177320afd3c752be9033b394aef97e73f55b5752d3400d5b2928eee9';
import {playerTreeGraph} from './player-tree.js?v=4425f75b6e85f8d3e680615a42b7c4f03592dfc057684fdc6e530ef5c2349296';
import {mapCameraMount,nearestMapNode} from './tree-map.js?v=f0eef94b88145f071c75d50ebf488d06a1e21bb049a894a7abe1abb1393368ea';
import {treeSwitchHTML,treeSwitchMount} from './tree-switch.js?v=8c82aad10559d5628d22c1c92a67ea540f32d3f5266ec61312711ecc99ce89db';
import {screenHeader} from './screen-header.js?v=b12f4a7f643a7ebc5d8945f2671aead3040da9be729bee110404af53f14e24e0';
import {buttonHTML,iconHTML} from './ui-icon.js?v=6065f2f855289781d664b0eef7a36edf88e6224fb7ef06fcec05e7e37df696b5';

const button=(action,label,icon='add',attrs={})=>buttonHTML(label,icon,{'aria-label':label,'data-tree-action':action,...attrs});
const rules='Every purchased upgrade stacks permanently. Open pools apply purchases between shots; Melody Journey applies them from the next pool. Score Attack fixes them at the start of a run. Fixed trials and shared challenges keep their authored rules.';

export function playerUpgradeMount(host){
 const dialog=document.createElement('dialog');dialog.id='player-upgrade-dialog';dialog.setAttribute('aria-label','Player Skills');
 dialog.innerHTML=screenHeader({className:'tree-heading',title:'Skills',back:button('back','Back','arrow-left'),actions:treeSwitchHTML('player')+'<div class="tree-wallet-summary"></div>'})+
  `<p class="tree-status sr-only" role="status" aria-live="polite"></p><div class="tree-workspace"><section class="tree-map-section" aria-label="Connected player tree"><div class="tree-map-stage">${skillLegendHTML('player-legend-content')}<div class="tree-map-scroll" tabindex="0" aria-label="Player skill map. Drag to pan; pinch or scroll to zoom. Arrow keys move between skills."><div class="tree-map"></div></div><div class="tree-camera-controls" aria-label="Map controls"><button type="button" data-tree-action="zoom-out" aria-label="Zoom out"><span aria-hidden="true">−</span></button><output class="tree-zoom" aria-label="Map zoom"></output>${button('zoom-in','Zoom in','add')}${button('fit','Fit tree','fullscreen-enable')}${button('focus','Focus','reset')}</div></div></section></div><footer class="tree-map-hint">Tap a skill for details · Drag to move · Pinch or scroll to zoom</footer><section id="player-skill-tooltip" class="skill-tooltip" role="dialog" aria-modal="false" aria-labelledby="player-skill-title" hidden></section>`;
 document.body.append(dialog);
 const surface=dialog.querySelector('.tree-map-scroll'),map=dialog.querySelector('.tree-map'),stage=dialog.querySelector('.tree-map-stage'),tip=dialog.querySelector('.skill-tooltip');
 const legend=dialog.querySelector('.tree-legend'),legendContent=dialog.querySelector('#player-legend-content');
 function setLegend(open){legend.setAttribute('aria-expanded',String(open));legendContent.hidden=!open;}
 let graph=playerTreeGraph(host.get(),host.showHiddenContent?.()),selected='player',tipId=null,lastView=null;
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
  hide();const state=host.get(),previous=graph.byId[selected];graph=playerTreeGraph(state,host.showHiddenContent?.());
  if(!graph.byId[selected])selected='player';Object.assign(world,{width:graph.width,height:graph.height});
  dialog.querySelector('.tree-wallet-summary').innerHTML=`<strong>${iconHTML('coin')}${state.profile.wallet.seeds}<span> Points</span></strong>`;
  dialog.querySelector('.tree-status').textContent=message;
  map.style.width=graph.width+'px';map.style.height=graph.height+'px';
  map.innerHTML=`<svg class="tree-world-links" viewBox="0 0 ${graph.width} ${graph.height}" aria-hidden="true">${graph.edges.map(e=>`<path data-from="${e.from}" data-to="${e.to}" class="${graph.byId[e.to].owned?'is-active':graph.byId[e.from].owned?'is-open':'is-locked'}" style="--rarity-color:${RARITIES[graph.byId[e.to].rarity].color}" d="${e.path}"/>`).join('')}</svg>`+
   graph.nodes.map(n=>skillNodeHTML(n,{attribute:'data-player-node',tooltipId:'player-skill-tooltip',selected:n.id===selected,active:n.owned,available:n.canBuy,cost:n.owned&&!host.showPurchasedCosts?.()?null:n.cost})).join('');selection();
  if(dialog.open){camera.refresh();const point=graph.byId[selected];if(point.x!==previous?.x||point.y!==previous?.y)camera.focus(point,camera.value.scale);}
 }
 function show(id,keyboard=false){
  if(tipId===id){hide(keyboard);return;}
  hide();selected=id;selection();camera.ensure(graph.byId[id]);
  const n=graph.byId[id],profile=host.get().profile,cost=n.owned&&!host.showPurchasedCosts?.()?null:n.cost;
  const info={name:n.name,type:n.type,description:id==='player'?rules:n.description,
   status:(n.owned?'Owned · Cumulative':n.reason||'Ready to unlock')+(cost===null?'':` · ${cost} Points`),
   stats:playerSkillStats(profile,id),unlock:n.cost!==null&&!n.owned?{cost:n.cost,enabled:n.canBuy,reason:n.canBuy?'':n.reason}:null};
  const source=map.querySelector(`[data-player-node="${id}"]`);
  showSkillCard({tip,source,stage,dialog,info,titleId:'player-skill-title'});tipId=id;
  if(keyboard)(tip.querySelector('.primary:not(:disabled)')||tip.querySelector('[data-tree-action=dismiss]')).focus();
 }
 treeSwitchMount(dialog,'player',()=>host.powers());
 dialog.addEventListener('click',event=>{
  const node=event.target.closest('[data-player-node]');if(node){show(node.dataset.playerNode,event.detail===0);return;}
  const action=event.target.closest('[data-tree-action]')?.dataset.treeAction;
  if(action==='back')host.back();else if(action==='dismiss')hide(true);else if(action==='legend'){hide();setLegend(legendContent.hidden);}
  else if(action==='fit')camera.fit();else if(action==='focus')camera.focus(graph.byId[selected],1);
  else if(action==='zoom-in'||action==='zoom-out')camera.zoom(action==='zoom-in'?1.25:.8);
  else if(action==='buy'){
   const id=tipId;if(!id)return;const current=playerTreeGraph(host.get(),host.showHiddenContent?.()).byId[id];if(!current?.canBuy){render(current?.reason);return;}
   const result=host.act({type:'buy-player',id});render(result.ok?result.message:result.reason);show(id);map.querySelector(`[data-player-node="${id}"]`)?.focus({preventScroll:true});
  }else if(!tip.contains(event.target))hide();
 });
 dialog.addEventListener('pointerdown',event=>{if(!tip.contains(event.target)&&!event.target.closest('[data-player-node]'))hide();});
 surface.addEventListener('focusin',event=>{const node=event.target.closest('[data-player-node]');if(node&&node.matches(':focus-visible'))camera.ensure(graph.byId[node.dataset.playerNode]);});
 dialog.addEventListener('keydown',event=>{
  if(event.key==='Escape'&&!legendContent.hidden){event.preventDefault();event.stopPropagation();setLegend(false);legend.focus({preventScroll:true});return;}
  if(event.key==='Escape'&&!tip.hidden){event.preventDefault();event.stopPropagation();hide(true);return;}
  const from=event.target.closest('[data-player-node]'),direction={ArrowLeft:[-1,0],ArrowRight:[1,0],ArrowUp:[0,-1],ArrowDown:[0,1]}[event.key];
  if(from&&direction){const next=nearestMapNode(graph.byId,from.dataset.playerNode,...direction);if(next){event.preventDefault();camera.ensure(graph.byId[next]);map.querySelector(`[data-player-node="${next}"]`).focus({preventScroll:true});}}
 });
 dialog.addEventListener('cancel',event=>{event.preventDefault();if(!legendContent.hidden)setLegend(false);else if(!tip.hidden)hide(true);else host.back();});
 dialog.addEventListener('close',()=>{hide();camera.cancel();});
 let viewport={width:window.innerWidth,height:window.innerHeight};
 window.addEventListener('resize',()=>{if(viewport.width!==window.innerWidth||viewport.height!==window.innerHeight)hide();viewport={width:window.innerWidth,height:window.innerHeight};});
 document.addEventListener('visibilitychange',()=>{if(document.hidden)hide();});
 return {open(){host.screen();document.querySelectorAll('dialog[open]').forEach(d=>d.close());setLegend(false);render();dialog.showModal();camera.focus(graph.byId[selected],.85,.12);dialog.querySelector('[data-tree-action=back]').focus({preventScroll:true});},refresh(){if(dialog.open)render();}};
}
