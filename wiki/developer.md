# Developer

This area is available in the in-game Wiki while Development mode is enabled. Normal play keeps the gameplay guides. Turn Development mode on or off in Settings, Advanced, Development & Backups. Show Hidden Content alone does not enable this area.

## Economy Tuning

The target is roughly two average research purchases per five minutes of representative active play, across gamemodes. This is a balance target, not a timed allowance or a purchase cap. Waiting, pausing and leaving the game open earn nothing. Better play can earn faster; missed shots earn nothing.

New rewards pay once per productive settled shot: a shot must contact a target or complete its goal. Repeated contacts, larger chains, blooms and wave clears do not stack extra base Points. Difficulty bonuses still add 1–5 Points when earned. Campaign clears retain their progress, medals and mastery without a second currency award. All playable experiment presets use the same action rules for their mode.

Research prices and per-mode action awards are calibrated together. The average means the arithmetic mean of all purchasable power nodes and player upgrades, excluding the free Ripple root. Cheap skills can be bought more often and expensive skills less often. Existing balances, purchases and historical reward receipts remain unchanged; updated prices apply only to future purchases. Older in-progress reward records retain their prior earned amount and use the new action rules for subsequent shots.

The offline benchmark uses actual simulated flights plus a stated five-second aiming allowance per shot. That allowance is only a tuning assumption; the live reward calculation never reads a clock. Solved trial paths and a nearest-target starter build are repeatable reference samples, not measured human play. Include novice, experienced, upgraded and accessibility-oriented play before claiming the target holds for people.

Current action awards are 5 Points in the five continuous-physics modes; 3 in Reaction Puzzle, Cargo Rescue and Outbreak Containment; and 4 in Trick Shots, Melody Trials and Capture Transport Release. The 120 purchasable nodes average 57.08 Points. Power research spans 30–80 Points; player research spans 80–240. Prices shown in Skills are authoritative.

The v3.17.0 reference samples produce about 1.76–2.14 average purchases per five minutes: Free Play 1.89, Waves 1.82, Challenge 1.97, Melody Journey physics 1.91, Score Attack 1.87, Reaction 1.76, Cargo 1.82, Outbreak 1.84, Capture 1.86, Trick Shots 2.14 and Melody Trials 2.14. Reproduce these with `node tool/economy.mjs` in the source checkout. The baseline samples do not prove every upgraded build or Custom configuration is equally efficient.

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

Development mode uses an isolated profile. Currency grants and maximum-research controls are test tools; they are not normal earnings. Copy Diagnostics is available in Settings and startup recovery. Export a backup before replacing progress. Keep confidential credentials and private information out of this area: the in-game visibility switch is not authentication for files on the public static host.
