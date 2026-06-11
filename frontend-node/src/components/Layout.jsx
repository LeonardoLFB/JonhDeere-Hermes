// ============================================
//   SISTEMA JOHN DEERE — Layout
//   Arquivo: src/components/Layout.jsx
//
//   Este componente serve como "moldura" para
//   todas as páginas internas do sistema.
//
//   Ele é responsável por:
//   - Exibir a Sidebar sempre visível
//   - Renderizar a página atual ao lado dela
//   - Repassar as props necessárias para a Sidebar
// ============================================

// ── Importações ──────────────────────────────
import Sidebar from "./Sidebar";

// ── Componente Layout ─────────────────────────
// Recebe as seguintes props do App.jsx:
//   usuario     → objeto do usuário logado
//   pagina      → string da página atual
//   onNavegar   → função para trocar de página
//   onSair      → função para fazer logout
//   children    → o conteúdo da página atual
//                 (Dashboard, Historico, etc.)

function Layout({ usuario, pagina, onNavegar, onSair, children }) {
  return (
    <div className="layout">

      {/* ── Sidebar ──────────────────────────
          Fica fixada no lado esquerdo.
          Recebe tudo que precisa via props. */}
      <Sidebar
        usuario={usuario}
        paginaAtual={pagina}
        onNavegar={onNavegar}
        onSair={onSair}
      />

      {/* ── Conteúdo principal ───────────────
          "children" é a página que o App.jsx
          decide renderizar (Dashboard, Enviar,
          Historico ou Templates).
          Muda conforme o usuário navega. */}
      <main className="conteudo">
        {children}
      </main>

    </div>
  );
}

export default Layout;