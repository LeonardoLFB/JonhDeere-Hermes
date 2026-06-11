// ============================================
//   SISTEMA JOHN DEERE — Login (REAL)
//   Arquivo: src/pages/Login.jsx
//
//   Agora o login é validado de VERDADE:
//   o email e a senha são enviados ao backend,
//   que confere no banco de dados PostgreSQL.
//
//   MUDANÇA IMPORTANTE: o campo "Perfil de
//   Acesso" foi removido. Antes o usuário
//   escolhia o próprio perfil (inseguro!).
//   Agora o perfil vem do banco de dados.
// ============================================

// ── Importações ──────────────────────────────
import { useState } from "react";
import { login } from "../services/api";

// ── Componente Login ──────────────────────────
function Login({ onLogin }) {

  // ── Estados do formulário ─────────────────
  const [email, setEmail]       = useState("");
  const [senha, setSenha]       = useState("");
  const [erro, setErro]         = useState("");
  const [carregando, setCarregando] = useState(false);

  // ── Função de login ───────────────────────
  // Agora é "async" porque precisa ESPERAR
  // a resposta do backend chegar.
  const handleLogin = async () => {

    // Validação básica: campos vazios
    if (!email || !senha) {
      setErro("Preencha o email e a senha.");
      return;
    }

    setErro("");
    setCarregando(true); // mostra "Entrando..."

    try {
      // Pergunta ao backend se o login é válido.
      // Se for, ele devolve { id, nome, email, perfil }
      const usuario = await login(email, senha);

      // Avisa o App.jsx que o usuário entrou
      onLogin(usuario);

    } catch (erro) {
      // Senha errada, email inexistente ou
      // backend desligado caem aqui
      setErro(erro.message);
    } finally {
      setCarregando(false);
    }
  };

  // ── Permite login com a tecla Enter ──────
  const handleEnter = (e) => {
    if (e.key === "Enter") handleLogin();
  };

  // ── Renderização ─────────────────────────
  return (
    <div className="login-tela">
      <div className="login-box">

        {/* Título */}
        <h1>Sistema John Deere</h1>
        <p>Comunicação interna entre times de TI</p>

        {/* Mensagem de erro (só aparece se houver erro) */}
        {erro && (
          <div className="alerta-erro">{erro}</div>
        )}

        {/* Campo: Email */}
        <div className="form-grupo">
          <label>Email</label>
          <input
            type="text"
            placeholder="usuario@johndeere.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            onKeyDown={handleEnter}
          />
        </div>

        {/* Campo: Senha */}
        <div className="form-grupo">
          <label>Senha</label>
          <input
            type="password"
            placeholder="••••••••"
            value={senha}
            onChange={(e) => setSenha(e.target.value)}
            onKeyDown={handleEnter}
          />
        </div>

        {/* Botão de entrar (ocupa a largura toda) */}
        <button
          className="btn btn-verde"
          style={{ width: "100%" }}
          onClick={handleLogin}
          disabled={carregando}
        >
          {carregando ? "Entrando..." : "Entrar"}
        </button>

        {/* Aviso de acesso restrito */}
        <p style={{ marginTop: "16px", fontSize: "11px", textAlign: "center" }}>
          Acesso restrito à rede interna John Deere
        </p>

      </div>
    </div>
  );
}

export default Login;
