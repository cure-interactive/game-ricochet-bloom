import {rememberView} from './navigation-state.js?v=8f540f6be269a8759011349f3d0983c46c7ea4c71a6728e0324dba8b0e6e72e8';
import {skillTreeHTML,skillTreeMount} from './skill-tree.js?v=3b4a9c217ad2120a306b4cbe8fb902a38e5caa80c2df201ea64ae4c3f310e86c';
import {skillNodeHTML,skillLegendMount,showSkillCard} from './skill-card.js?v=d91171ea80b72ed4649072bd2f1fe316190493aba55201b79df70cd6da29fa26';
import {playerSkillStats} from './player-skill-comparison.js?v=75decfaf5d896b3fa9b10253c26385c4360916c8de20e0a52f71bc51d9fde36b';
import {RARITIES} from './skill-trait.js?v=e149e64c177320afd3c752be9033b394aef97e73f55b5752d3400d5b2928eee9';
import {playerTreeGraph} from './player-tree.js?v=b15b2a9ffb2bafb64fb904e9c81ab2a03024cc1e947689b503659df569e5746a';
import {treeSwitchMount} from './tree-switch.js?v=6b3c6ac08f059fe36591c8ccf6cae8e5480db26f7f8fa0eb3ef1fa13f93bf050';
import {iconHTML} from './ui-icon.js?v=35ef67d69b283afcc7c65c45f76a6dee06daf0fc829eafd4dff245d7c24940c0';

const rules='Every purchased upgrade stacks permanently. Open pools apply purchases between shots; Melody Journey applies them from the next pool. Score Attack fixes them at the start of a run. Fixed trials and shared challenges keep their authored rules.';

export function playerUpgradeMount(host){
 const dialog=document.createElement('dialog');dialog.id='player-upgrade-dialog';dialog.setAttribute('aria-label','Player Skills');
 dialog.innerHTML=skillTreeHTML('player');
 document.body.append(dialog);
 const map=dialog.querySelector('.tree-map'),stage=dialog.querySelector('.tree-map-stage'),tip=dialog.querySelector('.skill-tooltip');
 const {legend,legendContent,setLegend}=skillLegendMount(dialog);
 let graph=playerTreeGraph(host.get(),host.showHiddenContent?.()),selected='player',tipId=null;
 const world={width:graph.width,height:graph.height};
 function hide(restore=false){tip.hidden=true;tipId=null;map.querySelectorAll('[aria-expanded=true]').forEach(n=>n.setAttribute('aria-expanded','false'));if(restore)map.querySelector(`[data-player-node="${selected}"]`)?.focus({preventScroll:true});}
 const tree=skillTreeMount(dialog,world,{selected:()=>selected,onMove:hide}),camera=tree.camera;
 function selection(){
  const route=new Set(['player']);let n=graph.byId[selected];while(n){route.add(n.id);n=graph.byId[n.requires];}
  tree.select(selected,route);
 }
 function render(message=''){
  hide();const state=host.get(),previous=graph.byId[selected];graph=playerTreeGraph(state,host.showHiddenContent?.());
  if(!graph.byId[selected])selected='player';Object.assign(world,{width:graph.width,height:graph.height});
  dialog.querySelector('.tree-wallet-summary').innerHTML=`<strong>${iconHTML('coin')}${state.profile.wallet.seeds}<span> Points</span></strong>`;
  dialog.querySelector('.tree-status').textContent=message;
  const links=graph.edges.map(e=>`<path data-from="${e.from}" data-to="${e.to}" class="${graph.byId[e.to].owned?'is-active':graph.byId[e.from].owned?'is-open':'is-locked'}" style="--rarity-color:${RARITIES[graph.byId[e.to].rarity].color}" d="${e.path}"/>`).join('');
  const nodes=graph.nodes.map(n=>skillNodeHTML(n,{attribute:'data-player-node',tooltipId:'player-skill-tooltip',selected:n.id===selected,active:n.owned,available:n.canBuy,cost:n.owned&&!host.showPurchasedCosts?.()?null:n.cost})).join('');
  tree.render(graph.byId,nodes,links);selection();
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
  else if(action==='buy'){
   const id=tipId;if(!id)return;const current=playerTreeGraph(host.get(),host.showHiddenContent?.()).byId[id];if(!current?.canBuy){render(current?.reason);return;}
   const result=host.act({type:'buy-player',id});render(result.ok?result.message:result.reason);show(id);map.querySelector(`[data-player-node="${id}"]`)?.focus({preventScroll:true});
  }else if(!tip.contains(event.target))hide();
 });
 dialog.addEventListener('pointerdown',event=>{if(!tip.contains(event.target)&&!event.target.closest('[data-player-node]'))hide();});
 dialog.addEventListener('keydown',event=>{
  if(event.key==='Escape'&&!legendContent.hidden){event.preventDefault();event.stopPropagation();setLegend(false);legend.focus({preventScroll:true});return;}
  if(event.key==='Escape'&&!tip.hidden){event.preventDefault();event.stopPropagation();hide(true);return;}

 });
 dialog.addEventListener('cancel',event=>{event.preventDefault();if(!legendContent.hidden)setLegend(false);else if(!tip.hidden)hide(true);else host.back();});

 rememberView(dialog,'selection',()=>selected,id=>{if(graph.byId[id]){selected=id;selection();}},20);
 return {open(){host.screen();document.querySelectorAll('dialog[open]').forEach(d=>d.close());setLegend(false);render();dialog.showModal();camera.focus(graph.byId[selected],.85,.12);dialog.querySelector('[data-tree-action=back]').focus({preventScroll:true});},refresh(){if(dialog.open)render();}};
}
