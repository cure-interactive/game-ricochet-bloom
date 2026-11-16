# Player

Open **Player** from the main menu to view your equipped skin. Personalize groups **Skins**, **Trails**, **Impacts** and **Music** in two columns when space permits, with each icon above its label; **Skills** and **Stats** sit below.

## Player Viewer

The large preview shows your equipped skin. Drag it across the available viewer area, or tap it to make it bounce. Its range follows the viewer size; release it to spring back smoothly. Large previews respond gently when you scroll their containing panel and return smoothly to center. Compact player icons keep their smaller movement range; scrolling gently deforms them without producing trails. Previews keep moving when scrolled out of view on an open page; closing or hiding the page pauses them. These interactions are cosmetic and do not change a run.

Your player name appears beneath the bubble. Tap or click it to edit in place (up to 32 characters). Press Enter or tap away to save; Escape cancels. An empty edit keeps the previous name. Names belong to the selected profile and are included in progress backups.

## Skins

Open Player → Skins to inspect each look on a live, squishy bubble. Drag or tap the preview.

Common through Mythic shop skins cost Points. Sea Glass is Common, Frost Crystal is Rare, Nebula is Epic, Solar and Cure Interactive are Legendary, and Spectrum is Mythic. The Cure skin uses the approved Cure Interactive artwork inside blue glass.

Unlock & Equip purchases a skin once. Owned skins can be equipped freely. Original is always free, and completing campaign tracks still unlocks their existing skins. Inspecting a skin never equips it or spends Points.

## Trails and Impacts

Open **Player → Trails** or **Impacts** to browse the gallery. Tap a style to open its larger animated preview and selection card before buying. **Back** returns to your place in the gallery. Each gallery card animates the actual effect; the title bar previews the selected style or your equipped style while browsing. The Player buttons animate your equipped styles. Wiki uses regular static icons. Skins, Trails and Impacts use the same gallery → detail → Back pattern: inspecting does not buy or equip, and wider galleries use the available row space before wrapping. Previews on hidden pages pause and keep their state; scrolling offscreen only culls their drawing. One trail follows the large Player viewer and selected skin preview during grabbing, dragging, scrolling, rebound and supported device motion. Equipped-player icons can trail their own movement, but page scrolling does not generate their trails; only the equipped skin gallery thumbnail has a trail from its local motion. Dedicated Trail and Impact previews continue to show their effects; impacts appear at player contacts and fade away smoothly.

- Common styles cost 60 Points.
- Rare styles cost 120 Points.
- Epic styles cost 220 Points.
- Legendary styles cost 360 Points.
- Mythic styles cost 550 Points.
- Original options remain free. Purchases are permanent within the current profile, and equipping an owned style is free.

Legendary Ember adds a warm launch sound. Mythic Aurora adds a rising launch sound and a continuous airy shimmer while the player moves. Its ambient flow stays phase-continuous instead of replaying plucked notes; speed changes adjust it smoothly and stopping lets it fade. Mythic Prismatic Nova adds a crystalline accent to player impacts. Tap **Preview Sound** to hear the selected effect before purchasing. Aurora previews travel for a few seconds and fade over their final second. Sounds follow master volume and mute; gallery animations stay silent. Rapid impacts are limited to keep audio clear.

Buy and equip cosmetics during an unfinished pool without ending it. Points and ownership checks still apply; your current gameplay build stays intact. Cosmetics do not alter power, speed, score or rewards. Your selections appear in normal play, experiments, Casual and the menu background. Power effects retain their own important visual feedback. Normal and Development purchases are separate.

### Rarity and appearance

- **Common:** a restrained material or clean wake.
- **Rare:** a distinctive motif, such as crystal facets or stardust.
- **Epic:** layered geometry, such as nebula bands or braided prism trails.
- **Legendary:** signature animated artwork that responds to motion, such as Solar's corona, Cure's orbiting marks or Ember's fire ribbons.
- **Mythic:** evolving layers, such as Spectrum's shifting rings, Aurora's ribbons and stars or Nova's staged burst.

