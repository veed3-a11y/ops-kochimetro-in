import { X, AlertTriangle, CheckCircle, TrendingUp, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";

interface Alert {
  id: string;
  type: "warning" | "success" | "info";
  title: string;
  message: string;
  time: string;
}

const mockAlerts: Alert[] = [
  {
    id: "1",
    type: "warning",
    title: "Fitness Certificate Expiring",
    message: "Fitness certificate expiring tomorrow – Trainset #KM07",
    time: "2 min ago",
  },
  {
    id: "2",
    type: "success",
    title: "Branding Target Met",
    message: "Branding exposure target met – Pepsi Wrap",
    time: "15 min ago",
  },
  {
    id: "3",
    type: "info",
    title: "Simulation Available",
    message: "Simulation available: 10% mileage improvement predicted",
    time: "1 hour ago",
  },
  {
    id: "4",
    type: "warning",
    title: "Critical Job Card",
    message: "3 critical job cards pending for Trainset #KM12",
    time: "2 hours ago",
  },
  {
    id: "5",
    type: "info",
    title: "Maintenance Window",
    message: "Scheduled maintenance window opens in 4 hours",
    time: "3 hours ago",
  },
];

interface SmartAlertsPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

export function SmartAlertsPanel({ isOpen, onClose }: SmartAlertsPanelProps) {
  if (!isOpen) return null;

  const getIcon = (type: Alert["type"]) => {
    switch (type) {
      case "warning":
        return <AlertTriangle className="h-5 w-5 text-status-warning" />;
      case "success":
        return <CheckCircle className="h-5 w-5 text-status-ready" />;
      case "info":
        return <TrendingUp className="h-5 w-5 text-primary" />;
    }
  };

  return (
    <div className="fixed right-0 top-16 h-[calc(100vh-4rem)] w-80 bg-background border-l shadow-lg z-40 animate-slide-in-right">
      <div className="flex items-center justify-between p-4 border-b">
        <h3 className="font-semibold text-foreground">Smart Alerts</h3>
        <Button variant="ghost" size="icon" onClick={onClose}>
          <X className="h-4 w-4" />
        </Button>
      </div>

      <ScrollArea className="h-[calc(100vh-8rem)]">
        <div className="p-4 space-y-3">
          {mockAlerts.map((alert) => (
            <Card key={alert.id} className="p-3 hover:bg-accent/50 transition-colors cursor-pointer">
              <div className="flex gap-3">
                <div className="flex-shrink-0 mt-1">{getIcon(alert.type)}</div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <h4 className="text-sm font-medium text-foreground line-clamp-1">
                      {alert.title}
                    </h4>
                    <span className="text-xs text-muted-foreground whitespace-nowrap">
                      {alert.time}
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                    {alert.message}
                  </p>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </ScrollArea>

      <div className="absolute bottom-0 left-0 right-0 p-4 border-t bg-background">
        <Button variant="outline" className="w-full" size="sm">
          <Calendar className="mr-2 h-4 w-4" />
          View All Notifications
        </Button>
      </div>
    </div>
  );
}
