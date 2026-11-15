import {PLAYER_UPGRADES,playerUpgradeReason} from './player-upgrade.js?v=205999fde590d7ae1935c6f5a99938cc353989c1dae9cfab7129b62c0b60b55b';
import {researchLayout} from './tree-map.js?v=3796f253f5adde9641a9269883caf82cfcba3eea0317792412224f9da63cb35c';
const branches={player:{name:'Player'},...Object.fromEntries(PLAYER_UPGRADES.map(n=>[n.branch,{name:n.branch}]))};
// Use the power tree's prerequisite layout and discoverable research frontier.
export function playerTreeGraph(state,showAll=false){
 const profile=state.profile,owned=profile.playerResearch??{};
 const nodes=[{id:'player',name:'Your Player',power:'player',kind:'base',requires:null,icon:'player-skin',type:'Motion',rarity:'common',owned:true,cost:null,reason:null}];
 for(const n of PLAYER_UPGRADES){
  const has=Object.hasOwn(owned,n.id),reason=state.powerMode==='shared'?'Shared challenges use their fixed build.':playerUpgradeReason(profile,n.id);
  if(showAll||has||state.powerMode!=='shared'&&(!n.requires||Object.hasOwn(owned,n.requires)))
   nodes.push({...n,power:n.branch,kind:'upgrade',owned:has,reason,canBuy:!has&&!reason,dimmed:!has&&!!reason});
 }
 const layout=researchLayout(branches,nodes.map(n=>({...n,requires:n.id==='player'?[]:[n.requires||'player']})));
 for(const n of nodes)Object.assign(n,{x:layout.nodes[n.id].x,y:layout.nodes[n.id].y});
 return {width:layout.width,height:layout.height,nodes,byId:Object.fromEntries(nodes.map(n=>[n.id,n])),edges:layout.edges};
}
