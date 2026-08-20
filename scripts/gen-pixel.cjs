#!/usr/bin/env node
// Gera os assets em pixel art do perfil: o nome no topo e a grade de
// contribuicoes do rodape, nas versoes dark e light.
const fs = require('fs');
const path = require('path');

const NOME = process.env.NOME || 'JONHVINNYKKJ';
const OUT = path.join(__dirname, '..', 'assets');

// fonte 5x7 — so o que o nome precisa, mais o alfabeto completo pra trocar depois
const FONTE = {
  A: ['.###.', '#...#', '#...#', '#####', '#...#', '#...#', '#...#'],
  B: ['####.', '#...#', '#...#', '####.', '#...#', '#...#', '####.'],
  C: ['.####', '#....', '#....', '#....', '#....', '#....', '.####'],
  D: ['####.', '#...#', '#...#', '#...#', '#...#', '#...#', '####.'],
  E: ['#####', '#....', '#....', '####.', '#....', '#....', '#####'],
  F: ['#####', '#....', '#....', '####.', '#....', '#....', '#....'],
  G: ['.####', '#....', '#....', '#.###', '#...#', '#...#', '.###.'],
  H: ['#...#', '#...#', '#...#', '#####', '#...#', '#...#', '#...#'],
  I: ['#####', '..#..', '..#..', '..#..', '..#..', '..#..', '#####'],
  J: ['..###', '....#', '....#', '....#', '#...#', '#...#', '.###.'],
  K: ['#...#', '#..#.', '#.#..', '##...', '#.#..', '#..#.', '#...#'],
  L: ['#....', '#....', '#....', '#....', '#....', '#....', '#####'],
  M: ['#...#', '##.##', '#.#.#', '#...#', '#...#', '#...#', '#...#'],
  N: ['#...#', '##..#', '#.#.#', '#..##', '#...#', '#...#', '#...#'],
  O: ['.###.', '#...#', '#...#', '#...#', '#...#', '#...#', '.###.'],
  P: ['####.', '#...#', '#...#', '####.', '#....', '#....', '#....'],
  Q: ['.###.', '#...#', '#...#', '#...#', '#.#.#', '#..#.', '.##.#'],
  R: ['####.', '#...#', '#...#', '####.', '#.#..', '#..#.', '#...#'],
  S: ['.####', '#....', '#....', '.###.', '....#', '....#', '####.'],
  T: ['#####', '..#..', '..#..', '..#..', '..#..', '..#..', '..#..'],
  U: ['#...#', '#...#', '#...#', '#...#', '#...#', '#...#', '.###.'],
  V: ['#...#', '#...#', '#...#', '#...#', '#...#', '.#.#.', '..#..'],
  W: ['#...#', '#...#', '#...#', '#...#', '#.#.#', '##.##', '#...#'],
  X: ['#...#', '#...#', '.#.#.', '..#..', '.#.#.', '#...#', '#...#'],
  Y: ['#...#', '#...#', '.#.#.', '..#..', '..#..', '..#..', '..#..'],
  Z: ['#####', '....#', '...#.', '..#..', '.#...', '#....', '#####'],
  0: ['.###.', '#...#', '#..##', '#.#.#', '##..#', '#...#', '.###.'],
  1: ['..#..', '.##..', '..#..', '..#..', '..#..', '..#..', '.###.'],
  2: ['.###.', '#...#', '....#', '..##.', '.#...', '#....', '#####'],
  3: ['####.', '....#', '....#', '.###.', '....#', '....#', '####.'],
  4: ['#..#.', '#..#.', '#..#.', '#####', '...#.', '...#.', '...#.'],
  5: ['#####', '#....', '####.', '....#', '....#', '#...#', '.###.'],
  6: ['.###.', '#....', '#....', '####.', '#...#', '#...#', '.###.'],
  7: ['#####', '....#', '...#.', '..#..', '.#...', '.#...', '.#...'],
  8: ['.###.', '#...#', '#...#', '.###.', '#...#', '#...#', '.###.'],
  9: ['.###.', '#...#', '#...#', '.####', '....#', '....#', '.###.'],
  ' ': ['.....', '.....', '.....', '.....', '.....', '.....', '.....'],
};

