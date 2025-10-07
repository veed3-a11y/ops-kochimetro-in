import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Save, Share2, RotateCcw, Plus, GitCompare } from "lucide-react";

interface SimulationToolbarProps {
  selectedScenario: string;
  onScenarioChange: (scenario: string) => void;
  onCreateNew: () => void;
  onSave: () => void;
  onCompare: () => void;
  onRevert: () => void;
  onShare: () => void;
}

export function SimulationToolbar({
  selectedScenario,
  onScenarioChange,
  onCreateNew,
  onSave,
  onCompare,
  onRevert,
  onShare,
}: SimulationToolbarProps) {
  return (
    <div className="flex items-center justify-between p-4 border-b bg-card">
      <div className="flex items-center gap-4">
        <h2 className="text-lg font-semibold">Scenario Planning</h2>
        <Select value={selectedScenario} onValueChange={onScenarioChange}>
          <SelectTrigger className="w-[250px]">
            <SelectValue placeholder="Select scenario" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="baseline">Baseline (Current Operations)</SelectItem>
            <SelectItem value="peak-demand">Peak Demand Scenario</SelectItem>
            <SelectItem value="maintenance-intensive">Maintenance-Intensive Period</SelectItem>
            <SelectItem value="reduced-fleet">Reduced Fleet Capacity</SelectItem>
            <SelectItem value="custom">Custom Scenario</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="flex items-center gap-2">
        <Button variant="outline" size="sm" onClick={onCreateNew}>
          <Plus className="h-4 w-4 mr-2" />
          New Scenario
        </Button>
        <Button variant="outline" size="sm" onClick={onCompare}>
          <GitCompare className="h-4 w-4 mr-2" />
          Compare
        </Button>
        <Button variant="outline" size="sm" onClick={onSave}>
          <Save className="h-4 w-4 mr-2" />
          Save
        </Button>
        <Button variant="outline" size="sm" onClick={onShare}>
          <Share2 className="h-4 w-4 mr-2" />
          Share
        </Button>
        <Button variant="ghost" size="sm" onClick={onRevert}>
          <RotateCcw className="h-4 w-4 mr-2" />
          Revert
        </Button>
      </div>
    </div>
  );
}
