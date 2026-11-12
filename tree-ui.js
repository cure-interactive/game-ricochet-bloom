import { treeLayout, mapCameraMount, nearestMapNode, researchRoute } from './tree-map.js?v=378173687325e553c35df94839e24b905973975a03058b3dc6bd5a32f580f371';
import { POWER_TREES } from './power-tree.js?v=2ddf449ce328f8cc92262395a8ecacc7f5d7a653c9df225d5b7c296f7596bc3c';
import { FAMILY_UNLOCK } from './catalogue.js?v=5b190da66f356e0db04d39abcc70c604726ff00146d498a6109a4be15429f888';
import { profilePurchase, profileSummary } from './profile.js?v=64181c030af514b97953fae1219e4142f64e30029d87c33eeec1e6d7fff631f1';
import { researchTarget, progressionBudget, progressionLoadout, GAME_CATALOGUE as cat, POOL_NAMES, GOALS } from './run.js?v=d4a0763247cf9d5ad868ce587a2006eccfbca07854878087aa2ab9f3c890b840';
import { assetURL } from './asset.js?v=142d7a2d7e9c9c8621efc77af5ebd0588ac88d080983132185a875ee6334cc88';
import { iconHTML } from './ui-icon.js?v=6eefd3a5e72d754fea063666baf3166c1c88b5e72db4ab97072da15565143b81';

