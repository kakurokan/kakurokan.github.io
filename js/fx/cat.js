// Koji, o gato: anda pelos cartões, salta entre eles e às vezes dorme. Segue o cursor com a cabeça quando está
// sentado, vai ver o cartão que acabou de ser aberto e de noite passa quase o tempo todo a dormir.
// Só é descarregado no ecrã grande.
import { state as app, cards, isSmall, on } from '../state.js';
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
  sitUp: ['...........O..O.','..........OBOOBO','..........OBEBEO','..........OBBBBO','..........OBBPBO','........OOOBBBO.','.......OBSBBSBO.','......OBBSBBSBO.','......OBBSBBSBO.','O.....OBBSBBSBO.','OS....OBBOBBBBO.','.OOOOOOOOOOOOOO.'],   // olhos para cima
  crouch: ['................','................','...........O..O.','..........OBOOBO','..........OBSSBO','O.........OBEBEO','OS........OBBPBO','.OOOOOOOOOOBBBO.','..OBSBBSBBSBBBO.','..OBSBBSBBSBBO..','..OBSBBSBBSBBO..','..OOOOOOOOOOOO..'],   // agachado: antes de saltar e ao aterrar
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
let jump = null, vy = 0, last = 0, running = false, squash = 0;
const G = 1500;   // gravidade dos saltos, em px/s²

// de noite (hora de quem visita) o gato quase só dorme
const isNight = () => { const h = new Date().getHours(); return h >= 23 || h < 7; };
const nap = () => { state = 'sleep'; timer = isNight() ? rnd(25, 50) : rnd(7, 16); };

// cartão acabado de abrir (barra de tarefas, ícones, prompt…): o gato vai lá ver. De noite não se levanta por isso.
let wanted = null, wantedUntil = 0;
on('goto', card => { if (card && !(state === 'sleep' && isNight())) { wanted = card; wantedUntil = performance.now() + 8000; } });

// onde anda o cursor, para o gato olhar para ele quando está sentado
let mouse = null;
window.addEventListener('pointermove', e => { mouse = { x: e.clientX, y: e.clientY }; }, { passive: true });
document.documentElement.addEventListener('mouseleave', () => { mouse = null; });

// plataformas = topo de cada cartão visível (dentro da área visível da sua coluna) + a barra de tarefas
// loose: usado ao cair, aceita cartões cujo topo está quase no fundo da coluna ou do ecrã
// fundo de um cartão onde o gato foi largado (já passou o topo): aterra ali, como se o rebordo o apanhasse
const edges = new Map();
const edgeOf = c => { if (!edges.has(c)) edges.set(c, { edge: c }); return edges.get(c); };
function rectOf(p, loose = false) {
  if (p.edge) {
    const c = p.edge;
    if (!c.isConnected || c.hidden || c.classList.contains('expanded')) return null;
    const r = c.getBoundingClientRect();
    if (!r.width || r.bottom > document.querySelector('.taskbar').getBoundingClientRect().top) return null;
    return { left: r.left, right: r.right, top: r.bottom };
  }
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
  // salto balístico: sobe até passar o destino (mais alto quanto mais longe, sem sair pelo topo do ecrã) e cai com a
  // gravidade, por isso a duração vem da física e não de um valor fixo
  const rise = Math.max(0, y - tr.top);
  const up = Math.max(rise + 8, Math.min(rise + 24 + Math.abs(tx - x) * 0.15, y - H - 4));
  const down = up - (y - tr.top);
  jump = { target, sx: x, sy: y, tx, t: 0, prep: 0.14, v0: Math.sqrt(2 * G * up), T: Math.sqrt(2 * up / G) + Math.sqrt(2 * down / G) };
  state = 'crouch'; show('crouch');   // agacha-se um instante antes de saltar
  return true;
}
// longe demais para um salto só (um gato salta umas 6 vezes a sua altura): mais de 230 px a subir ou 560 px para o lado
const far = r => y - r.top > 230 || Math.abs((r.left + r.right) / 2 - (x + W / 2)) > 560;
// vai para um cartão; se estiver longe, salta primeiro para um cartão intermédio que fique mais perto do destino
function hopToward(target) {
  const tr = rectOf(target); if (!tr) return false;
  if (!far(tr)) return startJump(target);
  const mid = r => (r.left + r.right) / 2, d = r => Math.hypot(mid(r) - mid(tr), r.top - tr.top);
  const here = Math.hypot(x + W / 2 - mid(tr), y - tr.top);
  const via = platforms().filter(p => p.el !== plat && p.el !== target && !far(p.r) && d(p.r) < here - 40).sort((a, b) => d(a.r) - d(b.r))[0];
  return startJump(via ? via.el : target);
}
function jumpSomewhere() {
  const opts = platforms().filter(p => p.el !== plat && !far(p.r) && p.r.top - y < 520);
  if (!opts.length) return false;
  opts.sort((a, b) => Math.hypot(a.r.left - x, a.r.top - y) - Math.hypot(b.r.left - x, b.r.top - y));
  const pick = opts[Math.floor(Math.random() * Math.min(4, opts.length))];
  return startJump(pick.el);
}
function decide() {
  const r = Math.random();
  if (r < (isNight() ? 0.7 : 0.14)) nap();
  else if (r < 0.38) { state = 'sit'; timer = rnd(1.5, 4); }
  else if (r < 0.62 && jumpSomewhere()) {}
  else { state = 'walk'; timer = rnd(2, 6); if (Math.random() < 0.4) dir = -dir; }
}
function land(target) {
  plat = target; jump = null; state = 'sit'; timer = rnd(0.6, 1.6); vy = 0; squash = 0.12;   // amortece a queda
  if (huff) {   // acabou de ser largado: resmunga e afasta-se
    huff = false; timer = 1.2;
    setTimeout(() => { if (state === 'sit') { say(t('cat.huff'), 1400); } }, 150);
  }
}
function fallTarget(from = y) {   // from: onde o gato estava antes deste passo (um passo grande não pode saltar por cima da plataforma)
  // cartão mais perto por baixo do gato, senão a barra de tarefas
  const cx = x + W / 2;
  const opts = platforms(true).filter(p => p.r.top >= from - 2 && cx > p.r.left && cx < p.r.right).map(p => ({ el: p.el, top: p.r.top }));
  // largado dentro de um cartão: o fundo dele também pára a queda
  for (const c of cards) {
    const e = edgeOf(c), r = rectOf(e);
    if (r && cx > r.left && cx < r.right && c.getBoundingClientRect().top < from - 2 && r.top >= from - 2) opts.push({ el: e, top: r.top });
  }
  opts.sort((a, b) => a.top - b.top);
  return opts.length ? opts[0].el : FLOOR;
}

