// A classic script keeps recovery available even when a game module cannot load.
(function () {
  'use strict';
  var panel = document.getElementById('startup');
  var title = document.getElementById('startup-title');
  var message = document.getElementById('startup-message');
  var details = document.getElementById('startup-details');
  var ready = false;
  var failed = false;
  function report(error) {
    if (ready || failed) return;
    failed = true;
    clearTimeout(timer);
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
  document.getElementById('startup-retry').onclick = function (event) {
    event.preventDefault();
    var url = new URL(location.href);
    url.searchParams.set('reload', String(Date.now()));
    location.replace(url.href);
  };
  var timer = setTimeout(function () {
    if (ready || failed) return;
    title.textContent = 'Still Loading';
    message.textContent = 'The game is taking longer than expected. You can wait or retry. Retrying keeps your saved progress.';
  }, 15000);
  window.addEventListener('error', onError, true);
  window.addEventListener('unhandledrejection', onRejection);
  window.addEventListener('ricochet-ready', function () {
    ready = true;
    clearTimeout(timer);
    panel.hidden = true;
    panel.style.display = 'none';
    window.removeEventListener('error', onError, true);
    window.removeEventListener('unhandledrejection', onRejection);
  }, { once: true });
}());
