import { unlockedResolve } from './profile.js?v=64181c030af514b97953fae1219e4142f64e30029d87c33eeec1e6d7fff631f1';
import { GAME_CATALOGUE } from './run.js?v=501d720ce1abcc910dfc629974bc0b65ee7bd248c9664a44445ff205fee06a2b';
import { skillStateCreate } from './skill-effect.js?v=2fc91b76fce932fd628970e620536c90ac0648f4d8d41e17bc386ffa52a77a63';

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
