# Change Logs

See what changed in each version. These are historical release notes; use the guides for current controls and rules. Open a version for its player-facing updates.

<!-- development -->
Open Developer Notes inside a version for its technical changes.
<!-- /development -->

## v3.40.8

Build: 2026-11-24 17:37:23 UTC

### Player Changes

- Returning after a reload or update now restores saved campaign results, including the completed pool, score and available next actions.
- The Use Earned Skin button shows the earned campaign skin without artwork inherited from your equipped skin.

<!-- development -->
### Developer Notes

- Persist a validated result checkpoint alongside campaign progress and restore it through an explicit suspended result route, without replaying rewards or celebration.
- Set the campaign preview's complete appearance and derive its equipped label from the current loadout.
<!-- /development -->

## v3.40.7

Build: 2026-11-24 17:24:15 UTC

### Player Changes

- Trail Showcase now sweeps through more of the preview area, adapting its figure-eight path to the panel's width and height.

<!-- development -->
### Developer Notes

- Derive Trail Showcase orbit bounds and camera scale from shared viewport geometry, retaining glow margins and existing thumbnail timing.

<!-- /development -->

## v3.40.6

Build: 2026-11-24 17:13:54 UTC

### Player Changes

- Skin, Trail and Impact Showcase now match their Player page button thumbnails, enlarged and framed steadily.
- Trails keep the same compact figure-eight loop; skins retain their gentle living motion, and impacts repeat their thumbnail animation.
- Showcase features the selected skin or effect without unrelated accessories. In Motion keeps the full equipped ensemble.

<!-- development -->
### Developer Notes

- Share thumbnail orbit geometry and membrane-current calculations with Showcase. Reuse card loadout composition and keep its camera independent of player or accessory movement.
<!-- /development -->

## v3.40.5

Build: 2026-11-24 14:51:06 UTC

### Player Changes

- Pendant chains now bend through linked joints with their own momentum instead of using a fixed decorative curve.
- Showcase lets both the pendant and its loose chain endpoint drift, respond to taps and pull on each other. Their wandering sits between normal pendant and companion activity.
- Dragging keeps control of the pendant; release lets the chain and both ends settle naturally. Upright easing, gentle separation and rarity decorations remain.

<!-- development -->
### Developer Notes

- Share a gravity-free, mass-weighted chain constraint solver across pendant rendering. Gameplay attachments remain kinematic, preserving one-way cosmetic forces.
- Route Showcase input to the actual free bodies and preserve joint history through repaints; reset it at view/configuration/teleport boundaries.
<!-- /development -->

## v3.40.4

Build: 2026-11-24 10:58:48 UTC

### Player Changes

- Restored the earlier pendant Showcase cord shape: its curve, braid and flowing lights follow the loose attachment naturally as it roams.
- The pendant stays interactive, with the current repulsion area and no celebration effect.

<!-- development -->
### Developer Notes

- Supply the actual remote endpoint as the Showcase cord geometry origin. The interactive pendant center is no longer mistaken for the cord anchor; ordinary shell attachment is unchanged.
<!-- /development -->

## v3.40.3

Build: 2026-11-24 09:01:43 UTC

### Player Changes

- Pendants no longer celebrate or offer Preview Celebration. Their ambient rarity effects and cords remain.
- Pendants float farther from the player with a larger inner repulsion area. Showcase uses the same soft repulsion around its loose point anchor.
- Pendant Showcase responds to taps and dragging on the pendant itself. Its opposite cord endpoint roams, and the camera stays stable.
- Companion celebrations retain their animations, sound and playback control.

<!-- development -->
### Developer Notes

- Pendant rendering is independent of reaction and celebration state; celebration playback is companion-only.
- Point and shell anchors share one pendant leash configuration: clearance 2.075 and maximum reach 2.6 in artwork-radius units.
<!-- /development -->

## v3.40.2

Build: 2026-11-24 08:41:50 UTC

### Player Changes

- Preview Celebration sits directly below the Showcase/In Motion selector.
- Pendants in Showcase gently lean with movement and ease upright instead of rotating with the tether.
- The visible cord now attaches to a loose point anchor that responds to taps and dragging, with no hidden player shell or avoidance area. In Motion retains the normal player attachment.

<!-- development -->
### Developer Notes

- Accessory simulation explicitly distinguishes point anchors from player-shell attachment. Point mode keeps the shared leash, mass, friction and cord artwork while removing shell clearance and membrane simulation.
- A separate eased pendant angle controls artwork and its cord eyelet. The Showcase anchor uses a softer shared interaction spring.
<!-- /development -->

## v3.40.1

Build: 2026-11-24 02:23:48 UTC

### Player Changes

- Companion and pendant Showcase views now display only that cosmetic, enlarged. In Motion keeps the full equipped ensemble.
- Pendant cords attach to an invisible body that reacts to taps and can be dragged around the preview. The hidden anchor gently yields away from a nearby pendant, and releasing lets both settle naturally.

<!-- development -->
### Developer Notes

- Shared preview composition isolates accessory Showcase loadouts and hides player/effect drawing while retaining membrane and tether simulation.
- Optional bounded pointer dragging uses the shared interaction state, pointer capture, cancellation and cleanup. The Showcase camera stays still while dragging.
<!-- /development -->

## v3.40.0

Build: 2026-11-24 01:59:08 UTC

### Player Changes

- Cosmetic gallery titles are singular: Player Skin, Trail, Impact, Pendant and Companion.
- Cosmetic gallery cards now match the restrained Player page thumbnails: your player and consistent trail, with only the cosmetic being demonstrated. Full equipped ensembles remain in the Player viewer and detail previews.
- Choose Showcase for a large view of the selected cosmetic, or In Motion to see it travel. The tabs sit directly below the preview. Both use the full ensemble, and the view choice survives reloads. Celebration playback works in either view.
- Holding the Player preview or a tab no longer adds a dark native touch highlight; dragging and keyboard focus feedback remain.
- Discover 40 new designs: one in every existing rarity across Skins, Trails, Impacts, Pendants, Companions, Instruments, Soundstages and Ambience. Companions now have five designs per rarity and pendants have three.

<!-- development -->
### Developer Notes

- Separate card loadout projection and Showcase framing in cosmetic-presentation; reuse one persistent view selector and the existing preview lifecycle for skins and other visual cosmetics. Clear travel history and contact offsets across view changes without changing saved equipment.
- Extend the existing artwork and synthesis owners with distinct per-design geometry, harmonic envelopes, acoustic parameters and seamless ambience. Preserve stable IDs, historical receipts, quality bounds and gameplay isolation.
- Scope transparent native tap highlights to draggable preview surfaces and segmented controls; keep focus-visible outlines.
<!-- /development -->

## v3.39.0

Build: 2026-11-24 01:26:51 UTC

### Player Changes

- Firefly is now Mythic and leaves blinking golden lights. Bloom Dragon, Comet Whale and Nova Bot leave fading petal, starlight and pixel trails. Existing Firefly owners keep their companion.
- Meet Moss Cap, Tide Snail, Paper Crane, Dream Axolotl and Astral Lion: four companions in every rarity.
- Preview Celebration now uses the same playback button and progress bar as Preview Sound. Tap Stop Preview to end a celebration early.

<!-- development -->
### Developer Notes

- Keep companion trail sampling, aging, bounds and lifecycle reset in one presentation owner. Preserve stable Firefly IDs and historical paid receipts.
- Reuse one playback-button renderer and state updater for audio and accessory celebrations. Sequence progress covers braking, animation/audio hold and resumption, including silent designs and longer voices.
- Preserve cancellation during audio unlock, navigation and visibility changes; reset the button and progress on completion or stop.
<!-- /development -->

## v3.38.3

Build: 2026-11-24 00:41:45 UTC

### Player Changes

- Switching All, Favorites or rarity filters no longer launches pendants and companions around their previews.
- Taps and held touches push accessories directly. Their mass and friction govern the response, and pendant cords follow the moving, squishy player shell.
- Preview Celebration now includes the companion's sound. The player slows to a stop, celebrates in place, then resumes naturally. Pendants keep their silent celebration.

<!-- development -->
### Developer Notes

- Rebase viewport inertia when layout offsets or ancestor scroll extents change, including filter-triggered scroll resets. Preserve real scrolling, transforms and existing one-shot deduplication.
- Share impulse/mass and friction integration across player springs and accessory leashes. Route pressure in local coordinates; accessory forces never mutate gameplay bodies. Sample the exact quadratic shell for the pendant endpoint and taut-leash response.
- Replace duplicate companion sound/animation controls with one brake/hold/resume sequence. Start sound at the celebration boundary, wait for audio completion and cancel pending playback on navigation/visibility changes without teleporting or respawning.
<!-- /development -->

## v3.38.2

Build: 2026-11-24 00:20:42 UTC

### Player Changes

- Pendants and companions now appear at random positions within their roaming area when they spawn.
- Keep animated preview canvases inside menu scroll boundaries so their transparent edges cannot extend the browser's scroll range.

<!-- development -->
### Developer Notes

- Sample independent, area-uniform accessory positions between player clearance and leash reach. A separate seeded sequence advances across re-equipping, resets and teleports without changing paused state or gameplay.
- Quantize cosmetic and Player canvas bounds before viewport clipping. Outward rounding after clipping introduced transparent overflow into scrolling menus. Derive drawing scales from final pixel dimensions to preserve alignment at fractional viewport and zoom boundaries.
- Regression checks cover spawn distribution/lifecycle, exact clipping edges, zoom, animation and native scrollbar ownership. Desktop geometry verification is separate from physical iOS spring-back acceptance, which remains pending.
<!-- /development -->

## v3.38.1

Build: 2026-11-23 23:53:53 UTC

### Player Changes

- Reduce unnecessary work while scrolling animated cosmetic galleries, including Companions. Scrolling and edge bounce remain controlled by your browser.

<!-- development -->
### Developer Notes

- Publish preview and scrollbar visibility only when it changes, and skip unchanged preview canvas geometry writes. Repeated hidden-attribute writes previously woke all visual-activity observers and the scrollbar layout pass on each animation frame, including for offscreen previews.
- Verify steady/offscreen frames produce no redundant observed DOM mutations while animation, re-entry and real geometry changes still work. Native overscroll offsets remain unchanged; physical iOS spring-back requires device confirmation.
<!-- /development -->

## v3.38.0

Build: 2026-11-23 23:49:13 UTC

### Player Changes

- Five new companions add a third choice at every rarity: Button Bunny (Common), Shell Scout (Rare), Lantern Ghost (Epic), Clockwork Owl (Legendary), and Nova Bot (Mythic).
- Explore plush-toy, ocean, folklore, clockwork and science-fiction themes. Nova Bot has a glowing visor, antennae and a hover engine, plus a digital celebration voice and light-pixel bursts.
- Lantern Ghost and Clockwork Owl have their own delayed celebration voices. Preview every design and its reactions before unlocking it.

<!-- development -->
### Developer Notes

- Separate companion artwork from motion and rarity presentation; all preview, icon and live-pool consumers retain the shared renderer and expression model.
- Extend the existing cosmetic catalogue and finite sound motifs without changing legacy IDs, save shape, prices or movement. Verify three companions/two pendants per tier, purchase persistence, distinct geometry, emotes and voice lifetimes.
<!-- /development -->

## v3.37.5

Build: 2026-11-23 23:31:08 UTC

### Player Changes

- Pendants now meander slowly, while companions explore more actively. Both float freely within their leash distance and gently avoid the player, with no preferred resting direction or rigid orbit.
- Scrolling and moving previews on screen nudges their player and accessories with brief inertia and squish. Stationary previews no longer suggest movement that is not happening.

<!-- development -->
### Developer Notes

- Share seeded roaming intent and a maximum-distance leash, separating ambient drag from one-way player avoidance. Preserve companion curiosity, upright interpolation, rarity effects and pendant-only cords.
- Share bounded viewport impulses across decorative players and cosmetic previews, exclude their own simulated transforms, deduplicate scroll observations and rebase resize/visibility changes. Keep raw DOM displacement out of trail coordinates and gameplay state.
- Verify all-direction slow pendant wandering, slack interior positions, fast reversals, frame-rate agreement, one-shot viewport input and zero velocity in stationary non-trail thumbnails.
<!-- /development -->

## v3.37.4

Build: 2026-11-23 22:59:01 UTC

### Player Changes

- Companions have no visible tether cord. They stay upright in portrait and landscape, gently leaning with movement and smoothly righting themselves.
- Epic pendant cords now have static braided filigree and clasps. Mythic cords carry animated flowing lights. Pendants remain silent and physically independent of the player.

<!-- development -->
### Developer Notes

- Share shortest-arc interpolation between wander steering and companion pose. Pass actual pool camera rotation through the shared visual boundary; keep companion art and lift screen-oriented.
- Separate pendant cord artwork from shared invisible tether dynamics. Check static Epic versus animated Mythic traces, short-arc/frame-rate interpolation and portrait rendering without companion cords.
<!-- /development -->

## v3.37.3

Build: 2026-11-23 22:50:52 UTC

### Player Changes

- Companions now meander on longer, loose bungee tethers, exploring even while you rest. They occasionally perk up and surge toward a nearby bubble, with their existing success emotes intact.
- Pendants remain passive on shorter tethers: slack cords float freely and pull back only when stretched. Neither accessory pushes or collides with the player.

