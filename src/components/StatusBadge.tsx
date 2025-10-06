import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

export type Status = "ready" | "warning" | "critical" | "inactive" | "maintenance";

interface StatusBadgeProps {
  status: Status;
  label?: string;
  className?: string;
}

const statusConfig = {
  ready: {
    className: "bg-status-ready-bg text-status-ready border-status-ready/20",
    defaultLabel: "Ready",
  },
  warning: {
    className: "bg-status-warning-bg text-status-warning border-status-warning/20",
    defaultLabel: "Attention",
  },
  critical: {
    className: "bg-status-critical-bg text-status-critical border-status-critical/20",
    defaultLabel: "Critical",
  },
  inactive: {
    className: "bg-status-inactive-bg text-status-inactive border-status-inactive/20",
    defaultLabel: "Inactive",
  },
  maintenance: {
    className: "bg-status-warning-bg text-status-warning border-status-warning/20",
    defaultLabel: "Maintenance",
  },
};

export function StatusBadge({ status, label, className }: StatusBadgeProps) {
  const config = statusConfig[status];
  
  return (
    <Badge 
      variant="outline" 
      className={cn(config.className, "font-medium", className)}
    >
      {label || config.defaultLabel}
    </Badge>
  );
}
