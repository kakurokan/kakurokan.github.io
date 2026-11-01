// Cartão de projetos + filtro por tecnologia (clicar numa tag mostra só os projetos que a usam).
import { state, on, emit } from '../state.js';
import { t, tr } from '../i18n/index.js';
import { PROJECTS, MORE } from '../data/projects.js';
import { projectsHtml, moreHtml } from './projects-html.js';
import { hydrateIcons } from '../fx/icons.js';
import { norm } from '../util.js';

const projectList = document.getElementById('project-list');
const projectsCard = document.getElementById('projects');
let moreHits = 0;

export function renderProjects() {
  const open = [...projectList.querySelectorAll('details')].map(d => d.open);
  projectList.innerHTML = projectsHtml(t, tr, open);
  hydrateIcons(projectList);
  document.getElementById('more-list').innerHTML = moreHtml(tr);
  applyTag();
}

// "Java" apanha "Java" e "Java 17", mas não "JavaScript"
const TAG_ALIAS = { 'domain-driven design': 'ddd', 'java swing': 'swing', 'benchmarking': 'benchmarks', 'rest apis': 'rest', 'github actions ci/cd': 'github actions', 'udp sockets': 'udp sockets' };
const tagKey = x => { const k = norm(x); return TAG_ALIAS[k] || k; };
const tagHit = (list, tag) => list.some(x => { const a = tagKey(x), b = tagKey(tag); return a === b || a.startsWith(b + ' ') || a.startsWith(b + '/'); });

function applyTag() {
  const tag = state.activeTag;
  const bar = document.getElementById('tagbar'), none = document.getElementById('tag-none');
  let n = 0;
  projectList.querySelectorAll('details').forEach((d, i) => {
    const hit = !tag || tagHit(PROJECTS[i].tags.map(tr), tag);
    d.classList.toggle('tag-out', !hit);
    if (tag && hit) { d.open = true; n++; }
  });
  moreHits = 0;
  document.querySelectorAll('#more-list li').forEach((li, i) => {
    const hit = !tag || tagHit(MORE[i].tech.split(' · '), tag);
    li.classList.toggle('tag-out', !hit);
    if (tag && hit) moreHits++;
  });
  document.querySelectorAll('button.chip[data-tag]').forEach(b => b.setAttribute('aria-pressed', !!tag && norm(b.dataset.tag) === norm(tag)));
  bar.hidden = !tag;
  if (tag) document.getElementById('tagbar-text').textContent = t('tags.filter')(tag, n, moreHits);
  none.hidden = !tag || n > 0;
  if (tag && !n) none.textContent = t('tags.none')(tag);
  emit('content');
}

function setTag(tag) {
  state.activeTag = tag && (!state.activeTag || norm(state.activeTag) !== norm(tag)) ? tag : null;
  applyTag();
  if (state.activeTag) {
    emit('goto', projectsCard);
    if (moreHits) emit('goto', document.getElementById('more'));
  }
}

export function initTags() {
  document.addEventListener('click', e => {
    const b = e.target.closest('button.chip[data-tag]');
    if (b) setTag(b.dataset.tag);
  });
  document.getElementById('tag-clear').addEventListener('click', () => setTag(null));
  // as tags do cartão #Stack também filtram (as que são tecnologias)
  document.querySelectorAll('#stack .chips:not(.certs) .chip:not([data-t])').forEach(sp => {
    const b = document.createElement('button');
    b.type = 'button'; b.className = 'chip'; b.dataset.tag = sp.textContent.trim(); b.textContent = sp.textContent;
    sp.replaceWith(b);
  });
  on('lang', renderProjects);
}
