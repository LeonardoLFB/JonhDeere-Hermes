# HERMES — Sistema de Email Corporativo (John Deere)

Este repositório contém **duas versões** do sistema, cada uma com seu próprio
frontend e backend. As pastas andam em pares — não misture o frontend de uma
com o backend da outra.

## Estrutura das pastas

| Pasta | O que é | Porta | Par |
|---|---|---|---|
| `backend-node/` | API em Node.js/Express (emails, templates, agendador) | 3001 | `frontend-react/` e `frontend-node/` |
| `frontend-node/` | Frontend React antigo do sistema de email (antiga "sistem jonh deere") | 5173 | `backend-node/` |
| `backend-spring/` | API em Java/Spring Boot (usuários e login) | 8081 | `frontend-react/` |
| `frontend-react/` | Frontend React principal (antiga "frontend react") | 5173 | usuários → `backend-spring/` · emails → `backend-node/` |

> **Para usar o app principal (`frontend-react`), os DOIS backends precisam estar ligados:**
> `backend-spring` (login/usuários, porta 8081) e `backend-node` (emails, porta 3001).

Ambos os backends usam **PostgreSQL** rodando em `localhost:5432`.

> **Atenção:** a senha do Postgres é diferente em cada máquina. Ajuste a sua em
> `backend-spring/src/main/resources/application.properties` e em `backend-node/.env`
> (o `.env` não vai para o GitHub — cada um cria o seu).

## Como rodar — versão Node (sistema de email completo)

### 1. Backend

Crie um arquivo `backend-node/.env` com:

```env
DB_HOST=localhost
DB_PORT=5432
DB_NAME=hermes
DB_USER=postgres
DB_PASSWORD=sua_senha

GMAIL_USER=seu_email@gmail.com
GMAIL_PASS=sua_senha_de_app

PORT=3001
```

Depois:

```bash
cd backend-node
npm install
npm start
```

### 2. Frontend

```bash
cd frontend-node
npm install
npm run dev
```

Abra http://localhost:5173.

### Rotas de usuário (API Node)

| Método | Rota | O que faz |
|---|---|---|
| POST | `/api/auth/login` | Valida email e senha |
| POST | `/api/auth/cadastrar` | Cria um novo usuário |
| GET | `/api/auth/usuarios` | Lista todos os usuários |
| DELETE | `/api/auth/usuarios/:id` | Exclui um usuário |

## Como rodar — versão Spring (painel de usuários)

### 1. Backend

O banco e a senha estão configurados em
`backend-spring/src/main/resources/application.properties`
(banco `hermes_db`, usuário `postgres`). Crie o banco se ainda não existir:

```sql
CREATE DATABASE hermes_db;
```

Depois:

```bash
cd backend-spring
mvnw spring-boot:run
```

A API sobe em http://localhost:8081.

### 2. Frontend

```bash
cd frontend-react
npm install
npm run dev
```

### Rotas de usuário (API Spring)

| Método | Rota | O que faz |
|---|---|---|
| GET | `/api/usuarios` | Lista todos os usuários |
| POST | `/api/usuarios` | Cria um novo usuário (exige nome, username, email e senha) |
| POST | `/api/usuarios/login` | Valida login `{ "login": "username ou email", "senha": "..." }` |
| PUT | `/api/usuarios/{id}` | Edita um usuário (senha em branco = mantém a atual) |
| DELETE | `/api/usuarios/{id}` | Exclui um usuário |

Usuário inicial: **admin** / **admin123** (troque a senha depois pela tela de edição).
