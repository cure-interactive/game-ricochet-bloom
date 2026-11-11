import { BUILD_EXAMPLES } from './upgrade-preview.js?v=52a4151395c46b8a6c645c14cd51e43d33df8f63809f3723ece264b80d2db951';
import { trackGet } from './track.js?v=ff2e6bff1b7be4153335e346786927680ea20b642555b591226b0cfb27ff13ff';
import { POWER_TREES } from './power-tree.js?v=2ddf449ce328f8cc92262395a8ecacc7f5d7a653c9df225d5b7c296f7596bc3c';
import { familyGate, familyProgress } from './catalogue.js?v=58b3459a4c473401e11796ed487ddd13bcb440b9ea55bcad1fb6aff3a3f26669';
import { profilePurchase, profileSummary } from './profile.js?v=52071900e30e746c3327ad7b72c025ea66b8f6222cf9c8c8b7e965c4a9126d7b';
import { researchTarget, progressionBudget, progressionLoadout, GAME_CATALOGUE as cat, POOL_NAMES, GOALS } from './run.js?v=148a5f169da1217c4bf8568fceecfa64111f2f258338b47250e11bf6d7d0e0b9';
import { assetURL } from './asset.js?v=702ecbe37f35afa96b95db6e49c578f7cd2be014d782640f9bbab8bd04850404';
import { iconHTML } from './ui-icon.js?v=6eefd3a5e72d754fea063666baf3166c1c88b5e72db4ab97072da15565143b81';

const families = [...new Set(Object.values(POWER_TREES).map(p => p.family))];
const escape = text => String(text).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const powerImage = power => `<img src="${assetURL('icon/power/'+power+'.svg')}" alt="" width="32" height="32">`;
const button=(action,label,icon='add',extra='')=>`<button type="button" aria-label="${escape(label)}" data-tree-action="${action}" ${extra}>${iconHTML(icon)}<span>${label}</span></button>`;
const familyCopy={Motion:'Speed, banks and bounces',Flow:'Gather, push and circulate',Control:'Freeze, tether and orbit',Propagation:'Shots, echoes and chain reactions',Navigation:'Steer, swap and teleport'};
const reasonText={'family-gate':'Earn this power through successful play.','insufficient-seeds':'Earn more Points by clearing pools.','mastery':'Clear 3 pools with this power activated.','prerequisite':'Unlock this power first.','over-budget':'Not enough tuning. Unequip an upgrade first.','invalid-equipment':'Add this power to your loadout first.'};

