import { unlockedResolve } from './profile.js?v=8b46ab3dd82c6cf494dd9495dde1302dd74763ae7b5a4f8a30664c783bd23497';
import { GAME_CATALOGUE } from './run.js?v=8c5cad259a936425799e4ab42a618197c5a72e81e38a2264e6d19508d67b43c4';
import { skillStateCreate } from './skill-effect.js?v=b5d23aae0cfa214b54af02d69a6757f09caf11297ba245a50bf8b94dbdd4b93e';

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
