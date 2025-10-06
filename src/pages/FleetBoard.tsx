import { useState } from "react";
import { TrainsetCard } from "@/components/TrainsetCard";
import { KPICard } from "@/components/KPICard";
import { mockTrainsets } from "@/data/mockTrainsets";
import { Train, AlertCircle, CheckCircle, Clock } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export default function FleetBoard() {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [locationFilter, setLocationFilter] = useState("all");

  const readyTrains = mockTrainsets.filter(t => t.status === "ready").length;
  const warningTrains = mockTrainsets.filter(t => t.status === "warning").length;
  const criticalTrains = mockTrainsets.filter(t => t.status === "critical" || t.status === "maintenance").length;
  const expiringFitness = mockTrainsets.filter(t => t.fitnessStatus === "expiring" || t.fitnessStatus === "expired").length;

  const filteredTrainsets = mockTrainsets.filter(trainset => {
    const matchesSearch = trainset.number.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         trainset.id.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === "all" || trainset.status === statusFilter;
    const matchesLocation = locationFilter === "all" || trainset.location === locationFilter;
    
    return matchesSearch && matchesStatus && matchesLocation;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold">Fleet Board</h1>
        <p className="text-muted-foreground">Real-time overview of all 25 trainsets</p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <KPICard
          title="Ready for Service"
          value={readyTrains}
          subtitle={`${((readyTrains / 25) * 100).toFixed(0)}% of fleet`}
          icon={CheckCircle}
          variant="success"
        />
        <KPICard
          title="Attention Required"
          value={warningTrains}
          subtitle="Requires monitoring"
          icon={AlertCircle}
          variant="warning"
        />
        <KPICard
          title="Critical / Maintenance"
          value={criticalTrains}
          subtitle="Not available for service"
          icon={Train}
          variant="critical"
        />
        <KPICard
          title="Fitness Expiring"
          value={expiringFitness}
          subtitle="Within 14 days"
          icon={Clock}
          variant="warning"
        />
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <Input
          placeholder="Search by train number or ID..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="sm:max-w-xs"
        />
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="sm:w-[180px]">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="ready">Ready</SelectItem>
            <SelectItem value="warning">Warning</SelectItem>
            <SelectItem value="critical">Critical</SelectItem>
            <SelectItem value="maintenance">Maintenance</SelectItem>
            <SelectItem value="inactive">Inactive</SelectItem>
          </SelectContent>
        </Select>
        <Select value={locationFilter} onValueChange={setLocationFilter}>
          <SelectTrigger className="sm:w-[180px]">
            <SelectValue placeholder="Filter by location" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Locations</SelectItem>
            <SelectItem value="Thykkoodam Depot">Thykkoodam Depot</SelectItem>
            <SelectItem value="Muttom Depot">Muttom Depot</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Trainset Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {filteredTrainsets.map((trainset) => (
          <TrainsetCard key={trainset.id} trainset={trainset} />
        ))}
      </div>

      {filteredTrainsets.length === 0 && (
        <div className="text-center py-12">
          <p className="text-muted-foreground">No trainsets match your filters</p>
        </div>
      )}
    </div>
  );
}
