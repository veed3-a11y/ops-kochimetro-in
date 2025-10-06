import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { CheckCircle, AlertTriangle, XCircle, Info } from "lucide-react";

interface RecommendationOverviewProps {
  totalEvaluated: number;
  recommendedForService: number;
  standby: number;
  ibl: number; // In Bay for Loading
  dataFreshness: number;
}

export function RecommendationOverview({
  totalEvaluated,
  recommendedForService,
  standby,
  ibl,
  dataFreshness,
}: RecommendationOverviewProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-5 gap-4 animate-fade-in">
      <Card className="p-4 border-2">
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-muted-foreground text-sm">
            <Info className="h-4 w-4" />
            <span>Evaluated</span>
          </div>
          <div className="text-3xl font-bold">{totalEvaluated}</div>
          <p className="text-xs text-muted-foreground">Total trainsets</p>
        </div>
      </Card>

      <Card className="p-4 border-2 border-status-ready/30 bg-status-ready-bg/20">
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-status-ready text-sm">
            <CheckCircle className="h-4 w-4" />
            <span>Service</span>
          </div>
          <div className="text-3xl font-bold text-status-ready">{recommendedForService}</div>
          <p className="text-xs text-muted-foreground">For tonight's induction</p>
        </div>
      </Card>

      <Card className="p-4 border-2 border-status-warning/30 bg-status-warning-bg/20">
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-status-warning text-sm">
            <AlertTriangle className="h-4 w-4" />
            <span>Standby</span>
          </div>
          <div className="text-3xl font-bold text-status-warning">{standby}</div>
          <p className="text-xs text-muted-foreground">Reserve capacity</p>
        </div>
      </Card>

      <Card className="p-4 border-2 border-status-critical/30 bg-status-critical-bg/20">
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-status-critical text-sm">
            <XCircle className="h-4 w-4" />
            <span>IBL</span>
          </div>
          <div className="text-3xl font-bold text-status-critical">{ibl}</div>
          <p className="text-xs text-muted-foreground">Not available</p>
        </div>
      </Card>

      <Card className="p-4 border-2">
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Data Freshness</span>
            <span className="font-medium text-status-ready">{dataFreshness}%</span>
          </div>
          <Progress value={dataFreshness} className="h-2" />
          <p className="text-xs text-muted-foreground">All sources validated</p>
        </div>
      </Card>
    </div>
  );
}
