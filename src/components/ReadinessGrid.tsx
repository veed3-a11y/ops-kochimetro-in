import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { Clock, AlertCircle, CheckCircle, Wrench } from "lucide-react";

export interface RakeReadiness {
  id: string;
  rakeId: string;
  plannedStatus: "service" | "standby" | "ibl";
  actualStatus: "ready" | "delayed" | "in-bay";
  timeToDeparture: number; // minutes
  alerts: string[];
  depot: string;
}

interface ReadinessGridProps {
  rakes: RakeReadiness[];
  onRakeClick: (rake: RakeReadiness) => void;
}

export function ReadinessGrid({ rakes, onRakeClick }: ReadinessGridProps) {
  const getStatusBadge = (status: string) => {
    const configs = {
      ready: { className: "bg-status-ready-bg text-status-ready border-status-ready/20", icon: CheckCircle },
      delayed: { className: "bg-status-warning-bg text-status-warning border-status-warning/20", icon: AlertCircle },
      "in-bay": { className: "bg-muted text-muted-foreground border-border", icon: Wrench },
    };
    const config = configs[status as keyof typeof configs];
    const Icon = config.icon;
    
    return (
      <Badge variant="outline" className={cn("font-medium", config.className)}>
        <Icon className="h-3 w-3 mr-1" />
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </Badge>
    );
  };

  const getPlannedBadge = (status: string) => {
    const labels = {
      service: "Service",
      standby: "Standby",
      ibl: "IBL",
    };
    return (
      <Badge variant="outline" className="font-medium">
        {labels[status as keyof typeof labels]}
      </Badge>
    );
  };

  const formatTimeRemaining = (minutes: number) => {
    if (minutes < 0) return "Departed";
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return hours > 0 ? `${hours}h ${mins}m` : `${mins}m`;
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
      {rakes.map((rake) => (
        <Card
          key={rake.id}
          className={cn(
            "cursor-pointer transition-all hover:shadow-lg hover:scale-[1.02] animate-fade-in",
            rake.actualStatus === "ready" && "border-status-ready/30",
            rake.actualStatus === "delayed" && "border-status-warning/30"
          )}
          onClick={() => onRakeClick(rake)}
        >
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg">{rake.rakeId}</CardTitle>
              {getStatusBadge(rake.actualStatus)}
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Planned:</span>
              {getPlannedBadge(rake.plannedStatus)}
            </div>
            
            <div className="flex items-center gap-2 text-sm">
              <Clock className="h-4 w-4 text-muted-foreground" />
              <span className={cn(
                "font-medium",
                rake.timeToDeparture < 30 && rake.actualStatus !== "ready" && "text-status-warning"
              )}>
                {formatTimeRemaining(rake.timeToDeparture)}
              </span>
              <span className="text-muted-foreground text-xs">to departure</span>
            </div>

            {rake.alerts.length > 0 && (
              <div className="flex items-start gap-2 p-2 bg-status-warning-bg/20 rounded-md border border-status-warning/20">
                <AlertCircle className="h-4 w-4 text-status-warning mt-0.5 flex-shrink-0" />
                <div className="text-xs space-y-1">
                  {rake.alerts.slice(0, 2).map((alert, idx) => (
                    <div key={idx} className="text-status-warning">{alert}</div>
                  ))}
                  {rake.alerts.length > 2 && (
                    <div className="text-muted-foreground">+{rake.alerts.length - 2} more</div>
                  )}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
