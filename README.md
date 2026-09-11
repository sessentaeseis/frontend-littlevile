# Little Ville - Frontend

Frontend da aplicação Little Ville, responsável pela interface web, navegação, autenticação no cliente, gerenciamento de avistamentos, comentários, dashboard e visualização geográfica.

## 1. Stack

- React 19
- Vite 8
- React Router DOM 7
- Axios
- Leaflet
- React Leaflet
- Recharts
- Three.js
- Font Awesome
- Oxlint

---

## 2. Executando localmente

### Pré-requisitos

- Node.js
- npm
- backend do Little Ville executando
- PostgreSQL configurado no backend

### Instalação

```bash
cd frontend-littlevile
npm install
```

### Variável de ambiente

Crie `.env`:

```powershell
Copy-Item .env.example .env
```

Para desenvolvimento:

```env
VITE_API_URL=http://localhost:3000
```

Para o ambiente público, a variável deve apontar para o backend hospedado.

### Desenvolvimento

```bash
npm run dev
```

A aplicação normalmente ficará disponível em:

```text
http://localhost:5173
```

### Build

```bash
npm run build
```

### Preview

```bash
npm run preview
```

### Lint

```bash
npm run lint
```

---

# 3. Estrutura

```text
src/
├── assets/
├── components/
│   ├── AvistamentosMap.jsx
│   ├── ComentariosModal.jsx
│   ├── GlobeBackdrop.jsx
│   ├── LocationPicker.jsx
│   └── leafletIcons.js
├── pages/
│   ├── Avistamentos.jsx
│   ├── Cadastro.jsx
│   ├── Dashboard.jsx
│   ├── Landing.jsx
│   ├── Layout.jsx
│   ├── Login.jsx
│   ├── Mapa.jsx
│   └── Perfil.jsx
├── api.js
├── App.jsx
└── main.jsx
```

---

# 4. Rotas do frontend

| Rota | Página | Acesso |
|---|---|---|
| `/` | Landing | Público |
| `/login` | Login | Público |
| `/cadastro` | Cadastro | Público |
| `/dashboard` | Dashboard | Autenticado |
| `/avistamentos` | Avistamentos | Autenticado |
| `/mapa` | Mapa | Autenticado |
| `/perfil` | Perfil | Autenticado |

As páginas internas utilizam o componente `Layout`, que verifica a existência de sessão através de `isAutenticado()`. Sem token, o usuário é redirecionado para `/login`.

---

# 5. Comunicação com a API

Toda a comunicação principal está centralizada em:

```text
src/api.js
```

O Axios é configurado com:

```js
baseURL: import.meta.env.VITE_API_URL
```

Antes de cada requisição, um interceptor procura o token no `localStorage` e, quando existente, adiciona:

```text
Authorization: Bearer <token>
```

## Chaves de sessão

```text
littleville_token
littleville_user
```

Funções disponíveis:

- `getToken()`
- `setSession()`
- `getUsuario()`
- `limparSessao()`
- `isAutenticado()`
- `extrairErro()`

Se uma resposta da API tiver status `401`, o interceptor:

1. limpa a sessão;
2. redireciona para `/login`, quando necessário.

---

# 6. Páginas

## Landing

Rota:

```text
/
```

Apresenta:

- identidade do projeto;
- chamada principal;
- links para login e cadastro;
- descrição das funcionalidades;
- estatísticas ilustrativas;
- fundo visual utilizando Three.js;
- rodapé.

Os números apresentados na Landing são estáticos.

## Login

Rota:

```text
/login
```

Envia:

```http
POST /auth/login
```

Após autenticação:

- salva JWT;
- salva usuário;
- navega para `/dashboard`.

## Cadastro

Rota:

```text
/cadastro
```

Envia:

```http
POST /auth/register
```

Valida no cliente:

- campos preenchidos;
- senha com pelo menos 6 caracteres;
- confirmação de senha.

Após cadastro bem-sucedido, o usuário é encaminhado ao login.

## Dashboard

Rota:

```text
/dashboard
```

Consulta:

```http
GET /av
```

Calcula no cliente:

- total de avistamentos;
- criaturas distintas;
- localização mais citada;
- confiança média;
- cinco registros mais recentes;
- quantidade de registros com coordenadas.

Também apresenta:

- gráfico de avistamentos por criatura;
- lista de registros recentes;
- mapa com coordenadas.

## Avistamentos

Rota:

```text
/avistamentos
```

Permite:

- listar;
- pesquisar;
- criar;
- editar;
- excluir;
- abrir comentários.

A busca é feita localmente sobre:

- título;
- criatura;
- localização.

## Mapa

Rota:

```text
/mapa
```

Consulta todos os avistamentos e mostra somente aqueles com latitude e longitude.

Possui filtro por criatura.

## Perfil

Rota:

```text
/perfil
```

Consulta:

```http
GET /auth/me
GET /av
```

Exibe:

- nome;
- e-mail;
- data de cadastro;
- quantidade de avistamentos próprios;
- confiança média dos registros próprios;
- quantidade de registros próprios com localização.

