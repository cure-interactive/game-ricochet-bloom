import { trialEvidence, trialMedal, medalEvidenceValid, medalRank } from './medal.js?v=97f2ce6ed69f5c8834ecd381128c29d366fdfc9390080f59a05049d77db5f006';
import { experimentSetup } from './experiment.js?v=8ea8233f2a63ec7914c38d27cef2dda06f00ef2e61a346f83b06d3d19f285958';
import { trialValidate } from './trial.js?v=dccd712876b5817b12007709d04f7edb679f22aca70910e82e86097c9b6a2888';
export const trialKey=(kind,mode)=>`ricochet-bloom-trial-v1-${kind}-${mode}`;
export function trialRead(storage,kind,mode){
  try{const raw=storage.getItem(trialKey(kind,mode));if(!raw)return {ok:true,entry:null};const entry=JSON.parse(raw),game=trialValidate(entry.game);if(!game||game.kind!==kind||game.mode!==mode)return {ok:false,entry:null};const medals=entry.medals??{};if(!medals||typeof medals!=='object'||Object.entries(medals).some(([level,e])=>!['0','1','2'].includes(level)||!medalEvidenceValid(e)||!e.complete))return {ok:false,entry:null};return {ok:true,entry:{game,music:entry.music,medals}};}catch{return {ok:false,entry:null};}
}
export function trialWrite(storage,game,music){
  try{if(!trialValidate(game))return false;const read=trialRead(storage,game.kind,game.mode);if(!read.ok)return false;const medals=read.entry?.medals??{},setup=game.setup??experimentSetup(game.mode,game.layout),e=trialEvidence(game);if(e.complete&&medalRank(trialMedal(setup,e))>medalRank(medals[game.layout]?trialMedal(setup,medals[game.layout]):null))medals[game.layout]=e;storage.setItem(trialKey(game.kind,game.mode),JSON.stringify({game:{...game,events:[]},music,medals}));return true;}catch{return false;}
}
