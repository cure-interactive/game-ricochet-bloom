import {gameCreate} from './engine.js?v=adc6d69546723ce9f5131bf144815dc0a4f6fc6682ee59318309f9f62ca6bed0';
import {playerSync} from './player-upgrade.js?v=205999fde590d7ae1935c6f5a99938cc353989c1dae9cfab7129b62c0b60b55b';
import { unlockedResolve } from './profile.js?v=77a1f73de2dacc19c8256f48f0f24a7b11703d553aac6e8b8f90066c5a175e7b';
import { GAME_CATALOGUE } from './run.js?v=13cddd0791aa2c8ea509a45b8136591b3e0359519cf8ebb3be6fefb2c61961d8';
import { skillStateCreate } from './skill-effect.js?v=b00900f06233cdeb7ee756f7a77164fb4fce302e8b9f5fa270e5b96742ffcda8';

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
