import {PLAYER_UPGRADES,playerUpgradeReason} from './player-upgrade.js?v=fab6c92f134e88ebe641c4be9b87d9e46b857905b117a20831b164d5181c0c23';
const branches={Sight:{icon:'eye',color:'#a4e6d2'},Launch:{icon:'speedometer',color:'#e9c18a'},Rebound:{icon:'reset',color:'#b8b0ef'}};
// Draw exactly the same prerequisite edges that govern permanent purchases.
export function playerTreeGraph(state){
 const profile=state.profile,owned=profile.playerResearch??{};
 const nodes=[{id:'player',name:'Your Player',x:240,y:80,icon:'player-skin',color:'#d2f3df',owned:true,cost:null,reason:null}];
 const depth=id=>{const n=PLAYER_UPGRADES.find(n=>n.id===id);return n.requires?depth(n.requires)+1:1;};
 const names=Object.keys(branches);
 for(const n of PLAYER_UPGRADES){
  const has=Object.hasOwn(owned,n.id),reason=state.powerMode==='shared'?'Shared challenges use their fixed build.':playerUpgradeReason(profile,n.id);
  nodes.push({...n,...branches[n.branch],x:80+names.indexOf(n.branch)*160,y:80+depth(n.id)*175,owned:has,reason,canBuy:!has&&!reason});
 }
 const byId=Object.fromEntries(nodes.map(n=>[n.id,n]));
 const edges=PLAYER_UPGRADES.map(n=>{const from=byId[n.requires||'player'],to=byId[n.id],start=from.y+(from.id==='player'?102:78),mid=(start+to.y-28)/2;return {from:from.id,to:to.id,path:`M${from.x} ${start} V${mid} H${to.x} V${to.y-28}`};});
 return {width:480,height:550,nodes,byId,edges};
}
