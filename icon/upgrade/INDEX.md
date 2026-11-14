# Upgrade Icons

Original SVG artwork for 100 power upgrades and all six player upgrades. Each drawing represents
its individual effect, using the rounded strokes, pale mint color and open negative
space of the game's existing Cure Interactive power icons. No external artwork is
copied. Base power artwork remains in the sibling `power/` directory.

The canonical drawings are in `tool/upgrade-icon.mjs`. Run
`node tool/upgrade-icon.mjs` after changing them, followed by `node tool/cache.mjs`.
Use `node tool/upgrade-icon.mjs --check` to verify generated SVGs. Stable filenames
follow the skill IDs, for example `comet.foundation.svg` for Momentum.

All drawings use a 48-unit view box with rounded 3.6-unit strokes. Review at 64,
30 and 20 pixels on the dark game background. The map uses the individual drawing
inside its existing status frame; Final upgrades retain their distinctive frame; rarity uses the separate Cure badge and color.
The same icon appears in the skill card and, for power upgrades, discovery rewards.

## Player Upgrade Artwork

- [Long Sight](sight.1.svg): a longer dotted aiming ray and endpoint reticle.
- [Deep Sight](sight.2.svg): an aiming ray reflected from a wall.
- [Strong Launch](launch.1.svg): a bubble with a forward impulse arrow.
- [Greater Launch](launch.2.svg): a rising bubble with stacked thrust chevrons.
- [Elastic Shell](rebound.1.svg): a compressed bubble springing off a wall.
- [Perfect Rebound](rebound.2.svg): equal incoming and outgoing wall-bounce paths.

Player nodes and cards use these same generated files; their root retains the player-skin icon.

## Attribution

### Sources

Ricochet Bloom skill descriptions and existing Cure Interactive power artwork.

### Contributions

#### Codex on behalf of `leviscustempris`

Designed, rendered and reviewed the original upgrade icon set.
