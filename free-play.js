import { unlockedResolve } from './profile.js?v=59b143bc010948165c731b415d86caebcb0e51dc73986b677e69351cc6bed085';
import { GAME_CATALOGUE } from './run.js?v=ca4ec8955e4b5b1b7bf7fd817c32bddaa80a9060487d6b47c1044eafb5017526';
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
