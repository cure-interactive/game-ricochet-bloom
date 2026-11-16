# Skills

## Player Upgrades

Open **Player → Skills** to go straight to player upgrades, or open **Skills** from the main menu and switch between **Powers** and **Player** using the selector at the bottom of its map panel. The Player tree connects Your Player to the Sight, Launch, Rebound, Glide and Steady branches. Tap or click a node to read its effects, prerequisites and Points cost, then unlock it from the detail card. Drag to pan and pinch or scroll to zoom, just like the power tree. Keyboard users can move between nodes with arrow keys and open details with Enter or Space. Hovering does not open a card.

Both trees use the same selector, Points display and map controls. Tap **Powers** or **Player**, or drag the selection; it stays inside its frame and the labels change contrast as it moves. Left-Handed Layout reverses the tab order and moves the surrounding controls. The selected Player icon has a filled backing that follows the bubble shape. The dot background pans and zooms with the tree, fading away at a distance. Distant views simplify artwork and labels; zooming in restores them.

Both trees use the same Points wallet. Purchases are permanent and cumulative; each second player upgrade requires the first in its branch, and every branch can be researched. The **Your Player** root card shows your current player attributes and where upgrades apply. Existing purchases are preserved. Skins remain cosmetic.

- **Sight:** Long Sight costs 80 Points and adds 180 units of aiming guide and 140 units after the first wall bounce. Deep Sight costs 180 Points and adds the same amounts again. The guide shows wall geometry; bubbles and powers can change the actual path.
- **Launch:** The starting maximum is 800 units/second. Strong Launch costs 100 Points and raises it to 900. Greater Launch costs 220 Points and raises it to 1,000. The minimum stays 280, so gentle shots remain available.
- **Rebound:** Ordinary walls retain 94% of speed perpendicular to the wall. Elastic Shell costs 120 Points and raises this to 97%; Perfect Rebound costs 240 Points and raises it to 100%. Stronger power effects still apply, and ordinary flight drag still brings shots to rest. Split seeds share this improvement.

Free Play, Challenge and Endless Waves apply research between shots. Melody Journey applies it from the next pool. Score Attack fixes the build at the start of a new run. Saved shots keep their original behavior. Fixed puzzle trials and shared challenges keep their authored player rules, so personal upgrades cannot alter their challenge conditions.

### Glide and Steady Shell

- **Smooth Glide (60 Points):** 12% less drag during the first three seconds of flight.
- **Silken Glide (140 Points):** 24% less early drag in total. Requires Smooth Glide.
- **Steady Shell (80 Points):** recover 15% of speed lost in solid bubble collisions while keeping the bounce direction.
- **Resilient Shell (180 Points):** recover 30% of lost speed in total. Requires Steady Shell.

Both branches also affect Split seeds. Glide leaves the normal coast and stopping rules unchanged. Steady Shell never adds speed beyond the incoming speed. Fixed challenges retain their supplied builds; ongoing campaign pools keep their current build until the next pool.

## One Connected Tree

**Ripple is your starting power.** Every other power and upgrade branches from it. You can eventually research every branch; choosing one does not permanently shut off the others.

Each power has its own linear upgrade chain beneath its base. The number and effects are chosen for that power; there is no fixed upgrade count. Basic utility belongs in the base power, while research adds meaningful changes. Some upgrades also open side branches into new powers. Follow the connecting paths to see which research comes next.

By default, the map shows research you own, retained earned loans, and the next skills whose prerequisites and mastery requirements you have met. These next upgrades stay visible while you save Points or finish a run; their cards explain what is needed before you can buy them. You can spend available Points at any time, including during an active run or between pools. Prices, prerequisites and mastery requirements still apply. Hidden nodes and their paths take no map space. Settings → Advanced → Development & Backups → **Show Hidden Tracks, Skills and Skins** reveals the complete tree for inspection without unlocking anything. This view preference is remembered and works with either profile. A slim **Development Profile Active** strip stays at the bottom of every screen when the separate Development profile is selected. It disappears in normal play.

## Research and Activation

Research costs Points earned in scoring gamemodes. Unpurchased skills show their price beneath the node name with the coin icon. Owned skills hide the price on both the node and its card; their artwork and rarity remain without an extra checkmark badge. Development & Backups → **Show purchased items cost** restores those prices for inspection. It is off by default and remembered in this browser. **Purchases are permanent and cannot be refunded.** Every visible power and upgrade opens a compact tooltip with its matching tree icon and rarity frame. Every unpurchased skill keeps its top-right lock, including skills you can already afford; borrowed skills show a clock. A pill beneath its title shows its type and matching icon. Click or tap a node to see its description, cost or ownership status, and any unmet requirements. Every tooltip includes stats, with a short explanation beneath each stat title. Bars show quantities such as reach, strength and duration; pips show counts such as shots or targets. Response stats use compact curve graphs where shape matters: Ripple falloff, Attract gathering, Vortex swirl, Magnet pull, Bubble and Stasis pressure, Tether pull, and Drunk sway. Read the labelled horizontal axis as distance, overlap or elapsed time, and the vertical axis as the resulting strength or heading. A dashed gray line shows the current response; a solid mint line shows the upgrade on the same scale. An unchanged response shows one line. Graphs explain behavior rather than ranking it: farther right means more distance or time, not necessarily better. Example bubble sizes and other assumptions are stated beneath the graph. Other behavior changes stay textual. Exact values stay visible, and each bar uses a consistent scale across that power’s upgrades. Partial bars label the actual value above the fill endpoint and the best reachable value at the right; near-full labels stagger to remain readable. Every bar fills toward a better value for that stat, even when the number decreases: less drag, a lower frozen-bubble speed cap, less frozen-bubble pressure, slower Rewind playback, or a shorter wave interval. A full bar reaches that stat’s best available setting. Style choices without a single best value, such as sway width, fan angle and orbit time, keep exact numbers without a rating bar.

