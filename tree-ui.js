import { treeLayout, mapCameraMount, nearestMapNode, researchRoute } from './tree-map.js?v=e73fd3a6aaad37377d75e4ff0502d66a65beaa15beb3e90248006857e9fce28a';
import { POWER_TREES } from './power-tree.js?v=2ddf449ce328f8cc92262395a8ecacc7f5d7a653c9df225d5b7c296f7596bc3c';
import { familyGate, familyEntry, FAMILY_UNLOCK } from './catalogue.js?v=5fbcb1a1f514c613cfd9c6f10f85ee2b01f6f5148a846ca33e713b60589ae9b0';
import { profilePurchase, profileSummary } from './profile.js?v=c981db02c3e6061c959d5372ca00296827e5487fc916235922baecb955da3915';
import { researchTarget, progressionBudget, progressionLoadout, GAME_CATALOGUE as cat, POOL_NAMES, GOALS } from './run.js?v=58c88e9b727d2c38752239506cb914e7198e544cf55e38d7031735e3e065e2f2';
import { assetURL } from './asset.js?v=2b159e067962ab466dfde3d9f305e802c92bc5b4183b6ffe9932dbb398b20746';
import { iconHTML } from './ui-icon.js?v=6eefd3a5e72d754fea063666baf3166c1c88b5e72db4ab97072da15565143b81';

const families = [...new Set(Object.values(POWER_TREES).map(p => p.family))];
const escape = text => String(text).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const powerImage = power => `<img draggable="false" src="${assetURL('icon/power/'+power+'.svg')}" alt="" width="32" height="32">`;
const button=(action,label,icon='add',extra='')=>`<button type="button" aria-label="${escape(label)}" data-tree-action="${action}" ${extra}>${iconHTML(icon)}<span>${label}</span></button>`;
const reasonText={'family-gate':'Earn this power through successful play.','insufficient-seeds':'Earn more Points by clearing pools.','mastery':'Clear 3 pools with this power activated.','prerequisite':'Unlock this power first.','over-budget':'Not enough tuning. Unequip an upgrade first.','invalid-equipment':'Add this power to your loadout first.'};

