// Layout: cartões em colunas lado a lado (uma coluna no ecrã pequeno e no modo simples).
import { state, cards, isSmall, SIMPLE_ORDER, on } from '../state.js';
import { debounce } from '../util.js';

const board = document.getElementById('board');
const COL_MIN = 270, GAP = 30;
let lastSignature = '';

export function layout() {
  const n = isSmall() ? 1 : Math.max(1, Math.floor((board.clientWidth + GAP) / (COL_MIN + GAP)));
  const rank = c => SIMPLE_ORDER.indexOf(c.id);
  const list = state.simple ? [...cards].sort((a, b) => rank(a) - rank(b)) : cards;
  // nada mudou desde a última distribuição (nº de colunas, ordem, cartões escondidos): não mexe no DOM
  const signature = n + '|' + list.map(c => c.id + (c.hidden ? '!' : '')).join(',');
  if (signature === lastSignature) return;
  lastSignature = signature;

  // refazer as colunas tira os cartões do DOM e o scroll deles volta a zero: guarda-o e repõe-no no fim
  const pageY = scrollY, colY = [...board.children].map(c => c.scrollTop);
  const innerY = cards.map(c => { const el = c.querySelector('.inner'); return [el, el ? el.scrollTop : 0]; });

  const cols = Array.from({ length: n }, () => { const d = document.createElement('div'); d.className = 'col'; return d; });
  board.replaceChildren(...cols);
  // posição fixa por índice: cartão i vai para a coluna i % n, por isso uma troca mantém-se ao redimensionar
  let i = 0;
  list.forEach(card => { (card.hidden ? cols[n - 1] : cols[i++ % n]).appendChild(card); });
  innerY.forEach(([el, y]) => { if (y) el.scrollTop = y; });
  if (colY.length === n) cols.forEach((c, k) => { if (colY[k]) c.scrollTop = colY[k]; });
  if (scrollY !== pageY) scrollTo(0, pageY);
}

export function initLayout() {
  on('layout', layout);
  window.addEventListener('resize', debounce(layout, 120));
}
