import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import SecureAdminLogin from "./pages/SecureAdminLogin";
import Admin from "./pages/Admin";
import NotFound from "./pages/NotFound";
import ResearchAgentBlueprint from "./pages/ResearchAgentBlueprint";
import SocialContentCreatorBlueprint from "./pages/SocialContentCreatorBlueprint";
import CustomerSupportAgentBlueprint from "./pages/CustomerSupportAgentBlueprint";
import AiSdrAgentBlueprint from "./pages/AiSdrAgentBlueprint";
import Demo from "./pages/Demo";
import { SEOPage } from "./components/seo/SEOPage";
import { getPageConfig } from "./lib/seo/seo.config";

const queryClient = new QueryClient();

// SEO-wrapped route components
const HomeRoute = () => {
  const config = getPageConfig('home');
  if (!config) return <Index />;
  return (
    <SEOPage config={config} showBreadcrumbs={false}>
      <Index />
    </SEOPage>
  );
};

const ResearchAgentRoute = () => {
  const config = getPageConfig('researchAgent');
  if (!config) return <ResearchAgentBlueprint />;
  return (
    <SEOPage config={config}>
      <ResearchAgentBlueprint />
    </SEOPage>
  );
};

const SocialContentCreatorRoute = () => {
  const config = getPageConfig('socialContentCreator');
  if (!config) return <SocialContentCreatorBlueprint />;
  return (
    <SEOPage config={config}>
      <SocialContentCreatorBlueprint />
    </SEOPage>
  );
};

const CustomerSupportAgentRoute = () => {
  const config = getPageConfig('customerSupportAgent');
  if (!config) return <CustomerSupportAgentBlueprint />;
  return (
    <SEOPage config={config}>
      <CustomerSupportAgentBlueprint />
    </SEOPage>
  );
};

const AiSdrAgentRoute = () => {
  const config = getPageConfig('aiSdrAgent');
  if (!config) return <AiSdrAgentBlueprint />;
  return (
    <SEOPage config={config}>
      <AiSdrAgentBlueprint />
    </SEOPage>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter
        future={{
          v7_startTransition: true,
          v7_relativeSplatPath: true,
        }}
      >
        <Routes>
          <Route path="/" element={<HomeRoute />} />
          <Route path="/secure-admin/:token" element={<SecureAdminLogin />} />
          <Route path="/admin" element={<Admin />} />

          <Route path="/pricing-blueprints/research-agent" element={<ResearchAgentRoute />} />
          <Route path="/pricing-blueprints/social-content-creator-agent" element={<SocialContentCreatorRoute />} />
          <Route path="/pricing-blueprints/customer-support-agent" element={<CustomerSupportAgentRoute />} />
          <Route path="/pricing-blueprints/ai-sdr-agent" element={<AiSdrAgentRoute />} />
          <Route path="/demo" element={<Demo />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
