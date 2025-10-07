import { KPICard } from "@/components/KPICard";
import { TrendingUp, Gauge, Award, Brain } from "lucide-react";

interface AnalyticsKPITilesProps {
  fleetAvailability: number;
  avgMileageDeviation: number;
  brandingCompliance: number;
  maintenanceAccuracy: number;
}

export function AnalyticsKPITiles({
  fleetAvailability,
  avgMileageDeviation,
  brandingCompliance,
  maintenanceAccuracy,
}: AnalyticsKPITilesProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 animate-fade-in">
      <KPICard
        title="Fleet Availability"
        value={`${fleetAvailability}%`}
        icon={TrendingUp}
        variant={fleetAvailability >= 90 ? "success" : "warning"}
        subtitle="Operational trainsets"
      />
      <KPICard
        title="Avg Mileage Deviation"
        value={`${avgMileageDeviation}%`}
        icon={Gauge}
        variant={avgMileageDeviation <= 15 ? "success" : "warning"}
        subtitle="Balance across fleet"
      />
      <KPICard
        title="Branding Compliance"
        value={`${brandingCompliance}%`}
        icon={Award}
        variant={brandingCompliance >= 85 ? "success" : "warning"}
        subtitle="SLA achievement"
      />
      <KPICard
        title="ML Prediction Accuracy"
        value={`${maintenanceAccuracy}%`}
        icon={Brain}
        variant="success"
        subtitle="Fault prediction rate"
      />
    </div>
  );
}
