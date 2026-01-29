# Workout Tracker API

[![Node.js](https://img.shields.io/badge/Node.js-v20+-339933?logo=node.js&logoColor=white)](https://nodejs.org/)
[![Express](https://img.shields.io/badge/Express-v5.2-000000?logo=express&logoColor=white)](https://expressjs.com/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-v16-336791?logo=postgresql&logoColor=white)](https://www.postgresql.org/)
[![ESLint](https://img.shields.io/badge/ESLint-9.39-4B32C3?logo=eslint&logoColor=white)](https://eslint.org/)
[![Prettier](https://img.shields.io/badge/Prettier-3.8-F7B93E?logo=prettier&logoColor=black)](https://prettier.io/)
[![License](https://img.shields.io/badge/License-ISC-blue)](LICENSE)
[![Sequelize](https://img.shields.io/badge/Sequelize-6.37-52B0E7?logo=sequelize&logoColor=white)](https://sequelize.org/)
[![JWT](https://img.shields.io/badge/JWT-Auth-000000?logo=jsonwebtokens&logoColor=white)](https://jwt.io/)
[![Docker](https://img.shields.io/badge/Docker-Enabled-2496ED?logo=docker&logoColor=white)](https://www.docker.com/)
[![Nodemon](https://img.shields.io/badge/Nodemon-Dev-76D04B?logo=nodemon&logoColor=white)](https://nodemon.io/)

API RESTful para gerenciamento de treinos com autenticação JWT, sobrecarga progressiva e analytics, desenvolvida com Node.js, Express e PostgreSQL.

---

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
npm run start:database

# Inicie o servidor
npm run start:app
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
POSTGRES_SSL=false

API_NINJAS_KEY=sua_chave_api_ninjas  # Opcional: para importar exercícios
```

> Use `npm run generate-secret-key` para gerar uma chave JWT segura.

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

### Exercícios (autenticado)

| Método | Endpoint | Descrição |
| --- | --- | --- |
| GET | `/exercises` | Listar exercícios (filtros: muscle, difficulty, equipment, name) |
| GET | `/exercises/:id` | Obter exercício por ID |
| POST | `/exercises` | Criar exercício customizado |
| POST | `/exercises/import` | Importar da API Ninjas |
| PUT | `/exercises/:id` | Atualizar exercício |
| DELETE | `/exercises/:id` | Remover exercício (soft delete) |

### Séries (autenticado)

| Método | Endpoint | Descrição |
| --- | --- | --- |
| GET | `/workouts/:workoutId/sets` | Listar séries do treino |
| POST | `/workouts/:workoutId/sets` | Criar série |
| POST | `/workouts/:workoutId/sets/bulk` | Criar múltiplas séries |
| GET | `/sets/:id` | Obter série por ID |
| PUT | `/sets/:id` | Atualizar série |
| DELETE | `/sets/:id` | Remover série |

### Analytics (autenticado)

| Método | Endpoint | Descrição |
| --- | --- | --- |
| GET | `/analytics/progression/:exerciseId` | Progressão de carga com 1RM estimado |
| GET | `/analytics/volume?weeks=4` | Volume semanal total |
| GET | `/analytics/records` | Personal records por exercício |
| GET | `/analytics/frequency?period=30` | Frequência de treinos por dia |

> Todos os endpoints (exceto autenticação) requerem header `Authorization: Bearer <token>`

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

# 4. Adicionar série ao treino
curl -X POST http://localhost:3000/workouts/<workout_id>/sets \
  -H "Authorization: Bearer <seu_token>" \
  -H "Content-Type: application/json" \
  -d '{"exerciseId": "<exercise_id>", "reps": 10, "weight": 50, "rpe": 8}'

# 5. Ver progressão de um exercício
curl -X GET "http://localhost:3000/analytics/progression/<exercise_id>?period=30" \
  -H "Authorization: Bearer <seu_token>"
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
| `npm run start:app` | Inicia servidor com hot-reload |
| `npm run start:database` | Inicia PostgreSQL via Docker |
| `npm run stop:database` | Para o container do banco |
| `npm run generate-secret-key` | Gera chave JWT |
| `npm run lint` | Verifica erros de linting |
| `npm run lint:fix` | Corrige erros automaticamente |
| `npm run format` | Formata código com Prettier |

## Deploy

O projeto inclui configuração para Vercel (`vercel.json`).

```bash
npm install -g vercel
vercel
```

## Licença

Este projeto está sob a licença [ISC](LICENSE).

---

Desenvolvido por **otvkatibe**
