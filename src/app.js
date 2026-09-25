document.documentElement.classList.add('has-js');

const root = document.documentElement;
let storedTheme = null;
try { storedTheme = localStorage.getItem('saral-theme'); } catch { /* Storage may be blocked. */ }
root.dataset.theme = storedTheme || 'dark';

const themeButton = document.querySelector('[data-theme-toggle]');
const themeColour = document.querySelector('meta[name="theme-color"]');
themeButton?.setAttribute('aria-label', 'Light theme');
function syncThemeButton(theme) {
  themeButton?.setAttribute('aria-pressed', String(theme === 'light'));
  themeColour?.setAttribute('content', theme === 'dark' ? '#0f1315' : '#f7f5fc');
}
syncThemeButton(root.dataset.theme);
themeButton?.addEventListener('click', () => {
  const next = root.dataset.theme === 'dark' ? 'light' : 'dark';
  root.dataset.theme = next;
  try { localStorage.setItem('saral-theme', next); } catch { /* The theme still works for this page. */ }
  syncThemeButton(next);
});

const menuButton = document.querySelector('[data-menu-toggle]');
const menu = document.querySelector('[data-menu]');
const obscuredByMenu = document.querySelectorAll('main, .site-footer');
const mobileMenu = window.matchMedia('(max-width: 64rem)');

const navScrim = document.createElement('div');
navScrim.className = 'nav-scrim';
navScrim.setAttribute('aria-hidden', 'true');
document.body.appendChild(navScrim);
navScrim.addEventListener('click', () => closeMenu());

function setMenuOpen(open) {
  menuButton?.setAttribute('aria-expanded', String(open));
  menu?.classList.toggle('is-open', open);
  navScrim.classList.toggle('is-open', open);
  obscuredByMenu.forEach((node) => { node.inert = open; });
}

function closeMenu(restoreFocus = false) {
  setMenuOpen(false);
  if (restoreFocus) menuButton?.focus();
}

menuButton?.addEventListener('click', () => {
  const open = menuButton.getAttribute('aria-expanded') === 'true';
  setMenuOpen(!open);
});

menu?.querySelectorAll('a').forEach((link) => link.addEventListener('click', () => closeMenu()));
document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape' && menuButton?.getAttribute('aria-expanded') === 'true') closeMenu(true);
});
mobileMenu.addEventListener('change', (event) => {
  if (!event.matches) closeMenu();
});

const progress = document.querySelector('[data-scroll-progress]');
function updateProgress() {
  if (!progress) return;
  const available = document.documentElement.scrollHeight - window.innerHeight;
  const value = available > 0 ? Math.min(1, window.scrollY / available) : 0;
  progress.style.transform = `scaleX(${value})`;
}
updateProgress();
window.addEventListener('scroll', updateProgress, { passive: true });

const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
if (reducedMotion || !('IntersectionObserver' in window)) {
  document.querySelectorAll('[data-reveal]').forEach((item) => item.classList.add('is-visible'));
  document.querySelectorAll('[data-tangle]').forEach((item) => item.classList.add('is-active'));
} else {
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: .12 });
  document.querySelectorAll('[data-reveal]').forEach((item) => revealObserver.observe(item));

  const tangleObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => entry.target.classList.toggle('is-active', entry.isIntersecting));
  }, { threshold: .35 });
  document.querySelectorAll('[data-tangle]').forEach((item) => tangleObserver.observe(item));
}

document.querySelectorAll('[data-year]').forEach((node) => { node.textContent = new Date().getFullYear(); });

const projectForm = document.querySelector('[data-project-form]');
function reviewProjectBrief(event) {
  event.preventDefault();

  const name = projectForm.elements.name;
  const email = projectForm.elements.email;
  const summary = projectForm.elements.summary;
  const website = projectForm.elements.website;
  const status = projectForm.querySelector('[data-form-status]');
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const errors = {
    name: name.value.trim() ? '' : 'Add your name.',
    email: emailPattern.test(email.value.trim()) ? '' : 'Add a valid email address.',
    summary: summary.value.trim().length >= 24 ? '' : 'Add a little more detail (at least 24 characters).'
  };

  Object.entries(errors).forEach(([fieldName, message]) => {
    const field = projectForm.elements[fieldName];
    const error = document.getElementById(`${fieldName}-error`);
    field.setAttribute('aria-invalid', String(Boolean(message)));
    if (error) error.textContent = message;
  });

  if (website.value) {
    status.textContent = 'Thanks. Your brief has been reviewed locally.';
    return;
  }

  const firstInvalid = Object.keys(errors).find((fieldName) => errors[fieldName]);
  if (firstInvalid) {
    status.classList.remove('is-success');
    status.textContent = 'Check the highlighted fields.';
    projectForm.elements[firstInvalid].focus();
    return;
  }

  status.classList.add('is-success');
  status.textContent = 'Your brief is ready. This preview has not sent or stored it.';
}

if (projectForm) {
  projectForm.addEventListener('submit', reviewProjectBrief);
  projectForm.querySelectorAll('input, textarea, button').forEach((control) => { control.disabled = false; });
  document.querySelector('[data-js-required-hint]')?.remove();
}
