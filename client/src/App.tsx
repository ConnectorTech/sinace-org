/*
  Design reminder for SINACE App shell:
  Futurismo assistencial de rede com navegação pública fluida, presença institucional
  e foco em leitura contínua da proposta de valor.
*/
import DashboardLayout from "@/components/DashboardLayout";
import PwaInstallPrompt from "@/components/PwaInstallPrompt";
import PublicMobileDock from "@/components/PublicMobileDock";
import SeoRouteManager from "@/components/SeoRouteManager";
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import AppDashboard from "@/pages/AppDashboard";
import {
  AppAdmin,
  AppCases,
  AppEncyclopedia,
  AppInstitutions,
  AppPartners,
} from "@/pages/AppModules";
import {
  AppKnowledgeHub,
  AppMedicalProfiles,
  AppPrivateMedicalWorkspace,
  AppProfessionalNetwork,
  AppPublications,
  AppTrainingTracks,
} from "@/pages/AppPlatformModules";
import AppSpecialties from "@/pages/AppSpecialties";
import Home from "@/pages/Home";
import NotFound from "@/pages/NotFound";
import {
  AplicativoPage,
  CoberturaPage,
  ContatoPage,
  OperacaoPage,
  PropostaPage,
} from "@/pages/PublicSitePages";
import { ComponentType } from "react";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";

function WorkspaceRoute({ component: Component }: { component: ComponentType }) {
  return (
    <DashboardLayout>
      <Component />
    </DashboardLayout>
  );
}

const AppWorkspaceHome = () => <WorkspaceRoute component={AppDashboard} />;
const AppWorkspaceSpecialties = () => <WorkspaceRoute component={AppSpecialties} />;
const AppWorkspaceFlowcharts = () => <WorkspaceRoute component={AppTrainingTracks} />;
const AppWorkspaceLibrary = () => <WorkspaceRoute component={AppKnowledgeHub} />;
const AppWorkspaceCases = () => <WorkspaceRoute component={AppCases} />;
const AppWorkspacePublications = () => <WorkspaceRoute component={AppPublications} />;
const AppWorkspaceEncyclopedia = () => <WorkspaceRoute component={AppEncyclopedia} />;
const AppWorkspacePartners = () => <WorkspaceRoute component={AppPartners} />;
const AppWorkspaceInstitutions = () => <WorkspaceRoute component={AppInstitutions} />;
const AppWorkspaceProfiles = () => <WorkspaceRoute component={AppMedicalProfiles} />;
const AppWorkspacePrivateMedicalArea = () => <WorkspaceRoute component={AppPrivateMedicalWorkspace} />;
const AppWorkspaceNetwork = () => <WorkspaceRoute component={AppProfessionalNetwork} />;
const AppWorkspaceAdmin = () => <WorkspaceRoute component={AppAdmin} />;

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/proposta" component={PropostaPage} />
      <Route path="/operacao" component={OperacaoPage} />
      <Route path="/cobertura" component={CoberturaPage} />
      <Route path="/aplicativo" component={AplicativoPage} />
      <Route path="/contato" component={ContatoPage} />

      <Route path="/app" component={AppWorkspaceHome} />
      <Route path="/app/especialidades" component={AppWorkspaceSpecialties} />
      <Route path="/app/fluxogramas" component={AppWorkspaceFlowcharts} />
      <Route path="/app/biblioteca" component={AppWorkspaceLibrary} />
      <Route path="/app/casos" component={AppWorkspaceCases} />
      <Route path="/app/publicacoes" component={AppWorkspacePublications} />
      <Route path="/app/enciclopedia" component={AppWorkspaceEncyclopedia} />
      <Route path="/app/parceiros" component={AppWorkspacePartners} />
      <Route path="/app/instituicoes" component={AppWorkspaceInstitutions} />
      <Route path="/app/perfis" component={AppWorkspaceProfiles} />
      <Route path="/app/minha-area" component={AppWorkspacePrivateMedicalArea} />
      <Route path="/app/network" component={AppWorkspaceNetwork} />
      <Route path="/app/admin" component={AppWorkspaceAdmin} />

      {/* Rotas legadas mantidas por compatibilidade com versões anteriores do workspace. */}
      <Route path="/app/trilhas" component={AppWorkspaceFlowcharts} />
      <Route path="/app/professores" component={AppWorkspaceProfiles} />
      <Route path="/app/alunos" component={AppWorkspaceNetwork} />

      <Route path="/404" component={NotFound} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider defaultTheme="light">
        <TooltipProvider>
          <Toaster />
          <SeoRouteManager />
          <PwaInstallPrompt />
          <Router />
          <PublicMobileDock />
        </TooltipProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
