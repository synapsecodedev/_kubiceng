# KubicEng — Sistema de Gestão para Construtoras

![KubicEng Logo](src/assets/8f30dd8152d74b306dc9f5214b67e2bfbf83636d.png)

Plataforma completa para gestão de construtoras, integrando Engenharia, Execução, Financeiro, Pessoas, Suprimentos e Comercial em um único painel.

---

## 🔗 Links

| | URL |
|---|---|
| **Produção** | [kubiceng.vercel.app](https://kubiceng.vercel.app) |
| **Banco de dados** | Neon PostgreSQL (produção) |
| **Repositório** | [github.com/synapsecodedev/_kubiceng](https://github.com/synapsecodedev/_kubiceng) |

---

## 📦 Módulos

| Módulo | Funcionalidades |
|--------|----------------|
| **Dashboard** | KPIs em tempo real, Curva S, mapa de obras, alertas inteligentes |
| **Engenharia** | GED de documentos, cronograma físico (Gantt), orçamento executivo (Curva ABC) |
| **Execução** | RDO digital, fichas de verificação de qualidade (FVS), almoxarifado |
| **Financeiro** | Contas a pagar, medições de empreiteiros, fluxo de caixa |
| **Pessoas** | Cadastro de funcionários, controle de EPIs, ponto eletrônico, SST |
| **Suprimentos** | Requisições, mapa de cotação, ordens de compra |
| **Comercial** | Portal do cliente, acompanhamento de obra, assistência técnica |

---

## 🛠️ Stack Tecnológica

### Frontend
- **React 18** + **Vite** + **TypeScript**
- **Tailwind CSS v4** + **shadcn/ui** (componentes)
- **Recharts** (gráficos), **Lucide Icons**
- **Axios** (chamadas de API)

### Backend
- **Node.js** + **Fastify** + **Zod** (validação)
- **Prisma ORM** + **PostgreSQL** (Neon)
- 7 módulos de rotas · ~30 endpoints REST

### Infraestrutura
- **Vercel** (frontend + serverless functions)
- **Neon.tech** (banco PostgreSQL serverless gratuito)

---

## 🚀 Como Rodar Localmente

### Pré-requisitos
- Node.js 18+
- Conta no [Neon.tech](https://neon.tech) (ou PostgreSQL local)

### 1. Instalar dependências

```bash
# Raiz do projeto (frontend)
npm install

# Backend
cd backend && npm install
```

### 2. Configurar variáveis de ambiente

Crie o arquivo `backend/.env` baseado no `backend/.env.example`:

```env
DATABASE_URL="postgresql://user:pass@host.neon.tech/db?sslmode=require"
DIRECT_URL="postgresql://user:pass@host-direct.neon.tech/db?sslmode=require"
```

### 3. Criar banco e popular com dados de exemplo

```bash
cd backend
npx prisma db push
npm run seed
```

### 4. Iniciar o Backend

```bash
# Na pasta backend/
npm run dev
# → http://localhost:3333
```

### 5. Iniciar o Frontend

```bash
# Na raiz do projeto (novo terminal)
npm run dev
# → http://localhost:5173
```

---

## 🌐 Deploy na Vercel

### 1. Subir para o GitHub e importar na Vercel

1. Acesse [vercel.com/new](https://vercel.com/new) e importe o repositório
2. Vercel detecta o Vite automaticamente

### 2. Configurar variáveis de ambiente na Vercel

| Nome | Descrição |
|------|-----------|
| `DATABASE_URL` | URL de conexão pooled do Neon |
| `DIRECT_URL` | URL de conexão direta do Neon (para migrations) |

### 3. Deploy

Clique em **Deploy**. O `vercel.json` já configura:
- Build do frontend (`npm run build` → `/dist`)
- Serverless Function em `/api/index.ts` (backend Fastify)
- Rewrite de `/api/*` para a função serverless

---

## 📁 Estrutura do Projeto

```
_kubiceng/
├── api/
│   └── index.ts            # Entry point serverless (Vercel)
├── backend/
│   ├── prisma/
│   │   └── schema.prisma   # 16 modelos PostgreSQL
│   └── src/
│       ├── routes/         # 7 arquivos de rotas
│       ├── lib/prisma.ts
│       ├── server.ts
│       └── seed.ts
├── src/
│   ├── app/
│   │   ├── components/     # Módulos e componentes UI
│   │   └── pages/
│   └── services/api.ts     # ~40 funções de API
├── vercel.json
└── tsconfig.api.json
```

---

## 📜 Licença

Propriedade de KubicEng — Synapse Code Dev. Todos os direitos reservados.