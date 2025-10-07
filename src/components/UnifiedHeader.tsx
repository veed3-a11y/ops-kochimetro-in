import { Train, HelpCircle, LogOut, ChevronDown } from "lucide-react";
import { NavLink } from "react-router-dom";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
const navTabs = [{
  title: "Dashboard",
  path: "/operations"
}, {
  title: "Rake View",
  path: "/"
}, {
  title: "Validation",
  path: "/validation"
}, {
  title: "Recommendations",
  path: "/recommendation"
}, {
  title: "Planner",
  path: "/planner"
}, {
  title: "Analytics",
  path: "/analytics"
}, {
  title: "Simulation",
  path: "/simulation"
}];
interface UnifiedHeaderProps {
  onToggleAlerts: () => void;
  onToggleExecutiveSummary: () => void;
}
export function UnifiedHeader({
  onToggleAlerts,
  onToggleExecutiveSummary
}: UnifiedHeaderProps) {
  const userRole = "Senior Planner"; // In real app, get from auth context

  return <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="flex h-16 items-center px-4 gap-4">
        {/* Left: Logo + Title */}
        <div className="flex items-center gap-3 min-w-fit">
          <SidebarTrigger />
          <Train className="h-6 w-6 text-primary" />
          <div className="hidden lg:block">
            <h1 className="text-sm font-semibold text-foreground whitespace-nowrap">
              KMRL Fleet Induction Intelligence
            </h1>
          </div>
        </div>

        {/* Center: Quick Nav Tabs */}
        <nav className="hidden xl:flex items-center gap-1 flex-1 justify-center">
          {navTabs.map(tab => {})}
        </nav>

        {/* Right: Actions & User Menu */}
        <div className="flex items-center gap-2 ml-auto">
          <Button variant="ghost" size="sm" onClick={onToggleExecutiveSummary} className="hidden lg:flex">
            Executive View
          </Button>

          <Button variant="ghost" size="icon" onClick={onToggleAlerts} title="Toggle Alerts">
            <span className="relative flex h-5 w-5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-status-warning opacity-75"></span>
              <span className="relative inline-flex rounded-full h-5 w-5 bg-status-warning"></span>
            </span>
          </Button>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="gap-2">
                <div className="text-right hidden sm:block">
                  <div className="text-xs font-medium">Rajesh Kumar</div>
                  <div className="text-xs text-muted-foreground">{userRole}</div>
                </div>
                <ChevronDown className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56 bg-popover">
              <DropdownMenuLabel>My Account</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <HelpCircle className="mr-2 h-4 w-4" />
                <span>Help & Support</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="text-destructive">
                <LogOut className="mr-2 h-4 w-4" />
                <span>Logout</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>;
}