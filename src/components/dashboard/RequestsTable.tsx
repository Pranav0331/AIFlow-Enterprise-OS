import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Check, X } from "lucide-react";

const STATUS_VARIANT: Record<string, "default" | "secondary" | "destructive"> = {
  pending: "secondary",
  approved: "default",
  rejected: "destructive",
};

const CATEGORY_LABEL: Record<string, string> = {
  leave: "Leave",
  expense: "Expense",
  equipment: "Equipment",
  other: "Other",
};

export interface RequestRow {
  _id: string;
  title: string;
  category: string;
  description?: string;
  status: "pending" | "approved" | "rejected";
  requestedBy: string;
  _creationTime: number;
}

interface RequestsTableProps {
  requests: RequestRow[];
  /** Map of userId -> display name, shown as a "Requested by" column when provided. */
  requesterNames?: Record<string, string>;
  /** Shows Approve/Reject buttons on pending rows when provided. */
  onApprove?: (requestId: string) => void;
  onReject?: (requestId: string) => void;
  emptyLabel?: string;
}

/**
 * Generic requests list reused across Admin (read-only tenant-wide),
 * HR (approve/reject), Manager (team requests / pending approvals /
 * history), and Employee (my requests / request status) pages.
 */
const RequestsTable = ({
  requests,
  requesterNames,
  onApprove,
  onReject,
  emptyLabel = "No requests yet.",
}: RequestsTableProps) => {
  const actionable = Boolean(onApprove || onReject);

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Title</TableHead>
          <TableHead>Category</TableHead>
          {requesterNames && <TableHead>Requested by</TableHead>}
          <TableHead>Status</TableHead>
          {actionable && <TableHead className="text-right">Actions</TableHead>}
        </TableRow>
      </TableHeader>
      <TableBody>
        {requests.length === 0 && (
          <TableRow>
            <TableCell
              colSpan={2 + (requesterNames ? 1 : 0) + 1 + (actionable ? 1 : 0)}
              className="text-center text-muted-foreground"
            >
              {emptyLabel}
            </TableCell>
          </TableRow>
        )}
        {requests.map((request) => (
          <TableRow key={request._id}>
            <TableCell>
              <div className="font-medium text-foreground">{request.title}</div>
              {request.description && (
                <div className="text-xs text-muted-foreground">{request.description}</div>
              )}
            </TableCell>
            <TableCell>{CATEGORY_LABEL[request.category] ?? request.category}</TableCell>
            {requesterNames && (
              <TableCell>{requesterNames[request.requestedBy] ?? "Unknown"}</TableCell>
            )}
            <TableCell>
              <Badge variant={STATUS_VARIANT[request.status]} className="capitalize">
                {request.status}
              </Badge>
            </TableCell>
            {actionable && (
              <TableCell className="text-right">
                {request.status === "pending" ? (
                  <div className="flex justify-end gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => onApprove?.(request._id)}
                    >
                      <Check className="h-4 w-4" />
                      Approve
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => onReject?.(request._id)}
                    >
                      <X className="h-4 w-4" />
                      Reject
                    </Button>
                  </div>
                ) : (
                  <span className="text-xs text-muted-foreground">Reviewed</span>
                )}
              </TableCell>
            )}
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export default RequestsTable;
