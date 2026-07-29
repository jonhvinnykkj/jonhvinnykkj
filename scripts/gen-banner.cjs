const fs = require('fs');
const path = require('path');

const W = 1200, H = 320;
const HORIZONTE = 210;      // linha do horizonte
const VP = { x: 820, y: HORIZONTE }; // ponto de fuga, deslocado à direita

const TEMAS = {
  dark: {
    nome: 'dark',
    fundo: '#0A1210',        // preto com viés verde — solo à noite
    fundoAlto: '#101C17',
    osso: '#E9E4D6',         // papel da pauta de balança
    sage: '#7C8F84',         // texto secundário
    hairline: '#2C3E36',
    lavoura: '#8FD694',      // verde de lavoura nova — acento
    safra: '#E3B04B',        // dourado de capim seco — só números
    linhas: '#3FA06A',
    brilhoHorizonte: '#2E6B4F',
    sweep: '#8FD694',
    sweepOp: '0.10',
    opBase: 0.14, opRange: 0.40,
  },
  light: {
    nome: 'light',
    fundo: '#E4DECE',
    fundoAlto: '#F1EDE2',
    osso: '#132419',
    sage: '#586A5E',
    hairline: '#BDB6A4',
    lavoura: '#26604A',
    safra: '#8A5F16',
    linhas: '#4E6B58',
    brilhoHorizonte: '#B9C9BC',
    sweep: '#2E6B4F',
    sweepOp: '0.07',
    opBase: 0.20, opRange: 0.50,
  },
};

/** Linhas de plantio convergindo para o ponto de fuga. */
function linhasPlantio(t) {
  const linhas = [];
  for (let x = -1000; x <= 2400; x += 68) {
    // largura afina conforme se aproxima do centro (perspectiva)
    const dist = Math.abs(x - VP.x) / 1400;
    const w = (0.5 + dist * 0.75).toFixed(2);
    const op = (t.opBase + dist * t.opRange).toFixed(2);
    linhas.push(
      `<line x1="${x}" y1="${H + 10}" x2="${VP.x}" y2="${VP.y}" stroke="${t.linhas}" stroke-width="${w}" opacity="${op}"/>`
    );
  }
  return linhas.join('\n      ');
}

