import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { Formacao } from '../dados/formacoes';
import { Jogador } from '../models/jogador';

@Component({
  selector: 'app-campo',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="rounded-md bg-[#dfe8df] p-2 sm:p-4">
      <div class="relative mx-auto aspect-[2/3] w-full max-w-[480px] overflow-hidden rounded-[3px] border-4 border-white/80 bg-gradient-to-b from-[#338b57] via-[#24784a] to-[#17613e] shadow-lg">
        <div aria-hidden="true" class="absolute inset-3 border border-white/55">
          <div class="absolute inset-x-0 top-1/2 border-t border-white/55"></div>
          <div class="absolute left-1/2 top-1/2 size-24 -translate-x-1/2 -translate-y-1/2 rounded-full border border-white/55"></div>
          <div class="absolute left-1/2 top-1/2 size-2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white/80"></div>
          <div class="absolute left-1/2 top-0 h-[13%] w-[48%] -translate-x-1/2 border-x border-b border-white/55"></div>
          <div class="absolute left-1/2 top-0 h-[5%] w-[24%] -translate-x-1/2 border-x border-b border-white/55"></div>
          <div class="absolute bottom-0 left-1/2 h-[13%] w-[48%] -translate-x-1/2 border-x border-t border-white/55"></div>
          <div class="absolute bottom-0 left-1/2 h-[5%] w-[24%] -translate-x-1/2 border-x border-t border-white/55"></div>
        </div>
        @for (slot of formacao().slots; track slot.id) {
          <button type="button"
            class="absolute z-10 flex w-16 -translate-x-1/2 -translate-y-1/2 flex-col items-center gap-0.5 rounded-md px-0.5 py-1 text-white transition hover:scale-105 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-lime-300"
            [style.left.%]="slot.x" [style.top.%]="slot.y"
            [class.bg-[#b4e34a]]="slotSelecionado() === slot.id"
            [class.text-[#17241d]]="slotSelecionado() === slot.id"
            [attr.aria-label]="jogadorNoSlot(slot.id)?.nome || 'Selecionar ' + slot.rotulo"
            (click)="slotClicado.emit(slot)">
            @if (jogadorNoSlot(slot.id); as jogador) {
              <span class="grid size-9 place-items-center rounded-full border-2 border-white bg-[#17241d] text-sm font-extrabold text-white shadow-md">{{ jogador.numeroCamisa }}</span>
              <span class="max-w-full truncate rounded bg-black/35 px-1 text-[10px] font-bold uppercase text-white">{{ jogador.nome.split(' ').at(-1) }}</span>
            } @else {
              <span class="grid size-9 place-items-center rounded-full border-2 border-dashed border-white/85 bg-white/10 text-lg font-semibold">+</span>
              <span class="rounded bg-black/35 px-1 text-[10px] font-bold uppercase">{{ slot.rotulo }}</span>
            }
          </button>
        }
      </div>
    </div>
  `,
})
export class CampoComponent {
  // O pai envia formação e escala; recebe de volta o espaço clicado.
  readonly formacao = input.required<Formacao>();
  readonly escala = input.required<Record<string, number>>();
  readonly jogadores = input.required<Jogador[]>();
  readonly slotSelecionado = input<string | null>(null);
  readonly slotClicado = output<import('../dados/formacoes').SlotFormacao>();

  jogadorNoSlot(slotId: string): Jogador | undefined {
    const id = this.escala()[slotId];
    return this.jogadores().find((jogador) => jogador.id === id);
  }
}
