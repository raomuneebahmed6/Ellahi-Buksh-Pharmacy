# Ellahie Buksh & Sons Pharmacy — Website

A multi-page marketing website for **Ellahie Buksh & Sons Pharmacy** (Ebsons), Okara — built with plain HTML, CSS and JavaScript. No build step, no framework, no server required.

- **Five pages**: Home, About, Contact, Shop All (searchable catalog), and a Category template (`category.html?cat=<slug>`) that filters to one product category.
- Real product catalog (150 items) and 12 featured bestsellers, pulled from the pharmacy's live Shopify store (`ebsons.com.pk`) and checked into `assets/data/`.
- Brand colors and logo taken directly from the pharmacy's own logo (navy `#083559`, red `#EF1D31`, amber `#F5A623` accent).
- Poppins for display type, IBM Plex Mono for prices.
- Search + category filtering, a category-dropdown nav with mobile drawer, scroll-reveal animations, hover/tilt effects, an auto-scrolling brand marquee and category ticker, and a WhatsApp ordering flow throughout.
- Light/dark mode aware (follows system preference).

## Project structure

```
index.html                    — Home
about.html                    — About
contact.html                  — Contact (incl. embedded map)
shop.html                     — Shop All: search + category filter over the full catalog
category.html                 — Category template, reads ?cat=<slug> from categories.json
assets/
  css/style.css                — all styling (design tokens + components), shared by every page
  js/nav.js                    — shared chrome: nav dropdown, mobile menu, footer links, scroll-reveal, FAQ
  js/home.js                   — home page: hero, ticker, category grid, featured products, marquee
  js/shop.js                   — shop page: search/filter over the full catalog
  js/category.js               — category page: filters catalog.json by the ?cat= slug
  img/logo.webp                 — the pharmacy's logo
  img/products/*.jpg           — featured product photos
  data/featured.json           — the 12 featured products (title, vendor, price, image)
  data/catalog.json            — the full 150-product catalog (title, vendor, price, category)
  data/categories.json         — the 7 categories (slug, label, description, gradient, monogram, count)
```

Every page loads `assets/js/nav.js` first, then its own page script. `nav.js` populates the "Products" dropdown and the footer's category links from `categories.json`, and exposes `window.setupReveal()` so page scripts can re-run the scroll-reveal observer after they finish rendering fetched data (needed because reveal elements inserted after the initial pass wouldn't otherwise be observed).

## Running locally

No build step needed — just serve the folder over HTTP (opening files directly as `file://` URLs won't work because pages `fetch()` the JSON data files):

```bash
python3 -m http.server 8080
# then open http://localhost:8080
```

or with Node:

```bash
npx serve .
```

## Updating the catalog

- **Full catalog**: edit `assets/data/catalog.json` — shown on the Shop All page and on each category page. Each item needs `title`, `vendor`, `price`, and `category` (must exactly match a `label` in `categories.json`).
- **Featured/bestsellers**: edit `assets/data/featured.json` (12 cards on the homepage) — each needs an `img` pointing at a file in `assets/img/products/`.
- **Categories**: edit `assets/data/categories.json` to add/rename/re-describe a category. `slug` is what's used in the URL (`category.html?cat=slug`), `gradient` takes two CSS color values (CSS variables like `var(--navy)` work), `monogram` is the 2-letter mark shown on the category card and hero.

No code changes are needed for any of the above — every page reads these JSON files at load time.

## Deploying

This is a static site — it deploys anywhere that serves static files:

- **GitHub Pages**: Settings → Pages → Deploy from branch → `main` / `/ (root)`.
- **Vercel / Netlify**: import this repo, no build command needed, output directory is `.` (root).

## Ordering

All "order" actions link to WhatsApp (`wa.me/923200202202`) with the product name pre-filled in the message — there's no cart or checkout on this site by design.
