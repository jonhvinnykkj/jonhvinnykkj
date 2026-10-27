#!/usr/bin/env node
// Monta o cabecalho do perfil: uma janela de terminal com o monograma "JV" em
// matriz de pontos a esquerda e a ficha SYSTEM.INFO a direita.
//
//   node scripts/gen-heroi.cjs
//
// O texto e medido, nao chutado. Cada rotulo e cada valor levam `textLength`,
// entao a largura deles e exata mesmo se o GitHub cair numa fonte monoespacada
// diferente da minha. Com as duas larguras conhecidas, a linha pontilhada entre
// eles tem inicio e fim exatos e nunca encosta no texto.

const fs = require('fs');
const path = require('path');

const RAIZ = path.join(__dirname, '..');
const L = 1180;          // largura do quadro
const A = 470;           // altura
const AVANCO = 8.4;      // largura de um caractere a 14px numa monoespacada

const FONTE_MONO = "ui-monospace,SFMono-Regular,Menlo,Consolas,'Liberation Mono',monospace";

const TITULO = 'jonhv.dev@gmail.com — % ./profile.sh --live';

const FICHA = [
  ['Subject', 'João Vinnycius Ferreira'],
  ['Role', 'Big Data no Agronegócio · FATEC Pompeia'],
  ['Origin', 'Pompeia, São Paulo — Brasil'],
  ['Research', 'LLM sobre dado agrícola · FAPESP'],
  ['Exchange', 'IPB Bragança, Portugal · 6 meses'],
  ['Latest', 'F.O.G.O. · DSIN Coder Challenge 2026'],
  ['Status', 'Pesquisando + construindo'],
  ['Stack.Data', 'R · Python · SQL · PostgreSQL'],
  ['Stack.Web', 'TypeScript · React · Node · Next.js'],
  ['Stack.Infra', 'Docker · Git · Cloudflare · Railway'],
];

// monograma "JV": as letras foram desenhadas em Futura Bold num canvas e amostradas
// numa grade de 41 x 22 (cada celula acesa se mais da metade dela tem tinta)
const MASCARA = [
  '.........######..######..........######..',
  '.........######..######..........######..',
  '.........######...######........######...',
  '.........######...######........######...',
  '.........######....######......######....',
  '.........######....######......######....',
  '.........######.....#####......######....',
  '.........######.....######....######.....',
  '.........######.....######....######.....',
  '.........######......######..######......',
  '.........######......######..######......',
  '.........######.......#####..#####.......',
  '.........######.......############.......',
  '.........######.......############.......',
  '.........######........##########........',
  '.........######........##########........',
  '....##...#####..........########.........',
  '...###########..........########.........',
  '..############...........######..........',
  '..###########............######..........',
  '...#########.............######..........',
  '.....#####...............................',
];
const PASSO = 6;         // distancia entre pontos
const CAMPO = 45;        // o campo de fundo tem CAMPO x CAMPO pontos

const TEMAS = {
  dark: {
    fundo: '#0d1117', painel: '#0d1117', borda: '#1f6f37',
    barra: '#161b22', barraLinha: '#21262d', tituloBarra: '#7d8590',
    acento: '#39d353', rotulo: '#39d353', pontos: '#2d3b32',
    valor: '#e6edf3', vivo: '#39d353', chipFundo: '#1f6f37', chipTexto: '#ffffff',
    moldura: '#26a641', legenda: '#57685c', campo: '#1c2b22',
  },
  light: {
    fundo: '#ffffff', painel: '#ffffff', borda: '#a7d8b4',
    barra: '#f6f8fa', barraLinha: '#d8dee4', tituloBarra: '#57606a',
    acento: '#216e39', rotulo: '#216e39', pontos: '#c5d6c9',
    valor: '#1f2328', vivo: '#216e39', chipFundo: '#216e39', chipTexto: '#ffffff',
    moldura: '#30a14e', legenda: '#7a8c7f', campo: '#dfece3',
  },
};

const esc = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
const larg = (s) => s.length * AVANCO;

// gerador fixo: o desenho sai igual toda vez que o script roda
function semente(n) {
  let s = n;
  return () => ((s = (s * 1664525 + 1013904223) >>> 0) / 4294967296);
}

// texto de largura travada: `textLength` + `lengthAdjust=spacing` mexe so no
// espacamento entre glifos, nunca no desenho da letra
function texto(x, y, s, { fill, tam = 14, peso = 400, fim = false, espaco = 0 }) {
  const l = (s.length * (tam * 0.6) + s.length * espaco).toFixed(1);
  return `<text x="${x}" y="${y}" font-family="${FONTE_MONO}" font-size="${tam}"`
    + ` font-weight="${peso}" fill="${fill}"`
    + `${espaco ? ` letter-spacing="${espaco}"` : ''}`
    + `${fim ? ' text-anchor="end"' : ''}`
    + ` textLength="${l}" lengthAdjust="spacing" xml:space="preserve">${esc(s)}</text>`;
}