// Explain the same gate used by purchases, beside the affected power.
export function powerUnlock(state,power){
 const p=POWER_TREES[power],gate=familyGate(state.profile,power,cat);
 if(state.profile.kind==='development'||state.profile.research[power+'.base']||gate.ok)return null;
 if(!gate.entry.open){const node=cat.nodes[gate.entry.via],source=POWER_TREES[node.power];return {short:'Open '+p.family,remaining:`Research ${node.name} in ${source.family} to unlock ${p.family}.`,description:`Research ${node.name}, the first ${source.name} upgrade in ${source.family}, to unlock the ${p.family} family. Temporary loans do not unlock families.`};}
 const clears=Math.max(0,gate.required-gate.clears),powers=p.tier===3?Math.max(0,2-gate.powers):0;
 const remaining=[clears?`Clear ${clears} more ${clears===1?'pool':'pools'} with a ${p.family} power activated.`:'',powers?`Activate ${powers} more different ${p.family} ${powers===1?'power':'powers'} in cleared pools.`:''].filter(Boolean).join(' ');
 return {short:clears?`${clears} ${clears===1?'clear':'clears'} left`:`${powers} new ${powers===1?'power':'powers'}`,remaining,
  description:`Clear ${gate.required} pools after activating at least one ${p.family} power.${p.tier===3?` Across those clears, use at least 2 different ${p.family} powers.`:''} Progress: ${Math.min(gate.clears,gate.required)}/${gate.required} qualifying clears${p.tier===3?` · ${Math.min(gate.powers,2)}/2 different powers`:''}.`};
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
export function treeMount(controller){
 const dialog=document.getElementById('tree-dialog'),mobile=matchMedia('(max-width:760px)');
 let state=controller.get(),selected='comet.base',family='Motion',confirmEquip=false;
 let route=researchRoute(cat.nodes,POWER_TREES,FAMILY_UNLOCK,selected);
 dialog.innerHTML=`<header class="tree-heading">${button('back','Back','arrow-left')}<h2>Skill tree</h2><div class="tree-wallet-summary"></div>${button('guide','Guide','about')}</header><p class="tree-status" role="status" aria-live="polite"></p><div class="tree-workspace"><section class="tree-map-section" aria-label="Connected power tree"><div class="tree-target"></div><div class="tree-map-stage"><div class="tree-map-scroll" tabindex="0" aria-label="Skill tree map. Drag to pan; pinch or use zoom controls. Arrow keys move the map."><div class="tree-map"></div></div><div class="tree-camera-controls" aria-label="Map controls"><button type="button" data-tree-action="zoom-out" aria-label="Zoom out"><span aria-hidden="true">−</span></button><output class="tree-zoom" aria-label="Map zoom">85%</output>${button('zoom-in','Zoom in','add')}${button('fit','Fit tree','fullscreen-enable')}${button('focus','Focus','reset')}</div><span class="tree-map-hint">Drag to move · Pinch or scroll to zoom</span></div></section><aside class="tree-detail" aria-label="Selected upgrade"></aside></div><footer class="tree-legend" aria-label="Skill status legend"><span class="legend-active">Active</span><span class="legend-owned">Owned</span><span class="legend-available">Available</span><span class="legend-locked">Locked</span></footer>`;
 const layout=treeLayout(POWER_TREES,cat.nodes,FAMILY_UNLOCK),surface=dialog.querySelector('.tree-map-scroll'),mapElement=dialog.querySelector('.tree-map');
 let camera=mapCameraMount(surface,layout,view=>{mapElement.style.transform=`translate(${view.x}px,${view.y}px) scale(${view.scale})`;dialog.querySelector('.tree-zoom').textContent=Math.round(view.scale*100)+'%';dialog.querySelector('[data-tree-action=zoom-out]').disabled=view.scale<=.101;dialog.querySelector('[data-tree-action=zoom-in]').disabled=view.scale>=1.799;});
 const detail=dialog.querySelector('.tree-detail'),sheet=document.createElement('dialog');sheet.id='tree-sheet';sheet.setAttribute('aria-label','Upgrade details');sheet.innerHTML=`<header class="tree-sheet-heading"><span>Upgrade details</span>${button('done','Done','close')}</header><p class="tree-sheet-status" role="status" aria-live="polite"></p>`;document.body.append(sheet);
 const status=message=>{dialog.querySelector('.tree-status').textContent=message;sheet.querySelector('.tree-sheet-status').textContent=message;};
 function returnDetail(){dialog.querySelector('.tree-workspace').append(detail);detailRender();const source=dialog.querySelector(`[data-node="${selected}"]`);source?.focus({preventScroll:true});}
 sheet.addEventListener('close',returnDetail);dialog.addEventListener('close',()=>{if(sheet.open)sheet.close();});mobile.addEventListener('change',()=>{if(sheet.open)sheet.close();});
 function showDetail(id){selected=id;camera.ensure(layout.nodes[id]);confirmEquip=false;detailRender();mapRender();if(mobile.matches){camera.focus(layout.nodes[id],camera.value.scale,.12);sheet.querySelector('.tree-sheet-heading>span').textContent='Upgrade details';sheet.querySelector('.tree-sheet-status').textContent='';sheet.append(detail);sheet.showModal();}detail.querySelector('.tree-detail-body')?.scrollTo(0,0);}
 function nodeButton(n){const base=n.kind==='base',active=n.equipped||base&&state.powers.includes(n.power),locked=!n.owned&&!n.borrowed&&!n.buy.ok&&n.buy.reason!=='insufficient-seeds',available=n.buy.ok&&!n.borrowed&&state.phase==='shop',badge=n.borrowed?'clock':active||n.owned?'check':locked?'lock':null;
 const status=!n.owned&&!n.borrowed&&!locked?n.seedCost+' Points':'';
 return `<button type="button" data-node="${n.id}" data-kind="${n.kind}" class="skill-node ${base?'is-base':''} ${route.has(n.id)?'is-route':''} ${n.kind==='capstone'?'is-epic':''} ${n.owned?'is-owned':''} ${active?'is-active':''} ${available?'is-available':''} ${locked?'is-locked':''} ${n.borrowed?'is-borrowed':''}" style="--node-x:${layout.nodes[n.id].x}px;--node-y:${layout.nodes[n.id].y}px" aria-label="${escape(POWER_TREES[n.power].name+', '+n.name+', '+n.label)}" aria-pressed="${selected===n.id}"><span class="skill-orb">${n.kind==='capstone'?iconHTML('epic'):powerImage(n.power)}${!base?'<b>'+(['foundation','a','b','capstone'].indexOf(n.kind)+1)+'</b>':''}${badge?'<i class="skill-badge">'+iconHTML(badge)+'</i>':''}</span><strong>${escape(n.name)}</strong>${status?`<small>${status}</small>`:''}${n.unlocks.length?`<small class="family-key">${iconHTML('arrow-right')}Opens ${n.unlocks.join(', ')}</small>`:''}</button>`;
 }
 function mapRender(){
  route=researchRoute(cat.nodes,POWER_TREES,FAMILY_UNLOCK,selected);
  const goal=researchTarget(state);dialog.querySelector('.tree-target').innerHTML=goal?`<button type="button" data-node="${goal.id}">${iconHTML('star')}<span>${escape(goal.name)}<small>${escape(goal.text)}</small></span></button>`:'';
  const graphs=Object.keys(POWER_TREES).map(p=>powerGraph(state,p)),nodes=graphs.flatMap(g=>g.nodes),byId=Object.fromEntries(nodes.map(n=>[n.id,n]));
  const edges=layout.edges.map(e=>{const a=layout.nodes[e.from],b=layout.nodes[e.to],source=byId[e.from],target=byId[e.to];return `<path class="${target.owned?'is-active':source.owned?'is-open':'is-locked'} ${route.has(e.from)&&route.has(e.to)?'is-route':''}" data-from="${e.from}" data-to="${e.to}" d="M${a.x} ${a.y+70} V${b.y-29}"/>`;}).join('');
  const stems=Object.values(layout.families).map(f=>{const open=familyEntry(state.profile,f.name,cat).open;return f.powers.map(p=>{const n=layout.nodes[p+'.base'];return `<path class="family-stem ${open?'is-open':'is-locked'} ${route.has(p+'.base')?'is-route':''}" d="M${f.hub.x} ${f.hub.y+26} V${f.y+62} Q${f.hub.x} ${f.y+84} ${n.x} ${f.y+84} V${n.y-36}"/>`;}).join('');}).join('');
  const bridges=layout.bridges.map(e=>{const a=layout.nodes[e.from],source=layout.families[a.family],target=layout.families[e.to],open=familyEntry(state.profile,e.to,cat).open,corridor=a.x+62,bend=source.y+source.height+12;return `<path class="family-bridge ${open?'is-active':'is-locked'} ${route.has(e.from)&&[...route].some(id=>layout.nodes[id].family===e.to)?'is-route':''}" data-from="${e.from}" data-family-to="${e.to}" d="M${a.x+32} ${a.y} H${corridor} V${bend} H${target.hub.x} V${target.hub.y-26}"/><text class="bridge-label" x="${target.hub.x+12}" y="${bend-12}">${escape(cat.nodes[e.from].name)} → ${e.to}</text>`;}).join('');
  mapElement.style.width=layout.width+'px';mapElement.style.height=layout.height+'px';
  mapElement.innerHTML=`<svg class="tree-world-links" viewBox="0 0 ${layout.width} ${layout.height}" aria-hidden="true">${stems}${edges}${bridges}</svg>`+Object.values(layout.families).map(f=>{const entry=familyEntry(state.profile,f.name,cat),owned=f.powers.filter(p=>state.profile.research[p+'.base']).length;return `<section class="skill-family" data-family-tree="${f.name}" aria-label="${f.name} family"><button type="button" class="family-map-title ${entry.open?'is-open':''}" data-tree-action="family-jump" data-family="${f.name}" style="left:${f.hub.x}px;top:${f.hub.y}px"><strong>${f.name}</strong><small>${entry.open?owned+'/'+f.powers.length:iconHTML('lock')}</small></button>${f.powers.flatMap(p=>graphs.find(g=>g.nodes[0].power===p).nodes).map(nodeButton).join('')}</section>`;}).join('');
 }
 function controlsRender(){const tuning=progressionLoadout(state);
 dialog.querySelector('.tree-wallet-summary').innerHTML=`<strong>${iconHTML('coin')}${state.profile.wallet.seeds}<span> Points</span></strong><small>${state.profile.kind==='development'?'Test · ':''}${state.powerMode==='unlocked'?state.powers.length+' powers unlocked':tuning.tuning+'/'+(state.bypass?'∞':progressionBudget(state))+' tuning'}</small>`;
 }
 function detailRender(){const n=cat.nodes[selected],p=POWER_TREES[n.power],v=upgradeState(state,selected),base=n.kind==='base',inLoadout=state.powers.includes(n.power),mastery=profileSummary(state.profile,cat).mastery[n.power],unlock=powerUnlock(state,n.power),blocker=researchBlocker(state,selected),conflicts=n.conflicts.filter(id=>state.equipped.includes(id));
 let primary='';
 if(!v.owned)primary=button('buy',`${base?'Unlock':'Research'} · ${n.seedCost} Points`,'add',`class="primary" ${!v.buy.ok||state.phase!=='shop'?'disabled':''}`);
 if(!base&&(v.owned||v.borrowed&&state.powerMode!=='unlocked'))primary=state.powerMode==='unlocked'?(n.conflicts.length&&!v.equipped?button('equip','Use this style','switches',`class="primary" ${blocker?'disabled':''}`):'<p class="build-ready">'+iconHTML('check')+'Active automatically</p>'):button('equip',v.equipped?'Unequip upgrade':'Equip upgrade',v.equipped?'check':'add',`class="primary" ${blocker?'disabled':''}`);
 if(base&&v.owned)primary=state.powerMode==='unlocked'?'<p class="build-ready">'+iconHTML('dice-four')+'Can appear during play</p>':inLoadout?'<p class="build-ready">'+iconHTML('check')+'In your loadout</p>':`<label for="tree-slot">Replace</label><select id="tree-slot" ${state.phase!=='shop'?'disabled':''}>${state.powers.map((id,i)=>`<option value="${i}">${POWER_TREES[id].name}</option>`).join('')}</select>${button('replace','Use '+p.name,'check',`class="primary" ${state.phase!=='shop'?'disabled':''}`)}`;
 detail.innerHTML=`<div class="tree-detail-body"><div class="tree-detail-title">${powerImage(n.power)}<div><small>${p.name}${base?'':' · '+(n.kind==='capstone'?'Epic upgrade':'Upgrade')}</small><h3>${escape(n.name)}</h3></div></div><p class="upgrade-state">${iconHTML(v.icon)}${escape(v.label)}</p><p class="tree-description">${escape(n.description)}</p>${n.unlocks.map(f=>button('family-jump',`${v.owned?'Opens':'Also unlocks'} ${f}`,'arrow-right',`data-family="${f}" class="family-link"`)).join('')}${n.requires.length?`<p class="tree-requirement">Previous step: ${cat.nodes[n.requires[0]].name}${state.profile.research[n.requires[0]]?' · Owned':''}.</p>`:''}<div class="tree-cost"><span>${v.owned?'Permanently owned':v.borrowed?'Borrowed for this run':n.seedCost+' Points'}</span>${state.powerMode==='unlocked'?'':'<span>'+n.tuningCost+' tuning</span>'}</div>${base&&unlock?`<p class="tree-requirement">${escape(unlock.description)}</p>${button('family-help','View '+p.family+' powers','network-node-three')}`:''}${n.masteryPools?`<p class="tree-requirement">${Math.min(3,mastery)}/3 cleared pools with ${p.name} activated.</p>`:''}${n.conflictReason?`<p class="tree-requirement">${escape(n.conflictReason)} Both can be owned.</p>`:''}<div class="tree-secondary">${button('pin',state.target===selected?'Unpin goal':'Set research goal','star')}</div><details class="tree-reference"><summary>Advanced reference</summary><p>Research follows the connected chain beneath each power. Existing purchases and temporary discoveries remain usable. Compatible upgrades combine; conflicting modes remain freely switchable.</p><p>${escape(p.current)}</p><p>Legacy configuration: ${p.today.map(k=>k==='base'?'Base power':cat.nodes[n.power+'.'+k].name).join(' + ')}${p.legacyMatch===false?' (shorter history in Song Run)':''}.</p></details>${confirmEquip?`<section class="tree-confirm"><strong>Replace ${conflicts.map(id=>cat.nodes[id].name).join(', ')}?</strong><p>Both styles remain unlocked. Only one force shape can be active at a time.</p>${button('confirm-equip','Use this style','check')}${button('cancel','Cancel','close')}</section>`:''}</div><footer class="tree-purchase"><p>${escape(blocker||(!v.owned?'Purchases are permanent. Unlocked powers and upgrades join your game automatically.':''))}</p>${primary}</footer>`;
 }
 function render(){const active=document.activeElement,key=['treeAction','node'].find(k=>active?.dataset?.[k]),value=active?.dataset?.[key],attrs={treeAction:'data-tree-action',node:'data-node'};controlsRender();mapRender();detailRender();if(key)(sheet.open?sheet:dialog).querySelector(`[${attrs[key]}="${value}"]:not(:disabled)`)?.focus({preventScroll:true});}
 function familySelect(value){family=value;if(family!=='All')selected=Object.keys(POWER_TREES).find(p=>POWER_TREES[p].family===family)+'.base';status('');detailRender();mapRender();if(family==='All')camera.fit();else camera.focus(layout.nodes[layout.families[family].starter],1);}
 dialog.addEventListener('close',()=>camera.cancel());
 surface.addEventListener('focusin',e=>{const id=e.target.closest('[data-node]')?.dataset.node;if(id&&e.target.matches(':focus-visible'))camera.ensure(layout.nodes[id]);});
 function guide(){const running=state.phase!=='shop';sheet.querySelector('.tree-sheet-heading>span').textContent='Skill tree guide';sheet.append(detail);detail.innerHTML=`<div class="tree-detail-body"><h3>Explore the map</h3><p>Drag in any direction to move. Pinch or use the mouse wheel to zoom. Settings → Accessibility → Show on-screen controls adds zoom, Fit tree and Focus buttons as alternatives to gestures. Tap a family name on the map to focus its cluster. Arrow keys move the map; on a node they move to a nearby upgrade. Tap a node for details.</p><h3>Reading the tree</h3><p>Large circles unlock powers; smaller circles repeat the power icon with upgrade numbers 1–4. Epic upgrades use the Epic glyph and a distinct frame. The gold route shows the prerequisites leading to your selection, including family bridges. Research each power's four upgrades in order down the connected chain. Each new purchase requires the previous step. Epic nodes also need mastery.</p><p>Active nodes glow mint. Owned nodes have a check, affordable research has a gold border, and locked nodes show a lock. Tap any node for its effects and requirements. Every unlocked power can appear at random on jellies.</p><p>Points buy permanent research. Purchases cannot be refunded. Compatible upgrades activate automatically. Change a conflicting style from its node; both remain owned. Temporary discoveries are marked “This run”.</p><p>Motion and Flow start open. Momentum opens Navigation, Wide ripple opens Control, and Deep frost opens Propagation when permanently researched. Temporary loans do not open families. Previously available families stay open.</p><p>Tap a locked power for its remaining qualifying clears or different-power requirement. A clear counts only when a power from that family activated during the pool. You do not need to buy every earlier power.</p><section class="tree-extra"><h3>Run options</h3><div>${!running?button('relaxed',state.relaxed?'Relaxed · 8 plucks':'Standard · 6 plucks','switches'):button('end-ask','End this run','reset')}</div></section></div>`;sheet.showModal();}
 function handle(event){const node=event.target.closest('[data-node]'),a=event.target.closest('[data-tree-action]');
 if(node){showDetail(node.dataset.node);return;}if(!a)return;
 let type=a.dataset.treeAction;
 if(type==='zoom-in'||type==='zoom-out'){camera.zoom(type==='zoom-in'?1.25:.8);return;}
 if(type==='fit'){family='All';mapRender();camera.fit();return;}
 if(type==='focus'){camera.focus(layout.nodes[selected],1);return;}
 if(type==='family-jump'){if(sheet.open)sheet.close();familySelect(a.dataset.family);return;}
 if(type==='back'){controller.back?.();return;}if(type==='done'){sheet.close();return;}if(type==='guide'){guide();return;}
 if(type==='power-detail'){showDetail(a.dataset.power+'.base');return;}
 if(type==='family-help'){if(sheet.open)sheet.close();familySelect(POWER_TREES[cat.nodes[selected].power].family);return;}
 if(type==='cancel'){confirmEquip=false;detailRender();return;}
 if(type==='end-ask'){a.disabled=true;const controls=detail.querySelector('.tree-detail-body');controls.insertAdjacentHTML('beforeend',`<section class="tree-confirm"><p>End the run? Earned Points stay. Loans return.</p>${button('abandon','End run','check')}${button('keep-run','Keep playing','arrow-left')}</section>`);controls.lastElementChild.scrollIntoView({block:'nearest'});return;}
 if(type==='keep-run'){a.closest('.tree-confirm').remove();detail.querySelector('[data-tree-action=end-ask]').disabled=false;return;}
 if(['play','campaign'].includes(type)){const r=controller.open(type,selected);if(r?.reason)status(r.reason);return;}
 if(type==='equip'&&!state.equipped.includes(selected)&&cat.nodes[selected].conflicts.some(id=>state.equipped.includes(id))){confirmEquip=true;detailRender();detail.querySelector('.tree-confirm')?.scrollIntoView({block:'nearest'});return;}
 if(type==='confirm-equip')type='equip';
 const r=controller.act({type,id:type==='pin'&&state.target===selected?null:selected,power:cat.nodes[selected].power,slot:Number(detail.querySelector('#tree-slot')?.value)});
 if(r.ok){state=controller.get();confirmEquip=false;if(sheet.open&&['abandon','relaxed'].includes(type))sheet.close();render();status(r.message);}else status(reasonText[r.reason]||r.reason);
 }
 dialog.addEventListener('keydown',event=>{const from=event.target.closest('.skill-node'),direction={ArrowLeft:[-1,0],ArrowRight:[1,0],ArrowUp:[0,-1],ArrowDown:[0,1]}[event.key];if(!from||!direction)return;const next=nearestMapNode(layout.nodes,from.dataset.node,...direction);if(next){event.preventDefault();camera.ensure(layout.nodes[next]);dialog.querySelector(`.skill-node[data-node="${next}"]`)?.focus({preventScroll:true});}});
 dialog.addEventListener('click',handle);sheet.addEventListener('click',handle);dialog.addEventListener('cancel',e=>{e.preventDefault();controller.back?.();});
 function open(focusFamily){if(families.includes(focusFamily)){family=focusFamily;selected=Object.keys(POWER_TREES).find(p=>POWER_TREES[p].family===family)+'.base';}controller.screen?.();document.querySelectorAll('dialog[open]').forEach(d=>d.close());state=controller.get();status('');render();dialog.showModal();if(family==='All')camera.fit();else camera.focus(layout.nodes[selected],1);dialog.querySelector('[data-tree-action=back]').focus({preventScroll:true});}
 render();if(new URL(location.href).searchParams.get('view')==='tree')open();return {open,refresh(){state=controller.get();render();}};
}
