// Cartões como janelas: barra de título, arrastar para trocar, minimizar, expandir, fechar, ordem guardada.
import { state, cards, closed, DEFAULT_ORDER, DEFAULT_CLOSED, isSmall, on, emit } from '../state.js';
import { t } from '../i18n/index.js';
import { store } from '../store.js';

const board = document.getElementById('board');
const backdrop = document.getElementById('backdrop');
const searchIn = document.getElementById('search');
let ORIGINAL = [];

const CTL = {
  min: '<svg width="10" height="10" viewBox="0 0 10 10" aria-hidden="true"><rect x="1" y="7" width="7" height="2"/></svg>',
  max: '<svg width="10" height="10" viewBox="0 0 10 10" fill="none" stroke="#000" aria-hidden="true"><rect x=".5" y=".5" width="9" height="9"/><path d="M0 1.5h10" stroke-width="2"/></svg>',
  close: '<svg width="9" height="8" viewBox="0 0 8 7" aria-hidden="true"><path d="M0 0h2l2 2 2-2h2L5 3.5 8 7H6L4 5 2 7H0l3-3.5z"/></svg>'
};

// nome e botões da barra de cada cartão, na língua atual
function updateBar(card) {
  const label = t('card.' + card.id);
  card.querySelector('.bar .name').textContent = label.toLowerCase() + '.exe';
  card.querySelector('[data-act="min"]').setAttribute('aria-label', `${t(card.classList.contains('collapsed') ? 'ctl.restore' : 'ctl.min')} ${label}`);
  card.querySelector('[data-act="max"]').setAttribute('aria-label', `${t('ctl.max')} ${label}`);
  card.querySelector('[data-act="close"]').setAttribute('aria-label', `${t('ctl.close')} ${label}`);
}

function flash(card) { card.classList.remove('flash'); void card.offsetWidth; card.classList.add('flash'); }

function swapCards(a, b) {
  // troca na ordem guardada e volta a distribuir: sobrevive a redimensionar e recarregar
  const i = cards.indexOf(a), j = cards.indexOf(b);
  [cards[i], cards[j]] = [cards[j], cards[i]];
  emit('layout');
  saveOrder();
  emit('tasks');
  [a, b].forEach(flash);
}
function saveOrder() { store.set('cardOrder', JSON.stringify(cards.map(c => c.id))); }
function restoreOrder() {
  let ids = null;
  try { ids = JSON.parse(store.get('cardOrder')); } catch (e) {}
  if (!Array.isArray(ids)) return;
  const byKey = Object.fromEntries(cards.map(c => [c.id, c]));
  const ordered = ids.map(id => byKey[id]).filter(Boolean);
  cards.forEach(c => { if (!ordered.includes(c)) ordered.push(c); });
  cards.splice(0, cards.length, ...ordered);
}

export function collapseExpanded() {
  cards.forEach(c => c.classList.remove('expanded'));
  backdrop.hidden = true;
}
function toggleExpand(card) {
  const expand = !card.classList.contains('expanded');
  collapseExpanded();
  if (expand) { card.classList.remove('collapsed'); card.classList.add('expanded'); backdrop.hidden = false; card.querySelector('.ctl[data-act="max"]').focus(); }
}

export function goTo(card) {
  card.classList.remove('collapsed'); updateBar(card);
  if (closed.has(card.id) || card.hidden) {
    closed.delete(card.id);
    emit('refresh');
    if (card.hidden) { searchIn.value = ''; emit('refresh'); }   // a pesquisa estava a escondê-lo
  }
  if (isSmall()) card.scrollIntoView({ block: 'start' });
  flash(card);
  emit('tasks');
}

export function resetDesktop() {
  collapseExpanded();
  cards.splice(0, cards.length, ...ORIGINAL);
  store.del('cardOrder');
  closed.clear(); DEFAULT_CLOSED.forEach(id => closed.add(id));
  cards.forEach(c => { c.classList.remove('collapsed'); c.style.transform = ''; updateBar(c); });
  searchIn.value = '';
  emit('refresh');
}

// arrastar: larga um cartão em cima de outro e trocam de lugar; fora de um cartão, volta ao sítio
function startDrag(card, bar, e) {
  e.preventDefault();
  const sx = e.clientX, sy = e.clientY;
  let target = null, moved = false, ticking = false, px = 0, py = 0, done = false;
  bar.setPointerCapture(e.pointerId);
  const hit = () => {
    ticking = false;
    const under = document.elementFromPoint(px, py);
    const t = under && under.closest('.card');
    const next = t && t !== card ? t : null;
    if (next !== target) {
      target && target.classList.remove('drop-target');
      target = next;
      target && target.classList.add('drop-target');
    }
  };
  const move = ev => {
    const dx = ev.clientX - sx, dy = ev.clientY - sy;
    if (!moved && Math.hypot(dx, dy) < 5) return;
    moved = true;
    card.classList.remove('snap');
    card.classList.add('dragging');
    board.classList.add('drag-active');
    card.style.transform = `translate(${dx}px, ${dy}px)`;
    px = ev.clientX; py = ev.clientY;
    if (!ticking) { ticking = true; requestAnimationFrame(hit); }
  };
  const up = () => {
    if (done) return; done = true;
    ['lostpointercapture', 'pointermove', 'pointerup', 'pointercancel'].forEach(ev => bar.removeEventListener(ev, ev === 'pointermove' ? move : up));
    card.classList.remove('dragging');
    board.classList.remove('drag-active');
    if (target) {
      target.classList.remove('drop-target');
      card.style.transform = '';
      swapCards(card, target);
    } else if (moved) {
      card.classList.add('snap');
      card.style.transform = '';
    }
  };
  bar.addEventListener('pointermove', move);
  bar.addEventListener('pointerup', up);
  bar.addEventListener('pointercancel', up);
  bar.addEventListener('lostpointercapture', up);
}

export function initCards() {
  cards.forEach(card => {
    const bar = document.createElement('div');
    bar.className = 'bar';
    bar.innerHTML = `<svg class="px grip" data-px="grip"></svg><span class="name"></span>
      <button class="ctl raised" data-act="min">${CTL.min}</button>
      <button class="ctl raised" data-act="max">${CTL.max}</button>
      <button class="ctl raised" data-act="close">${CTL.close}</button>`;
    card.prepend(bar);

    bar.addEventListener('click', e => {
      const b = e.target.closest('[data-act]'); if (!b) return;
      const act = b.dataset.act;
      if (act === 'min') { if (card.classList.contains('expanded')) collapseExpanded(); card.classList.toggle('collapsed'); updateBar(card); }
      if (act === 'max') toggleExpand(card);
      if (act === 'close') { collapseExpanded(); closed.add(card.id); emit('refresh'); }
    });
    bar.addEventListener('pointerdown', e => {
      if (isSmall() || card.classList.contains('expanded') || e.target.closest('button') || e.button !== 0) return;
      startDrag(card, bar, e);
    });
  });
  cards.sort((a, b) => (DEFAULT_ORDER.indexOf(a.id) + 1 || 99) - (DEFAULT_ORDER.indexOf(b.id) + 1 || 99));
  ORIGINAL = [...cards];
  restoreOrder();

  backdrop.addEventListener('click', collapseExpanded);
  on('goto', goTo);
  on('lang', () => cards.forEach(updateBar));
}
