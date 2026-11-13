# Play the Gamemodes

Open **Main Menu → Gamemodes**. Every experiment has its own named card and graphical thumbnail directly alongside the original modes. Select a card to open that gamemode’s own setup, with exactly three difficulty choices and its own settings. There is no parent-mode or Challenge / Variation picker.

## Modes and Categories

Search by name, mechanic or idea number. Optional Category and Availability filters narrow the same page. **Play Now** contains implemented games; **In Development** contains illustrated ideas whose gameplay is still being built. A card does not imply implementation. Saved Runs & Notes retains unfinished runs, favourites, configurations, verdicts and notebook backups. Stable IDs and existing saves are preserved.

The 210 catalogue ideas use 18 categories for browsing and related simulation code. Categories are not playable replacements for their individual gamemodes. Coverage below is generated from the actual registry; the full implementation is still in progress.

<!-- BEGIN MODE COVERAGE -->
| Category | Implemented Catalogue Ideas | Difficulty Levels Used by Its Gamemodes |
| --- | --- | --- |
| Trick Shots | 10/10 | First Line · Bank and Bend · The Final Pocket |
| Reaction Puzzle | 1/20 | First Spark · Firebreak · Chain of Islands |
| Cargo Rescue | 1/10 | Open Water · Narrow Passage · The Long Way |
| Outbreak Containment | 1/10 | First Response · Crossfire · Quarantine |
| Pressure Survival | 0/10 — In Development | Planned: Breathing Room · Closing In · Last Refuge |
| Pool Engineer | 0/20 — In Development | Planned: Open Channel · Crossed Paths · The Switchyard |
| Score Attack | 1/10 | Planned: Clean Break · Risk and Reward · High Stakes |
| Power Expedition | 0/10 — In Development | Planned: First Choice · Trade-Off · Final Build |
| Melody Trials | 10/10 | First Phrase · Two Voices · Full Arrangement |
| Memory Pool | 0/10 — In Development | Planned: Remember Three · Hidden Route · Final Deduction |
| Living Pool | 0/20 — In Development | Planned: One Cell · Shared Resources · The Whole Organ |
| Pool Adventures | 0/10 — In Development | Planned: The Entrance · The Detour · The Escape |
| Pool Duel | 0/10 — In Development | Planned: First Round · Contested Ground · The Decider |
| Together | 0/10 — In Development | Planned: Meet in the Middle · Separate Roles · One Last Chance |
| Pool Workshop | 0/10 — In Development | Planned: First Creation · Working System · The Showcase |
| Capture and Release | 1/10 | Around the Wall · Lower Passage · The Return |
| Split and Merge | 0/10 — In Development | Planned: Two Halves · Unequal Shares · Exact Balance |
| Source Works | 0/10 — In Development | Planned: First Output · Supply Chain · The Factory |
<!-- END MODE COVERAGE -->

**Challenge Library** is an optional searchable index, not a required step before playing. Browse the illustrated mode overview or search all 210 ideas and the three original rule sets. Filter by gamemode, kind, implementation or local playtest verdict. Every challenge has a graphic thumbnail. Proposed challenges have descriptions and notes but no Start button.

The location bar gives a direct **Gamemodes** return. Opening a mode starts at the top of its setup screen. The mode name remains visible; a challenge is selected inside that mode. The existing Back history is preserved.

Implementation and feedback remain separate. **Playable Prototype** means rules exist; **Available Mode** opens an existing mode; **Proposed** means implementation is pending. **Untested**, **Promising**, **Needs Work**, **Keep** and **Shelve** are local human verdicts. Automated checks do not set them. Stable IDs 001–210 identify the entries in [Game Modes to Try](game-modes.md).

## Three Levels and Settings

Choose a gamemode card, select one of its three illustrated difficulty boards, and press Start. Each setup has its own goal, failure rules and settings. The shared category describes related mechanics; it does not require another navigation step.

**Settings** contains bounded presets and options. Changing an option creates a Custom setup with separate records. Goal and failure rules are visible before Start. **Saved Configurations** holds named setups; up to 64 are retained. Removing a saved name does not delete its run or results. Each challenge, difficulty, preset, resolved option set and rules version has its own save and record. Retry repeats that exact setup.

## Trick Shots

The Trick Shots category contains ten individual gamemodes. Each exposes First Line, Bank and Bend and The Final Pocket as its three difficulty levels:

