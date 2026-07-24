import { useQuery } from "convex/react";
import { api } from "@/lib/convexApi";
import RequestsTable from "@/components/dashboard/RequestsTable";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2 } from "lucide-react";

const STATUS_ORDER = ["pending", "approved", "rejected"] as const;
const STATUS_LABEL: Record<string, string> = {
  pending: "Pending",
  approved: "Approved",
  rejected: "Rejected",
};

const EmployeeRequestStatus = () => {
  const requests = useQuery(api.requests.listMine);

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-semibold text-foreground">Request Status</h1>
        <p className="mt-1 text-muted-foreground">
          Your requests grouped by status.
        </p>
      </div>

      {requests === undefined ? (
        <div className="flex justify-center py-16">
          <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
        </div>
      ) : (
        <div className="flex flex-col gap-6">
          {STATUS_ORDER.map((status) => {
            const group = requests.filter((r) => r.status === status);
            return (
              <Card key={status}>
                <CardHeader className="pb-2">
                  <CardTitle className="text-base">
                    {STATUS_LABEL[status]} ({group.length})
                  </CardTitle>
                </CardHeader>
                <RequestsTable
                  requests={group}
                  emptyLabel={`No ${STATUS_LABEL[status].toLowerCase()} requests.`}
                />
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default EmployeeRequestStatus;
