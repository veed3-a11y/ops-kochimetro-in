import { Card, CardContent } from "@/components/ui/card";
import { CheckCircle, AlertTriangle, XCircle, Clock } from "lucide-react";

interface ValidationSummaryProps {
  validatedCount: number;
  warningsCount: number;
  conflictsCount: number;
  pendingOverridesCount: number;
}

export function ValidationSummary({
  validatedCount,
  warningsCount,
  conflictsCount,
  pendingOverridesCount,
}: ValidationSummaryProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 animate-fade-in">
      <Card className="border-2 border-status-ready/30 bg-status-ready-bg/20">
        <CardContent className="pt-6">
          <div className="flex items-center gap-3">
            <CheckCircle className="h-8 w-8 text-status-ready animate-pulse" />
            <div>
              <div className="text-3xl font-bold text-status-ready">{validatedCount}</div>
              <p className="text-sm text-muted-foreground">Validated Rakes</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="border-2 border-status-warning/30 bg-status-warning-bg/20">
        <CardContent className="pt-6">
          <div className="flex items-center gap-3">
            <AlertTriangle className="h-8 w-8 text-status-warning" />
            <div>
              <div className="text-3xl font-bold text-status-warning">{warningsCount}</div>
              <p className="text-sm text-muted-foreground">Warnings</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="border-2 border-status-critical/30 bg-status-critical-bg/20">
        <CardContent className="pt-6">
          <div className="flex items-center gap-3">
            <XCircle className="h-8 w-8 text-status-critical animate-pulse" />
            <div>
              <div className="text-3xl font-bold text-status-critical">{conflictsCount}</div>
              <p className="text-sm text-muted-foreground">Critical Conflicts</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="border-2">
        <CardContent className="pt-6">
          <div className="flex items-center gap-3">
            <Clock className="h-8 w-8 text-primary" />
            <div>
              <div className="text-3xl font-bold">{pendingOverridesCount}</div>
              <p className="text-sm text-muted-foreground">Pending Overrides</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
