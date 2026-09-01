// Category page: reads ?cat=<slug>, shows that category's hero + product grid.

function getQueryParam(name) {
  return new URLSearchParams(window.location.search).get(name);
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
  const crumbEl = document.getElementById('categoryCrumb');

  if (!category) {
    heroEl.innerHTML = `
      <div class="crumbs"><a href="index.html">Home</a> / <span>Not found</span></div>
      <h1>Category not found</h1>
      <p>That category doesn't exist — browse the full catalog instead.</p>
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
  if (crumbEl) crumbEl.textContent = category.label;

  heroEl.innerHTML = `
    <div class="crumbs"><a href="index.html">Home</a> / <a href="shop.html">Shop</a> / <span>${category.label}</span></div>
    <span class="kicker">${category.tag}</span>
    <h1>${category.label}</h1>
    <p>${category.desc} — ${category.count} product${category.count === 1 ? '' : 's'} currently listed.</p>
  `;

  const items = catalog.filter(p => p.category === category.label);

  if (items.length === 0) {
    gridEl.innerHTML = `
      <div class="empty-state">
        <h2>Nothing listed here right now</h2>
        <p>Message us on WhatsApp — we may still have it in store.</p>
        <a class="btn btn-red" href="${waLink(category.label)}" target="_blank" rel="noopener noreferrer">Ask on WhatsApp</a>
      </div>
    `;
    return;
  }

  gridEl.innerHTML = items.map((p, i) => `
    <div class="catalog-row reveal" style="--delay:${(i % 6) * 0.05}s">
      <div>
        <div class="catalog-row-name">${p.title}</div>
        <div class="catalog-row-vendor">${p.vendor}</div>
      </div>
      <div style="display:flex; align-items:center; gap:14px;">
        <div class="catalog-row-price">${fmtPrice(p.price)}</div>
        <a class="mini-wa" href="${waLink(p.title)}" target="_blank" rel="noopener noreferrer" aria-label="Order ${p.title} on WhatsApp">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M17.5 14.4c-.3-.1-1.7-.9-2-1-.3-.1-.5-.1-.7.1-.2.3-.8 1-.9 1.1-.2.2-.3.2-.6.1-.3-.1-1.2-.4-2.3-1.4-.9-.8-1.4-1.7-1.6-2-.2-.3 0-.5.1-.6.1-.1.3-.3.4-.5.1-.1.2-.3.3-.4.1-.2 0-.4 0-.5C10.1 9 9.6 7.8 9.4 7.3c-.2-.5-.4-.4-.6-.4h-.5c-.2 0-.5.1-.7.3-.2.3-.9.9-.9 2.1s1 2.5 1.1 2.6c.1.2 2 3 4.8 4.2.7.3 1.2.5 1.6.6.7.2 1.3.2 1.8.1.5-.1 1.7-.7 1.9-1.3.2-.6.2-1.2.2-1.3-.1-.1-.3-.2-.6-.3Z"/><path d="M12 2a10 10 0 0 0-8.6 15L2 22l5.2-1.4A10 10 0 1 0 12 2Zm0 18a8 8 0 0 1-4.1-1.1l-.3-.2-3.1.8.8-3-.2-.3A8 8 0 1 1 12 20Z"/></svg>
        </a>
      </div>
    </div>
  `).join('');

  if (window.setupReveal) window.setupReveal();
}

initCategory();
