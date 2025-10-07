import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { FileText, User, Settings, Shield } from "lucide-react";

export interface AuditEntry {
  id: string;
  action: string;
  actionType: "rule" | "user" | "integration" | "system";
  user: string;
  timestamp: string;
  details: string;
}

interface AuditTrailDrawerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  entries: AuditEntry[];
}

export function AuditTrailDrawer({ open, onOpenChange, entries }: AuditTrailDrawerProps) {
  const getActionIcon = (type: string) => {
    switch (type) {
      case "rule":
        return <FileText className="h-4 w-4" />;
      case "user":
        return <User className="h-4 w-4" />;
      case "integration":
        return <Settings className="h-4 w-4" />;
      case "system":
        return <Shield className="h-4 w-4" />;
      default:
        return <FileText className="h-4 w-4" />;
    }
  };

  const getActionBadge = (type: string) => {
    switch (type) {
      case "rule":
        return <Badge variant="outline" className="bg-blue-500/10 text-blue-500 border-blue-500/20">Rule</Badge>;
      case "user":
        return <Badge variant="outline" className="bg-green-500/10 text-green-500 border-green-500/20">User</Badge>;
      case "integration":
        return <Badge variant="outline" className="bg-purple-500/10 text-purple-500 border-purple-500/20">Integration</Badge>;
      case "system":
        return <Badge variant="outline" className="bg-orange-500/10 text-orange-500 border-orange-500/20">System</Badge>;
      default:
        return <Badge variant="outline">Unknown</Badge>;
    }
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-[400px] sm:w-[540px] animate-slide-in-right">
        <SheetHeader>
          <SheetTitle>Audit Trail</SheetTitle>
          <SheetDescription>
            Chronological log of all administrative changes
          </SheetDescription>
        </SheetHeader>

        <ScrollArea className="h-[calc(100vh-120px)] mt-6">
          <div className="space-y-4">
            {entries.map((entry) => (
              <div
                key={entry.id}
                className="p-4 rounded-lg border bg-card hover:shadow-md transition-all"
              >
                <div className="flex items-start gap-3">
                  <div className="mt-1">{getActionIcon(entry.actionType)}</div>
                  <div className="flex-1 space-y-2">
                    <div className="flex items-center gap-2">
                      {getActionBadge(entry.actionType)}
                      <span className="text-sm font-medium">{entry.action}</span>
                    </div>
                    <p className="text-sm text-muted-foreground">{entry.details}</p>
                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <User className="h-3 w-3" />
                        {entry.user}
                      </span>
                      <span>{entry.timestamp}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}

            {entries.length === 0 && (
              <div className="text-center py-12 text-muted-foreground">
                <Shield className="h-12 w-12 mx-auto mb-4 opacity-30" />
                <p>No audit entries yet</p>
              </div>
            )}
          </div>
        </ScrollArea>
      </SheetContent>
    </Sheet>
  );
}
