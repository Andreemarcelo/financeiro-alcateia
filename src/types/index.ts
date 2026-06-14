export type Fretetipo    = "percentual_custo" | "percentual_venda" | "fixo";
export type ImpostoTipo  = "percentual_venda"  | "percentual_custo" | "fixo";
export type TipoRegistro = "historico_consolidado" | "detalhado";
export type StatusFrete  =
  | "pendente"
  | "conciliado"
  | "atencao"
  | "prejuizo_frete"
  | "ganho_frete";

export interface Venda {
  id: string;
  data: string;                          // ISO date
  mes_competencia: string;               // "2026-04"
  cliente: string;
  pedido_ref: string;
  tipo_registro: TipoRegistro;

  valor_venda: number;

  // Pode ser null em registros históricos consolidados
  custo_mercadoria:         number | null;
  frete_previsto_tipo:      Fretetipo | null;
  frete_previsto_valor:     number | null;   // % ou R$
  frete_previsto_calculado: number | null;   // sempre em R$
  imposto_tipo:             ImpostoTipo | null;
  imposto_valor:            number | null;
  imposto_calculado:        number | null;
  extras:                   number | null;

  lucro_previsto: number;                // sempre presente
  lucro_real:     number | null;         // null = frete pendente
  margem_prevista: number;
  margem_real:     number | null;

  status_frete: StatusFrete;
  observacoes: string;

  created_at: string;
  updated_at: string;
}

export interface FreteReal {
  id: string;
  venda_id: string | null;
  data_cobranca: string;
  transportadora: string;
  cliente_referencia: string;
  pedido_referencia: string;
  valor_frete_real: number;
  status: "nao_conciliado" | "conciliado";
  observacoes: string;
  created_at: string;
}

export interface VendaComFrete extends Venda {
  frete_real: FreteReal | null;
  diferenca_frete: number | null;
}

export interface ResumoMensal {
  mes: string;                  // "2025-09"
  mes_label: string;            // "Set/25"
  faturamento: number;
  lucro_previsto: number;
  lucro_real: number;           // usa lucro_real se disponível, senão lucro_previsto
  margem_media: number;
  frete_previsto_total: number;
  frete_real_total: number;
  frete_pendente: number;
  qtd_vendas: number;
  qtd_conciliadas: number;
}

export interface KPIData {
  faturamento_mes: number;
  lucro_previsto_mes: number;
  lucro_real_mes: number;
  margem_media_mes: number;
  frete_previsto_total: number;
  frete_real_total: number;
  frete_pendente: number;
  qtd_vendas: number;
  var_faturamento: number;
  var_lucro: number;
}
