import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ValidationSummary } from "@/components/ValidationSummary";
import { RuleValidationTable, ValidationRule } from "@/components/RuleValidationTable";
import { ConflictResolutionDrawer } from "@/components/ConflictResolutionDrawer";
import { AuditLogViewer, AuditLogEntry } from "@/components/AuditLogViewer";
import { FinalizationChecklist } from "@/components/FinalizationChecklist";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ArrowLeft, RefreshCw, Send, FileDown, CheckCircle } from "lucide-react";
import { toast } from "sonner";
import { TooltipProvider, Tooltip, TooltipTrigger, TooltipContent } from "@/components/ui/tooltip";

export default function PlanValidation() {
  const navigate = useNavigate();
  const [selectedRule, setSelectedRule] = useState<ValidationRule | null>(null);
  const [isConflictDrawerOpen, setIsConflictDrawerOpen] = useState(false);

  // Mock validation rules
  const [validationRules, setValidationRules] = useState<ValidationRule[]>([
    {
      id: "rule-1",
      name: "Fitness Certificate Validity",
      description: "All trainsets must have valid fitness certificates (not expired or expiring within 7 days)",
      type: "fitness",
      status: "pass",
      violations: 0,
      affectedRakes: [],
      threshold: "Valid for ≥7 days",
    },
    {
      id: "rule-2",
      name: "Critical Job Cards",
      description: "No trainsets with critical open job cards should be inducted",
      type: "jobcard",
      status: "pass",
      violations: 0,
      affectedRakes: [],
      threshold: "0 critical cards",
    },
    {
      id: "rule-3",
      name: "Cleaning Completion",
      description: "All trainsets must have completed cleaning procedures",
      type: "cleaning",
      status: "warning",
      violations: 2,
      affectedRakes: ["12", "19"],
      threshold: "Status = Completed",
    },
    {
      id: "rule-4",
      name: "Mileage Balance",
      description: "Mileage variance across inducted trainsets should not exceed 15%",
      type: "mileage",
      status: "pass",
      violations: 0,
      affectedRakes: [],
      threshold: "Variance ≤15%",
    },
    {
      id: "rule-5",
      name: "Branding SLA Compliance",
      description: "Branded trainsets must meet minimum exposure requirements",
      type: "branding",
      status: "warning",
      violations: 1,
      affectedRakes: ["08"],
      threshold: "≥85% target met",
    },
    {
      id: "rule-6",
      name: "Bay Availability",
      description: "Sufficient bays must be available for stabling inducted trainsets",
      type: "stabling",
      status: "pass",
      violations: 0,
      affectedRakes: [],
      threshold: "18 bays available",
    },
  ]);

  const [auditLog, setAuditLog] = useState<AuditLogEntry[]>([
    {
      id: "log-1",
      timestamp: "21:15 IST",
      user: "Control Room Planner",
      action: "Manual Override",
      trainsetNumber: "08",
      details: "Changed status from Standby to Service",
      note: "Branding exposure requirement for sponsor SLA",
    },
    {
      id: "log-2",
      timestamp: "21:12 IST",
      user: "Depot Supervisor",
      action: "Rule Override",
      trainsetNumber: "12",
      details: "Ignored cleaning completion warning",
      note: "Final touch-up can be completed during stabling",
    },
  ]);

  const [checklistItems, setChecklistItems] = useState([
    { id: "check-1", label: "All conflicts reviewed and addressed", checked: false },
    { id: "check-2", label: "Manual overrides justified with notes", checked: false },
    { id: "check-3", label: "Branding exposure targets verified", checked: false },
    { id: "check-4", label: "Cleaning readiness confirmed", checked: false },
    { id: "check-5", label: "Bay stabling assignments reviewed", checked: false },
  ]);

  // Calculate summary stats
  const validatedCount = validationRules.filter(r => r.status === "pass").length;
  const warningsCount = validationRules.filter(r => r.status === "warning").length;
  const conflictsCount = validationRules.filter(r => r.status === "fail").length;
  const pendingOverridesCount = validationRules.filter(r => r.violations > 0 && r.status !== "pass").length;

  const handleRuleClick = (rule: ValidationRule) => {
    if (rule.violations > 0) {
      setSelectedRule(rule);
      setIsConflictDrawerOpen(true);
    }
  };

  const handleResolve = (ruleId: string, action: "ignore" | "fix" | "override", note: string) => {
    const rule = validationRules.find(r => r.id === ruleId);
    if (!rule) return;

    if (action === "fix") {
      toast.info("Returning to Recommendation Center for fixes");
      setTimeout(() => navigate("/recommendation"), 1000);
      return;
    }

    // Update rule status
    setValidationRules(prev =>
      prev.map(r =>
        r.id === ruleId
          ? { ...r, status: action === "override" ? "pass" as const : "warning" as const }
          : r
      )
    );

    // Add to audit log
    const newLogEntry: AuditLogEntry = {
      id: `log-${Date.now()}`,
      timestamp: new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }),
      user: "Current User",
      action: action === "override" ? "Rule Override" : "Ignored Warning",
      trainsetNumber: rule.affectedRakes.join(", "),
      details: `${rule.name} - ${action}`,
      note: note,
    };
    setAuditLog(prev => [newLogEntry, ...prev]);

    toast.success(`Conflict resolved: ${action}`, {
      description: `Rule "${rule.name}" has been ${action === "override" ? "overridden" : "acknowledged"}`,
    });
  };

  const handleChecklistToggle = (id: string) => {
    setChecklistItems(prev =>
      prev.map(item =>
        item.id === id ? { ...item, checked: !item.checked } : item
      )
    );
  };

  const handleRevalidate = () => {
    toast.loading("Revalidating all rules...", { duration: 1500 });
    setTimeout(() => {
      toast.success("Validation complete", {
        description: `${validatedCount} rules passed, ${warningsCount} warnings`,
      });
    }, 1500);
  };

  const handlePublish = () => {
    const allChecked = checklistItems.every(item => item.checked);
    
    if (conflictsCount > 0) {
      toast.error("Cannot publish with critical conflicts", {
        description: "Please resolve all critical conflicts before publishing",
      });
      return;
    }

    if (!allChecked) {
      toast.warning("Checklist incomplete", {
        description: "Please complete all checklist items before publishing",
      });
      return;
    }

    toast.loading("Publishing final plan...", { duration: 2000 });
    setTimeout(() => {
      toast.success("Induction Plan Published!", {
        description: "Plan locked and synced to Operations Dashboard",
      });
      // Could navigate to success page or dashboard
    }, 2000);
  };

  const handleExport = () => {
    toast.success("Plan exported", {
      description: "PDF downloaded successfully",
    });
  };

  const allChecklistComplete = checklistItems.every(item => item.checked);
  const canPublish = conflictsCount === 0 && allChecklistComplete;

  return (
    <TooltipProvider>
      <div className="space-y-6 pb-24 animate-fade-in">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate("/recommendation")}
              className="mb-2 -ml-2"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Recommendation Center
            </Button>
            <h1 className="text-3xl font-bold">Plan Validation & Publication</h1>
            <p className="text-muted-foreground">
              Final verification before publishing tonight's induction plan
            </p>
          </div>
        </div>

        {/* Validation Summary */}
        <ValidationSummary
          validatedCount={validatedCount}
          warningsCount={warningsCount}
          conflictsCount={conflictsCount}
          pendingOverridesCount={pendingOverridesCount}
        />

        {/* Rule Validation Table */}
        <Card className="p-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-semibold">Validation Rules</h2>
                <p className="text-sm text-muted-foreground">
                  System-wide operational constraints and compliance checks
                </p>
              </div>
              <Button variant="outline" size="sm" onClick={handleRevalidate}>
                <RefreshCw className="h-4 w-4 mr-2" />
                Revalidate
              </Button>
            </div>
            <RuleValidationTable rules={validationRules} onRuleClick={handleRuleClick} />
          </div>
        </Card>

        {/* Audit Log and Checklist Side by Side */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <AuditLogViewer entries={auditLog} />
          <FinalizationChecklist items={checklistItems} onToggle={handleChecklistToggle} />
        </div>

        {/* Conflict Resolution Drawer */}
        <ConflictResolutionDrawer
          isOpen={isConflictDrawerOpen}
          onClose={() => setIsConflictDrawerOpen(false)}
          rule={selectedRule}
          onResolve={handleResolve}
        />

        {/* Bottom Sticky Action Bar */}
        <div className="fixed bottom-0 left-0 right-0 z-50 border-t bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
          <div className="container flex items-center justify-between h-16 px-6">
            <div className="flex items-center gap-4">
              <div className="text-sm">
                <span className="font-semibold text-status-ready">{validatedCount}</span>
                <span className="text-muted-foreground"> rules passed</span>
              </div>
              <div className="text-sm">
                <span className="font-semibold text-status-warning">{warningsCount}</span>
                <span className="text-muted-foreground"> warnings</span>
              </div>
              {conflictsCount > 0 && (
                <div className="text-sm">
                  <span className="font-semibold text-status-critical">{conflictsCount}</span>
                  <span className="text-muted-foreground"> conflicts</span>
                </div>
              )}
            </div>
            <div className="flex gap-2">
              <Button variant="outline" onClick={handleExport}>
                <FileDown className="h-4 w-4 mr-2" />
                Export PDF
              </Button>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    onClick={handlePublish}
                    size="lg"
                    disabled={!canPublish}
                    className={canPublish ? "gap-2 animate-pulse hover:animate-none" : "gap-2"}
                  >
                    {canPublish ? (
                      <CheckCircle className="h-5 w-5" />
                    ) : (
                      <Send className="h-5 w-5" />
                    )}
                    Publish Final Plan
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  {!allChecklistComplete
                    ? "Complete checklist to enable publishing"
                    : conflictsCount > 0
                    ? "Resolve conflicts to enable publishing"
                    : "Lock plan and sync to Operations Dashboard"}
                </TooltipContent>
              </Tooltip>
            </div>
          </div>
        </div>
      </div>
    </TooltipProvider>
  );
}
