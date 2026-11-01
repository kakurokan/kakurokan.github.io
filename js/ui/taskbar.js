// Barra de tarefas: um botão por cartão (premido = aberto).
import { cards, closed, on, emit } from '../state.js';
import { t } from '../i18n/index.js';

const tasks = document.getElementById('tasks');

export function renderTasks() {
  tasks.replaceChildren(...cards.map(card => {
    const b = document.createElement('button');
    const open = !closed.has(card.id);
    b.className = 'btn raised' + (open ? ' pressed' : '');
    b.textContent = t('card.' + card.id);
    b.setAttribute('aria-pressed', open);
    b.addEventListener('click', () => emit('goto', card));
    return b;
  }));
}

export function initTaskbar() {
  on('tasks', renderTasks);
  on('lang', renderTasks);
}
