#!/usr/bin/env node
// Desenha o painel de destaque (o projeto principal) no mesmo estilo do painel
// de projetos: janela de terminal, mono, verde.
//
//   node scripts/gen-destaque.cjs [pasta-de-saida]
//
// A captura de tela entra embutida no SVG (data URI), porque imagem externa nao
// carrega quando o GitHub mostra o SVG como <img>. Tema claro usa a Central
// clara; tema escuro, a "Sala de controle". Fontes em assets/fonte/.
//
// Saida: destaque-dark.svg e destaque-light.svg (padrao assets/).

const fs = require('fs');
const path = require('path');

const SAIDA = process.argv[2] || path.join(__dirname, '..', 'assets');
const FONTE = path.join(__dirname, '..', 'assets', 'fonte');

const PROJETO = {
  repo: 'jonhvinnykkj/fogo-dsin-coder-challenge-2026',
  nome: 'F.O.G.O.',
  nomeLongo: 'Ferramenta Onisciente de Gestão e Operações',
  selo: 'DSIN Coder Challenge 2026 · Etapa Bônus',
  descricao: 'Inventário de equipamentos IoT, central de operações com mapa ao vivo e previsões que mostram quanto acertaram, para o trânsito de Marília/SP.',
  numeros: [
    ['3', 'partes do desafio'],
    ['719', 'testes automatizados'],
    ['8,4%', 'menos erro na previsão'],
  ],
  stack: ['TypeScript', 'React', 'Fastify', 'SQLite', 'Leaflet', 'Docker'],
  modulos: 'inventário · central ao vivo · previsões · modo campo · boletim',
  rodape: 'repo público · vídeo 3:52 · relatório ABNT',
};

const L = 1180;
const TOPO = 40;                       // espaço do título "FEATURED.PROJECT"
const CARD_A = 434;
const A = TOPO + CARD_A + 4;
const SHOT = { x: 16, y: 40, l: 576, a: 360 };   // 1440 × 900 reduzido (16:10)

const TEMAS = {
  dark: {
    fundo: '#0d1117', card: '#0f1620', borda: '#21372a', barra: '#131c26',
    texto: '#e6edf3', fraco: '#8b949e', apagado: '#6e7681', acento: '#39d353',
    pill: '#16281d', pillBorda: '#245c34', pillTexto: '#7ee295', moldura: '#26a641',
    captura: 'fogo-central-dark.jpg',
  },
  light: {
    fundo: '#ffffff', card: '#ffffff', borda: '#d3e6d8', barra: '#f4f9f5',
    texto: '#1f2328', fraco: '#57606a', apagado: '#8b949e', acento: '#216e39',
    pill: '#eaf6ed', pillBorda: '#b6ddc1', pillTexto: '#1a6b34', moldura: '#30a14e',
    captura: 'fogo-central-light.jpg',
  },
};

const MONO = "ui-monospace,SFMono-Regular,Menlo,Consolas,'Liberation Mono',monospace";
const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

// quebra em linhas de ate `col` caracteres, sem cortar palavra
function quebrar(txt, col) {
  const linhas = [];
  let atual = '';
  for (const p of txt.split(/\s+/)) {
    if ((atual + ' ' + p).trim().length <= col) atual = (atual + ' ' + p).trim();
    else { linhas.push(atual); atual = p; }
  }
  if (atual) linhas.push(atual);
  return linhas;
}

