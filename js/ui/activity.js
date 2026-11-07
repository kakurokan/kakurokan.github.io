// Cartão "Activity": gráfico de contribuições e últimos commits, vindos de APIs públicas (sem token).
// Fica escondido até haver dados; se tudo falhar (rede, limites) o cartão simplesmente não aparece,
// e cada parte esconde-se sozinha se o seu pedido falhar.
import { state, unavailable, on, emit } from '../state.js';
import { t, locale } from '../i18n/index.js';
import { store } from '../store.js';

const USER = 'kakurokan';
const COMMITS = `https://api.github.com/search/commits?q=author:${USER}&sort=author-date&order=desc&per_page=30`;   // 10 pesquisas/min sem token
const CONTRIBS = `https://github-contributions-api.jogruber.de/v4/${USER}?y=last`;                                 // serviço comunitário (CORS aberto)
const TTL = 30 * 60 * 1000;
const SHOWN = 6, WEEKS = 27;   // 27 semanas cabem no cartão com quadrados legíveis
const list = document.getElementById('activity-list');
const graph = document.getElementById('activity-graph');
const cap = document.getElementById('activity-cap');

let commits = [], days = [], started = false;

// pede o JSON, guarda-o no localStorage e, se o pedido falhar, serve a última cópia (mesmo velha)
async function cachedJson(key, url, pick, headers) {
  let cached = null;
  try { cached = JSON.parse(store.get(key)); } catch (e) {}
  const ok = cached && typeof cached.at === 'number' && Array.isArray(cached.data) && cached.data.length;
  if (ok && Date.now() - cached.at < TTL) return cached.data;
  try {
    const ctl = new AbortController(), timer = setTimeout(() => ctl.abort(), 8000);
    const res = await fetch(url, { signal: ctl.signal, headers });
    clearTimeout(timer);
    if (!res.ok) throw new Error(res.status);
    const data = pick(await res.json());
    if (!data.length) throw new Error('empty');
    store.set(key, JSON.stringify({ at: Date.now(), data }));
    return data;
  } catch (e) {
    return ok ? cached.data : null;
  }
}

function ago(iso) {
  const s = (new Date(iso) - Date.now()) / 1000, rtf = new Intl.RelativeTimeFormat(locale(), { numeric: 'auto' });
  for (const [unit, secs] of [['day', 86400], ['hour', 3600], ['minute', 60]]) if (Math.abs(s) >= secs) return rtf.format(Math.round(s / secs), unit);
  return rtf.format(0, 'second');
}

function renderCommits() {
  if (!commits.length) return;
  list.replaceChildren(...commits.map(it => {
    const a = document.createElement('a'), msg = document.createElement('span'), meta = document.createElement('small');
    a.href = it.url; a.target = '_blank'; a.rel = 'noopener';
    msg.className = 'msg'; msg.textContent = it.msg;
    meta.textContent = `${it.repo} · ${ago(it.date)}`;
    a.append(msg, meta);
    return a;
  }));
}

function renderGraph() {
  if (!days.length) return;
  const total = days.reduce((n, d) => n + d[1], 0), label = t('activity.graph')(total);
  const cells = days.map(([date, count, level], i) => {
    const c = document.createElement('i');
    c.dataset.l = level;
    c.title = `${date}: ${count}`;
    if (!i) c.style.gridRowStart = new Date(date + 'T00:00:00').getDay() + 1;   // a primeira semana pode começar a meio
    return c;
  });
  graph.replaceChildren(...cells);
  graph.setAttribute('aria-label', label);
  cap.textContent = label;
  graph.hidden = cap.hidden = false;
}

function render() { renderCommits(); renderGraph(); }

function reveal() {
  render();
  unavailable.delete('activity');
  emit('content');
  emit('refresh');
}

async function load() {
  const [c, g] = await Promise.all([
    cachedJson('activity', COMMITS, j => j.items.filter(i => !/^Merge /.test(i.commit.message)).slice(0, SHOWN).map(i => ({
      msg: i.commit.message.split('\n')[0], repo: i.repository.name, date: i.commit.author.date, url: i.html_url
    })), { Accept: 'application/vnd.github+json' }),
    cachedJson('contribs', CONTRIBS, j => j.contributions.slice(-WEEKS * 7).map(d => [d.date, d.count, d.level]))
  ]);
  if (c) commits = c;
  if (g) days = g;
  if (c || g) reveal();
}

// só pede os dados quando o desktop retro está à vista, e só uma vez
function start() { if (started || state.simple) return; started = true; load(); }

export function initActivity() {
  on('lang', render);
  on('simple', start);
  setTimeout(start, 800);   // depois do primeiro desenho: não compete com o arranque
}
