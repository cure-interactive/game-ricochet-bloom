import { unlockedResolve } from './profile.js?v=d4ca539643faf8ddf446cec1a80997a13252a4f8d1805fa5ba3a98ba748553c3';
import { GAME_CATALOGUE } from './run.js?v=c0ea84dd906f0ed13559a0d34416d93c5e872cb0e3ad1100204904c9bb62fa30';
import { skillStateCreate } from './skill-effect.js?v=68c76a93e9644d6325bb5cb6468e19bbb68cf6b8261d5821ee0cec8d49aca638';

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
