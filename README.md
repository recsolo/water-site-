# New Water Today — Website

A modern, fast, fully responsive marketing website for **New Water Today**, a
residential and commercial water-treatment company (water testing, filtration,
softeners, reverse osmosis, well-water treatment, UV purification, and service).

It's a static site — plain HTML, CSS, and vanilla JavaScript with **no build
step and no dependencies** — so it loads fast and can be hosted anywhere
(GitHub Pages, Netlify, Vercel, Cloudflare Pages, or any web host).

## Preview locally

```bash
# from the project root
python3 -m http.server 8000
# then open http://localhost:8000
```

## File structure

```
index.html              # all page content/sections
assets/css/styles.css   # design system + responsive styles
assets/js/main.js       # interactivity + BUSINESS config (edit here!)
assets/img/             # favicon + social share image
```

## ⚙️ Customize your business details (most important)

Open **`assets/js/main.js`** and edit the `BUSINESS` object at the very top.
Phone numbers, email, and service area are applied automatically everywhere on
the page:

```js
const BUSINESS = {
  name: "New Water Today",
  phoneDisplay: "(555) 123-4567",   // shown to visitors
  phoneDial: "+15551234567",        // tel: link (digits, with country code)
  email: "info@newwatertoday.com",
  area: "[Your City], [State] & surrounding communities",
  formAction: "mailto",             // "mailto" or a form endpoint URL
};
```

### Contact form

- `formAction: "mailto"` (default) opens the visitor's email app pre-filled —
  works instantly with zero setup.
- For a real inbox-free submission, set `formAction` to a form endpoint URL
  (e.g. [Formspree](https://formspree.io), Netlify Forms, or your own API).
  The form will `POST` JSON to it.

## ✅ Real content is in place

All core business content from the original `newwatertoday.com` is built in and
accurate: company name and slogan ("Clean Water. Right Now."), 30+ years of
experience, exclusive RainSoft partner in Indiana, Lowe's-of-Indiana water
treatment provider, mission/about copy, products (RainSoft Complete Water
Systems & Drinking Systems), address (5677 West 73rd Street, Indianapolis, IN),
phones (855-472-4676 / 317-708-6070), email (Info@newwatertoday.com), hours
(Mon–Fri 9am–5pm), and the free-water-test and 5%-off newsletter sections.

### A few items still to finalize before going live

- **Testimonials** — the three reviews in `#testimonials` are clearly-labeled
  *samples*. Replace them with real Google/Facebook reviews.
- **Logo** — currently an inline SVG water-drop mark. Drop in the real logo
  image if you have one.
- **Social links** — footer Facebook/Instagram `href="#"` need the real URLs
  (the original site had an Instagram feed).
- **Privacy / Terms** — footer links currently point to `#`.
- **Real photos** — the original used product/lifestyle photos; this build uses
  a clean icon-and-gradient style. Add real imagery if desired.

## Deploy to GitHub Pages

1. Push to the repository's default branch.
2. Repo **Settings → Pages → Build and deployment → Source: Deploy from a
   branch**, choose the branch and `/ (root)`.
3. Your site goes live at `https://<user>.github.io/<repo>/`.

## Accessibility & SEO

- Semantic landmarks, skip link, labeled form fields, keyboard-friendly nav.
- Respects `prefers-reduced-motion`.
- Meta description + Open Graph tags for social sharing.
- Lighthouse-friendly: system fonts fallback, no render-blocking scripts.
