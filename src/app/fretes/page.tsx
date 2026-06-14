"use client";
import { useState } from "react";
import { Plus, Truck, Search, AlertCircle, CheckCircle2, Link2 } from "lucide-react";
import { MOCK_FRETES, MOCK_VENDAS } from "@/lib/mock-data";
import { formatCurrency, formatDate } from "@/lib/calculations";
import type { FreteReal } from "@/types";

// ─── Formulário ──────────────────────────────────────────────────────────────
interface FreteForm {
  data_cobranca: string;
  transportadora: string;
  pedido_referencia: string;
  cliente_referencia: string;
  valor_frete_real: string;
  venda_id: string;
  observacoes: string;
}

const FORM_INICIAL: FreteForm = {
  data_cobranca: new Date().toISOString().split("T")[0],
  transportadora: "",
  pedido_referencia: "",
  cliente_referencia: "",
  valor_frete_real: "",
  venda_id: "",
  observacoes: "",
};

const TRANSPORTADORAS = [
  "Transportadora Sul",
  "LogBrasil",
  "Expressa Cargo",
  "TNT",
  "Fedex",
  "Correios",
  "Outra",
];

export default function FretesPage() {
  const [fretes] = useState<FreteReal[]>(MOCK_FRETES);
  const [mostrarForm, setMostrarForm] = useState(false);
  const [form, setForm] = useState<FreteForm>(FORM_INICIAL);
  const [busca, setBusca] = useState("");
  const [filtroStatus, setFiltroStatus] = useState("todos");

  // Ao selecionar um pedido, preenche automaticamente o cliente
  function aoSelecionarVenda(venda_id: string) {
    const venda = MOCK_VENDAS.find((v) => v.id === venda_id);
    setForm((f) => ({
      ...f,
      venda_id,
      cliente_referencia: venda?.cliente ?? f.cliente_referencia,
      pedido_referencia: venda?.pedido_ref ?? f.pedido_referencia,
    }));
  }

  const fretesFiltrados = fretes.filter((f) => {
    const textMatch =
      f.cliente_referencia.toLowerCase().includes(busca.toLowerCase()) ||
      f.pedido_referencia.toLowerCase().includes(busca.toLowerCase()) ||
      f.transportadora.toLowerCase().includes(busca.toLowerCase());
    const statusMatch =
      filtroStatus === "todos" || f.status === filtroStatus;
    return textMatch && statusMatch;
  });

  const totalNaoConciliado = fretes
    .filter((f) => f.status === "nao_conciliado")
    .reduce((s, f) => s + f.valor_frete_real, 0);

  const totalConciliado = fretes
    .filter((f) => f.status === "conciliado")
    .reduce((s, f) => s + f.valor_frete_real, 0);

  // Pedidos sem frete real ainda (pendentes)
  const pendenteIds = new Set(fretes.map((f) => f.venda_id).filter(Boolean));
  const vendasSemFrete = MOCK_VENDAS.filter((v) => !pendenteIds.has(v.id));

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Fretes Reais</h1>
          <p className="text-sm text-gray-500 mt-0.5">
            Registre as cobranças reais da transportadora
          </p>
        </div>
        <button
          onClick={() => setMostrarForm(!mostrarForm)}
          className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors"
        >
          <Plus size={16} />
          Registrar Frete
        </button>
      </div>

      {/* Cards de resumo */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white rounded-xl border p-5 shadow-sm">
          <div className="flex items-center gap-2 mb-2">
            <Truck size={16} className="text-green-600" />
            <p className="text-sm text-gray-500">Total Conciliado</p>
          </div>
          <p className="text-2xl font-bold text-green-700">{formatCurrency(totalConciliado)}</p>
          <p className="text-xs text-gray-400 mt-1">
            {fretes.filter((f) => f.status === "conciliado").length} fretes vinculados
          </p>
        </div>

        <div className="bg-white rounded-xl border border-orange-100 p-5 shadow-sm">
          <div className="flex items-center gap-2 mb-2">
            <AlertCircle size={16} className="text-orange-500" />
            <p className="text-sm text-gray-500">Não Conciliado</p>
          </div>
          <p className="text-2xl font-bold text-orange-600">{formatCurrency(totalNaoConciliado)}</p>
          <p className="text-xs text-gray-400 mt-1">
            {fretes.filter((f) => f.status === "nao_conciliado").length} frete(s) sem pedido vinculado
          </p>
        </div>

        <div className="bg-white rounded-xl border border-yellow-100 p-5 shadow-sm">
          <div className="flex items-center gap-2 mb-2">
            <Truck size={16} className="text-yellow-500" />
            <p className="text-sm text-gray-500">Pedidos Aguardando Frete</p>
          </div>
          <p className="text-2xl font-bold text-yellow-700">{vendasSemFrete.length}</p>
          <p className="text-xs text-gray-400 mt-1">Pedidos sem frete real registrado</p>
        </div>
      </div>

      {/* Alerta: pedidos aguardando */}
      {vendasSemFrete.length > 0 && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4">
          <div className="flex items-start gap-3">
            <AlertCircle size={16} className="text-yellow-600 mt-0.5 shrink-0" />
            <div>
              <p className="text-sm font-medium text-yellow-800 mb-2">
                {vendasSemFrete.length} pedido(s) aguardando frete real
              </p>
              <div className="flex flex-wrap gap-2">
                {vendasSemFrete.map((v) => (
                  <span
                    key={v.id}
                    className="inline-flex items-center gap-1 bg-white border border-yellow-200 rounded-full px-3 py-0.5 text-xs text-yellow-700"
                  >
                    <Truck size={10} />
                    {v.pedido_ref} — {v.cliente}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Formulário de registro */}
      {mostrarForm && (
        <div className="bg-white rounded-xl border border-green-200 shadow-sm p-6">
          <h2 className="font-semibold text-gray-800 mb-5 flex items-center gap-2">
            <Truck size={18} className="text-green-600" />
            Registrar Frete Real
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Vincular a um pedido */}
            <div className="md:col-span-3">
              <label className="block text-xs font-medium text-gray-600 mb-1">
                Vincular ao Pedido{" "}
                <span className="text-gray-400 font-normal">(opcional — selecione para preencher automaticamente)</span>
              </label>
              <select
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm"
                value={form.venda_id}
                onChange={(e) => aoSelecionarVenda(e.target.value)}
              >
                <option value="">— Selecione um pedido (ou deixe em branco) —</option>
                {MOCK_VENDAS.map((v) => (
                  <option key={v.id} value={v.id}>
                    {v.pedido_ref} · {v.cliente} · {formatCurrency(v.frete_previsto_calculado)} previsto
                  </option>
                ))}
              </select>
            </div>

            {/* Data */}
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Data da Cobrança</label>
              <input
                type="date"
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm"
                value={form.data_cobranca}
                onChange={(e) => setForm({ ...form, data_cobranca: e.target.value })}
              />
            </div>

            {/* Transportadora */}
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Transportadora</label>
              <select
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm"
                value={form.transportadora}
                onChange={(e) => setForm({ ...form, transportadora: e.target.value })}
              >
                <option value="">Selecione...</option>
                {TRANSPORTADORAS.map((t) => (
                  <option key={t} value={t}>{t}</option>
                ))}
              </select>
            </div>

            {/* Valor real */}
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">
                Valor do Frete Real (R$)
              </label>
              <input
                type="text"
                placeholder="1.240,00"
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm font-semibold"
                value={form.valor_frete_real}
                onChange={(e) => setForm({ ...form, valor_frete_real: e.target.value })}
              />
            </div>

            {/* Referência do pedido */}
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Referência do Pedido / NF</label>
              <input
                type="text"
                placeholder="PED-001 ou NF-99821"
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm"
                value={form.pedido_referencia}
                onChange={(e) => setForm({ ...form, pedido_referencia: e.target.value })}
              />
            </div>

            {/* Cliente */}
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Cliente</label>
              <input
                type="text"
                placeholder="Nome do cliente"
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm"
                value={form.cliente_referencia}
                onChange={(e) => setForm({ ...form, cliente_referencia: e.target.value })}
              />
            </div>

            {/* Observações */}
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Observações</label>
              <input
                type="text"
                placeholder="Ex: 2ª entrega, carga extra..."
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm"
                value={form.observacoes}
                onChange={(e) => setForm({ ...form, observacoes: e.target.value })}
              />
            </div>
          </div>

          {/* Preview de comparação */}
          {form.venda_id && form.valor_frete_real && (() => {
            const venda = MOCK_VENDAS.find((v) => v.id === form.venda_id);
            const real = parseFloat(form.valor_frete_real.replace(",", ".")) || 0;
            if (!venda) return null;
            const diff = real - (venda.frete_previsto_calculado ?? 0);
            return (
              <div className="mt-4 p-4 bg-gray-50 rounded-xl border flex gap-8">
                <div>
                  <p className="text-xs text-gray-400">Frete Previsto</p>
                  <p className="font-bold text-orange-600">{formatCurrency(venda.frete_previsto_calculado)}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-400">Frete Real</p>
                  <p className="font-bold text-gray-800">{formatCurrency(real)}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-400">Diferença</p>
                  <p className={`font-bold ${diff > 0 ? "text-red-600" : "text-green-600"}`}>
                    {diff > 0 ? "+" : ""}{formatCurrency(diff)}
                    {diff > 0 ? " (ficou mais caro)" : " (economizou)"}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-400">Impacto no Lucro</p>
                  <p className={`font-bold ${diff > 0 ? "text-red-600" : "text-green-600"}`}>
                    {diff > 0 ? "-" : "+"}{formatCurrency(Math.abs(diff))}
                  </p>
                </div>
              </div>
            );
          })()}

          <div className="mt-4 flex gap-3 justify-end">
            <button
              onClick={() => { setMostrarForm(false); setForm(FORM_INICIAL); }}
              className="px-4 py-2 text-sm text-gray-600 border border-gray-200 rounded-lg hover:bg-gray-50"
            >
              Cancelar
            </button>
            <button className="px-6 py-2 text-sm font-medium bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors">
              Salvar Frete Real
            </button>
          </div>
        </div>
      )}

      {/* Filtros */}
      <div className="flex flex-wrap gap-3">
        <div className="relative flex-1 min-w-[200px]">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Buscar por cliente, pedido ou transportadora..."
            className="w-full pl-9 pr-4 py-2 text-sm border border-gray-200 rounded-lg bg-white"
            value={busca}
            onChange={(e) => setBusca(e.target.value)}
          />
        </div>
        <select
          className="text-sm border border-gray-200 rounded-lg px-3 py-2 bg-white text-gray-600"
          value={filtroStatus}
          onChange={(e) => setFiltroStatus(e.target.value)}
        >
          <option value="todos">Todos</option>
          <option value="conciliado">Conciliado</option>
          <option value="nao_conciliado">Não conciliado</option>
        </select>
        <p className="text-sm text-gray-400 self-center">{fretesFiltrados.length} frete(s)</p>
      </div>

      {/* Tabela */}
      <div className="bg-white rounded-xl border shadow-sm overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 border-b border-gray-100">
            <tr>
              <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Data</th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Transportadora</th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Cliente / Pedido</th>
              <th className="text-right px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Valor Real</th>
              <th className="text-right px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Frete Prev.</th>
              <th className="text-right px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Diferença</th>
              <th className="text-center px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {fretesFiltrados.length === 0 ? (
              <tr>
                <td colSpan={7} className="text-center text-gray-400 py-12 text-sm">
                  Nenhum frete encontrado.
                </td>
              </tr>
            ) : (
              fretesFiltrados.map((f) => {
                const venda = MOCK_VENDAS.find((v) => v.id === f.venda_id);
                const diff = venda
                  ? f.valor_frete_real - (venda.frete_previsto_calculado ?? 0)
                  : null;
                return (
                  <tr key={f.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-4 py-3 text-gray-600">{formatDate(f.data_cobranca)}</td>
                    <td className="px-4 py-3 font-medium text-gray-800">{f.transportadora}</td>
                    <td className="px-4 py-3">
                      <p className="font-medium text-gray-800 truncate max-w-[180px]">{f.cliente_referencia}</p>
                      <p className="text-xs text-gray-400">{f.pedido_referencia}</p>
                    </td>
                    <td className="px-4 py-3 text-right font-bold text-gray-900">
                      {formatCurrency(f.valor_frete_real)}
                    </td>
                    <td className="px-4 py-3 text-right text-orange-500">
                      {venda ? formatCurrency(venda.frete_previsto_calculado) : <span className="text-gray-300">—</span>}
                    </td>
                    <td className="px-4 py-3 text-right">
                      {diff !== null ? (
                        <span className={`font-semibold ${diff > 0 ? "text-red-600" : "text-green-600"}`}>
                          {diff > 0 ? "+" : ""}{formatCurrency(diff)}
                        </span>
                      ) : (
                        <span className="text-gray-300">—</span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-center">
                      {f.status === "conciliado" ? (
                        <span className="inline-flex items-center gap-1 bg-green-100 text-green-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
                          <CheckCircle2 size={11} />
                          Conciliado
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 bg-orange-100 text-orange-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
                          <Link2 size={11} />
                          Não vinculado
                        </span>
                      )}
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
