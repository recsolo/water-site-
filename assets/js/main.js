/* =========================================================================
   New Water Today — site behavior
   ------------------------------------------------------------------------
   EDIT YOUR BUSINESS DETAILS HERE. These values are applied automatically
   to every phone link, email link, and service-area mention on the page.
   ========================================================================= */
const BUSINESS = {
  name: "New Water Today",
  phoneDisplay: "855-472-4676",       // primary number shown to visitors
  phoneDial: "+18554724676",          // used for tel: links (digits only, with +1)
  email: "Info@newwatertoday.com",
  area: "Indianapolis, IN — serving all of Indiana",
  // Where the contact form sends submissions. Options:
  //   "mailto"  -> opens the visitor's email app addressed to BUSINESS.email (works with zero setup)
  //   a URL     -> POSTs the form to that endpoint (e.g. Formspree, Netlify, your own API)
  formAction: "mailto",
};

/* ---------- apply business details to the DOM ---------- */
(function applyBusiness() {
  document.querySelectorAll('[data-biz="phone-link"]').forEach((el) => {
    el.setAttribute("href", "tel:" + BUSINESS.phoneDial);
    // only replace the visible label if it currently looks like the placeholder number
    if (/\(?\d/.test(el.textContent)) el.textContent = el.textContent.replace(/\(?\d[\d()\s-]{6,}\d/, BUSINESS.phoneDisplay);
  });
  document.querySelectorAll('[data-biz="email-link"]').forEach((el) => {
    el.setAttribute("href", "mailto:" + BUSINESS.email);
    if (el.textContent.includes("@")) el.textContent = BUSINESS.email;
  });
  document.querySelectorAll('[data-biz="area"]').forEach((el) => { el.textContent = BUSINESS.area; });
})();

/* ---------- mobile nav ---------- */
const navToggle = document.getElementById("navToggle");
const nav = document.getElementById("nav");
if (navToggle && nav) {
  const setOpen = (open) => {
    nav.classList.toggle("is-open", open);
    navToggle.setAttribute("aria-expanded", String(open));
    navToggle.setAttribute("aria-label", open ? "Close menu" : "Open menu");
  };
  navToggle.addEventListener("click", () => setOpen(!nav.classList.contains("is-open")));
  nav.querySelectorAll("a").forEach((a) => a.addEventListener("click", () => setOpen(false)));
  document.addEventListener("keydown", (e) => { if (e.key === "Escape") setOpen(false); });
}

/* ---------- sticky header shadow ---------- */
const header = document.getElementById("header");
const onScroll = () => header && header.classList.toggle("is-scrolled", window.scrollY > 8);
window.addEventListener("scroll", onScroll, { passive: true });
onScroll();

/* ---------- current year ---------- */
const yearEl = document.getElementById("year");
if (yearEl) yearEl.textContent = new Date().getFullYear();

/* ---------- scroll reveal ---------- */
const revealTargets = document.querySelectorAll(".card, .step, .stat, .section__head, .why__text, .quotecard");
revealTargets.forEach((el) => el.classList.add("reveal"));
if ("IntersectionObserver" in window) {
  const io = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) { entry.target.classList.add("is-visible"); io.unobserve(entry.target); }
    });
  }, { threshold: 0.12 });
  revealTargets.forEach((el) => io.observe(el));
} else {
  revealTargets.forEach((el) => el.classList.add("is-visible"));
}

/* ---------- animated stat counters ---------- */
function animateCount(el) {
  const target = parseFloat(el.dataset.count);
  const suffix = el.dataset.suffix || "";
  const dur = 1400;
  const start = performance.now();
  const fmt = (n) => (target >= 1000 ? Math.round(n).toLocaleString() : Math.round(n).toString());
  function tick(now) {
    const p = Math.min((now - start) / dur, 1);
    const eased = 1 - Math.pow(1 - p, 3);
    el.textContent = fmt(target * eased) + suffix;
    if (p < 1) requestAnimationFrame(tick);
  }
  requestAnimationFrame(tick);
}
const counters = document.querySelectorAll("[data-count]");
if ("IntersectionObserver" in window && counters.length) {
  const co = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) { animateCount(entry.target); co.unobserve(entry.target); }
    });
  }, { threshold: 0.6 });
  counters.forEach((el) => co.observe(el));
}

