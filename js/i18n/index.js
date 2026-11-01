// Textos nas duas línguas. O inglês vem sempre (é a base); o português só é descarregado se for preciso.
import { state } from '../state.js';
import en from './en.js';

export const LANGS = ['en', 'pt'];
const LOADERS = { pt: () => import('./pt.js') };
const dicts = { en };

// devolve uma promessa se a língua ainda não está carregada, senão null (assim o caso comum é síncrono)
export function ensureLang(l) {
  return dicts[l] || !LOADERS[l] ? null : LOADERS[l]().then(m => { dicts[l] = m.default; });
}
export const t = key => dicts[state.lang]?.[key] ?? en[key] ?? key;
export const tr = v => (v && typeof v === 'object' ? (v[state.lang] ?? v.en) : v);   // texto simples ou { en, pt }
export const locale = () => (state.lang === 'pt' ? 'pt-PT' : 'en-GB');