<!-- development -->
### Developer Notes

- Share slack-tether dynamics and cord drawing; keep companion intent, curiosity and random state separate from passive motion, rarity presentation and gameplay.
- Supply live non-player interest points through the shared pool/cosmetic boundary. Verify slack rest, independent idle wander, curiosity, traversal, frame-rate stability and unchanged engine state.
<!-- /development -->

## v3.37.2

Build: 2026-11-23 22:20:17 UTC

### Player Changes

- Travel sound now tapers to silence over 2.5 seconds after launch and 1.5 seconds after player impacts or wall bounces.
- Trail sound previews use the same 2.5-second launch taper.

<!-- development -->
### Developer Notes

- Share the launch duration between event windows, audition voices and music ducking; preserve phase continuity, bounded motion leases and lifecycle cleanup.
- Update deadline and preview regression checks for the shorter timings. The developer accepted the travel-sound behavior as validated all around; this records human acceptance, not additional agent-run physical-device testing.
<!-- /development -->

## v3.37.1

Build: 2026-11-23 22:16:03 UTC

### Player Changes

- Companions are slightly larger and accompany you from the side, with smooth steering and momentum through turns instead of lingering directly behind.
- Pendants now float on stretchy, weightless tethers. They drift and rebound as you move, gently avoiding your bubble without colliding with it or changing its movement.

<!-- development -->
### Developer Notes

- AccessoryVisual integrates independent companion and pendant velocity states in bounded substeps. The companion matches observed player travel while steering its side offset; the pendant uses a radial damped spring and anticipatory one-way avoidance, with no gravity.
- Displacement owns presentation motion; paused/zero-time paints retain state, traversal resets remove long teleports and bounds follow the actual charm/follower. Frame-rate, reversal, no-gravity and engine-isolation regressions cover the new laws.
<!-- /development -->

## v3.37.0

Build: 2026-11-23 20:46:41 UTC

### Player Changes

- Pendants and companions now offer two designs at every rarity: ten choices in each category, plus None.
- Epic and higher companions celebrate 5-Chains and success with a brief pulse and delayed voice. Mythics add petal or star bursts.
- Epic and higher pendants gain silent halos and pulses; Mythics release decorative particles.
- Try Preview Celebration on accessories and Preview Sound on Epic, Legendary and Mythic companions before unlocking them.

<!-- development -->
### Developer Notes

- Shared milestone classification drives visual and audio reactions; campaign clears use the committed result boundary. Audio-clock scheduling, cooldowns and existing finite voice groups preserve mute/pause/hidden cancellation and musical memory.
- Deterministic burst geometry expires with the celebration and uses bounded preview allocation; Low quality reduces particle counts. Existing accessory IDs, receipts and free starters remain compatible.
<!-- /development -->

## v3.36.0

Build: 2026-11-23 20:27:48 UTC

### Player Changes

- Personalize your player with five pendants and five companions from the Player menu, each with live previews and Favorites.
- Try Dewdrop and Sprout for free. Unlock four more designs in each category with Points, and choose None whenever you want.
- Pendants sway as you move; companions follow, react to bounces and celebrate 5-Chains. Both are cosmetic and leave powers, collisions and Score unchanged.

<!-- development -->
### Developer Notes

- Extend the existing cosmetic slots, transactions, rarity gallery and navigation. Preserve missing slots in older saves while resolving None at presentation time.
- Share bounded accessory presentation across live pools, menu/Casual, gallery previews and the large Player viewer. Keep physics and reward state independent; reset following across teleports and retain equipped choices across pool resets.
- Cover legacy saves, separate equipment, affordability, receipts, leashed movement, quiet paused frames, finite rendering and preview bounds. Physical-device acceptance remains separate.
<!-- /development -->

## v3.35.9

Build: 2026-11-23 20:19:55 UTC

### Player Changes

- Mythic travel sounds taper to silence over the first three seconds after launch.
- Player impacts and wall bounces bring travel audio back with a two-second taper, keeping long flights quieter.
- Preview Sound uses the same three-second launch taper.

<!-- development -->
### Developer Notes

- Launch and player-contact events own finite travel windows in PoolSound, independently of equipped impact sounds. Movement updates panning and a separate speed/lease gain without extending the taper.
- Repeated contacts reuse oscillator phases and lift the current envelope smoothly. Pause, mute, hidden state, equipment changes and expiry clear playback; late callbacks retain the remaining taper.
- Verify launch/impact deadlines, motion-only silence, repeated-contact reuse, lifecycle cleanup and preview replacement with shared audio regressions. Physical-device listening remains separate from automated timing checks.
<!-- /development -->

## v3.35.8

Build: 2026-11-23 16:56:32 UTC

### Player Changes

- Keep full live skill artwork when a browser produces an incorrectly sized or positioned cached image, preventing mixed tiny and normal-sized nodes.

<!-- development -->
### Developer Notes

- Verify two known padding coordinates in each node snapshot before hiding live children. Reject blank, shifted or incorrectly scaled foreignObject output; clear retained snapshots and keep the affected mounted tree live, including after reopening.
- Remove verification pixels before displaying a valid snapshot. Preserve density-aware caching on renderers that pass; successful SVG decoding alone is not a geometry check.
- Add pixel geometry and persistent live-fallback regressions. Desktop high-density rendering is checked separately from the reported physical iPhone behavior; iPhone confirmation remains pending.
<!-- /development -->

## v3.35.7

Build: 2026-11-23 16:54:11 UTC

### Player Changes

- Keep scrollbar thumbs moving with the page during native scrolling, including horizontal tab bars, on browsers with native scroll-animation support.
- Preserve the natural iOS page bounce, scrollbar dragging and smooth thickness changes.

<!-- development -->
### Developer Notes

- Drive thumb transforms with ScrollTimeline instead of waiting for scroll events and a subsequent animation frame. Reuse the animation across geometry changes and cancel it when hidden or disposed.
- Project cached geometry immediately on older browsers. Read the current native scroll position for thumb hit testing; retain selector priority and avoid scroll-position writes during native overscroll.
- Verify both axes, panel teardown, drag interaction and fallback behavior. Physical iPhone thumb smoothness remains a separate acceptance check.
<!-- /development -->

## v3.35.6

Build: 2026-11-23 12:39:45 UTC

### Player Changes

- Return from Settings to the correct Home or paused-game screen, including Casual and restored sessions.
- Keep a failed purchase or player-name save attached to its original profile until Retry Save succeeds.
- Keep campaign goal descriptions and remaining progress aligned with the same requirements.
- Save completed pool steps after their effects and progress have been processed together.

<!-- development -->
### Developer Notes

- Coordinate ordered effects, progression reconciliation and checkpoint/UI work through `pool-step.js`; retain explicit launch, departure and periodic saves.
- Resolve current, suspended and stored profile ownership through `profile-session.js`. Pending writes retain their destination; shared-build saves remain separate from originating-wallet rewards and receipt generations.
- Derive goal labels, completion and missing progress from `POOL_GOALS`, retaining banked-chain history and settlement boundaries.
- Derive menu layers and suspension from page history through `menu-state.js`; route Settings and native dismissal through the same owner. Restore active sessions paused.
- Preserve the 3.35.4 bounded skill-tree raster cache. Validate the integrated build with 898 automated checks and browser navigation, pause and reload checks; physical-device acceptance is separate.
<!-- /development -->


## v3.35.5

Build: 2026-11-23 12:35:33 UTC

### Player Changes

- Refine Night Forest with rhythmic cricket-like chirps, several callers across the stereo field, and quieter rests between calling bouts.

<!-- development -->
### Developer Notes

- Generate each caller once for both channels, with a stable carrier and pulse rhythm, small variations within bouts, and smooth wing-stroke envelopes. Normalize the stereo pair together to preserve caller positions.
- Keep the shared 48-second loop, bounded cache, preview lifecycle and independent Ambience Volume. Signal, stereo and recovery checks pass; further physical listening acceptance remains open.
<!-- /development -->

## v3.35.4

Build: 2026-11-23 12:24:03 UTC

### Player Changes

- Keep skill names, costs, icons, rarity shapes and shadows visible while zooming out.
- Reuse distant skill artwork to make large trees smoother to pan and zoom, with sharp live detail when you move closer or select a skill.

<!-- development -->
### Developer Notes

- Cache visible node appearances incrementally under the existing shared parent transform. Keep native buttons, keyboard focus and selection; never allocate a full-world canvas.
- Bound node backing pixels to 16 MiB per mounted tree and shared embedded sources to 8 MiB. Choose resolution from zoom bands and display density, invalidate changed states/fonts/DPR, and release node canvases on close.
- Preserve live rendering during preparation or unsupported snapshots. Cover stale async results, cache reuse, budget pressure, density changes and close/reopen behavior with focused regressions and browser checks. Physical mobile-device performance remains unverified.
<!-- /development -->

## v3.35.3

Build: 2026-11-17 05:00:25 UTC

### Player Changes

- Give a grabbed tab selector priority over scrollbar dragging.
- Adjust background atmospheres and their previews with a separate Ambience Volume slider, starting at 50%.
- Keep cosmetic detail panels the same width when previews start, stop or finish.
- Find Change Logs in Settings > Updates. About places the game description directly beneath the title.
- Welcome Back fades away over your ready page after Continue, without an extra pause before the fade.

<!-- development -->
### Developer Notes

- Mark selector gesture ownership and cancel scrollbar capture/momentum when that higher-priority grab begins.
- Route ambience through its own smoothed gain and persist its preference across menu/game output recovery. Give the shared cosmetic detail grid an explicit full-width column.
- Move the existing Change Logs control into the Updates section while preserving its wiki navigation handler.
- Animate the welcome cover exit and retain the destination beneath it. Cancel stale fades on a new return, preserve failed-audio retry and support reduced motion.
<!-- /development -->

## v3.35.2

Build: 2026-11-17 03:13:38 UTC

### Player Changes

- Keep the Skills tab highlight aligned with the tree you are viewing when switching, returning or reloading.
- Keep tab selectors steady while changing Gamemodes pages or reopening Stats.

<!-- development -->
### Developer Notes

- Give each logical tab group one persistent bar and controller. Skills moves one instance between tree hosts; Gamemodes and Stats retain their bars while replacing content.
- Derive route-owned selections from the displayed page and ignore obsolete independent tree-selector snapshots. Preserve Stats view memory and independent music/rarity filters.
- Cover repeated switches, interrupted settling, re-entry and stale navigation snapshots with shared-owner regressions.
<!-- /development -->

## v3.35.1

Build: 2026-11-17 02:50:54 UTC

### Player Changes

- Keep tab dragging aligned with the selected tab while the bar scrolls.
- Keep skin-card trails tied to the equipped skin and keep preview interactions from triggering cosmetic impact effects.
- Improve sound recovery when returning from the background.
- Use consistent title case for buttons and interface labels, while preserving your player and saved song names.
- Skills labels fade out when too small to read and return steadily as you zoom in. Selected and keyboard-focused skills retain their labels.
- Restore scroll and expanded sections by their identity, so added or reordered panels cannot receive another panel's position. Wait for page content before restoring its scroll.
- Finish loading and automatic updates before showing Welcome Back, so returning to the game no longer asks you to continue twice around an update.
- Keep your saved page ready behind the welcome screen. Offline or unsuccessful update checks still let you continue.

<!-- development -->
### Developer Notes

- Derive selector feedback from shared geometry, body interactions from motion ownership, preview presentation from explicit policy, and audio recovery from lifecycle transitions.
- Format authored controls through the shared title-case helper; retain explicit saved-name preservation and casing-compatible tab-state restoration.
- Share the camera's resize/open viewport snapshot with both Skills projections, removing dimension reads from camera motion and paint. Derive name/base/cost label bands from CSS text size with hysteresis; preserve bounded SVG, shadow/artwork LOD and accessible names.
- Navigation snapshots use semantic geometry keys, retain legacy snapshot reads, and restore disclosures before layout and scroll.
- Coordinate startup and foreground readiness through one owner; queue audio activation until navigation and automatic update work have settled.
- Reuse the loading cover and invalidate stale fade, update and Continue callbacks across repeated departures.
- Add lifecycle integration regressions for reload, no update, offline checks, opt-out, muted audio and interrupted returns.
<!-- /development -->

## v3.35.0

Build: 2026-11-17 01:54:01 UTC

### Player Changes

- Add Interface Volume under Settings → Audio, defaulting to 100%. Adjust button, slider, tab selector and Back sounds separately from music and gameplay effects.
- Remember Interface Volume after reload. Sound mute and Master Volume still apply to all audio.
- Make slider and selector movement taps 20% quieter while keeping their low pitch and feedback spacing.

<!-- development -->
### Developer Notes

- Route UI voices through an independent smoothed gain below master; recreate it from the retained preference when audio output changes.
- Persist Interface Volume through the existing preference-only write path, including while a trial owns gameplay saving. Missing or invalid values default to full volume.
- Scale only slider/selector movement peaks from 0.09 to 0.072; preserve edge Back and release-click levels, music and gameplay routing.
- Cover event-to-voice amplitude, UI-only routing, mute, graph recreation, preference round-trips and unreadable-save protection. Verify default, reload, independent mute and mobile layout in the served app.
<!-- /development -->

