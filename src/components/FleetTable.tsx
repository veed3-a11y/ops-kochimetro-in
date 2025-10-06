import { useState } from "react";
import { Trainset } from "@/types/trainset";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { ArrowUpDown, ArrowUp, ArrowDown, Eye, Wrench } from "lucide-react";
import { cn } from "@/lib/utils";
import { StatusBadge } from "./StatusBadge";

interface FleetTableProps {
  trainsets: Trainset[];
  onRakeClick?: (trainsetId: string) => void;
}

type SortField = "number" | "fitness" | "jobCards" | "mileage" | "cleaning" | "bay";
type SortDirection = "asc" | "desc" | null;

export function FleetTable({ trainsets, onRakeClick }: FleetTableProps) {
  const [sortField, setSortField] = useState<SortField | null>(null);
  const [sortDirection, setSortDirection] = useState<SortDirection>(null);

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      if (sortDirection === "asc") {
        setSortDirection("desc");
      } else if (sortDirection === "desc") {
        setSortField(null);
        setSortDirection(null);
      } else {
        setSortDirection("asc");
      }
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  const sortedTrainsets = [...trainsets].sort((a, b) => {
    if (!sortField || !sortDirection) return 0;

    let aValue: any;
    let bValue: any;

    switch (sortField) {
      case "number":
        aValue = a.number;
        bValue = b.number;
        break;
      case "fitness":
        aValue = new Date(a.fitnessExpiry).getTime();
        bValue = new Date(b.fitnessExpiry).getTime();
        break;
      case "jobCards":
        aValue = a.jobCards.open;
        bValue = b.jobCards.open;
        break;
      case "mileage":
        aValue = a.mileage;
        bValue = b.mileage;
        break;
      case "cleaning":
        aValue = a.cleaning.status;
        bValue = b.cleaning.status;
        break;
      case "bay":
        aValue = a.cleaning.bay;
        bValue = b.cleaning.bay;
        break;
    }

    if (sortDirection === "asc") {
      return aValue > bValue ? 1 : -1;
    } else {
      return aValue < bValue ? 1 : -1;
    }
  });

  const SortIcon = ({ field }: { field: SortField }) => {
    if (sortField !== field) return <ArrowUpDown className="h-4 w-4 opacity-50" />;
    return sortDirection === "asc" ? (
      <ArrowUp className="h-4 w-4" />
    ) : (
      <ArrowDown className="h-4 w-4" />
    );
  };

  const getFitnessColor = (status: Trainset["fitnessStatus"]) => {
    switch (status) {
      case "valid":
        return "text-status-ready";
      case "expiring":
        return "text-status-warning";
      case "expired":
        return "text-status-critical";
    }
  };

  return (
    <TooltipProvider>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/50">
              <TableHead>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-8 font-semibold"
                  onClick={() => handleSort("number")}
                >
                  Rake ID
                  <SortIcon field="number" />
                </Button>
              </TableHead>
              <TableHead>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-8 font-semibold"
                  onClick={() => handleSort("fitness")}
                >
                  Fitness Expiry
                  <SortIcon field="fitness" />
                </Button>
              </TableHead>
              <TableHead>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-8 font-semibold"
                  onClick={() => handleSort("jobCards")}
                >
                  Job Cards
                  <SortIcon field="jobCards" />
                </Button>
              </TableHead>
              <TableHead>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-8 font-semibold"
                  onClick={() => handleSort("mileage")}
                >
                  Mileage
                  <SortIcon field="mileage" />
                </Button>
              </TableHead>
              <TableHead>Branding</TableHead>
              <TableHead>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-8 font-semibold"
                  onClick={() => handleSort("cleaning")}
                >
                  Cleaning
                  <SortIcon field="cleaning" />
                </Button>
              </TableHead>
              <TableHead>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-8 font-semibold"
                  onClick={() => handleSort("bay")}
                >
                  Bay
                  <SortIcon field="bay" />
                </Button>
              </TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sortedTrainsets.map((trainset, index) => (
              <TableRow
                key={trainset.id}
                className={cn(
                  "cursor-pointer transition-colors hover:bg-muted/50 animate-fade-in",
                  `[animation-delay:${index * 30}ms]`
                )}
                onClick={() => onRakeClick?.(trainset.id)}
              >
                <TableCell className="font-medium">
                  <div>
                    <div className="font-bold">Train {trainset.number}</div>
                    <div className="text-xs text-muted-foreground">{trainset.id}</div>
                  </div>
                </TableCell>
                <TableCell>
                  <div className={cn("font-medium", getFitnessColor(trainset.fitnessStatus))}>
                    {new Date(trainset.fitnessExpiry).toLocaleDateString('en-IN')}
                  </div>
                  <div className="text-xs text-muted-foreground capitalize">
                    {trainset.fitnessStatus}
                  </div>
                </TableCell>
                <TableCell>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <div className="flex items-center gap-2 cursor-help">
                        {trainset.jobCards.critical > 0 && (
                          <Wrench className="h-4 w-4 text-status-critical" />
                        )}
                        <span className={cn(
                          "font-medium",
                          trainset.jobCards.critical > 0 ? "text-status-critical" : ""
                        )}>
                          {trainset.jobCards.open}
                        </span>
                      </div>
                    </TooltipTrigger>
                    <TooltipContent>
                      <div className="space-y-1">
                        <p className="font-semibold">Job Card Details</p>
                        <p className="text-xs">Open: {trainset.jobCards.open}</p>
                        <p className="text-xs">Critical: {trainset.jobCards.critical}</p>
                      </div>
                    </TooltipContent>
                  </Tooltip>
                </TableCell>
                <TableCell className="font-medium">
                  {trainset.mileage.toLocaleString()} km
                </TableCell>
                <TableCell>
                  {trainset.branding ? (
                    <div>
                      <Badge variant="outline" className="text-xs">
                        {trainset.branding.type}
                      </Badge>
                      <div className="text-xs text-muted-foreground mt-1">
                        {trainset.branding.expiryDays}d left
                      </div>
                    </div>
                  ) : (
                    <span className="text-xs text-muted-foreground">—</span>
                  )}
                </TableCell>
                <TableCell>
                  <Badge
                    variant="outline"
                    className={cn(
                      "capitalize",
                      trainset.cleaning.status === "completed"
                        ? "border-status-ready/30 text-status-ready"
                        : trainset.cleaning.status === "in-progress"
                        ? "border-status-warning/30 text-status-warning"
                        : "border-muted text-muted-foreground"
                    )}
                  >
                    {trainset.cleaning.status}
                  </Badge>
                </TableCell>
                <TableCell className="font-medium">{trainset.cleaning.bay}</TableCell>
                <TableCell>
                  <StatusBadge status={trainset.status} />
                </TableCell>
                <TableCell className="text-right">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      onRakeClick?.(trainset.id);
                    }}
                  >
                    <Eye className="h-4 w-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </TooltipProvider>
  );
}
