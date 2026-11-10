// Proposed v2 behavior data. Engine support is declared separately in catalogue.js.
export const POWER_TREES = {
  "comet": {
    "name": "Comet",
    "family": "Motion",
    "tier": 1,
    "current": "A strong launch burst plus enhanced momentum retention through jelly and wall bounces for the pluck.",
    "today": [
      "foundation"
    ],
    "uncertain": false,
    "compatible": true,
    "nodes": [
      {
        "name": "Comet",
        "description": "Burst forward on contact, within the normal speed limit."
      },
      {
        "name": "Momentum",
        "description": "Retain more speed after bouncing off jellies and walls."
      },
      {
        "name": "Bank charge",
        "description": "The next genuine wall bounce after a new jelly contact gains a small speed boost, once per contact."
      },
      {
        "name": "Long flight",
        "description": "Halve Comet's late-flight drag while it is active; still settle naturally and respect the shot ceiling."
      },
      {
        "name": "Meteor wake",
        "description": "Comet bank charges emit a small outward jelly push at the wall, at most twice per pluck. Without A, the first two ordinary banks emit the same push; neither modifier nor Foundation is required."
      }
    ]
  },
  "impact": {
    "name": "Impact",
    "family": "Motion",
    "tier": 2,
    "current": "Strong activation knockback and stronger later player collision pushes.",
    "today": [
      "foundation"
    ],
    "uncertain": false,
    "compatible": false,
    "nodes": [
      {
        "name": "Impact",
        "description": "Strengthen the activating collision."
      },
      {
        "name": "Follow through",
        "description": "Extend enhanced pushes to later contacts during this pluck."
      },
      {
        "name": "Focused impact",
        "description": "Narrow, stronger forward pushes suited to directing a jelly."
      },
      {
        "name": "Broad impact",
        "description": "Weaker radial pushes around the contacted jelly, suited to opening clusters."
      },
      {
        "name": "Transfer",
        "description": "The first two newly contacted jellies carry one additional physical shove into another jelly. This shove alone neither scores nor triggers another Impact transfer."
      }
    ]
  },
  "spring": {
    "name": "Spring",
    "family": "Motion",
    "tier": 2,
    "current": "Five seconds of stronger wall rebounds for the player and physical Split seeds, with elastic wall deformation.",
    "today": [
      "foundation"
    ],
    "uncertain": false,
    "compatible": true,
    "nodes": [
      {
        "name": "Spring",
        "description": "The current rebound behavior for three seconds; retain its readable wall recoil."
      },
      {
        "name": "Lasting spring",
        "description": "Extend to five seconds."
      },
      {
        "name": "Deep rebound",
        "description": "Stronger outward return, with the existing speed ceiling."
      },
      {
        "name": "Angled rebound",
        "description": "Bias a rebound slightly toward the nearest forward unhit jelly; show the bias in its cue."
      },
      {
        "name": "Resonant wall",
        "description": "First two spring rebounds also push nearby jellies inward, creating bank opportunities rather than free score."
      }
    ]
  },
  "drunk": {
    "name": "Drunk",
    "family": "Motion",
    "tier": 3,
    "current": "Smooth side-to-side steering for four seconds, also affecting physical Split seeds, without extra drag.",
    "today": [
      "base"
    ],
    "uncertain": false,
    "compatible": false,
    "nodes": [
      {
        "name": "Drunk",
        "description": "The current smooth four-second swerve."
      },
      {
        "name": "Rhythm sway",
        "description": "Align its direction changes to the musical pulse without changing launch timing."
      },
      {
        "name": "Narrow sway",
        "description": "Smaller lateral deviation for threading lanes."
      },
      {
        "name": "Wide sway",
        "description": "Larger sweeps for coverage, with lower turn acceleration to remain readable."
      },
      {
        "name": "Shared sway",
        "description": "Nearby unhit jellies receive a weak matching sideways current. Cap affected bodies at three; it does not continuously attract them."
      }
    ]
  },
  "ripple": {
    "name": "Ripple",
    "family": "Flow",
    "tier": 1,
    "current": "An outward radial impulse on nearby jellies.",
    "today": [
      "base"
    ],
    "uncertain": false,
    "compatible": false,
    "nodes": [
      {
        "name": "Ripple",
        "description": "Send a pressure wave outward, pushing nearby jellies away."
      },
      {
        "name": "Wide ripple",
        "description": "Expand its reach by 20 percent without increasing center strength."
      },
      {
        "name": "Strong center",
        "description": "Concentrate the impulse near the origin, opening a tight cluster."
      },
      {
        "name": "Far shore",
        "description": "Flatter falloff, reaching more distant jellies with weaker central force."
      },
      {
        "name": "Returning ripple",
        "description": "One weaker inward wave follows after half a second. It moves bodies but cannot score or recursively create waves."
      }
    ]
  },
  "attract": {
    "name": "Attract",
    "family": "Flow",
    "tier": 1,
    "current": "An immediate inward impulse that gathers nearby jellies.",
    "today": [
      "base"
    ],
    "uncertain": false,
    "compatible": false,
    "nodes": [
      {
        "name": "Attract",
        "description": "Pull nearby jellies toward the contact point with one gathering impulse."
      },
      {
        "name": "Deep attraction",
        "description": "Increase useful reach by 20 percent."
      },
      {
        "name": "Tight group",
        "description": "Stronger attraction with a soft inner spacing limit to prevent a pile of overlapping bodies."
      },
      {
        "name": "Loose ring",
        "description": "Gather into a ring around the contact location, leaving a navigable center."
      },
      {
        "name": "Release",
        "description": "After the gathering phase, emit a modest outward release. This makes timing meaningful instead of holding the pool in a permanent clump."
      }
    ]
  },
  "vortex": {
    "name": "Vortex",
    "family": "Flow",
    "tier": 2,
    "current": "A tangential impulse sets nearby jellies swirling.",
    "today": [
      "base"
    ],
    "uncertain": false,
    "compatible": false,
    "nodes": [
      {
        "name": "Vortex",
        "description": "The tangential swirl."
      },
      {
        "name": "Sustained current",
        "description": "Continue a weaker swirl for one second."
      },
      {
        "name": "Spiral in",
        "description": "Add a small inward component."
      },
      {
        "name": "Spiral out",
        "description": "Add a small outward component."
      },
      {
        "name": "Moving center",
        "description": "A weak one-second swirl follows the player slowly, even without Sustained current; it cannot jump through Wrap or Portal, and fades at that discontinuity."
      }
    ]
  },
  "magnet": {
    "name": "Magnet",
    "family": "Flow",
    "tier": 2,
    "current": "The moving player attracts unhit jellies for 2.4 seconds.",
    "today": [
      "base"
    ],
    "uncertain": false,
    "compatible": false,
    "nodes": [
      {
        "name": "Magnet",
        "description": "The current selective attraction; keep already-hit jellies excluded."
      },
      {
        "name": "Lasting magnet",
        "description": "Extend to 3.2 seconds."
      },
      {
        "name": "Close pull",
        "description": "Stronger nearby pull and shorter reach."
      },
      {
        "name": "Distant pull",
        "description": "Wider reach and weaker force."
      },
      {
        "name": "Polarity",
        "description": "Newly hit jellies receive one small outward release, clearing the path for the unhit bodies still being drawn in."
      }
    ]
  },
  "wake": {
    "name": "Wake",
    "family": "Flow",
    "tier": 3,
    "current": "Five seconds of player and Split trails that push crossing jellies along the flight direction.",
    "today": [
      "foundation"
    ],
    "uncertain": false,
    "compatible": false,
    "nodes": [
      {
        "name": "Wake",
        "description": "Three seconds of current deposition, with the existing finite trail lifetime."
      },
      {
        "name": "Long wake",
        "description": "Restore five seconds of deposition."
      },
      {
        "name": "Narrow jet",
        "description": "Narrower trail with stronger directional force."
      },
      {
        "name": "Broad current",
        "description": "Wider trail with weaker force."
      },
      {
        "name": "Crossing currents",
        "description": "When two separated trail segments overlap, create one small eddy there. At most two eddies per pluck, each lasting one second."
      }
    ]
  },
  "stasis": {
    "name": "Stasis",
    "family": "Control",
    "tier": 1,
    "current": "Slows nearby jellies and later contacts, shows frosted edges and reduced squish, and makes hit frozen jellies translucent and permeable with pressure on the player.",
    "today": [
      "foundation"
    ],
    "uncertain": false,
    "compatible": false,
    "nodes": [
      {
        "name": "Stasis",
        "description": "Frost a smaller area, slowing jellies and stiffening their edges. Hit frozen jellies remain translucent and permeable, with gentle pressure instead of a hard rebound."
      },
      {
        "name": "Deep frost",
        "description": "Restore the current broad radius."
      },
      {
        "name": "Firm ice",
        "description": "Lower the jelly speed cap, making the arrangement more stable."
      },
      {
        "name": "Thin ice",
        "description": "Retain more jelly motion, but reduce their outward pressure on the player for easier threading."
      },
      {
        "name": "Frost spread",
        "description": "The first two physical jelly-to-jelly contacts from a frozen jelly frost one additional body each. Spreading itself earns no hit or power pickup."
      }
    ]
  },
  "bubble": {
    "name": "Bubble",
    "family": "Control",
    "tier": 2,
    "current": "An enlarged permeable shell scores on contact and pushes jellies outward by a radius gradient, with a smaller opposing pressure on the player.",
    "today": [],
    "uncertain": true,
    "compatible": false,
    "nodes": [
      {
        "name": "Bubble",
        "description": "Retain this soft interaction at a modest shell size. There is no solid collision core to unlock away."
      },
      {
        "name": "Large bubble",
        "description": "Increase shell radius by 20 percent, while respecting the pool bounds."
      },
      {
        "name": "Soft bubble",
        "description": "Weaker pressure on both sides; easier to envelop a cluster."
      },
      {
        "name": "Firm bubble",
        "description": "Stronger outward jelly pressure and a slightly stronger player reaction; better at reorganizing the pool."
      },
      {
        "name": "Breathing bubble",
        "description": "Radius gently expands and contracts by 10 percent on the pulse. Contact still counts once per jelly, and radius changes never impart an instant bounce."
      }
    ]
  },
  "tether": {
    "name": "Tether",
    "family": "Control",
    "tier": 2,
    "current": "Three jellies gain elastic links, musical thread cues and a gentle drift toward the moving player for up to four seconds.",
    "today": [
      "foundation"
    ],
    "uncertain": false,
    "compatible": false,
    "nodes": [
      {
        "name": "Tether",
        "description": "Two linked jellies, with a gentle playerward drift preserved as the power's identity."
      },
      {
        "name": "Third thread",
        "description": "Add the third jelly and full triangular linkage."
      },
      {
        "name": "Gathering thread",
        "description": "Stronger playerward drift with softer links."
      },
      {
        "name": "Elastic thread",
        "description": "Firmer links and stronger motion transfer, with the base drift unchanged."
      },
      {
        "name": "Release knot",
        "description": "When the effect expires, release stored stretch as one bounded impulse per member. No teleporting or stored-energy explosion."
      }
    ]
  },
  "orbit": {
    "name": "Orbit",
    "family": "Control",
    "tier": 3,
    "current": "Gathers up to two unhit satellites for three seconds and flings them outward.",
    "today": [
      "foundation"
    ],
    "uncertain": false,
    "compatible": false,
    "nodes": [
      {
        "name": "Orbit",
        "description": "One satellite with its existing release behavior."
      },
      {
        "name": "Twin orbit",
        "description": "Allow two satellites."
      },
      {
        "name": "Close orbit",
        "description": "Smaller radius and shorter gathering time."
      },
      {
        "name": "Wide orbit",
        "description": "Larger radius and slower rotation, sweeping more space."
      },
      {
        "name": "Directed release",
        "description": "Bias release along the player's current heading instead of purely outward, with a visible release direction. Capturing a satellite does not itself score it."
      }
    ]
  },
  "echo": {
    "name": "Echo",
    "family": "Propagation",
    "tier": 1,
    "current": "A ghost follows the actual player path half a second later, can deviate on an elastic leash and gently seeks nearby unhit jellies.",
    "today": [
      "foundation",
      "a"
    ],
    "uncertain": false,
    "compatible": true,
    "nodes": [
      {
        "name": "Echo",
        "description": "The delayed path follower with smooth interpolation and shared scoring."
      },
      {
        "name": "Elastic echo",
        "description": "Give the delayed ghost a stronger elastic deflection and spring response. Smooth movement back toward its route is always included."
      },
      {
        "name": "Seeking echo",
        "description": "Add gentle attraction toward nearby unhit jellies, including its own bounded smooth deviation when Foundation is absent."
      },
      {
        "name": "Wide echo",
        "description": "Use a longer leash for broader coverage. Alone it favors physical deflection; combined with Seeking echo it permits wider bounded seeking. Neither requires Foundation."
      },
      {
        "name": "Final reply",
        "description": "When the main player settles, let the existing ghost finish its queued half-second route. It does not spawn another ghost, refresh itself or repeat already-earned contacts."
      }
    ]
  },
  "split": {
    "name": "Split",
    "family": "Propagation",
    "tier": 2,
    "current": "Two temporary side seeds accompany the main player for three seconds, sharing hit history, power pickups and several active effects.",
    "today": [
      "foundation"
    ],
    "uncertain": false,
    "compatible": false,
    "nodes": [
      {
        "name": "Split",
        "description": "One side seed for three seconds, with functional contact power activation from the start."
      },
      {
        "name": "Twin split",
        "description": "Add the second side seed."
      },
      {
        "name": "Wide fan",
        "description": "Launch at wider opposing angles for coverage."
      },
      {
        "name": "Close fan",
        "description": "Tighter angles and slightly longer life for a focused route."
      },
      {
        "name": "Reunion",
        "description": "Surviving side seeds bend toward the main player during their final half-second, allowing a converging finish without extra spawns."
      }
    ]
  },
  "relay": {
    "name": "Relay",
    "family": "Propagation",
    "tier": 2,
    "current": "Up to three scored jellies can each relay one physical contact, scoring a new jelly or collecting its marked power through the shared allowance.",
    "today": [
      "foundation"
    ],
    "uncertain": false,
    "compatible": true,
    "nodes": [
      {
        "name": "Relay",
        "description": "Arm one scored jelly for one transfer; keep power triggering intact."
      },
      {
        "name": "Relay team",
        "description": "Allow the current three independently armed jellies."
      },
      {
        "name": "Strong pass",
        "description": "A successful relay gives its recipient a small directional push."
      },
      {
        "name": "Patient pass",
        "description": "An armed jelly retains its opportunity until the flight ends rather than a short effect timeout."
      },
      {
        "name": "Second pass",
        "description": "One successful relay per pluck can arm its recipient for one additional transfer. Tag its lineage so it cannot return to an already-used relay or branch recursively."
      }
    ]
  },
  "rewind": {
    "name": "Rewind",
    "family": "Propagation",
    "tier": 3,
    "current": "The player retraces recent flight positions at the end of the flight, potentially meeting previously untouched moving jellies.",
    "today": [],
    "uncertain": true,
    "compatible": true,
    "nodes": [
      {
        "name": "Rewind",
        "description": "Retrace the final one second of valid path, with shared hit history."
      },
      {
        "name": "Longer memory",
        "description": "Retain up to two seconds for the encore."
      },
      {
        "name": "Gentle rewind",
        "description": "Replay more slowly, allowing drifting jellies to enter the route."
      },
      {
        "name": "Offset rewind",
        "description": "Return on a small parallel offset with softened joins; do not invent intermediate travel across teleport discontinuities."
      },
      {
        "name": "Last chord",
        "description": "A bloom earned during the return produces a brief accent and one bounded radial jelly push. It does not schedule another Rewind."
      }
    ]
  },
  "lightning": {
    "name": "Lightning",
    "family": "Propagation",
    "tier": 3,
    "current": "Three sequential strikes knock distinct jellies away. The strike events themselves do not call the contact-scoring path.",
    "today": [
      "foundation"
    ],
    "uncertain": false,
    "compatible": false,
    "nodes": [
      {
        "name": "Lightning",
        "description": "Two strikes with clear target cues; retain the physical knockback role."
      },
      {
        "name": "Third strike",
        "description": "Restore the third strike."
      },
      {
        "name": "Spread",
        "description": "Choose separated unhit targets for wider rearrangement."
      },
      {
        "name": "Cluster",
        "description": "Prefer nearby unhit targets for a local cascade."
      },
      {
        "name": "Charged relay",
        "description": "The first struck jelly carries one Relay-like physical transfer into a different jelly. This can score or collect one marker only when that subsequent collision occurs; lightning flashes alone never award three free hits."
      }
    ]
  },
  "pulse": {
    "name": "Pulse",
    "family": "Propagation",
    "tier": 3,
    "current": "Three tempo-spaced pressure waves originate at random positions across the pool, moving jellies rather than directly scoring contacts.",
    "today": [
      "foundation"
    ],
    "uncertain": false,
    "compatible": false,
    "nodes": [
      {
        "name": "Pulse",
        "description": "Two waves at independently seeded field positions."
      },
      {
        "name": "Third beat",
        "description": "Restore the third wave."
      },
      {
        "name": "Slow pulse",
        "description": "Longer spacing and stronger pressure."
      },
      {
        "name": "Quick pulse",
        "description": "Shorter spacing and weaker pressure."
      },
      {
        "name": "Shifting center",
        "description": "Bias the final wave toward a region with more unhit jellies, with a visible pre-cue. It remains a field wave, never becomes a player-centered pulse."
      }
    ]
  },
  "swap": {
    "name": "Swap",
    "family": "Navigation",
    "tier": 1,
    "current": "Exchanges the player with the farthest other jelly while keeping movement.",
    "today": [
      "base"
    ],
    "uncertain": false,
    "compatible": true,
    "nodes": [
      {
        "name": "Swap",
        "description": "Retain the current swap and preview its destination."
      },
      {
        "name": "Untouched destination",
        "description": "Prefer the farthest unhit jelly when one exists."
      },
      {
        "name": "Forward swap",
        "description": "Prefer a distant destination in the current forward half of the field."
      },
      {
        "name": "Open swap",
        "description": "Prefer a distant jelly with more free space around it."
      },
      {
        "name": "Departure ripple",
        "description": "One modest pressure wave at the departure point changes the next approach. The swapped jelly does not count as contacted merely because it teleported."
      }
    ]
  },
  "portal": {
    "name": "Portal",
    "family": "Navigation",
    "tier": 2,
    "current": "Paired gates preserve player velocity and have crossing protection against immediate ping-pong.",
    "today": [
      "foundation"
    ],
    "uncertain": false,
    "compatible": true,
    "nodes": [
      {
        "name": "Portal",
        "description": "One pair lasting three seconds."
      },
      {
        "name": "Stable gates",
        "description": "Extend to the current five seconds."
      },
      {
        "name": "Wide gates",
        "description": "Larger capture radius, same crossing cooldown."
      },
      {
        "name": "Aimed exit",
        "description": "Rotate the outgoing heading slightly toward a nearby forward unhit jelly, showing the exit arrow in advance."
      },
      {
        "name": "Gate current",
        "description": "Each gate emits a weak outward jelly current while active. It moves jellies without teleporting or scoring them."
      }
    ]
  },
  "homing": {
    "name": "Homing",
    "family": "Navigation",
    "tier": 2,
    "current": "Five seconds of bounded steering toward nearby unhit jellies ahead, without extra speed, also affecting Split seeds.",
    "today": [
      "foundation"
    ],
    "uncertain": false,
    "compatible": false,
    "nodes": [
      {
        "name": "Homing",
        "description": "Three seconds of bounded forward seeking with visible target brackets."
      },
      {
        "name": "Long guidance",
        "description": "Extend to five seconds."
      },
      {
        "name": "Gentle pursuit",
        "description": "Lower turn rate and greater look-ahead, preserving bank routes."
      },
      {
        "name": "Close pursuit",
        "description": "Stronger turns and shorter look-ahead, favoring nearby clusters."
      },
      {
        "name": "Role guidance",
        "description": "Prefer a still-needed musical role for this pool when a valid target of that role is within the normal forward cone; otherwise use normal targeting. Never turn backward automatically to satisfy a checklist."
      }
    ]
  },
  "wrap": {
    "name": "Wrap",
    "family": "Navigation",
    "tier": 3,
    "current": "Five seconds of opposite-edge teleportation for the player and Split seeds, preserving velocity; it overrides wall bouncing and does not award a bank.",
    "today": [
      "foundation"
    ],
    "uncertain": false,
    "compatible": false,
    "nodes": [
      {
        "name": "Wrap",
        "description": "This exact rule for three seconds."
      },
      {
        "name": "Long wrap",
        "description": "Extend to five seconds."
      },
      {
        "name": "Side wrap",
        "description": "Wrap only left and right edges; top and bottom remain bounceable."
      },
      {
        "name": "End wrap",
        "description": "Wrap only top and bottom edges; left and right remain bounceable."
      },
      {
        "name": "Arrival field",
        "description": "A small pressure field at the exit eases nearby jellies aside. It grants no collision immunity or free contact. The base all-edge option remains selectable with neither directional modifier equipped, including when the capstone is active."
      }
    ]
  },
  "slingshot": {
    "name": "Slingshot",
    "family": "Navigation",
    "tier": 3,
    "current": "Briefly orbits the marked jelly, then launches toward an unhit jelly.",
    "today": [
      "foundation"
    ],
    "uncertain": false,
    "compatible": false,
    "nodes": [
      {
        "name": "Slingshot",
        "description": "Retain the orbit and untargeted forward tangential release, with a clear direction cue."
      },
      {
        "name": "Aimed release",
        "description": "Restore general unhit-target selection and lead moving targets. Near target and Far target include their own selection without this node; Foundation improves their moving-target lead when combined."
      },
      {
        "name": "Near target",
        "description": "Favor the nearest reachable forward target."
      },
      {
        "name": "Far target",
        "description": "Favor a farther target for crossing the pool."
      },
      {
        "name": "Second orbit",
        "description": "One later contact with the specifically previewed release target can produce one shorter slingshot. The capstone supplies its own previewed target choice when no aiming upgrade is equipped; it works with the base alone. It cannot repeat a third time."
      }
    ]
  }
};
