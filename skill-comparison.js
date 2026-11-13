import { skillCurve } from './skill-curve.js?v=d525fd9667a3081e35524eb957b3f11625f3f6e4683cb259e620be985973a815';
import { skillConfig } from './skill-effect.js?v=7832dd7c58ba0da9a3d69a6424a04dc4734479b27b6f3ea1f0810fcb589d59d5';
import { POWER_TREES } from './power-tree.js?v=dbaa6fd695e15e784508ce3ba4c6ff1e3ff616c91294e4702f6a0f4725c3326e';
import { profilePurchase, unlockedResolve } from './profile.js?v=f09fdb22d84263dcb45cd1d7c9199cc83fc40768057dc69eedef848efd19db7a';
import { GAME_CATALOGUE as cat } from './run.js?v=4c917a6151cc95f4eef5f74cb04d18ec9a44342c13259040f8d01c4fdd40057a';

const on=value=>value?'On':'Off';
const number=value=>Number(value.toFixed(2));
const seconds=value=>number(value)+' s';
const scale=value=>number(value)+'×';
const degrees=value=>number(value*180/Math.PI)+'°';

// Explain the gameplay meaning of each displayed variable, not an upgrade rating.
const statDescription={
 'Wall Speed Retained':'Speed kept after a wall bounce. Higher means less momentum lost.',
 'Bank Charge':'A new bubble hit charges an extra boost for the next wall bounce.',
 'Late-Flight Drag':'Braking late in a pluck. Lower lets the player coast farther.',
 'Wall Pressure Waves':'The first two powered wall bounces also push nearby bubbles.',
 'Push Strength':'How strongly player contact shoves a bubble.',
 'Push Shape':'Whether the shove follows your movement or spreads outward.',
 'Collision Transfer':'The first two hit bubbles can each pass on one extra shove.',
 'Duration':'How long the effect remains active after triggering.',
 'Rebound Boost':'Extra speed added when the player rebounds from a wall.',
 'Rebound Steering':'Gently turns wall rebounds toward an unhit bubble ahead.',
 'Sway Width':'How far the sideways wobble bends the player’s movement.',
 'Shared Sway':'Up to three nearby unhit bubbles sway along with the player.',
 'Reach':'How far from its center the effect can influence bubbles.',
 'Peak Impulse':'The strongest instant push or pull the wave can apply.',
 'Falloff':'How the wave’s strength changes with distance from its center.',
 'Returning Wave':'A weaker inward wave follows the outward ripple.',
 'Gathering Shape':'Whether attraction gathers bubbles into a cluster or a loose ring.',
 'Outward Release':'A small outward wave follows the gathering pull.',
 'Swirl Strength':'How strongly the vortex sets nearby bubbles swirling.',
 'Sustained Swirl':'Keeps applying a brief swirl after the initial impulse.',
 'Spiral Direction':'Whether swirling bubbles drift inward, outward, or around the center.',
 'Moving Center':'The brief swirl follows the player until it ends or you teleport.',
 'Pull Strength':'How strongly the magnet draws nearby unhit bubbles toward you.',
 'Hit-Bubble Release':'Pushes newly hit bubbles outward to clear room for unhit ones.',
 'Trail Reach':'How far the wake’s current extends from its trail.',
 'Current Strength':'How strongly the wake carries nearby bubbles along its trail.',
 'Crossing Eddies':'Crossing your trail creates brief swirls, up to two per pluck.',
 'Freeze Reach':'How far the initial frost spreads from its source.',
 'Bubble Speed Limit':'The speed cap for frozen bubbles. Lower keeps them slower.',
 'Player Pressure':'Push from already-hit frozen bubbles. Lower makes threading past them easier.',
 'Frost Spread':'The first two frozen-bubble collisions can frost another bubble each.',
 'Shell Radius':'The size of the player’s bubble shell.',
 'Pressure':'How firmly overlapping bubbles are pushed apart by the bubble.',
 'Breathing Radius':'Gently expands and contracts the bubble’s radius by 10%.',
 'Linked Bubbles':'How many bubbles the tether can connect.',
 'Playerward Pull':'How strongly tethered bubbles drift toward the player.',
 'Link Stiffness':'How firmly stretched links return to their resting length.',
 'Release Impulse':'Releases stored link stretch as a bounded shove when the tether ends.',
 'Satellites':'How many bubbles can orbit the player.',
 'Orbit Time':'How long captured bubbles orbit before release.',
 'Extra Orbit Radius':'Extra spacing added around the player for orbiting bubbles.',
 'Rotation':'How quickly orbiting bubbles travel around the player.',
 'Directed Release':'Biases released bubbles toward the player’s current heading.',
 'Path Deviation':'How far the echo may wander from its recorded path.',
 'Elastic Response':'Lets the echo flex away from its path and spring back.',
 'Unhit-Bubble Seeking':'Gently steers the echo toward nearby unhit bubbles.',
 'Finish Queued Route':'Lets the echo finish its remaining route after the player stops.',
 'Side Seeds':'Extra player blobs launched alongside the main player.',
 'Launch Angle':'How widely the side blobs fan out from your direction of travel.',
 'Final Convergence':'Bends surviving side blobs back toward you before they expire.',
 'Relay Carriers':'How many bubbles can carry the relay effect.',
 'Transfer Window':'How long carriers have to pass the relay through a collision.',
 'Recipient Push':'Adds a stronger shove to the bubble receiving a relay.',
 'Additional Pass':'One successful relay can arm its recipient for one extra transfer.',
 'Path Memory':'How much recent travel is saved for rewinding.',
 'Playback Speed':'How quickly the stored path is retraced. Lower rewinds more slowly.',
 'Parallel Offset':'Shifts the return route beside the original path.',
 'Return-Bloom Wave':'A bloom earned during the return sends out one small push wave.',
 'Strikes':'How many bubbles the lightning sequence targets.',
 'Target Pattern':'Whether lightning prefers nearby, grouped, or separated targets.',
 'Charged Relay':'The first struck bubble can pass one hit through a later collision.',
 'Waves':'How many pressure waves fire during the pulse sequence.',
 'Wave Interval':'Time between waves. Lower makes them arrive more quickly.',
 'Pressure Strength':'How strongly each pulse wave pushes nearby bubbles.',
 'Unhit-Biased Final Wave':'Places the last wave closer to a group of unhit bubbles.',
 'Destination':'How Swap chooses the bubble you exchange places with.',
 'Departure Wave':'Pushes nearby bubbles away from the spot you leave.',
 'Gate Radius':'The size of each portal entrance.',
 'Exit Steering':'Steers you toward an unhit bubble when leaving a portal.',
 'Gate Current':'Each active gate gently pushes nearby bubbles outward.',
 'Look-Ahead':'How far ahead Homing searches for an unhit target.',
 'Turn Limit':'The fastest Homing can turn. Higher allows sharper corrections.',
 'Musical-Role Preference':'Favors a nearby target with a musical role the pool still needs.',
 'Wrapping Edges':'Which walls send the player through to the opposite side.',
 'Arrival Pressure':'Gently clears nearby bubbles away from your wrap exit.',
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
 case 'magnet':return {'Duration':seconds(c.duration),'Reach':c.reach,'Pull Strength':c.force,...finish('Hit-Bubble Release')};
 case 'wake':return {'Duration':seconds(c.duration),'Trail Reach':c.width,'Current Strength':c.force,...finish('Crossing Eddies')};
 case 'stasis':return {'Freeze Reach':c.reach,'Bubble Speed Limit':c.speed,'Player Pressure':scale(c.pressure),...finish('Frost Spread')};
 case 'bubble':return {'Shell Radius':c.size,'Pressure':scale(c.pressure),...finish('Breathing Radius')};
 case 'tether':return {'Linked Bubbles':c.members,'Playerward Pull':c.pull,'Link Stiffness':c.spring,...finish('Release Impulse')};
 case 'orbit':return {'Satellites':c.count,'Orbit Time':seconds(c.duration),'Extra Orbit Radius':c.reach,'Rotation':number(c.turn)+' rad/s',...finish('Directed Release')};
 case 'echo':return {'Path Deviation':c.leash,'Elastic Response':on(c.elastic),'Unhit-Bubble Seeking':on(c.seek),...finish('Finish Queued Route')};
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
 if(!node||state.powerMode==='shared')return null;
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

const countStats=new Set(['Linked Bubbles','Satellites','Side Seeds','Relay Carriers','Strikes','Waves','Magazine','Pellets Per Shot','Wall Bounces']);
// Direction describes this individual capability, not an overall build rating.
// Style-only dimensions have no honest best endpoint, so keep their exact values as text.
const lowerStats=new Set(['Late-Flight Drag','Bubble Speed Limit','Player Pressure','Playback Speed','Wave Interval']);
const choiceStats=new Set(['Sway Width','Launch Angle','Orbit Time']);
const numeric=value=>typeof value==='number'?value:/^\d+(?:\.\d+)?(?: s|×|°|%| rad\/s)?$/.test(value)?parseFloat(value):null;
export function statProgress(value,best,direction){
 if(value===null||best===null)return null;
 if(direction==='lower')return best===0?(value===0?1:0):Math.min(1,best/value);
 return best===0?1:Math.min(1,value/best);
}
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
     const n=numeric(value);if(n!==null){
       const range=result[label]||{min:n,max:n};range.min=Math.min(range.min,n);range.max=Math.max(range.max,n);result[label]=range;
     }
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
 let beforeBuild=null,afterBuild=current.powers;
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
   beforeBuild=prior.powers;before=powerVariables(beforeBuild,node.power);
   profile.research[id]??={paid:0};
   const selections={borrowed:state.borrowed,equipped:node.kind==='base'?state.equipped:[...state.equipped.filter(key=>key!==id&&!node.conflicts.includes(key)),id]};
   afterBuild=unlockedResolve(profile,selections,cat).powers;
   after=powerVariables(afterBuild,node.power);
   if(node.kind==='base'){heading='On Unlock';afterLabel='On Unlock';}
   else if(missing){heading='Upgrade Preview';beforeLabel='Prerequisites';}
   else if(owned){heading='Style Preview';afterLabel='With Style';}
   else heading='Upgrade Preview';
 }
 const limits=statRanges(node.power),curve=skillCurve(node.power,beforeBuild,afterBuild,{before:beforeLabel,after:afterLabel});
 const rows=Object.entries(after).map(([label,value])=>{
   const n=numeric(value),previous=before?.[label],previousNumber=previous===undefined?null:numeric(previous);
   const direction=choiceStats.has(label)?'choice':lowerStats.has(label)?'lower':'higher',range=limits[label],best=range?(direction==='lower'?range.min:range.max):null;
   return {label,description:statDescription[label],before:previous,after:value,changed:!!before&&previous!==value,curve:curve?.label===label?curve:null,
     kind:n===null||direction==='choice'?'text':countStats.has(label)?'count':'bar',value:n,previous:previousNumber,max:range?.max??null,
     direction,best,progress:statProgress(n,best,direction),previousProgress:statProgress(previousNumber,best,direction)};
 });
 return {heading,beforeLabel,afterLabel,compare:!!before,rows};
}

export function tooltipPosition(anchor,bounds,width,height){
 const gap=10,pad=8,left=Math.max(bounds.left+pad,Math.min(bounds.right-width-pad,anchor.left+anchor.width/2-width/2));
 const below=anchor.bottom+gap,above=anchor.top-height-gap;
 const top=below+height<=bounds.bottom-pad?below:above>=bounds.top+pad?above:Math.max(bounds.top+pad,Math.min(bounds.bottom-height-pad,below));
 return {left,top};
}
