import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Edit, Trash2, Plus } from "lucide-react";
import { cn } from "@/lib/utils";

export interface Rule {
  id: string;
  name: string;
  category: "fitness" | "mileage" | "branding" | "maintenance" | "cleaning";
  condition: string;
  value: string;
  status: "active" | "inactive";
  createdBy: string;
  updatedAt: string;
}

interface RulesPanelProps {
  rules: Rule[];
  onAddRule: () => void;
  onEditRule: (rule: Rule) => void;
  onDeleteRule: (ruleId: string) => void;
}

export function RulesPanel({ rules, onAddRule, onEditRule, onDeleteRule }: RulesPanelProps) {
  const getCategoryColor = (category: string) => {
    switch (category) {
      case "fitness":
        return "bg-blue-500/10 text-blue-500 border-blue-500/20";
      case "mileage":
        return "bg-purple-500/10 text-purple-500 border-purple-500/20";
      case "branding":
        return "bg-orange-500/10 text-orange-500 border-orange-500/20";
      case "maintenance":
        return "bg-yellow-500/10 text-yellow-500 border-yellow-500/20";
      case "cleaning":
        return "bg-green-500/10 text-green-500 border-green-500/20";
      default:
        return "bg-muted text-foreground border-border";
    }
  };

  return (
    <div className="space-y-4 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Operational Rules & Constraints</h2>
          <p className="text-sm text-muted-foreground mt-1">
            Configure validation rules for induction planning
          </p>
        </div>
        <Button onClick={onAddRule}>
          <Plus className="h-4 w-4 mr-2" />
          Add Rule
        </Button>
      </div>

      <div className="grid gap-4">
        {rules.map((rule) => (
          <Card
            key={rule.id}
            className={cn(
              "transition-all hover:shadow-md",
              rule.status === "inactive" && "opacity-60"
            )}
          >
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="space-y-1 flex-1">
                  <div className="flex items-center gap-2">
                    <CardTitle className="text-lg">{rule.name}</CardTitle>
                    <Badge variant="outline" className={getCategoryColor(rule.category)}>
                      {rule.category}
                    </Badge>
                    {rule.status === "inactive" && (
                      <Badge variant="outline" className="text-muted-foreground">
                        Inactive
                      </Badge>
                    )}
                  </div>
                  <CardDescription className="text-sm">
                    {rule.condition} <span className="font-semibold">{rule.value}</span>
                  </CardDescription>
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => onEditRule(rule)}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => onDeleteRule(rule.id)}
                  >
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <span>Modified by {rule.createdBy}</span>
                <span>Last updated: {rule.updatedAt}</span>
              </div>
            </CardContent>
          </Card>
        ))}

        {rules.length === 0 && (
          <Card className="p-12 text-center">
            <p className="text-muted-foreground">No rules configured yet.</p>
            <Button onClick={onAddRule} variant="outline" className="mt-4">
              <Plus className="h-4 w-4 mr-2" />
              Create First Rule
            </Button>
          </Card>
        )}
      </div>
    </div>
  );
}
