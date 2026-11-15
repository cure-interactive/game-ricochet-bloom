import {gameCreate} from './engine.js?v=27a29e6d2cba5ed4d8a714591cb6751bcf16bb1cea5790adfc71e5146d80876e';
import {playerSync} from './player-upgrade.js?v=205999fde590d7ae1935c6f5a99938cc353989c1dae9cfab7129b62c0b60b55b';
import { unlockedResolve } from './profile.js?v=f7b3a87fc5d7716a89298b57239615e23d05fe47498eeb878a028f5b9af6bab2';
import { GAME_CATALOGUE } from './run.js?v=a94c7f4c0c0973d817eacf5436f00e19f3a7ce67701e23687687ecbdff39fb6e';
import { skillStateCreate } from './skill-effect.js?v=00306505aba47472293f9f7ac25546ba1565afbc197b3654d49e1f688f523013';

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

// A new detached Free Play pool follows the same setup as the playable mode.
export function freePlayCreate(seed,progress){
 const game=gameCreate(seed,'free');freePlaySync(game,progress);playerSync(game,progress.profile);return game;
}
