import { Link } from "react-router-dom";
import { useQuery } from "convex/react";
import { api } from "@/lib/convexApi";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { adminNavItems } from "@/components/dashboard/dashboardNav";
import { ArrowRight } from "lucide-react";

const AdminOverview = () => {
  const currentUser = useQuery(api.users.currentUser);

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-semibold text-foreground">
          Welcome{currentUser?.name ? `, ${currentUser.name}` : ""}
        </h1>
        <p className="mt-1 text-muted-foreground">
          Here's an overview of your company workspace.
        </p>
      </div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {adminNavItems.map((item) => (
          <Link key={item.path} to={item.path}>
            <Card className="h-full transition-shadow hover:shadow-elegant">
              <CardHeader>
                <div className="flex h-10 w-10 items-center justify-center rounded-md bg-accent text-accent-foreground">
                  <item.icon className="h-5 w-5" />
                </div>
                <CardTitle className="mt-2 flex items-center justify-between text-base">
                  {item.title}
                  <ArrowRight className="h-4 w-4 text-muted-foreground" />
                </CardTitle>
                <CardDescription>{item.description}</CardDescription>
              </CardHeader>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default AdminOverview;
