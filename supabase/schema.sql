-- ═══════════════════════════════════════════════════════════
-- FINANCEIRO ALCATEIA — Schema Supabase
-- Alcateia Azul Móveis
-- ═══════════════════════════════════════════════════════════

-- ─── Tabela: vendas ───────────────────────────────────────────────────────────
create table if not exists vendas (
  id                        text primary key default gen_random_uuid()::text,
  data                      date not null,
  mes_competencia           text not null,           -- ex: "2026-04"
  cliente                   text not null,
  pedido_ref                text not null,

  valor_venda               numeric(12, 2) not null,
  custo_mercadoria          numeric(12, 2) not null,

  frete_previsto_tipo       text not null check (frete_previsto_tipo in ('percentual_venda', 'percentual_custo', 'fixo')),
  frete_previsto_valor      numeric(10, 4) not null, -- pode ser % ou R$
  frete_previsto_calculado  numeric(12, 2) not null, -- sempre em R$

  imposto_tipo              text not null check (imposto_tipo in ('percentual_venda', 'percentual_custo', 'fixo')),
  imposto_valor             numeric(10, 4) not null,
  imposto_calculado         numeric(12, 2) not null,

  extras                    numeric(12, 2) not null default 0,

  lucro_previsto            numeric(12, 2) not null,
  lucro_real                numeric(12, 2),           -- preenchido após conciliação
  margem_prevista           numeric(8, 4) not null,
  margem_real               numeric(8, 4),

  status_frete              text not null default 'pendente'
    check (status_frete in ('pendente', 'conciliado', 'atencao', 'prejuizo_frete', 'ganho_frete')),

  observacoes               text not null default '',

  created_at                timestamptz not null default now(),
  updated_at                timestamptz not null default now()
);

-- ─── Tabela: fretes_reais ─────────────────────────────────────────────────────
create table if not exists fretes_reais (
  id                  text primary key default gen_random_uuid()::text,
  venda_id            text references vendas(id) on delete set null,

  data_cobranca       date not null,
  transportadora      text not null,
  cliente_referencia  text not null default '',
  pedido_referencia   text not null default '',
  valor_frete_real    numeric(12, 2) not null,

  status              text not null default 'nao_conciliado'
    check (status in ('nao_conciliado', 'conciliado')),

  observacoes         text not null default '',
  created_at          timestamptz not null default now()
);

-- ─── Índices ──────────────────────────────────────────────────────────────────
create index if not exists idx_vendas_mes           on vendas(mes_competencia);
create index if not exists idx_vendas_status_frete  on vendas(status_frete);
create index if not exists idx_vendas_cliente       on vendas(cliente);
create index if not exists idx_fretes_venda_id      on fretes_reais(venda_id);
create index if not exists idx_fretes_status        on fretes_reais(status);
create index if not exists idx_fretes_data          on fretes_reais(data_cobranca);

-- ─── Trigger: updated_at automático ──────────────────────────────────────────
create or replace function set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists trg_vendas_updated_at on vendas;
create trigger trg_vendas_updated_at
  before update on vendas
  for each row execute procedure set_updated_at();

-- ─── View: resumo mensal ──────────────────────────────────────────────────────
create or replace view vw_resumo_mensal as
select
  v.mes_competencia,
  count(v.id)                                          as qtd_vendas,
  sum(v.valor_venda)                                   as faturamento,
  sum(v.lucro_previsto)                                as lucro_previsto,
  coalesce(sum(v.lucro_real), 0)                       as lucro_real,
  avg(v.margem_prevista)                               as margem_media_prevista,
  avg(v.margem_real)                                   as margem_media_real,
  sum(v.frete_previsto_calculado)                      as frete_previsto_total,
  coalesce(sum(f.valor_frete_real), 0)                 as frete_real_total,
  sum(case when v.status_frete = 'pendente' then v.frete_previsto_calculado else 0 end) as frete_pendente,
  count(case when f.id is not null then 1 end)         as qtd_conciliadas
from vendas v
left join fretes_reais f on f.venda_id = v.id
group by v.mes_competencia
order by v.mes_competencia desc;

-- ─── Row Level Security (RLS) ─────────────────────────────────────────────────
-- Por padrão, desabilitar RLS em dev. Habilitar quando adicionar autenticação.
-- alter table vendas       enable row level security;
-- alter table fretes_reais enable row level security;

-- ─── Dados iniciais de exemplo (opcional) ─────────────────────────────────────
-- Para popular o banco com dados de exemplo, rode:
-- \i seed.sql
