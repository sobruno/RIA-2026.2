import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ButtonModule } from '@openng/optimus-ui/button';
import { CardModule } from '@openng/optimus-ui/card';
import { SelectModule } from '@openng/optimus-ui/select';
import { FORMACOES, SlotFormacao } from '../dados/formacoes';
import { Jogador } from '../models/jogador';
import { JogadorService } from '../services/jogador.service';
import { CampoComponent } from './campo.component';
import { ListaJogadoresComponent } from './lista-jogadores.component';
import { NovoJogadorModalComponent } from '../pages/novo-jogador-modal.component';

@Component({
  selector: 'app-escala',
  standalone: true,
  imports: [FormsModule, ButtonModule, CardModule, SelectModule, CampoComponent, ListaJogadoresComponent, NovoJogadorModalComponent],
  templateUrl: './escala.component.html',
  styleUrl: './escala.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EscalaComponent {
  readonly servico = inject(JogadorService);
  private readonly router = inject(Router);
  readonly formacoes = FORMACOES;
  readonly filtro = signal<'banco' | 'todos'>('banco');
  readonly modalNovoJogador = signal(false);
  readonly slotSelecionado = signal<string | null>(null);
  readonly formacaoAtual = computed(
    () => FORMACOES.find((formacao) => formacao.nome === this.servico.formacaoEscolhida()) ?? FORMACOES[0],
  );
  readonly jogadoresVisiveis = computed(() =>
    this.filtro() === 'banco' ? this.servico.reservas() : this.servico.jogadores(),
  );
  readonly mensagem = signal('Escolha um espaço vazio e depois um jogador do elenco.');

  trocarFormacao(nome: string): void {
    const formacao = FORMACOES.find((item) => item.nome === nome);
    if (formacao) {
      this.servico.limparEscalacao(formacao);
      this.slotSelecionado.set(null);
    }
  }

  clicarNoSlot(slot: SlotFormacao): void {
    const idJogador = this.servico.escala()[slot.id];
    if (idJogador !== undefined) {
      this.servico.limparSlot(slot.id);
      this.slotSelecionado.set(null);
      this.mensagem.set('Jogador devolvido ao banco.');
    } else {
      this.slotSelecionado.set(slot.id);
      this.mensagem.set(`Espaço selecionado: ${slot.rotulo}.`);
    }
  }

  escalar(jogador: Jogador): void {
    if (this.servico.titulares().some((titular) => titular.id === jogador.id)) {
      this.servico.devolverAoBanco(jogador.id);
      this.mensagem.set(`${jogador.nome} voltou para o banco.`);
      return;
    }
    const slot = this.slotSelecionado();
    if (!slot) {
      this.mensagem.set('Selecione uma posição vazia no campo primeiro.');
      return;
    }
    this.servico.selecionarNoSlot(slot, jogador.id);
    this.slotSelecionado.set(null);
    this.mensagem.set(`${jogador.nome} entrou em campo.`);
  }

  nomeCurto(nome: string): string {
    return nome.split(' ').at(-1) ?? nome;
  }

  abrirDetalhe(id: number): void {
    void this.router.navigate(['/jogadores', id]);
  }

  selecionarDetalhe(jogador: Jogador): void {
    this.servico.jogadorSelecionado.set(jogador);
    this.abrirDetalhe(jogador.id);
  }
}
