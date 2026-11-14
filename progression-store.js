import { progressionCreate, progressionValidate } from './run.js?v=89924fc248ac7dee4bed6dc9f898e94f3f74febad5979a15e2015f89ce53037d';
export const PROGRESSION_KEY='ricochet-bloom-progression-v1';
export const DEVELOPMENT_SETTINGS_KEY='ricochet-bloom-development-settings-v1';
const developmentDefaults=()=>({version:1,enabled:false,grantAmount:100,showHiddenContent:false,showPurchasedCosts:false});
const validDevelopmentSettings=value=>value?.version===1&&typeof value.enabled==='boolean'&&Number.isSafeInteger(value.grantAmount)&&value.grantAmount>=1&&value.grantAmount<=1000000&&(value.showAllSkills===undefined||typeof value.showAllSkills==='boolean')&&(value.showHiddenContent===undefined||typeof value.showHiddenContent==='boolean')&&(value.showPurchasedCosts===undefined||typeof value.showPurchasedCosts==='boolean');
export function developmentSettingsRead(storage){
  try{const value=JSON.parse(storage.getItem(DEVELOPMENT_SETTINGS_KEY));if(validDevelopmentSettings(value))return {version:1,enabled:value.enabled,grantAmount:value.grantAmount,showHiddenContent:value.showHiddenContent??value.showAllSkills??false,showPurchasedCosts:value.showPurchasedCosts??false};}catch{}
  return developmentDefaults();
}
export function developmentSettingsWrite(storage,input){
  if(!validDevelopmentSettings(input))return {ok:false,reason:'Use a whole Points amount from 1 to 1,000,000.'};
  const settings={version:1,enabled:input.enabled,grantAmount:input.grantAmount,showHiddenContent:input.showHiddenContent??input.showAllSkills??false,showPurchasedCosts:input.showPurchasedCosts??false};
  try{storage.setItem(DEVELOPMENT_SETTINGS_KEY,JSON.stringify(settings));return {ok:true,settings};}
  catch{return {ok:false,reason:'Development settings could not be saved. Free some browser storage and try again.'};}
}
const key=kind=>PROGRESSION_KEY+(kind==='development'?'-development':'');
export function progressionRead(storage,kind='normal') {
  const recovery={format:'ricochet-bloom-progress-recovery',version:1,kind,main:null,backup:null,checks:{}};
  let corrupt=false,unavailable=false;
  for(const [name,suffix] of [['main',''],['backup','-backup']]){
    let raw;
    try{raw=storage.getItem(key(kind)+suffix);recovery[name]=raw;}
    catch{corrupt=true;unavailable=true;recovery.checks[name]='storage-unavailable';continue;}
    if(raw===null){recovery.checks[name]='missing';continue;}
    let value;
    try{value=JSON.parse(raw);}catch{corrupt=true;recovery.checks[name]='invalid-json';continue;}
    let state;try{state=progressionValidate(value,kind);}catch{}
    if(state)return {state,recovered:!!suffix,available:true};
    corrupt=true;recovery.checks[name]='incompatible-progress';
  }
  return {state:progressionCreate(kind),recovered:false,available:!corrupt,...(corrupt?{problem:unavailable?'unavailable':'invalid',recovery}:{})};
}

// Explicit recovery only: archive exact bytes before replacing an unreadable profile.
export function progressionResetUnreadable(storage,kind='normal'){
  const loaded=progressionRead(storage,kind);
  if(loaded.available)return {ok:false,reason:'Progress is readable again. Retry loading it instead.'};
  const archived=archiveUnreadable(storage,kind,loaded);
  return archived.ok?progressionWrite(storage,loaded.state):archived;
}
function archiveUnreadable(storage,kind,loaded){
  if(loaded.problem==='unavailable')return {ok:false,reason:'Browser storage cannot be accessed. Nothing has been replaced.'};
  try{
    const base=key(kind)+'-unreadable';let archive=base,index=1;
    while(storage.getItem(archive)!==null)archive=base+'-'+index++;
    const raw=JSON.stringify(loaded.recovery);storage.setItem(archive,raw);
    if(storage.getItem(archive)!==raw)return {ok:false,reason:'The recovery copy could not be verified. Nothing has been replaced.'};
    return {ok:true};
  }catch{return {ok:false,reason:'The recovery copy could not be saved. Nothing has been replaced.'};}
}
export function progressionWrite(storage,input){
  const kind=input?.profile?.kind,state=progressionValidate(input,kind);if(!state)return {ok:false,reason:'Progress could not be validated. Your previous save is safe.'};
  try{const name=key(kind),previous=storage.getItem(name);let validPrevious=false;try{validPrevious=!!previous&&!!progressionValidate(JSON.parse(previous),kind);}catch{}if(validPrevious)storage.setItem(name+'-backup',previous);storage.setItem(name,JSON.stringify(state));return {ok:true,state};}
  catch{return {ok:false,reason:'Saving is unavailable. Free some browser storage before changing progression.'};}
}
export function progressionImport(storage,text,kind='normal'){
  let state;try{state=progressionValidate(JSON.parse(text),kind);}catch{}
  if(!state)return {ok:false,reason:'This is not a valid '+kind+' progression file.'};
  const loaded=progressionRead(storage,kind);
  if(!loaded.available){const archived=archiveUnreadable(storage,kind,loaded);if(!archived.ok)return archived;}
  return progressionWrite(storage,state);
}
