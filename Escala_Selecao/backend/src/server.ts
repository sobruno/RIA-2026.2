import bcrypt from 'bcryptjs';
import cors from 'cors';
import express, { NextFunction, Request, Response } from 'express';
import { randomUUID } from 'node:crypto';
import jwt from 'jsonwebtoken';
import { JOGADORES_INICIAIS } from './data/jogadores-iniciais';
import { Jogador } from './models/jogador';

interface Credenciais {
  email: string;
  senha: string;
}

interface Sessao {
  jogadores: Jogador[];
  ultimaAtividade: number;
}

declare global {
  namespace Express {
    interface Request {
      sessaoId?: string;
    }
  }
}

const app = express();
const jwtSecret = process.env.JWT_SECRET ?? 'chave-de-desenvolvimento-apenas-local';
const duasHorasEmMs = 2 * 60 * 60 * 1000;
const posicoes = new Set(['GOL', 'ZAG', 'LD', 'LE', 'VOL', 'MEI', 'PD', 'PE', 'ATA']);
// O estado das sessões existe somente neste processo; reiniciar a API limpa o Map.
const sessoes = new Map<string, Sessao>();
const emailTeste = 'treinador@selecao.com';
const senhaTesteHash = '$2b$10$79s2Gm/fJWtiSubzwxuI3e7RNYWpi/FXbWoU3wxQlFYuJ7ZXNwW92';

app.use(cors({ origin: process.env.FRONTEND_URL ?? 'http://localhost:4200' }));
app.use(express.json({ limit: '10kb' }));

app.get('/health', (_request, response) => {
  response.json({ status: 'ok' });
});

function validarJogador(dados: unknown): Omit<Jogador, 'id'> | null {
  if (!dados || typeof dados !== 'object') return null;
  const entrada = dados as Record<string, unknown>;
  const nome = typeof entrada['nome'] === 'string' ? entrada['nome'].trim() : '';
  const numeroCamisa = entrada['numeroCamisa'];
  const dataNascimento = entrada['dataNascimento'];
  const posicao = entrada['posicao'];
  const clube = typeof entrada['clube'] === 'string' ? entrada['clube'].trim() : '';
  const dataValida = typeof dataNascimento === 'string'
    && /^\d{4}-\d{2}-\d{2}$/.test(dataNascimento)
    && !Number.isNaN(Date.parse(`${dataNascimento}T00:00:00Z`))
    && new Date(`${dataNascimento}T00:00:00Z`).toISOString().slice(0, 10) === dataNascimento;

  if (
    !nome
    || !Number.isInteger(numeroCamisa)
    || Number(numeroCamisa) < 1
    || Number(numeroCamisa) > 99
    || !dataValida
    || typeof posicao !== 'string'
    || !posicoes.has(posicao)
    || !clube
  ) return null;

  return {
    nome,
    numeroCamisa: Number(numeroCamisa),
    dataNascimento: dataNascimento as string,
    titular: typeof entrada['titular'] === 'boolean' ? entrada['titular'] : false,
    posicao,
    clube,
  };
}

function tokenDaSessao(sessaoId: string): string {
  return jwt.sign({ sessaoId }, jwtSecret, { expiresIn: '2h' });
}

function criarSessao(): { sessaoId: string; token: string } {
  const sessaoId = randomUUID();
  // Cada convidado recebe objetos próprios; nenhuma rota modifica a lista base.
  const jogadores = JOGADORES_INICIAIS.map((jogador) => ({ ...jogador }));
  sessoes.set(sessaoId, { jogadores, ultimaAtividade: Date.now() });
  return { sessaoId, token: tokenDaSessao(sessaoId) };
}

function protegerRota(request: Request, response: Response, next: NextFunction): void {
  const authorization = request.header('Authorization');
  const token = authorization?.startsWith('Bearer ') ? authorization.slice(7) : '';
  if (!token) {
    response.status(401).json({ mensagem: 'Token de autenticação obrigatório.' });
    return;
  }

  try {
    const payload = jwt.verify(token, jwtSecret);
    if (typeof payload === 'string' || typeof payload.sessaoId !== 'string') {
      response.status(401).json({ mensagem: 'Token sem sessão válida.' });
      return;
    }

    const sessao = sessoes.get(payload.sessaoId);
    if (!sessao) {
      response.status(401).json({ mensagem: 'A sessão expirou ou o servidor foi reiniciado.' });
      return;
    }

    // O ID validado pelo JWT identifica exclusivamente o elenco deste convidado.
    request.sessaoId = payload.sessaoId;
    sessao.ultimaAtividade = Date.now();
    next();
  } catch {
    response.status(401).json({ mensagem: 'Token inválido ou expirado.' });
  }
}

