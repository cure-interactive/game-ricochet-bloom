# Developer

This area is available in the in-game Wiki while Development mode is enabled. Normal play keeps the gameplay guides. Turn Development mode on or off in Settings, Advanced, Development & Backups. Show Hidden Content alone does not enable this area.

## Economy Tuning

The target is roughly two average research purchases per five minutes of representative active play, across gamemodes. This is a balance target, not a timed allowance or a purchase cap. Waiting, pausing and leaving the game open earn nothing. Better play can earn faster; missed shots earn nothing.

New rewards pay once per productive settled shot: a shot must contact a target or complete its goal. Repeated contacts, larger chains, 5-Chains and wave clears do not stack extra base Points. Difficulty bonuses still add 1–5 Points when earned. Campaign clears retain their progress, medals and mastery without a second currency award. All playable experiment presets use the same action rules for their mode.

Research prices and per-mode action awards are calibrated together. The average means the arithmetic mean of all purchasable power nodes and player upgrades, excluding the free Ripple root. Cheap skills can be bought more often and expensive skills less often. Existing balances, purchases and historical reward receipts remain unchanged; updated prices apply only to future purchases. Older in-progress reward records retain their prior earned amount and use the new action rules for subsequent shots.

The offline benchmark uses actual simulated flights plus a stated five-second aiming allowance per shot. That allowance is only a tuning assumption; the live reward calculation never reads a clock. Solved trial paths and a nearest-target starter build are repeatable reference samples, not measured human play. Include novice, experienced, upgraded and accessibility-oriented play before claiming the target holds for people.

Current action awards are 5 Points in the five continuous-physics modes; 3 in Reaction Puzzle, Cargo Rescue and Outbreak Containment; and 4 in Trick Shots, Melody Trials and Capture Transport Release. The 129 purchasable nodes average 58.91 Points. Power research spans 30–100 Points; player research spans 60–240. Prices shown in Skills are authoritative.

The v3.17.0 reference samples produce about 1.76–2.14 average purchases per five minutes: Free Play 1.89, Waves 1.82, Challenge 1.97, Melody Journey physics 1.91, Score Attack 1.87, Reaction 1.76, Cargo 1.82, Outbreak 1.84, Capture 1.86, Trick Shots 2.14 and Melody Trials 2.14. Those historical samples used 120 purchasable nodes averaging 57.08 Points. Run `node tool/economy.mjs` for the current catalogue; it does not reproduce the historical prices. The baseline samples do not prove every upgraded build or Custom configuration is equally efficient.

## Playtest Method

- Use a fresh isolated Development profile for each build comparison. Do not mix currency grants into earned totals.
- Record mode, level or preset, player/power build, starting and ending earned Points, shots, productive shots, misses and completed bonuses.
- Measure active play separately from paused time and menu browsing. Compare earned Points divided by average current research price over equivalent five-minute samples.
- Compare novice and experienced players across the campaign, open modes and every playable experiment family. Check small and large upgrade collections.
- Look for quick restart farming, repeated-contact farming, custom settings that make rewards trivial, and reward loss after retry or reload.
- Tune fixed action awards, objective difficulty or research prices. Never add clock-based rewards, cooldown payouts or waiting incentives to force the result.

## Workshop

- [Development Concept](development-concept.md) — the bubble/cellular mind map, interaction ideas and research sources.
- [Game Modes to Try](game-modes.md) — the experiment catalogue, briefs and comparison questions.
- [Play the Experiments](experiments.md) — help for the currently playable modes.

## Development Tools

Development mode uses an isolated profile. Currency grants and maximum-research controls are test tools; they are not normal earnings. Copy Report in Settings → Get Help includes diagnostics and progress; startup recovery also offers diagnostics when the game cannot load. Points grants, maximum research and maximum level progress work with an unfinished test pool. Its current build stays fixed until the next pool. Copy Normal Progress replaces the test profile and exits its previous session; it refuses an unreadable Normal save. Shared challenges and unresolved save failures must be left or resolved before using these tools. Export a backup before replacing progress. Keep confidential credentials and private information out of this area: the in-game visibility switch is not authentication for files on the public static host.

