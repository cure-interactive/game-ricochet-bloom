# Game Modes to Try

**Proposed experiments, not playable modes.** These are candidates for the developer to select before implementation. They test the [Development Concept](development-concept.md) with small, distinct loops. All numbers below are starting playtest values, not validated balance or approved release scope.

## Current Baseline

The shipped game already has drag-and-release launches, drifting circular bodies, wall banks, contact powers, generated music, persistence, Campaign, Free Play and [Endless Waves](waves.md). Waves already pops contacted bubbles and gives five plucks to clear each wave. It is an existing comparison mode, not a new proposal.

General elemental payloads, interior maze walls, cargo delivery, outbreak sources, player health and enemies described below require new work. Existing powers named Bubble, Split, Drunk or Tether are not evidence that the workshop's general trapping, payload division, gas exposure or anchored-object systems exist.

Before: the workshop is a broad collection of interactions, while the existing modes primarily reward contacts, blooms and clears. Proposed after: add one separately selectable trial at a time, with a complete objective, failure state and restart, then decide what deserves further development. This page does not change the current game or its saves.

## Recommended Order

1. **Reaction Puzzle:** test whether intentional chains and collateral consequences are fun with limited shots. Start here because it stays closest to the current launch-and-pop loop.
2. **Cargo Rescue:** test whether protecting and delivering bubbles is more engaging than clearing them. It reuses walls and impulses while introducing a contrasting goal.
3. **Outbreak Containment:** test interacting sources and a fictional cellular objective with bounded enemy behavior. Build after the basic reaction and protection rules are readable.
4. **Pressure Survival:** reserve as a later test of real-time pressure. It adds a clock and player damage, so it should not be the first experiment.

Use a small **Reaction Lab** to inspect mechanics during development. It is a diagnostic sandbox, not a substitute for a game with a loss condition.

Working mode titles describe experiments; they are not final product names. Compare each trial against the current Waves mode before deciding to add permanent progression or a campaign.

## Reaction Puzzle

**Question:** can players plan a chain, understand its consequences and discover more than one solution?

**Control and loop:** retain drag-and-release launches. Inspect the fixed board, choose a target or bank, launch, watch the finite reaction settle, then adapt to the changed board. No clock runs while choosing a shot. The board persists between shots.

**Objective:** clear eight marked hazard targets in at most six shots while preserving three marked healthy cells. Win requires all targets cleared and every protected cell intact after the final reaction settles. Lose if a protected cell is destroyed, or the last shot settles with targets remaining. Score and chain length are secondary; a big chain does not override a failed objective.

**Smallest trial:** three hand-authored layouts using ordinary targets, blast bubbles, one compatible fire/gas reaction, protected cells and simple solid interior walls. No procedural campaign, research economy, enemies, shrapnel or full chemistry table. Introduce the blast first, then the pair reaction, then a mixed layout.

**Decision example:** take a safe bank shot or ignite a cluster that could clear several targets but push a hazard toward a healthy cell. Walls provide both routes and cover.

**Needed work:** interior-wall collisions; object roles and finite reaction triggers; blast/cover rules; protected-object state; objective evaluation after settlement; an isolated trial save and restart. Existing impulse effects and Waves clearing are starting points, not a complete implementation.

**Evidence to collect:** can a player predict the first reaction, explain a failure and deliberately reproduce a useful chain? Record shots used, restart count, distinct solutions and unintended chains. Treat unexplained wins as evidence of weak readability rather than automatically good emergence.

**First success gate:** players demonstrate two deliberate solutions on at least one mixed board and understand why a damaging chain failed. If one obvious explosion solves every board, add a meaningful positioning choice before adding more elements.

## Cargo Rescue

**Question:** does preserving and positioning a bubble create a satisfying alternative to popping it?

