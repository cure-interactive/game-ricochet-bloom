// Canonical idea catalogue. tool/experiment.mjs refreshes the wiki entries.
export const EXPERIMENT_FAMILIES={
  "precision": "Precision",
  "reaction": "Reactions",
  "transport": "Transport and Rescue",
  "containment": "Containment",
  "survival": "Survival",
  "environment": "Environment",
  "strategy": "Strategy",
  "music": "Music",
  "discovery": "Discovery",
  "growth": "Growth",
  "journey": "Journeys",
  "social": "Social Play",
  "workshop": "Workshop"
};
export const EXPERIMENT_CATALOGUE=[
  {
    "id": "001",
    "name": "One-Pluck Clear",
    "scope": "Rule",
    "description": "Clear every marked target in one launch; restart the same board after a miss.",
    "family": "precision",
    "kind": "variation",
    "mechanics": [
      "target"
    ]
  },
  {
    "id": "002",
    "name": "Bank Shot Only",
    "scope": "Rule",
    "description": "Clear a quota in six shots; contacts count only after a wall bank.",
    "family": "precision",
    "kind": "modifier",
    "mechanics": [
      "shot",
      "wall"
    ]
  },
  {
    "id": "003",
    "name": "Called Shot",
    "scope": "Rule",
    "description": "Nominate the first target before launching; complete five correct calls within seven shots.",
    "family": "precision",
    "kind": "variation",
    "mechanics": [
      "shot",
      "target"
    ]
  },
  {
    "id": "004",
    "name": "Exact Chain",
    "scope": "Rule",
    "description": "Finish with exactly the requested number of distinct contacts; exceeding it fails the puzzle.",
    "family": "precision",
    "kind": "modifier",
    "mechanics": []
  },
  {
    "id": "005",
    "name": "Last Bubble Standing",
    "scope": "Rule",
    "description": "Clear everything except a designated keeper; touching the keeper loses the board.",
    "family": "precision",
    "kind": "variation",
    "mechanics": []
  },
  {
    "id": "006",
    "name": "Power Order",
    "scope": "Rule",
    "description": "Collect three powers in the displayed order during one flight; wrong-order contact fails the attempt.",
    "family": "precision",
    "kind": "modifier",
    "mechanics": []
  },
  {
    "id": "007",
    "name": "Corner Tour",
    "scope": "System",
    "description": "Pass through all four corner gates in one pluck, then settle inside the finish zone.",
    "family": "precision",
    "kind": "core-mode",
    "mechanics": []
  },
  {
    "id": "008",
    "name": "Ricochet Golf",
    "scope": "System",
    "description": "Reach a cup across successive obstacle pools using the fewest total launches.",
    "family": "precision",
    "kind": "core-mode",
    "mechanics": []
  },
  {
    "id": "009",
    "name": "Landing Zone",
    "scope": "System",
    "description": "Touch the required targets, then finish at rest inside a marked region; overshooting does not count.",
    "family": "precision",
    "kind": "core-mode",
    "mechanics": [
      "target"
    ]
  },
  {
    "id": "010",
    "name": "Narrow Escape",
    "scope": "System",
    "description": "Traverse gates without touching forbidden walls; each completed chamber advances the course.",
    "family": "precision",
    "kind": "core-mode",
    "mechanics": [
      "wall"
    ]
  },
  {
    "id": "011",
    "name": "Fuse Route",
    "scope": "System",
    "description": "Ignite a fuse network so its final blast reaches the goal without burning protected branches.",
    "family": "reaction",
    "kind": "core-mode",
    "mechanics": [
      "fuse"
    ]
  },
  {
    "id": "012",
    "name": "Controlled Demolition",
    "scope": "Rule",
    "description": "Destroy every barrier within a shot budget while keeping all cargo intact.",
    "family": "reaction",
    "kind": "variation",
    "mechanics": [
      "cargo",
      "shot"
    ]
  },
  {
    "id": "013",
    "name": "Reaction Budget",
    "scope": "System",
    "description": "Clear a hazard quota while allowing no more than three explosions across the entire board.",
    "family": "reaction",
    "kind": "variation",
    "mechanics": [
      "hazard"
    ]
  },
  {
    "id": "014",
    "name": "Color Cascade",
    "scope": "System",
    "description": "Trigger matching groups; clear every color without stranding an unmatched target.",
    "family": "reaction",
    "kind": "core-mode",
    "mechanics": [
      "target"
    ]
  },
  {
    "id": "015",
    "name": "Polarity Puzzle",
    "scope": "System",
    "description": "Flip attraction and repulsion signs to move charged bodies onto matching sockets within six turns.",
    "family": "reaction",
    "kind": "core-mode",
    "mechanics": [
      "turn"
    ]
  },
  {
    "id": "016",
    "name": "Switch Circuit",
    "scope": "System",
    "description": "Hit switches to route a visible signal, open an exit and reach it before shots run out.",
    "family": "reaction",
    "kind": "core-mode",
    "mechanics": [
      "shot"
    ]
  },
  {
    "id": "017",
    "name": "Catalyst Courier",
    "scope": "System",
    "description": "Move a reusable catalyst between inert clusters and activate them all without losing it.",
    "family": "reaction",
    "kind": "core-mode",
    "mechanics": []
  },
  {
    "id": "018",
    "name": "Delayed Reaction",
    "scope": "System",
    "description": "Schedule blasts for the next turn; clear hazards while moving vulnerable bodies out of danger.",
    "family": "reaction",
    "kind": "core-mode",
    "mechanics": [
      "hazard",
      "turn"
    ]
  },
  {
    "id": "019",
    "name": "Chain Limit",
    "scope": "System",
    "description": "Clear hazards with each reaction capped at three propagated events; larger chains fail the board.",
    "family": "reaction",
    "kind": "core-mode",
    "mechanics": [
      "chain",
      "hazard"
    ]
  },
  {
    "id": "020",
    "name": "Counterreaction",
    "scope": "System",
    "description": "Intercept a visible impending reaction with a neutralizing effect before its turn countdown expires.",
    "family": "reaction",
    "kind": "core-mode",
    "mechanics": [
      "turn"
    ]
  },
  {
    "id": "021",
    "name": "Cargo Sorting",
    "scope": "System",
    "description": "Deliver each cargo type to its matching receiver within a shot budget and mistake allowance.",
    "family": "transport",
    "kind": "core-mode",
    "mechanics": [
      "cargo",
      "shot"
    ]
  },
  {
    "id": "022",
    "name": "Convoy Escort",
    "scope": "System",
    "description": "Escort a moving group across the pool while keeping a minimum number intact for the journey.",
    "family": "transport",
    "kind": "core-mode",
    "mechanics": []
  },
  {
    "id": "023",
    "name": "Towline Rescue",
    "scope": "System",
    "description": "Attach a persistent towline to cargo and guide it home without breaking the line.",
    "family": "transport",
    "kind": "core-mode",
    "mechanics": [
      "cargo"
    ]
  },
  {
    "id": "024",
    "name": "Evacuation Order",
    "scope": "System",
    "description": "Rescue numbered cargo in order before a turn-based hazard front reaches it.",
    "family": "transport",
    "kind": "core-mode",
    "mechanics": [
      "cargo",
      "hazard",
      "turn"
    ]
  },
  {
    "id": "025",
    "name": "Heavy Freight",
    "scope": "System",
    "description": "Move one massive object through narrow channels and dock it before exhausting the launch budget.",
    "family": "transport",
    "kind": "core-mode",
    "mechanics": []
  },
  {
    "id": "026",
    "name": "Cargo Exchange",
    "scope": "System",
    "description": "Swap two groups between opposite docks without mixing them or exceeding dock capacity.",
    "family": "transport",
    "kind": "core-mode",
    "mechanics": []
  },
  {
    "id": "027",
    "name": "Fragile Relay",
    "scope": "System",
    "description": "Transfer a parcel through checkpoints, each restoring a limited handling allowance; deliver before it breaks.",
    "family": "transport",
    "kind": "core-mode",
    "mechanics": []
  },
  {
    "id": "028",
    "name": "Salvage Run",
    "scope": "System",
    "description": "Retrieve valuables and extract before fuel runs out; bank only what reaches extraction.",
    "family": "transport",
    "kind": "core-mode",
    "mechanics": []
  },
  {
    "id": "029",
    "name": "Rescue the Trapped",
    "scope": "System",
    "description": "Break cages, then deliver freed captives; lose if too few survive to meet the rescue quota.",
    "family": "transport",
    "kind": "core-mode",
    "mechanics": []
  },
  {
    "id": "030",
    "name": "Hazardous Shipment",
    "scope": "System",
    "description": "Deliver volatile cargo that ruptures above a visible impact threshold before shots run out.",
    "family": "transport",
    "kind": "variation",
    "mechanics": [
      "cargo",
      "shot"
    ]
  },
  {
    "id": "031",
    "name": "Firewall",
    "scope": "System",
    "description": "Reposition barriers to stop a spreading hazard crossing a marked line for ten turns.",
    "family": "containment",
    "kind": "core-mode",
    "mechanics": [
      "hazard",
      "turn"
    ]
  },
  {
    "id": "032",
    "name": "Source Priority",
    "scope": "Rule",
    "description": "Seal vents with different visible output schedules before the protected cell loses all integrity.",
    "family": "containment",
    "kind": "variation",
    "mechanics": [
      "cell",
      "vent"
    ]
  },
  {
    "id": "033",
    "name": "Quarantine Ring",
    "scope": "System",
    "description": "Push infected bodies inside a boundary and keep them there for three consecutive turn endings.",
    "family": "containment",
    "kind": "core-mode",
    "mechanics": [
      "turn"
    ]
  },
  {
    "id": "034",
    "name": "Cure Delivery",
    "scope": "System",
    "description": "Carry limited neutralizing charges to infected cells before spread reaches a threshold.",
    "family": "containment",
    "kind": "core-mode",
    "mechanics": [
      "cell"
    ]
  },
  {
    "id": "035",
    "name": "Shield Rotation",
    "scope": "System",
    "description": "Rotate protective plates by impact to block attacks and preserve the core through a finite encounter.",
    "family": "containment",
    "kind": "core-mode",
    "mechanics": []
  },
  {
    "id": "036",
    "name": "Leak Patrol",
    "scope": "System",
    "description": "Plug telegraphed leaks before a reservoir empties; survive a finite sequence of breaches.",
    "family": "containment",
    "kind": "core-mode",
    "mechanics": []
  },
  {
    "id": "037",
    "name": "Nest Siege",
    "scope": "System",
    "description": "Break nest shields and disable their sources while managing enemies emitted between shots.",
    "family": "containment",
    "kind": "core-mode",
    "mechanics": [
      "shot"
    ]
  },
  {
    "id": "038",
    "name": "Decoy Defense",
    "scope": "System",
    "description": "Redirect pursuers toward movable decoys and protect the real objective until evacuation completes.",
    "family": "containment",
    "kind": "core-mode",
    "mechanics": []
  },
  {
    "id": "039",
    "name": "Territory Cleanse",
    "scope": "System",
    "description": "Clean every contaminated tile and stop surviving sources from recolonizing cleared ground.",
    "family": "containment",
    "kind": "core-mode",
    "mechanics": []
  },
  {
    "id": "040",
    "name": "Last Light",
    "scope": "Rule",
    "description": "Protect three separated cells for eight turns when one shot cannot cover every threat.",
    "family": "containment",
    "kind": "variation",
    "mechanics": [
      "cell",
      "shot",
      "turn"
    ]
  },
  {
    "id": "041",
    "name": "Pressure Survival",
    "scope": "System",
    "description": "Survive a finite real-time encounter with limited health and emitting sources; see its detailed brief below.",
    "family": "survival",
    "kind": "core-mode",
    "mechanics": []
  },
  {
    "id": "042",
    "name": "Shrinking Pool",
    "scope": "System",
    "description": "Reach successive safe regions as the arena contracts; danger-boundary exposure drains integrity.",
    "family": "survival",
    "kind": "core-mode",
    "mechanics": []
  },
  {
    "id": "043",
    "name": "Oxygen Run",
    "scope": "System",
    "description": "Visit refill stations and reach an exit before movement and waiting exhaust the oxygen supply.",
    "family": "survival",
    "kind": "core-mode",
    "mechanics": []
  },
  {
    "id": "044",
    "name": "Avalanche",
    "scope": "System",
    "description": "Clear descending rows before their timed advances carry them past the bottom boundary.",
    "family": "survival",
    "kind": "core-mode",
    "mechanics": []
  },
  {
    "id": "045",
    "name": "Hot Core",
    "scope": "System",
    "description": "Transfer an overheating charge to coolant targets before its fuse ends; survive several transfers.",
    "family": "survival",
    "kind": "core-mode",
    "mechanics": [
      "fuse",
      "target"
    ]
  },
  {
    "id": "046",
    "name": "Rising Tide",
    "scope": "System",
    "description": "Reach higher refuge gates before a real-time hazard level overtakes the seed.",
    "family": "survival",
    "kind": "core-mode",
    "mechanics": [
      "hazard"
    ]
  },
  {
    "id": "047",
    "name": "Safe Window",
    "scope": "System",
    "description": "Cross pulsing hazard bands during visible inactive phases and reach the exit with limited lives.",
    "family": "survival",
    "kind": "core-mode",
    "mechanics": [
      "hazard"
    ]
  },
  {
    "id": "048",
    "name": "Pursuit",
    "scope": "System",
    "description": "Collect exit keys while evading a predictable hunter; too many captures end the run.",
    "family": "survival",
    "kind": "core-mode",
    "mechanics": []
  },
  {
    "id": "049",
    "name": "Overload Management",
    "scope": "System",
    "description": "Spend shots venting pressure or completing tasks; finish every task before the shared gauge overflows.",
    "family": "survival",
    "kind": "core-mode",
    "mechanics": [
      "shot"
    ]
  },
  {
    "id": "050",
    "name": "Endurance Checkpoints",
    "scope": "Rule",
    "description": "Clear a finite ladder of harder boards with shared plucks and small checkpoint refills.",
    "family": "survival",
    "kind": "variation",
    "mechanics": []
  },
  {
    "id": "051",
    "name": "Mirror Maze",
    "scope": "System",
    "description": "Rotate interior reflectors between shots to route the seed through checkpoints and into an exit.",
    "family": "environment",
    "kind": "core-mode",
    "mechanics": [
      "shot"
    ]
  },
  {
    "id": "052",
    "name": "Current Engineer",
    "scope": "System",
    "description": "Reorient current emitters to deliver cargo into every receiver using limited adjustments.",
    "family": "environment",
    "kind": "core-mode",
    "mechanics": [
      "cargo"
    ]
  },
  {
    "id": "053",
    "name": "Portal Route",
    "scope": "System",
    "description": "Place limited portal pairs, then complete a checkpoint course with the fewest launches.",
    "family": "environment",
    "kind": "core-mode",
    "mechanics": []
  },
  {
    "id": "054",
    "name": "Gravity Wells",
    "scope": "System",
    "description": "Use persistent attractors to bend shots through gates without entering marked capture zones.",
    "family": "environment",
    "kind": "core-mode",
    "mechanics": [
      "capture",
      "shot"
    ]
  },
  {
    "id": "055",
    "name": "Breakout Chamber",
    "scope": "System",
    "description": "Destroy durable bricks to open an exit, then land there before shots run out.",
    "family": "environment",
    "kind": "core-mode",
    "mechanics": [
      "shot"
    ]
  },
  {
    "id": "056",
    "name": "Drawn Barrier",
    "scope": "Platform",
    "description": "Draw one wall before each shot; solve target puzzles using a finite total wall-length allowance.",
    "family": "environment",
    "kind": "core-mode",
    "mechanics": [
      "shot",
      "target",
      "wall"
    ]
  },
  {
    "id": "057",
    "name": "Erosion",
    "scope": "System",
    "description": "Wear channels through soft terrain and deliver a payload before its supporting terrain collapses.",
    "family": "environment",
    "kind": "core-mode",
    "mechanics": []
  },
  {
    "id": "058",
    "name": "Rotating Chamber",
    "scope": "System",
    "description": "Turn the world between shots, changing gravity and currents; deliver cargo through successive orientations.",
    "family": "environment",
    "kind": "core-mode",
    "mechanics": [
      "cargo",
      "shot",
      "turn"
    ]
  },
  {
    "id": "059",
    "name": "Moving Maze",
    "scope": "System",
    "description": "Navigate walls that shift on a visible turn schedule; exit within the launch limit.",
    "family": "environment",
    "kind": "core-mode",
    "mechanics": [
      "turn",
      "wall"
    ]
  },
  {
    "id": "060",
    "name": "Bridge Builder",
    "scope": "System",
    "description": "Push pieces into sockets to form a safe route, then deliver cargo across it.",
    "family": "environment",
    "kind": "core-mode",
    "mechanics": [
      "cargo"
    ]
  },
  {
    "id": "061",
    "name": "Score Attack",
    "scope": "Rule",
    "description": "Maximize score within a fixed pluck budget, with the current researched build fixed at the start of each run.",
    "family": "strategy",
    "kind": "variation",
    "mechanics": [
      "score"
    ]
  },
  {
    "id": "062",
    "name": "Combo Cash-Out",
    "scope": "System",
    "description": "Carry a multiplier across shots and choose when to bank; failed chains erase the unbanked pot.",
    "family": "strategy",
    "kind": "core-mode",
    "mechanics": [
      "chain",
      "shot"
    ]
  },
  {
    "id": "063",
    "name": "Bounty Board",
    "scope": "Rule",
    "description": "Choose between visible shot objectives with different rewards; maximize bounty across ten launches.",
    "family": "strategy",
    "kind": "variation",
    "mechanics": [
      "shot"
    ]
  },
  {
    "id": "064",
    "name": "Precision Wager",
    "scope": "System",
    "description": "Stake run-only tokens on called banks or chains; finish above a quota without going bankrupt.",
    "family": "strategy",
    "kind": "core-mode",
    "mechanics": [
      "chain"
    ]
  },
  {
    "id": "065",
    "name": "Efficiency Trial",
    "scope": "Rule",
    "description": "Clear a prescribed board while minimizing total launch energy rather than simply counting shots.",
    "family": "strategy",
    "kind": "variation",
    "mechanics": [
      "shot"
    ]
  },
  {
    "id": "066",
    "name": "Spare Shot Sprint",
    "scope": "Rule",
    "description": "Clear short boards; remaining plucks convert to score instead of carrying into the next board.",
    "family": "strategy",
    "kind": "variation",
    "mechanics": [
      "score"
    ]
  },
  {
    "id": "067",
    "name": "Risk Zones",
    "scope": "System",
    "description": "Earn larger rewards in dangerous regions; return to a home zone to bank a target score.",
    "family": "strategy",
    "kind": "core-mode",
    "mechanics": [
      "score",
      "target"
    ]
  },
  {
    "id": "068",
    "name": "Perfect Streak",
    "scope": "Rule",
    "description": "Complete consecutive shot objectives; the first failure ends the run and records the streak.",
    "family": "strategy",
    "kind": "modifier",
    "mechanics": [
      "shot"
    ]
  },
  {
    "id": "069",
    "name": "Contract Run",
    "scope": "Rule",
    "description": "Choose optional restrictions for larger rewards; a failed contract pays nothing even if the board clears.",
    "family": "strategy",
    "kind": "variation",
    "mechanics": []
  },
  {
    "id": "070",
    "name": "Balanced Score",
    "scope": "Rule",
    "description": "Build separate bank, contact and power totals; the weakest category limits the final score.",
    "family": "strategy",
    "kind": "modifier",
    "mechanics": [
      "score"
    ]
  },
  {
    "id": "071",
    "name": "Draft Run",
    "scope": "System",
    "description": "Pick one of three temporary powers between boards and complete a short run with the resulting draft.",
    "family": "strategy",
    "kind": "core-mode",
    "mechanics": []
  },
  {
    "id": "072",
    "name": "Single Power Mastery",
    "scope": "Rule",
    "description": "Complete purpose-built boards with one fixed power, testing its uses rather than ownership.",
    "family": "strategy",
    "kind": "level",
    "mechanics": []
  },
  {
    "id": "073",
    "name": "Power Pair Trials",
    "scope": "Rule",
    "description": "Solve boards using an assigned pair of powers; finish within par and compare different pairings.",
    "family": "strategy",
    "kind": "level",
    "mechanics": []
  },
  {
    "id": "074",
    "name": "Sealed Loadout",
    "scope": "System",
    "description": "Receive a seeded power pool, choose a build and clear a gauntlet without further purchases.",
    "family": "strategy",
    "kind": "core-mode",
    "mechanics": []
  },
  {
    "id": "075",
    "name": "Borrowed Build",
    "scope": "Rule",
    "description": "Clear a sequence with a curated unfamiliar fixed build, learning its strengths through play.",
    "family": "strategy",
    "kind": "variation",
    "mechanics": []
  },
  {
    "id": "076",
    "name": "Power Decay",
    "scope": "System",
    "description": "Each activation weakens that power for the run; finish before the build becomes ineffective.",
    "family": "strategy",
    "kind": "core-mode",
    "mechanics": []
  },
  {
    "id": "077",
    "name": "Charge Economy",
    "scope": "System",
    "description": "Spend finite power charges across several pools, reserving enough for the final obstacle.",
    "family": "strategy",
    "kind": "core-mode",
    "mechanics": []
  },
  {
    "id": "078",
    "name": "Curse Bargain",
    "scope": "System",
    "description": "Accept explicit drawbacks for temporary advantages between boards; complete the run with those bargains.",
    "family": "strategy",
    "kind": "core-mode",
    "mechanics": []
  },
  {
    "id": "079",
    "name": "Evolution Run",
    "scope": "System",
    "description": "Upgrade behaviors actually used in cleared pools and guide the emerging build through a final test.",
    "family": "strategy",
    "kind": "core-mode",
    "mechanics": []
  },
  {
    "id": "080",
    "name": "Power Auction",
    "scope": "System",
    "description": "Bid run-only currency against a scripted rival for upgrades, then beat its multi-board target score.",
    "family": "strategy",
    "kind": "core-mode",
    "mechanics": [
      "score",
      "target"
    ]
  },
  {
    "id": "081",
    "name": "Melody Route",
    "scope": "System",
    "description": "Strike pitch-marked targets in a requested order within a shot budget; judge visible contact order.",
    "family": "music",
    "kind": "core-mode",
    "mechanics": [
      "shot",
      "target"
    ]
  },
  {
    "id": "082",
    "name": "Rhythm Gates",
    "scope": "System",
    "description": "Cross gates during visible beat windows; complete the course with calibrated timing and an untimed comparison.",
    "family": "music",
    "kind": "core-mode",
    "mechanics": []
  },
  {
    "id": "083",
    "name": "Call and Response",
    "scope": "System",
    "description": "Watch and hear a phrase, then reproduce its target sequence with limited launches.",
    "family": "music",
    "kind": "core-mode",
    "mechanics": [
      "target"
    ]
  },
  {
    "id": "084",
    "name": "Harmony Builder",
    "scope": "System",
    "description": "Collect compatible note groups to complete a displayed chord progression before shots run out.",
    "family": "music",
    "kind": "core-mode",
    "mechanics": [
      "shot"
    ]
  },
  {
    "id": "085",
    "name": "Instrument Rescue",
    "scope": "System",
    "description": "Deliver melody, bass and rhythm cargo to separate stages to complete an arrangement.",
    "family": "music",
    "kind": "core-mode",
    "mechanics": [
      "cargo"
    ]
  },
  {
    "id": "086",
    "name": "Silence Puzzle",
    "scope": "System",
    "description": "Reach required targets without touching marked sound-triggering bubbles; forbidden contacts fail the attempt.",
    "family": "music",
    "kind": "core-mode",
    "mechanics": [
      "target"
    ]
  },
  {
    "id": "087",
    "name": "Crescendo Run",
    "scope": "System",
    "description": "Raise visible musical intensity through varied chains, then complete the objective with a controlled quiet landing.",
    "family": "music",
    "kind": "core-mode",
    "mechanics": [
      "chain"
    ]
  },
  {
    "id": "088",
    "name": "Counterpoint",
    "scope": "System",
    "description": "Alternate two seed voices to complete separate note lines without hitting the wrong role's targets.",
    "family": "music",
    "kind": "core-mode",
    "mechanics": [
      "target"
    ]
  },
  {
    "id": "089",
    "name": "Phrase Repair",
    "scope": "System",
    "description": "Replace displayed missing or incorrect notes by hitting appropriate targets within the shot limit.",
    "family": "music",
    "kind": "core-mode",
    "mechanics": [
      "shot",
      "target"
    ]
  },
  {
    "id": "090",
    "name": "Free Composition",
    "scope": "System",
    "description": "Build a song in a chosen palette without loss conditions; finish by saving the composition.",
    "family": "music",
    "kind": "core-mode",
    "mechanics": []
  },
  {
    "id": "091",
    "name": "Constellation Recall",
    "scope": "System",
    "description": "Preview target markings, hide them, then hit only the remembered targets within a mistake allowance.",
    "family": "discovery",
    "kind": "core-mode",
    "mechanics": [
      "target"
    ]
  },
  {
    "id": "092",
    "name": "Echo Route",
    "scope": "Platform",
    "description": "Watch a recorded route and reproduce ordered checkpoints; rank completions by path deviation.",
    "family": "discovery",
    "kind": "core-mode",
    "mechanics": []
  },
  {
    "id": "093",
    "name": "Scout and Strike",
    "scope": "System",
    "description": "Spend limited scouting shots revealing targets, then clear actual hazards before ammunition runs out.",
    "family": "discovery",
    "kind": "core-mode",
    "mechanics": [
      "hazard",
      "shot",
      "target"
    ]
  },
  {
    "id": "094",
    "name": "Hidden Cargo",
    "scope": "System",
    "description": "Reveal destinations on contact and remember them while sorting all cargo with limited mistakes.",
    "family": "discovery",
    "kind": "core-mode",
    "mechanics": [
      "cargo"
    ]
  },
  {
    "id": "095",
    "name": "Rule Deduction",
    "scope": "System",
    "description": "Infer a consistent hidden matching rule from feedback, then solve a final board under that rule.",
    "family": "discovery",
    "kind": "core-mode",
    "mechanics": []
  },
  {
    "id": "096",
    "name": "Moving Target Memory",
    "scope": "System",
    "description": "Memorize numbered moving bubbles, then tag them in order after their numbers disappear.",
    "family": "discovery",
    "kind": "core-mode",
    "mechanics": []
  },
  {
    "id": "097",
    "name": "Fog Expedition",
    "scope": "System",
    "description": "Reveal passages while traveling; find a key and exit before shared energy runs out.",
    "family": "discovery",
    "kind": "core-mode",
    "mechanics": []
  },
  {
    "id": "098",
    "name": "Prediction Trial",
    "scope": "System",
    "description": "Predict a supplied shot's reaction outcome before launching; earn a quota of correct predictions.",
    "family": "discovery",
    "kind": "core-mode",
    "mechanics": [
      "shot"
    ]
  },
  {
    "id": "099",
    "name": "Sequence Lock",
    "scope": "System",
    "description": "Discover a switch sequence through bounded feedback and open the lock within limited attempts.",
    "family": "discovery",
    "kind": "core-mode",
    "mechanics": []
  },
  {
    "id": "100",
    "name": "Limited Sonar",
    "scope": "System",
    "description": "Spend a few pulses revealing obstacles; deliver a payload without exhausting its integrity.",
    "family": "discovery",
    "kind": "core-mode",
    "mechanics": []
  },
  {
    "id": "101",
    "name": "Absorption",
    "scope": "System",
    "description": "Consume smaller bodies to reach a target mass while avoiding bodies large enough to absorb the seed.",
    "family": "growth",
    "kind": "core-mode",
    "mechanics": [
      "target"
    ]
  },
  {
    "id": "102",
    "name": "Split and Rejoin",
    "scope": "System",
    "description": "Divide mass through narrow gaps, then reunite enough at the finish to meet a quota.",
    "family": "growth",
    "kind": "core-mode",
    "mechanics": []
  },
  {
    "id": "103",
    "name": "Mass Budget",
    "scope": "System",
    "description": "Propel by ejecting mass; reach the destination while retaining the required minimum size.",
    "family": "growth",
    "kind": "core-mode",
    "mechanics": []
  },
  {
    "id": "104",
    "name": "Membrane Repair",
    "scope": "System",
    "description": "Deliver patches to every leak before the enclosure's remaining contents fall below a quota.",
    "family": "growth",
    "kind": "core-mode",
    "mechanics": []
  },
  {
    "id": "105",
    "name": "Osmotic Balance",
    "scope": "System",
    "description": "Transfer material between chambers until displayed concentrations all fall within target ranges.",
    "family": "growth",
    "kind": "core-mode",
    "mechanics": [
      "target"
    ]
  },
  {
    "id": "106",
    "name": "Bubble Packing",
    "scope": "System",
    "description": "Fit deformable bodies inside a container without bursting them or exceeding its boundary.",
    "family": "growth",
    "kind": "core-mode",
    "mechanics": []
  },
  {
    "id": "107",
    "name": "Pressure Network",
    "scope": "System",
    "description": "Open valves and move plugs until several chambers simultaneously reach safe pressure ranges.",
    "family": "growth",
    "kind": "core-mode",
    "mechanics": []
  },
  {
    "id": "108",
    "name": "Phase Change",
    "scope": "System",
    "description": "Switch objects between invented solid, liquid-like and vapor-like states to deliver a material quota.",
    "family": "growth",
    "kind": "core-mode",
    "mechanics": []
  },
  {
    "id": "109",
    "name": "Foam Sculptor",
    "scope": "System",
    "description": "Deposit and remove persistent foam to form a stable route, then pass a delivery test.",
    "family": "growth",
    "kind": "core-mode",
    "mechanics": []
  },
  {
    "id": "110",
    "name": "Ecosystem Balance",
    "scope": "System",
    "description": "Keep three fictional populations within visible bounds for ten turns through feeding, separation and source control.",
    "family": "growth",
    "kind": "core-mode",
    "mechanics": [
      "turn"
    ]
  },
  {
    "id": "111",
    "name": "Branching Expedition",
    "scope": "System",
    "description": "Choose risk-and-reward routes through short pools and reach an endpoint with shared resources remaining.",
    "family": "journey",
    "kind": "core-mode",
    "mechanics": []
  },
  {
    "id": "112",
    "name": "Boss Anatomy",
    "scope": "System",
    "description": "Disable protective parts in a chosen order, expose a core and defeat it within a finite encounter.",
    "family": "journey",
    "kind": "core-mode",
    "mechanics": []
  },
  {
    "id": "113",
    "name": "Heist",
    "scope": "System",
    "description": "Enter a guarded chamber, collect an artifact and extract; raising an alarm changes the return route.",
    "family": "journey",
    "kind": "core-mode",
    "mechanics": []
  },
  {
    "id": "114",
    "name": "Bounty Hunt",
    "scope": "System",
    "description": "Track and capture a roaming target across connected pools before the expedition budget expires.",
    "family": "journey",
    "kind": "core-mode",
    "mechanics": [
      "capture",
      "target"
    ]
  },
  {
    "id": "115",
    "name": "Courier Circuit",
    "scope": "System",
    "description": "Choose a delivery order across chambers and complete every contract before shared fuel runs out.",
    "family": "journey",
    "kind": "core-mode",
    "mechanics": []
  },
  {
    "id": "116",
    "name": "Escape Rooms",
    "scope": "System",
    "description": "Solve linked switches and object puzzles to escape successive rooms using limited hints.",
    "family": "journey",
    "kind": "core-mode",
    "mechanics": []
  },
  {
    "id": "117",
    "name": "Expedition Camp",
    "scope": "System",
    "description": "Spend supplies on repairs or take harder routes; finish a finite journey with the choices made.",
    "family": "journey",
    "kind": "core-mode",
    "mechanics": []
  },
  {
    "id": "118",
    "name": "Campaign Remix",
    "scope": "Rule",
    "description": "Replay existing layouts with unfamiliar fixed goals and builds under one shared shot allowance.",
    "family": "journey",
    "kind": "level",
    "mechanics": [
      "shot"
    ]
  },
  {
    "id": "119",
    "name": "Boss Rush",
    "scope": "System",
    "description": "Defeat successive compact bosses with limited recovery; rank completed runs by resources retained.",
    "family": "journey",
    "kind": "core-mode",
    "mechanics": []
  },
  {
    "id": "120",
    "name": "Scenario Anthology",
    "scope": "Rule",
    "description": "Complete a curated sequence of reaction, rescue and containment trials, earning a medal for each discipline.",
    "family": "journey",
    "kind": "level",
    "mechanics": []
  },
  {
    "id": "121",
    "name": "Same-Seed Duel",
    "scope": "Rule",
    "description": "Pass one device between players for isolated identical boards and builds; highest score wins.",
    "family": "social",
    "kind": "variation",
    "mechanics": [
      "score"
    ]
  },
  {
    "id": "122",
    "name": "Alternate-Shot Duel",
    "scope": "System",
    "description": "Take turns claiming targets on a shared board; most claims when it clears wins.",
    "family": "social",
    "kind": "core-mode",
    "mechanics": [
      "target",
      "turn"
    ]
  },
  {
    "id": "123",
    "name": "Territory Claim",
    "scope": "System",
    "description": "Color regions through contacts and defend against recoloring; most territory after fixed rounds wins.",
    "family": "social",
    "kind": "core-mode",
    "mechanics": []
  },
  {
    "id": "124",
    "name": "Ricochet Goals",
    "scope": "System",
    "description": "Knock a neutral ball into the opponent's goal in alternating turns; first to the goal quota wins.",
    "family": "social",
    "kind": "core-mode",
    "mechanics": [
      "turn"
    ]
  },
  {
    "id": "125",
    "name": "King of the Pool",
    "scope": "System",
    "description": "Finish turns inside a contested zone to earn control points; first to the quota wins.",
    "family": "social",
    "kind": "core-mode",
    "mechanics": [
      "turn"
    ]
  },
  {
    "id": "126",
    "name": "Bumper Duel",
    "scope": "System",
    "description": "Knock the opposing seed out of a safe arena through alternating launches while keeping yours inside.",
    "family": "social",
    "kind": "core-mode",
    "mechanics": []
  },
  {
    "id": "127",
    "name": "Trick-Shot HORSE",
    "scope": "Platform",
    "description": "Record a checkpoint-based trick shot for another player to reproduce; failed reproductions add penalties.",
    "family": "social",
    "kind": "core-mode",
    "mechanics": [
      "shot"
    ]
  },
  {
    "id": "128",
    "name": "Ghost Race",
    "scope": "Platform",
    "description": "Race an asynchronous recorded run on a fixed course without physical interference; quickest completion wins.",
    "family": "social",
    "kind": "core-mode",
    "mechanics": []
  },
  {
    "id": "129",
    "name": "Daily Seed Challenge",
    "scope": "Platform",
    "description": "Give everyone the same versioned board and build with comparable results and explicit retry rules.",
    "family": "social",
    "kind": "core-mode",
    "mechanics": []
  },
  {
    "id": "130",
    "name": "Party Rotation",
    "scope": "System",
    "description": "Cycle players through short precision, rescue and reaction rounds for one overall session score.",
    "family": "social",
    "kind": "core-mode",
    "mechanics": [
      "score"
    ]
  },
  {
    "id": "131",
    "name": "Shared Plucks",
    "scope": "System",
    "description": "Alternate one seed with shared shots; clear a board that rewards discussing each next launch.",
    "family": "social",
    "kind": "core-mode",
    "mechanics": [
      "shot"
    ]
  },
  {
    "id": "132",
    "name": "Dual Seed Rescue",
    "scope": "System",
    "description": "Control two seeds in turns, using one to position cargo and the other to finish deliveries.",
    "family": "social",
    "kind": "core-mode",
    "mechanics": [
      "cargo",
      "turn"
    ]
  },
  {
    "id": "133",
    "name": "Asymmetric Tools",
    "scope": "System",
    "description": "Give each player different fixed powers; solve a board requiring both within shared turns.",
    "family": "social",
    "kind": "core-mode",
    "mechanics": [
      "turn"
    ]
  },
  {
    "id": "134",
    "name": "Pilot and Engineer",
    "scope": "System",
    "description": "One player launches while another configures limited gates between shots; deliver all cargo together.",
    "family": "social",
    "kind": "core-mode",
    "mechanics": [
      "cargo",
      "shot"
    ]
  },
  {
    "id": "135",
    "name": "Linked Partners",
    "scope": "System",
    "description": "Keep two player seeds joined by a persistent rope while reaching separate exits without breaking it.",
    "family": "social",
    "kind": "core-mode",
    "mechanics": []
  },
  {
    "id": "136",
    "name": "Two-Front Defense",
    "scope": "System",
    "description": "Defend two cells using alternating seeds and shared supplies; both must survive the encounter.",
    "family": "social",
    "kind": "core-mode",
    "mechanics": [
      "cell"
    ]
  },
  {
    "id": "137",
    "name": "Rescue Relay",
    "scope": "System",
    "description": "Hand fragile cargo between player-controlled zones and deliver the quota across the whole chain.",
    "family": "social",
    "kind": "core-mode",
    "mechanics": [
      "cargo",
      "chain"
    ]
  },
  {
    "id": "138",
    "name": "Simultaneous Plan",
    "scope": "System",
    "description": "Choose launches secretly, then resolve both together; complete a shared objective without harmful collisions.",
    "family": "social",
    "kind": "core-mode",
    "mechanics": []
  },
  {
    "id": "139",
    "name": "Shared Song",
    "scope": "System",
    "description": "Assign players melody and rhythm tasks; complete both visible parts to finish a composition challenge.",
    "family": "social",
    "kind": "core-mode",
    "mechanics": []
  },
  {
    "id": "140",
    "name": "Cooperative Gauntlet",
    "scope": "System",
    "description": "Alternate the lead across specialist boards, sharing limited retries until the final clear.",
    "family": "social",
    "kind": "core-mode",
    "mechanics": []
  },
  {
    "id": "141",
    "name": "Reaction Lab",
    "scope": "System",
    "description": "Inspect bounded interactions with stepping, a causal log and reset; deliberately omit score and loss states.",
    "family": "workshop",
    "kind": "tool",
    "mechanics": [
      "score"
    ]
  },
  {
    "id": "142",
    "name": "Puzzle Workshop",
    "scope": "Platform",
    "description": "Author and share bounded goal-based layouts; require a recorded valid solution before publishing a challenge.",
    "family": "workshop",
    "kind": "tool",
    "mechanics": []
  },
  {
    "id": "143",
    "name": "Current Garden",
    "scope": "System",
    "description": "Arrange currents and obstacles to maintain a chosen circulation pattern, then save the garden.",
    "family": "workshop",
    "kind": "tool",
    "mechanics": []
  },
  {
    "id": "144",
    "name": "Zen Clearing",
    "scope": "Rule",
    "description": "Complete a finite pleasant arrangement at any pace with unlimited shots, then choose a fresh board.",
    "family": "workshop",
    "kind": "tool",
    "mechanics": [
      "shot"
    ]
  },
  {
    "id": "145",
    "name": "Constellation Painting",
    "scope": "System",
    "description": "Trace target points to complete a picture without a timer or punitive restart.",
    "family": "workshop",
    "kind": "tool",
    "mechanics": [
      "target"
    ]
  },
  {
    "id": "146",
    "name": "Restoration Pool",
    "scope": "System",
    "description": "Clean a damaged environment through contact and delivery tasks until every visible region is restored.",
    "family": "workshop",
    "kind": "tool",
    "mechanics": []
  },
  {
    "id": "147",
    "name": "Chain Gallery",
    "scope": "Platform",
    "description": "Save successful reactions as replays and inspect causal steps while comparing solutions to the same board.",
    "family": "workshop",
    "kind": "tool",
    "mechanics": []
  },
  {
    "id": "148",
    "name": "Skill Clinic",
    "scope": "System",
    "description": "Practice a technique on adaptive drills with feedback; graduate after a repeatable accuracy target.",
    "family": "workshop",
    "kind": "tool",
    "mechanics": [
      "target"
    ]
  },
  {
    "id": "149",
    "name": "Accessibility Trials",
    "scope": "Rule",
    "description": "Try equivalent untimed objectives using drag, sliders or keyboard; compare comfort and completion on identical rules.",
    "family": "workshop",
    "kind": "tool",
    "mechanics": []
  },
  {
    "id": "150",
    "name": "Rule Mixer",
    "scope": "Platform",
    "description": "Combine compatible goals, powers and modifiers; flag incompatible combinations and save a bounded custom recipe.",
    "family": "workshop",
    "kind": "tool",
    "mechanics": []
  },
  {
    "id": "151",
    "name": "Capture Transport Release",
    "scope": "System",
    "description": "Enclose a hazard, move it behind a wall and release it onto marked targets; clear them before shots run out.",
    "family": "transport",
    "kind": "core-mode",
    "mechanics": [
      "hazard",
      "release",
      "shot",
      "target",
      "wall"
    ]
  },
  {
    "id": "152",
    "name": "Prison Break",
    "scope": "System",
    "description": "Capture guards instead of killing them and move their containers away; escort all prisoners out within the launch budget.",
    "family": "transport",
    "kind": "core-mode",
    "mechanics": [
      "capture"
    ]
  },
  {
    "id": "153",
    "name": "Gas Harvest",
    "scope": "System",
    "description": "Capture finite gas clouds and deliver their contents to collectors; meet the quota before a shot limit.",
    "family": "transport",
    "kind": "core-mode",
    "mechanics": [
      "capture",
      "shot"
    ]
  },
  {
    "id": "154",
    "name": "Enemy Ammunition",
    "scope": "System",
    "description": "Trap a hostile spitter and transport it so its released projectiles open a barricade; reach the exit within eight turns.",
    "family": "transport",
    "kind": "core-mode",
    "mechanics": [
      "turn"
    ]
  },
  {
    "id": "155",
    "name": "Living Key",
    "scope": "System",
    "description": "Carry a captured creature to a gate, then release it to activate the mechanism; escape before it wanders away for good.",
    "family": "transport",
    "kind": "core-mode",
    "mechanics": [
      "release"
    ]
  },
  {
    "id": "156",
    "name": "Catch the Fragments",
    "scope": "System",
    "description": "Place empty capture bubbles to intercept shrapnel and deliver the collected fragments within six shots.",
    "family": "transport",
    "kind": "core-mode",
    "mechanics": [
      "capture",
      "shot"
    ]
  },
  {
    "id": "157",
    "name": "Nursery Transfer",
    "scope": "System",
    "description": "Move captured young organisms through predators, releasing them only inside a refuge; lose if too few survive.",
    "family": "transport",
    "kind": "core-mode",
    "mechanics": []
  },
  {
    "id": "158",
    "name": "Temporary Prison",
    "scope": "System",
    "description": "Trap enemies in membranes that expire after a visible number of turns; clear an escape route before recapture becomes impossible.",
    "family": "transport",
    "kind": "core-mode",
    "mechanics": [
      "turn"
    ]
  },
  {
    "id": "159",
    "name": "Containment Exchange",
    "scope": "System",
    "description": "Transfer contents between containers with different resistances; deliver the payload before the shared shot budget ends.",
    "family": "transport",
    "kind": "core-mode",
    "mechanics": [
      "shot"
    ]
  },
  {
    "id": "160",
    "name": "Double Shell",
    "scope": "System",
    "description": "Pop an outer protective layer to fit a passage, preserve the inner cargo and reach its receiver within par.",
    "family": "transport",
    "kind": "core-mode",
    "mechanics": [
      "cargo"
    ]
  },
  {
    "id": "161",
    "name": "Split-Gap Delivery",
    "scope": "System",
    "description": "Divide one payload to pass separate narrow channels, then deliver every portion within the shot limit.",
    "family": "growth",
    "kind": "core-mode",
    "mechanics": [
      "shot"
    ]
  },
  {
    "id": "162",
    "name": "Weighted Sockets",
    "scope": "System",
    "description": "Split and merge masses until each receiver contains its exact required amount; solve within a fixed action budget.",
    "family": "growth",
    "kind": "core-mode",
    "mechanics": [
      "split"
    ]
  },
  {
    "id": "163",
    "name": "Merge Ram",
    "scope": "System",
    "description": "Fuse small bodies into a heavy ram, break a barrier and deliver the surviving mass before shots run out.",
    "family": "growth",
    "kind": "core-mode",
    "mechanics": [
      "fuse",
      "shot"
    ]
  },
  {
    "id": "164",
    "name": "Volatile Fusion",
    "scope": "System",
    "description": "Merge compatible payloads only at marked demolition sites; destroy every site without rupturing protected cargo.",
    "family": "growth",
    "kind": "core-mode",
    "mechanics": [
      "cargo"
    ]
  },
  {
    "id": "165",
    "name": "Divide the Threat",
    "scope": "System",
    "description": "Split a large hostile into smaller capturable bodies; contain all of them before the turn limit.",
    "family": "growth",
    "kind": "core-mode",
    "mechanics": [
      "split",
      "turn"
    ]
  },
  {
    "id": "166",
    "name": "Assembly Line",
    "scope": "System",
    "description": "Route incoming ingredients into prescribed merged products; complete an order before the finite supply is exhausted.",
    "family": "growth",
    "kind": "core-mode",
    "mechanics": []
  },
  {
    "id": "167",
    "name": "Unequal Division",
    "scope": "System",
    "description": "Choose split proportions to send enough force down one route while preserving valuable mass on another; satisfy both goals within par.",
    "family": "growth",
    "kind": "core-mode",
    "mechanics": [
      "split"
    ]
  },
  {
    "id": "168",
    "name": "Population Ceiling",
    "scope": "System",
    "description": "Clear a quota through splitting and capture while keeping active body count below a visible maximum.",
    "family": "growth",
    "kind": "core-mode",
    "mechanics": [
      "capture"
    ]
  },
  {
    "id": "169",
    "name": "Merge Chain Brake",
    "scope": "System",
    "description": "Fuse reactive bodies into an inert absorber to interrupt an approaching chain; protect the objective through the encounter.",
    "family": "growth",
    "kind": "core-mode",
    "mechanics": [
      "chain",
      "fuse"
    ]
  },
  {
    "id": "170",
    "name": "Cargo Dilution",
    "scope": "System",
    "description": "Merge hazardous contents with a finite neutral carrier until each shipment meets a displayed safe ratio, then deliver within the shot limit.",
    "family": "growth",
    "kind": "core-mode",
    "mechanics": [
      "shot"
    ]
  },
  {
    "id": "171",
    "name": "Shrapnel Relay",
    "scope": "System",
    "description": "Aim finite fragment bursts through successive carriers to reach a shielded target; complete the chain within the shot limit.",
    "family": "reaction",
    "kind": "core-mode",
    "mechanics": [
      "chain",
      "shot",
      "target"
    ]
  },
  {
    "id": "172",
    "name": "Acid Key",
    "scope": "System",
    "description": "Release acid onto compatible locks while protecting non-resistant cargo; open and traverse the exit before shots run out.",
    "family": "reaction",
    "kind": "core-mode",
    "mechanics": [
      "cargo",
      "release",
      "shot"
    ]
  },
  {
    "id": "173",
    "name": "Steam Junction",
    "scope": "System",
    "description": "Merge specified steam-bearing payloads at a junction to push gates into alignment; reach the exit within par.",
    "family": "reaction",
    "kind": "core-mode",
    "mechanics": []
  },
  {
    "id": "174",
    "name": "Gas Corridor",
    "scope": "System",
    "description": "Capture or displace a cloud to open a safe passage; escort cargo through before its integrity is lost.",
    "family": "reaction",
    "kind": "core-mode",
    "mechanics": [
      "capture",
      "cargo"
    ]
  },
  {
    "id": "175",
    "name": "Mud Dam",
    "scope": "System",
    "description": "Combine earth and water at a chosen bottleneck to redirect a current into cargo receivers within limited shots.",
    "family": "reaction",
    "kind": "core-mode",
    "mechanics": [
      "cargo",
      "shot"
    ]
  },
  {
    "id": "176",
    "name": "Firebreak Sculptor",
    "scope": "System",
    "description": "Rearrange inert bodies and gaps to stop a gas ignition chain reaching a protected cell; survive one triggered cascade.",
    "family": "reaction",
    "kind": "core-mode",
    "mechanics": [
      "cell",
      "chain"
    ]
  },
  {
    "id": "177",
    "name": "Reagent Recovery",
    "scope": "System",
    "description": "Recover useful material after a reaction and reuse it on a second obstacle; complete both with a finite initial payload supply.",
    "family": "reaction",
    "kind": "core-mode",
    "mechanics": []
  },
  {
    "id": "178",
    "name": "Status Transfer",
    "scope": "System",
    "description": "Trap a slowing cloud and release it around enemies instead of the player; escort a convoy before enemies destroy its quota.",
    "family": "reaction",
    "kind": "core-mode",
    "mechanics": [
      "release"
    ]
  },
  {
    "id": "179",
    "name": "Fragment Collector",
    "scope": "System",
    "description": "Break containers whose fragments become temporary tools, then use those tools to clear designated obstacles before shots expire.",
    "family": "reaction",
    "kind": "core-mode",
    "mechanics": [
      "shot"
    ]
  },
  {
    "id": "180",
    "name": "Reaction Interception",
    "scope": "System",
    "description": "Redirect a moving blast carrier, absorb its contents or place cover before its visible fuse ends; save every protected cell.",
    "family": "reaction",
    "kind": "core-mode",
    "mechanics": [
      "cell",
      "fuse"
    ]
  },
  {
    "id": "181",
    "name": "Keep One Vent Open",
    "scope": "System",
    "description": "Harvest a dangerous source to obtain needed material, then seal it and complete a delivery before the turn limit.",
    "family": "containment",
    "kind": "core-mode",
    "mechanics": [
      "turn"
    ]
  },
  {
    "id": "182",
    "name": "Feed the Producer",
    "scope": "System",
    "description": "Deliver different food payloads to control a source's next output; manufacture the required set within limited turns.",
    "family": "containment",
    "kind": "core-mode",
    "mechanics": [
      "turn"
    ]
  },
  {
    "id": "183",
    "name": "Source Hijack",
    "scope": "System",
    "description": "Turn hostile outputs toward enemy barriers; reach the exit without destroying the source you need, within par.",
    "family": "containment",
    "kind": "core-mode",
    "mechanics": [
      "turn"
    ]
  },
  {
    "id": "184",
    "name": "Source Timing",
    "scope": "System",
    "description": "Activate sources in a physical production schedule so their outputs meet and react at one location; complete a target chain within turns.",
    "family": "containment",
    "kind": "core-mode",
    "mechanics": [
      "chain",
      "target",
      "turn"
    ]
  },
  {
    "id": "185",
    "name": "Geyser Elevator",
    "scope": "System",
    "description": "Trigger an impact-driven jet to lift or carry cargo across a blocked route; deliver before the shot budget ends.",
    "family": "containment",
    "kind": "core-mode",
    "mechanics": [
      "cargo",
      "shot"
    ]
  },
  {
    "id": "186",
    "name": "Producer Protection",
    "scope": "System",
    "description": "Keep a useful producer alive until it supplies a quota while diverting harmful emissions from nearby sources.",
    "family": "containment",
    "kind": "core-mode",
    "mechanics": []
  },
  {
    "id": "187",
    "name": "Supply Cut",
    "scope": "System",
    "description": "Starve an enemy nest by intercepting its incoming nutrients; disable every nest before the protected cell loses its health.",
    "family": "containment",
    "kind": "core-mode",
    "mechanics": [
      "cell"
    ]
  },
  {
    "id": "188",
    "name": "Contaminated Factory",
    "scope": "System",
    "description": "Remove an infection from a producer so it emits useful contents again; restore the required outputs within eight turns.",
    "family": "containment",
    "kind": "core-mode",
    "mechanics": [
      "turn"
    ]
  },
  {
    "id": "189",
    "name": "Portable Source",
    "scope": "System",
    "description": "Reposition one generator to serve several separated receivers; fill them all using its finite stock.",
    "family": "containment",
    "kind": "core-mode",
    "mechanics": []
  },
  {
    "id": "190",
    "name": "Plug and Unplug",
    "scope": "System",
    "description": "Seal a source with mud, reopen it with a blast and time successive releases to complete a routing puzzle within par.",
    "family": "containment",
    "kind": "core-mode",
    "mechanics": []
  },
  {
    "id": "191",
    "name": "Anchor Release",
    "scope": "System",
    "description": "Dissolve selected tethers so a captive cluster drifts into a receiver; deliver its quota without exhausting shots.",
    "family": "environment",
    "kind": "core-mode",
    "mechanics": [
      "shot"
    ]
  },
  {
    "id": "192",
    "name": "Support Collapse",
    "scope": "System",
    "description": "Remove a support to release many targets at once; catch required cargo while letting hazards fall into disposal zones.",
    "family": "environment",
    "kind": "core-mode",
    "mechanics": [
      "cargo",
      "hazard",
      "release",
      "target"
    ]
  },
  {
    "id": "193",
    "name": "Pendulum Payload",
    "scope": "System",
    "description": "Time impacts on tethered explosive bubbles so they detonate beside barriers rather than cargo; clear within the shot limit.",
    "family": "environment",
    "kind": "core-mode",
    "mechanics": [
      "cargo",
      "shot"
    ]
  },
  {
    "id": "194",
    "name": "Track Switchyard",
    "scope": "System",
    "description": "Move rail-constrained bubbles through switchable junctions into matching bays before limited turns expire.",
    "family": "environment",
    "kind": "core-mode",
    "mechanics": [
      "turn"
    ]
  },
  {
    "id": "195",
    "name": "Break the Right Link",
    "scope": "System",
    "description": "Sever one connection in an attachment chain to isolate a dangerous payload without losing the valuable cluster.",
    "family": "environment",
    "kind": "core-mode",
    "mechanics": [
      "chain"
    ]
  },
  {
    "id": "196",
    "name": "Reactive Bumpers",
    "scope": "System",
    "description": "Use fixed bumpers that release finite effects on impact; chain their outputs to reach a protected target within par.",
    "family": "environment",
    "kind": "core-mode",
    "mechanics": [
      "chain",
      "release",
      "target"
    ]
  },
  {
    "id": "197",
    "name": "Chamber Transfer",
    "scope": "System",
    "description": "Move incompatible contents through shared airlocks without allowing contact; deliver both quotas within the shot budget.",
    "family": "environment",
    "kind": "core-mode",
    "mechanics": [
      "shot"
    ]
  },
  {
    "id": "198",
    "name": "Residue Route",
    "scope": "System",
    "description": "Leave mud or foam from earlier reactions to shape the final delivery path; deliver the last cargo within par.",
    "family": "environment",
    "kind": "core-mode",
    "mechanics": [
      "cargo"
    ]
  },
  {
    "id": "199",
    "name": "Wall Permeability",
    "scope": "System",
    "description": "Route fragments, gas and bodies through walls with clearly marked different blocking rules; reach all targets within shots.",
    "family": "environment",
    "kind": "core-mode",
    "mechanics": [
      "shot",
      "target",
      "wall"
    ]
  },
  {
    "id": "200",
    "name": "Shortcut Sacrifice",
    "scope": "System",
    "description": "Spend a useful payload to open a shortcut or preserve it for the long route; extract enough total value before fuel runs out.",
    "family": "environment",
    "kind": "core-mode",
    "mechanics": []
  },
  {
    "id": "201",
    "name": "Nutrient Courier",
    "scope": "System",
    "description": "Deliver nutrient sacs to every starving cell before any cell's visible reserve reaches zero.",
    "family": "growth",
    "kind": "core-mode",
    "mechanics": [
      "cell"
    ]
  },
  {
    "id": "202",
    "name": "Selective Membranes",
    "scope": "System",
    "description": "Change a carrier's allowed property to pass distinct membranes; deliver each payload without exceeding the turn budget.",
    "family": "growth",
    "kind": "core-mode",
    "mechanics": [
      "turn"
    ]
  },
  {
    "id": "203",
    "name": "Nutrient Triage",
    "scope": "System",
    "description": "Allocate a finite nutrient stock between repairing tissue and activating tools; restore all required tissue before integrity runs out.",
    "family": "growth",
    "kind": "core-mode",
    "mechanics": []
  },
  {
    "id": "204",
    "name": "Infected Producer Rescue",
    "scope": "System",
    "description": "Trap and remove an infection while preserving its host producer; restart useful production within the shot limit.",
    "family": "growth",
    "kind": "core-mode",
    "mechanics": [
      "shot"
    ]
  },
  {
    "id": "205",
    "name": "Tissue Breach",
    "scope": "System",
    "description": "Move membrane fragments into a breach and fuse them into a seal before a protected chamber empties.",
    "family": "growth",
    "kind": "core-mode",
    "mechanics": [
      "fuse"
    ]
  },
  {
    "id": "206",
    "name": "Division Labor",
    "scope": "System",
    "description": "Divide a worker into smaller bodies for simultaneous switches, then reunite enough mass to escape within turns.",
    "family": "growth",
    "kind": "core-mode",
    "mechanics": [
      "turn"
    ]
  },
  {
    "id": "207",
    "name": "Waste Clearance",
    "scope": "System",
    "description": "Package harmful residue into resistant sacs and escort it out before the chamber's contamination meter fills.",
    "family": "growth",
    "kind": "core-mode",
    "mechanics": []
  },
  {
    "id": "208",
    "name": "Immune Decoys",
    "scope": "System",
    "description": "Mark disposable carriers to draw fictional immune pursuers away from a vulnerable shipment; deliver before its health runs out.",
    "family": "growth",
    "kind": "core-mode",
    "mechanics": []
  },
  {
    "id": "209",
    "name": "Symbiotic Passage",
    "scope": "System",
    "description": "Feed a resident organism so it temporarily opens a route, then recover supplies to reach the next chamber within budget.",
    "family": "growth",
    "kind": "core-mode",
    "mechanics": []
  },
  {
    "id": "210",
    "name": "Organ Recovery",
    "scope": "System",
    "description": "Solve a finite linked mission of supply, containment and repair using one shared nutrient reserve; restore every chamber before it is depleted.",
    "family": "growth",
    "kind": "core-mode",
    "mechanics": []
  }
];
