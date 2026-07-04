/* ============================================================
   SUMMERLAND PAGE JS — 소노 oceanWorld 메뉴 구조 적용
   섹션 ID: sl-operation / sl-guide / sl-price / sl-access /
             sl-map / sl-attraction / sl-dining / sl-about /
             sl-notice
============================================================ */

(function () {
  'use strict';

  /* ── 1. Hero 로딩 애니메이션 ── */
  const hero = document.querySelector('.sl-hero');
  if (hero) {
    setTimeout(() => hero.classList.add('loaded'), 100);
  }

  /* ── 2. Reveal 애니메이션 (IntersectionObserver) ── */
  const reveals = document.querySelectorAll('.sl-reveal');
  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const siblings = entry.target.parentElement
            ? Array.from(entry.target.parentElement.querySelectorAll('.sl-reveal'))
            : [];
          const idx = siblings.indexOf(entry.target);
          const delay = Math.min(idx * 80, 320);
          setTimeout(() => {
            entry.target.classList.add('visible');
          }, delay);
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 });
    reveals.forEach(el => observer.observe(el));
  } else {
    reveals.forEach(el => el.classList.add('visible'));
  }

  /* ── 3. 서브 네비게이션 활성화 (스크롤 위치 기반) ── */
  const subnavItems = document.querySelectorAll('.sl-subnav__item');
  const sectionIds = [
    'sl-operation', 'sl-guide', 'sl-price', 'sl-access',
    'sl-map', 'sl-attraction', 'sl-dining', 'sl-about', 'sl-notice'
  ];
  const sections = sectionIds.map(id => document.getElementById(id)).filter(Boolean);

  function updateSubnav() {
    const navbar = document.getElementById('sl-navbar');
    const subnav = document.getElementById('sl-subnav');
    const navH = navbar ? navbar.offsetHeight : 0;
    const subH = subnav ? subnav.offsetHeight : 0;
    const offset = navH + subH + 24;
    const scrollY = window.scrollY + offset;
    let current = '';
    sections.forEach(sec => {
      if (sec.offsetTop <= scrollY) current = sec.id;
    });
    subnavItems.forEach(item => {
      const t = item.getAttribute('data-target');
      item.classList.toggle('sl-subnav__item--active', t === current);
    });
  }
  window.addEventListener('scroll', updateSubnav, { passive: true });
  updateSubnav();

  /* ── 4. 서브 네비 클릭 → 스무스 스크롤 ── */
  subnavItems.forEach(item => {
    item.addEventListener('click', (e) => {
      const href = item.getAttribute('href');
      if (href && href.startsWith('#')) {
        e.preventDefault();
        const target = document.querySelector(href);
        if (target) {
          const navbar = document.getElementById('sl-navbar');
          const subnav = document.getElementById('sl-subnav');
          const navH = navbar ? navbar.offsetHeight : 0;
          const subH = subnav ? subnav.offsetHeight : 0;
          const offset = navH + subH + 8;
          const top = target.getBoundingClientRect().top + window.scrollY - offset;
          window.scrollTo({ top, behavior: 'smooth' });
        }
      }
    });
  });

  /* ── 5. 서브네비 top 위치 = 네비바 높이 ── */
  function setSubnavTop() {
    const navbar = document.getElementById('sl-navbar');
    const subnav = document.getElementById('sl-subnav');
    if (subnav && navbar) {
      subnav.style.top = navbar.offsetHeight + 'px';
    }
  }
  setSubnavTop();
  window.addEventListener('resize', setSubnavTop);

  /* ── 6. 모바일 메뉴 ── */
  const hamburger = document.getElementById('sl-hamburgerBtn');
  const mobileMenu = document.getElementById('sl-mobileMenu');
  const mobileClose = document.getElementById('sl-mobileClose');

  if (hamburger && mobileMenu) {
    hamburger.addEventListener('click', () => {
      mobileMenu.classList.toggle('open');
      document.body.style.overflow = mobileMenu.classList.contains('open') ? 'hidden' : '';
    });
  }
  if (mobileClose && mobileMenu) {
    mobileClose.addEventListener('click', () => {
      mobileMenu.classList.remove('open');
      document.body.style.overflow = '';
    });
  }
  if (mobileMenu) {
    mobileMenu.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        mobileMenu.classList.remove('open');
        document.body.style.overflow = '';
      });
    });
  }

  /* ── 7. 다이닝 카드 드래그 스크롤 ── */
  const diningCards = document.querySelector('.sl-dining__cards');
  if (diningCards) {
    let isDown = false, startX, scrollLeft;
    diningCards.addEventListener('mousedown', (e) => {
      isDown = true;
      startX = e.pageX - diningCards.offsetLeft;
      scrollLeft = diningCards.scrollLeft;
    });
    diningCards.addEventListener('mouseleave', () => { isDown = false; });
    diningCards.addEventListener('mouseup', () => { isDown = false; });
    diningCards.addEventListener('mousemove', (e) => {
      if (!isDown) return;
      e.preventDefault();
      const x = e.pageX - diningCards.offsetLeft;
      const walk = (x - startX) * 1.5;
      diningCards.scrollLeft = scrollLeft - walk;
    });
  }

  /* ── 8. 네비바 스크롤 시 배경 처리 ── */
  const navbar = document.getElementById('sl-navbar');
  if (navbar) {
    function updateNavbar() {
      navbar.classList.toggle('scrolled', window.scrollY > 60);
    }
    window.addEventListener('scroll', updateNavbar, { passive: true });
    updateNavbar();
  }

})();
