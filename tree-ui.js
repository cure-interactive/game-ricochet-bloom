import { purchaseComparison, skillStats, tooltipPosition } from './skill-comparison.js?v=a7ec07ca23b26147c82a7c9dd5df52af3cd639d7920282181a5c2dcf304a9a54';
import { RARITIES } from './skill-trait.js?v=bef2df62b29364983801345d0a0318164dfeef5666360b3ce1e2a200ac7acdc0';
import { skillIconHTML, rarityIconHTML, typeIconHTML } from './skill-icon.js?v=d52c5d94038e35ce5d7e7c1777c85eb886779d384f3e5d743fc8935e0649f609';
import { treeLayout, mapCameraMount, nearestMapNode, researchRoute, researchBounds, researchLayout } from './tree-map.js?v=aa36f7778dc8f543f5f7070d53f59cde96077b8e3c559787c882e97daea12a2f';
import { POWER_TREES } from './power-tree.js?v=c9a5802f7ef4e448c825a7917910994fd4d5dc8753c92d94db7b9abffaa78827';
import { profilePurchase, profileSummary } from './profile.js?v=f884844be31760a0e8fa2f140e6b67a8238f29681b4d6e77a401fc7596d2d0e8';
import { progressionBudget, GAME_CATALOGUE as cat } from './run.js?v=6a19c662694ec547e86de13f3dce16b78524a1f4c32b95ee0a901850675bb8e3';
import { iconHTML } from './ui-icon.js?v=6eefd3a5e72d754fea063666baf3166c1c88b5e72db4ab97072da15565143b81';

const escape = text => String(text).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const button=(action,label,icon='add',extra='')=>`<button type="button" aria-label="${escape(label)}" data-tree-action="${action}" ${extra}>${iconHTML(icon)}<span>${label}</span></button>`;
const reasonText={'family-gate':'Earn this power through successful play.','insufficient-seeds':'Earn more Points by clearing pools.','mastery':'Clear 3 pools with this power activated.','prerequisite':'Unlock this power first.','over-budget':'Not enough tuning. Unequip an upgrade first.','invalid-equipment':'Add this power to your loadout first.'};