Development controls use a separate test profile. They can reset test progress, maximize campaign access or maximize the skill tree without awarding normal campaign receipts. **Show Hidden Tracks, Skills and Skins** reveals locked tracks, research and player skins for inspection in either profile without changing unlocks or progress. Your previous Show All Skills preference carries over to this combined setting. **Show purchased items cost** displays catalogue Points prices on owned power and player skills, skins, trails, impacts and Music themes, including their cards and detail pages. Equipped and unlocked labels remain visible. Free defaults and campaign rewards do not show purchase prices. This is a view preference in either profile; it does not change purchases or saved prices. Both view toggles are off by default. During Development gameplay, press the bottom **Development Profile Active** bar to expand the music panel; press it again to collapse. An arrow indicates this action and changes direction when open. The thin bar keeps the same text and height. The panel starts collapsed on reload and collapses when leaving gameplay. This rule also applies to Melody Journey and saved-song listening: neither forces it open. On menus and dialogs, the bar only identifies the Development profile. Normal and temporary shared profiles have no music disclosure; generated music still plays. These toggles, Development mode and the Points-to-add amount are remembered in this browser, including after reopening the game. Test unlocks, Points and runs also remain saved; reloading does not repeat grants or maximize actions. Switch Development mode off to return to your normal progress. Clearing browser data clears these preferences, and other browsers or devices keep their own settings.

## Rendering and Preview Implementation

Both skill maps use one `skill-tree.js` system for their shell, camera lifecycle, controls, keyboard navigation and route highlighting. Powers and Player supply their own graph, eligibility and purchase actions. One world-parent transform moves fixed node coordinates during pan and zoom; inherited camera variables no longer reposition each node. The SVG link window remains clipped to the visible viewport, without a forced world-sized bitmap. They cache node references per graph rebuild, coalesce camera changes into one animation-frame paint and skip unchanged DOM writes. Artwork decoding runs asynchronously with two concurrent jobs and a bounded 160-source cache. Compact and overview levels simplify distant art, labels and glows. The dots are a static repeating `tree-grid.svg` CSS background; their opacity decreases with zoom and drawing stops at overview scale. These bounds reduce work, but automated stress tests do not establish physical iPhone performance or crash acceptance. The owning code is `skill-tree.js`, `tree-view.js`, `tree-map.js`, the domain adapters `tree-ui.js` and `player-upgrade-ui.js`, and `tree.css`.

Player previews share bubble deformation and local motion. Their trail histories use local movement rather than page displacement; offscreen drawing is culled only after the full effect bounds leave the viewport. Hiding the owning page suspends its previews. Large tethers use a radial soft limit, not independent x/y clamps. Trail and Impact interaction does not emit impact FX; scheduled demonstrations choose varying rim contacts. Full arenas retain wall contacts. The owners are `player-bubble.js`, `cosmetic-preview.js` and the shared bubble interaction helpers.

The shared selector uses clipped solid contrast layers. The Player tab draws a filled backing behind the material along the same membrane shape, clipped to the selection's actual edges. Physical Safari artifact acceptance remains separate from desktop and automated checks.

## Audio Implementation

Interface cues share a dedicated smoothed gain below master in `sound.js`; music and gameplay voices bypass it. The saved `interfaceVolume` preference defaults to 1 and is restored on audio graph creation. `app.js` uses the preference-only persistence path so changing it during a trial does not depend on gameplay saving. Slider/selector taps retain their original pitch and timing with 0.8 times their previous amplitude.

Instrument voices are synthesized locally; they do not download sampled sound banks. Soundstages use finite impulse responses in a music-only graph with no accumulating feedback. Ambience uses 48-second seamless buffers, smooth event envelopes and a bounded three-style cache. Night Forest and Ember Hearth add sparse varied phrases; Orbital Drift uses continuous tones. `audio-environment.js`, `audio-voice.js`, `music-theme.js` and `music-environment.js` own these sounds and catalogue settings.

Preview ownership uses the audio clock and invalidates pending starts on replacement, navigation, mute or page hiding. All Music auditions capture the currently audible PoolSound owner (menu or gameplay). Instrument overrides voice upcoming arrangement notes, Soundstage overrides the live room, and Ambience overrides the background layer without changing saved selections. Standalone cosmetic SFX auditions retain background ducking. Atmosphere buffers share normalized energy and peak headroom. Music previews expire after ten seconds and expose elapsed progress. Realtime playback and WAV highlights share environment processing; already prepared audio must be rendered again to include changed selections. Automated continuity checks cannot replace listening on the affected physical device.

## Reference Maintenance

The regular Wiki describes current controls, rules, choices and player-visible limitations. Keep source paths, rendering and synthesis internals, benchmark assumptions and automated test claims here or in gated Developer Notes. Historical Player Changes describe their original release, not a promise that its behavior remains current.

