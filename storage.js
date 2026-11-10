import { saveValidate } from './engine.js?v=3866c817d261df98d09b8f4b537d91c3b9b0498907e606f8585acde8f0ddd411';
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
