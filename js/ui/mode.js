// Modo simples (para recrutadores): uma coluna, sem desktop retro. Guardado no localStorage e em ?simple.
import { state, on, emit } from '../state.js';
import { t } from '../i18n/index.js';
import { store } from '../store.js';
import { collapseExpanded } from './cards.js';
import { toggleStart } from './startmenu.js';
import { setLang } from './lang.js';

const modeBtn = document.getElementById('modebtn');

function trimTitles() { if (state.simple) document.querySelectorAll('.card h2').forEach(h => { h.textContent = h.textContent.replace(/^#\s*/, ''); }); }
function updateMode() { modeBtn.textContent = (state.simple ? '← ' : '★ ') + t(state.simple ? 'mode.retro' : 'mode.simple'); }

// lê ?simple (ou a última escolha) e liga o modo logo no arranque, antes do primeiro desenho
export function applyInitialMode() {
  const urlSimple = new URLSearchParams(location.search).get('simple');
  if (urlSimple !== null ? urlSimple !== '0' : store.get('mode') === 'simple') { state.simple = true; document.body.classList.add('simple'); }
  updateMode(); trimTitles();
}

export function setSimple(enabled, { save = true } = {}) {
  state.simple = enabled;
  document.body.classList.toggle('simple', enabled);
  if (enabled) { collapseExpanded(); toggleStart(false); }
  emit('simple', enabled);
  if (!enabled) setLang(state.lang, { save: false });   // repõe os títulos com "#"
  updateMode(); trimTitles();
  emit('refresh');
  emit('cat');
  window.scrollTo(0, 0);
  if (save) {
    store.set('mode', enabled ? 'simple' : 'retro');
    try { const u = new URL(location.href); if (enabled) u.searchParams.set('simple', '1'); else u.searchParams.delete('simple'); history.replaceState(null, '', u); } catch (e) {}
  }
}

export function initMode() {
  modeBtn.addEventListener('click', () => setSimple(!state.simple));
  document.getElementById('w-simple').addEventListener('click', e => { e.preventDefault(); setSimple(true); });
  on('lang', () => { updateMode(); trimTitles(); });
}
