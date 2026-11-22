import { ChangeDetectionStrategy, Component, effect, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { NovoJogadorModalComponent } from './novo-jogador-modal.component';

@Component({
  standalone: true,
  imports: [NovoJogadorModalComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<app-novo-jogador-modal [(aberto)]="aberto" />`,
})
export class NovoJogadorRotaComponent {
  readonly aberto = signal(true);
  private readonly router = inject(Router);

  constructor() {
    effect(() => {
      if (!this.aberto()) void this.router.navigateByUrl('/jogadores');
    });
  }
}
