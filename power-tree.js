// Each power owns its research chain. Node count, cost, rarity and effects are authored, not fixed slots.
export const POWER_TREES = {
  "comet": {
    "name": "Comet",
    "type": "Motion",
    "tier": 1,
    "current": "A strong launch burst plus enhanced momentum retention through bubble and wall bounces for the shot.",
    "today": [
      "foundation"
    ],
    "uncertain": false,
    "compatible": true,
    "nodes": [
      {
        "name": "Comet",
        "description": "Burst forward on contact, within the normal speed limit.",
        "key": "base",
        "kind": "base",
        "effects": [],
        "seedCost": 4,
        "tuningCost": 0,
        "masteryPools": 0,
        "rarity": "common",
        "conflicts": []
      },
      {
        "name": "Momentum",
        "description": "Retain more speed after bouncing off bubbles and walls.",
        "key": "foundation",
        "kind": "foundation",
        "effects": [
          "foundation"
        ],
        "seedCost": 3,
        "tuningCost": 1,
        "masteryPools": 0,
        "rarity": "rare",
        "conflicts": []
      },
      {
        "name": "Bank Charge",
        "description": "The next genuine wall bounce after a new bubble contact gains a small speed boost, once per contact.",
        "key": "a",
        "kind": "a",
        "effects": [
          "a"
        ],
        "seedCost": 5,
        "tuningCost": 1,
        "masteryPools": 0,
        "rarity": "rare",
        "conflicts": []
      },
      {
        "name": "Long Flight",
        "description": "Lose speed more gradually near the end of a shot, while still coming to a natural rest.",
        "key": "b",
        "kind": "b",
        "effects": [
          "b"
        ],
        "seedCost": 5,
        "tuningCost": 1,
        "masteryPools": 0,
        "rarity": "epic",
        "conflicts": []
      },
      {
        "name": "Meteor Wake",
        "description": "The first two wall banks send an outward push through nearby bubbles.",
        "key": "capstone",
        "kind": "capstone",
        "effects": [
          "capstone"
        ],
        "seedCost": 8,
        "tuningCost": 2,
        "masteryPools": 3,
        "rarity": "legendary",
        "conflicts": []
      }
    ],
    "included": []
  },
  "impact": {
    "name": "Impact",
    "type": "Motion",
    "tier": 2,
    "current": "Strong activation knockback and stronger later player collision pushes.",
    "today": [
      "base"
    ],
    "uncertain": false,
    "compatible": true,
    "nodes": [
      {
        "name": "Impact",
        "description": "Strengthen the activating collision and later player contacts throughout this shot.",
        "key": "base",
        "kind": "base",
        "effects": [],
        "seedCost": 4,
        "tuningCost": 0,
        "masteryPools": 0,
        "rarity": "rare",
        "conflicts": []
      },
      {
        "name": "Focused Impact",
        "description": "Strengthen forward collision pushes without reducing the surrounding pressure wave.",
        "key": "a",
        "kind": "a",
        "effects": [
          "a"
        ],
        "seedCost": 5,
        "tuningCost": 1,
        "masteryPools": 0,
        "rarity": "epic",
        "conflicts": []
      },
      {
        "name": "Broad Impact",
        "description": "Add a radial push around each contact while retaining forward collision strength.",
        "key": "b",
        "kind": "b",
        "effects": [
          "b"
        ],
        "seedCost": 5,
        "tuningCost": 1,
        "masteryPools": 0,
        "rarity": "epic",
        "conflicts": []
      },
      {
        "name": "Transfer",
        "description": "The first two newly contacted bubbles carry one additional physical shove into another bubble. This shove alone neither scores nor triggers another Impact transfer.",
        "key": "capstone",
        "kind": "capstone",
        "effects": [
          "capstone"
        ],
        "seedCost": 8,
        "tuningCost": 2,
        "masteryPools": 3,
        "rarity": "legendary",
        "conflicts": []
      }
    ],
    "included": [
      "foundation"
    ],
    "legacyNodes": [
      {
        "name": "Follow Through",
        "description": "Extend enhanced pushes to later contacts during this shot.",
        "key": "foundation",
        "kind": "foundation",
        "effects": [
          "foundation"
        ],
        "seedCost": 3,
        "tuningCost": 1,
        "masteryPools": 0,
        "rarity": "rare",
        "conflicts": []
      }
    ]
  },
  "spring": {
    "name": "Spring",
    "type": "Motion",
    "tier": 2,
    "current": "Five seconds of stronger wall rebounds for the player and physical Split seeds, with elastic wall deformation.",
    "today": [
      "base"
    ],
    "uncertain": false,
    "compatible": true,
    "nodes": [
      {
        "name": "Spring",
        "description": "Boost wall rebounds for five seconds, with a visible recoil along the wall.",
        "key": "base",
        "kind": "base",
        "effects": [],
        "seedCost": 4,
        "tuningCost": 0,
        "masteryPools": 0,
        "rarity": "rare",
        "conflicts": []
      },
      {
        "name": "Deep Rebound",
        "description": "Bounce back more strongly, up to the normal maximum speed.",
        "key": "a",
        "kind": "a",
        "effects": [
          "a"
        ],
        "seedCost": 5,
        "tuningCost": 1,
        "masteryPools": 0,
        "rarity": "epic",
        "conflicts": []
      },
      {
        "name": "Angled Rebound",
        "description": "Bias a rebound slightly toward the nearest forward unhit bubble; show the bias in its cue.",
        "key": "b",
        "kind": "b",
        "effects": [
          "b"
        ],
        "seedCost": 5,
        "tuningCost": 1,
        "masteryPools": 0,
        "rarity": "epic",
        "conflicts": []
      },
      {
        "name": "Resonant Wall",
        "description": "First two spring rebounds also push nearby bubbles inward, creating bank opportunities rather than free score.",
        "key": "capstone",
        "kind": "capstone",
        "effects": [
          "capstone"
        ],
        "seedCost": 8,
        "tuningCost": 2,
        "masteryPools": 3,
        "rarity": "legendary",
        "conflicts": []
      }
    ],
    "included": [
      "foundation"
    ],
    "legacyNodes": [
      {
        "name": "Lasting Spring",
        "description": "Extend to five seconds.",
        "key": "foundation",
        "kind": "foundation",
        "effects": [
          "foundation"
        ],
        "seedCost": 3,
        "tuningCost": 1,
        "masteryPools": 0,
        "rarity": "rare",
        "conflicts": []
      }
    ]
  },
  "drunk": {
    "name": "Drunk",
    "type": "Motion",
    "tier": 3,
    "current": "Smooth side-to-side steering for four seconds, also affecting physical Split seeds, without extra drag.",
    "today": [
      "base"
    ],
    "uncertain": false,
    "compatible": true,
    "nodes": [
      {
        "name": "Drunk",
        "description": "Swerve smoothly for four seconds, aligning direction changes to the musical pulse without changing launch timing.",
        "key": "base",
        "kind": "base",
        "effects": [],
        "seedCost": 4,
        "tuningCost": 0,
        "masteryPools": 0,
        "rarity": "epic",
        "conflicts": []
      },
      {
        "name": "Narrow Sway",
        "description": "Smaller lateral deviation for threading lanes.",
        "key": "a",
        "kind": "a",
        "effects": [
          "a"
        ],
        "seedCost": 5,
        "tuningCost": 1,
        "masteryPools": 0,
        "rarity": "legendary",
        "conflicts": []
      },
      {
        "name": "Steady Sway",
        "description": "Slow the sway cycle for smoother turns while keeping Narrow Sway active.",
        "key": "b",
        "kind": "b",
        "effects": [
          "b"
        ],
        "seedCost": 5,
        "tuningCost": 1,
        "masteryPools": 0,
        "rarity": "legendary",
        "conflicts": []
      },
      {
        "name": "Shared Sway",
        "description": "Up to three nearby unhit bubbles sway sideways with the player.",
        "key": "capstone",
        "kind": "capstone",
        "effects": [
          "capstone"
        ],
        "seedCost": 8,
        "tuningCost": 2,
        "masteryPools": 3,
        "rarity": "mythic",
        "conflicts": []
      }
    ],
    "included": [
      "foundation"
    ],
    "legacyNodes": [
      {
        "name": "Rhythm Sway",
        "description": "Align its direction changes to the musical pulse without changing launch timing.",
        "key": "foundation",
        "kind": "foundation",
        "effects": [
          "foundation"
        ],
        "seedCost": 3,
        "tuningCost": 1,
        "masteryPools": 0,
        "rarity": "epic",
        "conflicts": []
      }
    ]
  },
  "ripple": {
    "name": "Ripple",
    "type": "Flow",
    "tier": 1,
    "current": "An outward radial impulse on nearby bubbles.",
    "today": [
      "base"
    ],
    "uncertain": false,
    "compatible": true,
    "nodes": [
      {
        "name": "Ripple",
        "description": "Send a pressure wave outward, pushing nearby bubbles away.",
        "key": "base",
        "kind": "base",
        "effects": [],
        "seedCost": 4,
        "tuningCost": 0,
        "masteryPools": 0,
        "rarity": "common",
        "conflicts": []
      },
      {
        "name": "Wide Ripple",
        "description": "Expand its reach by 20 percent without increasing center strength.",
        "key": "foundation",
        "kind": "foundation",
        "effects": [
          "foundation"
        ],
        "seedCost": 3,
        "tuningCost": 1,
        "masteryPools": 0,
        "rarity": "rare",
        "conflicts": []
      },
      {
        "name": "Strong Center",
        "description": "Increase the outward impulse throughout the ripple.",
        "key": "a",
        "kind": "a",
        "effects": [
          "a"
        ],
        "seedCost": 5,
        "tuningCost": 1,
        "masteryPools": 0,
        "rarity": "rare",
        "conflicts": []
      },
      {
        "name": "Far Shore",
        "description": "Keep more outward strength toward the edge, adding to Strong Center.",
        "key": "b",
        "kind": "b",
        "effects": [
          "b"
        ],
        "seedCost": 5,
        "tuningCost": 1,
        "masteryPools": 0,
        "rarity": "epic",
        "conflicts": []
      },
      {
        "name": "Returning Ripple",
        "description": "One weaker inward wave follows after half a second. It moves bodies but cannot score or recursively create waves.",
        "key": "capstone",
        "kind": "capstone",
        "effects": [
          "capstone"
        ],
        "seedCost": 8,
        "tuningCost": 2,
        "masteryPools": 3,
        "rarity": "legendary",
        "conflicts": []
      }
    ],
    "included": []
  },
  "attract": {
    "name": "Attract",
    "type": "Flow",
    "tier": 1,
    "current": "An immediate inward impulse that gathers nearby bubbles.",
    "today": [
      "base"
    ],
    "uncertain": false,
    "compatible": true,
    "nodes": [
      {
        "name": "Attract",
        "description": "Pull nearby bubbles toward the contact point with one gathering impulse.",
        "key": "base",
        "kind": "base",
        "effects": [],
        "seedCost": 4,
        "tuningCost": 0,
        "masteryPools": 0,
        "rarity": "common",
        "conflicts": []
      },
      {
        "name": "Deep Attraction",
        "description": "Increase useful reach by 20 percent.",
        "key": "foundation",
        "kind": "foundation",
        "effects": [
          "foundation"
        ],
        "seedCost": 3,
        "tuningCost": 1,
        "masteryPools": 0,
        "rarity": "rare",
        "conflicts": []
      },
      {
        "name": "Tight Group",
        "description": "Strengthen attraction while leaving a small inner spacing gap.",
        "key": "a",
        "kind": "a",
        "effects": [
          "a"
        ],
        "seedCost": 5,
        "tuningCost": 1,
        "masteryPools": 0,
        "rarity": "rare",
        "conflicts": []
      },
      {
        "name": "Distant Gathering",
        "description": "Keep more inward pull toward the edge without reversing the gathering direction.",
        "key": "b",
        "kind": "b",
        "effects": [
          "b"
        ],
        "seedCost": 5,
        "tuningCost": 1,
        "masteryPools": 0,
        "rarity": "epic",
        "conflicts": []
      },
      {
        "name": "Release",
        "description": "After the gathering phase, emit a modest outward release. This makes timing meaningful instead of holding the pool in a permanent clump.",
        "key": "capstone",
        "kind": "capstone",
        "effects": [
          "capstone"
        ],
        "seedCost": 8,
        "tuningCost": 2,
        "masteryPools": 3,
        "rarity": "legendary",
        "conflicts": []
      }
    ],
    "included": []
  },
  "vortex": {
    "name": "Vortex",
    "type": "Flow",
    "tier": 2,
    "current": "A tangential impulse sets nearby bubbles swirling.",
    "today": [
      "base"
    ],
    "uncertain": false,
    "compatible": true,
    "nodes": [
      {
        "name": "Vortex",
        "description": "The tangential swirl.",
        "key": "base",
        "kind": "base",
        "effects": [],
        "seedCost": 4,
        "tuningCost": 0,
        "masteryPools": 0,
        "rarity": "rare",
        "conflicts": []
      },
      {
        "name": "Sustained Current",
        "description": "Continue a weaker swirl for one second.",
        "key": "foundation",
        "kind": "foundation",
        "effects": [
          "foundation"
        ],
        "seedCost": 3,
        "tuningCost": 1,
        "masteryPools": 0,
        "rarity": "rare",
        "conflicts": []
      },
      {
        "name": "Spiral In",
        "description": "Add inward drift and strengthen the swirl.",
        "key": "a",
        "kind": "a",
        "effects": [
          "a"
        ],
        "seedCost": 5,
        "tuningCost": 1,
        "masteryPools": 0,
        "rarity": "epic",
        "conflicts": []
      },
      {
        "name": "Wide Spiral",
        "description": "Extend the swirl and retain more strength near its edge, including inward drift when researched.",
        "key": "b",
        "kind": "b",
        "effects": [
          "b"
        ],
        "seedCost": 5,
        "tuningCost": 1,
        "masteryPools": 0,
        "rarity": "epic",
        "conflicts": []
      },
      {
        "name": "Moving Center",
        "description": "A weak swirl follows the player for one second. Teleporting breaks the swirl.",
        "key": "capstone",
        "kind": "capstone",
        "effects": [
          "capstone"
        ],
        "seedCost": 8,
        "tuningCost": 2,
        "masteryPools": 3,
        "rarity": "legendary",
        "conflicts": []
      }
    ],
    "included": []
  },
  "magnet": {
    "name": "Magnet",
    "type": "Flow",
    "tier": 2,
    "current": "The moving player attracts unhit bubbles for 2.4 seconds.",
    "today": [
      "base"
    ],
    "uncertain": false,
    "compatible": true,
    "nodes": [
      {
        "name": "Magnet",
        "description": "Draw nearby unhit bubbles toward the moving player for 3.2 seconds.",
        "key": "base",
        "kind": "base",
        "effects": [],
        "seedCost": 4,
        "tuningCost": 0,
        "masteryPools": 0,
        "rarity": "rare",
        "conflicts": []
      },
      {
        "name": "Close Pull",
        "description": "Strengthen attraction without shortening its reach.",
        "key": "a",
        "kind": "a",
        "effects": [
          "a"
        ],
        "seedCost": 5,
        "tuningCost": 1,
        "masteryPools": 0,
        "rarity": "epic",
        "conflicts": []
      },
      {
        "name": "Distant Pull",
        "description": "Extend attraction reach without weakening its pull.",
        "key": "b",
        "kind": "b",
        "effects": [
          "b"
        ],
        "seedCost": 5,
        "tuningCost": 1,
        "masteryPools": 0,
        "rarity": "epic",
        "conflicts": []
      },
      {
        "name": "Polarity",
        "description": "Newly hit bubbles receive one small outward release, clearing the path for the unhit bodies still being drawn in.",
        "key": "capstone",
        "kind": "capstone",
        "effects": [
          "capstone"
        ],
        "seedCost": 8,
        "tuningCost": 2,
        "masteryPools": 3,
        "rarity": "legendary",
        "conflicts": []
      }
    ],
    "included": [
      "foundation"
    ],
    "legacyNodes": [
      {
        "name": "Lasting Magnet",
        "description": "Extend to 3.2 seconds.",
        "key": "foundation",
        "kind": "foundation",
        "effects": [
          "foundation"
        ],
        "seedCost": 3,
        "tuningCost": 1,
        "masteryPools": 0,
        "rarity": "rare",
        "conflicts": []
      }
    ]
  },
  "wake": {
    "name": "Wake",
    "type": "Flow",
    "tier": 3,
    "current": "Five seconds of player and Split trails that push crossing bubbles along the flight direction.",
    "today": [
      "base"
    ],
    "uncertain": false,
    "compatible": true,
    "nodes": [
      {
        "name": "Wake",
        "description": "Leave a short-lived directional current along your path for five seconds.",
        "key": "base",
        "kind": "base",
        "effects": [],
        "seedCost": 4,
        "tuningCost": 0,
        "masteryPools": 0,
        "rarity": "epic",
        "conflicts": []
      },
      {
        "name": "Strong Jet",
        "description": "Strengthen the trail current without narrowing it.",
        "key": "a",
        "kind": "a",
        "effects": [
          "a"
        ],
        "seedCost": 5,
        "tuningCost": 1,
        "masteryPools": 0,
        "rarity": "legendary",
        "conflicts": []
      },
      {
        "name": "Broad Current",
        "description": "Widen the current without reducing its strength.",
        "key": "b",
        "kind": "b",
        "effects": [
          "b"
        ],
        "seedCost": 5,
        "tuningCost": 1,
        "masteryPools": 0,
        "rarity": "legendary",
        "conflicts": []
      },
      {
        "name": "Crossing Currents",
        "description": "When two separated trail segments overlap, create one small eddy there. At most two eddies per shot, each lasting one second.",
        "key": "capstone",
        "kind": "capstone",
        "effects": [
          "capstone"
        ],
        "seedCost": 8,
        "tuningCost": 2,
        "masteryPools": 3,
        "rarity": "mythic",
        "conflicts": []
      }
    ],
    "included": [
      "foundation"
    ],
    "legacyNodes": [
      {
        "name": "Long Wake",
        "description": "Restore five seconds of deposition.",
        "key": "foundation",
        "kind": "foundation",
        "effects": [
          "foundation"
        ],
        "seedCost": 3,
        "tuningCost": 1,
        "masteryPools": 0,
        "rarity": "epic",
        "conflicts": []
      }
    ]
  },
  "stasis": {
    "name": "Stasis",
    "type": "Control",
    "tier": 1,
    "current": "Slows nearby bubbles and later contacts, shows frosted edges and reduced squish, and makes hit frozen bubbles translucent and permeable with pressure on the player.",
    "today": [
      "foundation"
    ],
    "uncertain": false,
    "compatible": true,
    "nodes": [
      {
        "name": "Stasis",
        "description": "Frost a smaller area, slowing bubbles and stiffening their edges. Hit frozen bubbles remain translucent and permeable, with gentle pressure instead of a hard rebound.",
        "key": "base",
        "kind": "base",
        "effects": [],
        "seedCost": 4,
        "tuningCost": 0,
        "masteryPools": 0,
        "rarity": "common",
        "conflicts": []
      },
      {
        "name": "Deep Frost",
        "description": "Freeze bubbles across a wider area: 440 units instead of 300.",
        "key": "foundation",
        "kind": "foundation",
        "effects": [
          "foundation"
        ],
        "seedCost": 3,
        "tuningCost": 1,
        "masteryPools": 0,
        "rarity": "rare",
        "conflicts": []
      },
      {
        "name": "Firm Ice",
        "description": "Lower the bubble speed cap, making the arrangement more stable.",
        "key": "a",
        "kind": "a",
        "effects": [
          "a"
        ],
        "seedCost": 5,
        "tuningCost": 1,
        "masteryPools": 0,
        "rarity": "rare",
        "conflicts": []
      },
      {
        "name": "Thin Ice",
        "description": "Reduce pressure on the player while preserving the researched bubble speed limit.",
        "key": "b",
        "kind": "b",
        "effects": [
          "b"
        ],
        "seedCost": 5,
        "tuningCost": 1,
        "masteryPools": 0,
        "rarity": "epic",
        "conflicts": []
      },
      {
        "name": "Frost Spread",
        "description": "The first two physical bubble-to-bubble contacts from a frozen bubble frost one additional body each. Spreading itself earns no hit or power pickup.",
        "key": "capstone",
        "kind": "capstone",
        "effects": [
          "capstone"
        ],
        "seedCost": 8,
        "tuningCost": 2,
        "masteryPools": 3,
        "rarity": "legendary",
        "conflicts": []
      }
    ],
    "included": []
  },
  "bubble": {
    "name": "Bubble",
    "type": "Control",
    "tier": 2,
    "current": "An enlarged permeable shell scores on contact and pushes bubbles outward by a radius gradient, with a smaller opposing pressure on the player.",
    "today": [
      "foundation"
    ],
    "uncertain": false,
    "compatible": true,
    "nodes": [
      {
        "name": "Bubble",
        "description": "Retain this soft interaction at a modest shell size. There is no solid collision core to unlock away.",
        "key": "base",
        "kind": "base",
        "effects": [],
        "seedCost": 4,
        "tuningCost": 0,
        "masteryPools": 0,
        "rarity": "rare",
        "conflicts": []
      },
      {
        "name": "Large Bubble",
        "description": "Increase shell radius by 20 percent, while respecting the pool bounds.",
        "key": "foundation",
        "kind": "foundation",
        "effects": [
          "foundation"
        ],
        "seedCost": 3,
        "tuningCost": 1,
        "masteryPools": 0,
        "rarity": "rare",
        "conflicts": []
      },
      {
        "name": "Soft Bubble",
        "description": "Reduce the reaction on the player without weakening the outward bubble push.",
        "key": "a",
        "kind": "a",
        "effects": [
          "a"
        ],
        "seedCost": 5,
        "tuningCost": 1,
        "masteryPools": 0,
        "rarity": "epic",
        "conflicts": []
      },
      {
        "name": "Firm Bubble",
        "description": "Strengthen the outward push on bubbles without increasing the reaction on the player.",
        "key": "b",
        "kind": "b",
        "effects": [
          "b"
        ],
        "seedCost": 5,
        "tuningCost": 1,
        "masteryPools": 0,
        "rarity": "epic",
        "conflicts": []
      },
      {
        "name": "Breathing Bubble",
        "description": "Radius gently expands and contracts by 10 percent on the pulse. Contact still counts once per bubble, and radius changes never impart an instant bounce.",
        "key": "capstone",
        "kind": "capstone",
        "effects": [
          "capstone"
        ],
        "seedCost": 8,
        "tuningCost": 2,
        "masteryPools": 3,
        "rarity": "legendary",
        "conflicts": []
      }
    ],
    "included": []
  },
  "tether": {
    "name": "Tether",
    "type": "Control",
    "tier": 2,
    "current": "Three bubbles gain elastic links, musical thread cues and a gentle drift toward the moving player for up to four seconds.",
    "today": [
      "foundation"
    ],
    "uncertain": false,
    "compatible": true,
    "nodes": [
      {
        "name": "Tether",
        "description": "Two linked bubbles, with a gentle playerward drift preserved as the power's identity.",
        "key": "base",
        "kind": "base",
        "effects": [],
        "seedCost": 4,
        "tuningCost": 0,
        "masteryPools": 0,
        "rarity": "rare",
        "conflicts": []
      },
      {
        "name": "Third Thread",
        "description": "Add the third bubble and full triangular linkage.",
        "key": "foundation",
        "kind": "foundation",
        "effects": [
          "foundation"
        ],
        "seedCost": 3,
        "tuningCost": 1,
        "masteryPools": 0,
        "rarity": "rare",
        "conflicts": []
      },
      {
        "name": "Gathering Thread",
        "description": "Strengthen drift toward the player without softening the links.",
        "key": "a",
        "kind": "a",
        "effects": [
          "a"
        ],
        "seedCost": 5,
        "tuningCost": 1,
        "masteryPools": 0,
        "rarity": "epic",
        "conflicts": []
      },
      {
        "name": "Elastic Thread",
        "description": "Strengthen links and collision transfer while preserving playerward drift.",
        "key": "b",
        "kind": "b",
        "effects": [
          "b"
        ],
        "seedCost": 5,
        "tuningCost": 1,
        "masteryPools": 0,
        "rarity": "epic",
        "conflicts": []
      },
      {
        "name": "Release Knot",
        "description": "When the effect expires, release stored stretch as one bounded impulse per member. No teleporting or stored-energy explosion.",
        "key": "capstone",
        "kind": "capstone",
        "effects": [
          "capstone"
        ],
        "seedCost": 8,
        "tuningCost": 2,
        "masteryPools": 3,
        "rarity": "legendary",
        "conflicts": []
      }
    ],
    "included": []
  },
  "orbit": {
    "name": "Orbit",
    "type": "Control",
    "tier": 3,
    "current": "Gathers up to two unhit satellites for three seconds and flings them outward.",
    "today": [
      "foundation"
    ],
    "uncertain": false,
    "compatible": true,
    "nodes": [
      {
        "name": "Orbit",
        "description": "One satellite with its existing release behavior.",
        "key": "base",
        "kind": "base",
        "effects": [],
        "seedCost": 4,
        "tuningCost": 0,
        "masteryPools": 0,
        "rarity": "epic",
        "conflicts": []
      },
      {
        "name": "Twin Orbit",
        "description": "Allow two satellites.",
        "key": "foundation",
        "kind": "foundation",
        "effects": [
          "foundation"
        ],
        "seedCost": 3,
        "tuningCost": 1,
        "masteryPools": 0,
        "rarity": "epic",
        "conflicts": []
      },
      {
        "name": "Quick Orbit",
        "description": "Gather and release satellites sooner without shrinking the orbit.",
        "key": "a",
        "kind": "a",
        "effects": [
          "a"
        ],
        "seedCost": 5,
        "tuningCost": 1,
        "masteryPools": 0,
        "rarity": "legendary",
        "conflicts": []
      },
      {
        "name": "Wide Orbit",
        "description": "Widen the orbit without slowing its rotation or delaying release.",
        "key": "b",
        "kind": "b",
        "effects": [
          "b"
        ],
        "seedCost": 5,
        "tuningCost": 1,
        "masteryPools": 0,
        "rarity": "legendary",
        "conflicts": []
      },
      {
        "name": "Directed Release",
        "description": "Bias release along the player's current heading instead of purely outward, with a visible release direction. Capturing a satellite does not itself score it.",
        "key": "capstone",
        "kind": "capstone",
        "effects": [
          "capstone"
        ],
        "seedCost": 8,
        "tuningCost": 2,
        "masteryPools": 3,
        "rarity": "mythic",
        "conflicts": []
      }
    ],
    "included": []
  },
  "echo": {
    "name": "Echo",
    "type": "Propagation",
    "tier": 1,
    "current": "A ghost follows the actual player path half a second later, can deviate on an elastic leash and gently seeks nearby unhit bubbles.",
    "today": [
      "foundation",
      "a"
    ],
    "uncertain": false,
    "compatible": true,
    "nodes": [
      {
        "name": "Echo",
        "description": "The delayed path follower with smooth interpolation and shared scoring.",
        "key": "base",
        "kind": "base",
        "effects": [],
        "seedCost": 4,
        "tuningCost": 0,
        "masteryPools": 0,
        "rarity": "common",
        "conflicts": []
      },
      {
        "name": "Elastic Echo",
        "description": "Give the delayed ghost a stronger elastic deflection and spring response. Smooth movement back toward its route is always included.",
        "key": "foundation",
        "kind": "foundation",
        "effects": [
          "foundation"
        ],
        "seedCost": 3,
        "tuningCost": 1,
        "masteryPools": 0,
        "rarity": "rare",
        "conflicts": []
      },
      {
        "name": "Seeking Echo",
        "description": "Gently steer the Echo toward nearby unhit bubbles beside its delayed path.",
        "key": "a",
        "kind": "a",
        "effects": [
          "a"
        ],
        "seedCost": 5,
        "tuningCost": 1,
        "masteryPools": 0,
        "rarity": "rare",
        "conflicts": []
      },
      {
        "name": "Wide Echo",
        "description": "Let the Echo stray farther from its delayed path. Combine with Seeking echo to reach more nearby bubbles.",
        "key": "b",
        "kind": "b",
        "effects": [
          "b"
        ],
        "seedCost": 5,
        "tuningCost": 1,
        "masteryPools": 0,
        "rarity": "epic",
        "conflicts": []
      },
      {
        "name": "Final Reply",
        "description": "When the main player settles, let the existing ghost finish its queued half-second route. It does not spawn another ghost, refresh itself or repeat already-earned contacts.",
        "key": "capstone",
        "kind": "capstone",
        "effects": [
          "capstone"
        ],
        "seedCost": 8,
        "tuningCost": 2,
        "masteryPools": 3,
        "rarity": "legendary",
        "conflicts": []
      }
    ],
    "included": []
  },
  "split": {
    "name": "Split",
    "type": "Propagation",
    "tier": 2,
    "current": "Two temporary side seeds accompany the main player for three seconds, sharing hit history, power pickups and several active effects.",
    "today": [
      "foundation"
    ],
    "uncertain": false,
    "compatible": true,
    "nodes": [
      {
        "name": "Split",
        "description": "One side seed for three seconds, with functional contact power activation from the start.",
        "key": "base",
        "kind": "base",
        "effects": [],
        "seedCost": 4,
        "tuningCost": 0,
        "masteryPools": 0,
        "rarity": "rare",
        "conflicts": []
      },
      {
        "name": "Twin Split",
        "description": "Add the second side seed.",
        "key": "foundation",
        "kind": "foundation",
        "effects": [
          "foundation"
        ],
        "seedCost": 3,
        "tuningCost": 1,
        "masteryPools": 0,
        "rarity": "rare",
        "conflicts": []
      },
      {
        "name": "Wide Fan",
        "description": "Launch at wider opposing angles for coverage.",
        "key": "a",
        "kind": "a",
        "effects": [
          "a"
        ],
        "seedCost": 5,
        "tuningCost": 1,
        "masteryPools": 0,
        "rarity": "epic",
        "conflicts": []
      },
      {
        "name": "Lasting Fan",
        "description": "Keep side seeds alive longer without narrowing their launch angles.",
        "key": "b",
        "kind": "b",
        "effects": [
          "b"
        ],
        "seedCost": 5,
        "tuningCost": 1,
        "masteryPools": 0,
        "rarity": "epic",
        "conflicts": []
      },
      {
        "name": "Reunion",
        "description": "Surviving side seeds bend toward the main player during their final half-second, allowing a converging finish without extra spawns.",
        "key": "capstone",
        "kind": "capstone",
        "effects": [
          "capstone"
        ],
        "seedCost": 8,
        "tuningCost": 2,
        "masteryPools": 3,
        "rarity": "legendary",
        "conflicts": []
      }
    ],
    "included": []
  },
  "relay": {
    "name": "Relay",
    "type": "Propagation",
    "tier": 2,
    "current": "Up to three scored bubbles can each relay one physical contact, scoring a new bubble or collecting its marked power through the shared allowance.",
    "today": [
      "foundation"
    ],
    "uncertain": false,
    "compatible": true,
    "nodes": [
      {
        "name": "Relay",
        "description": "Arm one scored bubble for one transfer; keep power triggering intact.",
        "key": "base",
        "kind": "base",
        "effects": [],
        "seedCost": 4,
        "tuningCost": 0,
        "masteryPools": 0,
        "rarity": "rare",
        "conflicts": []
      },
      {
        "name": "Relay Team",
        "description": "Arm three bubbles for contact transfers instead of one.",
        "key": "foundation",
        "kind": "foundation",
        "effects": [
          "foundation"
        ],
        "seedCost": 3,
        "tuningCost": 1,
        "masteryPools": 0,
        "rarity": "rare",
        "conflicts": []
      },
      {
        "name": "Strong Pass",
        "description": "A successful relay gives its recipient a small directional push.",
        "key": "a",
        "kind": "a",
        "effects": [
          "a"
        ],
        "seedCost": 5,
        "tuningCost": 1,
        "masteryPools": 0,
        "rarity": "epic",
        "conflicts": []
      },
      {
        "name": "Patient Pass",
        "description": "An armed bubble retains its opportunity until the flight ends rather than a short effect timeout.",
        "key": "b",
        "kind": "b",
        "effects": [
          "b"
        ],
        "seedCost": 5,
        "tuningCost": 1,
        "masteryPools": 0,
        "rarity": "epic",
        "conflicts": []
      },
      {
        "name": "Second Pass",
        "description": "One successful relay per shot can arm its recipient for one additional transfer. Tag its lineage so it cannot return to an already-used relay or branch recursively.",
        "key": "capstone",
        "kind": "capstone",
        "effects": [
          "capstone"
        ],
        "seedCost": 8,
        "tuningCost": 2,
        "masteryPools": 3,
        "rarity": "legendary",
        "conflicts": []
      }
    ],
    "included": []
  },
  "rewind": {
    "name": "Rewind",
    "type": "Propagation",
    "tier": 3,
    "current": "The player retraces recent flight positions at the end of the flight, potentially meeting previously untouched moving bubbles.",
    "today": [],
    "uncertain": false,
    "legacyMatch": false,
    "compatible": true,
    "nodes": [
      {
        "name": "Rewind",
        "description": "Retrace the final one second of valid path, with shared hit history.",
        "key": "base",
        "kind": "base",
        "effects": [],
        "seedCost": 4,
        "tuningCost": 0,
        "masteryPools": 0,
        "rarity": "epic",
        "conflicts": []
      },
      {
        "name": "Longer Memory",
        "description": "Retain up to two seconds for the encore.",
        "key": "foundation",
        "kind": "foundation",
        "effects": [
          "foundation"
        ],
        "seedCost": 3,
        "tuningCost": 1,
        "masteryPools": 0,
        "rarity": "epic",
        "conflicts": []
      },
      {
        "name": "Gentle Rewind",
        "description": "Replay more slowly, allowing drifting bubbles to enter the route.",
        "key": "a",
        "kind": "a",
        "effects": [
          "a"
        ],
        "seedCost": 5,
        "tuningCost": 1,
        "masteryPools": 0,
        "rarity": "legendary",
        "conflicts": []
      },
      {
        "name": "Offset Rewind",
        "description": "Return on a small parallel offset with softened joins; do not invent intermediate travel across teleport discontinuities.",
        "key": "b",
        "kind": "b",
        "effects": [
          "b"
        ],
        "seedCost": 5,
        "tuningCost": 1,
        "masteryPools": 0,
        "rarity": "legendary",
        "conflicts": []
      },
      {
        "name": "Final Burst",
        "description": "A bloom earned during the return produces a brief accent and one bounded radial bubble push. It does not schedule another Rewind.",
        "key": "capstone",
        "kind": "capstone",
        "effects": [
          "capstone"
        ],
        "seedCost": 8,
        "tuningCost": 2,
        "masteryPools": 3,
        "rarity": "mythic",
        "conflicts": []
      }
    ],
    "included": []
  },
  "lightning": {
    "name": "Lightning",
    "type": "Propagation",
    "tier": 3,
    "current": "Three sequential strikes knock distinct bubbles away. The strike events themselves do not call the contact-scoring path.",
    "today": [
      "foundation"
    ],
    "uncertain": false,
    "compatible": true,
    "nodes": [
      {
        "name": "Lightning",
        "description": "Two strikes with clear target cues; retain the physical knockback role.",
        "key": "base",
        "kind": "base",
        "effects": [],
        "seedCost": 4,
        "tuningCost": 0,
        "masteryPools": 0,
        "rarity": "epic",
        "conflicts": []
      },
      {
        "name": "Third Strike",
        "description": "Restore the third strike.",
        "key": "foundation",
        "kind": "foundation",
        "effects": [
          "foundation"
        ],
        "seedCost": 3,
        "tuningCost": 1,
        "masteryPools": 0,
        "rarity": "epic",
        "conflicts": []
      },
      {
        "name": "Spread",
        "description": "Choose separated unhit targets for wider rearrangement.",
        "key": "a",
        "kind": "a",
        "effects": [
          "a"
        ],
        "seedCost": 5,
        "tuningCost": 1,
        "masteryPools": 0,
        "rarity": "legendary",
        "conflicts": []
      },
      {
        "name": "Strong Strike",
        "description": "Increase the knockback of every strike while keeping Spread targeting.",
        "key": "b",
        "kind": "b",
        "effects": [
          "b"
        ],
        "seedCost": 5,
        "tuningCost": 1,
        "masteryPools": 0,
        "rarity": "legendary",
        "conflicts": []
      },
      {
        "name": "Charged Relay",
        "description": "The first struck bubble carries one Relay-like physical transfer into a different bubble. This can score or collect one marker only when that subsequent collision occurs; lightning flashes alone never award three free hits.",
        "key": "capstone",
        "kind": "capstone",
        "effects": [
          "capstone"
        ],
        "seedCost": 8,
        "tuningCost": 2,
        "masteryPools": 3,
        "rarity": "mythic",
        "conflicts": []
      }
    ],
    "included": []
  },
  "pulse": {
    "name": "Pulse",
    "type": "Propagation",
    "tier": 3,
    "current": "Three tempo-spaced pressure waves originate at random positions across the pool, moving bubbles rather than directly scoring contacts.",
    "today": [
      "foundation"
    ],
    "uncertain": false,
    "compatible": true,
    "nodes": [
      {
        "name": "Pulse",
        "description": "Two waves at independently seeded field positions.",
        "key": "base",
        "kind": "base",
        "effects": [],
        "seedCost": 4,
        "tuningCost": 0,
        "masteryPools": 0,
        "rarity": "epic",
        "conflicts": []
      },
      {
        "name": "Third Wave",
        "description": "Restore the third wave.",
        "key": "foundation",
        "kind": "foundation",
        "effects": [
          "foundation"
        ],
        "seedCost": 3,
        "tuningCost": 1,
        "masteryPools": 0,
        "rarity": "epic",
        "conflicts": []
      },
      {
        "name": "Strong Pulse",
        "description": "Strengthen every pressure wave without slowing its cadence.",
        "key": "a",
        "kind": "a",
        "effects": [
          "a"
        ],
        "seedCost": 5,
        "tuningCost": 1,
        "masteryPools": 0,
        "rarity": "legendary",
        "conflicts": []
      },
      {
        "name": "Quick Pulse",
        "description": "Shorten the interval between waves without weakening them.",
        "key": "b",
        "kind": "b",
        "effects": [
          "b"
        ],
        "seedCost": 5,
        "tuningCost": 1,
        "masteryPools": 0,
        "rarity": "legendary",
        "conflicts": []
      },
      {
        "name": "Shifting Center",
        "description": "Bias the final wave toward a region with more unhit bubbles, with a visible pre-cue. It remains a field wave, never becomes a player-centered pulse.",
        "key": "capstone",
        "kind": "capstone",
        "effects": [
          "capstone"
        ],
        "seedCost": 8,
        "tuningCost": 2,
        "masteryPools": 3,
        "rarity": "mythic",
        "conflicts": []
      }
    ],
    "included": []
  },
  "swap": {
    "name": "Swap",
    "type": "Navigation",
    "tier": 1,
    "current": "Exchanges the player with the farthest other bubble while keeping movement.",
    "today": [
      "base"
    ],
    "uncertain": false,
    "compatible": true,
    "nodes": [
      {
        "name": "Swap",
        "description": "Exchange places with a distant unhit bubble when one exists, and keep moving.",
        "key": "base",
        "kind": "base",
        "effects": [],
        "seedCost": 4,
        "tuningCost": 0,
        "masteryPools": 0,
        "rarity": "common",
        "conflicts": []
      },
      {
        "name": "Forward Swap",
        "description": "Prefer a distant destination in the current forward half of the field.",
        "key": "a",
        "kind": "a",
        "effects": [
          "a"
        ],
        "seedCost": 5,
        "tuningCost": 1,
        "masteryPools": 0,
        "rarity": "rare",
        "conflicts": []
      },
      {
        "name": "Open Swap",
        "description": "Prefer a distant bubble with more free space around it.",
        "key": "b",
        "kind": "b",
        "effects": [
          "b"
        ],
        "seedCost": 5,
        "tuningCost": 1,
        "masteryPools": 0,
        "rarity": "epic",
        "conflicts": []
      },
      {
        "name": "Departure Ripple",
        "description": "One modest pressure wave at the departure point changes the next approach. The swapped bubble does not count as contacted merely because it teleported.",
        "key": "capstone",
        "kind": "capstone",
        "effects": [
          "capstone"
        ],
        "seedCost": 8,
        "tuningCost": 2,
        "masteryPools": 3,
        "rarity": "legendary",
        "conflicts": []
      }
    ],
    "included": [
      "foundation"
    ],
    "legacyNodes": [
      {
        "name": "Untouched Destination",
        "description": "Prefer the farthest unhit bubble when one exists.",
        "key": "foundation",
        "kind": "foundation",
        "effects": [
          "foundation"
        ],
        "seedCost": 3,
        "tuningCost": 1,
        "masteryPools": 0,
        "rarity": "rare",
        "conflicts": []
      }
    ]
  },
  "portal": {
    "name": "Portal",
    "type": "Navigation",
    "tier": 2,
    "current": "Paired gates preserve player velocity and have crossing protection against immediate ping-pong.",
    "today": [
      "base"
    ],
    "uncertain": false,
    "compatible": true,
    "nodes": [
      {
        "name": "Portal",
        "description": "Open one pair of gates for five seconds.",
        "key": "base",
        "kind": "base",
        "effects": [],
        "seedCost": 4,
        "tuningCost": 0,
        "masteryPools": 0,
        "rarity": "rare",
        "conflicts": []
      },
      {
        "name": "Wide Gates",
        "description": "Larger capture radius, same crossing cooldown.",
        "key": "a",
        "kind": "a",
        "effects": [
          "a"
        ],
        "seedCost": 5,
        "tuningCost": 1,
        "masteryPools": 0,
        "rarity": "epic",
        "conflicts": []
      },
      {
        "name": "Aimed Exit",
        "description": "Rotate the outgoing heading slightly toward a nearby forward unhit bubble, showing the exit arrow in advance.",
        "key": "b",
        "kind": "b",
        "effects": [
          "b"
        ],
        "seedCost": 5,
        "tuningCost": 1,
        "masteryPools": 0,
        "rarity": "epic",
        "conflicts": []
      },
      {
        "name": "Gate Current",
        "description": "Each gate emits a weak outward bubble current while active. It moves bubbles without teleporting or scoring them.",
        "key": "capstone",
        "kind": "capstone",
        "effects": [
          "capstone"
        ],
        "seedCost": 8,
        "tuningCost": 2,
        "masteryPools": 3,
        "rarity": "legendary",
        "conflicts": []
      }
    ],
    "included": [
      "foundation"
    ],
    "legacyNodes": [
      {
        "name": "Stable Gates",
        "description": "Keep both gates open for five seconds instead of three.",
        "key": "foundation",
        "kind": "foundation",
        "effects": [
          "foundation"
        ],
        "seedCost": 3,
        "tuningCost": 1,
        "masteryPools": 0,
        "rarity": "rare",
        "conflicts": []
      }
    ]
  },
  "homing": {
    "name": "Homing",
    "type": "Navigation",
    "tier": 2,
    "current": "Five seconds of bounded steering toward nearby unhit bubbles ahead, without extra speed, also affecting Split seeds.",
    "today": [
      "base"
    ],
    "uncertain": false,
    "compatible": true,
    "nodes": [
      {
        "name": "Homing",
        "description": "Five seconds of bounded forward seeking with visible target brackets.",
        "key": "base",
        "kind": "base",
        "effects": [],
        "seedCost": 4,
        "tuningCost": 0,
        "masteryPools": 0,
        "rarity": "rare",
        "conflicts": []
      },
      {
        "name": "Long Pursuit",
        "description": "Look farther ahead for unhit bubbles without reducing the turn rate.",
        "key": "a",
        "kind": "a",
        "effects": [
          "a"
        ],
        "seedCost": 5,
        "tuningCost": 1,
        "masteryPools": 0,
        "rarity": "epic",
        "conflicts": []
      },
      {
        "name": "Close Pursuit",
        "description": "Turn more strongly toward a target without shortening look-ahead.",
        "key": "b",
        "kind": "b",
        "effects": [
          "b"
        ],
        "seedCost": 5,
        "tuningCost": 1,
        "masteryPools": 0,
        "rarity": "epic",
        "conflicts": []
      },
      {
        "name": "Role Guidance",
        "description": "Prefer a still-needed musical role for this pool when a valid target of that role is within the normal forward cone; otherwise use normal targeting. Never turn backward automatically to satisfy a checklist.",
        "key": "capstone",
        "kind": "capstone",
        "effects": [
          "capstone"
        ],
        "seedCost": 8,
        "tuningCost": 2,
        "masteryPools": 3,
        "rarity": "legendary",
        "conflicts": []
      }
    ],
    "included": [
      "foundation"
    ],
    "legacyNodes": [
      {
        "name": "Long Guidance",
        "description": "Extend to five seconds.",
        "key": "foundation",
        "kind": "foundation",
        "effects": [
          "foundation"
        ],
        "seedCost": 3,
        "tuningCost": 1,
        "masteryPools": 0,
        "rarity": "rare",
        "conflicts": []
      }
    ]
  },
  "wrap": {
    "name": "Wrap",
    "type": "Navigation",
    "tier": 3,
    "current": "Five seconds of opposite-edge teleportation for the player and Split seeds, preserving velocity; it overrides wall bouncing and does not award a bank.",
    "today": [
      "base"
    ],
    "uncertain": false,
    "compatible": true,
    "nodes": [
      {
        "name": "Wrap",
        "description": "Cross a pool edge to emerge on the opposite side, retaining velocity, for five seconds.",
        "key": "base",
        "kind": "base",
        "effects": [],
        "seedCost": 4,
        "tuningCost": 0,
        "masteryPools": 0,
        "rarity": "epic",
        "conflicts": []
      },
      {
        "name": "Departure Push",
        "description": "Push nearby bubbles away from the departure point. All four edges remain usable.",
        "key": "a",
        "kind": "a",
        "effects": [
          "a"
        ],
        "seedCost": 5,
        "tuningCost": 1,
        "masteryPools": 0,
        "rarity": "legendary",
        "conflicts": []
      },
      {
        "name": "Arrival Push",
        "description": "Push nearby bubbles away from the exit. Adds to Departure Push; all four edges remain usable.",
        "key": "b",
        "kind": "b",
        "effects": [
          "b"
        ],
        "seedCost": 5,
        "tuningCost": 1,
        "masteryPools": 0,
        "rarity": "legendary",
        "conflicts": []
      },
      {
        "name": "Arrival Field",
        "description": "Strengthen and widen the arrival push. All four edges remain usable.",
        "key": "capstone",
        "kind": "capstone",
        "effects": [
          "capstone"
        ],
        "seedCost": 8,
        "tuningCost": 2,
        "masteryPools": 3,
        "rarity": "mythic",
        "conflicts": []
      }
    ],
    "included": [
      "foundation"
    ],
    "legacyNodes": [
      {
        "name": "Long Wrap",
        "description": "Extend to five seconds.",
        "key": "foundation",
        "kind": "foundation",
        "effects": [
          "foundation"
        ],
        "seedCost": 3,
        "tuningCost": 1,
        "masteryPools": 0,
        "rarity": "epic",
        "conflicts": []
      }
    ]
  },
  "slingshot": {
    "name": "Slingshot",
    "type": "Navigation",
    "tier": 3,
    "current": "Briefly orbits the marked bubble, then launches toward an unhit bubble.",
    "today": [
      "base"
    ],
    "uncertain": false,
    "compatible": true,
    "nodes": [
      {
        "name": "Slingshot",
        "description": "Briefly orbit the contacted bubble, then automatically aim the release toward an unhit bubble, leading its motion with a clear direction cue.",
        "key": "base",
        "kind": "base",
        "effects": [],
        "seedCost": 4,
        "tuningCost": 0,
        "masteryPools": 0,
        "rarity": "epic",
        "conflicts": []
      },
      {
        "name": "Forward Target",
        "description": "Prefer the nearest unhit target ahead when releasing.",
        "key": "a",
        "kind": "a",
        "effects": [
          "a"
        ],
        "seedCost": 5,
        "tuningCost": 1,
        "masteryPools": 0,
        "rarity": "legendary",
        "conflicts": []
      },
      {
        "name": "Strong Launch",
        "description": "Increase release speed without replacing Forward Target or motion prediction.",
        "key": "b",
        "kind": "b",
        "effects": [
          "b"
        ],
        "seedCost": 5,
        "tuningCost": 1,
        "masteryPools": 0,
        "rarity": "legendary",
        "conflicts": []
      },
      {
        "name": "Second Orbit",
        "description": "One later contact with the specifically previewed release target can produce one shorter slingshot. The capstone supplies its own previewed target choice when no aiming upgrade is equipped; it works with the base alone. It cannot repeat a third time.",
        "key": "capstone",
        "kind": "capstone",
        "effects": [
          "capstone"
        ],
        "seedCost": 8,
        "tuningCost": 2,
        "masteryPools": 3,
        "rarity": "mythic",
        "conflicts": []
      }
    ],
    "included": [
      "foundation"
    ],
    "legacyNodes": [
      {
        "name": "Aimed Release",
        "description": "Aim releases toward unhit bubbles and lead moving targets. Also improves the lead when combined with Near target or Far target.",
        "key": "foundation",
        "kind": "foundation",
        "effects": [
          "foundation"
        ],
        "seedCost": 3,
        "tuningCost": 1,
        "masteryPools": 0,
        "rarity": "epic",
        "conflicts": []
      }
    ]
  },
  "blaster": {
    "name": "Blaster",
    "type": "Propagation",
    "tier": 1,
    "current": "Contact starts three automatically aimed shots at a steady cadence. Impacts push bubbles and play their notes; no player input is needed.",
    "today": [
      "base"
    ],
    "uncertain": false,
    "compatible": true,
    "nodes": [
      {
        "name": "Blaster",
        "description": "Automatically aim and fire three gel shots after contact. No aiming, tapping or firing controls. Each bubble scores once per shot.",
        "key": "base",
        "kind": "base",
        "effects": [],
        "seedCost": 4,
        "tuningCost": 0,
        "masteryPools": 0,
        "rarity": "common",
        "conflicts": []
      },
      {
        "name": "Extra Magazine",
        "description": "Carry five shots instead of three.",
        "key": "foundation",
        "kind": "foundation",
        "effects": [
          "foundation"
        ],
        "seedCost": 3,
        "tuningCost": 1,
        "masteryPools": 0,
        "rarity": "rare",
        "conflicts": []
      },
      {
        "name": "Bank Shot",
        "description": "Shots bounce once off a wall. Projectile banks do not count as player wall banks.",
        "key": "a",
        "kind": "a",
        "effects": [
          "a"
        ],
        "seedCost": 5,
        "tuningCost": 1,
        "masteryPools": 0,
        "rarity": "rare",
        "conflicts": []
      },
      {
        "name": "Scatter Shot",
        "description": "Fire three pellets in a short fan for one ammunition. Each bubble can be struck only once per volley.",
        "key": "b",
        "kind": "b",
        "effects": [
          "b"
        ],
        "seedCost": 5,
        "tuningCost": 1,
        "masteryPools": 0,
        "rarity": "epic",
        "conflicts": []
      },
      {
        "name": "Bloom Reload",
        "description": "The first bloom after activation refills your magazine once this shot.",
        "key": "capstone",
        "kind": "capstone",
        "effects": [
          "capstone"
        ],
        "seedCost": 8,
        "tuningCost": 2,
        "masteryPools": 3,
        "rarity": "legendary",
        "conflicts": []
      }
    ],
    "included": []
  }
};
