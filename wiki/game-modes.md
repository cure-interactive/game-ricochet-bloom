# Game Modes to Try

**210 experiment ideas, grounded in the workshop mind map and game research.** Start with [Mind Map and Research Connections](#mind-map-and-research-connections) and [Direct Mind Map Experiments](#direct-mind-map-experiments). Browse the [Experiment Catalogue](#experiment-catalogue), [First Experiments to Compare](#first-experiments-to-compare) and [Experiment Guardrails](#experiment-guardrails). The developer approved all three recommended experiments for v3.0.0. The current hub at Main Menu → Gamemodes → Experiments contains those original trials, three controlled variations and Capture Transport Release, with three layouts each. See [Play the Experiments](experiments.md) for implemented rules and controls. Pressure Survival and Reaction Lab remain proposals. Trial values are starting points, not validated balance.

## Current Baseline

[Score Attack](score-attack.md) adds 5/10/15-shot runs, separate personal bests and explicit score medals. It joins the playable modes in v3.3.0. Melody Journey’s 25 level medals are already published in v3.2.0.

The shipped game already has drag-and-release launches, drifting circular bodies, wall banks, contact powers, generated music, persistence, Melody Journey, Free Play and [Endless Waves](waves.md). Waves already pops contacted bubbles and gives five plucks to clear each wave. It is an existing comparison mode, not a new proposal.

The trials now include interior walls, cargo delivery, outbreak sources and bounded infected motes. General elemental payloads, player health and the broader enemy roster still require new work. Existing powers named Bubble, Split, Drunk or Tether are not evidence that the workshop's general trapping, payload division, gas exposure or anchored-object systems exist.

The workshop began as a broad collection of interactions. The three selected trials now each have a complete objective, failure state, restart and isolated board save. Their common Points rewards use the existing profile wallet. Playtesting will determine what deserves further development.

## Mind Map and Research Connections

The [Development Concept mind map](development-concept.md#mind-map) is the design authority for this expansion. Its central loop is manipulating interacting objects, planning a consequence and adapting to the changed pool. The catalogue now has **210 ideas**: the broad 001–150 collection plus **60 direct workshop experiments, 151–210**. Read the direct experiments first when choosing the game's next direction. Stable numbers preserve the earlier catalogue; they do not rank priority.

Use the mind map's independent dimensions when designing a board: **contents × movement constraint × trigger × result**, followed by an objective and one primary loss pressure. For example, tethered acid released by a fragment could free a captive; the same acid used carelessly could destroy its receiver. This is a game-design hypothesis, not real chemistry.

The following source connections distinguish observed mechanics from our proposed adaptations. Primary descriptions were rechecked on November 13, 2026; this is source research, not hands-on testing.

- **Capture, transport and deliberate release:** [Bubble Bobble 4 Friends](https://www.nintendo.com/en-gb/Games/Nintendo-Switch-games/Bubble-Bobble-4-Friends-The-Baron-is-Back--1679668.html) describes trapping opponents, bubble traversal and air currents. Our extension is reversible containment with useful or hazardous contents: **151–160**, **023**, **038** and **052**. It does not establish our top-down capture controls.
- **Connectivity and supply:** [Puzzle Bobble Everybubble](https://www.taito.co.jp/en/PBEverybubble/gamemodes) describes matching groups, continuing supply and dropping groups. Our physical extensions are support release, split population control and source management: **168**, **181–190**, **191–200**. The reference does not require replacing the pool with a match-three grid.
- **Readable hazard families and separate pressures:** [Pang Adventures](https://www.nintendo.com/us/store/products/pang-adventures-switch/) lists distinct ball effects and Tour, Score Attack and Panic formats. This motivates comparing finite puzzles with endurance using the same readable hazards: **041**, **050**, **061**, **171–180**. Split and merge rules originate in our workshop, not an assumed Pang rule.
- **Preserve rather than pop:** [Bubble Ghost Remake](https://www.nintendo.com/us/store/products/bubble-ghost-remake-switch/) describes guiding and protecting a fragile bubble. Our extensions put valuable contents inside fragile containers: **021–030**, **151**, **157**, **160**, **201**. They retain our proposed launch-based control rather than copying its ghost movement.
- **Growth with a cost:** [Osmos](https://www.osmos-game.hemispheregames.com/) describes absorption and propulsion that ejects mass. Our extensions make size, access and payload distribution competing needs: **101–103**, **161–170**, **206**. Nutrient triage is a separate workshop hypothesis, not an Osmos mechanic claim.
- **Material that changes the route:** [FOAMSTARS](https://press.na.square-enix.com/FOAMSTARS) describes foam supporting movement, terrain building and defense. Our smaller-scale extensions are useful residue, mud routing and temporary cover: **031**, **057**, **109**, **175**, **190**, **198**, **207**. No 3D shooter or networking system is implied.
- **Consistent material interactions:** [Noita](https://noitagame.com/) describes burning, melting, freezing, evaporation and environmental manipulation. Our object-level extensions combine payload release, constraints and interruption: **011–020**, **171–180**, **191–200**. Pixel simulation is unnecessary for testing those rules.

**Fiction and priorities:** cellular names translate the same gameplay into membranes, nutrients, infected producers and tissue chambers; they make no biological claim. Music remains feedback and atmosphere. The music-led **081–090** group is an optional comparison, not the central direction. Multiplayer **121–140** remains later work. No-loss **090**, **141–147** and **150** are creative or diagnostic tools; they do not satisfy the mind map's requirement for an eventual game with a clear loss condition.


## Experiment Catalogue

The original broad collection contains **150 candidate experiments**, grouped by the decisions they ask players to make. These are original design hypotheses, not blanket production commitments. The in-game Development Catalogue reports which entries are playable. Existing modes include Melody Journey, Free Play, Endless Waves, Challenge, Score Attack and the original three trials.

Some entries are full mode concepts; others are ruleset variants or session formats. Try variants as options before giving each a permanent menu card. Pressure Survival and Reaction Lab retain detailed briefs below. Score Attack (#061) now links to the existing 5/10/15-shot mode.

**Scope key:** **Rule** changes goals, scoring, constraints or encounter scripting around current mechanics; **System** needs a new persistent interaction or simulation rule; **Platform** needs substantial editor, replay, sharing or multiplayer infrastructure. These are dependencies, not time estimates. Most ideas still need implementation. The hub currently includes Reaction Budget (#013), Hazardous Shipment (#030), Source Priority (#032) and Capture Transport Release (#151), each with isolated setups and checks. Turn-based experiments freeze while aiming unless explicitly described as real time. Competition and co-op can begin locally; online play is not assumed.

### Precision and Shot Planning

#### Experiment 001

- **001. One-Shot Clear — Rule:** Clear every marked target in one launch; restart the same board after a miss.
#### Experiment 002

- **002. Bank Shot Only — Rule:** Clear a quota in six shots; contacts count only after a wall bank.
#### Experiment 003

- **003. Called Shot — Rule:** Nominate the first target before launching; complete five correct calls within seven shots.
#### Experiment 004

- **004. Exact Chain — Rule:** Finish with exactly the requested number of distinct contacts; exceeding it fails the puzzle.
#### Experiment 005

- **005. Last Bubble Standing — Rule:** Clear everything except a designated keeper; touching the keeper loses the board.
#### Experiment 006

- **006. Power Order — Rule:** Collect three powers in the displayed order during one flight; wrong-order contact fails the attempt.
#### Experiment 007

- **007. Corner Tour — System:** Pass through all four corner gates in one shot, then settle inside the finish zone.
#### Experiment 008

- **008. Ricochet Golf — System:** Reach a cup across successive obstacle pools using the fewest total launches.
#### Experiment 009

- **009. Landing Zone — System:** Touch the required targets, then finish at rest inside a marked region; overshooting does not count.
#### Experiment 010

- **010. Narrow Escape — System:** Traverse gates without touching forbidden walls; each completed chamber advances the course.

### Reactions and Logic

#### Experiment 011

- **011. Fuse Route — System:** Ignite a fuse network so its final blast reaches the goal without burning protected branches.
#### Experiment 012

- **012. Controlled Demolition — Rule:** Destroy every barrier within a shot budget while keeping all cargo intact.
#### Experiment 013

- **013. Reaction Budget — System:** Clear a hazard quota while allowing no more than three explosions across the entire board.
#### Experiment 014

- **014. Color Cascade — System:** Trigger matching groups; clear every color without stranding an unmatched target.
#### Experiment 015

- **015. Polarity Puzzle — System:** Flip attraction and repulsion signs to move charged bodies onto matching sockets within six turns.
#### Experiment 016

- **016. Switch Circuit — System:** Hit switches to route a visible signal, open an exit and reach it before shots run out.
#### Experiment 017

- **017. Catalyst Courier — System:** Move a reusable catalyst between inert clusters and activate them all without losing it.
#### Experiment 018

- **018. Delayed Reaction — System:** Schedule blasts for the next turn; clear hazards while moving vulnerable bodies out of danger.
#### Experiment 019

- **019. Chain Limit — System:** Clear hazards with each reaction capped at three propagated events; larger chains fail the board.
#### Experiment 020

- **020. Counterreaction — System:** Intercept a visible impending reaction with a neutralizing effect before its turn countdown expires.

### Cargo and Rescue

#### Experiment 021

- **021. Cargo Sorting — System:** Deliver each cargo type to its matching receiver within a shot budget and mistake allowance.
#### Experiment 022

- **022. Convoy Escort — System:** Escort a moving group across the pool while keeping a minimum number intact for the journey.
#### Experiment 023

- **023. Towline Rescue — System:** Attach a persistent towline to cargo and guide it home without breaking the line.
#### Experiment 024

- **024. Evacuation Order — System:** Rescue numbered cargo in order before a turn-based hazard front reaches it.
#### Experiment 025

- **025. Heavy Freight — System:** Move one massive object through narrow channels and dock it before exhausting the launch budget.
#### Experiment 026

- **026. Cargo Exchange — System:** Swap two groups between opposite docks without mixing them or exceeding dock capacity.
#### Experiment 027

- **027. Fragile Relay — System:** Transfer a parcel through checkpoints, each restoring a limited handling allowance; deliver before it breaks.
#### Experiment 028

- **028. Salvage Run — System:** Retrieve valuables and extract before fuel runs out; bank only what reaches extraction.
#### Experiment 029

- **029. Rescue the Trapped — System:** Break cages, then deliver freed captives; lose if too few survive to meet the rescue quota.
#### Experiment 030

- **030. Hazardous Shipment — System:** Deliver volatile cargo that ruptures above a visible impact threshold before shots run out.

### Containment and Defense

#### Experiment 031

- **031. Firewall — System:** Reposition barriers to stop a spreading hazard crossing a marked line for ten turns.
#### Experiment 032

- **032. Source Priority — Rule:** Seal vents with different visible output schedules before the protected cell loses all integrity.
#### Experiment 033

- **033. Quarantine Ring — System:** Push infected bodies inside a boundary and keep them there for three consecutive turn endings.
#### Experiment 034

- **034. Cure Delivery — System:** Carry limited neutralizing charges to infected cells before spread reaches a threshold.
#### Experiment 035

- **035. Shield Rotation — System:** Rotate protective plates by impact to block attacks and preserve the core through a finite encounter.
#### Experiment 036

- **036. Leak Patrol — System:** Plug telegraphed leaks before a reservoir empties; survive a finite sequence of breaches.
#### Experiment 037

- **037. Nest Siege — System:** Break nest shields and disable their sources while managing enemies emitted between shots.
#### Experiment 038

- **038. Decoy Defense — System:** Redirect pursuers toward movable decoys and protect the real objective until evacuation completes.
#### Experiment 039

- **039. Territory Cleanse — System:** Clean every contaminated tile and stop surviving sources from recolonizing cleared ground.
#### Experiment 040

- **040. Last Light — Rule:** Protect three separated cells for eight turns when one shot cannot cover every threat.

### Survival and Time Pressure

#### Experiment 041

- **041. Pressure Survival — System:** Survive a finite real-time encounter with limited health and emitting sources; see its detailed brief below.
#### Experiment 042

- **042. Shrinking Pool — System:** Reach successive safe regions as the arena contracts; danger-boundary exposure drains integrity.
#### Experiment 043

- **043. Oxygen Run — System:** Visit refill stations and reach an exit before movement and waiting exhaust the oxygen supply.
#### Experiment 044

- **044. Avalanche — System:** Clear descending rows before their timed advances carry them past the bottom boundary.
#### Experiment 045

- **045. Hot Core — System:** Transfer an overheating charge to coolant targets before its fuse ends; survive several transfers.
#### Experiment 046

- **046. Rising Tide — System:** Reach higher refuge gates before a real-time hazard level overtakes the seed.
#### Experiment 047

- **047. Safe Window — System:** Cross pulsing hazard bands during visible inactive phases and reach the exit with limited lives.
#### Experiment 048

- **048. Pursuit — System:** Collect exit keys while evading a predictable hunter; too many captures end the run.
#### Experiment 049

- **049. Overload Management — System:** Spend shots venting pressure or completing tasks; finish every task before the shared gauge overflows.
#### Experiment 050

- **050. Endurance Checkpoints — Rule:** Clear a finite ladder of harder boards with shared shots and small checkpoint refills.

### Terrain and Navigation

#### Experiment 051

- **051. Mirror Maze — System:** Rotate interior reflectors between shots to route the seed through checkpoints and into an exit.
#### Experiment 052

- **052. Current Engineer — System:** Reorient current emitters to deliver cargo into every receiver using limited adjustments.
#### Experiment 053

- **053. Portal Route — System:** Place limited portal pairs, then complete a checkpoint course with the fewest launches.
#### Experiment 054

- **054. Gravity Wells — System:** Use persistent attractors to bend shots through gates without entering marked capture zones.
#### Experiment 055

- **055. Breakout Chamber — System:** Destroy durable bricks to open an exit, then land there before shots run out.
#### Experiment 056

- **056. Drawn Barrier — Platform:** Draw one wall before each shot; solve target puzzles using a finite total wall-length allowance.
#### Experiment 057

- **057. Erosion — System:** Wear channels through soft terrain and deliver a payload before its supporting terrain collapses.
#### Experiment 058

- **058. Rotating Chamber — System:** Turn the world between shots, changing gravity and currents; deliver cargo through successive orientations.
#### Experiment 059

- **059. Moving Maze — System:** Navigate walls that shift on a visible turn schedule; exit within the launch limit.
#### Experiment 060

- **060. Bridge Builder — System:** Push pieces into sockets to form a safe route, then deliver cargo across it.

### Score and Risk

#### Experiment 061

- **061. Score Attack — Rule:** Maximize score within a fixed shot budget, with the current researched build fixed at the start of each run.
#### Experiment 062

- **062. Combo Cash-Out — System:** Carry a multiplier across shots and choose when to bank; failed chains erase the unbanked pot.
#### Experiment 063

- **063. Bounty Board — Rule:** Choose between visible shot objectives with different rewards; maximize bounty across ten launches.
#### Experiment 064

- **064. Precision Wager — System:** Stake run-only tokens on called banks or chains; finish above a quota without going bankrupt.
#### Experiment 065

- **065. Efficiency Trial — Rule:** Clear a prescribed board while minimizing total launch energy rather than simply counting shots.
#### Experiment 066

- **066. Spare Shot Sprint — Rule:** Clear short boards; remaining shots convert to score instead of carrying into the next board.
#### Experiment 067

- **067. Risk Zones — System:** Earn larger rewards in dangerous regions; return to a home zone to bank a target score.
#### Experiment 068

- **068. Perfect Streak — Rule:** Complete consecutive shot objectives; the first failure ends the run and records the streak.
#### Experiment 069

- **069. Contract Run — Rule:** Choose optional restrictions for larger rewards; a failed contract pays nothing even if the board clears.
#### Experiment 070

- **070. Balanced Score — Rule:** Build separate bank, contact and power totals; the weakest category limits the final score.

### Builds and Power Choices

#### Experiment 071

- **071. Draft Run — System:** Pick one of three temporary powers between boards and complete a short run with the resulting draft.
#### Experiment 072

- **072. Single Power Mastery — Rule:** Complete purpose-built boards with one fixed power, testing its uses rather than ownership.
#### Experiment 073

- **073. Power Pair Trials — Rule:** Solve boards using an assigned pair of powers; finish within par and compare different pairings.
#### Experiment 074

- **074. Sealed Loadout — System:** Receive a seeded power pool, choose a build and clear a gauntlet without further purchases.
#### Experiment 075

- **075. Borrowed Build — Rule:** Clear a sequence with a curated unfamiliar fixed build, learning its strengths through play.
#### Experiment 076

- **076. Power Decay — System:** Each activation weakens that power for the run; finish before the build becomes ineffective.
#### Experiment 077

- **077. Charge Economy — System:** Spend finite power charges across several pools, reserving enough for the final obstacle.
#### Experiment 078

- **078. Curse Bargain — System:** Accept explicit drawbacks for temporary advantages between boards; complete the run with those bargains.
#### Experiment 079

- **079. Evolution Run — System:** Upgrade behaviors actually used in cleared pools and guide the emerging build through a final test.
#### Experiment 080

- **080. Power Auction — System:** Bid run-only currency against a scripted rival for upgrades, then beat its multi-board target score.

### Music and Composition

#### Experiment 081

- **081. Melody Route — System:** Strike pitch-marked targets in a requested order within a shot budget; judge visible contact order.
#### Experiment 082

- **082. Rhythm Gates — System:** Cross gates during visible beat windows; complete the course with calibrated timing and an untimed comparison.
#### Experiment 083

- **083. Call and Response — System:** Watch and hear a phrase, then reproduce its target sequence with limited launches.
#### Experiment 084

- **084. Harmony Builder — System:** Collect compatible note groups to complete a displayed chord progression before shots run out.
#### Experiment 085

- **085. Instrument Rescue — System:** Deliver melody, bass and rhythm cargo to separate stages to complete an arrangement.
#### Experiment 086

- **086. Silence Puzzle — System:** Reach required targets without touching marked sound-triggering bubbles; forbidden contacts fail the attempt.
#### Experiment 087

- **087. Crescendo Run — System:** Raise visible musical intensity through varied chains, then complete the objective with a controlled quiet landing.
#### Experiment 088

- **088. Counterpoint — System:** Alternate two seed voices to complete separate note lines without hitting the wrong role's targets.
#### Experiment 089

- **089. Phrase Repair — System:** Replace displayed missing or incorrect notes by hitting appropriate targets within the shot limit.
#### Experiment 090

- **090. Free Composition — System:** Build a song in a chosen palette without loss conditions; finish by saving the composition.

### Memory and Hidden Information

#### Experiment 091

- **091. Constellation Recall — System:** Preview target markings, hide them, then hit only the remembered targets within a mistake allowance.
#### Experiment 092

- **092. Echo Route — Platform:** Watch a recorded route and reproduce ordered checkpoints; rank completions by path deviation.
#### Experiment 093

- **093. Scout and Strike — System:** Spend limited scouting shots revealing targets, then clear actual hazards before ammunition runs out.
#### Experiment 094

- **094. Hidden Cargo — System:** Reveal destinations on contact and remember them while sorting all cargo with limited mistakes.
#### Experiment 095

- **095. Rule Deduction — System:** Infer a consistent hidden matching rule from feedback, then solve a final board under that rule.
#### Experiment 096

- **096. Moving Target Memory — System:** Memorize numbered moving bubbles, then tag them in order after their numbers disappear.
#### Experiment 097

- **097. Fog Expedition — System:** Reveal passages while traveling; find a key and exit before shared energy runs out.
#### Experiment 098

- **098. Prediction Trial — System:** Predict a supplied shot's reaction outcome before launching; earn a quota of correct predictions.
#### Experiment 099

- **099. Sequence Lock — System:** Discover a switch sequence through bounded feedback and open the lock within limited attempts.
#### Experiment 100

- **100. Limited Sonar — System:** Spend a few pulses revealing obstacles; deliver a payload without exhausting its integrity.

### Growth and Material Systems

#### Experiment 101

- **101. Absorption — System:** Consume smaller bodies to reach a target mass while avoiding bodies large enough to absorb the seed.
#### Experiment 102

- **102. Split and Rejoin — System:** Divide mass through narrow gaps, then reunite enough at the finish to meet a quota.
#### Experiment 103

- **103. Mass Budget — System:** Propel by ejecting mass; reach the destination while retaining the required minimum size.
#### Experiment 104

- **104. Membrane Repair — System:** Deliver patches to every leak before the enclosure's remaining contents fall below a quota.
#### Experiment 105

- **105. Osmotic Balance — System:** Transfer material between chambers until displayed concentrations all fall within target ranges.
#### Experiment 106

- **106. Bubble Packing — System:** Fit deformable bodies inside a container without bursting them or exceeding its boundary.
#### Experiment 107

- **107. Pressure Network — System:** Open valves and move plugs until several chambers simultaneously reach safe pressure ranges.
#### Experiment 108

- **108. Phase Change — System:** Switch objects between invented solid, liquid-like and vapor-like states to deliver a material quota.
#### Experiment 109

- **109. Foam Sculptor — System:** Deposit and remove persistent foam to form a stable route, then pass a delivery test.
#### Experiment 110

- **110. Ecosystem Balance — System:** Keep three fictional populations within visible bounds for ten turns through feeding, separation and source control.

### Journeys and Campaign Formats

#### Experiment 111

- **111. Branching Expedition — System:** Choose risk-and-reward routes through short pools and reach an endpoint with shared resources remaining.
#### Experiment 112

- **112. Boss Anatomy — System:** Disable protective parts in a chosen order, expose a core and defeat it within a finite encounter.
#### Experiment 113

- **113. Heist — System:** Enter a guarded chamber, collect an artifact and extract; raising an alarm changes the return route.
#### Experiment 114

- **114. Bounty Hunt — System:** Track and capture a roaming target across connected pools before the expedition budget expires.
#### Experiment 115

- **115. Courier Circuit — System:** Choose a delivery order across chambers and complete every contract before shared fuel runs out.
#### Experiment 116

- **116. Escape Rooms — System:** Solve linked switches and object puzzles to escape successive rooms using limited hints.
#### Experiment 117

- **117. Expedition Camp — System:** Spend supplies on repairs or take harder routes; finish a finite journey with the choices made.
#### Experiment 118

- **118. Campaign Remix — Rule:** Replay existing layouts with unfamiliar fixed goals and builds under one shared shot allowance.
#### Experiment 119

- **119. Boss Rush — System:** Defeat successive compact bosses with limited recovery; rank completed runs by resources retained.
#### Experiment 120

- **120. Scenario Anthology — Rule:** Complete a curated sequence of reaction, rescue and containment trials, earning a medal for each discipline.

### Competition and Party Play

#### Experiment 121

- **121. Same-Seed Duel — Rule:** Pass one device between players for isolated identical boards and builds; highest score wins.
#### Experiment 122

- **122. Alternate-Shot Duel — System:** Take turns claiming targets on a shared board; most claims when it clears wins.
#### Experiment 123

- **123. Territory Claim — System:** Color regions through contacts and defend against recoloring; most territory after fixed rounds wins.
#### Experiment 124

- **124. Ricochet Goals — System:** Knock a neutral ball into the opponent's goal in alternating turns; first to the goal quota wins.
#### Experiment 125

- **125. King of the Pool — System:** Finish turns inside a contested zone to earn control points; first to the quota wins.
#### Experiment 126

- **126. Bumper Duel — System:** Knock the opposing seed out of a safe arena through alternating launches while keeping yours inside.
#### Experiment 127

- **127. Trick-Shot HORSE — Platform:** Record a checkpoint-based trick shot for another player to reproduce; failed reproductions add penalties.
#### Experiment 128

- **128. Ghost Race — Platform:** Race an asynchronous recorded run on a fixed course without physical interference; quickest completion wins.
#### Experiment 129

- **129. Daily Seed Challenge — Platform:** Give everyone the same versioned board and build with comparable results and explicit retry rules.
#### Experiment 130

- **130. Party Rotation — System:** Cycle players through short precision, rescue and reaction rounds for one overall session score.

### Cooperation

#### Experiment 131

- **131. Shared Plucks — System:** Alternate one seed with shared shots; clear a board that rewards discussing each next launch.
#### Experiment 132

- **132. Dual Seed Rescue — System:** Control two seeds in turns, using one to position cargo and the other to finish deliveries.
#### Experiment 133

- **133. Asymmetric Tools — System:** Give each player different fixed powers; solve a board requiring both within shared turns.
#### Experiment 134

- **134. Pilot and Engineer — System:** One player launches while another configures limited gates between shots; deliver all cargo together.
#### Experiment 135

- **135. Linked Partners — System:** Keep two player seeds joined by a persistent rope while reaching separate exits without breaking it.
#### Experiment 136

- **136. Two-Front Defense — System:** Defend two cells using alternating seeds and shared supplies; both must survive the encounter.
#### Experiment 137

- **137. Rescue Relay — System:** Hand fragile cargo between player-controlled zones and deliver the quota across the whole chain.
#### Experiment 138

- **138. Simultaneous Plan — System:** Choose launches secretly, then resolve both together; complete a shared objective without harmful collisions.
#### Experiment 139

- **139. Shared Song — System:** Assign players melody and rhythm tasks; complete both visible parts to finish a composition challenge.
#### Experiment 140

- **140. Cooperative Gauntlet — System:** Alternate the lead across specialist boards, sharing limited retries until the final clear.

### Sandboxes and Gentle Play

#### Experiment 141

- **141. Reaction Lab — System:** Inspect bounded interactions with stepping, a causal log and reset; deliberately omit score and loss states.
#### Experiment 142

- **142. Puzzle Workshop — Platform:** Author and share bounded goal-based layouts; require a recorded valid solution before publishing a challenge.
#### Experiment 143

- **143. Current Garden — System:** Arrange currents and obstacles to maintain a chosen circulation pattern, then save the garden.
#### Experiment 144

- **144. Zen Clearing — Rule:** Complete a finite pleasant arrangement at any pace with unlimited shots, then choose a fresh board.
#### Experiment 145

- **145. Constellation Painting — System:** Trace target points to complete a picture without a timer or punitive restart.
#### Experiment 146

- **146. Restoration Pool — System:** Clean a damaged environment through contact and delivery tasks until every visible region is restored.
#### Experiment 147

- **147. Chain Gallery — Platform:** Save successful reactions as replays and inspect causal steps while comparing solutions to the same board.
#### Experiment 148

- **148. Skill Clinic — System:** Practice a technique on adaptive drills with feedback; graduate after a repeatable accuracy target.
#### Experiment 149

- **149. Accessibility Trials — Rule:** Try equivalent untimed objectives using drag, sliders or keyboard; compare comfort and completion on identical rules.
#### Experiment 150

- **150. Rule Mixer — Platform:** Combine compatible goals, powers and modifiers; flag incompatible combinations and save a bounded custom recipe.

## Direct Mind Map Experiments

All sixty additions below were scoped as **System** work. Capture Transport Release (#151) now has a bounded playable prototype; the remaining direct additions remain proposed. Each combines explicit workshop mechanics with a clear success condition and primary loss pressure. Unless marked otherwise, use limited shots with frozen aiming; resolve the objective after reactions settle. Counts and budgets are test parameters, not settled balance. Entries may share mechanics, but differ in the decision or objective being tested.

### Capture, Carry and Release

Mind-map roots: [Trap, Pop, Transport and Release](development-concept.md#bubble-actions), [Enemies](development-concept.md#enemies). Research connections: Bubble Bobble's containment and Bubble Ghost's protection.

#### Experiment 151

- **151. Capture Transport Release — System:** Enclose a hazard, move it behind a wall and release it onto marked targets; clear them before shots run out.
#### Experiment 152

- **152. Prison Break — System:** Capture guards instead of killing them and move their containers away; escort all prisoners out within the launch budget.
#### Experiment 153

- **153. Gas Harvest — System:** Capture finite gas clouds and deliver their contents to collectors; meet the quota before a shot limit.
#### Experiment 154

- **154. Enemy Ammunition — System:** Trap a hostile spitter and transport it so its released projectiles open a barricade; reach the exit within eight turns.
#### Experiment 155

- **155. Living Key — System:** Carry a captured creature to a gate, then release it to activate the mechanism; escape before it wanders away for good.
#### Experiment 156

- **156. Catch the Fragments — System:** Place empty capture bubbles to intercept shrapnel and deliver the collected fragments within six shots.
#### Experiment 157

- **157. Nursery Transfer — System:** Move captured young organisms through predators, releasing them only inside a refuge; lose if too few survive.
#### Experiment 158

- **158. Temporary Prison — System:** Trap enemies in membranes that expire after a visible number of turns; clear an escape route before recapture becomes impossible.
#### Experiment 159

- **159. Containment Exchange — System:** Transfer contents between containers with different resistances; deliver the payload before the shared shot budget ends.
#### Experiment 160

- **160. Double Shell — System:** Pop an outer protective layer to fit a passage, preserve the inner cargo and reach its receiver within par.

### Division, Fusion and Payload Accounting

Mind-map roots: [Split and Merge](development-concept.md#bubble-actions), [finite contents and split budgets](development-concept.md#chain-reactions). Research connection: Osmos's size tradeoffs; exact fusion rules remain ours.

#### Experiment 161

- **161. Split-Gap Delivery — System:** Divide one payload to pass separate narrow channels, then deliver every portion within the shot limit.
#### Experiment 162

- **162. Weighted Sockets — System:** Split and merge masses until each receiver contains its exact required amount; solve within a fixed action budget.
#### Experiment 163

- **163. Merge Ram — System:** Fuse small bodies into a heavy ram, break a barrier and deliver the surviving mass before shots run out.
#### Experiment 164

- **164. Volatile Fusion — System:** Merge compatible payloads only at marked demolition sites; destroy every site without rupturing protected cargo.
#### Experiment 165

- **165. Divide the Threat — System:** Split a large hostile into smaller capturable bodies; contain all of them before the turn limit.
#### Experiment 166

- **166. Assembly Line — System:** Route incoming ingredients into prescribed merged products; complete an order before the finite supply is exhausted.
#### Experiment 167

- **167. Unequal Division — System:** Choose split proportions to send enough force down one route while preserving valuable mass on another; satisfy both goals within par.
#### Experiment 168

- **168. Population Ceiling — System:** Clear a quota through splitting and capture while keeping active body count below a visible maximum.
#### Experiment 169

- **169. Merge Chain Brake — System:** Fuse reactive bodies into an inert absorber to interrupt an approaching chain; protect the objective through the encounter.
#### Experiment 170

- **170. Cargo Dilution — System:** Merge hazardous contents with a finite neutral carrier until each shipment meets a displayed safe ratio, then deliver within the shot limit.

### Elements, Status and Chain Interruption

Mind-map roots: [Elements and Status Effects](development-concept.md#elements-and-status-effects), [Chain Reactions](development-concept.md#chain-reactions). Research connections: Noita's consistent interactions and Pang's readable hazard families.

#### Experiment 171

- **171. Shrapnel Relay — System:** Aim finite fragment bursts through successive carriers to reach a shielded target; complete the chain within the shot limit.
#### Experiment 172

- **172. Acid Key — System:** Release acid onto compatible locks while protecting non-resistant cargo; open and traverse the exit before shots run out.
#### Experiment 173

- **173. Steam Junction — System:** Merge specified steam-bearing payloads at a junction to push gates into alignment; reach the exit within par.
#### Experiment 174

- **174. Gas Corridor — System:** Capture or displace a cloud to open a safe passage; escort cargo through before its integrity is lost.
#### Experiment 175

- **175. Mud Dam — System:** Combine earth and water at a chosen bottleneck to redirect a current into cargo receivers within limited shots.
#### Experiment 176

- **176. Firebreak Sculptor — System:** Rearrange inert bodies and gaps to stop a gas ignition chain reaching a protected cell; survive one triggered cascade.
#### Experiment 177

- **177. Reagent Recovery — System:** Recover useful material after a reaction and reuse it on a second obstacle; complete both with a finite initial payload supply.
#### Experiment 178

- **178. Status Transfer — System:** Trap a slowing cloud and release it around enemies instead of the player; escort a convoy before enemies destroy its quota.
#### Experiment 179

- **179. Fragment Collector — System:** Break containers whose fragments become temporary tools, then use those tools to clear designated obstacles before shots expire.
#### Experiment 180

- **180. Reaction Interception — System:** Redirect a moving blast carrier, absorb its contents or place cover before its visible fuse ends; save every protected cell.

### Sources as Resources

Mind-map roots: [Bubble Sources](development-concept.md#bubble-sources), [Enemies](development-concept.md#enemies). Research connection: Puzzle Bobble's changing supply; feed, redirect and conversion rules are our extensions.

#### Experiment 181

- **181. Keep One Vent Open — System:** Harvest a dangerous source to obtain needed material, then seal it and complete a delivery before the turn limit.
#### Experiment 182

- **182. Feed the Producer — System:** Deliver different food payloads to control a source's next output; manufacture the required set within limited turns.
#### Experiment 183

- **183. Source Hijack — System:** Turn hostile outputs toward enemy barriers; reach the exit without destroying the source you need, within par.
#### Experiment 184

- **184. Source Timing — System:** Activate sources in a physical production schedule so their outputs meet and react at one location; complete a target chain within turns.
#### Experiment 185

- **185. Geyser Elevator — System:** Trigger an impact-driven jet to lift or carry cargo across a blocked route; deliver before the shot budget ends.
#### Experiment 186

- **186. Producer Protection — System:** Keep a useful producer alive until it supplies a quota while diverting harmful emissions from nearby sources.
#### Experiment 187

- **187. Supply Cut — System:** Starve an enemy nest by intercepting its incoming nutrients; disable every nest before the protected cell loses its health.
#### Experiment 188

- **188. Contaminated Factory — System:** Remove an infection from a producer so it emits useful contents again; restore the required outputs within eight turns.
#### Experiment 189

- **189. Portable Source — System:** Reposition one generator to serve several separated receivers; fill them all using its finite stock.
#### Experiment 190

- **190. Plug and Unplug — System:** Seal a source with mud, reopen it with a blast and time successive releases to complete a routing puzzle within par.

### Anchors, Connections and Changing Routes

Mind-map roots: [Independent Properties](development-concept.md#independent-properties), [Environment and Layout](development-concept.md#environment-and-layout). Research connections: Puzzle Bobble's connectivity, FOAMSTARS's lasting terrain and Noita's environmental effects.

#### Experiment 191

- **191. Anchor Release — System:** Dissolve selected tethers so a captive cluster drifts into a receiver; deliver its quota without exhausting shots.
#### Experiment 192

- **192. Support Collapse — System:** Remove a support to release many targets at once; catch required cargo while letting hazards fall into disposal zones.
#### Experiment 193

- **193. Pendulum Payload — System:** Time impacts on tethered explosive bubbles so they detonate beside barriers rather than cargo; clear within the shot limit.
#### Experiment 194

- **194. Track Switchyard — System:** Move rail-constrained bubbles through switchable junctions into matching bays before limited turns expire.
#### Experiment 195

- **195. Break the Right Link — System:** Sever one connection in an attachment chain to isolate a dangerous payload without losing the valuable cluster.
#### Experiment 196

- **196. Reactive Bumpers — System:** Use fixed bumpers that release finite effects on impact; chain their outputs to reach a protected target within par.
#### Experiment 197

- **197. Chamber Transfer — System:** Move incompatible contents through shared airlocks without allowing contact; deliver both quotas within the shot budget.
#### Experiment 198

- **198. Residue Route — System:** Leave mud or foam from earlier reactions to shape the final delivery path; deliver the last cargo within par.
#### Experiment 199

- **199. Wall Permeability — System:** Route fragments, gas and bodies through walls with clearly marked different blocking rules; reach all targets within shots.
#### Experiment 200

- **200. Shortcut Sacrifice — System:** Spend a useful payload to open a shortcut or preserve it for the long route; extract enough total value before fuel runs out.

### Fictional Cellular Missions

Mind-map root: [Cellular Campaign](development-concept.md#cellular-campaign). These are invented game rules translating the same interactions; biology is not evidence for their behavior.

#### Experiment 201

- **201. Nutrient Courier — System:** Deliver nutrient sacs to every starving cell before any cell's visible reserve reaches zero.
#### Experiment 202

- **202. Selective Membranes — System:** Change a carrier's allowed property to pass distinct membranes; deliver each payload without exceeding the turn budget.
#### Experiment 203

- **203. Nutrient Triage — System:** Allocate a finite nutrient stock between repairing tissue and activating tools; restore all required tissue before integrity runs out.
#### Experiment 204

- **204. Infected Producer Rescue — System:** Trap and remove an infection while preserving its host producer; restart useful production within the shot limit.
#### Experiment 205

- **205. Tissue Breach — System:** Move membrane fragments into a breach and fuse them into a seal before a protected chamber empties.
#### Experiment 206

- **206. Division Labor — System:** Divide a worker into smaller bodies for simultaneous switches, then reunite enough mass to escape within turns.
#### Experiment 207

- **207. Waste Clearance — System:** Package harmful residue into resistant sacs and escort it out before the chamber's contamination meter fills.
#### Experiment 208

- **208. Immune Decoys — System:** Mark disposable carriers to draw fictional immune pursuers away from a vulnerable shipment; deliver before its health runs out.
#### Experiment 209

- **209. Symbiotic Passage — System:** Feed a resident organism so it temporarily opens a route, then recover supplies to reach the next chamber within budget.
#### Experiment 210

- **210. Organ Recovery — System:** Solve a finite linked mission of supply, containment and repair using one shared nutrient reserve; restore every chamber before it is depleted.


## First Experiments to Compare

**Before:** the first broad shortlist favored small changes to the shipped game. The developer's mind map instead centers capture, contents, split/merge tradeoffs, reactions, sources and changing routes. The existing three trials remain useful comparison baselines with open human playtest gates.

**After, if selected:** use the following shortlist to test that direction, adding one core interaction at a time. Keep music supportive, retain launch controls initially and choose one primary loss pressure. These are recommendations, not implementation approval.

- **151 Capture Transport Release:** one container, one hazardous payload and two useful release positions; test whether preserving a hazard creates deliberate choices. Compare with Cargo Rescue.
- **191 Anchor Release:** three tethered clusters and a finite acid payload; test selecting which support to release rather than popping everything. Compare with Reaction Puzzle.
- **175 Mud Dam:** one earth/water pairing and one current; test whether players deliberately reshape a delivery route. Compare with Cargo Rescue.
- **181 Keep One Vent Open:** one capped source that supplies a required material; test the choice between harvesting and sealing. Compare with Outbreak Containment.
- **163 Merge Ram:** one merge rule, a barrier and a narrow alternative; test whether bigger is useful without being universally better.
- **161 Split-Gap Delivery:** one divided payload and two passages; test payload accounting and route planning before adding more split objects.
- **171 Shrapnel Relay:** finite fragments, two carriers and a protected target; test whether players can predict and interrupt a multistep chain.
- **203 Nutrient Triage:** one finite resource shared between repair and a tool; test a meaningful cellular decision without stacking health, currency and clocks.
- **109 Foam Sculptor:** one persistent residue behavior and one delivery goal; test whether a previous shot creates a useful next-shot route.
- **032 Source Priority:** vary the existing vents' visible output schedules; use this smaller comparison to test source decisions before building the richer source modes.

Begin with 151 or 191 if choosing a new central interaction; use 032 as a smaller baseline comparison. Do not implement all ten together. For each selected rule, make three short layouts with two plausible approaches. Record completion, attempts, failure cause, purposeful versus accidental reactions and voluntary retries. Ask players to predict the first links and explain later surprises. Reuse fixed builds and starts, test muted play, and compare against the nearest existing mode. These observations decide which idea grows into a mode; novelty and effect count alone do not.

## Experiment Guardrails

A mode needs an objective, readable progress and a declared end condition; a sandbox instead needs an intentional creation or inspection goal. Color changes, higher bubble counts and larger rewards alone are modifiers. Several catalogue variants can share one mode selector.

Keep board saves and records isolated. Fixed-build experiments must not inherit permanent research silently. Initially avoid progression rewards for unvalidated rulesets, editors and replay tools; decide rewards after repeatability and duplicate-safe accounting are proven. This does not change existing trial rewards.

Declare whether sources and clocks advance per turn or in real time. Bound spawning and reaction propagation, show impending damage, and preserve pause and hidden-tab behavior. Musical objectives need visual targets or beat information. Competition requires identical seeds, rules versions and builds; online play additionally needs synchronization, disconnect rules and trustworthy results.

Before expanding a prototype, test whether the player can state the goal, predict a useful consequence and deliberately repeat a successful action. Revise ideas dependent on unreadable luck, helpless coasting, tedious recovery or a dominant automatic solution. These hypotheses do not replace physical-device or human playtesting.


## Recommended Order

This was the original three-trial sequence, now implemented. For candidates from the expanded catalogue, use [First Experiments to Compare](#first-experiments-to-compare).

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

**Implemented boundary:** interior-wall collisions, finite blast chains and cover, protected cells, settlement-based objectives, separate saved continuation and restart. The wider elemental workshop remains future work.

**Evidence to collect:** can a player predict the first reaction, explain a failure and deliberately reproduce a useful chain? Record shots used, restart count, distinct solutions and unintended chains. Treat unexplained wins as evidence of weak readability rather than automatically good emergence.

**First success gate:** players demonstrate two deliberate solutions on at least one mixed board and understand why a damaging chain failed. If one obvious explosion solves every board, add a meaningful positioning choice before adding more elements.

## Cargo Rescue

**Question:** does preserving and positioning a bubble create a satisfying alternative to popping it?

**Control and loop:** retain launches of the player body. Bump fragile cargo sacs toward a receiver, reposition through banks, use a limited environmental tool to open a route, and deliver cargo intact. Ordinary contact pushes cargo instead of popping it; sharp hazards and configured blast damage can rupture it. This difference must be clearly marked.

**Objective:** deliver at least two of three cargo sacs within eight shots. Delivered cargo is removed safely from the pool. Lose when fewer intact or delivered sacs remain than the quota requires, or when the final shot settles below the delivery quota. There is no player-health system or countdown in the first trial.

**Smallest trial:** three layouts with one receiver, cargo, walls, a single visible current and one breakable barrier. Use one already-tested blast rule for the barrier; do not add enemies, elemental mixtures, payload inventory or a second control scheme yet.

**Decision example:** send a sac through a narrow safe channel, or open a shorter path with a blast that could damage it. A current can carry the sac while the player handles another obstruction.

**Implemented boundary:** cargo pushing, receiver detection, rupture and quota accounting, a visible current, walls and blast-breakable barriers, separate saved continuation and restart.

**Evidence to collect:** unintended cargo pops, ability to explain current direction, recovery from a bad push, and whether careful transport feels rewarding or tedious. Test phone aiming and muted audio. Compare the same layout with and without the current to isolate its contribution.

**First success gate:** players can intentionally deliver cargo through two routes and recover from at least one imperfect push. If cargo drifts indefinitely or gets irretrievably wedged, revise geometry and settling before expanding the system.

## Outbreak Containment

**Question:** do sources, hostile movement and environmental manipulation produce useful emergent choices in a fictional cellular setting?

**Control and loop:** use discrete launches. Inspect source output and enemy intent, trigger a reaction or seal a source, let the shot settle, then advance one outbreak turn. Sources and hostile decisions advance only at that boundary, so waiting while aiming is not penalized.

**Objective:** seal two marked infected vents and remove the remaining infected motes within eight turns while keeping a central healthy cell alive. The protected cell begins with three integrity points. Player health is not needed for this version. Lose when the cell reaches zero or the eighth turn ends with the objective incomplete.

**Smallest trial:** one chamber, two vents, one predictable pursuer behavior, the protected cell, a mud effect and one tested blast effect. Each open vent emits one visible queued mote per turn, up to six active motes total; when capped, production visibly pauses. Each mote moves a bounded distance toward the cell at the turn boundary. A contacting mote deals one damage and is consumed, avoiding repeated hidden damage ticks.

**Implemented sealing rule:** pushing a compatible plug onto a vent seals it. Mud slows motes; blasts push plugs and clear nearby motes. These are invented game rules. The player can solve the situation through positioning without a biological explanation or a large combat system.

**Decision example:** seal the nearest vent immediately, or use one more emitted mote to start a reaction that clears the far side. The protected cell creates a reason not to trigger every possible explosion.

**Implemented boundary:** turn-boundary spawning and pursuit, vents and plugs, cell integrity, one mud area, a visible next-turn explanation and capped-source labels, objective ordering and exact saved continuation. More detailed trajectory previews remain a possible improvement.

**Implemented resolution order:** finish the player's reaction, apply existing damage, stop on cell loss, recognize a completed containment objective, then advance surviving sources/enemies if a turn remains. Display the step that caused failure. A last-turn clear counts; no extra outbreak phase follows a completed objective.

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

For playable trials, use the same available powers for every tester. Existing permanent research must not quietly change the experiment. Keep board saves and records separate from Campaign, Free Play and Waves; restart only the selected trial. The implemented trials pay into the common Points wallet using duplicate-safe receipts. Their fixed tools do not train permanent power mastery or consume existing progression.

Start with three short layouts per recommended mode and an identical seed on retries. In shot-based trials, pause idle drift while aiming for reproducible comparisons; show the board state before release. This is implemented in the trials and differs from the original freely drifting modes. Repeat tests later with live drift to assess whether timing adds useful skill.

Ask players to explain the goal before launching, predict one interaction, try a solution, explain the result and retry. Log completion, attempts, shots or time, failure cause, intended versus accidental reactions, and unexpected solutions. A small exploratory group can expose problems; it cannot establish broad audience preference.

Run one muted session and one with generated music. Music may improve feel, but the objective and causes of success must remain understandable without it. Compare with the existing Waves baseline using similar session lengths. Choose the next prototype based on deliberate replay interest, readable consequences and meaningful choices, not just effect count.

## Scope and Implementation Decision

The original recommendation was to implement Reaction Puzzle first. The developer instead approved all three, and each is now available for comparison. Pressure Survival and mass-based growth remain reserves. A full cellular campaign should follow evidence from the trials rather than precede it.

The organized hub adds family navigation, a searchable catalogue, versioned setups, independent records and local feedback. The original nine layouts, nine rule-variation layouts and three Capture Transport Release layouts have successful simulation solutions, with checks for objective ordering, saved continuation, malformed saves and notebook isolation. See [Play the Experiments](experiments.md) for current controls and limits. These establish mechanical completion, not player enjoyment or physical-device acceptance.

Research connects the proposals to different player motives: Puzzle Bobble's grouping and supply, Bubble Bobble's containment, Bubble Ghost's protection, Osmos's resource tradeoff, FOAMSTARS's lasting terrain and Noita's systemic reactions. See the [verified source notes](development-concept.md#research-and-sources); these are design inspirations, not evidence that our modes are already fun.

The next decision is which loop deserves refinement after playtesting. v3.0.0 is the approved first three-mode build. Permanent campaign expansion, multiplayer and Pressure Survival remain outside this implementation.

## Attribution

### Sources

The developer's workshop and request for experimental modes; [Development Concept research](development-concept.md#research-and-sources); the current [Waves guide](waves.md), [Melody Journey guide](campaign.md) and [How to Play](how-to-play.md).

### Contributions

#### Codex on behalf of `leviscustempris`

Proposed bounded mode experiments, distinguished prerequisites from existing behavior, and defined playtest questions and starting rules. Updated the brief to distinguish the approved playable implementation from reserve ideas. Balance and human playtest gates remain open. Expanded the workshop with 150 grouped concepts, relative implementation dependencies, a ten-experiment comparison shortlist and explicit proposal boundaries. Added 60 direct mind-map experiments, traced their mechanics to the workshop and primary research, and revised priorities around systemic gameplay. Rechecked the seven linked primary game descriptions on November 13, 2026; proposed combinations remain our extrapolations.
