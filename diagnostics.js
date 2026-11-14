// Classic, dependency-free recovery support: usable before the game can import.
(function () {
  'use strict';
  var errors = [], context = function () { return {}; };
  function clean(value) {
    return String(value == null ? '' : value).replace(/https?:\/\/[^\s<>"')]+/g, function (text) {
      try { var url = new URL(text); return url.origin + url.pathname; } catch (_) { return '[URL]'; }
    }).slice(0, 700);
  }
  function record(kind, detail) {
    errors.push(new Date().toISOString() + ' ' + kind + ': ' + clean(detail));
    if (errors.length > 8) errors.shift();
  }
  window.addEventListener('error', function (event) {
    if (event.message) record('Error', event.message + '\n' + clean(event.filename) + ':' + (event.lineno || 0) + ':' + (event.colno || 0));
    else if (event.target && (event.target.src || event.target.href)) record('Resource failed', event.target.src || event.target.href);
  }, true);
  window.addEventListener('unhandledrejection', function (event) {
    record('Unhandled rejection', event.reason && event.reason.message || event.reason || 'Unknown rejection');
  });
  function savedData() {
    var keys = ['ricochet-bloom-pool-v3', 'ricochet-bloom-pool-v2', 'ricochet-bloom-development-settings-v1'];
    ['normal', 'development'].forEach(function (kind) {
      var profile = 'ricochet-bloom-progression-v1' + (kind === 'development' ? '-development' : '');
      keys.push(profile, profile + '-backup', 'ricochet-bloom-experiments-v1-' + kind);
      [5, 10, 15].forEach(function (budget) { keys.push('ricochet-bloom-score-attack-v1-' + kind + '-' + budget); });
    });
    return keys.map(function (key) {
      try {
        var raw = window.localStorage.getItem(key);
        if (raw === null) return key + ': missing';
        var info = raw.length + ' characters';
        if (raw.length > 2000000) return key + ': present, ' + info + ', JSON check skipped (large)';
        try {
          var value = JSON.parse(raw);
          return key + ': ' + info + ', JSON ' + (value === null ? 'null' : Array.isArray(value) ? 'array' : typeof value) +
            (value && Number.isSafeInteger(value.version) ? ', format ' + value.version : '');
        } catch (_) { return key + ': ' + info + ', invalid JSON'; }
      } catch (_) { return key + ': storage unavailable'; }
    }).join('\n');
  }
  function report() {
    var body = document.body, viewport = window.visualViewport;
    var version = document.querySelector('meta[name="game-version"]');
    var module = document.getElementById('game-module'), checksum = 'unavailable';
    try { var value = new URL(module.src).searchParams.get('v'); if (/^[a-f0-9]{64}$/.test(value)) checksum = value; } catch (_) {}
    var runtime;
    try { runtime = context(); } catch (_) { runtime = {}; }
    return [
      'Ricochet Bloom Diagnostics',
      'Version: ' + (version ? version.content : 'unknown'),
      'Game asset checksum: ' + checksum,
      'Captured: ' + new Date().toISOString(),
      'Page: ' + clean(location.origin + location.pathname),
      'Browser: ' + clean(navigator.userAgent),
      'Language: ' + clean(navigator.language),
      'Online: ' + navigator.onLine + ' | Secure context: ' + window.isSecureContext,
      'Viewport: ' + window.innerWidth + ' x ' + window.innerHeight + ' | Pixel ratio: ' + window.devicePixelRatio,
      'Visual viewport: ' + (viewport ? Math.round(viewport.width) + ' x ' + Math.round(viewport.height) + ', scale ' + viewport.scale : 'unavailable'),
      'Startup: ' + clean(body.dataset.startup) + ' | Screen: ' + clean(body.dataset.screen),
      'Profile: ' + (body.dataset.development === 'true' ? 'development' : 'normal or not initialized'),
      'Clipboard API: ' + Boolean(navigator.clipboard && navigator.clipboard.writeText),
      'Game initialized: ' + (runtime.initialized === true),
      'Mode: ' + clean(runtime.mode || 'not initialized'),
      'Progress readable: ' + (typeof runtime.progressAvailable === 'boolean' ? runtime.progressAvailable : 'not checked'),
      'Pool save available: ' + (typeof runtime.poolAvailable === 'boolean' ? runtime.poolAvailable : 'not checked'),
      'Left-handed layout: ' + (body.dataset.leftHanded === 'true'),
      '', 'Saved data (read-only JSON checks, not full game validation):', savedData(),
      '', 'Recent errors (up to 8, this page session):', errors.length ? errors.join('\n') : 'None captured.',
      '', 'Save contents, page query parameters and fragments are not included.'
    ].join('\n');
  }
  function fallback(group, button, text) {
    var area = group.querySelector('[data-diagnostics-report]'), status = group.querySelector('[data-diagnostics-status]');
    area.value = text; area.hidden = false; area.focus(); area.select(); area.setSelectionRange(0, text.length);
    var copied = false;
    try { copied = document.execCommand('copy'); } catch (_) {}
    if (copied) { area.hidden = true; button.focus(); }
    status.textContent = copied ? 'Diagnostics copied.' : 'Clipboard unavailable. Select and copy the report below.';
  }
  function copy(button) {
    var group = button.closest('[data-diagnostics]'), status = group.querySelector('[data-diagnostics-status]');
    var text = report();
    group.querySelector('[data-diagnostics-report]').hidden = true;
    status.textContent = 'Copying diagnostics…';
    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        return navigator.clipboard.writeText(text).then(function () { status.textContent = 'Diagnostics copied.'; }, function () { fallback(group, button, text); });
      }
    } catch (_) {}
    fallback(group, button, text);
  }
  document.addEventListener('click', function (event) {
    var button = event.target.closest && event.target.closest('[data-diagnostics-copy]');
    if (button) copy(button);
  });
  window.ricochetDiagnostics = { report: report, copy: copy, setContext: function (read) { context = read; } };
}());
