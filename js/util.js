// escapa texto para o pôr em HTML ou num atributo entre aspas
export const esc = s => String(s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
// minúsculas e sem acentos, para comparar texto
export const norm = s => s.normalize('NFD').replace(/\p{Diacritic}/gu, '').toLowerCase();
export const debounce = (fn, ms) => { let id; return (...args) => { clearTimeout(id); id = setTimeout(() => fn(...args), ms); }; };
