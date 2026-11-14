// A classic script keeps recovery available even when a game module cannot load.
(function () {
  'use strict';
  var panel = document.getElementById('startup');
  var title = document.getElementById('startup-title');
  var message = document.getElementById('startup-message');
  var details = document.getElementById('startup-details');
  var retry = document.getElementById('startup-retry');
  var body = document.body;
  var exitTimer;
  var complete = false;
  var ready = false;
  var failed = false;
  function report(error) {
    if (ready || failed) return;
    failed = true;
    clearTimeout(timer);
    body.dataset.startup = 'failed';
    panel.setAttribute('aria-busy', 'false');
    retry.hidden = false;
    title.textContent = 'The Game Could Not Start';
    message.textContent = 'Retry loading the game. Your saved progress stays on this browser. If this happens again, share the details below.';
    details.textContent = String(error || 'A game file could not be loaded.') + '\n' + navigator.userAgent;
    document.getElementById('startup-report').hidden = false;
  }
  function onError(event) {
    if (event.target && event.target.id === 'game-module') report('A game file could not be loaded. Check your connection and retry.');
    else if (event.message) report(event.message + (event.filename ? '\n' + event.filename.split('?')[0] + ':' + event.lineno : ''));
  }
  function onRejection(event) { report(event.reason && event.reason.message || event.reason); }
  retry.onclick = function (event) {
    event.preventDefault();
    var url = new URL(location.href);
    url.searchParams.set('reload', String(Date.now()));
    location.replace(url.href);
  };
  var timer = setTimeout(function () {
    if (ready || failed) return;
    retry.hidden = false;
    title.textContent = 'Still Loading';
    message.textContent = 'The game is taking longer than expected. You can wait or retry. Retrying keeps your saved progress.';
  }, 15000);
  window.addEventListener('error', onError, true);
  window.addEventListener('unhandledrejection', onRejection);
  function finish() {
    if (complete) return;
    complete = true;
    clearTimeout(exitTimer);
    body.dataset.startup = 'ready';
    panel.hidden = true;
    panel.style.display = 'none';
    var home = document.getElementById('main-menu');
    if (home) home.inert = false;
  }
  panel.addEventListener('animationend', function (event) {
    if (event.target === panel && event.animationName === 'startup-exit') finish();
  });
  window.addEventListener('ricochet-ready', function () {
    if (ready) return;
    ready = true;
    clearTimeout(timer);
    window.removeEventListener('error', onError, true);
    window.removeEventListener('unhandledrejection', onRejection);
    panel.setAttribute('aria-busy', 'false');
    retry.hidden = true;
    document.getElementById('startup-report').hidden = true;
    title.textContent = 'Ricochet Bloom';
    message.textContent = 'Your pool is ready.';
    // Let the initialized menu and its canvas paint before their entrance.
    requestAnimationFrame(function () { requestAnimationFrame(function () {
      if ((window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) || body.classList.contains('motion-reduced')) {
        finish(); return;
      }
      panel.inert = true;
      body.dataset.startup = 'entering';
      // Also settle if animations are disabled or their completion event is lost.
      exitTimer = setTimeout(finish, 900);
    }); });
  }, { once: true });
}());
