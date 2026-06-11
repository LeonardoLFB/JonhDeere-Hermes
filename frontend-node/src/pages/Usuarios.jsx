// ============================================
//   SISTEMA JOHN DEERE — Usuários (NOVA TELA)
//   Arquivo: src/pages/Usuarios.jsx
//
//   Tela EXCLUSIVA DO ADMIN para:
//   - Ver todos os usuários cadastrados
//   - Cadastrar novos usuários, escolhendo
//     o nível de acesso de cada um:
//       admin  → pode tudo
//       dev    → envia emails, gerencia templates
//       viewer → só visualiza
//
//   A senha é criptografada pelo backend
//   antes de ir para o banco de dados.
// ============================================

// ── Importações ──────────────────────────────
import { useState, useEffect } from "react";
import { listarUsuarios, cadastrarUsuario, excluirUsuario } from "../services/api";

// ── Componente Usuarios ───────────────────────
function Usuarios() {

  // ── Estado da lista de usuários ───────────
  const [lista, setLista] = useState([]);

  // ── Estados do formulário ─────────────────
  const [nome, setNome]     = useState("");
  const [email, setEmail]   = useState("");
  const [senha, setSenha]   = useState("");
  const [perfil, setPerfil] = useState("viewer");

  // ── Estados de feedback ───────────────────
  const [sucesso, setSucesso] = useState(false);
  const [erro, setErro]       = useState("");

  // ── Buscar usuários ao abrir a tela ───────
  useEffect(() => {
    listarUsuarios()
      .then(setLista)
      .catch(() => setErro("Não foi possível carregar os usuários."));
  }, []);

  // ── Função: cadastrar usuário ─────────────
  const handleCadastrar = async () => {

    // Validações
    if (!nome || !email || !senha) {
      setErro("Preencha nome, email e senha.");
      return;
    }
    if (senha.length < 6) {
      setErro("A senha deve ter pelo menos 6 caracteres.");
      return;
    }

    try {
      // Manda para o backend gravar no banco
      const novo = await cadastrarUsuario(nome, email, senha, perfil);

      // Adiciona na lista da tela
      setLista([...lista, novo]);

      // Limpa o formulário
      setNome("");
      setEmail("");
      setSenha("");
      setPerfil("viewer");
      setErro("");

      // Mensagem de sucesso
      setSucesso(true);
      setTimeout(() => setSucesso(false), 3000);

    } catch (erro) {
      // Ex: "Este email já está cadastrado."
      setErro(erro.message);
    }
  };

  // ── Função: excluir usuário ───────────────
  const handleExcluir = async (id) => {
    // Pede confirmação antes de apagar de vez
    if (!window.confirm("Tem certeza que deseja excluir este usuário?")) {
      return;
    }

    try {
      // Manda o backend apagar do banco
      await excluirUsuario(id);

      // Tira da lista da tela
      setLista(lista.filter((u) => u.id !== id));
      setErro("");

    } catch (erro) {
      // Ex: "Este usuário possui emails no histórico..."
      setErro(erro.message);
    }
  };

  // ── Renderização ─────────────────────────
  return (
    <div>

      {/* ── Cabeçalho ── */}
      <div className="titulo-pagina">Usuários</div>
      <div className="subtitulo">
        Gerencie quem tem acesso ao sistema e seus níveis
      </div>

      {/* ── Mensagem de sucesso ── */}
      {sucesso && (
        <div className="alerta-ok">
          ✓ Usuário cadastrado com sucesso!
        </div>
      )}

      {/* ── Mensagem de erro ── */}
      {erro && (
        <div className="alerta-erro">⚠ {erro}</div>
      )}

      {/* ── Tabela de usuários ── */}
      <div className="card">
        <h3>Usuários Cadastrados ({lista.length})</h3>

        <table>
          <thead>
            <tr>
              <th>#</th>
              <th>Nome</th>
              <th>Email</th>
              <th>Perfil</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            {lista.map((u) => (
              <tr key={u.id}>
                <td style={{ color: "var(--texto-leve)", fontSize: "12px" }}>
                  #{String(u.id).padStart(3, "0")}
                </td>
                <td>{u.nome}</td>
                <td>{u.email}</td>
                <td>
                  {/* Badge colorida de acordo com o perfil */}
                  <span
                    className={`badge ${
                      u.perfil === "admin" ? "badge-err" :
                      u.perfil === "dev"   ? "badge-info" :
                      "badge-ok"
                    }`}
                  >
                    {u.perfil === "admin"  ? "Administrador" :
                     u.perfil === "dev"    ? "Desenvolvedor" :
                     "Visualizador"}
                  </span>
                </td>
                <td>
                  <button
                    className="btn btn-vermelho"
                    onClick={() => handleExcluir(u.id)}
                  >
                    Excluir
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* ── Formulário: novo usuário ── */}
      <div className="card">
        <h3>Cadastrar Novo Usuário</h3>

        <div className="linha">
          <div className="form-grupo">
            <label>Nome *</label>
            <input
              type="text"
              placeholder="Nome completo"
              value={nome}
              onChange={(e) => setNome(e.target.value)}
            />
          </div>

          <div className="form-grupo">
            <label>Email *</label>
            <input
              type="email"
              placeholder="usuario@johndeere.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
        </div>

        <div className="linha">
          <div className="form-grupo">
            <label>Senha *</label>
            <input
              type="password"
              placeholder="Mínimo 6 caracteres"
              value={senha}
              onChange={(e) => setSenha(e.target.value)}
            />
          </div>

          <div className="form-grupo">
            <label>Nível de Acesso *</label>
            <select
              value={perfil}
              onChange={(e) => setPerfil(e.target.value)}
            >
              <option value="viewer">Visualizador (só vê)</option>
              <option value="dev">Desenvolvedor (envia emails)</option>
              <option value="admin">Administrador (pode tudo)</option>
            </select>
          </div>
        </div>

        <div className="btn-grupo">
          <button className="btn btn-verde" onClick={handleCadastrar}>
            Cadastrar Usuário
          </button>
        </div>
      </div>

    </div>
  );
}

export default Usuarios;
