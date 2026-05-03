/* ============================================================
   DHARMAN HANDBAGS — script.js
   All public pages — reads live data from Supabase
   Falls back to defaults if Supabase is unavailable
   ============================================================ */

'use strict';

/* ────────────────────────────────────────────────────────────
   DEFAULT DATA (fallback if Supabase has no data yet)
   ──────────────────────────────────────────────────────────── */
const DEFAULT_PRODUCTS = [
  { id:1, name:'Amira Signature Tote', price:89, category:'Tote Bags', badge:'Bestseller', badge_class:'', description:'A refined everyday tote in supple full-grain leather. Structured silhouette, polished gold hardware, and generous interior space — designed for the modern woman who commands every room.', stars:5, reviews:48, colors:['#1E1E1E','#6D071A','#D4AF37','#B76E79'], image:'https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=600&q=80', stock:42, sold:48 },
  { id:2, name:'Ruby Crossbody', price:65, category:'Crossbody', badge:'New', badge_class:'new', description:'A compact, versatile crossbody with adjustable strap and secure zip closure. Ideal for evenings out or effortless day-to-night transitions.', stars:5, reviews:31, colors:['#6D071A','#1E1E1E','#E9DDCF'], image:'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=600&q=80', stock:28, sold:31 },
  { id:3, name:'Midnight Luxe', price:110, category:'Evening Bags', badge:'Premium', badge_class:'', description:'Our crown jewel — an evening clutch of exceptional refinement. Pleated satin exterior with hand-stitched gold trim, magnetic closure, and silk-lined interior.', stars:5, reviews:22, colors:['#1E1E1E','#6D071A','#D4AF37'], image:'https://images.unsplash.com/photo-1575032617751-6ddec2089882?w=600&q=80', stock:15, sold:22 },
  { id:4, name:'Scarlet Muse', price:95, category:'Tote Bags', badge:'Bestseller', badge_class:'', description:'Bold, structured, unapologetically feminine. The Scarlet Muse tote brings Italian-inspired design together with contemporary practicality.', stars:5, reviews:39, colors:['#6D071A','#B76E79','#1E1E1E'], image:'https://images.unsplash.com/photo-1566150905458-1bf1fc113f0d?w=600&q=80', stock:33, sold:39 },
  { id:5, name:'Luna Carry', price:78, category:'Everyday Essentials', badge:'New', badge_class:'new', description:'Thoughtfully designed for daily life. The Luna Carry features a soft pebbled exterior, internal organisation pockets, and a detachable coin purse.', stars:5, reviews:27, colors:['#E9DDCF','#D4AF37','#6D071A'], image:'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=600&q=80', stock:5, sold:27 },
  { id:6, name:'Noir Grace', price:99, category:'Crossbody', badge:'Premium', badge_class:'', description:'Where minimalism meets luxury. The Noir Grace crossbody is crafted in nappa leather with a brushed silver chain — sleek, timeless, effortlessly elegant.', stars:5, reviews:34, colors:['#1E1E1E','#B76E79','#D4AF37'], image:'https://images.unsplash.com/photo-1600493572824-56cfcbfaf5f3?w=600&q=80', stock:20, sold:34 },
];

