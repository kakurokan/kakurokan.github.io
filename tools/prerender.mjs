// Escreve o inglês dentro do index.html (textos, atributos, projetos), para que o site tenha conteúdo
// antes de o JavaScript correr: motores de busca, pré-visualizações de links (LinkedIn, WhatsApp…) e
// quem tem JS desligado. Não faz parte do deploy: corre-se à mão depois de mudar textos ou projetos.
//
//   node tools/prerender.mjs
//
// É idempotente. Os textos vêm de js/i18n/en.js e os projetos de js/data/projects.js.
import { readFileSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const { default: en } = await import(join(root, 'js/i18n/en.js'));
const { projectsHtml, moreHtml } = await import(join(root, 'js/ui/projects-html.js'));

const t = key => en[key] ?? key;
const tr = v => (v && typeof v === 'object' ? (v.en ?? v) : v);
const escText = s => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
const escAttr = s => escText(s).replace(/"/g, '&quot;');

const file = join(root, 'index.html');
let html = readFileSync(file, 'utf8');

// data-t → texto; data-th → HTML (elementos-folha: o conteúdo é substituído por inteiro)
const leaf = (attr, fn) => {
  const re = new RegExp(`(<([a-z0-9]+)\\b[^>]*\\s${attr}="([^"]+)"[^>]*>)([\\s\\S]*?)(</\\2>)`, 'g');
  html = html.replace(re, (_, open, _tag, key, _old, close) => open + fn(t(key)) + close);
};
leaf('data-t', escText);
leaf('data-th', s => s);

// data-ta="atributo:chave,…" → atributos
html = html.replace(/<([a-z0-9]+)\b([^>]*\sdata-ta="([^"]+)"[^>]*)>/g, (whole, tag, attrs, spec) => {
  let out = attrs;
  for (const pair of spec.split(',')) {
    const [attr, key] = pair.split(':');
    const value = ` ${attr}="${escAttr(t(key))}"`;
    const existing = new RegExp(`\\s${attr}="[^"]*"`);
    out = existing.test(out) ? out.replace(existing, value) : out + value;
  }
  return `<${tag}${out}>`;
});

// data do post "Now"
html = html.replace(/(<time class="local-date" datetime="([^"]+)">)[^<]*(<\/time>)/, (_, open, d, close) =>
  open + new Date(d + 'T12:00').toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }) + close);

// projetos
const block = (name, content) => {
  const re = new RegExp(`<!--prerender:${name}-->[\\s\\S]*?<!--/prerender:${name}-->`);
  html = html.replace(re, `<!--prerender:${name}-->${content}<!--/prerender:${name}-->`);
};
block('projects', projectsHtml(t, tr));
block('more', moreHtml(tr));

// descrição para buscadores e para as pré-visualizações
html = html.replace(/(<meta name="description" content=")[^"]*(")/, `$1${escAttr(t('meta.description'))}$2`);
html = html.replace(/(<meta property="og:description" content=")[^"]*(")/, `$1${escAttr(t('meta.description'))}$2`);

writeFileSync(file, html);
console.log('index.html atualizado');
