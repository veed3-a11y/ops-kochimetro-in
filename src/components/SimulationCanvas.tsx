import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Play, Pause } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useState, useEffect } from "react";

interface SimulationCanvasProps {
  isRunning: boolean;
  onToggleSimulation: () => void;
  parameters: {
    serviceTrainsets: number;
    maintenanceWindow: number;
  };
}

export function SimulationCanvas({ isRunning, onToggleSimulation, parameters }: SimulationCanvasProps) {
  const [currentDay, setCurrentDay] = useState(1);
  const [trainsetStates, setTrainsetStates] = useState<Array<{
    id: string;
    status: "active" | "maintenance" | "standby";
  }>>([]);

  useEffect(() => {
    // Initialize trainsets based on parameters
    const states = Array.from({ length: parameters.serviceTrainsets }, (_, i) => ({
      id: `T-${String(i + 1).padStart(3, "0")}`,
      status: i < parameters.serviceTrainsets - 2 ? "active" : i === parameters.serviceTrainsets - 1 ? "maintenance" : "standby",
    })) as Array<{ id: string; status: "active" | "maintenance" | "standby" }>;
    setTrainsetStates(states);
  }, [parameters.serviceTrainsets]);

  useEffect(() => {
    if (!isRunning) return;

    const interval = setInterval(() => {
      setCurrentDay((prev) => (prev < 30 ? prev + 1 : 1));
      
      // Simulate state changes
      setTrainsetStates((prev) =>
        prev.map((trainset, idx) => {
          if (Math.random() > 0.9) {
            const statuses: Array<"active" | "maintenance" | "standby"> = ["active", "maintenance", "standby"];
            return { ...trainset, status: statuses[Math.floor(Math.random() * statuses.length)] };
          }
          return trainset;
        })
      );
    }, 1500);

    return () => clearInterval(interval);
  }, [isRunning]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-status-ready";
      case "maintenance":
        return "bg-status-warning";
      case "standby":
        return "bg-muted";
      default:
        return "bg-muted";
    }
  };

  return (
    <Card className="animate-fade-in h-full">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-lg">Simulation Timeline</CardTitle>
            <CardDescription>30-day forecast visualization</CardDescription>
          </div>
          <div className="flex items-center gap-3">
            <Badge variant="outline" className="text-sm">
              Day {currentDay} of 30
            </Badge>
            <Button
              size="sm"
              onClick={onToggleSimulation}
              className={cn(isRunning && "bg-status-critical hover:bg-status-critical/90")}
            >
              {isRunning ? (
                <>
                  <Pause className="h-4 w-4 mr-2" />
                  Pause
                </>
              ) : (
                <>
                  <Play className="h-4 w-4 mr-2" />
                  Run Simulation
                </>
              )}
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* Timeline visualization */}
          <div className="relative h-12 bg-muted/30 rounded-lg overflow-hidden">
            <div
              className="absolute h-full bg-primary/20 transition-all duration-1000"
              style={{ width: `${(currentDay / 30) * 100}%` }}
            />
            <div
              className="absolute h-full w-1 bg-primary transition-all duration-1000"
              style={{ left: `${(currentDay / 30) * 100}%` }}
            />
          </div>

          {/* Trainset Grid */}
          <div className="grid grid-cols-8 gap-2 p-4 bg-muted/20 rounded-lg">
            {trainsetStates.map((trainset) => (
              <div
                key={trainset.id}
                className={cn(
                  "relative aspect-square rounded-md transition-all duration-300 hover:scale-110 cursor-pointer group",
                  getStatusColor(trainset.status),
                  isRunning && trainset.status === "maintenance" && "animate-pulse"
                )}
                title={`${trainset.id} - ${trainset.status}`}
              >
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-xs font-medium text-foreground opacity-0 group-hover:opacity-100 transition-opacity">
                    {trainset.id.split("-")[1]}
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* Legend */}
          <div className="flex items-center justify-center gap-6 text-xs text-muted-foreground pt-2">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded bg-status-ready"></div>
              <span>Active Service</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded bg-status-warning"></div>
              <span>Under Maintenance</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded bg-muted"></div>
              <span>Standby</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
