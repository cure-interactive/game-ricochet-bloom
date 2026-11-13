import { purchaseComparison, skillStats, tooltipPosition } from './skill-comparison.js?v=cdaedaf5ebe7c04ed814484c664c8251daf2ff5f018405c9c88161a34c9efcea';
import { RARITIES } from './skill-trait.js?v=e149e64c177320afd3c752be9033b394aef97e73f55b5752d3400d5b2928eee9';
import { skillIconHTML, rarityIconHTML, typeIconHTML } from './skill-icon.js?v=8204f2fbf05455900424793e65a78c64648c2b6baf30d788e5ab6fd75879fb59';
import { treeLayout, mapCameraMount, nearestMapNode, researchRoute, researchBounds, researchLayout } from './tree-map.js?v=f0eef94b88145f071c75d50ebf488d06a1e21bb049a894a7abe1abb1393368ea';
import { POWER_TREES } from './power-tree.js?v=dbaa6fd695e15e784508ce3ba4c6ff1e3ff616c91294e4702f6a0f4725c3326e';
import { profilePurchase, profileSummary } from './profile.js?v=f09fdb22d84263dcb45cd1d7c9199cc83fc40768057dc69eedef848efd19db7a';
import { progressionBudget, GAME_CATALOGUE as cat } from './run.js?v=437191b652f3ef1846b3b93a40c93dd41bd928f024b76961c39006eff07ba611';
import { iconHTML } from './ui-icon.js?v=6eefd3a5e72d754fea063666baf3166c1c88b5e72db4ab97072da15565143b81';

const escape = text => String(text).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const button=(action,label,icon='add',extra='')=>`<button type="button" aria-label="${escape(label)}" data-tree-action="${action}" ${extra}>${iconHTML(icon)}<span>${label}</span></button>`;
const reasonText={'family-gate':'Earn this power through successful play.','insufficient-seeds':'Earn Points in any game mode.','mastery':'Activate this power on 3 plucks that hit at least 3 bubbles. Campaign clears also count.','prerequisite':'Unlock this power first.','over-budget':'Not enough tuning. Unequip an upgrade first.','invalid-equipment':'Add this power to your loadout first.'};

