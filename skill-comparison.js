import { skillConfig } from './skill-effect.js?v=5ff4cafca9c6bb8adee62961b5c6e07969e5a02e614b94bac8b4873b068d1e23';
import { POWER_TREES } from './power-tree.js?v=c9a5802f7ef4e448c825a7917910994fd4d5dc8753c92d94db7b9abffaa78827';
import { profilePurchase, unlockedResolve } from './profile.js?v=f884844be31760a0e8fa2f140e6b67a8238f29681b4d6e77a401fc7596d2d0e8';
import { GAME_CATALOGUE as cat } from './run.js?v=6a19c662694ec547e86de13f3dce16b78524a1f4c32b95ee0a901850675bb8e3';

const on=value=>value?'On':'Off';
const number=value=>Number(value.toFixed(2));
const seconds=value=>number(value)+' s';
const scale=value=>number(value)+'×';
const degrees=value=>number(value*180/Math.PI)+'°';

// Explain the gameplay meaning of each displayed variable, not an upgrade rating.
const statDescription={
 'Wall Speed Retained':'Speed kept after a wall bounce. Higher means less momentum lost.',
 'Bank Charge':'A new jelly hit charges an extra boost for the next wall bounce.',
 'Late-Flight Drag':'Braking late in a pluck. Lower lets the player coast farther.',
 'Wall Pressure Waves':'The first two powered wall bounces also push nearby jellies.',
 'Push Strength':'How strongly player contact shoves a jelly.',
 'Push Shape':'Whether the shove follows your movement or spreads outward.',
 'Collision Transfer':'The first two hit jellies can each pass on one extra shove.',
 'Duration':'How long the effect remains active after triggering.',
 'Rebound Boost':'Extra speed added when the player rebounds from a wall.',
 'Rebound Steering':'Gently turns wall rebounds toward an unhit jelly ahead.',
 'Sway Width':'How far the sideways wobble bends the player’s movement.',
 'Shared Sway':'Up to three nearby unhit jellies sway along with the player.',
 'Reach':'How far from its center the effect can influence jellies.',
 'Peak Impulse':'The strongest instant push or pull the wave can apply.',
 'Falloff':'How the wave’s strength changes with distance from its center.',
 'Returning Wave':'A weaker inward wave follows the outward ripple.',
 'Gathering Shape':'Whether attraction gathers jellies into a cluster or a loose ring.',
 'Outward Release':'A small outward wave follows the gathering pull.',
 'Swirl Strength':'How strongly the vortex sets nearby jellies swirling.',
 'Sustained Swirl':'Keeps applying a brief swirl after the initial impulse.',
 'Spiral Direction':'Whether swirling jellies drift inward, outward, or around the center.',
 'Moving Center':'The brief swirl follows the player until it ends or you teleport.',
 'Pull Strength':'How strongly the magnet draws nearby unhit jellies toward you.',
 'Hit-Jelly Release':'Pushes newly hit jellies outward to clear room for unhit ones.',
 'Trail Reach':'How far the wake’s current extends from its trail.',
 'Current Strength':'How strongly the wake carries nearby jellies along its trail.',
 'Crossing Eddies':'Crossing your trail creates brief swirls, up to two per pluck.',
 'Freeze Reach':'How far the initial frost spreads from its source.',
 'Jelly Speed Limit':'The speed cap for frozen jellies. Lower keeps them slower.',
 'Player Pressure':'How strongly an already-hit frozen jelly gently pushes you away.',
 'Frost Spread':'The first two frozen-jelly collisions can frost another jelly each.',
 'Shell Radius':'The size of the player’s bubble shell.',
 'Pressure':'How firmly overlapping jellies are pushed apart by the bubble.',
 'Breathing Radius':'Gently expands and contracts the bubble’s radius by 10%.',
 'Linked Jellies':'How many jellies the tether can connect.',
 'Playerward Pull':'How strongly tethered jellies drift toward the player.',
 'Link Stiffness':'How firmly stretched links return to their resting length.',
 'Release Impulse':'Releases stored link stretch as a bounded shove when the tether ends.',
 'Satellites':'How many jellies can orbit the player.',
 'Orbit Time':'How long captured jellies orbit before release.',
 'Extra Orbit Radius':'Extra spacing added around the player for orbiting jellies.',
 'Rotation':'How quickly orbiting jellies travel around the player.',
 'Directed Release':'Biases released jellies toward the player’s current heading.',
 'Path Deviation':'How far the echo may wander from its recorded path.',
 'Elastic Response':'Lets the echo flex away from its path and spring back.',
 'Unhit-Jelly Seeking':'Gently steers the echo toward nearby unhit jellies.',
 'Finish Queued Route':'Lets the echo finish its remaining route after the player stops.',
 'Side Seeds':'Extra player blobs launched alongside the main player.',
 'Launch Angle':'How widely the side blobs fan out from your direction of travel.',
 'Final Convergence':'Bends surviving side blobs back toward you before they expire.',
 'Relay Carriers':'How many jellies can carry the relay effect.',
 'Transfer Window':'How long carriers have to pass the relay through a collision.',
 'Recipient Push':'Adds a stronger shove to the jelly receiving a relay.',
 'Additional Pass':'One successful relay can arm its recipient for one extra transfer.',
 'Path Memory':'How much recent travel is saved for rewinding.',
 'Playback Speed':'How quickly the stored path is retraced. Lower rewinds more slowly.',
 'Parallel Offset':'Shifts the return route beside the original path.',
 'Return-Bloom Wave':'A bloom earned during the return sends out one small push wave.',
 'Strikes':'How many jellies the lightning sequence targets.',
 'Target Pattern':'Whether lightning prefers nearby, grouped, or separated targets.',
 'Charged Relay':'The first struck jelly can pass one hit through a later collision.',
 'Waves':'How many pressure waves fire during the pulse sequence.',
 'Wave Interval':'Time between waves. Lower makes them arrive more quickly.',
 'Pressure Strength':'How strongly each pulse wave pushes nearby jellies.',
 'Unhit-Biased Final Wave':'Places the last wave closer to a group of unhit jellies.',
 'Destination':'How Swap chooses the jelly you exchange places with.',
 'Departure Wave':'Pushes nearby jellies away from the spot you leave.',
 'Gate Radius':'The size of each portal entrance.',
 'Exit Steering':'Steers you toward an unhit jelly when leaving a portal.',
 'Gate Current':'Each active gate gently pushes nearby jellies outward.',
 'Look-Ahead':'How far ahead Homing searches for an unhit target.',
 'Turn Limit':'The fastest Homing can turn. Higher allows sharper corrections.',
 'Musical-Role Preference':'Favors a nearby target with a musical role the pool still needs.',
 'Wrapping Edges':'Which walls send the player through to the opposite side.',
 'Arrival Pressure':'Gently clears nearby jellies away from your wrap exit.',
 'Release Target':'How Slingshot chooses where to aim its automatic release.',
 'Second Orbit':'Hitting the chosen release target can trigger one shorter extra orbit.',
 'Magazine':'Shots available each time Blaster activates.',
 'Pellets Per Shot':'Projectiles fired together for one shot of ammunition.',
 'Wall Bounces':'How many wall rebounds each projectile can make.',
 'Bloom Reload':'The first bloom after activation refills the magazine once per pluck.'
};

