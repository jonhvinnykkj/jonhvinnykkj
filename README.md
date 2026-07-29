# Vinnycius

Construo sistemas internos para o agronegócio — do controle de balança na fazenda ao
dashboard financeiro que a diretoria abre de manhã. Baseado no Piauí, no
**Grupo Progresso**.

A maior parte do que faço roda em produção e é privada, então boa parte dos repositórios
abaixo não é pública. A lista está aqui pelo escopo, não pelo link.

---

## Em produção

| Sistema | O que resolve | Stack |
|---|---|---|
| **Hub Progresso** | Portal central que reúne os ~18 sistemas do grupo, com SSO e permissão por sistema | Next.js · Prisma · NextAuth · PostgreSQL |
| **Balança** | Controle de safra e pesagem de cargas, com termo LGPD assinado e comprovante em PDF | Express · Prisma · React · Railway |
| **Cotton App** | Rastreabilidade de fardos de algodão, do campo à indústria | Vite · Express · Drizzle · PostgreSQL |
| **Dashboard Financeiro** | Títulos, vencimentos e moeda estrangeira sobre a base do ERP | Python · PostgreSQL · Railway |
| **Sementes & Commodities** | Dashboard financeiro com câmbio USD por operação | FastAPI · Next.js · PostgreSQL |
| **Instituto Cultivar** | Plataforma interna do braço social do grupo, com CRM e gestão de projetos | Next.js 15 · Payload CMS 3 · PostgreSQL · R2 |
| **Site institucional** | Site do grupo, com mapa interativo dos representantes comerciais por estado | Vite · React · Express |
| **Pulso Digital** | Pesquisa de opinião interna: formulário anônimo + dashboard administrativo | Next.js 16 · Prisma · PostgreSQL |

## Também por aqui

- **[PluView](https://github.com/FhSoftwareSolutions)** — telemetria de estações meteorológicas
  instaladas em fazenda, com dashboard web. Firmware, API e front.
- **[game-alert](https://github.com/jonhvinnykkj/game-alert)** — bot de Telegram que
  monitora promoções de jogos em PlayStation e Xbox.
- Projetos para clientes: site e sistema de credenciamento de eventos da agência E+,
  marketplace de hospedagem (HostHub).

## Stack

**Front** TypeScript · Next.js · React · Vite · Tailwind
**Back** Node/Express · FastAPI · Prisma · Drizzle
**Dados** PostgreSQL · integração com ERP TOTVS
**Infra** Railway · Docker · Cloudflare R2

Trabalho bastante com integração a sistemas legados e com relatório/PDF gerado
server-side — que é onde mora a maior parte do atrito real desse tipo de sistema.

## Contato

[midia@grupoprogresso.agr.br](mailto:midia@grupoprogresso.agr.br)
