// Category page: reads ?cat=<slug>, shows that category's hero + a 4-up
// product card grid (icon, name, short description, price, add to cart).

function getQueryParam(name) {
  return new URLSearchParams(window.location.search).get(name);
}

function escapeAttr(s) {
  return String(s).replace(/&/g, '&amp;').replace(/"/g, '&quot;');
}

async function initCategory() {
  const slug = getQueryParam('cat');
  const [categories, catalog] = await Promise.all([
    fetch('assets/data/categories.json').then(r => r.json()),
    fetch('assets/data/catalog.json').then(r => r.json()),
  ]);

  const category = categories.find(c => c.slug === slug);
  const heroEl = document.getElementById('categoryHero');
  const gridEl = document.getElementById('categoryProductGrid');
  gridEl.classList.remove('catalog-list');
  gridEl.classList.add('cat-product-grid');

  if (!category) {
    heroEl.innerHTML = `
      <div class="wrap">
        <div class="crumbs"><a href="index.html">Home</a> / <span>Not found</span></div>
        <h1>Category not found</h1>
        <p>That category doesn't exist — browse the full catalog instead.</p>
      </div>
    `;
    gridEl.innerHTML = `
      <div class="empty-state">
        <h2>We couldn't find that category</h2>
        <p>It may have been renamed or removed.</p>
        <a class="btn btn-red" href="shop.html">Browse all products</a>
      </div>
    `;
    return;
  }

  document.title = `${category.label} — Ellahie Buksh & Sons Pharmacy`;

  heroEl.innerHTML = `
    <div class="wrap">
      <div class="crumbs"><a href="index.html">Home</a> / <a href="shop.html">Shop</a> / <span>${category.label}</span></div>
      <span class="kicker">${category.tag}</span>
      <h1>${category.label}</h1>
      <p>${category.desc} — ${category.count} product${category.count === 1 ? '' : 's'} currently listed.</p>
    </div>
  `;

  const items = catalog.filter(p => p.category === category.label);

  if (items.length === 0) {
    gridEl.classList.remove('cat-product-grid');
    gridEl.innerHTML = `
      <div class="empty-state">
        <h2>Nothing listed here right now</h2>
        <p>Message us on WhatsApp — we may still have it in store.</p>
        <a class="btn btn-red" href="${waLink(category.label)}" target="_blank" rel="noopener noreferrer">Ask on WhatsApp</a>
      </div>
    `;
    return;
  }

  const [gradFrom, gradTo] = category.gradient;

  gridEl.innerHTML = items.map((p, i) => `
    <div class="cp-card reveal" style="--delay:${(i % 8) * 0.05}s">
      <div class="cp-icon-wrap" style="background:linear-gradient(135deg, ${gradFrom}, ${gradTo})">
        <span class="cp-vendor">${p.vendor}</span>
        ${categoryIconSvg(category.slug, 30)}
      </div>
      <div class="cp-body">
        <div class="cp-name">${p.title}</div>
        <p class="cp-desc">Genuine stock, sourced directly from ${p.vendor}.</p>
        <div class="cp-price">${fmtPrice(p.price)}</div>
        <button class="add-to-cart" data-add-to-cart data-title="${escapeAttr(p.title)}" data-vendor="${escapeAttr(p.vendor)}" data-price="${p.price}">
          ${uiIconSvg('plus', 15, 'atc-icon')}<span class="atc-label">Add to cart</span>
        </button>
      </div>
    </div>
  `).join('');

  if (window.setupReveal) window.setupReveal();
}

initCategory();
