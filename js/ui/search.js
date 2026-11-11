// Pesquisa: mostra os cartões que têm o texto (mesmo fechados), destaca-o e abre os projetos que o têm.
import { state, cards, closed, unavailable, SIMPLE_ORDER, isSmall, on } from '../state.js';
import { t } from '../i18n/index.js';
import { norm, debounce } from '../util.js';
import { layout } from './layout.js';
import { renderTasks } from './taskbar.js';

const searchIn = document.getElementById('search');
const searchMsg = document.getElementById('search-msg');
const projectList = document.getElementById('project-list');
const board = document.getElementById('board');

// texto normalizado de cada cartão; fica em cache até o conteúdo mudar (evento "content")
const textCache = new Map();
const textOf = card => {
  let s = textCache.get(card);
  if (s === undefined) { s = norm(card.textContent); textCache.set(card, s); }
  return s;
};

// visibilidade: sem pesquisa mostra os cartões abertos; com pesquisa mostra os que têm o texto, mesmo fechados
export function refresh() {
  const q = state.simple ? '' : norm(searchIn.value.trim());
  let n = 0;
  cards.forEach(c => {
    const show = !unavailable.has(c.id) && (state.simple ? SIMPLE_ORDER.includes(c.id) : (q ? textOf(c).includes(q) : !closed.has(c.id)));
    c.hidden = !show;
    if (show) n++;
  });
  highlight(q);
  searchMsg.textContent = q ? (n ? t('search.found')(n) : t('search.none')) : '';
  renderTasks();
  layout();
}

let savedOpen = null;
function unmark() {
  board.querySelectorAll('mark').forEach(m => { const tn = document.createTextNode(m.textContent); m.replaceWith(tn); tn.parentNode.normalize(); });
}
function highlight(q) {
  unmark();
  const details = [...projectList.querySelectorAll('details')];
  if (!q) {
    if (savedOpen) { details.forEach((d, i) => { d.open = savedOpen[i] ?? d.open; }); savedOpen = null; }
    return;
  }
  if (!savedOpen) savedOpen = details.map(d => d.open);
  details.forEach(d => { d.open = norm(d.textContent).includes(q); });
  // só percorre os cartões à vista: os escondidos não têm nada para destacar
  const nodes = [];
  cards.filter(c => !c.hidden).forEach(card => {
    const walker = document.createTreeWalker(card, NodeFilter.SHOW_TEXT, {
      acceptNode: n => (n.parentElement.closest('.bar, svg, script, style, input') ? NodeFilter.FILTER_REJECT : NodeFilter.FILTER_ACCEPT)
    });
    while (walker.nextNode()) nodes.push(walker.currentNode);
  });
  nodes.forEach(node => {
    const text = node.nodeValue;
    // texto normalizado + mapa de volta para as posições originais (para ignorar acentos)
    let flat = '', map = [];
    for (let i = 0; i < text.length; i++) { const c = norm(text[i]); for (const ch of c) { flat += ch; map.push(i); } }
    let from = 0, idx, parts = [], last = 0;
    while ((idx = flat.indexOf(q, from)) !== -1) {
      const a = map[idx], b = map[idx + q.length - 1] + 1;
      parts.push([a, b]); from = idx + q.length;
    }
    if (!parts.length) return;
    const frag = document.createDocumentFragment();
    parts.forEach(([a, b]) => {
      frag.append(text.slice(last, a));
      const m = document.createElement('mark'); m.textContent = text.slice(a, b); frag.append(m);
      last = b;
    });
    frag.append(text.slice(last));
    node.replaceWith(frag);
  });
}

export function initSearch() {
  on('refresh', refresh);
  on('content', () => textCache.clear());
  on('lang', () => { textCache.clear(); if (searchIn.value) refresh(); });
  searchIn.addEventListener('input', debounce(refresh, 120));
  document.getElementById('search-form').addEventListener('submit', e => {
    e.preventDefault(); refresh();
    const first = cards.find(c => !c.hidden);
    if (first && searchIn.value.trim() && isSmall()) first.scrollIntoView({ block: 'start' });
  });
}
