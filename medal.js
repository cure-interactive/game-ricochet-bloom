// Medal rules are independent of simulation/save versions. Keep earned records
// at their original rule version if targets change in a future release.
export const MEDAL_VERSION=1;
export const MEDAL_NAMES=Object.freeze(['Bronze','Silver','Gold']);
export const medalRank=name=>MEDAL_NAMES.indexOf(name);
export const medalHigher=(a,b)=>medalRank(b)>medalRank(a)?b:a??null;
const number=n=>n.toLocaleString('en-US');
export function scoreConditions(targets,finish='Finish the run'){
  return MEDAL_NAMES.map(name=>({name,text:`${finish} · ${number(targets[name])} score`,metric:'score',target:targets[name],direction:'at-least'}));
}
// Gold shot counts are backed by real physical solutions for all three boards.
export const TRIAL_GOLD=Object.freeze({
  '001':[1,1,1],'002':[1,2,2],'003':[5,5,5],'004':[1,1,1],
  '005':[2,2,3],'006':[1,1,1],'007':[1,1,1],'008':[1,2,2],
  '009':[1,1,1],'010':[1,2,5],
  '081':[2,3,6],'082':[2,3,3],'083':[2,3,6],'084':[5,6,8],
  '085':[7,5,6],'086':[2,2,3],'087':[3,3,4],'088':[2,2,4],
  '089':[2,3,3],'090':[1,1,1],
  reaction:[2,3,3],'013':[2,3,3],cargo:[3,3,3],'030':[3,3,4],
  outbreak:[5,5,5],'032':[5,5,5],'151':[3,3,3]
});
const BANK_GOLD={'001':[1,1,1],'004':[0,1,1],'006':[0,1,1],'007':[8,8,9]};
const condition=(name,text,metric,target,direction='at-most')=>({name,text,metric,target,direction});
export function trialConditions(setup){
  const id=setup.experimentId,gold=TRIAL_GOLD[id]?.[setup.layout],budget=setup.settings.shots;
  if(gold===undefined)throw Error('Missing medal rules for '+id);
  if(id==='090')return MEDAL_NAMES.map((name,i)=>condition(name,`Save a composition · ${[1,3,5][i]} different pitches in its last 64 notes`,'pitches',[1,3,5][i],'at-least'));
  const bronze=condition('Bronze','Complete the level','complete',1,'at-least');
  if(BANK_GOLD[id]){const banks=BANK_GOLD[id][setup.layout];return [bronze,condition('Silver',`Complete · at most ${banks+2} wall banks`,'banks',banks+2),condition('Gold',`Complete · at most ${banks} wall bank${banks===1?'':'s'}`,'banks',banks)];}
  // Very short custom budgets cannot have three distinct shot thresholds.
  // Use active motion time; aiming, pauses and beat previews never count.
  if(budget<=gold+1)return [bronze,condition('Silver',`Complete · at most ${budget*6} seconds in motion`,'seconds',budget*6),condition('Gold',`Complete · at most ${budget*4} seconds in motion`,'seconds',budget*4)];
  const silver=Math.min(budget-1,gold+Math.max(1,Math.ceil((budget-gold)/2)));
  return [bronze,condition('Silver',`Complete · at most ${silver} shots`,'shots',silver),condition('Gold',`Complete · at most ${gold} shot${gold===1?'':'s'}`,'shots',gold)];
}
export function trialEvidence(game){
  return {version:MEDAL_VERSION,complete:game.phase==='won'?1:0,shots:game.shots,seconds:game.tick/120,banks:game.precision?.banks??0,pitches:new Set(game.melody?.heard??[]).size};
}
export function medalEvaluate(conditions,evidence){
  if(!evidence?.complete)return null;
  return [...conditions].reverse().find(c=>Number.isFinite(evidence[c.metric])&&(c.direction==='at-least'?evidence[c.metric]>=c.target:evidence[c.metric]<=c.target))?.name??null;
}
export const trialMedal=(setup,evidence)=>medalEvaluate(trialConditions(setup),evidence);
export function medalEvidenceValid(e){return e?.version===MEDAL_VERSION&&[0,1].includes(e.complete)&&['shots','banks','pitches'].every(k=>Number.isSafeInteger(e[k])&&e[k]>=0)&&(!e.complete||e.shots>=1)&&e.pitches<=7&&Number.isFinite(e.seconds)&&e.seconds>=0;}
export function poolConditions(mode){
  if(mode==='free')return scoreConditions({Bronze:1000,Silver:5000,Gold:15000},'Settle a shot');
  if(mode==='waves')return [condition('Bronze','Clear this wave in 5 shots','shots',5),condition('Silver','Clear this wave in at most 4 shots','shots',4),condition('Gold','Clear this wave in at most 3 shots','shots',3)];
  if(mode==='challenge')return [condition('Bronze','Make 3 blooms before shots run out','complete',1,'at-least'),condition('Silver','Make 3 blooms in at most 8 shots','shots',8),condition('Gold','Make 3 blooms in at most 5 shots','shots',5)];
  return null;
}
export const poolMedalKey=(game,kind='normal',wave=game.wave?.number)=>JSON.stringify([MEDAL_VERSION,kind,game.mode,game.seed,game.mode==='waves'?wave:0]);
