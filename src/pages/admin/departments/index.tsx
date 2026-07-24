import DepartmentsManager from "@/components/dashboard/DepartmentsManager";

const AdminDepartments = () => (
  <div className="flex flex-col gap-6">
    <div>
      <h1 className="text-2xl font-semibold text-foreground">Departments</h1>
      <p className="mt-1 text-muted-foreground">
        Organize your company into departments.
      </p>
    </div>
    <DepartmentsManager />
  </div>
);

export default AdminDepartments;