// Values describe the configured power, not a prediction of score or collision outcome.
export function powerVariables(build,power){
 if(!build.some(p=>p.power===power))return null;
 const c=skillConfig({build},power),finish=label=>({[label]:on(c.capstone)});
 switch(power){
 case 'comet':return {'Wall Speed Retained':number(c.wallRetention*100)+'%','Bank Charge':on(c.a),'Late-Flight Drag':scale(c.lateDrag),...finish('Wall Pressure Waves')};
 case 'impact':return {'Push Strength':scale(c.pushScale),'Push Shape':c.b?'Radial':'Forward',...finish('Collision Transfer')};
 case 'spring':return {'Duration':seconds(c.duration),'Rebound Boost':scale(c.reboundScale),'Rebound Steering':on(c.b),...finish('Wall Pressure Waves')};
 case 'drunk':return {'Sway Width':scale(c.swayScale),...finish('Shared Sway')};
 case 'ripple':return {'Reach':c.reach,'Peak Impulse':c.force,'Falloff':c.a?'Concentrated':c.b?'Far Shore':'Standard',...finish('Returning Wave')};
 case 'attract':return {'Reach':c.reach,'Peak Impulse':c.force,'Gathering Shape':c.a?'Tight Group':c.b?'Loose Ring':'Standard',...finish('Outward Release')};
 case 'vortex':return {'Swirl Strength':c.force,'Sustained Swirl':on(c.foundation),'Spiral Direction':c.a?'Inward':c.b?'Outward':'Tangential',...finish('Moving Center')};
 case 'magnet':return {'Duration':seconds(c.duration),'Reach':c.reach,'Pull Strength':c.force,...finish('Hit-Jelly Release')};
 case 'wake':return {'Duration':seconds(c.duration),'Trail Reach':c.width,'Current Strength':c.force,...finish('Crossing Eddies')};
 case 'stasis':return {'Freeze Reach':c.reach,'Jelly Speed Limit':c.speed,'Player Pressure':scale(c.pressure),...finish('Frost Spread')};
 case 'bubble':return {'Shell Radius':c.size,'Pressure':scale(c.pressure),...finish('Breathing Radius')};
 case 'tether':return {'Linked Jellies':c.members,'Playerward Pull':c.pull,'Link Stiffness':c.spring,...finish('Release Impulse')};
 case 'orbit':return {'Satellites':c.count,'Orbit Time':seconds(c.duration),'Extra Orbit Radius':c.reach,'Rotation':number(c.turn)+' rad/s',...finish('Directed Release')};
 case 'echo':return {'Path Deviation':c.leash,'Elastic Response':on(c.elastic),'Unhit-Jelly Seeking':on(c.seek),...finish('Finish Queued Route')};
 case 'split':return {'Side Seeds':c.count,'Launch Angle':degrees(c.fan),'Duration':seconds(c.duration),...finish('Final Convergence')};
 case 'relay':return {'Relay Carriers':c.count,'Transfer Window':seconds(c.duration),'Recipient Push':on(c.a),...finish('Additional Pass')};
 case 'rewind':return {'Path Memory':seconds(c.memory),'Playback Speed':scale(c.playbackRate),'Parallel Offset':on(c.b),...finish('Return-Bloom Wave')};
 case 'lightning':return {'Strikes':c.count,'Target Pattern':c.a?'Separated':c.b?'Clustered':'Nearest Unhit',...finish('Charged Relay')};
 case 'pulse':return {'Waves':c.count,'Wave Interval':seconds(c.beat),'Pressure Strength':c.force,...finish('Unhit-Biased Final Wave')};
 case 'swap':return {'Destination':c.a&&c.b?'Forward, Open-Space Unhit':c.a?'Forward Unhit':c.b?'Open-Space Unhit':'Distant Unhit',...finish('Departure Wave')};
 case 'portal':return {'Duration':seconds(c.duration),'Gate Radius':c.gateRadius,'Exit Steering':on(c.b),...finish('Gate Current')};
 case 'homing':return {'Duration':seconds(c.duration),'Look-Ahead':c.reach,'Turn Limit':number(c.turn)+' rad/s',...finish('Musical-Role Preference')};
 case 'wrap':return {'Duration':seconds(c.duration),'Wrapping Edges':c.a?'Left / Right':c.b?'Top / Bottom':'All',...finish('Arrival Pressure')};
 case 'slingshot':return {'Release Target':c.a?'Nearest Forward':c.b?'Farthest Forward':'Nearest Unhit',...finish('Second Orbit')};
 case 'blaster':return {'Magazine':c.ammo,'Pellets Per Shot':c.offsets.length,'Wall Bounces':c.bounces,...finish('Bloom Reload')};
 default:throw new Error('Missing power variables: '+power);
 }
}

