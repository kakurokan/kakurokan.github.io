// Prompt de comando (cartão #Prompt). Os textos estão em data/terminal.js.
import { state, on, emit } from '../state.js';
import { LANGS } from '../i18n/index.js';
import { GOTO, TERM } from '../data/terminal.js';
import { esc } from '../util.js';
import { THEMES, THEME_ALIAS, setTheme } from './themes.js';
import { setLang } from './lang.js';

const termOut = document.getElementById('term-out');
const termIn = document.getElementById('term-in');
const termBox = document.getElementById('term');
const T = () => TERM[state.lang];

const say = s => { termOut.insertAdjacentHTML('beforeend', s + '\n'); emit('content'); };

const CMDS = {
  HELP: () => T().help,
  DIR: () => T().dir,
  TYPE: arg => {
    const f = (arg || '').toUpperCase();
    if (!f) return T().syntax;
    if (f === 'STACK.YML') return T().stack;
    if (['COMPET~1.LOG', 'COMPETICOES.LOG', 'COMPETITIONS.LOG'].includes(f)) return T().comp;
    if (f === 'CV.PDF') { emit('goto', document.getElementById('cv')); return T().opening('CV.pdf'); }
    return T().notFound;
  },
  START: arg => {
    const id = GOTO[(arg || '').toLowerCase()];
    if (!id) return T().startUsage;
    emit('goto', document.getElementById(id)); return '';
  },
  THEME: arg => {
    const a = (arg || '').toLowerCase(), th = THEME_ALIAS[a] || a;
    if (!THEMES.includes(th)) return T().themeUsage;
    setTheme(th); return T().themeSet(a);
  },
  LANG: arg => {
    const l = (arg || '').toLowerCase();
    if (!LANGS.includes(l)) return T().langUsage;
    setLang(l); return null;
  },
  WHOAMI: () => 'leo\\souza — software engineer · java, python · faro',
  GITHUB: () => { window.open('https://github.com/kakurokan', '_blank', 'noopener'); return T().opening('github.com/kakurokan'); },
  VER: () => T().ver,
  CLS: () => { termOut.innerHTML = ''; return null; },
  SUDO: () => T().sudo
};
Object.assign(CMDS, { LS: CMDS.DIR, CAT: CMDS.TYPE, OPEN: CMDS.START, CLEAR: CMDS.CLS, '?': CMDS.HELP });

function run(line) {
  const [cmd, ...rest] = line.trim().split(/\s+/);
  say('C:\\LEO&gt;' + esc(line));
  if (!cmd) return;
  const fn = CMDS[cmd.toUpperCase()];
  const out = fn ? fn(rest.join(' ')) : T().unknown(esc(cmd));
  if (out !== null && out !== '') say(out + '\n');
  termBox.scrollTop = 1e9;
}

function bootTerminal() {
  termOut.innerHTML = '';
  say(T().banner);
  run('type stack.yml');
  say(T().hint);
  termBox.scrollTop = 0;
}

export function initTerminal() {
  const hist = []; let hIdx = 0;
  termIn.addEventListener('keydown', e => {
    if (e.key === 'Enter') { const v = termIn.value; termIn.value = ''; if (v.trim()) hist.push(v); hIdx = hist.length; run(v); }
    else if (e.key === 'ArrowUp' && hIdx > 0) { termIn.value = hist[--hIdx]; e.preventDefault(); }
    else if (e.key === 'ArrowDown') { hIdx = Math.min(hist.length, hIdx + 1); termIn.value = hist[hIdx] || ''; e.preventDefault(); }
  });
  termBox.addEventListener('click', () => { if (!getSelection().toString()) termIn.focus({ preventScroll: true }); });
  on('lang', bootTerminal);
}
