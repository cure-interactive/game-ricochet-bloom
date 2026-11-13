import { trialValidate } from './trial.js?v=cbc58c6d0b89eeb2ea6d8c2c5cc2767348eb84bb021d12ce82e00224a7237df9';
export const trialKey=(kind,mode)=>`ricochet-bloom-trial-v1-${kind}-${mode}`;
export function trialRead(storage,kind,mode){
  try{const raw=storage.getItem(trialKey(kind,mode));if(!raw)return {ok:true,entry:null};const entry=JSON.parse(raw),game=trialValidate(entry.game);if(!game||game.kind!==kind||game.mode!==mode)return {ok:false,entry:null};return {ok:true,entry:{game,music:entry.music}};}catch{return {ok:false,entry:null};}
}
export function trialWrite(storage,game,music){
  try{if(!trialValidate(game))return false;storage.setItem(trialKey(game.kind,game.mode),JSON.stringify({game:{...game,events:[]},music}));return true;}catch{return false;}
}
