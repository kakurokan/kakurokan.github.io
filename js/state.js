// Estado partilhado + barramento de eventos. Os módulos não se importam uns aos outros para
// "pedir" renderizações: emitem um evento (ver a lista no fim) e quem trata dele escuta com on().
export const state = { lang: 'en', theme: 'gameboy', simple: false, activeTag: null };

export const cards = [...document.querySelectorAll('.card')];   // a ordem aqui é a ordem dos cartões no ecrã

// ordem inicial: os cartões são distribuídos pelas colunas da esquerda para a direita, linha a linha
export const DEFAULT_ORDER = ['welcome', 'projects', 'contests', 'stack', 'education', 'terminal', 'contact', 'activity', 'about', 'now', 'path', 'more', 'cv', 'themes', 'drag'];
// cartões que começam fechados (ficam na barra de tarefas, nos ícones e no menu para reabrir)
export const DEFAULT_CLOSED = ['about', 'now', 'path', 'more', 'cv', 'themes', 'drag'];
// modo simples: uma coluna, sem desktop retro, para quem só quer ler o essencial
export const SIMPLE_ORDER = ['welcome', 'projects', 'more', 'stack', 'education', 'contests', 'about', 'path', 'cv', 'contact'];
export const closed = new Set(DEFAULT_CLOSED);
// cartões sem conteúdo (ainda ou por falha da rede): ficam escondidos, também na barra de tarefas
export const unavailable = new Set(['activity']);

export const isSmall = () => state.simple || matchMedia('(max-width: 860px)').matches;

const handlers = {};
export const on = (name, fn) => { (handlers[name] ||= []).push(fn); };
export const emit = (name, ...args) => { (handlers[name] || []).forEach(fn => fn(...args)); };

/* Eventos:
   refresh   recalcula quais cartões se vêem (pesquisa, fechados, modo simples) e redesenha
   layout    redistribui os cartões pelas colunas
   tasks     redesenha os botões da barra de tarefas
   goto      (card) abre, destaca e leva o utilizador ao cartão
   lang      o texto mudou de língua e já foi aplicado ao DOM
   simple    (on) o modo simples foi ligado/desligado
   content   o texto de algum cartão mudou (invalida a cache da pesquisa)
   cat       pede ao gato que (re)comece, se for caso disso */
