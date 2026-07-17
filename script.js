// Password gate
const SITE_PASSWORD_HASH = '65241b6898b20b5b591ccf14edec99ad39de57d9b9a0c94ec5c6480ba8429175';
const lockScreen = document.getElementById('lock-screen');
const lockForm = document.getElementById('lock-form');
const lockInput = document.getElementById('lock-input');
const lockError = document.getElementById('lock-error');

async function sha256(text) {
  const buf = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(text));
  return Array.from(new Uint8Array(buf)).map(b => b.toString(16).padStart(2, '0')).join('');
}

if (lockForm) {
  lockForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const hash = await sha256(lockInput.value);
    if (hash === SITE_PASSWORD_HASH) {
      sessionStorage.setItem('site-unlocked', 'true');
      document.body.classList.add('unlocked');
    } else {
      lockError.textContent = 'incorrect password';
      lockInput.value = '';
      lockInput.focus();
      lockScreen.classList.add('shake');
      setTimeout(() => lockScreen.classList.remove('shake'), 400);
    }
  });
}

// Nav border on scroll
const nav = document.querySelector('nav');
window.addEventListener('scroll', () => {
  nav.classList.toggle('scrolled', window.scrollY > 20);
});

// Hero fades in immediately on load
window.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('.hero-text, .hero-photo').forEach((el, i) => {
    el.classList.add('reveal');
    setTimeout(() => el.classList.add('visible'), 100 + i * 150);
  });

  // Project cards reveal on scroll
  const projects = document.querySelectorAll('.project, .cta-inner');
  projects.forEach(el => el.classList.add('reveal'));

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        setTimeout(() => entry.target.classList.add('visible'), 60);
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });

  projects.forEach(el => observer.observe(el));
});
