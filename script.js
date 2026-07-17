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
