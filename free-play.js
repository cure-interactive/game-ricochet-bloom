import { unlockedResolve } from './profile.js?v=89e8220f13dad09da78c045746c499d1a094fcfef7517e021b1a49b6cea6dc7e';
import { GAME_CATALOGUE } from './run.js?v=0038d8de80ab8d3d62548b4a9cc4763c03dfc5b6815cf6dae7476ed2784424e7';
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