## v3.34.7

Build: 2026-11-17 01:42:53 UTC

### Player Changes

- Sliders and dragged tab selectors use only the lowest original feedback tone, whichever direction you move.
- Keep feedback at each increment or eight pixels of travel, along with the separate release click.

<!-- development -->
### Developer Notes

- Shared slider/selector movement events request the original 300 Hz tap without changing their reported position or direction. Preserve its 85ms sine envelope and 8% pitch rise.
- Edge Back keeps its four-tone position-based register. Test the shared control-event route through oscillator scheduling at multiple positions and both directions.
<!-- /development -->

## v3.34.6

Build: 2026-11-17 01:29:43 UTC

### Player Changes

- Restore the shadows around skill nodes when inspecting the map up close.
- Powers and Player share the same map controls and navigation, with less repeated layout work while panning and zooming.
- Keep simplified distant views and the fading dotted background.

<!-- development -->
### Developer Notes

- Consolidate the map shell, camera lifecycle, controls, keyboard navigation and route highlighting in `skill-tree.js`; keep each domain's research and purchase rules in its adapter.
- Move fixed node coordinates with one world-parent transform. Keep the SVG link window projected to the viewport and avoid forced full-world bitmap promotion.
- Preserve visibility culling, frame coalescing, cached node references and bounded asynchronous artwork decoding. Restore node shadows at readable zoom while retaining compact/overview simplification.
- Verify parent/link geometry, unchanged node positions, repeated zoom, keyboard navigation and both tree views. Physical iPhone performance and crash acceptance remain pending.
<!-- /development -->

## v3.34.5

Build: 2026-11-17 01:11:30 UTC

### Player Changes

- Skill-tree nodes use clean borders and selection outlines without shadows on the dark map.
- Sliders, dragged tab selectors and edge-pull Back use the original four rising and falling tones again, without the looping pitch effect.
- A tone plays at each value increment or eight pixels of drag travel, whichever comes first. Fast drags use the latest position without a backlog of delayed clicks.

<!-- development -->
### Developer Notes

- Remove node/orb box shadows from the shared Power and Player tree styles; keep tooltip/control elevation and state borders/outlines.
- Restore the historical single sine tap: 300/380/480/620 Hz, an 8% pitch rise over 85ms, exponential gain from 0.0001 to 0.09 at 8ms and back to 0.0001. Keep the current 6ms scheduling lead and ordinary button envelope.
- Movement owners report normalized position. Sliders emit on value changes or travel distance; selectors use their pill position relative to the full tab row, including held edge-follow. Ordinary scrolling remains silent.
- Share the increment-or-8px movement rule and remove the 140ms movement throttle. Preserve cue expiration/coalescing, voice limits, independent release clicks and audio recovery.
<!-- /development -->

## v3.34.4

Build: 2026-11-17 00:19:01 UTC

### Player Changes

- Loading stays over your saved page while it is restored and updates are checked, then fades away to reveal it. The main menu no longer plays a separate entrance animation.
- Moving between buttons, closing dialogs and pressing Continue no longer cuts off sound as though you had left the app.

<!-- development -->
### Developer Notes

- Keep the startup cover in the browser top layer above restored dialogs; reveal all prepared destinations beneath one 450ms opacity fade, with a bounded completion fallback.
- Mount and await the initial automatic update check after navigation restoration. An update saves the restored destination and keeps the outgoing build covered until reload. Offline checks and opt-out still allow startup.
- Filter captured blur by its window target before retiring either audio graph. Descendant control blur, including focus transfer and disabled Continue, must not enter background recovery. Physical iPhone output remains a separate verification requirement.
<!-- /development -->

## v3.34.3

Build: 2026-11-16 22:10:57 UTC

### Player Changes

- Sound fades out quickly when leaving the app instead of stopping abruptly.
- Welcome Back offers a Continue button to restore sound after returning or reloading, while preserving your page and keeping gameplay paused. Muted players are not prompted.
- Rising and falling feedback uses the same softer click voice as buttons, with a narrower pitch blend and the existing slower cadence.
- The player name keeps clear space below its preview on small screens and in landscape.

<!-- development -->
### Developer Notes

- Capture departure before pause listeners, detach scheduling immediately, and fade the retired output gate for 20ms before disposing voices and closing its context. Old voice cleanup owns its original sets and cannot decrement a replacement graph's voice count.
- Do not resume from interrupted/suspended state-change events. Require a positive foreground or trusted activation; stale touches after blur cannot release the hold.
- A shared return dialog collects menu/gameplay unlock callbacks and invokes them synchronously inside Continue. A session marker survives reload; navigation restoration cannot dismiss the pending return screen. Failed activation remains retryable with a no-audio fallback.
- Shared 85ms sine taps have an 8ms smooth attack, silent endpoints and the button's small pitch rise. Two adjacent octave layers retain continuous winding without the previous four-octave spread.
- Reserve preview diameter plus its existing 80px padding before placing the player name. Physical iPhone acoustic acceptance remains separate from automated and desktop checks.
<!-- /development -->

## v3.34.2

Build: 2026-11-16 21:38:35 UTC

### Player Changes

- Keep the tab highlight aligned when its bar moves into the bottom panel. Finishing a selector drag now plays the regular button sound.
- Night Forest uses short, varied insect calls with pauses between phrases.
- Audio output disconnects fully when leaving the app and fades in on return to reduce transition distortion.
- Raised the rising/falling click pitch after feedback that it sounded too low.
- Softened the beginning and end of each tap to address crackling, while keeping the slower click rate and drag-only feedback.

<!-- development -->
### Developer Notes

- Remeasure the selected tab during settling after footer reparenting or resizing. Drag commits emit delegated activation feedback with a separate throttle from winding.
- Replace Forest whistles with stable-pitch pulse groups from independent callers; retain seamless loops and bounded synthesis.
- Disconnect a terminal output gate and compressor on retirement, fade new output in over 60ms, and avoid redundant audio-session category writes. This addresses transition risks; physical iPhone distortion acceptance remains open.
- Shift the four-octave winding register up an octave (140 Hz base, 560 Hz strongest phase-zero layer). Replace the 2ms exponential attack with a 50ms raised-cosine envelope: 8ms attack, 42ms release and exact zero endpoints.
- Schedule all layers at one audio-clock timestamp 6ms ahead; retain the 140ms cadence, bounded voices, direction changes and stale-cue rejection. Envelope tests cover synchronization, endpoint slopes, headroom and sample continuity across the octave cycle. Physical iPhone acoustic acceptance remains open.
<!-- /development -->

## v3.34.1

Build: 2026-11-16 20:40:47 UTC

### Player Changes

- Reloads and updates remember your screen, tabs, cosmetic details, wiki page, map position and gallery scroll. Returning to an active pool opens Pause.
- Favorites appears only when that page has favorites. Removing the last one returns to All.
- Selected tabs ease toward the center of overflowing bars. Dragging the selector keeps its rising/falling feedback while reaching more tabs; ordinary sideways scrolling stays silent.
- Sliding feedback is slower, warmer and more hollow sounding.
- Pause sits at the bottom-right of the play area, with centered goal text above and feedback at bottom-left. Left-Handed Layout mirrors the corner controls.
- Further work on delayed audio after returning to the app and thin lines left behind by iPhone selector drags. Physical iPhone confirmation is still pending.

<!-- development -->
### Developer Notes

- Hidden/blur/pagehide immediately disconnect audio and retire its graph. Foreground releases the hold before checking active owners, preventing menu listener ordering from reusing stale output. Reset clock-bound deadlines; expose output timestamps, latencies and graph-close diagnostics without interpreting clock differences as measured latency.
- A single opaque canvas redraws each selector's static ink and pill together; native buttons retain semantics and input. The live player retains its deformation-aware backing. Wind clicks use four lower octave layers, 35ms envelopes and a 140ms throttle.
- Versioned, profile-scoped UI memory restores explicit view adapters and scroll/disclosure state without replaying purchase or launch controls. Invalid UI memory falls back without modifying progression. Gameplay resumes only after the player chooses Resume.
<!-- /development -->

## v3.34.0

Build: 2026-11-16 19:47:59 UTC

### Player Changes

- Sliders, dragged tab selectors and edge-back gestures share crisp clicks that seem to keep rising as you move forward and falling as you reverse.
- Improved sound recovery after returning to the app. Old interaction sounds are discarded rather than playing late.
- Revised selector movement to address the thin lines reported during iOS drags, while retaining partial text/icon contrast and sideways scrolling.

<!-- development -->
### Developer Notes

- Rebuild the audio output once after a real departure/return, retaining music memory, volume and pause state. Interactive latency is requested; obsolete resume completions and timeouts cannot affect replacement contexts.
- UI cues expire after 150ms and coalesce. Shared signed movement drives five octave-spaced, weighted 55ms clicks with a 60ms throttle and finite voice budget.
- The selector uses pixel-aligned left/width animation and ordinary positive stacking, without transformed or scaled pill layers. Contrast is updated in the same frame. Physical iOS rendering and audible latency acceptance remain unverified.
<!-- /development -->

## v3.33.2

Build: 2026-11-16 19:15:10 UTC

### Player Changes

- Swipe unselected tabs or empty bar space to scroll sideways. Only a drag starting on the highlighted selector moves the selection, with gentle edge following preserved.
- Improved text and icon drawing during selector drags to address temporary rendering artifacts. Partial selection contrast remains.

<!-- development -->
### Developer Notes

- Fixed a CSS specificity conflict that resolved tab buttons to pan-y inside a pan-x scrollable bar. Shared inherited axis rules preserve native horizontal input; selected buttons reserve drag gestures.
- Added two-dimensional pill hit testing, prevented pointer-focus reveal during scrolling, and kept routine filter refreshes from snapping back to the old selection.
- Replaced changing clip-path cuts on text and masks with pixel-aligned rectangular crops. Physical iOS rendering acceptance remains unverified.
<!-- /development -->

## v3.33.1

Build: 2026-11-16 14:55:23 UTC

### Player Changes

- Keep dragging the selected rarity tab near either edge to gently reveal more choices. Moving back toward the middle or releasing stops the scroll.
- Favorites stays immediately after All. Favorites and All retain rarity and catalogue order; you can still swipe unselected tabs to scroll directly.

<!-- development -->
### Developer Notes

- Shared segmented controls use bounded, frame-driven edge following only during a selected-pill drag. The pill stays within the visible bar as content scrolls beneath its grab point.
- Added mouse/touch and both-direction checks for easing, center stop, endpoints, selection, release and cancellation. Hidden pages and closed panels cancel pending follow frames.
<!-- /development -->

## v3.33.0

Build: 2026-11-16 14:47:43 UTC

### Player Changes

- Star cosmetic cards at the top-right and find them under Favorites, immediately after All in the sideways-scrolling rarity bar. Cards keep their usual rarity and catalogue order.
- Gallery rarity icons now sit at the bottom-left of previews, without repeating the rarity name below each card.
- Instrument previews change the current music's upcoming notes. Soundstages change its acoustic space, and Ambience plays underneath it. Each ten-second toggle restores your equipped choice afterward.
- Balanced background atmosphere levels so Forest and Hearth remain audible alongside other styles.
- Renamed the skill-tree root to Player and made covered menu backgrounds release held interaction immediately.

<!-- development -->
### Developer Notes

- Captured the active menu/gameplay PoolSound for preview start, progress and cleanup. Music overrides preserve arrangement scheduling and profile state; standalone cosmetic SFX retain ducking.
- Added optional validated per-profile cosmetic favorites, shared card controls, native horizontal filter panning and focused-tab reveal. Preserved legacy save shape when no favorites exist.
- Normalized long ambience buffers with peak headroom while preserving smooth phrase envelopes and loop seams. Added audio, persistence and hidden-input regressions.
<!-- /development -->

## v3.32.2

Build: 2026-11-16 13:00:26 UTC

### Player Changes

- Refocused the Wiki on playing, choosing cosmetics, understanding upgrades and keeping progress safe.
- Corrected skill ownership and mastery explanations, Music Volume naming, newer instrument choices and gamemode navigation.
- Kept rarity rules for all six cosmetic types in the regular Wiki. Development details now live in the Developer area.
- Clarified that older release notes describe past versions; use the guides for current behavior.

<!-- development -->
### Developer Notes

- Audited registered Wiki pages against current catalogue, reward, upgrade, preview and menu owners. Moved rendering, audio synthesis, experiment coverage and test evidence into Developer sections.
- Updated canonical Power-Ups and Medals generators and moved generated experiment coverage to the Developer page. Corrected current research totals while preserving historical economy samples.
- Added rendered-link coverage for both profiles, including hidden-section boundaries. Gameplay behavior is unchanged.
<!-- /development -->

## v3.32.1

Build: 2026-11-16 12:40:09 UTC

### Player Changes

- Music, Gamemodes and Stats keep their tab selectors at the bottom of the content panel. Music places its rarity filter above the category selector.
- Tab labels and icons retain partial selection contrast as you drag. The Player tab uses a filled backing that follows the bubble's shape.
- Taps, dragging, focus and scrolling no longer trigger extra cosmetic impacts. Automatic Impact previews vary their contact points around the bubble.
- Skills maps simplify distant artwork to help zooming stay responsive.

