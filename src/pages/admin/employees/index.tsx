import EmployeeManagementTable from "@/components/dashboard/EmployeeManagementTable";

const AdminEmployees = () => (
  <div className="flex flex-col gap-6">
    <div>
      <h1 className="text-2xl font-semibold text-foreground">Employees</h1>
      <p className="mt-1 text-muted-foreground">
        Manage the people in your company workspace.
      </p>
    </div>
    <EmployeeManagementTable />
  </div>
);

export default AdminEmployees;
