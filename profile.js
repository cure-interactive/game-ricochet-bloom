import { CATALOGUE, CURRENCIES, STARTERS, TRACKS, REWARD, nodePrerequisitesMet, nodeActivationMet, FAMILIES, legacyFamilyAccess, catalogueNode } from './catalogue.js?v=c9ff036f85fda07c94971bb9701dc181e070bf11984ca7b8b6cc458235afcef6';

export const PROFILE_VERSION = 1;
const integer = value => Number.isSafeInteger(value) && value >= 0;
const object = value => value !== null && typeof value === 'object' && !Array.isArray(value);
const own = (value, key) => Object.hasOwn(value, key);
const unique = value => Array.isArray(value) && value.every(item => typeof item === 'string') && new Set(value).size === value.length;
const runIdValid = value => typeof value === 'string' && /^[A-Za-z0-9_-]{1,80}$/.test(value);
const rejected = reason => ({ ok: false, reason });
const accepted = (profile, extra = {}) => ({ ok: true, profile, ...extra });
const advance = profile => { if (!integer(profile.revision + 1)) return false; profile.revision++; return true; };
const nodeGet = (catalogue,id) => typeof id==='string' ? catalogueNode(catalogue,id) : null;

export function profileCreate(kind = 'normal') {
  if (!['normal', 'development'].includes(kind)) throw new TypeError('Invalid profile kind');
  return { version: PROFILE_VERSION, kind, revision: 0, wallet: { seeds: 0 },
    familyUnlocks: [], familyAccess: Object.fromEntries(FAMILIES.map(f=>[f,1])), research: Object.fromEntries(STARTERS.map(power => [`${power}.base`, { paid: 0 }])), rewards: [] };
}

function rewardNormalize(event, catalogue) {
  if (!object(event) || event.mode !== 'song-run') return null;
  if (event.type === 'tutorial') return event.bloom === true ? { mode: event.mode, type: 'tutorial', bloom: true } : null;
  if (!['pool', 'victory', 'failure'].includes(event.type) || !runIdValid(event.runId) || !TRACKS.includes(event.trackId) ||
    ![3, 5].includes(event.poolCount) || (event.poolCount === 3 && event.trackId !== 'first-light')) return null;
  const result = { mode: event.mode, type: event.type, runId: event.runId, trackId: event.trackId, poolCount: event.poolCount };
  if (event.type !== 'victory') {
    if (!integer(event.poolIndex) || event.poolIndex >= event.poolCount) return null;
    result.poolIndex = event.poolIndex;
  }
  if (event.type === 'pool') {
    if (typeof event.bonus !== 'boolean' || !unique(event.activated) || event.activated.some(id => !own(catalogue.powers, id))) return null;
    result.bonus = event.bonus; result.activated = [...event.activated].sort();
  }
  if (event.type === 'failure') {
    if (!integer(event.blooms) || typeof event.abandoned !== 'boolean') return null;
    result.blooms = event.blooms; result.abandoned = event.abandoned;
  }
  return result;
}
function rewardKey(event) { return event.type === 'tutorial' ? 'tutorial' : `${event.runId}/${event.type === 'pool' ? 'pool/' + event.poolIndex : 'result'}`; }
function rewardState(catalogue) {
  return { receipts: new Map(), runs: new Map(), completedTracks: new Set(),
    mastery: Object.fromEntries(Object.keys(catalogue.powers).map(key => [key, 0])) };
}
function rewardApply(state, event) {
  const id = rewardKey(event);
  if (state.receipts.has(id)) return null;
  let amount = REWARD.tutorial;
  if (event.type !== 'tutorial') {
    const run = state.runs.get(event.runId) || { trackId: event.trackId, poolCount: event.poolCount, clears: 0, terminal: false };
    if (run.trackId !== event.trackId || run.poolCount !== event.poolCount || run.terminal) return null;
    if (event.type === 'pool') {
      if (event.poolIndex !== run.clears) return null;
      amount = REWARD.pool + (event.bonus ? REWARD.bonus : 0); run.clears++;
      for (const power of event.activated) state.mastery[power]++;
    } else if (event.type === 'failure') {
      if (event.poolIndex !== run.clears) return null;
      amount = !event.abandoned && event.blooms > 0 ? REWARD.failure : 0; run.terminal = true;
    } else {
      if (run.clears !== run.poolCount) return null;
      // A prototype clear never consumes the full-track first-clear award.
      const fullTrack = run.poolCount === 5;
      amount = REWARD.victory + (fullTrack && !state.completedTracks.has(event.trackId) ? REWARD.firstClear : 0);
      if (fullTrack) state.completedTracks.add(event.trackId);
      run.terminal = true;
    }
    state.runs.set(event.runId, run);
  }
  const receipt = { id, event, amount };
  state.receipts.set(id, receipt); return receipt;
}
function rewardsInspect(rewards, catalogue) {
  if (!Array.isArray(rewards) || rewards.length > 100000) return null;
  const state = rewardState(catalogue);
  for (const receipt of rewards) {
    if (!object(receipt)) return null;
    const event = rewardNormalize(receipt.event, catalogue);
    if (!event) return null;
    const expected = rewardApply(state, event);
    if (!expected || receipt.id !== expected.id || receipt.amount !== expected.amount) return null;
  }
  return state;
}

