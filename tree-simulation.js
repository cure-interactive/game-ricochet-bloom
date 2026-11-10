import { CATALOGUE, catalogueCreate, STARTERS } from './catalogue.js?v=b65b3f7f09a22d6735e5d632bebcf319d4ce0d1a96ee4e47b07d92e8a1f2128e';
import { profileCreate, profileValidate, profilePurchase, profileRefund, profileRefundPreview, profileReward, loadoutResolve } from './profile.js?v=3e6ed663805419769df28478537c5af4b53c09e55f1f17558898fce633811bc5';

// This capability fixture is exclusively for the UI simulator, never the engine.
export const SIMULATION_CATALOGUE = catalogueCreate(Object.keys(CATALOGUE.nodes));
export const POOL_NAMES = ['Intro', 'Verse', 'Build', 'Bridge', 'Finale'];
export function simulationCreate() {
  return { profile: profileCreate(), powers: [...STARTERS], equipped: ['comet.foundation', 'ripple.foundation'],
    borrowed: ['comet.foundation', 'ripple.foundation'], phase: 'shop', pool: 0, attempt: 0 };
}
export function simulationBudget(state) { return state.phase === 'run' ? 2 + state.pool * 2 : 2; }
export function simulationLoadout(state) {
  return loadoutResolve(state.profile, state, simulationBudget(state), SIMULATION_CATALOGUE);
}
const fail = reason => ({ ok: false, reason });
const success = (state, message) => ({ ok: true, state, message });
function tidy(state) {
  state.borrowed = state.borrowed.filter(id => !state.profile.research[id] && state.powers.includes(SIMULATION_CATALOGUE.nodes[id].power));
  state.equipped = state.equipped.filter(id => (state.profile.research[id] || state.borrowed.includes(id)) && state.powers.includes(SIMULATION_CATALOGUE.nodes[id].power));
  // A returned purchase must not silently remain active through a borrowed copy.
  while (!simulationLoadout(state).ok && state.equipped.length) state.equipped.pop();
}
export function simulationRefundPreview(state, id) {
  return profileRefundPreview(state.profile, id, SIMULATION_CATALOGUE);
}
export function simulationAct(input, action) {
  const state = structuredClone(input), cat = SIMULATION_CATALOGUE;
  if (!profileValidate(state.profile, cat, 'normal')) return fail('Invalid simulation profile.');
  const node = cat.nodes[action.id];
  let result;
  switch (action.type) {
    case 'seeds': {
      // Manual funding is deliberately local to this disposable simulator.
      if (state.phase !== 'shop') return fail('End the simulated run before adding Seeds.');
      if (!Number.isSafeInteger(action.amount) || action.amount <= 0 || action.amount > 1000 || !Number.isSafeInteger(state.profile.wallet.seeds + action.amount)) return fail('Choose a whole amount from 1 to 1000.');
      state.profile.wallet.seeds += action.amount; state.profile.revision++;
      return success(state, `Added ${action.amount} simulated Seeds.`);
    }
    case 'tutorial':
      if (state.phase !== 'shop') return fail('Finish the run first.');
      result = profileReward(state.profile, { mode: 'song-run', type: 'tutorial', bloom: true }, cat);
      if (!result.ok) return fail(result.reason);
      state.profile = result.profile;
      return success(state, result.duplicate ? 'Tutorial reward already collected.' : 'Tutorial bloom: +4 Seeds.');
    case 'buy':
      if (state.phase !== 'shop') return fail('Permanent research is between runs.');
      result = profilePurchase(state.profile, action.id, cat);
      if (!result.ok) return fail(result.reason);
      state.profile = result.profile; tidy(state);
      return success(state, `Researched ${node.name}.`);
    case 'refund':
      if (state.phase !== 'shop') return fail('Refunds are between runs.');
      result = profileRefund(state.profile, action.id, cat, action.revision);
      if (!result.ok) return fail(result.reason);
      state.profile = result.profile;
      state.powers = state.powers.filter(id => state.profile.research[id + '.base']);
      for (const id of STARTERS) if (state.powers.length < 3 && !state.powers.includes(id)) state.powers.push(id);
      tidy(state);
      return success(state, `Returned ${result.refunded} Seeds. Other owned powers stay unlocked.`);
    case 'replace':
      if (state.phase !== 'shop') return fail('Your three powers are fixed during a run.');
      if (!cat.powers[action.power] || !state.profile.research[action.power + '.base']) return fail('Research this power first.');
      if (!Number.isInteger(action.slot) || action.slot < 0 || action.slot > 2 || state.powers.includes(action.power)) return fail('Choose a different loadout slot.');
      state.powers[action.slot] = action.power; tidy(state);
      return success(state, 'Loadout updated. Choose up to two borrowed starting upgrades.');
    case 'borrow': {
      if (!node || node.kind === 'base' || !state.powers.includes(node.power) || state.profile.research[action.id]) return fail('Borrow an unowned upgrade for an equipped power.');
      if (state.borrowed.includes(action.id)) {
        if (state.phase === 'run') return fail('Run discoveries stay available until this run ends.');
        state.borrowed = state.borrowed.filter(id => id !== action.id); tidy(state);
        return success(state, 'Starting loan removed.');
      }
      if (node.kind === 'capstone' && (state.phase !== 'run' || state.pool < 3)) return fail('Capstone discoveries open after Build.');
      if (state.borrowed.length >= 2 + (state.phase === 'run' ? state.pool : 0)) return fail('No discovery slots left at this stage.');
      state.borrowed.push(action.id);
      return success(state, `Borrowed ${node.name}. Equip it within your tuning budget.`);
    }
    case 'equip':
      if (!node || node.kind === 'base') return fail('Choose an upgrade.');
      state.equipped = state.equipped.includes(action.id) ? state.equipped.filter(id => id !== action.id) : [...state.equipped, action.id];
      result = simulationLoadout(state);
      if (!result.ok) return fail(result.message || result.reason);
      return success(state, 'Tuning updated.');
    case 'start':
      if (state.phase !== 'shop' || !simulationLoadout(state).ok) return fail('Choose a valid starting loadout.');
      state.phase = 'run'; state.pool = 0; state.attempt++;
      return success(state, 'Intro started. Powers are fixed; upgrades can be retuned between simulated pools.');
    case 'clear': {
      if (state.phase !== 'run') return fail('Start a simulated run first.');
      const event = { mode: 'song-run', runId: `preview-${state.attempt}`, trackId: 'first-light', poolCount: 5 };
      result = profileReward(state.profile, { ...event, type: 'pool', poolIndex: state.pool, activated: state.powers, bonus: action.bonus === true }, cat);
      if (!result.ok) return fail(result.reason);
      state.profile = result.profile;
      const earned = result.receipt.amount;
      if (state.pool < 4) {
        state.pool++;
        return success(state, `Pool cleared: +${earned} Seeds, +1 mastery for each equipped power. ${POOL_NAMES[state.pool]}: ${simulationBudget(state)} tuning points.`);
      }
      result = profileReward(state.profile, { ...event, type: 'victory' }, cat);
      if (!result.ok) return fail(result.reason);
      state.profile = result.profile; state.phase = 'shop'; state.pool = 0; state.borrowed = []; tidy(state);
      return success(state, `Song complete! +${earned + result.receipt.amount} Seeds for the finale and victory. Borrowed upgrades returned; permanent research kept.`);
    }
    case 'end':
      if (state.phase !== 'run') return fail('No run to end.');
      result = profileReward(state.profile, { mode: 'song-run', type: 'failure', runId: `preview-${state.attempt}`, trackId: 'first-light', poolCount: 5, poolIndex: state.pool, blooms: 0, abandoned: true }, cat);
      if (!result.ok) return fail(result.reason);
      state.profile = result.profile; state.phase = 'shop'; state.pool = 0; state.borrowed = []; tidy(state);
      return success(state, 'Run ended. Earned Seeds remain; borrowed upgrades returned.');
    default: return fail('Unknown simulation action.');
  }
}
