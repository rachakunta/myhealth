import { Switch, Route } from "wouter";
import NotFound from "@/pages/not-found";
import HomePage from "@/pages/home-page";
import AuthPage from "@/pages/auth-page";
import NursingPage from "@/pages/nursing-page";
import DashboardPage from "@/pages/dashboard-page";
import TelemedicinePage from "@/pages/telemedicine-page";
import DiagnosePage from "@/pages/diagnose-page";
import ConsultPage from "@/pages/consult-page";
import PharmacyPage from "@/pages/pharmacy-page";
import WellnessPage from "@/pages/wellness-page";
import ManagePage from "@/pages/manage-page";
import MedicatePage from "@/pages/medicate-page";
import OnboardingPage from "@/pages/onboarding-page";
import HealthDataPage from "@/pages/health-data-page";
import { ProtectedRoute } from "./lib/protected-route";
import { DashboardLayout } from "./components/layout/DashboardLayout";
import { MobileSidebarProvider } from "@/hooks/use-mobile-sidebar";
import { useAuth } from "@/hooks/use-auth";
import PhysiotherapyPage from "@/pages/physiotherapy-page";
import BedsideAttendantPage from "@/pages/bedside-attendant-page";

// Dashboard component wrapper
const DashboardRoute = ({ component: Component, ...rest }: any) => {
  return (
    <ProtectedRoute
      {...rest}
      component={() => (
        <DashboardLayout>
          <Component />
        </DashboardLayout>
      )}
    />
  );
};

function App() {
  const { user } = useAuth();

  return (
    <MobileSidebarProvider>
      <Switch>
        <Route path="/auth" component={AuthPage} />
        <Route path="/onboarding" component={OnboardingPage} />
        <DashboardRoute path="/" component={DashboardPage} />
        <DashboardRoute path="/home" component={HomePage} />
        <DashboardRoute path="/telemedicine" component={TelemedicinePage} />
        <DashboardRoute path="/nursing" component={NursingPage} />
        <DashboardRoute path="/physiotherapy" component={PhysiotherapyPage} />
        <DashboardRoute path="/bedside-attendant" component={BedsideAttendantPage} />
        <DashboardRoute path="/pharmacy" component={PharmacyPage} />
        <DashboardRoute path="/medicate" component={MedicatePage} />
        <DashboardRoute path="/wellness" component={WellnessPage} />
        <DashboardRoute path="/manage" component={ManagePage} />
        <DashboardRoute path="/health-data" component={HealthDataPage} />
        <DashboardRoute path="/diagnose" component={DiagnosePage} />
        <DashboardRoute path="/consult" component={ConsultPage} />
        <Route component={NotFound} />
      </Switch>
    </MobileSidebarProvider>
  );
}

export default App;