// Temas. O wallpaper do Game Boy só é descarregado quando o tema é usado.
import { state, on } from '../state.js';
import { store } from '../store.js';
import { setPalette, hydrateIcons } from '../fx/icons.js';

export const THEMES = ['gameboy', 'vapor', 'rosa', 'menta', 'noite'];
export const THEME_ALIAS = { gb: 'gameboy', pink: 'rosa', mint: 'menta', night: 'noite', vaporwave: 'vapor' };

let wall = null;
async function syncWall() {
  const wanted = () => state.theme === 'gameboy' && !state.simple;
  if (wanted() && !wall) wall = (await import('../fx/wallpaper.js')).wall;
  if (wall) wall.set(wanted());   // reavalia depois do await: o tema pode ter mudado entretanto
}

export function setTheme(theme) {
  state.theme = theme;
  document.body.dataset.theme = theme;
  if (setPalette(theme === 'gameboy')) hydrateIcons();
  syncWall();
  document.querySelectorAll('.theme').forEach(b => b.setAttribute('aria-pressed', b.dataset.set === theme));
  store.set('theme', theme);
}

export function initThemes() {
  document.getElementById('theme-list').addEventListener('click', e => { const b = e.target.closest('[data-set]'); if (b) setTheme(b.dataset.set); });
  on('simple', syncWall);
  // separador escondido: as animações CSS param (o wallpaper trata do seu próprio relógio)
  document.addEventListener('visibilitychange', () => document.body.classList.toggle('idle', document.hidden));
}