function step(dt) {
  anim += dt;
  if (state === 'held' || grab) return;   // agarrado (ou com o rato premido): fica quieto
  if (state === 'crouch') {
    show('crouch');
    jump.prep -= dt;
    if (jump.prep <= 0) state = 'jump';
    return;
  }
  if (state === 'jump') {
    const tr = rectOf(jump.target);
    if (!tr) { state = 'fall'; vy = 0; jump = null; return; }
    jump.t = Math.min(jump.T, jump.t + dt);
    const t = jump.t;
    x = jump.sx + (jump.tx - jump.sx) * t / jump.T;
    y = jump.sy - (jump.v0 * t - G * t * t / 2);
    show(jump.v0 - G * t > 0 ? 'jump' : 'walk1');   // a subir estica-se; a descer põe as patas para baixo
    if (t >= jump.T) { y = tr.top; land(jump.target); }
    return;
  }
  if (state === 'fall') {
    show('jump');
    const from = y;
    vy += 1600 * dt; y += vy * dt;
    const tgt = fallTarget(from), tr = rectOf(tgt, true);
    if (tr && y >= tr.top) { y = tr.top; land(tgt); }
    if (y > innerHeight) { y = rectOf(FLOOR).top; land(FLOOR); }
    return;
  }
  const r = rectOf(plat);
  if (!r) { state = 'fall'; vy = 0; return; }
  y = r.top;
  if (wanted) {
    if (performance.now() > wantedUntil || wanted === plat) wanted = null;
    else if (squash <= 0 && hopToward(wanted)) { if (jump.target === wanted) wanted = null; return; }   // se ainda não está à vista, tenta outra vez no próximo passo
  }
  if (squash > 0) { squash -= dt; clampX(r); show('crouch'); return; }
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
    clampX(r);
    const dx = mouse ? mouse.x - (x + W / 2) : 0;
    if (Math.abs(dx) > 14) dir = dx > 0 ? 1 : -1;   // vira a cabeça para o cursor
    show(mouse && y - mouse.y > 70 && Math.abs(dx) < 260 ? 'sitUp' : 'sit');
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
  else if (state !== 'jump' && state !== 'crouch' && state !== 'fall') jumpSomewhere();
}

// arrastar o gato: fica irritado enquanto está no ar e, ao largar, cai e pára na primeira aba que encontra
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
function release() {
  if (!grab) return;
  const wasDrag = grab.moved; grab = null;
  if (!wasDrag) { meow(); return; }
  el.classList.remove('held');
  meowEl.hidden = true; el.classList.remove('meowing');
  huff = true; vy = 0; state = 'fall';
  if (!running) {   // movimento reduzido: aterra logo; senão cai e pára na primeira aba que encontra
    const tgt = fallTarget(), tr = rectOf(tgt, true); y = tr ? tr.top : y; plat = tgt; state = 'sleep'; show('sleep'); render();
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
    if (isNight()) nap();
  }
  if (reduce) { state = 'sleep'; show('sleep'); render(); running = false; return; }
  if (!running) { running = true; last = 0; requestAnimationFrame(loop); }
}

export const cat = { start };