// Explain the same gate used by purchases, beside the affected power.
export function powerUnlock(state,power){
 const p=POWER_TREES[power],gate=familyGate(state.profile,power,cat);
 if(state.profile.kind==='development'||state.profile.research[power+'.base']||gate.ok)return null;
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
 else {label=buy.reason==='mastery'?'Needs mastery':buy.reason==='prerequisite'?'Unlock power first':powerUnlock(state,n.power)?.remaining||'Play to unlock';icon='lock';}
 return {owned,borrowed,equipped,buy,label,icon};
}
export function researchBlocker(state,id){
 const n=cat.nodes[id],v=upgradeState(state,id);
 if(state.powerMode==='unlocked'&&(v.owned||v.borrowed))return n.conflicts.length&&state.phase==='run'?'Finish this pool to change style.':'';
 if(v.owned&&n.kind==='base')return state.phase!=='shop'&&!state.powers.includes(n.power)?'Change powers after this run.':'';
 if(v.owned||v.borrowed){
  if(state.phase==='run')return 'Finish this pool to retune.';
  if(!state.powers.includes(n.power))return 'Add this power to your loadout to equip upgrades.';
  const used=state.equipped.filter(x=>!n.conflicts.includes(x)).reduce((sum,x)=>sum+cat.nodes[x].tuningCost,0),extra=used+n.tuningCost-progressionBudget(state);
  return !v.equipped&&!state.bypass&&extra>0?`Free ${extra} tuning by unequipping another upgrade.`:'';
 }
 const missing=[];
 if(state.phase!=='shop')missing.push('Research opens after this run.');
 if(!v.buy.ok)missing.push(v.buy.reason==='mastery'?`Clear ${Math.max(0,3-profileSummary(state.profile,cat).mastery[n.power])} more pools with ${POWER_TREES[n.power].name} activated.`:v.buy.reason==='insufficient-seeds'?`Need ${n.seedCost-state.profile.wallet.seeds} more Points.`:(v.buy.reason==='family-gate'?powerUnlock(state,n.power)?.remaining:reasonText[v.buy.reason])||v.buy.reason);
 return missing.join(' ');
}
// Every drawn upgrade edge comes from the same prerequisites as purchasing.
export function powerGraph(state,power){
 const nodes=Object.values(cat.nodes).filter(n=>n.power===power);
 return {nodes:nodes.map(n=>({...n,...upgradeState(state,n.id)})),edges:nodes.flatMap(n=>n.requires.map(from=>({from,to:n.id})))};
}
export function treeMount(controller){
 const dialog=document.getElementById('tree-dialog'),mobile=matchMedia('(max-width:760px)');
 let state=controller.get(),selected='comet.base',family=mobile.matches?'Motion':'All',confirmEquip=false;
 dialog.innerHTML=`<header class="tree-heading">${button('back','Back','arrow-left')}<h2>Skill tree</h2><div class="tree-wallet-summary"></div>${button('guide','Guide','about')}</header><p class="tree-status" role="status" aria-live="polite"></p><div class="tree-workspace"><section class="tree-map-section" aria-label="Connected power tree"><div class="tree-map-toolbar"><label for="tree-family-select">Family</label><select id="tree-family-select" aria-label="Power family">${['All',...families].map(f=>`<option value="${f}">${f==='All'?'All families':f}</option>`).join('')}</select><div class="tree-legend"><span class="legend-active">Active</span><span class="legend-owned">Owned</span><span class="legend-available">Available</span><span class="legend-locked">Locked</span></div><div class="tree-target"></div></div><div class="tree-map-scroll" tabindex="0" aria-label="Skill tree branches"><div class="tree-map"></div></div></section><aside class="tree-detail" aria-label="Selected upgrade"></aside></div><footer class="tree-actions"></footer>`;
 const detail=dialog.querySelector('.tree-detail'),sheet=document.createElement('dialog');sheet.id='tree-sheet';sheet.setAttribute('aria-label','Upgrade details');sheet.innerHTML=`<header class="tree-sheet-heading"><span>Upgrade details</span>${button('done','Done','close')}</header><p class="tree-sheet-status" role="status" aria-live="polite"></p>`;document.body.append(sheet);
 const status=message=>{dialog.querySelector('.tree-status').textContent=message;sheet.querySelector('.tree-sheet-status').textContent=message;};
 function returnDetail(){dialog.querySelector('.tree-workspace').append(detail);detailRender();const source=dialog.querySelector(`[data-node="${selected}"]`);source?.focus({preventScroll:true});}
 sheet.addEventListener('close',returnDetail);dialog.addEventListener('close',()=>{if(sheet.open)sheet.close();});mobile.addEventListener('change',()=>{if(sheet.open)sheet.close();});
 function showDetail(id){selected=id;confirmEquip=false;detailRender();mapRender();if(mobile.matches){sheet.querySelector('.tree-sheet-heading>span').textContent='Upgrade details';sheet.querySelector('.tree-sheet-status').textContent='';sheet.append(detail);sheet.showModal();}detail.querySelector('.tree-detail-body')?.scrollTo(0,0);}
 const positions={base:[50,42],foundation:[22,128],a:[78,128],b:[22,222],capstone:[78,222]};
 function nodeButton(n){const base=n.kind==='base',active=n.equipped||base&&state.powers.includes(n.power),locked=!n.owned&&!n.borrowed&&!n.buy.ok&&n.buy.reason!=='insufficient-seeds',available=n.buy.ok&&!n.borrowed&&state.phase==='shop',badge=n.borrowed?'clock':active||n.owned?'check':locked?'lock':null;
 const status=n.borrowed?'This run':active?'Active':n.owned?'Owned':locked?n.buy.reason==='mastery'?'Mastery':base?powerUnlock(state,n.power)?.short||'Play to unlock':'Unlock power':n.seedCost+' Points';
 return `<button type="button" data-node="${n.id}" data-kind="${n.kind}" class="skill-node ${base?'is-base':''} ${n.kind==='capstone'?'is-epic':''} ${n.owned?'is-owned':''} ${active?'is-active':''} ${available?'is-available':''} ${locked?'is-locked':''} ${n.borrowed?'is-borrowed':''}" style="--node-x:${positions[n.kind][0]}%;--node-y:${positions[n.kind][1]}px" aria-label="${escape(POWER_TREES[n.power].name+', '+n.name+', '+n.label)}" aria-pressed="${selected===n.id}"><span class="skill-orb">${base?powerImage(n.power):iconHTML(n.kind==='capstone'?'epic':n.kind==='foundation'?'add':'switches')}${['a','b'].includes(n.kind)?'<b>'+n.kind.toUpperCase()+'</b>':''}${badge?'<i class="skill-badge">'+iconHTML(badge)+'</i>':''}</span><strong>${escape(n.name)}</strong><small>${status}</small></button>`;
 }
 function powerBranch(power){const graph=powerGraph(state,power),base=graph.nodes[0],count=graph.nodes.filter(n=>n.kind!=='base'&&n.owned).length;
 const edges=[...graph.edges].sort((a,b)=>Number(graph.nodes.find(n=>n.id===a.to).owned||graph.nodes.find(n=>n.id===a.to).equipped)-Number(graph.nodes.find(n=>n.id===b.to).owned||graph.nodes.find(n=>n.id===b.to).equipped)).map(e=>{const target=graph.nodes.find(n=>n.id===e.to),[x,y]=positions[target.kind],ready=base.owned||base.borrowed,on=target.equipped||target.owned;return `<path class="${on?'is-active':ready?'is-open':'is-locked'}" data-from="${e.from}" data-to="${e.to}" d="M150 68 V${y} H${x*3}"/>`;}).join('');
 return `<section class="power-branch" aria-label="${POWER_TREES[power].name} upgrades"><svg class="skill-connections" viewBox="0 0 300 270" preserveAspectRatio="none" aria-hidden="true">${edges}</svg>${graph.nodes.map(nodeButton).join('')}<span class="branch-progress">${count}/4 researched</span></section>`;
 }
 function familyTree(f){const progress=familyProgress(state.profile,f,cat),powers=Object.keys(POWER_TREES).filter(p=>POWER_TREES[p].family===f),owned=powers.filter(p=>state.profile.research[p+'.base']).length;
 const tiers=[1,2,3].map(t=>{const open=state.profile.kind==='development'||progress.tier>=t,ids=powers.filter(p=>POWER_TREES[p].tier===t);if(!ids.length)return '';
 return `<section class="skill-tier ${open?'is-open':'is-locked'}" aria-label="${ids.map(p=>POWER_TREES[p].name).join(', ')}"><div class="tier-branches">${ids.map(powerBranch).join('')}</div></section>`;}).join('');
 return `<section class="skill-family" data-family-tree="${f}"><header class="family-title"><div><h3>${f}</h3><p>${familyCopy[f]}</p></div><small>${owned}/${powers.length} owned</small></header>${tiers}</section>`;
 }
 function mapRender(){dialog.querySelector('#tree-family-select').value=family;const goal=researchTarget(state);dialog.querySelector('.tree-target').innerHTML=goal?`<button type="button" data-node="${goal.id}">${iconHTML('star')}<span>${escape(goal.name)}<small>${escape(goal.text)}</small></span></button>`:'';const map=dialog.querySelector('.tree-map');map.dataset.overview=String(family==='All');map.innerHTML=(family==='All'?families:[family]).map(familyTree).join('');}
 function controlsRender(){const tuning=progressionLoadout(state);
 dialog.querySelector('.tree-wallet-summary').innerHTML=`<strong>${iconHTML('seed')}${state.profile.wallet.seeds}<span> Points</span></strong><small>${state.profile.kind==='development'?'Test · ':''}${state.powerMode==='unlocked'?state.powers.length+' powers unlocked':tuning.tuning+'/'+(state.bypass?'∞':progressionBudget(state))+' tuning'}</small>`;
 dialog.querySelector('.tree-actions').innerHTML=`${button('campaign','Level select','grid')}${button('play',state.phase==='run'?'Resume pool':state.phase==='interlude'?'Continue run':'Play '+trackGet(state.track).name,'play','class="primary"')}`;
 }
 function detailRender(){const n=cat.nodes[selected],p=POWER_TREES[n.power],v=upgradeState(state,selected),base=n.kind==='base',inLoadout=state.powers.includes(n.power),mastery=profileSummary(state.profile,cat).mastery[n.power],unlock=powerUnlock(state,n.power),blocker=researchBlocker(state,selected),conflicts=n.conflicts.filter(id=>state.equipped.includes(id));
 let primary='';
 if(!v.owned)primary=button('buy',`${base?'Unlock':'Research'} · ${n.seedCost} Points`,'add',`class="primary" ${!v.buy.ok||state.phase!=='shop'?'disabled':''}`);
 if(!base&&(v.owned||v.borrowed))primary=state.powerMode==='unlocked'?(n.conflicts.length&&!v.equipped?button('equip','Use this style','switches',`class="primary" ${blocker?'disabled':''}`):'<p class="build-ready">'+iconHTML('check')+'Active automatically</p>'):button('equip',v.equipped?'Unequip upgrade':'Equip upgrade',v.equipped?'check':'add',`class="primary" ${blocker?'disabled':''}`);
 if(base&&v.owned)primary=state.powerMode==='unlocked'?'<p class="build-ready">'+iconHTML('dice-four')+'Can appear during play</p>':inLoadout?'<p class="build-ready">'+iconHTML('check')+'In your loadout</p>':`<label for="tree-slot">Replace</label><select id="tree-slot" ${state.phase!=='shop'?'disabled':''}>${state.powers.map((id,i)=>`<option value="${i}">${POWER_TREES[id].name}</option>`).join('')}</select>${button('replace','Use '+p.name,'check',`class="primary" ${state.phase!=='shop'?'disabled':''}`)}`;
 const loan=state.powerMode!=='unlocked'&&!base&&inLoadout&&!v.owned&&state.phase==='shop'&&n.kind!=='capstone';
 detail.innerHTML=`<div class="tree-detail-body"><div class="tree-detail-title">${powerImage(n.power)}<div><small>${p.name}${base?'':' · '+(n.kind==='capstone'?'Epic upgrade':'Upgrade')}</small><h3>${escape(n.name)}</h3></div></div><p class="upgrade-state">${iconHTML(v.icon)}${escape(v.label)}</p><p class="tree-description">${escape(n.description)}</p><div class="tree-cost"><span>${v.owned?'Permanently owned':v.borrowed?'Borrowed for this run':n.seedCost+' Points'}</span>${state.powerMode==='unlocked'?'':'<span>'+n.tuningCost+' tuning</span>'}</div>${base&&unlock?`<p class="tree-requirement">${escape(unlock.description)}</p>${button('family-help','View '+p.family+' powers','network-node-three')}`:''}${n.masteryPools?`<p class="tree-requirement">${Math.min(3,mastery)}/3 cleared pools with ${p.name} activated.</p>`:''}${n.conflictReason?`<p class="tree-requirement">${escape(n.conflictReason)} Both can be owned.</p>`:''}<div class="tree-secondary">${button('compare','Preview effect','gamepad')}${button('pin',state.target===selected?'Unpin goal':'Set research goal','star')}</div>${loan?`<details><summary>Try a starting loan</summary><p>Choose up to two free loans before a run. Research keeps upgrades available without using a loan slot. More powers become available through successful play.</p>${button('borrow',v.borrowed?'Return this loan':'Borrow upgrade','clock',!v.borrowed&&state.borrowed.length>=2?'disabled':'')}${v.borrowed?button('buy',`Research permanently · ${n.seedCost} Points`,'coin',!v.buy.ok?'disabled':'')+(!v.buy.ok?'<p>'+escape(v.buy.reason==='insufficient-seeds'?`Need ${n.seedCost-state.profile.wallet.seeds} more Points.`:reasonText[v.buy.reason])+'</p>':''):''}${!v.borrowed&&state.borrowed.length>=2?'<p>Both loans are in use. Return one from its upgrade details first.</p>':''}</details>`:''}<details class="tree-reference"><summary>Advanced reference</summary><p>Every upgrade needs only its base power. Compatible upgrades combine; conflicting modes remain freely switchable.</p><p>${escape(p.current)}</p><p>Legacy configuration: ${p.today.map(k=>k==='base'?'Base power':cat.nodes[n.power+'.'+k].name).join(' + ')}${p.legacyMatch===false?' (shorter history in Song Run)':''}.</p></details>${confirmEquip?`<section class="tree-confirm"><strong>Replace ${conflicts.map(id=>cat.nodes[id].name).join(', ')}?</strong><p>Both styles remain unlocked. Only one force shape can be active at a time.</p>${button('confirm-equip','Use this style','check')}${button('cancel','Cancel','close')}</section>`:''}</div><footer class="tree-purchase"><p>${escape(blocker||(!v.owned?'Purchases are permanent. Unlocked powers and upgrades join your game automatically.':''))}</p>${primary}</footer>`;
 }
 function render(){const active=document.activeElement,key=['treeAction','node'].find(k=>active?.dataset?.[k]),value=active?.dataset?.[key],attrs={treeAction:'data-tree-action',node:'data-node'};controlsRender();mapRender();detailRender();if(key)(sheet.open?sheet:dialog).querySelector(`[${attrs[key]}="${value}"]:not(:disabled)`)?.focus({preventScroll:true});}
 function familySelect(value){family=value;if(family!=='All')selected=Object.keys(POWER_TREES).find(p=>POWER_TREES[p].family===family)+'.base';status('');detailRender();mapRender();dialog.querySelector('.tree-map-scroll').scrollTo(0,0);}
 dialog.querySelector('#tree-family-select').onchange=e=>familySelect(e.target.value);
 function guide(){const running=state.phase!=='shop';sheet.querySelector('.tree-sheet-heading>span').textContent='Skill tree guide';sheet.append(detail);detail.innerHTML=`<div class="tree-detail-body"><h3>Reading the tree</h3><p>Each large node unlocks a power. Its four connected upgrades are independent choices: none requires another upgrade. Epic nodes also need mastery.</p><p>Active nodes glow mint. Owned nodes have a check, affordable research has a gold border, and locked nodes show a lock. Tap any node for its effects, requirements and preview. Every unlocked power can appear at random on jellies.</p><p>Points buy permanent research. Purchases cannot be refunded. Compatible upgrades activate automatically. Change a conflicting style from its node; both remain owned. Temporary discoveries are marked “This run”.</p><p>Locked powers show how many qualifying clears or different powers you still need. Tap one for the exact requirement. A clear counts only when a power from that family activated during the pool. You do not need to buy every earlier power.</p><p>Use the Family selector to focus one branch on a phone, or view All families. Scroll to follow the paths. Keyboard: Tab selects nodes; arrow keys move between the upgrades of a power.</p><section class="tree-extra"><h3>Practice & run options</h3><div>${!running?button('tutorial',state.profile.rewards.some(r=>r.event.type==='tutorial')?'Bloom practice':'Learn to bloom · 4 Points','book')+button('relaxed',state.relaxed?'Relaxed · 8 plucks':'Standard · 6 plucks','switches'):button('end-ask','End this run','reset')}</div><p>Try a combination without spending Points.</p>${BUILD_EXAMPLES.map(x=>`<button type="button" data-example="${x.id}">${iconHTML('gamepad')}<span>${x.name}<small>${x.powers.map(p=>POWER_TREES[p].name).join(' + ')}</small></span></button>`).join('')}</section></div>`;sheet.showModal();}
 function handle(event){const node=event.target.closest('[data-node]'),ex=event.target.closest('[data-example]'),a=event.target.closest('[data-tree-action]');
 if(node){showDetail(node.dataset.node);return;}if(ex){controller.open('compare',ex.dataset.example);return;}if(!a)return;
 let type=a.dataset.treeAction;
 if(type==='back'){controller.back?.();return;}if(type==='done'){sheet.close();return;}if(type==='guide'){guide();return;}
 if(type==='power-detail'){showDetail(a.dataset.power+'.base');return;}
 if(type==='family-help'){family=POWER_TREES[cat.nodes[selected].power].family;if(sheet.open)sheet.close();mapRender();return;}
 if(type==='cancel'){confirmEquip=false;detailRender();return;}
 if(type==='end-ask'){a.disabled=true;const controls=detail.querySelector('.tree-detail-body');controls.insertAdjacentHTML('beforeend',`<section class="tree-confirm"><p>End the run? Earned Points stay. Loans return.</p>${button('abandon','End run','check')}${button('keep-run','Keep playing','arrow-left')}</section>`);controls.lastElementChild.scrollIntoView({block:'nearest'});return;}
 if(type==='keep-run'){a.closest('.tree-confirm').remove();detail.querySelector('[data-tree-action=end-ask]').disabled=false;return;}
 if(['play','compare','tutorial','campaign'].includes(type)){const r=controller.open(type,selected);if(r?.reason)status(r.reason);return;}
 if(type==='equip'&&!state.equipped.includes(selected)&&cat.nodes[selected].conflicts.some(id=>state.equipped.includes(id))){confirmEquip=true;detailRender();detail.querySelector('.tree-confirm')?.scrollIntoView({block:'nearest'});return;}
 if(type==='confirm-equip')type='equip';
 const r=controller.act({type,id:type==='pin'&&state.target===selected?null:selected,power:cat.nodes[selected].power,slot:Number(detail.querySelector('#tree-slot')?.value)});
 if(r.ok){state=controller.get();confirmEquip=false;if(sheet.open&&['abandon','relaxed'].includes(type))sheet.close();render();status(r.message);}else status(reasonText[r.reason]||r.reason);
 }
 dialog.addEventListener('keydown',event=>{const from=event.target.closest('.skill-node'),direction={ArrowLeft:[-1,0],ArrowRight:[1,0],ArrowUp:[0,-1],ArrowDown:[0,1]}[event.key];if(!from||!direction)return;const a=from.getBoundingClientRect(),x=a.x+a.width/2,y=a.y+a.height/2;const nearest=[...from.closest('.power-branch').querySelectorAll('.skill-node')].filter(n=>n!==from).map(n=>{const b=n.getBoundingClientRect(),dx=b.x+b.width/2-x,dy=b.y+b.height/2-y,dot=dx*direction[0]+dy*direction[1];return {n,dot,distance:Math.hypot(dx,dy)+Math.abs(dx*direction[1]-dy*direction[0])};}).filter(n=>n.dot>1).sort((a,b)=>a.distance-b.distance)[0];if(nearest){event.preventDefault();nearest.n.focus();}});
 dialog.addEventListener('click',handle);sheet.addEventListener('click',handle);dialog.addEventListener('cancel',e=>{e.preventDefault();controller.back?.();});
 function open(focusFamily){if(families.includes(focusFamily)){family=focusFamily;selected=Object.keys(POWER_TREES).find(p=>POWER_TREES[p].family===family)+'.base';}controller.screen?.();document.querySelectorAll('dialog[open]').forEach(d=>d.close());state=controller.get();status('');render();dialog.showModal();dialog.querySelector('[data-tree-action=back]').focus({preventScroll:true});}
 document.getElementById('tree-open').onclick=open;render();if(new URL(location.href).searchParams.get('view')==='tree')open();return {open,refresh(){state=controller.get();render();}};
}
