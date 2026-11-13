# Play the Experiments

Open **Main Menu → Gamemodes → Experiments**. Choose a family, then an experiment. Seven playable prototypes share the hub: the three original trials, three rule variations and Capture Transport Release. Score Attack is also reachable from the Strategy family and keeps its own setup screen.

## Families and Catalogue

**Play** shows available families, unfinished setups, favourites and recently played experiments. **Development Catalogue** lists all 210 ideas plus the three original trials. Search by name, stable ID or mechanic; filter by family, kind, implementation or playtest verdict. Proposed ideas have descriptions and notes, but no Start button. Score Attack links to its existing game mode.

Implementation and feedback are separate. **Playable Prototype** means rules exist; **Available Mode** links to an existing full mode; **Proposed** means the idea needs implementation. **Untested**, **Promising**, **Needs Work**, **Keep** and **Shelve** are your local verdicts. A successful automated check does not set a human verdict. IDs 001–210 also identify the entries in [Game Modes to Try](game-modes.md).

## Setup and Variations

One setup screen contains **Variation**, **Layout**, **Preset**, a board preview and an expandable **Options** section. Standard, Gentle and Demanding presets adjust the shot budget and relevant rules. Editing an option switches to Custom. Goal, failure conditions, reward policy and the exact shot budget appear before Start.

Reaction options include an explosion allowance for Reaction Budget. Cargo options include delivery quota and current strength, plus an impact limit for Hazardous Shipment. Containment offers source intervals. Capture Transport Release offers release radius. Options are bounded experiments; unusual combinations and demanding presets still need balance testing.

Give a configuration a name and use **Save Configuration** to keep it in the Saved Configurations selector. Up to 64 named configurations can be retained; removing a saved name does not delete its run or records. Starting or continuing play also remembers the most recent configuration. Every layout, preset, resolved option set and rules version has its own save and personal record. Custom results remain separate even when their numbers match a preset. Retry Same Setup repeats those exact rules with a new attempt.

## Controls and Saves

The board waits while you aim. Drag backward anywhere on the board and release to launch, or use Aim and Power followed by Launch. With the board focused, Left/Right adjust direction, Up/Down adjust power and Space launches. Escape pauses. A shot ends after all motion settles. Capture adds a Release Payload button while carrying and aiming; release uses one shot.

Pausing or leaving saves the full board and generated song, including an unfinished flight. Continuing a flight opens it paused. Original version-one trial saves remain under Earlier Trial Saves and retain their existing rules; new setups do not replace them. Starting another unfinished run for the exact same configuration asks before replacing it. Other configurations remain intact.

The notebook is local to this browser, with separate Normal and Development profiles. **Notebook Backup and Storage** exports or imports that profile's setups, saves, results, favourites and feedback. Import replaces the notebook after confirmation and rejects a different profile or unsupported data. Legacy trial saves and Skill Tree progress remain separate. Export before clearing browser data.

The notebook retains the latest 200 completed results and up to 64 saved configurations. At the save limit, an old completed save can be removed to make room; unfinished runs are preserved. If every slot is unfinished, finish a run or export and explicitly reset the notebook. Unreadable notebooks are preserved and block new writes until recovered or explicitly reset. A failed gameplay save pauses play and offers Retry Save and Export Pending Run.

## Reaction Puzzle

Clear eight hazards in six Standard shots while preserving all three healthy cells. Pink circles are targets, orange bursts are blast bubbles, flame symbols are fire and green bubbles contain gas. Crosses mark protected cells. Damaging a protected cell loses the trial even if the same shot clears every hazard.

Touching a blast bubble triggers it and can chain through nearby blast or gas bubbles. Fire ignites nearby gas. Touching gas directly vents it safely. Solid walls block blasts and provide bank shots. Try First Spark, Firebreak and Chain of Islands.

