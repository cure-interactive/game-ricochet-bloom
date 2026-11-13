import { trialValidate } from './trial.js?v=36063d9e90fd1a4bf71a10bd815952cddadaf55bcd32dfa41c64f0a3aa0f6ffc';
export const trialKey=(kind,mode)=>`ricochet-bloom-trial-v1-${kind}-${mode}`;
export function trialRead(storage,kind,mode){
  try{const raw=storage.getItem(trialKey(kind,mode));if(!raw)return {ok:true,entry:null};const entry=JSON.parse(raw),game=trialValidate(entry.game);if(!game||game.kind!==kind||game.mode!==mode)return {ok:false,entry:null};return {ok:true,entry:{game,music:entry.music}};}catch{return {ok:false,entry:null};}
}
export function trialWrite(storage,game,music){
  try{if(!trialValidate(game))return false;storage.setItem(trialKey(game.kind,game.mode),JSON.stringify({game:{...game,events:[]},music}));return true;}catch{return false;}
}
