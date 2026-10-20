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

// macOS menu bar clock (homepage only) + rice-bar clock in the hero window
const clocks = document.querySelectorAll('.menu-clock, .rice-clock');
if (clocks.length) {
  const updateClocks = () => {
    const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    clocks.forEach(el => { el.textContent = time; });
  };
  updateClocks();
  setInterval(updateClocks, 30000);
}

// Rice-bar "uptime" — time elapsed since this page loaded
const riceUptime = document.querySelector('.rice-uptime');
if (riceUptime) {
  const start = Date.now();
  const updateUptime = () => {
    const secs = Math.floor((Date.now() - start) / 1000);
    const mins = Math.floor(secs / 60);
    riceUptime.textContent = `${mins}m ${String(secs % 60).padStart(2, '0')}s`;
  };
  updateUptime();
  setInterval(updateUptime, 1000);
}

// Liquid glass hero: specular highlight follows the cursor, plus a subtle tilt
const heroWindow = document.querySelector('.hero-window');
if (heroWindow) {
  heroWindow.addEventListener('mousemove', (e) => {
    const rect = heroWindow.getBoundingClientRect();
    const px = ((e.clientX - rect.left) / rect.width) * 100;
    const py = ((e.clientY - rect.top) / rect.height) * 100;
    heroWindow.style.setProperty('--mx', `${px}%`);
    heroWindow.style.setProperty('--my', `${py}%`);
    heroWindow.style.setProperty('--rx', `${(py / 100 - 0.5) * -6}deg`);
    heroWindow.style.setProperty('--ry', `${(px / 100 - 0.5) * 6}deg`);
  });
  heroWindow.addEventListener('mouseleave', () => {
    heroWindow.style.setProperty('--rx', '0deg');
    heroWindow.style.setProperty('--ry', '0deg');
  });
}

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
