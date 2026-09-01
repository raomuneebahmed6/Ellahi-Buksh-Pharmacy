// Shared chrome: nav, dropdown, footer categories, reveal, FAQ, year.
// Included on every page.

const WHATSAPP_NUMBER = '923200202202';
const waLink = (name) => `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent('Hi, I want to order: ' + name)}`;
const fmtPrice = (n) => 'Rs ' + Math.round(n).toLocaleString();
const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

const yearEl = document.getElementById('year');
if (yearEl) yearEl.textContent = new Date().getFullYear();

const hamburgerBtn = document.getElementById('hamburgerBtn');
const mainNav = document.getElementById('mainNav');
if (hamburgerBtn && mainNav) {
  hamburgerBtn.addEventListener('click', () => {
    mainNav.classList.toggle('open');
    hamburgerBtn.classList.toggle('open');
  });
}

// Re-runnable: only binds elements not already observed, so page scripts
// can call this again after inserting new .reveal content asynchronously
// (fixes a race where dynamically-rendered cards would stay invisible if
// this ran once, before the page's own fetch()-driven render finished).
function setupReveal() {
  const revealEls = document.querySelectorAll('.reveal:not([data-reveal-bound])');
  revealEls.forEach((el) => el.setAttribute('data-reveal-bound', ''));
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
window.setupReveal = setupReveal;

function setupFaq() {
  document.querySelectorAll('.faq-item').forEach(item => {
    const q = item.querySelector('.faq-q');
    const a = item.querySelector('.faq-a');
    if (!q || !a) return;
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

async function loadCategories() {
  const res = await fetch('assets/data/categories.json');
  return res.json();
}

function populateNavAndFooter(categories) {
  const navCatMenu = document.getElementById('navCatMenu');
  if (navCatMenu) {
    navCatMenu.innerHTML = categories.map(c =>
      `<a href="category.html?cat=${c.slug}">${c.label}<span class="dm-count">${c.count}</span></a>`
    ).join('');
  }

  const footerCategories = document.getElementById('footerCategories');
  if (footerCategories) {
    const heading = footerCategories.querySelector('h4');
    footerCategories.innerHTML = '';
    if (heading) footerCategories.appendChild(heading);
    else {
      const h = document.createElement('h4');
      h.textContent = 'Categories';
      footerCategories.appendChild(h);
    }
    categories.slice(0, 6).forEach(c => {
      const a = document.createElement('a');
      a.href = `category.html?cat=${c.slug}`;
      a.textContent = c.label;
      footerCategories.appendChild(a);
    });
  }
}

async function initChrome() {
  try {
    const categories = await loadCategories();
    populateNavAndFooter(categories);
  } catch (e) {
    console.error('Failed to load categories', e);
  }
  setupFaq();
  setupReveal();
}

initChrome();
