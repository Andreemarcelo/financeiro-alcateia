/**
 * seed-data.ts
 * ─────────────────────────────────────────────────────────────────────────────
 * Dados históricos reais da Alcateia Azul Móveis.
 *
 * COMO EDITAR:
 *   1. Adicione novos registros ao array historicalSales abaixo.
 *   2. Para vendas antigas sem detalhe: use tipo_registro = "historico_consolidado"
 *      e preencha só valor_venda + lucro_previsto + lucro_real.
 *   3. Para vendas novas com detalhe: use tipo_registro = "detalhado" e
 *      preencha custo, frete, imposto etc.
 *   4. Salve o arquivo — o app atualiza automaticamente.
 *
 * COMO VALIDAR NO APP:
 *   - Acesse /relatorios → "Visão Geral" para ver o histórico por mês.
 *   - Acesse /relatorios → "Por Mês" para ver o DRE de cada mês.
 *   - O Dashboard mostra o mês mais recente com dados.
 */

import type { Venda, TipoRegistro, StatusFrete } from "@/types";

// ─── Tipo da seed (mais simples que Venda) ────────────────────────────────────
interface SeedItem {
  mes_competencia: string;
  cliente: string;
  valor_venda: number;
  lucro_previsto: number;
  lucro_real: number | null;
  custo_mercadoria: number | null;
  frete_previsto_valor: number | null;
  frete_real_valor: number | null;
  imposto_valor: number | null;
  extras: number | null;
  observacoes: string;
  tipo_registro: TipoRegistro;
}

