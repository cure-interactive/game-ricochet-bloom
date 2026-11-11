import { BUILD_EXAMPLES } from './upgrade-preview.js?v=6a46383a554e105dbf11f1a4c59f2a6d7d4aecd050c9c28234651ee0959e0b49';
import { trackGet } from './track.js?v=ff2e6bff1b7be4153335e346786927680ea20b642555b591226b0cfb27ff13ff';
import { POWER_TREES } from './power-tree.js?v=4929fc5eda5a5d405a8ac330c9b14b440804ab62150439a106e28084bb1f9f19';
import { familyGate, familyProgress } from './catalogue.js?v=29bfa3870f4a1808447f7c1b947f69e5a7dc0cc9131159769f55b5527c4ee113';
import { profilePurchase, profileSummary } from './profile.js?v=d86f3e1dc882dcf034b75db8449706fd9c205f62359e1ca4202ef4df753af1c7';
import { researchTarget, progressionBudget, progressionLoadout, progressionRefundPreview, GAME_CATALOGUE as cat, POOL_NAMES, GOALS } from './run.js?v=d9759df78dc498217dd53b586f16048feafa7f17faf634eef9e660eb088ccee5';
import { assetURL } from './asset.js?v=a5528e3237bdbf8014b25e76066054535d27e26d94e720a9464cd2747b41bc05';
import { iconHTML } from './ui-icon.js?v=6eefd3a5e72d754fea063666baf3166c1c88b5e72db4ab97072da15565143b81';

const families = [...new Set(Object.values(POWER_TREES).map(p => p.family))];
const kindNames = { base: 'Power unlock', foundation: 'Foundation', a: 'Modifier A', b: 'Modifier B', capstone: 'Capstone' };
const escape = text => String(text).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const powerImage = power => `<img src="${assetURL(`icon/power/${power}.svg`)}" alt="" width="32" height="32">`;
const button = (action, label, icon = 'add', extra = '') => `<button type="button" data-tree-action="${action}" ${extra}>${iconHTML(icon)}<span>${label}</span></button>`;
const reasonText = { 'family-gate': 'Develop this family to open this tier.', 'insufficient-seeds': 'Earn Seeds by blooming in the tutorial and clearing Song Run pools.', mastery: 'Use this power in 3 cleared pools to research its capstone.', prerequisite: 'Unlock the base power first.', 'over-budget': 'Not enough tuning points. Unequip another upgrade or clear the next pool.', 'invalid-equipment': 'Add this power to your loadout, then research or borrow this upgrade.', 'starter-power': 'Starter powers stay unlocked.', 'stale-preview': 'Progress changed. Review this refund again.' };

