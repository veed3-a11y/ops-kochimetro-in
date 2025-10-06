import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { CheckCircle, AlertTriangle, XCircle, Info, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

export interface ValidationRule {
  id: string;
  name: string;
  description: string;
  type: "fitness" | "jobcard" | "cleaning" | "mileage" | "branding" | "stabling";
  status: "pass" | "warning" | "fail";
  violations: number;
  affectedRakes: string[];
  threshold?: string;
}

interface RuleValidationTableProps {
  rules: ValidationRule[];
  onRuleClick: (rule: ValidationRule) => void;
}

export function RuleValidationTable({ rules, onRuleClick }: RuleValidationTableProps) {
  const getStatusIcon = (status: ValidationRule["status"]) => {
    switch (status) {
      case "pass":
        return <CheckCircle className="h-5 w-5 text-status-ready" />;
      case "warning":
        return <AlertTriangle className="h-5 w-5 text-status-warning" />;
      case "fail":
        return <XCircle className="h-5 w-5 text-status-critical animate-pulse" />;
    }
  };

  const getStatusBadge = (status: ValidationRule["status"]) => {
    switch (status) {
      case "pass":
        return (
          <Badge className="bg-status-ready-bg text-status-ready border-status-ready/30">
            Pass
          </Badge>
        );
      case "warning":
        return (
          <Badge className="bg-status-warning-bg text-status-warning border-status-warning/30">
            Warning
          </Badge>
        );
      case "fail":
        return (
          <Badge className="bg-status-critical-bg text-status-critical border-status-critical/30">
            Fail
          </Badge>
        );
    }
  };

  const getTypeColor = (type: ValidationRule["type"]) => {
    const colors = {
      fitness: "text-blue-600 dark:text-blue-400",
      jobcard: "text-orange-600 dark:text-orange-400",
      cleaning: "text-green-600 dark:text-green-400",
      mileage: "text-purple-600 dark:text-purple-400",
      branding: "text-pink-600 dark:text-pink-400",
      stabling: "text-cyan-600 dark:text-cyan-400",
    };
    return colors[type];
  };

  return (
    <TooltipProvider>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/50">
              <TableHead className="w-12">Status</TableHead>
              <TableHead className="font-semibold">Rule Name</TableHead>
              <TableHead className="font-semibold">Type</TableHead>
              <TableHead className="font-semibold">Violations</TableHead>
              <TableHead className="font-semibold">Threshold</TableHead>
              <TableHead className="w-12"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {rules.map((rule, index) => (
              <TableRow
                key={rule.id}
                className={cn(
                  "cursor-pointer transition-colors hover:bg-muted/50 animate-fade-in",
                  rule.status === "fail" && "bg-status-critical-bg/10",
                  `[animation-delay:${index * 30}ms]`
                )}
                onClick={() => onRuleClick(rule)}
              >
                <TableCell>
                  <Tooltip>
                    <TooltipTrigger>
                      {getStatusIcon(rule.status)}
                    </TooltipTrigger>
                    <TooltipContent>
                      {rule.description}
                    </TooltipContent>
                  </Tooltip>
                </TableCell>
                <TableCell className="font-medium">{rule.name}</TableCell>
                <TableCell>
                  <Badge variant="outline" className={cn("capitalize", getTypeColor(rule.type))}>
                    {rule.type}
                  </Badge>
                </TableCell>
                <TableCell>
                  {rule.violations > 0 ? (
                    <div className="flex items-center gap-2">
                      <span className={cn(
                        "font-bold",
                        rule.status === "fail" ? "text-status-critical" : "text-status-warning"
                      )}>
                        {rule.violations}
                      </span>
                      <span className="text-xs text-muted-foreground">rake(s)</span>
                    </div>
                  ) : (
                    <span className="text-sm text-muted-foreground">None</span>
                  )}
                </TableCell>
                <TableCell className="text-sm text-muted-foreground">
                  {rule.threshold || "—"}
                </TableCell>
                <TableCell>
                  {rule.violations > 0 && (
                    <Button variant="ghost" size="sm" onClick={(e) => {
                      e.stopPropagation();
                      onRuleClick(rule);
                    }}>
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </TooltipProvider>
  );
}
