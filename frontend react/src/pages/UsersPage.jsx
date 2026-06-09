import { useState, useEffect } from "react";
import axios from "axios";
import Header from "../components/Header";
import StatusBadge from "../components/StatusBadge";
import { COLORS, FONT, RADIUS, SHADOW } from "../design";

const roleColors = {
  Administrador: { bg: "#fff8e6", color: "#a07800" },
  Operador:      { bg: "#e8f4fd", color: "#1e6a9e" },
  Visualizador:  { bg: "#f4f0ff", color: "#6d28d9" },
};

export default function UsersPage() {
  const [users, setUsers] = useState([]); 
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newUser, setNewUser] = useState({ name: "", username: "", email: "", role: "Visualizador", status: "Pendente" });

  useEffect(() => {
    // 1. Colocamos o link completo de volta
    axios.get("http://localhost:8081/api/usuarios")
      .then(response => {
        // BLINDAGEM: Só salva se for realmente uma lista (Array)
        if (Array.isArray(response.data)) {
          setUsers(response.data);
        } else {
          setUsers([]);
        }
      })
      .catch(error => {
        console.error("Erro ao buscar usuários:", error);
        setUsers([]); // Em caso de erro, garante que continua sendo uma lista vazia
      });
  }, []);

  const handleCreateUser = async () => {
    if (!newUser.name || !newUser.email) {
      alert("Por favor, preencha os campos obrigatórios (Nome e E-mail)!");
      return;
    }
    try {
      await axios.post("http://localhost:8081/api/usuarios", newUser);
      const response = await axios.get("http://localhost:8081/api/usuarios");
      
      // BLINDAGEM aqui também
      setUsers(Array.isArray(response.data) ? response.data : []);
      
      setIsModalOpen(false);
      setNewUser({ name: "", username: "", email: "", role: "Visualizador", status: "Pendente" });
    } catch (error) {
      console.error("Erro ao criar usuário:", error);
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
          onClick={() => setIsModalOpen(true)}
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
                {["Usuário", "E-mail", "Perfil", "Status", "Último Acesso", "Ações"].map((h) => (
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
                    <td style={{ padding: "14px 16px", verticalAlign: "middle" }}>
                      <StatusBadge status={u.status} />
                    </td>
                    <td style={{ padding: "14px 16px", fontSize: 12, color: COLORS.textMuted, verticalAlign: "middle" }}>
                      {u.lastLogin}
                    </td>
                    <td style={{ padding: "14px 16px", verticalAlign: "middle" }}>
                      <div style={{ display: "flex", gap: 6 }}>
                        <button style={{
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
          <h3>Novo Usuário</h3>
          <input placeholder="Nome" value={newUser.name} onChange={e => setNewUser({...newUser, name: e.target.value})} style={{ display: 'block', marginBottom: 10, padding: 8, width: '100%' }} />
          <input placeholder="Username" value={newUser.username} onChange={e => setNewUser({...newUser, username: e.target.value})} style={{ display: 'block', marginBottom: 10, padding: 8, width: '100%' }} />
          <input placeholder="Email" value={newUser.email} onChange={e => setNewUser({...newUser, email: e.target.value})} style={{ display: 'block', marginBottom: 10, padding: 8, width: '100%' }} />
          
          <label style={{ fontSize: 12, display: 'block', marginBottom: 5 }}>Perfil:</label>
          <select 
            value={newUser.role} 
            onChange={e => setNewUser({...newUser, role: e.target.value})}
            style={{ display: 'block', marginBottom: 15, padding: 8, width: '100%' }}
          >
            <option value="Administrador">Administrador</option>
            <option value="Operador">Operador</option>
            <option value="Visualizador">Visualizador</option>
          </select>

          <button onClick={handleCreateUser} style={{ marginRight: 10, padding: '8px 16px', background: COLORS.green, color: '#fff', border: 'none', cursor: 'pointer' }}>Salvar no Banco</button>
          <button onClick={() => setIsModalOpen(false)} style={{ padding: '8px 16px', cursor: 'pointer' }}>Cancelar</button>
        </div>
      )}
    </div>
  );
}