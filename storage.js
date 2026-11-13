import { saveValidate } from './engine.js?v=8f3aec315f5641fc3607ff24db94ba5aedb253a753d259fc501c3a6fe65cad8a';
export const STORAGE = 'ricochet-bloom-pool-v3', LEGACY_STORAGE = 'ricochet-bloom-pool-v2';
export function poolStoreRead(input) {
  const store = { version: 3, activeMode: 'challenge', pools: { challenge: null, free: null, waves:null }, waveBest:{wave:0,score:0}, best: 0, preferences: {} };
  if (!input || typeof input !== 'object') return store;
  store.best = Number.isSafeInteger(input.best) && input.best >= 0 ? input.best : 0;
  for(const key of ['wave','score'])if(Number.isSafeInteger(input.waveBest?.[key])&&input.waveBest[key]>=0)store.waveBest[key]=input.waveBest[key];
  store.preferences = input.preferences && typeof input.preferences === 'object' ? structuredClone(input.preferences) : {};
  if (input.version === 3) {
    for (const mode of ['challenge', 'free', 'waves']) {
      const entry = input.pools?.[mode], game = saveValidate(entry?.game);
      if (game?.mode === mode) store.pools[mode] = { game, music: structuredClone(entry.music ?? null) };
    }
    store.activeMode = ['free','waves'].includes(input.activeMode)?input.activeMode:'challenge';
  } else {
    const game = saveValidate(input.game);
    if (game) { store.activeMode = game.mode; store.pools[game.mode] = { game, music: structuredClone(input.music ?? null) }; }
  }
  return store;
}
export function poolStoreSet(store, game, music) {
  store.pools[game.mode] = { game: structuredClone(game), music: structuredClone(music) };
  store.activeMode = game.mode;
  if(game.mode==='waves'){store.waveBest??={wave:0,score:0};store.waveBest.wave=Math.max(store.waveBest.wave,game.wave.number);store.waveBest.score=Math.max(store.waveBest.score,game.score);}
  if (game.mode === 'challenge') store.best = Math.max(store.best, game.score);
}
