# api-mychurch

API NestJS do **myChurch** — sistema de gerenciamento de igreja.

Estrutura e padrões baseados no projeto `api-genesis`.

## Stack

- NestJS 11
- TypeORM + MySQL
- nestjs-paginate
- Swagger (`@nestjs/swagger`)
- Arquitetura por feature com **use-cases**

## Estrutura

```
src/
  config/                 # TypeOrmConfigService
  modules/
    users/
    member/
    finance-categories/
    finance-entries/
    announcements/
    agenda/
  response.interceptor.ts # Envelope { success, message, data }
  main.ts                 # prefixo global /api
```

Cada módulo segue o padrão:

```
modules/<feature>/
  <feature>.module.ts
  <feature>.controller.ts
  dto/
  entities/
  use-cases/              # *UseCase.execute()
```

## Rotas

| Recurso | Prefixo |
|---------|---------|
| Health | `GET /api` |
| Usuários | `/api/users` |
| Membros | `/api/members` |
| Categorias financeiras | `/api/finance-categories` |
| Lançamentos | `/api/finance-entries` |
| Mural (avisos) | `/api/announcements` |
| Agenda | `/api/agenda` |

CRUD padrão por recurso: `POST`, `GET`, `GET :id`, `PATCH :id`, `PATCH :id/status`, `DELETE :id`.

## Setup

1. Use Node.js 20+ (recomendado 22)
2. Copie o ambiente:

```bash
cp .env.example .env
```

3. Ajuste as variáveis do MySQL no `.env`
4. Instale e rode:

```bash
npm install
npm run start:dev
```

API disponível em `http://localhost:3000/api`.

Documentação Swagger em `http://localhost:3000/api/docs`.

Guia completo (WampServer + API + UI): [`docs/LOCAL_SETUP.md`](../docs/LOCAL_SETUP.md).

## Scripts

| Comando | Descrição |
|---------|-----------|
| `npm run start:dev` | Dev com watch |
| `npm run build` | Build de produção |
| `npm run start:prod` | Sobe `dist/main` |
| `npm run lint` | ESLint |
| `npm test` | Testes unitários |
