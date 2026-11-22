import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from './auth.service';

export const autenticacaoGuard: CanActivateFn = () => {
  const auth = inject(AuthService);
  // O initializer cria o token antes da primeira navegação protegida.
  return auth.estaAutenticado() ? true : inject(Router).createUrlTree(['/login']);
};
