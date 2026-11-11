import { test } from 'node:test';
import assert from 'node:assert/strict';
import { esc, norm, debounce } from '../js/util.js';

test('esc escapa os caracteres perigosos em HTML e em atributos', () => {
  assert.equal(esc('<b a="1">&</b>'), '&lt;b a=&quot;1&quot;&gt;&amp;&lt;/b&gt;');
  assert.equal(esc(42), '42');
});

test('norm ignora acentos e maiúsculas', () => {
  assert.equal(norm('Competições'), 'competicoes');
  assert.equal(norm('ÉVORA'), 'evora');
});

test('debounce só chama uma vez, com os últimos argumentos', async () => {
  const calls = [];
  const fn = debounce(x => calls.push(x), 10);
  fn(1); fn(2); fn(3);
  assert.deepEqual(calls, []);
  await new Promise(r => setTimeout(r, 40));
  assert.deepEqual(calls, [3]);
});
