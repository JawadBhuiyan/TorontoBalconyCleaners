// ================================================
// Toronto Balcony Cleaners - Main JS
// ================================================

document.addEventListener('DOMContentLoaded', () => {
  initNavScroll();
  initMobileMenu();
  initBeforeAfterSlider();
  initServiceToggle();
  initTimeslotToggle();
  initDateConstraints();
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
    spans[0].style.transform = isOpen ? 'rotate(45deg) translate(4px, 4px)' : '';
    spans[1].style.opacity = isOpen ? '0' : '1';
    spans[2].style.transform = isOpen ? 'rotate(-45deg) translate(4px, -4px)' : '';
  });

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
  const beforeImg = document.getElementById('before-img');
  const handle = document.getElementById('slider-handle');
  if (!container || !beforeImg || !handle) return;

  let isDragging = false;

  function setPosition(x) {
    const rect = container.getBoundingClientRect();
    let pct = ((x - rect.left) / rect.width) * 100;
    pct = Math.max(2, Math.min(98, pct));
    beforeImg.style.clipPath = `inset(0 ${100 - pct}% 0 0)`;
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

  container.addEventListener('mousedown', onStart);
  document.addEventListener('mousemove', onMove);
  document.addEventListener('mouseup', onEnd);
  container.addEventListener('touchstart', onStart, { passive: false });
  document.addEventListener('touchmove', onMove, { passive: true });
  document.addEventListener('touchend', onEnd);

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

// ----- Timeslot toggle -----
function initTimeslotToggle() {
  const buttons = document.querySelectorAll('.timeslot-btn');
  if (!buttons.length) return;

  buttons.forEach(btn => {
    btn.addEventListener('click', () => {
      buttons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
    });
  });
}

// ----- Date constraints -----
function initDateConstraints() {
  const dateInput = document.getElementById('booking-date');
  if (!dateInput) return;

  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  dateInput.min = tomorrow.toISOString().split('T')[0];

  const maxDate = new Date();
  maxDate.setDate(maxDate.getDate() + 60);
  dateInput.max = maxDate.toISOString().split('T')[0];
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

// ----- Form validation & submission -----
function initFormValidation() {
  const form = document.getElementById('booking-form');
  if (!form) return;

  const submitBtn = form.querySelector('button[type="submit"]');
  const originalBtnText = submitBtn.textContent;

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    clearErrors();

    const name = form.querySelector('#full-name');
    const email = form.querySelector('#email');
    const neighborhood = form.querySelector('#neighborhood');
    const date = form.querySelector('#booking-date');
    const activeTimeslot = document.querySelector('.timeslot-btn.active');
    const activeService = document.querySelector('.service-toggle.active');
    const honeypot = form.querySelector('input[name="website"]');
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

    if (!date.value) {
      showError(date, 'Please select a date');
      valid = false;
    }

    if (!activeTimeslot) {
      const grid = document.getElementById('timeslot-grid');
      if (grid) {
        let msg = grid.parentElement.querySelector('.error-msg');
        if (!msg) {
          msg = document.createElement('p');
          msg.className = 'error-msg show';
          msg.textContent = 'Please select a time slot';
          grid.parentElement.appendChild(msg);
        }
      }
      valid = false;
    }

    if (!valid) return;

    // Build payload
    const formData = {
      name: name.value.trim(),
      email: email.value.trim(),
      neighborhood: neighborhood.value,
      service: activeService?.dataset.value || 'standard',
      date: date.value,
      timeSlot: activeTimeslot.dataset.value,
      website: honeypot?.value || '',
    };

    // Loading state
    submitBtn.disabled = true;
    submitBtn.textContent = 'Sending...';
    submitBtn.classList.add('opacity-70');

    try {
      const res = await fetch('/api/booking', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const result = await res.json();

      if (result.success) {
        form.innerHTML = `
          <div class="form-success">
            <div class="w-20 h-20 bg-accent/10 rounded-full flex items-center justify-center mx-auto mb-6">
              <span class="material-symbols-outlined text-accent text-4xl">check_circle</span>
            </div>
            <h4>Quote Request Received</h4>
            <p>We'll get back to you within 15 minutes during business hours.</p>
          </div>
        `;
      } else {
        showFormError(result.error || 'Something went wrong. Please try again.');
        submitBtn.disabled = false;
        submitBtn.textContent = originalBtnText;
        submitBtn.classList.remove('opacity-70');
      }
    } catch {
      showFormError('Network error. Please check your connection and try again.');
      submitBtn.disabled = false;
      submitBtn.textContent = originalBtnText;
      submitBtn.classList.remove('opacity-70');
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

  function showFormError(message) {
    let banner = form.querySelector('.form-error-banner');
    if (!banner) {
      banner = document.createElement('div');
      banner.className = 'form-error-banner';
      submitBtn.parentElement.insertBefore(banner, submitBtn);
    }
    banner.textContent = message;
  }

  function clearErrors() {
    form.querySelectorAll('.error').forEach(el => el.classList.remove('error'));
    form.querySelectorAll('.error-msg').forEach(el => el.remove());
    const banner = form.querySelector('.form-error-banner');
    if (banner) banner.remove();
  }
}
