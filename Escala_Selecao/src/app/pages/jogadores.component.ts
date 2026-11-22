import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ButtonModule } from '@openng/optimus-ui/button';
import { JogadorService } from '../services/jogador.service';
import { NovoJogadorModalComponent } from './novo-jogador-modal.component';

@Component({
  standalone: true,
  imports: [RouterLink, ButtonModule, NovoJogadorModalComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <main class="mx-auto max-w-7xl px-5 py-8 sm:px-8">
      <div class="mb-6 flex flex-wrap items-end justify-between gap-4">
        <div><p class="text-xs font-bold uppercase tracking-[0.14em] text-[#547060]">Elenco convocado</p><h1 class="text-3xl font-bold">Jogadores</h1></div>
        <p-button label="Novo jogador" (onClick)="modalNovoJogador.set(true)" />
      </div>
      @if (servico.jogadoresResource.isLoading()) { <p role="status">Carregando jogadores...</p> }
      @if (servico.jogadoresResource.error()) { <p role="alert" class="text-red-700">Não foi possível carregar os jogadores. Confira se o backend está em execução.</p> }
      <ul class="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        @for (jogador of servico.jogadores(); track jogador.id) {
          <li class="rounded-md border border-[#dfe6df] bg-white p-4">
            <div class="flex items-center gap-3">
              <span class="grid size-11 place-items-center rounded-full bg-[#17241d] font-extrabold text-lime-200">{{ jogador.numeroCamisa }}</span>
              <div class="min-w-0"><h2 class="truncate font-bold">{{ jogador.nome }}</h2><p class="truncate text-sm text-[#65736a]">{{ jogador.posicao }} / {{ jogador.clube }}</p></div>
            </div>
            <a class="mt-4 inline-block text-sm font-bold text-[#267045] hover:underline" [routerLink]="['/jogadores', jogador.id]">Ver ficha</a>
          </li>
        } @empty {
          @if (!servico.jogadoresResource.isLoading()) { <li class="text-sm text-[#65736a]">Nenhum jogador cadastrado.</li> }
        }
      </ul>
    </main>
    <app-novo-jogador-modal [(aberto)]="modalNovoJogador" />
  `,
})
export class JogadoresComponent {
  readonly servico = inject(JogadorService);
  readonly modalNovoJogador = signal(false);
}
