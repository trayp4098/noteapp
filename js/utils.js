/* ====== УТИЛІТИ ====== */

export function formatDate(date) {
  return new Date(date).toLocaleString('uk-UA', {
    day: '2-digit', month: '2-digit', year: 'numeric',
    hour: '2-digit', minute: '2-digit',
  });
}

export function debounce(fn, ms) {
  let t;
  return (...args) => { clearTimeout(t); t = setTimeout(() => fn(...args), ms); };
}

export function sanitize(str) {
  return (str || '').trim().replace(/[<>]/g, '');
}

/* ── TOAST ─────────────────────────────────────────── */

let _container = null;

function getContainer() {
  if (!_container) {
    _container = Object.assign(document.createElement('div'), { id: 'toast-root' });
    Object.assign(_container.style, {
      position: 'fixed', bottom: '24px', right: '24px',
      zIndex: '99999', display: 'flex', flexDirection: 'column',
      gap: '8px', pointerEvents: 'none',
    });
    document.body.appendChild(_container);
  }
  return _container;
}

const TOAST_STYLES = {
  info:    { bg: 'rgba(79,156,255,.18)',  border: 'rgba(79,156,255,.5)',  icon: 'ph-info' },
  success: { bg: 'rgba(64,192,87,.18)',   border: 'rgba(64,192,87,.5)',   icon: 'ph-check-circle' },
  error:   { bg: 'rgba(255,80,80,.18)',   border: 'rgba(255,80,80,.5)',   icon: 'ph-warning-circle' },
  warning: { bg: 'rgba(250,176,5,.18)',   border: 'rgba(250,176,5,.5)',   icon: 'ph-warning' },
};

export function toast(msg, type = 'info', duration = 3500) {
  const s  = TOAST_STYLES[type] || TOAST_STYLES.info;
  const el = document.createElement('div');

  Object.assign(el.style, {
    display: 'flex', alignItems: 'center', gap: '10px',
    background: s.bg, border: `1px solid ${s.border}`,
    backdropFilter: 'blur(12px)', borderRadius: '12px',
    padding: '11px 16px', color: 'var(--text,#f5f5f5)',
    fontSize: '.91rem', fontWeight: '500',
    boxShadow: '0 8px 24px rgba(0,0,0,.35)',
    pointerEvents: 'all', maxWidth: '340px',
    opacity: '0', transform: 'translateY(10px)',
    transition: 'opacity .22s ease, transform .22s ease',
  });

  el.innerHTML = `<i class="ph ${s.icon}" style="font-size:1.15rem;flex-shrink:0"></i><span>${msg}</span>`;
  getContainer().appendChild(el);

  requestAnimationFrame(() => requestAnimationFrame(() => {
    el.style.opacity = '1';
    el.style.transform = 'translateY(0)';
  }));

  const remove = () => {
    el.style.opacity = '0'; el.style.transform = 'translateY(10px)';
    setTimeout(() => el.remove(), 240);
  };
  if (duration > 0) setTimeout(remove, duration);
  el.addEventListener('click', remove);
  return remove;
}

/* ── CONFIRM MODAL ──────────────────────────────────── */

export function confirmModal(message, {
  title = 'Підтвердження',
  confirmText = 'Так',
  cancelText = 'Скасувати',
  danger = false,
} = {}) {
  return new Promise(resolve => {
    const ov = document.createElement('div');
    Object.assign(ov.style, {
      position: 'fixed', inset: '0', zIndex: '99998',
      background: 'rgba(0,0,0,.6)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      backdropFilter: 'blur(4px)',
    });

    const btnColor = danger
      ? 'rgba(255,80,80,.22)' : 'rgba(79,156,255,.22)';
    const btnBorder = danger
      ? 'rgba(255,80,80,.5)' : 'rgba(79,156,255,.5)';

    ov.innerHTML = `
      <div style="
        background:var(--panel,#1a1a1f);
        border:1px solid var(--border-color,rgba(255,255,255,.15));
        border-radius:14px; padding:28px 30px; max-width:360px; width:90%;
        box-shadow:0 20px 50px rgba(0,0,0,.55);
        display:flex; flex-direction:column; gap:14px;
        animation:_su .22s ease;
      ">
        <h3 style="margin:0;font-size:1.05rem;color:var(--text,#f5f5f5)">${title}</h3>
        <p  style="margin:0;color:var(--muted,#9ca3af);line-height:1.55">${message}</p>
        <div style="display:flex;gap:10px;justify-content:flex-end;margin-top:4px">
          <button id="_mc" style="padding:8px 18px;border-radius:10px;cursor:pointer;font-weight:600;
            background:rgba(255,255,255,.08);border:1px solid rgba(255,255,255,.2);
            color:var(--text,#f5f5f5);font-size:.9rem">${cancelText}</button>
          <button id="_mok" style="padding:8px 18px;border-radius:10px;cursor:pointer;font-weight:600;
            background:${btnColor};border:1px solid ${btnBorder};
            color:var(--text,#f5f5f5);font-size:.9rem">${confirmText}</button>
        </div>
      </div>
      <style>@keyframes _su{from{opacity:0;transform:translateY(14px)}to{opacity:1;transform:translateY(0)}}</style>
    `;

    document.body.appendChild(ov);
    const close = r => { ov.style.opacity='0'; setTimeout(()=>ov.remove(),180); resolve(r); };
    ov.querySelector('#_mok').addEventListener('click', () => close(true));
    ov.querySelector('#_mc').addEventListener('click',  () => close(false));
    ov.addEventListener('click', e => { if (e.target === ov) close(false); });
  });
}
