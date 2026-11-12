import { unlockedResolve } from './profile.js?v=a67f94be0e184c43ef0ce19cb07a7c7b364e802baf1f90ce5e1795d13cb570fd';
import { GAME_CATALOGUE } from './run.js?v=21036f0f948a62dc2381a98ea661675ef083ad2bd9180bd67176c75cfa9c8261';
import { skillStateCreate } from './skill-effect.js?v=1d4e7d0824a5390ec1da3b40d0c343136d0c37b99fd440c059415e803d655008';

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
