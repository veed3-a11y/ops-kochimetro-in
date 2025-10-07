import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Rule } from "./RulesPanel";

interface RuleEditorModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  rule?: Rule | null;
  onSave: (rule: Partial<Rule>) => void;
}

export function RuleEditorModal({ open, onOpenChange, rule, onSave }: RuleEditorModalProps) {
  const [formData, setFormData] = useState({
    name: "",
    category: "fitness" as Rule["category"],
    condition: "",
    value: "",
    status: "active" as "active" | "inactive",
    notes: "",
  });

  useEffect(() => {
    if (rule) {
      setFormData({
        name: rule.name,
        category: rule.category,
        condition: rule.condition,
        value: rule.value,
        status: rule.status,
        notes: "",
      });
    } else {
      setFormData({
        name: "",
        category: "fitness",
        condition: "",
        value: "",
        status: "active",
        notes: "",
      });
    }
  }, [rule, open]);

  const handleSave = () => {
    onSave({
      id: rule?.id,
      ...formData,
      createdBy: "Admin User",
      updatedAt: new Date().toLocaleString(),
    });
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] animate-scale-in">
        <DialogHeader>
          <DialogTitle>{rule ? "Edit Rule" : "Add New Rule"}</DialogTitle>
          <DialogDescription>
            Configure operational constraints for induction planning
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="name">Rule Name</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="e.g., Fitness Certificate Validity"
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="category">Category</Label>
            <Select
              value={formData.category}
              onValueChange={(value) => setFormData({ ...formData, category: value as Rule["category"] })}
            >
              <SelectTrigger id="category">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="fitness">Fitness Certification</SelectItem>
                <SelectItem value="mileage">Mileage Balance</SelectItem>
                <SelectItem value="branding">Branding Exposure</SelectItem>
                <SelectItem value="maintenance">Maintenance</SelectItem>
                <SelectItem value="cleaning">Cleaning</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="grid gap-2">
            <Label htmlFor="condition">Condition</Label>
            <Input
              id="condition"
              value={formData.condition}
              onChange={(e) => setFormData({ ...formData, condition: e.target.value })}
              placeholder="e.g., must be ≥"
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="value">Value</Label>
            <Input
              id="value"
              value={formData.value}
              onChange={(e) => setFormData({ ...formData, value: e.target.value })}
              placeholder="e.g., 24 hours"
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="notes">Notes (Optional)</Label>
            <Textarea
              id="notes"
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              placeholder="Add any additional context or reasoning..."
              rows={3}
            />
          </div>

          <div className="flex items-center justify-between p-4 rounded-lg border bg-muted/30">
            <div className="space-y-0.5">
              <Label htmlFor="status">Rule Status</Label>
              <p className="text-sm text-muted-foreground">
                Inactive rules won't be applied during validation
              </p>
            </div>
            <Switch
              id="status"
              checked={formData.status === "active"}
              onCheckedChange={(checked) =>
                setFormData({ ...formData, status: checked ? "active" : "inactive" })
              }
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSave}>
            {rule ? "Update Rule" : "Create Rule"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
