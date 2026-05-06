/* ============================================================
   LA TERRACE RESORT GROUP — SCRIPT.JS
   Vanilla JS — No frameworks
   ============================================================ */

'use strict';

/* ── DOM Ready ── */
document.addEventListener('DOMContentLoaded', () => {
  initNavbar();
  initMobileMenu();
  initHeroSlideshow();
  initHeroVolume();
  initScrollReveal();
  initBookingDates();
  initDiningScroll();
  initSmoothScroll();
  initParallax();
  initLangSwitcher();
  initBookingNights();
});

/* ============================================================
   1. NAVBAR — transparent → opaque on scroll
============================================================ */
function initNavbar() {
  const navbar = document.getElementById('navbar');
  if (!navbar) return;

  const SCROLL_THRESHOLD = 80;

  function updateNavbar() {
    if (window.scrollY > SCROLL_THRESHOLD) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  }

  window.addEventListener('scroll', updateNavbar, { passive: true });
  updateNavbar(); // run on load
}

/* ============================================================
   2. MOBILE MENU
============================================================ */
function initMobileMenu() {
  const hamburgerBtn      = document.getElementById('hamburgerBtn');
  const heroHamburgerBtn  = document.getElementById('heroHamburgerBtn'); // mobile hero bar
  const mobileMenu        = document.getElementById('mobileMenu');
  const mobileClose       = document.getElementById('mobileClose');
  const mobileLinks       = document.querySelectorAll('.navbar__mobile-link, .mobile-menu__link');

  if (!mobileMenu) return;

  // Create overlay
  const overlay = document.createElement('div');
  overlay.className = 'menu-overlay';
  document.body.appendChild(overlay);

  function openMenu() {
    mobileMenu.classList.add('open');
    overlay.classList.add('visible');
    document.body.style.overflow = 'hidden';
  }

  function closeMenu() {
    mobileMenu.classList.remove('open');
    overlay.classList.remove('visible');
    document.body.style.overflow = '';
  }

  // Desktop hamburger
  if (hamburgerBtn) hamburgerBtn.addEventListener('click', openMenu);
  // Mobile hero bar hamburger
  if (heroHamburgerBtn) heroHamburgerBtn.addEventListener('click', openMenu);

  if (mobileClose) mobileClose.addEventListener('click', closeMenu);
  overlay.addEventListener('click', closeMenu);

  mobileLinks.forEach(link => {
    link.addEventListener('click', closeMenu);
  });

  // Close on Escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && mobileMenu.classList.contains('open')) {
      closeMenu();
    }
  });
}

/* ============================================================
   2-B. HERO SLIDESHOW — auto-advance every 5s
============================================================ */
function initHeroSlideshow() {
  const heroVideo = document.getElementById('heroVideo');
  const heroSlideshow = document.getElementById('heroSlideshow');
  const slides = document.querySelectorAll('.hero__slide');

  // Try to autoplay video; if it fails, show slideshow fallback
  if (heroVideo) {
    const playPromise = heroVideo.play();
    if (playPromise !== undefined) {
      playPromise.catch(() => {
        // Video autoplay blocked — show slideshow instead
        heroVideo.style.display = 'none';
        if (heroSlideshow) heroSlideshow.style.display = 'block';
        startSlideshow();
      });
    }
  } else if (heroSlideshow) {
    heroSlideshow.style.display = 'block';
    startSlideshow();
  }

  function startSlideshow() {
    if (!slides.length) return;
    let current = 0;
    function nextSlide() {
      slides[current].classList.remove('active');
      current = (current + 1) % slides.length;
      slides[current].classList.add('active');
    }
    setInterval(nextSlide, 5000);
  }
}

