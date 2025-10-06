import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, XCircle, AlertTriangle, Sparkles } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";

interface ReasoningPanelProps {
  isOpen: boolean;
  onClose: () => void;
  trainset: {
    number: string;
    id: string;
    rank: number;
    confidenceScore: number;
    reasoning: string[];
    fitnessStatus: string;
    fitnessExpiry: string;
    jobCards: {
      open: number;
      critical: number;
    };
    mileage: number;
    branding: {
      type: string;
      expiryDays: number;
    } | null;
    cleaning: {
      status: string;
    };
  } | null;
}

export function ReasoningPanel({ isOpen, onClose, trainset }: ReasoningPanelProps) {
  if (!trainset) return null;

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent className="w-full sm:max-w-xl">
        <SheetHeader>
          <SheetTitle className="flex items-center gap-2">
            Decision Reasoning
            <Badge variant="outline" className="ml-2">
              Rank #{trainset.rank}
            </Badge>
          </SheetTitle>
          <SheetDescription>
            Train {trainset.number} • {trainset.id}
          </SheetDescription>
        </SheetHeader>

        <ScrollArea className="h-[calc(100vh-120px)] mt-6 pr-4">
          <div className="space-y-6">
            {/* Confidence Score */}
            <div className="space-y-2">
              <h4 className="font-semibold flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-primary" />
                Overall Confidence
              </h4>
              <div className="flex items-center gap-2">
                <div className="text-3xl font-bold text-primary">{trainset.confidenceScore}%</div>
                <p className="text-sm text-muted-foreground">Recommendation reliability</p>
              </div>
            </div>

            <Separator />

            {/* Rules Triggered */}
            <div className="space-y-3">
              <h4 className="font-semibold flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-primary" />
                Rules Triggered
              </h4>
              <ul className="space-y-2">
                {trainset.reasoning.map((reason, idx) => (
                  <li key={idx} className="flex items-start gap-2 text-sm">
                    <CheckCircle className="h-4 w-4 text-status-ready mt-0.5 flex-shrink-0" />
                    <span>{reason}</span>
                  </li>
                ))}
              </ul>
            </div>

            <Separator />

            {/* Fitness Status */}
            <div className="space-y-2">
              <h4 className="font-semibold">Fitness Certificate</h4>
              <div className="space-y-1">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Status:</span>
                  <Badge
                    variant="outline"
                    className={
                      trainset.fitnessStatus === "valid"
                        ? "border-status-ready/30 text-status-ready"
                        : trainset.fitnessStatus === "expiring"
                        ? "border-status-warning/30 text-status-warning"
                        : "border-status-critical/30 text-status-critical"
                    }
                  >
                    {trainset.fitnessStatus}
                  </Badge>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Expiry Date:</span>
                  <span className="font-medium">
                    {new Date(trainset.fitnessExpiry).toLocaleDateString('en-IN')}
                  </span>
                </div>
              </div>
            </div>

            <Separator />

            {/* Job Cards */}
            <div className="space-y-2">
              <h4 className="font-semibold">Job Cards</h4>
              <div className="grid grid-cols-2 gap-2">
                <div className="p-3 rounded-lg border bg-card">
                  <div className="text-2xl font-bold">{trainset.jobCards.open}</div>
                  <p className="text-xs text-muted-foreground">Open</p>
                </div>
                <div className="p-3 rounded-lg border bg-card">
                  <div className={`text-2xl font-bold ${trainset.jobCards.critical > 0 ? 'text-status-critical' : ''}`}>
                    {trainset.jobCards.critical}
                  </div>
                  <p className="text-xs text-muted-foreground">Critical</p>
                </div>
              </div>
            </div>

            <Separator />

            {/* Mileage */}
            <div className="space-y-2">
              <h4 className="font-semibold">Mileage Distribution</h4>
              <div className="p-3 rounded-lg border bg-card">
                <div className="text-2xl font-bold">{trainset.mileage.toLocaleString()} km</div>
                <p className="text-xs text-muted-foreground">Since last maintenance</p>
                {trainset.mileage < 45000 && (
                  <p className="text-xs text-status-ready mt-2">✓ Below average wear threshold</p>
                )}
              </div>
            </div>

            <Separator />

            {/* Branding */}
            <div className="space-y-2">
              <h4 className="font-semibold">Branding Compliance</h4>
              {trainset.branding ? (
                <div className="p-3 rounded-lg border bg-card space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-medium">{trainset.branding.type}</span>
                    <Badge variant="outline" className="text-xs">
                      {trainset.branding.expiryDays}d left
                    </Badge>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Prioritized for exposure to meet SLA requirements
                  </p>
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">No active branding</p>
              )}
            </div>

            <Separator />

            {/* Cleaning Status */}
            <div className="space-y-2">
              <h4 className="font-semibold">Cleaning & Bay Readiness</h4>
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Status:</span>
                <Badge
                  variant="outline"
                  className={
                    trainset.cleaning.status === "completed"
                      ? "border-status-ready/30 text-status-ready capitalize"
                      : "border-status-warning/30 text-status-warning capitalize"
                  }
                >
                  {trainset.cleaning.status}
                </Badge>
              </div>
            </div>

            <Separator />

            {/* Exclusion Factors */}
            <div className="space-y-2 p-4 rounded-lg bg-muted/50">
              <h4 className="font-semibold text-sm">Exclusion Factors (None Applied)</h4>
              <ul className="space-y-1 text-xs text-muted-foreground">
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-3 w-3 text-status-ready" />
                  Fitness certificate valid
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-3 w-3 text-status-ready" />
                  No critical job cards blocking
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-3 w-3 text-status-ready" />
                  Cleaning procedures completed
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-3 w-3 text-status-ready" />
                  Not in maintenance workshop
                </li>
              </ul>
            </div>
          </div>
        </ScrollArea>
      </SheetContent>
    </Sheet>
  );
}
