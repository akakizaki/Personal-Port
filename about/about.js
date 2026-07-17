// Nav scroll border
const nav = document.querySelector('nav');
window.addEventListener('scroll', () => {
  nav.classList.toggle('scrolled', window.scrollY > 20);
}, { passive: true });

// Generate contribution graph
function generateContribGraph() {
  const graph = document.getElementById('contribGraph');
  if (!graph) return;

  const WEEKS = 40;
  const DAYS  = 7;
  const total = WEEKS * DAYS;

  // Weighted random: mostly 0, some activity clusters
  const weights = [0, 0, 0, 0, 0, 1, 1, 1, 2, 2, 3, 4];

  for (let i = 0; i < total; i++) {
    const cell = document.createElement('div');
    cell.className = 'contrib-cell';

    // Create realistic clusters of activity
    const week  = Math.floor(i / DAYS);
    const day   = i % DAYS;

    // More active in recent weeks, less on weekends
    const recencyBoost = week > 28 ? 1.5 : week > 18 ? 1.1 : 0.7;
    const weekendDim   = (day === 0 || day === 6) ? 0.4 : 1;
    const rand         = Math.random() * recencyBoost * weekendDim;

    let level = 0;
    if      (rand > 1.2) level = 4;
    else if (rand > 0.9) level = 3;
    else if (rand > 0.65) level = 2;
    else if (rand > 0.42) level = 1;

    cell.setAttribute('data-level', level);
    graph.appendChild(cell);
  }
}

generateContribGraph();

// Fade-in on scroll for interest rows
const interestRows = document.querySelectorAll('.interest-row, .gh-profile');
interestRows.forEach(el => {
  el.style.opacity = '0';
  el.style.transform = 'translateY(16px)';
  el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
});

const observer = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.style.opacity = '1';
      entry.target.style.transform = 'none';
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.1 });

// Profile appears immediately
const profile = document.querySelector('.gh-profile');
if (profile) {
  setTimeout(() => {
    profile.style.opacity = '1';
    profile.style.transform = 'none';
  }, 80);
}

// Interest rows fade in on scroll
document.querySelectorAll('.interest-row').forEach(el => observer.observe(el));
