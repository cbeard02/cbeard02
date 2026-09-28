// ── SCROLL REVEAL + COUNT-UP ────────────────────────────────────────────────
// Carried over from the Home 2a design. Driven entirely by data attributes,
// so this file is a no-op on pages that don't use them.
//
//   data-reveal="<delay ms>"  fade/slide in once the element scrolls into view
//   data-count="<number>"     count up to that number when it scrolls into view
//
// The element's final value stays in the HTML, so with JavaScript off the real
// numbers are shown. Reduced-motion users never get the .js class (see the
// inline guard in <head>), so revealed content is visible from the start; this
// file then fills in the counters immediately rather than animating them.
(function () {
  var reduce = window.matchMedia &&
               window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  var reveals = Array.prototype.slice.call(document.querySelectorAll('[data-reveal]'));
  var counts  = Array.prototype.slice.call(document.querySelectorAll('[data-count]'));
  if (!reveals.length && !counts.length) return;

  function reveal(el) {
    el.style.transitionDelay = (parseInt(el.getAttribute('data-reveal'), 10) || 0) + 'ms';
    el.setAttribute('data-shown', '');
  }

  function settle(el) {                 // final value, no animation
    el.textContent = el.getAttribute('data-count');
    el.setAttribute('data-ran', '');
  }

  function countUp(el) {
    var target = parseFloat(el.getAttribute('data-count'));
    if (!isFinite(target)) return;
    el.setAttribute('data-ran', '');
    var start = null, dur = 900;
    function tick(now) {
      if (start === null) start = now;
      var p = Math.min(1, (now - start) / dur);
      el.textContent = String(Math.round(target * (1 - Math.pow(1 - p, 3))));
      if (p < 1) requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
  }

  if (reduce || !('IntersectionObserver' in window)) {
    reveals.forEach(reveal);
    counts.forEach(settle);
    return;
  }

  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (en) {
      if (!en.isIntersecting) return;
      var el = en.target;
      io.unobserve(el);
      if (el.hasAttribute('data-count')) countUp(el); else reveal(el);
    });
  }, { rootMargin: '0px 0px -40px 0px' });

  reveals.concat(counts).forEach(function (el) {
    // Already scrolled past on load (e.g. a restored scroll position):
    // show it outright instead of waiting for an intersection that won't come.
    if (el.getBoundingClientRect().bottom < 0) {
      if (el.hasAttribute('data-count')) settle(el);
      else { el.style.transitionDelay = '0ms'; el.setAttribute('data-shown', ''); }
      return;
    }
    io.observe(el);
  });
})();
