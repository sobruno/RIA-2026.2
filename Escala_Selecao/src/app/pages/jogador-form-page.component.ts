import { ChangeDetectionStrategy, Component, inject, input } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { JogadorFormComponent } from './jogador-form.component';

@Component({
  standalone: true,
  imports: [RouterLink, JogadorFormComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <main class="mx-auto max-w-2xl px-5 py-8 sm:px-8">
      <a routerLink="/jogadores" class="text-sm font-bold text-[#267045] hover:underline">← Voltar à lista</a>
      <section class="mt-5 rounded-lg border border-[#dfe6df] bg-white p-6 shadow-sm sm:p-8">
        <p class="text-xs font-bold uppercase tracking-[0.14em] text-[#547060]">{{ id() ? 'Editar convocado' : 'Novo convocado' }}</p>
        <h1 class="mt-2 text-3xl font-bold">{{ id() ? 'Alterar jogador' : 'Cadastrar jogador' }}</h1>
        <app-jogador-form [id]="id()" (salvo)="voltar()" (cancelar)="voltar()" />
      </section>
    </main>
  `,
})
export class JogadorFormPageComponent {
  readonly id = input<string>();
  private readonly router = inject(Router);

  voltar(): void {
    void this.router.navigateByUrl('/jogadores');
  }
}
