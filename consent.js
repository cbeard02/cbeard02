// ── COOKIE CONSENT (Google Analytics opt-out) ──────────────────────────────
// The banner only appears on its own for visitors outside the United States.
// US privacy law does not require opt-in consent for basic analytics, so US
// visitors get analytics_storage granted automatically instead of being
// interrupted. Everyone else keeps the opt-in flow. If the region can't be
// determined, the banner is shown. The footer "Cookie Preferences" link is
// always available, in every region, so anyone can change their choice.
(function () {
  var STORAGE_KEY = 'cookie-consent';
  var banner = document.getElementById('cookie-banner');
  var acceptBtn = document.getElementById('cookie-accept');
  var declineBtn = document.getElementById('cookie-decline');
  var prefsLinks = document.querySelectorAll('.cookie-prefs-link');

  // IANA time zones for the 50 states, DC, and the US territories, plus the
  // legacy aliases some browsers still report. Region comes from the browser's
  // time zone rather than an IP lookup: no network call, no third-party
  // request, and no delay that would flash the banner on screen first.
  var US_TIME_ZONES = [
    'America/New_York', 'America/Detroit', 'America/Kentucky/Louisville',
    'America/Kentucky/Monticello', 'America/Indiana/Indianapolis',
    'America/Indiana/Vincennes', 'America/Indiana/Winamac',
    'America/Indiana/Marengo', 'America/Indiana/Petersburg',
    'America/Indiana/Vevay', 'America/Chicago', 'America/Indiana/Tell_City',
    'America/Indiana/Knox', 'America/Menominee', 'America/North_Dakota/Center',
    'America/North_Dakota/New_Salem', 'America/North_Dakota/Beulah',
    'America/Denver', 'America/Boise', 'America/Phoenix', 'America/Los_Angeles',
    'America/Anchorage', 'America/Juneau', 'America/Sitka',
    'America/Metlakatla', 'America/Yakutat', 'America/Nome', 'America/Adak',
    'Pacific/Honolulu',
    // Territories
    'America/Puerto_Rico', 'America/St_Thomas', 'America/Virgin',
    'Pacific/Guam', 'Pacific/Saipan', 'Pacific/Pago_Pago', 'Pacific/Midway',
    'Pacific/Wake', 'Pacific/Johnston',
    // Legacy aliases
    'America/Indianapolis', 'America/Louisville', 'America/Fort_Wayne',
    'America/Knox_IN', 'America/Shiprock', 'America/Atka', 'Navajo'
  ];

  function isUnitedStates() {
    var tz;
    try { tz = Intl.DateTimeFormat().resolvedOptions().timeZone; } catch (e) {}
    if (!tz) return false;                      // unknown — show the banner
    if (tz.indexOf('US/') === 0) return true;   // US/Eastern, US/Pacific, ...
    return US_TIME_ZONES.indexOf(tz) !== -1;
  }

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
  var hasChoice = stored === 'granted' || stored === 'denied';

  if (isUnitedStates()) {
    // Don't interrupt with the banner. Grant analytics unless this visitor has
    // previously declined on an explicit choice we should keep honoring.
    if (stored !== 'denied') updateConsent(true);
  } else if (banner && !hasChoice) {
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
