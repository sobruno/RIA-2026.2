import { computed, Injectable, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { firstValueFrom } from 'rxjs';
import { API_URL } from './api';

interface TokenResponse {
  token: string;
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly http = inject(HttpClient);
  private readonly router = inject(Router);
  // sessionStorage mantém a sessão após recarregar a aba, mas não após fechá-la.
  readonly token = signal<string | null>(sessionStorage.getItem('token'));
  readonly estaAutenticado = computed(() => this.token() !== null);
  private renovacaoEmAndamento: Promise<void> | null = null;

  // O initializer chama este método antes de ativar a rota inicial.
  async inicializar(): Promise<void> {
    if (!this.token()) await this.criarConvidado();
  }

  async entrar(email: string, senha: string): Promise<void> {
    const resposta = await firstValueFrom(
      this.http.post<TokenResponse>(`${API_URL}/auth/login`, { email, senha }),
    );
    this.guardarToken(resposta.token);
    await this.router.navigateByUrl('/escalacao');
  }

  async entrarComoConvidado(): Promise<void> {
    this.descartarToken();
    await this.criarConvidado();
    await this.router.navigateByUrl('/escalacao');
  }

  // Um único token novo atende vários 401 que ocorram ao mesmo tempo.
  renovarSessaoConvidado(): Promise<void> {
    if (this.renovacaoEmAndamento) return this.renovacaoEmAndamento;

    this.descartarToken();
    this.renovacaoEmAndamento = this.criarConvidado()
      .then(async () => {
        await this.router.navigateByUrl('/escalacao');
      })
      .finally(() => {
        this.renovacaoEmAndamento = null;
      });
    return this.renovacaoEmAndamento;
  }

  reiniciarSessao(): Promise<void> {
    // Descartar o token e criar outro também descarta o elenco da sessão atual.
    return this.renovarSessaoConvidado();
  }

  sair(): void {
    this.descartarToken();
    void this.router.navigateByUrl('/login');
  }

  private async criarConvidado(): Promise<void> {
    const resposta = await firstValueFrom(
      this.http.post<TokenResponse>(`${API_URL}/auth/convidado`, {}),
    );
    this.guardarToken(resposta.token);
  }

  private guardarToken(token: string): void {
    sessionStorage.setItem('token', token);
    this.token.set(token);
  }

  private descartarToken(): void {
    sessionStorage.removeItem('token');
    this.token.set(null);
  }
}
