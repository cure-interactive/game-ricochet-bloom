import { purchaseComparison, skillStats, tooltipPosition } from './skill-comparison.js?v=28fa8fb39fbfd2a9b1581a843025c5126fb3ce3f19e0e2b6bd2f98b49eea71a9';
import { RARITIES } from './skill-trait.js?v=bef2df62b29364983801345d0a0318164dfeef5666360b3ce1e2a200ac7acdc0';
import { skillIconHTML, rarityIconHTML } from './skill-icon.js?v=d52c5d94038e35ce5d7e7c1777c85eb886779d384f3e5d743fc8935e0649f609';
import { treeLayout, mapCameraMount, nearestMapNode, researchRoute } from './tree-map.js?v=57bec65f45600467b111e9a29bec5acd56889eb8ce270255b67f267386a92efe';
import { POWER_TREES } from './power-tree.js?v=c9a5802f7ef4e448c825a7917910994fd4d5dc8753c92d94db7b9abffaa78827';
import { profilePurchase, profileSummary } from './profile.js?v=f884844be31760a0e8fa2f140e6b67a8238f29681b4d6e77a401fc7596d2d0e8';
import { progressionBudget, GAME_CATALOGUE as cat } from './run.js?v=6a19c662694ec547e86de13f3dce16b78524a1f4c32b95ee0a901850675bb8e3';
import { iconHTML } from './ui-icon.js?v=6eefd3a5e72d754fea063666baf3166c1c88b5e72db4ab97072da15565143b81';

const escape = text => String(text).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const button=(action,label,icon='add',extra='')=>`<button type="button" aria-label="${escape(label)}" data-tree-action="${action}" ${extra}>${iconHTML(icon)}<span>${label}</span></button>`;
const reasonText={'family-gate':'Earn this power through successful play.','insufficient-seeds':'Earn more Points by clearing pools.','mastery':'Clear 3 pools with this power activated.','prerequisite':'Unlock this power first.','over-budget':'Not enough tuning. Unequip an upgrade first.','invalid-equipment':'Add this power to your loadout first.'};

