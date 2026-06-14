"use client";
import {
  DollarSign, TrendingUp, Truck, AlertTriangle,
  ShoppingBag, CheckCircle, Clock, ArrowRight,
} from "lucide-react";
import {
  AreaChart, Area, BarChart, Bar, XAxis, YAxis,
  CartesianGrid, Tooltip, ResponsiveContainer, Legend,
} from "recharts";
import Link from "next/link";
import KPICard from "@/components/shared/KPICard";
import StatusBadge from "@/components/shared/StatusBadge";
import { MOCK_VENDAS, MOCK_FRETES, MOCK_GRAFICO_MENSAL } from "@/lib/mock-data";
import { enrichVendaComFrete, formatCurrency, formatDate } from "@/lib/calculations";

// Detecta automaticamente o mês mais recente com dados
function getMesAtual(vendas: { mes_competencia: string }[]): string {
  const meses = Array.from(new Set(vendas.map((v) => v.mes_competencia))).sort();
  return meses[meses.length - 1] ?? "2026-03";
}
function getMesAnterior(mesAtual: string, vendas: { mes_competencia: string }[]): string {
  const meses = Array.from(new Set(vendas.map((v) => v.mes_competencia))).sort();
  const idx = meses.indexOf(mesAtual);
  return idx > 0 ? meses[idx - 1] : meses[0];
}

