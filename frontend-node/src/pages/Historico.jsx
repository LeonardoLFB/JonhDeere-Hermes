// ============================================
//   SISTEMA JOHN DEERE — Histórico
//   Arquivo: src/pages/Historico.jsx  (ATUALIZADO)
//
//   NOVIDADE: emails agendados aparecem com o
//   badge laranja "Agendado" e a data mostrada
//   é a hora MARCADA para o envio.
//   (Dica: aperte F5 depois que a hora chegar
//   para ver o status virar "Entregue"!)
// ============================================

// ── Importações ──────────────────────────────
import { useState, useEffect } from "react";
import { listarEmails } from "../services/api";

// ── Componente Historico ──────────────────────
function Historico() {

  // ── Estados ───────────────────────────────
  const [emails, setEmails] = useState([]);
  const [busca, setBusca]   = useState("");
  const [erro, setErro]     = useState("");

  // ── Buscar emails ao abrir a tela ─────────
  useEffect(() => {
    listarEmails()
      .then(setEmails)
      .catch(() => setErro("Não foi possível carregar o histórico. O backend está ligado?"));
  }, []);

  // ── Filtragem dos emails ───────────────────
  const emailsFiltrados = emails.filter((email) => {
    const textoBusca = busca.toLowerCase();
    return (
      email.destinatario.toLowerCase().includes(textoBusca) ||
      email.assunto.toLowerCase().includes(textoBusca)
    );
  });

  // ── Renderização ─────────────────────────
  return (
    <div>

      {/* ── Cabeçalho ── */}
      <div className="titulo-pagina">Histórico</div>
      <div className="subtitulo">
        Todos os emails enviados e agendados pelo sistema
      </div>

      {/* ── Mensagem de erro ── */}
      {erro && (
        <div className="alerta-erro">⚠ {erro}</div>
      )}

      <div className="card">

        {/* ── Cabeçalho do card com busca ── */}
        <div style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "16px"
        }}>
          <h3 style={{ marginBottom: 0 }}>
            Registros de Envio
          </h3>

          {/* Campo de busca */}
          <input
            type="text"
            placeholder="Buscar por destinatário ou assunto..."
            value={busca}
            onChange={(e) => setBusca(e.target.value)}
            style={{
              padding: "8px 14px",
              border: "1px solid var(--borda)",
              borderRadius: "var(--radius)",
              fontSize: "13px",
              fontFamily: "DM Sans, sans-serif",
              background: "var(--fundo)",
              color: "var(--texto)",
              outline: "none",
              width: "280px",
            }}
          />
        </div>

        {/* ── Tabela de emails ── */}
        {emailsFiltrados.length === 0 ? (
          <p style={{ color: "var(--texto-leve)", fontSize: "13px", textAlign: "center", padding: "24px 0" }}>
            {busca
              ? `Nenhum email encontrado para "${busca}".`
              : "Nenhum email enviado ainda."}
          </p>
        ) : (
          <table>
            <thead>
              <tr>
                <th>#</th>
                <th>Destinatário</th>
                <th>Assunto</th>
                <th>Template</th>
                <th>Enviado por</th>
                <th>Data</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {emailsFiltrados.map((email) => (
                <tr key={email.id}>

                  <td style={{ color: "var(--texto-leve)", fontSize: "12px" }}>
                    #{String(email.id).padStart(3, "0")}
                  </td>

                  <td>{email.destinatario}</td>
                  <td>{email.assunto}</td>

                  <td>
                    {email.template ? (
                      <span className="badge badge-info">
                        {email.template}
                      </span>
                    ) : (
                      <span style={{ color: "var(--texto-leve)", fontSize: "12px" }}>—</span>
                    )}
                  </td>

                  <td>{email.enviado_por || "—"}</td>

                  <td style={{ color: "var(--texto-leve)", fontSize: "12px" }}>
                    {email.data}
                  </td>

                  {/* Badge de status dinâmico:
                      ok  → verde   (Entregue)
                      ag  → laranja (Agendado)
                      err → vermelho (Falha)    */}
                  <td>
                    <span
                      className={`badge ${
                        email.status === "ok" ? "badge-ok" :
                        email.status === "ag" ? "badge-ag" :
                        "badge-err"
                      }`}
                    >
                      {email.status === "ok" ? "Entregue" :
                       email.status === "ag" ? "Agendado" :
                       "Falha"}
                    </span>
                  </td>

                </tr>
              ))}
            </tbody>
          </table>
        )}

        {/* ── Rodapé com contagem de resultados ── */}
        <div style={{
          marginTop: "16px",
          fontSize: "12px",
          color: "var(--texto-leve)"
        }}>
          {emailsFiltrados.length} registro(s) encontrado(s)
        </div>

      </div>
    </div>
  );
}

export default Historico;
