// Only failure of the game module graph is terminal. Other early errors remain
// available in diagnostics without replacing a successfully starting game.
import('./app.js?v=fcb0ce4c53ae6aac357d12aa1d0413872ec42bad1a5fe664bc9cc2a29e312c6f').catch(function (error) {
  window.dispatchEvent(new CustomEvent('ricochet-startup-failed', { detail: error }));
});
