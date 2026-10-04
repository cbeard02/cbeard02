// ── HOME HERO STAGE ─────────────────────────────────────────────────────────
// Scroll-driven hero from the Home 2l design. The markup in index.html is a
// plain stacked layout on its own; this file sets [data-live]
// on the stage, which (via styles.css) pins it under the nav, and then maps
// scroll progress through the 340vh stage onto:
//
//   0.08–0.40  hero text and image fade back
//   0.14–0.60  each chip flies from its ghost slot on the image's edge to a
//              scattered slot, growing a thumbnail and swapping its label for
//              the longer card text (0.36–0.52)
//   0.50–0.72  statement fades in
//   0.60–0.80  stats strip rises in; the counters run once it's mostly in
//
// Progress eases toward the scroll position rather than snapping to it, so
// inputs that move the page in big steps — dragging the scrollbar, clicking
// its track, Page Down, Home/End — still play the sequence instead of
// cutting between states. Gradual scrolling tracks it closely.
//
// Reduced-motion visitors never get the .js class (see the inline guard in
// <head>), so they keep the static layout, as do very short (landscape
// phone) viewports. Card layouts by stage width:
//   ≥1100px    scattered across the stage (SLOTS)
//   641–1099   two tidy columns, three above the statement, three below
//   ≤640       compact cards staggered left/right, running off either edge
//              (after parentsquare.com's mobile hero); the hero also blurs
//              as it fades
(function () {
  var stage = document.querySelector('[data-hero-stage]');
  if (!stage || !document.documentElement.classList.contains('js')) return;

  var mq = window.matchMedia('(min-height: 480px)');
  // Final card positions: [left %, top %] of the stage area above the stats.
  var SLOTS = [[25, 4], [60, 12], [1, 17], [47, 66], [10, 72], [79, 76]];

  var nav       = document.querySelector('nav');
  var sticky    = stage.querySelector('.hs-sticky');
  var heroText  = stage.querySelector('.hs-text');
  var heroImg   = stage.querySelector('.hs-img');
  var statement = stage.querySelector('.hs-statement');
  var stats     = stage.querySelector('.hs-stats');
  var counts    = Array.prototype.slice.call(stage.querySelectorAll('[data-hs-count]'));
  var cards     = Array.prototype.map.call(stage.querySelectorAll('.hs-card'), function (el, i) {
    return {
      el: el,
      ghost: stage.querySelector('.hs-ghost[data-i="' + i + '"]'),
      thumb: el.querySelector('.hs-thumb'),
      box:   el.querySelector('.hs-box'),
      start: el.querySelector('.hs-start'),
      end:   el.querySelector('.hs-end')
    };
  });

  var counted = false, ticking = false;
  var shown = null, lastT = 0;   // displayed progress, and when it last moved
  var SMOOTH_MS = 110;           // time constant of the ease toward the target

  function clamp(v, a, b) { return Math.max(a, Math.min(b, v)); }
  function seg(p, a, b)   { return clamp((p - a) / (b - a), 0, 1); }
  function lerp(a, b, t)  { return a + (b - a) * t; }
  function ease(t)        { return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2; }

  function settleCounts() {
    counts.forEach(function (el) { el.textContent = el.getAttribute('data-hs-count'); });
  }

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

  // Everything update() writes is inline style; clearing it hands the
  // element back to the stylesheet.
  function clearInline() {
    [heroText, heroImg, statement, stats].forEach(function (el) { el.removeAttribute('style'); });
    cards.forEach(function (c) {
      [c.el, c.thumb, c.box, c.start, c.end].forEach(function (el) { el.removeAttribute('style'); });
    });
  }

  function setLive(on) {
    clearInline();
    if (on) {
      stage.setAttribute('data-live', '');
      shown = null;                     // first frame snaps to the scroll position
      if (!counted) counts.forEach(function (el) { el.textContent = '0'; });
      update();
    } else {
      stage.removeAttribute('data-live');
      settleCounts();
    }
  }

  function update(now) {
    ticking = false;
    if (!stage.hasAttribute('data-live')) return;

    var navH = nav ? nav.offsetHeight : 0;
    stage.style.setProperty('--navh', navH + 'px');

    var r  = stage.getBoundingClientRect();
    var sr = sticky.getBoundingClientRect();
    var sh = sticky.clientHeight, sw = sticky.clientWidth;
    var target = clamp((navH - r.top) / Math.max(1, r.height - sh), 0, 1);

    now = now || performance.now();
    var dt = now - lastT > 100 ? 16 : now - lastT;   // first frame after idle: one frame's worth
    lastT = now;
    if (shown === null || Math.abs(target - shown) < 0.0005) shown = target;
    else shown += (target - shown) * (1 - Math.exp(-dt / SMOOTH_MS));
    var p = shown;

    var phone = sw < 641;
    var out = ease(seg(p, 0.08, 0.4));
    var blur = phone && out > 0 ? 'blur(' + (6 * out) + 'px)' : '';
    heroText.style.filter    = blur;
    heroImg.style.filter     = blur;
    heroText.style.opacity   = String(1 - out);
    heroText.style.transform = 'translateY(' + (-40 * out) + 'px)';
    heroImg.style.opacity    = String(1 - out);
    heroImg.style.transform  = 'scale(' + (1 - 0.12 * out) + ')';

    // Below 1100px there's no room to scatter the cards, so they settle into
    // two columns instead: three above the statement, three below it.
    var narrow = sw < 1100;
    var statsH = stats.offsetHeight, areaH = sh - statsH;
    var gap   = phone ? 8 : 10;
    var cardH = phone ? 60 : clamp(sh * 0.13, 70, 96);
    var boxW  = phone ? Math.min(250, sw * 0.64)
              : narrow ? Math.min(260, sw / 2 - cardH - gap - 36) : clamp(sw * 0.2, 220, 330);
    var total = cardH + gap + boxW, step = cardH + 16;
    statement.style.bottom = statsH + 'px';
    // Phones: three cards in each band around the statement, or — when the
    // bands can't hold three — two, with cards 2 and 5 dissolving mid-flight
    // (parentsquare.com settles four cards on mobile too).
    var compact = false;
    if (phone) {
      var band = (areaH - statement.firstElementChild.offsetHeight) / 2 - 16;
      compact = band < 3 * cardH + 16;
      step = compact ? clamp(band - cardH, cardH * 0.7, cardH + 12)
                     : clamp((band - cardH) / 2, cardH * 0.7, cardH + 12);
    }
    var tMove = ease(seg(p, 0.14, 0.6)), tText = seg(p, 0.36, 0.52);

    cards.forEach(function (c, i) {
      var gr = c.ghost.getBoundingClientRect();
      var sx = gr.left - sr.left, sy = gr.top - sr.top;
      var ex, ey;
      var drop = compact && (i === 2 || i === 5);
      if (phone) {
        ex = i % 2 ? sw - total * 0.82 : -total * 0.08;
        ey = compact ? [8, 8 + step, 8 + step / 2, areaH - 8 - cardH - step, areaH - 8 - cardH, areaH - 8 - cardH - step / 2][i]
                     : i < 3 ? 8 + i * step : areaH - 8 - cardH - (5 - i) * step;
      } else if (narrow) {
        ex = i % 2 ? sw - 24 - total : 24;
        ey = [12, 12 + step / 2, 12 + step,
              areaH - 12 - cardH - step, areaH - 12 - cardH - step / 2, areaH - 12 - cardH][i];
      } else {
        ex = Math.min(SLOTS[i][0] / 100 * sw, sw - total - 24);
        ey = Math.min(SLOTS[i][1] / 100 * areaH, areaH - cardH - 8);
      }
      var thumbW = lerp(0, cardH, tMove);
      var bw = lerp(gr.width, boxW, tMove), bh = lerp(gr.height, cardH, tMove);

      c.el.style.opacity   = String(drop ? 1 - seg(tMove, 0.2, 0.7) : 1);
      c.el.style.transform = 'translate(' + lerp(sx, ex, tMove) + 'px,' + lerp(sy, ey, tMove) + 'px)';
      c.el.style.height    = bh + 'px';
      c.thumb.style.width       = thumbW + 'px';
      c.thumb.style.marginRight = lerp(0, gap, tMove) + 'px';
      c.thumb.style.opacity     = String(tMove);
      c.box.style.width  = bw + 'px';
      c.box.style.height = bh + 'px';
      c.start.style.opacity = String(1 - seg(tText, 0, 0.5));
      c.start.style.top     = ((bh - gr.height) / 2) + 'px';
      c.end.style.width   = boxW + 'px';
      c.end.style.opacity = String(seg(tText, 0.4, 1));
    });

    var inS = ease(seg(p, 0.5, 0.72));
    statement.style.opacity   = String(inS);
    statement.style.transform = 'translateY(' + (24 * (1 - inS)) + 'px)';

    var inT = ease(seg(p, 0.6, 0.8));
    stats.style.opacity   = String(inT);
    stats.style.transform = 'translateY(' + (24 * (1 - inT)) + 'px)';
    if (inT > 0.3 && !counted) {
      counted = true;
      counts.forEach(countUp);
    }

    if (shown !== target) schedule();   // keep easing until it lands
  }

  function schedule() {
    if (!ticking) { ticking = true; requestAnimationFrame(update); }
  }

  window.addEventListener('scroll', schedule, { passive: true });
  window.addEventListener('resize', schedule);
  window.addEventListener('load', schedule);
  var onMq = function () { setLive(mq.matches); };
  if (mq.addEventListener) mq.addEventListener('change', onMq); else mq.addListener(onMq);

  setLive(mq.matches);
  // Fonts and the hero image can shift the ghosts after first paint.
  setTimeout(schedule, 80);
  setTimeout(schedule, 600);
})();
