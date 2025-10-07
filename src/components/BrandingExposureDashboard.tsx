import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, Cell } from "recharts";

interface BrandingData {
  advertiser: string;
  required: number;
  achieved: number;
}

interface BrandingExposureDashboardProps {
  data: BrandingData[];
}

export function BrandingExposureDashboard({ data }: BrandingExposureDashboardProps) {
  return (
    <Card className="animate-fade-in">
      <CardHeader>
        <CardTitle>Branding Exposure Compliance</CardTitle>
        <CardDescription>
          Required vs. achieved exposure hours per advertiser - ensuring SLA targets are met
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={350}>
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
            <XAxis 
              dataKey="advertiser" 
              className="text-xs"
              tick={{ fill: 'hsl(var(--muted-foreground))' }}
              angle={-45}
              textAnchor="end"
              height={80}
            />
            <YAxis 
              className="text-xs"
              tick={{ fill: 'hsl(var(--muted-foreground))' }}
              label={{ 
                value: 'Exposure Hours', 
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
              formatter={(value: number, name: string) => {
                if (name === "required") return [`${value} hrs`, "Required"];
                if (name === "achieved") return [`${value} hrs`, "Achieved"];
                return value;
              }}
            />
            <Legend 
              formatter={(value) => {
                if (value === "required") return "Required Exposure";
                if (value === "achieved") return "Achieved Exposure";
                return value;
              }}
            />
            <Bar 
              dataKey="required" 
              fill="hsl(var(--status-warning))" 
              name="required"
              radius={[4, 4, 0, 0]}
            />
            <Bar 
              dataKey="achieved" 
              name="achieved"
              radius={[4, 4, 0, 0]}
            >
              {data.map((entry, index) => {
                const percentage = (entry.achieved / entry.required) * 100;
                const color = percentage >= 85 
                  ? 'hsl(var(--status-ready))' 
                  : percentage >= 70 
                    ? 'hsl(var(--status-warning))' 
                    : 'hsl(var(--status-critical))';
                return <Cell key={`cell-${index}`} fill={color} />;
              })}
            </Bar>
          </BarChart>
        </ResponsiveContainer>

        <div className="mt-4 flex items-center justify-center gap-6 text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded bg-status-ready"></div>
            <span>≥85% (Compliant)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded bg-status-warning"></div>
            <span>70-85% (At Risk)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded bg-status-critical"></div>
            <span>&lt;70% (Non-Compliant)</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
