import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Auth from "./pages/Auth";
import Admin from "./pages/Admin";
import NotFound from "./pages/NotFound";
import ResearchAgentBlueprint from "./pages/ResearchAgentBlueprint";
import SocialContentCreatorBlueprint from "./pages/SocialContentCreatorBlueprint";
import CustomerSupportAgentBlueprint from "./pages/CustomerSupportAgentBlueprint";
import AiSdrAgentBlueprint from "./pages/AiSdrAgentBlueprint";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/auth" element={<Auth />} />
          <Route path="/admin" element={<Admin />} />

          <Route path="/pricing-blueprints/research-agent" element={<ResearchAgentBlueprint />} />
          <Route path="/pricing-blueprints/social-content-creator-agent" element={<SocialContentCreatorBlueprint />} />
          <Route path="/pricing-blueprints/customer-support-agent" element={<CustomerSupportAgentBlueprint />} />
          <Route path="/pricing-blueprints/ai-sdr-agent" element={<AiSdrAgentBlueprint />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
