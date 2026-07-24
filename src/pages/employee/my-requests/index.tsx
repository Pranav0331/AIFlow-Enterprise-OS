import { useQuery } from "convex/react";
import { api } from "@/lib/convexApi";
import RequestsTable from "@/components/dashboard/RequestsTable";
import { Loader2 } from "lucide-react";

const EmployeeMyRequests = () => {
  const requests = useQuery(api.requests.listMine);

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-semibold text-foreground">My Requests</h1>
        <p className="mt-1 text-muted-foreground">
          Every request you've submitted.
        </p>
      </div>

      {requests === undefined ? (
        <div className="flex justify-center py-16">
          <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
        </div>
      ) : (
        <RequestsTable requests={requests} emptyLabel="You haven't submitted any requests yet." />
      )}
    </div>
  );
};

export default EmployeeMyRequests;
