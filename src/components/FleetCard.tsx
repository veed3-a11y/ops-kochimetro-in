import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Trainset } from "@/types/trainset";
import { cn } from "@/lib/utils";
import { CheckCircle, AlertCircle, XCircle, Sparkles } from "lucide-react";

interface FleetCardProps {
  trainset: Trainset;
  onClick?: () => void;
}

export function FleetCard({ trainset, onClick }: FleetCardProps) {
  const getFitnessIcon = () => {
    switch (trainset.fitnessStatus) {
      case "valid":
        return <CheckCircle className="h-4 w-4 text-status-ready" />;
      case "expiring":
        return <AlertCircle className="h-4 w-4 text-status-warning" />;
      case "expired":
        return <XCircle className="h-4 w-4 text-status-critical" />;
    }
  };

  const getStatusColor = () => {
    switch (trainset.status) {
      case "ready":
        return "border-status-ready/30 hover:border-status-ready/50";
      case "warning":
        return "border-status-warning/30 hover:border-status-warning/50";
      case "critical":
      case "maintenance":
        return "border-status-critical/30 hover:border-status-critical/50";
      default:
        return "border-border hover:border-border/70";
    }
  };

  return (
    <Card
      className={cn(
        "p-3 cursor-pointer transition-all hover:shadow-md hover-scale group",
        getStatusColor()
      )}
      onClick={onClick}
    >
      <div className="space-y-2">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div>
            <h3 className="font-bold text-lg">Train {trainset.number}</h3>
            <p className="text-xs text-muted-foreground">{trainset.id}</p>
          </div>
          {getFitnessIcon()}
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-2 text-xs">
          <div>
            <span className="text-muted-foreground">Job Cards:</span>
            <span className={cn("ml-1 font-medium", trainset.jobCards.critical > 0 ? "text-status-critical" : "text-foreground")}>
              {trainset.jobCards.open}
            </span>
          </div>
          <div>
            <span className="text-muted-foreground">Mileage:</span>
            <span className="ml-1 font-medium">{trainset.mileage.toLocaleString()}</span>
          </div>
          <div>
            <span className="text-muted-foreground">Cleaning:</span>
            <span className={cn("ml-1 font-medium capitalize", 
              trainset.cleaning.status === "completed" ? "text-status-ready" : "text-status-warning"
            )}>
              {trainset.cleaning.status === "completed" ? "✓" : "⏳"}
            </span>
          </div>
          <div>
            <span className="text-muted-foreground">Bay:</span>
            <span className="ml-1 font-medium">{trainset.cleaning.bay}</span>
          </div>
        </div>

        {/* Branding Badge */}
        {trainset.branding && (
          <div className="flex items-center gap-1 pt-1">
            <Sparkles className="h-3 w-3 text-primary" />
            <span className="text-xs font-medium text-primary">{trainset.branding.type}</span>
          </div>
        )}
      </div>
    </Card>
  );
}
