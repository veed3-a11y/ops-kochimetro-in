import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { RakeReadiness } from "./ReadinessGrid";
import { Trainset } from "@/types/trainset";
import { CheckCircle, XCircle, AlertTriangle, FileText, Wrench, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

interface RakeDetailModalProps {
  rake: RakeReadiness | null;
  trainsetData: Trainset | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function RakeDetailModal({ rake, trainsetData, open, onOpenChange }: RakeDetailModalProps) {
  if (!rake || !trainsetData) return null;

  const getFitnessIcon = (status: string) => {
    switch (status) {
      case "valid":
        return <CheckCircle className="h-4 w-4 text-status-ready" />;
      case "expiring":
        return <AlertTriangle className="h-4 w-4 text-status-warning" />;
      case "expired":
        return <XCircle className="h-4 w-4 text-status-critical" />;
      default:
        return null;
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl">Rake {rake.rakeId}</DialogTitle>
          <DialogDescription>
            Detailed operational and technical information
          </DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="fitness">Fitness & Job Cards</TabsTrigger>
            <TabsTrigger value="operations">Operations</TabsTrigger>
            <TabsTrigger value="alerts">Alerts</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm">Status</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Planned:</span>
                      <Badge variant="outline">{rake.plannedStatus.toUpperCase()}</Badge>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Actual:</span>
                      <Badge variant="outline">{rake.actualStatus.toUpperCase()}</Badge>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Overall:</span>
                      <Badge variant="outline" className={cn(
                        trainsetData.status === "ready" && "bg-status-ready-bg text-status-ready border-status-ready/20"
                      )}>
                        {trainsetData.status.toUpperCase()}
                      </Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm">Location</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Depot:</span>
                      <span className="text-sm font-medium">{rake.depot}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Bay:</span>
                      <span className="text-sm font-medium">{trainsetData.cleaning.bay}</span>
                    </div>
                    {trainsetData.location && (
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">Location:</span>
                        <span className="text-sm font-medium">{trainsetData.location}</span>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm">Quick Stats</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">Mileage</p>
                    <p className="text-lg font-bold">{trainsetData.mileage.toLocaleString()} km</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">Time to Departure</p>
                    <p className="text-lg font-bold">
                      {rake.timeToDeparture < 0 ? "Departed" : `${rake.timeToDeparture}m`}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">Last Service</p>
                    <p className="text-lg font-bold">{trainsetData.lastService}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="fitness" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-sm flex items-center gap-2">
                  <FileText className="h-4 w-4" />
                  Fitness Certificate
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Status:</span>
                  <div className="flex items-center gap-2">
                    {getFitnessIcon(trainsetData.fitnessStatus)}
                    <span className="text-sm font-medium capitalize">{trainsetData.fitnessStatus}</span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Expiry Date:</span>
                  <span className="text-sm font-medium">{trainsetData.fitnessExpiry}</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-sm flex items-center gap-2">
                  <Wrench className="h-4 w-4" />
                  Job Cards
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-3 bg-status-critical-bg/20 rounded-lg border border-status-critical/30">
                    <p className="text-xs text-muted-foreground mb-1">Critical</p>
                    <p className="text-2xl font-bold text-status-critical">{trainsetData.jobCards.critical}</p>
                  </div>
                  <div className="p-3 bg-muted/50 rounded-lg border">
                    <p className="text-xs text-muted-foreground mb-1">Open</p>
                    <p className="text-2xl font-bold">{trainsetData.jobCards.open}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="operations" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-sm flex items-center gap-2">
                  <Sparkles className="h-4 w-4" />
                  Cleaning Status
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Status:</span>
                    <Badge variant="outline" className={cn(
                      trainsetData.cleaning.status === "completed" && "bg-status-ready-bg text-status-ready border-status-ready/20"
                    )}>
                      {trainsetData.cleaning.status.toUpperCase()}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Bay:</span>
                    <span className="text-sm font-medium">{trainsetData.cleaning.bay}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {trainsetData.branding && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm">Branding</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Type:</span>
                      <span className="text-sm font-medium">{trainsetData.branding.type}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Expires in:</span>
                      <span className="text-sm font-medium">{trainsetData.branding.expiryDays} days</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="alerts" className="space-y-4">
            {rake.alerts.length > 0 ? (
              <div className="space-y-3">
                {rake.alerts.map((alert, idx) => (
                  <Card key={idx} className="border-status-warning/30 bg-status-warning-bg/20">
                    <CardContent className="pt-4">
                      <div className="flex items-start gap-3">
                        <AlertTriangle className="h-5 w-5 text-status-warning mt-0.5" />
                        <p className="text-sm">{alert}</p>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <Card>
                <CardContent className="pt-6 pb-6 text-center">
                  <CheckCircle className="h-8 w-8 text-status-ready mx-auto mb-2" />
                  <p className="text-sm text-muted-foreground">No active alerts</p>
                </CardContent>
              </Card>
            )}
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
