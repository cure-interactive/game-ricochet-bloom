// Only failure of the game module graph is terminal. Other early errors remain
// available in diagnostics without replacing a successfully starting game.
import('./app.js?v=1c996f457005ea8760b09f6aa5bbc8ff9876fba9f6d046282ff4bd4b0d9421bd').catch(function (error) {
  window.dispatchEvent(new CustomEvent('ricochet-startup-failed', { detail: error }));
});
