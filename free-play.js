import { unlockedResolve } from './profile.js?v=9078c56cc1e0eae227105818494b7175ccc018790a79571c34d411819cb4a6f5';
import { GAME_CATALOGUE } from './run.js?v=f46e437fcd893aaf9e4277a1ca9b56e1ec27ca75f1396d6c33557958bb850b33';
import { skillStateCreate } from './skill-effect.js?v=7832dd7c58ba0da9a3d69a6424a04dc4734479b27b6f3ea1f0810fcb589d59d5';

export function freePlayBuild(progress){
  const equipped=progress.equipped.filter(id=>Object.hasOwn(progress.profile.research,id));
  const resolved=unlockedResolve(progress.profile,{equipped,borrowed:[]},GAME_CATALOGUE);
  if(!resolved.ok)throw new TypeError('Invalid Free Play profile');
  return resolved.powers;
}

// Apply research at a shot boundary, keeping an already-saved flight exact.
// The caller excludes campaign replays, tutorials and upgrade previews.
export function freePlaySync(game,progress){
  if(!['free','waves'].includes(game.mode)||game.isFlying)return false;
  const build=freePlayBuild(progress);
  if(game.randomPowers===true&&JSON.stringify(game.build)===JSON.stringify(build))return false;
  game.build=build;game.randomPowers=true;game.skillState=skillStateCreate();
  if(!build.some(p=>p.power===game.power.offer))game.power.offer=build[0].power;
  return true;
}
