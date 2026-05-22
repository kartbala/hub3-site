// Hub3 site -- small shared behaviors

// Mobile menu toggle
document.addEventListener('click', (e) => {
  const burger = e.target.closest('[data-burger]');
  if (burger) {
    const menu = document.querySelector('.mobile-menu');
    if (menu) menu.classList.toggle('open');
    return;
  }

  // Nav dropdown
  const trigger = e.target.closest('[data-dropdown]');
  if (trigger) {
    e.preventDefault();
    const parent = trigger.closest('.nav-dropdown');
    document.querySelectorAll('.nav-dropdown.open').forEach((el) => {
      if (el !== parent) el.classList.remove('open');
    });
    parent.classList.toggle('open');
    return;
  }

  // Click outside closes dropdown
  if (!e.target.closest('.nav-dropdown')) {
    document.querySelectorAll('.nav-dropdown.open').forEach((el) => el.classList.remove('open'));
  }
});

// Esc closes dropdown / mobile menu
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    document.querySelectorAll('.nav-dropdown.open').forEach((el) => el.classList.remove('open'));
    document.querySelectorAll('.mobile-menu.open').forEach((el) => el.classList.remove('open'));
  }
});

// Form handler -- placeholder endpoint
document.addEventListener('submit', (e) => {
  const form = e.target.closest('form[data-form]');
  if (!form) return;
  e.preventDefault();
  const status = form.querySelector('[data-form-status]');
  const btn = form.querySelector('button[type="submit"]');
  if (btn) { btn.disabled = true; btn.textContent = 'Sending…'; }
  // placeholder: POST to /api/contact would go here
  setTimeout(() => {
    if (status) status.textContent = '✓ Got it. A real human replies within two business days.';
    if (btn) { btn.disabled = false; btn.textContent = 'Sent'; }
    form.reset();
  }, 500);
});

// Footer signup (separate, lighter handler)
document.addEventListener('submit', (e) => {
  const form = e.target.closest('form[data-signup]');
  if (!form) return;
  e.preventDefault();
  const note = form.parentElement.querySelector('.signup-note');
  if (note) note.textContent = "✓ Subscribed. Watch for the next field memo.";
  form.reset();
});
