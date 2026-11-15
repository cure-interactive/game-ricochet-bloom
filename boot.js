// Only failure of the game module graph is terminal. Other early errors remain
// available in diagnostics without replacing a successfully starting game.
import('./app.js?v=d6b971737d5949c3a9e3d4aa8036fded104a7479396db8df90385ef37318cca0').catch(function (error) {
  window.dispatchEvent(new CustomEvent('ricochet-startup-failed', { detail: error }));
});
