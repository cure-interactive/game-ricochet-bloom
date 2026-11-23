// Only failure of the game module graph is terminal. Other early errors remain
// available in diagnostics without replacing a successfully starting game.
import('./app.js?v=fcd1c437f97e8f756655c5cfc28c3b7dc1a2b9d75c2fcb8f64587994046233c7').catch(function (error) {
  window.dispatchEvent(new CustomEvent('ricochet-startup-failed', { detail: error }));
});
