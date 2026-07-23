import PlaceholderSection from "@/components/dashboard/PlaceholderSection";
import { dashboardNavItems } from "@/components/dashboard/dashboardNav";

const item = dashboardNavItems.find((nav) => nav.path === "/dashboard/managers")!;

const Managers = () => (
  <PlaceholderSection title={item.title} description={item.description} icon={item.icon} />
);

export default Managers;
