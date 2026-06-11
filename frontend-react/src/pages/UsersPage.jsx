import { useState, useEffect } from "react";
import axios from "axios";
import Header from "../components/Header";
import { COLORS, FONT, RADIUS, SHADOW } from "../design";

const API = "http://localhost:8081/api/usuarios";

const roleColors = {
  Administrador: { bg: "#fff8e6", color: "#a07800" },
  Operador:      { bg: "#e8f4fd", color: "#1e6a9e" },
  Visualizador:  { bg: "#f4f0ff", color: "#6d28d9" },
};

const FORM_VAZIO = { name: "", username: "", email: "", senha: "", role: "Visualizador" };

export default function UsersPage() {
  const [users, setUsers] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  // null = criando usuário novo; um id = editando esse usuário
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(FORM_VAZIO);

  const carregarUsuarios = async () => {
    try {
      const response = await axios.get(API);
      // BLINDAGEM: Só salva se for realmente uma lista (Array)
      setUsers(Array.isArray(response.data) ? response.data : []);
    } catch (error) {
      console.error("Erro ao buscar usuários:", error);
      setUsers([]);
    }
  };

  useEffect(() => {
    carregarUsuarios();
  }, []);

  const abrirCriacao = () => {
    setEditingId(null);
    setForm(FORM_VAZIO);
    setIsModalOpen(true);
  };

  const abrirEdicao = (usuario) => {
    setEditingId(usuario.id);
    // senha fica vazia: só é trocada se digitar uma nova
    setForm({ name: usuario.name, username: usuario.username, email: usuario.email, senha: "", role: usuario.role });
    setIsModalOpen(true);
  };

  const handleSave = async () => {
    if (!form.name || !form.username || !form.email) {
      alert("Por favor, preencha nome, username e e-mail!");
      return;
    }
    if (!editingId && form.senha.length < 6) {
      alert("A senha deve ter pelo menos 6 caracteres!");
      return;
    }
    try {
      if (editingId) {
        await axios.put(`${API}/${editingId}`, form);
      } else {
        await axios.post(API, form);
      }
      await carregarUsuarios();
      setIsModalOpen(false);
      setForm(FORM_VAZIO);
      setEditingId(null);
    } catch (error) {
      console.error("Erro ao salvar usuário:", error);
      alert(error.response?.data?.erro || "Erro ao salvar usuário.");
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Tem certeza que deseja excluir este usuário definitivamente?")) {
      try {
        await axios.delete(`http://localhost:8081/api/usuarios/${id}`);
        setUsers(users.filter(u => u.id !== id)); 
      } catch (error) {
        console.error("Erro ao excluir usuário:", error);
        alert("Erro ao excluir. Verifique se o backend está rodando corretamente.");
      }
    }
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 24, fontFamily: FONT }}>
      <Header
        title="Usuários"
        subtitle="Gestão de acessos e permissões da plataforma"
        action={
          <button
          onClick={abrirCriacao}
          style={{
            display: "flex", alignItems: "center", gap: 8,
            background: COLORS.green, color: "#fff",
            border: "none", borderRadius: RADIUS.md,
            padding: "10px 20px", fontSize: 14, fontWeight: 700,
            cursor: "pointer", fontFamily: FONT,
          }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
            </svg>
            Novo Usuário
          </button>
        }
      />

      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 14 }}>
        {["Administrador", "Operador", "Visualizador"].map((role) => {
          // BLINDAGEM VISUAL: garante que o 'users' nunca será null aqui
          const count = (users || []).filter((u) => u.role === role).length;
          const rc = roleColors[role] || {};
          return (
            <div key={role} style={{
              background: rc.bg, borderRadius: RADIUS.lg,
              border: `1px solid ${COLORS.border}`, padding: "18px 22px",
            }}>
              <div style={{ fontSize: 11, fontWeight: 600, color: rc.color, textTransform: "uppercase", letterSpacing: "0.5px", marginBottom: 6 }}>
                {role}
              </div>
              <div style={{ fontSize: 26, fontWeight: 800, color: COLORS.textPrimary, letterSpacing: "-0.5px" }}>
                {count}
              </div>
            </div>
          );
        })}
      </div>

      <div style={{
        background: COLORS.surface, borderRadius: RADIUS.lg,
        border: `1px solid ${COLORS.border}`, boxShadow: SHADOW.card,
        overflow: "hidden",
      }}>
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ background: COLORS.bg }}>
                {["Usuário", "E-mail", "Perfil", "Último Acesso", "Ações"].map((h) => (
                  <th key={h} style={{
                    fontSize: 11, color: COLORS.textMuted, fontWeight: 600,
                    textAlign: "left", padding: "12px 16px",
                    borderBottom: `1px solid ${COLORS.border}`,
                    textTransform: "uppercase", letterSpacing: "0.5px",
                  }}>
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {/* BLINDAGEM VISUAL: garante que não quebra no map */}
              {(users || []).map((u) => {
                const rc = roleColors[u.role] || {};
                return (
                  <tr key={u.id} style={{ borderBottom: `1px solid ${COLORS.borderLight}` }}>
                    <td style={{ padding: "14px 16px", verticalAlign: "middle" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                        <div style={{
                          width: 34, height: 34, borderRadius: "50%",
                          background: COLORS.greenLight, color: COLORS.green,
                          display: "flex", alignItems: "center", justifyContent: "center",
                          fontWeight: 800, fontSize: 14, flexShrink: 0,
                        }}>
                          {u.name ? u.name[0] : '?'}
                        </div>
                        <div>
                          <div style={{ fontSize: 13, fontWeight: 700, color: COLORS.textPrimary }}>{u.name}</div>
                          <div style={{ fontSize: 11, color: COLORS.textMuted }}>@{u.username}</div>
                        </div>
                      </div>
                    </td>
                    <td style={{ padding: "14px 16px", fontSize: 13, color: COLORS.textSecondary, verticalAlign: "middle" }}>
                      {u.email}
                    </td>
                    <td style={{ padding: "14px 16px", verticalAlign: "middle" }}>
                      <span style={{
                        background: rc.bg, color: rc.color,
                        borderRadius: RADIUS.full, padding: "3px 10px",
                        fontSize: 12, fontWeight: 700,
                      }}>
                        {u.role}
                      </span>
                    </td>
                    <td style={{ padding: "14px 16px", fontSize: 12, color: COLORS.textMuted, verticalAlign: "middle" }}>
                      {u.lastLogin || "Nunca acessou"}
                    </td>
                    <td style={{ padding: "14px 16px", verticalAlign: "middle" }}>
                      <div style={{ display: "flex", gap: 6 }}>
                        <button
                          onClick={() => abrirEdicao(u)}
                          style={{
                          padding: "5px 12px", borderRadius: RADIUS.sm,
                          border: `1px solid ${COLORS.border}`,
                          background: COLORS.surface, color: COLORS.textSecondary,
                          fontSize: 12, fontWeight: 600, cursor: "pointer", fontFamily: FONT,
                        }}>
                          Editar
                        </button>
                        <button 
                          onClick={() => handleDelete(u.id)}
                          style={{
                          padding: "5px 12px", borderRadius: RADIUS.sm,
                          border: `1px solid ${COLORS.dangerBorder}`,
                          background: COLORS.dangerBg, color: COLORS.danger,
                          fontSize: 12, fontWeight: 600, cursor: "pointer", fontFamily: FONT,
                        }}>
                          Excluir
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
      
      {isModalOpen && (
        <div style={{ padding: 20, background: '#fff', border: '1px solid #ccc', margin: 20 }}>
          <h3>{editingId ? "Editar Usuário" : "Novo Usuário"}</h3>
          <input placeholder="Nome" value={form.name} onChange={e => setForm({...form, name: e.target.value})} style={{ display: 'block', marginBottom: 10, padding: 8, width: '100%' }} />
          <input placeholder="Username" value={form.username} onChange={e => setForm({...form, username: e.target.value})} style={{ display: 'block', marginBottom: 10, padding: 8, width: '100%' }} />
          <input placeholder="Email" value={form.email} onChange={e => setForm({...form, email: e.target.value})} style={{ display: 'block', marginBottom: 10, padding: 8, width: '100%' }} />
          <input
            type="password"
            placeholder={editingId ? "Nova senha (deixe em branco para manter)" : "Senha (mínimo 6 caracteres)"}
            value={form.senha}
            onChange={e => setForm({...form, senha: e.target.value})}
            style={{ display: 'block', marginBottom: 10, padding: 8, width: '100%' }}
          />

          <label style={{ fontSize: 12, display: 'block', marginBottom: 5 }}>Perfil:</label>
          <select
            value={form.role}
            onChange={e => setForm({...form, role: e.target.value})}
            style={{ display: 'block', marginBottom: 15, padding: 8, width: '100%' }}
          >
            <option value="Administrador">Administrador</option>
            <option value="Operador">Operador</option>
            <option value="Visualizador">Visualizador</option>
          </select>

          <button onClick={handleSave} style={{ marginRight: 10, padding: '8px 16px', background: COLORS.green, color: '#fff', border: 'none', cursor: 'pointer' }}>
            {editingId ? "Salvar Alterações" : "Salvar no Banco"}
          </button>
          <button onClick={() => setIsModalOpen(false)} style={{ padding: '8px 16px', cursor: 'pointer' }}>Cancelar</button>
        </div>
      )}
    </div>
  );
}