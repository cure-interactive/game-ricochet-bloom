# Skill Tree

## One Connected Tree

**Ripple is your starting power.** Every other power and upgrade branches from it. You can eventually research every branch; choosing one does not permanently shut off the others.

Each power has its own linear upgrade chain beneath its base. The number and effects are chosen for that power; there is no fixed upgrade count. Basic utility belongs in the base power, while research adds meaningful changes. Some upgrades also open side branches into new powers. Follow the connecting paths to see which research comes next.

By default, the map shows research you own, retained earned loans, and the next skills whose prerequisites and mastery requirements you have met. These next upgrades stay visible while you save Points or finish a run; their cards explain what is needed before you can buy them. Buying still requires enough Points and being between runs. Hidden nodes and their paths take no map space. Settings → Advanced & About → Development & Backups → **Show Hidden Tracks, Skills and Skins** reveals the complete tree for inspection without unlocking anything. This view preference is remembered and works with either profile.

## Research and Activation

Research costs Points earned through Campaign. Unpurchased skills show their catalogue price beneath the node name with the coin icon. Owned skills hide the price on both the node and its card; ownership remains marked. Development & Backups → **Show Purchased Skill Costs** restores those prices for inspection. It is off by default and remembered in this browser. **Purchases are permanent and cannot be refunded.** Every visible power and upgrade opens a compact tooltip with its matching tree icon, rarity frame and status badge in the top-left. A pill beneath its title shows its type and matching icon. Hover on desktop or tap on mobile to see its description, cost or ownership status, and any unmet requirements. Every tooltip includes stats, with a short explanation beneath each stat title. Bars show quantities such as reach, strength and duration; pips show counts such as shots or targets. Behavior changes use words instead. Exact values stay visible, and each bar uses a consistent scale across that power’s upgrades. Partial bars label the actual value above the fill endpoint and the best reachable value at the right; near-full labels stagger to remain readable. Every bar fills toward a better value for that stat, even when the number decreases: less drag, a lower frozen-jelly speed cap, less frozen-jelly pressure, slower Rewind playback, or a shorter wave interval. A full bar reaches that stat’s best available setting. Style choices without a single best value, such as sway width, fan angle and orbit time, keep exact numbers without a rating bar.

Upgrade previews show before and after values together, including tradeoffs. Each stat has one bar or count strip: solid gray is the retained strength, mint diagonal stripes mark an improvement, and amber hatching marks a tradeoff. The improvement pattern also appears in count pips and the legend. These compare individual stats, not the overall value of a build; a style can improve one stat while weakening another. **Prerequisites → With Upgrade** means the preview includes research you still need; it does not describe your current build. Locked powers show their starting values under **On Unlock**. Active research shows **Current Power**, while inactive owned styles show a **Style Preview**. Every unowned skill card includes an Unlock button; it is enabled only when you can currently purchase it, with a reason shown when disabled.

Unlocking a power adds it to the random powers available in play, including Free Play. Compatible researched upgrades activate automatically. When two upgrades describe conflicting styles, you can switch the active style without losing either purchase.

The final upgrade also needs three qualifying cleared pools in which that power was activated. Existing ownership is preserved when the game's tree changes.

## Rarity and Type

Color identifies rarity, using Cure Interactive’s original badges and palette: **Common** gray, **Rare** blue, **Epic** purple, **Legendary** gold and **Mythic** red. Rarity describes the complexity of the capability; it does not change its drop chance or price. More advanced powers and upgrades occupy higher rarities.

The power reference groups behaviors by **type**:

- **Motion:** player speed, rebounds and steering.
- **Flow:** currents and forces through the pool.
- **Control:** jelly movement, gathering and reactions.
- **Propagation:** extra bodies, projectiles and contact chains.
- **Navigation:** destinations, targeting and travel.

Types describe behavior. They never partition the map or gate research. Each power and skill branches from a specific prerequisite whose effect leads naturally into it. For example, Impact’s Transfer leads to Relay, and Orbit’s Directed Release leads to Slingshot.

## Read the Map

- **Active:** a filled glow in that skill’s rarity color, with a check mark.
- **Owned:** a check mark; rarity color stays the same.
- **Available:** a double outer border.
- **Locked:** a dashed border and lock.

The selected node has a white outline. Its prerequisite path keeps the rarity colors of its skills. Tap Legend at the top right to show all five rarities and the separate ownership states. Tap the expanded card to collapse it and leave more of the tree visible.

Drag to move in two dimensions; pinch or scroll to zoom. Zooming out stops when the visible skills fit the screen, with a small margin. This limit adjusts as skills appear or the screen size changes. Tap any node to inspect it; every unowned skill has an Unlock button. It is enabled when you have enough Points, meet the requirements and are between runs; otherwise it stays visible and explains the restriction. The button remains visible below scrolling stats. Owned and currently unlockable skills are fully bright; unavailable unowned tree nodes are dim, even on the highlighted path. Icons inside skill cards always remain fully bright. Tap elsewhere, close it, or move the map to dismiss it. For an owned conflicting style, open its tooltip and choose Use This Style. Inspecting it alone does not change your powers.

Optional zoom, Fit Tree and Focus buttons are available through Settings → Accessibility → Show on-screen controls. Arrow keys can also move through the map.

[Browse every power and upgrade](power-ups.md).

## Attribution

### Sources

Ricochet Bloom gameplay, campaign, progression and audio source in this release.

### Contributions

#### Codex on behalf of `leviscustempris`

Authored and checked against the game implementation.
