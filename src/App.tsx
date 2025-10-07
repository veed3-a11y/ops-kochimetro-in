import { useState } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { UnifiedHeader } from "@/components/UnifiedHeader";
import { SmartAlertsPanel } from "@/components/SmartAlertsPanel";
import { ExecutiveSummaryDrawer } from "@/components/ExecutiveSummaryDrawer";
import FleetBoard from "./pages/FleetBoard";
import PlannerCockpit from "./pages/PlannerCockpit";
import RecommendationCenter from "./pages/RecommendationCenter";
import PlanValidation from "./pages/PlanValidation";
import OperationsDashboard from "./pages/OperationsDashboard";
import Analytics from "./pages/Analytics";
import SimulationPlanning from "./pages/SimulationPlanning";
import AdminConfigConsole from "./pages/AdminConfigConsole";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => {
  const [showAlerts, setShowAlerts] = useState(false);
  const [showExecutiveSummary, setShowExecutiveSummary] = useState(false);

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <SidebarProvider>
            <div className="min-h-screen flex w-full">
              <AppSidebar />
              <div className="flex-1 flex flex-col">
                <UnifiedHeader
                  onToggleAlerts={() => setShowAlerts(!showAlerts)}
                  onToggleExecutiveSummary={() => setShowExecutiveSummary(!showExecutiveSummary)}
                />
                <main className="flex-1 p-6">
                  <Routes>
                    <Route path="/" element={<FleetBoard />} />
                    <Route path="/operations" element={<OperationsDashboard />} />
                    <Route path="/planner" element={<PlannerCockpit />} />
                    <Route path="/recommendation" element={<RecommendationCenter />} />
                    <Route path="/validation" element={<PlanValidation />} />
                    <Route path="/analytics" element={<Analytics />} />
                    <Route path="/simulation" element={<SimulationPlanning />} />
                    <Route path="/admin" element={<AdminConfigConsole />} />
                    {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
                    <Route path="*" element={<NotFound />} />
                  </Routes>
                </main>
              </div>
              <SmartAlertsPanel isOpen={showAlerts} onClose={() => setShowAlerts(false)} />
              <ExecutiveSummaryDrawer
                isOpen={showExecutiveSummary}
                onClose={() => setShowExecutiveSummary(false)}
              />
            </div>
          </SidebarProvider>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
