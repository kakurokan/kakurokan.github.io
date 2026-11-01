// Koji, o gato: anda pelos cartões, salta entre eles e às vezes dorme. Só é descarregado no ecrã grande.
import { state as app, cards, isSmall } from '../state.js';
import { t } from '../i18n/index.js';

const el = document.getElementById('cat');
const svg = el.querySelector('svg');
const meowEl = el.querySelector('.meow');
const W = 48, H = 36, PX = 3;
// O = contorno, B = pelo branco, S = riscas laranja, E = olho, P = nariz/orelha
const F = {
  walk1: ['...........O..O.','O.........OBOOBO','OS........OBSSBO','.OB.......OBEBEO','..OS......OBBPBO','..OBOOOOOOOBBBO.','..OBSBBSBBSBBBO.','..OBSBBSBBSBBO..','..OBSBBSBBSBBO..','..OBOOOOOOOOBO..','..OBO....OBO....','..OO.....OO.....'],
  walk2: ['...........O..O.','O.........OBOOBO','OS........OBSSBO','.OB.......OBEBEO','..OS......OBBPBO','..OBOOOOOOOBBBO.','..OBSBBSBBSBBBO.','..OBSBBSBBSBBO..','..OBSBBSBBSBBO..','..OBOOOOOOOOBO..','...OBO..OBO.....','....OO...OO.....'],
  sit:   ['...........O..O.','..........OBOOBO','..........OBSSBO','..........OBEBEO','..........OBBPBO','........OOOBBBO.','.......OBSBBSBO.','......OBBSBBSBO.','......OBBSBBSBO.','O.....OBBSBBSBO.','OS....OBBOBBBBO.','.OOOOOOOOOOOOOO.'],
  sleep: ['................','................','................','................','................','........O..O....','...OOOOOOBOOBO..','..OBSBBSBBSBBBO.','.OBBSBBSBBOOBBO.','.OBBSBBSBBSBPBO.','.OOBSBBSBBSBBBO.','..OOOOOOOOOOOOO.'],
  sleep2:['................','................','................','................','................','................','...OOOOOO.O..O..','..OBSBBSBOBOOBO.','.OBBSBBSBBOOBBO.','.OBBSBBSBBSBPBO.','.OOBSBBSBBSBBBO.','..OOOOOOOOOOOOO.'],
  angry: ['...OOO....OOO...','....OBOOOOBO....','....OOBBBBOO....','....OEOBBOEO....','....OBBPPBBO....','.....OBBBBO.....','..OOOBSBBSBOOO..','.OBBOBSBBSBOBBO.','.OO.OBSBBSBO.OO.','....OBBBBBBO....','...OBBOOOOBBO.SO','...OO......OO.OS'],
  jump:  ['................','...........O..O.','O.........OBOOBO','OS........OBSSBO','.OB.......OBEBEO','..OBOOOOOOOBBPBO','..OBSBBSBBSBBBO.','..OBSBBSBBSBBO..','.OBOOOOOOOOOBO..','OBO.........OBO.','OO...........OO.','................']
};
const CLS = { O: 'o', B: 'b', S: 's', E: 'e', P: 'p' };
const SVG = {};
for (const [k, rows] of Object.entries(F)) {
  let r = '';
  rows.forEach((row, y) => { let x = 0; while (x < 16) { const c = row[x]; if (c === '.') { x++; continue; } let w = 1; while (x + w < 16 && row[x + w] === c) w++; r += `<rect class="${CLS[c]}" x="${x}" y="${y}" width="${w}" height="1"/>`; x += w; } });
  SVG[k] = r;
}
let frameName = '';
const show = name => { if (name !== frameName) { svg.innerHTML = SVG[name]; frameName = name; } };

const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
const rnd = (a, b) => a + Math.random() * (b - a);
const FLOOR = { floor: true };
let plat = null, x = 0, y = 0, dir = 1, state = 'sit', timer = 1.5, anim = 0;
let jump = null, vy = 0, last = 0, running = false;

