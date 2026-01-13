# Workout Tracker API

[![Node.js](https://img.shields.io/badge/Node.js-v20+-green)](https://nodejs.org/)
[![Express.js](https://img.shields.io/badge/Express.js-v5.1-blue)](https://expressjs.com/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-v16-336791)](https://www.postgresql.org/)
[![Sequelize](https://img.shields.io/badge/Sequelize-v6.37-52B0E7)](https://sequelize.org/)
[![License](https://img.shields.io/badge/License-ISC-yellow)](LICENSE)

Uma API robusta e segura para gerenciamento de treinos com autenticação JWT, desenvolvida com Node.js, Express e PostgreSQL.

## 📋 Sumário

- [Visão Geral](#visão-geral)
- [Recursos](#recursos)
- [Requisitos](#requisitos)
- [Instalação](#instalação)
- [Configuração](#configuração)
- [Como Executar](#como-executar)
- [Endpoints da API](#endpoints-da-api)
- [Estrutura do Projeto](#estrutura-do-projeto)
- [Autenticação](#autenticação)
- [Exemplos de Uso](#exemplos-de-uso)
- [Variáveis de Ambiente](#variáveis-de-ambiente)
- [Contribuindo](#contribuindo)
- [Licença](#licença)

## 🎯 Visão Geral

Workout Tracker API é uma aplicação backend escalável que permite aos usuários registrar, gerenciar e acompanhar seus treinos. A API implementa padrões modernos de desenvolvimento como separação de responsabilidades (MVC), autenticação segura com JWT e persistência de dados em PostgreSQL.

### Características Principais

- ✅ **Autenticação Segura**: JWT (JSON Web Tokens) com criptografia de senha
- ✅ **CRUD Completo**: Gerenciamento de usuários e treinos
- ✅ **Banco de Dados Robusto**: PostgreSQL com ORM Sequelize
- ✅ **Validação de Dados**: Email, senha e entrada do usuário
- ✅ **Arquitetura Modular**: Controllers, Services, Models e Routes separados
- ✅ **Containerização**: Docker e Docker Compose para fácil deployment

## 🚀 Recursos

### Gestão de Usuários
- Registro de novos usuários com validação de email
- Login com autenticação JWT
- Proteção de senhas com bcrypt

### Gestão de Treinos
- Criar novos treinos
- Listar treinos do usuário autenticado
- Atualizar informações de treinos
- Deletar treinos
- Restrição de acesso: usuários só podem acessar seus próprios treinos

### Segurança
- Middleware JWT para proteger rotas privadas
- Hash de senhas com bcrypt
- Validação de entrada (email, senha forte)
- Isolamento de dados por usuário

## 📦 Requisitos

- **Node.js**: v18.0.0 ou superior
- **npm**: v8.0.0 ou superior
- **Docker**: v20.0.0 ou superior (opcional, mas recomendado)
- **Docker Compose**: v1.29.0 ou superior (opcional)

## 💾 Instalação

### 1. Clone o Repositório

```bash
git clone https://github.com/otvkatibe/workout-tracker-api-sql.git
cd workout-tracker-api-sql
```

### 2. Instale as Dependências

```bash
npm install
```

### 3. Configure o Banco de Dados

#### Opção A: Com Docker Compose (Recomendado)

```bash
npm run startdatabase
```

Isso iniciará:
- Container PostgreSQL na porta 5432
- Container pgAdmin na porta 5050

#### Opção B: Instalação Local

Certifique-se de ter PostgreSQL instalado e em execução:

```bash
# No macOS com Homebrew
brew install postgresql
brew services start postgresql

# No Ubuntu/Debian
sudo apt-get install postgresql postgresql-contrib
sudo service postgresql start
```

## ⚙️ Configuração

### 1. Arquivo de Variáveis de Ambiente

Crie um arquivo `.env` na raiz do projeto:

```bash
cp .env.example .env  # se existir
# ou crie manualmente:
touch .env
```

### 2. Configure as Variáveis

Abra `.env` e adicione:

```env
# Banco de Dados
DB_HOST=localhost
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=postgres
DB_NAME=workout_db

# Servidor
PORT=3000
NODE_ENV=development

# JWT
JWT_SECRET=sua_chave_secreta_super_longa_e_segura_aqui

# Docker (se usar docker-compose)
POSTGRES_USER=postgres
POSTGRES_PASSWORD=postgres
POSTGRES_DATABASE=workout_db
POSTGRES_PORT=5432
PGADMIN_DEFAULT_EMAIL=admin@admin.com
PGADMIN_DEFAULT_PASSWORD=admin
```

### 3. Gerar uma Chave Secreta JWT

```bash
npm run generate-secret-key
```

Copie o resultado e adicione a `JWT_SECRET` no arquivo `.env`.

## 🏃 Como Executar

### Desenvolvimento

```bash
# Terminal 1: Inicie o banco de dados
npm run startdatabase

# Terminal 2: Inicie o servidor com auto-reload
npm run startapp
```

O servidor estará disponível em: `http://localhost:3000`

### Verificar se está funcionando

```bash
curl http://localhost:3000
# Resposta esperada: "EXPRESS BACKEND COM POSTGRESQL"
```

### Parar o Banco de Dados

```bash
npm run stopdatabase
```

## 🔌 Endpoints da API

### Autenticação - `/users`

#### Registrar Novo Usuário
```http
POST /users/register
Content-Type: application/json

{
  "username": "joao_silva",
  "email": "joao@example.com",
  "password": "Senha123"
}
```

**Requisitos de Senha**: Mínimo 8 caracteres, com letras e números

**Respostas:**
- `201 Created`: Usuário registrado com sucesso
- `400 Bad Request`: Dados inválidos ou incompletos
- `500 Internal Server Error`: Erro ao salvar usuário

#### Fazer Login
```http
POST /users/login
Content-Type: application/json

{
  "username": "joao_silva",
  "email": "joao@example.com",
  "password": "Senha123"
}
```

**Respostas:**
- `200 OK`: Login bem-sucedido (retorna JWT)
- `400 Bad Request`: Dados inválidos
- `401 Unauthorized`: Credenciais incorretas

### Treinos - `/workouts`

#### Criar Novo Treino
```http
POST /workouts
Authorization: Bearer {token_jwt}
Content-Type: application/json

{
  "name": "Treino de Peito",
  "description": "Supino, Flexão de Braço",
  "duration": 60,
  "date": "2024-01-15"
}
```

#### Listar Treinos do Usuário
```http
GET /workouts
Authorization: Bearer {token_jwt}
```

#### Obter Treino Específico
```http
GET /workouts/:id
Authorization: Bearer {token_jwt}
```

#### Atualizar Treino
```http
PUT /workouts/:id
Authorization: Bearer {token_jwt}
Content-Type: application/json

{
  "name": "Treino de Peito Avançado",
  "description": "Supino inclinado, Crossover",
  "duration": 75
}
```

#### Deletar Treino
```http
DELETE /workouts/:id
Authorization: Bearer {token_jwt}
```

## 📁 Estrutura do Projeto

```
workout-tracker-api-sql/
├── src/
│   ├── index.js                 # Entrada da aplicação
│   ├── config/
│   │   └── db.config.js         # Configuração do banco de dados
│   ├── controller/
│   │   ├── user.controller.js   # Lógica de usuários
│   │   └── workout.controller.js # Lógica de treinos
│   ├── middlewares/
│   │   └── jwt.token.middleware.js # Middleware de autenticação JWT
│   ├── models/
│   │   ├── index.js             # Configuração de modelos
│   │   ├── User.js              # Modelo de usuário
│   │   └── Workout.js           # Modelo de treino
│   ├── routes/
│   │   ├── user.route.js        # Rotas de usuário
│   │   └── workout.route.js     # Rotas de treino
│   └── services/
│       ├── user.service.js      # Lógica de negócio de usuário
│       └── workout.service.js   # Lógica de negócio de treino
├── requests/                    # Scripts de teste (curl)
│   ├── register_User.sh
│   ├── login_user.sh
│   ├── create_workout.sh
│   ├── get_workout.sh
│   ├── update_workout.sh
│   └── delete_workout.sh
├── docker-compose.yml           # Orquestração de containers
├── package.json                 # Dependências do projeto
├── .env                         # Variáveis de ambiente (não versionar)
├── .gitignore
├── README.md                    # Este arquivo
└── vercel.json                  # Configuração para deploy Vercel
```

## 🔐 Autenticação

### Fluxo de Autenticação JWT

1. **Registro**: Usuário cria conta com username, email e senha
2. **Hashing**: Senha é criptografada com bcrypt
3. **Login**: Usuário fornece credenciais
4. **Validação**: Sistema valida e gera JWT
5. **Token**: JWT é retornado ao cliente
6. **Requisições**: Cliente inclui JWT no header `Authorization: Bearer {token}`

### Middleware JWT

Todas as rotas de treino requerem o token JWT no header:

```javascript
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

## 📝 Exemplos de Uso

### Fluxo Completo

```bash
# 1. Registrar usuário
./requests/register_User.sh

# 2. Fazer login (obter token)
./requests/login_user.sh

# 3. Criar treino (use o token obtido)
./requests/create_workout.sh

# 4. Listar treinos
curl -H "Authorization: Bearer {seu_token}" http://localhost:3000/workouts

# 5. Atualizar treino
./requests/update_workout.sh

# 6. Deletar treino
./requests/delete_workout.sh
```

### Com cURL

```bash
# Registrar
curl -X POST http://localhost:3000/users/register \
  -H "Content-Type: application/json" \
  -d '{
    "username": "usuario1",
    "email": "usuario1@example.com",
    "password": "Senha123"
  }'

# Login
curl -X POST http://localhost:3000/users/login \
  -H "Content-Type: application/json" \
  -d '{
    "username": "usuario1",
    "email": "usuario1@example.com",
    "password": "Senha123"
  }'

# Criar treino (com token)
curl -X POST http://localhost:3000/workouts \
  -H "Authorization: Bearer {seu_token_aqui}" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Cardio",
    "description": "30 minutos de corrida",
    "duration": 30,
    "date": "2024-01-15"
  }'
```

## 🌍 Variáveis de Ambiente

| Variável | Descrição | Padrão |
|----------|-----------|--------|
| `PORT` | Porta do servidor | 3000 |
| `NODE_ENV` | Ambiente (development/production) | development |
| `DB_HOST` | Host do PostgreSQL | localhost |
| `DB_PORT` | Porta do PostgreSQL | 5432 |
| `DB_USER` | Usuário do banco | postgres |
| `DB_PASSWORD` | Senha do banco | postgres |
| `DB_NAME` | Nome do banco | workout_db |
| `JWT_SECRET` | Chave secreta JWT | (obrigatório) |
| `POSTGRES_USER` | Usuário Docker (docker-compose) | postgres |
| `POSTGRES_PASSWORD` | Senha Docker (docker-compose) | postgres |
| `POSTGRES_DATABASE` | DB Docker (docker-compose) | postgres |

## 🛠️ Stack Tecnológico

### Backend
- **Node.js**: Runtime JavaScript server-side
- **Express.js**: Framework web minimalista
- **Sequelize**: ORM para Node.js
- **PostgreSQL**: Banco de dados relacional

### Segurança
- **bcrypt**: Hash de senhas
- **jsonwebtoken (JWT)**: Autenticação stateless
- **dotenv**: Gerenciamento de variáveis de ambiente

### Desenvolvimento
- **nodemon**: Auto-reload durante desenvolvimento
- **Docker**: Containerização da aplicação

## 🚀 Deployment

### Vercel

A configuração para Vercel está incluída em `vercel.json`. Para fazer deploy:

```bash
npm install -g vercel
vercel
```

### Alternativas

- **Heroku**: `git push heroku main`
- **AWS**: Usar Elastic Beanstalk ou EC2
- **DigitalOcean**: Usar App Platform
- **Railway.app**: Deploy automático via Git

## 🤝 Contribuindo

Contribuições são bem-vindas! Para contribuir:

1. Faça um Fork do projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## 📄 Licença

Este projeto está licenciado sob a Licença ISC - veja o arquivo [LICENSE](LICENSE) para detalhes.

## 👤 Autor

Desenvolvido por: otvkatibe

## 📞 Suporte

Para dúvidas ou problemas:
- Abra uma issue no GitHub
- Consulte a documentação do [Express.js](https://expressjs.com/)
- Consulte a documentação do [Sequelize](https://sequelize.org/)

---

**Versão**: 2.1.0  
**Última atualização**: Janeiro 2026 
