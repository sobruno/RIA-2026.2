import { ChangeDetectionStrategy, Component, effect, inject, input } from '@angular/core';
import { DatePipe } from '@angular/common';
import { httpResource } from '@angular/common/http';
import { Router, RouterLink } from '@angular/router';
import { firstValueFrom } from 'rxjs';
import { ButtonModule } from '@openng/optimus-ui/button';
import { Jogador } from '../models/jogador';
import { API_URL } from '../services/api';
import { JogadorService } from '../services/jogador.service';

@Component({
  standalone: true,
  imports: [DatePipe, RouterLink, ButtonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <main class="mx-auto max-w-3xl px-5 py-8 sm:px-8">
      <a routerLink="/jogadores" class="text-sm font-bold text-[#267045] hover:underline">← Voltar à lista</a>
      @if (jogadorResource.isLoading()) { <p class="mt-6" role="status">Carregando ficha...</p> }
      @if (jogadorResource.error()) { <p class="mt-6 text-red-700" role="alert">Jogador não encontrado ou não foi possível consultar a API.</p> }
      @if (jogadorResource.hasValue()) {
        @let jogador = jogadorResource.value();
        <section class="mt-5 rounded-lg border border-[#dfe6df] bg-white p-6 sm:p-8">
          <div class="flex items-center gap-4 border-b border-[#e2e8e1] pb-5">
            <span class="grid size-16 place-items-center rounded-full bg-[#17241d] text-2xl font-extrabold text-lime-200">{{ jogador.numeroCamisa }}</span>
            <div><h1 class="text-2xl font-bold">{{ jogador.nome }}</h1><p class="mt-1 text-sm text-[#65736a]">{{ jogador.posicao }} / {{ jogador.clube }}</p></div>
          </div>
          <dl class="grid grid-cols-2 gap-4 py-5 text-sm">
            <div><dt class="text-[#65736a]">Camisa</dt><dd class="mt-1 font-bold">{{ jogador.numeroCamisa }}</dd></div>
            <div><dt class="text-[#65736a]">Situação</dt><dd class="mt-1 font-bold">{{ jogador.titular ? 'Titular' : 'Banco' }}</dd></div>
            <div><dt class="text-[#65736a]">Nascimento</dt><dd class="mt-1 font-bold">{{ jogador.dataNascimento | date: 'dd/MM/yyyy' }}</dd></div>
            <div><dt class="text-[#65736a]">Posição</dt><dd class="mt-1 font-bold">{{ jogador.posicao }}</dd></div>
            <div class="col-span-2"><dt class="text-[#65736a]">Clube</dt><dd class="mt-1 font-bold">{{ jogador.clube }}</dd></div>
          </dl>
          @if (erro()) { <p class="mb-3 text-sm text-red-700" role="alert">{{ erro() }}</p> }
          <div class="flex flex-wrap justify-between gap-3 border-t border-[#e2e8e1] pt-4">
            <p-button label="Remover" severity="danger" [text]="true" (onClick)="remover(jogador)" />
            <p-button label="Alterar" [routerLink]="['/jogadores', jogador.id, 'editar']" />
          </div>
        </section>
      }
    </main>
  `,
})
export class JogadorDetalheComponent {
  readonly id = input.required<string>();
  readonly jogadorResource = httpResource<Jogador>(() => `${API_URL}/jogadores/${this.id()}`);
  private readonly router = inject(Router);
  private readonly jogadores = inject(JogadorService);
  readonly erro = this.jogadores.erro;

  constructor() {
    effect(() => {
      if (this.jogadorResource.hasValue()) {
        this.jogadores.jogadorSelecionado.set(this.jogadorResource.value());
      }
    });
  }

  async remover(jogador: Jogador): Promise<void> {
    if (!window.confirm(`Remover ${jogador.nome} da convocação?`)) return;
    try {
      await this.jogadores.remover(jogador.id);
      await this.router.navigateByUrl('/jogadores');
    } catch (erro) {
      this.erro.set(this.jogadores.erro() || (erro instanceof Error ? erro.message : 'Não foi possível remover o jogador.'));
    }
  }
}