export function purchaseComparison(state,id){
 const node=cat.nodes[id];
 if(!node||state.phase!=='shop')return null;
 const purchase=profilePurchase(state.profile,id,cat);if(!purchase.ok)return null;
 const before=unlockedResolve(state.profile,state,cat);
 const selections={borrowed:state.borrowed,equipped:node.kind==='base'?state.equipped:[...state.equipped.filter(key=>key!==id&&!node.conflicts.includes(key)),id]};
 const after=unlockedResolve(purchase.profile,selections,cat);
 if(!before.ok||!after.ok)return null;
 const current=powerVariables(before.powers,node.power),upgraded=powerVariables(after.powers,node.power);
 const rows=Object.entries(upgraded).filter(([key,value])=>!current||current[key]!==value).map(([label,after])=>({label,before:current?.[label]??'—',after}));
 if(!rows.length)rows.push({label:'Access',before:'This Run',after:'Permanent'});
 return {id,name:node.name,description:node.description,cost:node.seedCost,rows};
}

const countStats=new Set(['Linked Jellies','Satellites','Side Seeds','Relay Carriers','Strikes','Waves','Magazine','Pellets Per Shot','Wall Bounces']);
const numeric=value=>typeof value==='number'?value:/^\d+(?:\.\d+)?(?: s|×|°|%| rad\/s)?$/.test(value)?parseFloat(value):null;
const ranges=new Map();
function statRanges(power){
 if(ranges.has(power))return ranges.get(power);
 const result={};
 // Stable scales come from the power's real configurations, not the current tooltip.
 for(let flags=0;flags<16;flags++){
   const variants=['a','b'].filter((_,i)=>flags&(2<<i));
   if(variants.length===2&&!POWER_TREES[power].compatible)continue;
   const build=[{power,foundation:!!(flags&1),variants,capstone:!!(flags&8)}];
   for(const [label,value] of Object.entries(powerVariables(build,power))){
     const n=numeric(value);if(n!==null)result[label]=Math.max(result[label]||0,n,String(value).endsWith('%')?100:0);
   }
 }
 ranges.set(power,result);return result;
}