Upgrade previews show before and after values together, including tradeoffs. Each stat has one bar or count strip: solid gray is the retained strength, mint diagonal stripes mark an improvement, and amber hatching marks a tradeoff. The improvement pattern also appears in count pips and the legend. These compare individual stats, not the overall value of a build; a style can improve one stat while weakening another. **Prerequisites → With Upgrade** means the preview includes research you still need; it does not describe your current build. Locked powers show their starting values under **On Unlock**. Active research shows **Current Power**, while inactive owned styles show a **Style Preview**. Every unowned skill card includes an Unlock button; it is enabled only when you can currently purchase it, with a reason shown when disabled.

Purchases save immediately. In Melody Journey, research bought during a pool takes effect from the next pool so the current shot and saved behavior stay unchanged. Free Play and Endless Waves apply new research at the next shot boundary. Experiment layouts and shared challenges retain their fixed tools; opening Skills from a shared challenge spends your originating profile’s Points on permanent research for that profile. All researched upgrades activate together when the new build is applied. Each purchase adds to earlier upgrades; there are no A-or-B styles.

The final upgrade also needs three mastery uses: activate that owned power during a shot that hits at least three different bubbles, or activate it in a successfully cleared Melody Journey pool. Existing ownership is preserved when the game's tree changes.

## Rarity and Type

Color identifies rarity, using Cure Interactive’s original badges and palette: **Common** gray, **Rare** blue, **Epic** purple, **Legendary** gold and **Mythic** red. Rarity describes the complexity of the capability; it does not change its drop chance or price. More advanced powers and upgrades occupy higher rarities.

The power reference groups behaviors by **type**:

- **Motion:** player speed, rebounds and steering.
- **Flow:** currents and forces through the pool.
- **Control:** bubble movement, gathering and reactions.
- **Propagation:** extra bodies, projectiles and contact chains.
- **Navigation:** destinations, targeting and travel.

Types describe behavior. They never partition the map or gate research. Each power and skill branches from a specific prerequisite whose effect leads naturally into it. For example, Impact’s Transfer leads to Relay, and Orbit’s Directed Release leads to Slingshot.

Earn Points in scoring gamemodes. Melody Journey, Free Play, Waves, Challenge and Score Attack also train power mastery; the fixed-tool experiments do not. For reward rules, see [Points in Every Mode](how-to-play.md#points).

## Read the Map

- **Active:** a filled glow in that skill’s rarity color.
- **Owned:** no lock, purchase price or extra checkmark; rarity color stays the same.
- **Available:** a double outer border, with a lock until purchased.
- **Locked:** a dashed border and lock when requirements are unmet.
- **Borrowed:** a clock marks a temporary loan.

Power roots use rounded squares; final upgrades use circles. Connections to unpurchased skills are dashed, and owned connections are solid. The selected node has a white outline. Its prerequisite path keeps the rarity colors of its skills. Tap Legend at the top right to show all five rarities and the separate ownership states. Tap the expanded card to collapse it and leave more of the tree visible.

Drag to move in two dimensions; pinch or scroll to zoom. At overview scale, tiny labels and glows simplify; zoom in to restore full detail. Zooming out stops when the visible skills fit the screen, with a small margin. This limit adjusts as skills appear or the screen size changes. Tap any node to inspect it; every unowned skill has an Unlock button. It is enabled when you have enough Points and meet the requirements; otherwise it stays visible and explains the restriction. The button remains visible below scrolling stats. Owned and currently unlockable skills are fully bright; unavailable unowned tree nodes are dim, even on the highlighted path. Icons inside skill cards always remain fully bright. Tap elsewhere, close it, or move the map to dismiss it. Owned upgrades stay active together. Inspecting a skill does not change your powers.

Optional zoom, Fit Tree and Focus buttons are available through Settings → Accessibility → Show on-screen controls. Arrow keys can also move through the map.

[Browse every power and upgrade](power-ups.md).

## Attribution

### Sources

The in-game rules, controls and item descriptions in this release.

### Contributions

#### Codex on behalf of `leviscustempris`

Guide authored for Cure Interactive.
