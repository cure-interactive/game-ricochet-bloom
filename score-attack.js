// Shared rules for the engine, menu, HUD and saved personal records.
export const SCORE_BUDGETS=Object.freeze([5,10,15]);
export const SCORE_DEFAULT=10;
export const SCORE_SEED='SCORE-ATTACK';
export const scoreTargets=budget=>({Bronze:budget*300,Silver:budget*600,Gold:budget*1000});
export function scoreMedal(score,budget){const targets=scoreTargets(budget);return ['Gold','Silver','Bronze'].find(name=>score>=targets[name])||null;}
export function scoreAttackValid(game){
  if(game.mode!=='score-attack')return game.attack===undefined;
  const a=game.attack;
  return !!a&&SCORE_BUDGETS.includes(a.budget)&&['normal','development'].includes(a.kind)&&game.seed===SCORE_SEED&&
    game.launches+game.plucks===a.budget&&game.launches<=a.budget&&
    game.isOver===(game.plucks===0&&!game.isFlying)&&(!game.earning||game.earning.kind===a.kind);
}
