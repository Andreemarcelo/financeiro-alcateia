"use client";
import { useState } from "react";
import {
  Plus, Search, Filter, ChevronDown, ChevronUp,
  ShoppingBag, TrendingUp, DollarSign, Truck,
} from "lucide-react";
import StatusBadge from "@/components/shared/StatusBadge";
import { MOCK_VENDAS, MOCK_FRETES } from "@/lib/mock-data";
import { enrichVendaComFrete, formatCurrency, formatDate, formatPercent } from "@/lib/calculations";
import type { VendaComFrete, Fretetipo, ImpostoTipo } from "@/types";

// ─── Formulário de nova venda ────────────────────────────────────────────────
interface FormState {
  data: string;
  cliente: string;
  pedido_ref: string;
  valor_venda: string;
  custo_mercadoria: string;
  frete_previsto_tipo: Fretetipo;
  frete_previsto_valor: string;
  imposto_tipo: ImpostoTipo;
  imposto_valor: string;
  extras: string;
  observacoes: string;
}

const FORM_INICIAL: FormState = {
  data: new Date().toISOString().split("T")[0],
  cliente: "",
  pedido_ref: "",
  valor_venda: "",
  custo_mercadoria: "",
  frete_previsto_tipo: "percentual_venda",
  frete_previsto_valor: "12",
  imposto_tipo: "percentual_venda",
  imposto_valor: "10",
  extras: "0",
  observacoes: "",
};

function calcularPreview(f: FormState) {
  const venda = parseFloat(f.valor_venda.replace(",", ".")) || 0;
  const custo = parseFloat(f.custo_mercadoria.replace(",", ".")) || 0;
  const freteVal = parseFloat(f.frete_previsto_valor.replace(",", ".")) || 0;
  const impostoVal = parseFloat(f.imposto_valor.replace(",", ".")) || 0;
  const extras = parseFloat(f.extras.replace(",", ".")) || 0;

  const frete =
    f.frete_previsto_tipo === "fixo"
      ? freteVal
      : f.frete_previsto_tipo === "percentual_venda"
      ? (venda * freteVal) / 100
      : (custo * freteVal) / 100;

  const imposto =
    f.imposto_tipo === "fixo"
      ? impostoVal
      : f.imposto_tipo === "percentual_venda"
      ? (venda * impostoVal) / 100
      : (custo * impostoVal) / 100;

  const lucro = venda - custo - frete - imposto - extras;
  const margem = venda > 0 ? (lucro / venda) * 100 : 0;
  return { frete, imposto, lucro, margem };
}

