import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { AlertTriangle, XCircle } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { useState } from "react";
import { ValidationRule } from "./RuleValidationTable";

interface ConflictResolutionDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  rule: ValidationRule | null;
  onResolve: (ruleId: string, action: "ignore" | "fix" | "override", note: string) => void;
}

export function ConflictResolutionDrawer({
  isOpen,
  onClose,
  rule,
  onResolve,
}: ConflictResolutionDrawerProps) {
  const [resolutionNote, setResolutionNote] = useState("");

  if (!rule) return null;

  const handleResolve = (action: "ignore" | "fix" | "override") => {
    if (!resolutionNote.trim() && action !== "fix") {
      return; // Require justification for ignore/override
    }
    onResolve(rule.id, action, resolutionNote);
    setResolutionNote("");
    onClose();
  };

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent className="w-full sm:max-w-xl">
        <SheetHeader>
          <SheetTitle className="flex items-center gap-2">
            {rule.status === "fail" ? (
              <XCircle className="h-5 w-5 text-status-critical" />
            ) : (
              <AlertTriangle className="h-5 w-5 text-status-warning" />
            )}
            Conflict Resolution
          </SheetTitle>
          <SheetDescription>{rule.name}</SheetDescription>
        </SheetHeader>

        <ScrollArea className="h-[calc(100vh-180px)] mt-6 pr-4">
          <div className="space-y-6">
            {/* Rule Details */}
            <div className="space-y-2">
              <h4 className="font-semibold">Rule Description</h4>
              <p className="text-sm text-muted-foreground">{rule.description}</p>
              {rule.threshold && (
                <div className="flex items-center gap-2 text-sm">
                  <span className="text-muted-foreground">Threshold:</span>
                  <Badge variant="outline">{rule.threshold}</Badge>
                </div>
              )}
            </div>

            <Separator />

            {/* Affected Rakes */}
            <div className="space-y-3">
              <h4 className="font-semibold">
                Affected Rakes ({rule.violations})
              </h4>
              <div className="grid grid-cols-2 gap-2">
                {rule.affectedRakes.map((rake) => (
                  <div
                    key={rake}
                    className="p-3 rounded-lg border bg-card hover:bg-accent transition-colors"
                  >
                    <div className="font-medium">Train {rake}</div>
                  </div>
                ))}
              </div>
            </div>

            <Separator />

            {/* Resolution Note */}
            <div className="space-y-2">
              <h4 className="font-semibold">
                Justification Note <span className="text-status-critical">*</span>
              </h4>
              <Textarea
                placeholder="Provide justification for this resolution..."
                value={resolutionNote}
                onChange={(e) => setResolutionNote(e.target.value)}
                rows={4}
                className="resize-none"
              />
              <p className="text-xs text-muted-foreground">
                This note will be logged in the audit trail
              </p>
            </div>

            <Separator />

            {/* Action Buttons */}
            <div className="space-y-3">
              <h4 className="font-semibold">Resolution Actions</h4>
              
              <Button
                variant="outline"
                className="w-full justify-start"
                onClick={() => handleResolve("ignore")}
                disabled={!resolutionNote.trim()}
              >
                <AlertTriangle className="h-4 w-4 mr-2 text-status-warning" />
                Ignore & Justify
                <span className="ml-auto text-xs text-muted-foreground">
                  Proceed with warning
                </span>
              </Button>

              <Button
                variant="outline"
                className="w-full justify-start"
                onClick={() => handleResolve("fix")}
              >
                <XCircle className="h-4 w-4 mr-2 text-status-critical" />
                Send for Fix
                <span className="ml-auto text-xs text-muted-foreground">
                  Return to previous screen
                </span>
              </Button>

              <Button
                variant="default"
                className="w-full justify-start"
                onClick={() => handleResolve("override")}
                disabled={!resolutionNote.trim()}
              >
                Override Rule
                <span className="ml-auto text-xs text-muted-foreground">
                  Manual approval
                </span>
              </Button>
            </div>

            <div className="p-3 rounded-lg bg-muted/50 text-xs text-muted-foreground">
              <p className="font-medium mb-1">Note:</p>
              <p>
                All resolution actions are logged with timestamp, user ID, and justification
                for full audit traceability.
              </p>
            </div>
          </div>
        </ScrollArea>
      </SheetContent>
    </Sheet>
  );
}
