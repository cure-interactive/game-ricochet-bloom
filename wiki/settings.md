# Sound, Settings & Saves

The full-screen pause menu shares the main menu’s bubble background, game title and version. It offers Resume Game, Main Menu, Wiki, How to Play and Settings. Open Skills and Player Skins from the Main Menu. Settings → About displays the Cure Interactive logo and game information, with access to Icon Credits and [Change Logs](changelog.md).

## Audio

Settings → Audio contains the sound toggle, master volume and ambience volume. Both volume sliders start at 100%. Drag the thumb or tap the track; keyboard users can focus a slider and use arrow keys, Home or End. Sound Check can be pressed again to restart it, interrupting the previous check. Lower ambience to hear the contact and bubble sounds more prominently. Sound Check plays three gameplay notes: low, medium, then full strength, at your current master volume. It uses the same note sound and output path as gameplay, works while paused, and does not depend on the ambience slider or change your song. Overlapping gameplay sounds can still make the overall mix louder than a single note.

Audio tries to start as soon as the app or page gains focus or returns to view. If your browser requires interaction, tap anywhere in the game to retry; there is no need to open Settings. Your Sound and volume choices still apply. The pause menu freezes play while ambient music continues. Sound and Music Volume still control it. Leaving the page suspends sound and play; use Resume when you return. Resume also retries audio interrupted by the browser. Returning after switching away opens the full pause menu for an active pool or Casual session. Resume deliberately when ready; an already-open settings/help page stays where you left it. The music panel offers Glass, Velvet and Wood instrument palettes.

Buttons, navigation and settings changes play short UI sounds, including while paused. These use Sound and Master Volume; Music Volume does not change them. Turning Sound off also silences UI sounds.

The main-menu background is a self-playing Free Play pool using your unlocked powers, player upgrades and equipped skin. It plays only its generated musical arrangement, without collision or power sound effects. Sound and Music Volume control it too. Menu play does not earn Points or change your saved game or song.

## Accessibility and Display

An available unchecked setting has a bright solid outline; checked settings are mint. Disabled unchecked controls have a muted dashed outline. A disabled checked control retains its gray check, so its stored selection stays clear. Disabled controls cannot be changed until their requirement is met. Settings pair a descriptive icon and label with a checkbox on the right. Single-choice menus such as Rendering Quality use radio indicators; choosing an option closes the menu.

Show on-screen controls adds shot-control buttons and skill-tree camera controls. It is off by default; touch gestures and keyboard controls remain available.

Rendering Quality offers High, Balanced and Low. High keeps full detail, Balanced lowers rendering resolution, and Low also reduces decorative effects. All levels keep bubble deformation, player jiggle and interaction active. Previous Gentle Visuals preferences become Low quality; the operating system’s reduced-motion preference does not override game animation. Frame Rate offers **Device default**, **60 FPS** and **30 FPS** as maximum drawing rates; gameplay speed stays the same. **Automatic Battery Saver** selects Low quality and 30 FPS at 20% battery or below while unplugged, where the browser provides usable battery information. Turn it off to keep your choices. Browsers cannot reliably report the operating system’s Low Power Mode; manual Low/30 FPS remains available. **Device Motion** lets supported previews react to tilt and movement, with an explicit permission action where required. Screen Mode explains the fullscreen or app-view options available on your current device; browser support differs. Installation steps use platform-specific icons and bold action names. In installed app mode, **Settings → Updates → Check for Updates** checks for a newer build and restarts only when an update is ready and progress can be saved.

## Left-Handed Layout

Back controls sit on the right by default. Enable **Settings → Accessibility → Left-Handed Layout** to place Back, Close, Pause, favorite stars and Skills legend on the left. The setting is remembered on this browser and applies to both Normal and Development profiles. The Points/selector arrangement and physical tab order mirror too. Text, aiming and the left-edge Back gesture keep their normal direction. Skills and Stats selectors support both tapping a label and dragging the selection; the highlight stays inside the control. Scroll content normally, or grab the visible scrollbar thumb to drag and fling it.

## Copy Diagnostics

Use **Settings → Get Help → Technical Diagnostics → Copy Diagnostics** when reporting a problem. The same button appears when the game cannot start or loading takes longer than expected. It copies the game version, browser, screen size, loading state, recent errors and read-only save metadata. Saved-game contents are not included, and copying does not change your progress. If clipboard access is unavailable, a selected report appears so you can copy it manually.

## Getting Help

Open **Settings** and tap **Get Help** at the bottom, beneath About. **Email Report** opens an email to **main@cureinteractive.com** with the subject **Ricochet Bloom — Support Report — your player name** and your device details, diagnostics and game progress filled in; tap Send in your email app. The report includes your player name. **Share Report** opens your device’s sharing options; **Copy Report** lets you paste the same text into a message. No downloaded file is needed. **Technical Diagnostics** is in the same Get Help section. It excludes saved-game contents; the full Support Report already includes those technical details, so you usually only need one report.

If saving fails, the recovery panel offers these same actions and **Retry Save**. Keep the tab open so pending progress remains available. Do not clear browser data to troubleshoot.

## Saves and Backups

Your pool, song and campaign progress save in this browser. They do not automatically transfer between devices or between the local, GitHub Pages and private hosted copies. Clearing website data can remove them.

Use the backup export and import controls in Settings → Advanced → Development & Backups to keep or transfer your progress. Keep a backup before replacing browser data.

Development controls use a separate test profile. They can reset test progress, maximize campaign access or maximize the skill tree without awarding normal campaign receipts. **Show Hidden Tracks, Skills and Skins** reveals locked tracks, research and player skins for inspection in either profile without changing unlocks or progress. Your previous Show All Skills preference carries over to this combined setting. **Show Purchased Skill Costs** displays catalogue prices on owned skill nodes and cards. Both view toggles are off by default. During Development gameplay, press the bottom **Development Profile Active** bar to expand the music panel; press it again to collapse. An arrow indicates this action and changes direction when open. The thin bar keeps the same text and height. The panel starts collapsed on reload and collapses when leaving gameplay. This rule also applies to Melody Journey and saved-song listening: neither forces it open. On menus and dialogs, the bar only identifies the Development profile. Normal and temporary shared profiles have no music disclosure; generated music still plays. These toggles, Development mode and the Points-to-add amount are remembered in this browser, including after reopening the game. Test unlocks, Points and runs also remain saved; reloading does not repeat grants or maximize actions. Switch Development mode off to return to your normal progress. Clearing browser data clears these preferences, and other browsers or devices keep their own settings.

[Back to Wiki](wiki.md).

Settings → About shows the currently installed game version.

## Screen Rotation

The game supports portrait and landscape. Rotate your device to change the layout; browser toolbar changes do not rotate the pool. If Safari stays upright on iPhone, turn off Portrait Orientation Lock in Control Center. Safari’s Page Menu beside the address field belongs to the browser, not the game.

## Attribution

### Sources

Ricochet Bloom gameplay, campaign, progression and audio source in this release.

### Contributions

#### Codex on behalf of `leviscustempris`

Authored and checked against the game implementation.
