import { CircleDashed } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

interface PlaceholderSectionProps {
  title: string;
  description: string;
  icon: LucideIcon;
}

/**
 * Reusable "coming soon" placeholder used by every Admin Dashboard section
 * (Employees, Managers, Departments, Policies, Requests, AI Agents,
 * Analytics, Audit Trail) until each section's real functionality is built.
 */
const PlaceholderSection = ({
  title,
  description,
  icon: Icon,
}: PlaceholderSectionProps) => {
  return (
    <div className="flex h-full flex-col gap-6">
      <div>
        <h1 className="text-2xl font-semibold text-foreground">{title}</h1>
        <p className="mt-1 text-muted-foreground">{description}</p>
      </div>
      <Card className="flex flex-1 items-center justify-center border-dashed">
        <CardHeader className="items-center text-center">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-accent text-accent-foreground">
            <Icon className="h-6 w-6" />
          </div>
          <CardTitle className="mt-2 flex items-center gap-2 text-lg">
            <CircleDashed className="h-4 w-4 text-muted-foreground" />
            Coming soon
          </CardTitle>
          <CardDescription>
            {title} management will appear here once this section is built.
          </CardDescription>
        </CardHeader>
      </Card>
    </div>
  );
};

export default PlaceholderSection;
