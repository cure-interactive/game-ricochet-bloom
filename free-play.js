import {gameCreate} from './engine.js?v=b1d1413bc287c32c16aece271eecd01b25e105285dbba57cdc5ec62fc43db36b';
import {playerSync} from './player-upgrade.js?v=2f8094123653e7654746e834352d2180922eb090ccd1d9e358a596ab2bcd37f9';
import { unlockedResolve } from './profile.js?v=158288c80ff606a4bc820da33ab77138b46da32e904b28186088233dd839191d';
import { GAME_CATALOGUE } from './run.js?v=74de39fe01a1546550fa244f53a940c5cc229d87a3504273ee2c7670d2c8c4dd';
import { skillStateCreate } from './skill-effect.js?v=6bc123e911039183cb33d2d4d4f01b63c8a5fdf57cf46b5e716d86a347906c28';

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