<!-- development -->
### Developer Notes

- Shared selector contrast uses solid clipped layers; Player backing draws before the material using the same membrane path. Native content scrolling remains separate from bottom tab bars.
- Both skill maps cache node references on graph rebuild, coalesce camera projection per frame and skip unchanged DOM writes. Asynchronous artwork decoding uses two concurrent jobs and a bounded 160-source cache, without world-sized raster allocation.
- Cosmetic input and intentional effect demonstrations remain distinct. Automated checks cover varied rim contacts, bounded decoding, cache reuse, graph invalidation and camera burst coalescing. Physical iPhone rendering and zoom acceptance remain pending.
- Restored the Development-only gate around the previous release's technical notes.
<!-- /development -->

## v3.32.0

Build: 2026-11-16 11:28:59 UTC

### Player Changes

- Cosmetic cards sort by rarity, then catalogue order. A persistent bottom bar filters Skins, Trails, Impacts, Instruments, Soundstages and Ambience by rarity.
- Tab selectors sit in bars inside their content panels. Improved touch dragging and removed clipping from the Player tab's animated outline.
- Scrolling still moves previews naturally without generating a burst of impacts on every scroll event.
- Music previews toggle on and off for up to ten seconds with a playback progress bar. Soundstage auditions apply to the music already playing and restore your equipped space afterward.
- Reworked Night Forest, Ember Hearth and Orbital Drift into longer, smoother atmospheres with varied, softly shaped details.

<!-- development -->
### Developer Notes

- Shared segmented controls handle touch and pointer input without duplicate gestures; live outline clipping uses the actual selection edges beyond the icon slot.
- Shared rarity filtering preserves card instances and detail return state. Catalogue projection keeps persistent IDs and authored within-tier order unchanged.
- Scroll deformation no longer sets the shared collision flag. Real contact effects and timed Impact demonstrations remain independent.
- Audition progress follows the audio clock; replacement and navigation invalidate pending starts. Soundstage overrides expire without mutating the equipped loadout, and room changes crossfade.
- Ambience uses 48-second seamless buffers, smooth event envelopes and a bounded three-style cache. Physical iPhone listening and touch acceptance remain separate from automated/browser checks.
<!-- /development -->

## v3.31.0

Build: 2026-11-16 10:55:58 UTC

### Player Changes

- Added 35 purchasable cosmetics: two Skins, Trails and Impacts per rarity, plus one Instrument per rarity. The regular Wiki lists the collection and rarity rules.
- Player, Trail and Impact previews share contact, scroll, keyboard-focus and device-motion response. Only the equipped Impact card shows your equipped trail; compact Trail icons travel slightly farther without taking more layout space.
- Sound previews fade background music out before the audition and back afterward, including rapid replays.
- Unpurchased skill nodes retain their top-right lock, including affordable nodes. Purchased checkmarks remain hidden.
- Large Skills maps simplify distant detail when zoomed out. The dotted background fades away at overview scale.
- Scrollbars follow the page as it bounces at the scroll limits; thickness still changes smoothly.

<!-- development -->
### Developer Notes

- Shared bubble interaction supplies passive contact, focus, scroll and sensor pressure. Large drag trails use explicit local tether positions, not viewport displacement.
- Cosmetic additions extend existing receipts, material/effect histories and synthesis. Audition ducking uses a separate audio-clock envelope with continuous replacement and no recovery timer races.
- Both trees share viewport projection and SVG viewBox ownership. Removed inverse-zoom background overscan and whole-world transforms. Full-tree phone-sized stress checks do not establish physical iOS acceptance.
<!-- /development -->

## v3.30.0

Build: 2026-11-16 04:33:01 UTC

### Player Changes

- Bubble shrinks and fades back to the player smoothly when its power ends. Stasis frost and translucency ease back to normal together; Swap preserves membrane visual tails. Wide Echo and Lasting Fan now state their reach and duration increases explicitly.
- Music now has independent Instruments, Soundstages and Ambience tabs. Purchase acoustic spaces and quiet background atmospheres, preview combinations, and use them in gameplay, menus, Casual and newly prepared highlights.
- Read the regular Wiki's Cosmetic Rarity guide for the rules for all six asset types.
- Browse pages use available width with desktop margins. Campaign Play/Resume stays full width at the bottom of its content frame; track artwork uses round bubbles.
- Gamemodes uses the shared All, Favorites, Development and Saved selector with matching icons. Sliding contrast crosses both text and icons smoothly.
- The equipped skin card shows its trail from local motion. Large player previews have a circular drag range with progressively increasing resistance.
- Updated the shared Play icon, filled the centers of Impacts and Casual icons, added Player Attributes artwork, and completed Wiki topic icons.
- Equip Skin, Trail and Impact use regular icons. Preview trails survive release and fade naturally.
- Back gesture feedback starts at your contact height. Scrollbar thickness eases on grab and release.

<!-- development -->
### Developer Notes

- Music environment ownership is shared by realtime playback and WAV export; finite impulse responses, cached seamless noise loops, independent legacy-compatible selections and bounded auditions preserve save and lifecycle boundaries.
- Campaign content and footer share a flex frame. Shared page shells default to available width; Wiki retains its prose measure.
- Segmented masks and text use spatial gradients; the live player contour clips against the highlight. Initial edge feedback shares the move-position owner. Preview tethers use radial soft limits and inverse mapping when grabbed again.
- Wiki topic lookup uses a static icon for every known page and explicit semantic topic overrides, with complete Contents coverage.
<!-- /development -->

## v3.29.4

Build: 2026-11-16 03:58:13 UTC

### Player Changes

- Remove the extra checkmark from purchased skills and their detail cards, keeping the artwork and rarity visible.

<!-- development -->
### Developer Notes

- Shared skill-node rendering retains only lock and borrowed badges; preserve accessible ownership text and active styling. Align the legend and guide with that presentation.
<!-- /development -->

## v3.29.3

Build: 2026-11-16 03:53:47 UTC

### Player Changes

- Stack Skins and Music icons above their labels, matching Trails and Impacts in Player.
- Keep skill-card names and types beside their artwork in either handedness layout.

<!-- development -->
### Developer Notes

- Share one two-row Personalize button layout while preserving compact icon sizes and overflowing dynamic effects.
- Align shared skill-card text toward its icon while preserving mirrored close-button placement.
<!-- /development -->

## v3.29.2

Build: 2026-11-16 02:55:25 UTC

### Player Changes

- Center the live Player skill root in the same square frame as the Powers tree, including while zooming.
- Give compact Trail icons less reserved width and more vertical movement.
- Buy and equip Music and other cosmetics without finishing an active pool first.
- Arrange Skins, Trails, Impacts and Music in two columns in Player.
- Drag the large Player and skin previews farther across their available area, then release to spring back; compact icons retain their smaller range.
- Keep skill-tree artwork sharp when zooming.
- Keep skin gallery thumbnails trail-free. Equipped-player icons trail their own movement, without trails caused by scrolling.
- Use regular static icons throughout Wiki.
- Restore outer margins and a gap around rounded page containers and title bars on larger screens.

<!-- development -->
### Developer Notes

- Separate screen-pixel canvas bounds from local CSS placement under transformed parents; share base-node frame and icon sizing.
- Use a two-diameter Trail slot and a minimum vertical trajectory for compact icons; retain dynamic paint bounds.
- Exempt cosmetic transactions from the active-pool gameplay-build guard while preserving validation and saved physics.
- Derive large-view tether limits from current viewer dimensions; keep compact icon motion local and gallery trails disabled. Add zoom, compact motion, active-run cosmetic and responsive drag regressions.
- Remove persistent transform-layer promotion from the tree, use allowlisted static Wiki artwork, and scope flush reader margins to compact layouts.
<!-- /development -->

## v3.29.1

Build: 2026-11-16 02:24:55 UTC

### Player Changes

- Give the pause status card the same artwork and clear text hierarchy as Continue.
- Prefix the HUD Points balance with its coin and show exact chains beyond five without growing the HUD.
- Use a solid challenge flag with a checkmark cutout for clearer small icons.
- Restore Development Points and Test Progress controls while an unfinished pool is saved. Keep the current pool build and Normal profile unchanged.

<!-- development -->
### Developer Notes

- Share menu-summary presentation; retain a fixed five-contact meter footprint when displaying larger totals.
- Replace blanket active-pool restrictions with profile/shared/save guards. Preserve buildBeforeResearch for max research and leave the old session before copying a readable Normal save.
- Add a persistence regression covering grants, level and research unlocks during a pool, next-pool adoption and Normal isolation.
<!-- /development -->

## v3.29.0

Build: 2026-11-16 02:00:15 UTC

### Player Changes

- Buy and equip Music instrument themes from Common to Mythic in Player. Preview their sound before spending Points.
- Match Trail and Impact icon player sizes to Skins, use more of each Trail button’s space, and keep effects sharp and unclipped. Shorter Impact previews and narrower card widths retain two columns on phones.
- Check for updates automatically when opening or returning to the game. Automatic updates start enabled and can be disabled in Settings → Updates.
- Use one complete Copy Report in Get Help, matching Email and Share. Remove the redundant upgrade instruction.
- Anchor the skill tree’s repeating dot background to the same world as its nodes, including during zoom.
- Add scoped AI-development and artwork disclosure in About, with attribution in Icon Credits.

<!-- development -->
### Developer Notes

- Share cosmetic-icon across titles, Player buttons and Wiki; render dynamic visual bounds independently of layout slots at backing-store pixel density. Continue visible-page offscreen simulation and sample one movement history.
- Add backwards-compatible Music receipts to the cosmetic catalogue, theme parameters to shared finite instruments, and grouped cancellable auditions. Menu/Casual and newly rendered song highlights use the selected timbre.
- Coalesce update lifecycle signals and retain coherent-build/save/visibility guards before restart. Keep startup diagnostics available separately from the unified support action.
- Use a fixed repeating CSS dot texture on the transformed map world; whole-tile overscan retains its phase without a second camera or frame loop.
<!-- /development -->

## v3.28.4

Build: 2026-11-16 00:58:25 UTC

### Player Changes

- Keep the Impacts title icon in the same compact space as other titles and double the Trails title artwork within that space.
- Halve Trail card preview height while keeping the artwork size and letting the bubble move closer to the card edges.
- Make Trail and Impact detail previews bounce off the visible play-area walls.

<!-- development -->
### Developer Notes

- Separate cosmetic title layout slots from their larger drawing canvases, avoiding low-resolution bitmap stretching. Preserve enlarged gallery artwork independently of stage height.
- Use radius-aware cosmetic arena collisions and wall-contact effect positions, with inward-velocity protection during resizing.
<!-- /development -->

## v3.28.3

Build: 2026-11-16 00:20:17 UTC

### Player Changes

- Make the animated artwork in Trails and Impacts cards three times larger, with responsive card spacing for complete effects.
- Make the general Impacts icon twice as large in buttons, title bars and Wiki links.
- Give Trail and Impact detail previews a larger dark play area that fills available space, with information beside it on wide screens and below on phones.
- Rename the Development view option to Show purchased items cost and include owned skins, trails and impacts alongside both skill trees.

<!-- development -->
### Developer Notes

- Give gallery thumbnails a 192px stage at a fixed vertical world scale and wider responsive columns. Scale general Impact icons with layout-aware spacing; preserve Trail title icon size.
- Remove the cosmetic detail width and canvas-height caps; use a responsive arena/information layout with the shared renderer following actual dimensions.
- Reuse the persisted purchased-cost preference across cosmetic galleries and details through one price renderer; preserve ownership, receipts and campaign reward presentation.
<!-- /development -->

## v3.28.2

Build: 2026-11-15 23:35:29 UTC

### Player Changes

- Try sound immediately when the app or page gains focus or returns to view. If the browser needs interaction, any ordinary tap retries without visiting Settings.
- Keep player icons and previews moving while scrolled offscreen on a visible page. Draw their trails and glow until the entire effect leaves the visible area.

<!-- development -->
### Developer Notes

- Prime output on foreground events even before context creation or when the context reports running; keep trusted gesture retries synchronous and respect mute, volume and pause.
- Separate page activity from paint clipping in the shared visual lifecycle. Use dynamic effect bounds and clipping ancestors, continue offscreen membrane/tether/cosmetic simulation, and bound canvas allocation to the visible region.
<!-- /development -->

## v3.28.1

Build: 2026-11-15 22:48:37 UTC

### Player Changes

- Keep the music panel collapsed until opened through Development Profile Active, including Melody Journey. The bar keeps its size and label, with an arrow when available.
- Make Mythic Aurora travel a continuous ambient shimmer with smooth motion changes and a soft stop. Legendary launch sounds remain unchanged.
- Show full pause navigation after returning to the app or page. Keep first-shot pull-back help until a successful launch.
- Preserve one continuous equipped trail while grabbing and moving player previews and icons; let the drawing area follow the tail so small icon boxes do not cut it short.
- Expand Wiki guidance for shared controls, cosmetic previews, Settings, handedness and Stats.

<!-- development -->
### Developer Notes

- Remove forced campaign music visibility, retain accessible disclosure state and unchanged strip geometry.
- Renew bounded phase-continuous travel voices rather than scheduling repeated attacks; retain finite auditions and audio lifecycle cleanup.
- Pair foreground pause presentation with interruption state; make onboarding guidance depend on launch state.
- Prevent zero-time observer repaints from breaking trail history, and document movement ownership and regression boundaries.
<!-- /development -->

