import type { Venda, FreteReal, VendaComFrete, StatusFrete, ResumoMensal } from "@/types";

// ─── Cálculos básicos ─────────────────────────────────────────────────────────
export function calcularLucroReal(venda: Venda, freteReal: number): number {
  const custo   = venda.custo_mercadoria          ?? 0;
  const imposto = venda.imposto_calculado          ?? 0;
  const extras  = venda.extras                    ?? 0;
  return venda.valor_venda - custo - freteReal - imposto - extras;
}

export function calcularMargem(lucro: number, valorVenda: number): number {
  if (valorVenda === 0) return 0;
  return (lucro / valorVenda) * 100;
}

export function calcularStatusFrete(
  fretePrevisto: number | null,
  freteReal: number | null
): StatusFrete {
  if (freteReal === null) return "pendente";
  if (freteReal === 0 || fretePrevisto === 0 || fretePrevisto === null) return "conciliado";
  const diff = freteReal - fretePrevisto;
  const pct  = Math.abs(diff) / fretePrevisto;
  if (diff < 0) return "ganho_frete";
  if (pct <= 0.05) return "conciliado";
  if (pct <= 0.20) return "atencao";
  return "prejuizo_frete";
}

// ─── Enriquecer venda com dados de frete real ─────────────────────────────────
export function enrichVendaComFrete(
  venda: Venda,
  fretes: FreteReal[]
): VendaComFrete {
  const frete = fretes.find((f) => f.venda_id === venda.id) ?? null;

  // Histórico consolidado: não tem frete real → mantém lucro_real já calculado
  if (venda.tipo_registro === "historico_consolidado") {
    return {
      ...venda,
      frete_real:      null,
      diferenca_frete: null,
    };
  }

  // Detalhado: calcula lucro_real a partir do frete real quando disponível
  const freteRealValor = frete?.valor_frete_real ?? null;
  const diferenca      = freteRealValor !== null && venda.frete_previsto_calculado !== null
    ? freteRealValor - venda.frete_previsto_calculado
    : null;
  const lucroReal = frete ? calcularLucroReal(venda, frete.valor_frete_real) : venda.lucro_real;
  const margemReal = lucroReal !== null
    ? calcularMargem(lucroReal, venda.valor_venda)
    : venda.margem_real;
  const status = venda.tipo_registro === "detalhado"
    ? calcularStatusFrete(venda.frete_previsto_calculado, freteRealValor)
    : venda.status_frete;

  return {
    ...venda,
    lucro_real:      lucroReal,
    margem_real:     margemReal,
    status_frete:    status,
    frete_real:      frete,
    diferenca_frete: diferenca,
  };
}

// ─── Resumo mensal agregado ───────────────────────────────────────────────────
export function calcularResumoMensal(vendas: VendaComFrete[]): ResumoMensal[] {
  const mapa = new Map<string, VendaComFrete[]>();
  for (const v of vendas) {
    const lista = mapa.get(v.mes_competencia) ?? [];
    lista.push(v);
    mapa.set(v.mes_competencia, lista);
  }

  return [...mapa.entries()]
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([mes, lista]) => {
      const faturamento       = lista.reduce((s, v) => s + v.valor_venda, 0);
      const lucro_previsto    = lista.reduce((s, v) => s + v.lucro_previsto, 0);
      // Usa lucro_real quando existe, senão usa lucro_previsto como referência
      const lucro_real        = lista.reduce((s, v) => s + (v.lucro_real ?? v.lucro_previsto), 0);
      const margem_media      = faturamento > 0 ? (lucro_real / faturamento) * 100 : 0;
      const frete_previsto_total = lista.reduce((s, v) => s + (v.frete_previsto_calculado ?? 0), 0);
      const frete_real_total     = lista.reduce((s, v) => s + (v.frete_real?.valor_frete_real ?? 0), 0);
      const frete_pendente       = lista
        .filter((v) => v.status_frete === "pendente")
        .reduce((s, v) => s + (v.frete_previsto_calculado ?? 0), 0);
      const qtd_conciliadas = lista.filter((v) => v.frete_real || v.tipo_registro === "historico_consolidado").length;

      return {
        mes,
        mes_label:          getMesLabel(mes),
        faturamento,
        lucro_previsto,
        lucro_real,
        margem_media,
        frete_previsto_total,
        frete_real_total,
        frete_pendente,
        qtd_vendas:    lista.length,
        qtd_conciliadas,
      };
    });
}

// ─── Formatação ───────────────────────────────────────────────────────────────
export function formatCurrency(value: number | null | undefined): string {
  if (value === null || value === undefined) return "—";
  return new Intl.NumberFormat("pt-BR", {
    style:    "currency",
    currency: "BRL",
  }).format(value);
}

export function formatPercent(value: number | null | undefined): string {
  if (value === null || value === undefined) return "—";
  return `${value.toFixed(1)}%`;
}

export function formatDate(dateStr: string): string {
  return new Date(dateStr + "T12:00:00").toLocaleDateString("pt-BR");
}

export function getMesLabel(mes: string): string {
  const [year, month] = mes.split("-");
  const months = ["Jan","Fev","Mar","Abr","Mai","Jun","Jul","Ago","Set","Out","Nov","Dez"];
  return `${months[parseInt(month) - 1]}/${year.slice(2)}`;
}

// ─── Helpers legados (compatibilidade) ───────────────────────────────────────
export function calcularFretePrevisto(
  tipo: string, valor: number, custo: number, valorVenda: number
): number {
  if (tipo === "fixo")              return valor;
  if (tipo === "percentual_custo")  return custo * (valor / 100);
  if (tipo === "percentual_venda")  return valorVenda * (valor / 100);
  return 0;
}

export function calcularImposto(
  tipo: string, valor: number, custo: number, valorVenda: number
): number {
  if (tipo === "fixo")              return valor;
  if (tipo === "percentual_venda")  return valorVenda * (valor / 100);
  if (tipo === "percentual_custo")  return custo * (valor / 100);
  return 0;
}
