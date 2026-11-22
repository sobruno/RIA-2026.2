import { ChangeDetectionStrategy, Component, model } from '@angular/core';
import { DialogModule } from '@openng/optimus-ui/dialog';
import { JogadorFormComponent } from './jogador-form.component';

@Component({
  selector: 'app-novo-jogador-modal',
  standalone: true,
  imports: [DialogModule, JogadorFormComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <p-dialog
      [(visible)]="aberto"
      header="Novo jogador"
      [modal]="true"
      [draggable]="false"
      [resizable]="false"
      styleClass="jogador-modal"
      [style]="{ width: 'min(94vw, 560px)' }"
      [breakpoints]="{ '640px': '94vw' }"
    >
      @if (aberto()) {
        <app-jogador-form (salvo)="aberto.set(false)" (cancelar)="aberto.set(false)" />
      }
    </p-dialog>
  `,
})
export class NovoJogadorModalComponent {
  // O componente pai abre e fecha o pop-up sincronizando este model().
  readonly aberto = model(false);
}
