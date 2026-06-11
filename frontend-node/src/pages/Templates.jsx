// ============================================
//   SISTEMA JOHN DEERE — Templates (REAL)
//   Arquivo: src/pages/Templates.jsx
//
//   Os templates agora vêm do banco de dados
//   e os novos templates criados aqui são
//   gravados de verdade — ficando disponíveis
//   na tela "Enviar Email" imediatamente.
//
//   Campos do template:
//   - Nome    → como aparece na lista
//   - Assunto → preenche o assunto do email
//   - Corpo   → preenche a mensagem do email
// ============================================

// ── Importações ──────────────────────────────
import { useState, useEffect } from "react";
import { listarTemplates, criarTemplate } from "../services/api";

// ── Componente Templates ──────────────────────
function Templates() {

  // ── Estado da lista de templates ──────────
  const [lista, setLista] = useState([]);

  // ── Estados do formulário ─────────────────
  const [nome, setNome]       = useState("");
  const [assunto, setAssunto] = useState("");
  const [corpo, setCorpo]     = useState("");

  // ── Estados de feedback ───────────────────
  const [sucesso, setSucesso] = useState(false);
  const [erro, setErro]       = useState("");

  // ── Buscar templates ao abrir a tela ──────
  useEffect(() => {
    listarTemplates()
      .then(setLista)
      .catch(() => setErro("Não foi possível carregar os templates."));
  }, []);

  // ── Função: adicionar template ────────────
  const handleAdicionar = async () => {

    // Validações
    if (!nome) {
      setErro("O nome do template é obrigatório.");
      return;
    }
    if (!assunto) {
      setErro("O assunto é obrigatório.");
      return;
    }
    if (!corpo) {
      setErro("O corpo da mensagem é obrigatório.");
      return;
    }

    try {
      // Grava o template no banco de dados
      const novo = await criarTemplate(nome, assunto, corpo);

      // Adiciona na lista da tela
      setLista([...lista, novo]);

      // Limpa o formulário
      setNome("");
      setAssunto("");
      setCorpo("");
      setErro("");

      // Mensagem de sucesso
      setSucesso(true);
      setTimeout(() => setSucesso(false), 3000);

    } catch (erro) {
      setErro(erro.message);
    }
  };

  // ── Função: limpar formulário ─────────────
  const handleLimpar = () => {
    setNome("");
    setAssunto("");
    setCorpo("");
    setErro("");
    setSucesso(false);
  };

  // ── Renderização ─────────────────────────
  return (
    <div>

      {/* ── Cabeçalho ── */}
      <div className="titulo-pagina">Templates</div>
      <div className="subtitulo">
        Modelos de email reutilizáveis pelos times
      </div>

      {/* ── Mensagem de sucesso ── */}
      {sucesso && (
        <div className="alerta-ok">
          ✓ Template adicionado com sucesso!
        </div>
      )}

      {/* ── Mensagem de erro ── */}
      {erro && (
        <div className="alerta-erro">⚠ {erro}</div>
      )}

      {/* ── Tabela de templates ── */}
      <div className="card">
        <h3>Templates Disponíveis ({lista.length})</h3>

        <table>
          <thead>
            <tr>
              <th>#</th>
              <th>Nome</th>
              <th>Assunto</th>
              <th>Corpo</th>
            </tr>
          </thead>
          <tbody>
            {lista.map((t) => (
              <tr key={t.id}>
                <td style={{ color: "var(--texto-leve)", fontSize: "12px" }}>
                  #{String(t.id).padStart(3, "0")}
                </td>
                <td>{t.nome}</td>
                <td>{t.assunto}</td>
                {/* Mostra só o começo do corpo para
                    a tabela não ficar gigante */}
                <td style={{ color: "var(--texto-leve)", fontSize: "12px" }}>
                  {t.corpo.length > 60 ? t.corpo.slice(0, 60) + "..." : t.corpo}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* ── Formulário: novo template ── */}
      <div className="card">
        <h3>Novo Template</h3>

        <div className="linha">
          <div className="form-grupo">
            <label>Nome *</label>
            <input
              type="text"
              placeholder="Ex: Aviso de Deploy"
              value={nome}
              onChange={(e) => setNome(e.target.value)}
            />
          </div>

          <div className="form-grupo">
            <label>Assunto *</label>
            <input
              type="text"
              placeholder="Assunto padrão do email"
              value={assunto}
              onChange={(e) => setAssunto(e.target.value)}
            />
          </div>
        </div>

        <div className="form-grupo">
          <label>Corpo da mensagem *</label>
          <textarea
            placeholder="Texto padrão do email..."
            value={corpo}
            onChange={(e) => setCorpo(e.target.value)}
          />
        </div>

        <div className="btn-grupo">
          <button className="btn btn-verde" onClick={handleAdicionar}>
            Adicionar Template
          </button>
          <button className="btn btn-cinza" onClick={handleLimpar}>
            Limpar
          </button>
        </div>
      </div>

    </div>
  );
}

export default Templates;
