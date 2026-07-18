document.addEventListener('DOMContentLoaded', () => {
  const navToggle = document.getElementById('navToggle');
  const mainNav = document.getElementById('mainNav');
  if (navToggle && mainNav) {
    navToggle.addEventListener('click', () => mainNav.classList.toggle('open'));
    mainNav.querySelectorAll('a').forEach(a =>
      a.addEventListener('click', () => mainNav.classList.remove('open'))
    );
  }

  // Highlight current page in nav
  const links = document.querySelectorAll('nav a[data-page]');
  const current = document.body.getAttribute('data-page');
  links.forEach(a => {
    if (a.getAttribute('data-page') === current) a.classList.add('current');
  });
});
