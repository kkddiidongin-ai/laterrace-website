/* ============================================================
   LATERRACE v2 — script.js
   ============================================================ */

const HLS_SRC = 'https://hls.midibus.kinxcdn.com/hls/ch_18f57400/197c018addb0ff99/v/playlist.m3u8';

document.addEventListener('DOMContentLoaded', () => {
  initNavbar();
  initMobileMenu();
  initHeroVideo();
  initResortsSlider();
  initOffersSlider();
});

/* ============================================================
   NAVBAR — transparent over hero, beige on scroll
   ============================================================ */
function initNavbar() {
  const navbar = document.getElementById('navbar');
  if (!navbar) return;

  function update() {
    if (window.scrollY > 60) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  }

  window.addEventListener('scroll', update, { passive: true });
  update();
}

/* ============================================================
   MOBILE MENU
   ============================================================ */
function initMobileMenu() {
  const hamburger = document.getElementById('hamburgerBtn');
  const menu = document.getElementById('mobileMenu');
  const overlay = document.getElementById('menuOverlay');
  const close = document.getElementById('mobileClose');

  if (!hamburger || !menu) return;

  function openMenu() {
    menu.classList.add('open');
    overlay.classList.add('open');
    document.body.style.overflow = 'hidden';
  }

  function closeMenu() {
    menu.classList.remove('open');
    overlay.classList.remove('open');
    document.body.style.overflow = '';
  }

  hamburger.addEventListener('click', openMenu);
  if (close) close.addEventListener('click', closeMenu);
  if (overlay) overlay.addEventListener('click', closeMenu);

  // Close on nav link click
  menu.querySelectorAll('.mobile-menu__link, .mobile-menu__join').forEach(link => {
    link.addEventListener('click', closeMenu);
  });
}

/* ============================================================
   HERO VIDEO — HLS.js streaming
   ============================================================ */
function initHeroVideo() {
  const video = document.getElementById('heroVideo');
  const volumeBtn = document.getElementById('volumeBtn');
  const volOff = document.getElementById('volIconOff');
  const volOn = document.getElementById('volIconOn');

  if (!video) return;

  // HLS.js
  if (Hls.isSupported()) {
    const hls = new Hls({
      startLevel: -1,
      maxBufferLength: 8,
      maxMaxBufferLength: 20,
      maxBufferSize: 20 * 1000 * 1000,
      enableWorker: true,
    });
    hls.loadSource(HLS_SRC);
    hls.attachMedia(video);
    hls.on(Hls.Events.MANIFEST_PARSED, () => {
      video.play().catch(() => {});
    });
    hls.on(Hls.Events.ERROR, (event, data) => {
      if (data.fatal) {
        console.warn('HLS fatal error:', data.type);
      }
    });
  } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
    // Safari native HLS
    video.src = HLS_SRC;
    video.play().catch(() => {});
  }

  // Volume toggle
  if (volumeBtn) {
    volumeBtn.addEventListener('click', () => {
      video.muted = !video.muted;
      if (video.muted) {
        volOff.classList.remove('hidden');
        volOn.classList.add('hidden');
      } else {
        volOff.classList.add('hidden');
        volOn.classList.remove('hidden');
      }
    });
  }
}

/* ============================================================
   RESORTS SLIDER
   ============================================================ */
function initResortsSlider() {
  const slider = document.getElementById('resortsSlider');
  const prevBtn = document.getElementById('resortsPrev');
  const nextBtn = document.getElementById('resortsNext');
  const filters = document.querySelectorAll('.resorts__filter');

  if (!slider) return;

  let currentIndex = 0;
  let visibleCards = [];

  function getCardsPerView() {
    if (window.innerWidth <= 768) return 1;
    if (window.innerWidth <= 1024) return 2;
    return 3;
  }

  function buildVisible(filter) {
    const allCards = Array.from(slider.querySelectorAll('.resort-card'));
    allCards.forEach(c => { c.style.display = ''; });

    if (filter === 'all') {
      visibleCards = allCards;
    } else {
      allCards.forEach(c => {
        if (c.dataset.collection !== filter) {
          c.style.display = 'none';
        }
      });
      visibleCards = allCards.filter(c => c.dataset.collection === filter);
    }
    currentIndex = 0;
    updateSlider();
  }

  function updateSlider() {
    const perView = getCardsPerView();
    const maxIndex = Math.max(0, visibleCards.length - perView);
    currentIndex = Math.min(currentIndex, maxIndex);

    // Calculate offset: find position of currentIndex-th visible card
    const allCards = Array.from(slider.querySelectorAll('.resort-card'));
    const visibleInDom = allCards.filter(c => c.style.display !== 'none');

    if (visibleInDom.length === 0) return;

    const gap = 20;
    const cardWidth = visibleInDom[0].offsetWidth;
    const offset = currentIndex * (cardWidth + gap);
    slider.style.transform = `translateX(-${offset}px)`;

    // Arrow visibility
    if (prevBtn) prevBtn.style.opacity = currentIndex === 0 ? '0.35' : '1';
    if (nextBtn) nextBtn.style.opacity = currentIndex >= maxIndex ? '0.35' : '1';
  }

  if (prevBtn) {
    prevBtn.addEventListener('click', () => {
      if (currentIndex > 0) { currentIndex--; updateSlider(); }
    });
  }

  if (nextBtn) {
    nextBtn.addEventListener('click', () => {
      const perView = getCardsPerView();
      const maxIndex = Math.max(0, visibleCards.length - perView);
      if (currentIndex < maxIndex) { currentIndex++; updateSlider(); }
    });
  }

  filters.forEach(f => {
    f.addEventListener('click', () => {
      filters.forEach(x => x.classList.remove('active'));
      f.classList.add('active');
      buildVisible(f.dataset.filter);
    });
  });

  window.addEventListener('resize', () => updateSlider(), { passive: true });

  buildVisible('all');
}

/* ============================================================
   OFFERS SLIDER
   ============================================================ */
function initOffersSlider() {
  const slider = document.getElementById('offersSlider');
  const prevBtn = document.getElementById('offersPrev');
  const nextBtn = document.getElementById('offersNext');

  if (!slider) return;

  let currentIndex = 0;

  function getCardsPerView() {
    if (window.innerWidth <= 768) return 1;
    return 2;
  }

  function getCards() {
    return Array.from(slider.querySelectorAll('.offer-card'));
  }

  function updateSlider() {
    const cards = getCards();
    const perView = getCardsPerView();
    const maxIndex = Math.max(0, cards.length - perView);
    currentIndex = Math.min(currentIndex, maxIndex);

    if (cards.length === 0) return;

    const gap = 24;
    const cardWidth = cards[0].offsetWidth;
    const offset = currentIndex * (cardWidth + gap);
    slider.style.transform = `translateX(-${offset}px)`;

    if (prevBtn) prevBtn.style.opacity = currentIndex === 0 ? '0.35' : '1';
    if (nextBtn) nextBtn.style.opacity = currentIndex >= maxIndex ? '0.35' : '1';
  }

  if (prevBtn) {
    prevBtn.addEventListener('click', () => {
      if (currentIndex > 0) { currentIndex--; updateSlider(); }
    });
  }

  if (nextBtn) {
    nextBtn.addEventListener('click', () => {
      const cards = getCards();
      const perView = getCardsPerView();
      const maxIndex = Math.max(0, cards.length - perView);
      if (currentIndex < maxIndex) { currentIndex++; updateSlider(); }
    });
  }

  window.addEventListener('resize', () => updateSlider(), { passive: true });

  updateSlider();
}
