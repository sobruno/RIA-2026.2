import { Routes } from '@angular/router';
import { autenticacaoGuard } from './services/auth.guard';

export const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'escalacao' },
  { path: 'login', loadComponent: () => import('./pages/login.component').then((m) => m.LoginComponent) },
  { path: 'escalacao', canActivate: [autenticacaoGuard], loadComponent: () => import('./escala/escala.component').then((m) => m.EscalaComponent) },
  { path: 'jogadores', canActivate: [autenticacaoGuard], loadComponent: () => import('./pages/jogadores.component').then((m) => m.JogadoresComponent) },
  { path: 'jogadores/novo', canActivate: [autenticacaoGuard], loadComponent: () => import('./pages/novo-jogador-rota.component').then((m) => m.NovoJogadorRotaComponent) },
  { path: 'jogadores/:id/editar', canActivate: [autenticacaoGuard], loadComponent: () => import('./pages/jogador-form-page.component').then((m) => m.JogadorFormPageComponent) },
  { path: 'jogadores/:id', canActivate: [autenticacaoGuard], loadComponent: () => import('./pages/jogador-detalhe.component').then((m) => m.JogadorDetalheComponent) },
  { path: '**', loadComponent: () => import('./pages/nao-encontrada.component').then((m) => m.NaoEncontradaComponent) },
];
