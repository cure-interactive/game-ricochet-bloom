import { unlockedResolve } from './profile.js?v=f09fdb22d84263dcb45cd1d7c9199cc83fc40768057dc69eedef848efd19db7a';
import { GAME_CATALOGUE } from './run.js?v=437191b652f3ef1846b3b93a40c93dd41bd928f024b76961c39006eff07ba611';
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
