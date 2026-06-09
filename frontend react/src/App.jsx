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

export default function App() {
  const [user, setUser] = useState({ name: "Thiago", role: "Administrador" });
  const [activePage, setActivePage] = useState("dashboard");

  const handleLogin = (userData) => setUser(userData);
  const handleLogout = () => { setUser(null); setActivePage("dashboard"); };

  if (!user) {
    return <LoginPage onLogin={handleLogin} />;
  }

  const renderPage = () => {
    switch (activePage) {
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
        active={activePage}
        onNavigate={setActivePage}
        user={user}
        onLogout={handleLogout}
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