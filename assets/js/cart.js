// Lightweight client-side cart (no backend) — persisted to localStorage,
// with the only real "checkout" a static site can offer honestly: one
// consolidated WhatsApp message listing everything in the cart.
// Loaded on every page, after nav.js.

const CART_KEY = 'ebsonsCart';

function getCart() {
  try {
    const raw = localStorage.getItem(CART_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch (e) {
    return [];
  }
}

function saveCart(cart) {
  try {
    localStorage.setItem(CART_KEY, JSON.stringify(cart));
  } catch (e) {
    // Storage unavailable (private mode, quota) — cart just won't persist across reloads.
  }
}

function cartCount(cart) {
  return cart.reduce((n, item) => n + item.qty, 0);
}

function cartTotal(cart) {
  return cart.reduce((sum, item) => sum + item.qty * item.price, 0);
}

function addToCart({ title, vendor, price }) {
  const cart = getCart();
  const existing = cart.find(i => i.title === title);
  if (existing) existing.qty += 1;
  else cart.push({ title, vendor, price, qty: 1 });
  saveCart(cart);
  renderCart();
  pulseBadge();
}

function changeQty(title, delta) {
  const cart = getCart();
  const item = cart.find(i => i.title === title);
  if (!item) return;
  item.qty += delta;
  const next = item.qty > 0 ? cart : cart.filter(i => i.title !== title);
  saveCart(next);
  renderCart();
}

function removeFromCart(title) {
  saveCart(getCart().filter(i => i.title !== title));
  renderCart();
}

function pulseBadge() {
  const badge = document.getElementById('cartBadge');
  if (!badge) return;
  badge.classList.remove('pop');
  void badge.offsetWidth; // restart animation
  badge.classList.add('pop');
}

function buildWhatsAppOrderLink(cart) {
  const lines = cart.map((i, idx) => `${idx + 1}. ${i.title} x${i.qty} — Rs ${(i.qty * i.price).toLocaleString()}`);
  const text = `Hi, I'd like to order:\n${lines.join('\n')}\n\nTotal: Rs ${cartTotal(cart).toLocaleString()}`;
  return `https://wa.me/923200202202?text=${encodeURIComponent(text)}`;
}

function renderCart() {
  const cart = getCart();
  const badge = document.getElementById('cartBadge');
  if (badge) {
    const count = cartCount(cart);
    badge.textContent = count;
    badge.hidden = count === 0;
  }

  const body = document.getElementById('cartDrawerBody');
  const footer = document.getElementById('cartDrawerFooter');
  if (!body || !footer) return;

  if (cart.length === 0) {
    body.innerHTML = `
      <div class="cart-empty">
        <p>Your cart is empty.</p>
        <span>Add something from the shelf to get started.</span>
      </div>
    `;
    footer.innerHTML = '';
    return;
  }

  body.innerHTML = cart.map(item => `
    <div class="cart-line">
      <div class="cart-line-info">
        <div class="cart-line-name">${item.title}</div>
        <div class="cart-line-vendor">${item.vendor}</div>
      </div>
      <div class="cart-line-controls">
        <button class="qty-btn" data-qty="-1" data-title="${item.title.replace(/"/g, '&quot;')}" aria-label="Decrease quantity">−</button>
        <span class="qty-val">${item.qty}</span>
        <button class="qty-btn" data-qty="1" data-title="${item.title.replace(/"/g, '&quot;')}" aria-label="Increase quantity">+</button>
      </div>
      <div class="cart-line-price">Rs ${(item.qty * item.price).toLocaleString()}</div>
      <button class="cart-line-remove" data-remove="${item.title.replace(/"/g, '&quot;')}" aria-label="Remove ${item.title}">×</button>
    </div>
  `).join('');

  footer.innerHTML = `
    <div class="cart-total-row">
      <span>Total</span>
      <span class="cart-total-value">Rs ${cartTotal(cart).toLocaleString()}</span>
    </div>
    <a class="btn btn-red" style="width:100%; justify-content:center;" href="${buildWhatsAppOrderLink(cart)}" target="_blank" rel="noopener noreferrer">
      Checkout on WhatsApp →
    </a>
  `;
}

function openDrawer() {
  document.getElementById('cartDrawer')?.classList.add('open');
  document.getElementById('cartBackdrop')?.classList.add('open');
  document.body.style.overflow = 'hidden';
}

function closeDrawer() {
  document.getElementById('cartDrawer')?.classList.remove('open');
  document.getElementById('cartBackdrop')?.classList.remove('open');
  document.body.style.overflow = '';
}

function buildCartUI() {
  const iconBtn = document.querySelector('.icon-btn');
  if (iconBtn && !document.getElementById('cartBtn')) {
    const cartBtn = document.createElement('button');
    cartBtn.id = 'cartBtn';
    cartBtn.className = 'cart-btn';
    cartBtn.setAttribute('aria-label', 'View cart');
    cartBtn.innerHTML = `${uiIconSvg('cart', 19)}<span class="cart-badge" id="cartBadge" hidden>0</span>`;
    iconBtn.insertAdjacentElement('beforebegin', cartBtn);
    cartBtn.addEventListener('click', openDrawer);
  }

  if (!document.getElementById('cartDrawer')) {
    const backdrop = document.createElement('div');
    backdrop.id = 'cartBackdrop';
    backdrop.className = 'cart-backdrop';
    backdrop.addEventListener('click', closeDrawer);

    const drawer = document.createElement('aside');
    drawer.id = 'cartDrawer';
    drawer.className = 'cart-drawer';
    drawer.innerHTML = `
      <div class="cart-drawer-head">
        <h3>Your cart</h3>
        <button class="cart-close" id="cartCloseBtn" aria-label="Close cart">×</button>
      </div>
      <div class="cart-drawer-body" id="cartDrawerBody"></div>
      <div class="cart-drawer-footer" id="cartDrawerFooter"></div>
    `;

    document.body.appendChild(backdrop);
    document.body.appendChild(drawer);
    document.getElementById('cartCloseBtn').addEventListener('click', closeDrawer);
  }
}

function wireAddToCartButtons() {
  document.addEventListener('click', (e) => {
    const addBtn = e.target.closest('[data-add-to-cart]');
    if (addBtn) {
      addToCart({
        title: addBtn.dataset.title,
        vendor: addBtn.dataset.vendor,
        price: parseFloat(addBtn.dataset.price),
      });
      const label = addBtn.querySelector('.atc-label');
      const icon = addBtn.querySelector('.atc-icon, svg');
      const originalIcon = icon ? icon.outerHTML : '';
      const iconClass = icon ? icon.getAttribute('class') || '' : '';
      addBtn.classList.add('added');
      if (label) label.textContent = 'Added';
      if (icon) icon.outerHTML = uiIconSvg('check', icon.getAttribute('width') || 15, iconClass);
      setTimeout(() => {
        addBtn.classList.remove('added');
        if (label) label.textContent = 'Add to cart';
        const currentIcon = addBtn.querySelector('svg');
        if (currentIcon && originalIcon) currentIcon.outerHTML = originalIcon;
      }, 1200);
      return;
    }

    const qtyBtn = e.target.closest('.qty-btn');
    if (qtyBtn) {
      changeQty(qtyBtn.dataset.title, parseInt(qtyBtn.dataset.qty, 10));
      return;
    }

    const removeBtn = e.target.closest('.cart-line-remove');
    if (removeBtn) {
      removeFromCart(removeBtn.dataset.remove);
    }
  });
}

function initCart() {
  buildCartUI();
  wireAddToCartButtons();
  renderCart();
}

initCart();
