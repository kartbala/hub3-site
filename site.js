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

// Resolve a human label for a form field.
function labelFor(field) {
  if (field.id) {
    const l = field.form?.querySelector(`label[for="${field.id}"]`);
    if (l) return l.textContent.replace(/\s+/g, ' ').replace(/\*$/, '').trim();
  }
  if (field.getAttribute('aria-label')) return field.getAttribute('aria-label');
  if (field.name) return field.name;
  if (field.placeholder) return field.placeholder;
  return '(field)';
}

// Build a labeled text body from a form's filled fields.
function bodyFromForm(form) {
  const groups = new Map(); // label -> [values...]
  form.querySelectorAll('input, textarea, select').forEach((f) => {
    if (f.type === 'submit' || f.type === 'button' || f.type === 'hidden') return;
    if (f.type === 'checkbox' || f.type === 'radio') {
      if (!f.checked) return;
      // Group multi-checkboxes by their visible group label (the legend) or by name.
      const groupLabel =
        f.closest('fieldset')?.querySelector('legend')?.textContent.trim() ||
        f.name ||
        'Selection';
      const choiceLabel = f.closest('label')?.textContent.trim() || f.value;
      const arr = groups.get(groupLabel) || [];
      arr.push(choiceLabel);
      groups.set(groupLabel, arr);
      return;
    }
    const v = (f.value || '').trim();
    if (!v) return;
    groups.set(labelFor(f), [v]);
  });
  const lines = [];
  groups.forEach((vals, label) => {
    if (vals.length === 1) lines.push(`${label}: ${vals[0]}`);
    else lines.push(`${label}:\n  - ${vals.join('\n  - ')}`);
  });
  return lines.join('\n');
}

// Submit handler: build a mailto: link from form values, open the mail client.
// Forms opt in with data-form. Optional: data-mailto-to, data-mailto-subject.
function handleFormMail(e) {
  const form = e.target.closest('form[data-form]');
  if (!form) return;
  e.preventDefault();
  const to = form.dataset.mailtoTo || 'hello@hub3.us';
  const subject = form.dataset.mailtoSubject || 'Hub3 -- new inquiry';
  const body = bodyFromForm(form);
  const url = `mailto:${to}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  const status = form.querySelector('[data-form-status]');
  if (status) status.textContent = 'Opening your mail client. Send the email to finish.';
  window.location.href = url;
}

// Footer signup: same mailto: bridge, but a single email field.
function handleSignupMail(e) {
  const form = e.target.closest('form[data-signup]');
  if (!form) return;
  e.preventDefault();
  const email = (form.querySelector('input[type="email"]')?.value || '').trim();
  const subject = 'Hub3 -- field memo signup';
  const body = email ? `Please subscribe me: ${email}` : 'Please subscribe me to the field memo.';
  const url = `mailto:hello@hub3.us?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  const note = form.parentElement.querySelector('.signup-note');
  if (note) note.textContent = 'Opening your mail client. Send the email to finish.';
  window.location.href = url;
}

document.addEventListener('submit', handleFormMail);
document.addEventListener('submit', handleSignupMail);
