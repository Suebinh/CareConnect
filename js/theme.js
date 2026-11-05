// Shared Tailwind tokens for every page under pages/. Load right after the Tailwind CDN script.
// Same palette as the home page (index.html).
tailwind.config = {
  theme: { extend: {
    fontFamily: { sans: ['Manrope', 'system-ui', 'sans-serif'] },
    colors: {
      sky: '#0593C6',   // primary
      snow: '#FCFFFF',  // text, light surfaces
      pink: '#D83995',  // accent
      navy: '#062A3D'   // contrast, shadows
    }
  } }
};

// ---------------------------------------------------------------------------
// Glass pickers: replace the browser's own <select> menu and date-picker popup
// (which can't be styled) with glass versions. The original <select>/<input>
// stays in the page, hidden, and still holds the value and fires `change`,
// so page scripts that read `.value` or listen for `change` keep working.
// ---------------------------------------------------------------------------
document.addEventListener('DOMContentLoaded', () => {
  const CHEVRON = '<svg class="cc-picker-icon" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true"><path d="M5.3 7.3a1 1 0 0 1 1.4 0L10 10.6l3.3-3.3a1 1 0 1 1 1.4 1.4l-4 4a1 1 0 0 1-1.4 0l-4-4a1 1 0 0 1 0-1.4Z"/></svg>';
  const CALENDAR = '<svg class="cc-picker-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="3.5" y="5" width="17" height="15" rx="2.5"/><path d="M3.5 10h17M8 3v4M16 3v4"/></svg>';
  const ARROW = (d) => `<svg viewBox="0 0 20 20" fill="currentColor" width="16" height="16" aria-hidden="true"><path d="${d === -1 ? 'M12.7 5.3a1 1 0 0 1 0 1.4L9.4 10l3.3 3.3a1 1 0 1 1-1.4 1.4l-4-4a1 1 0 0 1 0-1.4l4-4a1 1 0 0 1 1.4 0Z' : 'M7.3 14.7a1 1 0 0 1 0-1.4L10.6 10 7.3 6.7a1 1 0 0 1 1.4-1.4l4 4a1 1 0 0 1 0 1.4l-4 4a1 1 0 0 1-1.4 0Z'}"/></svg>`;
  const pad = (n) => String(n).padStart(2, '0');
  const iso = (d) => d.getFullYear() + '-' + pad(d.getMonth() + 1) + '-' + pad(d.getDate());

  // Only one popup open at a time.
  let current = null;
  document.addEventListener('pointerdown', (e) => {
    if (current && !current.popup.contains(e.target) && !current.trigger.contains(e.target)) current.close(false);
  });
  window.addEventListener('resize', () => current && current.place());
  window.addEventListener('scroll', () => current && current.place(), true);

  // Re-render the visible trigger whenever a page script sets `.value` directly
  // (e.g. the schedule's "Today" button).
  function watchValue(el, proto, onSet) {
    const d = Object.getOwnPropertyDescriptor(proto, 'value');
    Object.defineProperty(el, 'value', {
      configurable: true,
      get() { return d.get.call(this); },
      set(v) { d.set.call(this, v); onSet(); }
    });
  }

  // Builds the glass button that replaces the native control on the page.
  function makeTrigger(native, icon, popupKind) {
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = native.className + ' cc-picker';
    btn.id = native.id + '-picker';
    btn.setAttribute('aria-haspopup', popupKind);
    btn.setAttribute('aria-expanded', 'false');
    const label = native.id && document.querySelector('label[for="' + native.id + '"]');
    if (label) { label.htmlFor = btn.id; label.id = label.id || native.id + '-label'; }
    const text = document.createElement('span');
    text.className = 'cc-picker-text';
    btn.append(text);
    btn.insertAdjacentHTML('beforeend', icon);
    native.after(btn);
    native.hidden = true;
    return { btn, text, labelText: label ? label.textContent.trim() : '' };
  }

  // Shows `popup` under (or above, if there's no room) the trigger.
  function openPopup(trigger, popup) {
    if (current) current.close(false);
    document.body.appendChild(popup);
    trigger.setAttribute('aria-expanded', 'true');
    const place = () => {
      const r = trigger.getBoundingClientRect();
      popup.style.minWidth = r.width + 'px';
      const w = popup.offsetWidth, h = popup.offsetHeight;
      const left = Math.max(8, Math.min(r.left, innerWidth - w - 8));
      let top = r.bottom + 8;
      if (top + h > innerHeight - 8 && r.top - h - 8 > 8) { top = r.top - h - 8; popup.classList.add('is-above'); }
      else popup.classList.remove('is-above');
      popup.style.left = left + 'px';
      popup.style.top = top + 'px';
    };
    place();
    requestAnimationFrame(() => popup.classList.add('is-open'));
    // Tabbing out of the popup closes it.
    popup.addEventListener('focusout', (e) => {
      if (e.relatedTarget && !popup.contains(e.relatedTarget) && current && current.popup === popup) current.close(false);
    });
    current = {
      popup, trigger, place,
      close(focusTrigger) {
        popup.remove();
        trigger.setAttribute('aria-expanded', 'false');
        current = null;
        if (focusTrigger) trigger.focus();
      }
    };
  }

  // ---- <select class="cc-field"> → glass listbox ----
  document.querySelectorAll('select.cc-field').forEach((sel) => {
    const { btn, text } = makeTrigger(sel, CHEVRON, 'listbox');
    // Size the button to its longest option (like a native select) so it doesn't
    // change width, and shift the fields next to it, when the choice changes.
    text.classList.add('cc-picker-sized');
    const shown = document.createElement('span');
    text.append(shown);
    [...sel.options].forEach((o) => {
      const s = document.createElement('span');
      s.className = 'cc-picker-sizer';
      s.setAttribute('aria-hidden', 'true');
      s.textContent = o.text;
      text.append(s);
    });
    const render = () => { shown.textContent = sel.options[sel.selectedIndex] ? sel.options[sel.selectedIndex].text : ''; };
    watchValue(sel, HTMLSelectElement.prototype, render);
    render();

    const choose = (i) => {
      if (sel.selectedIndex === i) return;
      sel.selectedIndex = i;
      render();
      sel.dispatchEvent(new Event('change', { bubbles: true }));
    };

    function open() {
      const list = document.createElement('ul');
      list.className = 'cc-popover cc-listbox';
      list.setAttribute('role', 'listbox');
      list.tabIndex = -1;
      if (btn.labels && btn.labels[0]) list.setAttribute('aria-labelledby', btn.labels[0].id);
      let active = Math.max(0, sel.selectedIndex);
      const items = [...sel.options].map((opt, i) => {
        const li = document.createElement('li');
        li.id = btn.id + '-opt-' + i;
        li.className = 'cc-option';
        li.setAttribute('role', 'option');
        li.setAttribute('aria-selected', String(i === sel.selectedIndex));
        li.textContent = opt.text;
        li.addEventListener('click', () => { choose(i); current.close(true); });
        li.addEventListener('pointermove', () => setActive(i, false));
        list.append(li);
        return li;
      });
      function setActive(i, scroll) {
        active = i;
        items.forEach((li, j) => li.classList.toggle('is-active', j === i));
        list.setAttribute('aria-activedescendant', items[i].id);
        if (scroll !== false) items[i].scrollIntoView({ block: 'nearest' });
      }
      list.addEventListener('keydown', (e) => {
        const last = items.length - 1;
        if (e.key === 'ArrowDown') { e.preventDefault(); setActive(Math.min(active + 1, last)); }
        else if (e.key === 'ArrowUp') { e.preventDefault(); setActive(Math.max(active - 1, 0)); }
        else if (e.key === 'Home') { e.preventDefault(); setActive(0); }
        else if (e.key === 'End') { e.preventDefault(); setActive(last); }
        else if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); choose(active); current.close(true); }
        else if (e.key === 'Escape') { e.preventDefault(); current.close(true); }
        else if (e.key === 'Tab') { current.close(false); }
      });
      openPopup(btn, list);
      setActive(active);
      list.focus();
    }

    btn.addEventListener('click', () => (current && current.trigger === btn ? current.close(true) : open()));
    btn.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowDown' || e.key === 'ArrowUp') { e.preventDefault(); open(); }
    });
  });

  // ---- <input type="date" class="cc-field"> → glass calendar ----
  document.querySelectorAll('input[type="date"].cc-field').forEach((input) => {
    const { btn, text, labelText } = makeTrigger(input, CALENDAR, 'dialog');
    const fmt = (v) => new Date(v + 'T12:00:00').toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    const render = () => {
      text.textContent = input.value ? fmt(input.value) : 'Select a date';
      btn.classList.toggle('is-empty', !input.value);
    };
    watchValue(input, HTMLInputElement.prototype, render);
    render();

    const setValue = (v) => {
      if (input.value === v) return;
      input.value = v;
      input.dispatchEvent(new Event('change', { bubbles: true }));
    };

    function open() {
      const pop = document.createElement('div');
      pop.className = 'cc-popover cc-calendar';
      pop.setAttribute('role', 'dialog');
      pop.setAttribute('aria-label', (labelText || 'Date') + ': choose a date');
      pop.innerHTML =
        '<div class="cc-cal-head">' +
          '<button type="button" class="cc-cal-nav" data-nav="-1" aria-label="Previous month">' + ARROW(-1) + '</button>' +
          '<p class="cc-cal-title" aria-live="polite"></p>' +
          '<button type="button" class="cc-cal-nav" data-nav="1" aria-label="Next month">' + ARROW(1) + '</button>' +
        '</div>' +
        '<div class="cc-cal-grid"></div>' +
        '<div class="cc-cal-foot"><button type="button" data-act="clear">Clear</button><button type="button" data-act="today">Today</button></div>';
      const grid = pop.querySelector('.cc-cal-grid');
      const title = pop.querySelector('.cc-cal-title');

      const start = input.value ? new Date(input.value + 'T12:00:00') : new Date();
      let focusDate = new Date(start.getFullYear(), start.getMonth(), start.getDate());
      let view = new Date(focusDate.getFullYear(), focusDate.getMonth(), 1);

      function draw(focus) {
        title.textContent = view.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
        grid.innerHTML = '';
        ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].forEach((d) => {
          const s = document.createElement('span');
          s.className = 'cc-cal-dow';
          s.textContent = d;
          s.setAttribute('aria-hidden', 'true');
          grid.append(s);
        });
        for (let i = 0; i < view.getDay(); i++) grid.append(document.createElement('span'));
        const days = new Date(view.getFullYear(), view.getMonth() + 1, 0).getDate();
        const today = iso(new Date());
        const focusIso = iso(focusDate);
        for (let d = 1; d <= days; d++) {
          const date = new Date(view.getFullYear(), view.getMonth(), d);
          const v = iso(date);
          const b = document.createElement('button');
          b.type = 'button';
          b.className = 'cc-cal-day';
          b.textContent = d;
          b.dataset.date = v;
          b.tabIndex = v === focusIso ? 0 : -1;
          b.setAttribute('aria-label', date.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' }));
          if (v === input.value) { b.classList.add('is-selected'); b.setAttribute('aria-pressed', 'true'); }
          if (v === today) { b.classList.add('is-today'); b.setAttribute('aria-current', 'date'); }
          grid.append(b);
        }
        if (focus) { const f = grid.querySelector('[tabindex="0"]'); if (f) f.focus(); }
      }

      function moveTo(d) {
        focusDate = d;
        if (d.getMonth() !== view.getMonth() || d.getFullYear() !== view.getFullYear()) {
          view = new Date(d.getFullYear(), d.getMonth(), 1);
        }
        draw(true);
        current && current.place();
      }

      pop.addEventListener('click', (e) => {
        const day = e.target.closest('.cc-cal-day');
        if (day) { setValue(day.dataset.date); current.close(true); return; }
        const nav = e.target.closest('[data-nav]');
        if (nav) {
          view = new Date(view.getFullYear(), view.getMonth() + Number(nav.dataset.nav), 1);
          focusDate = new Date(view);
          draw(false);
          current.place();
          return;
        }
        const act = e.target.closest('[data-act]');
        if (act) { setValue(act.dataset.act === 'today' ? iso(new Date()) : ''); current.close(true); }
      });

      pop.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') { e.preventDefault(); current.close(true); return; }
        if (!e.target.classList.contains('cc-cal-day')) return;
        const step = { ArrowLeft: -1, ArrowRight: 1, ArrowUp: -7, ArrowDown: 7 }[e.key];
        if (step) {
          e.preventDefault();
          const d = new Date(focusDate); d.setDate(d.getDate() + step); moveTo(d);
        } else if (e.key === 'PageUp' || e.key === 'PageDown') {
          e.preventDefault();
          const d = new Date(focusDate); d.setMonth(d.getMonth() + (e.key === 'PageUp' ? -1 : 1)); moveTo(d);
        }
      });

      draw(false);
      openPopup(btn, pop);
      const f = grid.querySelector('[tabindex="0"]');
      if (f) f.focus();
    }

    btn.addEventListener('click', () => (current && current.trigger === btn ? current.close(true) : open()));
    btn.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowDown') { e.preventDefault(); open(); }
    });
  });
});

