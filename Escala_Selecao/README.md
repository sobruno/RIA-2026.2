# Escala Seleção

Aplicação de estudo em Angular 22 para montar a seleção e administrar o elenco convocado. O frontend usa standalone components, signals, Signal Forms, rotas lazy, OptimusUI 2 e Tailwind 4. A API Express salva os jogadores em `backend/data/jogadores.json` e protege a área de jogadores com JWT.

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

O frontend ficará em `http://localhost:4200` e o backend em `http://localhost:3000`. Os arquivos JSON do backend ficam bind-mounted em `backend/data`, então as alterações dos jogadores persistem no repositório. Para parar os containers, use `Ctrl+C` ou execute `docker compose down`.

O compose usa uma chave JWT local para facilitar estudos; defina `JWT_SECRET` no ambiente antes de subir o compose se for usar fora da máquina local.

### Backend

```powershell
cd backend
npm install
npm run dev
```

O servidor fica em `http://localhost:3000`. Os jogadores iniciais são carregados do arquivo `backend/data/jogadores.json`; alterações CRUD ficam persistidas nesse mesmo arquivo.

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

A conta padrão é carregada de `backend/data/usuarios.json`; o arquivo guarda somente o hash bcrypt, nunca a senha em texto puro.

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
| `POST` | `/auth/login` | Público; recebe `{ "email": "...", "senha": "..." }` |
| `GET` | `/health` | Público; healthcheck do container |
| `GET` | `/jogadores` | JWT obrigatório |
| `GET` | `/jogadores/:id` | JWT obrigatório |
| `POST` | `/jogadores` | JWT obrigatório |
| `PUT` | `/jogadores/:id` | JWT obrigatório |
| `DELETE` | `/jogadores/:id` | JWT obrigatório |

As operações protegidas recebem `Authorization: Bearer <token>`. O token expira em duas horas. O backend retorna `400` para dados inválidos, `401` para ausência/invalidade do token, `404` para jogador inexistente e `204` após exclusão.

## Organização das etapas

1. **Componentes e signals:** `escala/escala.component.ts` coordena a escalação; `campo.component.ts` e `lista-jogadores.component.ts` cuidam do campo e da lista. O pai envia dados com `input()` e recebe ações com `output()`.
2. **Services:** `services/jogador.service.ts` mantém elenco, escalação e formação em signals e concentra operações na API; `services/auth.service.ts` mantém sessão e token.
3. **Rotas:** `app.routes.ts` configura páginas lazy e `withComponentInputBinding()` injeta parâmetros como `:id`.
4. **Signal Forms:** `pages/jogador-form.component.ts` oferece o mesmo formulário validado para inclusão e edição; `pages/novo-jogador-modal.component.ts` apresenta o cadastro em pop-up; `pages/login.component.ts` valida o acesso.
5. **Backend:** `backend/src/server.ts` contém API, persistência JSON, validação e proteção JWT; `backend/data/jogadores.json` guarda os 26 convocados e `backend/data/usuarios.json` guarda o usuário de teste com hash bcrypt.
6. **Comunicação:** `httpResource` atende leituras e `HttpClient` escritas. O interceptor adiciona o token, trata 401 e atualiza/desloga a sessão.
7. **Autenticação:** `auth.guard.ts` restringe rotas e o botão Sair encerra a sessão.
