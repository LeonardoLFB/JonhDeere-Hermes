// ============================================
//   SISTEMA JOHN DEERE — Enviar Email
//   Arquivo: src/pages/EnviarEmail.jsx  (ATUALIZADO)
//
//   NOVIDADE: agendamento de envio!
//   - "Envio Imediato" → o email sai na hora
//   - "Agendado" → você escolhe data e hora,
//     e o backend envia sozinho no momento
//     marcado (status fica laranja "Agendado"
//     até lá).
// ============================================

// ── Importações ──────────────────────────────
import { useState, useEffect } from "react";
import { enviarEmail, listarTemplates } from "../services/api";

// ── Componente EnviarEmail ────────────────────
function EnviarEmail({ usuario }) {

  // ── Estados do formulário ─────────────────
  const [para, setPara]         = useState("");
  const [cc, setCc]             = useState("");
  const [assunto, setAssunto]   = useState("");
  const [mensagem, setMensagem] = useState("");
  const [templateId, setTemplateId] = useState("");
  const [tipo, setTipo]         = useState("imediato"); // imediato ou agendado
  const [dataAgend, setDataAgend] = useState("");        // data/hora do agendamento

  // ── Estado: lista de templates do banco ───
  const [templates, setTemplates] = useState([]);

  // ── Estados de feedback ───────────────────
  const [sucessoMsg, setSucessoMsg] = useState("");
  const [erro, setErro]             = useState("");
  const [carregando, setCarregando] = useState(false);

  // ── Buscar templates ao abrir a tela ──────
  useEffect(() => {
    listarTemplates()
      .then(setTemplates)
      .catch(() => setErro("Não foi possível carregar os templates."));
  }, []);

  // ── Função: selecionar template ───────────
  const handleTemplate = (e) => {
    const id = e.target.value;
    setTemplateId(id);

    if (id) {
      const t = templates.find((t) => String(t.id) === id);
      if (t) {
        setAssunto(t.assunto);
        setMensagem(t.corpo);
      }
    }
  };

  // ── Função: enviar ou agendar email ───────
  const handleEnviar = async () => {

    // Validação: campos obrigatórios
    if (!para) {
      setErro("O campo 'Para' é obrigatório.");
      return;
    }
    if (!assunto) {
      setErro("O campo 'Assunto' é obrigatório.");
      return;
    }
    if (!mensagem) {
      setErro("O campo 'Mensagem' é obrigatório.");
      return;
    }

    // Validações do agendamento
    if (tipo === "agendado") {
      if (!dataAgend) {
        setErro("Informe a data e hora para o agendamento.");
        return;
      }
      // A data marcada precisa estar no futuro
      if (new Date(dataAgend) <= new Date()) {
        setErro("A data do agendamento precisa estar no futuro.");
        return;
      }
    }

    setErro("");
    setCarregando(true);

    // Se houver CC, junta com o destinatário
    const destinatarios = cc ? `${para}, ${cc}` : para;

    try {
      // Pede ao backend para enviar (ou agendar)
      const resposta = await enviarEmail(
        destinatarios,
        assunto,
        mensagem,
        usuario?.id || null,
        templateId ? Number(templateId) : null,
        tipo === "agendado" ? dataAgend : null
      );

      // Mostra a mensagem que o backend devolveu
      // ("enviado com sucesso" ou "agendado com sucesso")
      setSucessoMsg(resposta.mensagem);

      // Limpa o formulário
      setPara("");
      setCc("");
      setAssunto("");
      setMensagem("");
      setTemplateId("");
      setTipo("imediato");
      setDataAgend("");

      // Esconde a mensagem após 4 segundos
      setTimeout(() => setSucessoMsg(""), 4000);

    } catch (erro) {
      setErro(erro.message);
    } finally {
      setCarregando(false);
    }
  };

  // ── Função: limpar formulário ─────────────
  const handleLimpar = () => {
    setPara("");
    setCc("");
    setAssunto("");
    setMensagem("");
    setTemplateId("");
    setTipo("imediato");
    setDataAgend("");
    setErro("");
    setSucessoMsg("");
  };

  // ── Renderização ─────────────────────────
  return (
    <div>

      {/* ── Cabeçalho ── */}
      <div className="titulo-pagina">Enviar Email</div>
      <div className="subtitulo">
        Preencha os campos para enviar uma comunicação
      </div>

      {/* ── Mensagem de sucesso ── */}
      {sucessoMsg && (
        <div className="alerta-ok">✓ {sucessoMsg}</div>
      )}

      {/* ── Mensagem de erro ── */}
      {erro && (
        <div className="alerta-erro">⚠ {erro}</div>
      )}

      <div className="card">
        <h3>Novo Email</h3>

        {/* ── Seleção de template ── */}
        <div className="form-grupo">
          <label>Template (opcional)</label>
          <select value={templateId} onChange={handleTemplate}>
            <option value="">— Nenhum template —</option>
            {templates.map((t) => (
              <option key={t.id} value={t.id}>
                {t.nome}
              </option>
            ))}
          </select>
        </div>

        {/* ── Para e CC lado a lado ── */}
        <div className="linha">
          <div className="form-grupo">
            <label>Para *</label>
            <input
              type="email"
              placeholder="destinatario@email.com"
              value={para}
              onChange={(e) => setPara(e.target.value)}
            />
          </div>

          <div className="form-grupo">
            <label>CC (cópia)</label>
            <input
              type="email"
              placeholder="copia@email.com"
              value={cc}
              onChange={(e) => setCc(e.target.value)}
            />
          </div>
        </div>

        {/* ── Assunto ── */}
        <div className="form-grupo">
          <label>Assunto *</label>
          <input
            type="text"
            placeholder="Assunto do email"
            value={assunto}
            onChange={(e) => setAssunto(e.target.value)}
          />
        </div>

        {/* ── Mensagem ── */}
        <div className="form-grupo">
          <label>Mensagem *</label>
          <textarea
            placeholder="Escreva a mensagem aqui..."
            value={mensagem}
            onChange={(e) => setMensagem(e.target.value)}
          />
        </div>

        {/* ── Tipo de envio ── */}
        <div className="form-grupo">
          <label>Tipo de Envio</label>
          <select
            value={tipo}
            onChange={(e) => setTipo(e.target.value)}
          >
            <option value="imediato">Envio Imediato</option>
            <option value="agendado">Agendado</option>
          </select>
        </div>

        {/* ── Campo de data (só aparece se agendado) ── */}
        {tipo === "agendado" && (
          <div className="form-grupo">
            <label>Data e Hora do Envio</label>
            <input
              type="datetime-local"
              value={dataAgend}
              onChange={(e) => setDataAgend(e.target.value)}
            />
          </div>
        )}

        {/* ── Botões de ação ── */}
        <div className="btn-grupo">
          <button
            className="btn btn-verde"
            onClick={handleEnviar}
            disabled={carregando}
          >
            {carregando
              ? "Processando..."
              : tipo === "agendado" ? "Agendar Email" : "Enviar Agora"}
          </button>

          <button
            className="btn btn-cinza"
            onClick={handleLimpar}
          >
            Limpar
          </button>
        </div>

      </div>
    </div>
  );
}

export default EnviarEmail;