const DEFAULT_CONTENT = {
  heroLine1:'Carry Confidence.',
  heroLine2:'Define Elegance.',
  heroSub:'Luxury handbags crafted for women who move with purpose.',
  heroBtnPrimary:'Shop Collection',
  heroBtnSecondary:'Discover New Arrivals',
  heroImage:'https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=1200&q=85',
  aboutTitle:'Where Purpose Meets Beauty',
  aboutPara1:'DHARMAN HANDBAGS was created to redefine elegance through timeless craftsmanship. Born from a deep admiration for women who lead with intention, every stitch and contour is deliberate.',
  aboutPara2:'Each design reflects confidence, ambition, and modern femininity — qualities that transcend seasons and trends.',
  aboutClosing:'We create handbags that carry more than essentials — they carry presence.',
  newsletterTitle:'Join the Collection',
  newsletterSub:'Receive exclusive launches and 10% off your first order.',
  contactEmail:'hello@dharmanhandbags.com',
  contactPhone:'+1 (800) 000-0000',
  contactHours:'Mon–Fri, 9am–6pm EST',
  socialIG:'#', socialTT:'#', socialPT:'#',
  marqueeText:'Free Shipping on Orders Over $100 · New Season Collection · Crafted with Premium Leather · Limited Edition Styles',
  reviews:[
    { text:'The craftsmanship is exceptional. Every detail speaks to genuine quality.', author:'Sarah M.', product:'Amira Signature Tote' },
    { text:'Elegant, functional, and beautifully designed — transitions from office to dinner seamlessly.', author:'Layla A.', product:'Ruby Crossbody' },
    { text:'Looks and feels truly luxurious. Everyone wanted to know where it was from.', author:'Amira K.', product:'Midnight Luxe' },
  ],
};

/* ────────────────────────────────────────────────────────────
   LIVE DATA — fetched from Supabase on page load
   ──────────────────────────────────────────────────────────── */
let PRODUCTS = DEFAULT_PRODUCTS.slice();
let SITE_CONTENT = Object.assign({}, DEFAULT_CONTENT);

async function loadLiveData() {
  try {
    // Load products from Supabase
    const liveProducts = await getProducts();
    if (liveProducts && liveProducts.length > 0) {
      // Normalize column names (Supabase uses snake_case)
      PRODUCTS = liveProducts.map(p => ({
        id:          p.id,
        name:        p.name,
        price:       p.price,
        category:    p.category,
        badge:       p.badge || '',
        badge_class: p.badge_class || '',
        badgeClass:  p.badge_class || '',
        description: p.description || p.desc || '',
        desc:        p.description || p.desc || '',
        stars:       p.stars || 5,
        reviews:     p.reviews || 0,
        colors:      Array.isArray(p.colors) ? p.colors : ['#1E1E1E'],
        image:       p.image || DEFAULT_PRODUCTS[0].image,
        images:      Array.isArray(p.images) ? p.images : [p.image || DEFAULT_PRODUCTS[0].image],
        stock:       p.stock || 0,
        sold:        p.sold || 0,
      }));
    }

    // Load site content from Supabase
    const liveContent = await getContent();
    if (liveContent && Object.keys(liveContent).length > 0) {
      SITE_CONTENT = Object.assign({}, DEFAULT_CONTENT, liveContent);
    }
  } catch(e) {
    console.warn('Using default data:', e);
  }

  // Now apply everything to the page
  applyLiveContent();
  window.PRODUCTS = PRODUCTS;

  // Page-specific init after data loads
  if (document.querySelector('.products-grid'))      initHomePage();
  if (document.querySelector('.shop-products-grid')) initShopPage();
  if (document.querySelector('.product-page'))       initProductPage();
}

/* ────────────────────────────────────────────────────────────
   APPLY LIVE CONTENT TO PAGE
   ──────────────────────────────────────────────────────────── */
