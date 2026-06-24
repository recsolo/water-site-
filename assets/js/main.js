/* New Water Today — shared JS */
(function () {

  // ---- Active nav link ----
  var page = location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav__links a').forEach(function (a) {
    if (a.getAttribute('href') === page) a.classList.add('active');
  });

  // ---- Mobile nav ----
  var toggle = document.getElementById('navToggle');
  var links  = document.getElementById('navLinks');
  function setOpen(v) {
    if (!links || !toggle) return;
    links.classList.toggle('open', v);
    toggle.setAttribute('aria-expanded', String(v));
    toggle.setAttribute('aria-label', v ? 'Close menu' : 'Open menu');
  }
  if (toggle) toggle.addEventListener('click', function () { setOpen(!links.classList.contains('open')); });
  if (links)  links.querySelectorAll('a').forEach(function (a) { a.addEventListener('click', function () { setOpen(false); }); });
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape') setOpen(false); });

  // ---- Sticky header shadow ----
  var hdr = document.querySelector('.header');
  window.addEventListener('scroll', function () {
    if (hdr) hdr.classList.toggle('scrolled', window.scrollY > 10);
  }, { passive: true });

  // ---- Footer year ----
  var yr = document.getElementById('year');
  if (yr) yr.textContent = new Date().getFullYear();

  // ---- Scroll reveal ----
  function addReveal() {
    document.querySelectorAll(
      '.card, .step-c, .stat-box, .sec-head, .svc-card, .quote-card, .prod-card, .faq-item, .partner-card, .c-item, .mission-wrap'
    ).forEach(function (el) { el.classList.add('reveal'); });
  }
  addReveal();
  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } });
    }, { threshold: 0.08 });
    document.querySelectorAll('.reveal').forEach(function (el) { io.observe(el); });
  } else {
    document.querySelectorAll('.reveal').forEach(function (el) { el.classList.add('in'); });
  }

  // ---- Stat counters ----
  function countUp(el) {
    var n   = parseFloat(el.dataset.count);
    var suf = el.dataset.suffix || '';
    var dur = 1400;
    var t0  = performance.now();
    var fmt = function (v) { return n >= 1000 ? Math.round(v).toLocaleString() : Math.round(v).toString(); };
    (function tick(t) {
      var p = Math.min((t - t0) / dur, 1);
      var e = 1 - Math.pow(1 - p, 3);
      el.textContent = fmt(n * e) + suf;
      if (p < 1) requestAnimationFrame(tick);
    })(performance.now());
  }
  if ('IntersectionObserver' in window) {
    var co = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) { if (e.isIntersecting) { countUp(e.target); co.unobserve(e.target); } });
    }, { threshold: 0.5 });
    document.querySelectorAll('[data-count]').forEach(function (el) { co.observe(el); });
  }

  // ---- Mini hero form: scroll to contact or go to contact page ----
  var mini = document.querySelector('[data-mini-form]');
  if (mini) {
    mini.addEventListener('submit', function (e) {
      e.preventDefault();
      var ct = document.getElementById('contactSection');
      if (ct) { ct.scrollIntoView({ behavior: 'smooth' }); }
      else { window.location.href = 'contact.html'; }
    });
  }

  // ---- Contact form ----
  var cForm = document.getElementById('contactForm');
  if (cForm) {
    var cNote = document.getElementById('formMsg');
    var EMAIL = 'Info@newwatertoday.com';
    var rules = {
      name:  function (v) { return v.trim().length >= 2 ? '' : 'Please enter your name.'; },
      phone: function (v) { return v.replace(/\D/g,'').length >= 10 ? '' : 'Enter a valid phone number.'; },
      email: function (v) { return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim()) ? '' : 'Enter a valid email.'; },
      zip:   function (v) { return /^\d{5}$/.test(v.trim()) ? '' : 'Enter a 5-digit ZIP code.'; }
    };
    function showErr(name, msg) {
      var f = cForm.querySelector('[name="' + name + '"]');
      var e = cForm.querySelector('[data-err="' + name + '"]');
      if (f) f.classList.toggle('invalid', !!msg);
      if (e) e.textContent = msg || '';
    }
    Object.keys(rules).forEach(function (name) {
      var f = cForm.querySelector('[name="' + name + '"]');
      if (f) f.addEventListener('blur', function () { showErr(name, rules[name](f.value)); });
    });
    cForm.addEventListener('submit', function (e) {
      e.preventDefault();
      var ok = true;
      Object.keys(rules).forEach(function (name) {
        var f = cForm.querySelector('[name="' + name + '"]');
        var msg = f ? rules[name](f.value) : '';
        showErr(name, msg);
        if (msg) ok = false;
      });
      if (!ok) { if (cNote) { cNote.textContent = 'Please fix the highlighted fields.'; cNote.className = 'form-msg err'; } return; }
      var d = Object.fromEntries(new FormData(cForm).entries());
      var s = encodeURIComponent('Free Water Test Request — ' + d.name);
      var b = encodeURIComponent('Name: ' + d.name + '\nPhone: ' + d.phone + '\nEmail: ' + d.email + '\nZIP: ' + d.zip + '\n\nMessage:\n' + (d.message || '(none)'));
      window.location.href = 'mailto:' + EMAIL + '?subject=' + s + '&body=' + b;
      if (cNote) { cNote.textContent = 'Opening your email app…'; cNote.className = 'form-msg ok'; }
    });
  }

  // ---- Newsletter form ----
  var subForm = document.getElementById('subForm');
  if (subForm) {
    var sNote = document.getElementById('subNote');
    subForm.addEventListener('submit', function (e) {
      e.preventDefault();
      var em = subForm.querySelector('input[type="email"]').value.trim();
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(em)) {
        if (sNote) { sNote.textContent = 'Enter a valid email address.'; sNote.className = 'sub-note err'; }
        return;
      }
      subForm.reset();
      if (sNote) { sNote.textContent = "You're in! Check your inbox for your 5% off code."; sNote.className = 'sub-note ok'; }
    });
  }

})();
