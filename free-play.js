import { unlockedResolve } from './profile.js?v=f884844be31760a0e8fa2f140e6b67a8238f29681b4d6e77a401fc7596d2d0e8';
import { GAME_CATALOGUE } from './run.js?v=1b76dea28464ccfbae063b3b891b59a3b22e7d7fa85f6a5adc9c243bbdf280b8';
import { skillStateCreate } from './skill-effect.js?v=b256b8e07ee94d01d7ff6ae2229c2641c4e1f19ff70eff46f37fece23e7d9dac';

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