function applyLiveContent() {
  const c = SITE_CONTENT;

  // Hero
  const heroTitle = document.querySelector('.hero-title');
  if (heroTitle) heroTitle.innerHTML = (c.heroLine1||'') + '<em>' + (c.heroLine2||'') + '</em>';
  const heroSub = document.querySelector('.hero-sub');
  if (heroSub) heroSub.textContent = c.heroSub || '';
  const heroCtas = document.querySelectorAll('.hero-ctas a');
  if (heroCtas[0] && c.heroBtnPrimary) heroCtas[0].textContent = c.heroBtnPrimary;
  if (heroCtas[1] && c.heroBtnSecondary) heroCtas[1].textContent = c.heroBtnSecondary;
  const heroImg = document.querySelector('.hero-image-wrap img');
  if (heroImg && c.heroImage) heroImg.src = c.heroImage;

  // Story
  const aboutTitle = document.querySelector('.story-content .section-title');
  if (aboutTitle && c.aboutTitle) {
    const words = c.aboutTitle.split(' ');
    const last = words.pop();
    aboutTitle.innerHTML = words.join(' ') + '<br><em>' + last + '</em>';
  }
  const storyParas = document.querySelectorAll('.story-content p');
  if (storyParas[0] && c.aboutPara1) storyParas[0].textContent = c.aboutPara1;
  if (storyParas[1] && c.aboutPara2) storyParas[1].textContent = c.aboutPara2;
  if (storyParas[2] && c.aboutClosing) storyParas[2].innerHTML = c.aboutClosing;

  // Newsletter
  const nlTitle = document.querySelector('.newsletter-title');
  if (nlTitle && c.newsletterTitle) nlTitle.textContent = c.newsletterTitle;
  const nlSub = document.querySelector('.newsletter-sub');
  if (nlSub && c.newsletterSub) nlSub.textContent = c.newsletterSub;

  // Contact
  document.querySelectorAll('a[href^="mailto:"]').forEach(el => {
    if (c.contactEmail) { el.href = 'mailto:' + c.contactEmail; el.textContent = c.contactEmail; }
  });

  // Socials
  document.querySelectorAll('.social-link[aria-label="Instagram"]').forEach(el => { if (c.socialIG && c.socialIG !== '#') el.href = c.socialIG; });
  document.querySelectorAll('.social-link[aria-label="TikTok"]').forEach(el => { if (c.socialTT && c.socialTT !== '#') el.href = c.socialTT; });
  document.querySelectorAll('.social-link[aria-label="Pinterest"]').forEach(el => { if (c.socialPT && c.socialPT !== '#') el.href = c.socialPT; });

  // Marquee
  const marqueeInner = document.querySelector('.marquee-inner');
  if (marqueeInner && c.marqueeText) {
    const items = c.marqueeText.split('·').map(s => s.trim()).filter(Boolean);
    const html = items.map(t => '<span>' + t + '</span><span class="dot">✦</span>').join('');
    marqueeInner.innerHTML = html + html;
  }

  // Reviews
  const reviewsGrid = document.querySelector('.reviews-grid');
  if (reviewsGrid && c.reviews && c.reviews.length) {
    const initials = name => (name||'A').split(' ').map(n=>n[0]).join('').toUpperCase();
    reviewsGrid.innerHTML = c.reviews.map(r => `
      <div class="review-card fade-in">
        <div class="review-quote">"</div>
        <div class="review-stars">★★★★★</div>
        <p class="review-text">${r.text}</p>
        <div class="review-author">
          <div class="review-avatar">${initials(r.author)}</div>
          <div>
            <div class="review-author-name">${r.author}</div>
            <div class="review-verified">✦ Verified Purchase${r.product ? ' · ' + r.product : ''}</div>
          </div>
        </div>
      </div>`).join('');
  }
}

/* ────────────────────────────────────────────────────────────
   CART
   ──────────────────────────────────────────────────────────── */
let cart = [];
try { cart = JSON.parse(localStorage.getItem('dharman_cart') || '[]'); } catch(e) {}

function saveCart() {
  try { localStorage.setItem('dharman_cart', JSON.stringify(cart)); } catch(e) {}
}

function addToCart(productId, qty, color) {
  qty = qty || 1;
  const product = PRODUCTS.find(p => p.id == productId);
  if (!product) return;
  const chosenColor = color || (product.colors && product.colors[0]) || '#1E1E1E';
  const existing = cart.find(i => i.id == productId && i.color === chosenColor);
  if (existing) { existing.qty += qty; } else { cart.push({ id: productId, qty, color: chosenColor }); }
  saveCart();
  updateCartUI();
  showToast('<i class="fas fa-check-circle"></i> ' + product.name + ' added to cart');
}

function removeFromCart(productId, color) {
  cart = cart.filter(i => !(i.id == productId && i.color === color));
  saveCart(); updateCartUI(); renderCartItems();
}

