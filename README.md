<div align="center">

<picture>
  <source media="(prefers-color-scheme: dark)" srcset="assets/name-pixel-dark.svg" />
  <source media="(prefers-color-scheme: light)" srcset="assets/name-pixel-light.svg" />
  <img src="assets/name-pixel-dark.svg" alt="JONHVINNYKKJ" width="782" />
</picture>

<h3>Sistemas internos para o agronegócio &nbsp;|&nbsp; Full Stack &amp; Dados</h3>

<p>
  <b>Construo os sistemas que fazem uma operação de agronegócio funcionar</b><br/>
  Pesagem &nbsp;·&nbsp; Rastreabilidade &nbsp;·&nbsp; Financeiro &nbsp;·&nbsp; e o portal que junta tudo
</p>

<img src="https://komarev.com/ghpvc/?username=jonhvinnykkj&amp;label=Visitantes%20do%20perfil&amp;color=39d353&amp;style=flat-square" alt="contador de visitas" />

</div>

---

## 👋 Sobre mim

Trabalho no que quase nunca aparece: o software interno que sustenta a operação de um grupo do
agronegócio. Balança de caminhão, fardo de algodão saindo do campo, título vencendo no ERP — cada
uma dessas coisas vira tela, relatório e decisão.

A maior parte do que construo **roda em produção e é privada**. A lista abaixo está aqui pelo
escopo, não pelo link.

