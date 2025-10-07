import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Brain, AlertTriangle, TrendingUp, Info } from "lucide-react";
import { cn } from "@/lib/utils";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

export interface AtRiskRake {
  id: string;
  rakeId: string;
  riskScore: number;
  predictedIssue: string;
  daysToFailure: number;
  confidence: number;
}

interface PredictiveMaintenancePanelProps {
  atRiskRakes: AtRiskRake[];
  lastUpdated: string;
  onDrillDown: (rakeId: string) => void;
}

export function PredictiveMaintenancePanel({ 
  atRiskRakes, 
  lastUpdated,
  onDrillDown 
}: PredictiveMaintenancePanelProps) {
  const getRiskBadge = (score: number) => {
    if (score >= 80) {
      return (
        <Badge variant="outline" className="bg-status-critical-bg text-status-critical border-status-critical/20">
          Critical
        </Badge>
      );
    }
    if (score >= 60) {
      return (
        <Badge variant="outline" className="bg-status-warning-bg text-status-warning border-status-warning/20">
          High
        </Badge>
      );
    }
    return (
      <Badge variant="outline" className="bg-muted text-foreground border-border">
        Medium
      </Badge>
    );
  };

  return (
    <Card className="animate-fade-in h-full">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Brain className="h-5 w-5 text-primary" />
            <CardTitle className="text-lg">Predictive Maintenance</CardTitle>
          </div>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger>
                <Info className="h-4 w-4 text-muted-foreground" />
              </TooltipTrigger>
              <TooltipContent>
                <p className="max-w-xs text-xs">
                  ML model analyzes historical patterns to predict potential failures. 
                  Updates every 6 hours.
                </p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
        <CardDescription>
          ML-predicted at-risk trainsets • Last updated: {lastUpdated}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        {atRiskRakes.length === 0 ? (
          <div className="text-center py-8">
            <TrendingUp className="h-8 w-8 mx-auto mb-2 text-status-ready" />
            <p className="text-sm text-muted-foreground">
              No high-risk trainsets detected
            </p>
          </div>
        ) : (
          <>
            {atRiskRakes.map((rake) => (
              <div
                key={rake.id}
                className={cn(
                  "p-3 rounded-lg border transition-all hover:shadow-md",
                  rake.riskScore >= 80 && "border-status-critical/30 bg-status-critical-bg/10 animate-pulse",
                  rake.riskScore >= 60 && rake.riskScore < 80 && "border-status-warning/30 bg-status-warning-bg/10"
                )}
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-sm">{rake.rakeId}</span>
                    {getRiskBadge(rake.riskScore)}
                  </div>
                  <div className="flex items-center gap-1">
                    {rake.riskScore >= 80 && (
                      <AlertTriangle className="h-4 w-4 text-status-critical" />
                    )}
                    <span className="text-sm font-bold">{rake.riskScore}%</span>
                  </div>
                </div>

                <div className="space-y-1 text-xs text-muted-foreground mb-3">
                  <p>
                    <span className="font-medium">Issue:</span> {rake.predictedIssue}
                  </p>
                  <p>
                    <span className="font-medium">Est. Time:</span> {rake.daysToFailure} days
                  </p>
                  <p>
                    <span className="font-medium">Confidence:</span> {rake.confidence}%
                  </p>
                </div>

                <Button
                  variant="outline"
                  size="sm"
                  className="w-full text-xs"
                  onClick={() => onDrillDown(rake.rakeId)}
                >
                  View Details
                </Button>
              </div>
            ))}
          </>
        )}
      </CardContent>
    </Card>
  );
}