**Reaction Budget (#013)** adds a three-explosion allowance. Every propagated explosion counts once. Exceeding the allowance loses the run; the current count is visible beside the objective.

## Cargo Rescue

Deliver two of three blue cargo bubbles into the mint receiver within eight Standard shots. Contact pushes cargo. Spikes and blasts rupture it; losing too many to meet the quota ends the run. Delivered cargo is safe. Arrows show the current and striped barriers can be blasted open. Try Open Water, Narrow Passage and The Long Way.

**Hazardous Shipment (#030)** also ruptures cargo when relative impact speed exceeds the setup's visible limit (520 by default). Gentler launches and glancing contacts can protect it. Delivery quota and current strength are configurable; changing them creates separate records.

## Outbreak Containment

Seal both vents and remove all infected motes within eight Standard shots. Push diamond-shaped plugs into ringed vents. The central cell starts with three integrity points; losing them all ends the run.

After an unfinished shot settles, existing motes advance, then due vents emit, up to six active motes. Motes reaching the cell consume themselves and cause damage. No extra outbreak turn follows a completed objective or final shot. Vent labels show turns until emission or CAPPED. Contact and blasts clear motes; the brown mud bubble creates a slowing area. Try First Response, Crossfire and Quarantine. These are fictional cellular rules.

**Source Priority (#032)** staggers the vents: the upper vent emits every turn and the lower every second turn by default. Changing Source Interval shifts both intervals while retaining their one-turn difference.

## Capture Transport Release

**Capture Transport Release (#151)** has three layouts: Around the Wall, Lower Passage and The Return. Touch the orange payload to enclose it. An orange ring around the player shows that it is being carried. Move around solid cover, then use **Release Payload** while aiming to detonate it near the pink targets. The default release radius is 140 pool units.

All three targets must be cleared by the release. Solid walls block its blast. Spikes rupture a carried payload; releasing where a target survives loses the run. Capture and movement use normal shots, and release consumes one shot. Retry keeps the chosen layout, preset and options.

## Results and Feedback

Completed wins and losses are recorded once per attempt. The setup screen shows completed runs, wins, the fewest shots in a win, and its latest ten results. Completed totals and personal bests survive pruning of the 200-result history; up to 2,000 distinct rule configurations retain records. This is not a global leaderboard. Normal, Development, Custom and different rule configurations never share a record.

After a result, choose **Review / Change Setup** to write a verdict and notes, or **Retry Same Setup** to repeat the experiment. Feedback belongs to the experiment ID across its configurations; describe the layout and settings in your note when relevant. Save Feedback confirms the write. A favourite makes an idea or prototype easy to revisit from Play.

## Points and Music

Standard presets of Reaction Puzzle, Cargo Rescue and Outbreak Containment retain their existing Skill Tree rewards: one Point per six accumulated unique contacts, one for a chain of at least five contacts in a shot, and three for completing the objective. Rewards bank at shot boundaries, including losses; resuming the same receipt never pays twice. Earlier trial saves keep these rewards.

Other presets, Custom setups, the three variations and Capture Transport Release record experimental results without awarding Skill Tree Points. Fixed environmental tools keep existing research from changing a puzzle. Trials do not train permanent power mastery. Contact-generated music accompanies play; goals and the reaction log explain outcomes with sound muted.

## What to Test

The nine original layouts, nine variant layouts and three capture layouts have real-shot simulation solutions at Standard settings. Checks cover exact saved continuation, profile and configuration isolation, malformed data, result deduplication, import/export and save failures. These establish mechanical behavior. Balance, enjoyment, physical-device touch comfort and the usefulness of each variation still need human playtesting.

## Attribution

### Sources

Ricochet Bloom's authored trial engine, experiment catalogue, setup rules and notebook implementation; the developer's mind map and [research connections](development-concept.md#research-and-sources).

### Contributions

#### Codex on behalf of `leviscustempris`

Implemented and documented the experiment hub, stable catalogue IDs, versioned setups, notebook, controlled variations and capture prototype. Human playtest verdicts remain separate from automated verification.
