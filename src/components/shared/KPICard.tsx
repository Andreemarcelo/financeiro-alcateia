import { cn } from "@/lib/utils";
import type { LucideIcon } from "lucide-react";

interface KPICardProps {
  title: string;
  value: string;
  subtitle?: string;
  trend?: number;      // positivo = bom, negativo = ruim
  icon: LucideIcon;
  iconColor?: string;
  highlight?: boolean;
}

export default function KPICard({
  title, value, subtitle, trend, icon: Icon, iconColor = "text-gray-400", highlight = false,
}: KPICardProps) {
  return (
    <div className={cn(
      "bg-white rounded-xl border p-5 flex flex-col gap-3 shadow-sm",
      highlight && "border-green-200 bg-green-50"
    )}>
      <div className="flex items-center justify-between">
        <p className="text-sm text-gray-500 font-medium">{title}</p>
        <div className={cn("p-2 rounded-lg bg-gray-100", highlight && "bg-green-100")}>
          <Icon size={18} className={iconColor} />
        </div>
      </div>
      <div>
        <p className={cn("text-2xl font-bold", highlight ? "text-green-700" : "text-gray-900")}>
          {value}
        </p>
        {subtitle && <p className="text-xs text-gray-400 mt-0.5">{subtitle}</p>}
      </div>
      {trend !== undefined && (
        <p className={cn("text-xs font-medium", trend >= 0 ? "text-green-600" : "text-red-500")}>
          {trend >= 0 ? "▲" : "▼"} {Math.abs(trend).toFixed(1)}% vs mês anterior
        </p>
      )}
    </div>
  );
}
