// Only failure of the game module graph is terminal. Other early errors remain
// available in diagnostics without replacing a successfully starting game.
import('./app.js?v=add4fac47fb3d869d45c31a445d77fa9e0ab3e96f4a35129efb6a24f1e4bdaa1').catch(function (error) {
  window.dispatchEvent(new CustomEvent('ricochet-startup-failed', { detail: error }));
});
