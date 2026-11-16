// Only failure of the game module graph is terminal. Other early errors remain
// available in diagnostics without replacing a successfully starting game.
import('./app.js?v=c4fcfcd1bd2b6fa5f737f16e55a99be9bc8b4bd741cd569ee110651304f3ef7f').catch(function (error) {
  window.dispatchEvent(new CustomEvent('ricochet-startup-failed', { detail: error }));
});
