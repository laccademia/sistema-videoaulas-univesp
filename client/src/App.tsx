import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import Home from "./pages/Home";
import Cursos from "./pages/Cursos";
import CursoDetalhes from "./pages/CursoDetalhes";
import Disciplinas from "./pages/Disciplinas";
import Videoaulas from "./pages/Videoaulas";
import VideoaulaDetalhes from "./pages/VideoaulaDetalhes";
import Professores from "./pages/Professores";
import DesignersInstrucionais from "./pages/DesignersInstrucionais";


import AdminDashboard from "./pages/admin/AdminDashboard";
import VideoaulasAdmin from "./pages/admin/VideoaulasAdmin";
import NovaVideoaula from "./pages/admin/NovaVideoaula";
import EditarVideoaula from "./pages/admin/EditarVideoaula";
import ProfessoresAdmin from "./pages/admin/ProfessoresAdmin";
import NovoProfessor from "./pages/admin/NovoProfessor";
import EditarProfessor from "./pages/admin/EditarProfessor";
import DisciplinasAdmin from "./pages/admin/DisciplinasAdmin";
import NovaDisciplina from "./pages/admin/NovaDisciplina";
import EditarDisciplina from "./pages/admin/EditarDisciplina";
import DesignersAdmin from "./pages/admin/designers/DesignersAdmin";
import NovoDesigner from "./pages/admin/designers/NovoDesigner";
import EditarDesigner from "./pages/admin/designers/EditarDesigner";
import CursosAdmin from "./pages/admin/cursos/CursosAdmin";
import NovoCurso from "./pages/admin/cursos/NovoCurso";
import EditarCurso from "./pages/admin/cursos/EditarCurso";

import ProtectedRoute from "./components/ProtectedRoute";
import LoginRedirect from "./components/LoginRedirect";

function Router() {
  return (
    <Switch>
      <Route path={"/"} component={Home} />
      <Route path={"/login"} component={LoginRedirect} />
      <Route path={"/cursos"} component={Cursos} />
      <Route path={"/cursos/:id"} component={CursoDetalhes} />
      <Route path={"/disciplinas"} component={Disciplinas} />
      <Route path={"/videoaulas"} component={Videoaulas} />
      <Route path={"/videoaulas/:id"} component={VideoaulaDetalhes} />
      <Route path={"/professores"} component={Professores} />
      <Route path={"/designers-instrucionais"} component={DesignersInstrucionais} />

      <Route path={"/admin"}><ProtectedRoute><AdminDashboard /></ProtectedRoute></Route>
      <Route path={"/admin/videoaulas"}><ProtectedRoute><VideoaulasAdmin /></ProtectedRoute></Route>
      <Route path={"/admin/videoaulas/nova"}><ProtectedRoute><NovaVideoaula /></ProtectedRoute></Route>
      <Route path="/admin/videoaulas/:id/editar"><ProtectedRoute><EditarVideoaula /></ProtectedRoute></Route>
      <Route path="/admin/professores"><ProtectedRoute><ProfessoresAdmin /></ProtectedRoute></Route>
      <Route path="/admin/professores/novo"><ProtectedRoute><NovoProfessor /></ProtectedRoute></Route>
      <Route path="/admin/professores/:id/editar"><ProtectedRoute><EditarProfessor /></ProtectedRoute></Route>
      <Route path="/admin/disciplinas"><ProtectedRoute><DisciplinasAdmin /></ProtectedRoute></Route>
      <Route path="/admin/disciplinas/nova"><ProtectedRoute><NovaDisciplina /></ProtectedRoute></Route>
      <Route path="/admin/disciplinas/:id/editar"><ProtectedRoute><EditarDisciplina /></ProtectedRoute></Route>
      <Route path="/admin/designers"><ProtectedRoute><DesignersAdmin /></ProtectedRoute></Route>
      <Route path="/admin/designers/novo"><ProtectedRoute><NovoDesigner /></ProtectedRoute></Route>
      <Route path="/admin/designers/:id/editar"><ProtectedRoute><EditarDesigner /></ProtectedRoute></Route>
      <Route path="/admin/cursos"><ProtectedRoute><CursosAdmin /></ProtectedRoute></Route>
      <Route path="/admin/cursos/novo"><ProtectedRoute><NovoCurso /></ProtectedRoute></Route>
      <Route path="/admin/cursos/:id/editar"><ProtectedRoute><EditarCurso /></ProtectedRoute></Route>

      <Route path="/404" component={NotFound} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider
        defaultTheme="light"
        switchable
      >
        <TooltipProvider>
          <Toaster />
          <Router />
        </TooltipProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
