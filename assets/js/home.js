// Home page: hero visual, ticker, category grid, featured products, brand marquee, stat count-up.

function renderTicker(categories) {
  const track = document.getElementById('tickerTrack');
  if (!track) return;
  const items = categories.map(c => `<span class="ti">${c.label}<span class="tsep">✦</span></span>`).join('');
  track.innerHTML = items + items;
}

function renderCategoryGrid(categories) {
  const grid = document.getElementById('categoryGrid');
  if (!grid) return;
  grid.innerHTML = categories.map((c, i) => `
    <a class="category-card reveal" style="--delay:${(i % 3) * 0.08}s" href="category.html?cat=${c.slug}">
      <div class="cat-head" style="background:linear-gradient(135deg, ${c.gradient[0]}, ${c.gradient[1]})">
        <div class="cat-icon">${categoryIconSvg(c.slug, 34)}</div>
        <div class="cat-badge">${c.count} item${c.count === 1 ? '' : 's'}</div>
      </div>
      <div class="cat-body">
        <div class="cat-tag">${c.tag}</div>
        <div class="cat-name">${c.label}</div>
        <p class="cat-desc">${c.desc}</p>
        <span class="cat-link">Shop Now →</span>
      </div>
    </a>
  `).join('');
}

function renderFeatured(featured) {
  const featuredGrid = document.getElementById('featuredGrid');
  if (!featuredGrid) return;
  featuredGrid.innerHTML = featured.map((p, i) => `
    <div class="product-card reveal" style="--delay:${(i % 4) * 0.08}s">
      <div class="product-img-wrap">
        <span class="product-vendor">${p.vendor}</span>
        <img src="${p.img}" alt="${p.title}" loading="lazy">
      </div>
      <div class="product-body">
        <h3>${p.title}</h3>
        <p class="product-desc">Genuine stock, sourced directly from ${p.vendor}.</p>
        <div class="product-foot">
          <span class="product-price">${fmtPrice(p.price)}</span>
          <button class="mini-add-to-cart" data-add-to-cart data-title="${p.title.replace(/"/g, '&quot;')}" data-vendor="${p.vendor.replace(/"/g, '&quot;')}" data-price="${p.price}" aria-label="Add ${p.title} to cart">
            ${uiIconSvg('plus', 15)}
          </button>
        </div>
      </div>
    </div>
  `).join('');

  if (featured.length) {
    const h = featured[0];
    document.getElementById('heroImg').src = h.img;
    document.getElementById('heroImg').alt = h.title;
    document.getElementById('heroTitle').textContent = h.title;
    document.getElementById('heroVendor').textContent = h.vendor;
    document.getElementById('heroPrice').textContent = fmtPrice(h.price);
  }
}

function setupTilt() {
  const tiltCard = document.getElementById('tiltCard');
  if (!tiltCard || reduceMotion || !window.matchMedia('(hover: hover)').matches) return;
  tiltCard.addEventListener('mousemove', (e) => {
    const rect = tiltCard.getBoundingClientRect();
    const px = (e.clientX - rect.left) / rect.width - 0.5;
    const py = (e.clientY - rect.top) / rect.height - 0.5;
    tiltCard.classList.add('tilting');
    tiltCard.style.transform = `rotateY(${px * 10}deg) rotateX(${py * -10}deg) translateZ(10px)`;
  });
  tiltCard.addEventListener('mouseleave', () => {
    tiltCard.classList.remove('tilting');
    tiltCard.style.transform = '';
  });
}

function setupBrandMarquee() {
  const marqueeTrack = document.getElementById('marqueeTrack');
  if (marqueeTrack) marqueeTrack.innerHTML += marqueeTrack.innerHTML;
}

function countUp(el, target, suffix, duration = 1400) {
  const start = performance.now();
  function tick(now) {
    const progress = Math.min((now - start) / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3);
    el.textContent = Math.round(target * eased) + suffix;
    if (progress < 1) requestAnimationFrame(tick);
  }
  requestAnimationFrame(tick);
}

async function initHome() {
  const [featured, categories] = await Promise.all([
    fetch('assets/data/featured.json').then(r => r.json()),
    fetch('assets/data/categories.json').then(r => r.json()),
  ]);

  const totalProducts = categories.reduce((sum, c) => sum + c.count, 0);

  renderTicker(categories);
  renderCategoryGrid(categories);
  renderFeatured(featured);
  setupTilt();
  setupBrandMarquee();
  if (window.setupReveal) window.setupReveal();

  const statTotal = document.getElementById('statTotal');
  if (statTotal) {
    if (reduceMotion) statTotal.textContent = totalProducts + '+';
    else setTimeout(() => countUp(statTotal, totalProducts, '+'), 300);
  }
}

initHome();
