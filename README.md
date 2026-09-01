# Ellahie Buksh & Sons Pharmacy — Website

A multi-page marketing website for **Ellahie Buksh & Sons Pharmacy** (Ebsons), Okara — built with plain HTML, CSS and JavaScript. No build step, no framework, no server required.

- **Five pages**: Home, About, Contact, Shop All (searchable catalog), and a Category template (`category.html?cat=<slug>`) that filters to one product category.
- Real product catalog (150 items) and 12 featured bestsellers, pulled from the pharmacy's live Shopify store (`ebsons.com.pk`) and checked into `assets/data/`.
- Brand colors and logo taken directly from the pharmacy's own logo (navy `#083559`, red `#EF1D31`, amber `#F5A623` accent).
- Poppins for display type, IBM Plex Mono for prices.
- Search + category filtering, a category-dropdown nav with mobile drawer, scroll-reveal animations, hover/tilt effects, an auto-scrolling brand marquee and category ticker.
- A real client-side **cart** (localStorage-backed, no backend): "Add to cart" on every product card, a cart icon with live count in the header, a slide-in drawer with quantity controls, and checkout as one consolidated WhatsApp message — this is what "ordering" means on a static site with no payment backend.
- Category-specific line icons (pill, droplet, leaf, pulse, comb, bottle, syringe) instead of flat lettering, used on the home category grid and the category page cards.
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
  js/icons.js                  — shared SVG icon set (one per category, plus cart/check/plus)
  js/cart.js                   — shared cart: localStorage, header badge, drawer, WhatsApp checkout
  js/home.js                   — home page: hero, ticker, category grid, featured products, marquee
  js/shop.js                   — shop page: search/filter over the full catalog
  js/category.js               — category page: filters catalog.json by the ?cat= slug, renders product cards
  img/logo.webp                 — the pharmacy's logo
  img/products/*.jpg           — featured product photos
  data/featured.json           — the 12 featured products (title, vendor, price, image)
  data/catalog.json            — the full 150-product catalog (title, vendor, price, category)
  data/categories.json         — the 7 categories (slug, label, description, gradient, monogram, count)
```

Every page loads `assets/js/nav.js`, then `icons.js` and `cart.js`, then its own page script. `nav.js` populates the "Products" dropdown and the footer's category links from `categories.json`, and exposes `window.setupReveal()` so page scripts can re-run the scroll-reveal observer after they finish rendering fetched data (needed because reveal elements inserted after the initial pass wouldn't otherwise be observed). `cart.js` builds the cart button and drawer once per page and listens for clicks on any `[data-add-to-cart]` button anywhere in the document, so page scripts just need to render a button with `data-title`/`data-vendor`/`data-price` attributes — no per-page wiring required.

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

Every product card has an "Add to cart" button. The cart lives in the browser's `localStorage` (key `ebsonsCart`) — there's no backend, no payment gateway, and no order history. The drawer's "Checkout on WhatsApp" button is the actual completion step: it builds one message listing every line item, quantity and the total, and opens `wa.me/923200202202` with it pre-filled.
