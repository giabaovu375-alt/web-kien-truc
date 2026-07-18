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
});
