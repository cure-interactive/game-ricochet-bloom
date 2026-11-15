// Permanent player research is separate from contact-triggered bubble powers.
export const PLAYER_UPGRADES=Object.freeze([
 {id:'sight.1',type:'Navigation',rarity:'common',branch:'Sight',name:'Long Sight',cost:80,requires:null,description:'Extend the aiming guide by 180 units and its first reflected segment by 140 units.'},
 {id:'sight.2',type:'Navigation',rarity:'rare',branch:'Sight',name:'Deep Sight',cost:180,requires:'sight.1',description:'Add another 180 units of guide length and 140 units after the first wall bounce.'},
 {id:'launch.1',type:'Motion',rarity:'common',branch:'Launch',name:'Strong Launch',cost:100,requires:null,description:'Raise maximum launch speed from 800 to 900 units per second. Low-power shots remain available.'},
 {id:'launch.2',type:'Motion',rarity:'rare',branch:'Launch',name:'Greater Launch',cost:220,requires:'launch.1',description:'Raise maximum launch speed to 1,000 units per second. Stacks with Strong Launch.'},
 {id:'rebound.1',type:'Motion',rarity:'common',branch:'Rebound',name:'Elastic Shell',cost:120,requires:null,description:'Keep 97% of perpendicular speed at ordinary walls, up from 94%. Applies to the player and Split seeds.'},
 {id:'rebound.2',type:'Motion',rarity:'rare',branch:'Rebound',name:'Perfect Rebound',cost:240,requires:'rebound.1',description:'Keep 100% of perpendicular speed at ordinary walls. Stronger power effects still apply.'},
 {id:'glide.1',type:'Flow',rarity:'common',branch:'Glide',name:'Smooth Glide',cost:60,requires:null,description:'Reduce drag by 12% during the first three seconds of flight. The normal coast and natural stop are unchanged.'},
 {id:'glide.2',type:'Flow',rarity:'rare',branch:'Glide',name:'Silken Glide',cost:140,requires:'glide.1',description:'Reduce early-flight drag by 24% in total. Applies to the player and Split seeds without extending power durations.'},
 {id:'steady.1',type:'Motion',rarity:'common',branch:'Steady',name:'Steady Shell',cost:80,requires:null,description:'Recover 15% of speed lost in a solid bubble collision while keeping the resulting bounce direction.'},
 {id:'steady.2',type:'Motion',rarity:'rare',branch:'Steady',name:'Resilient Shell',cost:180,requires:'steady.1',description:'Recover 30% of lost bubble-collision speed in total. Never increases speed beyond the incoming speed; applies to Split seeds too.'}
].map(Object.freeze));
const branches=['sight','launch','rebound'],extraBranches=['glide','steady'];
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
 const rank=branch=>Number(Object.hasOwn(research,branch+'.1'))+Number(Object.hasOwn(research,branch+'.2'));
 return {version:1,...Object.fromEntries(branches.map(branch=>[branch,rank(branch)])),...Object.fromEntries(extraBranches.filter(branch=>rank(branch)>0).map(branch=>[branch,rank(branch)]))};
}
export function playerBuildValid(build) {
 const rank=n=>Number.isInteger(n)&&n>=0&&n<=2;
 return object(build)&&build.version===1&&Object.keys(build).every(k=>['version',...branches,...extraBranches].includes(k))&&branches.every(k=>rank(build[k]))&&extraBranches.every(k=>!Object.hasOwn(build,k)||rank(build[k]));
}
export function playerConfig(build) {
 return {guideExtra:(build?.sight??0)*180,bankGuide:140+(build?.sight??0)*140,maxLaunch:build?800+build.launch*100:850,wallRetention:.94+(build?.rebound??0)*.03,dragReduction:(build?.glide??0)*.12,collisionRecovery:(build?.steady??0)*.15};
}
// Open pools can adopt purchases only between shots; finite runs pin a build.
export function playerSync(game,profile) {
 if(!['free','waves','challenge'].includes(game.mode)||game.isFlying||game.isOver)return false;
 const build=playerBuild(profile);
 if(JSON.stringify(game.playerBuild)===JSON.stringify(build))return false;
 game.playerBuild=build;return true;
}

// Physics and research charts consume the same response, including legacy builds.
export const playerLaunchSpeed=(build,power)=>280+Math.max(0,Math.min(1,power))*(playerConfig(build).maxLaunch-280);
export const playerGuideLength=(build,power)=>260+Math.max(0,Math.min(1,power))*500+playerConfig(build).guideExtra;
export const playerCruiseDrag=(build,age,base)=>base*(age<3?1-playerConfig(build).dragReduction:1);
export const playerCollisionSpeed=(build,incoming,outgoing)=>outgoing+Math.max(0,incoming-outgoing)*playerConfig(build).collisionRecovery;
