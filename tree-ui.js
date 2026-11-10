import { POWER_TREES } from './power-tree.js?v=0c4680185586233f800dc673edd2ea81dbf97fd60d02c3b6fbf3df81b4e49839';
import { familyGate, familyProgress } from './catalogue.js?v=5468bf88375064833a256eecf82212671221c36246193c529f6aea4185f6a137';
import { profilePurchase, profileSummary } from './profile.js?v=69e72b6f8c16972164bc77603ff2a186b1093c2ec86aa218064c4a484a5612a4';
import { simulationCreate, simulationAct, simulationBudget, simulationLoadout, simulationRefundPreview, SIMULATION_CATALOGUE as cat, POOL_NAMES } from './tree-simulation.js?v=c65fd8dbe8f854ed8d80b0f1b6437d89d914a05b577011dc6e78e9cedc65dbb8';
import { assetURL } from './asset.js?v=560eaf774b30dc5024687486b7a1369aab59ab8245ea800ec4719f1b11df3f6a';
import { iconHTML } from './ui-icon.js?v=6eefd3a5e72d754fea063666baf3166c1c88b5e72db4ab97072da15565143b81';

const families = [...new Set(Object.values(POWER_TREES).map(p => p.family))];
const kindNames = { base: 'Power unlock', foundation: 'Foundation', a: 'Modifier A', b: 'Modifier B', capstone: 'Capstone' };
const escape = text => String(text).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const powerImage = power => `<img src="${assetURL(`icon/power/${power}.svg`)}" alt="" width="32" height="32">`;
const button = (action, label, icon = 'add', extra = '') => `<button type="button" data-tree-action="${action}" ${extra}>${iconHTML(icon)}<span>${label}</span></button>`;
const reasonText = { 'family-gate': 'Develop this family to open this tier.', 'insufficient-seeds': 'Not enough Seeds. Simulate the tutorial or a pool clear, or add test Seeds.', mastery: 'Use this power in 3 cleared pools to research its capstone.', prerequisite: 'Unlock the base power first.', 'over-budget': 'Not enough tuning points. Unequip another upgrade or clear the next pool.', 'invalid-equipment': 'Add this power to your loadout, then research or borrow this upgrade.', 'starter-power': 'Starter powers stay unlocked.', 'stale-preview': 'Progress changed. Review this refund again.' };