function updateCartQty(productId, color, delta) {
  const item = cart.find(i => i.id == productId && i.color === color);
  if (!item) return;
  item.qty = Math.max(1, item.qty + delta);
  saveCart(); updateCartUI(); renderCartItems();
}

function getCartTotal() {
  return cart.reduce((sum, item) => {
    const p = PRODUCTS.find(p => p.id == item.id);
    return sum + (p ? p.price * item.qty : 0);
  }, 0);
}

function getCartCount() { return cart.reduce((s, i) => s + i.qty, 0); }

function updateCartUI() {
  const count = getCartCount();
  document.querySelectorAll('.cart-count').forEach(el => {
    el.textContent = count;
    el.style.display = count > 0 ? 'flex' : 'none';
  });
}

function renderCartItems() {
  const itemsEl = document.querySelector('.cart-items');
  if (!itemsEl) return;
  if (cart.length === 0) {
    itemsEl.innerHTML = '<div class="cart-empty"><div class="cart-empty-icon">🛍️</div><h3>Your cart is empty</h3><p>Add some beautiful pieces to get started.</p></div>';
    updateCartTotals(); return;
  }
  itemsEl.innerHTML = cart.map(item => {
    const p = PRODUCTS.find(x => x.id == item.id);
    if (!p) return '';
    return `<div class="cart-item">
      <div class="cart-item-img"><img src="${p.image}" alt="${p.name}" loading="lazy"></div>
      <div class="cart-item-info">
        <div class="cart-item-name">${p.name}</div>
        <div class="cart-item-color" style="display:flex;align-items:center;gap:6px;">
          <span style="width:10px;height:10px;border-radius:50%;background:${item.color};display:inline-block;border:1px solid rgba(0,0,0,0.15)"></span>Color selected
        </div>
        <div class="cart-item-qty">
          <button class="qty-btn" onclick="updateCartQty(${item.id},'${item.color}',-1)">−</button>
          <span class="qty-num">${item.qty}</span>
          <button class="qty-btn" onclick="updateCartQty(${item.id},'${item.color}',1)">+</button>
        </div>
      </div>
      <div style="display:flex;flex-direction:column;align-items:flex-end;gap:8px;">
        <div class="cart-item-price">$${(p.price * item.qty).toFixed(2)}</div>
        <button class="cart-item-remove" onclick="removeFromCart(${item.id},'${item.color}')"><i class="fas fa-times"></i> Remove</button>
      </div>
    </div>`;
  }).join('');
  updateCartTotals();
}

function updateCartTotals() {
  const total = getCartTotal();
  const shipping = total > 0 ? (total >= 100 ? 0 : 9.99) : 0;
  const grand = total + shipping;
  document.querySelectorAll('.cart-subtotal-val').forEach(el => el.textContent = '$' + total.toFixed(2));
  document.querySelectorAll('.cart-shipping-val').forEach(el => el.textContent = shipping === 0 ? 'Free' : '$' + shipping.toFixed(2));
  document.querySelectorAll('.cart-total-val').forEach(el => el.textContent = '$' + grand.toFixed(2));
}

/* ────────────────────────────────────────────────────────────
   NAVBAR
   ──────────────────────────────────────────────────────────── */
