import { ChangeDetectionStrategy, Component, input, model, output } from '@angular/core';
import { ButtonModule } from '@openng/optimus-ui/button';
import { TagModule } from '@openng/optimus-ui/tag';
import { Jogador } from '../models/jogador';

@Component({
  selector: 'app-lista-jogadores',
  standalone: true,
  imports: [ButtonModule, TagModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="flex items-start justify-between gap-3">
      <div><p class="text-xs font-bold uppercase tracking-[0.14em] text-[#547060]">Elenco convocado</p><h2 id="convocados-titulo" class="text-2xl font-bold">Jogadores</h2></div>
      <p-tag [value]="titulares().length + ' em campo'" severity="success" />
    </div>
    <div class="my-4 grid grid-cols-2 rounded-md bg-[#edf1ec] p-1">
      <button type="button" class="rounded px-3 py-2 text-sm font-bold" [class.bg-white]="filtro() === 'banco'" (click)="filtro.set('banco')">Banco <span class="ml-1 text-[#718076]">{{ reservas().length }}</span></button>
      <button type="button" class="rounded px-3 py-2 text-sm font-bold" [class.bg-white]="filtro() === 'todos'" (click)="filtro.set('todos')">Todos <span class="ml-1 text-[#718076]">{{ jogadores().length }}</span></button>
    </div>
    <p class="mb-3 text-xs text-[#65736a]">{{ slotSelecionado() ? 'Posição selecionada no campo' : 'Titulares e banco da convocação' }}</p>
    <ul class="max-h-[590px] space-y-2 overflow-y-auto pr-1">
      @for (jogador of jogadoresVisiveis(); track jogador.id) {
        <li class="rounded-md border border-[#e2e8e1] bg-white p-3 transition hover:border-[#9ab39e]">
          <div class="flex items-start justify-between gap-2">
            <div class="flex min-w-0 items-center gap-3">
              <span class="grid size-10 shrink-0 place-items-center rounded-full bg-[#17241d] text-sm font-extrabold text-lime-200">{{ jogador.numeroCamisa }}</span>
              <div class="min-w-0"><p class="truncate font-bold leading-tight">{{ jogador.nome }}</p><p class="mt-1 truncate text-xs text-[#65736a]">{{ jogador.posicao }} / {{ jogador.clube }}</p></div>
            </div>
            @if (titulares().some((titular) => titular.id === jogador.id)) {
              <p-tag value="Titular" severity="success" />
            } @else {
              <p-tag value="Banco" severity="secondary" />
            }
          </div>
          <div class="mt-3 flex flex-wrap gap-2">
            <p-button [label]="titulares().some((titular) => titular.id === jogador.id) ? 'Voltar ao banco' : 'Escalar'" size="small" [text]="!slotSelecionado()" (onClick)="jogadorClicado.emit(jogador)" />
            <p-button label="Detalhes" size="small" [text]="true" severity="secondary" (onClick)="detalhar.emit(jogador)" />
          </div>
        </li>
      } @empty {
        <li class="rounded-md border border-dashed border-[#cbd6cb] px-4 py-8 text-center text-sm text-[#65736a]">Nenhum jogador para mostrar.</li>
      }
    </ul>
  `,
})
export class ListaJogadoresComponent {
  // O pai fornece os jogadores; o filtro usa model() para sincronizar nos dois sentidos.
  readonly jogadores = input.required<Jogador[]>();
  readonly jogadoresVisiveis = input.required<Jogador[]>();
  readonly titulares = input.required<Jogador[]>();
  readonly reservas = input.required<Jogador[]>();
  readonly filtro = model<'banco' | 'todos'>('banco');
  readonly slotSelecionado = input<string | null>(null);
  readonly jogadorClicado = output<Jogador>();
  readonly detalhar = output<Jogador>();
}
