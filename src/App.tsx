import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import FleetBoard from "./pages/FleetBoard";
import PlannerCockpit from "./pages/PlannerCockpit";
import RecommendationCenter from "./pages/RecommendationCenter";
import PlanValidation from "./pages/PlanValidation";
import OperationsDashboard from "./pages/OperationsDashboard";
import Analytics from "./pages/Analytics";
import SimulationPlanning from "./pages/SimulationPlanning";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <SidebarProvider>
          <div className="min-h-screen flex w-full">
            <AppSidebar />
            <div className="flex-1 flex flex-col">
              <header className="sticky top-0 z-10 flex h-14 items-center gap-4 border-b bg-background px-4">
                <SidebarTrigger />
                <div className="flex-1" />
                <div className="text-sm text-muted-foreground">
                  Kochi Metro Rail Limited
                </div>
              </header>
              <main className="flex-1 p-6">
                <Routes>
                  <Route path="/" element={<FleetBoard />} />
                  <Route path="/planner" element={<PlannerCockpit />} />
                  <Route path="/recommendation" element={<RecommendationCenter />} />
                  <Route path="/validation" element={<PlanValidation />} />
                  <Route path="/operations" element={<OperationsDashboard />} />
                  <Route path="/analytics" element={<Analytics />} />
                  <Route path="/simulation" element={<SimulationPlanning />} />
                  <Route path="/depot" element={<FleetBoard />} />
                  <Route path="/simulator" element={<FleetBoard />} />
                  <Route path="/reports" element={<FleetBoard />} />
                  <Route path="/settings" element={<FleetBoard />} />
                  {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </main>
            </div>
          </div>
        </SidebarProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