function initNavbar() {
  const navbar = document.querySelector('.navbar');
  if (!navbar) return;
  window.addEventListener('scroll', () => navbar.classList.toggle('scrolled', window.scrollY > 40), { passive: true });

  const hamburger = document.querySelector('.hamburger');
  const mobileNav = document.querySelector('.mobile-nav');
  if (hamburger && mobileNav) {
    hamburger.addEventListener('click', () => {
      hamburger.classList.toggle('open');
      mobileNav.classList.toggle('open');
      document.body.style.overflow = mobileNav.classList.contains('open') ? 'hidden' : '';
    });
    mobileNav.querySelectorAll('a').forEach(l => l.addEventListener('click', () => {
      hamburger.classList.remove('open'); mobileNav.classList.remove('open'); document.body.style.overflow = '';
    }));
  }

  const searchToggle = document.querySelector('.search-toggle');
  const searchBar = document.querySelector('.search-bar');
  const searchClose = document.querySelector('.search-close');
  if (searchToggle && searchBar) {
    searchToggle.addEventListener('click', () => { searchBar.classList.toggle('open'); if (searchBar.classList.contains('open')) searchBar.querySelector('input')?.focus(); });
    searchClose?.addEventListener('click', () => searchBar.classList.remove('open'));
    searchBar.querySelector('input')?.addEventListener('keydown', e => {
      if (e.key === 'Escape') searchBar.classList.remove('open');
      if (e.key === 'Enter' && e.target.value.trim()) window.location.href = 'shop.html?q=' + encodeURIComponent(e.target.value.trim());
    });
  }

  document.querySelectorAll('.cart-toggle').forEach(btn => btn.addEventListener('click', toggleCart));
  document.querySelector('.cart-overlay')?.addEventListener('click', closeCart);
  document.querySelector('.cart-close')?.addEventListener('click', closeCart);
  document.querySelector('.cart-continue')?.addEventListener('click', closeCart);
}

function toggleCart() {
  const overlay = document.querySelector('.cart-overlay');
  const panel = document.querySelector('.cart-panel');
  overlay?.classList.toggle('open');
  panel?.classList.toggle('open');
  document.body.style.overflow = panel?.classList.contains('open') ? 'hidden' : '';
  if (panel?.classList.contains('open')) renderCartItems();
}

function closeCart() {
  document.querySelector('.cart-overlay')?.classList.remove('open');
  document.querySelector('.cart-panel')?.classList.remove('open');
  document.body.style.overflow = '';
}

/* ────────────────────────────────────────────────────────────
   SCROLL ANIMATIONS
   ──────────────────────────────────────────────────────────── */
function initScrollAnimations() {
  const observer = new IntersectionObserver(entries => entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('visible'); }), { threshold: 0.12, rootMargin: '0px 0px -48px 0px' });
  document.querySelectorAll('.fade-in').forEach(el => observer.observe(el));
}

/* ────────────────────────────────────────────────────────────
   TOAST
   ──────────────────────────────────────────────────────────── */
function showToast(html) {
  let toast = document.querySelector('.toast');
  if (!toast) { toast = document.createElement('div'); toast.className = 'toast'; document.body.appendChild(toast); }
  toast.innerHTML = html;
  toast.classList.add('show');
  clearTimeout(toast._timer);
  toast._timer = setTimeout(() => toast.classList.remove('show'), 3000);
}

/* ────────────────────────────────────────────────────────────
   PRODUCT CARD
   ──────────────────────────────────────────────────────────── */
function renderProductCard(product, delay) {
  delay = delay || 0;
  const desc = product.description || product.desc || '';
  const badge = product.badge || '';
  const badgeClass = product.badge_class || product.badgeClass || '';
  return `<div class="product-card fade-in fade-in-delay-${delay}" data-category="${product.category}" data-price="${product.price}" data-id="${product.id}">
    <div class="product-image-wrap">
      <img src="${product.image}" alt="${product.name}" loading="lazy">
      ${badge ? `<span class="product-badge ${badgeClass}">${badge}</span>` : ''}
      <div class="product-actions-float">
        <button class="product-action-btn" title="Wishlist" onclick="showToast('<i class=\\'fas fa-heart\\'></i> Saved to wishlist')"><i class="far fa-heart"></i></button>
        <button class="product-action-btn" title="Quick view" onclick="window.location.href='product.html?id=${product.id}'"><i class="far fa-eye"></i></button>
      </div>
    </div>
    <div class="product-info">
      <div class="product-category">${product.category}</div>
      <div class="product-name">${product.name}</div>
      <div class="product-desc">${desc}</div>
      <div class="product-meta">
        <div class="product-price">$${product.price}</div>
        <div class="product-stars">${'★'.repeat(product.stars||5)}</div>
      </div>
      <div class="product-card-ctas">
        <a href="product.html?id=${product.id}" class="btn-view">View Product</a>
        <button class="btn-cart" onclick="handleAddToCart(this,${product.id})">Add to Cart</button>
      </div>
    </div>
  </div>`;
}