function svg(t) {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}" role="img" aria-label="vinnycius — sistemas internos para o agronegócio">
  <title>vinnycius — sistemas internos para o agronegócio</title>

  <defs>
    <linearGradient id="ceu" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="${t.fundoAlto}"/>
      <stop offset="100%" stop-color="${t.fundo}"/>
    </linearGradient>

    <!-- lavoura some perto do horizonte: dá a profundidade -->
    <linearGradient id="profundidade" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#fff" stop-opacity="0"/>
      <stop offset="42%" stop-color="#fff" stop-opacity="0.28"/>
      <stop offset="80%" stop-color="#fff" stop-opacity="0.85"/>
      <stop offset="100%" stop-color="#fff" stop-opacity="1"/>
    </linearGradient>
    <mask id="mascaraCampo">
      <rect x="0" y="${HORIZONTE}" width="${W}" height="${H - HORIZONTE}" fill="url(#profundidade)"/>
    </mask>

    <!-- brilho do horizonte, mais forte sobre o ponto de fuga -->
    <radialGradient id="brilho" cx="${(VP.x / W) * 100}%" cy="100%" r="44%">
      <stop offset="0%" stop-color="${t.brilhoHorizonte}" stop-opacity="0.42"/>
      <stop offset="100%" stop-color="${t.brilhoHorizonte}" stop-opacity="0"/>
    </radialGradient>

    <!-- fio do horizonte: some nas bordas -->
    <linearGradient id="fio" gradientUnits="userSpaceOnUse" x1="0" y1="0" x2="${W}" y2="0">
      <stop offset="0%" stop-color="${t.lavoura}" stop-opacity="0"/>
      <stop offset="16%" stop-color="${t.lavoura}" stop-opacity="0.9"/>
      <stop offset="84%" stop-color="${t.lavoura}" stop-opacity="0.9"/>
      <stop offset="100%" stop-color="${t.lavoura}" stop-opacity="0"/>
    </linearGradient>

    <linearGradient id="vinheta" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="${t.fundo}" stop-opacity="0"/>
      <stop offset="100%" stop-color="${t.fundo}" stop-opacity="0.55"/>
    </linearGradient>

    <!-- varredura de luz sobre a lavoura -->
    <linearGradient id="luz" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0%" stop-color="${t.sweep}" stop-opacity="0"/>
      <stop offset="50%" stop-color="${t.sweep}" stop-opacity="${t.sweepOp}"/>
      <stop offset="100%" stop-color="${t.sweep}" stop-opacity="0"/>
    </linearGradient>

    <style>
      .mono { font-family: ui-monospace, SFMono-Regular, "SF Mono", Menlo, Consolas, "Liberation Mono", monospace; }
      .sans { font-family: system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", sans-serif; }
      .varredura { animation: passa 19s linear infinite; }
      @keyframes passa {
        from { transform: translateX(-620px); }
        to   { transform: translateX(1420px); }
      }
      @media (prefers-reduced-motion: reduce) {
        .varredura { animation: none; opacity: 0; }
      }
    </style>
  </defs>

  <rect width="${W}" height="${H}" fill="url(#ceu)"/>
  <rect x="0" y="${HORIZONTE - 120}" width="${W}" height="${H - HORIZONTE + 120}" fill="url(#brilho)"/>

  <!-- === LAVOURA === -->
  <g mask="url(#mascaraCampo)">
    <g>
      ${linhasPlantio(t)}
    </g>
    <g class="varredura">
      <rect x="0" y="${HORIZONTE}" width="620" height="${H - HORIZONTE}" fill="url(#luz)"/>
    </g>
  </g>

  <!-- === HORIZONTE === bloom largo embaixo, fio nítido em cima -->
  <line x1="0" y1="${HORIZONTE}" x2="${W}" y2="${HORIZONTE}" stroke="url(#fio)" stroke-width="7" opacity="0.22"/>
  <line x1="0" y1="${HORIZONTE}" x2="${W}" y2="${HORIZONTE}" stroke="url(#fio)" stroke-width="1.2"/>

  <rect x="0" y="${H - 34}" width="${W}" height="34" fill="url(#vinheta)"/>

  <!-- === IDENTIFICAÇÃO === -->
  <text class="mono" x="72" y="72" fill="${t.sage}" font-size="12.5" letter-spacing="4.2">SISTEMAS INTERNOS · AGRONEGÓCIO</text>

  <text class="mono" x="70" y="140" fill="${t.osso}" font-size="62" font-weight="700" letter-spacing="-1.5">vinnycius</text>

  <text class="sans" x="72" y="174" fill="${t.sage}" font-size="16.5">Do controle de balança na fazenda ao dashboard que a diretoria abre de manhã.</text>

  <!-- === LEITURA === alinhada à direita, como painel de instrumento -->
  <g class="mono" text-anchor="end">
    <text x="${W - 72}" y="66" fill="${t.sage}" font-size="11" letter-spacing="2.6">EM PRODUÇÃO</text>
    <text x="${W - 72}" y="104" fill="${t.safra}" font-size="34" font-weight="700" letter-spacing="-0.5">08</text>
    <text x="${W - 72}" y="134" fill="${t.sage}" font-size="11" letter-spacing="2.6">STACK</text>
    <text x="${W - 72}" y="164" fill="${t.osso}" font-size="17" font-weight="600">TypeScript · Python</text>
  </g>
</svg>
`;
}

const dir = path.join(__dirname, '..', 'assets');
fs.mkdirSync(dir, { recursive: true });
Object.values(TEMAS).forEach((t) => {
  const arquivo = path.join(dir, `header-${t.nome}.svg`);
  fs.writeFileSync(arquivo, svg(t));
  console.log(`${arquivo} — ${(fs.statSync(arquivo).size / 1024).toFixed(1)} KB`);
});