const TEMAS = {
  dark: {
    fundo: '#0d1117',
    vazio: '#161b22',
    // do mais apagado ao mais aceso, igual a escala de contribuicoes do GitHub
    escala: ['#0e4429', '#006d32', '#26a641', '#39d353'],
  },
  light: {
    fundo: '#ffffff',
    vazio: '#ebedf0',
    escala: ['#9be9a8', '#40c463', '#30a14e', '#216e39'],
  },
};

// ruido deterministico: mesmo asset a cada rodada, sem depender de Math.random
function hash(x, y, sal) {
  let h = (x * 374761393 + y * 668265263 + sal * 2246822519) >>> 0;
  h = (h ^ (h >>> 13)) >>> 0;
  h = Math.imul(h, 1274126177) >>> 0;
  return ((h ^ (h >>> 16)) >>> 0) / 4294967295;
}

function svgNome(tema, cor) {
  const CELULA = 7, PASSO = 9, MARGEM = 5, PAD_X = 2, PAD_Y = 1, AVANCO = 7;
  const letras = NOME.toUpperCase().split('').map((c) => FONTE[c] || FONTE[' ']);
  const larguraTexto = letras.length * AVANCO - (AVANCO - 5);
  const cols = larguraTexto + PAD_X * 2;
  const rows = 7 + PAD_Y * 2;
  const w = MARGEM * 2 + cols * PASSO - (PASSO - CELULA);
  const h = MARGEM * 2 + rows * PASSO - (PASSO - CELULA);

  // matriz de acesos
  const aceso = Array.from({ length: rows }, () => Array(cols).fill(false));
  letras.forEach((glifo, i) => {
    glifo.forEach((linha, y) => {
      linha.split('').forEach((px, x) => {
        if (px === '#') aceso[y + PAD_Y][i * AVANCO + x + PAD_X] = true;
      });
    });
  });

  const out = [
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${w} ${h}" width="${w}" height="${h}" role="img" aria-label="${NOME} em pixel art">`,
    `<rect width="${w}" height="${h}" rx="10" fill="${cor.fundo}"/>`,
  ];
  for (let y = 0; y < rows; y++) {
    for (let x = 0; x < cols; x++) {
      const r = hash(x, y, 7);
      let fill;
      if (aceso[y][x]) {
        // letra acesa: so os dois tons mais fortes, pra manter a leitura
        fill = cor.escala[r < 0.45 ? 2 : 3];
      } else if (r > 0.95) {
        // um respingo de verde apagado no fundo da a textura de "grade viva"
        fill = cor.escala[0];
      } else {
        fill = cor.vazio;
      }
      out.push(`<rect x="${MARGEM + x * PASSO}" y="${MARGEM + y * PASSO}" width="${CELULA}" height="${CELULA}" rx="2" fill="${fill}"/>`);
    }
  }
  out.push('</svg>');
  fs.writeFileSync(path.join(OUT, `name-pixel-${tema}.svg`), out.join('\n') + '\n');
  return `${w}x${h}`;
}

// contrib.json e um retrato do calendario real de contribuicoes. Pra atualizar:
//   gh api graphql -f query='query { user(login: "jonhvinnykkj") {
//     contributionsCollection { contributionCalendar {
//       totalContributions weeks { contributionDays { contributionCount weekday } } } } } }'
// e reescrever { total, weeks: number[][], firstWeekday, lastWeekday }.
function lerCalendario() {
  const arquivo = path.join(__dirname, 'contrib.json');
  if (!fs.existsSync(arquivo)) return null;
  return JSON.parse(fs.readFileSync(arquivo, 'utf8'));
}

// mesma logica do GitHub: nivel 0 pra dia sem commit, os outros tres por quartil
// dos dias que tiveram alguma coisa
function faixas(semanas) {
  const ativos = semanas.flat().filter((n) => n > 0).sort((a, b) => a - b);
  if (!ativos.length) return [1, 2, 3];
  const q = (f) => ativos[Math.min(ativos.length - 1, Math.floor(ativos.length * f))];
  return [q(0.25), q(0.5), q(0.75)];
}

