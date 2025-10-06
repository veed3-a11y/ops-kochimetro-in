import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { KPICard } from "@/components/KPICard";
import { Clock, TrendingUp, AlertTriangle, Target } from "lucide-react";
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";

const planningTimeData = [
  { date: "Oct 1", time: 125 },
  { date: "Oct 2", time: 118 },
  { date: "Oct 3", time: 95 },
  { date: "Oct 4", time: 82 },
  { date: "Oct 5", time: 15 },
  { date: "Oct 6", time: 12 },
];

const mileageDistribution = [
  { range: "35-40k", count: 5 },
  { range: "40-45k", count: 8 },
  { range: "45-50k", count: 6 },
  { range: "50-55k", count: 3 },
  { range: "55-60k", count: 2 },
  { range: "60k+", count: 1 },
];

const brandingData = [
  { name: "With Branding", value: 11, color: "hsl(var(--chart-1))" },
  { name: "No Branding", value: 14, color: "hsl(var(--chart-2))" },
];

export default function Analytics() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold">Analytics & KPIs</h1>
        <p className="text-muted-foreground">Performance metrics and operational insights</p>
      </div>

      {/* KPI Summary */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <KPICard
          title="Avg Planning Time"
          value="12 mins"
          subtitle="↓ 87% from baseline"
          icon={Clock}
          variant="success"
        />
        <KPICard
          title="Missed Clearances"
          value="0"
          subtitle="Last 30 days"
          icon={Target}
          variant="success"
        />
        <KPICard
          title="Mileage Variance"
          value="4.2%"
          subtitle="Target: ≤5%"
          icon={TrendingUp}
          variant="success"
        />
        <KPICard
          title="Branding Compliance"
          value="98.5%"
          subtitle="SLA: ≥98%"
          icon={AlertTriangle}
          variant="success"
        />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Planning Time Trend */}
        <Card>
          <CardHeader>
            <CardTitle>Planning Time Reduction</CardTitle>
            <CardDescription>Minutes spent on nightly induction planning</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={planningTimeData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="date" stroke="hsl(var(--muted-foreground))" />
                <YAxis stroke="hsl(var(--muted-foreground))" />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: "hsl(var(--card))",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: "var(--radius)"
                  }}
                />
                <Line 
                  type="monotone" 
                  dataKey="time" 
                  stroke="hsl(var(--primary))" 
                  strokeWidth={2}
                  dot={{ fill: "hsl(var(--primary))", r: 4 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Mileage Distribution */}
        <Card>
          <CardHeader>
            <CardTitle>Fleet Mileage Distribution</CardTitle>
            <CardDescription>Current mileage spread across trainsets</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={mileageDistribution}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="range" stroke="hsl(var(--muted-foreground))" />
                <YAxis stroke="hsl(var(--muted-foreground))" />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: "hsl(var(--card))",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: "var(--radius)"
                  }}
                />
                <Bar dataKey="count" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Branding Coverage */}
        <Card>
          <CardHeader>
            <CardTitle>Branding Coverage</CardTitle>
            <CardDescription>Active branding wraps across fleet</CardDescription>
          </CardHeader>
          <CardContent className="flex items-center justify-center">
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={brandingData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, value }) => `${name}: ${value}`}
                  outerRadius={100}
                  fill="hsl(var(--primary))"
                  dataKey="value"
                >
                  {brandingData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Recent Activity Summary */}
        <Card>
          <CardHeader>
            <CardTitle>Last 7 Days Summary</CardTitle>
            <CardDescription>Operational highlights</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-status-ready-bg rounded-lg">
                <span className="text-sm font-medium">Successful Inductions</span>
                <span className="text-lg font-bold text-status-ready">119/119</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-accent rounded-lg">
                <span className="text-sm font-medium">Morning Punctuality</span>
                <span className="text-lg font-bold text-primary">99.6%</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-accent rounded-lg">
                <span className="text-sm font-medium">Manual Overrides</span>
                <span className="text-lg font-bold text-muted-foreground">3</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-status-warning-bg rounded-lg">
                <span className="text-sm font-medium">Fitness Renewals</span>
                <span className="text-lg font-bold text-status-warning">2 pending</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