// Show/hide toggle for every password field: an eye button inside the input.
document.addEventListener('DOMContentLoaded', () => {
  const EYE = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M2 12s3.6-7 10-7 10 7 10 7-3.6 7-10 7S2 12 2 12Z"/><circle cx="12" cy="12" r="3"/></svg>';
  const EYE_OFF = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M10.6 5.1A10.8 10.8 0 0 1 12 5c6.4 0 10 7 10 7a17.6 17.6 0 0 1-3.1 4M6.6 6.6C3.7 8.4 2 12 2 12s3.6 7 10 7a10 10 0 0 0 5.4-1.6"/><path d="M9.9 9.9a3 3 0 0 0 4.2 4.2"/><path d="m3 3 18 18"/></svg>';

  document.querySelectorAll('input[type="password"]').forEach((input) => {
    const wrap = document.createElement('div');
    wrap.className = 'cc-password';
    input.parentNode.insertBefore(wrap, input);
    wrap.appendChild(input);

    const btn = document.createElement('button');
    btn.type = 'button'; // never submits the form
    btn.className = 'cc-eye';
    if (input.id) btn.setAttribute('aria-controls', input.id);
    const render = (shown) => {
      btn.innerHTML = shown ? EYE_OFF : EYE;
      btn.setAttribute('aria-label', shown ? 'Hide password' : 'Show password');
      btn.setAttribute('aria-pressed', String(shown));
    };
    render(false);
    btn.addEventListener('click', () => {
      const shown = input.type === 'password';
      input.type = shown ? 'text' : 'password';
      render(shown);
      input.focus();
      const end = input.value.length;
      input.setSelectionRange(end, end); // keep the cursor at the end
    });
    wrap.appendChild(btn);

    // Hide it again once the form is submitted, so it isn't left on screen.
    if (input.form) input.form.addEventListener('submit', () => { input.type = 'password'; render(false); });
  });
});
