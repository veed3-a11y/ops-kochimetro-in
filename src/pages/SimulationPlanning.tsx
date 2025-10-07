import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { SimulationToolbar } from "@/components/SimulationToolbar";
import { ParameterInputPanel, SimulationParameters } from "@/components/ParameterInputPanel";
import { SimulationCanvas } from "@/components/SimulationCanvas";
import { SimulationResultsPanel } from "@/components/SimulationResultsPanel";
import { ComparisonChart } from "@/components/ComparisonChart";
import { toast } from "sonner";

export default function SimulationPlanning() {
  const navigate = useNavigate();
  const [selectedScenario, setSelectedScenario] = useState("baseline");
  const [isSimulationRunning, setIsSimulationRunning] = useState(false);
  
  const [parameters, setParameters] = useState<SimulationParameters>({
    serviceTrainsets: 18,
    maintenanceWindow: 6,
    brandingAllocation: 45,
    serviceInterval: 30,
    energyFactor: 1.0,
  });

  const [metrics, setMetrics] = useState([
    { label: "Fleet Availability", value: "94.5%", change: 0, unit: "%" },
    { label: "Maintenance Load", value: "12 hrs/day", change: 0, unit: " hrs" },
    { label: "Branding SLA Compliance", value: "98%", change: 0, unit: "%" },
    { label: "Predicted Delay Probability", value: "2.3%", change: 0, unit: "%" },
    { label: "Energy Savings", value: "€1,200/mo", change: 0, unit: "%" },
  ]);

  // Generate comparison data
  const [comparisonData, setComparisonData] = useState({
    availability: Array.from({ length: 30 }, (_, i) => ({
      day: `D${i + 1}`,
      baseline: 92 + Math.random() * 4,
      simulated: 93 + Math.random() * 4,
    })),
    maintenance: Array.from({ length: 30 }, (_, i) => ({
      day: `D${i + 1}`,
      baseline: 10 + Math.random() * 3,
      simulated: 9 + Math.random() * 2.5,
    })),
    cost: Array.from({ length: 30 }, (_, i) => ({
      day: `D${i + 1}`,
      baseline: 5000 + Math.random() * 1000,
      simulated: 4500 + Math.random() * 800,
    })),
  });

  const handleParameterChange = (key: keyof SimulationParameters, value: number) => {
    setParameters((prev) => ({ ...prev, [key]: value }));
    recalculateMetrics({ ...parameters, [key]: value });
  };

  const recalculateMetrics = (params: SimulationParameters) => {
    // Simulate metric calculations based on parameters
    const availabilityChange = ((params.serviceTrainsets - 18) * 0.5);
    const maintenanceChange = ((params.maintenanceWindow - 6) * 0.3);
    const brandingChange = ((params.brandingAllocation - 45) * 0.1);
    const delayChange = -((params.serviceInterval - 30) * 0.05);
    const energyChange = ((1.0 - params.energyFactor) * 15);

    setMetrics([
      {
        label: "Fleet Availability",
        value: `${(94.5 + availabilityChange).toFixed(1)}%`,
        change: Number(availabilityChange.toFixed(1)),
        unit: "%",
      },
      {
        label: "Maintenance Load",
        value: `${(12 + maintenanceChange).toFixed(1)} hrs/day`,
        change: Number(maintenanceChange.toFixed(1)),
        unit: " hrs",
      },
      {
        label: "Branding SLA Compliance",
        value: `${(98 + brandingChange).toFixed(0)}%`,
        change: Number(brandingChange.toFixed(1)),
        unit: "%",
      },
      {
        label: "Predicted Delay Probability",
        value: `${(2.3 + delayChange).toFixed(1)}%`,
        change: Number(delayChange.toFixed(1)),
        unit: "%",
      },
      {
        label: "Energy Savings",
        value: `€${(1200 + energyChange * 80).toFixed(0)}/mo`,
        change: Number(energyChange.toFixed(1)),
        unit: "%",
      },
    ]);

    // Update comparison charts with new simulated data
    setComparisonData({
      availability: Array.from({ length: 30 }, (_, i) => ({
        day: `D${i + 1}`,
        baseline: 92 + Math.random() * 4,
        simulated: 93 + availabilityChange + Math.random() * 3,
      })),
      maintenance: Array.from({ length: 30 }, (_, i) => ({
        day: `D${i + 1}`,
        baseline: 10 + Math.random() * 3,
        simulated: 9 + maintenanceChange + Math.random() * 2,
      })),
      cost: Array.from({ length: 30 }, (_, i) => ({
        day: `D${i + 1}`,
        baseline: 5000 + Math.random() * 1000,
        simulated: 4500 - energyChange * 50 + Math.random() * 800,
      })),
    });
  };

  const handleScenarioChange = (scenario: string) => {
    setSelectedScenario(scenario);
    
    // Load predefined parameters for different scenarios
    switch (scenario) {
      case "baseline":
        setParameters({
          serviceTrainsets: 18,
          maintenanceWindow: 6,
          brandingAllocation: 45,
          serviceInterval: 30,
          energyFactor: 1.0,
        });
        break;
      case "peak-demand":
        setParameters({
          serviceTrainsets: 22,
          maintenanceWindow: 4,
          brandingAllocation: 60,
          serviceInterval: 45,
          energyFactor: 1.2,
        });
        break;
      case "maintenance-intensive":
        setParameters({
          serviceTrainsets: 15,
          maintenanceWindow: 10,
          brandingAllocation: 30,
          serviceInterval: 20,
          energyFactor: 0.9,
        });
        break;
      case "reduced-fleet":
        setParameters({
          serviceTrainsets: 14,
          maintenanceWindow: 8,
          brandingAllocation: 35,
          serviceInterval: 25,
          energyFactor: 0.85,
        });
        break;
    }
    toast.success(`Loaded ${scenario} scenario`);
  };

  const handleCreateNew = () => {
    setSelectedScenario("custom");
    toast.info("Create your custom scenario by adjusting parameters");
  };

  const handleSave = () => {
    toast.success("Scenario saved successfully");
  };

  const handleCompare = () => {
    toast.info("Comparison view activated - see charts below");
  };

  const handleRevert = () => {
    handleScenarioChange("baseline");
    toast.info("Reverted to baseline scenario");
  };

  const handleShare = () => {
    toast.success("Executive report generated and shared");
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b bg-card px-6 py-4">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="sm" onClick={() => navigate("/analytics")}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Analytics
          </Button>
          <div className="flex-1">
            <h1 className="text-2xl font-bold">Simulation & What-If Planning</h1>
            <p className="text-sm text-muted-foreground">
              Model future scenarios to optimize fleet operations
            </p>
          </div>
        </div>
      </div>

      {/* Scenario Toolbar */}
      <SimulationToolbar
        selectedScenario={selectedScenario}
        onScenarioChange={handleScenarioChange}
        onCreateNew={handleCreateNew}
        onSave={handleSave}
        onCompare={handleCompare}
        onRevert={handleRevert}
        onShare={handleShare}
      />

      {/* Main Content */}
      <div className="p-6 space-y-6">
        {/* Top Section: Parameters + Canvas + Results */}
        <div className="grid grid-cols-12 gap-6">
          {/* Parameter Panel - Left */}
          <div className="col-span-3">
            <ParameterInputPanel
              parameters={parameters}
              onParameterChange={handleParameterChange}
            />
          </div>

          {/* Simulation Canvas - Center */}
          <div className="col-span-6">
            <SimulationCanvas
              isRunning={isSimulationRunning}
              onToggleSimulation={() => setIsSimulationRunning(!isSimulationRunning)}
              parameters={parameters}
            />
          </div>

          {/* Results Panel - Right */}
          <div className="col-span-3">
            <SimulationResultsPanel metrics={metrics} />
          </div>
        </div>

        {/* Comparison Charts Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <ComparisonChart
            title="Fleet Availability Forecast"
            description="Current vs. Simulated availability over 30 days"
            data={comparisonData.availability}
            unit="%"
          />
          <ComparisonChart
            title="Maintenance Hours Projection"
            description="Daily maintenance workload comparison"
            data={comparisonData.maintenance}
            unit=" hrs"
          />
          <ComparisonChart
            title="Operational Cost Impact"
            description="Estimated daily cost differential"
            data={comparisonData.cost}
            unit=" €"
          />
        </div>
      </div>
    </div>
  );
}
