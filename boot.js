// Only failure of the game module graph is terminal. Other early errors remain
// available in diagnostics without replacing a successfully starting game.
import('./app.js?v=9fa9f450cf740f8746b5b69b34aa1a403fa66571d22bcc1b2c256cea987ec5e4').catch(function (error) {
  window.dispatchEvent(new CustomEvent('ricochet-startup-failed', { detail: error }));
});
