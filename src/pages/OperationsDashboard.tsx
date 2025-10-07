import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PlanSummaryBar } from "@/components/PlanSummaryBar";
import { ReadinessGrid, RakeReadiness } from "@/components/ReadinessGrid";
import { ExceptionFeed, Exception } from "@/components/ExceptionFeed";
import { RakeDetailModal } from "@/components/RakeDetailModal";
import { ArrowLeft, RefreshCw, FileDown, CheckCheck } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { mockTrainsets } from "@/data/mockTrainsets";
import { Trainset } from "@/types/trainset";
import { toast } from "@/hooks/use-toast";

export default function OperationsDashboard() {
  const navigate = useNavigate();
  const [selectedDepot, setSelectedDepot] = useState("muttom");
  const [lastSync, setLastSync] = useState(new Date().toLocaleTimeString());
  const [selectedRake, setSelectedRake] = useState<RakeReadiness | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Mock readiness data
  const [rakesReadiness, setRakesReadiness] = useState<RakeReadiness[]>([
    {
      id: "1",
      rakeId: "Train 101",
      plannedStatus: "service",
      actualStatus: "ready",
      timeToDeparture: 45,
      alerts: [],
      depot: "muttom",
    },
    {
      id: "2",
      rakeId: "Train 102",
      plannedStatus: "service",
      actualStatus: "ready",
      timeToDeparture: 60,
      alerts: [],
      depot: "muttom",
    },
    {
      id: "3",
      rakeId: "Train 103",
      plannedStatus: "service",
      actualStatus: "delayed",
      timeToDeparture: 30,
      alerts: ["Mileage imbalance detected", "Cleaning report pending"],
      depot: "muttom",
    },
    {
      id: "4",
      rakeId: "Train 104",
      plannedStatus: "standby",
      actualStatus: "ready",
      timeToDeparture: 120,
      alerts: [],
      depot: "muttom",
    },
    {
      id: "5",
      rakeId: "Train 105",
      plannedStatus: "service",
      actualStatus: "ready",
      timeToDeparture: 90,
      alerts: [],
      depot: "thripunithura",
    },
    {
      id: "6",
      rakeId: "Train 106",
      plannedStatus: "ibl",
      actualStatus: "in-bay",
      timeToDeparture: 180,
      alerts: [],
      depot: "thripunithura",
    },
    {
      id: "7",
      rakeId: "Train 107",
      plannedStatus: "service",
      actualStatus: "ready",
      timeToDeparture: 75,
      alerts: [],
      depot: "thripunithura",
    },
    {
      id: "8",
      rakeId: "Train 108",
      plannedStatus: "standby",
      actualStatus: "ready",
      timeToDeparture: 150,
      alerts: [],
      depot: "thripunithura",
    },
  ]);

  const [exceptions, setExceptions] = useState<Exception[]>([
    {
      id: "1",
      rakeId: "Train 103",
      message: "Mileage imbalance detected - requires supervisor review",
      severity: "warning",
      timestamp: "05:32 AM",
      acknowledged: false,
    },
    {
      id: "2",
      rakeId: "Train 103",
      message: "Pending cleaning report from Bay 04",
      severity: "info",
      timestamp: "05:28 AM",
      acknowledged: false,
    },
    {
      id: "3",
      rakeId: "Train 112",
      message: "Delayed - telecom check pending",
      severity: "critical",
      timestamp: "05:15 AM",
      acknowledged: false,
    },
  ]);

  // Auto-refresh simulation every 2 minutes
  useEffect(() => {
    const interval = setInterval(() => {
      setLastSync(new Date().toLocaleTimeString());
      toast({
        title: "Data Refreshed",
        description: "Live readiness data updated",
      });
    }, 120000); // 2 minutes

    return () => clearInterval(interval);
  }, []);

  const filteredRakes = rakesReadiness.filter((rake) => rake.depot === selectedDepot);

  const stats = {
    activeRakes: rakesReadiness.filter((r) => r.plannedStatus === "service").length,
    standby: rakesReadiness.filter((r) => r.plannedStatus === "standby").length,
    ibl: rakesReadiness.filter((r) => r.plannedStatus === "ibl").length,
    deviations: rakesReadiness.filter((r) => r.actualStatus === "delayed").length,
    onTimeReadiness: 99.5,
  };

  const handleRakeClick = (rake: RakeReadiness) => {
    setSelectedRake(rake);
    setIsModalOpen(true);
  };

  const handleAcknowledge = (id: string) => {
    setExceptions((prev) =>
      prev.map((ex) => (ex.id === id ? { ...ex, acknowledged: !ex.acknowledged } : ex))
    );
    toast({
      title: "Alert Acknowledged",
      description: "Exception has been marked as reviewed",
    });
  };

  const handleAcknowledgeAll = () => {
    setExceptions((prev) => prev.map((ex) => ({ ...ex, acknowledged: true })));
    toast({
      title: "All Alerts Acknowledged",
      description: "All exceptions have been marked as reviewed",
    });
  };

  const handleSync = () => {
    setLastSync(new Date().toLocaleTimeString());
    toast({
      title: "Synced with Depot Log",
      description: "Latest depot data synchronized successfully",
    });
  };

  const handleGenerateReport = () => {
    toast({
      title: "Generating Morning Report",
      description: "Please wait while we compile the readiness summary...",
    });
    
    setTimeout(() => {
      toast({
        title: "Report Generated",
        description: "Morning readiness report has been created successfully",
      });
    }, 2000);
  };

  // Find matching trainset data for the selected rake
  const getTrainsetData = (rakeId: string): Trainset | null => {
    return mockTrainsets.find((t) => t.number === rakeId) || null;
  };

  return (
    <div className="min-h-screen bg-background p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between animate-fade-in">
        <div className="flex items-center gap-4">
          <Button variant="outline" size="sm" onClick={() => navigate("/validation")}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Validation
          </Button>
          <div>
            <h1 className="text-3xl font-bold">Operations Dashboard</h1>
            <p className="text-sm text-muted-foreground">
              Morning command center • Last sync: {lastSync}
            </p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={handleSync}>
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
        </div>
      </div>

      {/* Plan Summary */}
      <PlanSummaryBar {...stats} />

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Readiness Grid (2/3 width) */}
        <div className="lg:col-span-2 space-y-4">
          <Tabs value={selectedDepot} onValueChange={setSelectedDepot}>
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="muttom">Muttom Depot</TabsTrigger>
              <TabsTrigger value="thripunithura">Thripunithura Depot</TabsTrigger>
            </TabsList>

            <TabsContent value="muttom" className="mt-4">
              <ReadinessGrid rakes={filteredRakes} onRakeClick={handleRakeClick} />
            </TabsContent>

            <TabsContent value="thripunithura" className="mt-4">
              <ReadinessGrid rakes={filteredRakes} onRakeClick={handleRakeClick} />
            </TabsContent>
          </Tabs>
        </div>

        {/* Exception Feed (1/3 width) */}
        <div>
          <ExceptionFeed exceptions={exceptions} onAcknowledge={handleAcknowledge} />
        </div>
      </div>

      {/* Bottom Action Bar */}
      <div className="sticky bottom-0 bg-background/95 backdrop-blur-sm border-t p-4 flex items-center justify-between animate-fade-in">
        <div className="flex gap-4 text-sm">
          <div>
            <span className="text-muted-foreground">Ready: </span>
            <span className="font-bold text-status-ready">
              {rakesReadiness.filter((r) => r.actualStatus === "ready").length}
            </span>
          </div>
          <div>
            <span className="text-muted-foreground">Delayed: </span>
            <span className="font-bold text-status-warning">
              {rakesReadiness.filter((r) => r.actualStatus === "delayed").length}
            </span>
          </div>
          <div>
            <span className="text-muted-foreground">Unacknowledged Alerts: </span>
            <span className="font-bold">
              {exceptions.filter((e) => !e.acknowledged).length}
            </span>
          </div>
        </div>

        <div className="flex gap-2">
          <Button variant="outline" onClick={handleAcknowledgeAll}>
            <CheckCheck className="h-4 w-4 mr-2" />
            Acknowledge All Alerts
          </Button>
          <Button variant="outline" onClick={handleGenerateReport}>
            <FileDown className="h-4 w-4 mr-2" />
            Generate Morning Report
          </Button>
        </div>
      </div>

      {/* Rake Detail Modal */}
      <RakeDetailModal
        rake={selectedRake}
        trainsetData={selectedRake ? getTrainsetData(selectedRake.rakeId) : null}
        open={isModalOpen}
        onOpenChange={setIsModalOpen}
      />
    </div>
  );
}
