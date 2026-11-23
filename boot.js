// Only failure of the game module graph is terminal. Other early errors remain
// available in diagnostics without replacing a successfully starting game.
import('./app.js?v=b6fee5ed4b0417993cf656c87bcd1e0499d0b2c1bfb13ff6a1f0f65d70c54d9a').catch(function (error) {
  window.dispatchEvent(new CustomEvent('ricochet-startup-failed', { detail: error }));
});