function handleAddToCart(btn, productId) {
  addToCart(productId, 1, null);
  btn.classList.add('added'); btn.textContent = 'Added ✓';
  setTimeout(() => { btn.classList.remove('added'); btn.textContent = 'Add to Cart'; }, 2200);
}

/* ────────────────────────────────────────────────────────────
   CAROUSEL
   ──────────────────────────────────────────────────────────── */
function initCarousel() {
  const track = document.querySelector('.carousel-track');
  const dotsContainer = document.querySelector('.carousel-dots');
  const prevBtn = document.querySelector('.carousel-prev');
  const nextBtn = document.querySelector('.carousel-next');
  if (!track) return;
  const bestSellers = PRODUCTS.slice().sort((a,b) => (b.reviews||0)-(a.reviews||0)).slice(0,4);
  track.innerHTML = bestSellers.map(p => `
    <div class="carousel-slide">
      <div class="carousel-img"><img src="${p.image}" alt="${p.name}" loading="lazy"></div>
      <div class="carousel-info">
        <div class="carousel-name">${p.name}</div>
        <div class="carousel-price">$${p.price}</div>
        <button class="carousel-btn" onclick="addToCart(${p.id},1,null)">Add to Cart</button>
      </div>
    </div>`).join('');
  if (dotsContainer) {
    dotsContainer.innerHTML = bestSellers.map((_,i) => `<div class="carousel-dot ${i===0?'active':''}" data-index="${i}"></div>`).join('');
    dotsContainer.querySelectorAll('.carousel-dot').forEach(dot => dot.addEventListener('click', () => goToSlide(+dot.dataset.index)));
  }
  let current = 0; const total = bestSellers.length;
  let autoPlay = setInterval(() => goToSlide((current+1)%total), 4500);
  function goToSlide(idx) {
    current = idx;
    const slide = track.querySelector('.carousel-slide');
    if (!slide) return;
    track.style.transform = `translateX(-${current*(slide.offsetWidth+24)}px)`;
    dotsContainer?.querySelectorAll('.carousel-dot').forEach((d,i) => d.classList.toggle('active', i===current));
    clearInterval(autoPlay); autoPlay = setInterval(() => goToSlide((current+1)%total), 4500);
  }
  prevBtn?.addEventListener('click', () => goToSlide((current-1+total)%total));
  nextBtn?.addEventListener('click', () => goToSlide((current+1)%total));
  window.addEventListener('resize', () => goToSlide(current));
}

/* ────────────────────────────────────────────────────────────
   HOME PAGE
   ──────────────────────────────────────────────────────────── */
function initHomePage() {
  const grid = document.querySelector('.products-grid');
  if (!grid) return;
  grid.innerHTML = PRODUCTS.map((p,i) => renderProductCard(p,(i%6)+1)).join('');
  initScrollAnimations();
  initCarousel();
}

/* ────────────────────────────────────────────────────────────
   SHOP PAGE
   ──────────────────────────────────────────────────────────── */