function obterSessao(request: Request, response: Response): Sessao | null {
  const sessaoId = request.sessaoId;
  const sessao = sessaoId ? sessoes.get(sessaoId) : undefined;
  if (!sessao) {
    response.status(401).json({ mensagem: 'A sessão não está mais disponível.' });
    return null;
  }
  sessao.ultimaAtividade = Date.now();
  return sessao;
}

app.post('/auth/convidado', (_request, response) => {
  response.status(201).json(criarSessao());
});

// O login de estudo opcional também cria um elenco isolado como qualquer convidado.
app.post('/auth/login', async (request, response) => {
  const dados = request.body as Partial<Credenciais> | null;
  if (
    !dados
    || dados.email !== emailTeste
    || typeof dados.senha !== 'string'
    || !(await bcrypt.compare(dados.senha, senhaTesteHash))
  ) {
    response.status(401).json({ mensagem: 'E-mail ou senha inválidos.' });
    return;
  }
  response.json(criarSessao());
});

// Todas as leituras e gravações passam pelo JWT antes de acessar o Map.
app.use('/jogadores', protegerRota);

app.get('/jogadores', (request, response) => {
  const sessao = obterSessao(request, response);
  if (sessao) response.json(sessao.jogadores);
});

app.get('/jogadores/:id', (request, response) => {
  const sessao = obterSessao(request, response);
  if (!sessao) return;
  const jogador = sessao.jogadores.find((item) => item.id === Number(request.params['id']));
  if (!jogador) {
    response.status(404).json({ mensagem: 'Jogador não encontrado nesta sessão.' });
    return;
  }
  response.json(jogador);
});

app.post('/jogadores', (request, response) => {
  const sessao = obterSessao(request, response);
  if (!sessao) return;
  const dados = validarJogador(request.body);
  if (!dados) {
    response.status(400).json({ mensagem: 'Dados inválidos. Confira nome, camisa (1-99), data, posição e clube.' });
    return;
  }

  const jogador = {
    ...dados,
    id: Math.max(0, ...sessao.jogadores.map((item) => item.id)) + 1,
  };
  sessao.jogadores.push(jogador);
  response.status(201).json(jogador);
});

app.put('/jogadores/:id', (request, response) => {
  const sessao = obterSessao(request, response);
  if (!sessao) return;
  const id = Number(request.params['id']);
  const dados = validarJogador(request.body);
  if (!Number.isInteger(id) || id < 1 || !dados) {
    response.status(400).json({ mensagem: 'ID ou dados inválidos.' });
    return;
  }

  const indice = sessao.jogadores.findIndex((item) => item.id === id);
  if (indice < 0) {
    response.status(404).json({ mensagem: 'Jogador não encontrado nesta sessão.' });
    return;
  }
  const jogador = { ...dados, id, titular: sessao.jogadores[indice].titular };
  sessao.jogadores[indice] = jogador;
  response.json(jogador);
});

app.delete('/jogadores/:id', (request, response) => {
  const sessao = obterSessao(request, response);
  if (!sessao) return;
  const id = Number(request.params['id']);
  if (!Number.isInteger(id) || id < 1) {
    response.status(400).json({ mensagem: 'ID inválido.' });
    return;
  }

  const atualizados = sessao.jogadores.filter((jogador) => jogador.id !== id);
  if (atualizados.length === sessao.jogadores.length) {
    response.status(404).json({ mensagem: 'Jogador não encontrado nesta sessão.' });
    return;
  }
  sessao.jogadores = atualizados;
  response.status(204).end();
});

app.use((erro: unknown, _request: Request, response: Response, _next: NextFunction) => {
  console.error('Erro na API:', erro);
  response.status(500).json({ mensagem: 'Erro interno ao processar a solicitação.' });
});

// Remove sessões sem atividade por mais de duas horas; reiniciar o processo também as descarta.
const limpezaSessoes = setInterval(() => {
  const agora = Date.now();
  for (const [sessaoId, sessao] of sessoes) {
    if (agora - sessao.ultimaAtividade > duasHorasEmMs) sessoes.delete(sessaoId);
  }
}, 60_000);
limpezaSessoes.unref();

function iniciarApi(): void {
  if (process.env.NODE_ENV === 'production' && !process.env.JWT_SECRET) {
    throw new Error('Defina JWT_SECRET antes de iniciar a API em produção.');
  }
  const porta = Number(process.env.PORT ?? 3000);
  app.listen(porta, () => console.log(`API da escalação disponível em http://localhost:${porta}`));
}

iniciarApi();
