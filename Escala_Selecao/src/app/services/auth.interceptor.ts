import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, from, switchMap, throwError } from 'rxjs';
import { AuthService } from './auth.service';

export const authInterceptor: HttpInterceptorFn = (request, next) => {
  const auth = inject(AuthService);
  const token = auth.token();
  const requisicao = token
    ? request.clone({ setHeaders: { Authorization: `Bearer ${token}` } })
    : request;

  return next(requisicao).pipe(
    catchError((erro: unknown) => {
      // 401 no login pode ser senha incorreta; o endpoint convidado não pode renovar a si mesmo.
      const endpointDeAutenticacao = request.url.endsWith('/auth/convidado')
        || request.url.endsWith('/auth/login');
      if (erro instanceof HttpErrorResponse && erro.status === 401 && !endpointDeAutenticacao) {
        // Sessão ausente/expirada: cria outro convidado e volta à escalação.
        return from(auth.renovarSessaoConvidado()).pipe(
          switchMap(() => throwError(() => erro)),
        );
      }
      return throwError(() => erro);
    }),
  );
};
