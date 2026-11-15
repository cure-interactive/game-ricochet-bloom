# Change Logs

See what changed in each version. Open a version for its player-facing updates.

<!-- development -->
Open Developer Notes inside a version for its technical changes.
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
- Restart Sound Check on every press, even while a previous check is playing. Recover expired audio voices after interruptions.
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
- Stop covered backgrounds from reacting to taps while their simulation continues.
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

- Remove unused player-skin artwork.

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

- Use the game's elastic player rendering for previews and icons.

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
