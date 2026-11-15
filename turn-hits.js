// Retain historical chain data for results/saves; live indicators end at rest.
export const turnHits=game=>game.isFlying?game.chain:[];