/* ============================================================
   3. HERO VIDEO VOLUME TOGGLE (YouTube iframe)
============================================================ */
function initHeroVolume() {
  const volumeBtn  = document.getElementById('volumeBtn');
  const volIconOff = document.getElementById('volIconOff');
  const volIconOn  = document.getElementById('volIconOn');
  const heroVideo  = document.getElementById('heroVideo');

  if (!volumeBtn) return;

  let isMuted = true;

  volumeBtn.addEventListener('click', () => {
    isMuted = !isMuted;

    // Toggle icons
    if (volIconOff) volIconOff.classList.toggle('hidden', !isMuted);
    if (volIconOn)  volIconOn.classList.toggle('hidden', isMuted);

    // Control HTML5 video element
    if (heroVideo) {
      heroVideo.muted = isMuted;
      if (!isMuted) {
        heroVideo.play().catch(() => { heroVideo.muted = true; isMuted = true; });
      }
    }
  });
}

/* ============================================================
   4. SCROLL REVEAL — Intersection Observer
============================================================ */
function initScrollReveal() {
  const revealEls = document.querySelectorAll('.reveal');
  if (!revealEls.length) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    },
    {
      threshold: 0.12,
      rootMargin: '0px 0px -40px 0px'
    }
  );

  revealEls.forEach(el => observer.observe(el));
}

/* ============================================================
   5. BOOKING WIDGET — Auto-calculate nights
============================================================ */
function initBookingDates() {
  const dateInputs   = document.querySelectorAll('.booking__bar input[type="date"]');
  const checkinInput  = dateInputs[0];
  const checkoutInput = dateInputs[1];
  const nightsInput   = document.querySelector('.booking__bar input[type="number"]');

  if (!checkinInput || !checkoutInput || !nightsInput) return;

  // Set default dates (today + tomorrow)
  const today    = new Date();
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);

  const fmt = (d) => d.toISOString().split('T')[0];
  checkinInput.value  = fmt(today);
  checkoutInput.value = fmt(tomorrow);
  nightsInput.value   = 1;

  function updateNights() {
    const ci = new Date(checkinInput.value);
    const co = new Date(checkoutInput.value);
    if (ci && co && co > ci) {
      const diff = Math.round((co - ci) / (1000 * 60 * 60 * 24));
      nightsInput.value = diff;
    }
  }

  checkinInput.addEventListener('change', () => {
    // Ensure checkout is after checkin
    const ci = new Date(checkinInput.value);
    const co = new Date(checkoutInput.value);
    if (co <= ci) {
      const next = new Date(ci);
      next.setDate(next.getDate() + 1);
      checkoutInput.value = fmt(next);
    }
    updateNights();
  });

  checkoutInput.addEventListener('change', updateNights);
}

function initBookingNights() {
  const nightsInput   = document.querySelector('.booking__bar input[type="number"]');
  const allDateInputs = document.querySelectorAll('.booking__bar input[type="date"]');
  const checkinInput  = allDateInputs[0];
  const checkoutInput = allDateInputs[1];

  if (!nightsInput || !checkinInput || !checkoutInput) return;

  nightsInput.addEventListener('change', () => {
    const nights = parseInt(nightsInput.value, 10);
    if (nights > 0 && checkinInput.value) {
      const ci = new Date(checkinInput.value);
      ci.setDate(ci.getDate() + nights);
      checkoutInput.value = ci.toISOString().split('T')[0];
    }
  });
}

/* ============================================================
   6. DINING HORIZONTAL SCROLL — drag to scroll
============================================================ */
function initDiningScroll() {
  const scrollWrap = document.querySelector('.dining__scroll-wrap');
  if (!scrollWrap) return;

  let isDown   = false;
  let startX   = 0;
  let scrollLeft = 0;

  scrollWrap.addEventListener('mousedown', (e) => {
    isDown = true;
    scrollWrap.style.cursor = 'grabbing';
    startX = e.pageX - scrollWrap.offsetLeft;
    scrollLeft = scrollWrap.scrollLeft;
  });

  scrollWrap.addEventListener('mouseleave', () => {
    isDown = false;
    scrollWrap.style.cursor = '';
  });

  scrollWrap.addEventListener('mouseup', () => {
    isDown = false;
    scrollWrap.style.cursor = '';
  });

  scrollWrap.addEventListener('mousemove', (e) => {
    if (!isDown) return;
    e.preventDefault();
    const x    = e.pageX - scrollWrap.offsetLeft;
    const walk = (x - startX) * 1.5;
    scrollWrap.scrollLeft = scrollLeft - walk;
  });

  // Touch support
  let touchStartX = 0;
  let touchScrollLeft = 0;

  scrollWrap.addEventListener('touchstart', (e) => {
    touchStartX    = e.touches[0].pageX;
    touchScrollLeft = scrollWrap.scrollLeft;
  }, { passive: true });

  scrollWrap.addEventListener('touchmove', (e) => {
    const x    = e.touches[0].pageX;
    const walk = (touchStartX - x) * 1.2;
    scrollWrap.scrollLeft = touchScrollLeft + walk;
  }, { passive: true });
}

