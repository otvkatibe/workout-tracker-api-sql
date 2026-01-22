# Workout Tracker API

[![Node.js](https://img.shields.io/badge/Node.js-v20+-339933?logo=node.js&logoColor=white)](https://nodejs.org/)
[![Express](https://img.shields.io/badge/Express-v4.21-000000?logo=express&logoColor=white)](https://expressjs.com/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-v16-336791?logo=postgresql&logoColor=white)](https://www.postgresql.org/)
[![License](https://img.shields.io/badge/License-ISC-blue)](LICENSE)

API RESTful para gerenciamento de treinos com autenticação JWT, desenvolvida com Node.js, Express e PostgreSQL.

## Stack

| Camada | Tecnologia |
| --- | --- |
| Runtime | Node.js 20+ |
| Framework | Express 4.21 |
| ORM | Sequelize 6 |
| Banco de Dados | PostgreSQL |
| Autenticação | JWT + bcrypt |

## Instalação

```bash
# Clone o repositório
git clone https://github.com/otvkatibe/workout-tracker-api-sql.git
cd workout-tracker-api-sql

# Instale as dependências
npm install

# Configure as variáveis de ambiente
cp .env.example .env

# Inicie o banco de dados (Docker)
npm run startdatabase

# Inicie o servidor
npm run startapp
```

## Configuração

Crie um arquivo `.env` na raiz do projeto:

```env
PORT=3000
JWT_SECRET=sua_chave_secreta_aqui

POSTGRES_USER=postgres
POSTGRES_PASSWORD=postgres
POSTGRES_HOST=localhost
POSTGRES_PORT=5432
POSTGRES_DATABASE=postgres
```

> 💡 Use `npm run generate-secret-key` para gerar uma chave JWT segura.

## API Endpoints

### Autenticação

| Método | Endpoint | Descrição |
| --- | --- | --- |
| POST | `/users/register` | Criar conta |
| POST | `/users/login` | Autenticar e obter token |

### Treinos (autenticado)

| Método | Endpoint | Descrição |
| --- | --- | --- |
| GET | `/workouts` | Listar todos os treinos |
| GET | `/workouts/:id` | Obter treino específico |
| POST | `/workouts` | Criar novo treino |
| PUT | `/workouts/:id` | Atualizar treino |
| DELETE | `/workouts/:id` | Remover treino |

> 🔐 Endpoints de treinos requerem header `Authorization: Bearer <token>`

## Uso

```bash
# 1. Registrar usuário
curl -X POST http://localhost:3000/users/register \
  -H "Content-Type: application/json" \
  -d '{"username": "john", "email": "john@email.com", "password": "Senha123"}'

# 2. Fazer login
curl -X POST http://localhost:3000/users/login \
  -H "Content-Type: application/json" \
  -d '{"username": "john", "email": "john@email.com", "password": "Senha123"}'

# 3. Criar treino (use o token retornado)
curl -X POST http://localhost:3000/workouts \
  -H "Authorization: Bearer <seu_token>" \
  -H "Content-Type: application/json" \
  -d '{"name": "Treino A", "description": "Peito e tríceps", "duration": 60}'
```

## Estrutura do Projeto

```text
src/
├── config/         # Configuração do banco
├── controller/     # Controllers da API
├── middlewares/    # Middleware JWT
├── models/         # Modelos Sequelize
├── routes/         # Rotas Express
└── services/       # Lógica de negócio
```

## Scripts

| Comando | Descrição |
| --- | --- |
| `npm run startapp` | Inicia servidor com hot-reload |
| `npm run startdatabase` | Inicia PostgreSQL via Docker |
| `npm run stopdatabase` | Para o container do banco |
| `npm run generate-secret-key` | Gera chave JWT |

## Deploy

O projeto inclui configuração para Vercel (`vercel.json`).

```bash
npm install -g vercel
vercel
```

## Licença

Este projeto está sob a licença [ISC](LICENSE).

---

Desenvolvido por [@otvkatibe](https://github.com/otvkatibe)
