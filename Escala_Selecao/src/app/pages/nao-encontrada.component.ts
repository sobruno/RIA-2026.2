import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  standalone: true,
  imports: [RouterLink],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <main class="mx-auto max-w-3xl px-5 py-20 text-center">
      <p class="text-xs font-bold uppercase tracking-widest text-[#547060]">Erro 404</p>
      <h1 class="mt-2 text-4xl font-bold">Página não encontrada</h1>
      <a routerLink="/" class="mt-6 inline-block font-bold text-[#267045] hover:underline">Voltar ao início</a>
    </main>
  `,
})
export class NaoEncontradaComponent {}
