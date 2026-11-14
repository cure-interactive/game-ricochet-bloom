import {PLAYER_UPGRADES,playerUpgradeReason} from './player-upgrade.js?v=9483739a49b831a9c57dd285854e1bb23148947a97636d12caaebc2b619a776f';
import {researchLayout} from './tree-map.js?v=f0eef94b88145f071c75d50ebf488d06a1e21bb049a894a7abe1abb1393368ea';
const branches={player:{name:'Player'},Sight:{name:'Sight'},Launch:{name:'Launch'},Rebound:{name:'Rebound'}};
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
