// Arranque. Cada módulo regista os seus eventos em init*(); a ordem abaixo é também a ordem em que
// reagem ao evento "lang" (barras dos cartões → projetos → barra de tarefas → prompt → relógio → pesquisa → modo).
import { state, emit } from './state.js';
import { store } from './store.js';
import { LANGS, ensureLang } from './i18n/index.js';
import { hydrateIcons } from './fx/icons.js';
import { initFx } from './fx/loader.js';
import { initCards, goTo } from './ui/cards.js';
import { initLayout, layout } from './ui/layout.js';
import { initTags } from './ui/tags.js';
import { initTaskbar } from './ui/taskbar.js';
import { initTerminal } from './ui/terminal.js';
import { initClock } from './ui/clock.js';
import { initSearch } from './ui/search.js';
import { initMode, applyInitialMode } from './ui/mode.js';
import { initThemes, setTheme, THEMES } from './ui/themes.js';
import { initStartMenu } from './ui/startmenu.js';
import { initLang, setLang } from './ui/lang.js';

async function init() {
  // por defeito: inglês + tema Game Boy. Um link com ?lang=pt abre logo em português.
  const urlLang = new URLSearchParams(location.search).get('lang');
  const savedTheme = store.get('theme'), savedLang = store.get('lang');
  const lang = LANGS.includes(urlLang) ? urlLang : (LANGS.includes(savedLang) ? savedLang : 'en');

  initLayout(); initCards(); initTags(); initTaskbar(); initTerminal(); initClock(); initSearch(); initMode();
  initThemes(); initStartMenu(); initLang();
  const startCat = initFx();

  await ensureLang(lang);
  applyInitialMode();   // antes do tema: no modo simples o wallpaper nem chega a ser descarregado
  setTheme(THEMES.includes(savedTheme) ? savedTheme : 'gameboy');
  setLang(lang, { save: !urlLang });
  hydrateIcons();
  emit('refresh');

  document.fonts && document.fonts.ready.then(() => { layout(); startCat(); });
  setTimeout(startCat, 300);
  const startCard = document.getElementById(location.hash.slice(1));
  if (startCard && startCard.classList.contains('card')) setTimeout(() => goTo(startCard), 50);
}
init();