export function treeMount(controller) {
  const dialog = document.getElementById('tree-dialog');
  const mobile = matchMedia('(max-width: 760px)');
  let state = controller.get(), selected = 'comet.base', family = mobile.matches ? 'Motion' : 'All', refund = null, resetPending = false, statusTimer = null, expanded = null, list = false;
  dialog.innerHTML = `<div class="tree-heading"><div class="tree-heading-copy"><span class="tree-mobile-title" tabindex="-1">Skill tree</span><span class="tree-eyebrow">RICOCHET BLOOM · RESEARCH</span><h2>Skill tree</h2><p>Permanent research · reversible tuning</p></div><div class="tree-mobile-summary" id="tree-mobile-summary"></div><button type="button" class="tree-guide-open" data-tree-action="guide" aria-label="Skill tree guide">${iconHTML('about')}</button><button class="quiet tree-close" aria-label="Back from skill tree">${iconHTML('arrow-left')}<span>Back</span></button></div>
    <div class="tree-controls" id="tree-controls"></div><div class="tree-status" id="tree-status" role="status" aria-live="polite">Start with Ripple, Attract and Comet. Play the tutorial or explore any power.</div>
    <div class="tree-workspace"><section class="tree-map-section" aria-label="Connected power family trees"><div class="tree-map-toolbar"><div class="tree-family-choice" role="group" aria-label="Visible family">${['All', ...families].map(f => `<button type="button" data-family="${f}" aria-pressed="${f === family}">${iconHTML(({All:'network-node-three',Motion:'speedometer',Flow:'dropper',Control:'magnet-northeast',Propagation:'pulse',Navigation:'arrow-right'})[f]||'grid')}${f === 'All' ? 'All' : f}</button>`).join('')}</div><div class="tree-map-tools">${button('list','List view','grid')}</div><div class="tree-target" id="tree-target"></div><div class="tree-legend"><span>${iconHTML('check')}Owned</span><span>${iconHTML('radio-on')}Equipped</span><span>${iconHTML('clock')}Borrowed</span><span class="tree-today-text">${iconHTML('star')}Today’s behavior</span></div></div><div class="tree-map-scroll" id="tree-map-scroll"><div class="tree-map" id="tree-map"></div></div></section><aside class="tree-detail" id="tree-detail" aria-label="Selected upgrade"></aside></div>
    <div class="tree-footer">Unlock powers with earned Seeds. Equip upgrades within your tuning budget. Research is saved on this browser.</div><nav class="tree-mobile-nav" aria-label="Skill tree view"><button type="button" data-tree-view="map" aria-pressed="true">${iconHTML('network-node-three')}Tree</button><button type="button" data-tree-view="run" aria-pressed="false">${iconHTML('play')}Loadout & run</button></nav>`;
  dialog.dataset.view = 'map';
  const detail = dialog.querySelector('#tree-detail'), workspace = dialog.querySelector('.tree-workspace');
  const sheet = document.createElement('dialog');
  sheet.id = 'tree-sheet';
  sheet.setAttribute('aria-label', 'Upgrade details');
  sheet.innerHTML = `<div class="tree-sheet-heading"><span>UPGRADE DETAILS</span>${button('back-map', 'Done', 'close')}</div><div class="tree-sheet-status" role="status" aria-live="polite"></div>`;
  document.body.append(sheet);
  const returnDetail = () => {
    workspace.append(detail);
    const wasGuide = sheet.dataset.guide === 'true';
    sheet.dataset.guide = 'false';
    detailRender();
    const source = dialog.dataset.view === 'run' ? '#tree-controls' : '#tree-map';
    const target = wasGuide ? dialog.querySelector('.tree-guide-open') : dialog.querySelector(`${source} [data-node="${selected}"]`);
    target?.focus({ preventScroll: true });
  };
  sheet.addEventListener('close', returnDetail);
  dialog.addEventListener('close', () => { if (sheet.open) sheet.close(); });
  mobile.addEventListener('change', () => { if (sheet.open) sheet.close(); });
  dialog.querySelector('.tree-close').onclick = () => controller.back?.();
  dialog.addEventListener('cancel',event=>{event.preventDefault();controller.back?.();});
  const status = message => {
    const target = dialog.querySelector('#tree-status');
    target.textContent = message;
    target.dataset.announcement = 'true';
    clearTimeout(statusTimer);
    statusTimer = setTimeout(() => { delete target.dataset.announcement; }, 4500);
    sheet.querySelector('.tree-sheet-status').textContent = message;
  };
  function openSheet(guide = false) {
    sheet.dataset.guide = String(guide);
    sheet.setAttribute('aria-label', guide ? 'Skill tree guide' : 'Upgrade details');
    sheet.querySelector('.tree-sheet-heading > span').textContent = guide ? 'SKILL TREE GUIDE' : 'UPGRADE DETAILS';
    sheet.querySelector('.tree-sheet-status').textContent = '';
    if (guide) detail.innerHTML = `<h3>Explore. Research. Equip.</h3><p class="tree-description">Tap any node for its effect, cost and upgrades. Scroll the family strip sideways to find every family, or choose Whole tree.</p><h4>Your starting powers</h4><p>Ripple, Attract and Comet are free. Each has four independent upgrades. Develop a family to unlock its later powers.</p><h4>Read the tree</h4><ul><li>✓ Owned: permanently researched.</li><li>◉ Equipped: active in your loadout.</li><li>◇ Borrowed: a temporary upgrade.</li><li>★ Gold star: part of the power’s current game behavior. Open it for the exact combination.</li><li>△ Mapping pending: the current-behavior match is still being specified.</li></ul><h4>Try the progression</h4><p>Open Loadout & run to start or resume First Light. Earn Seeds by clearing its five pools. Purchases happen between runs; upgrades can be tuned during interludes.</p><p class="tree-hint">Try any node in a practice pool before researching it. Practice does not spend Seeds or change your run.</p>`;
    sheet.append(detail);
    sheet.showModal();
    detail.scrollTop = 0;
  }
  function nodeStatus(id) {
    if (state.equipped.includes(id)) return 'Equipped';
    if (state.profile.research[id]) return 'Owned';
    if (state.borrowed.includes(id)) return 'Borrowed';
    const node = cat.nodes[id];
    if (node.kind === 'base' ? !familyGate(state.profile.research, node.power, cat).ok : !state.profile.research[node.power + '.base']) return 'Locked';
    if (node.masteryPools && profileSummary(state.profile, cat).mastery[node.power] < node.masteryPools) return 'Mastery needed';
    return `${node.seedCost} Seeds`;
  }
  function nodeButton(id) {
    const n = cat.nodes[id], p = POWER_TREES[n.power], owned = !!state.profile.research[id], today = p.today.includes(n.kind), base = n.kind === 'base';
    return `<button type="button" class="tree-node ${base ? 'tree-base' : 'tree-upgrade'} ${owned ? 'is-owned' : ''} ${state.equipped.includes(id) ? 'is-equipped' : ''} ${selected === id ? 'is-selected' : ''}" data-node="${id}" aria-pressed="${selected === id}" aria-label="${escape(p.name + ', ' + n.name + ', ' + nodeStatus(id))}">${base ? powerImage(n.power) : n.kind === 'capstone' ? iconHTML('epic') : iconHTML(n.kind === 'foundation' ? 'switches' : 'pulse')}<span class="tree-node-copy"><strong>${escape(n.name)}</strong><small>${base && cat.powers[n.power].starter ? 'FREE START · ' : ''}${iconHTML(state.equipped.includes(id)?'radio-on':owned?'check':state.borrowed.includes(id)?'clock':nodeStatus(id)==='Locked'?'lock':'coin')}${nodeStatus(id)}</small>${false ? `<span class="tree-node-marker" aria-hidden="true">${iconHTML('star')}</span><em>${iconHTML('star')} ${p.name === 'Echo' ? 'Today component' : base ? 'Today at base' : 'Today with base'}</em>` : p.uncertain && n.kind === 'foundation' ? '<span class="tree-node-marker tree-warning" aria-hidden="true">△</span><em class="tree-warning">Today match pending</em>' : ''}</span></button>`;
  }
  function powerCard(power) {
    const count=Object.keys(state.profile.research).filter(id=>id.startsWith(power+'.')&&!id.endsWith('.base')).length,open=list||expanded===power;
    return `<div class="tree-power ${open?'is-expanded':''}"><button type="button" class="power-hub ${state.profile.research[power+'.base']?'is-owned':''}" data-hub="${power}" aria-expanded="${open}" aria-label="${POWER_TREES[power].name}, ${nodeStatus(power+'.base')}, ${count} of 4 upgrades">${powerImage(power)}<strong>${POWER_TREES[power].name}</strong><span>${iconHTML(state.profile.research[power+'.base']?'check':'lock')}${count}/4</span></button>${open?`<div class="power-expansion"><button type="button" data-node="${power}.base">${iconHTML('about')}Power details${!state.profile.research[power+'.base']?' & unlock':''}</button><div class="tree-branches" aria-label="Four independent ${POWER_TREES[power].name} upgrades">${['foundation','a','b','capstone'].map(k=>nodeButton(power+'.'+k)).join('')}</div></div>`:''}</div>`;
  }
  function mapRender() {
    const target = dialog.querySelector('#tree-map');
    target.dataset.single = String(family !== 'All'); target.dataset.list=String(list);
    const goal=researchTarget(state);dialog.querySelector('#tree-target').innerHTML=goal?`<button type="button" data-node="${goal.id}">${iconHTML('star')}<span>${goal.name}<small>${goal.text}</small></span></button>`:'';
    const listButton=dialog.querySelector('[data-tree-action=list]');listButton.setAttribute('aria-pressed',String(list));listButton.lastElementChild.textContent=list?'Hub map':'List view';
    target.innerHTML = families.filter(f => family === 'All' || f === family).map(f => {
      const progress = familyProgress(state.profile.research, f, cat);
      const tier = n => Object.keys(POWER_TREES).filter(id => POWER_TREES[id].family === f && POWER_TREES[id].tier === n).map(powerCard).join('');
      return `<section class="tree-family" aria-label="${f} family"><h3>${f}<small>${progress.upgrades} upgrades owned</small></h3><div class="tree-tier">${tier(1)}</div><div class="tree-gate ${progress.upgrades >= 2 ? 'is-open' : ''}">${iconHTML(progress.upgrades >= 2 ? 'check' : 'arrow-down')}<span>Tier 2 · ${progress.upgrades}/2 upgrades<small>Any two in ${f}</small></span></div><div class="tree-tier">${tier(2)}</div><div class="tree-gate ${progress.upgrades >= 5 && progress.powers >= 2 ? 'is-open' : ''}">${iconHTML(progress.upgrades >= 5 && progress.powers >= 2 ? 'check' : 'arrow-down')}<span>Tier 3 · ${progress.upgrades}/5 upgrades<small>${progress.powers}/2 powers developed</small></span></div><div class="tree-tier">${tier(3)}</div></section>`;
    }).join('');
    dialog.querySelectorAll('[data-family]').forEach(el => el.setAttribute('aria-pressed', String(el.dataset.family === family)));
  }
  function controlsRender() {
    const running = state.phase !== 'shop', tuning = progressionLoadout(state), mastery = profileSummary(state.profile, cat).mastery;
    dialog.querySelector('#tree-mobile-summary').innerHTML = `<strong>${iconHTML('coin')}${state.profile.wallet.seeds}</strong><span>${tuning.tuning || 0}/${state.bypass?'∞':progressionBudget(state)} tuning</span>`;
    dialog.querySelector('#tree-controls').innerHTML = `<div class="tree-wallet"><span>${iconHTML('coin')} SEEDS</span><strong>${state.profile.wallet.seeds}</strong><small>${Object.keys(state.profile.research).length}/${Object.keys(cat.nodes).length} nodes</small></div><div class="tree-loadout"><span>YOUR THREE POWERS${running ? ' · FIXED THIS RUN' : ''}</span><div>${state.powers.map(p => `<button type="button" data-node="${p}.base">${powerImage(p)}<span>${POWER_TREES[p].name}<small>${iconHTML('epic')}${Math.min(3, mastery[p])}/3 mastery</small></span></button>`).join('')}</div></div><div class="tree-run"><span>${state.profile.kind==='development'?'DEVELOPMENT · ':''}${running ? POOL_NAMES[state.pool].toUpperCase() + ' · ' + (state.pool + 1) + '/5' : trackGet(state.track).name.toUpperCase()+' · FIVE POOLS'}</span><strong>${iconHTML('switches')}${tuning.tuning || 0} / ${state.bypass?'∞':progressionBudget(state)} tuning</strong><small>${state.borrowed.length} borrowed upgrades · ${state.phase==='interlude'?'Pool complete. Tune, discover, then continue.':running?GOALS[state.pool]:'Your starting build is ready. Starting loans are optional.'}</small></div><div class="tree-sim-actions">${button('play',state.phase==='run'?'Resume pool':state.phase==='interlude'?'Continue to '+POOL_NAMES[state.pool+1]:'Play '+trackGet(state.track).name,'play')}${!running?button('tutorial','Learn to bloom · earn 4 Seeds','book')+button('relaxed',state.relaxed?'Relaxed · 8 plucks':'Standard · 6 plucks',state.relaxed?'radio-on':'radio-off'):button('end-ask','End this run','reset')}${button('campaign',state.phase==='interlude'?'Pool reward':'Campaign & collection','epic')}${button('development','Development settings','flask')}</div>${resetPending?`<div class="tree-confirm"><p>End this run? Earned Seeds stay; borrowed upgrades return.</p>${button('abandon','End run','check')}${button('cancel','Keep playing','arrow-left')}</div>`:''}${state.phase==='interlude'?`<section class="tree-discoveries"><h3>${state.run.discovered?'Discovery chosen':'Choose one discovery'}</h3><div class="discovery-list">${state.run.offers.map(id=>`<button type="button" data-node="${id}">${iconHTML(cat.nodes[id].kind==='capstone'?'epic':'clock')}<span>${cat.nodes[id].name}<small>${POWER_TREES[cat.nodes[id].power].name} · ${cat.nodes[id].tuningCost} tuning</small></span></button>`).join('')||'All useful upgrades are already available.'}</div></section>`:''}<details class="build-examples"><summary>Build experiments · try without unlocking</summary>${BUILD_EXAMPLES.map(x=>`<button type="button" data-example="${x.id}">${iconHTML('gamepad')}<span>${x.name}<small>${x.powers.map(p=>POWER_TREES[p].name).join(' + ')}</small></span></button>`).join('')}</details><p class="tree-mobile-note">Research lasts. Borrowed upgrades expire at run end. Practice any power from its detail card.</p>`;
  }
  function detailRender() {
    const n = cat.nodes[selected], p = POWER_TREES[n.power], owned = !!state.profile.research[selected], base = n.kind === 'base', inLoadout = state.powers.includes(n.power), mastery = profileSummary(state.profile, cat).mastery[n.power], gate = familyGate(state.profile.research, n.power, cat);
    const buy = profilePurchase(state.profile, selected, cat);
    const currentReached = p.legacyMatch!==false && !p.uncertain && p.today.every(k => k === 'base' || state.equipped.includes(n.power + '.' + k)) && inLoadout;
    const today = p.legacyMatch===false ? 'Legacy Rewind retains a longer flight history. This tree deliberately bounds its base to one second and Longer memory to two seconds; no node exactly matches the old duration.' : p.uncertain ? 'Exact current-behavior match is still being specified.' : p.today[0] === 'base' ? 'The base already matches today’s behavior.' : 'Today’s configuration: base + ' + p.today.map(k => cat.nodes[n.power + '.' + k].name).join(' + ') + '.';
    detail.innerHTML = `<div class="tree-detail-title">${powerImage(n.power)}<div><span>${p.family} · Tier ${p.tier}</span><h3>${escape(n.name)}</h3></div></div><span class="tree-preview-tag">${iconHTML(n.kind==='capstone'?'epic':'switches')}${kindNames[n.kind]} · ${nodeStatus(selected)}</span><p class="tree-description">${escape(n.description)}</p><div class="tree-cost"><span>${base && cat.powers[n.power].starter ? 'Free starter' : n.seedCost + ' Seeds'}</span><span>${n.tuningCost} tuning${n.masteryPools ? ' · 3 pool mastery' : ''}</span></div><details class="tree-current ${currentReached ? 'is-reached' : ''}"><summary>${p.uncertain ? '△ Mapping pending' : currentReached ? '★ Today’s behavior equipped' : '★ Today’s behavior'}</summary><p>${escape(today)}</p><small>${escape(p.current)}</small></details>${base && !gate.ok && !owned ? `<p class="tree-requirement">Unlock: ${gate.required} ${p.family} upgrades${p.tier === 3 ? ' across 2 powers' : ''}. You have ${gate.upgrades} across ${gate.powers}.</p>` : ''}${n.masteryPools ? `<p class="tree-requirement">Mastery: ${Math.min(3, mastery)}/3 cleared pools using ${p.name}. Borrowing after Build waives permanent mastery.</p>` : ''}${n.conflictReason ? `<p class="tree-requirement">${escape(n.conflictReason)} Both may be researched; equip one at a time.</p>` : ''}<div class="tree-detail-actions">${button('compare','Compare before / after','gamepad')}${button('practice','Try it yourself','play')}${!gate.ok&&!owned?button('family-help','Explore '+p.family+' upgrades','network-node-three'):''}${button('pin',state.target===selected?'Unpin goal':'Pin research goal','star')}${!owned ? button('buy', base ? `Unlock · ${n.seedCost} Seeds` : `Research · ${n.seedCost} Seeds`, 'add', !buy.ok || state.phase !== 'shop' ? 'disabled' : '') : (!cat.powers[n.power].starter || !base) ? button('refund-ask', 'Review refund', 'arrow-left', state.phase !== 'shop' ? 'disabled' : '') : '<p>Starter power · permanently available</p>'}${state.phase !== 'run' && !base && inLoadout && (owned || state.borrowed.includes(selected)) ? button('equip', state.equipped.includes(selected) ? 'Upgrade equipped' : 'Equip upgrade', state.equipped.includes(selected) ? 'check' : 'add',`role="checkbox" aria-checked="${state.equipped.includes(selected)}"`) : ''}${state.phase !== 'run' && !base && inLoadout && !owned ? button('borrow', state.borrowed.includes(selected) ? (state.phase === 'shop' ? 'Remove starting loan' : 'Borrowed for this run') : 'Borrow for this run', 'add', state.phase==='interlude'&&(state.run.discovered||!state.run.offers.includes(selected))?'disabled':'') : ''}</div>${!owned && !buy.ok ? `<p class="tree-hint">${escape(reasonText[buy.reason] || buy.reason)}</p>` : ''}${state.phase === 'run' ? '<p class="tree-hint">Research and loadout changes reopen after the run.</p>' : ''}${!inLoadout && state.profile.research[n.power + '.base'] ? `<div class="tree-replace"><label for="tree-slot">Add ${p.name} to your loadout</label><select id="tree-slot" ${state.phase === 'run' ? 'disabled' : ''}>${state.powers.map((id, i) => `<option value="${i}">Replace ${POWER_TREES[id].name}</option>`).join('')}</select>${button('replace', 'Use this power', 'check', state.phase === 'run' ? 'disabled' : '')}</div>` : ''}${refund ? `<div class="tree-confirm"><strong>Return ${refund.seeds} Seeds?</strong><p>Remove: ${refund.removed.map(id => escape(cat.nodes[id].name)).join(', ')}.</p><p>Other purchased powers stay owned. Family upgrade counts fall, which can close future purchases.</p>${button('refund', 'Confirm refund', 'check')}${button('cancel', 'Cancel', 'arrow-left')}</div>` : ''}<p class="tree-hint">Green nodes are owned. A selected outline is only a selection, not a purchase. All four upgrades attach directly to their base.</p>`;
  }
  function render() {
    const active = document.activeElement;
    const key = ['treeAction', 'node', 'family'].find(k => active?.dataset?.[k]);
    const value = key ? active.dataset[key] : null;
    const attr = { treeAction: 'data-tree-action', node: 'data-node', family: 'data-family' }[key];
    controlsRender(); mapRender(); detailRender();
    if (attr) {
      const surface = sheet.open ? sheet : dialog;
      const target = surface.querySelector(`[${attr}="${value}"]:not(:disabled)`) || (sheet.open ? sheet.querySelector('[data-tree-action=back-map]') : null);
      target?.focus({ preventScroll: true });
    }
  }
  function handleClick(event) {
    const example=event.target.closest('[data-example]');if(example){controller.open('compare',example.dataset.example);return;}
    const hub=event.target.closest('[data-hub]');if(hub){expanded=expanded===hub.dataset.hub?null:hub.dataset.hub;selected=hub.dataset.hub+'.base';render();dialog.querySelector(`[data-hub="${hub.dataset.hub}"]`)?.focus({preventScroll:true});return;}
    const view = event.target.closest('[data-tree-view]');
    if (view) { dialog.dataset.view = view.dataset.treeView; dialog.querySelectorAll('[data-tree-view]').forEach(b => b.setAttribute('aria-pressed', String(b === view))); return; }
    const node = event.target.closest('[data-node]'), filter = event.target.closest('[data-family]'), action = event.target.closest('[data-tree-action]');
    if (node) { selected = node.dataset.node; refund = null; render(); if (mobile.matches) openSheet(); return; }
    if (filter) { family = filter.dataset.family; mapRender(); dialog.querySelector('#tree-map-scroll').scrollTo({ top: 0, left: 0 }); return; }
    if (!action) return;
    const type = action.dataset.treeAction;
    if(type==='family-help'){family=POWER_TREES[cat.nodes[selected].power].family;expanded=Object.keys(POWER_TREES).find(p=>POWER_TREES[p].family===family&&state.profile.research[p+'.base'])||null;if(sheet.open)sheet.close();render();dialog.querySelector('#tree-map-scroll').scrollTo({top:0,left:0});return;}
    if(type==='list'){list=!list;mapRender();return;}
    if(type==='pin'){const r=controller.act({type:'pin',id:state.target===selected?null:selected});if(r.ok){state=controller.get();render();status(r.message);}return;}
    if (type === 'guide') { openSheet(true); return; }
    if (type === 'back-map') { sheet.close(); return; }
    if (type === 'end-ask') { resetPending = true; controlsRender(); return; }
    if (type === 'cancel') { refund = null; resetPending = false; render(); return; }
    if (type === 'refund-ask') { const r = progressionRefundPreview(state, selected); if (r.ok) { refund = r; render(); } else status(reasonText[r.reason] || r.reason); return; }
    if (['play','practice','compare','tutorial','development','campaign'].includes(type)) { const result=controller.open(type,selected);if(result?.reason)status(result.reason);return; }
    const result = controller.act( { type: type === 'clear-bonus' ? 'clear' : type, bonus: type === 'clear-bonus', id: selected, power: cat.nodes[selected].power, slot: Number(detail.querySelector('#tree-slot')?.value), amount: 20, revision: refund?.revision });
    if (result.ok) { state = controller.get(); refund = null; resetPending=false;render(); status(result.message); }
    else status(reasonText[result.reason] || result.reason);
  }
  dialog.addEventListener('click', handleClick);
  sheet.addEventListener('click', handleClick);
  function openTree() {
    controller.screen?.();
    document.querySelectorAll('dialog[open]').forEach(d => d.close());
    state=controller.get();render(); dialog.showModal();
    if (mobile.matches) dialog.querySelector('.tree-mobile-title').focus({ preventScroll: true });
  }
  document.getElementById('tree-open').onclick = openTree;
  render();
  // Opening research never launches or alters a pool.
  if (new URL(location.href).searchParams.get('view') === 'tree') openTree();
  return {open:openTree,refresh(){state=controller.get();render();}};
}
