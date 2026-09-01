// Shared line-icon set, one per product category (by slug), plus a couple
// of UI icons (cart, check). Used on the home category grid and the
// category page hero/cards so a real icon replaces the flat monogram.

const CATEGORY_ICONS = {
  'medicines': `<path d="M4.5 12.5 12.5 4.5a5 5 0 0 1 7 7l-8 8a5 5 0 0 1-7-7Z"/><path d="m8.5 8.5 7 7"/>`,
  'skincare': `<path d="M12 3s6 6.7 6 11a6 6 0 0 1-12 0c0-4.3 6-11 6-11Z"/>`,
  'vitamins-supplements': `<path d="M5 19c8 0 13-5 13-13V4h-2C8 4 5 9 5 17v2Z"/><path d="M5 19c2-4.5 5-7.5 9-9.5"/>`,
  'devices': `<path d="M3 12h3.5l2-6.5L13 18l2-6h6"/>`,
  'hair-care': `<path d="M4.5 5h15v3.2h-15z"/><path d="M7 8.2V19M10.5 8.2V19M14 8.2V19M17.5 8.2V19"/>`,
  'mother-baby': `<rect x="8" y="9" width="8" height="12" rx="2.2"/><path d="M9 9V6.2a3 3 0 0 1 6 0V9"/><path d="M8 13.3h8M8 16.6h8"/>`,
  'diabetic-care': `<path d="m19 5-3-3-2.1 2.1 1 1-7.6 7.6-1.9 4.9 4.9-1.9 7.6-7.6 1 1Z"/><path d="m13.5 6.5 3 3"/>`,
};

const UI_ICONS = {
  cart: `<circle cx="9" cy="20" r="1.4"/><circle cx="17" cy="20" r="1.4"/><path d="M2.5 3h2l2.2 11.4a2 2 0 0 0 2 1.6h7.6a2 2 0 0 0 2-1.6L20 7H6"/>`,
  check: `<path d="m5 12.5 4.5 4.5L19 7"/>`,
  plus: `<path d="M10 4v12M4 10h12"/>`,
};

function categoryIconSvg(slug, size = 26) {
  const inner = CATEGORY_ICONS[slug] || CATEGORY_ICONS['medicines'];
  return `<svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round">${inner}</svg>`;
}

function uiIconSvg(name, size = 18, className = '') {
  const inner = UI_ICONS[name] || '';
  const cls = className ? ` class="${className}"` : '';
  return `<svg${cls} width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">${inner}</svg>`;
}