function initShopPage() {
  const grid = document.querySelector('.shop-products-grid');
  if (!grid) return;
  let currentCategory = 'All', currentSearch = '', currentSort = 'featured';
  const params = new URLSearchParams(window.location.search);
  if (params.get('q')) currentSearch = params.get('q');
  if (params.get('cat')) currentCategory = params.get('cat');
  const searchInput = document.querySelector('.shop-search input');
  if (searchInput && currentSearch) searchInput.value = currentSearch;

  const categories = [...new Set(PRODUCTS.map(p => p.category))];
  const filterContainer = document.querySelector('.shop-filters');
  if (filterContainer) {
    filterContainer.querySelectorAll('.filter-btn:not([data-filter="All"])').forEach(b => b.remove());
    categories.forEach(cat => {
      const btn = document.createElement('button');
      btn.className = 'filter-btn'; btn.dataset.filter = cat; btn.textContent = cat;
      filterContainer.appendChild(btn);
    });
    filterContainer.querySelectorAll('.filter-btn').forEach(btn => {
      if (currentCategory === btn.dataset.filter) btn.classList.add('active');
      btn.addEventListener('click', () => {
        filterContainer.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active'); currentCategory = btn.dataset.filter; renderShop();
      });
    });
  }

  function renderShop() {
    let filtered = PRODUCTS.slice();
    if (currentCategory !== 'All') filtered = filtered.filter(p => p.category === currentCategory);
    if (currentSearch) { const q = currentSearch.toLowerCase(); filtered = filtered.filter(p => p.name.toLowerCase().includes(q) || p.category.toLowerCase().includes(q) || (p.description||p.desc||'').toLowerCase().includes(q)); }
    if (currentSort === 'price-asc') filtered.sort((a,b) => a.price-b.price);
    if (currentSort === 'price-desc') filtered.sort((a,b) => b.price-a.price);
    if (currentSort === 'popular') filtered.sort((a,b) => (b.reviews||0)-(a.reviews||0));
    const resultsEl = document.querySelector('.shop-results');
    if (resultsEl) resultsEl.textContent = filtered.length + ' products';
    grid.innerHTML = filtered.length === 0
      ? '<div class="no-results">No products found. <a href="shop.html" style="color:var(--burgundy)">Clear filters</a></div>'
      : filtered.map((p,i) => renderProductCard(p,(i%6)+1)).join('');
    initScrollAnimations();
  }

  document.querySelector('.shop-search input')?.addEventListener('input', e => { currentSearch = e.target.value; renderShop(); });
  document.querySelector('.shop-sort')?.addEventListener('change', e => { currentSort = e.target.value; renderShop(); });
  renderShop();
}

/* ────────────────────────────────────────────────────────────
   PRODUCT PAGE
   ──────────────────────────────────────────────────────────── */
