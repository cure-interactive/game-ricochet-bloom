// Only failure of the game module graph is terminal. Other early errors remain
// available in diagnostics without replacing a successfully starting game.
import('./app.js?v=ed0af1d9a8f2ab39a772eda31fa6d9201b6b4bd388b9e8691df56c3339e94438').catch(function (error) {
  window.dispatchEvent(new CustomEvent('ricochet-startup-failed', { detail: error }));
});
