import { useState } from "react";
import { Button } from "@/components/ui/button";
import { AnalyticsKPITiles } from "@/components/AnalyticsKPITiles";
import { TrendCharts } from "@/components/TrendCharts";
import { MileageBalanceChart } from "@/components/MileageBalanceChart";
import { MaintenanceHeatmap } from "@/components/MaintenanceHeatmap";
import { BrandingExposureDashboard } from "@/components/BrandingExposureDashboard";
import { PredictiveMaintenancePanel, AtRiskRake } from "@/components/PredictiveMaintenancePanel";
import { Calendar, FileDown, Search, Filter } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { format } from "date-fns";

export default function Analytics() {
  const [dateRange, setDateRange] = useState<{ from: Date; to: Date }>({
    from: new Date(2025, 9, 1), // Oct 1, 2025
    to: new Date(2025, 9, 30), // Oct 30, 2025
  });

  // Mock data
  const kpiData = {
    fleetAvailability: 92,
    avgMileageDeviation: 12.5,
    brandingCompliance: 94,
    maintenanceAccuracy: 87,
  };

  const utilizationData = [
    { date: "Oct 1", utilization: 88 },
    { date: "Oct 5", utilization: 91 },
    { date: "Oct 10", utilization: 89 },
    { date: "Oct 15", utilization: 93 },
    { date: "Oct 20", utilization: 92 },
    { date: "Oct 25", utilization: 94 },
    { date: "Oct 30", utilization: 92 },
  ];

  const maintenanceData = [
    { date: "Oct 1", jobCards: 15, resolved: 12 },
    { date: "Oct 5", jobCards: 18, resolved: 14 },
    { date: "Oct 10", jobCards: 12, resolved: 10 },
    { date: "Oct 15", jobCards: 20, resolved: 18 },
    { date: "Oct 20", jobCards: 16, resolved: 15 },
    { date: "Oct 25", jobCards: 14, resolved: 13 },
    { date: "Oct 30", jobCards: 11, resolved: 10 },
  ];

  const brandingData = [
    { date: "Oct 1", exposure: 180, target: 200 },
    { date: "Oct 5", exposure: 195, target: 200 },
    { date: "Oct 10", exposure: 205, target: 200 },
    { date: "Oct 15", exposure: 198, target: 200 },
    { date: "Oct 20", exposure: 210, target: 200 },
    { date: "Oct 25", exposure: 192, target: 200 },
    { date: "Oct 30", exposure: 203, target: 200 },
  ];

  const cleaningData = [
    { date: "Oct 1", completed: 22, pending: 3 },
    { date: "Oct 5", completed: 24, pending: 1 },
    { date: "Oct 10", completed: 23, pending: 2 },
    { date: "Oct 15", completed: 25, pending: 0 },
    { date: "Oct 20", completed: 24, pending: 1 },
    { date: "Oct 25", completed: 23, pending: 2 },
    { date: "Oct 30", completed: 25, pending: 0 },
  ];

  const mileageBalanceData = [
    { date: "Oct 1", avgMileage: 42000, upperBand: 48300, lowerBand: 35700 },
    { date: "Oct 5", avgMileage: 43200, upperBand: 49680, lowerBand: 36720 },
    { date: "Oct 10", avgMileage: 44100, upperBand: 50715, lowerBand: 37485 },
    { date: "Oct 15", avgMileage: 45000, upperBand: 51750, lowerBand: 38250 },
    { date: "Oct 20", avgMileage: 45800, upperBand: 52670, lowerBand: 38930 },
    { date: "Oct 25", avgMileage: 46500, upperBand: 53475, lowerBand: 39525 },
    { date: "Oct 30", avgMileage: 47200, upperBand: 54280, lowerBand: 40120 },
  ];

  const heatmapData = Array.from({ length: 28 }, (_, i) => ({
    date: `Oct ${i + 1}`,
    day: i + 1,
    openCards: Math.floor(Math.random() * 15),
    closedCards: Math.floor(Math.random() * 10) + 5,
  }));

  const brandingExposureData = [
    { advertiser: "Brand A", required: 200, achieved: 195 },
    { advertiser: "Brand B", required: 180, achieved: 185 },
    { advertiser: "Brand C", required: 150, achieved: 142 },
    { advertiser: "Brand D", required: 220, achieved: 210 },
    { advertiser: "Brand E", required: 190, achieved: 175 },
  ];

  const atRiskRakes: AtRiskRake[] = [
    {
      id: "1",
      rakeId: "Train 105",
      riskScore: 85,
      predictedIssue: "Brake system degradation",
      daysToFailure: 12,
      confidence: 89,
    },
    {
      id: "2",
      rakeId: "Train 112",
      riskScore: 72,
      predictedIssue: "Door mechanism wear",
      daysToFailure: 18,
      confidence: 76,
    },
    {
      id: "3",
      rakeId: "Train 108",
      riskScore: 68,
      predictedIssue: "HVAC performance decline",
      daysToFailure: 25,
      confidence: 82,
    },
  ];

  const handleDrillDown = (rakeId: string) => {
    toast({
      title: "Rake Details",
      description: `Opening detailed analysis for ${rakeId}...`,
    });
  };

  const handleExport = () => {
    toast({
      title: "Exporting Report",
      description: "Generating comprehensive analytics report...",
    });

    setTimeout(() => {
      toast({
        title: "Report Generated",
        description: "Analytics report has been exported successfully",
      });
    }, 2000);
  };

  const handleViewRawData = () => {
    toast({
      title: "Raw Data View",
      description: "Opening detailed data explorer...",
    });
  };

  return (
    <div className="space-y-6 pb-24">
      {/* Header */}
      <div className="flex items-start justify-between animate-fade-in">
        <div>
          <h1 className="text-3xl font-bold">Analytics & Insights</h1>
          <p className="text-muted-foreground">
            Strategic intelligence for better planning, maintenance, and optimization
          </p>
        </div>
        <div className="flex gap-2">
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" size="sm">
                <Calendar className="h-4 w-4 mr-2" />
                {format(dateRange.from, "MMM d")} - {format(dateRange.to, "MMM d")}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="end">
              <CalendarComponent
                mode="single"
                selected={dateRange.from}
                onSelect={(date) => date && setDateRange({ ...dateRange, from: date })}
                className="pointer-events-auto"
              />
            </PopoverContent>
          </Popover>
          <Button variant="outline" size="sm">
            <Filter className="h-4 w-4 mr-2" />
            Filters
          </Button>
        </div>
      </div>

      {/* KPI Overview */}
      <AnalyticsKPITiles {...kpiData} />

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Charts (2/3 width) */}
        <div className="lg:col-span-2 space-y-6">
          {/* Trend Charts */}
          <TrendCharts
            utilizationData={utilizationData}
            maintenanceData={maintenanceData}
            brandingData={brandingData}
            cleaningData={cleaningData}
          />

          {/* Mileage Balance Chart */}
          <MileageBalanceChart data={mileageBalanceData} />

          {/* Bottom Row - Heatmap and Branding */}
          <div className="grid grid-cols-1 gap-6">
            <MaintenanceHeatmap data={heatmapData} />
            <BrandingExposureDashboard data={brandingExposureData} />
          </div>
        </div>

        {/* Right Column - Predictive Maintenance Panel (1/3 width) */}
        <div className="lg:col-span-1">
          <PredictiveMaintenancePanel
            atRiskRakes={atRiskRakes}
            lastUpdated="14:30 IST"
            onDrillDown={handleDrillDown}
          />
        </div>
      </div>

      {/* Bottom Action Bar */}
      <div className="fixed bottom-0 left-0 right-0 z-50 border-t bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex items-center justify-between h-16 px-6">
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <span>
              Showing data from {format(dateRange.from, "MMM d")} to {format(dateRange.to, "MMM d, yyyy")}
            </span>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={handleViewRawData}>
              <Search className="h-4 w-4 mr-2" />
              View Raw Data
            </Button>
            <Button onClick={handleExport}>
              <FileDown className="h-4 w-4 mr-2" />
              Export Report
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
