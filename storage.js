import { saveValidate } from './engine.js?v=78193f8961efde0cbc94b402713c23a61d5384166c5a072df3d3e9cd12e7b310';
export const STORAGE = 'ricochet-bloom-pool-v3', LEGACY_STORAGE = 'ricochet-bloom-pool-v2';
export function poolStoreRead(input) {
  const store = { version: 3, activeMode: 'challenge', pools: { challenge: null, free: null }, best: 0, preferences: {} };
  if (!input || typeof input !== 'object') return store;
  store.best = Number.isSafeInteger(input.best) && input.best >= 0 ? input.best : 0;
  store.preferences = input.preferences && typeof input.preferences === 'object' ? structuredClone(input.preferences) : {};
  if (input.version === 3) {
    for (const mode of ['challenge', 'free']) {
      const entry = input.pools?.[mode], game = saveValidate(entry?.game);
      if (game?.mode === mode) store.pools[mode] = { game, music: structuredClone(entry.music ?? null) };
    }
    store.activeMode = input.activeMode === 'free' ? 'free' : 'challenge';
  } else {
    const game = saveValidate(input.game);
    if (game) { store.activeMode = game.mode; store.pools[game.mode] = { game, music: structuredClone(input.music ?? null) }; }
  }
  return store;
}
export function poolStoreSet(store, game, music) {
  store.pools[game.mode] = { game: structuredClone(game), music: structuredClone(music) };
  store.activeMode = game.mode;
  if (game.mode === 'challenge') store.best = Math.max(store.best, game.score);
}