## v3.28.0

Build: 2026-11-15 20:57:53 UTC

### Player Changes

- Trails follow moving players, icons and previews, including slow movement, dragging and scrolling.
- Legendary trails get launch sounds; Mythic trails add traveling sounds. Preview Sound fades the traveling sample during its final second.
- Use consistently styled sliders and scrollbar cursors across devices.
- Skills and Player Stats share a sliding selector whose text contrast follows the indicator. The indicator stays inside its container, and left-handed mode reverses tab order.
- Skills uses an opaque dotted background that follows map panning and zooming. Points appears before the selector in the standard layout.
- Skins, Trails and Impacts galleries fill their available width before wrapping. Trails and Impacts icons animate in Wiki links and other shared controls.
- About places game and developer information side by side when space allows. Icon Credits keeps clear spacing around every icon.
- Prepare the moving menu background before an exiting menu reveals it.
- Call five-contact achievements **5-Chains**, with the Ripple icon in Stats. Empty medal counts show a faded dash.

<!-- development -->
### Developer Notes

- Sample shared cosmetic trails from displacement, reproject decorative element movement into local canvas coordinates, and preserve hidden-state bounds and discontinuity handling.
- Share rarity sound policy and finite travel voices across pool, trial and Casual consumers; stop on inactive, hidden, muted and paused states. Native iPhone audibility remains a physical-device check.
- Keep range values and keyboard/assistive semantics in native inputs while custom DOM paints controls and shared pointer mapping drives input/change events.
- Extract segmented-control for cross-dialog Skills and within-page Stats, using actual button bounds for drag destinations and indicator placement. Keep domain-specific tree graphs separate.
- Reuse cosmeticThumbnailMount through the dynamic cosmetic-icon element. Preserve saved cosmetic IDs, bloom events and blooms counters while renaming current player-facing terminology.
- Project map dots through the existing camera callback and prime uncovered backgrounds in the pre-paint dialog mutation phase. Covered backgrounds continue simulation without rendering or receiving input.
<!-- /development -->

## v3.27.3

Build: 2026-11-15 20:17:55 UTC

### Player Changes

- Restore the Development bar during loading, with its space already reserved before the main menu appears.
- Retry sound unlocking on ordinary taps and clicks without needing to visit Settings.
- Browse Trails and Impacts like Player Skins: open a style for a larger animated preview and its Equip or Unlock card, then return to the gallery.
- See the selected skin, trail or impact as a live title-bar icon in its preview page. Mythic effects keep their Preview Sound button.

<!-- development -->
### Developer Notes

- Allow the Development popover through startup visibility rules and measure its reservation during loading; entering and ready no longer introduce a layout change.
- Re-prime audio on trusted activation even when AudioContext reports running. Include click in shared recovery while retaining bounded lifecycle retries, active-menu gating and mute/pause behavior. Physical iOS audibility remains unverified.
- Reuse the Skins gallery/detail styles for cosmetic menus, preserve gallery scroll and thumbnail instances, and share the cosmetic preview renderer with title icons. Keep purchase and save contracts unchanged.
<!-- /development -->

## v3.27.2

Build: 2026-11-15 19:14:28 UTC

### Player Changes

- Restore the Development Profile Active bar automatically after loading a saved Development profile or returning to the app, without toggling Development mode.
- Keep the music disclosure open when the game refreshes the same profile.

<!-- development -->
### Developer Notes

- Wait for startup readiness before presenting the Development popover, then reconcile its visibility on startup, profile and modal changes.
- Re-promote the bar on page and foreground restoration, and recover unexpected native popover dismissal without repeated hide/show cycles during normal updates.
- Cover saved-profile startup, repeat synchronization, page restoration, disclosure retention and Normal/shared/Casual exclusions with lifecycle regressions.
<!-- /development -->

## v3.27.1

Build: 2026-11-15 18:21:23 UTC

### Player Changes

- Adjust bottom spacing for installed iPhone apps that already reserve a strip outside the game, including Home, Casual, Pause and the Development bar.
- Use the full available screen height in app mode.
- Find Technical Diagnostics in Settings → Get Help. Clear descriptions explain when to copy diagnostics and what a full Support Report includes.

<!-- development -->
### Developer Notes

- Measure fixed and dynamic viewport bounds together. Keep standard env() insets except for the narrow installed-iPhone portrait signature described in WebKit #313800; normalize saved page zoom for that comparison, never size the page from screen dimensions, and preserve keyboard clipping separately.
- Remove deprecated apple-mobile-web-app-status-bar-style=black-translucent following WebKit guidance. Existing installed shell behavior may persist; physical-device confirmation remains pending.
- Diagnostics reports screen dimensions, visual offsets, both viewport measurements and raw versus effective bottom insets. Move its existing Settings node into Get Help without changing startup recovery or report privacy boundaries.
- Add regressions for the reported 1.15-scale geometry, corrected shells, ordinary tabs, landscape, split-width windows and keyboard restoration.
<!-- /development -->

## v3.27.0

Build: 2026-11-15 17:45:17 UTC

### Player Changes

- See animated Trail and Impact previews in the gallery and on your Player menu buttons.
- Find Bounce Effects under their new name: Impacts. Your purchases and equipped styles stay the same.
- Hear a rising chime when launching with the Mythic Aurora trail, and crystalline accents when Prismatic Nova hits a bubble or wall.
- Try Mythic sounds with Preview Sound before unlocking a style. Tap again to replay immediately; previews follow master volume and mute.

<!-- development -->
### Developer Notes

- Share the cosmetic renderer and visibility lifecycle across selected previews, gallery thumbnails and Player buttons; preserve live thumbnails when selection changes.
- Route finite Mythic accents through existing pool, trial and Casual audio owners. Keep menu autoplay and animated thumbnails silent, throttle rapid impacts and stop preview voices on navigation or interruption.
- Preserve bounce.* save IDs, the bounce-effects route and legacy Wiki anchors while changing player-facing terminology to Impacts.
- Cover animated geometry, offscreen suspension, Mythic-only event routing, repeated audition cleanup, mute/volume gating and silent background simulation.
<!-- /development -->

## v3.26.1

Build: 2026-11-15 17:07:05 UTC

### Player Changes

- Keep Home, Casual, Pause and menu bars on the same screen bounds when Safari or app mode changes the available space.
- Avoid extra bottom clearance when browser controls already cover that area.
- Keep the Development strip thin, its text readable, and its position steady when opening menus.

<!-- development -->
### Developer Notes

- Measure the dynamic CSS viewport together with its safe-area insets; keep keyboard and older-browser fallbacks without guessing device chrome from screen dimensions.
- Anchor the Development strip to the shared app-height boundary and avoid reopening its popover on same-layer navigation.
- Include measured viewport, effective safe insets, profile reservation and installed-app state in Diagnostics.
- Cover stale window heights, partial browser-chrome overlap, keyboard restoration, orientation changes and popover layer transitions.
<!-- /development -->

## v3.26.0

Build: 2026-11-15 16:31:35 UTC

### Player Changes

- Keep Trails and Bounces previews visible while scrolling the choices; see actual effect thumbnails on cards and equipped Player buttons.
- Group Appearance options together, with Skills and Stats paired below. Owned skins show a clean equip panel without purchase Points or unnecessary scrolling.
- Give cosmetic rarities distinctive materials and effects, from restrained Common styles to reactive Legendary artwork and evolving Mythic layers. Cosmetics still grant no gameplay advantage.
- Make scrolling move player icons gently and let previews return smoothly to center. Hidden previews retain their state while animation pauses.
- Keep moving Main Menu and Casual bubbles within the screen's safe area.
- Make held scrollbars twice as thick while keeping them inset in the existing blank space.
- Disable battery and motion options when usable device data is unavailable. Full Screen now uses a checkbox that follows the browser's actual state.
- Refine Get Help button styling, Settings separators, and the filled Bubble and Bulldozer icons.

<!-- development -->
### Developer Notes

- Keep Developer Notes collapsed inside each version until opened.
- Share visibility gating across player bubbles, skin tethers and cosmetic previews; preserve state through intersection, CSS, dialog and page suspension.
- Bound scroll pressure targets and damp positional return; keep tap/drag membrane response and gameplay physics separate.
- Share static thumbnail drawing with live cosmetic rendering, preserve preview aspect ratio and handle unset profile colors.
- Apply pool safe-area offsets and Development reservation once, using the same canvas bounds for simulation, rendering and input.
- Synchronize fullscreen state and capability controls; cover unavailable, late, interrupted and rejected browser responses.
- Open all ancestor disclosures for Wiki deep links while preserving the Development-only notes gate.
<!-- /development -->

## v3.25.1

Build: 2026-11-15 10:54:03 UTC

### Player Changes

- Keep bubbles and the player fully shaped throughout the expanded Main Menu and Casual pool, including the lower part of tall phone screens.

<!-- development -->
### Developer Notes

- Use shared physical pool bounds for membrane outline clipping. Remove the remaining fixed scored-board clamp; retain the original inset for scored play.
- Cover player and ordinary bubbles beyond the old board limits, actual viewport edges and both quality levels with a geometry regression.
<!-- /development -->

## v3.25.0

Build: 2026-11-15 10:48:37 UTC

### Player Changes

- Unlock **Bulldozer** after Focused Impact: shove bubbles aside, keep moving forward, and retain most of your speed. Split seeds share the power.
- Research Heavy Treads, Driving Force, Long Haul and Clear Path to improve momentum, shove strength, duration and nearby clearing waves.
- Add **Smooth Glide** and **Silken Glide** to reduce drag during the opening three seconds of a shot.
- Add **Steady Shell** and **Resilient Shell** to recover speed lost in bubble collisions while keeping your bounce direction.
- Inspect the new upgrades with individual artwork, before/after values and response graphs. Stats shows both new player attributes.
- Keep power effects visible throughout the full Home and Casual pool, including Spring and Wrap boundary cues.
- Use the skill-tree symbol consistently for Powers destinations.

<!-- development -->
### Developer Notes

- Add version 19 powered-flight validation with version 18 compatibility. Optional Glide/Steady ranks default to zero in legacy player builds; purchases use the existing profile transaction.
- Resolve Bulldozer contacts in the shared fixed-step solver, including activating contacts and Split seeds. Bound per-bubble Clear Path waves and reuse the shared fading effect renderer.
- Apply collision recovery after the existing first-note speed floor; preserve normal coast timing, immutable supplied builds and saved-flight replay.
- Generate new upgrade SVGs and the power reference from their canonical owners; update shared Stats and purchase comparisons.

<!-- /development -->

## v3.24.1

Build: 2026-11-15 10:26:42 UTC

### Player Changes

- Keep full-screen content clear of the status bar and notch as the device rotates or the app resumes.
- Fill the actual screen with the Home and Casual pool, without letterboxed play areas.
- Grab, drag, fling or tap scrollbars using their existing blank edge space, including skill cards.
- Find Updates and Get Help in separate Settings sections. Update feedback stays below its button without shifting it.
- Restart Sound Check on every press, even while a previous check is playing. Restore gameplay sounds after interruptions.
- Keep the Development indicator visibly thin; the home-indicator clearance uses the surrounding screen color.
- Use filled device motion and battery saver icons with clear cutouts.
- Tap or drag the Skills tab selection with elastic settling. Power starting nodes are rounded squares, final upgrades are round, and unpurchased connections are dashed.

<!-- development -->
### Developer Notes

- Give the full-screen dialog safe-area rule sufficient specificity and treat saved Safari page zoom as the viewport baseline.
- Expand only the detached Home/Casual session's physical bounds to match its screen aspect ratio. Saved and scored pools retain canonical dimensions.
- Extend native-position scrollbar controls to touch with bounded momentum and cancellation; position indicators inside existing local or parent padding without adding gutters.
- Share idempotent audio voice cleanup across live and offline instruments. Reap expired voices when ended callbacks are delayed, bound resume attempts, and let new gestures retry pending media playback.
- Keep physical iOS audibility and interruption behavior separate from automated lifecycle and browser layout evidence.
<!-- /development -->

## v3.24.0

Build: 2026-11-15 09:43:32 UTC

### Player Changes

- Choose Trails and Bounce Effects from the Player menu, with animated previews before purchasing.
- Unlock Common, Rare, Epic, Legendary and Mythic cosmetic styles with Points. Equip owned styles freely.
- Add six player skins, including a Cure Interactive bubble, while keeping earned campaign skins.
- Share your equipped look across gameplay, Casual, menu autoplay, player icons and previews.
- Keep bottom bars attached to the screen edge, including Settings opened from Pause and app mode.
- Use a filled phone Display icon with earpiece and microphone cutouts.
- Check for Updates beside Get Help in app-mode Settings. A ready update saves progress and restarts the app; offline or save problems keep the current app open.
- Show the build date and time below the About version and beneath each tagged changelog version.

<!-- development -->
### Developer Notes