export function treeMount() {
  const dialog = document.getElementById('tree-dialog');
  let state = simulationCreate(), selected = 'comet.base', family = 'All', refund = null, resetPending = false;
  dialog.innerHTML = `<div class="tree-heading"><div><span class="tree-eyebrow">RICOCHET BLOOM · V2 PREVIEW</span><h2>Grow your possibilities.</h2><p>Skill tree simulator <span class="tree-preview-tag">Separate from your game</span></p></div><button class="quiet tree-close" aria-label="Close skill tree">${iconHTML('close')}</button></div>
    <div class="tree-controls" id="tree-controls"></div><div class="tree-status" id="tree-status" role="status" aria-live="polite">Start with Ripple, Attract and Comet. Try the tutorial reward or explore any power.</div>
    <div class="tree-workspace"><section class="tree-map-section" aria-label="Connected power family trees"><div class="tree-map-toolbar"><div class="tree-family-choice" role="group" aria-label="Visible family">${['All', ...families].map(f => `<button type="button" data-family="${f}" aria-pressed="${f === family}">${f === 'All' ? 'Whole tree' : f}</button>`).join('')}</div><div class="tree-legend"><span>✓ Owned</span><span>◉ Equipped</span><span>◇ Borrowed</span><span class="tree-today-text">★ Today’s behavior</span></div></div><div class="tree-map-scroll" id="tree-map-scroll"><div class="tree-map" id="tree-map"></div></div></section><aside class="tree-detail" id="tree-detail" aria-label="Selected upgrade"></aside></div>
    <div class="tree-footer">Simulation only: purchases and loadouts here do not change pool physics or game saves. Progress lasts until you reload or reset. Family thresholds are provisional.</div>`;
  dialog.querySelector('.tree-close').onclick = () => dialog.close();
  const status = message => { dialog.querySelector('#tree-status').textContent = message; };
  function nodeStatus(id) {
    if (state.equipped.includes(id)) return '◉ Equipped';
    if (state.profile.research[id]) return '✓ Owned';
    if (state.borrowed.includes(id)) return '◇ Borrowed';
    const node = cat.nodes[id];
    if (node.kind === 'base' ? !familyGate(state.profile.research, node.power, cat).ok : !state.profile.research[node.power + '.base']) return 'Locked';
    if (node.masteryPools && profileSummary(state.profile, cat).mastery[node.power] < node.masteryPools) return 'Mastery needed';
    return `${node.seedCost} Seeds`;
  }
  function nodeButton(id) {
    const n = cat.nodes[id], p = POWER_TREES[n.power], owned = !!state.profile.research[id], today = p.today.includes(n.kind), base = n.kind === 'base';
    return `<button type="button" class="tree-node ${base ? 'tree-base' : 'tree-upgrade'} ${owned ? 'is-owned' : ''} ${state.equipped.includes(id) ? 'is-equipped' : ''} ${selected === id ? 'is-selected' : ''}" data-node="${id}" aria-pressed="${selected === id}" aria-label="${escape(p.name + ', ' + n.name + ', ' + nodeStatus(id) + (today ? ', current behavior milestone' : ''))}">${base ? powerImage(n.power) : ''}<span class="tree-node-copy"><strong>${escape(n.name)}</strong><small>${base && cat.powers[n.power].starter ? 'FREE START · ' : ''}${nodeStatus(id)}</small>${today ? `<em>★ ${p.name === 'Echo' ? 'Today component' : base ? 'Today at base' : 'Today with base'}</em>` : p.uncertain && n.kind === 'foundation' ? '<em class="tree-warning">Today match pending</em>' : ''}</span></button>`;
  }
  function powerCard(power) {
    return `<div class="tree-power">${nodeButton(power + '.base')}<div class="tree-branches" aria-label="${POWER_TREES[power].name} upgrades">${['foundation', 'a', 'b', 'capstone'].map(k => nodeButton(power + '.' + k)).join('')}</div></div>`;
  }
  function mapRender() {
    const target = dialog.querySelector('#tree-map');
    target.dataset.single = String(family !== 'All');
    target.innerHTML = '<div class="tree-root">FREE START · Ripple + Attract + Comet<span>Develop any family. Every branch remains available.</span></div>' + families.filter(f => family === 'All' || f === family).map(f => {
      const progress = familyProgress(state.profile.research, f, cat);
      const tier = n => Object.keys(POWER_TREES).filter(id => POWER_TREES[id].family === f && POWER_TREES[id].tier === n).map(powerCard).join('');
      return `<section class="tree-family" aria-label="${f} family"><h3>${f}<small>${progress.upgrades} upgrades owned</small></h3><div class="tree-tier">${tier(1)}</div><div class="tree-gate ${progress.upgrades >= 2 ? 'is-open' : ''}">${iconHTML(progress.upgrades >= 2 ? 'check' : 'arrow-down')}<span>Tier 2 · ${progress.upgrades}/2 upgrades<small>Any two in ${f}</small></span></div><div class="tree-tier">${tier(2)}</div><div class="tree-gate ${progress.upgrades >= 5 && progress.powers >= 2 ? 'is-open' : ''}">${iconHTML(progress.upgrades >= 5 && progress.powers >= 2 ? 'check' : 'arrow-down')}<span>Tier 3 · ${progress.upgrades}/5 upgrades<small>${progress.powers}/2 powers developed</small></span></div><div class="tree-tier">${tier(3)}</div></section>`;
    }).join('');
    dialog.querySelectorAll('[data-family]').forEach(el => el.setAttribute('aria-pressed', String(el.dataset.family === family)));
  }
  function controlsRender() {
    const running = state.phase === 'run', tuning = simulationLoadout(state), mastery = profileSummary(state.profile, cat).mastery;
    dialog.querySelector('#tree-controls').innerHTML = `<div class="tree-wallet"><span>SEEDS</span><strong>${state.profile.wallet.seeds}</strong><small>${Object.keys(state.profile.research).length}/120 nodes</small></div><div class="tree-loadout"><span>YOUR THREE POWERS${running ? ' · FIXED FOR THIS RUN' : ''}</span><div>${state.powers.map(p => `<button type="button" data-node="${p}.base">${powerImage(p)}<span>${POWER_TREES[p].name}<small>${Math.min(3, mastery[p])}/3 mastery</small></span></button>`).join('')}</div></div><div class="tree-run"><span>${running ? POOL_NAMES[state.pool].toUpperCase() + ' · POOL ' + (state.pool + 1) + '/5' : 'BETWEEN RUNS'}</span><strong>${tuning.tuning || 0} / ${simulationBudget(state)} tuning</strong><small>${state.borrowed.length}/${2 + (running ? state.pool : 0)} discoveries · ${running ? 'Each clear uses all three powers' : 'Two starting loans available'}</small></div><div class="tree-sim-actions">${running ? button('clear', 'Clear pool · +2 Seeds', 'check') + button('clear-bonus', 'Clear with bonus · +3', 'star-point-four') + button('end', 'End run', 'arrow-left') : button('tutorial', 'Tutorial bloom · +4', 'star-point-four', state.profile.rewards.some(r => r.id === 'tutorial') ? 'disabled' : '') + button('seeds', '+20 test Seeds', 'add') + button('start', 'Begin simulated run', 'play')}${button('reset-ask', 'Reset preview', 'trashcan-close')}</div>${resetPending ? `<div class="tree-confirm"><p>Reset only this simulator’s purchases, Seeds and run?</p>${button('reset', 'Reset simulator', 'trashcan-close')}${button('cancel', 'Keep exploring', 'arrow-left')}</div>` : ''}`;
  }
  function detailRender() {
    const n = cat.nodes[selected], p = POWER_TREES[n.power], owned = !!state.profile.research[selected], base = n.kind === 'base', inLoadout = state.powers.includes(n.power), mastery = profileSummary(state.profile, cat).mastery[n.power], gate = familyGate(state.profile.research, n.power, cat);
    const buy = profilePurchase(state.profile, selected, cat);
    const currentReached = !p.uncertain && p.today.every(k => k === 'base' || state.equipped.includes(n.power + '.' + k)) && inLoadout;
    const today = p.uncertain ? 'Exact current-behavior match is still being specified.' : p.today[0] === 'base' ? 'The base already matches today’s behavior.' : 'Today’s configuration: base + ' + p.today.map(k => cat.nodes[n.power + '.' + k].name).join(' + ') + '.';
    dialog.querySelector('#tree-detail').innerHTML = `${button('back-map', 'Back to tree', 'arrow-left', 'class="tree-back-map"')}<div class="tree-detail-title">${powerImage(n.power)}<div><span>${p.family} · Tier ${p.tier}</span><h3>${escape(n.name)}</h3></div></div><span class="tree-preview-tag">${kindNames[n.kind]} · ${nodeStatus(selected)}</span><p class="tree-description">${escape(n.description)}</p><div class="tree-cost"><span>${base && cat.powers[n.power].starter ? 'Free starter' : n.seedCost + ' Seeds'}</span><span>${n.tuningCost} tuning${n.masteryPools ? ' · 3 pool mastery' : ''}</span></div><div class="tree-current ${currentReached ? 'is-reached' : ''}"><strong>${p.uncertain ? '△ Mapping pending' : currentReached ? '★ Today’s behavior equipped' : '★ Today’s behavior'}</strong><p>${escape(today)}</p><small>${escape(p.current)}</small></div>${base && !gate.ok && !owned ? `<p class="tree-requirement">Unlock: ${gate.required} ${p.family} upgrades${p.tier === 3 ? ' across 2 powers' : ''}. You have ${gate.upgrades} across ${gate.powers}.</p>` : ''}${n.masteryPools ? `<p class="tree-requirement">Mastery: ${Math.min(3, mastery)}/3 cleared pools using ${p.name}. Borrowing after Build waives permanent mastery.</p>` : ''}${n.conflictReason ? `<p class="tree-requirement">${escape(n.conflictReason)} Both may be researched; equip one at a time.</p>` : ''}<div class="tree-detail-actions">${!owned ? button('buy', base ? `Unlock · ${n.seedCost} Seeds` : `Research · ${n.seedCost} Seeds`, 'add', !buy.ok || state.phase !== 'shop' ? 'disabled' : '') : (!cat.powers[n.power].starter || !base) ? button('refund-ask', 'Review refund', 'arrow-left', state.phase !== 'shop' ? 'disabled' : '') : '<p>Starter power · permanently available</p>'}${!base && inLoadout && (owned || state.borrowed.includes(selected)) ? button('equip', state.equipped.includes(selected) ? 'Unequip upgrade' : 'Equip upgrade', state.equipped.includes(selected) ? 'check' : 'add') : ''}${!base && inLoadout && !owned ? button('borrow', state.borrowed.includes(selected) ? (state.phase === 'shop' ? 'Remove starting loan' : 'Borrowed for this run') : 'Borrow for this run', 'add', state.borrowed.includes(selected) && state.phase === 'run' ? 'disabled' : '') : ''}</div>${!owned && !buy.ok ? `<p class="tree-hint">${escape(reasonText[buy.reason] || buy.reason)}</p>` : ''}${state.phase === 'run' ? '<p class="tree-hint">Research and loadout changes reopen after the run.</p>' : ''}${!inLoadout && state.profile.research[n.power + '.base'] ? `<div class="tree-replace"><label for="tree-slot">Add ${p.name} to your loadout</label><select id="tree-slot" ${state.phase === 'run' ? 'disabled' : ''}>${state.powers.map((id, i) => `<option value="${i}">Replace ${POWER_TREES[id].name}</option>`).join('')}</select>${button('replace', 'Use this power', 'check', state.phase === 'run' ? 'disabled' : '')}</div>` : ''}${refund ? `<div class="tree-confirm"><strong>Return ${refund.seeds} Seeds?</strong><p>Remove: ${refund.removed.map(id => escape(cat.nodes[id].name)).join(', ')}.</p><p>Other purchased powers stay owned. Family upgrade counts fall, which can close future purchases.</p>${button('refund', 'Confirm refund', 'check')}${button('cancel', 'Cancel', 'arrow-left')}</div>` : ''}<p class="tree-hint">Green nodes are owned. A selected outline is only a selection, not a purchase. All four upgrades attach directly to their base.</p>`;
  }
  function render() {
    const active = document.activeElement;
    const key = ['treeAction', 'node', 'family'].find(k => active?.dataset?.[k]);
    const value = key ? active.dataset[key] : null;
    const attr = { treeAction: 'data-tree-action', node: 'data-node', family: 'data-family' }[key];
    controlsRender(); mapRender(); detailRender();
    if (attr) dialog.querySelector(`[${attr}="${value}"]:not(:disabled)`)?.focus({ preventScroll: true });
  }
  dialog.addEventListener('click', event => {
    const node = event.target.closest('[data-node]'), filter = event.target.closest('[data-family]'), action = event.target.closest('[data-tree-action]');
    if (node) { selected = node.dataset.node; refund = null; render(); if (matchMedia('(max-width: 760px)').matches) dialog.querySelector('#tree-detail').scrollIntoView({ block: 'start', behavior: 'smooth' }); return; }
    if (filter) { family = filter.dataset.family; mapRender(); dialog.querySelector('#tree-map-scroll').scrollTo({ top: 0, left: 0 }); return; }
    if (!action) return;
    const type = action.dataset.treeAction;
    if (type === 'back-map') { dialog.querySelector('.tree-map-section').scrollIntoView({ block: 'start', behavior: 'smooth' }); return; }
    if (type === 'reset-ask') { resetPending = true; controlsRender(); return; }
    if (type === 'reset') { state = simulationCreate(); selected = 'comet.base'; refund = null; resetPending = false; render(); status('Preview reset. Your game saves are unchanged.'); return; }
    if (type === 'cancel') { refund = null; resetPending = false; render(); return; }
    if (type === 'refund-ask') { const r = simulationRefundPreview(state, selected); if (r.ok) { refund = r; detailRender(); } else status(reasonText[r.reason] || r.reason); return; }
    const result = simulationAct(state, { type: type === 'clear-bonus' ? 'clear' : type, bonus: type === 'clear-bonus', id: selected, power: cat.nodes[selected].power, slot: Number(dialog.querySelector('#tree-slot')?.value), amount: 20, revision: refund?.revision });
    if (result.ok) { state = result.state; refund = null; render(); status(result.message); }
    else status(reasonText[result.reason] || result.reason);
  });
  document.getElementById('tree-open').onclick = () => { document.querySelectorAll('dialog[open]').forEach(d => d.close()); render(); dialog.showModal(); };
  render();
  // A shareable deep link opens the preview without starting or changing a pool.
  if (new URL(location.href).searchParams.get('view') === 'tree') dialog.showModal();
}
