import PlaceholderSection from "@/components/dashboard/PlaceholderSection";
import { adminNavItems } from "@/components/dashboard/dashboardNav";

const item = adminNavItems.find((nav) => nav.path === "/admin/agents")!;

const Agents = () => (
  <PlaceholderSection title={item.title} description={item.description} icon={item.icon} />
);

export default Agents;
