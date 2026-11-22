import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
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
          <div class="flex flex-wrap items-center gap-4 text-sm font-semibold">
            <a routerLink="/escalacao" class="hover:text-lime-300">Escalação</a>
            <a routerLink="/jogadores" class="hover:text-lime-300">Jogadores</a>
            <button type="button" class="rounded border border-white/40 px-3 py-1.5 hover:border-lime-300" (click)="auth.sair()">Sair</button>
          </div>
        </nav>
      </header>
    }
    <router-outlet />
  `,
})
export class App {
  protected readonly auth = inject(AuthService);
}