- **One-Pluck Clear (#001):** hit every marked target in one launch.
- **Bank Shot Only (#002):** targets count only after a wall bank in the current shot.
- **Called Shot (#003):** select the first target before launching; make five correct calls in seven shots. Calls lock during flight.
- **Exact Chain (#004):** hit exactly three distinct targets; a fourth fails immediately.
- **Last Bubble Standing (#005):** clear the targets without touching the red keeper.
- **Power Order (#006):** collect Comet, Wrap and Stasis in order. Their speed boost, edge transfer and braking change the route.
- **Corner Tour (#007):** visit all four corner gates in one long-gliding shot and stop in the central region.
- **Ricochet Golf (#008):** stop fully inside the cup. Compare the shots used across the three difficulty pools.
- **Landing Zone (#009):** collect the targets and come to rest fully inside the finish region.
- **Narrow Escape (#010):** pass gates in order without touching forbidden walls or the boundary.

All three difficulties have checked physical shot solutions for each challenge. This establishes solvability, not a human fun or balance verdict.

## Melody Trials

The Melody Trials category contains ten individual gamemodes. Each exposes First Phrase, Two Voices and Full Arrangement. These musical spaces add staggered keys and cover as difficulty rises:

- **Melody Route (#081):** play the displayed pitch sequence. Incorrect notes sound but do not advance it.
- **Rhythm Gates (#082):** cross numbered gates inside visible beat windows. Settings offers a timing offset and an Untimed comparison, each with separate records.
- **Call and Response (#083):** hear and watch the call, then answer from memory. Replay Call is free; preview notes never enter your song.
- **Harmony Builder (#084):** collect C major, D minor and G major chord tones in any order within each chord.
- **Instrument Rescue (#085):** physically deliver Melody, Bass and Rhythm cargo into their matching stages. Each delivered part joins the arrangement.
- **Silence Puzzle (#086):** play the green notes while avoiding every red SOUND bubble.
- **Crescendo Run (#087):** build two chains containing at least three different notes, then stop fully inside the quiet finish. Musical intensity rises with the completed chains.
- **Counterpoint (#088):** alternate Upper and Lower seeds, each playing C, E and G on its own side. Contact with the other voice’s notes fails.
- **Phrase Repair (#089):** replace shown missing or incorrect notes in the indicated order.
- **Free Composition (#090):** choose a pitch palette and play without a losing condition. At rest, Save Composition keeps the song in the existing Song Library and the setup notebook. A full or unavailable Song Library prevents completion until the save can succeed. The composition workspace supports up to 4,096 launches before it must be saved; reaching capacity does not lose the song.

Every challenge has a checked physical solution on all three levels. Pitch labels agree with played and stored notes. Musical clues have visible equivalents; audio is not required. The board stays still during aim, while rhythm windows and call previews continue until Pause.

## Controls and Saves

Physical bodies wait while you aim. Melody Trials beat windows and call previews keep their own clock. Drag backward anywhere on the board and release to launch, or use Aim and Power followed by Launch. With the board focused, Left/Right adjust direction, Up/Down adjust power and Space launches. Escape pauses. Every finished game offers Main Menu; it saves the result before returning home. A shot ends after all motion settles. Capture adds a Release Payload button while carrying and aiming; release uses one shot.

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

Other presets, Custom setups, the rule variations, Trick Shots and Capture Transport Release record experimental results without awarding Skill Tree Points. Fixed environmental tools keep existing research from changing a puzzle. Trials do not train permanent power mastery. Contact-generated music accompanies play; goals and the reaction log explain outcomes with sound muted.

## What to Test

The nine original layouts, nine variant layouts and three capture layouts have real-shot simulation solutions at Standard settings. Checks cover exact saved continuation, profile and configuration isolation, malformed data, result deduplication, import/export and save failures. These establish mechanical behavior. Balance, enjoyment, physical-device touch comfort and the usefulness of each variation still need human playtesting.

## Attribution

### Sources

Ricochet Bloom's authored trial engine, experiment catalogue, setup rules and notebook implementation; the developer's mind map and [research connections](development-concept.md#research-and-sources).

### Contributions

#### Codex on behalf of `leviscustempris`

Implemented and documented the experiment hub, stable catalogue IDs, versioned setups, notebook, controlled variations and capture prototype. Human playtest verdicts remain separate from automated verification.
