import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { AlertTriangle, AlertCircle, Info } from "lucide-react";

export interface Exception {
  id: string;
  rakeId: string;
  message: string;
  severity: "critical" | "warning" | "info";
  timestamp: string;
  acknowledged: boolean;
}

interface ExceptionFeedProps {
  exceptions: Exception[];
  onAcknowledge: (id: string) => void;
}

export function ExceptionFeed({ exceptions, onAcknowledge }: ExceptionFeedProps) {
  const getSeverityConfig = (severity: string) => {
    const configs = {
      critical: {
        icon: AlertTriangle,
        className: "text-status-critical",
        bgClassName: "bg-status-critical-bg/20 border-status-critical/30",
        badgeClassName: "bg-status-critical-bg text-status-critical border-status-critical/20",
      },
      warning: {
        icon: AlertCircle,
        className: "text-status-warning",
        bgClassName: "bg-status-warning-bg/20 border-status-warning/30",
        badgeClassName: "bg-status-warning-bg text-status-warning border-status-warning/20",
      },
      info: {
        icon: Info,
        className: "text-primary",
        bgClassName: "bg-muted/50 border-border",
        badgeClassName: "bg-muted text-foreground border-border",
      },
    };
    return configs[severity as keyof typeof configs];
  };

  const sortedExceptions = [...exceptions].sort((a, b) => {
    const severityOrder = { critical: 0, warning: 1, info: 2 };
    if (a.acknowledged !== b.acknowledged) return a.acknowledged ? 1 : -1;
    return severityOrder[a.severity] - severityOrder[b.severity];
  });

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle className="text-lg">Exception Feed</CardTitle>
        <p className="text-sm text-muted-foreground">
          {exceptions.filter(e => !e.acknowledged).length} unacknowledged alerts
        </p>
      </CardHeader>
      <CardContent className="p-0">
        <ScrollArea className="h-[600px] px-6">
          <div className="space-y-3 pb-4">
            {sortedExceptions.map((exception) => {
              const config = getSeverityConfig(exception.severity);
              const Icon = config.icon;
              
              return (
                <div
                  key={exception.id}
                  className={cn(
                    "p-3 rounded-lg border transition-all",
                    config.bgClassName,
                    exception.acknowledged && "opacity-50"
                  )}
                >
                  <div className="flex items-start gap-3">
                    <Checkbox
                      checked={exception.acknowledged}
                      onCheckedChange={() => onAcknowledge(exception.id)}
                      className="mt-1"
                    />
                    <div className="flex-1 space-y-2">
                      <div className="flex items-center gap-2">
                        <Icon className={cn("h-4 w-4", config.className)} />
                        <Badge variant="outline" className={cn("text-xs", config.badgeClassName)}>
                          {exception.severity.toUpperCase()}
                        </Badge>
                        <span className="text-xs text-muted-foreground">{exception.timestamp}</span>
                      </div>
                      <div>
                        <span className="font-semibold text-sm">{exception.rakeId}:</span>
                        <span className="text-sm ml-1">{exception.message}</span>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
            {sortedExceptions.length === 0 && (
              <div className="text-center py-8 text-muted-foreground">
                <Info className="h-8 w-8 mx-auto mb-2 opacity-50" />
                <p>No exceptions to display</p>
              </div>
            )}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
