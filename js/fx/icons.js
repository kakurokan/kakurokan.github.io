// Ícones em pixel art: cada um é uma grelha 16x16 de letras que apontam para a paleta.
export const PAL = { K:'#000', W:'#fff', G:'#C0C0C0', D:'#808080', Y:'#F8E070', O:'#C8A030', B:'#2050C0', L:'#33FF66', N:'#101010',
              P:'#F0E0A0', R:'#E01818', T:'#8B5A2B', E:'#2E9E2E', C:'#7FD4FF', M:'#FF2FB3', S:'#FFB347', U:'#FFE66E', V:'#6A2CFF', H:'#FF2FB3' };
const ICONS = {
  folder: ['................','................','..KKKKK.........','.KYYYYYK........','KYYYYYYYKKKKKKK.','KYYYYYYYYYYYYYYK','KYUUUUUUUUUUUUYK','KYYYYYYYYYYYYYYK','KYYYYYYYYYYYYYYK','KYYYYYYYYYYYYYYK','KYYYYYYYYYYYYYYK','KYYYYYYYYYYYYYYK','KOOOOOOOOOOOOOOK','KKKKKKKKKKKKKKKK','................','................'],
  note:   ['..KKKKKKKKKKKK..','..KWWWWWWWWWWK..','..KWBBBBBBBBWK..','..KWWWWWWWWWWK..','..KWBBBBBBWWWK..','..KWWWWWWWWWWK..','..KWBBBBBBBBWK..','..KWWWWWWWWWWK..','..KWBBBBBWWWWK..','..KWWWWWWWWWWK..','..KWBBBBBBBBWK..','..KWWWWWWWWWWK..','..KWWWWWWWWWWK..','..KKKKKKKKKKKK..','................','................'],
  monitor:['................','.KKKKKKKKKKKKKK.','.KGGGGGGGGGGGGK.','.KGNNNNNNNNNNGK.','.KGNLNNNNNNNNGK.','.KGNNLNNNNNNNGK.','.KGNLNNLLLNNNGK.','.KGNNNNNNNNNNGK.','.KGNNNNNNNNNNGK.','.KGGGGGGGGGGGGK.','.KKKKKKKKKKKKKK.','......KDDK......','....KKKKKKKK....','....KGGGGGGK....','....KKKKKKKK....','................'],
  love:   ['................','.KKKKKKKKKKKKKK.','.KGGGGGGGGGGGGK.','.KGNNNNNNNNNNGK.','.KGNNHHNNHHNNGK.','.KGNHHHHHHHHNGK.','.KGNNHHHHHHNNGK.','.KGNNNHHHHNNNGK.','.KGNNNNHHNNNNGK.','.KGGGGGGGGGGGGK.','.KKKKKKKKKKKKKK.','......KDDK......','....KKKKKKKK....','....KGGGGGGK....','....KKKKKKKK....','................'],
  map:    ['................','.KKKKKKKKKKKKKK.','.KPPPPPPPPPPPPK.','.KPRRPPPPPPPPPK.','.KPRRTPTPPPPPPK.','.KPPPPPPPTPPPPK.','.KPPPPPPPPTPPPK.','.KPPPPPPPTPPPPK.','.KPPPPPPTPPPPPK.','.KPPPPTPPPPEEPK.','.KPPPPPPPPPEEPK.','.KPPPPPPPPPPPPK.','.KKKKKKKKKKKKKK.','................','................','................'],
  mail:   ['................','................','................','.KKKKKKKKKKKKKK.','.KWKWWWWWWWWKWK.','.KWWKWWWWWWKWWK.','.KWWWKWWWWKWWWK.','.KWWWWKWWKWWWWK.','.KWWWWWKKWWWWWK.','.KWWWWWWWWWWWWK.','.KWWWWWWWWWWWWK.','.KKKKKKKKKKKKKK.','................','................','................','................'],
  cv:     ['..KKKKKKKKK.....','..KWWWWWWWKK....','..KWWWWWWWKWK...','..KWWWWWWWKKKK..','..KWWWWWWWWWWK..','..KWBBBBBBBWWK..','..KWWWWWWWWWWK..','..KWBBBBBWWWWK..','..KWWWWWWWWWWK..','KKKKKKKKKKWWWK..','KRRRRRRRRKWWWK..','KRWRWRWRRKWWWK..','KRRRRRRRRKWWWK..','KKKKKKKKKKKKKK..','................','................'],
  disk:   ['................','.KKKKKKKKKKKKK..','.KBBGGGGGGGBBK..','.KBBGGGGKGGBBK..','.KBBGGGGKGGBBK..','.KBBGGGGGGGBBK..','.KBBBBBBBBBBBK..','.KBWWWWWWWWWBK..','.KBWDDDDDDDWBK..','.KBWWWWWWWWWBK..','.KBWDDDDDWWWBK..','.KBWWWWWWWWWBK..','.KKKKKKKKKKKKK..','................','................','................'],
  chip:   ['................','...K.K.K.K.K....','..KKKKKKKKKKK...','.KKNNNNNNNNNKK..','..KNVVVVVVVNK...','.KKNVNNNNNVNKK..','..KNVNMMMNVNK...','.KKNVNMMMNVNKK..','..KNVNMMMNVNK...','.KKNVNNNNNVNKK..','..KNVVVVVVVNK...','.KKNNNNNNNNNKK..','..KKKKKKKKKKK...','...K.K.K.K.K....','................','................'],
  power:  ['................','.......KK.......','...KK..KK..KK...','..KRK..KK..KRK..','.KRK...KK...KRK.','.KRK...KK...KRK.','KRK....KK....KRK','KRK....KK....KRK','KRK..........KRK','KRK..........KRK','.KRK........KRK.','.KRRK......KRRK.','..KRRKKKKKKRRK..','...KKRRRRRRKK...','.....KKKKKK.....','................'],
  sun:    ['................','.....UUUUUU.....','...UUUUUUUUUU...','..UUUUUUUUUUUU..','.SSSSSSSSSSSSSS.','.SSSSSSSSSSSSSS.','................','MMMMMMMMMMMMMMMM','MMMMMMMMMMMMMMMM','................','.MMMMMMMMMMMMMM.','.MMMMMMMMMMMMMM.','................','..VVVVVVVVVVVV..','...VVVVVVVVVV...','................'],
  grip:   ['................','.......WW.......','......WWWW......','.....WWWWWW.....','.......WW.......','...W...WW...W...','..WW...WW...WW..','.WWWWWWWWWWWWWW.','.WWWWWWWWWWWWWW.','..WW...WW...WW..','...W...WW...W...','.......WW.......','.....WWWWWW.....','......WWWW......','.......WW.......','................']
};
// paleta Game Boy: cada cor é trocada por um dos 4 verdes, conforme a luminosidade
const GB = ['#0F380F', '#306230', '#8BAC0F', '#9BBC0F'];
const lum = hex => { const n = parseInt(hex.replace('#', '').padEnd(6, hex.slice(-1)), 16); return (0.299 * (n >> 16) + 0.587 * ((n >> 8) & 255) + 0.114 * (n & 255)) / 255; };
const GB_PAL = Object.fromEntries(Object.entries(PAL).map(([k, v]) => {
  const full = v.length === 4 ? '#' + [...v.slice(1)].map(c => c + c).join('') : v;
  return [k, GB[Math.min(3, Math.floor(lum(full) * 4))]];
}));
let activePal = PAL;
const iconCache = new Map();

// devolve true se a paleta mudou (e os ícones já desenhados precisam de ser refeitos)
export function setPalette(gameboy) {
  const next = gameboy ? GB_PAL : PAL;
  if (next === activePal) return false;
  activePal = next;
  return true;
}
function pixelSvg(name) {
  const pal = activePal;
  const key = name + '|' + (pal === PAL ? 'c' : 'g');
  if (iconCache.has(key)) return iconCache.get(key);
  const rows = ICONS[name]; if (!rows) return '';
  let r = '';
  rows.forEach((row, y) => {
    let x = 0;
    while (x < 16) {
      const c = row[x];
      if (c === '.') { x++; continue; }
      let w = 1; while (x + w < 16 && row[x + w] === c) w++;
      r += `<rect x="${x}" y="${y}" width="${w}" height="1" fill="${pal[c]}"${c === 'H' ? ' class="h"' : ''}/>`;
      x += w;
    }
  });
  iconCache.set(key, r);
  return r;
}
export function hydrateIcons(root = document) {
  root.querySelectorAll('svg[data-px]').forEach(s => {
    s.setAttribute('viewBox', '0 0 16 16');
    s.setAttribute('aria-hidden', 'true');
    s.innerHTML = pixelSvg(s.dataset.px);
  });
}