// Validation returns a detached canonical snapshot, never repairs a bad purchase.
// Support flags affect new purchases/equipment, not preservation of old ownership.
export function profileValidate(input, catalogue = CATALOGUE, expectedKind = null) {
  if (!object(input) || input.version !== PROFILE_VERSION || !['normal', 'development'].includes(input.kind) ||
    (expectedKind !== null && input.kind !== expectedKind) || !integer(input.revision) || !object(input.wallet) ||
    Object.keys(input.wallet).length !== Object.keys(CURRENCIES).length || !integer(input.wallet.seeds) || !object(input.research)) return null;
  const summary = rewardsInspect(input.rewards, catalogue);
  if (!summary) return null;
  const research = {};
  for (const [id, purchase] of Object.entries(input.research)) {
    const node = nodeGet(catalogue, id);
    if (!node || !object(purchase) || !integer(purchase.paid) || !nodeActivationMet(node, key => own(input.research, key)) ||
      (input.kind === 'normal' && summary.mastery[node.power] < node.masteryPools)) return null;
    research[id] = { paid: purchase.paid };
  }
  if (STARTERS.some(power => research[power + '.base']?.paid !== 0)) return null;
  const familyAccess=input.familyAccess===undefined?legacyFamilyAccess(research,catalogue):input.familyAccess;
  if(!object(familyAccess)||Object.keys(familyAccess).length!==FAMILIES.length||FAMILIES.some(f=>![1,2,3].includes(familyAccess[f])))return null;
  // Old profiles had every family available. Preserve that access and any out-of-order research.
  const familyUnlocks=input.familyUnlocks===undefined?[...FAMILIES]:input.familyUnlocks;
  if(!unique(familyUnlocks)||familyUnlocks.some(f=>!FAMILIES.includes(f)))return null;
  return { version: PROFILE_VERSION, familyUnlocks:[...familyUnlocks], familyAccess:{...familyAccess}, kind: input.kind, revision: input.revision, wallet: { seeds: input.wallet.seeds },
    research, rewards: [...summary.receipts.values()] };
}
export function profileSummary(input, catalogue = CATALOGUE) {
  const profile = profileValidate(input, catalogue);
  if (!profile) return null;
  const summary = rewardsInspect(profile.rewards, catalogue);
  return { mastery: { ...summary.mastery }, completedTracks: [...summary.completedTracks] };
}
export function profilePurchase(input, id, catalogue = CATALOGUE) {
  const profile = profileValidate(input, catalogue), node = nodeGet(catalogue, id);
  if (!profile) return rejected('invalid-profile');
  if (!node?.supported || node.historical) return rejected('unavailable-node');
  if (own(profile.research, id)) return rejected('already-owned');
  if (!nodePrerequisitesMet(node, key => own(profile.research, key))) return rejected('prerequisite');
  if (profile.kind === 'normal' && profileSummary(profile, catalogue).mastery[node.power] < node.masteryPools) return rejected('mastery');
  if (profile.wallet.seeds < node.seedCost) return rejected('insufficient-seeds');
  if (!advance(profile)) return rejected('revision-overflow');
  profile.wallet.seeds -= node.seedCost; profile.research[id] = { paid: node.seedCost };
  return accepted(profile, { purchased: id, paid: node.seedCost });
}
// Call only from validated Song Run outcomes, never legacy score or idle time.
// This is local consistency validation, not server-side anti-cheat.
export function profileReward(input, event, catalogue = CATALOGUE) {
  const profile = profileValidate(input, catalogue), normalized = rewardNormalize(event, catalogue);
  if (!profile) return rejected('invalid-profile');
  if (!normalized) return rejected('invalid-outcome');
  const summary = rewardsInspect(profile.rewards, catalogue), previous = summary.receipts.get(rewardKey(normalized));
  if (previous) return JSON.stringify(previous.event) === JSON.stringify(normalized)
    ? accepted(profile, { duplicate: true, receipt: structuredClone(previous) }) : rejected('reward-conflict');
  if (normalized.type === 'pool' && normalized.activated.some(power => !own(profile.research, power + '.base'))) return rejected('unowned-power');
  const receipt = rewardApply(summary, normalized);
  if (!receipt) return rejected('outcome-order');
  if (!integer(profile.wallet.seeds + receipt.amount)) return rejected('balance-overflow');
  if (!advance(profile)) return rejected('revision-overflow');
  profile.wallet.seeds += receipt.amount; profile.rewards.push(receipt);
  return accepted(profile, { duplicate: false, receipt: structuredClone(receipt) });
}
export function profileDevelopmentCopy(input, catalogue = CATALOGUE) {
  const profile = profileValidate(input, catalogue);
  if (!profile) return null;
  profile.kind = 'development'; return profile;
}
export function profileCurrencyGrant(input, currency, amount, catalogue = CATALOGUE) {
  const profile = profileValidate(input, catalogue, 'development');
  if (!profile) return rejected('development-only');
  if (typeof currency !== 'string' || !own(CURRENCIES, currency) || !integer(amount)) return rejected('invalid-grant');
  if (!integer(profile.wallet[currency] + amount)) return rejected('balance-overflow');
  if (!advance(profile)) return rejected('revision-overflow');
  profile.wallet[currency] += amount;
  return accepted(profile, { currency, amount });
}