function statVisual(row){
 const value=row.progress,before=row.changed?row.previousProgress:value,kept=Math.min(before,value),extent=Math.max(before,value),change=value>before?'gain':'loss';
 const fill=row.kind==='count'?Array.from({length:row.max},(_,i)=>`<i class="${i<Math.round(kept*row.max)?'filled':i<Math.round(extent*row.max)?'skill-stat-'+change:''}"></i>`).join(''):
   `<i style="width:${kept*100}%"></i>${row.changed?`<i class="skill-stat-${change}" style="width:${(extent-kept)*100}%"></i>`:''}`;
 const bar=`<span class="skill-stat-${row.kind}" aria-hidden="true">${fill}</span>`;
 if(row.kind!=='bar')return bar;
 const partial=value<1,formatted=String(row.after),best=String(row.after).replace(/^[\d.]+/,String(row.best));
 return `<span class="sr-only">${row.direction==='lower'?'Lower':'Higher'} is better. Best: ${escape(best)}</span><span class="skill-stat-meter" aria-hidden="true"><span class="skill-stat-labels ${partial&&value>.75?'is-tight':''} ${row.changed?'is-'+change:''}" style="--fill:${value*100}%;--value-width:${formatted.length+.5}ch">${partial?`<span class="skill-stat-endpoint">${escape(formatted)}</span>`:''}<span class="skill-stat-max">Best ${escape(best)}</span></span>${bar}</span>`;
}
export function skillStatsHTML(stats){
 const changed=stats.rows.filter(r=>r.changed&&r.kind!=='text');
 const legend=changed.length?`<p class="skill-stat-change-key">${changed.some(r=>r.progress>r.previousProgress)?'<span><i class="skill-stat-gain" aria-hidden="true"></i>Improvement</span>':''}${changed.some(r=>r.progress<r.previousProgress)?'<span><i class="skill-stat-loss" aria-hidden="true"></i>Tradeoff</span>':''}</p>`:'';
 return `<section class="skill-stats" aria-label="${escape(stats.heading)}"><h4>${escape(stats.heading)}</h4>${stats.compare?`<p class="skill-stat-key"><span>${escape(stats.beforeLabel)}</span><span aria-hidden="true">→</span><span>${escape(stats.afterLabel)}</span></p>`:''}${legend}<dl>${stats.rows.map(row=>`<div class="skill-stat ${row.changed?'is-changed':''}" data-change="${row.changed&&row.kind!=='text'?(row.progress>row.previousProgress?'gain':'loss'):'none'}"><dt>${escape(row.label)}</dt><dd>${row.changed?`<span class="skill-stat-before">${escape(row.before)}</span><span aria-hidden="true"> → </span><span class="sr-only"> to </span>`:''}<strong>${escape(row.after)}</strong></dd><dd class="skill-stat-description">${escape(row.description)}</dd>${row.kind!=='text'?`<dd class="skill-stat-visual">${statVisual(row)}</dd>`:''}</div>`).join('')}</dl>${stats.rows.some(r=>r.kind==='bar')?'<p class="skill-stat-note">Full bar = best value for this stat. Styles can trade strengths.</p>':''}</section>`;
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
export function visibleResearch(state,showAll=false){
 return Object.values(cat.nodes).map(n=>({...n,...upgradeState(state,n.id)}))
   .filter(n=>showAll||n.owned||n.borrowed||state.phase==='shop'&&state.powerMode!=='shared'&&n.buy.ok);
}
// Inspection is always available; purchase and activation remain separate actions.
export function skillCost(state,id,showPurchasedCosts=false){
 const n=cat.nodes[id];return n&&(!state.profile.research[id]||showPurchasedCosts)?n.seedCost:null;
}
export function skillInfo(state,id,showPurchasedCosts=false){
 const n=cat.nodes[id];if(!n)return null;
 const v=upgradeState(state,id),blocker=researchBlocker(state,id),cost=skillCost(state,id,showPurchasedCosts);
 return {name:n.name,type:n.type,description:n.description,cost,status:v.owned||v.borrowed?v.label+(cost===null?'':` · ${cost} Points`):`${cost} Points`,blocker,
   stats:skillStats(state,id),comparison:purchaseComparison(state,id),canEquip:state.powerMode==='unlocked'&&(v.owned||v.borrowed)&&n.conflicts.length>0&&!v.equipped&&!blocker&&state.phase!=='run'};
}
export function treeMount(controller){
 const dialog=document.getElementById('tree-dialog');
 let state=controller.get(),selected='ripple.base',tip=null,tipId=null,leaveTimer=0,pinned=false,lastView=null;
 const fullLayout=treeLayout(POWER_TREES,cat.nodes),world={x:0,y:0,width:fullLayout.width,height:fullLayout.height};
 let layout=fullLayout,visiblePositions={};
 dialog.innerHTML=`<header class="tree-heading">${button('back','Back','arrow-left')}<h2>Skill Tree</h2><div class="tree-wallet-summary"></div></header><p class="tree-status sr-only" role="status" aria-live="polite"></p><div class="tree-workspace"><section class="tree-map-section" aria-label="Connected power tree"><div class="tree-map-stage"><button type="button" class="tree-legend" data-tree-action="legend" aria-expanded="false" aria-controls="tree-legend-content"><span class="tree-legend-title">${iconHTML('about')}<span>Legend</span><span class="tree-legend-close" aria-hidden="true">${iconHTML('close')}</span></span><span id="tree-legend-content" hidden><span class="rarity-legend">${Object.entries(RARITIES).map(([id,r])=>`<span class="rarity-key">${rarityIconHTML(id)}${r.name}</span>`).join('')}</span><span class="status-legend"><span class="legend-active">Active</span><span class="legend-owned">Owned</span><span class="legend-available">Available</span><span class="legend-locked">Locked</span></span><span class="tree-legend-hint">Tap to Collapse</span></span></button><div class="tree-map-scroll" tabindex="0" aria-label="Skill Tree map. Drag to pan; pinch or scroll to zoom. Arrow keys move between skills."><div class="tree-map"></div></div><div class="tree-camera-controls" aria-label="Map controls"><button type="button" data-tree-action="zoom-out" aria-label="Zoom out"><span aria-hidden="true">−</span></button><output class="tree-zoom" aria-label="Map zoom">85%</output>${button('zoom-in','Zoom in','add')}${button('fit','Fit tree','fullscreen-enable')}${button('focus','Focus','reset')}</div><span class="tree-map-hint">Drag to move · Pinch or scroll to zoom</span></div></section></div><section id="skill-tooltip" class="skill-tooltip" role="dialog" aria-modal="false" aria-labelledby="skill-tooltip-title" hidden></section>`;
 const surface=dialog.querySelector('.tree-map-scroll'),mapElement=dialog.querySelector('.tree-map'),stage=dialog.querySelector('.tree-map-stage');
 const legend=dialog.querySelector('.tree-legend'),legendContent=dialog.querySelector('#tree-legend-content');
 function setLegend(open){legend.setAttribute('aria-expanded',String(open));legendContent.hidden=!open;}
 tip=dialog.querySelector('.skill-tooltip');
 const status=message=>{dialog.querySelector('.tree-status').textContent=message;};
 function hideTooltip(restore=false){
   clearTimeout(leaveTimer);const source=tipId&&mapElement.querySelector(`[data-node="${tipId}"]`);
   tip.hidden=true;tipId=null;pinned=false;source?.setAttribute('aria-expanded','false');
   if(restore)surface.focus({preventScroll:true});
 }
 const camera=mapCameraMount(surface,world,view=>{
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
   const cost=skillCost(state,n.id,controller.showPurchasedCosts?.());
   const badge=n.borrowed?'clock':active||n.owned?'check':locked?'lock':null;
   const label=active?'Active':n.owned?'Owned':available?'Available to Purchase':n.borrowed?'Borrowed':'Locked';
   return `<button type="button" data-node="${n.id}" data-kind="${n.kind}" data-rarity="${n.rarity}" class="skill-node ${base?'is-base':''} ${n.kind==='capstone'?'is-capstone':''} ${n.owned?'is-owned':''} ${active?'is-active':''} ${available?'is-available':''} ${locked?'is-locked':''} ${n.borrowed?'is-borrowed':''}" style="--rarity-color:${RARITIES[n.rarity].color};--node-x:${layout.nodes[n.id].x}px;--node-y:${layout.nodes[n.id].y}px" aria-label="${escape(n.name+', '+label+(cost===null?'':', Cost: '+cost+' Points'))}" aria-pressed="${selected===n.id}" aria-haspopup="dialog" aria-controls="skill-tooltip" aria-expanded="false"><span class="skill-orb">${skillIconHTML(n)}<span class="skill-rarity" aria-hidden="true">${rarityIconHTML(n.rarity)}</span>${badge?'<i class="skill-badge">'+iconHTML(badge)+'</i>':''}</span><strong>${escape(n.name)}</strong>${cost===null?'':`<small class="skill-node-cost">${iconHTML('coin')}<span>${cost} Points</span></small>`}</button>`;
 }
 function render(){
   hideTooltip();
   dialog.querySelector('.tree-wallet-summary').innerHTML=`<strong>${iconHTML('coin')}${state.profile.wallet.seeds}<span> Points</span></strong>`;
   const showAll=controller.showAllSkills?.(),nodes=visibleResearch(state,showAll),byId=Object.fromEntries(nodes.map(n=>[n.id,n])),previous=layout.nodes[selected];
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
   clearTimeout(leaveTimer);const info=skillInfo(state,id,controller.showPurchasedCosts?.()),comparison=info?.comparison;
   if(!info||!visiblePositions[id]){hideTooltip();return;}
   if(tipId===id&&!tip.hidden)return;
   hideTooltip();selected=id;selectionRender();
   const source=mapElement.querySelector(`[data-node="${id}"]`),bounds=stage.getBoundingClientRect();
   tip.style.maxHeight=Math.max(44,bounds.height-16)+'px';tip.style.width=Math.min(330,bounds.width-16)+'px';
   tip.innerHTML=`<div class="skill-tooltip-heading"><div class="skill-card-title"><h3 id="skill-tooltip-title">${escape(info.name)}</h3><span class="skill-type-pill"><span class="sr-only">Type: </span>${typeIconHTML(info.type)}${escape(info.type)}</span></div>${button('dismiss','Close','close')}</div><p>${escape(info.description)}</p>${info.stats?skillStatsHTML(info.stats):''}<p>${escape(info.status)}${info.blocker?'<br>'+escape(info.blocker):''}</p>${comparison?button('buy',`Buy · ${comparison.cost} Points`,'coin','class="primary"'):info.canEquip?button('equip','Use This Style','check','class="primary"'):''}`;
   // Mirror the selected node's actual artwork and badges; the card shares its paint rules.
   const cardIcon=document.createElement('span');
   cardIcon.className=source.className.replace('skill-node','skill-card-icon');cardIcon.setAttribute('aria-hidden','true');
   cardIcon.style.setProperty('--rarity-color',source.style.getPropertyValue('--rarity-color'));
   cardIcon.append(source.querySelector('.skill-orb').cloneNode(true));tip.querySelector('.skill-tooltip-heading').prepend(cardIcon);
   tip.hidden=false;tipId=id;source.setAttribute('aria-expanded','true');
   const size=tip.getBoundingClientRect(),position=tooltipPosition(source.getBoundingClientRect(),bounds,size.width,size.height),origin=dialog.getBoundingClientRect();
   tip.style.left=position.left-origin.left+'px';tip.style.top=position.top-origin.top+'px';
 }
 function selectNode(id,keyboard=false){
   if(!visiblePositions[id])return;
   if(tipId===id){if(pinned&&!keyboard)hideTooltip();else{pinned=true;if(keyboard)(tip.querySelector('.primary')||tip.querySelector('[data-tree-action=dismiss]')).focus();}return;}
   selected=id;selectionRender();camera.ensure(layout.nodes[id]);
   showTooltip(id);pinned=true;if(keyboard)(tip.querySelector('.primary')||tip.querySelector('[data-tree-action=dismiss]')).focus();
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
