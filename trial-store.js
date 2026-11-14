import { trialEvidence, trialMedal, medalEvidenceValid, medalRank } from './medal.js?v=cd0d6145cbb29d0887e81e0978d8fd4d411c6c3ecac8f6eb29813d4d5677468e';
import { experimentSetup } from './experiment.js?v=09c5c1a420167e74a8d503604cf362e056a4708773247dbe20745db8766748a0';
import { trialValidate } from './trial.js?v=1142334db4d9446b27b412cbc5ad6d9c93bebb7180ae6b645ebcc92c561dd824';
export const trialKey=(kind,mode)=>`ricochet-bloom-trial-v1-${kind}-${mode}`;
export function trialRead(storage,kind,mode){
  try{const raw=storage.getItem(trialKey(kind,mode));if(!raw)return {ok:true,entry:null};const entry=JSON.parse(raw),game=trialValidate(entry.game);if(!game||game.kind!==kind||game.mode!==mode)return {ok:false,entry:null};const medals=entry.medals??{};if(!medals||typeof medals!=='object'||Object.entries(medals).some(([level,e])=>!['0','1','2'].includes(level)||!medalEvidenceValid(e)||!e.complete))return {ok:false,entry:null};return {ok:true,entry:{game,music:entry.music,medals}};}catch{return {ok:false,entry:null};}
}
export function trialWrite(storage,game,music){
  try{if(!trialValidate(game))return false;const read=trialRead(storage,game.kind,game.mode);if(!read.ok)return false;const medals=read.entry?.medals??{},setup=game.setup??experimentSetup(game.mode,game.layout),e=trialEvidence(game);if(e.complete&&medalRank(trialMedal(setup,e))>medalRank(medals[game.layout]?trialMedal(setup,medals[game.layout]):null))medals[game.layout]=e;storage.setItem(trialKey(game.kind,game.mode),JSON.stringify({game:{...game,events:[]},music,medals}));return true;}catch{return false;}
}
