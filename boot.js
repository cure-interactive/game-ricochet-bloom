// Only failure of the game module graph is terminal. Other early errors remain
// available in diagnostics without replacing a successfully starting game.
import('./app.js?v=8aecabe4b3fcfa2a9135cfb1f3b7112a6676581f69a62dd1afce5167a8ab012b').catch(function (error) {
  window.dispatchEvent(new CustomEvent('ricochet-startup-failed', { detail: error }));
});
