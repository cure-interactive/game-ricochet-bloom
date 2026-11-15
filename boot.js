// Only failure of the game module graph is terminal. Other early errors remain
// available in diagnostics without replacing a successfully starting game.
import('./app.js?v=03aeff90e59ed46e8170e6a6fcbcc0a3922d732e5fe5336fff83fea1fe37992f').catch(function (error) {
  window.dispatchEvent(new CustomEvent('ricochet-startup-failed', { detail: error }));
});
