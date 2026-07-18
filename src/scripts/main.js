document.addEventListener('DOMContentLoaded', () => {

  // ---- Nút liên hệ nhanh: trỏ tới form liên hệ (tự tính đường dẫn theo vị trí trang) ----
  // Khi có số điện thoại / Instagram thật, thay 2 dòng href bên dưới là xong,
  // không cần sửa gì khác (nút này tự chèn trên MỌI trang).
  (function initQuickContact() {
    const inSubfolder = location.pathname.includes('/src/page/');
    const contactHref = inSubfolder ? 'contact.html' : 'src/page/contact.html';

    // TODO: điền số điện thoại thật của bạn vào đây khi có
    const PHONE_HREF = ''; // vd: 'tel:0912345678'
    // TODO: điền link Instagram/Zalo thật khi có (để trống thì nút này sẽ ẩn)
    const SOCIAL_HREF = ''; // vd: 'https://instagram.com/ten_that'

    const wrap = document.createElement('div');
    wrap.className = 'quick-contact';

    let html = '';
    if (SOCIAL_HREF) {
      html += `
      <a class="qc-btn" href="${SOCIAL_HREF}" target="_blank" rel="noopener" aria-label="Nhắn Instagram">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><rect x="3" y="3" width="18" height="18" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.2" cy="6.8" r="1" fill="currentColor" stroke="none"/></svg>
      </a>`;
    }
    if (PHONE_HREF) {
      html += `
      <a class="qc-btn" href="${PHONE_HREF}" aria-label="Gọi điện thoại">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
      </a>`;
    }
    // Luôn có nút "Liên hệ" trỏ tới form trong site — đây là kênh chắc chắn hoạt động
    html += `
      <a class="qc-btn qc-primary" href="${contactHref}" aria-label="Gửi yêu cầu tư vấn">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><path d="M4 4h16v12H7l-3 3V4z"/></svg>
      </a>`;

    wrap.innerHTML = html;
    document.body.appendChild(wrap);
  })();

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
