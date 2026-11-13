import { unlockedResolve } from './profile.js?v=5932d3964e5f79555bdb95acb5af513e122c816380cced060178209d2312947b';
import { GAME_CATALOGUE } from './run.js?v=e3fc5e08ab0c39705bfdd4d290e1761ea139fe39d29b006a8dab548acd2bdb38';
import { skillStateCreate } from './skill-effect.js?v=90a3e793542c39e354a665bbb96ae2105915367ee5f12c1f1a291426e0b632fb';

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
