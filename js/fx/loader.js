// O gato só é descarregado em ecrã grande e fora do modo simples (no telemóvel nunca chega a sair do servidor).
import { isSmall, on } from '../state.js';
import { debounce } from '../util.js';

let cat = null;
async function startCat() {
  if (!cat && !isSmall()) cat = (await import('./cat.js')).cat;
  if (cat) cat.start();   // também esconde o gato se o ecrã passou a ser pequeno
}

export function initFx() {
  on('cat', startCat);
  window.addEventListener('resize', debounce(startCat, 200));
  return startCat;
}
