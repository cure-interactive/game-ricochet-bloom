import { saveValidate } from './engine.js?v=eba9789151dfd115dde6337ef3ba1ae79a36e123a8be36be33cc37bf33b1b121';
import { SCORE_BUDGETS } from './score-attack.js?v=0f35b25842dfb9cfe110fc14f07cae2cd19505b3deda3b7e67833a9a8f1a9c1e';
export const scoreKey=(kind,budget)=>`ricochet-bloom-score-attack-v1-${kind}-${budget}`;
export function scoreRead(storage,kind,budget){
  if(!['normal','development'].includes(kind)||!SCORE_BUDGETS.includes(budget))return {ok:false,entry:null,best:null};
  try{
    const raw=storage.getItem(scoreKey(kind,budget));if(!raw)return {ok:true,entry:null,best:null};
    const value=JSON.parse(raw),game=saveValidate(value.game);
    if(!game||game.mode!=='score-attack'||game.attack.kind!==kind||game.attack.budget!==budget||
      !(value.best===null||Number.isSafeInteger(value.best)&&value.best>=0))return {ok:false,entry:null,best:null};
    return {ok:true,entry:{game,music:value.music},best:value.best};
  }catch{return {ok:false,entry:null,best:null};}
}
export function scoreWrite(storage,game,music,{replace=false}={}){
  if(game.mode!=='score-attack'||!saveValidate(game))return false;
  const {kind,budget}=game.attack,previous=scoreRead(storage,kind,budget);
  if(!previous.ok&&!replace)return false;
  const best=game.isOver?Math.max(previous.best??0,game.score):previous.best;
  try{storage.setItem(scoreKey(kind,budget),JSON.stringify({game,music,best}));return true;}catch{return false;}
}
