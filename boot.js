// Only failure of the game module graph is terminal. Other early errors remain
// available in diagnostics without replacing a successfully starting game.
import('./app.js?v=eb0f070c68589a04db8b4f8e650e030415faf2bbe27189edc189c68cb93c0a55').catch(function (error) {
  window.dispatchEvent(new CustomEvent('ricochet-startup-failed', { detail: error }));
});
