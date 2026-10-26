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
import AppInstitutionalProfile from "@/pages/AppInstitutionalProfile";
import AppSpecialties from "@/pages/AppSpecialties";
import Home from "@/pages/Home";
import NotFound from "@/pages/NotFound";
import AuthPage from "@/pages/Auth";
import {
  AplicativoPage,
  CoberturaPage,
  ContatoPage,
  OperacaoPage,
  PropostaPage,
} from "@/pages/PublicSitePages";
import { Redirect, Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";

/**
 * Um único DashboardLayout para todas as rotas /app: sidebar, cabeçalho e navegação inferior
 * permanecem montados e só o conteúdo do módulo troca, sem recarregamento brusco entre abas.
 */
function WorkspaceRouter() {
  return (
    <DashboardLayout>
      <Switch>
        <Route path="/app" component={AppDashboard} />
        <Route path="/app/especialidades" component={AppSpecialties} />
        <Route path="/app/fluxogramas" component={AppTrainingTracks} />
        <Route path="/app/biblioteca" component={AppKnowledgeHub} />
        <Route path="/app/casos" component={AppCases} />
        <Route path="/app/publicacoes" component={AppPublications} />
        <Route path="/app/enciclopedia" component={AppEncyclopedia} />
        <Route path="/app/parceiros" component={AppPartners} />
        <Route path="/app/instituicoes" component={AppInstitutions} />
        <Route path="/app/perfis" component={AppMedicalProfiles} />
        <Route path="/app/minha-area" component={AppPrivateMedicalWorkspace} />
        <Route path="/app/network" component={AppProfessionalNetwork} />
        <Route path="/app/admin" component={AppAdmin} />
        <Route path="/app/sobre" component={AppInstitutionalProfile} />

        {/* Rotas legadas mantidas por compatibilidade com versões anteriores do workspace. */}
        <Route path="/app/trilhas" component={AppTrainingTracks} />
        <Route path="/app/configuracoes" component={AppInstitutionalProfile} />
        <Route path="/app/professores" component={AppMedicalProfiles} />
        <Route path="/app/alunos" component={AppProfessionalNetwork} />

        <Route>
          <Redirect to="/404" />
        </Route>
      </Switch>
    </DashboardLayout>
  );
}

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/auth" component={AuthPage} />
      <Route path="/proposta" component={PropostaPage} />
      <Route path="/operacao" component={OperacaoPage} />
      <Route path="/cobertura" component={CoberturaPage} />
      <Route path="/aplicativo" component={AplicativoPage} />
      <Route path="/contato" component={ContatoPage} />

      <Route path="/app/*?" component={WorkspaceRouter} />

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
