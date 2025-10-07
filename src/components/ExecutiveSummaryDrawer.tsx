import { X, TrendingUp, TrendingDown, Minus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

interface ExecutiveSummaryDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

const trendData = [
  { day: "Mon", availability: 92, pending: 15, delay: 8 },
  { day: "Tue", availability: 94, pending: 12, delay: 6 },
  { day: "Wed", availability: 91, pending: 18, delay: 9 },
  { day: "Thu", availability: 95, pending: 10, delay: 5 },
  { day: "Fri", availability: 96, pending: 8, delay: 4 },
  { day: "Sat", availability: 93, pending: 14, delay: 7 },
  { day: "Sun", availability: 94, pending: 11, delay: 6 },
];

const kpis = [
  {
    title: "Fleet Availability",
    value: "94%",
    change: 2.5,
    status: "up" as const,
    target: "Target: 95%",
  },
  {
    title: "Pending Job Cards",
    value: "11",
    change: -27,
    status: "down" as const,
    target: "Critical: 2",
  },
  {
    title: "Delay Risk Score",
    value: "6.2%",
    change: -15,
    status: "down" as const,
    target: "Threshold: 8%",
  },
];

export function ExecutiveSummaryDrawer({ isOpen, onClose }: ExecutiveSummaryDrawerProps) {
  if (!isOpen) return null;

  const getTrendIcon = (status: "up" | "down" | "neutral") => {
    switch (status) {
      case "up":
        return <TrendingUp className="h-4 w-4 text-status-ready" />;
      case "down":
        return <TrendingDown className="h-4 w-4 text-status-ready" />;
      case "neutral":
        return <Minus className="h-4 w-4 text-muted-foreground" />;
    }
  };

  return (
    <div className="fixed right-0 top-16 h-[calc(100vh-4rem)] w-96 bg-background border-l shadow-2xl z-40 animate-slide-in-right">
      <div className="flex items-center justify-between p-4 border-b bg-primary/5">
        <div>
          <h3 className="font-semibold text-foreground">Executive Summary</h3>
          <p className="text-xs text-muted-foreground">Real-time Fleet Intelligence</p>
        </div>
        <Button variant="ghost" size="icon" onClick={onClose}>
          <X className="h-4 w-4" />
        </Button>
      </div>

      <ScrollArea className="h-[calc(100vh-8rem)]">
        <div className="p-4 space-y-4">
          {/* Top 3 KPIs */}
          <div className="space-y-3">
            {kpis.map((kpi, index) => (
              <Card key={index} className="p-4">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <p className="text-xs text-muted-foreground mb-1">{kpi.title}</p>
                    <div className="flex items-baseline gap-2">
                      <span className="text-2xl font-bold text-foreground">{kpi.value}</span>
                      <div className="flex items-center gap-1">
                        {getTrendIcon(kpi.status)}
                        <span
                          className={`text-xs font-medium ${
                            kpi.status === "up"
                              ? "text-status-ready"
                              : kpi.status === "down"
                              ? "text-status-ready"
                              : "text-muted-foreground"
                          }`}
                        >
                          {Math.abs(kpi.change)}%
                        </span>
                      </div>
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">{kpi.target}</p>
                  </div>
                </div>
              </Card>
            ))}
          </div>

          {/* Trend Graph */}
          <Card className="p-4">
            <h4 className="text-sm font-medium text-foreground mb-3">7-Day Trend</h4>
            <ResponsiveContainer width="100%" height={200}>
              <LineChart data={trendData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis
                  dataKey="day"
                  tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }}
                />
                <YAxis tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "hsl(var(--popover))",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: "6px",
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="availability"
                  stroke="hsl(var(--chart-1))"
                  strokeWidth={2}
                  dot={{ fill: "hsl(var(--chart-1))" }}
                />
              </LineChart>
            </ResponsiveContainer>
          </Card>

          {/* Quick Insights */}
          <Card className="p-4 bg-accent/50">
            <h4 className="text-sm font-medium text-foreground mb-2">Quick Insights</h4>
            <ul className="space-y-2 text-xs text-muted-foreground">
              <li className="flex items-start gap-2">
                <span className="text-status-ready">●</span>
                <span>Fleet availability trending above target for 3 consecutive days</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-status-warning">●</span>
                <span>2 trainsets require fitness renewal within 48 hours</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary">●</span>
                <span>Simulation suggests 8% improvement with schedule optimization</span>
              </li>
            </ul>
          </Card>
        </div>
      </ScrollArea>
    </div>
  );
}
