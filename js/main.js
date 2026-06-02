'use strict';

/* Nav: sticky style on scroll */
const nav = document.querySelector('.nav');
window.addEventListener('scroll', () => {
  nav.classList.toggle('scrolled', window.scrollY > 20);
}, { passive: true });

/* Nav: highlight active section link */
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.nav__links a');

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      navLinks.forEach(a => a.classList.remove('active'));
      const active = document.querySelector(`.nav__links a[href="#${entry.target.id}"]`);
      if (active) active.classList.add('active');
    }
  });
}, { rootMargin: '-40% 0px -55% 0px' });

sections.forEach(s => observer.observe(s));

/* Email: собирается из частей — боты не парсят mailto: из HTML */
const emailBtn = document.getElementById('emailBtn');
if (emailBtn) {
  const u = 'your';
  const d = 'email.com';
  function revealEmail(e) {
    e.preventDefault();
    const addr = u + '@' + d;
    document.getElementById('emailLabel').textContent = addr;
    emailBtn.href = 'mailto:' + addr;
    emailBtn.removeEventListener('click', revealEmail);
  }
  emailBtn.addEventListener('click', revealEmail);
}

/* Quick contact form: validation + console.log stub */
const leadForm = document.getElementById('leadForm');
const formWrap = document.getElementById('formWrap');

if (leadForm) {
  const emailInput = document.getElementById('fieldEmail');
  const emailError = document.getElementById('emailError');

  function isValidEmail(v) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim());
  }

  function showEmailError(msg) {
    emailError.textContent = msg;
    emailInput.classList.add('form-input--error');
    emailInput.setAttribute('aria-invalid', 'true');
  }

  function clearEmailError() {
    emailError.textContent = '';
    emailInput.classList.remove('form-input--error');
    emailInput.removeAttribute('aria-invalid');
  }

  emailInput.addEventListener('input', clearEmailError);

  leadForm.addEventListener('submit', e => {
    e.preventDefault();
    clearEmailError();

    const email = emailInput.value.trim();
    if (!email) {
      showEmailError('Укажите email — это обязательное поле');
      emailInput.focus();
      return;
    }
    if (!isValidEmail(email)) {
      showEmailError('Проверьте формат email (например: name@domain.com)');
      emailInput.focus();
      return;
    }

    const payload = {
      name: document.getElementById('fieldName').value.trim() || null,
      email,
      description: document.getElementById('fieldDesc').value.trim() || null,
    };
    console.log('[quick-contact] form submitted:', payload);

    formWrap.classList.add('form-wrap--success');
  });
}

/* Smooth scroll fallback for Safari */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', e => {
    let target;
    try {
      target = document.querySelector(anchor.getAttribute('href'));
    } catch (_) {
      return;
    }
    if (!target) return;
    e.preventDefault();
    target.scrollIntoView({ behavior: 'smooth', block: 'start' });
  });
});
