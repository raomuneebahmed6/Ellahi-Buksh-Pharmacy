document.getElementById('year').textContent = new Date().getFullYear();

const WHATSAPP_NUMBER = '923200202202';
const waLink = (name) => `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent('Hi, I want to order: ' + name)}`;
const fmtPrice = (n) => 'Rs ' + Math.round(n).toLocaleString();
const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

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

function renderFeatured(featured) {
  const featuredGrid = document.getElementById('featuredGrid');
  featuredGrid.innerHTML = featured.map((p, i) => `
    <div class="product-card reveal" style="--delay:${(i % 4) * 0.08}s">
      <div class="product-img-wrap">
        <span class="product-vendor">${p.vendor}</span>
        <img src="${p.img}" alt="${p.title}" loading="lazy">
      </div>
      <div class="product-body">
        <h3>${p.title}</h3>
        <div class="product-foot">
          <span class="product-price">${fmtPrice(p.price)}</span>
          <a class="mini-wa" href="${waLink(p.title)}" target="_blank" rel="noopener noreferrer" aria-label="Order ${p.title} on WhatsApp">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M17.5 14.4c-.3-.1-1.7-.9-2-1-.3-.1-.5-.1-.7.1-.2.3-.8 1-.9 1.1-.2.2-.3.2-.6.1-.3-.1-1.2-.4-2.3-1.4-.9-.8-1.4-1.7-1.6-2-.2-.3 0-.5.1-.6.1-.1.3-.3.4-.5.1-.1.2-.3.3-.4.1-.2 0-.4 0-.5C10.1 9 9.6 7.8 9.4 7.3c-.2-.5-.4-.4-.6-.4h-.5c-.2 0-.5.1-.7.3-.2.3-.9.9-.9 2.1s1 2.5 1.1 2.6c.1.2 2 3 4.8 4.2.7.3 1.2.5 1.6.6.7.2 1.3.2 1.8.1.5-.1 1.7-.7 1.9-1.3.2-.6.2-1.2.2-1.3-.1-.1-.3-.2-.6-.3Z"/><path d="M12 2a10 10 0 0 0-8.6 15L2 22l5.2-1.4A10 10 0 1 0 12 2Zm0 18a8 8 0 0 1-4.1-1.1l-.3-.2-3.1.8.8-3-.2-.3A8 8 0 1 1 12 20Z"/></svg>
          </a>
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

function setupMarquee() {
  const marqueeTrack = document.getElementById('marqueeTrack');
  if (marqueeTrack) {
    marqueeTrack.innerHTML += marqueeTrack.innerHTML;
  }
}

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

function setupCatalog(catalog) {
  if (reduceMotion) {
    document.getElementById('statTotal').textContent = catalog.length + '+';
  } else {
    setTimeout(() => countUp(document.getElementById('statTotal'), catalog.length, '+'), 300);
  }

  const categories = ['All', ...Array.from(new Set(catalog.map(p => p.category))).sort()];
  let activeCategory = 'All';
  let searchTerm = '';

  const chipRow = document.getElementById('chipRow');
  chipRow.innerHTML = categories.map(c =>
    `<button class="chip${c === 'All' ? ' active' : ''}" data-cat="${c}" style="--chip-color:${categoryColors[c] || 'var(--navy)'}">${c}</button>`
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

function setupFaq() {
  document.querySelectorAll('.faq-item').forEach(item => {
    const q = item.querySelector('.faq-q');
    const a = item.querySelector('.faq-a');
    q.addEventListener('click', () => {
      const isOpen = item.classList.contains('open');
      document.querySelectorAll('.faq-item.open').forEach(other => {
        other.classList.remove('open');
        other.querySelector('.faq-a').style.maxHeight = null;
      });
      if (!isOpen) {
        item.classList.add('open');
        a.style.maxHeight = a.scrollHeight + 'px';
      }
    });
  });
}

function setupScrollReveal() {
  const revealEls = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('in');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 });
    revealEls.forEach((el) => io.observe(el));
  } else {
    revealEls.forEach((el) => el.classList.add('in'));
  }
}

async function init() {
  const [featured, catalog] = await Promise.all([
    fetch('assets/data/featured.json').then(r => r.json()),
    fetch('assets/data/catalog.json').then(r => r.json()),
  ]);

  renderFeatured(featured);
  setupTilt();
  setupMarquee();
  setupCatalog(catalog);
  setupFaq();
  setupScrollReveal();
}

init();
