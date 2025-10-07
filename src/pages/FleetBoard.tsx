import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FleetTable } from "@/components/FleetTable";
import { DataHealthBar } from "@/components/DataHealthBar";
import { KPICard } from "@/components/KPICard";
import { mockTrainsets } from "@/data/mockTrainsets";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { CheckCircle, AlertTriangle, XCircle, Upload, RefreshCw, Settings, Zap } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { toast } from "sonner";

export default function FleetBoard() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [bayFilter, setBayFilter] = useState("all");
  const [brandingFilter, setBrandingFilter] = useState("all");
  const [lastSync, setLastSync] = useState(new Date());

  // Calculate KPIs
  const readyTrains = mockTrainsets.filter(t => 
    t.status === "ready" && 
    t.fitnessStatus === "valid" && 
    t.jobCards.critical === 0 &&
    t.cleaning.status === "completed"
  ).length;

  const attentionTrains = mockTrainsets.filter(t => 
    t.status === "warning" || 
    t.fitnessStatus === "expiring" ||
    t.jobCards.critical > 0
  ).length;

  const notAvailableTrains = mockTrainsets.filter(t => 
    t.status === "critical" || 
    t.status === "maintenance" ||
    t.fitnessStatus === "expired"
  ).length;

  // Data health calculation
  const dataFreshness = 92; // Mock value
  const staleDataSources = ["Telecom fitness data", "Bay 03 cleaning log"];

  // Filtering logic
  const filteredTrainsets = mockTrainsets.filter(trainset => {
    const matchesSearch = trainset.number.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         trainset.id.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesStatus = statusFilter === "all" || 
      (statusFilter === "ready" && trainset.status === "ready" && trainset.fitnessStatus === "valid" && trainset.jobCards.critical === 0 && trainset.cleaning.status === "completed") ||
      (statusFilter === "attention" && (trainset.status === "warning" || trainset.fitnessStatus === "expiring" || trainset.jobCards.critical > 0)) ||
      (statusFilter === "not-available" && (trainset.status === "critical" || trainset.status === "maintenance" || trainset.fitnessStatus === "expired"));
    
    const matchesBay = bayFilter === "all" || trainset.cleaning.bay === bayFilter;
    
    const matchesBranding = brandingFilter === "all" ||
      (brandingFilter === "high" && trainset.branding) ||
      (brandingFilter === "none" && !trainset.branding);
    
    return matchesSearch && matchesStatus && matchesBay && matchesBranding;
  });

  // const handleGeneratePlan = () => {
  //   if (dataFreshness < 90) {
  //     toast.warning("Data freshness below 90%", {
  //       description: "Consider refreshing data before generating plan",
  //     });
  //     return;
  //   }
    
  //   toast.loading("Generating induction plan...", { duration: 1500 });
  //   setTimeout(() => {
  //     toast.success("Plan generated successfully!");
  //     navigate("/recommendation");
  //   }, 1500);
  // };

  const handleGeneratePlan = () => {
  if (dataFreshness < 90) {
    toast.warning("Data freshness below 90%", {
      description: "Consider refreshing data before generating plan",
    });
    return;
  }
  
  const planPromise = new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve("success");
    }, 1500);
  });

  toast.promise(planPromise, {
    loading: 'Publishing induction plan...',
    success: 'Induction plan published!',
    error: 'Failed to publish induction plan',
  });

  planPromise.then(() => {
    navigate("/recommendation");
  }).catch(() => {
    console.error("Plan generation failed");
  });
};


  const handleRefresh = () => {
    setLastSync(new Date());
    toast.success("Data refreshed from all sources");
  };

  const handleUpload = () => {
    toast.info("Upload interface coming soon");
  };

  const handleSettings = () => {
    toast.info("Settings panel coming soon");
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
            <h1 className="text-3xl font-bold">Fleet Board</h1>
            <p className="text-sm text-muted-foreground mt-1">
              Detailed operational status • Last Sync: {lastSync.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })} IST
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
          </div>
        </div>

        {/* Data Health Bar */}
        <DataHealthBar 
          freshnessPercentage={dataFreshness} 
          staleDataSources={staleDataSources}
        />

        {/* Filters Toolbar */}
        <Card>
          <CardContent className="pt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <Input
                placeholder="Search Rake ID..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="h-10"
              />
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="h-10">
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent className="z-50 bg-background">
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="ready">Ready</SelectItem>
                  <SelectItem value="attention">Attention Needed</SelectItem>
                  <SelectItem value="not-available">Not Available</SelectItem>
                </SelectContent>
              </Select>
              <Select value={bayFilter} onValueChange={setBayFilter}>
                <SelectTrigger className="h-10">
                  <SelectValue placeholder="Filter by bay" />
                </SelectTrigger>
                <SelectContent className="z-50 bg-background">
                  <SelectItem value="all">All Bays</SelectItem>
                  {Array.from({ length: 8 }, (_, i) => (
                    <SelectItem key={i + 1} value={`Bay ${String(i + 1).padStart(2, '0')}`}>
                      Bay {String(i + 1).padStart(2, '0')}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={brandingFilter} onValueChange={setBrandingFilter}>
                <SelectTrigger className="h-10">
                  <SelectValue placeholder="Filter by branding" />
                </SelectTrigger>
                <SelectContent className="z-50 bg-background">
                  <SelectItem value="all">All Branding</SelectItem>
                  <SelectItem value="high">Has Branding</SelectItem>
                  <SelectItem value="none">No Branding</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Fleet Table */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <p className="text-sm text-muted-foreground">
              Showing {filteredTrainsets.length} of {mockTrainsets.length} trainsets
            </p>
          </div>
          <FleetTable trainsets={filteredTrainsets} onRakeClick={handleRakeClick} />
        </div>

        {/* Bottom Summary Panel */}
        <Card className="border-2">
          <CardContent className="pt-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="flex items-center gap-3">
                <CheckCircle className="h-8 w-8 text-status-ready" />
                <div>
                  <div className="text-2xl font-bold">{readyTrains}</div>
                  <p className="text-sm text-muted-foreground">Ready for Service</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <AlertTriangle className="h-8 w-8 text-status-warning" />
                <div>
                  <div className="text-2xl font-bold">{attentionTrains}</div>
                  <p className="text-sm text-muted-foreground">Attention Required</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <XCircle className="h-8 w-8 text-status-critical" />
                <div>
                  <div className="text-2xl font-bold">{notAvailableTrains}</div>
                  <p className="text-sm text-muted-foreground">Not Available</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Floating CTA */}
        <div className="fixed bottom-8 right-8 z-50">
          <Tooltip>
            <TooltipTrigger asChild>
              <Button 
                size="lg" 
                className="h-14 px-6 shadow-lg gap-2 animate-pulse hover:animate-none"
                onClick={handleGeneratePlan}
              >
                <Zap className="h-5 w-5" />
                Generate Ranked Plan
              </Button>
            </TooltipTrigger>
            <TooltipContent side="left">
              <p>Create AI-powered induction plan</p>
            </TooltipContent>
          </Tooltip>
        </div>
      </div>
    </TooltipProvider>
  );
}

