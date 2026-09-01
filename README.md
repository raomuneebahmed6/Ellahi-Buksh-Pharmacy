# Ellahie Buksh & Sons Pharmacy — Website

A static marketing website for **Ellahie Buksh & Sons Pharmacy** (Ebsons), Okara — built with plain HTML, CSS and JavaScript. No build step, no framework, no server required.

- Real product catalog (150 items) and 12 featured bestsellers, pulled from the pharmacy's live Shopify store (`ebsons.com.pk`) and checked into `assets/data/`.
- Brand colors and logo taken directly from the pharmacy's own logo (navy `#083559`, red `#EF1D31`, amber `#F5A623` accent).
- Poppins for display type, IBM Plex Mono for prices.
- Search + category filtering over the full catalog, scroll-reveal animations, hover/tilt effects, an auto-scrolling brand marquee, and a WhatsApp ordering flow throughout.
- Light/dark mode aware (follows system preference).

## Project structure

```
index.html                   — the page itself
assets/
  css/style.css               — all styling (design tokens + components)
  js/app.js                   — catalog rendering, filtering, animations
  img/logo.webp                — the pharmacy's logo
  img/products/*.jpg          — featured product photos
  data/featured.json          — the 12 featured products (title, vendor, price, image)
  data/catalog.json           — the full 150-product catalog (title, vendor, price, category)
```

## Running locally

No build step needed — just serve the folder over HTTP (opening `index.html` directly as a `file://` URL won't work because the page `fetch()`s the JSON data files):

```bash
python3 -m http.server 8080
# then open http://localhost:8080
```

or with Node:

```bash
npx serve .
```

## Updating the catalog

Edit `assets/data/catalog.json` (full list, shown in the searchable "Shop all" section) and `assets/data/featured.json` (the 12 bestseller cards on the homepage, each needs an `img` pointing at a file in `assets/img/products/`). No other code changes are needed — the page reads both files at load time.

## Deploying

This is a static site — it deploys anywhere that serves static files:

- **GitHub Pages**: Settings → Pages → Deploy from branch → `main` / `/ (root)`.
- **Vercel / Netlify**: import this repo, no build command needed, output directory is `.` (root).

## Ordering

All "order" actions link to WhatsApp (`wa.me/923200202202`) with the product name pre-filled in the message — there's no cart or checkout on this site by design.