/* ============================================================
   7. SMOOTH SCROLL for nav anchor links
============================================================ */
function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      const href = anchor.getAttribute('href');
      if (href === '#') return;

      const target = document.querySelector(href);
      if (!target) return;

      e.preventDefault();

      const navbarHeight = document.getElementById('navbar')?.offsetHeight || 80;
      const targetTop    = target.getBoundingClientRect().top + window.scrollY - navbarHeight;

      window.scrollTo({
        top: targetTop,
        behavior: 'smooth'
      });
    });
  });
}

/* ============================================================
   8. SUBTLE PARALLAX on hero section
============================================================ */
function initParallax() {
  // Disabled in new Sun Siyam-style layout
  // The hero is a static layout, not a full-screen video
}

/* ============================================================
   9. LANGUAGE SWITCHER (UI toggle — content swap placeholder)
============================================================ */
function initLangSwitcher() {
  const langBtns = document.querySelectorAll('.navbar__lang-btn');

  langBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      // Remove active from siblings in same container
      const parent = btn.closest('.navbar__lang, .navbar__mobile-lang');
      if (parent) {
        parent.querySelectorAll('.navbar__lang-btn').forEach(b => b.classList.remove('active'));
      }
      btn.classList.add('active');

      const lang = btn.dataset.lang || btn.textContent.trim().toLowerCase();
      // Placeholder: In production, this would trigger i18n content swap
      console.log(`Language switched to: ${lang}`);
    });
  });
}

/* ============================================================
   10. BOOKING SEARCH BUTTON
============================================================ */
document.addEventListener('DOMContentLoaded', () => {
  const searchBtn = document.querySelector('.booking__btn');
  if (!searchBtn) return;

  searchBtn.addEventListener('click', () => {
    const brand    = document.querySelector('.booking__bar .booking__select')?.value;
    const checkin  = document.querySelector('.booking__bar input[type="date"]:first-of-type')?.value;
    const checkout = document.querySelector('.booking__bar input[type="date"]:last-of-type')?.value;
    const guests   = document.querySelectorAll('.booking__bar .booking__select')[1]?.value;

    if (!brand) {
      showBookingAlert('Please select a brand (Calacatta or laterrace).');
      return;
    }
    if (!checkin || !checkout) {
      showBookingAlert('Please select your check-in and check-out dates.');
      return;
    }

    // Placeholder: In production, redirect to booking engine
    console.log('Booking search:', { brand, checkin, checkout, guests });
    showBookingAlert(`Searching rooms for ${brand === 'calacatta' ? 'Calacatta Hotel & Resort' : 'laterrace Boutique Resort'}…\n\nBooking engine coming soon.`);
  });
});

function showBookingAlert(msg) {
  // Simple inline toast notification
  let toast = document.getElementById('bookingToast');
  if (!toast) {
    toast = document.createElement('div');
    toast.id = 'bookingToast';
    toast.style.cssText = `
      position: fixed;
      bottom: 32px;
      left: 50%;
      transform: translateX(-50%) translateY(20px);
      background: #2a2018;
      color: #f0ebe3;
      font-family: 'Jost', sans-serif;
      font-size: 0.82rem;
      letter-spacing: 0.04em;
      padding: 16px 28px;
      border-left: 3px solid #9a8060;
      z-index: 9999;
      opacity: 0;
      transition: opacity 0.3s ease, transform 0.3s ease;
      max-width: 400px;
      text-align: center;
      white-space: pre-line;
      box-shadow: 0 8px 32px rgba(0,0,0,0.3);
    `;
    document.body.appendChild(toast);
  }

  toast.textContent = msg;
  toast.style.opacity = '1';
  toast.style.transform = 'translateX(-50%) translateY(0)';

  clearTimeout(toast._timeout);
  toast._timeout = setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateX(-50%) translateY(20px)';
  }, 3500);
}