// Read-only previews use the same resolver as purchases, including conflicting styles.
// Missing prerequisites are previewed explicitly; they are never granted to the save.
export function skillStats(state,id){
 const node=cat.nodes[id];if(!node)return null;
 const current=unlockedResolve(state.profile,state,cat);if(!current.ok)return null;
 const owned=Object.hasOwn(state.profile.research,id),active=node.kind==='base'?owned:current.equipped.includes(id);
 let before=null,after=powerVariables(current.powers,node.power),heading='Current Power',beforeLabel='Current',afterLabel='With Upgrade';
 if(!active){
   const profile=structuredClone(state.profile);let missing=false;
   // The detached preview can describe mastery-locked effects without earning them.
   profile.kind='development';
   function prerequisite(key){
     for(const parent of cat.nodes[key].requires)prerequisite(parent);
     if(!Object.hasOwn(profile.research,key)){profile.research[key]={paid:0};missing=true;}
   }
   for(const parent of node.requires)prerequisite(parent);
   const prior=unlockedResolve(profile,state,cat);
   before=powerVariables(prior.powers,node.power);
   profile.research[id]??={paid:0};
   const selections={borrowed:state.borrowed,equipped:node.kind==='base'?state.equipped:[...state.equipped.filter(key=>key!==id&&!node.conflicts.includes(key)),id]};
   after=powerVariables(unlockedResolve(profile,selections,cat).powers,node.power);
   if(node.kind==='base'){heading='On Unlock';afterLabel='On Unlock';}
   else if(missing){heading='Upgrade Preview';beforeLabel='Prerequisites';}
   else if(owned){heading='Style Preview';afterLabel='With Style';}
   else heading='Upgrade Preview';
 }
 const limits=statRanges(node.power);
 const rows=Object.entries(after).map(([label,value])=>{
   const n=numeric(value),previous=before?.[label],previousNumber=previous===undefined?null:numeric(previous);
   return {label,description:statDescription[label],before:previous,after:value,changed:!!before&&previous!==value,
     kind:n===null?'text':countStats.has(label)?'count':'bar',value:n,previous:previousNumber,max:limits[label]||null};
 });
 return {heading,beforeLabel,afterLabel,compare:!!before,rows};
}

export function tooltipPosition(anchor,bounds,width,height){
 const gap=10,pad=8,left=Math.max(bounds.left+pad,Math.min(bounds.right-width-pad,anchor.left+anchor.width/2-width/2));
 const below=anchor.bottom+gap,above=anchor.top-height-gap;
 const top=below+height<=bounds.bottom-pad?below:above>=bounds.top+pad?above:Math.max(bounds.top+pad,Math.min(bounds.bottom-height-pad,below));
 return {left,top};
}
