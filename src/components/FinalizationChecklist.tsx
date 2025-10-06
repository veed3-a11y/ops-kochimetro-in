import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { CheckCircle } from "lucide-react";

interface ChecklistItem {
  id: string;
  label: string;
  checked: boolean;
}

interface FinalizationChecklistProps {
  items: ChecklistItem[];
  onToggle: (id: string) => void;
}

export function FinalizationChecklist({ items, onToggle }: FinalizationChecklistProps) {
  const allChecked = items.every(item => item.checked);

  return (
    <Card className={allChecked ? "border-2 border-status-ready" : ""}>
      <CardHeader>
        <CardTitle className="text-lg flex items-center gap-2">
          <CheckCircle className={allChecked ? "h-5 w-5 text-status-ready" : "h-5 w-5"} />
          Finalization Checklist
          {allChecked && (
            <span className="ml-auto text-sm text-status-ready font-normal">
              Ready to publish
            </span>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {items.map((item) => (
            <div key={item.id} className="flex items-center space-x-3">
              <Checkbox
                id={item.id}
                checked={item.checked}
                onCheckedChange={() => onToggle(item.id)}
              />
              <Label
                htmlFor={item.id}
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
              >
                {item.label}
              </Label>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
