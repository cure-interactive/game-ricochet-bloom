import { saveValidate } from './engine.js?v=2d94bc3e3221c7e6c61b2dd311fe2e42f65f15db0a5dcc360a487c712cf2366f';
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