// ─── Dados reais ──────────────────────────────────────────────────────────────
export const historicalSales: SeedItem[] = [
  // ── SETEMBRO 2025 ──────────────────────────────────────────────────────────
  { mes_competencia: "2025-09", cliente: "Gabriel + Filipak",    valor_venda: 19792.84,  lucro_previsto: 3113.43,  lucro_real: 3113.43,  custo_mercadoria: null, frete_previsto_valor: null, frete_real_valor: null, imposto_valor: null, extras: null, observacoes: "Histórico consolidado", tipo_registro: "historico_consolidado" },
  { mes_competencia: "2025-09", cliente: "Elvis Mandirituba",     valor_venda: 47877.59,  lucro_previsto: 10870.01, lucro_real: 10870.01, custo_mercadoria: null, frete_previsto_valor: null, frete_real_valor: null, imposto_valor: null, extras: null, observacoes: "Histórico consolidado", tipo_registro: "historico_consolidado" },
  { mes_competencia: "2025-09", cliente: "Elvis Marília",         valor_venda: 45877.59,  lucro_previsto: 9010.01,  lucro_real: 9010.01,  custo_mercadoria: null, frete_previsto_valor: null, frete_real_valor: null, imposto_valor: null, extras: null, observacoes: "Histórico consolidado", tipo_registro: "historico_consolidado" },
  { mes_competencia: "2025-09", cliente: "Sheder Maringá",        valor_venda: 7515.27,   lucro_previsto: 2518.32,  lucro_real: 2518.32,  custo_mercadoria: null, frete_previsto_valor: null, frete_real_valor: null, imposto_valor: null, extras: null, observacoes: "Histórico consolidado", tipo_registro: "historico_consolidado" },
  { mes_competencia: "2025-09", cliente: "Marco",                 valor_venda: 12622.00,  lucro_previsto: 4345.80,  lucro_real: 4345.80,  custo_mercadoria: null, frete_previsto_valor: null, frete_real_valor: null, imposto_valor: null, extras: null, observacoes: "Histórico consolidado", tipo_registro: "historico_consolidado" },
  { mes_competencia: "2025-09", cliente: "Alan SP",               valor_venda: 27450.40,  lucro_previsto: 6471.77,  lucro_real: 6471.77,  custo_mercadoria: null, frete_previsto_valor: null, frete_real_valor: null, imposto_valor: null, extras: null, observacoes: "Histórico consolidado", tipo_registro: "historico_consolidado" },
  { mes_competencia: "2025-09", cliente: "Marcelo Eloi",          valor_venda: 16476.96,  lucro_previsto: 5776.56,  lucro_real: 5776.56,  custo_mercadoria: null, frete_previsto_valor: null, frete_real_valor: null, imposto_valor: null, extras: null, observacoes: "Histórico consolidado", tipo_registro: "historico_consolidado" },
  { mes_competencia: "2025-09", cliente: "Filipak Nova Loja",     valor_venda: 67951.84,  lucro_previsto: 17178.36, lucro_real: 17178.36, custo_mercadoria: null, frete_previsto_valor: null, frete_real_valor: null, imposto_valor: null, extras: null, observacoes: "Histórico consolidado", tipo_registro: "historico_consolidado" },
  { mes_competencia: "2025-09", cliente: "Andrews",               valor_venda: 26437.44,  lucro_previsto: 7673.68,  lucro_real: 7673.68,  custo_mercadoria: null, frete_previsto_valor: null, frete_real_valor: null, imposto_valor: null, extras: null, observacoes: "Histórico consolidado", tipo_registro: "historico_consolidado" },

  // ── OUTUBRO 2025 ───────────────────────────────────────────────────────────
  { mes_competencia: "2025-10", cliente: "Porto Belo",            valor_venda: 87658.04,  lucro_previsto: 17426.33, lucro_real: 17426.33, custo_mercadoria: null, frete_previsto_valor: null, frete_real_valor: null, imposto_valor: null, extras: null, observacoes: "Histórico consolidado", tipo_registro: "historico_consolidado" },
  { mes_competencia: "2025-10", cliente: "Filipak 32 un",         valor_venda: 31106.14,  lucro_previsto: 8267.38,  lucro_real: 8267.38,  custo_mercadoria: null, frete_previsto_valor: null, frete_real_valor: null, imposto_valor: null, extras: null, observacoes: "Histórico consolidado", tipo_registro: "historico_consolidado" },
  { mes_competencia: "2025-10", cliente: "Filipak 100 fixas",     valor_venda: 42814.00,  lucro_previsto: 12938.88, lucro_real: 12938.88, custo_mercadoria: null, frete_previsto_valor: null, frete_real_valor: null, imposto_valor: null, extras: null, observacoes: "Histórico consolidado", tipo_registro: "historico_consolidado" },
  { mes_competencia: "2025-10", cliente: "Cuiabá",                valor_venda: 11880.68,  lucro_previsto: 3910.23,  lucro_real: 3910.23,  custo_mercadoria: null, frete_previsto_valor: null, frete_real_valor: null, imposto_valor: null, extras: null, observacoes: "Histórico consolidado", tipo_registro: "historico_consolidado" },
  { mes_competencia: "2025-10", cliente: "Elvis Piracicaba",      valor_venda: 51570.27,  lucro_previsto: 13994.16, lucro_real: 13994.16, custo_mercadoria: null, frete_previsto_valor: null, frete_real_valor: null, imposto_valor: null, extras: null, observacoes: "Histórico consolidado", tipo_registro: "historico_consolidado" },
  { mes_competencia: "2025-10", cliente: "Vagner Filipak",        valor_venda: 56496.71,  lucro_previsto: 17228.12, lucro_real: 17228.12, custo_mercadoria: null, frete_previsto_valor: null, frete_real_valor: null, imposto_valor: null, extras: null, observacoes: "Histórico consolidado", tipo_registro: "historico_consolidado" },
  { mes_competencia: "2025-10", cliente: "Andrew Ribeirão",       valor_venda: 21170.15,  lucro_previsto: 7246.34,  lucro_real: 7246.34,  custo_mercadoria: null, frete_previsto_valor: null, frete_real_valor: null, imposto_valor: null, extras: null, observacoes: "Histórico consolidado", tipo_registro: "historico_consolidado" },
  { mes_competencia: "2025-10", cliente: "Luciane Curitiba",      valor_venda: 84412.48,  lucro_previsto: 24455.74, lucro_real: 24455.74, custo_mercadoria: null, frete_previsto_valor: null, frete_real_valor: null, imposto_valor: null, extras: null, observacoes: "Histórico consolidado", tipo_registro: "historico_consolidado" },

  // ── NOVEMBRO 2025 ──────────────────────────────────────────────────────────
  { mes_competencia: "2025-11", cliente: "Anália Franco",         valor_venda: 101378.28, lucro_previsto: 27893.24, lucro_real: 27893.24, custo_mercadoria: null, frete_previsto_valor: null, frete_real_valor: null, imposto_valor: null, extras: null, observacoes: "Histórico consolidado", tipo_registro: "historico_consolidado" },
  { mes_competencia: "2025-11", cliente: "Izabella Indaiatuba",   valor_venda: 99629.56,  lucro_previsto: 26961.88, lucro_real: 26961.88, custo_mercadoria: null, frete_previsto_valor: null, frete_real_valor: null, imposto_valor: null, extras: null, observacoes: "Histórico consolidado", tipo_registro: "historico_consolidado" },
  { mes_competencia: "2025-11", cliente: "Gabriel Barreto",       valor_venda: 207808.85, lucro_previsto: 60097.19, lucro_real: 60097.19, custo_mercadoria: null, frete_previsto_valor: null, frete_real_valor: null, imposto_valor: null, extras: null, observacoes: "Histórico consolidado", tipo_registro: "historico_consolidado" },
  { mes_competencia: "2025-11", cliente: "Filipak Indaiatuba",    valor_venda: 216985.40, lucro_previsto: 52837.16, lucro_real: 52837.16, custo_mercadoria: null, frete_previsto_valor: null, frete_real_valor: null, imposto_valor: null, extras: null, observacoes: "Histórico consolidado", tipo_registro: "historico_consolidado" },
  { mes_competencia: "2025-11", cliente: "Diego Borba SC",        valor_venda: 164093.92, lucro_previsto: 39301.25, lucro_real: 39301.25, custo_mercadoria: null, frete_previsto_valor: null, frete_real_valor: null, imposto_valor: null, extras: null, observacoes: "Histórico consolidado", tipo_registro: "historico_consolidado" },

  // ── JANEIRO 2026 ───────────────────────────────────────────────────────────
  { mes_competencia: "2026-01", cliente: "Elvis SJRP + Ribeirão", valor_venda: 150000.00, lucro_previsto: 44466.08, lucro_real: 44466.08, custo_mercadoria: null, frete_previsto_valor: null, frete_real_valor: null, imposto_valor: null, extras: null, observacoes: "Histórico consolidado", tipo_registro: "historico_consolidado" },
  { mes_competencia: "2026-01", cliente: "Gisele MS",             valor_venda: 27937.66,  lucro_previsto: 7262.31,  lucro_real: 7262.31,  custo_mercadoria: null, frete_previsto_valor: null, frete_real_valor: null, imposto_valor: null, extras: null, observacoes: "Histórico consolidado", tipo_registro: "historico_consolidado" },
  { mes_competencia: "2026-01", cliente: "Diego Ribas",           valor_venda: 35124.90,  lucro_previsto: 8769.62,  lucro_real: 8769.62,  custo_mercadoria: null, frete_previsto_valor: null, frete_real_valor: null, imposto_valor: null, extras: null, observacoes: "Histórico consolidado", tipo_registro: "historico_consolidado" },
  { mes_competencia: "2026-01", cliente: "Filipak Alphaville",    valor_venda: 105483.48, lucro_previsto: 26958.86, lucro_real: 26958.86, custo_mercadoria: null, frete_previsto_valor: 6275.56, frete_real_valor: null, imposto_valor: null, extras: null, observacoes: "Histórico consolidado — frete previsto conhecido", tipo_registro: "historico_consolidado" },
  { mes_competencia: "2026-01", cliente: "Compl. Anália + Indaiatuba", valor_venda: 22191.47, lucro_previsto: 5157.40, lucro_real: 5157.40, custo_mercadoria: null, frete_previsto_valor: null, frete_real_valor: null, imposto_valor: null, extras: null, observacoes: "Histórico consolidado", tipo_registro: "historico_consolidado" },
  { mes_competencia: "2026-01", cliente: "Gabriel Barreto Compl.", valor_venda: 6839.72,  lucro_previsto: 1657.95,  lucro_real: 1657.95,  custo_mercadoria: null, frete_previsto_valor: null, frete_real_valor: null, imposto_valor: null, extras: null, observacoes: "Histórico consolidado", tipo_registro: "historico_consolidado" },
  { mes_competencia: "2026-01", cliente: "Wallace — Macaé RJ",    valor_venda: 19667.08,  lucro_previsto: 5822.96,  lucro_real: 5822.96,  custo_mercadoria: 9501.93, frete_previsto_valor: 2375.48, frete_real_valor: null, imposto_valor: 1966.71, extras: 0, observacoes: "Venda detalhada", tipo_registro: "detalhado" },

  // ── FEVEREIRO 2026 ─────────────────────────────────────────────────────────
  { mes_competencia: "2026-02", cliente: "MS2",                   valor_venda: 192081.28, lucro_previsto: 50208.90, lucro_real: null, custo_mercadoria: 104417.81, frete_previsto_valor: 16706.85, frete_real_valor: null, imposto_valor: 18247.72, extras: 2500.00, observacoes: "Frete real ainda pendente", tipo_registro: "detalhado" },
  { mes_competencia: "2026-02", cliente: "Leandro Filipak — Alphaville", valor_venda: 105483.48, lucro_previsto: 26958.86, lucro_real: null, custo_mercadoria: 62755.55, frete_previsto_valor: 6275.56, frete_real_valor: null, imposto_valor: 9493.51, extras: 0, observacoes: "Frete real ainda pendente", tipo_registro: "detalhado" },
  { mes_competencia: "2026-02", cliente: "Luciane Filipak — 15 Stay", valor_venda: 8575.48, lucro_previsto: 2319.51, lucro_real: null, custo_mercadoria: 5173.75, frete_previsto_valor: 310.43, frete_real_valor: null, imposto_valor: 771.79, extras: 0, observacoes: "Frete real ainda pendente", tipo_registro: "detalhado" },
  { mes_competencia: "2026-02", cliente: "Fábio",                 valor_venda: 23916.70,  lucro_previsto: 9412.70,  lucro_real: 9412.70,  custo_mercadoria: 14204.00, frete_previsto_valor: 0, frete_real_valor: 0, imposto_valor: null, extras: 300.00, observacoes: "Sem frete — imposto não informado", tipo_registro: "detalhado" },

  // ── MARÇO 2026 ─────────────────────────────────────────────────────────────
  { mes_competencia: "2026-03", cliente: "Daniel",                valor_venda: 109446.37, lucro_previsto: 28295.03, lucro_real: null, custo_mercadoria: 64409.82, frete_previsto_valor: 5796.88, frete_real_valor: null, imposto_valor: 10944.64, extras: 0, observacoes: "Frete real ainda pendente", tipo_registro: "detalhado" },
  { mes_competencia: "2026-03", cliente: "Elvis Piracicaba",      valor_venda: 38383.89,  lucro_previsto: 9646.53,  lucro_real: null, custo_mercadoria: 21985.05, frete_previsto_valor: 3297.76, frete_real_valor: null, imposto_valor: 3454.55, extras: 0, observacoes: "Frete real ainda pendente", tipo_registro: "detalhado" },
  { mes_competencia: "2026-03", cliente: "Vagner Filipak",        valor_venda: 81218.00,  lucro_previsto: 23121.63, lucro_real: null, custo_mercadoria: 44620.15, frete_previsto_valor: 5354.42, frete_real_valor: null, imposto_valor: 8121.80, extras: 0, observacoes: "Frete real ainda pendente", tipo_registro: "detalhado" },
  { mes_competencia: "2026-03", cliente: "Alessandra",            valor_venda: 14400.00,  lucro_previsto: 3598.44,  lucro_real: null, custo_mercadoria: 8749.12, frete_previsto_valor: 612.44, frete_real_valor: null, imposto_valor: 1440.00, extras: 0, observacoes: "Frete real ainda pendente", tipo_registro: "detalhado" },
  { mes_competencia: "2026-03", cliente: "Marcelo",               valor_venda: 12529.48,  lucro_previsto: 4554.23,  lucro_real: null, custo_mercadoria: 6460.00, frete_previsto_valor: 387.60, frete_real_valor: null, imposto_valor: 1127.65, extras: 0, observacoes: "Frete real ainda pendente", tipo_registro: "detalhado" },
];

