// Only failure of the game module graph is terminal. Other early errors remain
// available in diagnostics without replacing a successfully starting game.
import('./app.js?v=f05a1515b0d197d6b060cfe3096906efb708eac7c8a1be2f2fd59fa0143e9ef0').catch(function (error) {
  window.dispatchEvent(new CustomEvent('ricochet-startup-failed', { detail: error }));
});
