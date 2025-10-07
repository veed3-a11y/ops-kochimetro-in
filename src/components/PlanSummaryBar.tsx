import { KPICard } from "@/components/KPICard";
import { Train, Clock, AlertTriangle, TrendingUp } from "lucide-react";

interface PlanSummaryBarProps {
  activeRakes: number;
  standby: number;
  ibl: number;
  deviations: number;
  onTimeReadiness: number;
}

export function PlanSummaryBar({
  activeRakes,
  standby,
  ibl,
  deviations,
  onTimeReadiness,
}: PlanSummaryBarProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-5 gap-4 animate-fade-in">
      <KPICard
        title="Active Rakes"
        value={activeRakes}
        icon={Train}
        variant="success"
      />
      <KPICard
        title="Standby"
        value={standby}
        icon={Clock}
        variant="default"
      />
      <KPICard
        title="IBL (In Bay for Loading)"
        value={ibl}
        icon={Train}
        variant="default"
      />
      <KPICard
        title="Deviations"
        value={deviations}
        icon={AlertTriangle}
        variant={deviations > 0 ? "warning" : "success"}
      />
      <KPICard
        title="On-Time Readiness"
        value={`${onTimeReadiness}%`}
        icon={TrendingUp}
        variant="success"
      />
    </div>
  );
}
