import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";

interface TrendChartsProps {
  utilizationData: Array<{ date: string; utilization: number }>;
  maintenanceData: Array<{ date: string; jobCards: number; resolved: number }>;
  brandingData: Array<{ date: string; exposure: number; target: number }>;
  cleaningData: Array<{ date: string; completed: number; pending: number }>;
}

export function TrendCharts({
  utilizationData,
  maintenanceData,
  brandingData,
  cleaningData,
}: TrendChartsProps) {
  return (
    <Card className="animate-fade-in">
      <CardHeader>
        <CardTitle>Trend Analysis</CardTitle>
        <CardDescription>Historical performance metrics and operational trends</CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="utilization" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="utilization">Utilization</TabsTrigger>
            <TabsTrigger value="maintenance">Maintenance</TabsTrigger>
            <TabsTrigger value="branding">Branding</TabsTrigger>
            <TabsTrigger value="cleaning">Cleaning</TabsTrigger>
          </TabsList>

          <TabsContent value="utilization" className="pt-6">
            <ResponsiveContainer width="100%" height={350}>
              <LineChart data={utilizationData}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                <XAxis 
                  dataKey="date" 
                  className="text-xs"
                  tick={{ fill: 'hsl(var(--muted-foreground))' }}
                />
                <YAxis 
                  className="text-xs"
                  tick={{ fill: 'hsl(var(--muted-foreground))' }}
                />
                <Tooltip 
                  contentStyle={{
                    backgroundColor: 'hsl(var(--background))',
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '8px',
                  }}
                />
                <Legend />
                <Line 
                  type="monotone" 
                  dataKey="utilization" 
                  stroke="hsl(var(--primary))" 
                  strokeWidth={2}
                  name="Fleet Utilization (%)"
                  dot={{ fill: 'hsl(var(--primary))' }}
                />
              </LineChart>
            </ResponsiveContainer>
          </TabsContent>

          <TabsContent value="maintenance" className="pt-6">
            <ResponsiveContainer width="100%" height={350}>
              <LineChart data={maintenanceData}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                <XAxis 
                  dataKey="date" 
                  className="text-xs"
                  tick={{ fill: 'hsl(var(--muted-foreground))' }}
                />
                <YAxis 
                  className="text-xs"
                  tick={{ fill: 'hsl(var(--muted-foreground))' }}
                />
                <Tooltip 
                  contentStyle={{
                    backgroundColor: 'hsl(var(--background))',
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '8px',
                  }}
                />
                <Legend />
                <Line 
                  type="monotone" 
                  dataKey="jobCards" 
                  stroke="hsl(var(--status-warning))" 
                  strokeWidth={2}
                  name="Open Job Cards"
                  dot={{ fill: 'hsl(var(--status-warning))' }}
                />
                <Line 
                  type="monotone" 
                  dataKey="resolved" 
                  stroke="hsl(var(--status-ready))" 
                  strokeWidth={2}
                  name="Resolved"
                  dot={{ fill: 'hsl(var(--status-ready))' }}
                />
              </LineChart>
            </ResponsiveContainer>
          </TabsContent>

          <TabsContent value="branding" className="pt-6">
            <ResponsiveContainer width="100%" height={350}>
              <LineChart data={brandingData}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                <XAxis 
                  dataKey="date" 
                  className="text-xs"
                  tick={{ fill: 'hsl(var(--muted-foreground))' }}
                />
                <YAxis 
                  className="text-xs"
                  tick={{ fill: 'hsl(var(--muted-foreground))' }}
                />
                <Tooltip 
                  contentStyle={{
                    backgroundColor: 'hsl(var(--background))',
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '8px',
                  }}
                />
                <Legend />
                <Line 
                  type="monotone" 
                  dataKey="exposure" 
                  stroke="hsl(var(--primary))" 
                  strokeWidth={2}
                  name="Achieved Exposure (hrs)"
                  dot={{ fill: 'hsl(var(--primary))' }}
                />
                <Line 
                  type="monotone" 
                  dataKey="target" 
                  stroke="hsl(var(--status-warning))" 
                  strokeWidth={2}
                  strokeDasharray="5 5"
                  name="Target Exposure (hrs)"
                  dot={{ fill: 'hsl(var(--status-warning))' }}
                />
              </LineChart>
            </ResponsiveContainer>
          </TabsContent>

          <TabsContent value="cleaning" className="pt-6">
            <ResponsiveContainer width="100%" height={350}>
              <LineChart data={cleaningData}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                <XAxis 
                  dataKey="date" 
                  className="text-xs"
                  tick={{ fill: 'hsl(var(--muted-foreground))' }}
                />
                <YAxis 
                  className="text-xs"
                  tick={{ fill: 'hsl(var(--muted-foreground))' }}
                />
                <Tooltip 
                  contentStyle={{
                    backgroundColor: 'hsl(var(--background))',
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '8px',
                  }}
                />
                <Legend />
                <Line 
                  type="monotone" 
                  dataKey="completed" 
                  stroke="hsl(var(--status-ready))" 
                  strokeWidth={2}
                  name="Completed"
                  dot={{ fill: 'hsl(var(--status-ready))' }}
                />
                <Line 
                  type="monotone" 
                  dataKey="pending" 
                  stroke="hsl(var(--status-warning))" 
                  strokeWidth={2}
                  name="Pending"
                  dot={{ fill: 'hsl(var(--status-warning))' }}
                />
              </LineChart>
            </ResponsiveContainer>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
