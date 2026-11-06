const body = document.body;
const themeToggle = document.querySelector('.theme-toggle');
const nav = document.querySelector('.main-nav');
const menuToggle = document.querySelector('.menu-toggle');
const filterButtons = document.querySelectorAll('.filter-btn');
const projectCards = document.querySelectorAll('.project-card');
const contactForm = document.getElementById('contactForm');
const formStatus = document.querySelector('.form-status');
const counters = document.querySelectorAll('[data-target]');
const revealItems = document.querySelectorAll('.section, .experience-card, .skill-card, .project-card, .timeline-item, .page-card, .summary-card');

const savedTheme = localStorage.getItem('portfolio-theme');
if (savedTheme === 'dark') {
  body.classList.add('dark-theme');
  if (themeToggle) themeToggle.textContent = '☀️';
}

if (themeToggle) {
  themeToggle.addEventListener('click', () => {
    body.classList.toggle('dark-theme');
    const isDark = body.classList.contains('dark-theme');
    themeToggle.textContent = isDark ? '☀️' : '🌙';
    localStorage.setItem('portfolio-theme', isDark ? 'dark' : 'light');
  });
}

if (menuToggle && nav) {
  menuToggle.addEventListener('click', () => {
    const isOpen = nav.classList.toggle('open');
    menuToggle.setAttribute('aria-expanded', String(isOpen));
  });

  nav.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', () => {
      nav.classList.remove('open');
      menuToggle.setAttribute('aria-expanded', 'false');
    });
  });
}

filterButtons.forEach((button) => {
  button.addEventListener('click', () => {
    const selectedFilter = button.dataset.filter;

    filterButtons.forEach((btn) => btn.classList.toggle('active', btn === button));

    projectCards.forEach((card) => {
      const match = selectedFilter === 'all' || card.dataset.category === selectedFilter;
      card.classList.toggle('hidden', !match);
    });
  });
});

if (contactForm) {
  contactForm.addEventListener('submit', (event) => {
    event.preventDefault();

    const formData = new FormData(contactForm);
    const name = (formData.get('name') || '').toString().trim();
    const email = (formData.get('email') || '').toString().trim();
    const message = (formData.get('message') || '').toString().trim();

    if (!name || !email || !message) {
      formStatus.textContent = 'Please complete all fields before submitting.';
      formStatus.className = 'form-status error';
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      formStatus.textContent = 'Please enter a valid email address.';
      formStatus.className = 'form-status error';
      return;
    }

    formStatus.textContent = 'Thank you! Your message has been recorded successfully.';
    formStatus.className = 'form-status success';
    contactForm.reset();
  });
}

const animateCounter = (element) => {
  const target = Number(element.dataset.target);
  const suffix = element.dataset.suffix || '';
  const duration = 1200;
  let start = null;

  const step = (timestamp) => {
    if (!start) start = timestamp;
    const progress = Math.min((timestamp - start) / duration, 1);
    const value = Math.floor(progress * target);
    element.textContent = value + suffix;

    if (progress < 1) {
      requestAnimationFrame(step);
    } else {
      element.textContent = target + suffix;
    }
  };

  requestAnimationFrame(step);
};

counters.forEach((counter) => animateCounter(counter));

const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
      }
    });
  },
  { threshold: 0.15 }
);

revealItems.forEach((item) => {
  item.classList.add('reveal');
  revealObserver.observe(item);
});
