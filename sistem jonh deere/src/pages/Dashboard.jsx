// ============================================
//   SISTEMA JOHN DEERE — Dashboard
//   Arquivo: src/pages/Dashboard.jsx  (ATUALIZADO)
//
//   NOVIDADE: card "Na Fila (Agendados)" e
//   badge laranja na tabela de últimos envios.
// ============================================

// ── Importações ──────────────────────────────
import { useState, useEffect } from "react";
import { buscarEstatisticas, listarEmails } from "../services/api";

// ── Componente Dashboard ──────────────────────
function Dashboard() {

  // ── Estados ───────────────────────────────
  const [stats, setStats]   = useState(null);
  const [emails, setEmails] = useState([]);
  const [erro, setErro]     = useState("");

  // ── Buscar dados ao abrir a tela ──────────
  useEffect(() => {
    Promise.all([buscarEstatisticas(), listarEmails()])
      .then(([dadosStats, dadosEmails]) => {
        setStats(dadosStats);
        setEmails(dadosEmails);
      })
      .catch(() => setErro("Não foi possível carregar os dados. O backend está ligado?"));
  }, []);

  // ── Renderização ─────────────────────────
  return (
    <div>

      {/* ── Cabeçalho da página ── */}
      <div className="titulo-pagina">Dashboard</div>
      <div className="subtitulo">
        Visão geral do sistema de comunicação
      </div>

      {/* ── Mensagem de erro ── */}
      {erro && (
        <div className="alerta-erro">⚠ {erro}</div>
      )}

      {/* ── Cards de estatística ── */}
      <div className="stats">

        <div className="stat">
          <div className="stat-num">{stats ? stats.total_emails : "–"}</div>
          <div className="stat-label">Total de Emails</div>
        </div>

        <div className="stat">
          <div className="stat-num">{stats ? stats.enviados : "–"}</div>
          <div className="stat-label">Entregues com Sucesso</div>
        </div>

        <div className="stat">
          <div className="stat-num">{stats ? stats.agendados : "–"}</div>
          <div className="stat-label">Na Fila (Agendados)</div>
        </div>

        <div className="stat">
          <div className="stat-num">{stats ? stats.falhas : "–"}</div>
          <div className="stat-label">Falhas de Envio</div>
        </div>

        <div className="stat">
          <div className="stat-num">{stats ? stats.usuarios : "–"}</div>
          <div className="stat-label">Usuários Cadastrados</div>
        </div>

      </div>

      {/* ── Tabela de últimos envios ── */}
      <div className="card">
        <h3>Últimos Envios</h3>

        {emails.length === 0 ? (
          <p style={{ color: "var(--texto-leve)", fontSize: "13px", textAlign: "center", padding: "24px 0" }}>
            Nenhum email enviado ainda. Use a tela "Enviar Email" para começar!
          </p>
        ) : (
          <table>
            <thead>
              <tr>
                <th>Destinatário</th>
                <th>Assunto</th>
                <th>Template</th>
                <th>Data</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {emails.slice(0, 5).map((email) => (
                <tr key={email.id}>

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

                  <td style={{ color: "var(--texto-leve)", fontSize: "12px" }}>
                    {email.data}
                  </td>

                  {/* Badge de status com cor dinâmica */}
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
      </div>

    </div>
  );
}

export default Dashboard;
