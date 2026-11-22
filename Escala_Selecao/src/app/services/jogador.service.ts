import { computed, Injectable, signal, inject } from '@angular/core';
import { HttpClient, HttpErrorResponse, httpResource } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { Formacao } from '../dados/formacoes';
import { Jogador } from '../models/jogador';
import { API_URL } from './api';

@Injectable({ providedIn: 'root' })
export class JogadorService {
  private readonly http = inject(HttpClient);
  readonly jogadoresResource = httpResource<Jogador[]>(() => `${API_URL}/jogadores`);
  readonly jogadores = computed(() => this.jogadoresResource.value() ?? []);
  readonly escala = signal<Record<string, number>>({});
  readonly formacaoEscolhida = signal('4-3-3');
  readonly jogadorSelecionado = signal<Jogador | null>(null);
  readonly titulares = computed(() => {
    const ids = new Set(Object.values(this.escala()));
    return this.jogadores().filter((jogador) => ids.has(jogador.id));
  });
  readonly reservas = computed(() => {
    const ids = new Set(Object.values(this.escala()));
    return this.jogadores().filter((jogador) => !ids.has(jogador.id));
  });
  readonly erro = signal('');
  readonly salvando = signal(false);

  async criar(jogador: Omit<Jogador, 'id' | 'titular'>): Promise<void> {
    await this.gravar(() => firstValueFrom(this.http.post(`${API_URL}/jogadores`, jogador)));
  }

  async atualizar(id: number, jogador: Omit<Jogador, 'id' | 'titular'>): Promise<void> {
    await this.gravar(() => firstValueFrom(this.http.put(`${API_URL}/jogadores/${id}`, jogador)));
  }

  async remover(id: number): Promise<void> {
    await this.gravar(() => firstValueFrom(this.http.delete(`${API_URL}/jogadores/${id}`)));
    this.escala.update((escala) => Object.fromEntries(
      Object.entries(escala).filter(([, idAtual]) => idAtual !== id),
    ));
  }

  selecionarNoSlot(slotId: string, jogadorId: number): void {
    this.escala.update((atual) => ({ ...atual, [slotId]: jogadorId }));
  }

  limparSlot(slotId: string): void {
    this.escala.update((atual) => {
      const novaEscala = { ...atual };
      delete novaEscala[slotId];
      return novaEscala;
    });
  }

  devolverAoBanco(jogadorId: number): void {
    this.escala.update((atual) => Object.fromEntries(
      Object.entries(atual).filter(([, idAtual]) => idAtual !== jogadorId),
    ));
  }

  limparEscalacao(formacao?: Formacao): void {
    this.escala.set({});
    if (formacao) this.formacaoEscolhida.set(formacao.nome);
  }

  jogadorNoSlot(slotId: string): Jogador | undefined {
    return this.jogadores().find((jogador) => jogador.id === this.escala()[slotId]);
  }

  private async gravar(operacao: () => Promise<unknown>): Promise<void> {
    this.salvando.set(true);
    this.erro.set('');
    try {
      await operacao();
      this.jogadoresResource.reload();
    } catch (erro) {
      const mensagemApi = erro instanceof HttpErrorResponse
        && typeof erro.error?.mensagem === 'string'
        ? erro.error.mensagem
        : null;
      this.erro.set(mensagemApi ?? (erro instanceof Error ? erro.message : 'Não foi possível concluir a operação.'));
      throw erro;
    } finally {
      this.salvando.set(false);
    }
  }
}
