/**
 * mock-data.ts
 * Exporta os dados reais carregados do seed-data.ts.
 * Quando o Supabase for configurado, substitua MOCK_VENDAS pela consulta ao banco.
 */
import { REAL_VENDAS } from "@/lib/seed-data";
import type { FreteReal } from "@/types";
import { getMesLabel } from "@/lib/calculations";

// ─── Vendas (dados reais) ─────────────────────────────────────────────────────
export const MOCK_VENDAS = REAL_VENDAS;

// ─── Fretes reais registrados ─────────────────────────────────────────────────
// Por enquanto vazio — adicione aqui quando a transportadora enviar a nota.
// Formato: { id, venda_id, data_cobranca, transportadora, valor_frete_real, ... }
export const MOCK_FRETES: FreteReal[] = [];

// ─── Dados para gráficos (calculados a partir dos dados reais) ───────────────
// Agrega por mês automaticamente — não precisa editar manualmente.
function agruparPorMes() {
  const mapa = new Map<string, { fat: number; lp: number; lr: number | null }>();
  for (const v of REAL_VENDAS) {
    const atual = mapa.get(v.mes_competencia) ?? { fat: 0, lp: 0, lr: 0 };
    mapa.set(v.mes_competencia, {
      fat: atual.fat + v.valor_venda,
      lp:  atual.lp  + v.lucro_previsto,
      lr:  (atual.lr ?? 0) + (v.lucro_real ?? 0),
    });
  }
  return [...mapa.entries()]
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([mes, d]) => ({
      mes:            getMesLabel(mes),
      faturamento:    Math.round(d.fat),
      lucro_previsto: Math.round(d.lp),
      lucro_real:     Math.round(d.lr ?? 0),
    }));
}

export const MOCK_GRAFICO_MENSAL = agruparPorMes();
