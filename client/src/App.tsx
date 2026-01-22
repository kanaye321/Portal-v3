import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { SiteProvider } from "@/context/SiteContext";
import NotFound from "@/pages/not-found";
import Dashboard from "@/pages/dashboard";
import AdminPage from "@/pages/admin";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Dashboard} />
      <Route path="/admin" component={AdminPage} />
      <Route path="/services" component={Dashboard} />
      <Route path="/systems" component={Dashboard} />
      <Route path="/support" component={Dashboard} />
      <Route path="/kb" component={Dashboard} />
      <Route path="/contact" component={Dashboard} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <SiteProvider>
        <TooltipProvider>
          <Toaster />
          <Router />
        </TooltipProvider>
      </SiteProvider>
    </QueryClientProvider>
  );
}

export default App;
