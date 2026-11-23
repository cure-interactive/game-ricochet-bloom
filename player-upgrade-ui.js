import {rememberView} from './navigation-state.js?v=d7ae9a905aacccc9eaf9bbac7fc9b56f9cb442d4e202334ea0b1d7b5f2e82f2a';
import {skillTreeHTML,skillTreeMount} from './skill-tree.js?v=889bef8ad149a624f8fcd2c0399fe032723c15109e51a3abb01c39837773ebb5';
import {skillNodeHTML,skillLegendMount,showSkillCard} from './skill-card.js?v=35973f77e342163696da754bdb7b590d090a575793b3b45398bd2248248d7fd9';
import {playerSkillStats} from './player-skill-comparison.js?v=f77d93876f25ffd7530d3de39e2b3b762afba93a19a6906ea123d7a16fbc3720';
import {RARITIES} from './skill-trait.js?v=e149e64c177320afd3c752be9033b394aef97e73f55b5752d3400d5b2928eee9';
import {playerTreeGraph} from './player-tree.js?v=c80677aa6964fa22430a44f56650aec8e10a617da6e96672044bcbbbc2042027';
import {treeSwitchMount} from './tree-switch.js?v=27cb1739e0869a210867f2be31baf405276800715d01a0c8384a365081e5a27a';
import {iconHTML} from './ui-icon.js?v=8d255b14e7d23a0f224ee9fa4070909259e237f5c3c988cefd05fd6456bae20e';

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
 const tabs=treeSwitchMount(dialog,'player',()=>open());
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
 function open(){host.screen();document.querySelectorAll('dialog[open]').forEach(d=>d.close());setLegend(false);render();dialog.showModal();tabs.show();camera.focus(graph.byId[selected],.85,.12);dialog.querySelector('[data-tree-action=back]').focus({preventScroll:true});}
 return {open,refresh(){if(dialog.open)render();}};
}