/* ============================================================
   11. GALLERY ITEM HOVER EFFECT — subtle tilt
============================================================ */
document.addEventListener('DOMContentLoaded', () => {
  const galleryItems = document.querySelectorAll('.gallery__item');

  galleryItems.forEach(item => {
    item.addEventListener('mouseenter', () => {
      item.style.zIndex = '2';
    });
    item.addEventListener('mouseleave', () => {
      item.style.zIndex = '';
    });
  });
});

/* ============================================================
   12. STICKY BOOKING WIDGET on mobile scroll
============================================================ */
document.addEventListener('DOMContentLoaded', () => {
  if (!window.matchMedia('(max-width: 768px)').matches) return;

  const bookingSection = document.querySelector('.booking');
  if (!bookingSection) return;

  // Add sticky booking CTA button for mobile
  const stickyBook = document.createElement('a');
  stickyBook.href  = '#booking';
  stickyBook.className = 'sticky-book-btn';
  stickyBook.textContent = 'BOOK NOW';
  stickyBook.style.cssText = `
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    background: #2a2018;
    color: #f0ebe3;
    font-family: 'Jost', sans-serif;
    font-size: 0.78rem;
    font-weight: 600;
    letter-spacing: 0.2em;
    text-transform: uppercase;
    text-align: center;
    padding: 18px;
    z-index: 900;
    display: none;
    transition: background 0.3s ease;
  `;

  document.body.appendChild(stickyBook);

  const heroSection = document.querySelector('.hero');

  const stickyObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        // Show sticky button when hero is out of view
        stickyBook.style.display = entry.isIntersecting ? 'none' : 'block';
      });
    },
    { threshold: 0 }
  );

  if (heroSection) stickyObserver.observe(heroSection);
});

/* ============================================================
   13. SCROLL PROGRESS INDICATOR (subtle top bar)
============================================================ */
document.addEventListener('DOMContentLoaded', () => {
  const progressBar = document.createElement('div');
  progressBar.style.cssText = `
    position: fixed;
    top: 0;
    left: 0;
    height: 2px;
    background: linear-gradient(to right, #9a8060, #2a2018);
    z-index: 2000;
    width: 0%;
    transition: width 0.1s linear;
    pointer-events: none;
  `;
  document.body.appendChild(progressBar);

  window.addEventListener('scroll', () => {
    const scrollTop    = window.scrollY;
    const docHeight    = document.documentElement.scrollHeight - window.innerHeight;
    const scrollPercent = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
    progressBar.style.width = `${scrollPercent}%`;
  }, { passive: true });
});

/* ============================================================
   14. OFFER CARD — image zoom on hover (CSS handles it,
       JS adds class for additional effects)
============================================================ */
document.addEventListener('DOMContentLoaded', () => {
  const offerCards = document.querySelectorAll('.offer-card, .brand-card, .dining-card');

  offerCards.forEach(card => {
    card.addEventListener('mouseenter', () => {
      card.classList.add('hovered');
    });
    card.addEventListener('mouseleave', () => {
      card.classList.remove('hovered');
    });
  });
});

/* ============================================================
   15. HERO SCROLL ARROW — hide when scrolled past hero
============================================================ */
document.addEventListener('DOMContentLoaded', () => {
  const scrollArrow = document.querySelector('.hero__scroll-arrow');
  if (!scrollArrow) return;

  window.addEventListener('scroll', () => {
    if (window.scrollY > 100) {
      scrollArrow.style.opacity = '0';
      scrollArrow.style.pointerEvents = 'none';
    } else {
      scrollArrow.style.opacity = '';
      scrollArrow.style.pointerEvents = '';
    }
  }, { passive: true });
});
