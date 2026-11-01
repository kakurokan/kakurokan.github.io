// Aplicar a língua: troca os textos marcados com data-t / data-th / data-ta e avisa os outros módulos.
import { state, emit } from '../state.js';
import { LANGS, ensureLang, t, locale } from '../i18n/index.js';
import { store } from '../store.js';

function apply(l, { save = true } = {}) {
  state.lang = LANGS.includes(l) ? l : 'en';
  document.documentElement.lang = state.lang;
  document.querySelector('meta[name="description"]').content = t('meta.description');
  document.querySelectorAll('[data-t]').forEach(el => { el.textContent = t(el.dataset.t); });
  document.querySelectorAll('[data-th]').forEach(el => { el.innerHTML = t(el.dataset.th); });
  document.querySelectorAll('[data-ta]').forEach(el => el.dataset.ta.split(',').forEach(pair => {
    const [attr, key] = pair.split(':'); el.setAttribute(attr, t(key));
  }));
  document.querySelectorAll('time.local-date').forEach(el => {
    el.textContent = new Date(el.getAttribute('datetime') + 'T12:00').toLocaleDateString(locale(), { day: 'numeric', month: 'short', year: 'numeric' });
  });
  document.querySelectorAll('.lang-btn').forEach(b => { const on = b.dataset.lang === state.lang; b.classList.toggle('pressed', on); b.setAttribute('aria-pressed', on); });
  emit('lang');
  if (save) store.set('lang', state.lang);
}

// síncrono quando a língua já está carregada; senão devolve uma promessa
export function setLang(l, opts) {
  const loading = ensureLang(l);
  return loading ? loading.then(() => apply(l, opts)) : apply(l, opts);
}

export function initLang() {
  document.querySelectorAll('.lang-btn').forEach(b => b.addEventListener('click', () => setLang(b.dataset.lang)));
}
