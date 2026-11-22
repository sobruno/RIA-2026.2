import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { FormField, form, required, submit } from '@angular/forms/signals';
import { ButtonModule } from '@openng/optimus-ui/button';
import { AuthService } from '../services/auth.service';

interface Credenciais {
  email: string;
  senha: string;
}

@Component({
  standalone: true,
  imports: [FormField, ButtonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <main class="grid min-h-[calc(100vh-64px)] place-items-center px-4 py-10">
      <section class="w-full max-w-md rounded-lg border border-[#dfe6df] bg-white p-6 shadow-sm sm:p-8">
        <p class="text-xs font-bold uppercase tracking-[0.14em] text-[#547060]">Comissão técnica</p>
        <h1 class="mt-2 text-3xl font-bold">Entrar na escalação</h1>
        <p class="mt-2 text-sm text-[#65736a]">Use sua conta para consultar e administrar os jogadores.</p>
        <form class="mt-6 space-y-4" novalidate (submit)="entrar($event)">
          <label class="flex flex-col gap-1.5 text-sm font-semibold">E-mail
            <input class="w-full rounded border border-[#cbd6cb] px-3 py-2" type="email" autocomplete="username" [formField]="loginForm.email" />
          </label>
          @if (loginForm.email().invalid() && loginForm.email().touched()) {
            @for (erro of loginForm.email().errors(); track erro.kind) { <p class="text-sm text-red-700">{{ erro.message }}</p> }
          }
          <label class="flex flex-col gap-1.5 text-sm font-semibold">Senha
            <input class="w-full rounded border border-[#cbd6cb] px-3 py-2" type="password" autocomplete="current-password" [formField]="loginForm.senha" />
          </label>
          @if (loginForm.senha().invalid() && loginForm.senha().touched()) {
            @for (erro of loginForm.senha().errors(); track erro.kind) { <p class="text-sm text-red-700">{{ erro.message }}</p> }
          }
          @if (erro()) { <p role="alert" class="rounded bg-red-50 px-3 py-2 text-sm text-red-800">{{ erro() }}</p> }
          <p-button type="submit" label="Entrar" [disabled]="carregando()" />
        </form>
      </section>
    </main>
  `,
})
export class LoginComponent {
  private readonly auth = inject(AuthService);
  readonly credenciais = signal<Credenciais>({ email: '', senha: '' });
  readonly loginForm = form(this.credenciais, (path) => {
    required(path.email, { message: 'Informe o e-mail.' });
    required(path.senha, { message: 'Informe a senha.' });
  });
  readonly erro = signal('');
  readonly carregando = signal(false);

  entrar(event: Event): void {
    event.preventDefault();
    this.erro.set('');
    void submit(this.loginForm, {
      action: async () => {
        this.carregando.set(true);
        try {
          await this.auth.entrar(this.credenciais().email, this.credenciais().senha);
        } catch {
          this.erro.set('E-mail ou senha inválidos. Verifique também se a API está em execução.');
        } finally {
          this.carregando.set(false);
        }
      },
    });
  }
}
