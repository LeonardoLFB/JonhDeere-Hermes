// ============================================
//   SISTEMA JOHN DEERE — App Principal
//   Arquivo: src/App.jsx
//
//   Componente raiz da aplicação.
//   NOVIDADES:
//   - Página "Usuários" adicionada (admin)
//   - O usuário logado é passado para a tela
//     EnviarEmail (para registrar quem enviou)
// ============================================

// ── Importações ──────────────────────────────
import { useState } from "react";

// Estilos globais
import "./styles/global.css";

// Componentes de estrutura
import Layout from "./components/Layout";
// Páginas
import Login       from "./pages/Login";
import Dashboard   from "./pages/Dashboard";
import EnviarEmail from "./pages/EnviarEmail";
import Historico   from "./pages/Historico";
import Templates   from "./pages/Templates";
import Usuarios    from "./pages/Usuarios";

// ── Componente App ────────────────────────────
function App() {

  // ── Estado: usuário logado ────────────────
  // Começa como null (ninguém logado).
  // Quando o Login valida no backend, recebe
  // { id, nome, email, perfil } do banco.
  const [usuario, setUsuario] = useState(null);

  // ── Estado: página atual ──────────────────
  const [pagina, setPagina] = useState("dashboard");

  // ── Função: login ─────────────────────────
  const handleLogin = (dadosUsuario) => {
    setUsuario(dadosUsuario);
    setPagina("dashboard"); // sempre começa no dashboard
  };

  // ── Função: logout ────────────────────────
  const handleSair = () => {
    setUsuario(null);
    setPagina("dashboard");
  };

  // ── Função: renderizar página ─────────────
  const renderizarPagina = () => {
    if (pagina === "dashboard")  return <Dashboard />;
    if (pagina === "enviar")     return <EnviarEmail usuario={usuario} />;
    if (pagina === "historico")  return <Historico />;
    if (pagina === "templates")  return <Templates />;
    if (pagina === "usuarios")   return <Usuarios />;

    // Fallback: volta para o dashboard
    return <Dashboard />;
  };

  // ── Renderização principal ────────────────
  return (
    <div>

      {/* Tela de Login (quando ninguém está logado) */}
      {!usuario && (
        <Login onLogin={handleLogin} />
      )}

      {/* Sistema (após login) */}
      {usuario && (
        <Layout
          usuario={usuario}
          pagina={pagina}
          onNavegar={setPagina}
          onSair={handleSair}
        >
          {renderizarPagina()}
        </Layout>
      )}

    </div>
  );
}

export default App;