// ─── Transformação seed → Venda ───────────────────────────────────────────────
function calcStatusFrete(item: SeedItem): StatusFrete {
  // Histórico já fechado → sempre conciliado
  if (item.tipo_registro === "historico_consolidado") return "conciliado";
  // Detalhado sem frete real informado → pendente
  if (item.frete_real_valor === null) return "pendente";
  // Sem frete (valor = 0) → conciliado
  if (item.frete_real_valor === 0) return "conciliado";
  // Compara frete real vs previsto
  const prev = item.frete_previsto_valor ?? 0;
  if (prev === 0) return "conciliado";
  const diff = item.frete_real_valor - prev;
  const pct  = Math.abs(diff) / prev;
  if (diff < 0) return "ganho_frete";
  if (pct <= 0.05) return "conciliado";
  if (pct <= 0.20) return "atencao";
  return "prejuizo_frete";
}

export function transformToVenda(item: SeedItem, index: number): Venda {
  const margem_prevista = item.valor_venda > 0
    ? (item.lucro_previsto / item.valor_venda) * 100
    : 0;
  const margem_real = item.lucro_real != null
    ? (item.lucro_real / item.valor_venda) * 100
    : null;

  return {
    id:              `v${String(index + 1).padStart(3, "0")}`,
    data:            item.mes_competencia + "-01",
    mes_competencia: item.mes_competencia,
    cliente:         item.cliente,
    pedido_ref:      `PED-${String(index + 1).padStart(3, "0")}`,
    tipo_registro:   item.tipo_registro,

    valor_venda:              item.valor_venda,
    custo_mercadoria:         item.custo_mercadoria,
    frete_previsto_tipo:      item.frete_previsto_valor != null ? "fixo" : null,
    frete_previsto_valor:     item.frete_previsto_valor,
    frete_previsto_calculado: item.frete_previsto_valor,  // já em R$
    imposto_tipo:             item.imposto_valor != null ? "fixo" : null,
    imposto_valor:            item.imposto_valor,
    imposto_calculado:        item.imposto_valor,
    extras:                   item.extras,

    lucro_previsto: item.lucro_previsto,
    lucro_real:     item.lucro_real,
    margem_prevista,
    margem_real,

    status_frete: calcStatusFrete(item),
    observacoes:  item.observacoes,

    created_at: item.mes_competencia + "-01T00:00:00Z",
    updated_at: item.mes_competencia + "-01T00:00:00Z",
  };
}

// ─── Exportação já transformada ───────────────────────────────────────────────
export const REAL_VENDAS: Venda[] = historicalSales.map(transformToVenda);
