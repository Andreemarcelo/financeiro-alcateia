"use client";
import { useState } from "react";
import {
  GitMerge, CheckCircle2, AlertTriangle, Truck, TrendingUp,
  TrendingDown, Link2, Clock, ChevronDown, ChevronRight,
} from "lucide-react";
import { MOCK_VENDAS, MOCK_FRETES } from "@/lib/mock-data";
import { enrichVendaComFrete, formatCurrency, formatDate } from "@/lib/calculations";
import type { VendaComFrete, FreteReal } from "@/types";

// ─── Tipos de status visual ───────────────────────────────────────────────────
type ConciliacaoStatus = "ok" | "atencao" | "prejuizo" | "ganho" | "pendente";

function getStatusConciliacao(v: VendaComFrete): ConciliacaoStatus {
  if (!v.frete_real) return "pendente";
  const diff = v.frete_real.valor_frete_real - (v.frete_previsto_calculado ?? 0);
  const pct  = v.frete_previsto_calculado ? Math.abs(diff) / v.frete_previsto_calculado : 0;
  if (diff < 0) return "ganho";
  if (pct <= 0.05) return "ok";       // até 5% de diferença = ok
  if (pct <= 0.20) return "atencao";  // até 20% = atenção
  return "prejuizo";                  // acima de 20% = prejuízo no frete
}

const BADGE_CONFIG = {
  ok:        { label: "✅ Correto",       bg: "bg-green-100  text-green-800" },
  ganho:     { label: "💚 Ganho",         bg: "bg-emerald-100 text-emerald-800" },
  atencao:   { label: "⚠️ Atenção",       bg: "bg-orange-100 text-orange-800" },
  prejuizo:  { label: "🔴 Prejuízo",      bg: "bg-red-100    text-red-800" },
  pendente:  { label: "⏳ Pendente",      bg: "bg-yellow-100 text-yellow-800" },
};