export default function Dashboard() {
  const vendasComFrete = MOCK_VENDAS.map((v) => enrichVendaComFrete(v, MOCK_FRETES));
  const MES_ATUAL   = getMesAtual(MOCK_VENDAS);
  const MES_ANTERIOR = getMesAnterior(MES_ATUAL, MOCK_VENDAS);

  const vendas_mes      = vendasComFrete.filter((v) => v.mes_competencia === MES_ATUAL);
  const vendas_anterior = vendasComFrete.filter((v) => v.mes_competencia === MES_ANTERIOR);

  const fat_mes = vendas_mes.reduce((s, v) => s + v.valor_venda, 0);
  const fat_ant = vendas_anterior.reduce((s, v) => s + v.valor_venda, 0);
  const lp_mes  = vendas_mes.reduce((s, v) => s + (v.lucro_previsto ?? 0), 0);
  const lr_mes  = vendas_mes.reduce((s, v) => s + (v.lucro_real ?? 0), 0);
  const fp_mes  = vendas_mes.reduce((s, v) => s + (v.frete_previsto_calculado ?? 0), 0);
  const fr_mes  = vendas_mes.reduce((s, v) => s + (v.frete_real?.valor_frete_real ?? 0), 0);
  const fp_pend = vendas_mes.filter((v) => v.status_frete === "pendente").reduce((s, v) => s + (v.frete_previsto_calculado ?? 0), 0);
  const margem  = fat_mes > 0 ? (lp_mes / fat_mes) * 100 : 0;
  const varFat  = fat_ant > 0 ? ((fat_mes - fat_ant) / fat_ant) * 100 : 0;

  // Labels amigáveis para o mês
  const MESES_NOMES: Record<string,string> = { "01":"Janeiro","02":"Fevereiro","03":"Março","04":"Abril","05":"Maio","06":"Junho","07":"Julho","08":"Agosto","09":"Setembro","10":"Outubro","11":"Novembro","12":"Dezembro" };
  const [ano, mes] = MES_ATUAL.split("-");
  const mesLabel = `${MESES_NOMES[mes] ?? mes} ${ano}`;

  const alertas = vendasComFrete.filter((v) =>
    v.status_frete === "prejuizo_frete" || v.status_frete === "atencao"
  );
  const ultimas = [...vendasComFrete].sort((a, b) => b.data.localeCompare(a.data)).slice(0, 5);

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-sm text-gray-500 mt-0.5">Mês mais recente — {mesLabel}</p>
        </div>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <KPICard title="Faturamento do Mês" value={formatCurrency(fat_mes)}
          icon={DollarSign} iconColor="text-blue-500" trend={varFat} />
        <KPICard title="Lucro Previsto" value={formatCurrency(lp_mes)}
          subtitle={`Margem ${margem.toFixed(1)}%`}
          icon={TrendingUp} iconColor="text-green-500" highlight />
        <KPICard title="Lucro Real" value={lr_mes > 0 ? formatCurrency(lr_mes) : "Aguardando..."  }
          subtitle="Após frete real"
          icon={CheckCircle} iconColor="text-emerald-500" />
        <KPICard title="Vendas no Mês" value={String(vendas_mes.length)}
          icon={ShoppingBag} iconColor="text-purple-500" />
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <KPICard title="Frete Previsto" value={formatCurrency(fp_mes)}
          icon={Truck} iconColor="text-orange-400" />
        <KPICard title="Frete Real Pago" value={fr_mes > 0 ? formatCurrency(fr_mes) : "—"}
          icon={Truck} iconColor="text-gray-400" />
        <KPICard title="Frete Pendente" value={formatCurrency(fp_pend)}
          subtitle="Aguardando transportadora"
          icon={Clock} iconColor="text-yellow-500" />
        <KPICard title="Alertas de Frete" value={String(alertas.length)}
          subtitle="Diferenças significativas"
          icon={AlertTriangle} iconColor="text-red-500" />
      </div>

      {/* Gráficos */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Faturamento */}
        <div className="bg-white rounded-xl border p-5 shadow-sm">
          <h2 className="font-semibold text-gray-800 mb-4">Faturamento por Mês</h2>
          <ResponsiveContainer width="100%" height={220}>
            <AreaChart data={MOCK_GRAFICO_MENSAL}>
              <defs>
                <linearGradient id="gFat" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.15}/>
                  <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="mes" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 11 }} tickFormatter={(v) => `R$${(v/1000).toFixed(0)}k`} />
              <Tooltip formatter={(v: number) => formatCurrency(v)} />
              <Area type="monotone" dataKey="faturamento" stroke="#3b82f6" fill="url(#gFat)" strokeWidth={2} name="Faturamento" />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Lucro Previsto vs Real */}
        <div className="bg-white rounded-xl border p-5 shadow-sm">
          <h2 className="font-semibold text-gray-800 mb-4">Lucro Previsto vs Real</h2>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={MOCK_GRAFICO_MENSAL} barGap={4}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="mes" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 11 }} tickFormatter={(v) => `R$${(v/1000).toFixed(0)}k`} />
              <Tooltip formatter={(v: number) => formatCurrency(v)} />
              <Legend />
              <Bar dataKey="lucro_previsto" fill="#22c55e" name="Previsto" radius={[4,4,0,0]} />
              <Bar dataKey="lucro_real" fill="#16a34a" name="Real" radius={[4,4,0,0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Alertas + Últimas Vendas */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Alertas */}
        {alertas.length > 0 && (
          <div className="bg-white rounded-xl border border-red-100 p-5 shadow-sm">
            <div className="flex items-center gap-2 mb-4">
              <AlertTriangle size={18} className="text-red-500" />
              <h2 className="font-semibold text-gray-800">Alertas de Frete</h2>
            </div>
            <div className="space-y-3">
              {alertas.map((v) => (
                <div key={v.id} className="flex items-center justify-between py-2 border-b border-gray-50 last:border-0">
                  <div>
                    <p className="text-sm font-medium text-gray-800">{v.cliente}</p>
                    <p className="text-xs text-gray-400">
                      Previsto {formatCurrency(v.frete_previsto_calculado)} →
                      Real {formatCurrency(v.frete_real?.valor_frete_real ?? 0)}
                    </p>
                  </div>
                  <StatusBadge status={v.status_frete} />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Últimas vendas */}
        <div className="bg-white rounded-xl border p-5 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold text-gray-800">Últimas Vendas</h2>
            <Link href="/vendas" className="text-xs text-green-600 hover:underline flex items-center gap-1">
              Ver todas <ArrowRight size={12} />
            </Link>
          </div>
          <div className="space-y-3">
            {ultimas.map((v) => (
              <div key={v.id} className="flex items-center justify-between py-2 border-b border-gray-50 last:border-0">
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium text-gray-800 truncate">{v.cliente}</p>
                  <p className="text-xs text-gray-400">{formatDate(v.data)} · {v.pedido_ref}</p>
                </div>
                <div className="text-right ml-3 shrink-0">
                  <p className="text-sm font-bold text-gray-900">{formatCurrency(v.valor_venda)}</p>
                  <StatusBadge status={v.status_frete} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