**Control and loop:** retain launches of the player body. Bump fragile cargo sacs toward a receiver, reposition through banks, use a limited environmental tool to open a route, and deliver cargo intact. Ordinary contact pushes cargo instead of popping it; sharp hazards and configured blast damage can rupture it. This difference must be clearly marked.

**Objective:** deliver at least two of three cargo sacs within eight shots. Delivered cargo is removed safely from the pool. Lose when fewer intact or delivered sacs remain than the quota requires, or when the final shot settles below the delivery quota. There is no player-health system or countdown in the first trial.

**Smallest trial:** three layouts with one receiver, cargo, walls, a single visible current and one breakable barrier. Use one already-tested blast rule for the barrier; do not add enemies, elemental mixtures, payload inventory or a second control scheme yet.

**Decision example:** send a sac through a narrow safe channel, or open a shorter path with a blast that could damage it. A current can carry the sac while the player handles another obstruction.

**Needed work:** cargo identity and contact behavior; receiver detection; cargo integrity and loss accounting; visible current fields; compatible walls and barrier reactions; trial save and restart. Reuse Reaction Puzzle's relevant rules if that experiment is implemented first.

**Evidence to collect:** unintended cargo pops, ability to explain current direction, recovery from a bad push, and whether careful transport feels rewarding or tedious. Test phone aiming and muted audio. Compare the same layout with and without the current to isolate its contribution.

**First success gate:** players can intentionally deliver cargo through two routes and recover from at least one imperfect push. If cargo drifts indefinitely or gets irretrievably wedged, revise geometry and settling before expanding the system.

## Outbreak Containment

**Question:** do sources, hostile movement and environmental manipulation produce useful emergent choices in a fictional cellular setting?

**Control and loop:** use discrete launches. Inspect source output and enemy intent, trigger a reaction or seal a source, let the shot settle, then advance one outbreak turn. Sources and hostile decisions advance only at that boundary, so waiting while aiming is not penalized.

**Objective:** seal two marked infected vents and remove the remaining infected motes within eight turns while keeping a central healthy cell alive. The protected cell begins with three integrity points. Player health is not needed for this version. Lose when the cell reaches zero or the eighth turn ends with the objective incomplete.

**Smallest trial:** one chamber, two vents, one predictable pursuer behavior, the protected cell, a mud effect and one tested blast effect. Each open vent emits one visible queued mote per turn, up to six active motes total; when capped, production visibly pauses. Each mote moves a bounded distance toward the cell at the turn boundary. A contacting mote deals one damage and is consumed, avoiding repeated hidden damage ticks.

**Proposed sealing rule:** pushing a compatible plug onto a vent seals it. Mud slows motes; blasts move plugs and motes. These are invented game rules. The player can solve the situation through positioning without a biological explanation or a large combat system.

**Decision example:** seal the nearest vent immediately, or use one more emitted mote to start a reaction that clears the far side. The protected cell creates a reason not to trigger every possible explosion.

**Needed work:** turn-boundary source and enemy updates; vents, plugs and sealing; protected-cell integrity; bounded pursuit; a non-stacking slow effect; preview cues; objective ordering; exact saved continuation. Use one canonical rule for an effect on every compatible object.

**Resolution order to test:** finish the player's reaction, apply existing damage, stop on cell loss, recognize a completed containment objective, then advance surviving sources/enemies if a turn remains. Display the step that caused failure. A last-turn clear counts; no extra outbreak phase follows a completed objective.

**Evidence to collect:** whether players use enemies or sources as tools, understand the next outbreak step, and distinguish an urgent threat from a harmless one. Record direct attacks, environmental defeats, vents sealed and cell damage.

**First success gate:** players can describe and execute both a quick-seal approach and a reaction-based approach. If the only effective action is repeatedly hitting enemies, revise source interactions before expanding the roster.

## Pressure Survival

**Question:** is the same reaction vocabulary enjoyable under continuous time pressure?

