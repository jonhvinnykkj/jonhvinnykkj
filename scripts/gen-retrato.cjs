#!/usr/bin/env node
// Converte assets/retrato-fonte.jpg numa nuvem de pontos vetorial.
//
// Cada ponto e um pixel 1x1 escrito direto no atributo `d` de um <path>
// (`M12 34h1v1h-1z`), e todos os pontos de um mesmo tom entram no mesmo path.
// Sai um arquivo por tom, o que mantem o SVG leve e sem raster embutido.
//
//   node scripts/gen-retrato.cjs
//
// Depende do Chrome (via playwright-core) so pra decodificar o JPEG: o
// navegador desenha a imagem num canvas e devolve os pixels.

const fs = require('fs');
const path = require('path');
const { createRequire } = require('module');

const RAIZ = path.join(__dirname, '..');
const FONTE = path.join(RAIZ, 'assets', 'retrato-fonte.jpg');
const LARGURA = 210;  // colunas da grade de pontos
const TONS = 5;       // camadas de opacidade

// o playwright vive noutro projeto; carrega de la sem instalar nada aqui
function carregarChromium() {
  const req = createRequire(
    path.join(process.env.HOME, 'Desktop', 'Grupo Progresso - Projetos', 'feedback-sistemas', 'package.json'),
  );
  return req('playwright-core').chromium;
}

// Bayer 8x8: limiar ordenado que espalha os pontos de forma regular em vez de
// deixa-los se aglomerar como faria um sorteio
const BAYER = [
  [0, 32, 8, 40, 2, 34, 10, 42],
  [48, 16, 56, 24, 50, 18, 58, 26],
  [12, 44, 4, 36, 14, 46, 6, 38],
  [60, 28, 52, 20, 62, 30, 54, 22],
  [3, 35, 11, 43, 1, 33, 9, 41],
  [51, 19, 59, 27, 49, 17, 57, 25],
  [15, 47, 7, 39, 13, 45, 5, 37],
  [63, 31, 55, 23, 61, 29, 53, 21],
].map((l) => l.map((v) => (v + 0.5) / 64));

async function lerPixels() {
  const chromium = carregarChromium();
  const b = await chromium.launch({ headless: true, channel: 'chrome' });
  const p = await b.newPage();
  const b64 = fs.readFileSync(FONTE).toString('base64');
  const dados = await p.evaluate(
    async ([b64, largura]) => {
      const img = new Image();
      img.src = 'data:image/jpeg;base64,' + b64;
      await img.decode();
      const altura = Math.round((img.naturalHeight / img.naturalWidth) * largura);
      const c = document.createElement('canvas');
      c.width = largura;
      c.height = altura;
      const ctx = c.getContext('2d');
      ctx.drawImage(img, 0, 0, largura, altura);
      const d = ctx.getImageData(0, 0, largura, altura).data;
      return { largura, altura, dados: Array.from(d) };
    },
    [b64, LARGURA],
  );
  await b.close();
  return dados;
}

