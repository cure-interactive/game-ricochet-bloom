import { unlockedResolve } from './profile.js?v=c981db02c3e6061c959d5372ca00296827e5487fc916235922baecb955da3915';
import { GAME_CATALOGUE } from './run.js?v=58c88e9b727d2c38752239506cb914e7198e544cf55e38d7031735e3e065e2f2';
import { skillStateCreate } from './skill-effect.js?v=2fc91b76fce932fd628970e620536c90ac0648f4d8d41e17bc386ffa52a77a63';

export function freePlayBuild(progress){
  const equipped=progress.equipped.filter(id=>Object.hasOwn(progress.profile.research,id));
  const resolved=unlockedResolve(progress.profile,{equipped,borrowed:[]},GAME_CATALOGUE);
  if(!resolved.ok)throw new TypeError('Invalid Free Play profile');
  return resolved.powers;
}

// Apply research at a shot boundary, keeping an already-saved flight exact.
// The caller excludes campaign replays, tutorials and upgrade previews.
export function freePlaySync(game,progress){
  if(game.mode!=='free'||game.isFlying)return false;
  const build=freePlayBuild(progress);
  if(game.randomPowers===true&&JSON.stringify(game.build)===JSON.stringify(build))return false;
  game.build=build;game.randomPowers=true;game.skillState=skillStateCreate();
  if(!build.some(p=>p.power===game.power.offer))game.power.offer=build[0].power;
  return true;
}