function painel(c) {
  const img = fs.readFileSync(path.join(FONTE, c.captura)).toString('base64');
  const o = [`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${L} ${A}" width="${L}" height="${A}" role="img" aria-label="Projeto em destaque: ${esc(PROJETO.nome)} – ${esc(PROJETO.nomeLongo)}">`];
  o.push(`<defs><clipPath id="tela"><rect x="${SHOT.x}" y="${SHOT.y + 18}" width="${SHOT.l}" height="${SHOT.a}"/></clipPath></defs>`);
  o.push(`<rect width="${L}" height="${A}" fill="${c.fundo}"/>`);
  o.push(`<text x="4" y="18" font-family="${MONO}" font-size="12.5" font-weight="700" fill="${c.acento}" letter-spacing="2">FEATURED.PROJECT</text>`);
  o.push(`<text x="174" y="18" font-family="${MONO}" font-size="11" fill="${c.apagado}">./fogo.sh --demo</text>`);

  o.push(`<g transform="translate(2, ${TOPO})">`);
  const CL = L - 4;
  o.push(`<rect width="${CL}" height="${CARD_A}" rx="10" fill="${c.card}" stroke="${c.borda}"/>`);
  o.push(`<path d="M0 10a10 10 0 0 1 10-10h${CL - 20}a10 10 0 0 1 10 10v16H0z" fill="${c.barra}"/>`);
  o.push(`<line x1="0" y1="26" x2="${CL}" y2="26" stroke="${c.borda}"/>`);
  o.push(`<circle cx="14" cy="13.5" r="2.5" fill="${c.acento}"/>`);
  o.push(`<text x="24" y="17.5" font-family="${MONO}" font-size="10.5" fill="${c.apagado}">${esc(PROJETO.repo)}</text>`);
  o.push(`<text x="${CL - 14}" y="17.5" font-family="${MONO}" font-size="9" fill="${c.acento}" text-anchor="end">● público</text>`);

  // captura dentro de uma janela de navegador
  o.push(`<rect x="${SHOT.x}" y="${SHOT.y}" width="${SHOT.l}" height="${SHOT.a + 18}" rx="6" fill="${c.barra}" stroke="${c.moldura}" stroke-opacity="0.55"/>`);
  ['#ff5f57', '#febc2e', '#28c840'].forEach((cor, i) => o.push(`<circle cx="${SHOT.x + 12 + i * 11}" cy="${SHOT.y + 9}" r="3.2" fill="${cor}" fill-opacity="0.85"/>`));
  o.push(`<text x="${SHOT.x + SHOT.l / 2}" y="${SHOT.y + 12.5}" font-family="${MONO}" font-size="9" fill="${c.apagado}" text-anchor="middle">localhost:3333 · Central de Operações</text>`);
  o.push(`<image href="data:image/jpeg;base64,${img}" x="${SHOT.x}" y="${SHOT.y + 18}" width="${SHOT.l}" height="${SHOT.a}" preserveAspectRatio="xMidYMin slice" clip-path="url(#tela)"/>`);

  // coluna de texto
  const X = SHOT.x + SHOT.l + 32;
  o.push(`<text x="${X}" y="80" font-family="${MONO}" font-size="32" font-weight="700" fill="${c.texto}">${esc(PROJETO.nome)}<tspan fill="${c.acento}">_</tspan></text>`);
  o.push(`<text x="${X}" y="104" font-family="${MONO}" font-size="12.5" fill="${c.fraco}">${esc(PROJETO.nomeLongo)}</text>`);
  const wSelo = PROJETO.selo.length * 6.3 + 22;
  o.push(`<rect x="${X}" y="118" width="${wSelo.toFixed(1)}" height="20" rx="10" fill="${c.pill}" stroke="${c.pillBorda}"/>`);
  o.push(`<text x="${X + wSelo / 2}" y="132" font-family="${MONO}" font-size="10.5" fill="${c.pillTexto}" text-anchor="middle">${esc(PROJETO.selo)}</text>`);

  quebrar(PROJETO.descricao, 64).forEach((linha, i) => {
    o.push(`<text x="${X}" y="${168 + i * 17}" font-family="${MONO}" font-size="11.5" fill="${c.fraco}">${esc(linha)}</text>`);
  });

  // números
  PROJETO.numeros.forEach(([n, rot], i) => {
    const nx = X + i * 178;
    o.push(`<line x1="${nx}" y1="232" x2="${nx}" y2="274" stroke="${c.acento}" stroke-width="2"/>`);
    o.push(`<text x="${nx + 12}" y="255" font-family="${MONO}" font-size="22" font-weight="700" fill="${c.texto}">${esc(n)}</text>`);
    o.push(`<text x="${nx + 12}" y="272" font-family="${MONO}" font-size="9.5" fill="${c.apagado}">${esc(rot)}</text>`);
  });

  // stack
  o.push(`<text x="${X}" y="312" font-family="${MONO}" font-size="10" font-weight="700" fill="${c.acento}" letter-spacing="1.5">STACK</text>`);
  let px = X + 56;
  PROJETO.stack.forEach((s) => {
    const w = s.length * 6.3 + 18;
    o.push(`<rect x="${px.toFixed(1)}" y="300" width="${w.toFixed(1)}" height="18" rx="9" fill="${c.pill}" stroke="${c.pillBorda}"/>`);
    o.push(`<text x="${(px + w / 2).toFixed(1)}" y="312.5" font-family="${MONO}" font-size="9.5" fill="${c.pillTexto}" text-anchor="middle">${esc(s)}</text>`);
    px += w + 6;
  });

  o.push(`<text x="${X}" y="346" font-family="${MONO}" font-size="10" font-weight="700" fill="${c.acento}" letter-spacing="1.5">MÓDULOS</text>`);
  o.push(`<text x="${X + 70}" y="346" font-family="${MONO}" font-size="10.5" fill="${c.fraco}">${esc(PROJETO.modulos)}</text>`);

  o.push(`<line x1="${X}" y1="372" x2="${CL - 18}" y2="372" stroke="${c.borda}" stroke-dasharray="2 4"/>`);
  o.push(`<text x="${X}" y="396" font-family="${MONO}" font-size="10" fill="${c.apagado}">★ ${esc(PROJETO.rodape)}</text>`);
  o.push('</g>');
  o.push('</svg>');
  return o.join('\n');
}

fs.mkdirSync(SAIDA, { recursive: true });
for (const [tema, c] of Object.entries(TEMAS)) {
  const arq = path.join(SAIDA, `destaque-${tema}.svg`);
  fs.writeFileSync(arq, painel(c) + '\n');
  console.log(`destaque-${tema}.svg  ${Math.round(fs.statSync(arq).size / 1024)}KB`);
}
