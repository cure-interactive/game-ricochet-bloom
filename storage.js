import { MEDAL_NAMES, medalHigher, medalEvaluate, poolConditions, poolMedalKey } from './medal.js?v=cd0d6145cbb29d0887e81e0978d8fd4d411c6c3ecac8f6eb29813d4d5677468e';
import { saveValidate } from './engine.js?v=eba9789151dfd115dde6337ef3ba1ae79a36e123a8be36be33cc37bf33b1b121';
export const STORAGE = 'ricochet-bloom-pool-v3', LEGACY_STORAGE = 'ricochet-bloom-pool-v2';
export function poolStoreRead(input) {
  const store = { version: 3, activeMode: 'challenge', pools: { challenge: null, free: null, waves:null }, waveBest:{wave:0,score:0}, best: 0, medals: {}, preferences: {} };
  if (!input || typeof input !== 'object') return store;
  if(input.medals&&typeof input.medals==='object'&&!Array.isArray(input.medals)){for(const [key,medal] of Object.entries(input.medals)){try{const [version,kind,mode,seed,wave]=JSON.parse(key);if(version===1&&['normal','development'].includes(kind)&&['free','challenge','waves'].includes(mode)&&typeof seed==='string'&&seed.length<=32&&Number.isSafeInteger(wave)&&wave>=0&&MEDAL_NAMES.includes(medal))store.medals[key]=medal;}catch{}}}
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
export function poolMedalRecord(store,game,kind='normal',waveEvent=null){
  const conditions=poolConditions(game.mode);if(!conditions||game.isFlying&&!waveEvent)return null;
  const evidence=waveEvent?{complete:1,shots:waveEvent.shots}:{complete:game.mode==='free'?Number(game.launches>0):Number(game.mode==='challenge'&&game.isOver&&game.blooms>=3),score:game.score,shots:game.launches};
  const medal=medalEvaluate(conditions,evidence),key=poolMedalKey(game,kind,waveEvent?.number??game.wave?.number);
  if(medal){store.medals??={};store.medals[key]=medalHigher(store.medals[key],medal);}return medal;
}
export function poolStoreSet(store, game, music) {
  store.pools[game.mode] = { game: structuredClone(game), music: structuredClone(music) };
  store.activeMode = game.mode;
  if(game.mode==='waves'){store.waveBest??={wave:0,score:0};store.waveBest.wave=Math.max(store.waveBest.wave,game.wave.number);store.waveBest.score=Math.max(store.waveBest.score,game.score);}
  if (game.mode === 'challenge') store.best = Math.max(store.best, game.score);
}