- Optional validated profile cosmetic receipts preserve legacy saves and historical prices. Purchases use the existing transactional progression owner, including the suspended profile during shared challenges.
- Share cosmetic trails and collision feedback through CosmeticVisual without changing physics, scoring, power effects or rewards. Skin materials remain clipped to the genuine membrane.
- Move mobile safe-area clearance inside navigation surfaces; keep installed-app viewport sizing independent of stale browser-toolbar measurements while respecting focused editors.
- Generate build metadata and historical changelog dates from commit timestamps with tool/build.mjs. Match the generated release time to the final source commit's committer date.
<!-- /development -->

## v3.23.5

Build: 2026-11-15 09:13:49 UTC

### Player Changes

- Use the skill-tree icon for the Powers navigation button.
- Give UI section subtitles matching icon prefixes and improve Diagnostics spacing.
- Give both Skills legends better panel padding and section spacing while retaining icon-to-label spacing.
- Slide the selected background smoothly between the Powers and Player tabs, including when reversing direction.
- Group Development settings by purpose, with the Points amount beside Add Points and quick additions underneath.
- Match Import Backup and Export Backup buttons, using the Cure Interactive Import and Export artwork.
- Give text fields consistent dark, rounded styling and readable text on mobile.
- Keep the complete Main Menu and Casual pool inside the available screen area.
- Let device tilt and movement nudge player icons and previews. Find its new tilted-phone icon and enable Device Motion under Settings → Display when your browser requires permission.

<!-- development -->
### Developer Notes

- Share section-title styling across Settings, game collections, campaign, experiments, support and skill-stat sections.
- Keep existing title artwork, native file selection, saved preferences and backup validation intact.
- Add portable icon credits and notices; retain the rejected bold-icon proposal as historical only.
- Share a fitted Menu/Casual camera with inverse touch mapping and safe-area bounds.
- Feed bounded, screen-oriented sensor forces into the shared decorative player membrane; preserve gameplay, clipping limits and touch behavior. Handle unavailable sensors, permission denial, hidden pages and stale events.
<!-- /development -->

## v3.23.4

Build: 2026-11-15 05:21:48 UTC

### Player Changes

- Find a matching icon beside every Settings and Development toggle, with its checkbox on the right.
- Mirror toggle controls when Left-Handed Layout is enabled.
- Keep mobile navigation bars compact, with home-indicator clearance below the bar in app view.

<!-- development -->
### Developer Notes

- Share toggle layout across all seven existing native checkbox controls, preserving labels, keyboard input and saved preferences.
- Separate navigation-row height from bottom safe-area reservation; adjacent footers and the Development strip still own their inset once.
- Add original Sound and Battery Saver artwork with Icon Credits and provenance.
<!-- /development -->

## v3.23.3

Build: 2026-11-15 05:01:50 UTC

### Player Changes

- Add the View More icon to the iPhone and iPad installation steps.
- Show matching menu and installation icons for Android, Mac, Windows, Linux and Chromebook guides.
- Give Chrome, Edge, Samsung Internet and Firefox their own instructions, with clear alternatives when installation is unavailable.

<!-- development -->
### Developer Notes

- Keep action artwork scoped to each browser guide so Android steps never show iOS Share or Home Screen artwork.
- Preserve capability-based fullscreen and installed-app detection; cover browser precedence and iPad desktop identification.
- Record all new original instructional artwork in Icon Credits.
<!-- /development -->

## v3.23.2

Build: 2026-11-15 04:34:12 UTC

### Player Changes

- Show matching player-upgrade icons for launch speed, aiming guides and wall rebound in Stats.
- Give Powers its own energized-bubble icon in Skills, Stats, Wiki and the Bubble Powers panel.
- Use the Points coin for research spending and launch artwork for shot records.

<!-- development -->
### Developer Notes

- Reuse canonical upgrade SVGs through shared UI icon masks; keep Powers distinct from Skills, Bloom and shutdown.
- Register original Powers artwork and provenance in Icon Credits.
<!-- /development -->

## v3.23.1

Build: 2026-11-15 04:06:58 UTC

### Player Changes

- Use a smartphone silhouette for mobile Display settings.

<!-- development -->
### Developer Notes

- Give the display owner a dedicated mobile-device asset; retain the phone receiver icon and its original attribution separately.
<!-- /development -->

## v3.23.0

Build: 2026-11-15 04:05:10 UTC

### Player Changes

- Choose a frame-rate limit and optional automatic battery saving: Low quality and 30 FPS at 20% battery or below while unplugged, on browsers that expose battery state.

- Use Cure Interactive radio icons for single-choice dropdowns and matching checked/unchecked icons for checkboxes.
- Place Change Logs beneath the game description and give About content more breathing room.
- Illustrate iPhone installation steps with Safari, Share and Add to Home Screen symbols, with important control names in bold.
- Use a phone or monitor icon for Display settings to match the device.
- Keep Get Help, Progress Recovery and Development cards inset from the screen edges.
- Preserve player icon and preview jiggle through resizing, scrolling, backgrounding and reconnection.
- Recover sound after browser interruptions and returning to the game; preserve paused music through repeated background events.

<!-- development -->
### Developer Notes

- Render decorative selection icons through the shared UI icon owner while preserving native select behavior and accessible labels.
- Reuse the canonical icon collection assets with their existing attribution; disabled checkboxes retain their state artwork.
- Keep device classification in the display owner, independent of viewport size, and format trusted installation steps with escaped text.
- Apply mobile content padding separately from full-width navigation bars.
- Share gesture, foreground and AudioContext interruption recovery across gameplay/UI and menu music; never resume gameplay or override mute. Preserve ambient intent until visibility restoration.
<!-- /development -->

## v3.22.4

Build: 2026-11-15 03:39:44 UTC

### Player Changes

- Show the same power trails, portal details, impact reactions and Split reunion effects in regular play, Casual and the main-menu pool.
- Keep keyboard focus rings out of touch and mouse navigation, while preserving them for keyboard controls.
- Give development details the Cure Interactive code icon.
- Keep supported phones awake during play, including Casual; allow sleep again in menus and while paused.
- Activate powerups carried by bubbles captured by Orbit.
- Fade persistent power graphics out smoothly when their effects end.
- Clear hit indicators when the player stops, while retaining the completed shot's results.
- Use matching game-styled dropdowns with selected-option checks and keyboard controls.

<!-- development -->
### Developer Notes

- Route pool effects, membranes, trails and particles through PoolVisual; retain mode-specific aiming, score and music overlays in their callers.
- Track input modality once for the whole interface, without removing accessible focus or text editing.
- Check every power through direct and detached physics, at High and Low quality, and validate Wiki icon assets including development-only headings.
- Share screen wake-lock ownership across gameplay screens, with visibility, pending-request and denial handling.
- Route satellite pickups through powerCollect; keep turn-hit presentation separate from retained scoring history.
- Retain bounded visual-only exit snapshots for 450 ms; renewing a power retires its outgoing snapshot.
- Progressively enhance native select value/change contracts with one shared themed popup.
<!-- /development -->

## v3.22.3

Build: 2026-11-15 03:03:16 UTC

### Player Changes

- Show Lightning bolts and struck-bubble flashes consistently, including Casual and Low quality.
- Keep the player's glowing rim and add a separate, jiggling selection outline in Skills.
- Let player icons and previews react to scrolling, with more room for movement and glow.
- Remove background strips and gaps from full-page menus and guides.
- Stop covered backgrounds from reacting to taps through a page.
- Restore the main menu if a screen closes without another destination.
- Give skin selection a clearer Equip Skin button and checked Equipped state.
- Play edge-back feedback when swiping both forward and backward.

<!-- development -->
### Developer Notes

- Share Lightning bolt lifetime and rendering through PowerVisual, and membrane strike feedback through poolBubbleEvent.
- Share membrane path construction, expand UI canvas bounds, and preserve native scrolling while applying bounded scroll impulses.
- Mark opaque screen coverage in CSS; skip background drawing and input while continuing physics and ambient composition.
- Recover unhandled native dialog exits after synchronous navigation completes; preserve intentional Casual and gameplay screens.
- Emit gesture progress cues on stage changes in either direction, including returning to zero.
<!-- /development -->

## v3.22.2

Build: 2026-11-15 02:40:05 UTC

### Player Changes

- Give menus, panels and Wiki pages slim, rounded scrollbars inspired by iOS.
- Remove scrollbar arrows and solid tracks, with clearer thumbs when hovered or dragged.

<!-- development -->
### Developer Notes

- Share app-owned overlay indicators across scroll surfaces, with native scroll positions, proportional thumbs, clipping and mouse drag support.
- Remove the campaign carousel’s separate scrollbar palette.
<!-- /development -->

## v3.22.1

Build: 2026-11-15 02:28:31 UTC

### Player Changes

- Keep the Development bar compact when showing or hiding music.

<!-- development -->
### Developer Notes

- Match the profile status and music disclosure to the same 20px height, with safe-area space reserved separately.
<!-- /development -->

## v3.22.0

Build: 2026-11-15 02:21:39 UTC

### Player Changes

- Add loading bars for Wiki pages, credits and game startup.
- Add edge-back initiation and wind-up sounds.
- Remove “Back to the pool” from Icon Credits.
- Restore player bubble jiggle with OS reduced-motion settings enabled, including the iOS path.
- Replace Gentle Visuals with High, Balanced and Low rendering quality.
- Keep ambient music playing while paused.
- Share the main/pause menu layout, including bottom-positioned mobile buttons.
- Add version-by-version change logs in Settings About and the Wiki.

<!-- development -->
### Developer Notes

- Shared loading-bar styles preserve indeterminate, ready and failure states without fabricated percentages.
- Edge Back reports gesture stages through the shared UI audio route.
- Quality preferences migrate legacy Gentle Visuals saves and cap canvas density independently of simulation.
- Player membranes and preview tethers no longer consult OS reduced-motion preferences.
- Ambient playback is independent of simulation pause; background-tab suspension remains separate.
- Home and Pause mount the same menu layout, title and action structure.
- Changelog coverage is checked against release tags, with developer sections filtered by the Wiki profile gate.
<!-- /development -->

## v3.21.0

Build: 2026-11-15 01:53:13 UTC

### Player Changes

- Use the game title, version and bubble background in full-screen pause.
- Move Casual's pause control to the preferred bottom corner.
- Add UI sounds and improve interrupted-audio recovery.

<!-- development -->
### Developer Notes

- Share the full-screen pause presentation and recover UI audio.
- Updated modules: `ui-sound.js`, `pause.css`, `app.js`, `sound.js`.
<!-- /development -->

## v3.20.22

Build: 2026-11-15 01:34:11 UTC

### Player Changes

- Use the standard pause menu in Casual.

<!-- development -->
### Developer Notes

- Use the standard pause menu in Casual.
- Updated modules: `game-menu.js`, `drift-ui.js`, `app.js`, `game-menu.css`.
<!-- /development -->

## v3.20.21

Build: 2026-11-15 01:27:13 UTC

### Player Changes

- Center and enlarge gameplay pause icons.

<!-- development -->
### Developer Notes

- Center and enlarge gameplay pause icons.
- Updated modules: `app.js`, `progression-ui.js`, `tree-ui.js`, `player-upgrade-ui.js`.
<!-- /development -->

## v3.20.20

Build: 2026-11-15 01:21:18 UTC

### Player Changes

- Move the help introduction into its support card.

<!-- development -->
### Developer Notes

- Move help introduction into support card.
- Updated modules: `app.js`, `save-recovery-ui.js`, `progression-ui.js`, `game-menu.js`.
<!-- /development -->

## v3.20.19

Build: 2026-11-15 01:15:40 UTC

### Player Changes

- Align menu content widths with navigation bars.
- Remove card styling from full-width bars.

<!-- development -->
### Developer Notes

- Align menu widths and flatten full-width navigation.
- Updated modules: `screen-header.css`, `glass.css`, `app.js`, `game-menu.js`.
<!-- /development -->

## v3.20.18

Build: 2026-11-15 01:07:29 UTC

### Player Changes

- Prevent whole-app zoom while keeping in-game gestures.

<!-- development -->
### Developer Notes

- Prevent whole-app page zoom.
- Updated modules: `startup.js`, `app.js`, `style.css`, `screen.css`.
<!-- /development -->

## v3.20.17

Build: 2026-11-15 01:02:05 UTC

### Player Changes

- Give player icons and previews the shared bubble tap and repulsion response.

<!-- development -->
### Developer Notes

- Share bubble pressure with player icons and previews.
- Updated modules: `player-bubble.js`, `bubble-pressure.js`, `app.js`, `menu-pool.js`.
<!-- /development -->

## v3.20.16

Build: 2026-11-15 00:51:18 UTC

### Player Changes

- Round the Points labels beneath skill-tree icons.

<!-- development -->
### Developer Notes

- Round skill tree Points labels.
- Updated modules: `app.js`, `tree.css`, `game-menu.js`.
<!-- /development -->

## v3.20.15

Build: 2026-11-15 00:45:26 UTC

### Player Changes

- Player appearance is unchanged in this maintenance release.

<!-- development -->
### Developer Notes

- Remove the retired player-skin artwork.
- Updated modules: `app.js`, `gamemode-ui.js`, `progression-ui.js`, `wiki-icon.js`.
<!-- /development -->

## v3.20.14

Build: 2026-11-15 00:38:22 UTC

### Player Changes

- Use the Cure Interactive external-link icon on the developer card.

<!-- development -->
### Developer Notes

