#!/usr/bin/env node
// Desenha o painel de projetos lendo a API do GitHub.
//
//   GITHUB_TOKEN=... node scripts/gen-projetos.cjs [pasta-de-saida]
//
// Sem token ele ainda roda, mas a API sem autenticacao permite poucas chamadas
// por hora e o painel de linguagens fica vazio. Na Action o token vem de graca.
//
// Saida: projetos-dark.svg e projetos-light.svg na pasta indicada (padrao
// assets/). A Action publica esses dois arquivos na branch `projetos`.

const fs = require('fs');
const path = require('path');

const DONO = 'jonhvinnykkj';
const QUANTOS = 6;              // 3 linhas de 2 colunas
const SAIDA = process.argv[2] || path.join(__dirname, '..', 'assets');

const L = 1180;
const CARD_L = 578, CARD_A = 132, GAP = 24, TOPO = 40;

// cores oficiais do linguist para o que aparece nos repos
const COR_LING = {
  TypeScript: '#3178c6', JavaScript: '#f1e05a', Python: '#3572A5', Java: '#b07219',
  R: '#198CE7', HTML: '#e34c26', CSS: '#563d7c', TeX: '#3D6117', PLpgSQL: '#336790',
  Shell: '#89e051', Dockerfile: '#384d54', Vue: '#41b883', Go: '#00ADD8', Rust: '#dea584',
  'Jupyter Notebook': '#DA5B0B', SCSS: '#c6538c', Makefile: '#427819', Svelte: '#ff3e00',
};
const COR_PADRAO = '#8b949e';

const TEMAS = {
  dark: {
    fundo: '#0d1117', card: '#0f1620', borda: '#21372a', barra: '#131c26',
    texto: '#e6edf3', fraco: '#8b949e', apagado: '#6e7681', acento: '#39d353',
    pill: '#16281d', pillBorda: '#245c34', pillTexto: '#7ee295', trilho: '#1c2b22',
  },
  light: {
    fundo: '#ffffff', card: '#ffffff', borda: '#d3e6d8', barra: '#f4f9f5',
    texto: '#1f2328', fraco: '#57606a', apagado: '#8b949e', acento: '#216e39',
    pill: '#eaf6ed', pillBorda: '#b6ddc1', pillTexto: '#1a6b34', trilho: '#e4efe7',
  },
};

const MONO = "ui-monospace,SFMono-Regular,Menlo,Consolas,'Liberation Mono',monospace";
const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

async function api(caminho) {
  const cab = { Accept: 'application/vnd.github+json', 'User-Agent': 'perfil-jonhvinnykkj' };
  if (process.env.GITHUB_TOKEN) cab.Authorization = `Bearer ${process.env.GITHUB_TOKEN}`;
  const r = await fetch(`https://api.github.com${caminho}`, { headers: cab });
  if (!r.ok) throw new Error(`${caminho} -> ${r.status} ${await r.text()}`);
  return r.json();
}

function quandoFoi(iso) {
  const dias = Math.floor((Date.now() - new Date(iso).getTime()) / 86400000);
  if (dias <= 0) return 'hoje';
  if (dias === 1) return 'ontem';
  if (dias < 30) return `há ${dias} dias`;
  const meses = Math.floor(dias / 30);
  if (meses < 12) return `há ${meses} ${meses === 1 ? 'mês' : 'meses'}`;
  const anos = Math.floor(meses / 12);
  return `há ${anos} ${anos === 1 ? 'ano' : 'anos'}`;
}

// quebra em no maximo `linhas` pedacos de ate `col` caracteres, sem cortar palavra
function quebrar(txt, col, linhas) {
  const palavras = String(txt || '').split(/\s+/).filter(Boolean);
  const saida = [];
  let atual = '';
  for (const p of palavras) {
    if ((atual + ' ' + p).trim().length <= col) atual = (atual + ' ' + p).trim();
    else { saida.push(atual); atual = p; if (saida.length === linhas) break; }
  }
  if (saida.length < linhas && atual) saida.push(atual);
  if (saida.length === linhas && palavras.join(' ').length > saida.join(' ').length) {
    saida[linhas - 1] = saida[linhas - 1].replace(/.{1}$/, '…');
  }
  return saida;
}

