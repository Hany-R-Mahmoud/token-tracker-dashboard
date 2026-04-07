import { Switch, Route, Router as WouterRouter } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AppShell } from "@/components/shared/AppShell";
import { ProtectedRoute } from "@/components/shared/ProtectedRoute";
import { OverviewPage } from "@/features/overview/OverviewPage";
import { AnalyticsPage } from "@/features/analytics/AnalyticsPage";
import { TeamPage } from "@/features/team/TeamPage";
import { SessionsPage } from "@/features/sessions/SessionsPage";
import { AdminPage } from "@/features/admin/AdminPage";
import { SettingsPage } from "@/features/settings/SettingsPage";
import NotFound from "@/pages/not-found";

const queryClient = new QueryClient();

function Router() {
  return (
    <AppShell>
      <Switch>
        <Route path="/" component={OverviewPage} />
        <Route path="/analytics" component={AnalyticsPage} />
        <Route path="/team" component={TeamPage} />
        <Route path="/sessions" component={SessionsPage} />
        <Route path="/admin">
          <ProtectedRoute requiredRole="admin" resource="admin-panel">
            <AdminPage />
          </ProtectedRoute>
        </Route>
        <Route path="/settings">
          <ProtectedRoute requiredRole="admin" resource="settings">
            <SettingsPage />
          </ProtectedRoute>
        </Route>
        <Route component={NotFound} />
      </Switch>
    </AppShell>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, "")}>
          <Router />
        </WouterRouter>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
