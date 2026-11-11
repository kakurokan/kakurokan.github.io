// Dados dos projetos e o HTML que sai deles (o mesmo código corre no browser e no prerender).
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { PROJECTS, MORE } from '../js/data/projects.js';
import { projectsHtml, moreHtml } from '../js/ui/projects-html.js';

const t = k => k;
const lang = l => v => (v && typeof v === 'object' ? v[l] : v);
const count = (s, re) => (s.match(re) || []).length;

// percorre os dados e devolve todos os textos { en, pt }
function bilingual(v, out = []) {
  if (Array.isArray(v)) v.forEach(x => bilingual(x, out));
  else if (v && typeof v === 'object') { if ('en' in v || 'pt' in v) out.push(v); else Object.values(v).forEach(x => bilingual(x, out)); }
  return out;
}

test('todos os textos dos projetos existem em inglês e em português', () => {
  const texts = bilingual([PROJECTS, MORE]);
  assert.ok(texts.length > 20);
  for (const v of texts) { assert.ok(v.en?.trim(), JSON.stringify(v)); assert.ok(v.pt?.trim(), JSON.stringify(v)); }
});

test('os slugs são únicos e servem de link direto (#slug)', () => {
  const slugs = PROJECTS.map(p => p.slug);
  assert.equal(new Set(slugs).size, slugs.length);
  for (const s of slugs) assert.match(s, /^[a-z0-9-]+$/);
  const html = projectsHtml(t, lang('en'));
  for (const s of slugs) assert.ok(html.includes(`<details id="${s}"`), s);
});

test('links de repositório e de site são https', () => {
  for (const p of PROJECTS) {
    if (p.repo) assert.match(p.repo, /^https:\/\//);
    for (const [, url] of p.links || []) assert.match(url, /^https:\/\//);
  }
  for (const m of MORE) assert.match(m.url, /^https:\/\//);
});

test('projectsHtml: um <details> por projeto, só o primeiro aberto por defeito', () => {
  const html = projectsHtml(t, lang('en'));
  assert.equal(count(html, /<details/g), PROJECTS.length);
  assert.equal(count(html, /<details[^>]* open>/g), 1);
  assert.match(html, /^\s*<details[^>]* open>/);
  assert.ok(!/undefined|\[object Object\]/.test(html));
});

test('projectsHtml: respeita quais estavam abertos e a língua', () => {
  const open = PROJECTS.map((_, i) => i === 1);
  const html = projectsHtml(t, lang('pt'), open);
  assert.equal(count(html, /<details[^>]* open>/g), 1);
  assert.ok(html.indexOf(' open>') > html.indexOf('</details>'));   // o aberto é o segundo
  assert.ok(html.includes(PROJECTS[0].name.pt));
});

test('projectsHtml: cada tag é um botão de filtro', () => {
  const html = projectsHtml(t, lang('en'));
  assert.equal(count(html, /class="chip" data-tag="/g), PROJECTS.reduce((n, p) => n + p.tags.length, 0));
});

test('moreHtml: uma linha por projeto, sem buracos', () => {
  const html = moreHtml(lang('en'));
  assert.equal(count(html, /<li>/g), MORE.length);
  assert.ok(!/undefined|\[object Object\]/.test(html));
});