/* ---------- mini hero form -> jump to full contact form ---------- */
const miniForm = document.querySelector("[data-mini-form]");
if (miniForm) {
  miniForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const zip = miniForm.querySelector("input").value.trim();
    const contact = document.getElementById("contact");
    if (contact) contact.scrollIntoView({ behavior: "smooth" });
    const note = document.getElementById("formNote");
    const nameField = document.getElementById("name");
    if (nameField) setTimeout(() => nameField.focus(), 600);
    if (note && zip) { note.textContent = "Great — finish the form below and we'll schedule your free test."; note.className = "form-note ok"; }
  });
}

/* ---------- contact form validation + submit ---------- */
const form = document.getElementById("contactForm");
if (form) {
  const note = document.getElementById("formNote");
  const showError = (name, msg) => {
    const field = form.querySelector(`[name="${name}"]`);
    const err = form.querySelector(`[data-error-for="${name}"]`);
    if (field) field.classList.toggle("invalid", !!msg);
    if (err) err.textContent = msg || "";
  };
  const validators = {
    name: (v) => (v.trim().length >= 2 ? "" : "Please enter your name."),
    phone: (v) => (v.replace(/\D/g, "").length >= 10 ? "" : "Enter a valid phone number."),
    email: (v) => (/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim()) ? "" : "Enter a valid email address."),
  };

  Object.keys(validators).forEach((name) => {
    const field = form.querySelector(`[name="${name}"]`);
    field && field.addEventListener("blur", () => showError(name, validators[name](field.value)));
  });

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    let ok = true;
    Object.keys(validators).forEach((name) => {
      const field = form.querySelector(`[name="${name}"]`);
      const msg = validators[name](field.value);
      showError(name, msg);
      if (msg) ok = false;
    });
    if (!ok) { note.textContent = "Please fix the highlighted fields."; note.className = "form-note err"; return; }

    const data = Object.fromEntries(new FormData(form).entries());

    if (BUSINESS.formAction === "mailto") {
      const subject = encodeURIComponent(`Website request: ${data.interest} — ${data.name}`);
      const body = encodeURIComponent(
        `Name: ${data.name}\nPhone: ${data.phone}\nEmail: ${data.email}\nInterested in: ${data.interest}\n\nMessage:\n${data.message || "(none)"}`
      );
      window.location.href = `mailto:${BUSINESS.email}?subject=${subject}&body=${body}`;
      note.textContent = "Opening your email app to send your request…";
      note.className = "form-note ok";
      return;
    }

    // POST to a configured endpoint
    note.textContent = "Sending…";
    note.className = "form-note";
    fetch(BUSINESS.formAction, {
      method: "POST",
      headers: { Accept: "application/json", "Content-Type": "application/json" },
      body: JSON.stringify(data),
    })
      .then((r) => {
        if (!r.ok) throw new Error("bad response");
        form.reset();
        note.textContent = "Thank you! We'll reach out within one business day.";
        note.className = "form-note ok";
      })
      .catch(() => {
        note.textContent = `Something went wrong. Please call us at ${BUSINESS.phoneDisplay}.`;
        note.className = "form-note err";
      });
  });
}

/* ---------- newsletter subscribe ---------- */
const subForm = document.getElementById("subscribeForm");
if (subForm) {
  const subNote = document.getElementById("subNote");
  subForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const email = subForm.querySelector("input").value.trim();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      subNote.textContent = "Please enter a valid email address.";
      subNote.className = "subscribe__note err";
      return;
    }
    subForm.reset();
    subNote.textContent = "You're in! Check your inbox for your 5% off code.";
    subNote.className = "subscribe__note ok";
  });
}
