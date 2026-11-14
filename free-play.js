import { unlockedResolve } from './profile.js?v=0b05c511a8d50dfef71056cb28ebfcbc71df391bc08d7af6fd865a7ba33aeef2';
import { GAME_CATALOGUE } from './run.js?v=eb1f706f689b3079fea4ecb6e90354a12c77a1b51e17ab05552d3f14403957b8';
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