// ─── Componente principal ────────────────────────────────────────────────────
export default function VendasPage() {
  const vendasComFrete = MOCK_VENDAS.map((v) => enrichVendaComFrete(v, MOCK_FRETES));

  const [busca, setBusca] = useState("");
  const [filroStatus, setFiltroStatus] = useState("todos");
  const [mostrarForm, setMostrarForm] = useState(false);
  const [form, setForm] = useState<FormState>(FORM_INICIAL);
  const [vendaSelecionada, setVendaSelecionada] = useState<VendaComFrete | null>(null);
  const [ordenacao, setOrdenacao] = useState<{ campo: keyof VendaComFrete; asc: boolean }>({
    campo: "data",
    asc: false,
  });

  const preview = calcularPreview(form);

  // Filtrar e ordenar
  const vendasFiltradas = vendasComFrete
    .filter((v) => {
      const textMatch =
        v.cliente.toLowerCase().includes(busca.toLowerCase()) ||
        v.pedido_ref.toLowerCase().includes(busca.toLowerCase());
      const statusMatch = filroStatus === "todos" || v.status_frete === filroStatus;
      return textMatch && statusMatch;
    })
    .sort((a, b) => {
      const av = a[ordenacao.campo] ?? "";
      const bv = b[ordenacao.campo] ?? "";
      const cmp = String(av).localeCompare(String(bv));
      return ordenacao.asc ? cmp : -cmp;
    });

  function alternarOrdem(campo: keyof VendaComFrete) {
    setOrdenacao((o) =>
      o.campo === campo ? { campo, asc: !o.asc } : { campo, asc: true }
    );
  }

  function OrdIcon({ campo }: { campo: keyof VendaComFrete }) {
    if (ordenacao.campo !== campo) return null;
    return ordenacao.asc ? (
      <ChevronUp size={12} className="inline ml-1" />
    ) : (
      <ChevronDown size={12} className="inline ml-1" />
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Vendas</h1>
          <p className="text-sm text-gray-500 mt-0.5">Todos os pedidos cadastrados</p>
        </div>
        <button
          onClick={() => {
            setMostrarForm(!mostrarForm);
            setVendaSelecionada(null);
          }}
          className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors"
        >
          <Plus size={16} />
          Nova Venda
        </button>
      </div>

      {/* Formulário de cadastro */}
      {mostrarForm && (
        <div className="bg-white rounded-xl border border-green-200 shadow-sm p-6">
          <h2 className="font-semibold text-gray-800 mb-5 flex items-center gap-2">
            <ShoppingBag size={18} className="text-green-600" />
            Cadastrar Nova Venda
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Data */}
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Data da Venda</label>
              <input
                type="date"
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm"
                value={form.data}
                onChange={(e) => setForm({ ...form, data: e.target.value })}
              />
            </div>

            {/* Cliente */}
            <div className="md:col-span-2">
              <label className="block text-xs font-medium text-gray-600 mb-1">Nome do Cliente</label>
              <input
                type="text"
                placeholder="Ex: REGIS CAMPOS & FILIPAK MS2"
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm"
                value={form.cliente}
                onChange={(e) => setForm({ ...form, cliente: e.target.value })}
              />
            </div>

            {/* Pedido Ref */}
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Referência do Pedido</label>
              <input
                type="text"
                placeholder="PED-007"
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm"
                value={form.pedido_ref}
                onChange={(e) => setForm({ ...form, pedido_ref: e.target.value })}
              />
            </div>

            {/* Valor de Venda */}
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Valor da Venda (R$)</label>
              <input
                type="text"
                placeholder="192.081,28"
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm"
                value={form.valor_venda}
                onChange={(e) => setForm({ ...form, valor_venda: e.target.value })}
              />
            </div>

            {/* Custo */}
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Custo da Mercadoria (R$)</label>
              <input
                type="text"
                placeholder="101.131,04"
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm"
                value={form.custo_mercadoria}
                onChange={(e) => setForm({ ...form, custo_mercadoria: e.target.value })}
              />
            </div>

            {/* Frete previsto tipo */}
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Frete Previsto — Tipo</label>
              <select
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm"
                value={form.frete_previsto_tipo}
                onChange={(e) =>
                  setForm({ ...form, frete_previsto_tipo: e.target.value as Fretetipo })
                }
              >
                <option value="percentual_venda">% sobre a Venda</option>
                <option value="percentual_custo">% sobre o Custo</option>
                <option value="fixo">Valor Fixo (R$)</option>
              </select>
            </div>

            {/* Frete previsto valor + slider */}
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">
                Frete Previsto —{" "}
                {form.frete_previsto_tipo === "fixo" ? "R$" : "%"}
                <span className="ml-2 text-orange-600 font-bold">{form.frete_previsto_valor}{form.frete_previsto_tipo !== "fixo" ? "%" : ""}</span>
                <span className="ml-2 text-gray-400">= {formatCurrency(preview.frete)}</span>
              </label>
              {form.frete_previsto_tipo === "fixo" ? (
                <input
                  type="text"
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm"
                  value={form.frete_previsto_valor}
                  onChange={(e) => setForm({ ...form, frete_previsto_valor: e.target.value })}
                />
              ) : (
                <input
                  type="range"
                  min={0}
                  max={30}
                  step={0.5}
                  className="w-full accent-orange-500"
                  value={form.frete_previsto_valor}
                  onChange={(e) => setForm({ ...form, frete_previsto_valor: e.target.value })}
                />
              )}
            </div>

            {/* Imposto tipo */}
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Imposto — Tipo</label>
              <select
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm"
                value={form.imposto_tipo}
                onChange={(e) =>
                  setForm({ ...form, imposto_tipo: e.target.value as ImpostoTipo })
                }
              >
                <option value="percentual_venda">% sobre a Venda</option>
                <option value="percentual_custo">% sobre o Custo</option>
                <option value="fixo">Valor Fixo (R$)</option>
              </select>
            </div>

            {/* Imposto valor + slider */}
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">
                Imposto —{" "}
                {form.imposto_tipo === "fixo" ? "R$" : "%"}
                <span className="ml-2 text-blue-600 font-bold">{form.imposto_valor}{form.imposto_tipo !== "fixo" ? "%" : ""}</span>
                <span className="ml-2 text-gray-400">= {formatCurrency(preview.imposto)}</span>
              </label>
              {form.imposto_tipo === "fixo" ? (
                <input
                  type="text"
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm"
                  value={form.imposto_valor}
                  onChange={(e) => setForm({ ...form, imposto_valor: e.target.value })}
                />
              ) : (
                <input
                  type="range"
                  min={0}
                  max={25}
                  step={0.5}
                  className="w-full accent-blue-500"
                  value={form.imposto_valor}
                  onChange={(e) => setForm({ ...form, imposto_valor: e.target.value })}
                />
              )}
            </div>

            {/* Extras */}
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Extras / Outros custos (R$)</label>
              <input
                type="text"
                placeholder="0"
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm"
                value={form.extras}
                onChange={(e) => setForm({ ...form, extras: e.target.value })}
              />
            </div>

            {/* Observações */}
            <div className="md:col-span-3">
              <label className="block text-xs font-medium text-gray-600 mb-1">Observações</label>
              <textarea
                placeholder="Detalhes do pedido, produtos, condições de entrega..."
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm resize-none"
                rows={2}
                value={form.observacoes}
                onChange={(e) => setForm({ ...form, observacoes: e.target.value })}
              />
            </div>
          </div>

          {/* Preview do lucro */}
          <div className="mt-5 p-4 bg-gray-50 rounded-xl border grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <p className="text-xs text-gray-500">Frete Previsto</p>
              <p className="font-bold text-orange-600">{formatCurrency(preview.frete)}</p>
            </div>
            <div>
              <p className="text-xs text-gray-500">Imposto Previsto</p>
              <p className="font-bold text-blue-600">{formatCurrency(preview.imposto)}</p>
            </div>
            <div>
              <p className="text-xs text-gray-500">Lucro Previsto</p>
              <p className={`font-bold text-xl ${preview.lucro >= 0 ? "text-green-600" : "text-red-600"}`}>
                {formatCurrency(preview.lucro)}
              </p>
            </div>
            <div>
              <p className="text-xs text-gray-500">Margem Prevista</p>
              <p className={`font-bold text-xl ${preview.margem >= 15 ? "text-green-600" : preview.margem >= 8 ? "text-yellow-600" : "text-red-600"}`}>
                {preview.margem.toFixed(1)}%
              </p>
            </div>
          </div>

          <div className="mt-4 flex gap-3 justify-end">
            <button
              onClick={() => { setMostrarForm(false); setForm(FORM_INICIAL); }}
              className="px-4 py-2 text-sm text-gray-600 border border-gray-200 rounded-lg hover:bg-gray-50"
            >
              Cancelar
            </button>
            <button
              className="px-6 py-2 text-sm font-medium bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors"
            >
              Salvar Venda
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
            placeholder="Buscar por cliente ou pedido..."
            className="w-full pl-9 pr-4 py-2 text-sm border border-gray-200 rounded-lg bg-white"
            value={busca}
            onChange={(e) => setBusca(e.target.value)}
          />
        </div>
        <div className="flex items-center gap-2">
          <Filter size={16} className="text-gray-400" />
          <select
            className="text-sm border border-gray-200 rounded-lg px-3 py-2 bg-white text-gray-600"
            value={filroStatus}
            onChange={(e) => setFiltroStatus(e.target.value)}
          >
            <option value="todos">Todos os status</option>
            <option value="pendente">Pendente</option>
            <option value="conciliado">Conciliado</option>
            <option value="atencao">Atenção</option>
            <option value="prejuizo_frete">Prejuízo no frete</option>
            <option value="ganho_frete">Ganho no frete</option>
          </select>
        </div>
        <p className="text-sm text-gray-400 self-center">{vendasFiltradas.length} pedido(s)</p>
      </div>

      {/* Tabela */}
      <div className="bg-white rounded-xl border shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                <th
                  className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide cursor-pointer select-none"
                  onClick={() => alternarOrdem("data")}
                >
                  Data <OrdIcon campo="data" />
                </th>
                <th
                  className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide cursor-pointer select-none"
                  onClick={() => alternarOrdem("cliente")}
                >
                  Cliente <OrdIcon campo="cliente" />
                </th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">
                  Pedido
                </th>
                <th
                  className="text-right px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide cursor-pointer select-none"
                  onClick={() => alternarOrdem("valor_venda")}
                >
                  Venda <OrdIcon campo="valor_venda" />
                </th>
                <th className="text-right px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">
                  Frete Prev.
                </th>
                <th className="text-right px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">
                  Frete Real
                </th>
                <th
                  className="text-right px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide cursor-pointer select-none"
                  onClick={() => alternarOrdem("lucro_previsto")}
                >
                  Lucro Prev. <OrdIcon campo="lucro_previsto" />
                </th>
                <th
                  className="text-right px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide cursor-pointer select-none"
                  onClick={() => alternarOrdem("margem_prevista")}
                >
                  Margem <OrdIcon campo="margem_prevista" />
                </th>
                <th className="text-center px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">
                  Status
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {vendasFiltradas.length === 0 ? (
                <tr>
                  <td colSpan={9} className="text-center text-gray-400 py-12 text-sm">
                    Nenhuma venda encontrada.
                  </td>
                </tr>
              ) : (
                vendasFiltradas.map((v) => (
                  <tr
                    key={v.id}
                    className={`hover:bg-gray-50 cursor-pointer transition-colors ${
                      vendaSelecionada?.id === v.id ? "bg-green-50" : ""
                    }`}
                    onClick={() =>
                      setVendaSelecionada(vendaSelecionada?.id === v.id ? null : v)
                    }
                  >
                    <td className="px-4 py-3 text-gray-600">{formatDate(v.data)}</td>
                    <td className="px-4 py-3 font-medium text-gray-900 max-w-[200px] truncate">
                      {v.cliente}
                    </td>
                    <td className="px-4 py-3 text-gray-500">{v.pedido_ref}</td>
                    <td className="px-4 py-3 text-right font-semibold text-gray-900">
                      {formatCurrency(v.valor_venda)}
                    </td>
                    <td className="px-4 py-3 text-right text-orange-600">
                      {formatCurrency(v.frete_previsto_calculado)}
                    </td>
                    <td className="px-4 py-3 text-right">
                      {v.frete_real ? (
                        <span
                          className={
                            v.frete_real.valor_frete_real > v.frete_previsto_calculado
                              ? "text-red-600 font-medium"
                              : "text-green-600 font-medium"
                          }
                        >
                          {formatCurrency(v.frete_real.valor_frete_real)}
                        </span>
                      ) : (
                        <span className="text-gray-300">—</span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <span className={v.lucro_previsto >= 0 ? "text-green-700 font-bold" : "text-red-600 font-bold"}>
                        {formatCurrency(v.lucro_previsto)}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <span
                        className={
                          v.margem_prevista >= 15
                            ? "text-green-600 font-medium"
                            : v.margem_prevista >= 8
                            ? "text-yellow-600 font-medium"
                            : "text-red-600 font-medium"
                        }
                      >
                        {v.margem_prevista.toFixed(1)}%
                      </span>
                    </td>
                    <td className="px-4 py-3 text-center">
                      <StatusBadge status={v.status_frete} />
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Detalhe da venda selecionada */}
      {vendaSelecionada && (
        <div className="bg-white rounded-xl border shadow-sm p-6">
          <h3 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
            <ShoppingBag size={16} className="text-green-600" />
            Detalhes — {vendaSelecionada.cliente}
          </h3>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div>
              <p className="text-xs text-gray-400 mb-1">Valor da Venda</p>
              <p className="font-bold text-gray-900 text-lg">{formatCurrency(vendaSelecionada.valor_venda)}</p>
            </div>
            <div>
              <p className="text-xs text-gray-400 mb-1">Custo da Mercadoria</p>
              <p className="font-bold text-gray-900">{formatCurrency(vendaSelecionada.custo_mercadoria)}</p>
            </div>
            <div>
              <p className="text-xs text-gray-400 mb-1">Frete Previsto</p>
              <p className="font-bold text-orange-600">
                {formatCurrency(vendaSelecionada.frete_previsto_calculado)}
                <span className="text-xs text-gray-400 ml-1">
                  ({vendaSelecionada.frete_previsto_tipo === "fixo" ? "fixo" : `${vendaSelecionada.frete_previsto_valor}%`})
                </span>
              </p>
            </div>
            <div>
              <p className="text-xs text-gray-400 mb-1">Imposto</p>
              <p className="font-bold text-blue-600">
                {formatCurrency(vendaSelecionada.imposto_calculado)}
                <span className="text-xs text-gray-400 ml-1">
                  ({vendaSelecionada.imposto_tipo === "fixo" ? "fixo" : `${vendaSelecionada.imposto_valor}%`})
                </span>
              </p>
            </div>
            <div>
              <p className="text-xs text-gray-400 mb-1">Lucro Previsto</p>
              <p className="font-bold text-green-700 text-lg">{formatCurrency(vendaSelecionada.lucro_previsto)}</p>
            </div>
            <div>
              <p className="text-xs text-gray-400 mb-1">Lucro Real</p>
              <p className="font-bold text-emerald-600 text-lg">
                {vendaSelecionada.lucro_real != null ? formatCurrency(vendaSelecionada.lucro_real) : "Aguardando frete real"}
              </p>
            </div>
            <div>
              <p className="text-xs text-gray-400 mb-1">Margem Prevista</p>
              <p className="font-bold text-gray-800">{vendaSelecionada.margem_prevista.toFixed(1)}%</p>
            </div>
            <div>
              <p className="text-xs text-gray-400 mb-1">Margem Real</p>
              <p className="font-bold text-gray-800">
                {vendaSelecionada.margem_real != null ? `${vendaSelecionada.margem_real.toFixed(1)}%` : "—"}
              </p>
            </div>
          </div>

          {vendaSelecionada.observacoes && (
            <div className="mt-4 p-3 bg-gray-50 rounded-lg">
              <p className="text-xs text-gray-500 font-medium mb-1">Observações</p>
              <p className="text-sm text-gray-700">{vendaSelecionada.observacoes}</p>
            </div>
          )}

          {vendaSelecionada.frete_real && (
            <div className="mt-4 p-3 bg-orange-50 rounded-lg border border-orange-100">
              <p className="text-xs font-medium text-orange-700 mb-2 flex items-center gap-1">
                <Truck size={12} /> Frete Real Registrado
              </p>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                <div>
                  <p className="text-xs text-gray-400">Transportadora</p>
                  <p className="font-medium">{vendaSelecionada.frete_real.transportadora}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-400">Valor Real</p>
                  <p className="font-bold">{formatCurrency(vendaSelecionada.frete_real.valor_frete_real)}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-400">Diferença</p>
                  <p className={`font-bold ${(vendaSelecionada.diferenca_frete ?? 0) <= 0 ? "text-green-600" : "text-red-600"}`}>
                    {vendaSelecionada.diferenca_frete != null
                      ? `${(vendaSelecionada.diferenca_frete ?? 0) <= 0 ? "-" : "+"} ${formatCurrency(Math.abs(vendaSelecionada.diferenca_frete))}`
                      : "—"}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-400">Data de cobrança</p>
                  <p className="font-medium">{formatDate(vendaSelecionada.frete_real.data_cobranca)}</p>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
