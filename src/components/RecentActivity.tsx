import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Clock, Upload, CheckCircle, FileText } from "lucide-react";

interface ActivityLog {
  id: string;
  type: "upload" | "plan" | "update" | "report";
  message: string;
  user: string;
  timestamp: string;
}

interface RecentActivityProps {
  activities: ActivityLog[];
}

export function RecentActivity({ activities }: RecentActivityProps) {
  const getActivityIcon = (type: ActivityLog["type"]) => {
    switch (type) {
      case "upload":
        return <Upload className="h-4 w-4 text-primary" />;
      case "plan":
        return <CheckCircle className="h-4 w-4 text-status-ready" />;
      case "update":
        return <Clock className="h-4 w-4 text-status-warning" />;
      case "report":
        return <FileText className="h-4 w-4 text-muted-foreground" />;
    }
  };

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-lg flex items-center gap-2">
          <Clock className="h-5 w-5" />
          Recent Activity
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[200px]">
          <div className="space-y-3">
            {activities.map((activity) => (
              <div key={activity.id} className="flex items-start gap-3 text-sm">
                <div className="mt-0.5">{getActivityIcon(activity.type)}</div>
                <div className="flex-1 space-y-1">
                  <p className="text-foreground">{activity.message}</p>
                  <p className="text-xs text-muted-foreground">
                    by {activity.user} • {activity.timestamp}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
