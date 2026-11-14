import { progressionCreate, progressionValidate } from './run.js?v=b47c3f885b07c46836252a6c8cfafb49f104739e6df184495226908f5faeb0f9';
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
  let corrupt=false;
  for(const suffix of ['', '-backup'])try{const raw=storage.getItem(key(kind)+suffix);if(raw!==null){const state=progressionValidate(JSON.parse(raw),kind);if(state)return {state,recovered:!!suffix,available:true};corrupt=true;}}catch{corrupt=true;}
  return {state:progressionCreate(kind),recovered:false,available:!corrupt};
}
export function progressionWrite(storage,input){
  const kind=input?.profile?.kind,state=progressionValidate(input,kind);if(!state)return {ok:false,reason:'Progress could not be validated. Your previous save is safe.'};
  try{const name=key(kind),previous=storage.getItem(name);let validPrevious=false;try{validPrevious=!!previous&&!!progressionValidate(JSON.parse(previous),kind);}catch{}if(validPrevious)storage.setItem(name+'-backup',previous);storage.setItem(name,JSON.stringify(state));return {ok:true,state};}
  catch{return {ok:false,reason:'Saving is unavailable. Free some browser storage before changing progression.'};}
}
export function progressionImport(storage,text,kind='normal'){let state;try{state=progressionValidate(JSON.parse(text),kind);}catch{}return state?progressionWrite(storage,state):{ok:false,reason:'This is not a valid '+kind+' progression file.'};}
