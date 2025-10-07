import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";

interface ComparisonData {
  day: string;
  baseline: number;
  simulated: number;
}

interface ComparisonChartProps {
  title: string;
  description: string;
  data: ComparisonData[];
  unit: string;
}

export function ComparisonChart({ title, description, data, unit }: ComparisonChartProps) {
  return (
    <Card className="animate-fade-in">
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
            <XAxis
              dataKey="day"
              className="text-xs"
              tick={{ fill: "hsl(var(--muted-foreground))" }}
            />
            <YAxis
              className="text-xs"
              tick={{ fill: "hsl(var(--muted-foreground))" }}
              label={{
                value: unit,
                angle: -90,
                position: "insideLeft",
                style: { fill: "hsl(var(--muted-foreground))", fontSize: "12px" },
              }}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "hsl(var(--background))",
                border: "1px solid hsl(var(--border))",
                borderRadius: "8px",
              }}
              formatter={(value: number) => [`${value}${unit}`, ""]}
            />
            <Legend
              formatter={(value) => {
                if (value === "baseline") return "Current Baseline";
                if (value === "simulated") return "Simulated Scenario";
                return value;
              }}
            />
            <Line
              type="monotone"
              dataKey="baseline"
              stroke="hsl(var(--muted-foreground))"
              strokeWidth={2}
              dot={false}
              name="baseline"
            />
            <Line
              type="monotone"
              dataKey="simulated"
              stroke="hsl(var(--primary))"
              strokeWidth={3}
              dot={false}
              name="simulated"
            />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
