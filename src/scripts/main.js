document.addEventListener('DOMContentLoaded', () => {
  const navToggle = document.getElementById('navToggle');
  const mainNav = document.getElementById('mainNav');
  const overlay = document.getElementById('navOverlay');

  function closeNav() {
    mainNav.classList.remove('open');
    navToggle.classList.remove('open');
    overlay.classList.remove('open');
    document.body.classList.remove('nav-locked');
  }
  function openNav() {
    mainNav.classList.add('open');
    navToggle.classList.add('open');
    overlay.classList.add('open');
    document.body.classList.add('nav-locked');
  }

  if (navToggle && mainNav && overlay) {
    navToggle.addEventListener('click', () => {
      mainNav.classList.contains('open') ? closeNav() : openNav();
    });
    overlay.addEventListener('click', closeNav);
    mainNav.querySelectorAll('a').forEach(a =>
      a.addEventListener('click', closeNav)
    );
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') closeNav();
    });
  }

  // Highlight current page in nav
  const links = document.querySelectorAll('nav a[data-page]');
  const current = document.body.getAttribute('data-page');
  links.forEach(a => {
    if (a.getAttribute('data-page') === current) a.classList.add('current');
  });

  // Simple scroll-reveal for elements marked .reveal
  const revealEls = document.querySelectorAll('.reveal');
  if (revealEls.length) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 });
    revealEls.forEach(el => io.observe(el));
  }

  // ---- Counter chạy số (áp cho phần tử có [data-counter]="50" v.v.) ----
  const counters = document.querySelectorAll('[data-counter]');
  if (counters.length) {
    const counterIO = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        const el = entry.target;
        const target = parseFloat(el.dataset.counter);
        const suffix = el.dataset.suffix || '';
        const duration = 1400;
        const start = performance.now();

        function tick(now) {
          const progress = Math.min((now - start) / duration, 1);
          const eased = 1 - Math.pow(1 - progress, 3); // ease-out cubic
          const value = Math.round(target * eased);
          el.textContent = value + suffix;
          if (progress < 1) requestAnimationFrame(tick);
        }
        requestAnimationFrame(tick);
        counterIO.unobserve(el);
      });
    }, { threshold: 0.5 });
    counters.forEach(el => counterIO.observe(el));
  }

  // ---- Ảnh fade-in mượt khi load xong (áp cho toàn bộ <img> trừ trong intro) ----
  document.querySelectorAll('img:not(.intro-img)').forEach(img => {
    if (img.complete) {
      img.classList.add('img-loaded');
    } else {
      img.classList.add('img-loading');
      img.addEventListener('load', () => img.classList.add('img-loaded'));
    }
  });

  // ---- Page transition: fade out khi rời trang qua link nội bộ ----
  const pageFade = document.createElement('div');
  pageFade.className = 'page-fade';
  document.body.appendChild(pageFade);

  document.querySelectorAll('a[href]').forEach(link => {
    const href = link.getAttribute('href');
    const isInternal = href &&
      !href.startsWith('http') &&
      !href.startsWith('#') &&
      !href.startsWith('mailto:') &&
      !href.startsWith('tel:') &&
      link.target !== '_blank';

    if (!isInternal) return;

    link.addEventListener('click', (e) => {
      e.preventDefault();
      pageFade.classList.add('active');
      setTimeout(() => { window.location.href = href; }, 320);
    });
  });
});