`tool/wiki.mjs` generates the Power-Ups reference from `power-tree.js` and `catalogue.js`. `tool/medal.mjs` generates Medals from the playable condition rules. `tool/experiment.mjs` maintains the workshop catalogue and coverage below. Edit those owners and regenerate; each tool supports `--check`. Check rendered Normal and Development navigation as well as source links so hidden sections do not leave dangling public links.

## Experiment Coverage

This is implementation coverage, not a player menu or a promise that planned levels are playable. The registry tracks ideas individually; proposed categories have no playable rules yet.

<!-- BEGIN MODE COVERAGE -->
- **Trick Shots:** 10/10 catalogue ideas implemented. Difficulty levels: First Line · Bank and Bend · The Final Pocket.
- **Reaction Puzzle:** 1/20 catalogue ideas implemented. Difficulty levels: First Spark · Firebreak · Chain of Islands.
- **Cargo Rescue:** 1/10 catalogue ideas implemented. Difficulty levels: Open Water · Narrow Passage · The Long Way.
- **Outbreak Containment:** 1/10 catalogue ideas implemented. Difficulty levels: First Response · Crossfire · Quarantine.
- **Pressure Survival:** 0/10 catalogue ideas implemented — In Development. Planned levels: Breathing Room · Closing In · Last Refuge.
- **Pool Engineer:** 0/20 catalogue ideas implemented — In Development. Planned levels: Open Channel · Crossed Paths · The Switchyard.
- **Score Attack:** 1/10 catalogue ideas implemented. Planned levels: Clean Break · Risk and Reward · High Stakes.
- **Power Expedition:** 0/10 catalogue ideas implemented — In Development. Planned levels: First Choice · Trade-Off · Final Build.
- **Melody Trials:** 10/10 catalogue ideas implemented. Difficulty levels: First Phrase · Two Voices · Full Arrangement.
- **Memory Pool:** 0/10 catalogue ideas implemented — In Development. Planned levels: Remember Three · Hidden Route · Final Deduction.
- **Living Pool:** 0/20 catalogue ideas implemented — In Development. Planned levels: One Cell · Shared Resources · The Whole Organ.
- **Pool Adventures:** 0/10 catalogue ideas implemented — In Development. Planned levels: The Entrance · The Detour · The Escape.
- **Pool Duel:** 0/10 catalogue ideas implemented — In Development. Planned levels: First Round · Contested Ground · The Decider.
- **Together:** 0/10 catalogue ideas implemented — In Development. Planned levels: Meet in the Middle · Separate Roles · One Last Chance.
- **Pool Workshop:** 0/10 catalogue ideas implemented — In Development. Planned levels: First Creation · Working System · The Showcase.
- **Capture and Release:** 1/10 catalogue ideas implemented. Difficulty levels: Around the Wall · Lower Passage · The Return.
- **Split and Merge:** 0/10 catalogue ideas implemented — In Development. Planned levels: Two Halves · Unequal Shares · Exact Balance.
- **Source Works:** 0/10 catalogue ideas implemented — In Development. Planned levels: First Output · Supply Chain · The Factory.
<!-- END MODE COVERAGE -->

## What to Test

The nine original layouts, nine variant layouts and three capture layouts have real-shot simulation solutions at Standard settings. Checks cover exact saved continuation, profile and configuration isolation, malformed data, result deduplication, import/export and save failures. These establish mechanical behavior. Balance, enjoyment, physical-device touch comfort and the usefulness of each variation still need human playtesting.

Trick Shots and Melody Trials have physical-shot fixtures for each authored Standard level. Score Attack fixtures establish a Gold route with starter Ripple for each shot budget. These are solvability checks, not human balance verdicts. Changing Custom options can produce impossible goals. Use the gameplay guides for actual goals and controls, and the source test suites for validation details.

## Release Notes

[Change Logs](changelog.md) includes player changes and developer notes for each release. Developer notes are visible while Development mode is enabled.

Cosmetic favorites are optional validated profile IDs, independent of receipts and equipment. Galleries share sibling favorite buttons and a scrolling rarity selector; Favorites filters existing cards without sorting them. Rarity/index order remains stable.

Tab gestures belong to their starting surface: selected-pill bounds own selection dragging; unselected touch gestures retain native scrolling. The nav and buttons inherit the same axis policy, with only the selected button reserving drag input. Contrast uses pixel-aligned rectangular crops instead of changing text/mask clip-paths. Physical iOS tearing acceptance remains a device check.
