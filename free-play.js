import { unlockedResolve } from './profile.js?v=64181c030af514b97953fae1219e4142f64e30029d87c33eeec1e6d7fff631f1';
import { GAME_CATALOGUE } from './run.js?v=d4a0763247cf9d5ad868ce587a2006eccfbca07854878087aa2ab9f3c890b840';
import { skillStateCreate } from './skill-effect.js?v=27a2ab701a8b063fcf28a0d1e0682e04d1a1c6d3e0908c29afad980f201bdb01';

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
