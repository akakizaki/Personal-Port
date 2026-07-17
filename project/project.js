// Scroll-spy ToC
const sections = document.querySelectorAll('.cs-section');
const tocLinks = document.querySelectorAll('.toc-link');

function getActiveSection() {
  const scrollY = window.scrollY;
  const offset = 140;
  let current = sections[0]?.id;

  sections.forEach(section => {
    if (section.offsetTop - offset <= scrollY) {
      current = section.id;
    }
  });
  return current;
}

function updateToc() {
  const active = getActiveSection();
  tocLinks.forEach(link => {
    const isActive = link.getAttribute('data-section') === active;
    link.classList.toggle('active', isActive);
  });
}

window.addEventListener('scroll', updateToc, { passive: true });
updateToc();

// Smooth scroll for ToC links
tocLinks.forEach(link => {
  link.addEventListener('click', e => {
    e.preventDefault();
    const target = document.querySelector(link.getAttribute('href'));
    if (target) {
      window.scrollTo({ top: target.offsetTop - 100, behavior: 'smooth' });
    }
  });
});

// Nav border on scroll
const nav = document.querySelector('nav');
window.addEventListener('scroll', () => {
  nav.classList.toggle('scrolled', window.scrollY > 20);
}, { passive: true });

// Reveal sections on scroll
const sectionEls = document.querySelectorAll('.cs-section');

sectionEls.forEach(s => {
  s.classList.add('cs-hidden');
});

const revealObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.remove('cs-hidden');
      entry.target.classList.add('cs-revealed');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.05, rootMargin: '0px 0px -40px 0px' });

sectionEls.forEach(s => revealObserver.observe(s));
