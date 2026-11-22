import bcrypt from 'bcryptjs';
import cors from 'cors';
import express, { NextFunction, Request, Response } from 'express';
import { readFile, writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import jwt, { JwtPayload } from 'jsonwebtoken';

interface Jogador {
  id: number;
  nome: string;
  numeroCamisa: number;
  dataNascimento: string;
  titular: boolean;
  posicao: string;
  clube: string;
}

interface Credenciais {
  email: string;
  senha: string;
}

interface Usuario {
  email: string;
  senhaHash: string;
}

const app = express();
const arquivoJogadores = resolve(process.cwd(), 'data', 'jogadores.json');
const arquivoUsuarios = resolve(process.cwd(), 'data', 'usuarios.json');
const jwtSecret = process.env.JWT_SECRET ?? 'chave-de-desenvolvimento-apenas-local';
const posicoes = new Set(['GOL', 'ZAG', 'LD', 'LE', 'VOL', 'MEI', 'PD', 'PE', 'ATA']);
let usuarioTeste: Usuario;

app.use(cors({ origin: process.env.FRONTEND_URL ?? 'http://localhost:4200' }));
app.use(express.json({ limit: '10kb' }));

app.get('/health', (_request, response) => {
  response.json({ status: 'ok' });
});

async function lerJogadores(): Promise<Jogador[]> {
  return JSON.parse(await readFile(arquivoJogadores, 'utf8')) as Jogador[];
}

async function gravarJogadores(jogadores: Jogador[]): Promise<void> {
  await writeFile(arquivoJogadores, `${JSON.stringify(jogadores, null, 2)}\n`, 'utf8');
}

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

function protegerRota(request: Request, response: Response, next: NextFunction): void {
  const authorization = request.header('Authorization');
  const token = authorization?.startsWith('Bearer ') ? authorization.slice(7) : '';
  if (!token) {
    response.status(401).json({ mensagem: 'Token de autenticação obrigatório.' });
    return;
  }
  try {
    jwt.verify(token, jwtSecret);
    next();
  } catch {
    response.status(401).json({ mensagem: 'Token inválido ou expirado.' });
  }
}

app.post('/auth/login', async (request, response) => {
  const dados = request.body as Partial<Credenciais>;
  if (dados.email !== usuarioTeste.email || typeof dados.senha !== 'string' || !(await bcrypt.compare(dados.senha, usuarioTeste.senhaHash))) {
    response.status(401).json({ mensagem: 'E-mail ou senha inválidos.' });
    return;
  }

  const token = jwt.sign({ sub: usuarioTeste.email } satisfies JwtPayload, jwtSecret, { expiresIn: '2h' });
  response.json({ token });
});

app.use('/jogadores', protegerRota);

app.get('/jogadores', async (_request, response) => {
  response.json(await lerJogadores());
});

app.get('/jogadores/:id', async (request, response) => {
  const jogador = (await lerJogadores()).find((item) => item.id === Number(request.params['id']));
  if (!jogador) {
    response.status(404).json({ mensagem: 'Jogador não encontrado.' });
    return;
  }
  response.json(jogador);
});

app.post('/jogadores', async (request, response) => {
  const dados = validarJogador(request.body);
  if (!dados) {
    response.status(400).json({ mensagem: 'Dados inválidos. Confira nome, camisa (1-99), data, posição e clube.' });
    return;
  }
  const jogadores = await lerJogadores();
  const jogador = { ...dados, id: Math.max(0, ...jogadores.map((item) => item.id)) + 1 };
  jogadores.push(jogador);
  await gravarJogadores(jogadores);
  response.status(201).json(jogador);
});

app.put('/jogadores/:id', async (request, response) => {
  const id = Number(request.params['id']);
  const dados = validarJogador(request.body);
  if (!Number.isInteger(id) || id < 1 || !dados) {
    response.status(400).json({ mensagem: 'ID ou dados inválidos.' });
    return;
  }
  const jogadores = await lerJogadores();
  const indice = jogadores.findIndex((item) => item.id === id);
  if (indice < 0) {
    response.status(404).json({ mensagem: 'Jogador não encontrado.' });
    return;
  }
  const jogador = { ...dados, id, titular: jogadores[indice].titular };
  jogadores[indice] = jogador;
  await gravarJogadores(jogadores);
  response.json(jogador);
});

app.delete('/jogadores/:id', async (request, response) => {
  const id = Number(request.params['id']);
  if (!Number.isInteger(id) || id < 1) {
    response.status(400).json({ mensagem: 'ID inválido.' });
    return;
  }
  const jogadores = await lerJogadores();
  const atualizados = jogadores.filter((jogador) => jogador.id !== id);
  if (atualizados.length === jogadores.length) {
    response.status(404).json({ mensagem: 'Jogador não encontrado.' });
    return;
  }
  await gravarJogadores(atualizados);
  response.status(204).end();
});

app.use((erro: unknown, _request: Request, response: Response, _next: NextFunction) => {
  console.error('Erro na API:', erro);
  response.status(500).json({ mensagem: 'Erro interno ao processar a solicitação.' });
});

async function iniciarApi(): Promise<void> {
  if (process.env.NODE_ENV === 'production' && !process.env.JWT_SECRET) {
    throw new Error('Defina JWT_SECRET antes de iniciar a API em produção.');
  }
  const usuarios = JSON.parse(await readFile(arquivoUsuarios, 'utf8')) as Usuario[];
  if (usuarios.length === 0) throw new Error('O seed precisa conter ao menos um usuário.');
  usuarioTeste = usuarios[0];
  const porta = Number(process.env.PORT ?? 3000);
  app.listen(porta, () => console.log(`API da escalação disponível em http://localhost:${porta}`));
}

void iniciarApi().catch((erro: unknown) => {
  console.error('Não foi possível iniciar a API:', erro);
  process.exitCode = 1;
});
