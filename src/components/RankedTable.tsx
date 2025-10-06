import { useState } from "react";
import { Trainset } from "@/types/trainset";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { CheckCircle, AlertTriangle, XCircle, ChevronRight, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";
import { Progress } from "@/components/ui/progress";

export type RecommendationStatus = "service" | "standby" | "ibl" | "no-change";

interface RankedTrainset extends Trainset {
  rank: number;
  recommendedStatus: RecommendationStatus;
  confidenceScore: number;
  reasoning: string[];
  override?: {
    status: RecommendationStatus;
    note: string;
  };
}

interface RankedTableProps {
  trainsets: RankedTrainset[];
  onViewReasoning: (trainset: RankedTrainset) => void;
  onOverride: (trainsetId: string, status: RecommendationStatus, note: string) => void;
}

export function RankedTable({ trainsets, onViewReasoning, onOverride }: RankedTableProps) {
  const [overrideNotes, setOverrideNotes] = useState<Record<string, string>>({});

  const getStatusBadge = (status: RecommendationStatus) => {
    switch (status) {
      case "service":
        return (
          <Badge className="bg-status-ready-bg text-status-ready border-status-ready/30">
            <CheckCircle className="h-3 w-3 mr-1" />
            Service
          </Badge>
        );
      case "standby":
        return (
          <Badge className="bg-status-warning-bg text-status-warning border-status-warning/30">
            <AlertTriangle className="h-3 w-3 mr-1" />
            Standby
          </Badge>
        );
      case "ibl":
        return (
          <Badge className="bg-status-critical-bg text-status-critical border-status-critical/30">
            <XCircle className="h-3 w-3 mr-1" />
            IBL
          </Badge>
        );
      default:
        return <Badge variant="outline">No Change</Badge>;
    }
  };

  const getAlertIcons = (trainset: RankedTrainset) => {
    const alerts = [];
    if (trainset.fitnessStatus === "expiring") {
      alerts.push(
        <Tooltip key="fitness">
          <TooltipTrigger>
            <AlertTriangle className="h-4 w-4 text-status-warning" />
          </TooltipTrigger>
          <TooltipContent>Fitness expiring soon</TooltipContent>
        </Tooltip>
      );
    }
    if (trainset.jobCards.critical > 0) {
      alerts.push(
        <Tooltip key="jobcard">
          <TooltipTrigger>
            <XCircle className="h-4 w-4 text-status-critical" />
          </TooltipTrigger>
          <TooltipContent>{trainset.jobCards.critical} critical job cards</TooltipContent>
        </Tooltip>
      );
    }
    if (trainset.branding) {
      alerts.push(
        <Tooltip key="branding">
          <TooltipTrigger>
            <Sparkles className="h-4 w-4 text-primary" />
          </TooltipTrigger>
          <TooltipContent>Branding: {trainset.branding.type}</TooltipContent>
        </Tooltip>
      );
    }
    return alerts;
  };

  return (
    <TooltipProvider>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/50">
              <TableHead className="w-16 font-semibold">Rank</TableHead>
              <TableHead className="font-semibold">Rake ID</TableHead>
              <TableHead className="font-semibold">Recommended</TableHead>
              <TableHead className="font-semibold">Confidence</TableHead>
              <TableHead className="font-semibold">Alerts</TableHead>
              <TableHead className="font-semibold">Override</TableHead>
              <TableHead className="font-semibold">Reasoning</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {trainsets.map((trainset, index) => {
              const hasOverride = trainset.override !== undefined;
              const displayStatus = hasOverride ? trainset.override!.status : trainset.recommendedStatus;
              
              return (
                <TableRow
                  key={trainset.id}
                  className={cn(
                    "transition-colors animate-fade-in",
                    hasOverride && "bg-status-warning-bg/20 border-l-4 border-l-status-warning",
                    `[animation-delay:${index * 40}ms]`
                  )}
                >
                  <TableCell className="font-bold text-lg">
                    #{trainset.rank}
                  </TableCell>
                  <TableCell>
                    <div>
                      <div className="font-bold">Train {trainset.number}</div>
                      <div className="text-xs text-muted-foreground">{trainset.id}</div>
                    </div>
                  </TableCell>
                  <TableCell>
                    {getStatusBadge(displayStatus)}
                    {hasOverride && (
                      <Badge variant="outline" className="ml-2 text-xs">
                        Overridden
                      </Badge>
                    )}
                  </TableCell>
                  <TableCell>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <div className="space-y-1 cursor-help">
                          <div className="flex items-center gap-2">
                            <Progress value={trainset.confidenceScore} className="h-2 w-20" />
                            <span className="text-sm font-medium">{trainset.confidenceScore}%</span>
                          </div>
                        </div>
                      </TooltipTrigger>
                      <TooltipContent>
                        <div className="space-y-1">
                          <p className="font-semibold">Confidence Breakdown</p>
                          <p className="text-xs">Data reliability: 95%</p>
                          <p className="text-xs">Rule weight: {trainset.confidenceScore}%</p>
                          <p className="text-xs">Recency: 98%</p>
                        </div>
                      </TooltipContent>
                    </Tooltip>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      {getAlertIcons(trainset)}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Select
                      defaultValue="no-change"
                      onValueChange={(value) => {
                        const note = overrideNotes[trainset.id] || "";
                        onOverride(trainset.id, value as RecommendationStatus, note);
                      }}
                    >
                      <SelectTrigger className="w-32 h-8 text-xs">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="z-50 bg-background">
                        <SelectItem value="no-change">No Change</SelectItem>
                        <SelectItem value="service">Service</SelectItem>
                        <SelectItem value="standby">Standby</SelectItem>
                        <SelectItem value="ibl">IBL</SelectItem>
                      </SelectContent>
                    </Select>
                  </TableCell>
                  <TableCell>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onViewReasoning(trainset)}
                      className="gap-1"
                    >
                      View
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>
    </TooltipProvider>
  );
}