// plataformas = topo de cada cartão visível (dentro da área visível da sua coluna) + a barra de tarefas
// loose: usado ao cair, aceita cartões cujo topo está quase no fundo da coluna ou do ecrã
function rectOf(p, loose = false) {
  if (p === FLOOR) { const tb = document.querySelector('.taskbar').getBoundingClientRect(); return { left: 0, right: innerWidth, top: tb.top }; }
  if (!p.isConnected || p.hidden || p.classList.contains('expanded')) return null;
  const r = p.getBoundingClientRect();
  if (!r.width) return null;
  const col = p.parentElement && p.parentElement.classList.contains('col') ? p.parentElement.getBoundingClientRect() : null;
  if (col && (r.top < col.top - 2 || r.top > col.bottom - (loose ? 6 : 50))) return null;
  if (r.top < 20 || r.top > (loose ? document.querySelector('.taskbar').getBoundingClientRect().top - 6 : innerHeight - 60)) return null;
  return { left: r.left, right: r.right, top: r.top };
}
function platforms(loose = false) {
  return cards.map(c => ({ el: c, r: rectOf(c, loose) })).filter(p => p.r);
}
function clampX(r) { x = Math.max(r.left, Math.min(r.right - W, x)); }

function startJump(target) {
  const tr = rectOf(target); if (!tr) return false;
  const tx = rnd(tr.left + 4, Math.max(tr.left + 5, tr.right - W - 4));
  dir = tx >= x ? 1 : -1;
  const dist = Math.hypot(tx - x, tr.top - y);
  // altura do salto: mais alto para subir, mas sem sair pelo topo do ecrã
  const h = Math.max(12, Math.min(50 + Math.max(0, y - tr.top) * 0.6, Math.min(y, tr.top) - H - 4));
  jump = { target, sx: x, sy: y, tx, t: 0, dur: Math.min(1.1, 0.45 + dist / 900), h };
  state = 'jump'; show('jump');
  return true;
}
function jumpSomewhere() {
  const opts = platforms().filter(p => p.el !== plat && Math.abs(p.r.top - y) < 520 && Math.abs((p.r.left + p.r.right) / 2 - x) < 720);
  if (!opts.length) return false;
  opts.sort((a, b) => Math.hypot(a.r.left - x, a.r.top - y) - Math.hypot(b.r.left - x, b.r.top - y));
  const pick = opts[Math.floor(Math.random() * Math.min(4, opts.length))];
  return startJump(pick.el);
}
function decide() {
  const r = Math.random();
  if (r < 0.14) { state = 'sleep'; timer = rnd(7, 16); }
  else if (r < 0.38) { state = 'sit'; timer = rnd(1.5, 4); }
  else if (r < 0.62 && jumpSomewhere()) {}
  else { state = 'walk'; timer = rnd(2, 6); if (Math.random() < 0.4) dir = -dir; }
}
function land(target) {
  plat = target; jump = null; state = 'sit'; timer = rnd(0.6, 1.6); vy = 0;
  if (huff) {   // acabou de ser largado: resmunga e afasta-se
    huff = false; timer = 1.2;
    setTimeout(() => { if (state === 'sit') { say(t('cat.huff'), 1400); } }, 150);
  }
}
function fallTarget() {
  // cartão mais perto por baixo do gato, senão a barra de tarefas
  const below = platforms(true).filter(p => p.r.top >= y - 2 && x + W / 2 > p.r.left && x + W / 2 < p.r.right).sort((a, b) => a.r.top - b.r.top);
  return below.length ? below[0].el : FLOOR;
}

function step(dt) {
  anim += dt;
  if (state === 'held' || grab) return;   // agarrado (ou com o rato premido): fica quieto
  if (state === 'jump') {
    const tr = rectOf(jump.target);
    if (!tr) { state = 'fall'; jump = null; return; }
    jump.t = Math.min(1, jump.t + dt / jump.dur);
    const t = jump.t;
    x = jump.sx + (jump.tx - jump.sx) * t;
    y = jump.sy + (tr.top - jump.sy) * t - jump.h * 4 * t * (1 - t);
    if (t >= 1) { y = tr.top; land(jump.target); }
    return;
  }
  if (state === 'fall') {
    show('jump');
    vy += 1600 * dt; y += vy * dt;
    const tgt = fallTarget(), tr = rectOf(tgt, true);
    if (tr && y >= tr.top) { y = tr.top; land(tgt); }
    if (y > innerHeight) { y = rectOf(FLOOR).top; land(FLOOR); }
    return;
  }
  const r = rectOf(plat);
  if (!r) { state = 'fall'; vy = 0; return; }
  y = r.top;
  timer -= dt;
  if (state === 'walk') {
    x += dir * 42 * dt;
    show(Math.floor(anim * 6) % 2 ? 'walk1' : 'walk2');
    if (x <= r.left || x >= r.right - W) {
      clampX(r);
      if (Math.random() < 0.5 && jumpSomewhere()) return;
      dir = -dir;
    }
    if (timer <= 0) decide();
  } else if (state === 'sit') {
    clampX(r); show('sit');
    if (timer <= 0) decide();
  } else if (state === 'sleep') {
    clampX(r); show(Math.floor(anim / 1.2) % 2 ? 'sleep' : 'sleep2');
    if (timer <= 0) { state = 'sit'; timer = rnd(1, 2.5); }
  }
}
function render() {
  el.classList.toggle('left', dir < 0);
  el.style.transform = `translate(${Math.round(x)}px, ${Math.round(y - H + 1)}px)`;
  el.classList.toggle('sleeping', state === 'sleep');
  el.classList.toggle('low', y - H < 34);   // perto do topo: nome e miau aparecem por baixo
}
function loop(ts) {
  if (!running) return;
  const dt = Math.min(0.05, (ts - (last || ts)) / 1000); last = ts;
  step(dt); render();
  requestAnimationFrame(loop);
}

