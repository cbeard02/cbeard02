// ── COOKIE CONSENT (Google Analytics opt-out) ──────────────────────────────
// Region detection and the Consent Mode default live in consent-boot.js, which
// runs in <head> before gtag.js so the first hit already carries the correct
// state. This file only drives the UI: the banner opens on its own for
// visitors outside the United States, and the footer "Cookie Preferences"
// link opens it on demand in every region.
(function () {
  var consent = window.CookieConsent;
  if (!consent) return;   // boot script missing — head already defaulted to denied

  var banner = document.getElementById('cookie-banner');
  var acceptBtn = document.getElementById('cookie-accept');
  var declineBtn = document.getElementById('cookie-decline');
  var prefsLinks = document.querySelectorAll('.cookie-prefs-link');

  function setChoice(choice) {
    try { localStorage.setItem(consent.STORAGE_KEY, choice); } catch (e) {}
    if (typeof gtag === 'function') {
      gtag('consent', 'update', consent.signals(choice));
    }
    if (banner) banner.hidden = true;
  }

  // Only visitors who haven't chosen and aren't in the US get interrupted.
  // No 'update' call on load in any case: the default is already right.
  if (banner && !consent.storedChoice() && !consent.isUnitedStates()) {
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
