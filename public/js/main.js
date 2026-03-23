// ================================================
// Toronto Balcony Cleaners - Main JS
// ================================================

document.addEventListener('DOMContentLoaded', () => {
  initNavScroll();
  initMobileMenu();
  initBeforeAfterSlider();
  initServiceToggle();
  initSmoothScroll();
  initFormValidation();
});

// ----- Nav scroll effect -----
function initNavScroll() {
  const nav = document.getElementById('main-nav');
  if (!nav) return;

  const observer = new IntersectionObserver(
    ([entry]) => {
      nav.classList.toggle('nav-scrolled', !entry.isIntersecting);
    },
    { threshold: 0.1 }
  );

  const hero = document.getElementById('hero');
  if (hero) observer.observe(hero);
}

// ----- Mobile hamburger menu -----
function initMobileMenu() {
  const btn = document.getElementById('mobile-menu-btn');
  const menu = document.getElementById('mobile-menu');
  if (!btn || !menu) return;

  const spans = btn.querySelectorAll('span');

  btn.addEventListener('click', () => {
    const isOpen = menu.classList.toggle('open');
    btn.setAttribute('aria-expanded', isOpen);

    // Animate hamburger lines
    spans[0].style.transform = isOpen ? 'rotate(45deg) translate(4px, 4px)' : '';
    spans[1].style.opacity = isOpen ? '0' : '1';
    spans[2].style.transform = isOpen ? 'rotate(-45deg) translate(4px, -4px)' : '';
  });

  // Close menu when a link is clicked
  menu.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      menu.classList.remove('open');
      btn.setAttribute('aria-expanded', 'false');
      spans[0].style.transform = '';
      spans[1].style.opacity = '1';
      spans[2].style.transform = '';
    });
  });
}

// ----- Before/After slider -----
function initBeforeAfterSlider() {
  const container = document.getElementById('before-after');
  const clip = document.getElementById('before-clip');
  const handle = document.getElementById('slider-handle');
  if (!container || !clip || !handle) return;

  let isDragging = false;

  function setPosition(x) {
    const rect = container.getBoundingClientRect();
    let pct = ((x - rect.left) / rect.width) * 100;
    pct = Math.max(2, Math.min(98, pct));
    clip.style.width = pct + '%';
    handle.style.left = pct + '%';
  }

  function onStart(e) {
    isDragging = true;
    e.preventDefault();
  }

  function onMove(e) {
    if (!isDragging) return;
    const x = e.touches ? e.touches[0].clientX : e.clientX;
    setPosition(x);
  }

  function onEnd() {
    isDragging = false;
  }

  // Mouse events
  container.addEventListener('mousedown', onStart);
  document.addEventListener('mousemove', onMove);
  document.addEventListener('mouseup', onEnd);

  // Touch events
  container.addEventListener('touchstart', onStart, { passive: false });
  document.addEventListener('touchmove', onMove, { passive: true });
  document.addEventListener('touchend', onEnd);

  // Click to position
  container.addEventListener('click', (e) => {
    setPosition(e.clientX);
  });
}

// ----- Service level toggle -----
function initServiceToggle() {
  const buttons = document.querySelectorAll('.service-toggle');
  if (!buttons.length) return;

  buttons.forEach(btn => {
    btn.addEventListener('click', () => {
      buttons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
    });
  });
}

// ----- Smooth scroll with nav offset -----
function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      const id = anchor.getAttribute('href');
      if (id === '#') return;
      const target = document.querySelector(id);
      if (!target) return;
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  });
}

// ----- Form validation -----
function initFormValidation() {
  const form = document.getElementById('booking-form');
  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    clearErrors();

    const name = form.querySelector('#full-name');
    const email = form.querySelector('#email');
    const neighborhood = form.querySelector('#neighborhood');
    let valid = true;

    if (!name.value.trim()) {
      showError(name, 'Please enter your name');
      valid = false;
    }

    if (!email.value.trim()) {
      showError(email, 'Please enter your email');
      valid = false;
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value.trim())) {
      showError(email, 'Please enter a valid email');
      valid = false;
    }

    if (!neighborhood.value) {
      showError(neighborhood, 'Please select your neighborhood');
      valid = false;
    }

    if (valid) {
      // Show success state (no backend for v1)
      form.innerHTML = `
        <div class="form-success">
          <div class="w-20 h-20 bg-accent/10 rounded-full flex items-center justify-center mx-auto mb-6">
            <span class="material-symbols-outlined text-accent text-4xl">check_circle</span>
          </div>
          <h4>Quote Request Received</h4>
          <p>We'll get back to you within 15 minutes during business hours.</p>
        </div>
      `;
    }
  });

  function showError(input, message) {
    input.classList.add('error');
    let msg = input.parentElement.querySelector('.error-msg');
    if (!msg) {
      msg = document.createElement('p');
      msg.className = 'error-msg show';
      msg.textContent = message;
      input.parentElement.appendChild(msg);
    } else {
      msg.textContent = message;
      msg.classList.add('show');
    }
  }

  function clearErrors() {
    form.querySelectorAll('.error').forEach(el => el.classList.remove('error'));
    form.querySelectorAll('.error-msg').forEach(el => el.remove());
  }
}
