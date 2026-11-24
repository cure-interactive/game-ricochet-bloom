// Only failure of the game module graph is terminal. Other early errors remain
// available in diagnostics without replacing a successfully starting game.
import('./app.js?v=38a66ab7f23c1c1f3cb7eff1bee19a6a6dd42f7d4943903d64b62d5110008bfc').catch(function (error) {
  window.dispatchEvent(new CustomEvent('ricochet-startup-failed', { detail: error }));
});
