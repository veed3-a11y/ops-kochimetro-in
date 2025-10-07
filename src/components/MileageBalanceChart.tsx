import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, Area, ComposedChart } from "recharts";

interface MileageBalanceChartProps {
  data: Array<{
    date: string;
    avgMileage: number;
    upperBand: number;
    lowerBand: number;
  }>;
}

export function MileageBalanceChart({ data }: MileageBalanceChartProps) {
  return (
    <Card className="animate-fade-in">
      <CardHeader>
        <CardTitle>Mileage Balance Over Time</CardTitle>
        <CardDescription>
          Distribution and deviation bands showing wear pattern balance across fleet
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={350}>
          <ComposedChart data={data}>
            <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
            <XAxis 
              dataKey="date" 
              className="text-xs"
              tick={{ fill: 'hsl(var(--muted-foreground))' }}
            />
            <YAxis 
              className="text-xs"
              tick={{ fill: 'hsl(var(--muted-foreground))' }}
              label={{ 
                value: 'Mileage (km)', 
                angle: -90, 
                position: 'insideLeft',
                style: { fill: 'hsl(var(--muted-foreground))', fontSize: '12px' }
              }}
            />
            <Tooltip 
              contentStyle={{
                backgroundColor: 'hsl(var(--background))',
                border: '1px solid hsl(var(--border))',
                borderRadius: '8px',
              }}
            />
            <Legend />
            
            {/* Deviation bands */}
            <Area
              type="monotone"
              dataKey="upperBand"
              stroke="none"
              fill="hsl(var(--status-warning))"
              fillOpacity={0.1}
              name="Upper Deviation"
            />
            <Area
              type="monotone"
              dataKey="lowerBand"
              stroke="none"
              fill="hsl(var(--status-warning))"
              fillOpacity={0.1}
              name="Lower Deviation"
            />
            
            {/* Average mileage line */}
            <Line 
              type="monotone" 
              dataKey="avgMileage" 
              stroke="hsl(var(--primary))" 
              strokeWidth={3}
              name="Average Mileage"
              dot={{ fill: 'hsl(var(--primary))', r: 4 }}
            />
          </ComposedChart>
        </ResponsiveContainer>
        
        <div className="mt-4 flex items-center justify-center gap-6 text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded-full bg-primary"></div>
            <span>Fleet Average</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded bg-status-warning/20"></div>
            <span>Acceptable Deviation (±15%)</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
