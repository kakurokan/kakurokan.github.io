// Wallpaper do tema Game Boy: pixel art desenhada num canvas. Só é descarregado quando esse tema está ativo.
import { state } from '../state.js';

const canvas = document.getElementById('gbwall');
const ctx = canvas.getContext('2d');
const SHADE = ['#0F380F', '#306230', '#8BAC0F', '#9BBC0F'];           // 0 = mais escuro … 3 = mais claro
const RGB = SHADE.map(h => [1, 3, 5].map(i => parseInt(h.slice(i, i + 2), 16)));
const BAYER = [[0, 8, 2, 10], [12, 4, 14, 6], [3, 11, 1, 9], [15, 7, 13, 5]];
const dith = (x, y, t) => t * 16 > BAYER[y & 3][x & 3];               // dithering ordenado, como nos jogos
const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
let W = 0, H = 0, bg = null, timer = null, frame = 0, clouds = [], cat = 0;

const CLOUD = ['....3333......', '..33333333.33.', '.3333333333333', '33333333333333', '.222222222222.'];
const CAT = [
  ['........0.0', '0.......000', '.0.00000030', '..000000000', '..00000000.', '..0.0..0.0.'],
  ['........0.0', '0.......000', '.0.00000030', '..000000000', '..00000000.', '...00...00.']
];

function build() {
  if (!innerWidth || !innerHeight) return;   // janela sem tamanho (separador em segundo plano)
  const S = innerWidth < 760 ? 3 : 4;                                   // tamanho de cada pixel no ecrã
  W = Math.ceil(innerWidth / S); H = Math.ceil(innerHeight / S);
  canvas.width = W; canvas.height = H;
  const img = ctx.createImageData(W, H), px = new Uint8Array(W * H);
  const horizon = Math.floor(H * 0.64);

  // céu: verde médio no topo, mais claro perto do horizonte
  for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) px[y * W + x] = dith(x, y, Math.min(1, y / horizon) ** 1.4) ? 3 : 2;

  // sol às riscas
  const sx = W * 0.7, sy = H * 0.3, r = Math.max(10, Math.min(W, H) * 0.11);
  for (let y = Math.floor(sy - r - 6); y < sy + r + 6; y++) for (let x = Math.floor(sx - r - 6); x < sx + r + 6; x++) {
    if (x < 0 || y < 0 || x >= W || y >= H) continue;
    const d = Math.hypot(x - sx, y - sy);
    if (d <= r) {
      const stripe = y - sy > r * 0.1 && Math.floor((y - sy) / 3) % 2 === 1;   // riscas na metade de baixo
      px[y * W + x] = stripe ? 2 : 3;
    } else if (d <= r + 5 && dith(x, y, 0.5 - (d - r) / 10)) px[y * W + x] = 3;   // brilho à volta
  }

  // montanhas ao longe (com neve no cimo)
  const ridge = x => horizon - 6 - H * 0.08 * (1 + Math.sin(x * 0.021 + 1.3)) - H * 0.04 * Math.sin(x * 0.057 + 0.4) - 3 * Math.sin(x * 0.19);
  const peak = horizon - 6 - H * 0.2;
  for (let x = 0; x < W; x++) {
    const top = Math.floor(ridge(x));
    for (let y = Math.max(0, top); y < H; y++) {
      const snow = top < peak + H * 0.07 && y - top < 3 + (x % 3 === 0 ? 1 : 0);
      px[y * W + x] = snow ? 3 : (y - top < 2 && dith(x, y, 0.5) ? 2 : 1);
    }
  }

  // colinas perto, com pinheiros
  const hill = x => horizon + 4 - H * 0.035 * (1 + Math.sin(x * 0.033 + 2.1)) - 4 * Math.sin(x * 0.09);
  for (let x = 0; x < W; x++) {
    const top = Math.floor(hill(x));
    for (let y = Math.max(0, top); y < H; y++) px[y * W + x] = 0;
  }
  for (let tx = 4; tx < W; tx += 7 + (tx * 7919) % 6) {
    const base = Math.floor(hill(tx)) + 1, h = 6 + (tx * 31) % 5;
    for (let i = 0; i < h; i++) {
      const half = Math.floor(i / 2) % 3 + Math.floor(i / 4);
      for (let dx = -half; dx <= half; dx++) {
        const x = tx + dx, y = base - h + i;
        if (x >= 0 && x < W && y >= 0) px[y * W + x] = 0;
      }
    }
  }

  // chão
  const ground = H - 12;
  for (let y = ground; y < H; y++) for (let x = 0; x < W; x++) {
    px[y * W + x] = y === ground ? 0 : (dith(x, y, 0.18) ? 0 : 1);
  }
  for (let x = 0; x < W; x += 3 + (x % 4)) if (ground - 1 >= 0) px[(ground - 1) * W + x] = 1;   // tufos de relva

  for (let i = 0; i < px.length; i++) { const c = RGB[px[i]]; img.data.set([c[0], c[1], c[2], 255], i * 4); }
  bg = img;

  clouds = Array.from({ length: Math.max(4, Math.round(W / 90)) }, (_, i) => ({
    x: (i * 97 + 13) % W, y: 6 + (i * 37) % Math.max(10, Math.floor(H * 0.32)), v: 0.25 + (i % 3) * 0.15
  }));
  cat = W * 0.2;
}

function sprite(rows, ox, oy) {
  rows.forEach((row, y) => [...row].forEach((ch, x) => {
    if (ch === '.') return;
    ctx.fillStyle = SHADE[+ch];
    ctx.fillRect(Math.round(ox) + x, Math.round(oy) + y, 1, 1);
  }));
}
function draw() {
  if (!bg) return;
  ctx.putImageData(bg, 0, 0);
  clouds.forEach(c => sprite(CLOUD, c.x, c.y));
  sprite(CAT[frame % 2], cat, H - 9);
}
function step() {
  frame++;
  clouds.forEach(c => { c.x -= c.v; if (c.x < -16) c.x = W + 4; });
  cat += 1; if (cat > W + 12) cat = -12;
  draw();
}

function set(on) {
  clearInterval(timer); timer = null;
  if (!on) return;
  build(); draw();
  if (!reduce) timer = setInterval(step, 140);
}
let rt;
window.addEventListener('resize', () => {
  if (state.theme !== 'gameboy' || state.simple) return;
  clearTimeout(rt); rt = setTimeout(() => { build(); draw(); }, 150);
});
document.addEventListener('visibilitychange', () => set(state.theme === 'gameboy' && !document.hidden && !state.simple));

export const wall = { set };
