import { computed, Injectable, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { firstValueFrom } from 'rxjs';
import { API_URL } from './api';

interface LoginResponse {
  token: string;
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly http = inject(HttpClient);
  private readonly router = inject(Router);
  readonly token = signal<string | null>(localStorage.getItem('token'));
  readonly estaAutenticado = computed(() => this.token() !== null);

  async entrar(email: string, senha: string): Promise<void> {
    const resposta = await firstValueFrom(
      this.http.post<LoginResponse>(`${API_URL}/auth/login`, { email, senha }),
    );
    localStorage.setItem('token', resposta.token);
    this.token.set(resposta.token);
    await this.router.navigateByUrl('/escalacao');
  }

  sair(): void {
    localStorage.removeItem('token');
    this.token.set(null);
    void this.router.navigateByUrl('/login');
  }
}
