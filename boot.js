// Only failure of the game module graph is terminal. Other early errors remain
// available in diagnostics without replacing a successfully starting game.
import('./app.js?v=bda7d8a13658657e4a6a0be8a28f2613b5ac20065e5c01ecc5720f6fb490e2db').catch(function (error) {
  window.dispatchEvent(new CustomEvent('ricochet-startup-failed', { detail: error }));
});
