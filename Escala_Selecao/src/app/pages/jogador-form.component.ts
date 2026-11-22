import { ChangeDetectionStrategy, Component, effect, inject, input, output, signal } from '@angular/core';
import { httpResource } from '@angular/common/http';
import { FormField, form, max, min, pattern, required, submit, validate } from '@angular/forms/signals';
import { ButtonModule } from '@openng/optimus-ui/button';
import { Jogador } from '../models/jogador';
import { API_URL } from '../services/api';
import { JogadorService } from '../services/jogador.service';

interface JogadorFormulario {
  nome: string;
  numeroCamisa: number;
  dataNascimento: Date | null;
  posicao: string;
  clube: string;
}

@Component({
  selector: 'app-jogador-form',
  standalone: true,
  imports: [FormField, ButtonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    @if (jogadorResource.isLoading()) { <p class="mb-4" role="status">Carregando jogador...</p> }
    @if (jogadorResource.error()) { <p class="mb-4 text-red-700" role="alert">Não foi possível carregar os dados para edição.</p> }
    <form class="space-y-4" novalidate (submit)="salvar($event)">
      <label class="flex flex-col gap-1.5 text-sm font-semibold">Nome completo
        <input class="w-full rounded border border-[#cbd6cb] bg-white px-3 py-2 text-[#17241d] focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-[#267045]" autocomplete="name" [formField]="jogadorForm.nome" />
      </label>
      @if (jogadorForm.nome().invalid() && jogadorForm.nome().touched()) { @for (erro of jogadorForm.nome().errors(); track erro.kind) { <p class="text-sm text-red-700">{{ erro.message }}</p> } }
      <div class="grid gap-4 sm:grid-cols-2">
        <label class="flex flex-col gap-1.5 text-sm font-semibold">Camisa (1 a 99)
          <input class="w-full rounded border border-[#cbd6cb] bg-white px-3 py-2 text-[#17241d] focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-[#267045]" type="number" [formField]="jogadorForm.numeroCamisa" />
        </label>
        <label class="flex flex-col gap-1.5 text-sm font-semibold">Data de nascimento
          <input class="w-full rounded border border-[#cbd6cb] bg-white px-3 py-2 text-[#17241d] focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-[#267045]" type="date" [formField]="jogadorForm.dataNascimento" />
        </label>
        <label class="flex flex-col gap-1.5 text-sm font-semibold">Posição
          <select class="w-full rounded border border-[#cbd6cb] bg-white px-3 py-2 text-[#17241d] focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-[#267045]" [formField]="jogadorForm.posicao">
            @for (posicao of posicoes; track posicao) { <option [value]="posicao">{{ posicao }}</option> }
          </select>
        </label>
        <label class="flex flex-col gap-1.5 text-sm font-semibold">Clube
          <input class="w-full rounded border border-[#cbd6cb] bg-white px-3 py-2 text-[#17241d] focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-[#267045]" [formField]="jogadorForm.clube" />
        </label>
      </div>
      @if (jogadorForm.numeroCamisa().invalid() && jogadorForm.numeroCamisa().touched()) { @for (erro of jogadorForm.numeroCamisa().errors(); track erro.kind) { <p class="text-sm text-red-700">{{ erro.message }}</p> } }
      @if (jogadorForm.dataNascimento().invalid() && jogadorForm.dataNascimento().touched()) { @for (erro of jogadorForm.dataNascimento().errors(); track erro.kind) { <p class="text-sm text-red-700">{{ erro.message }}</p> } }
      @if (jogadorForm.posicao().invalid() && jogadorForm.posicao().touched()) { @for (erro of jogadorForm.posicao().errors(); track erro.kind) { <p class="text-sm text-red-700">{{ erro.message }}</p> } }
      @if (jogadorForm.clube().invalid() && jogadorForm.clube().touched()) { @for (erro of jogadorForm.clube().errors(); track erro.kind) { <p class="text-sm text-red-700">{{ erro.message }}</p> } }
      @if (erro()) { <p class="rounded bg-red-50 px-3 py-2 text-sm text-red-800" role="alert">{{ erro() }}</p> }
      <div class="flex justify-end gap-3 border-t border-[#e2e8e1] pt-4">
        <button type="button" class="rounded border border-[#cbd6cb] bg-white px-4 py-2 text-sm font-semibold text-[#17241d] hover:bg-[#f3f5f2] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#267045]" (click)="cancelar.emit()">Cancelar</button>
        <p-button type="submit" label="Salvar" [disabled]="servico.salvando()" />
      </div>
    </form>
  `,
})
export class JogadorFormComponent {
  readonly id = input<string>();
  readonly salvo = output<void>();
  readonly cancelar = output<void>();
  readonly servico = inject(JogadorService);
  readonly posicoes = ['GOL', 'ZAG', 'LD', 'LE', 'VOL', 'MEI', 'PD', 'PE', 'ATA'];
  readonly modelo = signal<JogadorFormulario>(this.formularioVazio());
  // As regras ficam próximas do modelo e seus erros são exibidos nos próprios campos.
  readonly jogadorForm = form(this.modelo, (path) => {
    required(path.nome, { message: 'Informe o nome do jogador.' });
    min(path.numeroCamisa, 1, { message: 'A camisa deve ser de 1 a 99.' });
    max(path.numeroCamisa, 99, { message: 'A camisa deve ser de 1 a 99.' });
    required(path.dataNascimento, { message: 'Informe a data de nascimento.' });
    validate(path.dataNascimento, ({ value }) => {
      const data = value();
      if (data === null) return;
      if (Number.isNaN(data.getTime())) {
        return { kind: 'dataInvalida', message: 'Informe uma data válida.' };
      }
      return undefined;
    });
    required(path.posicao, { message: 'Escolha uma posição.' });
    required(path.clube, { message: 'Informe o clube.' });
    pattern(path.clube, /\S/, { message: 'Informe o clube.' });
    pattern(path.nome, /\S/, { message: 'Informe o nome do jogador.' });
  });
  readonly jogadorResource = httpResource<Jogador>(() =>
    this.id() ? `${API_URL}/jogadores/${this.id()}` : undefined,
  );
  readonly erro = signal('');

  constructor() {
    effect(() => {
      const jogador = this.jogadorResource.value();
      if (jogador) this.modelo.set(this.paraFormulario(jogador));
    });
  }

  salvar(event: Event): void {
    event.preventDefault();
    this.erro.set('');
    void submit(this.jogadorForm, {
      action: async () => {
        const dados = this.modelo();
        const jogador = {
          nome: dados.nome.trim(),
          numeroCamisa: dados.numeroCamisa,
          // O input de data usa Date em UTC; a API mantém a data no formato ISO.
          dataNascimento: dados.dataNascimento?.toISOString().slice(0, 10) ?? '',
          posicao: dados.posicao,
          clube: dados.clube.trim(),
        };
        try {
          if (this.id()) {
            await this.servico.atualizar(Number(this.id()), jogador);
          } else {
            await this.servico.criar(jogador);
          }
          this.salvo.emit();
        } catch (erro) {
          this.erro.set(this.servico.erro() || (erro instanceof Error ? erro.message : 'Não foi possível salvar o jogador.'));
        }
      },
    });
  }

  private formularioVazio(): JogadorFormulario {
    return { nome: '', numeroCamisa: 1, dataNascimento: null, posicao: 'ATA', clube: '' };
  }

  private paraFormulario(jogador: Jogador): JogadorFormulario {
    return {
      nome: jogador.nome,
      numeroCamisa: jogador.numeroCamisa,
      dataNascimento: new Date(`${jogador.dataNascimento}T00:00:00.000Z`),
      posicao: jogador.posicao,
      clube: jogador.clube,
    };
  }
}
