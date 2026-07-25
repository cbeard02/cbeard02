// ── MOBILE NAV TOGGLE ───────────────────────────────────────────────────────
(function () {
  var toggle = document.querySelector('.nav-toggle');
  var links = document.getElementById('nav-links');
  if (!toggle || !links) return;

  function setOpen(open) {
    links.classList.toggle('nav-links--open', open);
    toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
    toggle.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
  }

  toggle.addEventListener('click', function () {
    setOpen(!links.classList.contains('nav-links--open'));
  });

  links.querySelectorAll('a').forEach(function (link) {
    link.addEventListener('click', function () { setOpen(false); });
  });

  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') setOpen(false);
  });

  window.addEventListener('resize', function () {
    if (window.innerWidth > 640) setOpen(false);
  });
})();
