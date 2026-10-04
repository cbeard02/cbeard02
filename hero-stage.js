// ── HOME HERO ───────────────────────────────────────────────────────────────
// Hero from the Home 2p design. The layout and the whole entry sequence live
// in styles.css: with motion allowed, the six cards burst out from behind the
// headline to their places (staggered from 700ms), then the headline's glow
// fades and the stats strip rises in. This file adds the three things CSS
// can't work out for itself:
//
//   --navh      the nav's height, so the hero fills exactly one screen
//   --dx, --dy  each card's offset from the middle of the hero, which is
//               where its burst starts
//   the stat counters, run as the strip comes in
//
// Reduced-motion visitors never get the .js class (see the inline guard in
// <head>), so for them nothing animates and the numbers stay as written.
(function () {
  var stage = document.querySelector('[data-hero-stage]');
  if (!stage) return;

  var nav = document.querySelector('nav');
  function setNavH() { stage.style.setProperty('--navh', (nav ? nav.offsetHeight : 0) + 'px'); }
  setNavH();
  window.addEventListener('resize', setNavH);

  if (!document.documentElement.classList.contains('js')) return;

  var STATS_AT = 2040;           // matches the hsRise delay in styles.css
  var area   = stage.querySelector('.hs-area');
  var cards  = Array.prototype.slice.call(stage.querySelectorAll('.hs-card'));
  var counts = Array.prototype.slice.call(stage.querySelectorAll('[data-hs-count]'));

  // The cards are still waiting out their animation delay, scaled about
  // their own centres, so their centres are already where they'll end up.
  var ar = area.getBoundingClientRect();
  var cx = ar.left + ar.width / 2, cy = ar.top + ar.height / 2;
  cards.map(function (el) { return el.getBoundingClientRect(); }).forEach(function (r, i) {
    cards[i].style.setProperty('--dx', (cx - r.left - r.width / 2) + 'px');
    cards[i].style.setProperty('--dy', (cy - r.top - r.height / 2) + 'px');
  });

  function countUp(el) {
    var target = parseFloat(el.getAttribute('data-hs-count')), start = null;
    function tick(now) {
      if (start === null) start = now;
      var q = Math.min(1, (now - start) / 1000);
      el.textContent = String(Math.round(target * (1 - Math.pow(1 - q, 3))));
      if (q < 1) requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
  }

  counts.forEach(function (el) { el.textContent = '0'; });
  setTimeout(function () { counts.forEach(countUp); }, STATS_AT);
})();
