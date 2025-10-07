import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";
import { cn } from "@/lib/utils";

interface ResultMetric {
  label: string;
  value: string;
  change: number;
  unit: string;
}

interface SimulationResultsPanelProps {
  metrics: ResultMetric[];
}

export function SimulationResultsPanel({ metrics }: SimulationResultsPanelProps) {
  const getTrendIcon = (change: number) => {
    if (change > 0) return <TrendingUp className="h-4 w-4" />;
    if (change < 0) return <TrendingDown className="h-4 w-4" />;
    return <Minus className="h-4 w-4" />;
  };

  const getTrendColor = (change: number, label: string) => {
    // For some metrics, positive is good, for others negative is good
    const isGoodMetric = ["Fleet Availability", "Branding SLA Compliance", "Energy Savings"].includes(label);
    
    if (change > 0) {
      return isGoodMetric ? "text-status-ready" : "text-status-critical";
    }
    if (change < 0) {
      return isGoodMetric ? "text-status-critical" : "text-status-ready";
    }
    return "text-muted-foreground";
  };

  return (
    <Card className="h-full animate-fade-in">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg">Predicted Outcomes</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {metrics.map((metric, index) => (
          <div
            key={index}
            className="p-4 rounded-lg border bg-card hover:shadow-md transition-all"
          >
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">{metric.label}</p>
              <div className="flex items-baseline justify-between">
                <span className="text-2xl font-bold">{metric.value}</span>
                <div
                  className={cn(
                    "flex items-center gap-1 text-sm font-medium",
                    getTrendColor(metric.change, metric.label)
                  )}
                >
                  {getTrendIcon(metric.change)}
                  <span>
                    {Math.abs(metric.change)}
                    {metric.unit}
                  </span>
                </div>
              </div>
              <div className="h-1 bg-muted rounded-full overflow-hidden">
                <div
                  className={cn(
                    "h-full transition-all duration-500",
                    metric.change > 0 ? "bg-status-ready" : metric.change < 0 ? "bg-status-critical" : "bg-muted-foreground"
                  )}
                  style={{
                    width: `${Math.min(Math.abs(metric.change) * 10, 100)}%`,
                  }}
                />
              </div>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
