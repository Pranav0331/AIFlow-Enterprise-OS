import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Workflow } from "lucide-react";

const LandingNavbar = () => {
  return (
    <header className="sticky top-0 z-50 border-b border-border/10 bg-background/80 backdrop-blur-md">
      <div className="container flex h-16 items-center justify-between">
        <Link to="/" className="flex items-center gap-2 font-semibold text-foreground">
          <span className="flex h-8 w-8 items-center justify-center rounded-md bg-gradient-primary text-primary-foreground shadow-elegant">
            <Workflow className="h-4 w-4" />
          </span>
          AIFlow Enterprise OS
        </Link>
        <nav className="flex items-center gap-2">
          <Button variant="ghost" asChild>
            <Link to="/login">Log in</Link>
          </Button>
          <Button asChild>
            <Link to="/signup">Create Company</Link>
          </Button>
        </nav>
      </div>
    </header>
  );
};

export default LandingNavbar;
