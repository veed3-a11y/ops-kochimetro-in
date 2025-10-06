import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { CheckCircle, AlertTriangle } from "lucide-react";

interface DataHealthBarProps {
  freshnessPercentage: number;
  staleDataSources?: string[];
}

export function DataHealthBar({ freshnessPercentage, staleDataSources = [] }: DataHealthBarProps) {
  const isHealthy = freshnessPercentage >= 95;
  
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Card className="p-3 cursor-help transition-all hover:shadow-md">
            <div className="flex items-center gap-3">
              {isHealthy ? (
                <CheckCircle className="h-5 w-5 text-status-ready" />
              ) : (
                <AlertTriangle className="h-5 w-5 text-status-warning animate-pulse" />
              )}
              <div className="flex-1 space-y-1">
                <div className="flex items-center justify-between text-sm">
                  <span className="font-medium">Data Health</span>
                  <span className={isHealthy ? "text-status-ready" : "text-status-warning"}>
                    {freshnessPercentage}% Fresh
                  </span>
                </div>
                <Progress value={freshnessPercentage} className="h-2" />
              </div>
            </div>
          </Card>
        </TooltipTrigger>
        <TooltipContent>
          <div className="space-y-1">
            <p className="font-semibold">Data Freshness Status</p>
            {staleDataSources.length > 0 ? (
              <>
                <p className="text-xs text-muted-foreground">
                  {100 - freshnessPercentage}% outdated
                </p>
                <ul className="text-xs space-y-0.5 mt-2">
                  {staleDataSources.map((source, idx) => (
                    <li key={idx}>• {source} pending</li>
                  ))}
                </ul>
              </>
            ) : (
              <p className="text-xs text-muted-foreground">All data sources up to date</p>
            )}
          </div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
