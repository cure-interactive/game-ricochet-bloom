import {gameCreate} from './engine.js?v=b2a7731e93a4103079007e6fb396de5e246d561444e4313122aba52136f8ac3b';
import {playerSync} from './player-upgrade.js?v=2f8094123653e7654746e834352d2180922eb090ccd1d9e358a596ab2bcd37f9';
import { unlockedResolve } from './profile.js?v=158288c80ff606a4bc820da33ab77138b46da32e904b28186088233dd839191d';
import { GAME_CATALOGUE } from './run.js?v=1e0bdaf30c5327f0cc68f9919e08cba1b81cb302dff937b1bbfdae8fb6c8ea56';
import { skillStateCreate } from './skill-effect.js?v=727e7de86b0868ac64950fc8cd89a06c9f4a7a3d8efd7b7fccb21bc1018dbd47';

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
