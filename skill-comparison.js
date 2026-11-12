import { skillConfig } from './skill-effect.js?v=5ff4cafca9c6bb8adee62961b5c6e07969e5a02e614b94bac8b4873b068d1e23';
import { profilePurchase, unlockedResolve } from './profile.js?v=f884844be31760a0e8fa2f140e6b67a8238f29681b4d6e77a401fc7596d2d0e8';
import { GAME_CATALOGUE as cat } from './run.js?v=6a19c662694ec547e86de13f3dce16b78524a1f4c32b95ee0a901850675bb8e3';

const on=value=>value?'On':'Off';
const number=value=>Number(value.toFixed(2));
const seconds=value=>number(value)+' s';
const scale=value=>number(value)+'×';
const degrees=value=>number(value*180/Math.PI)+'°';

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
 case 'swap':return {'Destination':c.a?'Forward Unhit':c.b?'Open-Space Unhit':'Distant Unhit',...finish('Departure Wave')};
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

export function tooltipPosition(anchor,bounds,width,height){
 const gap=10,pad=8,left=Math.max(bounds.left+pad,Math.min(bounds.right-width-pad,anchor.left+anchor.width/2-width/2));
 const below=anchor.bottom+gap,above=anchor.top-height-gap;
 const top=below+height<=bounds.bottom-pad?below:above>=bounds.top+pad?above:Math.max(bounds.top+pad,Math.min(bounds.bottom-height-pad,below));
 return {left,top};
}
