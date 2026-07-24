// ── COOKIE CONSENT (Google Analytics opt-out) ──────────────────────────────
(function () {
  var STORAGE_KEY = 'cookie-consent';
  var banner = document.getElementById('cookie-banner');
  var acceptBtn = document.getElementById('cookie-accept');
  var declineBtn = document.getElementById('cookie-decline');
  var prefsLinks = document.querySelectorAll('.cookie-prefs-link');

  function updateConsent(granted) {
    if (typeof gtag === 'function') {
      gtag('consent', 'update', { analytics_storage: granted ? 'granted' : 'denied' });
    }
  }

  function setChoice(choice) {
    try { localStorage.setItem(STORAGE_KEY, choice); } catch (e) {}
    updateConsent(choice === 'granted');
    if (banner) banner.hidden = true;
  }

  var stored;
  try { stored = localStorage.getItem(STORAGE_KEY); } catch (e) { stored = null; }

  if (banner && stored !== 'granted' && stored !== 'denied') {
    banner.hidden = false;
  }

  if (acceptBtn) acceptBtn.addEventListener('click', function () { setChoice('granted'); });
  if (declineBtn) declineBtn.addEventListener('click', function () { setChoice('denied'); });

  prefsLinks.forEach(function (link) {
    link.addEventListener('click', function (e) {
      e.preventDefault();
      if (banner) {
        banner.hidden = false;
        if (acceptBtn) acceptBtn.focus();
      }
    });
  });
})();