- Use the canonical external icon on the Cure card.
- Updated modules: `app.js`, `gamemode-ui.js`, `progression-ui.js`, `wiki-icon.js`.
<!-- /development -->

## v3.20.13

Build: 2026-11-15 00:30:47 UTC

### Player Changes

- Place Get Help at the bottom of Settings.

<!-- development -->
### Developer Notes

- Keep Get Help at the bottom of Settings.
- Updated modules: `app.js`, `save-recovery-ui.js`, `save-recovery.css`, `glass.css`.
<!-- /development -->

## v3.20.12

Build: 2026-11-15 00:23:56 UTC

### Player Changes

- Extend the play area and information bars to the screen edges.

<!-- development -->
### Developer Notes

- Expand gameplay and HUD to the screen edges.
- Updated modules: `bottom-bar.css`, `app.js`, `glass.css`, `game-menu.js`.
<!-- /development -->

## v3.20.11

Build: 2026-11-15 00:14:30 UTC

### Player Changes

- Align gameplay labels and clarify indicators.
- Allow earned power slots to repeat from the available unlocked powers.

<!-- development -->
### Developer Notes

- Align HUD labels and fill earned power slots.
- Updated modules: `bottom-bar.css`, `app.js`, `engine.js`, `progression-ui.js`.
<!-- /development -->

## v3.20.10

Build: 2026-11-14 22:50:58 UTC

### Player Changes

- Link the About developer card to the Cure Interactive website.

<!-- development -->
### Developer Notes

- Link the About developer card to Cure Interactive.
- Updated modules: `screen.css`, `app.js`, `game-menu.js`.
<!-- /development -->

## v3.20.9

Build: 2026-11-14 22:45:17 UTC

### Player Changes

- Disable right-click actions throughout the game.

<!-- development -->
### Developer Notes

- Disable secondary clicks throughout the game.
- Updated modules: `startup.js`, `app.js`, `game-menu.js`.
<!-- /development -->

## v3.20.8

Build: 2026-11-14 22:38:52 UTC

### Player Changes

- Send support reports to the Cure Interactive inbox with the game, report type and player name in the subject.

<!-- development -->
### Developer Notes

- Route named support reports to the main inbox.
- Updated modules: `diagnostics.js`, `app.js`, `progression-ui.js`, `wiki.js`.
<!-- /development -->

## v3.20.7

Build: 2026-11-14 22:30:19 UTC

### Player Changes

- Strengthen support-card backgrounds for clearer text.

<!-- development -->
### Developer Notes

- Enforce opaque support cards.
- Updated modules: `app.js`, `glass.css`, `game-menu.js`.
<!-- /development -->

## v3.20.6

Build: 2026-11-14 22:26:44 UTC

### Player Changes

- Place menu text inside readable cards.

<!-- development -->
### Developer Notes

- Keep menu text readable inside cards.
- Updated modules: `glass.css`, `progression-ui.js`, `save-recovery-ui.js`, `app.js`.
<!-- /development -->

## v3.20.5

Build: 2026-11-14 22:15:43 UTC

### Player Changes

- Compact the gameplay display to give the pool more room.
- Add explanatory information cards for gameplay indicators.

<!-- development -->
### Developer Notes

- Reclaim play area with a compact HUD.
- Updated modules: `bottom-bar.css`, `app.js`, `hud-help.js`, `hud-medal.js`.
<!-- /development -->

## v3.20.4

Build: 2026-11-14 18:50:20 UTC

### Player Changes

- Keep collected power icons visible with checkmark badges.

<!-- development -->
### Developer Notes

- Keep collected power icons with checkmark badges.
- Updated modules: `app.js`, `progression-ui.js`, `power-ui.js`, `menu-background.js`.
<!-- /development -->

## v3.20.3

Build: 2026-11-14 18:42:01 UTC

### Player Changes

- Repair campaign saves and Development reset rewards.
- Fix skill previews and missing upgrade artwork.

<!-- development -->
### Developer Notes

- Repair campaign saves, skill previews and Development reset rewards.
- Updated modules: `app.js`, `progression-ui.js`, `profile.js`, `trial-ui.js`.
<!-- /development -->

## v3.20.2

Build: 2026-11-14 18:12:56 UTC

### Player Changes

- Improve mobile save recovery and provide direct support reports.

<!-- development -->
### Developer Notes

- Improve mobile save recovery and direct support.
- Updated modules: `diagnostics.js`, `progression-ui.js`, `save-recovery.css`, `save-recovery-ui.js`.
<!-- /development -->

## v3.20.1

Build: 2026-11-14 17:28:16 UTC

### Player Changes

- Name the new self-playing mode Casual.

<!-- development -->
### Developer Notes

- Rename Drift to Casual.
- Updated modules: `wiki.js`, `app.js`, `drift-ui.js`, `gamemode-ui.js`.
<!-- /development -->

## v3.20.0

Build: 2026-11-14 17:20:23 UTC

### Player Changes

- Add a self-playing casual pool with unlocked powers and no Points or medals.

<!-- development -->
### Developer Notes

- Add reward-free Drift casual mode.
- Updated modules: `app.js`, `drift-ui.js`, `game-menu.js`, `wiki.js`.
<!-- /development -->

## v3.19.6

Build: 2026-11-14 17:03:11 UTC

### Player Changes

- Make menu bubbles dent toward the tap.

<!-- development -->
### Developer Notes

- Dent menu bubbles toward the tap.
- Updated modules: `game-menu.js`, `app.js`, `menu-pool.js`, `menu-background.js`.
<!-- /development -->

## v3.19.5

Build: 2026-11-14 16:54:54 UTC

### Player Changes

- Outline selected player icons in the control's text colour.

<!-- development -->
### Developer Notes

- Outline selected player icons with their text color.
- Updated modules: `app.js`, `progression-ui.js`, `tree-ui.js`, `player-bubble.js`.
<!-- /development -->

## v3.19.4

Build: 2026-11-14 16:48:43 UTC

### Player Changes

- Keep player previews and icons visibly deforming after their initial bounce.

<!-- development -->
### Developer Notes

- Keep player previews and icons visibly deforming.
- Updated modules: `app.js`, `player-bubble.js`, `progression-ui.js`, `tree-ui.js`.
<!-- /development -->

## v3.19.3

Build: 2026-11-14 16:40:20 UTC

### Player Changes

- Prevent unrelated startup errors from flashing a failure screen.
- Give the loading and menu entrance animations more time.

<!-- development -->
### Developer Notes

- Prevent false startup failures and pace the menu entrance.
- Updated modules: `startup.js`, `startup.css`, `app.js`, `diagnostics.js`.
<!-- /development -->

## v3.19.2

Build: 2026-11-14 16:28:50 UTC

### Player Changes

- Make Sound Check play low, medium and full-strength gameplay notes.

<!-- development -->
### Developer Notes

- Calibrate Sound Check to gameplay note loudness.
- Updated modules: `sound.js`, `app.js`, `game-menu.js`, `wiki.js`.
<!-- /development -->

## v3.19.1

Build: 2026-11-14 16:21:27 UTC

### Player Changes

- Remove notes, icons and hit counters from main-menu bubbles.

<!-- development -->
### Developer Notes

- Hide interior menu bubble markings.
- Updated modules: `pool-bubble.js`, `app.js`, `menu-background.js`, `game-menu.js`.
<!-- /development -->

## v3.19.0

Build: 2026-11-14 16:16:15 UTC

### Player Changes

- Let players edit their name beneath the preview.
- Keep name entry readable without field-triggered mobile zoom.

<!-- development -->
### Developer Notes

- Add inline player names and readable keyboard controls.
- Updated modules: `progression-ui.js`, `player-menu.js`, `app.js`, `profile.js`.
<!-- /development -->

## v3.18.2

Build: 2026-11-14 16:07:20 UTC

### Player Changes

- Close the Skills legend when tapping outside it.

<!-- development -->
### Developer Notes

- Dismiss skill legends on outside taps.
- Updated modules: `skill-card.js`, `tree-ui.js`, `app.js`, `player-upgrade-ui.js`.
<!-- /development -->

## v3.18.1

Build: 2026-11-14 16:01:46 UTC

### Player Changes

- Place Player destinations in two columns where space allows.

<!-- development -->
### Developer Notes

- Arrange Player destinations in responsive columns.
- Updated modules: `game-menu.css`, `app.js`, `game-menu.js`.
<!-- /development -->

## v3.18.0

Build: 2026-11-14 15:51:14 UTC

### Player Changes

- Make the main-menu background a self-playing Free Play pool.
- Use genuine bubbles and powers with composed ambient music.

<!-- development -->
### Developer Notes

- Use self-playing Free Play for the menu.
- Updated modules: `app.js`, `pool-bubble.js`, `menu-background.js`, `menu-pool.js`.
<!-- /development -->

## v3.17.10

Build: 2026-11-14 15:33:17 UTC

### Player Changes

- Give player previews and icons the same squishy motion as the player in the pool.

<!-- development -->
### Developer Notes

- Share elastic player rendering.
- Updated modules: `player-bubble.js`, `app.js`, `bubble-render.js`, `skin.css`.
<!-- /development -->

## v3.17.9

Build: 2026-11-14 15:18:03 UTC

### Player Changes

- Add custom artwork for player upgrades.

<!-- development -->
### Developer Notes

- Add custom player upgrade icons.
- Updated modules: `app.js`, `progression-ui.js`, `player-upgrade.js`, `gamemode-ui.js`.
<!-- /development -->

## v3.17.8

Build: 2026-11-14 15:09:18 UTC

### Player Changes

- Keep titles opposite Back and Close controls.

<!-- development -->
### Developer Notes

- Place titles opposite handed navigation.
- Updated modules: `screen-header.css`, `tree-switch.css`, `handedness.css`, `app.js`.
<!-- /development -->

## v3.17.7

Build: 2026-11-14 14:01:16 UTC

### Player Changes

- Rename the credits title to Icon Credits.

<!-- development -->
### Developer Notes

- Rename credits bar to Icon Credits.
- Updated modules: `app.js`, `game-menu.js`.
<!-- /development -->

## v3.17.6

Build: 2026-11-14 13:53:46 UTC

### Player Changes

- Remove the unused Stream View option.

<!-- development -->
### Developer Notes

- Remove obsolete Stream View.
- Updated modules: `app.js`, `screen.css`, `bottom-bar.css`, `style.css`.
<!-- /development -->

## v3.17.5

Build: 2026-11-14 13:38:14 UTC

### Player Changes

- Add icons to interface title bars.

<!-- development -->
### Developer Notes

- Add shared UI title-bar icons.
- Updated modules: `app.js`, `progression-ui.js`, `screen-header.js`, `screen-header.css`.
<!-- /development -->

## v3.17.4

Build: 2026-11-14 13:27:07 UTC

### Player Changes

- Use chart artwork for Stats and tree artwork for Skills.

<!-- development -->
### Developer Notes

- Give Stats chart artwork and Skills tree icons.
- Updated modules: `app.js`, `gamemode-ui.js`, `progression-ui.js`, `player-stats-ui.js`.
<!-- /development -->

## v3.17.3

Build: 2026-11-14 13:20:13 UTC

### Player Changes

- Organize Wiki guides and add missing topic icons.

<!-- development -->
### Developer Notes

- Organize Wiki guides and complete topic icons.
- Updated modules: `wiki.js`, `wiki-icon.js`, `wiki.css`, `app.js`.
<!-- /development -->

## v3.17.2

Build: 2026-11-14 13:10:18 UTC

### Player Changes

- Halve the reach of held-touch bubble repulsion.

<!-- development -->
### Developer Notes

- Halve held-contact repulsion reach.
- Updated modules: `game-menu.js`, `app.js`, `menu-pool.js`, `menu-background.js`.
<!-- /development -->

## v3.17.1

Build: 2026-11-14 13:02:51 UTC

### Player Changes

- Correct title placement with left-handed navigation.

<!-- development -->
### Developer Notes

- Fix handed navigation title placement.
- Updated modules: `screen-header.css`, `app.js`, `game-menu.js`.
<!-- /development -->

## v3.17.0

Build: 2026-11-14 12:50:13 UTC

### Player Changes

- Balance Points around productive actions across modes.
- Add a development-only Wiki area.

<!-- development -->
### Developer Notes

- Balance action-based Points and add Developer Wiki.
- Updated modules: `power-tree.js`, `app.js`, `wiki.js`, `earning.js`.
<!-- /development -->

## v3.16.1

Build: 2026-11-14 12:20:58 UTC

### Player Changes

- Organize Player Stats and improve its icons.

<!-- development -->
### Developer Notes

- Organize Player Stats and improve icons.
- Updated modules: `player-stats-ui.js`, `player-stats.css`, `player-stats.js`, `app.js`.
<!-- /development -->

## v3.16.0

Build: 2026-11-14 12:11:24 UTC

### Player Changes

- Activate an unlocked power in the background pool every five hits.

<!-- development -->
### Developer Notes

- Activate unlocked background powers every five hits.
- Updated modules: `menu-pool.js`, `app.js`, `menu-background.js`, `progression-ui.js`.
<!-- /development -->

## v3.15.0

Build: 2026-11-14 11:59:21 UTC

### Player Changes

- Add an interactive Player viewer.
- Restore distinct artwork for skills and upgrades.

