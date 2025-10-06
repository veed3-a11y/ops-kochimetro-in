import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertTriangle, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface ValidationBannerProps {
  warnings: {
    id: string;
    message: string;
    severity: "warning" | "error";
  }[];
  onDismiss?: (id: string) => void;
}

export function ValidationBanner({ warnings, onDismiss }: ValidationBannerProps) {
  if (warnings.length === 0) return null;

  return (
    <div className="space-y-2 animate-fade-in fixed top-16 left-0 right-0 z-40 px-6 pt-2">
      {warnings.map((warning) => (
        <Alert
          key={warning.id}
          variant={warning.severity === "error" ? "destructive" : "default"}
          className={cn(
            "shadow-lg",
            warning.severity === "warning" && "border-status-warning bg-status-warning-bg/90"
          )}
        >
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription className="flex items-center justify-between">
            <span>{warning.message}</span>
            {onDismiss && (
              <Button
                variant="ghost"
                size="sm"
                className="h-6 w-6 p-0"
                onClick={() => onDismiss(warning.id)}
              >
                <X className="h-4 w-4" />
              </Button>
            )}
          </AlertDescription>
        </Alert>
      ))}
    </div>
  );
}
