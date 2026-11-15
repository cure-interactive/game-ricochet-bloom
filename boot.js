// Only failure of the game module graph is terminal. Other early errors remain
// available in diagnostics without replacing a successfully starting game.
import('./app.js?v=62a5d0e1308cd1a3ac2c16c5d12c93fe1abe5753b092de09b7f54fdd0ff183ac').catch(function (error) {
  window.dispatchEvent(new CustomEvent('ricochet-startup-failed', { detail: error }));
});
