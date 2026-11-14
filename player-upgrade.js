// Permanent player research is separate from contact-triggered bubble powers.
export const PLAYER_UPGRADES=Object.freeze([
 {id:'sight.1',branch:'Sight',name:'Long Sight',cost:8,requires:null,description:'Extend the aiming guide by 180 units and its first reflected segment by 140 units.'},
 {id:'sight.2',branch:'Sight',name:'Deep Sight',cost:18,requires:'sight.1',description:'Add another 180 units of guide length and 140 units after the first wall bounce.'},
 {id:'launch.1',branch:'Launch',name:'Strong Launch',cost:10,requires:null,description:'Raise maximum launch speed from 800 to 900 units per second. Low-power shots remain available.'},
 {id:'launch.2',branch:'Launch',name:'Greater Launch',cost:22,requires:'launch.1',description:'Raise maximum launch speed to 1,000 units per second. Stacks with Strong Launch.'},
 {id:'rebound.1',branch:'Rebound',name:'Elastic Shell',cost:12,requires:null,description:'Keep 97% of perpendicular speed at ordinary walls, up from 94%. Applies to the player and Split seeds.'},
 {id:'rebound.2',branch:'Rebound',name:'Perfect Rebound',cost:24,requires:'rebound.1',description:'Keep 100% of perpendicular speed at ordinary walls. Stronger power effects still apply.'}
].map(Object.freeze));
const branches=['sight','launch','rebound'];
const object=x=>x!==null&&typeof x==='object'&&!Array.isArray(x);
export function playerResearchValid(research) {
 return object(research)&&Object.entries(research).every(([id,p])=>{
  const node=PLAYER_UPGRADES.find(n=>n.id===id);
  return node&&object(p)&&Number.isSafeInteger(p.paid)&&p.paid>=0&&(!node.requires||Object.hasOwn(research,node.requires));
 });
}
export function playerUpgradeReason(profile,id) {
 const node=PLAYER_UPGRADES.find(n=>n.id===id),owned=profile.playerResearch??{};
 if(!node)return 'Unknown player upgrade.';
 if(Object.hasOwn(owned,id))return 'Already owned.';
 if(node.requires&&!Object.hasOwn(owned,node.requires))return 'Unlock '+PLAYER_UPGRADES.find(n=>n.id===node.requires).name+' first.';
 if(profile.wallet.seeds<node.cost)return 'Earn '+(node.cost-profile.wallet.seeds)+' more Points.';
 return null;
}
export function playerBuild(profile) {
 const research=profile.playerResearch??{};
 return {version:1,...Object.fromEntries(branches.map(branch=>[branch,Number(Object.hasOwn(research,branch+'.1'))+Number(Object.hasOwn(research,branch+'.2'))]))};
}
export function playerBuildValid(build) {
 return object(build)&&build.version===1&&Object.keys(build).length===4&&branches.every(k=>Number.isInteger(build[k])&&build[k]>=0&&build[k]<=2);
}
export function playerConfig(build) {
 return {guideExtra:(build?.sight??0)*180,bankGuide:140+(build?.sight??0)*140,maxLaunch:build?800+build.launch*100:850,wallRetention:.94+(build?.rebound??0)*.03};
}
// Open pools can adopt purchases only between shots; finite runs pin a build.
export function playerSync(game,profile) {
 if(!['free','waves','challenge'].includes(game.mode)||game.isFlying||game.isOver)return false;
 const build=playerBuild(profile);
 if(JSON.stringify(game.playerBuild)===JSON.stringify(build))return false;
 game.playerBuild=build;return true;
}