function statVisual(row,value,previous=false){
 const fill=row.kind==='count'?Array.from({length:row.max},(_,i)=>`<i class="${i<value?'filled':''}"></i>`).join(''):`<i style="width:${value/row.max*100}%"></i>`;
 const bar=`<span class="skill-stat-${row.kind} ${previous?'is-before':'is-after'}" aria-hidden="true">${fill}</span>`;
 if(row.kind!=='bar')return bar;
 const partial=value<row.max,formatted=String(previous?row.before:row.after),maximum=String(row.after).replace(/^[\d.]+/,String(row.max));
 return `${previous?'':'<span class="sr-only">Maximum: '+escape(maximum)+'</span>'}<span class="skill-stat-meter ${previous?'is-before':'is-after'}" aria-hidden="true"><span class="skill-stat-labels ${partial&&value/row.max>.75?'is-tight':''}" style="--fill:${value/row.max*100}%;--value-width:${formatted.length+.5}ch">${partial?`<span class="skill-stat-endpoint">${escape(formatted)}</span>`:''}<span class="skill-stat-max">Max ${escape(maximum)}</span></span>${bar}</span>`;
}
export function skillStatsHTML(stats){
 return `<section class="skill-stats" aria-label="${escape(stats.heading)}"><h4>${escape(stats.heading)}</h4>${stats.compare?`<p class="skill-stat-key"><span>${escape(stats.beforeLabel)}</span><span aria-hidden="true">→</span><span>${escape(stats.afterLabel)}</span></p>`:''}<dl>${stats.rows.map(row=>`<div class="skill-stat ${row.changed?'is-changed':''}"><dt>${escape(row.label)}</dt><dd>${row.changed?`<span class="skill-stat-before">${escape(row.before)}</span><span aria-hidden="true"> → </span><span class="sr-only"> to </span>`:''}<strong>${escape(row.after)}</strong></dd><dd class="skill-stat-description">${escape(row.description)}</dd>${row.kind!=='text'?`<dd class="skill-stat-visual">${row.changed?statVisual(row,row.previous,true):''}${statVisual(row,row.value)}</dd>`:''}</div>`).join('')}</dl>${stats.rows.some(r=>r.kind==='bar')?'<p class="skill-stat-note">Bar scale: this power’s upgrade range.</p>':''}</section>`;
}

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
 let label,icon='coin';
 if(equipped){label=borrowed?'Active · this run':'Active';icon='check';}
 else if(owned){label=n.kind==='base'&&state.powers.includes(n.power)?'In random pool':'Owned';icon='check';}
 else if(borrowed){label='Loan · not equipped';icon='clock';}
 else if(buy.ok){label=`Available · ${n.seedCost} Points`;icon='add';}
 else if(buy.reason==='insufficient-seeds'){label=`${n.seedCost} Points · need ${n.seedCost-state.profile.wallet.seeds} more`;}
 else {label=buy.reason==='mastery'?'Needs mastery':buy.reason==='prerequisite'?`Research ${cat.nodes[n.requires.find(id=>!state.profile.research[id])]?.name||POWER_TREES[n.power].name} first`:powerUnlock(state,n.power)?.remaining||'Play to unlock';icon='lock';}
 return {owned,borrowed,equipped,buy,label,icon};
}
export function researchBlocker(state,id){
 const n=cat.nodes[id],v=upgradeState(state,id);
 if(state.powerMode==='unlocked'&&v.owned)return n.conflicts.length&&state.phase==='run'?'Finish this pool to change style.':'';
 if(v.owned&&n.kind==='base')return state.phase!=='shop'&&!state.powers.includes(n.power)?'Change powers after this run.':'';
 if(v.owned||v.borrowed&&state.powerMode!=='unlocked'){
  if(state.phase==='run')return 'Finish this pool to retune.';
  if(!state.powers.includes(n.power))return 'Add this power to your loadout to equip upgrades.';
  const used=state.equipped.filter(x=>!n.conflicts.includes(x)).reduce((sum,x)=>sum+cat.nodes[x].tuningCost,0),extra=used+n.tuningCost-progressionBudget(state);
  return !v.equipped&&!state.bypass&&extra>0?`Free ${extra} tuning by unequipping another upgrade.`:'';
 }
 const missing=[];
 if(state.phase!=='shop')missing.push('Research opens after this run.');
 if(!v.buy.ok)missing.push(v.buy.reason==='mastery'?`Clear ${Math.max(0,3-profileSummary(state.profile,cat).mastery[n.power])} more pools with ${POWER_TREES[n.power].name} activated.`:v.buy.reason==='insufficient-seeds'?`Need ${n.seedCost-state.profile.wallet.seeds} more Points.`:(v.buy.reason==='family-gate'?powerUnlock(state,n.power)?.remaining:v.buy.reason==='prerequisite'?`Research ${cat.nodes[n.requires.find(id=>!state.profile.research[id])]?.name||POWER_TREES[n.power].name} first.`:reasonText[v.buy.reason])||v.buy.reason);
 return missing.join(' ');
}
// Every drawn upgrade edge comes from the same prerequisites as purchasing.
export function powerGraph(state,power){
 const nodes=Object.values(cat.nodes).filter(n=>n.power===power);
 return {nodes:nodes.map(n=>({...n,...upgradeState(state,n.id)})),edges:nodes.flatMap(n=>n.requires.map(from=>({from,to:n.id})))};
}
// Inspection is always available; purchase and activation remain separate actions.
export function skillInfo(state,id){
 const n=cat.nodes[id];if(!n)return null;
 const v=upgradeState(state,id),blocker=researchBlocker(state,id);
 return {name:n.name,description:n.description,status:v.owned||v.borrowed?v.label:`${n.seedCost} Points`,blocker,
   stats:skillStats(state,id),comparison:purchaseComparison(state,id),canEquip:state.powerMode==='unlocked'&&(v.owned||v.borrowed)&&n.conflicts.length>0&&!v.equipped&&!blocker&&state.phase!=='run'};
}
export function treeMount(controller){
 const dialog=document.getElementById('tree-dialog');
 let state=controller.get(),selected='ripple.base',tip=null,tipId=null,leaveTimer=0,pinned=false,lastView=null;
 const layout=treeLayout(POWER_TREES,cat.nodes);
 dialog.innerHTML=`<header class="tree-heading">${button('back','Back','arrow-left')}<h2>Skill Tree</h2><div class="tree-wallet-summary"></div></header><p class="tree-status sr-only" role="status" aria-live="polite"></p><div class="tree-workspace"><section class="tree-map-section" aria-label="Connected power tree"><div class="tree-map-stage"><div class="tree-map-scroll" tabindex="0" aria-label="Skill Tree map. Drag to pan; pinch or scroll to zoom. Arrow keys move between skills."><div class="tree-map"></div></div><div class="tree-camera-controls" aria-label="Map controls"><button type="button" data-tree-action="zoom-out" aria-label="Zoom out"><span aria-hidden="true">−</span></button><output class="tree-zoom" aria-label="Map zoom">85%</output>${button('zoom-in','Zoom in','add')}${button('fit','Fit tree','fullscreen-enable')}${button('focus','Focus','reset')}</div><span class="tree-map-hint">Drag to move · Pinch or scroll to zoom</span></div></section></div><footer class="tree-legend" aria-label="Skill rarity and status"><div class="rarity-legend">${Object.entries(RARITIES).map(([id,r])=>`<div class="rarity-key">${rarityIconHTML(id)}${r.name}</div>`).join('')}</div><div class="status-legend"><span class="legend-active">Active</span><span class="legend-owned">Owned</span><span class="legend-available">Available</span><span class="legend-locked">Locked</span></div></footer><section id="skill-tooltip" class="skill-tooltip" role="dialog" aria-modal="false" aria-labelledby="skill-tooltip-title" hidden></section>`;
 const surface=dialog.querySelector('.tree-map-scroll'),mapElement=dialog.querySelector('.tree-map'),stage=dialog.querySelector('.tree-map-stage');
 tip=dialog.querySelector('.skill-tooltip');
 const status=message=>{dialog.querySelector('.tree-status').textContent=message;};
 function hideTooltip(restore=false){
   clearTimeout(leaveTimer);const source=tipId&&mapElement.querySelector(`[data-node="${tipId}"]`);
   tip.hidden=true;tipId=null;pinned=false;source?.setAttribute('aria-expanded','false');
   if(restore)surface.focus({preventScroll:true});
 }
 const camera=mapCameraMount(surface,layout,view=>{
   if(lastView&&(view.x!==lastView.x||view.y!==lastView.y||view.scale!==lastView.scale))hideTooltip();lastView={...view};mapElement.style.transform=`translate(${view.x}px,${view.y}px) scale(${view.scale})`;
   dialog.querySelector('.tree-zoom').textContent=Math.round(view.scale*100)+'%';
   dialog.querySelector('[data-tree-action=zoom-out]').disabled=view.scale<=.051;
   dialog.querySelector('[data-tree-action=zoom-in]').disabled=view.scale>=1.799;
 });
 function selectionRender(){
   const route=researchRoute(cat.nodes,selected);
   for(const node of mapElement.querySelectorAll('.skill-node')){node.classList.toggle('is-route',route.has(node.dataset.node));node.setAttribute('aria-pressed',String(node.dataset.node===selected));}
   for(const path of mapElement.querySelectorAll('.tree-world-links path'))path.classList.toggle('is-route',route.has(path.dataset.from)&&route.has(path.dataset.to));
 }
 function nodeButton(n){
   const base=n.kind==='base',active=n.equipped||base&&state.powers.includes(n.power),available=state.phase==='shop'&&!n.owned&&n.buy.ok,locked=!n.owned&&!n.borrowed&&!available;
   const badge=n.borrowed?'clock':active||n.owned?'check':locked?'lock':null;
   const label=active?'Active':n.owned?'Owned':available?'Available to Purchase':n.borrowed?'Borrowed':'Locked';
   return `<button type="button" data-node="${n.id}" data-kind="${n.kind}" data-rarity="${n.rarity}" class="skill-node ${base?'is-base':''} ${n.kind==='capstone'?'is-capstone':''} ${n.owned?'is-owned':''} ${active?'is-active':''} ${available?'is-available':''} ${locked?'is-locked':''} ${n.borrowed?'is-borrowed':''}" style="--rarity-color:${RARITIES[n.rarity].color};--node-x:${layout.nodes[n.id].x}px;--node-y:${layout.nodes[n.id].y}px" aria-label="${escape(n.name+', '+label+', Cost: '+n.seedCost+' Points')}" aria-pressed="${selected===n.id}" aria-haspopup="dialog" aria-controls="skill-tooltip" aria-expanded="false"><span class="skill-orb">${skillIconHTML(n)}<span class="skill-rarity" aria-hidden="true">${rarityIconHTML(n.rarity)}</span>${badge?'<i class="skill-badge">'+iconHTML(badge)+'</i>':''}</span><strong>${escape(n.name)}</strong><small class="skill-node-cost">${iconHTML('coin')}<span>${n.seedCost} Points</span></small></button>`;
 }
 function render(){
   hideTooltip();
   dialog.querySelector('.tree-wallet-summary').innerHTML=`<strong>${iconHTML('coin')}${state.profile.wallet.seeds}<span> Points</span></strong>`;
   const nodes=Object.keys(POWER_TREES).flatMap(p=>powerGraph(state,p).nodes),byId=Object.fromEntries(nodes.map(n=>[n.id,n]));
   const edges=layout.edges.map(e=>`<path class="${byId[e.to].owned?'is-active':byId[e.from].owned?'is-open':'is-locked'}" style="--rarity-color:${RARITIES[byId[e.to].rarity].color}" data-from="${e.from}" data-to="${e.to}" d="${e.path}"/>`).join('');
   mapElement.style.width=layout.width+'px';mapElement.style.height=layout.height+'px';
   mapElement.innerHTML=`<svg class="tree-world-links" viewBox="0 0 ${layout.width} ${layout.height}" aria-hidden="true">${edges}</svg>`+Object.keys(POWER_TREES).map(power=>`<section class="skill-power" data-power-tree="${power}" aria-label="${POWER_TREES[power].name} skills">${nodes.filter(n=>n.power===power).map(nodeButton).join('')}</section>`).join('');
   selectionRender();
 }
 function showTooltip(id){
   clearTimeout(leaveTimer);const info=skillInfo(state,id),comparison=info?.comparison;
   if(!info){hideTooltip();return;}
   if(tipId===id&&!tip.hidden)return;
   hideTooltip();selected=id;selectionRender();
   const source=mapElement.querySelector(`[data-node="${id}"]`),bounds=stage.getBoundingClientRect();
   tip.style.maxHeight=Math.max(44,bounds.height-16)+'px';tip.style.width=Math.min(330,bounds.width-16)+'px';
   tip.innerHTML=`<div class="skill-tooltip-heading"><h3 id="skill-tooltip-title">${escape(info.name)}</h3>${button('dismiss','Close','close')}</div><p>${escape(info.description)}</p>${info.stats?skillStatsHTML(info.stats):''}<p>${escape(info.status)}${info.blocker?'<br>'+escape(info.blocker):''}</p>${comparison?button('buy',`Buy · ${comparison.cost} Points`,'coin','class="primary"'):info.canEquip?button('equip','Use This Style','check','class="primary"'):''}`;
   tip.hidden=false;tipId=id;source.setAttribute('aria-expanded','true');
   const size=tip.getBoundingClientRect(),position=tooltipPosition(source.getBoundingClientRect(),bounds,size.width,size.height),origin=dialog.getBoundingClientRect();
   tip.style.left=position.left-origin.left+'px';tip.style.top=position.top-origin.top+'px';
 }
 function selectNode(id,keyboard=false){
   if(!cat.nodes[id])return;
   if(tipId===id){if(pinned&&!keyboard)hideTooltip();else{pinned=true;if(keyboard)(tip.querySelector('.primary')||tip.querySelector('[data-tree-action=dismiss]')).focus();}return;}
   selected=id;selectionRender();camera.ensure(layout.nodes[id]);
   showTooltip(id);pinned=true;if(keyboard)(tip.querySelector('.primary')||tip.querySelector('[data-tree-action=dismiss]')).focus();
 }
 function handle(event){
   const action=event.target.closest('[data-tree-action]')?.dataset.treeAction,node=event.target.closest('.skill-node');
   if(node){selectNode(node.dataset.node,event.detail===0);return;}
   if(action==='dismiss'){hideTooltip(true);return;}
   if(action==='equip'){
     const id=tipId;if(!id||!skillInfo(controller.get(),id)?.canEquip)return;
     const result=controller.act({type:'equip',id});state=controller.get();render();status(result.ok?result.message:result.reason);surface.focus({preventScroll:true});return;
   }
   if(action==='buy'){
     const id=tipId;if(!id||!purchaseComparison(controller.get(),id)){state=controller.get();render();return;}
     const result=controller.act({type:'buy',id});state=controller.get();render();status(result.ok?'Purchased '+cat.nodes[id].name:result.reason);surface.focus({preventScroll:true});return;
   }
   if(action==='back'){controller.back?.();return;}
   if(action==='zoom-in'||action==='zoom-out'){camera.zoom(action==='zoom-in'?1.25:.8);return;}
   if(action==='fit'){camera.fit();return;}if(action==='focus'){camera.focus(layout.nodes[selected],1);return;}
   if(!tip.contains(event.target))hideTooltip();
 }
 surface.addEventListener('pointerover',event=>{if(event.pointerType==='mouse'&&!event.buttons){const node=event.target.closest('.skill-node');if(node)showTooltip(node.dataset.node);}});
 surface.addEventListener('pointerout',event=>{if(event.pointerType==='mouse'&&event.target.closest('.skill-node')&&!event.target.closest('.skill-node').contains(event.relatedTarget)){clearTimeout(leaveTimer);if(!pinned)leaveTimer=setTimeout(()=>hideTooltip(),250);}});
 tip.addEventListener('pointerenter',()=>clearTimeout(leaveTimer));
 tip.addEventListener('pointerleave',event=>{if(event.pointerType==='mouse'){clearTimeout(leaveTimer);if(!pinned)leaveTimer=setTimeout(()=>hideTooltip(),250);}});
 dialog.addEventListener('pointerdown',event=>{if(!tip.contains(event.target)&&!event.target.closest('.skill-node'))hideTooltip();});
 surface.addEventListener('focusin',event=>{const node=event.target.closest('.skill-node');if(node&&node.matches(':focus-visible')){camera.ensure(layout.nodes[node.dataset.node]);showTooltip(node.dataset.node);}});
 dialog.addEventListener('keydown',event=>{
   if(event.key==='Escape'&&!tip.hidden){event.preventDefault();event.stopPropagation();hideTooltip(true);return;}
   const from=event.target.closest('.skill-node'),direction={ArrowLeft:[-1,0],ArrowRight:[1,0],ArrowUp:[0,-1],ArrowDown:[0,1]}[event.key];
   if(!from||!direction)return;const next=nearestMapNode(layout.nodes,from.dataset.node,...direction);if(next){event.preventDefault();camera.ensure(layout.nodes[next]);mapElement.querySelector(`[data-node="${next}"]`).focus({preventScroll:true});}
 });
 dialog.addEventListener('click',handle);
 dialog.addEventListener('cancel',event=>{event.preventDefault();if(!tip.hidden)hideTooltip(true);else controller.back?.();});
 dialog.addEventListener('close',()=>{hideTooltip();camera.cancel();});
 let viewport={width:window.innerWidth,height:window.innerHeight};
 window.addEventListener('resize',()=>{if(viewport.width!==window.innerWidth||viewport.height!==window.innerHeight)hideTooltip();viewport={width:window.innerWidth,height:window.innerHeight};});
 document.addEventListener('visibilitychange',()=>{if(document.hidden)hideTooltip();});
 function open(focusSkill){
   if(cat.nodes[focusSkill])selected=focusSkill;controller.screen?.();document.querySelectorAll('dialog[open]').forEach(d=>d.close());
   state=controller.get();status('');render();dialog.showModal();camera.focus(layout.nodes[selected],.85,.12);dialog.querySelector('[data-tree-action=back]').focus({preventScroll:true});
 }
 render();if(new URL(location.href).searchParams.get('view')==='tree')open();return {open,refresh(){state=controller.get();render();}};
}
