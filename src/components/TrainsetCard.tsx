import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { StatusBadge } from "./StatusBadge";
import { Trainset } from "@/types/trainset";
import { Clock, Wrench, Sparkles, TrendingUp, MapPin } from "lucide-react";
import { cn } from "@/lib/utils";

interface TrainsetCardProps {
  trainset: Trainset;
  onClick?: () => void;
  isSelected?: boolean;
}

export function TrainsetCard({ trainset, onClick, isSelected }: TrainsetCardProps) {
  const getFitnessColor = () => {
    if (trainset.fitnessStatus === "expired") return "text-status-critical";
    if (trainset.fitnessStatus === "expiring") return "text-status-warning";
    return "text-status-ready";
  };

  return (
    <Card 
      className={cn(
        "cursor-pointer transition-all hover:shadow-lg hover:scale-[1.02]",
        isSelected && "ring-2 ring-primary"
      )}
      onClick={onClick}
    >
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div>
            <h3 className="text-lg font-semibold">Train {trainset.number}</h3>
            <p className="text-xs text-muted-foreground">{trainset.id}</p>
          </div>
          <StatusBadge status={trainset.status} />
        </div>
      </CardHeader>
      <CardContent className="space-y-2">
        <div className="flex items-center gap-2 text-sm">
          <Clock className={cn("h-4 w-4", getFitnessColor())} />
          <span className="text-muted-foreground">Fitness:</span>
          <span className={cn("font-medium", getFitnessColor())}>
            {trainset.fitnessExpiry}
          </span>
        </div>
        
        <div className="flex items-center gap-2 text-sm">
          <Wrench className={cn(
            "h-4 w-4",
            trainset.jobCards.critical > 0 ? "text-status-critical" : "text-muted-foreground"
          )} />
          <span className="text-muted-foreground">Job Cards:</span>
          <span className={cn(
            "font-medium",
            trainset.jobCards.critical > 0 && "text-status-critical"
          )}>
            {trainset.jobCards.open} open ({trainset.jobCards.critical} critical)
          </span>
        </div>

        <div className="flex items-center gap-2 text-sm">
          <Sparkles className="h-4 w-4 text-muted-foreground" />
          <span className="text-muted-foreground">Cleaning:</span>
          <span className="font-medium capitalize">{trainset.cleaning.status}</span>
          <span className="text-xs text-muted-foreground">({trainset.cleaning.bay})</span>
        </div>

        <div className="flex items-center gap-2 text-sm">
          <TrendingUp className="h-4 w-4 text-muted-foreground" />
          <span className="text-muted-foreground">Mileage:</span>
          <span className="font-medium">{trainset.mileage.toLocaleString()} km</span>
        </div>

        {trainset.branding && (
          <div className="mt-2 pt-2 border-t">
            <div className="flex items-center justify-between text-xs">
              <span className="text-muted-foreground">Branding: {trainset.branding.type}</span>
              <span className={cn(
                "font-medium",
                trainset.branding.expiryDays < 7 ? "text-status-warning" : "text-muted-foreground"
              )}>
                {trainset.branding.expiryDays}d left
              </span>
            </div>
          </div>
        )}

        {trainset.location && (
          <div className="flex items-center gap-2 text-xs text-muted-foreground mt-2">
            <MapPin className="h-3 w-3" />
            {trainset.location}
          </div>
        )}

        {trainset.recommendationRank && (
          <div className="mt-2 pt-2 border-t">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-primary">Rank #{trainset.recommendationRank}</span>
              <span className="text-xs text-muted-foreground">Score: {trainset.recommendationScore}</span>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
