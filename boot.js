// Only failure of the game module graph is terminal. Other early errors remain
// available in diagnostics without replacing a successfully starting game.
import('./app.js?v=2c9ac6ba243b0aaba2d1154440fcb2bb1df5655ad8e172757daa2a60fc11beda').catch(function (error) {
  window.dispatchEvent(new CustomEvent('ricochet-startup-failed', { detail: error }));
});
