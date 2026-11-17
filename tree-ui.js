import {rememberView} from './navigation-state.js?v=8f540f6be269a8759011349f3d0983c46c7ea4c71a6728e0324dba8b0e6e72e8';
import {skillTreeHTML,skillTreeMount} from './skill-tree.js?v=fc705afab5fe68a8259a4f61d5a9d38147917615fe3eaaa6fd421a0111086fd5';
import {skillNodeHTML,skillLegendMount,showSkillCard} from './skill-card.js?v=d91171ea80b72ed4649072bd2f1fe316190493aba55201b79df70cd6da29fa26';
export {skillStatsHTML} from './skill-card.js?v=d91171ea80b72ed4649072bd2f1fe316190493aba55201b79df70cd6da29fa26';
import { treeSwitchMount } from './tree-switch.js?v=119456af51c3c858f432bd8494d48280fb10b8b53204f05a344665f5b5d95d8c';
import { escapeHTML as escape } from './ui-text.js?v=02f24218cfade2c1cf218f107876f5365ad03a4287cebbb4b8e0817ce89eb0d0';
import { purchaseComparison, skillStats } from './skill-comparison.js?v=e119e7889e9522c1824e23706bc469b3fbfd5be7702c253a00c4ee264ae53a73';
import { RARITIES } from './skill-trait.js?v=e149e64c177320afd3c752be9033b394aef97e73f55b5752d3400d5b2928eee9';
import { treeLayout, researchRoute, researchBounds, researchLayout } from './tree-map.js?v=036d0d778228999f61ece74251473ecb2f0e6eda12f39d560a593090f6f89568';
import { POWER_TREES } from './power-tree.js?v=2a64a8c4a0ad6dc1f93d8385f13952b46869143cbf7dc606ecd40164a825481b';
import { profilePurchase, profileSummary } from './profile.js?v=6e2f55bc3e634f44abda0bba37ac84a494ca47497058fe0850adbf1df9ec6610';
import { progressionBudget, GAME_CATALOGUE as cat } from './run.js?v=49c69ba715be180502075f8d03373783a6385189ac7faa63780fbe40e8c853a8';
import { iconHTML } from './ui-icon.js?v=35ef67d69b283afcc7c65c45f76a6dee06daf0fc829eafd4dff245d7c24940c0';
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
 let state=controller.get(),selected='ripple.base',tip=null,tipId=null;
 const fullLayout=treeLayout(POWER_TREES,cat.nodes),world={x:0,y:0,width:fullLayout.width,height:fullLayout.height};
 let layout=fullLayout,visiblePositions={};
 dialog.innerHTML=skillTreeHTML('powers');
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
 const tree=skillTreeMount(dialog,world,{selected:()=>selected,onMove:hideTooltip}),camera=tree.camera;
 function selectionRender(){
   const route=researchRoute(cat.nodes,selected);
   tree.select(selected,route);
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
   const nodeMarkup=Object.keys(POWER_TREES).filter(power=>nodes.some(n=>n.power===power)).map(power=>`<section class="skill-power" data-power-tree="${power}" aria-label="${POWER_TREES[power].name} skills">${nodes.filter(n=>n.power===power).map(nodeButton).join('')}</section>`).join('');
   tree.render(visiblePositions,nodeMarkup,edges);selectionRender();if(dialog.open){camera.refresh();const point=layout.nodes[selected];if(point&&(point.x!==previous?.x||point.y!==previous?.y))camera.focus(point,camera.value.scale);}
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
   if(!tip.contains(event.target))hideTooltip();
 }
 dialog.addEventListener('pointerdown',event=>{if(!tip.contains(event.target)&&!event.target.closest('.skill-node'))hideTooltip();});
 dialog.addEventListener('keydown',event=>{
   if(event.key==='Escape'&&!legendContent.hidden){event.preventDefault();event.stopPropagation();setLegend(false);legend.focus({preventScroll:true});return;}
   if(event.key==='Escape'&&!tip.hidden){event.preventDefault();event.stopPropagation();hideTooltip(true);return;}

 });
 dialog.addEventListener('click',handle);
 dialog.addEventListener('cancel',event=>{event.preventDefault();if(!legendContent.hidden)setLegend(false);else if(!tip.hidden)hideTooltip(true);else controller.back?.();});

 function open(focusSkill){
   if(cat.nodes[focusSkill])selected=focusSkill;controller.screen?.();document.querySelectorAll('dialog[open]').forEach(d=>d.close());
   state=controller.get();status('');setLegend(false);render();dialog.showModal();camera.focus(layout.nodes[selected]||{x:100,y:90},.85,.12);dialog.querySelector('[data-tree-action=back]').focus({preventScroll:true});
 }
 rememberView(dialog,'selection',()=>selected,id=>{if(cat.nodes[id]){selected=id;selectionRender();}},20);
 render();if(new URL(location.href).searchParams.get('view')==='tree')open();return {open,refresh(){state=controller.get();render();}};
}
