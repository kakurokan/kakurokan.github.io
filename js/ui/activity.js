// Cartão "Activity": últimos commits dos repositórios públicos, vindos da API pública do GitHub (sem token).
// Fica escondido até haver dados; se a API falhar (rede, limite de pedidos) o cartão simplesmente não aparece.
import { state, unavailable, on, emit } from '../state.js';
import { t, locale } from '../i18n/index.js';
import { store } from '../store.js';

const USER = 'kakurokan';
const API = `https://api.github.com/search/commits?q=author:${USER}&sort=author-date&order=desc&per_page=30`;
const TTL = 30 * 60 * 1000;   // a API sem token deixa 10 pesquisas por minuto: um pedido a cada meia hora chega e sobra
const SHOWN = 6;
const list = document.getElementById('activity-list');

let items = [], started = false;

function read() { try { return JSON.parse(store.get('activity')); } catch (e) { return null; } }
const valid = c => c && Array.isArray(c.items) && c.items.length && typeof c.at === 'number';

function ago(iso) {
  const s = (new Date(iso) - Date.now()) / 1000, rtf = new Intl.RelativeTimeFormat(locale(), { numeric: 'auto' });
  for (const [unit, secs] of [['day', 86400], ['hour', 3600], ['minute', 60]]) if (Math.abs(s) >= secs) return rtf.format(Math.round(s / secs), unit);
  return rtf.format(0, 'second');
}

function render() {
  if (!items.length) return;
  list.replaceChildren(...items.map(it => {
    const a = document.createElement('a'), msg = document.createElement('span'), meta = document.createElement('small');
    a.href = it.url; a.target = '_blank'; a.rel = 'noopener';
    msg.className = 'msg'; msg.textContent = it.msg;
    meta.textContent = `${it.repo} · ${ago(it.date)}`;
    a.append(msg, meta);
    return a;
  }));
}

function show(data) {
  items = data;
  render();
  unavailable.delete('activity');
  emit('content');
  emit('refresh');
}

async function load() {
  const cached = read();
  if (valid(cached) && Date.now() - cached.at < TTL) return show(cached.items);
  try {
    const ctl = new AbortController(), timer = setTimeout(() => ctl.abort(), 8000);
    const res = await fetch(API, { signal: ctl.signal, headers: { Accept: 'application/vnd.github+json' } });
    clearTimeout(timer);
    if (!res.ok) throw new Error(res.status);
    const json = await res.json();
    const fresh = json.items.filter(i => !/^Merge /.test(i.commit.message)).slice(0, SHOWN).map(i => ({
      msg: i.commit.message.split('\n')[0], repo: i.repository.name, date: i.commit.author.date, url: i.html_url
    }));
    if (!fresh.length) throw new Error('empty');
    store.set('activity', JSON.stringify({ at: Date.now(), items: fresh }));
    show(fresh);
  } catch (e) {
    if (valid(cached)) show(cached.items);   // sem rede ou limite atingido: serve a última versão guardada
  }
}

// só pede os dados quando o desktop retro está à vista, e só uma vez
function start() { if (started || state.simple) return; started = true; load(); }

export function initActivity() {
  on('lang', render);
  on('simple', start);
  setTimeout(start, 800);   // depois do primeiro desenho: não compete com o arranque
}
