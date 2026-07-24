import PoliciesManager from "@/components/dashboard/PoliciesManager";

const AdminPolicies = () => (
  <div className="flex flex-col gap-6">
    <div>
      <h1 className="text-2xl font-semibold text-foreground">Policies</h1>
      <p className="mt-1 text-muted-foreground">
        Define the rules AI agents and staff operate under.
      </p>
    </div>
    <PoliciesManager />
  </div>
);

export default AdminPolicies;
