// A classic script keeps recovery available even when a game module cannot load.
(function () {
  'use strict';
  // Cancel browser magnification, not propagation: map gestures keep their input.
  // CSS handles double-tap/pinch intent; these guards also cover WebKit gestures
  // and desktop trackpad/keyboard zoom before the game modules are available.
  function preventPageZoom(event) { if (event.cancelable) event.preventDefault(); }
  var zoomOptions = { capture: true, passive: false };
  ['gesturestart', 'gesturechange', 'gestureend'].forEach(function (type) {
    window.addEventListener(type, preventPageZoom, zoomOptions);
  });
  window.addEventListener('touchmove', function (event) {
    if (event.touches.length > 1) preventPageZoom(event);
  }, zoomOptions);
  window.addEventListener('wheel', function (event) {
    if (event.ctrlKey || event.metaKey) preventPageZoom(event);
  }, zoomOptions);
  window.addEventListener('keydown', function (event) {
    if (!(event.ctrlKey || event.metaKey) || event.altKey) return;
    if (['+', '=', '-', 'Add', 'Subtract'].indexOf(event.key) !== -1) preventPageZoom(event);
    // Keep Ctrl/Cmd+0 available to reset zoom imposed through browser chrome.
  }, true);
  // Apply before modules load, including menus, dialogs and startup recovery.
  window.addEventListener('contextmenu', function (event) { event.preventDefault(); }, true);
  ['pointerdown', 'pointerup', 'mousedown', 'mouseup', 'auxclick'].forEach(function (type) {
    window.addEventListener(type, function (event) {
      if (event.button !== 2) return;
      event.preventDefault();
      event.stopImmediatePropagation();
    }, true);
  });
  var panel = document.getElementById('startup');
  var title = document.getElementById('startup-title');
  var message = document.getElementById('startup-message');
  var progress = document.getElementById('startup-progress');
  var details = document.getElementById('startup-details');
  var retry = document.getElementById('startup-retry');
  var body = document.body;
  // A restored modal is in the browser top layer, above any ordinary z-index.
  // Keep the splash in that same layer and raise it after restoration finishes.
  function cover() {
    if (!panel.showPopover) return;
    panel.setAttribute('popover', 'manual');
    panel.hidePopover();
    panel.showPopover();
  }
  cover();
  var exitTimer, enterTimer, cycle = 0;
  var started = Date.now();
  var complete = false;
  var ready = false;
  var failed = false;
  function report(error) {
    if (ready || failed) return;
    failed = true;
    progress.hidden = true;
    message.hidden = false;
    clearTimeout(timer);
    body.dataset.startup = 'failed';
    panel.setAttribute('aria-busy', 'false');
    retry.hidden = false;
    document.getElementById('startup-diagnostics').hidden = false;
    title.textContent = 'The Game Could Not Start';
    message.textContent = 'Retry loading the game. Your saved progress stays on this browser. If this happens again, share the details below.';
    details.textContent = String(error || 'A game file could not be loaded.') + '\n' + navigator.userAgent;
    document.getElementById('startup-report').hidden = false;
  }
  function onError(event) {
    if (event.target && event.target.id === 'game-module') report('A game file could not be loaded. Check your connection and retry.');
  }
  function onFailure(event) { report(event.detail && event.detail.message || event.detail); }
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
    message.hidden = false;
    document.getElementById('startup-diagnostics').hidden = false;
    message.textContent = 'The game is taking longer than expected. You can wait or retry. Retrying keeps your saved progress.';
  }, 15000);
  window.addEventListener('error', onError, true);
  window.addEventListener('ricochet-startup-failed', onFailure);
  function finish() {
    if (complete || body.dataset.startup !== 'entering') return;
    complete = true;
    clearTimeout(exitTimer);
    body.dataset.startup = 'ready';
    if (panel.hidePopover) panel.hidePopover();
    panel.hidden = true;
    panel.style.display = 'none';
    var home = document.getElementById('main-menu');
    if (home) home.inert = false;
  }
  panel.addEventListener('animationend', function (event) {
    if (event.target === panel && (event.animationName === 'startup-exit' || event.animationName === 'startup-fade-out')) finish();
  });
  window.addEventListener('ricochet-loading', function () {
    // The same cover owns startup and return-time update checks. Invalidate
    // the previous fade so a late frame cannot reveal an unfinished return.
    cycle++;
    clearTimeout(exitTimer);clearTimeout(enterTimer);
    complete = false;ready = false;
    started = Date.now();
    body.dataset.startup = 'loading';
    panel.hidden = false;panel.inert = false;panel.style.display = '';
    panel.setAttribute('aria-busy', 'true');
    progress.setAttribute('data-complete', 'false');
    progress.removeAttribute('aria-valuenow');
    progress.setAttribute('aria-label', 'Loading Game');
    cover();
  });
  window.addEventListener('ricochet-ready', function () {
    if (ready) return;
    ready = true;
    clearTimeout(timer);
    window.removeEventListener('error', onError, true);
    window.removeEventListener('ricochet-startup-failed', onFailure);
    panel.setAttribute('aria-busy', 'false');
    retry.hidden = true;
    document.getElementById('startup-report').hidden = true;
    document.getElementById('startup-diagnostics').hidden = true;
    title.textContent = 'Ricochet Bloom';
    message.hidden = true;
    progress.hidden = false;
    progress.setAttribute('data-complete', 'true');
    progress.setAttribute('aria-valuenow', '100');
    progress.setAttribute('aria-label', 'Game Ready');
    // The restored destination is already laid out. Fade this cover only;
    // neither the main menu nor another destination gets a second entrance.
    var current = cycle;
    enterTimer = setTimeout(function () {
      requestAnimationFrame(function () { requestAnimationFrame(function () {
        if (current !== cycle || !ready) return;
        cover();
        panel.inert = true;
        body.dataset.startup = 'entering';
        exitTimer = setTimeout(finish, 650);
      }); });
    }, Math.max(0, 350 - (Date.now() - started)));
  });
}());
