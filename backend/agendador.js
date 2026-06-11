// ============================================
//   HERMES — Agendador (despertador de emails)
//   Arquivo: agendador.js  (NOVO)
//
//   Funciona como um despertador: a cada 30
//   segundos ele olha no banco se existe algum
//   email agendado cuja hora já chegou.
//   Se existir, envia de verdade pelo Gmail e
//   atualiza o status:
//     'ag'  →  'ok'  (enviado com sucesso)
//     'ag'  →  'err' (falha no envio)
// ============================================

const pool = require("./db");
const { enviarEmail } = require("./mailer");

// ── Verifica e envia os emails atrasados ─────
async function verificarAgendados() {
  try {
    // Busca emails agendados cuja hora já passou
    const resultado = await pool.query(
      `SELECT * FROM email
       WHERE status = 'ag' AND agendado_para <= NOW()`
    );

    // Para cada um, tenta enviar e atualiza o status
    for (const email of resultado.rows) {
      console.log(`⏰ Hora de enviar o email #${email.id} para ${email.destinatario}`);

      const envio = await enviarEmail(
        email.destinatario,
        email.assunto,
        email.corpo
      );

      const novoStatus = envio.sucesso ? "ok" : "err";

      await pool.query(
        `UPDATE email
         SET status = $1, enviado_em = NOW()
         WHERE id = $2`,
        [novoStatus, email.id]
      );

      console.log(
        envio.sucesso
          ? `✅ Email agendado #${email.id} enviado!`
          : `❌ Email agendado #${email.id} falhou: ${envio.erro}`
      );
    }
  } catch (erro) {
    console.error("Erro no agendador:", erro.message);
  }
}

// ── Liga o despertador ───────────────────────
// Roda a verificação imediatamente e depois
// repete a cada 30 segundos (30000 ms).
function iniciarAgendador() {
  console.log("⏰ Agendador de emails ligado (verifica a cada 30s)");
  verificarAgendados();
  setInterval(verificarAgendados, 30000);
}

module.exports = { iniciarAgendador };
