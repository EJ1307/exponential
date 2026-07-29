/* ─── Smooth scroll for all anchors ─── */
'use strict';

// ─── Navbar scroll effect ───────────────────────────
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  if (window.scrollY > 60) {
    navbar.classList.add('scrolled');
  } else {
    navbar.classList.remove('scrolled');
  }
}, { passive: true });

// ─── Hamburger menu ─────────────────────────────────
const hamburger = document.getElementById('hamburger');
const navLinks = document.getElementById('navLinks');

hamburger.addEventListener('click', () => {
  navLinks.classList.toggle('open');
  hamburger.classList.toggle('active');
});

navLinks.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    navLinks.classList.remove('open');
    hamburger.classList.remove('active');
  });
});

// ─── Hero slideshow ─────────────────────────────────
const slides = document.querySelectorAll('.hero-slide');
const dots = document.querySelectorAll('.dot');
let currentSlide = 0;
let slideInterval;

function goToSlide(index) {
  slides[currentSlide].classList.remove('active');
  dots[currentSlide].classList.remove('active');
  currentSlide = (index + slides.length) % slides.length;
  slides[currentSlide].classList.add('active');
  dots[currentSlide].classList.add('active');
}

function nextSlide() {
  goToSlide(currentSlide + 1);
}

function startSlideshow() {
  slideInterval = setInterval(nextSlide, 5000);
}

function stopSlideshow() {
  clearInterval(slideInterval);
}

dots.forEach(dot => {
  dot.addEventListener('click', () => {
    const idx = parseInt(dot.getAttribute('data-slide'), 10);
    stopSlideshow();
    goToSlide(idx);
    startSlideshow();
  });
});

startSlideshow();

// ─── Stats counter animation ─────────────────────────
const statNumbers = document.querySelectorAll('.stat-number');

function animateCounter(el) {
  const target = parseInt(el.getAttribute('data-target'), 10);
  const duration = 1800;
  const start = performance.now();

  function update(now) {
    const elapsed = now - start;
    const progress = Math.min(elapsed / duration, 1);
    // Ease out cubic
    const eased = 1 - Math.pow(1 - progress, 3);
    el.textContent = Math.floor(eased * target);
    if (progress < 1) {
      requestAnimationFrame(update);
    } else {
      el.textContent = target;
    }
  }

  requestAnimationFrame(update);
}

// ─── Intersection Observer for animations ───────────
const observerOptions = {
  threshold: 0.15,
  rootMargin: '0px 0px -60px 0px'
};

// Fade-up observer
const fadeObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      fadeObserver.unobserve(entry.target);
    }
  });
}, observerOptions);

// Stats counter observer
const statsObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      animateCounter(entry.target);
      statsObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.5 });

// Apply fade-up class to elements
const animatedElements = [
  ...document.querySelectorAll('.about-content'),
  ...document.querySelectorAll('.about-images'),
  ...document.querySelectorAll('.service-card'),
  ...document.querySelectorAll('.why-card'),
  ...document.querySelectorAll('.section-header'),
  ...document.querySelectorAll('.cta-content'),
  ...document.querySelectorAll('.cta-card'),
];

animatedElements.forEach((el, i) => {
  el.classList.add('fade-up');
  // stagger children of same parent
  const siblings = el.parentElement.querySelectorAll('.service-card, .why-card, .gallery-item');
  if (siblings.length > 1) {
    const idx = Array.from(siblings).indexOf(el);
    if (idx > 0 && idx <= 5) {
      el.classList.add(`fade-up-delay-${idx}`);
    }
  }
  fadeObserver.observe(el);
});

statNumbers.forEach(n => statsObserver.observe(n));

// ─── Active nav link highlight on scroll ─────────────
const sections = document.querySelectorAll('section[id]');
const navLinkEls = document.querySelectorAll('.nav-link:not(.nav-cta)');

const sectionObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const id = entry.target.getAttribute('id');
      navLinkEls.forEach(link => {
        link.classList.remove('active-link');
        if (link.getAttribute('href') === `#${id}`) {
          link.classList.add('active-link');
        }
      });
    }
  });
}, { threshold: 0.4 });

sections.forEach(sec => sectionObserver.observe(sec));

// Active link style
const style = document.createElement('style');
style.textContent = `.nav-link.active-link { color: var(--orange) !important; background: transparent !important; border-bottom: 2px solid var(--orange) !important; }`;
document.head.appendChild(style);



// ─── Parallax on hero bg ─────────────────────────────
window.addEventListener('scroll', () => {
  const scrolled = window.scrollY;
  const heroBg = document.querySelector('.hero-bg');
  if (heroBg && scrolled < window.innerHeight) {
    heroBg.style.transform = `translateY(${scrolled * 0.35}px)`;
  }
}, { passive: true });

// ─── Testimonials Slider (Autoplay) ───────────────────
const testiCards = document.querySelectorAll('.testi-card');
let currentTesti = 0;

if (testiCards.length > 0) {
  function showTesti(index) {
    testiCards[currentTesti].classList.remove('active');
    currentTesti = (index + testiCards.length) % testiCards.length;
    testiCards[currentTesti].classList.add('active');
  }

  // Auto-rotate every 5 seconds
  setInterval(() => {
    showTesti(currentTesti + 1);
  }, 5000);
}

