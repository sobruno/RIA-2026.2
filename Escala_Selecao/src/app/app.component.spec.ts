import { afterEach, describe, expect, it, vi } from 'vitest';
import { EscalaComponent } from './escala/escala.component';

describe('EscalaComponent', () => {
  afterEach(() => vi.restoreAllMocks());

  it('começa com 26 jogadores e sem titulares', () => {
    const componente = new EscalaComponent();

    expect(componente.jogadores()).toHaveLength(26);
    expect(componente.titulares()).toHaveLength(0);
  });

  it('escala qualquer jogador no espaço selecionado e limpa ao trocar formação', () => {
    const componente = new EscalaComponent();
    const atacante = componente.jogadores().find((jogador) => jogador.posicao === 'ATA')!;
    componente.slotSelecionado = 'gol';

    componente.clicarNoJogador(atacante);

    expect(componente.jogadorNoSlot('gol')?.id).toBe(atacante.id);
    expect(componente.titulares()).toHaveLength(1);

    componente.formacaoSelecionada = '4-4-2';
    componente.trocarFormacao();

    expect(componente.titulares()).toHaveLength(0);
    expect(componente.escala).toEqual({});
  });

  it('valida o nome e a faixa do número antes de incluir', () => {
    const componente = new EscalaComponent();
    componente.formulario = { nome: '   ', numeroCamisa: '100', dataNascimento: '', posicao: 'ATA', clube: '' };

    componente.salvarJogador();

    expect(componente.jogadores()).toHaveLength(26);
    expect(componente.erroFormulario).toContain('1 e 99');

    componente.formulario = { nome: 'Jogador de teste', numeroCamisa: '99', dataNascimento: '2000-01-01', posicao: 'ATA', clube: 'Brasil FC' };
    componente.salvarJogador();

    expect(componente.jogadores()).toHaveLength(27);
    expect(componente.jogadores()[26].numeroCamisa).toBe(99);
  });

  it('altera dados e remove o jogador após confirmação', () => {
    const componente = new EscalaComponent();
    const jogador = componente.jogadores()[0];
    componente.slotSelecionado = 'gol';
    componente.clicarNoJogador(jogador);
    componente.idEmEdicao = jogador.id;
    componente.formulario = { nome: 'Nome atualizado', numeroCamisa: '10', dataNascimento: '1990-01-01', posicao: 'GOL', clube: 'Clube novo' };

    componente.salvarJogador();

    expect(componente.jogadores()[0].nome).toBe('Nome atualizado');
    vi.spyOn(window, 'confirm').mockReturnValue(true);
    componente.removerJogador(componente.jogadores()[0]);

    expect(componente.jogadores()).toHaveLength(25);
    expect(componente.titulares()).toHaveLength(0);
    expect(componente.escala).toEqual({});
  });
});