Rarity describes the visual treatment. It grants no gameplay advantage. Lower rendering quality simplifies detail while preserving the style's identity.

## Stats

Open **Player → Stats** to see your researched launch speed, aiming-guide lengths, wall speed retention, early drag reduction, collision recovery, Points, upgrades and recorded play totals. Overview, Records and Medals group your information, with links to Player Skills and Power Skills.

The screen also shows Melody Journey clears, separate 5/10/15-shot Score Attack bests, experiment results and Bronze/Silver/Gold records by gamemode. Standard and Relaxed campaign records stay separate. Each saved record counts only its best medal. **5-Chains** counts five-unique-contact chains and uses the Ripple icon. Medal totals with none earned show a slightly faded **—**, rather than 0. Overview, Records and Medals use the same tap/drag selector pattern as Skills.

Stats belong to the selected Normal or Development profile in this browser. Older play may not have been recorded, and unreadable records appear as unavailable. Development grants and unlocks are not counted as earned Points or completed tracks. The displayed attributes describe your researched build; active runs and fixed challenges can retain a different build.

## Music

Open **Player → Music**. The shared tap/drag selector has **Instruments**, **Soundstages**, and **Ambience** tabs. Each category has its own equipped item, so you can combine any instrument, acoustic space and background atmosphere.

- **Instruments** change the voices, preserving melody, rhythm and percussion. Original preserves each song's Glass, Velvet or Wood palette. Paid choices are Felt Keys, Crystal Chimes, Velvet Strings, Golden Celesta and Aurora Choir.
- **Soundstages** change the room around the music. Original keeps the familiar room; Small Room, Wooden Hall, Stone Chamber, Cathedral and Celestial Vault offer different reflection lengths, warmth and stereo diffusion. Gameplay effects are not sent through this room.
- **Ambience** adds a quiet procedural background loop. None is free; Soft Rain, Quiet Shore, Night Forest, Ember Hearth and Orbital Drift provide independent atmospheres.

Open a card and use **Preview Sound** for a six-second sample with your other equipped Music layers. It does not equip or spend Points. Replaying replaces the previous audition; changing category, leaving the preview, hiding the page or muting stops it. Previews and Music layers follow Music Volume, Master Volume and Sound.

**Unlock & Equip** buys once; equip owned items freely, including during a saved pool. Normal and Development purchases remain separate. **Show purchased items cost** applies to every category. All sounds use the local engine, without sampled sound-bank downloads.

Selections affect gameplay music, Casual, menu music and newly prepared song highlights. A prepared highlight keeps its rendered sound until you prepare it again. Your saved composition, score, rewards and gameplay build are unchanged.

See [Cosmetic Rarity](cosmetic-rarity.md) for the tier rules for each asset type and current prices.

## Skills

Open **Player → Skills** for the Sight, Launch, Rebound, Glide and Steady branches. You can also switch between Player and Powers inside Skills. Both trees spend the same Points wallet; purchases are permanent and cumulative.

See [Player Upgrades](skill-tree.md#player-upgrades) for effects, costs and where your researched build applies. [Medals](medals.md) explains the conditions behind your records.

## Attribution

### Sources

Ricochet Bloom gameplay, campaign, progression and audio source in this release.

### Contributions

#### Codex on behalf of `leviscustempris`

Authored and checked against the game implementation.

Player icons and previews keep simulating while their page is visible, even when you scroll them out of view. Drawing continues while any part of the bubble, glow or trail remains in the visible area; it stops only after the whole effect leaves. Scrolling back reveals the ongoing motion. Switching away from the page or closing its menu suspends that work without resetting the preview.

Large player previews use a circular distance limit fitted to the viewer. Dragging follows the pointer near the origin and progressively resists toward the outer radius; it never clamps independent x/y coordinates into a square. Compact icons retain their small tether.
