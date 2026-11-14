import { PRECISION_RULES } from './precision.js?v=fe3f5f9fbfc5e54cc353d2bd4dd10fcabc5bdff5850a4977b2c3ce3ad7a96ee3';
import { MELODY_RULES } from './melody-trial.js?v=5e546567b46445c986bbf1d941f8e10f4a9a07413c2822cd9af4cfda8fe0b363';
// Recipes are versioned independently of saves. Never change a published rules
// version in place: saved setups and records retain the resolved parameters.
export const EXPERIMENT_RECIPES = Object.freeze({
  ...Object.fromEntries(Object.entries(PRECISION_RULES).map(([id,r])=>[id,{mode:'precision',family:'precision',name:r.name}])),
  ...Object.fromEntries(Object.entries(MELODY_RULES).map(([id,r])=>[id,{mode:'music',family:'music',name:r.name}])),
  reaction:{mode:'reaction',family:'reaction',name:'Reaction Puzzle'},
  '013':{mode:'reaction',family:'reaction',name:'Reaction Budget',blastLimit:3},
  cargo:{mode:'cargo',family:'transport',name:'Cargo Rescue'},
  '030':{mode:'cargo',family:'transport',name:'Hazardous Shipment',impactLimit:520},
  outbreak:{mode:'outbreak',family:'containment',name:'Outbreak Containment'},
  '032':{mode:'outbreak',family:'containment',name:'Source Priority',sourceSchedule:true},
  '151':{mode:'capture',family:'transport',name:'Capture Transport Release'}
});
export const EXPERIMENT_PRESETS=['standard','gentle','demanding','custom'];
// Ideas already delivered by a full game mode use that mode's own setup/save UI.
export const EXPERIMENT_DESTINATIONS=Object.freeze({'061':'score-attack'});
export const EXPERIMENT_VERDICTS=['untested','promising','needs-work','keep','shelve'];
export function experimentOptions(id){
  const r=EXPERIMENT_RECIPES[id];if(!r)return [];
  return [{key:'shots',label:'Shot Budget',values:r.mode==='precision'?[PRECISION_RULES[id].shots]:r.mode==='music'?[MELODY_RULES[id].shots]:[4,6,8,10,12]},
    ...(id==='082'?[{key:'timing',label:'Gate Timing',values:[0,1],labels:{0:'Untimed',1:'Timed'}},{key:'offset',label:'Timing Offset',values:[-24,-12,0,12,24],labels:{'-24':'−200 ms','-12':'−100 ms',0:'No offset',12:'+100 ms',24:'+200 ms'}}]:[]),
    ...(id==='090'?[{key:'palette',label:'Pitch Palette',values:[0,1],labels:{0:'C D E G A',1:'D E G A B'}}]:[]),
    ...(r.mode==='cargo'?[{key:'cargoQuota',label:'Cargo Required',values:[1,2,3]},{key:'currentScale',label:'Current Strength',values:[0,.5,1,1.5]}]:[]),
    ...(r.mode==='outbreak'?[{key:'sourceEvery',label:'Source Interval (Turns)',values:[1,2,3]}]:[]),
    ...(r.blastLimit?[{key:'blastLimit',label:'Explosion Limit',values:[3,4]}]:[]),
    ...(r.impactLimit?[{key:'impactLimit',label:'Cargo Impact Limit',values:[350,520,700]}]:[]),
    ...(r.mode==='capture'?[{key:'releaseRadius',label:'Release Radius',values:[100,140,180]}]:[])
  ];
}
export function experimentSetup(id,layout=0,preset='standard',custom={}){
  const r=EXPERIMENT_RECIPES[id];if(!r)throw Error('Unknown experiment');
  const settings={shots:r.mode==='precision'?PRECISION_RULES[id].shots:r.mode==='music'?MELODY_RULES[id].shots:r.mode==='reaction'?6:8};
  if(id==='082')Object.assign(settings,{timing:1,offset:0});
  if(id==='090')settings.palette=0;
  if(r.mode==='cargo')Object.assign(settings,{cargoQuota:2,currentScale:1});
  if(r.mode==='outbreak')settings.sourceEvery=1;
  if(r.blastLimit)settings.blastLimit=r.blastLimit;
  if(r.impactLimit)settings.impactLimit=r.impactLimit;
  if(r.mode==='capture')settings.releaseRadius=140;
  if(preset==='gentle'&&!['precision','music'].includes(r.mode)){settings.shots=12;if(r.mode==='outbreak')settings.sourceEvery=2;if(r.impactLimit)settings.impactLimit=700;}
  if(preset==='demanding'&&!['precision','music'].includes(r.mode)){settings.shots=4;if(r.mode==='cargo')settings.cargoQuota=3;if(r.impactLimit)settings.impactLimit=350;}
  if(preset==='custom')Object.assign(settings,custom);
  return {version:1,rulesVersion:1,experimentId:id,mode:r.mode,layout,preset,settings};
}
export function experimentValidate(value){
  try{
    const s=structuredClone(value),r=EXPERIMENT_RECIPES[s?.experimentId];
    if(!r||s.version!==1||s.rulesVersion!==1||s.mode!==r.mode||!Number.isInteger(s.layout)||s.layout<0||s.layout>2||!EXPERIMENT_PRESETS.includes(s.preset))return null;
    const options=experimentOptions(s.experimentId);
    if(!s.settings||Object.keys(s.settings).length!==options.length||!options.every(o=>o.values.includes(s.settings[o.key])))return null;
    if(s.preset!=='custom'&&JSON.stringify(s.settings)!==JSON.stringify(experimentSetup(s.experimentId,s.layout,s.preset).settings))return null;
    return experimentSetup(s.experimentId,s.layout,s.preset,s.settings);
  }catch{return null;}
}
export function experimentKey(s){
  if(!experimentValidate(s))throw Error('Invalid experiment setup');
  return `${s.experimentId}:r${s.rulesVersion}:l${s.layout}:${s.preset}:`+Object.keys(s.settings).sort().map(k=>`${k}=${s.settings[k]}`).join(',');
}
export const experimentRewarded=s=>!s||!!experimentValidate(s);
export function experimentGoal(s){
  const r=EXPERIMENT_RECIPES[s.experimentId],o=s.settings;
  if(r.mode==='music')return MELODY_RULES[s.experimentId].goal;
  if(r.mode==='precision')return PRECISION_RULES[s.experimentId].goal;
  if(r.mode==='reaction')return `Clear all eight hazards and protect all three cells.${o.blastLimit?' Allow at most '+o.blastLimit+' explosions.':''} Lose if a cell breaks${o.blastLimit?' or the explosion limit is exceeded':''}.`;
  if(r.mode==='cargo')return `Deliver ${o.cargoQuota} of three cargo bubbles. Lose if too few survive.${o.impactLimit?' Cargo ruptures above '+o.impactLimit+' impact speed.':''}`;
  if(r.mode==='outbreak')return `Seal both vents and clear all infection. Lose if the central cell breaks. Vents emit every ${o.sourceEvery}${r.sourceSchedule?' and '+(o.sourceEvery+1):''} turns.`;
  return 'Capture the orange payload on contact, carry it around the wall, then release it near the pink targets. Clear every target. Spikes rupture a carried payload; losing it ends the run.';
}