// A resolved loadout contains behavior selections, never mutable wallet/research.
// Campaign research is automatically active. Only incompatible styles need a choice.
export function unlockedResolve(input, selections, catalogue = CATALOGUE) {
  const profile=profileValidate(input,catalogue);
  if(!profile||!unique(selections?.borrowed)||!unique(selections?.equipped))return rejected('invalid-profile');
  const powers=Object.keys(catalogue.powers).filter(p=>own(profile.research,p+'.base'));
  const available=new Set([...Object.keys(profile.research),...selections.borrowed]);
  if(selections.borrowed.some(id=>!nodeGet(catalogue,id)||nodeGet(catalogue,id).kind==='base'||!powers.includes(nodeGet(catalogue,id).power)))return rejected('invalid-discovery');
  if(selections.equipped.some(id=>!nodeGet(catalogue,id)||nodeGet(catalogue,id).kind==='base'||!available.has(id)||!powers.includes(nodeGet(catalogue,id).power)))return rejected('invalid-equipment');
  const equipped=[];
  for(const power of powers){
    const ids=Object.values(catalogue.nodes).filter(n=>n.power===power&&n.kind!=='base'&&available.has(n.id)).map(n=>n.id);
    // Keep the selected style; a freshly researched conflicting style becomes selected by run.js.
    ids.sort((a,b)=>Number(selections.equipped.includes(b))-Number(selections.equipped.includes(a)));
    for(const id of ids)if(!catalogue.nodes[id].conflicts.some(other=>equipped.includes(other)))equipped.push(id);
  }
  return {ok:true,tuning:0,budget:0,bypass:false,equipped,powers:powers.map(power=>resolvePower(power,equipped,catalogue,true))};
}
// Run discovery timing and persistence belong to run.js; borrowed nodes expire there.
export function loadoutResolve(input, loadout, budget, catalogue = CATALOGUE, options = {}) {
  const profile = profileValidate(input, catalogue);
  if (!profile) return rejected('invalid-profile');
  if (!object(loadout) || !unique(loadout.powers) || loadout.powers.length !== 3 || !unique(loadout.equipped) || !unique(loadout.borrowed)) return rejected('invalid-loadout');
  if (!object(options)) return rejected('invalid-options');
  const bypass = options.ignoreBudget === true && profile.kind === 'development';
  if (!integer(budget) || budget > 10 || (options.ignoreBudget && !bypass)) return rejected('invalid-budget');
  if (loadout.powers.some(power => !own(catalogue.powers, power) || !own(profile.research, power + '.base') || !catalogue.nodes[power + '.base'].supported)) return rejected('unavailable-power');
  const available = new Set([...Object.keys(profile.research), ...loadout.borrowed]);
  for (const id of loadout.borrowed) {
    const node = nodeGet(catalogue, id);
    if (!node?.supported || node.kind === 'base' || !loadout.powers.includes(node.power) || !nodeActivationMet(node, key => available.has(key))) return rejected('invalid-discovery');
  }
  const equipped = new Set(loadout.equipped), active = new Set([...loadout.powers.map(id => id + '.base'), ...equipped]);
  let tuning = 0;
  for (const id of equipped) {
    const node = nodeGet(catalogue, id);
    if (!node?.supported || node.kind === 'base' || !available.has(id) || !loadout.powers.includes(node.power) || !nodeActivationMet(node, key => active.has(key))) return rejected('invalid-equipment');
    const conflict = node.conflicts.find(other => equipped.has(other));
    if (conflict) return { ...rejected('incompatible-upgrades'), conflicts: [id, conflict], message: node.conflictReason };
    tuning += node.tuningCost;
  }
  if (!bypass && tuning > budget) return rejected('over-budget');
  return { ok: true, tuning, budget, bypass, powers: loadout.powers.map(power=>resolvePower(power,[...equipped],catalogue,false)) };
}

// Research identities are independent of the engine's existing behavior flags.
function resolvePower(power,equipped,catalogue,includeBase){
 const effects=new Set(includeBase ? catalogue.powers[power].included : []);
 for(const id of equipped){const node=nodeGet(catalogue,id);if(node?.power===power)for(const effect of node.effects)effects.add(effect);}
 return {power,foundation:effects.has('foundation'),variants:['a','b'].filter(k=>effects.has(k)),capstone:effects.has('capstone')};
}
