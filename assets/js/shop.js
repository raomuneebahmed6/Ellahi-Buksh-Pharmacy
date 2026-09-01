// Shop page: search + category filter over the full catalog.

const categoryColors = {
  'All': 'var(--navy)',
  'Medicines': 'var(--red)',
  'Skincare': 'var(--amber)',
  'Vitamins & Supplements': 'var(--good)',
  'Devices': 'var(--navy)',
  'Hair Care': 'var(--red-2, var(--red))',
  'Mother & Baby': 'var(--amber)',
  'Diabetic Care': 'var(--good)',
};

function getQueryParam(name) {
  return new URLSearchParams(window.location.search).get(name);
}

async function initShop() {
  const catalog = await fetch('assets/data/catalog.json').then(r => r.json());

  const statTotal = document.getElementById('shopTotal');
  if (statTotal) statTotal.textContent = catalog.length;

  const categories = ['All', ...Array.from(new Set(catalog.map(p => p.category))).sort()];
  let activeCategory = getQueryParam('cat') && categories.includes(getQueryParam('cat')) ? getQueryParam('cat') : 'All';
  let searchTerm = '';

  const chipRow = document.getElementById('chipRow');
  chipRow.innerHTML = categories.map(c =>
    `<button class="chip${c === activeCategory ? ' active' : ''}" data-cat="${c}" style="--chip-color:${categoryColors[c] || 'var(--navy)'}">${c}</button>`
  ).join('');

  function renderCatalog() {
    const term = searchTerm.trim().toLowerCase();
    const filtered = catalog.filter(p => {
      const matchesCat = activeCategory === 'All' || p.category === activeCategory;
      const matchesSearch = !term || p.title.toLowerCase().includes(term) || p.vendor.toLowerCase().includes(term);
      return matchesCat && matchesSearch;
    });

    document.getElementById('catalogCount').textContent = `${filtered.length} of ${catalog.length} products`;

    const list = document.getElementById('catalogList');
    if (filtered.length === 0) {
      list.innerHTML = '<div class="catalog-empty">No products match — try a different search or category.</div>';
      return;
    }
    list.innerHTML = filtered.map(p => `
      <div class="catalog-row">
        <div>
          <div class="catalog-row-name">${p.title}</div>
          <div class="catalog-row-vendor">${p.vendor}</div>
        </div>
        <div class="catalog-row-price">${fmtPrice(p.price)}</div>
      </div>
    `).join('');
  }

  chipRow.addEventListener('click', (e) => {
    const btn = e.target.closest('.chip');
    if (!btn) return;
    activeCategory = btn.dataset.cat;
    chipRow.querySelectorAll('.chip').forEach(c => c.classList.toggle('active', c === btn));
    renderCatalog();
  });

  document.getElementById('catalogSearch').addEventListener('input', (e) => {
    searchTerm = e.target.value;
    renderCatalog();
  });

  renderCatalog();
}

initShop();