function svgGrade(tema, cor) {
  const CELULA = 11, PASSO = 14, MARGEM = 4, DIAS = 7;
  const cal = lerCalendario();
  const semanas = cal ? cal.weeks : [];
  const SEMANAS = semanas.length || 53;
  const [q1, q2, q3] = faixas(semanas);
  const w = MARGEM * 2 + SEMANAS * PASSO - (PASSO - CELULA);
  const h = MARGEM * 2 + DIAS * PASSO - (PASSO - CELULA);
  const rotulo = cal
    ? `${cal.total} contribuicoes no ultimo ano`
    : 'Grade de contribuicoes';
  const out = [
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${w} ${h}" width="${w}" height="${h}" role="img" aria-label="${rotulo}">`,
    `<title>${rotulo}</title>`,
  ];
  for (let s = 0; s < SEMANAS; s++) {
    // a primeira e a ultima semana sao parciais: o dia que ainda nao existe fica vazio
    const semana = semanas[s] || [];
    const offset = s === 0 && cal ? cal.firstWeekday : 0;
    for (let d = 0; d < DIAS; d++) {
      const idx = d - offset;
      const n = idx >= 0 && idx < semana.length ? semana[idx] : null;
      let fill = cor.vazio;
      if (n === null) fill = 'none';
      else if (n === 0) fill = cor.vazio;
      else if (n <= q1) fill = cor.escala[0];
      else if (n <= q2) fill = cor.escala[1];
      else if (n <= q3) fill = cor.escala[2];
      else fill = cor.escala[3];
      if (fill === 'none') continue;
      out.push(`<rect x="${MARGEM + s * PASSO}" y="${MARGEM + d * PASSO}" width="${CELULA}" height="${CELULA}" rx="2" fill="${fill}"/>`);
    }
  }
  out.push('</svg>');
  fs.writeFileSync(path.join(OUT, `contrib-grid-${tema}.svg`), out.join('\n') + '\n');
  return `${w}x${h}${cal ? ` (${cal.total} contribuicoes)` : ' (sintetico)'}`;
}

// ---------------------------------------------------------------------------
// Faixa de talhoes: uma vista aerea de lavoura, cada retangulo e um talhao com
// seu proprio vigor. Mesma gramatica de celula da grade de contribuicoes.
// ---------------------------------------------------------------------------
function svgTalhoes(tema, cor) {
  const CELULA = 7, PASSO = 9, MARGEM = 5, COLS = 86, BANDAS = 3, ALTURA_BANDA = 2;
  // entre as bandas fica uma linha vazia: o carreador que separa os talhoes
  const rows = BANDAS * ALTURA_BANDA + (BANDAS - 1);
  const w = MARGEM * 2 + COLS * PASSO - (PASSO - CELULA);
  const h = MARGEM * 2 + rows * PASSO - (PASSO - CELULA);

  const nivel = Array.from({ length: rows }, () => Array(COLS).fill(-1));
  for (let b = 0; b < BANDAS; b++) {
    const topo = b * (ALTURA_BANDA + 1);
    let x = 0, i = 0;
    while (x < COLS) {
      const larg = 5 + Math.floor(hash(b, i, 31) * 9);
      const r = hash(b, i, 47);
      // vigor do talhao: a maioria em meio-termo, um em cinco em pousio
      let base;
      if (r < 0.2) base = -1;
      else if (r < 0.45) base = 0;
      else if (r < 0.75) base = 1;
      else if (r < 0.93) base = 2;
      else base = 3;
      // a ultima coluna do talhao fica vazia: e a divisa entre um e outro
      for (let dx = 0; dx < larg - 1 && x + dx < COLS; dx++) {
        for (let dy = 0; dy < ALTURA_BANDA; dy++) {
          let n = base;
          if (n > 0 && hash(x + dx, topo + dy, 71) > 0.82) n -= 1;
          nivel[topo + dy][x + dx] = n;
        }
      }
      x += larg;
      i++;
    }
  }

  const out = [
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${w} ${h}" width="${w}" height="${h}" role="img" aria-label="Talhoes de lavoura em pixel art">`,
  ];
  for (let y = 0; y < rows; y++) {
    for (let x = 0; x < COLS; x++) {
      const n = nivel[y][x];
      const fill = n < 0 ? cor.vazio : cor.escala[n];
      out.push(`<rect x="${MARGEM + x * PASSO}" y="${MARGEM + y * PASSO}" width="${CELULA}" height="${CELULA}" rx="2" fill="${fill}"/>`);
    }
  }
  out.push('</svg>');
  fs.writeFileSync(path.join(OUT, `talhoes-${tema}.svg`), out.join('\n') + '\n');
  return `${w}x${h}`;
}

