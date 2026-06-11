// ============================================
//   SISTEMA JOHN DEERE — Sidebar
//   Arquivo: src/components/Sidebar.jsx
//
//   Barra lateral de navegação.
//   NOVIDADE: item "Usuários" adicionado,
//   visível APENAS para administradores.
// ============================================

// ── Definição das páginas de navegação ───────
// "perfis" define quem pode ver cada item:
//   admin  → administrador
//   dev    → desenvolvedor
//   viewer → visualizador

const itensNav = [
  {
    id: "dashboard",
    label: "Dashboard",
    icone: "📊",
    perfis: ["admin", "dev", "viewer"],
  },
  {
    id: "enviar",
    label: "Enviar Email",
    icone: "✉️",
    perfis: ["admin", "dev"],       // viewer não pode enviar
  },
  {
    id: "historico",
    label: "Histórico",
    icone: "🕐",
    perfis: ["admin", "dev", "viewer"],
  },
  {
    id: "templates",
    label: "Templates",
    icone: "📄",
    perfis: ["admin", "dev"],       // viewer não gerencia templates
  },
  {
    id: "usuarios",
    label: "Usuários",
    icone: "👥",
    perfis: ["admin"],              // SÓ o admin gerencia usuários
  },
];


// ── Componente Sidebar ────────────────────────
function Sidebar({ usuario, paginaAtual, onNavegar, onSair }) {

  // Filtra os itens de acordo com o perfil
  // do usuário logado. Ex: um "viewer" não
  // vê "Enviar Email" nem "Usuários".
  const itensFiltrados = itensNav.filter((item) =>
    item.perfis.includes(usuario.perfil)
  );

  return (
    <aside className="sidebar">

      {/* ── Logo / Título ── */}
      <div className="sidebar-logo">
        <h1>Sistema<br />John Deere</h1>
        <p>Comunicação Interna</p>
      </div>

      {/* ── Navegação ── */}
      <nav className="sidebar-nav">
        {itensFiltrados.map((item) => (
          <button
            key={item.id}
            className={`nav-btn ${paginaAtual === item.id ? "ativo" : ""}`}
            onClick={() => onNavegar(item.id)}
          >
            <span>{item.icone}</span>
            <span>{item.label}</span>
          </button>
        ))}
      </nav>

      {/* ── Rodapé: usuário logado + botão sair ── */}
      <div className="sidebar-footer">
        <div className="usuario-info">
          <div className="usuario-nome">{usuario.nome}</div>
          <div className="usuario-perfil">{usuario.perfil.toUpperCase()}</div>
        </div>
        <button className="btn-sair" onClick={onSair}>
          Sair
        </button>
      </div>

    </aside>
  );
}

export default Sidebar;
