# Escala Seleção

Aplicação de estudo em Angular 22 para montar a seleção e administrar o elenco convocado. O frontend usa standalone components, signals, Signal Forms, rotas lazy, OptimusUI 2 e Tailwind 4. A API Express mantém os dados de cada convidado isolados em memória e protege as rotas de jogadores com JWT.

## Requisitos

- Node.js 20.19+ ou 22.12+
- npm

## Como executar

Abra dois terminais na pasta `Escala_Selecao`.

### Docker Compose

Com Docker Desktop e Docker Compose instalados, execute na raiz do projeto:

```powershell
docker compose up --build
```

O frontend ficará em `http://localhost:4200` e o backend em `http://localhost:3000`. Os dados das sessões existem apenas na memória do backend e são descartados quando a sessão expira ou o container reinicia. Para parar os containers, use `Ctrl+C` ou execute `docker compose down`.

O compose usa uma chave JWT local para facilitar estudos; defina `JWT_SECRET` no ambiente antes de subir o compose se for usar fora da máquina local.

### Backend

```powershell
cd backend
npm install
npm run dev
```

O servidor fica em `http://localhost:3000`. Cada sessão começa com uma cópia independente dos 26 jogadores em `backend/src/data/jogadores-iniciais.ts`; alterações não são gravadas em arquivo nem banco de dados.

Para produção, defina `JWT_SECRET` com uma chave própria e opcionalmente ajuste `PORT` e `FRONTEND_URL`. No PowerShell, por exemplo, use `$env:JWT_SECRET="uma-chave-segura"` antes de iniciar a API. `backend/.env.example` é apenas um modelo de configuração; os scripts não carregam arquivos `.env` automaticamente.

### Frontend

Na raiz da pasta `Escala_Selecao`:

```powershell
npm install
npm start
```

Abra `http://localhost:4200`. O frontend aponta para `http://localhost:3000`.

## Conta de teste

- E-mail: `treinador@selecao.com`
- Senha: `Brasil2026!`

O modo principal é convidado e não precisa de credenciais. O login de estudo opcional usa `treinador@selecao.com` / `Brasil2026!`; o backend compara a senha com um hash bcrypt.

## Modo convidado

- Ao iniciar o frontend sem token, o `provideAppInitializer` solicita automaticamente uma sessão em `POST /auth/convidado`.
- Cada sessão recebe um UUID, um JWT com expiração de duas horas e sua própria cópia dos 26 jogadores em um `Map` no backend.
- O JWT fica em `sessionStorage`: permanece ao recarregar a aba, mas é descartado quando a aba é fechada.
- Cada rota `/jogadores` valida o token e opera somente no elenco associado ao UUID da sessão.
- Sessões inativas por mais de duas horas são removidas. Reiniciar o backend também descarta todas as sessões.
- **Reiniciar sessão** cria um novo UUID e restaura os jogadores ao seed inicial. Um `401` também cria uma nova sessão convidada e redireciona para a escalação.

## Rotas do frontend

| Rota | Tela |
| --- | --- |
| `/login` | Login |
| `/escalacao` | Campo e formação |
| `/jogadores` | Lista de jogadores |
| `/jogadores/novo` | Cadastro |
| `/jogadores/:id` | Detalhe |
| `/jogadores/:id/editar` | Edição |
| `**` | Página não encontrada |

A raiz redireciona para `/escalacao`. Todas as rotas, exceto login e página não encontrada, exigem autenticação.
Os botões **Novo jogador** na escalação e na lista abrem um modal sem sair da tela atual; a rota `/jogadores/novo` também abre o mesmo modal.

## Endpoints da API

| Método | Endpoint | Acesso |
| --- | --- | --- |
| `POST` | `/auth/convidado` | Público; cria uma nova sessão isolada |
| `POST` | `/auth/login` | Público; recebe `{ "email": "...", "senha": "..." }` |
| `GET` | `/health` | Público; healthcheck do container |
| `GET` | `/jogadores` | JWT obrigatório |
| `GET` | `/jogadores/:id` | JWT obrigatório |
| `POST` | `/jogadores` | JWT obrigatório |
| `PUT` | `/jogadores/:id` | JWT obrigatório |
| `DELETE` | `/jogadores/:id` | JWT obrigatório |

As operações protegidas recebem `Authorization: Bearer <token>`. O token expira em duas horas. O backend retorna `400` para dados inválidos, `401` para token inválido/expirado ou sessão inexistente, `404` para jogador inexistente na sessão e `204` após exclusão.

## Organização das etapas

1. **Componentes e signals:** `escala/escala.component.ts` coordena a escalação; `campo.component.ts` e `lista-jogadores.component.ts` cuidam do campo e da lista. O pai envia dados com `input()` e recebe ações com `output()`.
2. **Services:** `services/jogador.service.ts` mantém elenco, escalação e formação em signals e concentra operações na API; `services/auth.service.ts` mantém sessão e token.
3. **Rotas:** `app.routes.ts` configura páginas lazy e `withComponentInputBinding()` injeta parâmetros como `:id`.
4. **Signal Forms:** `pages/jogador-form.component.ts` oferece o mesmo formulário validado para inclusão e edição; `pages/novo-jogador-modal.component.ts` apresenta o cadastro em pop-up; `pages/login.component.ts` valida o acesso.
5. **Backend:** `backend/src/server.ts` contém API, validação, sessões em memória, proteção JWT e limpeza por inatividade; `backend/src/data/jogadores-iniciais.ts` é a fonte imutável do seed.
6. **Comunicação:** `httpResource` atende leituras e `HttpClient` escritas. O interceptor adiciona o token, trata 401 e atualiza/desloga a sessão.
7. **Autenticação:** `auth.guard.ts` restringe rotas; o token é isolado à aba e os controles da navbar permitem reiniciar ou encerrar a sessão.
