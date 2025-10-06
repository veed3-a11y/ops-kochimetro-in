import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { FileText } from "lucide-react";

export interface AuditLogEntry {
  id: string;
  timestamp: string;
  user: string;
  action: string;
  trainsetNumber: string;
  details: string;
  note?: string;
}

interface AuditLogViewerProps {
  entries: AuditLogEntry[];
}

export function AuditLogViewer({ entries }: AuditLogViewerProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg flex items-center gap-2">
          <FileText className="h-5 w-5" />
          Audit Trail
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[300px]">
          {entries.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <FileText className="h-8 w-8 mx-auto mb-2 opacity-50" />
              <p className="text-sm">No manual overrides recorded</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[140px]">Timestamp</TableHead>
                  <TableHead>User</TableHead>
                  <TableHead>Action</TableHead>
                  <TableHead>Train</TableHead>
                  <TableHead>Details</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {entries.map((entry) => (
                  <TableRow key={entry.id} className="text-sm">
                    <TableCell className="text-xs text-muted-foreground">
                      {entry.timestamp}
                    </TableCell>
                    <TableCell className="font-medium">{entry.user}</TableCell>
                    <TableCell>
                      <Badge variant="outline" className="text-xs">
                        {entry.action}
                      </Badge>
                    </TableCell>
                    <TableCell className="font-medium">
                      Train {entry.trainsetNumber}
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {entry.details}
                      {entry.note && (
                        <div className="text-xs mt-1 italic">Note: {entry.note}</div>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
