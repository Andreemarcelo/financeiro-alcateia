"use client";
import { useState } from "react";
import {
  BarChart3, TrendingUp, TrendingDown, DollarSign,
  Truck, CheckCircle2, AlertTriangle, Lock,
} from "lucide-react";
import {
  BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, Legend, ReferenceLine,
} from "recharts";
import { MOCK_VENDAS, MOCK_FRETES, MOCK_GRAFICO_MENSAL } from "@/lib/mock-data";
import { enrichVendaComFrete, formatCurrency, formatDate, formatPercent } from "@/lib/calculations";
import StatusBadge from "@/components/shared/StatusBadge";

const MESES_LABEL: Record<string, string> = {
  "2026-01": "Janeiro 2026",
  "2026-02": "Fevereiro 2026",
  "2026-03": "Março 2026",
  "2026-04": "Abril 2026",
};

export default function RelatoriosPage() {
  const vendasComFrete = MOCK_VENDAS.map((v) => enrichVendaComFrete(v, MOCK_FRETES));

  const [mesSelecionado, setMesSelecionado] = useState("2026-04");
  const [abaSelecionada, setAbaSelecionada] = useState<"mensal" | "geral">("mensal");

  const vendasMes = vendasComFrete.filter((v) => v.mes_competencia === mesSelecionado);

  // KPIs do mês
  const fat = vendasMes.reduce((s, v) => s + v.valor_venda, 0);
  const custo = vendasMes.reduce((s, v) => s + (v.custo_mercadoria ?? 0), 0);
  const fretePrev = vendasMes.reduce((s, v) => s + (v.frete_previsto_calculado ?? 0), 0);
  const freteReal = vendasMes.reduce((s, v) => s + (v.frete_real?.valor_frete_real ?? 0), 0);
  const imposto = vendasMes.reduce((s, v) => s + (v.imposto_calculado ?? 0), 0);
  const extras = vendasMes.reduce((s, v) => s + (v.extras ?? 0), 0);
  const lucroPrev = vendasMes.reduce((s, v) => s + (v.lucro_previsto ?? 0), 0);
  const lucroReal = vendasMes.filter((v) => v.lucro_real != null).reduce((s, v) => s + (v.lucro_real ?? 0), 0);
  const margemPrev = fat > 0 ? (lucroPrev / fat) * 100 : 0;
  const margemReal = fat > 0 ? (lucroReal / fat) * 100 : 0;
  const conciliadas = vendasMes.filter((v) => v.frete_real).length;

  // Dados para gráfico de composição do mês
  const composicaoData = [
    {
      name: "Composição",
      custo: custo,
      frete: fretePrev,
      imposto: imposto,
      extras: extras,
      lucro: lucroPrev,
    },
  ];

  // Top clientes do período
  const topClientes = [...vendasComFrete]
    .sort((a, b) => b.lucro_previsto - a.lucro_previsto)
    .slice(0, 5);

  // Dados de frete para gráfico
  const dadosFrete = MOCK_GRAFICO_MENSAL.map((m) => ({
    ...m,
    frete_previsto: vendasComFrete
      .filter((v) => {
        const [y, mo] = v.mes_competencia.split("-");
        return m.mes === `${["Jan","Fev","Mar","Abr","Mai","Jun","Jul","Ago","Set","Out","Nov","Dez"][parseInt(mo)-1]}/${y.slice(2)}`;
      })
      .reduce((s, v) => s + (v.frete_previsto_calculado ?? 0), 0),
    frete_real: vendasComFrete
      .filter((v) => {
        const [y, mo] = v.mes_competencia.split("-");
        return m.mes === `${["Jan","Fev","Mar","Abr","Mai","Jun","Jul","Ago","Set","Out","Nov","Dez"][parseInt(mo)-1]}/${y.slice(2)}`;
      })
      .reduce((s, v) => s + (v.frete_real?.valor_frete_real ?? 0), 0),
  }));

  const meses = Array.from(new Set(MOCK_VENDAS.map((v) => v.mes_competencia))).sort().reverse();

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <BarChart3 size={22} className="text-green-600" />
            Relatórios
          </h1>
          <p className="text-sm text-gray-500 mt-0.5">Análise financeira por período</p>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 bg-gray-100 rounded-lg p-1">
          <button
            onClick={() => setAbaSelecionada("mensal")}
            className={`px-4 py-1.5 rounded-md text-sm font-medium transition-colors ${
              abaSelecionada === "mensal"
                ? "bg-white shadow text-gray-900"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            Por Mês
          </button>
          <button
            onClick={() => setAbaSelecionada("geral")}
            className={`px-4 py-1.5 rounded-md text-sm font-medium transition-colors ${
              abaSelecionada === "geral"
                ? "bg-white shadow text-gray-900"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            Visão Geral
          </button>
        </div>
      </div>

      {/* ─── ABA: MENSAL ─────────────────────────────────────────────────────── */}
      {abaSelecionada === "mensal" && (
        <>
          {/* Seletor de mês */}
          <div className="flex gap-2 flex-wrap">
            {meses.map((m) => (
              <button
                key={m}
                onClick={() => setMesSelecionado(m)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  mesSelecionado === m
                    ? "bg-green-600 text-white"
                    : "bg-white border border-gray-200 text-gray-600 hover:bg-gray-50"
                }`}
              >
                {MESES_LABEL[m] ?? m}
              </button>
            ))}
          </div>

          {/* KPIs do mês */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-white rounded-xl border p-4 shadow-sm">
              <p className="text-xs text-gray-400 mb-1">Faturamento</p>
              <p className="text-xl font-bold text-gray-900">{formatCurrency(fat)}</p>
              <p className="text-xs text-gray-400">{vendasMes.length} pedido(s)</p>
            </div>
            <div className="bg-green-50 rounded-xl border border-green-200 p-4 shadow-sm">
              <p className="text-xs text-gray-400 mb-1">Lucro Previsto</p>
              <p className="text-xl font-bold text-green-700">{formatCurrency(lucroPrev)}</p>
              <p className="text-xs text-green-600">{margemPrev.toFixed(1)}% de margem</p>
            </div>
            <div className="bg-white rounded-xl border p-4 shadow-sm">
              <p className="text-xs text-gray-400 mb-1">Lucro Real</p>
              <p className="text-xl font-bold text-emerald-600">
                {lucroReal > 0 ? formatCurrency(lucroReal) : "Aguardando..."}
              </p>
              {lucroReal > 0 && (
                <p className="text-xs text-gray-400">{margemReal.toFixed(1)}% de margem</p>
              )}
            </div>
            <div className={`bg-white rounded-xl border p-4 shadow-sm ${conciliadas < vendasMes.length ? "border-yellow-100" : "border-green-100"}`}>
              <p className="text-xs text-gray-400 mb-1">Conciliação</p>
              <p className="text-xl font-bold text-gray-900">
                {conciliadas}/{vendasMes.length}
              </p>
              <p className="text-xs text-gray-400">pedidos conciliados</p>
            </div>
          </div>

          {/* DRE simplificado do mês */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* DRE */}
            <div className="bg-white rounded-xl border p-5 shadow-sm">
              <h2 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
                <DollarSign size={16} className="text-green-600" />
                DRE — {MESES_LABEL[mesSelecionado] ?? mesSelecionado}
              </h2>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between py-1.5 border-b border-gray-50">
                  <span className="font-semibold text-gray-700">Receita Bruta</span>
                  <span className="font-bold text-gray-900">{formatCurrency(fat)}</span>
                </div>
                <div className="flex justify-between py-1.5">
                  <span className="text-gray-500">(-) Custo da Mercadoria</span>
                  <span className="text-red-600">– {formatCurrency(custo)}</span>
                </div>
                <div className="flex justify-between py-1.5">
                  <span className="text-gray-500">(-) Frete Previsto</span>
                  <span className="text-orange-600">– {formatCurrency(fretePrev)}</span>
                </div>
                {freteReal > 0 && (
                  <div className="flex justify-between py-1.5 text-xs">
                    <span className="text-gray-400 ml-4">└ Frete Real (conciliado)</span>
                    <span className={freteReal > fretePrev ? "text-red-500" : "text-green-500"}>
                      – {formatCurrency(freteReal)}
                    </span>
                  </div>
                )}
                <div className="flex justify-between py-1.5">
                  <span className="text-gray-500">(-) Impostos</span>
                  <span className="text-blue-600">– {formatCurrency(imposto)}</span>
                </div>
                {extras > 0 && (
                  <div className="flex justify-between py-1.5">
                    <span className="text-gray-500">(-) Extras / Outros</span>
                    <span className="text-gray-600">– {formatCurrency(extras)}</span>
                  </div>
                )}
                <div className="flex justify-between py-2 border-t border-gray-200 font-bold text-base">
                  <span className="text-gray-800">Lucro Previsto</span>
                  <span className={lucroPrev >= 0 ? "text-green-700" : "text-red-600"}>
                    {formatCurrency(lucroPrev)}
                  </span>
                </div>
                <div className="flex justify-between py-1 text-xs text-gray-400">
                  <span>Margem Prevista</span>
                  <span>{margemPrev.toFixed(1)}%</span>
                </div>
                {lucroReal > 0 && (
                  <>
                    <div className="flex justify-between py-2 border-t border-gray-100 font-bold">
                      <span className="text-gray-700">Lucro Real (após frete real)</span>
                      <span className={lucroReal >= 0 ? "text-emerald-700" : "text-red-600"}>
                        {formatCurrency(lucroReal)}
                      </span>
                    </div>
                    <div className="flex justify-between py-1 text-xs text-gray-400">
                      <span>Margem Real</span>
                      <span>{margemReal.toFixed(1)}%</span>
                    </div>
                  </>
                )}
              </div>
            </div>

            {/* Gráfico composição */}
            <div className="bg-white rounded-xl border p-5 shadow-sm">
              <h2 className="font-semibold text-gray-800 mb-4">Composição do Faturamento</h2>
              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={composicaoData} layout="vertical">
                  <XAxis
                    type="number"
                    tickFormatter={(v) => `R$${(v / 1000).toFixed(0)}k`}
                    tick={{ fontSize: 10 }}
                  />
                  <YAxis type="category" dataKey="name" hide />
                  <Tooltip formatter={(v: number) => formatCurrency(v)} />
                  <Legend iconSize={10} />
                  <Bar dataKey="custo"    fill="#f87171" name="Custo"    radius={[0,0,0,0]} />
                  <Bar dataKey="frete"    fill="#fb923c" name="Frete"    radius={[0,0,0,0]} />
                  <Bar dataKey="imposto"  fill="#60a5fa" name="Imposto"  radius={[0,0,0,0]} />
                  <Bar dataKey="extras"   fill="#a78bfa" name="Extras"   radius={[0,0,0,0]} />
                  <Bar dataKey="lucro"    fill="#4ade80" name="Lucro"    radius={[0,4,4,0]} />
                </BarChart>
              </ResponsiveContainer>

              {/* Frete previsto vs real */}
              {freteReal > 0 && (
                <div className="mt-4 p-3 bg-orange-50 rounded-lg border border-orange-100">
                  <p className="text-xs font-medium text-orange-700 mb-2 flex items-center gap-1">
                    <Truck size={12} /> Frete: Previsto vs Real
                  </p>
                  <div className="flex gap-6 text-sm">
                    <div>
                      <p className="text-xs text-gray-400">Previsto</p>
                      <p className="font-bold text-orange-600">{formatCurrency(fretePrev)}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-400">Real</p>
                      <p className="font-bold text-gray-800">{formatCurrency(freteReal)}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-400">Diferença</p>
                      <p className={`font-bold ${freteReal > fretePrev ? "text-red-600" : "text-green-600"}`}>
                        {freteReal > fretePrev ? "+" : ""}{formatCurrency(freteReal - fretePrev)}
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Tabela de pedidos do mês */}
          <div className="bg-white rounded-xl border shadow-sm overflow-hidden">
            <div className="px-5 py-3 border-b bg-gray-50 flex items-center justify-between">
              <h2 className="font-semibold text-gray-800">
                Pedidos de {MESES_LABEL[mesSelecionado] ?? mesSelecionado}
              </h2>
              <span className="text-xs text-gray-400">{vendasMes.length} pedido(s)</span>
            </div>
            <table className="w-full text-sm">
              <thead className="border-b border-gray-100">
                <tr className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                  <th className="text-left px-4 py-2">Data</th>
                  <th className="text-left px-4 py-2">Cliente</th>
                  <th className="text-right px-4 py-2">Venda</th>
                  <th className="text-right px-4 py-2">Lucro Prev.</th>
                  <th className="text-right px-4 py-2">Margem</th>
                  <th className="text-right px-4 py-2">Frete Prev.</th>
                  <th className="text-right px-4 py-2">Frete Real</th>
                  <th className="text-center px-4 py-2">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {vendasMes.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="text-center text-gray-400 py-8">
                      Nenhum pedido neste mês.
                    </td>
                  </tr>
                ) : (
                  vendasMes.map((v) => (
                    <tr key={v.id} className="hover:bg-gray-50">
                      <td className="px-4 py-2.5 text-gray-500">{formatDate(v.data)}</td>
                      <td className="px-4 py-2.5 font-medium text-gray-900 max-w-[160px] truncate">
                        {v.cliente}
                      </td>
                      <td className="px-4 py-2.5 text-right font-semibold">
                        {formatCurrency(v.valor_venda)}
                      </td>
                      <td className="px-4 py-2.5 text-right text-green-700 font-bold">
                        {formatCurrency(v.lucro_previsto)}
                      </td>
                      <td className="px-4 py-2.5 text-right">
                        <span className={
                          v.margem_prevista >= 15 ? "text-green-600 font-medium" :
                          v.margem_prevista >= 8  ? "text-yellow-600 font-medium" :
                                                    "text-red-600 font-medium"
                        }>
                          {v.margem_prevista.toFixed(1)}%
                        </span>
                      </td>
                      <td className="px-4 py-2.5 text-right text-orange-500">
                        {formatCurrency(v.frete_previsto_calculado)}
                      </td>
                      <td className="px-4 py-2.5 text-right">
                        {v.frete_real ? (
                          <span className={
                            v.frete_real.valor_frete_real > v.frete_previsto_calculado
                              ? "text-red-600 font-medium"
                              : "text-green-600 font-medium"
                          }>
                            {formatCurrency(v.frete_real.valor_frete_real)}
                          </span>
                        ) : (
                          <span className="text-gray-300">—</span>
                        )}
                      </td>
                      <td className="px-4 py-2.5 text-center">
                        <StatusBadge status={v.status_frete} />
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </>
      )}

      {/* ─── ABA: VISÃO GERAL ─────────────────────────────────────────────────── */}
      {abaSelecionada === "geral" && (
        <>
          {/* Gráficos históricos */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Faturamento e Lucro */}
            <div className="bg-white rounded-xl border p-5 shadow-sm">
              <h2 className="font-semibold text-gray-800 mb-4">Faturamento × Lucro (Mensal)</h2>
              <ResponsiveContainer width="100%" height={220}>
                <BarChart data={MOCK_GRAFICO_MENSAL} barGap={4}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                  <XAxis dataKey="mes" tick={{ fontSize: 12 }} />
                  <YAxis tick={{ fontSize: 11 }} tickFormatter={(v) => `R$${(v / 1000).toFixed(0)}k`} />
                  <Tooltip formatter={(v: number) => formatCurrency(v)} />
                  <Legend />
                  <Bar dataKey="faturamento"    fill="#60a5fa" name="Faturamento" radius={[4,4,0,0]} opacity={0.7} />
                  <Bar dataKey="lucro_previsto" fill="#4ade80" name="Lucro Prev." radius={[4,4,0,0]} />
                  <Bar dataKey="lucro_real"     fill="#16a34a" name="Lucro Real"  radius={[4,4,0,0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* Frete previsto vs real */}
            <div className="bg-white rounded-xl border p-5 shadow-sm">
              <h2 className="font-semibold text-gray-800 mb-4">Frete Previsto vs Real</h2>
              <ResponsiveContainer width="100%" height={220}>
                <LineChart data={dadosFrete}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                  <XAxis dataKey="mes" tick={{ fontSize: 12 }} />
                  <YAxis tick={{ fontSize: 11 }} tickFormatter={(v) => `R$${(v / 1000).toFixed(0)}k`} />
                  <Tooltip formatter={(v: number) => formatCurrency(v)} />
                  <Legend />
                  <Line type="monotone" dataKey="frete_previsto" stroke="#fb923c" strokeWidth={2} name="Previsto" dot />
                  <Line type="monotone" dataKey="frete_real" stroke="#ef4444" strokeWidth={2} name="Real" dot strokeDasharray="4 2" />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Tabela histórica por mês */}
          <div className="bg-white rounded-xl border shadow-sm overflow-hidden">
            <div className="px-5 py-3 border-b bg-gray-50">
              <h2 className="font-semibold text-gray-800">Resumo por Mês</h2>
            </div>
            <table className="w-full text-sm">
              <thead className="border-b border-gray-100">
                <tr className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                  <th className="text-left px-4 py-2">Mês</th>
                  <th className="text-right px-4 py-2">Pedidos</th>
                  <th className="text-right px-4 py-2">Faturamento</th>
                  <th className="text-right px-4 py-2">Lucro Prev.</th>
                  <th className="text-right px-4 py-2">Margem</th>
                  <th className="text-right px-4 py-2">Frete Prev.</th>
                  <th className="text-right px-4 py-2">Frete Real</th>
                  <th className="text-right px-4 py-2">Dif. Frete</th>
                  <th className="text-center px-4 py-2">Conciliação</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {meses.map((m) => {
                  const vm = vendasComFrete.filter((v) => v.mes_competencia === m);
                  const f = vm.reduce((s, v) => s + v.valor_venda, 0);
                  const lp = vm.reduce((s, v) => s + (v.lucro_previsto ?? 0), 0);
                  const fp = vm.reduce((s, v) => s + (v.frete_previsto_calculado ?? 0), 0);
                  const fr = vm.reduce((s, v) => s + (v.frete_real?.valor_frete_real ?? 0), 0);
                  const mg = f > 0 ? (lp / f) * 100 : 0;
                  const df = fr - fp;
                  const conc = vm.filter((v) => v.frete_real).length;
                  return (
                    <tr key={m} className="hover:bg-gray-50">
                      <td className="px-4 py-2.5 font-medium text-gray-800">{MESES_LABEL[m] ?? m}</td>
                      <td className="px-4 py-2.5 text-right text-gray-600">{vm.length}</td>
                      <td className="px-4 py-2.5 text-right font-semibold">{formatCurrency(f)}</td>
                      <td className="px-4 py-2.5 text-right text-green-700 font-bold">{formatCurrency(lp)}</td>
                      <td className="px-4 py-2.5 text-right">
                        <span className={mg >= 15 ? "text-green-600" : mg >= 8 ? "text-yellow-600" : "text-red-600"}>
                          {mg.toFixed(1)}%
                        </span>
                      </td>
                      <td className="px-4 py-2.5 text-right text-orange-500">{formatCurrency(fp)}</td>
                      <td className="px-4 py-2.5 text-right text-gray-700">
                        {fr > 0 ? formatCurrency(fr) : <span className="text-gray-300">—</span>}
                      </td>
                      <td className="px-4 py-2.5 text-right">
                        {fr > 0 ? (
                          <span className={df > 0 ? "text-red-600 font-medium" : "text-green-600 font-medium"}>
                            {df > 0 ? "+" : ""}{formatCurrency(df)}
                          </span>
                        ) : (
                          <span className="text-gray-300">—</span>
                        )}
                      </td>
                      <td className="px-4 py-2.5 text-center">
                        <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${
                          conc === vm.length ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-700"
                        }`}>
                          {conc}/{vm.length}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
              <tfoot className="border-t border-gray-200 bg-gray-50">
                <tr className="text-sm font-bold">
                  <td className="px-4 py-2.5 text-gray-700">TOTAL</td>
                  <td className="px-4 py-2.5 text-right">{vendasComFrete.length}</td>
                  <td className="px-4 py-2.5 text-right">
                    {formatCurrency(vendasComFrete.reduce((s, v) => s + v.valor_venda, 0))}
                  </td>
                  <td className="px-4 py-2.5 text-right text-green-700">
                    {formatCurrency(vendasComFrete.reduce((s, v) => s + (v.lucro_previsto ?? 0), 0))}
                  </td>
                  <td className="px-4 py-2.5 text-right text-gray-500">—</td>
                  <td className="px-4 py-2.5 text-right text-orange-500">
                    {formatCurrency(vendasComFrete.reduce((s, v) => s + (v.frete_previsto_calculado ?? 0), 0))}
                  </td>
                  <td className="px-4 py-2.5 text-right">
                    {formatCurrency(vendasComFrete.reduce((s, v) => s + (v.frete_real?.valor_frete_real ?? 0), 0))}
                  </td>
                  <td className="px-4 py-2.5 text-right text-gray-500">—</td>
                  <td />
                </tr>
              </tfoot>
            </table>
          </div>

          {/* Top clientes */}
          <div className="bg-white rounded-xl border shadow-sm p-5">
            <h2 className="font-semibold text-gray-800 mb-4">Top 5 Clientes por Lucro</h2>
            <div className="space-y-3">
              {topClientes.map((v, i) => (
                <div key={v.id} className="flex items-center gap-4">
                  <span className="w-6 h-6 rounded-full bg-gray-100 text-gray-500 text-xs font-bold flex items-center justify-center shrink-0">
                    {i + 1}
                  </span>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <p className="text-sm font-medium text-gray-800 truncate">{v.cliente}</p>
                      <p className="text-sm font-bold text-green-700 ml-2 shrink-0">
                        {formatCurrency(v.lucro_previsto)}
                      </p>
                    </div>
                    <div className="h-2 bg-gray-100 rounded-full">
                      <div
                        className="h-2 bg-green-500 rounded-full"
                        style={{
                          width: `${(v.lucro_previsto / topClientes[0].lucro_previsto) * 100}%`,
                        }}
                      />
                    </div>
                    <p className="text-xs text-gray-400 mt-0.5">
                      {formatCurrency(v.valor_venda)} em vendas · {v.margem_prevista.toFixed(1)}% margem
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
