// HTML dos cartões "Projects" e "More projects". Funções puras (sem DOM): o browser usa-as ao trocar de
// língua e o tools/prerender.mjs usa-as para escrever o inglês já dentro do index.html.
import { PROJECTS, MORE } from '../data/projects.js';
import { esc } from '../util.js';

// open[i] diz se o projeto i está aberto; sem isso, só o primeiro
export function projectsHtml(t, tr, open = []) {
  return PROJECTS.map((p, i) => `
    <details${(open.length ? open[i] : i === 0) ? ' open' : ''}>
      <summary><svg class="px" data-px="folder"></svg>${esc(tr(p.name))}<span class="arrow" aria-hidden="true">&gt;</span></summary>
      <div class="pbody">
        <span class="path">C:\\${esc(t('projects.dir'))}\\${esc(p.slug)}</span>
        ${p.meta ? `<span class="pmeta">${esc(tr(p.meta))}</span>` : ''}
        <p>${esc(tr(p.desc))}</p>
        ${p.stats ? `<div class="stats">${p.stats.map(([n, l]) => `<span class="stat"><b>${esc(n)}</b><span>${esc(tr(l))}</span></span>`).join('')}</div>` : ''}
        ${p.points ? `<ul class="points">${p.points.map(x => `<li>${esc(tr(x))}</li>`).join('')}</ul>` : ''}
        <div class="chips">${p.tags.map(x => `<button type="button" class="chip" data-tag="${esc(tr(x))}">${esc(tr(x))}</button>`).join('')}</div>
        <div class="row">
          ${p.repo ? `<a class="btn raised" href="${esc(p.repo)}" target="_blank" rel="noopener">${esc(t('projects.repo'))}</a>` : ''}
          ${(p.links || []).map(([k, u]) => `<a class="btn raised" href="${esc(u)}" target="_blank" rel="noopener">${esc(t('projects.' + k))}</a>`).join('')}
        </div>
      </div>
    </details>`).join('');
}

export function moreHtml(tr) {
  return MORE.map(m => `
    <li><a href="${esc(m.url)}" target="_blank" rel="noopener">${esc(m.name)}</a>
      <span class="mtech" data-tech="${esc(m.tech)}">${esc(m.tech)}</span>
      <span>${esc(tr(m.desc))}</span></li>`).join('');
}
