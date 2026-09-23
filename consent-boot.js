// ── COOKIE CONSENT BOOTSTRAP ───────────────────────────────────────────────
// Loaded synchronously in <head>, before gtag.js, so Consent Mode already has
// the right state on the very first hit. If the region were resolved later
// (from consent.js at the end of <body>), the page_view would already have
// been sent while storage was denied, and Google does not re-send it.
//
// consent.js handles the banner UI and reuses everything defined here.
window.CookieConsent = (function () {
  var STORAGE_KEY = 'cookie-consent';

  // IANA time zones for the 50 states, DC, and the US territories, plus the
  // legacy aliases some browsers still report. Region comes from the browser's
  // time zone rather than an IP lookup: no network call, no third-party
  // request, and nothing that would delay the consent default.
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
    if (!tz) return false;                      // unknown — treat as non-US
    if (tz.indexOf('US/') === 0) return true;   // US/Eastern, US/Pacific, ...
    return US_TIME_ZONES.indexOf(tz) !== -1;
  }

  function storedChoice() {
    var v;
    try { v = localStorage.getItem(STORAGE_KEY); } catch (e) {}
    return v === 'granted' || v === 'denied' ? v : null;
  }

  // An explicit choice always wins. Failing that, US visitors start granted
  // (no opt-in requirement, and they get no banner), and everyone else starts
  // denied until they accept. An unknown region falls to denied.
  function defaultState() {
    return storedChoice() || (isUnitedStates() ? 'granted' : 'denied');
  }

  // Consent types that are never declared behave as granted, so the ad-related
  // ones are spelled out rather than omitted. This site runs no advertising,
  // so they stay denied for everyone regardless of the analytics choice.
  function signals(state) {
    return {
      analytics_storage: state,
      ad_storage: 'denied',
      ad_user_data: 'denied',
      ad_personalization: 'denied'
    };
  }

  return {
    STORAGE_KEY: STORAGE_KEY,
    isUnitedStates: isUnitedStates,
    storedChoice: storedChoice,
    defaultState: defaultState,
    signals: signals
  };
})();