- 🌾 Sistemas internos de **pesagem, rastreabilidade e financeiro** para o agro
- 🧩 Portal central com **SSO e permissão por sistema** para ~18 aplicações do grupo
- 🔌 Integração com **ERP legado (TOTVS)** e geração de relatório e PDF no servidor
- 🐳 **Docker + Railway** para deploy e ambientes reproduzíveis
- 📍 Pompeia — SP &nbsp;·&nbsp; [@FhSoftwareSolutions](https://github.com/FhSoftwareSolutions)

---

## 🚜 Em produção

> Onde mora o atrito real desse tipo de sistema — e onde eu passo a maior parte do tempo — é na
> integração com o ERP legado e na geração de relatório e PDF no servidor.

| Sistema | O que resolve | Stack |
| :--- | :--- | :--- |
| **Hub Progresso** | Portal central dos ~18 sistemas do grupo, com SSO e permissão por sistema | Next.js · Prisma · NextAuth |
| **Balança** | Controle de safra e pesagem de cargas, com termo LGPD assinado e comprovante em PDF | Express · Prisma · React |
| **Cotton App** | Rastreabilidade de fardos de algodão, do campo à indústria | Vite · Express · Drizzle |
| **Dashboard Financeiro** | Títulos, vencimentos e moeda estrangeira sobre a base do ERP | Python · PostgreSQL |
| **Sementes & Commodities** | Dashboard financeiro com câmbio USD por operação | FastAPI · Next.js |
| **Instituto Cultivar** | Plataforma do braço social do grupo, com CRM e gestão de projetos | Next.js 15 · Payload CMS 3 |
| **Site institucional** | Site do grupo, com mapa interativo dos representantes por estado | Vite · React · Express |
| **Pulso Digital** | Pesquisa de opinião interna: formulário anônimo + dashboard | Next.js 16 · Prisma |

---

## 🛠️ Tecnologias & Ferramentas

<div align="center">

### Linguagens
<img src="https://skillicons.dev/icons?i=ts,js,python,java&amp;theme=dark" alt="Linguagens" />

### Front-end
<img src="https://skillicons.dev/icons?i=react,nextjs,vite,tailwind,html,css&amp;theme=dark" alt="Front-end" />

### Back-end &amp; Dados
<img src="https://skillicons.dev/icons?i=nodejs,express,fastapi,prisma,postgres,supabase&amp;theme=dark" alt="Back-end e Dados" />

### DevOps &amp; Ferramentas
<img src="https://skillicons.dev/icons?i=docker,cloudflare,git,github,vscode,postman&amp;theme=dark" alt="DevOps e Ferramentas" />

</div>

<br/>

<div align="center">

![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)
![Python](https://img.shields.io/badge/Python-3776AB?style=for-the-badge&logo=python&logoColor=white)
![Java](https://img.shields.io/badge/Java-ED8B00?style=for-the-badge&logo=openjdk&logoColor=white)
![Next.js](https://img.shields.io/badge/Next.js-000000?style=for-the-badge&logo=nextdotjs&logoColor=white)
![React](https://img.shields.io/badge/React-61DAFB?style=for-the-badge&logo=react&logoColor=black)
![Vite](https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind%20CSS-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white)
![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)
![Express](https://img.shields.io/badge/Express-000000?style=for-the-badge&logo=express&logoColor=white)
![FastAPI](https://img.shields.io/badge/FastAPI-009688?style=for-the-badge&logo=fastapi&logoColor=white)
![Prisma](https://img.shields.io/badge/Prisma-2D3748?style=for-the-badge&logo=prisma&logoColor=white)
![Drizzle](https://img.shields.io/badge/Drizzle-C5F74F?style=for-the-badge&logo=drizzle&logoColor=black)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-4169E1?style=for-the-badge&logo=postgresql&logoColor=white)
![Payload CMS](https://img.shields.io/badge/Payload%20CMS-000000?style=for-the-badge&logo=payloadcms&logoColor=white)
![Docker](https://img.shields.io/badge/Docker-2496ED?style=for-the-badge&logo=docker&logoColor=white)
![Railway](https://img.shields.io/badge/Railway-0B0D0E?style=for-the-badge&logo=railway&logoColor=white)
![Cloudflare R2](https://img.shields.io/badge/Cloudflare%20R2-F38020?style=for-the-badge&logo=cloudflare&logoColor=white)

</div>

---

## 🧩 Onde cada peça entra

| Camada | O que uso e por quê |
| :--- | :--- |
| **Front** | `Next.js` para o que precisa de SSR e rota protegida · `Vite + React` para painel interno rápido |
| **Back** | `Node/Express` no que é CRUD e regra de negócio · `FastAPI` quando o peso está no cálculo e no dado |
| **Dados** | `Prisma` e `Drizzle` sobre `PostgreSQL` — schema versionado e migração à mão quando precisa |
| **ERP** | Leitura da base legada do TOTVS: normalização de moeda, vencimento e título antes de virar tela |
| **Documento** | `Puppeteer` para comprovante e termo LGPD assinado em PDF, gerados no servidor |
| **Infra** | `Docker` e `Railway` para deploy · `Cloudflare R2` para arquivo e mídia |

---

## 📦 Também por aqui

- **[PluView](https://github.com/FhSoftwareSolutions)** — telemetria de estações meteorológicas em fazenda, com dashboard web. Firmware, API e front.
- **[game-alert](https://github.com/jonhvinnykkj/game-alert)** — bot de Telegram que monitora promoções de jogos em PlayStation e Xbox.
- **[market-pi](https://github.com/jonhvinnykkj/market-pi)** — marketplace em Vite + React + shadcn/ui com API própria e PostgreSQL.
- Para clientes: site e credenciamento de eventos da agência E+, marketplace de hospedagem.

---

## 📊 Estatísticas do GitHub

<div align="center">

<picture>
  <source media="(prefers-color-scheme: dark)" srcset="https://github-readme-stats-salesp07.vercel.app/api?username=jonhvinnykkj&amp;show_icons=true&amp;include_all_commits=true&amp;count_private=true&amp;hide_border=true&amp;locale=pt-br&amp;disable_animations=true&amp;cache_seconds=1800&amp;bg_color=0d1117&amp;title_color=39d353&amp;icon_color=26a641&amp;text_color=c9d1d9" />
  <source media="(prefers-color-scheme: light)" srcset="https://github-readme-stats-salesp07.vercel.app/api?username=jonhvinnykkj&amp;show_icons=true&amp;include_all_commits=true&amp;count_private=true&amp;hide_border=true&amp;locale=pt-br&amp;disable_animations=true&amp;cache_seconds=1800&amp;bg_color=ffffff&amp;title_color=216e39&amp;icon_color=30a14e&amp;text_color=24292f" />
  <img height="165em" src="https://github-readme-stats-salesp07.vercel.app/api?username=jonhvinnykkj&amp;show_icons=true&amp;include_all_commits=true&amp;count_private=true&amp;hide_border=true&amp;locale=pt-br&amp;disable_animations=true&amp;cache_seconds=1800&amp;bg_color=0d1117&amp;title_color=39d353&amp;icon_color=26a641&amp;text_color=c9d1d9" alt="Estatisticas do GitHub" />
</picture>
<picture>
  <source media="(prefers-color-scheme: dark)" srcset="https://github-readme-stats-salesp07.vercel.app/api/top-langs/?username=jonhvinnykkj&amp;layout=compact&amp;langs_count=8&amp;hide_border=true&amp;locale=pt-br&amp;disable_animations=true&amp;cache_seconds=1800&amp;bg_color=0d1117&amp;title_color=39d353&amp;icon_color=26a641&amp;text_color=c9d1d9" />
  <source media="(prefers-color-scheme: light)" srcset="https://github-readme-stats-salesp07.vercel.app/api/top-langs/?username=jonhvinnykkj&amp;layout=compact&amp;langs_count=8&amp;hide_border=true&amp;locale=pt-br&amp;disable_animations=true&amp;cache_seconds=1800&amp;bg_color=ffffff&amp;title_color=216e39&amp;icon_color=30a14e&amp;text_color=24292f" />
  <img height="165em" src="https://github-readme-stats-salesp07.vercel.app/api/top-langs/?username=jonhvinnykkj&amp;layout=compact&amp;langs_count=8&amp;hide_border=true&amp;locale=pt-br&amp;disable_animations=true&amp;cache_seconds=1800&amp;bg_color=0d1117&amp;title_color=39d353&amp;icon_color=26a641&amp;text_color=c9d1d9" alt="Linguagens mais usadas" />
</picture>

</div>

---

## 📫 Vamos conversar?

<div align="center">

<a href="mailto:midia@grupoprogresso.agr.br">
  <img src="https://img.shields.io/badge/E--mail-EA4335?style=for-the-badge&amp;logo=gmail&amp;logoColor=white" alt="E-mail" />
</a>
<a href="https://github.com/jonhvinnykkj" target="_blank">
  <img src="https://img.shields.io/badge/GitHub-181717?style=for-the-badge&amp;logo=github&amp;logoColor=white" alt="GitHub" />
</a>
<a href="https://github.com/FhSoftwareSolutions" target="_blank">
  <img src="https://img.shields.io/badge/FH%20Software%20Solutions-2496ED?style=for-the-badge&amp;logo=github&amp;logoColor=white" alt="FH Software Solutions" />
</a>

</div>

<br/>

<div align="center">

📧 **E-mail:** [midia@grupoprogresso.agr.br](mailto:midia@grupoprogresso.agr.br) <br/>
🐙 **GitHub:** [@jonhvinnykkj](https://github.com/jonhvinnykkj) <br/>
🏢 **Organização:** [@FhSoftwareSolutions](https://github.com/FhSoftwareSolutions)

</div>

---

<div align="center">

*"Sistema interno bom é o que ninguém percebe: a carga pesa, o fardo é rastreado, o título fecha."*

<picture>
  <source media="(prefers-color-scheme: dark)" srcset="assets/contrib-grid-dark.svg" />
  <source media="(prefers-color-scheme: light)" srcset="assets/contrib-grid-light.svg" />
  <img src="assets/contrib-grid-dark.svg" alt="717 contribuicoes no ultimo ano" width="100%" />
</picture>

</div>
