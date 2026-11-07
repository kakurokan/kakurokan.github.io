// Botão "Copiar email" do cartão Contact: copia o endereço do mailto e avisa com "Copied!" durante um instante.
import { t } from '../i18n/index.js';

const btn = document.getElementById('copy-email');

async function copy(text) {
  try { await navigator.clipboard.writeText(text); return true; } catch (e) {}
  const ta = Object.assign(document.createElement('textarea'), { value: text });   // sem Clipboard API (http, browsers antigos)
  ta.style.cssText = 'position:fixed;opacity:0';
  document.body.appendChild(ta); ta.select();
  let ok = false;
  try { ok = document.execCommand('copy'); } catch (e) {}
  ta.remove();
  return ok;
}

export function initContact() {
  const link = document.querySelector('#contact a[href^="mailto:"]');
  let timer;
  btn.addEventListener('click', async () => {
    const ok = await copy(link.getAttribute('href').slice(7));
    clearTimeout(timer);
    btn.textContent = t(ok ? 'contact.copied' : 'contact.copyFail');
    timer = setTimeout(() => { btn.textContent = t('contact.copy'); }, 1800);
  });
}