function initProductPage() {
  const params = new URLSearchParams(window.location.search);
  const id = parseInt(params.get('id')) || 1;
  const product = PRODUCTS.find(p => p.id == id) || PRODUCTS[0];
  if (!product) return;

  document.title = product.name + ' — DHARMAN HANDBAGS';
  const imgs = (product.images && product.images.length > 0) ? product.images : [product.image, product.image, product.image, product.image];

  const mainImg = document.querySelector('.gallery-main-img');
  if (mainImg) mainImg.src = imgs[0];

  const thumbsContainer = document.querySelector('.gallery-thumbs');
  if (thumbsContainer) {
    thumbsContainer.innerHTML = imgs.map((img,i) => `<div class="gallery-thumb ${i===0?'active':''}" data-src="${img}"><img src="${img}" alt="${product.name}" loading="lazy"></div>`).join('');
    thumbsContainer.querySelectorAll('.gallery-thumb').forEach(thumb => thumb.addEventListener('click', () => {
      thumbsContainer.querySelectorAll('.gallery-thumb').forEach(t => t.classList.remove('active'));
      thumb.classList.add('active'); if (mainImg) mainImg.src = thumb.dataset.src;
    }));
  }

  const galleryWrap = document.querySelector('.gallery-img-wrap');
  const lightbox = document.querySelector('.lightbox');
  const lightboxImg = document.querySelector('.lightbox img');
  galleryWrap?.addEventListener('click', () => { if (lightbox && lightboxImg && mainImg) { lightboxImg.src = mainImg.src; lightbox.classList.add('open'); document.body.style.overflow = 'hidden'; } });
  document.querySelector('.lightbox-close')?.addEventListener('click', () => { lightbox?.classList.remove('open'); document.body.style.overflow = ''; });
  lightbox?.addEventListener('click', e => { if (e.target === lightbox) { lightbox.classList.remove('open'); document.body.style.overflow = ''; } });

  const setEl = (sel, val) => { const el = document.querySelector(sel); if (el) el.textContent = val; };
  setEl('.product-detail-name', product.name);
  setEl('.product-detail-category', product.category);
  setEl('.product-detail-price', '$' + product.price);
  setEl('.product-detail-desc', product.description || product.desc || '');
  setEl('.product-detail-stars', '★'.repeat(product.stars||5));
  setEl('.product-detail-rating-num', (product.reviews||0) + ' reviews');

  const colorContainer = document.querySelector('.color-options');
  let selectedColor = (product.colors && product.colors[0]) || '#1E1E1E';
  if (colorContainer && product.colors) {
    colorContainer.innerHTML = product.colors.map((c,i) => `<div class="color-swatch ${i===0?'active':''}" data-color="${c}" style="background:${c};" title="${c}"></div>`).join('');
    colorContainer.querySelectorAll('.color-swatch').forEach(swatch => swatch.addEventListener('click', () => {
      colorContainer.querySelectorAll('.color-swatch').forEach(s => s.classList.remove('active'));
      swatch.classList.add('active'); selectedColor = swatch.dataset.color;
    }));
  }

  const qtyInput = document.querySelector('.qty-selector input');
  document.querySelector('.qty-minus')?.addEventListener('click', () => { if (qtyInput) qtyInput.value = Math.max(1, parseInt(qtyInput.value)-1); });
  document.querySelector('.qty-plus')?.addEventListener('click',  () => { if (qtyInput) qtyInput.value = Math.min(10, parseInt(qtyInput.value)+1); });

  document.querySelector('.btn-add-cart')?.addEventListener('click', function() {
    addToCart(product.id, parseInt(qtyInput?.value||1), selectedColor);
    this.innerHTML = '<i class="fas fa-check"></i> Added to Cart';
    setTimeout(() => this.innerHTML = '<i class="fas fa-shopping-bag"></i> Add to Cart', 2200);
  });
  document.querySelector('.btn-buy-now')?.addEventListener('click', () => { addToCart(product.id, parseInt(qtyInput?.value||1), selectedColor); toggleCart(); });

  document.querySelectorAll('.accordion-header').forEach(header => {
    header.addEventListener('click', () => {
      const item = header.closest('.accordion-item');
      const wasOpen = item.classList.contains('open');
      document.querySelectorAll('.accordion-item').forEach(i => i.classList.remove('open'));
      if (!wasOpen) item.classList.add('open');
    });
  });
}

/* ────────────────────────────────────────────────────────────
   NEWSLETTER
   ──────────────────────────────────────────────────────────── */
function initNewsletter() {
  document.querySelectorAll('.newsletter-form').forEach(form => {
    form.addEventListener('submit', e => {
      e.preventDefault();
      const input = form.querySelector('input');
      if (input?.value) { showToast('<i class="fas fa-envelope"></i> Welcome! 10% off coupon sent.'); input.value = ''; }
    });
  });
}

/* ────────────────────────────────────────────────────────────
   INIT
   ──────────────────────────────────────────────────────────── */
document.addEventListener('DOMContentLoaded', () => {
  initNavbar();
  updateCartUI();
  initScrollAnimations();
  initNewsletter();

  // Expose globals
  window.addToCart = addToCart;
  window.handleAddToCart = handleAddToCart;
  window.updateCartQty = updateCartQty;
  window.removeFromCart = removeFromCart;
  window.toggleCart = toggleCart;
  window.closeCart = closeCart;
  window.showToast = showToast;
  window.renderProductCard = renderProductCard;
  window.initScrollAnimations = initScrollAnimations;
  window.PRODUCTS = PRODUCTS;

  // Load live data from Supabase then render
  loadLiveData();
});
