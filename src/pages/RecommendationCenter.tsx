import { useState } from "react";
import { mockTrainsets } from "@/data/mockTrainsets";
import { TrainsetCard } from "@/components/TrainsetCard";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, AlertCircle, Info, Download, Send, ArrowLeft } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

export default function RecommendationCenter() {
  const navigate = useNavigate();
  const [selectedTrainsets, setSelectedTrainsets] = useState<string[]>([]);
  
  // Generate recommendations (top 17 trains based on status and fitness)
  const recommendations = mockTrainsets
    .filter(t => 
      t.status === "ready" && 
      t.fitnessStatus === "valid" && 
      t.jobCards.critical === 0 &&
      t.cleaning.status === "completed"
    )
    .sort((a, b) => a.mileage - b.mileage)
    .slice(0, 17)
    .map((t, index) => ({
      ...t,
      recommendationRank: index + 1,
      recommendationScore: 95 - index * 2,
    }));

  const handlePublish = () => {
    toast.success("Induction plan published successfully!", {
      description: `${recommendations.length} trainsets scheduled for service`,
    });
  };

  const handleExport = () => {
    toast.success("Induction plan exported", {
      description: "Downloaded as CSV file",
    });
  };

  const getReasoningText = (trainset: typeof recommendations[0]) => {
    const reasons = [];
    
    if (trainset.fitnessStatus === "valid") {
      reasons.push("✓ Valid fitness certificate");
    }
    if (trainset.jobCards.open === 0) {
      reasons.push("✓ No open job cards");
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

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <Button variant="ghost" size="sm" onClick={() => navigate("/planner")} className="mb-2 -ml-2">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Dashboard
          </Button>
          <h1 className="text-3xl font-bold">Recommendation Center</h1>
          <p className="text-muted-foreground">Automated induction planning for tonight's service (21:00-23:00 IST)</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={handleExport}>
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
          <Button onClick={handlePublish}>
            <Send className="h-4 w-4 mr-2" />
            Publish Plan
          </Button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-status-ready" />
              Recommended for Service
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{recommendations.length}</div>
            <p className="text-xs text-muted-foreground mt-1">Trainsets ready for induction</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <AlertCircle className="h-4 w-4 text-status-warning" />
              Requires Attention
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">
              {mockTrainsets.filter(t => t.status === "warning").length}
            </div>
            <p className="text-xs text-muted-foreground mt-1">May need manual review</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Info className="h-4 w-4 text-primary" />
              Excluded from Service
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">
              {25 - recommendations.length}
            </div>
            <p className="text-xs text-muted-foreground mt-1">Not meeting criteria</p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content - Two Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recommended Trainsets */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Recommended Induction List</CardTitle>
              <CardDescription>
                Ranked by fitness, mileage balance, and operational constraints
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[600px] pr-4">
                <div className="space-y-4">
                  {recommendations.map((trainset) => (
                    <TrainsetCard key={trainset.id} trainset={trainset} />
                  ))}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </div>

        {/* Reasoning Panel */}
        <div className="lg:col-span-1">
          <Card className="sticky top-6">
            <CardHeader>
              <CardTitle className="text-lg">Decision Reasoning</CardTitle>
              <CardDescription>Why these trainsets were selected</CardDescription>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[600px]">
                <div className="space-y-4">
                  {recommendations.slice(0, 5).map((trainset) => (
                    <div key={trainset.id} className="space-y-2">
                      <div className="flex items-start justify-between">
                        <div>
                          <h4 className="font-semibold">Train {trainset.number}</h4>
                          <Badge variant="outline" className="text-xs mt-1">
                            Rank #{trainset.recommendationRank}
                          </Badge>
                        </div>
                        <span className="text-sm font-medium text-primary">
                          {trainset.recommendationScore}%
                        </span>
                      </div>
                      <ul className="space-y-1 text-sm text-muted-foreground">
                        {getReasoningText(trainset).map((reason, idx) => (
                          <li key={idx}>{reason}</li>
                        ))}
                      </ul>
                      <Separator className="mt-3" />
                    </div>
                  ))}
                  
                  <div className="mt-6 p-4 bg-accent rounded-lg">
                    <h4 className="font-semibold text-sm mb-2">Exclusion Criteria</h4>
                    <ul className="space-y-1 text-xs text-muted-foreground">
                      <li>✗ Expired or expiring fitness certificates</li>
                      <li>✗ Critical open job cards</li>
                      <li>✗ Incomplete cleaning procedures</li>
                      <li>✗ Currently in maintenance workshops</li>
                    </ul>
                  </div>
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
