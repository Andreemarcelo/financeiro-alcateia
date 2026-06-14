# Financeiro Alcateia

Painel financeiro de vendas da **Alcateia Azul Móveis**.
Controle de pedidos, frete previsto vs. real, conciliação e relatórios mensais.

---

## Como Rodar Localmente

### 1. Instalar as dependências

Abra o Terminal na pasta `financeiro-alcateia` e rode:

```bash
npm install
```

### 2. Configurar variáveis de ambiente

Crie o arquivo `.env.local` copiando o exemplo:

```bash
cp .env.local.example .env.local
```

Para rodar **só com dados de exemplo** (modo demo), **não precisa preencher nada**.
O app funciona sem o Supabase.

### 3. Iniciar o servidor de desenvolvimento

```bash
npm run dev
```

Abra no navegador: **http://localhost:3000**

---

## Conectar ao Supabase (dados reais)

1. Acesse [supabase.com](https://supabase.com) e crie um projeto gratuito
2. No painel do Supabase, vá em **SQL Editor** e cole o conteúdo de `supabase/schema.sql`
3. Execute o SQL para criar as tabelas
4. Copie as credenciais em **Settings → API**
5. Preencha o `.env.local`:

```env
NEXT_PUBLIC_SUPABASE_URL=https://XXXXX.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGci...
USE_MOCK=false
```

6. Reinicie o servidor: `npm run dev`

---

## Publicar no Vercel (site online)

1. Acesse [vercel.com](https://vercel.com) e faça login com o GitHub
2. Clique em **Add New Project** e importe este repositório
3. Em **Environment Variables**, adicione as mesmas variáveis do `.env.local`
4. Clique em **Deploy**

Seu site estará online em poucos minutos com URL automática.

---

## Estrutura do Projeto

```
src/
├── app/
│   ├── page.tsx              → Dashboard principal
│   ├── vendas/page.tsx       → Cadastro e listagem de vendas
│   ├── fretes/page.tsx       → Registro de fretes reais
│   ├── conciliacao/page.tsx  → Conciliação frete previsto vs real ⭐
│   └── relatorios/page.tsx   → Relatórios mensais e histórico
├── components/
│   ├── layout/Sidebar.tsx    → Menu lateral
│   └── shared/
│       ├── KPICard.tsx       → Cartão de indicador
│       └── StatusBadge.tsx   → Badge de status do frete
├── lib/
│   ├── calculations.ts       → Cálculos de lucro, margem, frete
│   ├── mock-data.ts          → Dados de exemplo
│   ├── supabase.ts           → Conexão com banco
│   └── utils.ts              → Utilitários CSS
└── types/index.ts            → Tipos TypeScript
```

---

## Tecnologias

- **Next.js 14** — Framework React (App Router)
- **TypeScript** — Tipagem estática
- **Tailwind CSS** — Estilização
- **Recharts** — Gráficos
- **Supabase** — Banco de dados PostgreSQL na nuvem
- **Lucide React** — Ícones

---

## Fluxo de Uso Diário

1. **Cadastre a venda** em `Vendas → Nova Venda`
   Informe valor de venda, custo, % de frete e imposto
2. **Acompanhe no Dashboard** o lucro previsto do mês
3. **Quando a transportadora cobrar**, registre em `Fretes Reais → Registrar Frete`
4. **Concilie** em `Conciliação` — o app calcula a diferença e atualiza o lucro real
5. **Feche o mês** nos `Relatórios` com o DRE simplificado

---

## Status dos Fretes

| Ícone | Status | Significado |
|-------|--------|-------------|
| ⏳ | Pendente | Frete real ainda não chegou |
| ✅ | Conciliado | Frete real próximo do previsto (até 5% de diferença) |
| ⚠️ | Atenção | Diferença entre 5% e 20% |
| 🔴 | Prejuízo | Diferença acima de 20% |
| 💚 | Ganho | Frete real foi menor que o previsto |

---

*Alcateia Azul Móveis · v1.0*
