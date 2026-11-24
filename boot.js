// Only failure of the game module graph is terminal. Other early errors remain
// available in diagnostics without replacing a successfully starting game.
import('./app.js?v=08de1ee8a541a27d27426eb088f2b002b6c88348b53133484275aaf2eeb90b6a').catch(function (error) {
  window.dispatchEvent(new CustomEvent('ricochet-startup-failed', { detail: error }));
});
