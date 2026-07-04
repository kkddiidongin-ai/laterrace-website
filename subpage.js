/* ============================================================
   SUBPAGE COMMON JS
   — Room tabs, Image sliders, Reveal animations
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {

  /* ── 1. ROOM TABS ── */
  const tabs = document.querySelectorAll('.sp-rooms__tab');
  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      // Deactivate all tabs
      tabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');

      // Hide all rooms
      document.querySelectorAll('.sp-room').forEach(r => r.classList.add('hidden'));

      // Show target room
      const target = document.getElementById(tab.dataset.room);
      if (target) {
        target.classList.remove('hidden');
        // Reset slider
        const slides = target.querySelector('.sp-room__slides');
        if (slides) slides.style.transform = 'translateX(0)';
        const curr = target.querySelector('.sp-room__current');
        if (curr) curr.textContent = '1';
      }
    });
  });

  /* ── 2. IMAGE SLIDERS ── */
  document.querySelectorAll('.sp-room__slider').forEach(slider => {
    const slides = slider.querySelector('.sp-room__slides');
    const imgs = slider.querySelectorAll('.sp-room__slide');
    const prevBtn = slider.querySelector('.sp-room__prev');
    const nextBtn = slider.querySelector('.sp-room__next');
    const currEl = slider.querySelector('.sp-room__current');
    let current = 0;
    const total = imgs.length;

    function goTo(idx) {
      current = (idx + total) % total;
      slides.style.transform = `translateX(-${current * 100}%)`;
      if (currEl) currEl.textContent = current + 1;
    }

    if (prevBtn) prevBtn.addEventListener('click', () => goTo(current - 1));
    if (nextBtn) nextBtn.addEventListener('click', () => goTo(current + 1));

    // Touch swipe
    let startX = 0;
    slider.addEventListener('touchstart', e => { startX = e.touches[0].clientX; }, { passive: true });
    slider.addEventListener('touchend', e => {
      const diff = startX - e.changedTouches[0].clientX;
      if (Math.abs(diff) > 40) goTo(diff > 0 ? current + 1 : current - 1);
    });
  });

  /* ── 3. REVEAL ANIMATIONS ── */
  const revealEls = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 });
    revealEls.forEach(el => observer.observe(el));
  } else {
    revealEls.forEach(el => el.classList.add('visible'));
  }

  /* ── 4. MOBILE MENU ── */
  const hamburger = document.getElementById('hamburgerBtn');
  const mobileMenu = document.getElementById('mobileMenu');
  const mobileClose = document.getElementById('mobileClose');

  if (hamburger && mobileMenu) {
    hamburger.addEventListener('click', () => {
      mobileMenu.classList.add('open');
      document.body.style.overflow = 'hidden';
    });
  }
  if (mobileClose && mobileMenu) {
    mobileClose.addEventListener('click', () => {
      mobileMenu.classList.remove('open');
      document.body.style.overflow = '';
    });
  }

  /* ── 5. NAVBAR SCROLL EFFECT ── */
  // Subpages always show scrolled navbar — no change needed
  // But still handle scroll for shadow
  const navbar = document.getElementById('navbar');
  if (navbar) {
    window.addEventListener('scroll', () => {
      if (window.scrollY > 10) {
        navbar.style.boxShadow = '0 2px 12px rgba(42,32,24,0.1)';
      } else {
        navbar.style.boxShadow = '0 1px 0 rgba(42,32,24,0.12)';
      }
    }, { passive: true });
  }

});
