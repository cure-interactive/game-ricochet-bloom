import {skillNodeHTML,skillLegendHTML,skillLegendMount,showSkillCard} from './skill-card.js?v=48a1d6fe2d73d9508e5cff21001a8ddb760dc08da9cbe120766d0b45e4814f75';
export {skillStatsHTML} from './skill-card.js?v=48a1d6fe2d73d9508e5cff21001a8ddb760dc08da9cbe120766d0b45e4814f75';
import { treeSwitchHTML, treeSwitchMount } from './tree-switch.js?v=7d06939ac6210651713742f974d738a1c489bed6b65040e25fae17006bc35e88';
import { escapeHTML as escape } from './ui-text.js?v=02f24218cfade2c1cf218f107876f5365ad03a4287cebbb4b8e0817ce89eb0d0';
import { screenHeader } from './screen-header.js?v=f6cf1da8c75fd2c85c84ee337249ed26977448e1bf13375fe2c8e1a75a8d82af';
import { purchaseComparison, skillStats } from './skill-comparison.js?v=913831654905004e431ea0fc1b4c2b137744ea201101f6ede71db073098e85ac';
import { RARITIES } from './skill-trait.js?v=e149e64c177320afd3c752be9033b394aef97e73f55b5752d3400d5b2928eee9';
import { treeLayout, mapCameraMount, nearestMapNode, researchRoute, researchBounds, researchLayout } from './tree-map.js?v=f0eef94b88145f071c75d50ebf488d06a1e21bb049a894a7abe1abb1393368ea';
import { POWER_TREES } from './power-tree.js?v=23b163f47bcdbe9dbfbdcf62fe05b9aff2fb9d879e90084377e7c217105d2aca';
import { profilePurchase, profileSummary } from './profile.js?v=949a2b3900c5567be5390d6c1b0174be5fa8cc4c7a2aad535b856bd343160163';
import { progressionBudget, GAME_CATALOGUE as cat } from './run.js?v=761d66a7f48a89837bd270e75d2f2fc05b570ad32da442ce146863b3344310db';
import { buttonHTML, iconHTML } from './ui-icon.js?v=a45b8b7529e9829c50cbaee84ed71f02e69362d8a4b87c41723a1409fa839d8b';
const button=(action,label,icon='add',attributes={})=>buttonHTML(label,icon,{'aria-label':label,'data-tree-action':action,...attributes});
const reasonText={'family-gate':'Earn this power through successful play.','insufficient-seeds':'Earn Points in any game mode.','mastery':'Activate this power on 3 shots that hit at least 3 bubbles. Melody Journey clears also count.','prerequisite':'Unlock this power first.','over-budget':'Not enough tuning. Unequip an upgrade first.','invalid-equipment':'Add this power to your loadout first.'};

// Explain the same gate used by purchases, beside the affected power.
export function powerUnlock(state,power){
 const node=cat.nodes[power+'.base'];
 if(!node||state.profile.research[node.id])return null;
 const parent=node.requires.find(id=>!state.profile.research[id]);
 if(!parent)return null;
 const n=cat.nodes[parent],name=POWER_TREES[n.power].name+' · '+n.name;
 return {short:n.name,remaining:`Research ${name} first.`,description:`${POWER_TREES[power].name} branches from ${name}. Research that connected upgrade, then unlock this power with Points. Other branches remain available; purchases are permanent.`};
}