<!-- development -->
### Developer Notes

- Add interactive Player viewer and restore skill artwork.
- Updated modules: `skin-preview.js`, `game-menu.css`, `tree-ui.js`, `player-menu.js`.
<!-- /development -->

## v3.14.2

Build: 2026-11-14 11:46:53 UTC

### Player Changes

- Rename Skill Tree to Skills.
- Add a player-skills shortcut in the Player menu.

<!-- development -->
### Developer Notes

- Rename Skills and add the Player menu shortcut.
- Updated modules: `wiki.js`, `app.js`, `progression-ui.js`, `player-upgrade-ui.js`.
<!-- /development -->

## v3.14.1

Build: 2026-11-14 11:39:30 UTC

### Player Changes

- Correct default navigation placement on the right.

<!-- development -->
### Developer Notes

- Keep default navigation on the right.
- Updated modules: `screen-header.css`, `tree-switch.css`, `app.js`, `game-menu.js`.
<!-- /development -->

## v3.14.0

Build: 2026-11-14 06:02:25 UTC

### Player Changes

- Give player and power trees consistent cards, icons, labels and stat visuals.

<!-- development -->
### Developer Notes

- Unify player and power tree presentation.
- Updated modules: `skill-card.js`, `tree-ui.js`, `player-upgrade-ui.js`, `player-skill-comparison.js`.
<!-- /development -->

## v3.13.9

Build: 2026-11-14 05:48:32 UTC

### Player Changes

- Show the game version beneath the main-menu title.

<!-- development -->
### Developer Notes

- Show the version beneath the main-menu title.
- Updated modules: `app.js`, `game-menu.js`, `game-menu.css`.
<!-- /development -->

## v3.13.8

Build: 2026-11-14 05:43:18 UTC

### Player Changes

- Let skill cards use the available width.

<!-- development -->
### Developer Notes

- Remove fixed skill card width limits.
- Updated modules: `progression-ui.js`, `app.js`, `tree.css`, `tree-ui.js`.
<!-- /development -->

## v3.13.7

Build: 2026-11-14 05:37:30 UTC

### Player Changes

- Improve title alignment and distinguish Back from Close.

<!-- development -->
### Developer Notes

- Align navigation titles and clarify Back versus Close.
- Updated modules: `credit.js`, `screen-header.css`, `tree-switch.css`, `app.js`.
<!-- /development -->

## v3.13.6

Build: 2026-11-14 05:27:18 UTC

### Player Changes

- Group Skins and Stats inside a Player menu.

<!-- development -->
### Developer Notes

- Group Skins and Stats in the Player menu.
- Updated modules: `player-menu.js`, `app.js`, `game-menu.css`, `game-menu.js`.
<!-- /development -->

## v3.13.5

Build: 2026-11-14 05:16:08 UTC

### Player Changes

- Improve the loading-to-main-menu animation.

<!-- development -->
### Developer Notes

- Animate loading into the main menu.
- Updated modules: `startup.js`, `startup.css`, `app.js`.
<!-- /development -->

## v3.13.4

Build: 2026-11-14 05:04:59 UTC

### Player Changes

- Move skill-tree guidance to a bottom bar.

<!-- development -->
### Developer Notes

- Move skill tree guidance to the bottom edge.
- Updated modules: `tree.css`, `progression-ui.js`, `bottom-bar.css`, `app.js`.
<!-- /development -->

## v3.13.3

Build: 2026-11-14 04:57:06 UTC

### Player Changes

- Reserve interface space for the Development bar.

<!-- development -->
### Developer Notes

- Reserve shared content space for the Development bar.
- Updated modules: `bottom-bar.css`, `development-bar.js`, `game-menu.css`, `tree.css`.
<!-- /development -->

## v3.13.2

Build: 2026-11-14 04:47:21 UTC

### Player Changes

- Show the equipped skin on player buttons.

<!-- development -->
### Developer Notes

- Use equipped skin icons across player actions.
- Updated modules: `app.js`, `progression-ui.js`, `skin.css`, `gamemode-ui.js`.
<!-- /development -->

## v3.13.1

Build: 2026-11-14 04:40:19 UTC

### Player Changes

- Center stacked skin previews above their information panel.

<!-- development -->
### Developer Notes

- Center stacked skin previews above bottom information.
- Updated modules: `skin.css`, `app.js`.
<!-- /development -->

## v3.13.0

Build: 2026-11-14 04:33:05 UTC

### Player Changes

- Present player upgrades as a connected skill tree.

<!-- development -->
### Developer Notes

- Present player upgrades as a connected skill tree.
- Updated modules: `tree.css`, `player-upgrade-ui.js`, `player-upgrade.css`, `player-tree.js`.
<!-- /development -->

## v3.12.0

Build: 2026-11-14 04:16:51 UTC

### Player Changes

- Add Copy Diagnostics to Settings and startup recovery.

<!-- development -->
### Developer Notes

- Add copyable diagnostics to Settings and startup recovery.
- Updated modules: `diagnostics.js`, `diagnostics.css`, `app.js`, `wiki.js`.
<!-- /development -->

## v3.11.0

Build: 2026-11-14 04:05:19 UTC

### Player Changes

- Put navigation controls on the right by default.
- Add a Left-Handed Layout setting.

<!-- development -->
### Developer Notes

- Add right-side navigation and a left-handed layout setting.
- Updated modules: `app.js`, `handedness.css`, `storage.js`, `progression-ui.js`.
<!-- /development -->

## v3.10.0

Build: 2026-11-14 03:53:03 UTC

### Player Changes

- Add Player Stats for the active profile.

<!-- development -->
### Developer Notes

- Add the profile-aware Player Stats menu.
- Updated modules: `player-stats.js`, `player-stats-ui.js`, `app.js`, `player-stats.css`.
<!-- /development -->

## v3.9.4

Build: 2026-11-14 03:23:23 UTC

### Player Changes

- Improve legacy-save compatibility and mobile recovery.

<!-- development -->
### Developer Notes

- Preserve legacy progress and provide safe mobile recovery.
- Updated modules: `progression-ui.js`, `progression-store.js`, `save-recovery-ui.js`, `run.js`.
<!-- /development -->

## v3.9.3

Build: 2026-11-14 03:05:51 UTC

### Player Changes

- Add a loading-screen transition into the main menu.

<!-- development -->
### Developer Notes

- Animate loading into the ready main menu.
- Updated modules: `startup.js`, `startup.css`, `app.js`, `game-menu.js`.
<!-- /development -->

## v3.9.2

Build: 2026-11-14 02:53:05 UTC

### Player Changes

- Reserve card space for favourite stars.
- Open skill details on tap or click instead of hover.

<!-- development -->
### Developer Notes

- Reserve favourite space and open skill cards on activation.
- Updated modules: `tree-ui.js`, `app.js`, `experiment.css`, `trial-ui.js`.
<!-- /development -->

## v3.9.1

Build: 2026-11-14 02:43:18 UTC

### Player Changes

- Move full-width action bars to the bottom edge.

<!-- development -->
### Developer Notes

- Anchor full-width action bars at the bottom edge.
- Updated modules: `bottom-bar.css`, `app.js`.
<!-- /development -->

## v3.9.0

Build: 2026-11-14 02:35:30 UTC

### Player Changes

- Add permanent, cumulative player upgrades.

<!-- development -->
### Developer Notes

- Add cumulative player progression.
- Updated modules: `player-upgrade.js`, `app.js`, `progression-ui.js`, `player-upgrade-ui.js`.
<!-- /development -->

## v3.8.1

Build: 2026-11-14 02:12:11 UTC

### Player Changes

- Make menus and shared interface controls more consistent.

<!-- development -->
### Developer Notes

- Extract shared UI and menu components.
- Updated modules: `trial-ui.js`, `gamemode-gallery.js`, `gamemode-ui.js`, `app.js`.
<!-- /development -->

## v3.8.0

Build: 2026-11-14 01:53:44 UTC

### Player Changes

- Add medal icons and conditions across playable modes and levels.

<!-- development -->
### Developer Notes

- Add medal icons and conditions across every playable mode.
- Updated modules: `medal.js`, `app.js`, `trial-ui.js`, `progression-ui.js`.
<!-- /development -->

## v3.7.0

Build: 2026-11-14 01:24:50 UTC

### Player Changes

- Make power upgrades cumulative.
- Keep all four Wrap edges usable after upgrades.

<!-- development -->
### Developer Notes

- Make all power upgrades cumulative and keep Wrap edges usable.
- Updated modules: `power-tree.js`, `skill-comparison.js`, `skill-effect.js`, `app.js`.
<!-- /development -->

## v3.6.1

Build: 2026-11-14 00:57:29 UTC

### Player Changes

- Simplify favourite stars and improve their spacing.
- Show retry and recovery options when startup fails.

<!-- development -->
### Developer Notes

- Polish favourite controls and release v3.6.1.
- Show startup recovery instead of a silent blank page.
- Updated modules: `startup.js`, `experiment.css`, `app.js`.
<!-- /development -->

## v3.6.0

Build: 2026-11-13 22:56:39 UTC

### Player Changes

- Group related gamemodes into collections.
- Add favourite stars to game cards.

<!-- development -->
### Developer Notes

- Group related games and add card-star favourites.
- Updated modules: `trial-ui.js`, `gamemode-catalogue.js`, `experiment.css`, `experiment-store.js`.
<!-- /development -->

## v3.5.0

Build: 2026-11-13 20:06:17 UTC

### Player Changes

- Add precision challenges and ten Melody Trials.
- Improve gamemode cards, navigation and finished-game exits.
- Use clearer shot and contact wording across gameplay.

<!-- development -->
### Developer Notes

- Use generic shot and contact wording across shared gameplay.
- Promote individual gamemode cards and unify navigation components.
- Implement ten Melody Trials with three musical difficulty levels.
- Updated modules: `precision.js`, `melody-trial.js`, `experiment-art.js`, `app.js`.
<!-- /development -->

## v3.4.0

Build: 2026-11-13 16:35:36 UTC

### Player Changes

- Organize the experiment hub and add saved setups and capture trials.

<!-- development -->
### Developer Notes

- Add organized experiment hub, versioned setups and capture trials.
- Updated modules: `experiment-catalogue.js`, `experiment-ui.js`, `experiment-store.js`, `experiment.js`.
<!-- /development -->

## v3.3.0

Build: 2026-11-13 15:02:16 UTC

### Player Changes

- Add Score Attack with 5, 10 or 15 shots, medals and personal records.

<!-- development -->
### Developer Notes

- Add finite-shot Score Attack with medals and personal records.
- Updated modules: `app.js`, `trial-ui.js`, `score-attack-store.js`, `progression-ui.js`.
<!-- /development -->

## v3.2.0

Build: 2026-11-13 14:43:05 UTC

### Player Changes

- Rename the musical campaign Melody Journey and add level score medals.
- Allow skill purchases during active runs.
- Expand the experimental gamemode catalogue.

<!-- development -->
### Developer Notes

- Add Melody Journey level score medals and campaign music.
- Ground the gamemode catalogue in workshop research.
- Expand the wiki with 150 gamemode experiments.
- Updated modules: `run.js`, `progression-ui.js`, `app.js`, `wiki.js`.
<!-- /development -->

## v3.1.0

Build: 2026-11-13 04:34:15 UTC

### Player Changes

- Show available Points in every game mode.
- Award bonus challenges one Point per difficulty tier.
- Move optional music controls into the bottom Development bar.

<!-- development -->
### Developer Notes

- Show available Points in every game mode.
- Expand music from the bottom Development profile bar.
- Hide music bar behind an opt-in Development setting.
- Updated modules: `app.js`, `bottom-bar.css`, `development-bar.js`, `engine.js`.
<!-- /development -->

## v3.0.0

Build: 2026-11-13 03:22:27 UTC

### Player Changes

- Add Reaction Puzzle, Cargo Rescue and Outbreak Containment experiments.
- Add an illustrated Gamemodes menu.

<!-- development -->
### Developer Notes

- Add three bubble experiments and illustrated Gamemodes menu.
- Updated modules: `trial.js`, `trial-ui.js`, `app.js`, `progression-ui.js`.
<!-- /development -->

## v2.0.0

Build: 2026-11-13 02:31:42 UTC

### Player Changes

- Add permanent Points and power mastery across playable modes.
- Add Endless Waves, skill progression and player skins.
- Expand the Wiki, Settings, save recovery and mobile layouts.

<!-- development -->
### Developer Notes

- Keep play rewards usable on local-network HTTP.
- Earn persistent Points and mastery in every playable mode.
- Document bubble concept research and experimental game modes.
- Updated modules: `power-tree.js`, `engine.js`, `app.js`, `tree.css`.
<!-- /development -->

## v1.0.0

Build: 2026-11-10 01:35:09 UTC

### Player Changes

- Launch the living light pool with bouncing bubbles, chain reactions and evolving music.
- Add contact powers, bonus objectives and saved-song highlights.
- Add stereo phrase cues and responsive phone controls.

<!-- development -->
### Developer Notes

- Give the stereo phrase bar stable geometry on small phone screens.
- Let Bubble overlap jellies with smooth pressure instead of core ricochets.
- Keep stereo phrase cues aligned with scheduled audio and fill the dock.
<!-- /development -->