async function coletar() {
  const repos = await api(`/users/${DONO}/repos?per_page=100&sort=pushed`);
  // Quase todo repo publico dele esta arquivado, entao filtrar arquivado
  // esvaziaria o painel. Eles entram, mas marcados — o que fica de fora e o
  // que nao tem conteudo mesmo: fork, placeholder vazio e enunciado solto.
  const vale = repos.filter((r) =>
    !r.fork && r.name !== DONO &&
    !/vazio|hist[oó]rico|apenas o enunciado/i.test(r.description || '') &&
    (r.description || '').length > 0);

  // Repo vivo na frente do arquivado. Dentro de cada grupo, ordena por tamanho
  // e nao por data: ordenar por data enchia o painel com exercicio de Java de
  // uma aula so porque foram os ultimos commits. Tamanho aproxima melhor
  // quanto codigo de verdade o repo tem.
  const escolhidos = vale
    .sort((a, b) => (a.archived - b.archived) || (b.size - a.size))
    .slice(0, QUANTOS);
  for (const r of escolhidos) {
    try {
      const langs = await api(`/repos/${DONO}/${r.name}/languages`);
      const total = Object.values(langs).reduce((a, b) => a + b, 0) || 1;
      r._langs = Object.entries(langs)
        .sort((a, b) => b[1] - a[1]).slice(0, 3)
        .map(([nome, bytes]) => ({ nome, pct: Math.round((bytes / total) * 100) }));
    } catch { r._langs = r.language ? [{ nome: r.language, pct: 100 }] : []; }
  }
  return escolhidos;
}

