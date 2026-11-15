// Only failure of the game module graph is terminal. Other early errors remain
// available in diagnostics without replacing a successfully starting game.
import('./app.js?v=7af92f019852464f1ffcee1b75ea4a7596903cca84fd8ffdda39ccc8e27fe4e5').catch(function (error) {
  window.dispatchEvent(new CustomEvent('ricochet-startup-failed', { detail: error }));
});
