import { DatePipe } from '@angular/common';
import { Component, computed, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from '@openng/optimus-ui/button';
import { CardModule } from '@openng/optimus-ui/card';
import { DialogModule } from '@openng/optimus-ui/dialog';
import { InputTextModule } from '@openng/optimus-ui/inputtext';
import { SelectModule } from '@openng/optimus-ui/select';
import { TagModule } from '@openng/optimus-ui/tag';
import { FORMACOES, Formacao, SlotFormacao } from '../dados/formacoes';
import { JOGADORES_INICIAIS } from '../dados/jogadores-iniciais';
import { Jogador } from '../models/jogador';

interface FormularioJogador {
  nome: string;
  numeroCamisa: string;
  dataNascimento: string;
  posicao: string;
  clube: string;
}

@Component({
  selector: 'app-escala',
  standalone: true,
  imports: [
    DatePipe,
    FormsModule,
    ButtonModule,
    CardModule,
    DialogModule,
    InputTextModule,
    SelectModule,
    TagModule,
  ],
  templateUrl: './escala.component.html',
  styleUrl: './escala.component.css',
})
export class EscalaComponent {
  readonly formacoes = FORMACOES;
  readonly posicoes = ['GOL', 'ZAG', 'LD', 'LE', 'VOL', 'MEI', 'PD', 'PE', 'ATA'];
  readonly jogadores = signal(JOGADORES_INICIAIS);
  readonly banco = computed(() => this.jogadores().filter((jogador) => !jogador.titular));
  readonly titulares = computed(() => this.jogadores().filter((jogador) => jogador.titular));
  readonly filtroLista = signal<'banco' | 'todos'>('banco');

  formacaoSelecionada = '4-3-3';
  escala: Record<string, number> = {};
  slotSelecionado: string | null = null;
  mensagemEscalacao = '';
  modalFormularioVisivel = false;
  modalDetalheVisivel = false;
  tituloFormulario = 'Novo jogador';
  idEmEdicao: number | null = null;
  erroFormulario = '';
  jogadorEmDetalhe: Jogador | null = null;
  formulario: FormularioJogador = this.novoFormulario();

  formacaoAtual(): Formacao {
    return this.formacoes.find((formacao) => formacao.nome === this.formacaoSelecionada) ?? this.formacoes[0];
  }

  jogadoresVisiveis(): Jogador[] {
    return this.filtroLista() === 'banco' ? this.banco() : this.jogadores();
  }

  jogadorNoSlot(idSlot: string): Jogador | undefined {
    const idJogador = this.escala[idSlot];
    return this.jogadores().find((jogador) => jogador.id === idJogador);
  }

  nomeCurto(nome: string): string {
    return nome.split(' ').at(-1) ?? nome;
  }

  trocarFormacao(): void {
    this.escala = {};
    this.slotSelecionado = null;
    this.jogadores.update((jogadores) => jogadores.map((jogador) => ({ ...jogador, titular: false })));
    this.mensagemEscalacao = 'Formação alterada. A escalação foi limpa.';
  }

  clicarNoSlot(slot: SlotFormacao): void {
    const jogador = this.jogadorNoSlot(slot.id);

    if (jogador) {
      this.devolverAoBanco(jogador.id);
      this.slotSelecionado = null;
      this.mensagemEscalacao = `${jogador.nome} voltou para o banco.`;
      return;
    }

    this.slotSelecionado = slot.id;
    this.mensagemEscalacao = `Posição selecionada: ${slot.rotulo}.`;
  }

  clicarNoJogador(jogador: Jogador): void {
    if (jogador.titular) {
      this.devolverAoBanco(jogador.id);
      this.mensagemEscalacao = `${jogador.nome} voltou para o banco.`;
      return;
    }

    if (!this.slotSelecionado) {
      this.mensagemEscalacao = 'Selecione uma posição vazia no campo.';
      return;
    }

    this.escala = { ...this.escala, [this.slotSelecionado]: jogador.id };
    const idsEmCampo = new Set(Object.values(this.escala));
    this.jogadores.update((jogadores) =>
      jogadores.map((item) => ({ ...item, titular: idsEmCampo.has(item.id) })),
    );
    this.mensagemEscalacao = `${jogador.nome} entrou em campo.`;
    this.slotSelecionado = null;
  }

  abrirNovoJogador(): void {
    this.idEmEdicao = null;
    this.tituloFormulario = 'Novo jogador';
    this.formulario = this.novoFormulario();
    this.erroFormulario = '';
    this.modalFormularioVisivel = true;
  }

  abrirDetalhe(jogador: Jogador): void {
    this.jogadorEmDetalhe = jogador;
    this.modalDetalheVisivel = true;
  }

  editarJogador(jogador: Jogador): void {
    this.idEmEdicao = jogador.id;
    this.tituloFormulario = 'Alterar jogador';
    this.formulario = {
      nome: jogador.nome,
      numeroCamisa: String(jogador.numeroCamisa),
      dataNascimento: jogador.dataNascimento,
      posicao: jogador.posicao,
      clube: jogador.clube,
    };
    this.erroFormulario = '';
    this.modalDetalheVisivel = false;
    this.modalFormularioVisivel = true;
  }

  salvarJogador(): void {
    const nome = this.formulario.nome.trim();
    const numeroCamisa = Number(this.formulario.numeroCamisa);

    if (!nome || !Number.isInteger(numeroCamisa) || numeroCamisa < 1 || numeroCamisa > 99) {
      this.erroFormulario = 'Informe o nome e uma camisa entre 1 e 99.';
      return;
    }

    const jogadorAnterior = this.jogadores().find((jogador) => jogador.id === this.idEmEdicao);
    const jogadorSalvo: Jogador = {
      id: this.idEmEdicao ?? Math.max(0, ...this.jogadores().map((jogador) => jogador.id)) + 1,
      nome,
      numeroCamisa,
      dataNascimento: this.formulario.dataNascimento,
      titular: jogadorAnterior?.titular ?? false,
      posicao: this.formulario.posicao,
      clube: this.formulario.clube.trim(),
    };

    if (this.idEmEdicao === null) {
      this.jogadores.update((jogadores) => [...jogadores, jogadorSalvo]);
    } else {
      this.jogadores.update((jogadores) =>
        jogadores.map((jogador) => (jogador.id === this.idEmEdicao ? jogadorSalvo : jogador)),
      );
      if (this.jogadorEmDetalhe?.id === jogadorSalvo.id) {
        this.jogadorEmDetalhe = jogadorSalvo;
      }
    }

    this.modalFormularioVisivel = false;
    this.erroFormulario = '';
  }

  removerJogador(jogador: Jogador): void {
    if (!window.confirm(`Remover ${jogador.nome} da convocação?`)) {
      return;
    }

    this.devolverAoBanco(jogador.id);
    this.jogadores.update((jogadores) => jogadores.filter((item) => item.id !== jogador.id));
    this.modalDetalheVisivel = false;
    this.jogadorEmDetalhe = null;
  }

  private devolverAoBanco(idJogador: number): void {
    this.escala = Object.fromEntries(
      Object.entries(this.escala).filter(([, id]) => id !== idJogador),
    );
    this.jogadores.update((jogadores) =>
      jogadores.map((jogador) =>
        jogador.id === idJogador ? { ...jogador, titular: false } : jogador,
      ),
    );
  }

  private novoFormulario(): FormularioJogador {
    return {
      nome: '',
      numeroCamisa: '',
      dataNascimento: '',
      posicao: 'ATA',
      clube: '',
    };
  }
}