// ─── Componente de linha expandível ──────────────────────────────────────────
function LinhaVenda({
  v,
  fretesNaoVinculados,
  onVincular,
}: {
  v: VendaComFrete;
  fretesNaoVinculados: FreteReal[];
  onVincular: (venda_id: string, frete_id: string) => void;
}) {
  const [aberto, setAberto] = useState(false);
  const status = getStatusConciliacao(v);
  const badge = BADGE_CONFIG[status];
  const diff = v.frete_real
    ? v.frete_real.valor_frete_real - (v.frete_previsto_calculado ?? 0)
    : null;

  return (
    <>
      <tr
        className="hover:bg-gray-50 cursor-pointer transition-colors border-b border-gray-100"
        onClick={() => setAberto(!aberto)}
      >
        {/* Expand */}
        <td className="px-4 py-3 text-gray-400">
          {aberto ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
        </td>

        {/* Data */}
        <td className="px-4 py-3 text-sm text-gray-500">{formatDate(v.data)}</td>

        {/* Cliente */}
        <td className="px-4 py-3">
          <p className="text-sm font-medium text-gray-900 truncate max-w-[180px]">{v.cliente}</p>
          <p className="text-xs text-gray-400">{v.pedido_ref}</p>
        </td>

        {/* Venda */}
        <td className="px-4 py-3 text-right text-sm font-semibold text-gray-900">
          {formatCurrency(v.valor_venda)}
        </td>

        {/* Frete previsto */}
        <td className="px-4 py-3 text-right text-sm text-orange-600">
          {formatCurrency(v.frete_previsto_calculado)}
          <p className="text-xs text-gray-400">
            {v.frete_previsto_tipo === "fixo"
              ? "fixo"
              : `${v.frete_previsto_valor}% ${v.frete_previsto_tipo === "percentual_venda" ? "da venda" : "do custo"}`}
          </p>
        </td>

        {/* Frete real */}
        <td className="px-4 py-3 text-right text-sm">
          {v.frete_real ? (
            <>
              <span className={diff !== null && diff > 0 ? "text-red-600 font-bold" : "text-green-600 font-bold"}>
                {formatCurrency(v.frete_real.valor_frete_real)}
              </span>
              <p className="text-xs text-gray-400">{v.frete_real.transportadora}</p>
            </>
          ) : (
            <span className="text-yellow-500 text-xs">Aguardando...</span>
          )}
        </td>

        {/* Diferença */}
        <td className="px-4 py-3 text-right text-sm">
          {diff !== null ? (
            <div className={`flex items-center justify-end gap-1 font-semibold ${diff > 0 ? "text-red-600" : "text-green-600"}`}>
              {diff > 0 ? <TrendingUp size={13} /> : <TrendingDown size={13} />}
              {diff > 0 ? "+" : ""}{formatCurrency(diff)}
            </div>
          ) : (
            <span className="text-gray-300">—</span>
          )}
        </td>

        {/* Lucro previsto vs real */}
        <td className="px-4 py-3 text-right text-sm">
          <div>
            <p className="text-green-600 font-medium">{formatCurrency(v.lucro_previsto)}</p>
            {v.lucro_real != null ? (
              <p className={v.lucro_real >= v.lucro_previsto ? "text-emerald-600 text-xs" : "text-red-500 text-xs"}>
                {formatCurrency(v.lucro_real)} real
              </p>
            ) : (
              <p className="text-gray-300 text-xs">— real</p>
            )}
          </div>
        </td>

        {/* Status */}
        <td className="px-4 py-3">
          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${badge.bg}`}>
            {badge.label}
          </span>
        </td>
      </tr>

      {/* Detalhe expandido */}
      {aberto && (
        <tr className="bg-gray-50">
          <td colSpan={9} className="px-6 pb-5 pt-3">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Coluna esquerda: dados da venda */}
              <div className="bg-white rounded-xl border p-4 space-y-3">
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                  Composição da Venda
                </p>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-500">Valor da Venda</span>
                    <span className="font-semibold">{formatCurrency(v.valor_venda)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Custo da Mercadoria</span>
                    <span className="text-red-600">– {formatCurrency(v.custo_mercadoria)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Frete Previsto</span>
                    <span className="text-orange-600">– {formatCurrency(v.frete_previsto_calculado)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Imposto</span>
                    <span className="text-blue-600">– {formatCurrency(v.imposto_calculado)}</span>
                  </div>
                  {(v.extras ?? 0) > 0 && (
                    <div className="flex justify-between">
                      <span className="text-gray-500">Extras</span>
                      <span className="text-gray-600">– {formatCurrency(v.extras)}</span>
                    </div>
                  )}
                  <div className="flex justify-between border-t pt-2 font-bold">
                    <span className="text-gray-700">Lucro Previsto</span>
                    <span className={v.lucro_previsto >= 0 ? "text-green-700" : "text-red-600"}>
                      {formatCurrency(v.lucro_previsto)} ({v.margem_prevista.toFixed(1)}%)
                    </span>
                  </div>
                  {v.lucro_real != null && (
                    <div className="flex justify-between font-bold">
                      <span className="text-gray-700">Lucro Real</span>
                      <span className={v.lucro_real >= 0 ? "text-emerald-700" : "text-red-600"}>
                        {formatCurrency(v.lucro_real)} ({v.margem_real?.toFixed(1)}%)
                      </span>
                    </div>
                  )}
                </div>
                {v.observacoes && (
                  <p className="text-xs text-gray-400 pt-1 border-t">{v.observacoes}</p>
                )}
              </div>

              {/* Coluna direita: frete real ou opção de vincular */}
              <div>
                {v.frete_real ? (
                  <div className="bg-white rounded-xl border p-4 space-y-3">
                    <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                      Frete Real Registrado
                    </p>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-500">Transportadora</span>
                        <span className="font-medium">{v.frete_real.transportadora}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-500">Data de cobrança</span>
                        <span>{formatDate(v.frete_real.data_cobranca)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-500">Frete Previsto</span>
                        <span className="text-orange-600">{formatCurrency(v.frete_previsto_calculado)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-500">Frete Real</span>
                        <span className="font-bold">{formatCurrency(v.frete_real.valor_frete_real)}</span>
                      </div>
                      <div className="flex justify-between border-t pt-2 font-bold">
                        <span className="text-gray-700">Diferença</span>
                        <span className={diff !== null && diff > 0 ? "text-red-600" : "text-green-600"}>
                          {diff !== null ? (diff > 0 ? "+" : "") + formatCurrency(diff) : "—"}
                          {diff !== null && diff > 0 ? " a mais" : " a menos"}
                        </span>
                      </div>
                    </div>
                    {v.frete_real.observacoes && (
                      <p className="text-xs text-gray-400 border-t pt-2">{v.frete_real.observacoes}</p>
                    )}
                  </div>
                ) : (
                  <div className="bg-yellow-50 rounded-xl border border-yellow-200 p-4">
                    <p className="text-sm font-medium text-yellow-800 mb-3 flex items-center gap-2">
                      <Clock size={14} />
                      Frete real ainda não registrado
                    </p>

                    {fretesNaoVinculados.length > 0 && (
                      <>
                        <p className="text-xs text-yellow-700 mb-2">
                          Existe(m) {fretesNaoVinculados.length} frete(s) não vinculado(s). Deseja vincular?
                        </p>
                        <div className="space-y-2">
                          {fretesNaoVinculados.map((f) => (
                            <div
                              key={f.id}
                              className="flex items-center justify-between bg-white rounded-lg border border-yellow-200 px-3 py-2"
                            >
                              <div className="text-xs">
                                <p className="font-medium">{f.transportadora} · {formatCurrency(f.valor_frete_real)}</p>
                                <p className="text-gray-400">{f.pedido_referencia} · {formatDate(f.data_cobranca)}</p>
                              </div>
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  onVincular(v.id, f.id);
                                }}
                                className="text-xs bg-green-600 hover:bg-green-700 text-white px-3 py-1.5 rounded-lg font-medium transition-colors"
                              >
                                Vincular
                              </button>
                            </div>
                          ))}
                        </div>
                      </>
                    )}

                    <button className="mt-3 w-full text-xs text-yellow-700 hover:text-yellow-900 border border-yellow-300 rounded-lg py-2 flex items-center justify-center gap-1 hover:bg-yellow-100 transition-colors">
                      <Truck size={12} />
                      Registrar Frete Real agora
                    </button>
                  </div>
                )}
              </div>
            </div>
          </td>
        </tr>
      )}
    </>
  );
}

// ─── Página principal ─────────────────────────────────────────────────────────
export default function ConciliacaoPage() {
  const [vendas, setVendas] = useState(() =>
    MOCK_VENDAS.map((v) => enrichVendaComFrete(v, MOCK_FRETES))
  );
  const [fretes, setFretes] = useState(MOCK_FRETES);
  const [filtroMes, setFiltroMes] = useState("todos");

  function vincularFrete(venda_id: string, frete_id: string) {
    const frete = fretes.find((f) => f.id === frete_id);
    if (!frete) return;
    setFretes((prev) =>
      prev.map((f) =>
        f.id === frete_id ? { ...f, venda_id, status: "conciliado" as const } : f
      )
    );
    setVendas((prev) =>
      prev.map((v) => {
        if (v.id !== venda_id) return v;
        const frete_real = { ...frete, venda_id, status: "conciliado" as const };
        const diferenca_frete = frete_real.valor_frete_real - (v.frete_previsto_calculado ?? 0);
        const lucro_real = v.lucro_previsto - diferenca_frete;
        const margem_real = v.valor_venda > 0 ? (lucro_real / v.valor_venda) * 100 : 0;
        const diff_pct = v.frete_previsto_calculado ? Math.abs(diferenca_frete) / v.frete_previsto_calculado : 0;
        const status_frete =
          diferenca_frete < 0 ? "ganho_frete" :
          diff_pct <= 0.05 ? "conciliado" :
          diff_pct <= 0.20 ? "atencao" : "prejuizo_frete";
        return {
          ...v,
          frete_real,
          diferenca_frete,
          lucro_real,
          margem_real,
          status_frete,
        };
      })
    );
  }

  const fretesNaoVinculados = fretes.filter((f) => f.status === "nao_conciliado");

  const vendasFiltradas = vendas.filter((v) =>
    filtroMes === "todos" || v.mes_competencia === filtroMes
  );

  // KPIs de conciliação
  const total = vendasFiltradas.length;
  const conciliadas = vendasFiltradas.filter((v) => v.frete_real).length;
  const pendentes = total - conciliadas;
  const totalFretesPrev = vendasFiltradas.reduce((s, v) => s + (v.frete_previsto_calculado ?? 0), 0);
  const totalFretesReal = vendasFiltradas
    .filter((v) => v.frete_real)
    .reduce((s, v) => s + (v.frete_real?.valor_frete_real ?? 0), 0);
  const difTotal = vendasFiltradas
    .filter((v) => v.frete_real)
    .reduce((s, v) => s + (v.diferenca_frete ?? 0), 0);

  // Meses disponíveis
  const meses = Array.from(new Set(MOCK_VENDAS.map((v) => v.mes_competencia))).sort().reverse();

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <GitMerge size={22} className="text-green-600" />
            Conciliação
          </h1>
          <p className="text-sm text-gray-500 mt-0.5">
            Compare frete previsto vs. real e feche cada pedido
          </p>
        </div>
        <select
          className="text-sm border border-gray-200 rounded-lg px-3 py-2 bg-white text-gray-600"
          value={filtroMes}
          onChange={(e) => setFiltroMes(e.target.value)}
        >
          <option value="todos">Todos os meses</option>
          {meses.map((m) => (
            <option key={m} value={m}>{m}</option>
          ))}
        </select>
      </div>

      {/* KPIs rápidos */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl border p-4 shadow-sm">
          <p className="text-xs text-gray-400 mb-1">Total de Pedidos</p>
          <p className="text-2xl font-bold text-gray-900">{total}</p>
        </div>
        <div className="bg-white rounded-xl border border-green-100 p-4 shadow-sm">
          <p className="text-xs text-gray-400 mb-1">Conciliados</p>
          <p className="text-2xl font-bold text-green-700">
            {conciliadas}
            <span className="text-sm font-normal text-gray-400 ml-1">
              ({total > 0 ? Math.round((conciliadas / total) * 100) : 0}%)
            </span>
          </p>
        </div>
        <div className="bg-white rounded-xl border border-yellow-100 p-4 shadow-sm">
          <p className="text-xs text-gray-400 mb-1">Pendentes</p>
          <p className="text-2xl font-bold text-yellow-600">{pendentes}</p>
        </div>
        <div className={`bg-white rounded-xl border p-4 shadow-sm ${difTotal > 0 ? "border-red-100" : "border-green-100"}`}>
          <p className="text-xs text-gray-400 mb-1">Diferença Total Frete</p>
          <p className={`text-2xl font-bold ${difTotal > 0 ? "text-red-600" : "text-green-600"}`}>
            {difTotal > 0 ? "+" : ""}{formatCurrency(difTotal)}
          </p>
          <p className="text-xs text-gray-400">
            Prev. {formatCurrency(totalFretesPrev)} → Real {formatCurrency(totalFretesReal)}
          </p>
        </div>
      </div>

      {/* Alerta fretes não vinculados */}
      {fretesNaoVinculados.length > 0 && (
        <div className="bg-orange-50 border border-orange-200 rounded-xl p-4 flex items-start gap-3">
          <AlertTriangle size={16} className="text-orange-500 mt-0.5 shrink-0" />
          <div>
            <p className="text-sm font-medium text-orange-800">
              {fretesNaoVinculados.length} frete(s) registrado(s) sem pedido vinculado
            </p>
            <p className="text-xs text-orange-600 mt-0.5">
              Expanda um pedido abaixo para vincular o frete, ou acesse a página de Fretes Reais.
            </p>
          </div>
        </div>
      )}

      {/* Barra de progresso */}
      <div className="bg-white rounded-xl border p-4 shadow-sm">
        <div className="flex items-center justify-between mb-2">
          <p className="text-sm font-medium text-gray-700">Progresso de Conciliação</p>
          <p className="text-sm text-gray-500">
            {conciliadas} de {total} pedidos
          </p>
        </div>
        <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
          <div
            className="h-full bg-green-500 rounded-full transition-all duration-500"
            style={{ width: total > 0 ? `${(conciliadas / total) * 100}%` : "0%" }}
          />
        </div>
        <div className="flex gap-4 mt-2 text-xs text-gray-400">
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-green-500 inline-block" />
            Conciliado
          </span>
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-yellow-400 inline-block" />
            Pendente
          </span>
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-red-400 inline-block" />
            Prejuízo no frete
          </span>
        </div>
      </div>

      {/* Tabela principal */}
      <div className="bg-white rounded-xl border shadow-sm overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 border-b border-gray-100">
            <tr>
              <th className="w-8 px-4 py-3" />
              <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Data</th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Cliente</th>
              <th className="text-right px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Venda</th>
              <th className="text-right px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">
                <span className="text-orange-500">Frete Prev.</span>
              </th>
              <th className="text-right px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">
                Frete Real
              </th>
              <th className="text-right px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">
                Diferença
              </th>
              <th className="text-right px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">
                Lucro
              </th>
              <th className="text-center px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">
                Status
              </th>
            </tr>
          </thead>
          <tbody>
            {vendasFiltradas.length === 0 ? (
              <tr>
                <td colSpan={9} className="text-center text-gray-400 py-12">
                  Nenhum pedido encontrado.
                </td>
              </tr>
            ) : (
              vendasFiltradas.map((v) => (
                <LinhaVenda
                  key={v.id}
                  v={v}
                  fretesNaoVinculados={fretesNaoVinculados}
                  onVincular={vincularFrete}
                />
              ))
            )}
          </tbody>
          <tfoot className="bg-gray-50 border-t border-gray-200">
            <tr>
              <td colSpan={3} className="px-4 py-3 text-xs font-semibold text-gray-600 uppercase">
                Totais ({vendasFiltradas.length} pedidos)
              </td>
              <td className="px-4 py-3 text-right text-sm font-bold text-gray-900">
                {formatCurrency(vendasFiltradas.reduce((s, v) => s + v.valor_venda, 0))}
              </td>
              <td className="px-4 py-3 text-right text-sm font-bold text-orange-600">
                {formatCurrency(totalFretesPrev)}
              </td>
              <td className="px-4 py-3 text-right text-sm font-bold text-gray-800">
                {formatCurrency(totalFretesReal)}
              </td>
              <td className="px-4 py-3 text-right text-sm font-bold">
                <span className={difTotal > 0 ? "text-red-600" : "text-green-600"}>
                  {difTotal > 0 ? "+" : ""}{formatCurrency(difTotal)}
                </span>
              </td>
              <td className="px-4 py-3 text-right text-sm font-bold text-green-700">
                {formatCurrency(vendasFiltradas.reduce((s, v) => s + v.lucro_previsto, 0))}
              </td>
              <td />
            </tr>
          </tfoot>
        </table>
      </div>
    </div>
  );
}
