import { MEDAL_NAMES, medalHigher, medalEvaluate, poolConditions, poolMedalKey } from './medal.js?v=cd0d6145cbb29d0887e81e0978d8fd4d411c6c3ecac8f6eb29813d4d5677468e';
import { saveValidate } from './engine.js?v=2dd0f771b37dc76497de4916b6a40d2267fe82b6096fb3b47ff898d77220ee69';
export const STORAGE = 'ricochet-bloom-pool-v3', LEGACY_STORAGE = 'ricochet-bloom-pool-v2';
// Settings must persist even when a trial owns gameplay saving. Merge only the
// requested preferences into the latest raw save; never replace unreadable data.
export function poolPreferencesWrite(storage, patch) {
  try {
    const raw = storage.getItem(STORAGE) ?? storage.getItem(LEGACY_STORAGE);
    const stored = raw === null ? poolStoreRead(null) : JSON.parse(raw);
    if (!stored || typeof stored !== 'object' || Array.isArray(stored)) return false;
    stored.preferences = { ...stored.preferences, ...patch };
    storage.setItem(STORAGE, JSON.stringify(stored));
    return true;
  } catch { return false; }
}
export function poolStoreRead(input) {
  const store = { version: 3, activeMode: 'challenge', pools: { challenge: null, free: null, waves:null }, waveBest:{wave:0,score:0}, best: 0, medals: {}, preferences: {} };
  if (!input || typeof input !== 'object') return store;
  for(const record of poolMedalRecords(input))store.medals[record.key]=record.medal;
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

// Consumers receive named fields, never the persistent tuple encoding.
export function poolMedalRecords(store,filter={}) {
 const medals=store?.medals;
 if(!medals||typeof medals!=='object'||Array.isArray(medals))return [];
 return Object.entries(medals).flatMap(([key,medal])=>{
  try {
   const [version,kind,mode,seed,wave]=JSON.parse(key);
   if(version!==1||!['normal','development'].includes(kind)||!['free','challenge','waves'].includes(mode)||typeof seed!=='string'||seed.length>32||!Number.isSafeInteger(wave)||wave<0||!MEDAL_NAMES.includes(medal))return [];
   const record={key,kind,mode,seed,wave,medal};
   return Object.entries(filter).every(([field,value])=>record[field]===value)?[record]:[];
  }catch{return [];}
 });
}
