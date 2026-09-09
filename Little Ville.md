# Little Ville

Aplicação web para registro e visualização de avistamentos de criaturas em Little Ville.

O projeto é dividido em dois servidores:

- **Backend:** Node.js + Express + Prisma — porta `3000`
- **Frontend:** React + Vite — porta `5173`
- **Banco de dados:** PostgreSQL

---

# Como executar o projeto

## 1. Pré-requisitos

Antes de iniciar, instale:

- Node.js
- npm
- PostgreSQL
- Git

Verifique se Node.js e npm estão instalados:

```bash
node -v
npm -v
```

Verifique também se o PostgreSQL está instalado e em execução.

---

## 2. Baixe o repositório

Clone o repositório:

```bash
git clone URL_DO_REPOSITORIO
```

Entre na pasta do projeto:

```bash
cd littlevillereal
```

A estrutura deve ser semelhante a:

```text
littlevillereal/
├── backend-littleville/
├── frontend-littlevile/
└── README.md
```

---

# 3. Configuração do banco de dados

Abra o PostgreSQL e crie um banco chamado:

```text
littleville-db
```

Depois entre na pasta do backend:

```bash
cd backend-littleville
```

---

## 4. Configuração do `.env`

Verifique se existe um arquivo:

```text
backend-littleville/.env
```

Ele deve conter informações semelhantes a:

```env
DATABASE_URL="postgresql://postgres:SUA_SENHA@localhost:5432/littleville-db?schema=public"
PORT=3000
JWT_SECRET="uma-chave-secreta"
```

Substitua `SUA_SENHA` pela senha do usuário `postgres` do seu PostgreSQL.

### Caso o `.env` não exista

Se houver um arquivo `.env.example`, no PowerShell execute:

```powershell
Copy-Item .env.example .env
```

Depois abra o `.env` e configure os valores corretamente.

> O arquivo `.env` não deve ser enviado para o GitHub, pois contém informações de configuração e segredos.

---

# 5. Instale as dependências do backend

Dentro de:

```text
backend-littleville/
```

execute:

```bash
npm install
```

Esse comando instala todas as dependências presentes no `package.json`.

---

# 6. Configure o banco com Prisma

Ainda dentro de `backend-littleville`, execute:

```bash
npx prisma migrate deploy
```

Esse comando aplica ao banco as migrations que já estão presentes no projeto.

Depois gere o Prisma Client:

```bash
npx prisma generate
```

---

# 7. Inicie o backend

Ainda dentro de `backend-littleville`:

```bash
npm run dev
```

Se estiver tudo correto, deverá aparecer uma mensagem semelhante a:

```text
Servidor rodando na porta 3000
```

Mantenha esse terminal aberto.

O backend estará disponível em:

```text
http://localhost:3000
```

---

# 8. Instale as dependências do frontend

Abra um **novo terminal**.

Volte para a pasta principal do projeto:

```bash
cd ..
```

Entre no frontend:

```bash
cd frontend-littlevile
```

Instale as dependências:

```bash
npm install
```

Esse comando instala as dependências do React/Vite presentes no `package.json`.

---

# 9. Inicie o frontend

Ainda dentro de `frontend-littlevile`:

```bash
npm run dev
```

O Vite deverá mostrar um endereço semelhante a:

```text
http://localhost:5173
```

Abra esse endereço no navegador.

---

# 10. Ordem para executar o projeto

Sempre que for iniciar o projeto:

### Primeiro

Inicie o PostgreSQL.

### Segundo terminal — Backend

```bash
cd littlevillereal/backend-littleville
npm run dev
```

### Terceiro terminal — Frontend

```bash
cd littlevillereal/frontend-littlevile
npm run dev
```

Depois acesse:

```text
http://localhost:5173
```

---

# 11. Rotas do backend

O backend está disponível em:

```text
http://localhost:3000
```

## Autenticação

```text
POST /auth/register
POST /auth/login
```

## Avistamentos

```text
GET    /av
GET    /av/:id
POST   /av
PUT    /av/:id
DELETE /av/:id
```

O CORS já está habilitado no backend.

---

# 12. Comunicação entre frontend e backend

O frontend deve realizar requisições para:

```javascript
const API_URL = "http://localhost:3000";
```

As requisições podem ser realizadas utilizando Axios.

Atualmente, o backend possui a API funcionando, mas a integração completa das funcionalidades da API com o frontend ainda pode estar em desenvolvimento.

---

# 13. Problemas comuns

### Erro de conexão com o banco

Verifique:

- PostgreSQL está executando;
- o banco `littleville-db` existe;
- usuário e senha estão corretos;
- `DATABASE_URL` está correto;
- a porta do PostgreSQL está correta.

### Erro ao executar `npm run dev`

Primeiro execute:

```bash
npm install
```

na pasta correspondente.

Lembre-se de que **backend e frontend possuem dependências separadas**, portanto o `npm install` precisa ser executado nos dois diretórios.

### Erro relacionado ao Prisma

Dentro do backend, tente:

```bash
npx prisma generate
```

Se o banco ainda não estiver atualizado:

```bash
npx prisma migrate deploy
```