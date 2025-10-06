import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { AlertCircle, Clock, Wrench, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

interface Alert {
  id: string;
  type: "fitness" | "cleaning" | "jobcard" | "branding";
  severity: "critical" | "warning" | "info";
  trainsetNumber: string;
  message: string;
  timestamp: string;
}

interface AlertsPanelProps {
  alerts: Alert[];
  onAlertClick?: (alert: Alert) => void;
}

export function AlertsPanel({ alerts, onAlertClick }: AlertsPanelProps) {
  const getAlertIcon = (type: Alert["type"]) => {
    switch (type) {
      case "fitness":
        return <Clock className="h-4 w-4" />;
      case "jobcard":
        return <Wrench className="h-4 w-4" />;
      case "branding":
        return <Sparkles className="h-4 w-4" />;
      default:
        return <AlertCircle className="h-4 w-4" />;
    }
  };

  const getSeverityColor = (severity: Alert["severity"]) => {
    switch (severity) {
      case "critical":
        return "text-status-critical border-status-critical/30 bg-status-critical-bg/50";
      case "warning":
        return "text-status-warning border-status-warning/30 bg-status-warning-bg/50";
      case "info":
        return "text-primary border-primary/30 bg-primary/10";
    }
  };

  const sortedAlerts = [...alerts].sort((a, b) => {
    const severityOrder = { critical: 0, warning: 1, info: 2 };
    return severityOrder[a.severity] - severityOrder[b.severity];
  });

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-lg flex items-center gap-2">
          <AlertCircle className="h-5 w-5 text-status-warning" />
          Alerts & Notifications
          {alerts.length > 0 && (
            <Badge variant="outline" className="ml-auto">
              {alerts.length}
            </Badge>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[500px] pr-4">
          <div className="space-y-2">
            {sortedAlerts.map((alert) => (
              <div
                key={alert.id}
                className={cn(
                  "p-3 rounded-lg border cursor-pointer transition-all hover:shadow-md",
                  getSeverityColor(alert.severity),
                  alert.severity === "critical" && "animate-pulse"
                )}
                onClick={() => onAlertClick?.(alert)}
              >
                <div className="flex items-start gap-2">
                  {getAlertIcon(alert.type)}
                  <div className="flex-1 space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-sm">Train {alert.trainsetNumber}</span>
                      <span className="text-xs text-muted-foreground">{alert.timestamp}</span>
                    </div>
                    <p className="text-sm">{alert.message}</p>
                  </div>
                </div>
              </div>
            ))}
            {alerts.length === 0 && (
              <div className="text-center py-8 text-muted-foreground">
                <AlertCircle className="h-8 w-8 mx-auto mb-2 opacity-50" />
                <p className="text-sm">No active alerts</p>
              </div>
            )}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