// campo de pontos com o monograma aceso no meio, como um painel de LED
function monograma(x0, y0, c) {
  const acesos = new Set();
  MASCARA.forEach((linha, ly) => [...linha].forEach((ch, lx) => { if (ch === '#') acesos.add(`${lx},${ly}`); }));
  const offX = Math.floor((CAMPO - MASCARA[0].length) / 2);
  const offY = Math.floor((CAMPO - MASCARA.length) / 2);
  const rnd = semente(2026);
  const fundo = [], letra = [], dados = [];
  for (let gy = 0; gy < CAMPO; gy++) {
    for (let gx = 0; gx < CAMPO; gx++) {
      const cx = (x0 + gx * PASSO).toFixed(1), cy = (y0 + gy * PASSO).toFixed(1);
      const sorte = rnd();
      if (acesos.has(`${gx - offX},${gy - offY}`)) {
        letra.push(`<circle cx="${cx}" cy="${cy}" r="2.3" opacity="${(0.72 + sorte * 0.28).toFixed(2)}"/>`);
      } else if (sorte < 0.035) {
        dados.push(`<circle cx="${cx}" cy="${cy}" r="1.6" opacity="0.45"/>`);
      } else {
        fundo.push(`<circle cx="${cx}" cy="${cy}" r="1.1"/>`);
      }
    }
  }
  return `<g fill="${c.campo}">${fundo.join('')}</g>`
    + `<g fill="${c.acento}">${dados.join('')}</g>`
    + `<g fill="${c.acento}">${letra.join('')}</g>`;
}

function construir(tema, c) {
  const o = [];
  o.push(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${L} ${A}" width="${L}" height="${A}" role="img" aria-label="Ficha de perfil de João Vinnycius Ferreira">`);
  o.push(`<title>João Vinnycius Ferreira — Big Data no Agronegócio</title>`);
  o.push(`<rect width="${L}" height="${A}" fill="${c.fundo}"/>`);

  // ---- janela ----
  const jx = 20, jy = 14, jl = L - 40, ja = A - 34, barraA = 46;
  o.push(`<rect x="${jx}" y="${jy}" width="${jl}" height="${ja}" rx="14" fill="${c.painel}" stroke="${c.borda}" stroke-width="1.5"/>`);
  o.push(`<path d="M${jx} ${jy + 14}a14 14 0 0 1 14-14h${jl - 28}a14 14 0 0 1 14 14v${barraA - 14}H${jx}z" fill="${c.barra}"/>`);
  o.push(`<line x1="${jx}" y1="${jy + barraA}" x2="${jx + jl}" y2="${jy + barraA}" stroke="${c.barraLinha}" stroke-width="1"/>`);
  ['#ff5f57', '#febc2e', '#28c840'].forEach((cor, i) => {
    o.push(`<circle cx="${jx + 24 + i * 19}" cy="${jy + barraA / 2}" r="5.5" fill="${cor}"/>`);
  });
  o.push(`<g transform="translate(${L / 2}, 0)">${texto(0, jy + barraA / 2 + 4.5, TITULO, { fill: c.tituloBarra, tam: 12.5 }).replace('x="0"', `x="${(-larg(TITULO) / 2).toFixed(1)}"`)}</g>`);

  // ---- coluna da esquerda: monograma ----
  const px = 48, py = 108, pl = 312;
  o.push(texto(px + 4, py - 14, 'IDENT.MARK', { fill: c.legenda, tam: 10.5, espaco: 2 }));
  // cantos em L, no lugar de uma moldura fechada
  const b = 26;
  [[px, py, 1, 1], [px + pl, py, -1, 1], [px, py + pl, 1, -1], [px + pl, py + pl, -1, -1]].forEach(([x, y, sx, sy]) => {
    o.push(`<path d="M${x} ${y + sy * b}V${y}H${x + sx * b}" fill="none" stroke="${c.moldura}" stroke-width="1.5"/>`);
  });
  const lado = (CAMPO - 1) * PASSO;
  o.push(monograma(px + (pl - lado) / 2, py + (pl - lado) / 2, c));

  // ---- coluna da direita: ficha ----
  const fx = 412, fd = L - 50;
  o.push(texto(fx, 108, 'SYSTEM.INFO', { fill: c.acento, tam: 13, peso: 700, espaco: 2 }));
  const rotL = larg('SYSTEM.INFO') + 2 * 11;
  o.push(`<line x1="${fx + rotL + 14}" y1="104" x2="${fd - 62}" y2="104" stroke="${c.barraLinha}" stroke-width="1"/>`);
  o.push(`<circle cx="${fd - 48}" cy="103.5" r="3.5" fill="${c.vivo}"/>`);
  o.push(texto(fd, 108, 'LIVE', { fill: c.vivo, tam: 11.5, peso: 700, fim: true, espaco: 1.5 }));

  // chip do e-mail
  const email = 'jonhv.dev@gmail.com';
  const chipL = larg(email) + 22;
  o.push(`<rect x="${fx}" y="124" width="${chipL.toFixed(1)}" height="24" rx="5" fill="${c.chipFundo}"/>`);
  o.push(texto(fx + 11, 140.5, email, { fill: c.chipTexto, tam: 12.5, peso: 700 }));

  // linhas da ficha
  let y = 182;
  FICHA.forEach(([rot, val]) => {
    const lr = larg(rot), lv = larg(val);
    o.push(texto(fx, y, rot, { fill: c.rotulo, tam: 14 }));
    o.push(texto(fd, y, val, { fill: c.valor, tam: 14, peso: 700, fim: true }));
    const de = fx + lr + 10, ate = fd - lv - 10;
    if (ate > de) {
      o.push(`<line x1="${de.toFixed(1)}" y1="${y - 4}" x2="${ate.toFixed(1)}" y2="${y - 4}"`
        + ` stroke="${c.pontos}" stroke-width="1.6" stroke-linecap="round" stroke-dasharray="0.1 6"/>`);
    }
    y += 26;
  });

  o.push('</svg>');
  return o.join('\n');
}

for (const [tema, c] of Object.entries(TEMAS)) {
  const saida = path.join(RAIZ, 'assets', `heroi-${tema}.svg`);
  fs.writeFileSync(saida, construir(tema, c) + '\n');
  console.log(`heroi-${tema}.svg  ${L}x${A}  ${Math.round(fs.statSync(saida).size / 1024)}KB`);
}
