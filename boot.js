// Only failure of the game module graph is terminal. Other early errors remain
// available in diagnostics without replacing a successfully starting game.
import('./app.js?v=a0011d6bb2403b876d50776f66fdb3dbef78848c00676d64d7d5d8a8c9f7ac87').catch(function (error) {
  window.dispatchEvent(new CustomEvent('ricochet-startup-failed', { detail: error }));
});
