import RoleManagementTable from "@/components/dashboard/RoleManagementTable";

const AdminHr = () => (
  <div className="flex flex-col gap-6">
    <div>
      <h1 className="text-2xl font-semibold text-foreground">HR</h1>
      <p className="mt-1 text-muted-foreground">
        Promote teammates to HR, Manager, or Employee roles.
      </p>
    </div>
    <RoleManagementTable />
  </div>
);

export default AdminHr;
