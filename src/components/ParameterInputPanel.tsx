import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Input } from "@/components/ui/input";
import { Settings2 } from "lucide-react";

export interface SimulationParameters {
  serviceTrainsets: number;
  maintenanceWindow: number;
  brandingAllocation: number;
  serviceInterval: number;
  energyFactor: number;
}

interface ParameterInputPanelProps {
  parameters: SimulationParameters;
  onParameterChange: (key: keyof SimulationParameters, value: number) => void;
}

export function ParameterInputPanel({ parameters, onParameterChange }: ParameterInputPanelProps) {
  return (
    <Card className="h-full animate-fade-in">
      <CardHeader className="pb-3">
        <div className="flex items-center gap-2">
          <Settings2 className="h-5 w-5 text-primary" />
          <CardTitle className="text-lg">Simulation Parameters</CardTitle>
        </div>
        <CardDescription>Adjust values to model different scenarios</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Service Trainsets */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label htmlFor="service-trainsets">Trainsets in Service</Label>
            <span className="text-sm font-medium">{parameters.serviceTrainsets}</span>
          </div>
          <Slider
            id="service-trainsets"
            min={10}
            max={25}
            step={1}
            value={[parameters.serviceTrainsets]}
            onValueChange={([value]) => onParameterChange("serviceTrainsets", value)}
            className="py-2"
          />
          <p className="text-xs text-muted-foreground">
            Current fleet capacity: 10-25 rakes
          </p>
        </div>

        {/* Maintenance Window */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label htmlFor="maintenance-window">Maintenance Window (hrs)</Label>
            <span className="text-sm font-medium">{parameters.maintenanceWindow}</span>
          </div>
          <Slider
            id="maintenance-window"
            min={2}
            max={12}
            step={0.5}
            value={[parameters.maintenanceWindow]}
            onValueChange={([value]) => onParameterChange("maintenanceWindow", value)}
            className="py-2"
          />
          <p className="text-xs text-muted-foreground">
            Daily maintenance time allocation
          </p>
        </div>

        {/* Branding Allocation */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label htmlFor="branding">Branding Allocation (%)</Label>
            <span className="text-sm font-medium">{parameters.brandingAllocation}%</span>
          </div>
          <Slider
            id="branding"
            min={0}
            max={100}
            step={5}
            value={[parameters.brandingAllocation]}
            onValueChange={([value]) => onParameterChange("brandingAllocation", value)}
            className="py-2"
          />
          <p className="text-xs text-muted-foreground">
            % of fleet allocated to advertisers
          </p>
        </div>

        {/* Service Interval */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label htmlFor="service-interval">Service Interval (days)</Label>
            <span className="text-sm font-medium">{parameters.serviceInterval}</span>
          </div>
          <Slider
            id="service-interval"
            min={15}
            max={90}
            step={5}
            value={[parameters.serviceInterval]}
            onValueChange={([value]) => onParameterChange("serviceInterval", value)}
            className="py-2"
          />
          <p className="text-xs text-muted-foreground">
            Frequency of scheduled maintenance
          </p>
        </div>

        {/* Energy Factor */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label htmlFor="energy-factor">Energy Consumption Factor</Label>
            <Input
              id="energy-factor"
              type="number"
              step="0.1"
              value={parameters.energyFactor}
              onChange={(e) => onParameterChange("energyFactor", parseFloat(e.target.value))}
              className="w-24 text-right"
            />
          </div>
          <p className="text-xs text-muted-foreground">
            kWh per rake per day (multiplier)
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
