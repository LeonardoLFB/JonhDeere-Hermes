import { useState } from "react";
import LoginPage from "./pages/LoginPage";
import DashboardPage from "./pages/DashboardPage";
import ComposeEmailPage from "./pages/ComposeEmailPage";
import TemplatesPage from "./pages/TemplatesPage";
import ScheduledPage from "./pages/ScheduledPage";
import LogsPage from "./pages/LogsPage";
import UsersPage from "./pages/UsersPage";
import Sidebar from "./components/Sidebar";
import { COLORS, FONT } from "./design";

const PAGE_TITLES = {
  dashboard: "Dashboard",
  compose: "Novo E-mail",
  templates: "Templates",
  scheduled: "Agendamentos",
  logs: "Logs",
  users: "Usuários",
};

// Chave usada para guardar o login no navegador
const STORAGE_KEY = "hermes_user";

// Quais páginas cada perfil pode acessar:
// - Administrador: tudo
// - Operador: envia emails e vê logs, mas não gerencia usuários
// - Visualizador: só vê o dashboard e os logs
const PAGES_BY_ROLE = {
  Administrador: ["dashboard", "compose", "templates", "scheduled", "logs", "users"],
  Operador:      ["dashboard", "compose", "templates", "scheduled", "logs"],
  Visualizador:  ["dashboard", "logs"],
};

export default function App() {
  // Recupera o login salvo para não deslogar ao atualizar a página (F5)
  const [user, setUser] = useState(() => {
    try {
      const salvo = localStorage.getItem(STORAGE_KEY);
      return salvo ? JSON.parse(salvo) : null;
    } catch {
      return null;
    }
  });
  const [activePage, setActivePage] = useState("dashboard");

  const handleLogin = (userData) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(userData));
    setUser(userData);
  };
  const handleLogout = () => {
    localStorage.removeItem(STORAGE_KEY);
    setUser(null);
    setActivePage("dashboard");
  };

  if (!user) {
    return <LoginPage onLogin={handleLogin} />;
  }

  const allowedPages = PAGES_BY_ROLE[user.role] || PAGES_BY_ROLE.Visualizador;
  // Se o perfil não tem acesso à página pedida, cai no dashboard
  const page = allowedPages.includes(activePage) ? activePage : "dashboard";

  const renderPage = () => {
    switch (page) {
      case "dashboard":  return <DashboardPage onNavigate={setActivePage} />;
      case "compose":    return <ComposeEmailPage onNavigate={setActivePage} />;
      case "templates":  return <TemplatesPage onNavigate={setActivePage} />;
      case "scheduled":  return <ScheduledPage onNavigate={setActivePage} />;
      case "logs":       return <LogsPage />;
      case "users":      return <UsersPage />;
      default:           return <DashboardPage onNavigate={setActivePage} />;
    }
  };

  return (
    <div style={{
      display: "flex",
      minHeight: "100vh",
      fontFamily: FONT,
      background: COLORS.bg,
    }}>
      <Sidebar
        active={page}
        onNavigate={setActivePage}
        user={user}
        onLogout={handleLogout}
        allowedPages={allowedPages}
      />

      <main style={{
        marginLeft: 232,
        flex: 1,
        padding: "36px 40px",
        minHeight: "100vh",
        boxSizing: "border-box",
      }}>
        {renderPage()}
      </main>
    </div>
  );
}