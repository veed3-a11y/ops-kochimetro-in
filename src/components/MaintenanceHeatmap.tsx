import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface HeatmapCell {
  date: string;
  day: number;
  openCards: number;
  closedCards: number;
}

interface MaintenanceHeatmapProps {
  data: HeatmapCell[];
}

export function MaintenanceHeatmap({ data }: MaintenanceHeatmapProps) {
  const getIntensityClass = (openCards: number) => {
    if (openCards === 0) return "bg-status-ready-bg/20";
    if (openCards <= 5) return "bg-status-warning-bg/30";
    if (openCards <= 10) return "bg-status-warning-bg/60";
    return "bg-status-critical-bg/60";
  };

  const weeks = [];
  for (let i = 0; i < data.length; i += 7) {
    weeks.push(data.slice(i, i + 7));
  }

  const dayLabels = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  return (
    <Card className="animate-fade-in">
      <CardHeader>
        <CardTitle>Maintenance Activity Heatmap</CardTitle>
        <CardDescription>
          Calendar view showing daily job card activity - darker cells indicate higher maintenance load
        </CardDescription>
      </CardHeader>
      <CardContent>
        <TooltipProvider>
          <div className="space-y-2">
            {/* Day labels */}
            <div className="flex gap-2 pl-12">
              {dayLabels.map((day) => (
                <div key={day} className="w-12 text-center text-xs text-muted-foreground font-medium">
                  {day}
                </div>
              ))}
            </div>

            {/* Heatmap grid */}
            <div className="space-y-2">
              {weeks.map((week, weekIdx) => (
                <div key={weekIdx} className="flex gap-2 items-center">
                  <div className="w-10 text-xs text-muted-foreground text-right">
                    Week {weekIdx + 1}
                  </div>
                  <div className="flex gap-2">
                    {week.map((cell) => (
                      <Tooltip key={cell.date}>
                        <TooltipTrigger>
                          <div
                            className={cn(
                              "w-12 h-12 rounded border transition-all hover:scale-110 hover:shadow-md cursor-pointer",
                              getIntensityClass(cell.openCards)
                            )}
                          >
                            <div className="text-[10px] font-medium text-center pt-2">
                              {cell.day}
                            </div>
                            <div className="text-[10px] text-center text-muted-foreground">
                              {cell.openCards}
                            </div>
                          </div>
                        </TooltipTrigger>
                        <TooltipContent>
                          <div className="space-y-1">
                            <p className="font-semibold">{cell.date}</p>
                            <p className="text-sm">Open: {cell.openCards}</p>
                            <p className="text-sm text-status-ready">Closed: {cell.closedCards}</p>
                          </div>
                        </TooltipContent>
                      </Tooltip>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            {/* Legend */}
            <div className="mt-6 flex items-center justify-center gap-4 text-xs text-muted-foreground">
              <span>Less</span>
              <div className="flex gap-1">
                <div className="w-4 h-4 rounded bg-status-ready-bg/20 border"></div>
                <div className="w-4 h-4 rounded bg-status-warning-bg/30 border"></div>
                <div className="w-4 h-4 rounded bg-status-warning-bg/60 border"></div>
                <div className="w-4 h-4 rounded bg-status-critical-bg/60 border"></div>
              </div>
              <span>More</span>
            </div>
          </div>
        </TooltipProvider>
      </CardContent>
    </Card>
  );
}
