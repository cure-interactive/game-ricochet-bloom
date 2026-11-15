import {gameCreate} from './engine.js?v=effdad3393e29949339e4f680eb50871d4dea3ee2a39ee5c96140de3b1404fee';
import {playerSync} from './player-upgrade.js?v=2f8094123653e7654746e834352d2180922eb090ccd1d9e358a596ab2bcd37f9';
import { unlockedResolve } from './profile.js?v=14dbdacea0f7ac8a44d752b92934267d6332d3d95f346b844d7717f582164a38';
import { GAME_CATALOGUE } from './run.js?v=9ff200b09c3b66bb99d641358b6fc72b7ef4244cd3fbc9db89e9fba295a31af5';
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
