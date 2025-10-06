import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { mockTrainsets } from "@/data/mockTrainsets";
import { FleetCard } from "@/components/FleetCard";
import { AlertsPanel } from "@/components/AlertsPanel";
import { RecentActivity } from "@/components/RecentActivity";
import { KPICard } from "@/components/KPICard";
import { Button } from "@/components/ui/button";
import { CheckCircle, AlertTriangle, XCircle, Warehouse, Upload, RefreshCw, Settings, Zap } from "lucide-react";
import { toast } from "sonner";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

export default function PlannerCockpit() {
  const navigate = useNavigate();
  const [lastSync, setLastSync] = useState(new Date());

  const readyRakes = mockTrainsets.filter(t => 
    t.status === "ready" && 
    t.fitnessStatus === "valid" && 
    t.jobCards.critical === 0 &&
    t.cleaning.status === "completed"
  );

  const attentionRakes = mockTrainsets.filter(t => 
    t.status === "warning" || 
    t.fitnessStatus === "expiring" ||
    t.jobCards.critical > 0
  );

  const notAvailableRakes = mockTrainsets.filter(t => 
    t.status === "critical" || 
    t.status === "maintenance" ||
    t.fitnessStatus === "expired"
  );

  const occupiedBays = mockTrainsets.filter(t => t.cleaning.bay).length;
  const bayOccupancy = Math.round((occupiedBays / 25) * 100);

  // Generate alerts from trainset data
  const alerts = [
    ...mockTrainsets
      .filter(t => t.fitnessStatus === "expiring")
      .map(t => ({
        id: `fitness-${t.id}`,
        type: "fitness" as const,
        severity: "warning" as const,
        trainsetNumber: t.number,
        message: `Fitness expires in ${Math.ceil((new Date(t.fitnessExpiry).getTime() - Date.now()) / (1000 * 60 * 60 * 24))} days`,
        timestamp: "2h ago",
      })),
    ...mockTrainsets
      .filter(t => t.cleaning.status === "pending")
      .slice(0, 3)
      .map(t => ({
        id: `cleaning-${t.id}`,
        type: "cleaning" as const,
        severity: "warning" as const,
        trainsetNumber: t.number,
        message: "Cleaning pending",
        timestamp: "1h ago",
      })),
    ...mockTrainsets
      .filter(t => t.jobCards.critical > 0)
      .map(t => ({
        id: `jobcard-${t.id}`,
        type: "jobcard" as const,
        severity: "critical" as const,
        trainsetNumber: t.number,
        message: `${t.jobCards.critical} critical job card(s) open`,
        timestamp: "30m ago",
      })),
  ];

  const recentActivities = [
    { id: "1", type: "upload" as const, message: "Fitness data uploaded", user: "Rolling Stock Team", timestamp: "20:45 IST" },
    { id: "2", type: "update" as const, message: "Train 08 cleaning completed", user: "Cleaning Supervisor", timestamp: "20:30 IST" },
    { id: "3", type: "plan" as const, message: "Previous induction plan finalized", user: "Control Room", timestamp: "20:15 IST" },
    { id: "4", type: "upload" as const, message: "Job card status synced from Maximo", user: "System", timestamp: "20:00 IST" },
  ];

  const handleGeneratePlan = () => {
    toast.loading("Generating induction plan...", { duration: 1500 });
    setTimeout(() => {
      toast.success("Plan generated successfully!");
      navigate("/recommendation");
    }, 1500);
  };

  const handleRefresh = () => {
    setLastSync(new Date());
    toast.success("Data refreshed from sources");
  };

  const handleUpload = () => {
    toast.info("Upload interface coming soon");
  };

  const handleSettings = () => {
    toast.info("Settings panel coming soon");
  };

  const handleAlertClick = (alert: any) => {
    const trainset = mockTrainsets.find(t => t.number === alert.trainsetNumber);
    if (trainset) {
      toast.info(`Viewing details for Train ${alert.trainsetNumber}`);
    }
  };

  const handleRakeClick = (trainsetId: string) => {
    toast.info("Rake detail view coming soon");
  };

  return (
    <TooltipProvider>
      <div className="space-y-6 animate-fade-in">
        {/* Header Bar */}
        <div className="flex items-center justify-between pb-4 border-b">
          <div>
            <h1 className="text-3xl font-bold">Planner Cockpit</h1>
            <p className="text-sm text-muted-foreground mt-1">
              Last Sync: {lastSync.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })} IST
            </p>
          </div>
          <div className="flex gap-2">
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="outline" size="icon" onClick={handleUpload}>
                  <Upload className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Upload Data</TooltipContent>
            </Tooltip>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="outline" size="icon" onClick={handleRefresh}>
                  <RefreshCw className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Refresh Data</TooltipContent>
            </Tooltip>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="outline" size="icon" onClick={handleSettings}>
                  <Settings className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Settings</TooltipContent>
            </Tooltip>
            <Button onClick={handleGeneratePlan} size="lg" className="gap-2">
              <Zap className="h-4 w-4" />
              Generate Plan
            </Button>
          </div>
        </div>

        {/* KPI Summary Bar */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <KPICard
            title="Ready Rakes"
            value={readyRakes.length}
            subtitle="Fit for service tonight"
            icon={CheckCircle}
            variant="success"
          />
          <KPICard
            title="Attention Needed"
            value={attentionRakes.length}
            subtitle="Requires review"
            icon={AlertTriangle}
            variant="warning"
          />
          <KPICard
            title="Not Available"
            value={notAvailableRakes.length}
            subtitle="Critical or maintenance"
            icon={XCircle}
            variant="critical"
          />
          <KPICard
            title="Bay Occupancy"
            value={`${bayOccupancy}%`}
            subtitle={`${occupiedBays}/25 bays occupied`}
            icon={Warehouse}
          />
        </div>

        {/* Main Content Area */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Fleet Snapshot Grid */}
          <div className="lg:col-span-3">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold">Fleet Snapshot</h2>
                <p className="text-sm text-muted-foreground">25 trainsets</p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                {mockTrainsets.map((trainset) => (
                  <FleetCard 
                    key={trainset.id} 
                    trainset={trainset}
                    onClick={() => handleRakeClick(trainset.id)}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* Alerts Panel */}
          <div className="lg:col-span-1">
            <AlertsPanel alerts={alerts} onAlertClick={handleAlertClick} />
          </div>
        </div>

        {/* Recent Activity */}
        <RecentActivity activities={recentActivities} />
      </div>
    </TooltipProvider>
  );
}
