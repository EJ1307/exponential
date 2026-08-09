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

if (slides.length > 0) {
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
}

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

// ─── Project Gallery Lightbox ─────────────────────────
const lightboxModal = document.getElementById('lightboxModal');
const lightboxImg = document.getElementById('lightboxImg');
const lightboxCaption = document.getElementById('lightboxCaption');
const lightboxClose = document.getElementById('lightboxClose');
const lightboxPrev = document.getElementById('lightboxPrev');
const lightboxNext = document.getElementById('lightboxNext');

if (lightboxModal) {
  let currentImgs = [];
  let activeIndex = 0;

  function showImage(index) {
    if (currentImgs.length === 0) return;
    activeIndex = (index + currentImgs.length) % currentImgs.length;
    const img = currentImgs[activeIndex];
    lightboxImg.src = img.getAttribute('src');
    lightboxImg.alt = img.getAttribute('alt') || 'Gallery photo';
    if (lightboxCaption) {
      lightboxCaption.textContent =
        (img.getAttribute('alt') || '') + `  (${activeIndex + 1}/${currentImgs.length})`;
    }
  }

  function openProject(card) {
    currentImgs = Array.from(card.querySelectorAll('.project-images img'));
    if (currentImgs.length === 0) return;
    showImage(0);
    lightboxModal.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  function closeLightbox() {
    lightboxModal.classList.remove('active');
    document.body.style.overflow = '';
  }

  document.querySelectorAll('.project-card').forEach((card) => {
    card.addEventListener('click', () => openProject(card));
  });

  if (lightboxClose) lightboxClose.addEventListener('click', closeLightbox);
  lightboxModal.addEventListener('click', (e) => {
    if (e.target === lightboxModal) closeLightbox();
  });
  if (lightboxPrev) {
    lightboxPrev.addEventListener('click', (e) => {
      e.stopPropagation();
      showImage(activeIndex - 1);
    });
  }
  if (lightboxNext) {
    lightboxNext.addEventListener('click', (e) => {
      e.stopPropagation();
      showImage(activeIndex + 1);
    });
  }

  document.addEventListener('keydown', (e) => {
    if (!lightboxModal.classList.contains('active')) return;
    if (e.key === 'Escape') closeLightbox();
    if (e.key === 'ArrowLeft') showImage(activeIndex - 1);
    if (e.key === 'ArrowRight') showImage(activeIndex + 1);
  });
}