function card(r, x, y, c) {
  const o = [];
  const topo = r._langs[0];
  const pct = topo ? topo.pct : 0;
  const corTopo = topo ? (COR_LING[topo.nome] || COR_PADRAO) : COR_PADRAO;

  o.push(`<g transform="translate(${x}, ${y})">`);
  o.push(`<rect width="${CARD_L}" height="${CARD_A}" rx="10" fill="${c.card}" stroke="${c.borda}"/>`);
  o.push(`<path d="M0 10a10 10 0 0 1 10-10h${CARD_L - 20}a10 10 0 0 1 10 10v16H0z" fill="${c.barra}"/>`);
  o.push(`<line x1="0" y1="26" x2="${CARD_L}" y2="26" stroke="${c.borda}"/>`);
  o.push(`<circle cx="14" cy="13.5" r="2.5" fill="${c.acento}"/>`);
  o.push(`<text x="24" y="17.5" font-family="${MONO}" font-size="10.5" fill="${c.apagado}">${esc(DONO)}/${esc(r.name)}</text>`);
  if (r.archived) {
    o.push(`<text x="${CARD_L - 14}" y="17.5" font-family="${MONO}" font-size="9" fill="${c.apagado}" text-anchor="end">arquivado</text>`);
  } else {
    o.push(`<circle cx="${CARD_L - 14}" cy="13.5" r="3" fill="${c.acento}" fill-opacity="0.55"/>`);
  }

  // ladrilho com a inicial, tingido pela linguagem principal
  o.push(`<rect x="14" y="38" width="40" height="40" rx="9" fill="${corTopo}" fill-opacity="0.16" stroke="${corTopo}" stroke-opacity="0.45"/>`);
  o.push(`<text x="34" y="65" font-family="${MONO}" font-size="20" font-weight="700" fill="${corTopo}" text-anchor="middle">${esc(r.name[0].toUpperCase())}</text>`);

  o.push(`<text x="66" y="53" font-family="${MONO}" font-size="15" font-weight="700" fill="${c.texto}">${esc(r.name)}<tspan fill="${c.acento}">_</tspan></text>`);

  quebrar(r.description, 46, 2).forEach((linha, i) => {
    o.push(`<text x="66" y="${72 + i * 14}" font-family="${MONO}" font-size="10.5" fill="${c.fraco}">${esc(linha)}</text>`);
  });

  // etiquetas: linguagens do repo, que e o que ele realmente tem
  let px = 66;
  r._langs.slice(0, 3).forEach((l) => {
    const w = l.nome.length * 6.1 + 16;
    o.push(`<rect x="${px}" y="${CARD_A - 34}" width="${w.toFixed(1)}" height="17" rx="8.5" fill="${c.pill}" stroke="${c.pillBorda}"/>`);
    o.push(`<text x="${px + w / 2}" y="${CARD_A - 22}" font-family="${MONO}" font-size="9" fill="${c.pillTexto}" text-anchor="middle">${esc(l.nome)}</text>`);
    px += w + 6;
  });

  o.push(`<text x="66" y="${CARD_A - 6}" font-family="${MONO}" font-size="9.5" fill="${c.apagado}">★ ${r.stargazers_count}  ·  atualizado ${esc(quandoFoi(r.pushed_at))}</text>`);

  // lista de linguagens com percentual
  r._langs.forEach((l, i) => {
    const ly = 48 + i * 15;
    o.push(`<circle cx="${CARD_L - 176}" cy="${ly - 3.5}" r="3.5" fill="${COR_LING[l.nome] || COR_PADRAO}"/>`);
    o.push(`<text x="${CARD_L - 166}" y="${ly}" font-family="${MONO}" font-size="9.5" fill="${c.fraco}">${esc(l.nome)} ${l.pct}%</text>`);
  });

  // rosca com o percentual da linguagem principal
  const cx = CARD_L - 46, cy = 66, raio = 22, circ = 2 * Math.PI * raio;
  o.push(`<circle cx="${cx}" cy="${cy}" r="${raio}" fill="none" stroke="${c.trilho}" stroke-width="6"/>`);
  o.push(`<circle cx="${cx}" cy="${cy}" r="${raio}" fill="none" stroke="${corTopo}" stroke-width="6"`
    + ` stroke-linecap="round" stroke-dasharray="${(circ * pct / 100).toFixed(1)} ${circ.toFixed(1)}"`
    + ` transform="rotate(-90 ${cx} ${cy})"/>`);
  o.push(`<text x="${cx}" y="${cy + 4}" font-family="${MONO}" font-size="11" font-weight="700" fill="${c.texto}" text-anchor="middle">${pct}%</text>`);

  o.push('</g>');
  return o.join('\n');
}

function painel(repos, c) {
  const linhas = Math.ceil(repos.length / 2);
  const A = TOPO + linhas * CARD_A + (linhas - 1) * GAP + 8;
  const o = [`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${L} ${A}" width="${L}" height="${A}" role="img" aria-label="Projetos publicos de ${DONO}">`];
  o.push(`<rect width="${L}" height="${A}" fill="${c.fundo}"/>`);
  o.push(`<text x="4" y="18" font-family="${MONO}" font-size="12.5" font-weight="700" fill="${c.acento}" letter-spacing="2">PROJECTS.LIST</text>`);
  o.push(`<text x="146" y="18" font-family="${MONO}" font-size="11" fill="${c.apagado}">./projetos.sh --todos</text>`);
  repos.forEach((r, i) => {
    const col = i % 2, lin = Math.floor(i / 2);
    o.push(card(r, col * (CARD_L + GAP) + 2, TOPO + lin * (CARD_A + GAP), c));
  });
  o.push('</svg>');
  return o.join('\n');
}

(async () => {
  const repos = await coletar();
  if (!repos.length) throw new Error('nenhum repositorio elegivel');
  fs.mkdirSync(SAIDA, { recursive: true });
  for (const [tema, c] of Object.entries(TEMAS)) {
    const arq = path.join(SAIDA, `projetos-${tema}.svg`);
    fs.writeFileSync(arq, painel(repos, c) + '\n');
    console.log(`projetos-${tema}.svg  ${Math.round(fs.statSync(arq).size / 1024)}KB`);
  }
  console.log('repos:', repos.map((r) => r.name).join(', '));
})();
