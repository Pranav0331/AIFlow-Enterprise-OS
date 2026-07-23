import PlaceholderSection from "@/components/dashboard/PlaceholderSection";
import { dashboardNavItems } from "@/components/dashboard/dashboardNav";

const item = dashboardNavItems.find((nav) => nav.path === "/dashboard/requests")!;

const Requests = () => (
  <PlaceholderSection title={item.title} description={item.description} icon={item.icon} />
);

export default Requests;