function statCurveHTML(curve,stats){
 const left=32,right=270,top=22,bottom=112;
 const x=v=>left+v/curve.xMax*(right-left),y=v=>bottom-(v-curve.yMin)/(curve.yMax-curve.yMin)*(bottom-top);
 const path=points=>points.map(([a,b],i)=>`${i?'L':'M'}${x(a).toFixed(2)},${y(b).toFixed(2)}`).join(' ');
 const zero=y(0),caption=curve.changed?`<span class="skill-curve-current">${escape(stats.beforeLabel)}</span><span class="skill-curve-upgrade">${escape(stats.afterLabel)}</span>`:'<span class="skill-curve-value">'+escape(stats.compare?stats.afterLabel:stats.heading)+'</span>';
 return `<figure class="skill-curve"><svg viewBox="0 0 280 148" role="img" aria-label="${escape(curve.summary)}"><text class="skill-curve-axis-title" x="32" y="11">${escape(curve.yLabel)}</text><path class="skill-curve-grid" d="M32 22H270 M32 67H270 M32 112H270"/><path class="skill-curve-axis" d="M32 22V112H270 M32 ${zero}H270"/><text x="26" y="26" text-anchor="end">${curve.yMax}</text><text x="26" y="115" text-anchor="end">${curve.yMin}</text>${curve.yMin<0?`<text x="26" y="${zero+4}" text-anchor="end">0</text>`:''}${curve.previous?`<path class="skill-curve-before" d="${path(curve.previous)}"/>`:''}<path class="skill-curve-after" d="${path(curve.points)}"/><text x="32" y="127">0</text><text x="270" y="127" text-anchor="end">${escape(curve.xEnd)}</text><text x="151" y="144" text-anchor="middle">${escape(curve.xLabel)}</text></svg><figcaption>${caption}</figcaption><p>${escape(curve.note)}</p></figure>`;
}

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
 const changed=stats.rows.filter(r=>r.changed&&r.kind!=='text'&&!r.curve);
 const legend=changed.length?`<p class="skill-stat-change-key">${changed.some(r=>r.progress>r.previousProgress)?'<span><i class="skill-stat-gain" aria-hidden="true"></i>Improvement</span>':''}${changed.some(r=>r.progress<r.previousProgress)?'<span><i class="skill-stat-loss" aria-hidden="true"></i>Tradeoff</span>':''}</p>`:'';
 return `<section class="skill-stats" aria-label="${escape(stats.heading)}"><h4>${escape(stats.heading)}</h4>${stats.compare?`<p class="skill-stat-key"><span>${escape(stats.beforeLabel)}</span><span aria-hidden="true">→</span><span>${escape(stats.afterLabel)}</span></p>`:''}${legend}<dl>${stats.rows.map(row=>`<div class="skill-stat ${row.changed?'is-changed':''}" data-change="${row.changed&&row.kind!=='text'?(row.progress>row.previousProgress?'gain':'loss'):'none'}"><dt>${escape(row.label)}</dt><dd>${row.changed?`<span class="skill-stat-before">${escape(row.before)}</span><span aria-hidden="true"> → </span><span class="sr-only"> to </span>`:''}<strong>${escape(row.after)}</strong></dd><dd class="skill-stat-description">${escape(row.description)}</dd>${row.curve?`<dd class="skill-stat-visual">${statCurveHTML(row.curve,stats)}</dd>`:row.kind!=='text'?`<dd class="skill-stat-visual">${statVisual(row)}</dd>`:''}</div>`).join('')}</dl>${stats.rows.some(r=>r.kind==='bar'&&!r.curve)?'<p class="skill-stat-note">Full bar = best value for this stat. Styles can trade strengths.</p>':''}</section>`;
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
 const canUnlock=!owned&&state.phase==='shop'&&state.powerMode!=='shared'&&buy.ok;
 return {owned,borrowed,equipped,buy,label,icon,canUnlock,dimmed:!owned&&!canUnlock};
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
 if(state.phase!=='shop')missing.push('Research opens after this run.');
 if(!v.buy.ok)missing.push(v.buy.reason==='mastery'?`Earn ${Math.max(0,3-profileSummary(state.profile,cat).mastery[n.power])} more mastery uses: activate ${POWER_TREES[n.power].name} and hit at least 3 bubbles in a pluck. Campaign clears also count.`:v.buy.reason==='insufficient-seeds'?`Need ${n.seedCost-state.profile.wallet.seeds} more Point${n.seedCost-state.profile.wallet.seeds===1?'':'s'}.`:(v.buy.reason==='family-gate'?powerUnlock(state,n.power)?.remaining:v.buy.reason==='prerequisite'?`Research ${cat.nodes[n.requires.find(id=>!state.profile.research[id])]?.name||POWER_TREES[n.power].name} first.`:reasonText[v.buy.reason])||v.buy.reason);
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
   const base=n.kind==='base',active=n.equipped||base&&state.powers.includes(n.power),available=n.canUnlock,locked=!n.owned&&!n.borrowed&&!available;
   const cost=skillCost(state,n.id,controller.showPurchasedCosts?.());
   const badge=n.borrowed?'clock':active||n.owned?'check':locked?'lock':null;
   const label=active?'Active':n.owned?'Owned':available?'Available to Purchase':n.borrowed?'Borrowed':'Locked';
   return `<button type="button" data-node="${n.id}" data-kind="${n.kind}" data-rarity="${n.rarity}" class="skill-node ${base?'is-base':''} ${n.kind==='capstone'?'is-capstone':''} ${n.owned?'is-owned':''} ${n.dimmed?'is-unavailable':''} ${active?'is-active':''} ${available?'is-available':''} ${locked?'is-locked':''} ${n.borrowed?'is-borrowed':''}" style="--rarity-color:${RARITIES[n.rarity].color};--node-x:${layout.nodes[n.id].x}px;--node-y:${layout.nodes[n.id].y}px" aria-label="${escape(n.name+', '+label+(cost===null?'':', Cost: '+cost+' Points'))}" aria-pressed="${selected===n.id}" aria-haspopup="dialog" aria-controls="skill-tooltip" aria-expanded="false"><span class="skill-orb">${skillIconHTML(n)}<span class="skill-rarity" aria-hidden="true">${rarityIconHTML(n.rarity)}</span>${badge?'<i class="skill-badge">'+iconHTML(badge)+'</i>':''}</span><strong>${escape(n.name)}</strong>${cost===null?'':`<small class="skill-node-cost">${iconHTML('coin')}<span>${cost} Points</span></small>`}</button>`;
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
   clearTimeout(leaveTimer);const info=skillInfo(state,id,controller.showPurchasedCosts?.());
   if(!info||!visiblePositions[id]){hideTooltip();return;}
   if(tipId===id&&!tip.hidden)return;
   hideTooltip();selected=id;selectionRender();
   const source=mapElement.querySelector(`[data-node="${id}"]`),bounds=stage.getBoundingClientRect();
   tip.style.maxHeight=Math.max(44,bounds.height-16)+'px';tip.style.width=Math.min(330,bounds.width-16)+'px';
   tip.innerHTML=`<div class="skill-tooltip-heading"><div class="skill-card-title"><h3 id="skill-tooltip-title">${escape(info.name)}</h3><span class="skill-type-pill"><span class="sr-only">Type: </span>${typeIconHTML(info.type)}${escape(info.type)}</span></div>${button('dismiss','Close','close')}</div><div class="skill-tooltip-body"><p>${escape(info.description)}</p>${info.stats?skillStatsHTML(info.stats):''}${info.unlock?'':`<p>${escape(info.status)}${info.blocker?'<br>'+escape(info.blocker):''}</p>`}</div>${info.unlock?`<div class="skill-tooltip-action">${button('buy',`Unlock · ${info.unlock.cost} Points`,'lock',`class="primary" ${info.unlock.enabled?'':'disabled aria-describedby="skill-unlock-reason"'}`)}${info.unlock.reason?`<p id="skill-unlock-reason">${escape(info.unlock.reason)}</p>`:''}</div>`:info.canEquip?`<div class="skill-tooltip-action">${button('equip','Use This Style','check','class="primary"')}</div>`:''}`;
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
   if(tipId===id){if(pinned&&!keyboard)hideTooltip();else{pinned=true;if(keyboard)(tip.querySelector('.primary:not(:disabled)')||tip.querySelector('[data-tree-action=dismiss]')).focus();}return;}
   selected=id;selectionRender();camera.ensure(layout.nodes[id]);
   showTooltip(id);pinned=true;if(keyboard)(tip.querySelector('.primary:not(:disabled)')||tip.querySelector('[data-tree-action=dismiss]')).focus();
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
