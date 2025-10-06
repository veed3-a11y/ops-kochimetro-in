import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { mockTrainsets } from "@/data/mockTrainsets";
import { Trainset } from "@/types/trainset";
import { RecommendationOverview } from "@/components/RecommendationOverview";
import { RankedTable, RecommendationStatus } from "@/components/RankedTable";
import { ReasoningPanel } from "@/components/ReasoningPanel";
import { ValidationBanner } from "@/components/ValidationBanner";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ArrowLeft, CheckCircle, Send } from "lucide-react";
import { toast } from "sonner";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface RankedTrainsetType extends Trainset {
  rank: number;
  recommendedStatus: RecommendationStatus;
  confidenceScore: number;
  reasoning: string[];
  override?: {
    status: RecommendationStatus;
    note: string;
  };
}

export default function RecommendationCenter() {
  const navigate = useNavigate();
  const [selectedTrainset, setSelectedTrainset] = useState<RankedTrainsetType | null>(null);
  const [isReasoningOpen, setIsReasoningOpen] = useState(false);
  const [validationWarnings, setValidationWarnings] = useState<
    { id: string; message: string; severity: "warning" | "error" }[]
  >([]);

  // Generate recommendations with ranking logic
  const generateRecommendations = (): RankedTrainsetType[] => {
    const serviceRecommendations = mockTrainsets
      .filter(t => 
        t.status === "ready" && 
        t.fitnessStatus === "valid" && 
        t.jobCards.critical === 0 &&
        t.cleaning.status === "completed"
      )
      .sort((a, b) => a.mileage - b.mileage)
      .slice(0, 18)
      .map((t, index) => ({
        ...t,
        rank: index + 1,
        recommendedStatus: "service" as RecommendationStatus,
        confidenceScore: 95 - index,
        reasoning: getReasoningText(t),
      }));

    const standbyRecommendations = mockTrainsets
      .filter(t => 
        (t.status === "warning" || t.fitnessStatus === "expiring") &&
        t.jobCards.critical === 0
      )
      .slice(0, 4)
      .map((t, index) => ({
        ...t,
        rank: serviceRecommendations.length + index + 1,
        recommendedStatus: "standby" as RecommendationStatus,
        confidenceScore: 75 - index * 5,
        reasoning: [
          "Partial readiness - fitness expiring within 14 days",
          "No critical job cards",
          "Reserve for unexpected demand",
        ],
      }));

    const iblRecommendations = mockTrainsets
      .filter(t => 
        t.status === "critical" || 
        t.status === "maintenance" ||
        t.fitnessStatus === "expired" ||
        t.jobCards.critical > 0
      )
      .slice(0, 3)
      .map((t, index) => ({
        ...t,
        rank: serviceRecommendations.length + standbyRecommendations.length + index + 1,
        recommendedStatus: "ibl" as RecommendationStatus,
        confidenceScore: 20,
        reasoning: [
          "❌ Excluded from service",
          t.fitnessStatus === "expired" ? "Fitness certificate expired" : "",
          t.jobCards.critical > 0 ? `${t.jobCards.critical} critical job cards open` : "",
          t.status === "maintenance" ? "Currently in maintenance" : "",
        ].filter(Boolean),
      }));

    return [...serviceRecommendations, ...standbyRecommendations, ...iblRecommendations];
  };

  const getReasoningText = (trainset: any) => {
    const reasons = [];
    
    if (trainset.fitnessStatus === "valid") {
      reasons.push("✓ Valid fitness certificate");
    }
    if (trainset.jobCards.open === 0) {
      reasons.push("✓ No open job cards");
    } else if (trainset.jobCards.critical === 0) {
      reasons.push("✓ No critical job cards");
    }
    if (trainset.cleaning.status === "completed") {
      reasons.push("✓ Cleaning completed");
    }
    if (trainset.mileage < 45000) {
      reasons.push("✓ Lower mileage for balanced wear");
    }
    if (trainset.branding) {
      reasons.push(`✓ Branding exposure: ${trainset.branding.type}`);
    }
    
    return reasons;
  };

  const [rankedTrainsets, setRankedTrainsets] = useState<RankedTrainsetType[]>(generateRecommendations());

  const recommendedForService = rankedTrainsets.filter(t => 
    (t.override?.status || t.recommendedStatus) === "service"
  ).length;
  
  const standby = rankedTrainsets.filter(t => 
    (t.override?.status || t.recommendedStatus) === "standby"
  ).length;
  
  const ibl = rankedTrainsets.filter(t => 
    (t.override?.status || t.recommendedStatus) === "ibl"
  ).length;

  const handleViewReasoning = (trainset: RankedTrainsetType) => {
    setSelectedTrainset(trainset);
    setIsReasoningOpen(true);
  };

  const handleOverride = (trainsetId: string, status: RecommendationStatus, note: string) => {
    setRankedTrainsets(prev =>
      prev.map(t =>
        t.id === trainsetId
          ? {
              ...t,
              override: status === "no-change" ? undefined : { status, note },
            }
          : t
      )
    );
    
    if (status !== "no-change") {
      toast.info(`Override applied to Train ${rankedTrainsets.find(t => t.id === trainsetId)?.number}`, {
        description: "Manual override logged in audit trail",
      });
    }
  };

  const handleValidate = () => {
    const warnings = [];
    
    // Check for trainsets with expiring fitness
    const expiringFitness = rankedTrainsets.filter(t => 
      t.fitnessStatus === "expiring" && 
      (t.override?.status || t.recommendedStatus) === "service"
    );
    
    if (expiringFitness.length > 0) {
      warnings.push({
        id: "fitness-expiring",
        message: `${expiringFitness.length} trainset(s) with expiring fitness certificates in service list - confirm before publishing`,
        severity: "warning" as const,
      });
    }

    // Check for overrides
    const overrides = rankedTrainsets.filter(t => t.override);
    if (overrides.length > 0) {
      warnings.push({
        id: "overrides",
        message: `${overrides.length} manual override(s) detected - ensure justification is documented`,
        severity: "warning" as const,
      });
    }

    setValidationWarnings(warnings);
    
    if (warnings.length === 0) {
      toast.success("Validation complete", {
        description: "No conflicts detected. Ready to publish.",
      });
    } else {
      toast.warning("Validation warnings found", {
        description: "Review warnings before publishing plan",
      });
    }
  };

  const handlePublish = () => {
    if (validationWarnings.some(w => w.severity === "error")) {
      toast.error("Cannot publish with validation errors", {
        description: "Resolve all errors before publishing",
      });
      return;
    }

    toast.loading("Publishing induction plan...", { duration: 1500 });
    setTimeout(() => {
      toast.success("Induction plan published!", {
        description: `${recommendedForService} trainsets scheduled for tonight's service`,
      });
      // Navigate to final review or back to dashboard
    }, 1500);
  };

  const handleDismissWarning = (id: string) => {
    setValidationWarnings(prev => prev.filter(w => w.id !== id));
  };

  return (
    <TooltipProvider>
      <div className="space-y-6 pb-24">
        {/* Validation Banner */}
        <ValidationBanner warnings={validationWarnings} onDismiss={handleDismissWarning} />

        {/* Header */}
        <div className="flex items-start justify-between">
          <div>
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => navigate("/")} 
              className="mb-2 -ml-2"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Fleet Board
            </Button>
            <h1 className="text-3xl font-bold">Recommendation Center</h1>
            <p className="text-muted-foreground">
              AI-generated induction plan for tonight's service (21:00-23:00 IST)
            </p>
          </div>
        </div>

        {/* Overview Strip */}
        <RecommendationOverview
          totalEvaluated={rankedTrainsets.length}
          recommendedForService={recommendedForService}
          standby={standby}
          ibl={ibl}
          dataFreshness={98}
        />

        {/* Ranked Table */}
        <Card className="p-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-semibold">Ranked Induction List</h2>
                <p className="text-sm text-muted-foreground">
                  AI-optimized ranking based on fitness, mileage, branding, and operational constraints
                </p>
              </div>
            </div>
            <RankedTable
              trainsets={rankedTrainsets}
              onViewReasoning={handleViewReasoning}
              onOverride={handleOverride}
            />
          </div>
        </Card>

        {/* Reasoning Panel */}
        <ReasoningPanel
          isOpen={isReasoningOpen}
          onClose={() => setIsReasoningOpen(false)}
          trainset={selectedTrainset}
        />

        {/* Bottom Sticky Action Bar */}
        <div className="fixed bottom-0 left-0 right-0 z-50 border-t bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
          <div className="container flex items-center justify-between h-16 px-6">
            <div className="flex items-center gap-4">
              <div className="text-sm">
                <span className="font-semibold">{recommendedForService}</span>
                <span className="text-muted-foreground"> trainsets for service</span>
              </div>
              <div className="text-sm">
                <span className="font-semibold">{standby}</span>
                <span className="text-muted-foreground"> on standby</span>
              </div>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" onClick={handleValidate}>
                <CheckCircle className="h-4 w-4 mr-2" />
                Validate Conflicts
              </Button>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button 
                    onClick={handlePublish} 
                    size="lg"
                    className="gap-2 animate-pulse hover:animate-none"
                  >
                    <Send className="h-4 w-4" />
                    Finalize & Publish Plan
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Lock plan and sync to operations dashboard</p>
                </TooltipContent>
              </Tooltip>
            </div>
          </div>
        </div>
      </div>
    </TooltipProvider>
  );
}