function construir({ largura, altura, dados }) {
  // tinta[y][x] = quanto de ponto aquele pixel merece, de 0 a 1
  const tinta = Array.from({ length: altura }, () => new Float32Array(largura));

  for (let y = 0; y < altura; y++) {
    for (let x = 0; x < largura; x++) {
      const i = (y * largura + x) * 4;
      const r = dados[i], g = dados[i + 1], bl = dados[i + 2];

      const luz = (0.2126 * r + 0.7152 * g + 0.0722 * bl) / 255;

      // Dois filtros somados, porque nenhum dos dois resolve sozinho:
      //
      // 1. Cor — a folhagem tem verde dominante. Pega a folha iluminada, mas
      //    deixa passar a sombra entre folhas, que e escura e quase neutra.
      // 2. Silhueta — mascara de busto (elipse da cabeca + ombros que abrem
      //    para baixo). Pega o que o filtro de cor deixou nos cantos.
      const u = x / largura;
      const w = y / altura;

      const folhagem = g > r * 1.02 && g > bl * 1.02;
      if (folhagem) continue;

      const cabecaX = (u - 0.47) / 0.21;
      const cabecaY = (w - 0.30) / 0.27;
      const naCabeca = cabecaX * cabecaX + cabecaY * cabecaY <= 1;
      const meioOmbro = Math.min(0.46, 0.10 + (w - 0.46) * 1.55);
      const nosOmbros = w >= 0.46 && Math.abs(u - 0.5) <= meioOmbro;
      if (!naCabeca && !nosOmbros) continue;

      // pontos representam tinta: quanto mais escuro o pixel, mais denso
      let v = 1 - luz;

      // Sem isto a camisa preta satura e o retrato vira silhueta chapada.
      // O expoente afina os tons claros e o fator derruba o teto, entao mesmo
      // o preto mais fechado deixa buraco entre os pontos.
      v = Math.pow(v, 1.55) * 0.86;


      tinta[y][x] = Math.max(0, Math.min(1, v));
    }
  }

  // cada tom vira um path: o pixel entra no tom t se sua tinta vence o limiar
  // ordenado daquele nivel
  const caminhos = Array.from({ length: TONS }, () => []);
  for (let y = 0; y < altura; y++) {
    for (let x = 0; x < largura; x++) {
      const v = tinta[y][x];
      if (v <= 0.06) continue;
      const limiar = BAYER[y & 7][x & 7];
      if (v < limiar) continue;
      // tom mais alto = pixel mais escuro na origem
      const t = Math.min(TONS - 1, Math.floor(v * TONS));
      caminhos[t].push(`M${x} ${y}h1v1h-1z`);
    }
  }
  // caixa justa do que sobrou, para o heroi encaixar sem margem morta
  let x0 = largura, y0 = altura, x1 = 0, y1 = 0;
  for (let y = 0; y < altura; y++) {
    for (let x = 0; x < largura; x++) {
      if (tinta[y][x] <= 0.06) continue;
      if (x < x0) x0 = x;
      if (x > x1) x1 = x;
      if (y < y0) y0 = y;
      if (y > y1) y1 = y;
    }
  }
  return { caminhos, largura, altura, caixa: { x: x0, y: y0, l: x1 - x0 + 1, a: y1 - y0 + 1 } };
}

function svg({ caminhos, caixa }, cores) {
  const linhas = [
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${caixa.x} ${caixa.y} ${caixa.l} ${caixa.a}" width="${caixa.l}" height="${caixa.a}" role="img" aria-label="Retrato em nuvem de pontos">`,
  ];
  caminhos.forEach((pts, t) => {
    if (!pts.length) return;
    // tons baixos ficam mais apagados; os altos, quase cheios
    const op = (0.3 + (0.7 * t) / (TONS - 1)).toFixed(2);
    linhas.push(`<path fill="${cores[t] ?? cores[cores.length - 1]}" fill-opacity="${op}" d="${pts.join('')}"/>`);
  });
  linhas.push('</svg>');
  return linhas.join('\n');
}

(async () => {
  if (!fs.existsSync(FONTE)) {
    console.error('falta assets/retrato-fonte.jpg');
    process.exit(1);
  }
  const bruto = await lerPixels();
  const arte = construir(bruto);
  const total = arte.caminhos.reduce((s, p) => s + p.length, 0);

  const PALETAS = {
    dark: ['#0e4429', '#006d32', '#26a641', '#39d353', '#4ae168'],
    light: ['#9be9a8', '#40c463', '#30a14e', '#216e39', '#144d27'],
  };
  for (const [tema, cores] of Object.entries(PALETAS)) {
    const saida = path.join(RAIZ, 'assets', `retrato-${tema}.svg`);
    fs.writeFileSync(saida, svg(arte, cores) + '\n');
    const kb = Math.round(fs.statSync(saida).size / 1024);
    console.log(`retrato-${tema}.svg  ${arte.caixa.l}x${arte.caixa.a}  ${total} pontos  ${kb}KB`);
  }
})();
