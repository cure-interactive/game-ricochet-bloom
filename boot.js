// Only failure of the game module graph is terminal. Other early errors remain
// available in diagnostics without replacing a successfully starting game.
import('./app.js?v=41341b493fc2abee71c2efea8de10e240210a42685e3619e5017dce9dd7e01d2').catch(function (error) {
  window.dispatchEvent(new CustomEvent('ricochet-startup-failed', { detail: error }));
});