// Ownership, availability and equipment are separate facts, including on a fresh save.
export function upgradeState(state,id){
 const n=cat.nodes[id],owned=!!state.profile.research[id],borrowed=state.borrowed.includes(id),equipped=state.equipped.includes(id),buy=profilePurchase(state.profile,id,cat);
 let label,statusIcon='coin';
 if(equipped){label=borrowed?'Active · this run':'Active';statusIcon='check';}
 else if(owned){label=n.kind==='base'&&state.powers.includes(n.power)?'In random pool':'Owned';statusIcon='check';}
 else if(borrowed){label='Loan · not equipped';statusIcon='clock';}
 else if(buy.ok){label=`Available · ${n.seedCost} Points`;statusIcon='add';}
 else if(buy.reason==='insufficient-seeds'){label=`${n.seedCost} Points · need ${n.seedCost-state.profile.wallet.seeds} more`;}
 else {label=buy.reason==='mastery'?'Needs mastery':buy.reason==='prerequisite'?`Research ${cat.nodes[n.requires.find(id=>!state.profile.research[id])]?.name||POWER_TREES[n.power].name} first`:powerUnlock(state,n.power)?.remaining||'Play to unlock';statusIcon='lock';}
 const canUnlock=!owned&&state.powerMode!=='shared'&&buy.ok;
 return {owned,borrowed,equipped,buy,label,statusIcon,canUnlock,dimmed:!owned&&!canUnlock};
}
export function researchBlocker(state,id){
 const n=cat.nodes[id],v=upgradeState(state,id);
 if(!v.owned&&state.powerMode==='shared')return 'Unlock skills outside shared challenges.';
 if(state.powerMode==='unlocked'&&v.owned)return n.conflicts.length&&state.phase==='run'?'Finish this pool to change style.':'';
 if(v.owned&&n.kind==='base')return state.phase!=='shop'&&!state.powers.includes(n.power)?'Change powers after this run.':'';
 if(v.owned||v.borrowed&&state.powerMode!=='unlocked'){
  if(state.phase==='run')return 'Finish this pool to retune.';
  if(!state.powers.includes(n.power))return 'Add this power to your loadout to equip upgrades.';
  const used=state.equipped.filter(x=>!n.conflicts.includes(x)).reduce((sum,x)=>sum+cat.nodes[x].tuningCost,0),extra=used+n.tuningCost-progressionBudget(state);
  return !v.equipped&&!state.bypass&&extra>0?`Free ${extra} tuning by unequipping another upgrade.`:'';
 }
 return unlockBlocker(state,n,v);
}
function unlockBlocker(state,n,v){
 if(state.powerMode==='shared')return 'Unlock skills outside shared challenges.';
 const missing=[];
 if(!v.buy.ok)missing.push(v.buy.reason==='mastery'?`Earn ${Math.max(0,3-profileSummary(state.profile,cat).mastery[n.power])} more mastery uses: activate ${POWER_TREES[n.power].name} and hit at least 3 bubbles in a shot. Melody Journey clears also count.`:v.buy.reason==='insufficient-seeds'?`Need ${n.seedCost-state.profile.wallet.seeds} more Point${n.seedCost-state.profile.wallet.seeds===1?'':'s'}.`:(v.buy.reason==='family-gate'?powerUnlock(state,n.power)?.remaining:v.buy.reason==='prerequisite'?`Research ${cat.nodes[n.requires.find(id=>!state.profile.research[id])]?.name||POWER_TREES[n.power].name} first.`:reasonText[v.buy.reason])||v.buy.reason);
 return missing.join(' ');
}
// Every drawn upgrade edge comes from the same prerequisites as purchasing.
export function powerGraph(state,power){
 const nodes=Object.values(cat.nodes).filter(n=>n.power===power);
 return {nodes:nodes.map(n=>({...n,...upgradeState(state,n.id)})),edges:nodes.flatMap(n=>n.requires.map(from=>({from,to:n.id})))};
}
export function visibleResearch(state,showAll=false){
 return Object.values(cat.nodes).map(n=>({...n,...upgradeState(state,n.id)}))
   // The next research stays discoverable while saving Points or finishing a run.
   // Purchase eligibility still controls Buy; it must not erase the frontier.
   .filter(n=>showAll||n.owned||n.borrowed||state.powerMode!=='shared'&&(n.buy.ok||n.buy.reason==='insufficient-seeds'));
}
// Inspection is always available; purchase and activation remain separate actions.
export function skillCost(state,id,showPurchasedCosts=false){
 const n=cat.nodes[id];return n&&(!state.profile.research[id]||showPurchasedCosts)?n.seedCost:null;
}
export function skillInfo(state,id,showPurchasedCosts=false){
 const n=cat.nodes[id];if(!n)return null;
 const v=upgradeState(state,id),blocker=researchBlocker(state,id),cost=skillCost(state,id,showPurchasedCosts);
 return {name:n.name,type:n.type,description:n.description,cost,status:v.owned||v.borrowed?v.label+(cost===null?'':` · ${cost} Points`):`${cost} Points`,blocker,
   unlock:v.owned?null:{enabled:v.canUnlock,cost:n.seedCost,reason:v.canUnlock?'':unlockBlocker(state,n,v)},
   stats:skillStats(state,id),comparison:purchaseComparison(state,id),canEquip:state.powerMode==='unlocked'&&(v.owned||v.borrowed)&&n.conflicts.length>0&&!v.equipped&&!blocker&&state.phase!=='run'};
}
export function treeMount(controller){
 const dialog=document.getElementById('tree-dialog');
 let state=controller.get(),selected='ripple.base',tip=null,tipId=null,lastView=null;
 const fullLayout=treeLayout(POWER_TREES,cat.nodes),world={x:0,y:0,width:fullLayout.width,height:fullLayout.height};
 let layout=fullLayout,visiblePositions={};
 dialog.innerHTML=`${screenHeader({icon:'skill-tree',className:'tree-heading',title:'Skills',back:button('back','Back','arrow-left'),actions:treeSwitchHTML('powers')+'<div class="tree-wallet-summary"></div>'})}<p class="tree-status sr-only" role="status" aria-live="polite"></p><div class="tree-workspace"><section class="tree-map-section" aria-label="Connected power tree"><div class="tree-map-stage">${skillLegendHTML('tree-legend-content')}<div class="tree-map-scroll" tabindex="0" aria-label="Skills map. Drag to pan; pinch or scroll to zoom. Arrow keys move between skills."><div class="tree-map"></div></div><div class="tree-camera-controls" aria-label="Map controls"><button type="button" data-tree-action="zoom-out" aria-label="Zoom out"><span aria-hidden="true">−</span></button><output class="tree-zoom" aria-label="Map zoom">85%</output>${button('zoom-in','Zoom in','add')}${button('fit','Fit tree','fullscreen-enable')}${button('focus','Focus','reset')}</div></div></section></div><footer class="tree-map-hint">Drag to move · Pinch or scroll to zoom</footer><section id="skill-tooltip" class="skill-tooltip" role="dialog" aria-modal="false" aria-labelledby="skill-tooltip-title" hidden></section>`;
 treeSwitchMount(dialog,'powers',()=>controller.players?.());
 const surface=dialog.querySelector('.tree-map-scroll'),mapElement=dialog.querySelector('.tree-map'),stage=dialog.querySelector('.tree-map-stage');
 const {legend,legendContent,setLegend}=skillLegendMount(dialog);
 tip=dialog.querySelector('.skill-tooltip');
 const status=message=>{dialog.querySelector('.tree-status').textContent=message;};
 function hideTooltip(restore=false){
   const source=tipId&&mapElement.querySelector(`[data-node="${tipId}"]`);
   tip.hidden=true;tipId=null;source?.setAttribute('aria-expanded','false');
   if(restore)surface.focus({preventScroll:true});
 }
 const camera=mapCameraMount(surface,world,(view,limits)=>{
   if(lastView&&(view.x!==lastView.x||view.y!==lastView.y||view.scale!==lastView.scale))hideTooltip();lastView={...view};mapElement.style.transform=`translate(${view.x}px,${view.y}px) scale(${view.scale})`;
   dialog.querySelector('.tree-zoom').textContent=Math.round(view.scale*100)+'%';
   dialog.querySelector('[data-tree-action=zoom-out]').disabled=view.scale<=limits.minScale+1e-6;
   dialog.querySelector('[data-tree-action=zoom-in]').disabled=view.scale>=1.799;
 });
 function selectionRender(){
   const route=researchRoute(cat.nodes,selected);
   for(const node of mapElement.querySelectorAll('.skill-node')){node.classList.toggle('is-route',route.has(node.dataset.node));node.setAttribute('aria-pressed',String(node.dataset.node===selected));}
   for(const path of mapElement.querySelectorAll('.tree-world-links path'))path.classList.toggle('is-route',route.has(path.dataset.from)&&route.has(path.dataset.to));
 }
 function nodeButton(n){
   const base=n.kind==='base',active=n.equipped||base&&state.powers.includes(n.power),available=n.canUnlock;
   const cost=skillCost(state,n.id,controller.showPurchasedCosts?.());
   return skillNodeHTML(n,{position:layout.nodes[n.id],selected:selected===n.id,active,available,cost});
 }
 function render(){
   hideTooltip();
   dialog.querySelector('.tree-wallet-summary').innerHTML=`<strong>${iconHTML('coin')}${state.profile.wallet.seeds}<span> Points</span></strong>`;
   const showAll=controller.showHiddenContent?.(),nodes=visibleResearch(state,showAll),byId=Object.fromEntries(nodes.map(n=>[n.id,n])),previous=layout.nodes[selected];
   layout=showAll?fullLayout:researchLayout(POWER_TREES,nodes);
   visiblePositions=Object.fromEntries(nodes.map(n=>[n.id,layout.nodes[n.id]]));
   if(!byId[selected])selected=byId[layout.root]?layout.root:(nodes[0]?.id||layout.root);
   Object.assign(world,researchBounds(visiblePositions));
   const edges=layout.edges.filter(e=>byId[e.from]&&byId[e.to]).map(e=>`<path class="${byId[e.to].owned?'is-active':byId[e.from].owned?'is-open':'is-locked'}" style="--rarity-color:${RARITIES[byId[e.to].rarity].color}" data-from="${e.from}" data-to="${e.to}" d="${e.path}"/>`).join('');
   mapElement.style.width=layout.width+'px';mapElement.style.height=layout.height+'px';
   mapElement.innerHTML=`<svg class="tree-world-links" viewBox="0 0 ${layout.width} ${layout.height}" aria-hidden="true">${edges}</svg>`+Object.keys(POWER_TREES).filter(power=>nodes.some(n=>n.power===power)).map(power=>`<section class="skill-power" data-power-tree="${power}" aria-label="${POWER_TREES[power].name} skills">${nodes.filter(n=>n.power===power).map(nodeButton).join('')}</section>`).join('');
   selectionRender();if(dialog.open){camera.refresh();const point=layout.nodes[selected];if(point&&(point.x!==previous?.x||point.y!==previous?.y))camera.focus(point,camera.value.scale);}
 }
 function showTooltip(id){
   const info=skillInfo(state,id,controller.showPurchasedCosts?.());
   if(!info||!visiblePositions[id]){hideTooltip();return;}
   if(tipId===id&&!tip.hidden)return;
   hideTooltip();selected=id;selectionRender();
   const source=mapElement.querySelector(`[data-node="${id}"]`);
   showSkillCard({tip,source,stage,dialog,info,titleId:'skill-tooltip-title'});tipId=id;
 }
 function selectNode(id,keyboard=false){
   if(!visiblePositions[id])return;
   if(tipId===id){hideTooltip(keyboard);return;}
   selected=id;selectionRender();camera.ensure(layout.nodes[id]);
   showTooltip(id);if(keyboard)(tip.querySelector('.primary:not(:disabled)')||tip.querySelector('[data-tree-action=dismiss]')).focus();
 }
 function handle(event){
   const action=event.target.closest('[data-tree-action]')?.dataset.treeAction,node=event.target.closest('.skill-node');
   if(node){selectNode(node.dataset.node,event.detail===0);return;}
   if(action==='legend'){hideTooltip();setLegend(legendContent.hidden);return;}
   if(action==='dismiss'){hideTooltip(true);return;}
   if(action==='equip'){
     const id=tipId;if(!id||!skillInfo(controller.get(),id)?.canEquip)return;
     const result=controller.act({type:'equip',id});state=controller.get();render();status(result.ok?result.message:result.reason);surface.focus({preventScroll:true});return;
   }
   if(action==='buy'){
     const id=tipId;if(!id||!upgradeState(controller.get(),id).canUnlock){state=controller.get();render();return;}
     const result=controller.act({type:'buy',id});state=controller.get();render();status(result.ok?'Unlocked '+cat.nodes[id].name:result.reason);surface.focus({preventScroll:true});return;
   }
   if(action==='back'){controller.back?.();return;}
   if(action==='zoom-in'||action==='zoom-out'){camera.zoom(action==='zoom-in'?1.25:.8);return;}
   if(action==='fit'){camera.fit();return;}if(action==='focus'){camera.focus(layout.nodes[selected],1);return;}
   if(!tip.contains(event.target))hideTooltip();
 }
 dialog.addEventListener('pointerdown',event=>{if(!tip.contains(event.target)&&!event.target.closest('.skill-node'))hideTooltip();});
 surface.addEventListener('focusin',event=>{const node=event.target.closest('.skill-node');if(node&&node.matches(':focus-visible')){camera.ensure(layout.nodes[node.dataset.node]);}});
 dialog.addEventListener('keydown',event=>{
   if(event.key==='Escape'&&!legendContent.hidden){event.preventDefault();event.stopPropagation();setLegend(false);legend.focus({preventScroll:true});return;}
   if(event.key==='Escape'&&!tip.hidden){event.preventDefault();event.stopPropagation();hideTooltip(true);return;}
   const from=event.target.closest('.skill-node'),direction={ArrowLeft:[-1,0],ArrowRight:[1,0],ArrowUp:[0,-1],ArrowDown:[0,1]}[event.key];
   if(!from||!direction)return;const next=nearestMapNode(visiblePositions,from.dataset.node,...direction);if(next){event.preventDefault();camera.ensure(layout.nodes[next]);mapElement.querySelector(`[data-node="${next}"]`).focus({preventScroll:true});}
 });
 dialog.addEventListener('click',handle);
 dialog.addEventListener('cancel',event=>{event.preventDefault();if(!legendContent.hidden)setLegend(false);else if(!tip.hidden)hideTooltip(true);else controller.back?.();});
 dialog.addEventListener('close',()=>{hideTooltip();camera.cancel();});
 let viewport={width:window.innerWidth,height:window.innerHeight};
 window.addEventListener('resize',()=>{if(viewport.width!==window.innerWidth||viewport.height!==window.innerHeight)hideTooltip();viewport={width:window.innerWidth,height:window.innerHeight};});
 document.addEventListener('visibilitychange',()=>{if(document.hidden)hideTooltip();});
 function open(focusSkill){
   if(cat.nodes[focusSkill])selected=focusSkill;controller.screen?.();document.querySelectorAll('dialog[open]').forEach(d=>d.close());
   state=controller.get();status('');setLegend(false);render();dialog.showModal();camera.focus(layout.nodes[selected]||{x:100,y:90},.85,.12);dialog.querySelector('[data-tree-action=back]').focus({preventScroll:true});
 }
 render();if(new URL(location.href).searchParams.get('view')==='tree')open();return {open,refresh(){state=controller.get();render();}};
}
