import { progressionCreate, progressionValidate } from './run.js?v=95e425ab4f39f5e80330efcc535f5ee782c2e8947942cffcee6cd463178af3c1';
export const PROGRESSION_KEY='ricochet-bloom-progression-v1';
const key=kind=>PROGRESSION_KEY+(kind==='development'?'-development':'');
export function progressionRead(storage,kind='normal') {
  let corrupt=false;
  for(const suffix of ['', '-backup'])try{const raw=storage.getItem(key(kind)+suffix);if(raw!==null){const state=progressionValidate(JSON.parse(raw),kind);if(state)return {state,recovered:!!suffix,available:true};corrupt=true;}}catch{corrupt=true;}
  return {state:progressionCreate(kind),recovered:false,available:!corrupt};
}
export function progressionWrite(storage,input){
  const kind=input?.profile?.kind,state=progressionValidate(input,kind);if(!state)return {ok:false,reason:'Progress could not be validated. Your previous save is safe.'};
  try{const name=key(kind),previous=storage.getItem(name);if(previous&&progressionValidate(JSON.parse(previous),kind))storage.setItem(name+'-backup',previous);storage.setItem(name,JSON.stringify(state));return {ok:true,state};}
  catch{return {ok:false,reason:'Saving is unavailable. Free some browser storage before changing progression.'};}
}
export function progressionImport(storage,text,kind='normal'){let state;try{state=progressionValidate(JSON.parse(text),kind);}catch{}return state?progressionWrite(storage,state):{ok:false,reason:'This is not a valid '+kind+' progression file.'};}
