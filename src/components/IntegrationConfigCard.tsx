import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { RefreshCw, CheckCircle, AlertCircle, XCircle } from "lucide-react";
import { cn } from "@/lib/utils";

export interface Integration {
  id: string;
  name: string;
  type: string;
  status: "connected" | "warning" | "error";
  lastSync: string;
  errorCount: number;
  apiKeyMasked: string;
}

interface IntegrationConfigCardProps {
  integration: Integration;
  onReconnect: (id: string) => void;
}

export function IntegrationConfigCard({ integration, onReconnect }: IntegrationConfigCardProps) {
  const getStatusIcon = () => {
    switch (integration.status) {
      case "connected":
        return <CheckCircle className="h-5 w-5 text-status-ready" />;
      case "warning":
        return <AlertCircle className="h-5 w-5 text-status-warning" />;
      case "error":
        return <XCircle className="h-5 w-5 text-status-critical" />;
    }
  };

  const getStatusBadge = () => {
    switch (integration.status) {
      case "connected":
        return (
          <Badge variant="outline" className="bg-status-ready-bg text-status-ready border-status-ready/20">
            Connected
          </Badge>
        );
      case "warning":
        return (
          <Badge variant="outline" className="bg-status-warning-bg text-status-warning border-status-warning/20">
            Degraded
          </Badge>
        );
      case "error":
        return (
          <Badge variant="outline" className="bg-status-critical-bg text-status-critical border-status-critical/20">
            Disconnected
          </Badge>
        );
    }
  };

  return (
    <Card className={cn(
      "transition-all hover:shadow-md",
      integration.status === "error" && "border-status-critical/30"
    )}>
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              {getStatusIcon()}
              <CardTitle className="text-lg">{integration.name}</CardTitle>
            </div>
            <CardDescription>{integration.type}</CardDescription>
          </div>
          {getStatusBadge()}
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-muted-foreground">API Key:</span>
            <span className="font-mono text-xs">{integration.apiKeyMasked}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Last Sync:</span>
            <span>{integration.lastSync}</span>
          </div>
          {integration.errorCount > 0 && (
            <div className="flex justify-between text-status-critical">
              <span>Error Count:</span>
              <span className="font-semibold">{integration.errorCount}</span>
            </div>
          )}
        </div>

        <Button
          variant="outline"
          size="sm"
          className="w-full"
          onClick={() => onReconnect(integration.id)}
          disabled={integration.status === "connected"}
        >
          <RefreshCw className="h-4 w-4 mr-2" />
          Reconnect
        </Button>
      </CardContent>
    </Card>
  );
}