let meowT;
function say(text, ms = 1300) {
  meowEl.textContent = text;
  meowEl.hidden = false; el.classList.add('meowing'); clearTimeout(meowT);
  meowT = setTimeout(() => { meowEl.hidden = true; el.classList.remove('meowing'); }, ms);
}
function meow() {
  say(app.lang === 'pt' ? 'miau!' : 'meow!');
  if (reduce) return;
  if (state === 'sleep') { state = 'sit'; timer = rnd(1, 2); }
  else if (state !== 'jump' && state !== 'fall') jumpSomewhere();
}

// arrastar o gato: fica irritado enquanto está no ar e, ao largar, cai no cartão de baixo
let grab = null, huff = false;
el.addEventListener('pointerdown', e => {
  if (e.button !== 0) return;
  e.preventDefault();
  el.setPointerCapture(e.pointerId);
  // ox/oy: onde, dentro do gato, o rato o apanhou (para ele não saltar para debaixo do cursor)
  grab = { sx: e.clientX, sy: e.clientY, ox: e.clientX - x, oy: e.clientY - (y - H + 1), moved: false };
});
el.addEventListener('pointermove', e => {
  if (!grab) return;
  if (!grab.moved && Math.hypot(e.clientX - grab.sx, e.clientY - grab.sy) < 5) return;
  if (!grab.moved) { grab.moved = true; state = 'held'; jump = null; plat = null; el.classList.add('held'); show('angry'); say(t('cat.angry'), 60000); }
  x = Math.max(0, Math.min(innerWidth - W, e.clientX - grab.ox));
  y = Math.max(H, Math.min(innerHeight - 4, e.clientY - grab.oy + H - 1));
  if (!running) render();
});
// cartão que está por trás do gato (centro do corpo), se houver
function cardUnder() {
  const px = x + W / 2, py = y - H / 2;
  return cards.find(c => {
    if (c.hidden || c.classList.contains('expanded')) return false;
    const r = c.getBoundingClientRect();
    return r.width && px > r.left && px < r.right && py > r.top && py < r.bottom;
  });
}
function release() {
  if (!grab) return;
  const wasDrag = grab.moved; grab = null;
  if (!wasDrag) { meow(); return; }
  el.classList.remove('held');
  meowEl.hidden = true; el.classList.remove('meowing');
  huff = true; vy = 0; state = 'fall';
  const under = cardUnder();   // solto em cima de um cartão: sobe para o topo dele (a primeira aba que encontra)
  if (under && running && startJump(under)) return;
  if (!running) {   // movimento reduzido: aterra logo
    const tgt = under || fallTarget(), tr = rectOf(tgt, true); y = tr ? tr.top : y; plat = tgt; state = 'sleep'; show('sleep'); render();
  }
}
el.addEventListener('pointerup', release);
el.addEventListener('pointercancel', release);

function start() {
  if (state === 'held' || grab) return;   // não mexer no gato enquanto alguém o tem na mão
  if (isSmall()) { el.hidden = true; running = false; return; }
  el.hidden = false;
  if (!plat || !rectOf(plat)) {
    plat = document.getElementById('welcome');
    const r = rectOf(plat) || (plat = FLOOR, rectOf(FLOOR));
    x = r.left + 24; y = r.top;
  }
  if (reduce) { state = 'sleep'; show('sleep'); render(); running = false; return; }
  if (!running) { running = true; last = 0; requestAnimationFrame(loop); }
}

export const cat = { start };
