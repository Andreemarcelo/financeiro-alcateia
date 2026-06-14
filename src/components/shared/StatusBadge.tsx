import { cn } from "@/lib/utils";
import type { StatusFrete } from "@/types";

const CONFIG: Record<StatusFrete, { label: string; className: string }> = {
  pendente:      { label: "⏳ Pendente",       className: "bg-yellow-100 text-yellow-800" },
  conciliado:    { label: "✅ Conciliado",     className: "bg-green-100 text-green-800" },
  atencao:       { label: "⚠️ Atenção",        className: "bg-orange-100 text-orange-800" },
  prejuizo_frete:{ label: "🔴 Prejuízo frete", className: "bg-red-100 text-red-800" },
  ganho_frete:   { label: "💚 Ganho no frete", className: "bg-emerald-100 text-emerald-800" },
};

export default function StatusBadge({ status }: { status: StatusFrete }) {
  const { label, className } = CONFIG[status] ?? CONFIG.pendente;
  return (
    <span className={cn("inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium", className)}>
      {label}
    </span>
  );
}
