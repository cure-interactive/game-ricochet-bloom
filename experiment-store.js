import { trialEvidence, trialMedal, medalEvidenceValid, medalRank } from './medal.js?v=cd0d6145cbb29d0887e81e0978d8fd4d411c6c3ecac8f6eb29813d4d5677468e';
import { experimentValidate, experimentKey, EXPERIMENT_VERDICTS } from './experiment.js?v=9e917253523cf3fb5c7073b9b981a58461add6544b08e68392ea2b00819d0e72';
import { EXPERIMENT_CATALOGUE } from './experiment-catalogue.js?v=46fd868b7899d3825edca249ee222d0822e27a53f260e03d7069491bca53ea1e';
import { trialValidate } from './trial.js?v=78629f1adb03a46502ce6c7c856e1fba00434d29e18d851f58925af761770f62';
import { trialRead } from './trial-store.js?v=c49f919a2cf7f2cfe6a089967fa1fc619997490010e1e44cb5a8cd502aec8de6';
const ids=new Set([...EXPERIMENT_CATALOGUE.map(e=>e.id),'reaction','cargo','outbreak']);
const favouriteIds=new Set([...ids,'campaign','free','waves','challenge']);
export const experimentStoreKey=kind=>`ricochet-bloom-experiments-v1-${kind}`;
export const experimentEmpty=()=>({version:1,favourites:[],recent:[],setups:[],records:[],saves:[],results:[],reviews:[],lastSetup:null});
const text=(v,max)=>typeof v==='string'&&v.length<=max;
export function experimentLibraryValidate(value,kind){
  try{
    if(!['normal','development'].includes(kind))return null;
    const v=structuredClone(value);
    if(v?.version!==1||!['favourites','recent','saves','results','reviews'].every(k=>Array.isArray(v[k]))||v.favourites.length>favouriteIds.size||v.recent.length>20||v.saves.length>64||v.results.length>200||v.reviews.length>213)return null;
    if(new Set(v.favourites).size!==v.favourites.length||!v.favourites.every(id=>favouriteIds.has(id)))return null;
    if(new Set(v.recent).size!==v.recent.length||!v.recent.every(id=>ids.has(id)))return null;
    if(v.lastSetup!==null&&!experimentValidate(v.lastSetup))return null;
    v.setups??=[];
    if(!Array.isArray(v.setups)||v.setups.length>64||new Set(v.setups.map(s=>s.key)).size!==v.setups.length||v.setups.some(s=>!experimentValidate(s.setup)||s.key!==experimentKey(s.setup)||!text(s.name,80)||!s.name.trim()))return null;
    const keys=new Set();
    for(const entry of v.saves){const g=trialValidate(entry.game);if(!g?.setup||g.kind!==kind||entry.key!==experimentKey(g.setup)||keys.has(entry.key))return null;keys.add(entry.key);entry.game=g;}
    const runs=new Set();
    for(const r of v.results){if(!experimentValidate(r.setup)||!text(r.id,80)||!r.id||runs.has(r.id)||!['won','lost'].includes(r.outcome)||!Number.isInteger(r.shots)||r.shots<0||r.shots>r.setup.settings.shots||!Number.isSafeInteger(r.at)||r.at<0||r.reason!==undefined&&!text(r.reason,150))return null;if(r.medalEvidence!==undefined&&(!medalEvidenceValid(r.medalEvidence)||r.medalEvidence.complete!==Number(r.outcome==='won')||r.medalEvidence.shots!==r.shots))return null;runs.add(r.id);}
    // Initial notebooks had only recent results. Promote those once without
    // inventing outcomes; future writes retain totals beyond the history window.
    if(v.records===undefined){v.records=[];for(const r of v.results)record(v,r);}
    if(!Array.isArray(v.records)||v.records.length>2000||new Set(v.records.map(r=>r.key)).size!==v.records.length)return null;
    for(const r of v.records)if(!experimentValidate(r.setup)||r.key!==experimentKey(r.setup)||!Number.isSafeInteger(r.attempts)||r.attempts<1||!Number.isSafeInteger(r.wins)||r.wins<0||r.wins>r.attempts||(r.wins===0?r.best!==null:!Number.isInteger(r.best)||r.best<1||r.best>r.setup.settings.shots))return null;
    for(const r of v.records)if(r.medalEvidence!==undefined&&(!medalEvidenceValid(r.medalEvidence)||!r.medalEvidence.complete||r.medalEvidence.shots>r.setup.settings.shots||!r.wins))return null;
    const reviewed=new Set();
    for(const r of v.reviews){if(!ids.has(r.id)||reviewed.has(r.id)||!EXPERIMENT_VERDICTS.includes(r.verdict)||!text(r.note,2000)||!Number.isSafeInteger(r.at)||r.at<0)return null;reviewed.add(r.id);}
    return v;
  }catch{return null;}
}
export function experimentRead(storage,kind){
  try{const raw=storage.getItem(experimentStoreKey(kind));if(raw===null)return {ok:true,library:experimentEmpty()};const library=experimentLibraryValidate(JSON.parse(raw),kind);return library?{ok:true,library}:{ok:false,library:null};}catch{return {ok:false,library:null};}
}
export function experimentWrite(storage,kind,library){
  try{const valid=experimentLibraryValidate(library,kind);if(!valid)return false;storage.setItem(experimentStoreKey(kind),JSON.stringify(valid));return true;}catch{return false;}
}
export function experimentFavourite(storage,kind,id){
  const current=experimentRead(storage,kind);
  if(!current.ok||!favouriteIds.has(id))return {ok:false};
  const next=current.library,active=!next.favourites.includes(id);
  next.favourites=active?[...next.favourites,id]:next.favourites.filter(value=>value!==id);
  return experimentWrite(storage,kind,next)?{ok:true,active}:{ok:false};
}
export function experimentRemember(library,setup){
  const next=structuredClone(library);next.lastSetup=structuredClone(setup);next.recent=[setup.experimentId,...next.recent.filter(id=>id!==setup.experimentId)].slice(0,20);return next;
}
export function experimentSave(library,game,music,at=Date.now()){
  if(!trialValidate(game)||!game.setup)throw Error('Invalid experiment');
  const next=experimentRemember(library,game.setup),key=experimentKey(game.setup),entry={key,game:{...structuredClone(game),events:[]},music};
  const previous=next.saves.find(s=>s.key===key),alreadyComplete=previous?.game.id===game.id&&['won','lost'].includes(previous.game.phase);
  next.saves=next.saves.filter(s=>s.key!==key);
  if(next.saves.length>=64){const i=next.saves.findIndex(s=>['won','lost'].includes(s.game.phase));if(i<0)throw Error('64 unfinished setups: finish a run or export and reset the notebook.');next.saves.splice(i,1);}
  next.saves.push(entry);
  if(['won','lost'].includes(game.phase)&&!alreadyComplete&&!next.results.some(r=>r.id===game.id)){const result={id:game.id,setup:structuredClone(game.setup),outcome:game.phase,reason:game.reason,shots:game.shots,medalEvidence:trialEvidence(game),at};next.results.push(result);record(next,result);}
  if(game.phase==='won'){const r=next.records.find(r=>r.key===key),e=trialEvidence(game);if(r&&medalRank(trialMedal(game.setup,e))>medalRank(r.medalEvidence?trialMedal(r.setup,r.medalEvidence):null))r.medalEvidence=e;}
  next.results=next.results.slice(-200);return next;
}
export function experimentBest(library,setup){
  const r=library.records.find(r=>r.key===experimentKey(setup));return r?{attempts:r.attempts,wins:r.wins,best:r.best}:{attempts:0,wins:0,best:null};
}
export function experimentMedal(library,setup){const r=library.records.find(r=>r.key===experimentKey(setup));return r?.medalEvidence?trialMedal(setup,r.medalEvidence):null;}
function record(library,result){
  const key=experimentKey(result.setup);let r=library.records.find(r=>r.key===key);
  if(!r){r={key,setup:structuredClone(result.setup),attempts:0,wins:0,best:null};library.records.push(r);}
  r.attempts++;if(result.outcome==='won'){r.wins++;r.best=Math.min(r.best??Infinity,result.shots);if(result.medalEvidence&&medalRank(trialMedal(r.setup,result.medalEvidence))>medalRank(r.medalEvidence?trialMedal(r.setup,r.medalEvidence):null))r.medalEvidence=structuredClone(result.medalEvidence);}
}
// Older saves remain in their original keys and retain their version-one physics.
export const experimentLegacy=(storage,kind)=>['reaction','cargo','outbreak'].map(mode=>({mode,...trialRead(storage,kind,mode)}));
export function experimentExport(library,kind){return JSON.stringify({format:'ricochet-bloom-experiments',version:1,kind,library},null,2);}
export function experimentImport(raw,kind){
  try{const v=JSON.parse(raw);if(v.format!=='ricochet-bloom-experiments'||v.version!==1||v.kind!==kind)return null;return experimentLibraryValidate(v.library,kind);}catch{return null;}
}
