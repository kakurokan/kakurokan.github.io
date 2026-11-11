// Os dois dicionários têm de ter as mesmas chaves, e tudo o que o HTML pede tem de existir.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import en from '../js/i18n/en.js';
import pt from '../js/i18n/pt.js';
import { GOTO, TERM } from '../js/data/terminal.js';

const html = readFileSync(new URL('../index.html', import.meta.url), 'utf8').replace(/<!--[\s\S]*?-->/g, '');   // sem comentários
const stateJs = readFileSync(new URL('../js/state.js', import.meta.url), 'utf8');
const cardIds = [...html.matchAll(/<article class="card" id="([^"]+)"/g)].map(m => m[1]);
const list = name => JSON.parse(stateJs.match(new RegExp(`${name} = (\\[[^\\]]*\\])`))[1].replace(/'/g, '"'));

test('en e pt têm as mesmas chaves, com o mesmo tipo', () => {
  assert.deepEqual(Object.keys(pt).sort(), Object.keys(en).sort());
  for (const k of Object.keys(en)) assert.equal(typeof pt[k], typeof en[k], k);
});

test('nenhuma tradução está vazia', () => {
  for (const [name, dict] of [['en', en], ['pt', pt]])
    for (const [k, v] of Object.entries(dict)) if (typeof v === 'string') assert.ok(v.trim(), `${name}: ${k}`);
});

test('todas as chaves usadas no index.html existem', () => {
  const keys = [
    ...[...html.matchAll(/\sdata-th?="([^"]+)"/g)].map(m => m[1]),
    ...[...html.matchAll(/\sdata-ta="([^"]+)"/g)].flatMap(m => m[1].split(',').map(p => p.split(':')[1]))
  ];
  assert.ok(keys.length > 50);
  for (const k of keys) assert.ok(k in en, `falta a chave ${k}`);
});

test('cada cartão tem nome na barra e lugar na ordem inicial', () => {
  const order = list('DEFAULT_ORDER');
  assert.deepEqual([...order].sort(), [...cardIds].sort());
  for (const id of cardIds) assert.ok(`card.${id}` in en, `falta card.${id}`);
  for (const name of ['DEFAULT_CLOSED', 'SIMPLE_ORDER']) for (const id of list(name)) assert.ok(cardIds.includes(id), `${name}: ${id}`);
});

test('prompt: as duas línguas têm os mesmos textos e START só aponta para cartões que existem', () => {
  assert.deepEqual(Object.keys(TERM.pt).sort(), Object.keys(TERM.en).sort());
  for (const k of Object.keys(TERM.en)) assert.equal(typeof TERM.pt[k], typeof TERM.en[k], k);
  for (const [word, id] of Object.entries(GOTO)) assert.ok(cardIds.includes(id), `START ${word} → ${id}`);
});
