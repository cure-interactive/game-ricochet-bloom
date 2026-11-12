# Upgrade Icons

Original SVG artwork for all 100 Ricochet Bloom upgrades. Each drawing represents
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
The same icon appears in the skill card and discovery reward.

## Attribution

### Sources

Ricochet Bloom skill descriptions and existing Cure Interactive power artwork.

### Contributions

#### Codex on behalf of `leviscustempris`

Designed, rendered and reviewed the original upgrade icon set.
