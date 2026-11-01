// Menu Iniciar.
import { state } from '../state.js';
import { collapseExpanded, goTo, resetDesktop } from './cards.js';
import { THEMES, setTheme } from './themes.js';
import { setLang } from './lang.js';

const startBtn = document.getElementById('start');
const startMenu = document.getElementById('startmenu');

export function toggleStart(open) {
  open = open ?? startMenu.hidden;
  startMenu.hidden = !open;
  startBtn.classList.toggle('pressed', open);
  startBtn.setAttribute('aria-expanded', open);
  if (open) startMenu.querySelector('a, button').focus();
}

export function initStartMenu() {
  startBtn.addEventListener('click', () => toggleStart());
  document.getElementById('next-theme').addEventListener('click', () => {
    setTheme(THEMES[(THEMES.indexOf(state.theme) + 1) % THEMES.length]); toggleStart(false);
  });
  document.getElementById('menu-lang').addEventListener('click', () => { setLang(state.lang === 'en' ? 'pt' : 'en'); toggleStart(false); });
  document.getElementById('reset').addEventListener('click', () => { resetDesktop(); toggleStart(false); window.scrollTo(0, 0); });
  document.addEventListener('pointerdown', e => { if (!startMenu.hidden && !e.target.closest('#startmenu, #start')) toggleStart(false); });
  document.addEventListener('keydown', e => {
    if (e.key !== 'Escape') return;
    if (!startMenu.hidden) { toggleStart(false); startBtn.focus(); }
    else collapseExpanded();
  });
  // links internos (#about, #cv…) reabrem e destacam o cartão
  document.addEventListener('click', e => {
    const a = e.target.closest('a[href^="#"]'); if (!a) return;
    const card = document.getElementById(a.getAttribute('href').slice(1));
    if (card && card.classList.contains('card')) {
      e.preventDefault(); toggleStart(false);
      goTo(card);
      history.replaceState(null, '', '#' + card.id);
    }
  });
}