// ---------------------------------------------------------------------------
// Rota do intercambio: Pompeia (SP) -> Braganca (PT), com os dois continentes
// em pixel e o arco pontilhado entre eles.
// ---------------------------------------------------------------------------
// silhuetas amostradas do contorno real: Brasil num quadro de 16x17 celulas
// (lon -74..-34, lat +5..-34) e a Peninsula Iberica em 14x9 (lon -9.5..+3.3,
// lat 43.8..36.0). Cada celula vale cerca de 2.7 graus no Brasil e 0.9 na Iberia.
const BRASIL = [
  '....######......',
  '..#########.....',
  '############....',
  '###############.',
  '################',
  '################',
  '.##############.',
  '...###########..',
  '.....#########..',
  '......########..',
  '......#######...',
  '......######....',
  '.......####.....',
  '.......###......',
  '......####......',
  '......###.......',
  '.......##.......',
];
const IBERIA = [
  '##########....',
  '##############',
  '##############',
  '##############',
  '##############',
  '###########...',
  '##########....',
  '#########.....',
  '..######......',
];

function svgRota(tema, cor) {
  const CELULA = 7, PASSO = 9, MARGEM = 5, COLS = 74, ROWS = 21;
  const w = MARGEM * 2 + COLS * PASSO - (PASSO - CELULA);
  const h = MARGEM * 2 + ROWS * PASSO - (PASSO - CELULA);
  const celulas = new Map();
  const por = (x, y, fill) => {
    if (x < 0 || y < 0 || x >= COLS || y >= ROWS) return;
    celulas.set(`${x},${y}`, fill);
  };

  // Brasil a esquerda, com Pompeia acesa no sudeste
  const BX = 2, BY = 2, POMPEIA = [9, 11];  // Pompeia (SP): -22.1, -50.5
  BRASIL.forEach((linha, y) => linha.split('').forEach((c, x) => {
    if (c === '#') por(BX + x, BY + y, cor.escala[1]);
  }));
  por(BX + POMPEIA[0], BY + POMPEIA[1], cor.escala[3]);

  // Iberia a direita: Portugal (faixa oeste) aceso, Espanha apagada
  const IX = 57, IY = 7, BRAGANCA = [3, 2];  // Braganca (PT): 41.8, -6.8
  IBERIA.forEach((linha, y) => linha.split('').forEach((c, x) => {
    if (c !== '#') return;
    // Portugal e a faixa oeste (lon < -6.2); a Espanha fica apagada atras
    const portugal = x <= 3 && y >= 1 && y <= 7;
    por(IX + x, IY + y, portugal ? cor.escala[1] : cor.escala[0]);
  }));
  por(IX + BRAGANCA[0], IY + BRAGANCA[1], cor.escala[3]);

  // arco pontilhado ligando os dois pontos
  const x0 = BX + POMPEIA[0], y0 = BY + POMPEIA[1];
  const x1 = IX + BRAGANCA[0], y1 = IY + BRAGANCA[1];
  for (let k = 1; k <= 13; k++) {
    const t = k / 14;
    const x = Math.round(x0 + (x1 - x0) * t);
    const y = Math.round(y0 + (y1 - y0) * t - 5.5 * Math.sin(Math.PI * t));
    if (!celulas.has(`${x},${y}`)) por(x, y, cor.escala[2]);
  }

  const out = [
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${w} ${h}" width="${w}" height="${h}" role="img" aria-label="Rota do intercambio: Pompeia, Brasil para Braganca, Portugal">`,
    `<title>Pompeia (SP) para Braganca (PT)</title>`,
  ];
  for (let y = 0; y < ROWS; y++) {
    for (let x = 0; x < COLS; x++) {
      const fill = celulas.get(`${x},${y}`) || cor.vazio;
      out.push(`<rect x="${MARGEM + x * PASSO}" y="${MARGEM + y * PASSO}" width="${CELULA}" height="${CELULA}" rx="2" fill="${fill}"/>`);
    }
  }
  out.push('</svg>');
  fs.writeFileSync(path.join(OUT, `rota-${tema}.svg`), out.join('\n') + '\n');
  return `${w}x${h}`;
}

for (const [tema, cor] of Object.entries(TEMAS)) {
  console.log(`name-pixel-${tema}.svg  ${svgNome(tema, cor)}`);
  console.log(`contrib-grid-${tema}.svg ${svgGrade(tema, cor)}`);
  console.log(`talhoes-${tema}.svg      ${svgTalhoes(tema, cor)}`);
  console.log(`rota-${tema}.svg         ${svgRota(tema, cor)}`);
}
