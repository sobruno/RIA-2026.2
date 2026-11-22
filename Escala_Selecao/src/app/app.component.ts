import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';
import { AuthService } from './services/auth.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterLink, RouterOutlet],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    @if (auth.estaAutenticado()) {
      <header class="bg-[#17241d] text-white">
        <nav class="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-4 px-5 py-4 sm:px-8">
          <a routerLink="/escalacao" class="text-xl font-bold text-lime-300">Rumo ao Hexa</a>
          <div class="flex flex-wrap items-center gap-3 text-sm font-semibold">
            <a routerLink="/escalacao" class="hover:text-lime-300">Escalação</a>
            <a routerLink="/jogadores" class="hover:text-lime-300">Jogadores</a>
            <span class="rounded bg-lime-300/15 px-2.5 py-1 text-lime-200">Modo convidado</span>
            <button type="button" class="rounded border border-lime-300/70 px-3 py-1.5 text-lime-200 hover:bg-lime-300/10" (click)="reiniciarSessao()">Reiniciar sessão</button>
            <button type="button" class="rounded border border-white/40 px-3 py-1.5 hover:border-lime-300" (click)="auth.sair()">Sair</button>
          </div>
        </nav>
        @if (erroSessao()) {
          <p role="alert" class="mx-auto max-w-7xl px-5 pb-3 text-sm text-red-200 sm:px-8">{{ erroSessao() }}</p>
        }
      </header>
    }
    <router-outlet />
  `,
})
export class App {
  protected readonly auth = inject(AuthService);
  protected readonly erroSessao = signal('');

  protected reiniciarSessao(): void {
    this.erroSessao.set('');
    void this.auth.reiniciarSessao().catch((erro: unknown) => {
      this.erroSessao.set(erro instanceof Error ? erro.message : 'Não foi possível iniciar outra sessão convidada.');
    });
  }
}