**Control and loop:** keep the existing launch-and-settle cadence for the first comparison. World simulation and the encounter clock continue while aiming; launching is available when the player rests. Pause and hidden-tab behavior pause the encounter clock. Continuous steering is a separate later test, not a simultaneous change.

**Objective:** survive a 90-second encounter with three player-health points while two visible sources emit hazards. Win when the clock ends with health remaining; lose when health reaches zero. Score measures optional hazard clears. This is a finite survival trial, not another endless wave ladder.

**Smallest trial:** one open arena, two sources, one damage hazard, one blast interaction and a maximum of twelve active hazards. Start with a source emission every six seconds and a one-second damage immunity window; these are tuning hypotheses. No poison, obscuring gas or drunk movement in the first comparison.

**Needed work:** encounter clock, player health, clearly telegraphed contact damage, damage immunity, bounded timed sources and isolated persistence. Source clock semantics differ from Outbreak Containment and must be displayed explicitly.

**Evidence to collect:** idle or helpless time during coasting, warning readability, purposeful chains and phone input mistakes. If players cannot avoid damage with discrete launches, reject or revise this control pairing rather than merely increasing health. Do not add multiple impairments to conceal a control problem.

## Reaction Lab and Playtest Method

The lab would offer a few known starting arrangements, single-step or slow inspection, reset, and a visible causal log such as contact, pop, release, push and merge. It has no progression rewards or competitive records. Its absence of a loss condition is intentional for debugging only.

For playable trials, use the same available powers for every tester. Existing permanent research must not quietly change the experiment. Keep trials separate from Campaign, Free Play and Waves saves, wallets, mastery and records; restart only the selected trial. Existing player progress must remain intact.

Start with three short layouts per recommended mode and an identical seed on retries. In shot-based trials, pause idle drift while aiming for reproducible comparisons; show the board state before release. This differs from current freely drifting play and needs explicit implementation if selected. Repeat tests later with live drift to assess whether timing adds useful skill.

Ask players to explain the goal before launching, predict one interaction, try a solution, explain the result and retry. Log completion, attempts, shots or time, failure cause, intended versus accidental reactions, and unexpected solutions. A small exploratory group can expose problems; it cannot establish broad audience preference.

Run one muted session and one with generated music. Music may improve feel, but the objective and causes of success must remain understandable without it. Compare with the existing Waves baseline using similar session lengths. Choose the next prototype based on deliberate replay interest, readable consequences and meaningful choices, not just effect count.

## Scope and Implementation Decision

The recommendation is to implement **Reaction Puzzle first**, then compare **Cargo Rescue**, then consider **Outbreak Containment**. Pressure Survival and mass-based growth remain reserves. A full cellular campaign should follow evidence from the trials rather than precede it.

Each selected mode needs a separate implementation decision and its own acceptance boundary. The likely owners to inspect are the physics engine, mode/session state, input and menus, rendering, persistence, and the existing tests. This document does not prescribe a shared framework before the first rules have been tested.

Research connects the proposals to different player motives: Puzzle Bobble's grouping and supply, Bubble Bobble's containment, Bubble Ghost's protection, Osmos's resource tradeoff, FOAMSTARS's lasting terrain and Noita's systemic reactions. See the [verified source notes](development-concept.md#research-and-sources); these are design inspirations, not evidence that our modes are already fun.

The remaining decision is which mode to authorize first and whether its initial objective and controls match the experience the developer wants. No new release number, permanent mode, multiplayer feature or campaign replacement is approved here.

## Attribution

### Sources

The developer's workshop and request for experimental modes; [Development Concept research](development-concept.md#research-and-sources); the current [Waves guide](waves.md), [Campaign guide](campaign.md) and [How to Play](how-to-play.md).

### Contributions

#### Codex on behalf of `leviscustempris`

Proposed bounded mode experiments, distinguished prerequisites from existing behavior, and defined playtest questions and starting rules. All trial parameters remain untested hypotheses.