---

# 7. Componentes

## `AvistamentosMap`

Componente baseado em React Leaflet.

Recebe:

```js
<AvistamentosMap
  avistamentos={...}
  altura={...}
  zoom={...}
/>
```

Filtra registros sem coordenadas e cria marcadores para os demais.

Cada marcador mostra:

- título;
- criatura;
- localização;
- data;
- confiança.

Quando não existem coordenadas, apresenta uma mensagem indicando que não há avistamentos localizados.

## `LocationPicker`

Utilizado no cadastro/edição de avistamentos.

Permite:

- clicar no mapa;
- utilizar `navigator.geolocation`;
- remover coordenadas;
- visualizar latitude e longitude selecionadas.

A localização é opcional.

## `ComentariosModal`

Modal para:

- carregar comentários;
- adicionar comentário;
- excluir comentário próprio.

A API retorna o nome do autor junto ao comentário.

## `GlobeBackdrop`

Utiliza Three.js para criar o fundo visual da Landing Page.

O componente cria e descarta recursos do renderer ao desmontar.

## `Layout`

Responsável pela área autenticada:

- barra superior;
- navegação;
- menu do usuário;
- logout;
- proteção de acesso.

---

# 8. Modelo de dados usado pelo frontend

## Avistamento

```js
{
  id,
  titulo,
  descricao,
  criatura,
  localizacao,
  latitude,
  longitude,
  data,
  confianca,
  userId,
  createdAt,
  updatedAt
}
```

## Usuário

```js
{
  id,
  nome,
  email,
  createdAt
}
```

## Comentário

```js
{
  id,
  texto,
  avistamentoId,
  userId,
  createdAt,
  autor: {
    id,
    nome
  }
}
```

---

# 9. Regras de interface

- páginas internas exigem token local;
- usuários autenticados são redirecionados do login/cadastro para o dashboard;
- ações de criação, edição e exclusão mostram estados de carregamento;
- erros da API são apresentados ao usuário;
- registros sem coordenadas não recebem marcador;
- confiança é apresentada como porcentagem;
- comentários podem ser excluídos apenas quando pertencem ao usuário atualmente salvo na sessão;
- a busca de avistamentos ignora diferenças de maiúsculas/minúsculas.

---

# 10. Mapa e geolocalização

O projeto usa:

- `leaflet`
- `react-leaflet`
- tiles do OpenStreetMap.

A seleção da posição é feita pelo usuário.

O navegador pode solicitar permissão de geolocalização quando a opção de usar a localização atual for acionada.

Se a permissão for negada ou ocorrer erro, a interface mostra uma mensagem.

O mapa possui como centro fallback uma coordenada de Florianópolis.

---

# 11. Convenções para desenvolvimento

Ao criar uma nova página:

1. criar componente em `src/pages/`;
2. importar em `App.jsx`;
3. registrar a rota;
4. usar `Layout` se a página for autenticada;
5. centralizar chamadas HTTP em `api.js`;
6. tratar loading e erros;
7. manter a comunicação com o backend através da API existente.

Ao criar um componente reutilizável:

1. colocar em `src/components/`;
2. receber dados por props;
3. evitar acoplamento desnecessário com páginas específicas;
4. tratar estados vazios e carregamento quando aplicável.

---

# 12. Deploy

O frontend público está em:

```text
https://littleville.netlify.app
```

Para um deploy baseado no build do Vite:

```bash
npm install
npm run build
```

O resultado de produção fica em:

```text
dist/
```

A variável de ambiente de produção deve apontar para a API pública.

---

# 13. Troubleshooting

## API não responde

Verifique:

```env
VITE_API_URL=http://localhost:3000
```

e confirme que o backend está executando.

## Erro de CORS

Confirme que a origem do frontend está permitida no `cors()` do backend.

Atualmente o backend permite:

```text
http://localhost:5173
https://littleville.netlify.app
```

## Mapa não aparece

Verifique:

- dependência `leaflet`;
- `react-leaflet`;
- import do CSS do Leaflet;
- conexão com os tiles do OpenStreetMap;
- existência de coordenadas nos avistamentos.

## Usuário volta para login

O token pode ter expirado ou sido invalidado.

A aplicação limpa a sessão automaticamente ao receber `401`.

---

# 14. Checklist de desenvolvimento

- [ ] `npm install`
- [ ] `.env` configurado
- [ ] backend executando
- [ ] `npm run dev`
- [ ] testar login
- [ ] testar cadastro
- [ ] testar criação de avistamento
- [ ] testar edição
- [ ] testar exclusão
- [ ] testar comentários
- [ ] testar mapa
- [ ] testar logout
- [ ] executar `npm run lint`
- [ ] executar `npm run build`

---

# 15. Responsáveis

| Membro | Atuação |
|---|---|
| **Antonio Vedana** | Rotas, BD, BackEnd e FrontEnd |
| **Lucas Vargas** | Rotas, BD e BackEnd |
| **Arthur Wolf** | React e FrontEnd |
| **Miguel Wolf** | Arquitetura e Documentação |

