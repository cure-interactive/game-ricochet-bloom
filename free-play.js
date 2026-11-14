import { unlockedResolve } from './profile.js?v=1ea1f375cbce19893275eb111e5332fa7e4f80bfd6ce219b63a8cc1cf096da39';
import { GAME_CATALOGUE } from './run.js?v=89924fc248ac7dee4bed6dc9f898e94f3f74febad5979a15e2015f89ce53037d';
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