const families = [...new Set(Object.values(POWER_TREES).map(p => p.family))];
const escape = text => String(text).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const powerImage = power => `<img draggable="false" src="${assetURL('icon/power/'+power+'.svg')}" alt="" width="32" height="32">`;
const button=(action,label,icon='add',extra='')=>`<button type="button" aria-label="${escape(label)}" data-tree-action="${action}" ${extra}>${iconHTML(icon)}<span>${label}</span></button>`;
const reasonText={'family-gate':'Earn this power through successful play.','insufficient-seeds':'Earn more Points by clearing pools.','mastery':'Clear 3 pools with this power activated.','prerequisite':'Unlock this power first.','over-budget':'Not enough tuning. Unequip an upgrade first.','invalid-equipment':'Add this power to your loadout first.'};

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
export function treeMount(controller){
 const dialog=document.getElementById('tree-dialog'),mobile=matchMedia('(max-width:760px)');
 let state=controller.get(),selected='ripple.base',family='Flow',confirmEquip=false,travel=0,travelling=false;
 let route=researchRoute(cat.nodes,POWER_TREES,FAMILY_UNLOCK,selected);
 dialog.innerHTML=`<header class="tree-heading">${button('back','Back','arrow-left')}<h2>Skill tree</h2><div class="tree-wallet-summary"></div>${button('guide','Guide','about')}</header><p class="tree-status" role="status" aria-live="polite"></p><div class="tree-workspace"><section class="tree-map-section" aria-label="Connected power tree"><div class="tree-target"></div><div class="tree-map-stage"><div class="tree-map-scroll" tabindex="0" aria-label="Skill tree map. Drag to pan; pinch or use zoom controls. Arrow keys move the map."><div class="tree-map"></div></div><div class="tree-camera-controls" aria-label="Map controls"><button type="button" data-tree-action="zoom-out" aria-label="Zoom out"><span aria-hidden="true">−</span></button><output class="tree-zoom" aria-label="Map zoom">85%</output>${button('zoom-in','Zoom in','add')}${button('fit','Fit tree','fullscreen-enable')}${button('focus','Focus','reset')}</div><span class="tree-map-hint">Drag to move · Pinch or scroll to zoom</span></div></section><aside class="tree-detail" aria-label="Selected upgrade"></aside></div><footer class="tree-legend" aria-label="Skill status legend"><span class="legend-active">Active</span><span class="legend-owned">Owned</span><span class="legend-available">Available</span><span class="legend-locked">Locked</span></footer>`;
 const layout=treeLayout(POWER_TREES,cat.nodes,FAMILY_UNLOCK),surface=dialog.querySelector('.tree-map-scroll'),mapElement=dialog.querySelector('.tree-map');
 let camera=mapCameraMount(surface,layout,view=>{mapElement.style.transform=`translate(${view.x}px,${view.y}px) scale(${view.scale})`;dialog.querySelector('.tree-zoom').textContent=Math.round(view.scale*100)+'%';dialog.querySelector('[data-tree-action=zoom-out]').disabled=view.scale<=.051;dialog.querySelector('[data-tree-action=zoom-in]').disabled=view.scale>=1.799;});
 const detail=dialog.querySelector('.tree-detail'),sheet=document.createElement('dialog');sheet.id='tree-sheet';sheet.setAttribute('aria-label','Upgrade details');sheet.innerHTML=`<header class="tree-sheet-heading"><span>Upgrade details</span>${button('done','Done','close')}</header><p class="tree-sheet-status" role="status" aria-live="polite"></p>`;document.body.append(sheet);
 const status=message=>{dialog.querySelector('.tree-status').textContent=message;sheet.querySelector('.tree-sheet-status').textContent=message;};
 function returnDetail(){dialog.querySelector('.tree-workspace').append(detail);if(travelling)return;detailRender();const source=dialog.querySelector(`[data-node="${selected}"]`);source?.focus({preventScroll:true});}
 sheet.addEventListener('close',returnDetail);dialog.addEventListener('close',()=>{if(sheet.open)sheet.close();});mobile.addEventListener('change',()=>{if(sheet.open)sheet.close();});
 function showDetail(id,positioned=false){travel++;travelling=false;camera.cancel();detail.hidden=false;selected=id;if(!positioned)camera.ensure(layout.nodes[id]);confirmEquip=false;detailRender();mapRender();if(mobile.matches){if(!positioned)camera.focus(layout.nodes[id],camera.value.scale,.12);sheet.querySelector('.tree-sheet-heading>span').textContent='Upgrade details';sheet.querySelector('.tree-sheet-status').textContent='';sheet.append(detail);sheet.showModal();}detail.querySelector('.tree-detail-body')?.scrollTo(0,0);}
 async function showPrerequisite(id){
  if(!layout.nodes[id])return;
  const request=++travel;travelling=true;detail.hidden=true;camera.cancel();
  if(sheet.open)await new Promise(resolve=>{sheet.addEventListener('close',resolve,{once:true});sheet.close();});
  if(request!==travel||!dialog.open)return;
  // Focus restoration from the dismissed sheet must not jump the camera.
  surface.focus({preventScroll:true});
  const reduced=matchMedia('(prefers-reduced-motion: reduce)').matches;
  const arrived=await camera.focusAnimated(layout.nodes[id],Math.max(.85,camera.value.scale),mobile.matches ? .12 : .25,reduced?0:450);
  if(request!==travel)return;travelling=false;
  if(arrived&&dialog.open)showDetail(id,true);
 }
 function nodeButton(n){const base=n.kind==='base',active=n.equipped||base&&state.powers.includes(n.power),locked=!n.owned&&!n.borrowed&&!n.buy.ok&&n.buy.reason!=='insufficient-seeds',available=n.buy.ok&&!n.borrowed&&state.phase==='shop',badge=n.borrowed?'clock':active||n.owned?'check':locked?'lock':null;
 const status=!n.owned&&!n.borrowed&&!locked?n.seedCost+' Points':'';
 return `<button type="button" data-node="${n.id}" data-kind="${n.kind}" class="skill-node ${base?'is-base':''} ${route.has(n.id)?'is-route':''} ${n.kind==='capstone'?'is-epic':''} ${n.owned?'is-owned':''} ${active?'is-active':''} ${available?'is-available':''} ${locked?'is-locked':''} ${n.borrowed?'is-borrowed':''}" style="--node-x:${layout.nodes[n.id].x}px;--node-y:${layout.nodes[n.id].y}px" aria-label="${escape(POWER_TREES[n.power].name+', '+n.name+', '+n.label)}" aria-pressed="${selected===n.id}"><span class="skill-orb">${n.kind==='capstone'?iconHTML('epic'):powerImage(n.power)}${!base?'<b>'+(['foundation','a','b','capstone'].indexOf(n.kind)+1)+'</b>':''}${badge?'<i class="skill-badge">'+iconHTML(badge)+'</i>':''}</span><strong>${escape(n.name)}</strong>${status?`<small>${status}</small>`:''}</button>`;
 }
 function mapRender(){
  route=researchRoute(cat.nodes,POWER_TREES,FAMILY_UNLOCK,selected);
  const goal=researchTarget(state);dialog.querySelector('.tree-target').innerHTML=goal?`<button type="button" data-node="${goal.id}">${iconHTML('star')}<span>${escape(goal.name)}<small>${escape(goal.text)}</small></span></button>`:'';
  const graphs=Object.keys(POWER_TREES).map(p=>powerGraph(state,p)),nodes=graphs.flatMap(g=>g.nodes),byId=Object.fromEntries(nodes.map(n=>[n.id,n]));
  const edges=layout.edges.map(e=>{const source=byId[e.from],target=byId[e.to];
   return `<path class="${target.owned?'is-active':source.owned?'is-open':'is-locked'} ${route.has(e.from)&&route.has(e.to)?'is-route':''}" data-from="${e.from}" data-to="${e.to}" d="${e.path}"/>`;}).join('');
  mapElement.style.width=layout.width+'px';mapElement.style.height=layout.height+'px';
  mapElement.innerHTML=`<svg class="tree-world-links" viewBox="0 0 ${layout.width} ${layout.height}" aria-hidden="true">${edges}</svg>`+Object.values(layout.families).map(f=>`<section class="skill-family" data-family-tree="${f.name}" aria-label="${f.name} powers">${f.powers.flatMap(p=>graphs.find(g=>g.nodes[0].power===p).nodes).map(nodeButton).join('')}</section>`).join('');
 }
 function controlsRender(){const tuning=progressionLoadout(state);
 dialog.querySelector('.tree-wallet-summary').innerHTML=`<strong>${iconHTML('coin')}${state.profile.wallet.seeds}<span> Points</span></strong><small>${state.profile.kind==='development'?'Test · ':''}${state.powerMode==='unlocked'?state.powers.length+' powers unlocked':tuning.tuning+'/'+(state.bypass?'∞':progressionBudget(state))+' tuning'}</small>`;
 }
 function detailRender(){const n=cat.nodes[selected],p=POWER_TREES[n.power],v=upgradeState(state,selected),base=n.kind==='base',inLoadout=state.powers.includes(n.power),mastery=profileSummary(state.profile,cat).mastery[n.power],unlock=powerUnlock(state,n.power),blocker=researchBlocker(state,selected),conflicts=n.conflicts.filter(id=>state.equipped.includes(id)),prerequisite=!v.owned&&!(v.borrowed&&state.powerMode!=='unlocked')&&v.buy.reason==='prerequisite'?n.requires.find(id=>!state.profile.research[id]):null;
 let primary='';
 if(!v.owned)primary=button('buy',`${base?'Unlock':'Research'} · ${n.seedCost} Points`,'add',`class="primary" ${!v.buy.ok||state.phase!=='shop'?'disabled':''}`);
 if(!base&&(v.owned||v.borrowed&&state.powerMode!=='unlocked'))primary=state.powerMode==='unlocked'?(n.conflicts.length&&!v.equipped?button('equip','Use this style','switches',`class="primary" ${blocker?'disabled':''}`):'<p class="build-ready">'+iconHTML('check')+'Active automatically</p>'):button('equip',v.equipped?'Unequip upgrade':'Equip upgrade',v.equipped?'check':'add',`class="primary" ${blocker?'disabled':''}`);
 if(base&&v.owned)primary=state.powerMode==='unlocked'?'<p class="build-ready">'+iconHTML('dice-four')+'Can appear during play</p>':inLoadout?'<p class="build-ready">'+iconHTML('check')+'In your loadout</p>':`<label for="tree-slot">Replace</label><select id="tree-slot" ${state.phase!=='shop'?'disabled':''}>${state.powers.map((id,i)=>`<option value="${i}">${POWER_TREES[id].name}</option>`).join('')}</select>${button('replace','Use '+p.name,'check',`class="primary" ${state.phase!=='shop'?'disabled':''}`)}`;
 if(prerequisite)primary=button('research-first','Research '+escape(cat.nodes[prerequisite].name)+' first','arrow-right',`class="primary" data-prerequisite="${prerequisite}"`);
 detail.innerHTML=`<div class="tree-detail-body"><div class="tree-detail-title">${powerImage(n.power)}<div><small>${p.name}${base?'':' · '+(n.kind==='capstone'?'Epic upgrade':'Upgrade')}</small><h3>${escape(n.name)}</h3></div></div><p class="upgrade-state">${iconHTML(v.icon)}${escape(prerequisite?'Prerequisite required':v.label)}</p><p class="tree-description">${escape(n.description)}</p>${n.unlocks.map(p=>`<button type="button" data-node="${p}.base" class="family-link">${iconHTML('arrow-right')}${v.owned?'Opens':'Also unlocks'} ${POWER_TREES[p].name}</button>`).join('')}<div class="tree-cost"><span>${v.owned?'Permanently owned':v.borrowed?'Borrowed for this run':n.seedCost+' Points'}</span>${state.powerMode==='unlocked'?'':'<span>'+n.tuningCost+' tuning</span>'}</div>${base&&unlock?`<p class="tree-requirement">${escape(unlock.description)}</p>`:''}${n.masteryPools?`<p class="tree-requirement">${Math.min(3,mastery)}/3 cleared pools with ${p.name} activated.</p>`:''}${n.conflictReason?`<p class="tree-requirement">${escape(n.conflictReason)} Both can be owned.</p>`:''}<div class="tree-secondary">${button('pin',state.target===selected?'Unpin goal':'Set research goal','star')}</div><details class="tree-reference"><summary>Advanced reference</summary><p>Research follows the connected chain beneath each power. Existing purchases and temporary discoveries remain usable. Compatible upgrades combine; conflicting modes remain freely switchable.</p><p>${escape(p.current)}</p><p>Legacy configuration: ${p.today.map(k=>k==='base'?'Base power':cat.nodes[n.power+'.'+k].name).join(' + ')}${p.legacyMatch===false?' (shorter history in Song Run)':''}.</p></details>${confirmEquip?`<section class="tree-confirm"><strong>Replace ${conflicts.map(id=>cat.nodes[id].name).join(', ')}?</strong><p>Both styles remain unlocked. Only one force shape can be active at a time.</p>${button('confirm-equip','Use this style','check')}${button('cancel','Cancel','close')}</section>`:''}</div><footer class="tree-purchase"><p>${escape((prerequisite?(state.phase!=='shop'?'Research opens after this run.':''):blocker)||(!v.owned&&!prerequisite?'Purchases are permanent. Unlocked powers and upgrades join your game automatically.':''))}</p>${primary}</footer>`;
 }
 function render(){const active=document.activeElement,key=['treeAction','node'].find(k=>active?.dataset?.[k]),value=active?.dataset?.[key],attrs={treeAction:'data-tree-action',node:'data-node'};controlsRender();mapRender();detailRender();if(key)(sheet.open?sheet:dialog).querySelector(`[${attrs[key]}="${value}"]:not(:disabled)`)?.focus({preventScroll:true});}
 function familySelect(value){family=value;if(family!=='All')selected=Object.keys(POWER_TREES).find(p=>POWER_TREES[p].family===family)+'.base';status('');detailRender();mapRender();if(family==='All')camera.fit();else camera.focus(layout.nodes[layout.families[family].starter],1);}
 dialog.addEventListener('close',()=>camera.cancel());
 surface.addEventListener('focusin',e=>{const id=e.target.closest('[data-node]')?.dataset.node;if(id&&!travelling&&e.target.matches(':focus-visible'))camera.ensure(layout.nodes[id]);});
 function guide(){travel++;travelling=false;camera.cancel();detail.hidden=false;const running=state.phase!=='shop';sheet.querySelector('.tree-sheet-heading>span').textContent='Skill tree guide';sheet.append(detail);detail.innerHTML=`<div class="tree-detail-body"><h3>One tree, your branches</h3><p>Ripple is the single starting power. Follow a line from an owned upgrade to unlock its next skill. Every power has a straight four-upgrade chain; some upgrades also open related powers on side branches. You can grow every branch over time.</p><p>Points buy permanent research. Purchases cannot be refunded. Compatible upgrades activate automatically. Epic upgrades also need three cleared pools with that power activated. Existing purchases stay owned.</p><h3>Explore the map</h3><p>Drag in any direction. Pinch or scroll to zoom. Tap a node for its effect, price and exact prerequisite. The gold path leads back to Ripple. Arrow keys move the map or move between nodes.</p><p>Settings → Accessibility → Show on-screen controls adds zoom, Fit tree and Focus buttons. Active nodes glow mint, owned nodes show a check, available research has a gold border, and locked nodes show a lock.</p><section class="tree-extra"><h3>Run options</h3>${!running?button('relaxed',state.relaxed?'Relaxed · 8 plucks':'Standard · 6 plucks','switches'):button('end-ask','End this run','reset')}</section></div>`;sheet.showModal();}

 function handle(event){const node=event.target.closest('[data-node]'),a=event.target.closest('[data-tree-action]');
 if(node){showDetail(node.dataset.node);return;}if(!a)return;
 let type=a.dataset.treeAction;
 if(type==='research-first'){showPrerequisite(a.dataset.prerequisite);return;}
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
 function open(focusFamily){travel++;travelling=false;detail.hidden=false;if(families.includes(focusFamily)){family=focusFamily;selected=Object.keys(POWER_TREES).find(p=>POWER_TREES[p].family===family)+'.base';}controller.screen?.();document.querySelectorAll('dialog[open]').forEach(d=>d.close());state=controller.get();status('');render();dialog.showModal();if(family==='All')camera.fit();else camera.focus(layout.nodes[selected],.85,.12);dialog.querySelector('[data-tree-action=back]').focus({preventScroll:true});}
 render();if(new URL(location.href).searchParams.get('view')==='tree')open();return {open,refresh(){state=controller.get();render();}};
}
