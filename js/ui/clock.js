// Relógio da barra de tarefas.
import { on } from '../state.js';
import { locale } from '../i18n/index.js';

const clockEl = document.getElementById('clock');

function tick() {
  const n = new Date();
  clockEl.textContent = String(n.getHours()).padStart(2, '0') + ':' + String(n.getMinutes()).padStart(2, '0');
  clockEl.title = n.toLocaleDateString(locale(), { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
}

export function initClock() {
  tick();
  setInterval(tick, 10000);
  on('lang', tick);
}
